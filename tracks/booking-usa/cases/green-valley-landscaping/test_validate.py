"""TRAINING ONLY — positive, negative and reproducibility tests for this case."""
import contextlib
import copy
import io
import shutil
import tempfile
import unittest
from pathlib import Path

import validate as v


class CaseValidationTests(unittest.TestCase):
    def setUp(self):
        self.data = v.load()

    def document(self, doc_id):
        return next(r for r in self.data["documents/DOCUMENTS.csv"] if r["document_id"] == doc_id)

    def test_full_accounting_audit(self):
        opening, m, summaries, matches = v.audit(self.data)
        self.assertEqual(opening, (4170000, 350000, 3820000))
        self.assertEqual(m, dict(revenue=1800000, expenses=560100, net_income=1239900,
                                ar=650000, ap=154000, checking=1690900, savings=1050000, card=127000,
                                assets=5340900, liabilities=281000, equity=5059900,
                                trial_balance_difference=0, balance_sheet_difference=0))
        self.assertEqual([s["difference"] for s in summaries], [0, 0, 0])
        self.assertEqual(len(matches), 25)
        self.assertEqual(len(self.data["TRANSACTIONS.csv"]), 46)
        self.assertEqual(len(self.data["JOURNAL.csv"]), 102)
        self.assertEqual(len(self.data["documents/DOCUMENTS.csv"]), 61)

    def test_committed_reports_and_educational_keys(self):
        with contextlib.redirect_stdout(io.StringIO()):
            v.run()

    def test_report_writer_is_deterministic_and_does_not_mutate_inputs(self):
        before = copy.deepcopy(self.data)
        self.assertEqual(v.render_reports(self.data), v.render_reports(self.data))
        self.assertEqual(before, self.data)

    def test_write_then_check_and_stale_report_rejection(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp) / "case"
            shutil.copytree(v.ROOT, root, ignore=shutil.ignore_patterns("__pycache__"))
            before = {name: (root / name).read_bytes() for name in v.INPUTS}
            with contextlib.redirect_stdout(io.StringIO()):
                v.run(root, write=True)
                first = {n: (root / n).read_bytes() for n in v.render_reports(self.data)}
                v.run(root, write=True)
                self.assertEqual(first, {n: (root / n).read_bytes() for n in first})
                v.run(root)
            self.assertEqual(before, {name: (root / name).read_bytes() for name in v.INPUTS})
            pnl = root / "PNL.csv"
            pnl.write_bytes(pnl.read_bytes() + b"\n")
            with self.assertRaisesRegex(ValueError, "REPRODUCIBILITY: stale/missing PNL"):
                v.run(root)

    def test_all_five_wrong_ledgers_fail_and_corrections_restore(self):
        self.assertEqual(v.mistake_controls(self.data), 5)
        for scenario in ("M01", "M02", "M03", "M04", "M05"):
            with self.subTest(scenario=scenario):
                bad = v.apply_patches(self.data, scenario)
                v.journal_balance(bad)
                self.assertEqual(v.metrics(self.data, bad)["trial_balance_difference"], 0)
                self.assertEqual(v.metrics(self.data, bad)["balance_sheet_difference"], 0)
                with self.assertRaisesRegex(ValueError, "SOURCE_POSTINGS:"):
                    v.primary_postings(self.data, bad)
                with self.assertRaisesRegex(ValueError, "BANK_MATCH:"):
                    v.bank_control(self.data, bad)

    def test_duplicate_event_id(self):
        self.data["TRANSACTIONS.csv"].append(copy.deepcopy(self.data["TRANSACTIONS.csv"][0]))
        with self.assertRaisesRegex(ValueError, "UNIQUE: transaction_id"):
            v.integrity(self.data)

    def test_duplicate_invoice_id(self):
        self.data["documents/DOCUMENTS.csv"].append(copy.deepcopy(self.document("INV-01")))
        with self.assertRaisesRegex(ValueError, "UNIQUE: document_id"):
            v.integrity(self.data)

    def test_missing_primary_document(self):
        self.data["TRANSACTIONS.csv"][0]["source_document_id"] = "MISSING-DOC"
        with self.assertRaisesRegex(ValueError, "REFERENCES: event document"):
            v.integrity(self.data)

    def test_missing_related_document(self):
        self.document("RCPT-02")["applies_to_document_id"] = "MISSING-INVOICE"
        with self.assertRaisesRegex(ValueError, "REFERENCES: related document"):
            v.integrity(self.data)

    def test_nonexistent_account(self):
        self.data["JOURNAL.csv"][0]["account_code"] = "9999"
        with self.assertRaisesRegex(ValueError, "REFERENCES: journal account"):
            v.integrity(self.data)

    def test_unbalanced_entry(self):
        self.data["JOURNAL.csv"][0]["debit_cents"] = "1200001"
        with self.assertRaisesRegex(ValueError, "JOURNAL_BALANCE:"):
            v.journal_balance(self.data["JOURNAL.csv"])

    def test_float_or_fractional_cents_rejected(self):
        for value in ("185.75", "0.1", "1e2", "NaN"):
            with self.subTest(value=value), self.assertRaisesRegex(ValueError, "MONEY:"):
                v.cents(value)

    def test_document_quantity_times_price(self):
        self.document("CC-01")["total_cents"] = "45051"
        with self.assertRaisesRegex(ValueError, "DOCUMENT_ARITHMETIC: CC-01"):
            v.integrity(self.data)

    def test_currency_isolation(self):
        self.data["JOURNAL.csv"][0]["currency"] = "KZT"
        with self.assertRaisesRegex(ValueError, "METADATA:"):
            v.integrity(self.data)

    def test_accrual_basis_is_explicit_in_journal(self):
        self.data["JOURNAL.csv"][0]["accounting_basis"] = "Cash"
        with self.assertRaisesRegex(ValueError, "REPORTING_BASIS:"):
            v.integrity(self.data)

    def test_missing_training_label(self):
        self.document("INV-01")["training_label"] = ""
        with self.assertRaisesRegex(ValueError, "METADATA:"):
            v.integrity(self.data)

    def test_out_of_period_journal_event(self):
        self.data["TRANSACTIONS.csv"][1]["transaction_date"] = "2026-10-01"
        with self.assertRaisesRegex(ValueError, "DATES: event"):
            v.integrity(self.data)

    def test_accrual_completion_evidence(self):
        self.document("INV-02")["service_end"] = "2026-09-06"
        with self.assertRaisesRegex(ValueError, "ACCRUAL:"):
            v.integrity(self.data)

    def test_net_15_due_dates(self):
        self.document("INV-02")["due_date"] = "2026-09-24"
        with self.assertRaisesRegex(ValueError, "TERMS:"):
            v.integrity(self.data)

    def test_wrong_customer_allocation(self):
        self.document("RCPT-02")["counterparty_id"] = "TRAIN-CUST-01"
        with self.assertRaisesRegex(ValueError, "ALLOCATION:"):
            v.integrity(self.data)

    def test_expense_classification(self):
        self.document("BILL-01")["account_code"] = "4000"
        with self.assertRaisesRegex(ValueError, "CLASSIFICATION: expense"):
            v.integrity(self.data)

    def test_card_must_settle_to_liability_not_cash(self):
        self.document("CC-01")["settlement_account_code"] = "1000"
        with self.assertRaisesRegex(ValueError, "CLASSIFICATION: settlement"):
            v.integrity(self.data)

    def test_direct_posting_to_retained_earnings_is_prohibited(self):
        row = next(r for r in self.data["JOURNAL.csv"] if r["transaction_id"] == "GVL-ADJ-INS" and r["account_code"] == "6300")
        row["account_code"] = "3100"
        with self.assertRaisesRegex(ValueError, "DIRECT_POSTING:"):
            v.integrity(self.data)

    def test_opening_equity_is_not_a_residual_plug(self):
        row = next(r for r in self.data["documents/opening-history.csv"] if r["metric_id"] == "materials")
        row["amount_cents"] = "1800100"
        with self.assertRaisesRegex(ValueError, "OPENING_EQUITY:"):
            v.opening_controls(self.data)

    def test_twelve_current_invoices_not_counting_opening(self):
        self.data["documents/DOCUMENTS.csv"].remove(self.document("INV-12"))
        with self.assertRaisesRegex(ValueError, "INVOICE_COUNT:"):
            v.revenue_control(self.data)

    def test_partial_invoice_cannot_be_closed_in_full(self):
        bad = v.apply_patches(self.data, "M05")
        with self.assertRaisesRegex(ValueError, "AR_CONTROL:"):
            v.subledger_control(self.data, "1100", bad)

    def test_ap_payment_needs_correct_bill_reference(self):
        row = next(r for r in self.data["JOURNAL.csv"] if r["transaction_id"] == "GVL-VPAY-01" and r["account_code"] == "2000")
        row["open_item_id"] = "BILL-03"
        with self.assertRaisesRegex(ValueError, "AP_CONTROL:"):
            v.subledger_control(self.data, "2000")

    def test_same_balance_does_not_validate_wrong_matching(self):
        rows = self.data["statements/operating-checking.csv"]
        a = next(r for r in rows if r["transaction_id"] == "GVL-RCPT-OPEN")
        b = next(r for r in rows if r["transaction_id"] == "GVL-RCPT-04")
        self.assertEqual(a["deposit_cents"], b["deposit_cents"])
        a["transaction_id"], b["transaction_id"] = b["transaction_id"], a["transaction_id"]
        # Opening, all amounts and closing are unchanged; references are wrong.
        with self.assertRaisesRegex(ValueError, "BANK_MATCH:"):
            v.bank_control(self.data)

    def test_duplicate_bank_match_rejected(self):
        rows = self.data["statements/operating-checking.csv"]
        extra = dict(rows[0], line_id="ST-OPERATING-EXTRA")
        rows.append(extra)
        with self.assertRaisesRegex(ValueError, "BANK_MATCH:"):
            v.bank_control(self.data)

    def test_statement_arithmetic_recomputed(self):
        for r in self.data["statements/operating-checking.csv"]:
            r["closing_balance_cents"] = "1580901"
        with self.assertRaisesRegex(ValueError, "STATEMENT_ARITHMETIC:"):
            v.bank_control(self.data)

    def test_card_charge_and_payment_sign(self):
        row = self.data["statements/credit-card.csv"][0]
        row["charge_cents"], row["credit_cents"] = "0", row["charge_cents"]
        with self.assertRaisesRegex(ValueError, "BANK_MATCH:"):
            v.bank_control(self.data)

    def test_missing_timing_evidence(self):
        self.data["OUTSTANDING_ITEMS.csv"].pop()
        with self.assertRaisesRegex(ValueError, "TIMING:"):
            v.bank_control(self.data)

    def test_timing_amount_not_an_unexplained_balancing_number(self):
        self.data["OUTSTANDING_ITEMS.csv"][0]["amount_cents"] = "150001"
        with self.assertRaisesRegex(ValueError, "TIMING: direction/amount"):
            v.bank_control(self.data)

    def test_subsequent_clearing_confirmation_date(self):
        self.document("CONF-RCPT-09")["document_date"] = "2026-10-03"
        with self.assertRaisesRegex(ValueError, "TIMING: confirmation"):
            v.bank_control(self.data)

    def test_monthly_prepaid_release_must_follow_coverage(self):
        # A self-consistent but wrong expense/book/source amount still must fail policy.
        doc = self.document("ADJ-INS")
        doc["total_cents"] = doc["unit_price_cents"] = "30100"
        for r in self.data["JOURNAL.csv"]:
            if r["transaction_id"] == "GVL-ADJ-INS":
                if r["debit_cents"] != "0":
                    r["debit_cents"] = "30100"
                else:
                    r["credit_cents"] = "30100"
        t = next(r for r in self.data["TRANSACTIONS.csv"] if r["transaction_id"] == "GVL-ADJ-INS")
        t["expected_normal_balance_effect_cents"] = "6300:+30100|1300:-30100"
        with self.assertRaisesRegex(ValueError, "ADJUSTMENTS:"):
            v.audit(self.data)

    def test_aging_uses_due_date_and_preserves_partial_balances(self):
        ar = {r["document_id"]: r for r in v.aging(self.data, "1100")}
        self.assertEqual(ar["INV-02"]["days_past_due"], 7)
        self.assertEqual(ar["INV-02"]["days_1_30_cents"], 100000)
        self.assertEqual(ar["INV-OPEN-02"]["days_past_due"], 46)
        self.assertEqual(ar["INV-OPEN-02"]["days_31_60_cents"], 100000)
        self.assertEqual(sum(r["current_cents"] for r in ar.values()), 450000)
        self.document("INV-06")["due_date"] = v.END
        due_today = next(r for r in v.aging(self.data, "1100") if r["document_id"] == "INV-06")
        self.assertEqual(due_today["current_cents"], 80000)
        self.document("INV-06")["due_date"] = "2026-09-29"
        overdue = next(r for r in v.aging(self.data, "1100") if r["document_id"] == "INV-06")
        self.assertEqual(overdue["days_1_30_cents"], 80000)


if __name__ == "__main__":
    unittest.main()
