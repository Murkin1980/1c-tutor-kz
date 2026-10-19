#!/usr/bin/env python3
"""TRAINING ONLY. Case-specific fixture checks/report writer; standard library only.

JOURNAL.csv is read-only here. --write changes derived reports, never source data.
Run from any directory: python3 /path/to/validate.py [--check | --write].
"""
import argparse
import copy
import csv
import hashlib
import io
import re
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VERSION = "GVL-2026-09-v1.0.0"
START, END = "2026-09-01", "2026-09-30"
META = dict(training_label="TRAINING ONLY", dataset_version=VERSION, currency="USD")
INPUTS = (
    "CHART_OF_ACCOUNTS.csv", "TRANSACTIONS.csv", "JOURNAL.csv",
    "documents/DOCUMENTS.csv", "documents/opening-history.csv", "OUTSTANDING_ITEMS.csv",
    "statements/operating-checking.csv", "statements/savings.csv", "statements/credit-card.csv",
    "mistakes/SCENARIOS.csv", "mistakes/JOURNAL_PATCHES.csv", "mistakes/CORRECTIONS.csv",
)
BANK_FILES = {"1000": INPUTS[6], "1010": INPUTS[7], "2100": INPUTS[8]}


def need(condition, message):
    if not condition:
        raise ValueError(message)


def cents(value):
    need(bool(re.fullmatch(r"[+-]?\d+", str(value))), f"MONEY: integer cents required: {value!r}")
    return int(value)


def delta(row):
    return cents(row["debit_cents"]) - cents(row["credit_cents"])


def load(root=ROOT):
    data = {}
    for name in INPUTS:
        with (root / name).open(encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            rows = list(reader)
        need(rows and all(None not in r and None not in r.values() for r in rows), f"CSV: {name}")
        data[name] = rows
    return data


def index(rows, key):
    result = {r[key]: r for r in rows}
    need(len(result) == len(rows) and all(result), f"UNIQUE: {key}")
    return result


def postings(transaction):
    text = transaction["bank_posting_dates"]
    pairs = [p.split("=") for p in text.split("|")] if text else []
    need(all(len(p) == 2 for p in pairs), "POSTING_DATES: malformed mapping")
    result = dict(pairs)
    need(len(result) == len(pairs), "POSTING_DATES: duplicate account")
    return result


def accounts(data):
    return index(data["CHART_OF_ACCOUNTS.csv"], "account_code")


def transactions(data):
    return index(data["TRANSACTIONS.csv"], "transaction_id")


def documents(data):
    return index(data["documents/DOCUMENTS.csv"], "document_id")


def balances(journal, opening_only=False):
    result = defaultdict(int)
    for r in journal:
        if not opening_only or r["entry_kind"] == "opening":
            result[r["account_code"]] += delta(r)
    return result


def journal_balance(journal):
    index(journal, "line_id")
    groups = defaultdict(list)
    for r in journal:
        dr, cr = cents(r["debit_cents"]), cents(r["credit_cents"])
        need(dr >= 0 and cr >= 0 and (dr > 0) != (cr > 0), "JOURNAL: one positive side per line")
        groups[r["entry_id"]].append(r)
    for entry, rows in groups.items():
        need(len(rows) >= 2 and sum(map(delta, rows)) == 0, f"JOURNAL_BALANCE: {entry}")
        need(len({(r['transaction_id'], r['transaction_date'], r['entry_kind']) for r in rows}) == 1,
             f"JOURNAL_ENTRY: mixed event/date/kind {entry}")


def integrity(data):
    coa, txs, docs = accounts(data), transactions(data), documents(data)
    for name, rows in data.items():
        for r in rows:
            need(all(r.get(k) == v for k, v in META.items()), f"METADATA: {name}")
            for k, v in r.items():
                if k.endswith("_cents") and v and k != "expected_normal_balance_effect_cents":
                    cents(v)
            # Structured dates must be ISO; coverage/due dates are not journal dates.
            for k, v in r.items():
                if v and (k.endswith("_date") or k in {"period_start", "period_end", "service_start", "service_end"}):
                    date.fromisoformat(v)
    types = {"Asset": "Debit", "Contra Asset": "Credit", "Liability": "Credit",
             "Equity": "Credit", "Income": "Credit", "Expense": "Debit"}
    for r in coa.values():
        need(types.get(r["account_type"]) == r["normal_balance"], "COA: normal balance")
        need(r["name_en"] and r["explanation_ru"] and r["direct_posting_policy"], "COA: description/policy")
    need({"1000", "1010", "1100", "1300", "1500", "1590", "2000", "2100", "3000", "3100",
          "4000", "4100", "6000", "6100", "6200", "6300", "6400", "6500", "6600", "6800"} == set(coa), "COA: case accounts")
    for tx, t in txs.items():
        need(START <= t["transaction_date"] <= END, f"DATES: event {tx}")
        need(t["source_document_id"] in docs, f"REFERENCES: event document {tx}")
        d = docs[t["source_document_id"]]
        need(d["transaction_id"] == tx and d["document_date"] == t["document_date"], f"REFERENCES: primary document {tx}")
        need(t["category"] == d["document_type"].replace("opening_summary", "opening"), f"CATEGORY: {tx}")
        need(t["description_en"] and t["explanation_ru"] and t["learning_objective_ru"], f"TEACHING: {tx}")
        for acc, pd in postings(t).items():
            need(acc in BANK_FILES and t["transaction_date"] <= pd <= "2026-10-05", f"POSTING_DATES: {tx}")
    for d in docs.values():
        need(d["transaction_id"] in txs, f"REFERENCES: document event {d['document_id']}")
        need(bool(re.fullmatch(r"TRAIN-[A-Z0-9-]+", d["counterparty_id"])), "SYNTHETIC: counterparty ID")
        need(d["description_en"] and d["explanation_ru"], "DOCUMENT: bilingual description")
        for k in ("account_code", "settlement_account_code"):
            need(not d[k] or d[k] in coa, f"REFERENCES: document account {d['document_id']}")
        need(not d["applies_to_document_id"] or d["applies_to_document_id"] in docs, "REFERENCES: related document")
        qty, rate, total = cents(d["quantity"]), cents(d["unit_price_cents"]), cents(d["total_cents"])
        need(qty > 0 and rate > 0 and qty * rate == total, f"DOCUMENT_ARITHMETIC: {d['document_id']}")
        kind = d["document_type"]
        if kind.startswith("opening_"):
            need("2025-09-01" <= d["document_date"] <= "2026-08-31", "DATES: opening evidence")
        elif kind == "clearing_confirmation":
            need(END < d["document_date"] <= "2026-10-05", "DATES: subsequent evidence")
        else:
            need(START <= d["document_date"] <= END, "DATES: September document")
        if d["service_start"]:
            need(d["service_start"] <= d["service_end"], "DATES: service coverage")
        if kind == "customer_invoice":
            need(d["account_code"] in {"4000", "4100"}, "CLASSIFICATION: service revenue")
            need(START <= d["service_start"] <= d["service_end"] == txs[d['transaction_id']]["transaction_date"] <= END,
                 "ACCRUAL: invoice completion date")
        if kind in {"vendor_bill", "cash_expense", "card_purchase", "bank_fee", "prepaid_release", "depreciation"}:
            need(coa[d["account_code"]]["account_type"] == "Expense", "CLASSIFICATION: expense account")
        fixed_pairs = {"prepaid_purchase": ("1300", "1000"), "card_payment": ("2100", "1000"),
                       "bank_transfer": ("1010", "1000"), "bank_fee": ("6500", "1000"),
                       "depreciation": ("6800", "1590")}
        if kind in fixed_pairs:
            need((d["account_code"], d["settlement_account_code"]) == fixed_pairs[kind], "CLASSIFICATION: asset/liability/transfer")
        if kind in {"card_purchase", "cash_expense", "prepaid_release"}:
            need(d["settlement_account_code"] == {"card_purchase": "2100", "cash_expense": "1000", "prepaid_release": "1300"}[kind], "CLASSIFICATION: settlement account")
        if kind in {"customer_invoice", "opening_invoice", "vendor_bill", "opening_bill"}:
            need((date.fromisoformat(d["due_date"]) - date.fromisoformat(d["document_date"])).days == 15, "TERMS: net 15")
        if kind in {"customer_receipt", "vendor_payment"}:
            applied = docs[d["applies_to_document_id"]]
            allowed = {"customer_invoice", "opening_invoice"} if kind == "customer_receipt" else {"vendor_bill", "opening_bill"}
            need(applied["document_type"] in allowed and applied["counterparty_id"] == d["counterparty_id"], "ALLOCATION: party/document")
            need(applied["document_date"] <= d["document_date"], "DATES: payment precedes document")
    journal = data["JOURNAL.csv"]
    journal_balance(journal)
    need({r["transaction_id"] for r in journal} == set(txs), "REFERENCES: journal event set")
    for r in journal:
        t = txs[r["transaction_id"]]
        need(r["accounting_basis"] == "Accrual" and r["period_start"] == START and r["period_end"] == END, "REPORTING_BASIS: journal period/basis")
        need(r["account_code"] in coa, "REFERENCES: journal account")
        need(r["document_id"] == t["source_document_id"] and r["entry_id"] == t["journal_entry_id"], "REFERENCES: journal source/entry")
        need(r["transaction_date"] == t["transaction_date"], "DATES: journal event date")
        expected_kind = "opening" if t["category"] == "opening" else "adjusting" if t["category"] in {"prepaid_release", "depreciation"} else "regular"
        need(r["entry_kind"] == expected_kind, "JOURNAL: entry kind")
        need(not r["open_item_id"] or r["open_item_id"] in docs, "REFERENCES: open item")
        policy = coa[r["account_code"]]["direct_posting_policy"]
        allowed_categories = {"opening_only": {"opening"}, "supported_capital_only": {"opening"},
                              "invoice_only": {"customer_invoice"}, "adjustment_only": {"depreciation"},
                              "adjustment_or_opening_only": {"opening", "depreciation"}}
        need(policy not in allowed_categories or t["category"] in allowed_categories[policy], "DIRECT_POSTING: restricted account")
        if policy == "subledger_only":
            need(bool(r["open_item_id"]), "DIRECT_POSTING: invoice/bill reference required")
    scenarios = index(data["mistakes/SCENARIOS.csv"], "scenario_id")
    for name in ("mistakes/JOURNAL_PATCHES.csv", "mistakes/CORRECTIONS.csv"):
        need({r["scenario_id"] for r in data[name]} == set(scenarios), "MISTAKE: scenario references")
    for s in scenarios.values():
        need(s["original_transaction_id"] in txs and s["term_en"] and s["explanation_ru"], "MISTAKE: original event/teaching")
    index(data["mistakes/CORRECTIONS.csv"], "line_id")
    for r in data["mistakes/CORRECTIONS.csv"]:
        need(r["account_code"] in coa and r["document_id"] in docs and r["transaction_id"] in txs,
             "MISTAKE: correction account/document/event")
        need(r["transaction_date"] == END and (not r["open_item_id"] or r["open_item_id"] in docs), "MISTAKE: correction cutoff/open item")
    for tx, t in txs.items():
        effect = defaultdict(int)
        for r in journal:
            if r["transaction_id"] == tx:
                effect[r["account_code"]] += delta(r) * (1 if coa[r["account_code"]]["normal_balance"] == "Debit" else -1)
        given = dict(p.split(":") for p in t["expected_normal_balance_effect_cents"].split("|"))
        need(dict(effect) == {a: cents(v) for a, v in given.items()}, f"BALANCE_EFFECT: {tx}")


def primary_postings(data, journal=None):
    """Independent document-to-posting signatures, not a second ledger/report source."""
    journal = data["JOURNAL.csv"] if journal is None else journal
    docs, txs = documents(data), transactions(data)
    need({r["transaction_id"] for r in journal} == set(txs), "SOURCE_POSTINGS: missing/extra event")
    for tx, t in txs.items():
        d = docs[t["source_document_id"]]
        amount, kind = cents(d["total_cents"]), t["category"]
        item = d["applies_to_document_id"]
        if kind == "opening":
            expected = []
            for od in docs.values():
                if not od["document_type"].startswith("opening_") or od["document_type"] == "opening_summary":
                    continue
                acc, n = od["account_code"], cents(od["total_cents"])
                is_debit = accounts(data)[acc]["normal_balance"] == "Debit"
                expected.append((acc, n if is_debit else 0, 0 if is_debit else n,
                                 od["document_id"] if acc in {"1100", "2000"} else ""))
        elif kind == "customer_invoice":
            expected = [("1100", amount, 0, d["document_id"]), (d["account_code"], 0, amount, d["document_id"])]
        elif kind == "customer_receipt":
            expected = [("1000", amount, 0, item), ("1100", 0, amount, item)]
        elif kind == "vendor_bill":
            expected = [(d["account_code"], amount, 0, d["document_id"]), ("2000", 0, amount, d["document_id"])]
        elif kind == "vendor_payment":
            expected = [("2000", amount, 0, item), ("1000", 0, amount, item)]
        else:
            need(kind in {"prepaid_purchase", "cash_expense", "card_purchase", "card_payment", "bank_transfer", "bank_fee", "prepaid_release", "depreciation"}, "SOURCE_POSTINGS: unknown category")
            expected = [(d["account_code"], amount, 0, ""), (d["settlement_account_code"], 0, amount, "")]
        actual = [(r["account_code"], cents(r["debit_cents"]), cents(r["credit_cents"]), r["open_item_id"]) for r in journal if r["transaction_id"] == tx]
        need(Counter(actual) == Counter(expected), f"SOURCE_POSTINGS: {tx}")


def opening_controls(data):
    journal, docs = data["JOURNAL.csv"], documents(data)
    b = balances(journal, True)
    historical = index(data["documents/opening-history.csv"], "metric_id")
    need(set(historical) == {"member_contributions", "revenue", "materials", "fuel", "vehicle", "insurance", "software",
                            "bank_charges", "office", "depreciation", "customer_cash_receipts", "expense_cash_payments",
                            "equipment_cash_purchase", "insurance_original_premium"}, "OPENING: historical metrics")
    h = {k: cents(r["amount_cents"]) for k, r in historical.items()}
    for r in data["documents/opening-history.csv"]:
        need(r["document_id"] in docs and r["transaction_id"] == "GVL-OPEN" and r["period_start"] == "2025-09-01" and r["period_end"] == "2026-08-31", "OPENING: historical evidence")
    expense_keys = ("materials", "fuel", "vehicle", "insurance", "software", "bank_charges", "office", "depreciation")
    expenses = sum(h[k] for k in expense_keys)
    need(b["3000"] == -h["member_contributions"] and b["3100"] == -(h["revenue"] - expenses), "OPENING_EQUITY: historical bridge")
    need(b["1100"] == h["revenue"] - h["customer_cash_receipts"], "OPENING_AR: historical bridge")
    need(h["expense_cash_payments"] == expenses - h["depreciation"] + b["1300"] + b["2000"] + b["2100"], "OPENING_EXPENSES: accrual/cash bridge")
    need(b["1000"] + b["1010"] == h["member_contributions"] + h["customer_cash_receipts"] - h["expense_cash_payments"] - h["equipment_cash_purchase"], "OPENING_CASH: historical bridge")
    need(b["1500"] == h["equipment_cash_purchase"] and -b["1590"] == h["depreciation"] == b["1500"] // 48 * 12, "OPENING_EQUIPMENT: depreciation")
    need(b["1300"] == h["insurance_original_premium"] - h["insurance"], "OPENING_PREPAID: insurance")
    need(sum(b.values()) == 0, "OPENING_BALANCE: debit/credit difference")
    need(sum(cents(r["debit_cents"]) for r in journal if r["entry_kind"] == "opening") == cents(docs["DOC-OPEN"]["total_cents"]), "OPENING: packet total")
    coa = accounts(data)
    assets = sum(v for a, v in b.items() if coa[a]["account_type"] in {"Asset", "Contra Asset"})
    liabilities = -sum(v for a, v in b.items() if coa[a]["account_type"] == "Liability")
    equity = -sum(v for a, v in b.items() if coa[a]["account_type"] == "Equity")
    need(assets == liabilities + equity, "OPENING_EQUATION: assets/liabilities/equity")
    return assets, liabilities, equity


def metrics(data, journal=None):
    journal = data["JOURNAL.csv"] if journal is None else journal
    coa, b = accounts(data), balances(journal)
    period = balances([r for r in journal if r["entry_kind"] != "opening"])
    revenue = -sum(v for a, v in period.items() if coa[a]["account_type"] == "Income")
    expenses = sum(v for a, v in period.items() if coa[a]["account_type"] == "Expense")
    assets = sum(v for a, v in b.items() if coa[a]["account_type"] in {"Asset", "Contra Asset"})
    liabilities = -sum(v for a, v in b.items() if coa[a]["account_type"] == "Liability")
    equity = -sum(v for a, v in b.items() if coa[a]["account_type"] == "Equity") + revenue - expenses
    return dict(revenue=revenue, expenses=expenses, net_income=revenue-expenses, ar=b["1100"], ap=-b["2000"],
                checking=b["1000"], savings=b["1010"], card=-b["2100"], assets=assets, liabilities=liabilities,
                equity=equity, trial_balance_difference=sum(b.values()), balance_sheet_difference=assets-liabilities-equity)


def revenue_control(data, journal=None):
    invoices = [d for d in documents(data).values() if d["document_type"] == "customer_invoice"]
    need(len(invoices) == 12 and len({d['document_id'] for d in invoices}) == 12, "INVOICE_COUNT: exactly twelve")
    need(sum(cents(d["total_cents"]) for d in invoices) == metrics(data, journal)["revenue"] == 1800000, "REVENUE: September target/source agreement")


def subledger_control(data, account, journal=None):
    journal = data["JOURNAL.csv"] if journal is None else journal
    docs = documents(data)
    kind, pay, metric = ("invoice", "customer_receipt", "ar") if account == "1100" else ("bill", "vendor_payment", "ap")
    invoice_types = {f"opening_{kind}", "customer_invoice" if kind == "invoice" else "vendor_bill"}
    expected = {d["document_id"]: cents(d["total_cents"]) for d in docs.values() if d["document_type"] in invoice_types}
    for d in docs.values():
        if d["document_type"] == pay:
            expected[d["applies_to_document_id"]] -= cents(d["total_cents"])
    actual = defaultdict(int)
    for r in journal:
        if r["account_code"] == account:
            need(r["open_item_id"] in expected, f"{metric.upper()}_CONTROL: unallocated entry")
            actual[r["open_item_id"]] += delta(r) * (1 if account == "1100" else -1)
    need(all(n >= 0 for n in expected.values()) and dict(actual) == expected, f"{metric.upper()}_CONTROL: per-document rollforward")
    need(sum(expected.values()) == metrics(data, journal)[metric], f"{metric.upper()}_CONTROL: closing control account")


def bank_control(data, journal=None):
    journal = data["JOURNAL.csv"] if journal is None else journal
    txs, docs, b, op = transactions(data), documents(data), balances(journal), balances(journal, True)
    legs = defaultdict(list)
    for r in journal:
        if r["account_code"] in BANK_FILES and r["entry_kind"] != "opening":
            legs[(r["transaction_id"], r["account_code"])].append(r)
    planned = {(tx, a): pd for tx, t in txs.items() for a, pd in postings(t).items()}
    need(set(legs) == set(planned) and all(len(v) == 1 for v in legs.values()), "BANK_MATCH: journal legs/unique matching")
    outstanding = {(r['transaction_id'], r['account_code']): r for r in data["OUTSTANDING_ITEMS.csv"]}
    need(len(outstanding) == len(data["OUTSTANDING_ITEMS.csv"]), "TIMING: duplicate outstanding item")
    need(set(outstanding) == {key for key, pd in planned.items() if pd > END}, "TIMING: missing/extra documentation")
    summaries, matches, seen = [], [], set()
    for acc, file in BANK_FILES.items():
        rows = data[file]
        first = rows[0]
        inc_key, dec_key = ("charge_cents", "credit_cents") if acc == "2100" else ("deposit_cents", "withdrawal_cents")
        sign = -1 if acc == "2100" else 1
        for key in ("statement_id", "account_code", "period_start", "period_end", "opening_balance_cents", "closing_balance_cents"):
            need(len({r[key] for r in rows}) == 1, "STATEMENT: inconsistent header")
        need(first["account_code"] == acc and first["period_start"] == START and first["period_end"] == END, "STATEMENT: account/period")
        need(cents(first["opening_balance_cents"]) == op[acc] * sign, "STATEMENT: opening balance")
        index(rows, "line_id")
        for r in rows:
            key = (r["transaction_id"], acc)
            need(key not in seen and key in legs and START <= r["posting_date"] <= END, "BANK_MATCH: duplicate/unknown/out-of-period line")
            seen.add(key)
            inc, dec = cents(r[inc_key]), cents(r[dec_key])
            need(inc >= 0 and dec >= 0 and (inc > 0) != (dec > 0), "STATEMENT: direction")
            leg = legs[key][0]
            need(inc-dec == delta(leg)*sign and r["posting_date"] == planned[key] and r["document_id"] == leg["document_id"], f"BANK_MATCH: amount/date/document {r['line_id']}")
            matches.append((acc, r["line_id"], leg["line_id"], r["transaction_id"], r["document_id"], r["posting_date"], inc-dec))
        inc, dec = sum(cents(r[inc_key]) for r in rows), sum(cents(r[dec_key]) for r in rows)
        close = cents(first["closing_balance_cents"])
        need(cents(first["opening_balance_cents"]) + inc - dec == close, "STATEMENT_ARITHMETIC: opening + increases - decreases")
        timing = 0
        for key, item in outstanding.items():
            if key[1] != acc:
                continue
            leg = legs[key][0]
            signed = delta(leg)*sign
            expected_type = "unposted_card_charge" if acc == "2100" else "deposit_in_transit" if signed > 0 else "outstanding_check"
            need(item["timing_type"] == expected_type and cents(item["amount_cents"]) == abs(signed), "TIMING: direction/amount")
            need(item["book_date"] == leg["transaction_date"] and item["subsequent_posting_date"] == planned[key] > END, "TIMING: cutoff")
            need(item["source_document_id"] == leg["document_id"] and item["confirmation_document_id"] in docs, "TIMING: source/evidence")
            evidence = docs[item["confirmation_document_id"]]
            need(evidence["document_type"] == "clearing_confirmation" and evidence["transaction_id"] == key[0] and evidence["document_date"] == planned[key]
                 and evidence["applies_to_document_id"] == leg["document_id"] and cents(evidence["total_cents"]) == abs(signed), "TIMING: confirmation")
            timing += signed
        book = b[acc]*sign
        need(close + timing == book, f"BANK_RECONCILIATION: {acc}")
        summaries.append(dict(account=acc, opening=op[acc]*sign, increases=inc, decreases=dec, statement_close=close,
                              timing=timing, adjusted_bank=close+timing, book=book, difference=close+timing-book, matched=len(rows)))
    need(seen == {key for key, pd in planned.items() if pd <= END}, "BANK_MATCH: incomplete line coverage")
    return summaries, matches


def apply_patches(data, scenario):
    journal = copy.deepcopy(data["JOURNAL.csv"])
    for p in data["mistakes/JOURNAL_PATCHES.csv"]:
        if p["scenario_id"] != scenario:
            continue
        if p["action"] == "add":
            r = dict(data["JOURNAL.csv"][0], line_id=p["target_line_id"], entry_kind="regular")
            r.update({k: value for k, value in p.items() if k in r and k not in META})
            journal.append(r)
        else:
            targets = [r for r in journal if r["line_id"] == p["target_line_id"]]
            need(len(targets) == 1, "MISTAKE: patch target")
            if p["action"] == "remove":
                journal.remove(targets[0])
            else:
                need(p["action"] == "replace", "MISTAKE: patch action")
                targets[0].update({k: v for k, v in p.items() if k in targets[0] and v != ""})
    return journal


def mistake_controls(data):
    scenarios = index(data["mistakes/SCENARIOS.csv"], "scenario_id")
    need(set(scenarios) == {"M01", "M02", "M03", "M04", "M05"}, "MISTAKE: five scenarios")
    base = metrics(data)
    checks = {"SOURCE_POSTINGS": primary_postings, "BANK_MATCH": bank_control, "REVENUE": revenue_control,
              "AR_CONTROL": lambda d, j: subledger_control(d, "1100", j)}
    for sid, s in scenarios.items():
        bad = apply_patches(data, sid)
        journal_balance(bad)  # Intentionally wrong entries still balance.
        actual = metrics(data, bad)
        for key in ("revenue", "expenses", "net_income", "ar", "ap", "checking", "savings", "card"):
            need(actual[key]-base[key] == cents(s[f"{key}_delta_cents"]), f"MISTAKE_EFFECT: {sid}/{key}")
        for rule in s["expected_failed_controls"].split("|"):
            try:
                checks[rule](data, bad)
            except ValueError as exc:
                need(str(exc).startswith(rule + ":"), f"MISTAKE_RULE: {sid}: {exc}")
            else:
                raise ValueError(f"MISTAKE_RULE: {sid}/{rule} did not reject wrong ledger")
        fixes = [{k: v for k, v in r.items() if k != "scenario_id"} for r in data["mistakes/CORRECTIONS.csv"] if r["scenario_id"] == sid]
        need(len(fixes) == 2 and all(r["entry_id"] == s["correction_entry_id"] for r in fixes), "MISTAKE: correction entry")
        journal_balance(bad + fixes)
        need(dict(balances(bad+fixes)) == dict(balances(data["JOURNAL.csv"])), f"MISTAKE_FIX: {sid} account balances")
        subledger_control(data, "1100", bad+fixes)
        subledger_control(data, "2000", bad+fixes)
    return len(scenarios)


def audit(data):
    integrity(data)
    primary_postings(data)
    opening = opening_controls(data)
    revenue_control(data)
    subledger_control(data, "1100")
    subledger_control(data, "2000")
    summaries, matches = bank_control(data)
    m = metrics(data)
    need(m["trial_balance_difference"] == m["balance_sheet_difference"] == 0, "FINANCIAL_STATEMENTS: equations")
    docs = documents(data)
    expected_expenses = sum(cents(d["total_cents"]) for d in docs.values() if d["document_type"] in {"vendor_bill", "cash_expense", "card_purchase", "bank_fee", "prepaid_release", "depreciation"})
    need(m["expenses"] == expected_expenses, "EXPENSES: independent primary-document total")
    need(cents(docs["ADJ-INS"]["total_cents"]) == cents(docs["POLICY-OPEN"]["total_cents"]) // 4
         and cents(docs["ADJ-SOFT"]["total_cents"]) == cents(docs["DOC-SOFTWARE"]["total_cents"]) // 12
         and cents(docs["ADJ-DEPR"]["total_cents"]) == cents(docs["ASSET-OPEN"]["total_cents"]) // 48, "ADJUSTMENTS: time allocation")
    mistake_controls(data)
    return opening, m, summaries, matches


def csv_report(name, rows, formula, as_of=END):
    common = dict(META, report_id=name, period_start=START, period_end=END, as_of=as_of,
                  accounting_basis="Accrual", source="JOURNAL.csv", calculation_rule=formula)
    rows = [dict(common, **r) for r in rows]
    out = io.StringIO(newline="")
    writer = csv.DictWriter(out, fieldnames=list(rows[0]), lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    return out.getvalue()


def usd(n):
    return ("-" if n < 0 else "") + f"${abs(n)//100:,}.{abs(n)%100:02d}"


def aging(data, account):
    journal, docs = data["JOURNAL.csv"], documents(data)
    types = {"customer_invoice", "opening_invoice"} if account == "1100" else {"vendor_bill", "opening_bill"}
    result = []
    for d in docs.values():
        if d["document_type"] not in types:
            continue
        lines = [r for r in journal if r["account_code"] == account and r["open_item_id"] == d["document_id"]]
        original = sum(delta(r) for r in lines if r["transaction_id"] == d["transaction_id"]) * (1 if account == "1100" else -1)
        closing = sum(map(delta, lines)) * (1 if account == "1100" else -1)
        days = max(0, (date.fromisoformat(END) - date.fromisoformat(d["due_date"])).days) if closing else 0
        bucket = "current_cents" if days == 0 else "days_1_30_cents" if days <= 30 else "days_31_60_cents" if days <= 60 else "days_61_90_cents" if days <= 90 else "over_90_cents"
        row = dict(document_id=d["document_id"], counterparty_id=d["counterparty_id"], document_date=d["document_date"], due_date=d["due_date"],
                   original_cents=original, payments_cents=original-closing, closing_cents=closing, days_past_due=days,
                   current_cents=0, days_1_30_cents=0, days_31_60_cents=0, days_61_90_cents=0, over_90_cents=0,
                   source_transaction_ids="|".join(sorted({r["transaction_id"] for r in lines})))
        row[bucket] = closing
        result.append(row)
    need(sum(r["closing_cents"] for r in result) == metrics(data)["ar" if account == "1100" else "ap"], "AGING: total")
    return sorted(result, key=lambda r: r["document_id"])


def render_reports(data):
    opening, m, summaries, matches = audit(data)
    journal, coa = data["JOURNAL.csv"], accounts(data)
    op, b = balances(journal, True), balances(journal)
    result = {}
    opening_rows, gl, tb = [], [], []
    for acc, a in sorted(coa.items()):
        lines = sorted([r for r in journal if r["account_code"] == acc], key=lambda r: (r["entry_kind"] != "opening", r["transaction_date"], r["transaction_id"], r["line_id"]))
        refs = "|".join(sorted({r['transaction_id'] for r in lines}))
        opening_rows.append(dict(account_code=acc, name_en=a["name_en"], debit_cents=max(op[acc], 0), credit_cents=max(-op[acc], 0), source_transaction_id="GVL-OPEN"))
        running = 0
        for r in lines:
            running += delta(r)
            gl.append(dict(account_code=acc, name_en=a["name_en"], line_id=r["line_id"], entry_id=r["entry_id"], transaction_id=r["transaction_id"],
                           transaction_date=r["transaction_date"], entry_kind=r["entry_kind"], document_id=r["document_id"], open_item_id=r["open_item_id"],
                           debit_cents=cents(r["debit_cents"]), credit_cents=cents(r["credit_cents"]), running_debit_minus_credit_cents=running))
        period = [r for r in lines if r["entry_kind"] != "opening"]
        tb.append(dict(account_code=acc, name_en=a["name_en"], normal_balance=a["normal_balance"], opening_debit_cents=max(op[acc], 0), opening_credit_cents=max(-op[acc], 0),
                       period_debit_cents=sum(cents(r["debit_cents"]) for r in period), period_credit_cents=sum(cents(r["credit_cents"]) for r in period),
                       closing_debit_cents=max(b[acc], 0), closing_credit_cents=max(-b[acc], 0), source_transaction_ids=refs))
    result["OPENING_BALANCES.csv"] = csv_report("OPENING_BALANCES", opening_rows, "Sum opening-entry debits minus credits by account; split by sign", START)
    result["GENERAL_LEDGER.csv"] = csv_report("GENERAL_LEDGER", gl, "Cumulative sum debit_cents-credit_cents by account; opening first")
    result["TRIAL_BALANCE.csv"] = csv_report("TRIAL_BALANCE", tb, "Opening signed balance + period debits - period credits; split by sign")
    pnl, bs = [], []
    for acc, a in sorted(coa.items()):
        kind = a["account_type"]
        lines = [r for r in journal if r["account_code"] == acc]
        refs = "|".join(sorted({r['transaction_id'] for r in lines}))
        if kind in {"Income", "Expense"}:
            amount = sum(delta(r) for r in lines if r["entry_kind"] != "opening") * (-1 if kind == "Income" else 1)
            pnl.append(dict(section="Revenue" if kind == "Income" else "Expenses", account_code=acc, label=a["name_en"], amount_cents=amount, source_transaction_ids=refs))
        else:
            amount = b[acc] * (1 if kind in {"Asset", "Contra Asset"} else -1)
            bs.append(dict(section="Assets" if kind in {"Asset", "Contra Asset"} else "Liabilities" if kind == "Liability" else "Equity", account_code=acc, label=a["name_en"], amount_cents=amount, source_transaction_ids=refs))
    period_refs = "|".join(sorted({r["transaction_id"] for r in journal if r["entry_kind"] != "opening"}))
    for label, key in (("TOTAL_REVENUE", "revenue"), ("TOTAL_EXPENSES", "expenses"), ("NET_INCOME", "net_income")):
        pnl.append(dict(section="Summary", account_code="", label=label, amount_cents=m[key], source_transaction_ids=period_refs))
    bs.append(dict(section="Equity", account_code="", label="Current September Net Income", amount_cents=m["net_income"], source_transaction_ids=period_refs))
    for label, key in (("TOTAL_ASSETS", "assets"), ("TOTAL_LIABILITIES", "liabilities"), ("TOTAL_EQUITY", "equity"), ("BALANCE_SHEET_DIFFERENCE", "balance_sheet_difference")):
        bs.append(dict(section="Summary", account_code="", label=label, amount_cents=m[key], source_transaction_ids="ALL_JOURNAL_ENTRIES"))
    result["PNL.csv"] = csv_report("PNL", pnl, "Revenue = period income credits-debits; expenses = period expense debits-credits; net income = revenue-expenses")
    result["BALANCE_SHEET.csv"] = csv_report("BALANCE_SHEET", bs, "Assets include negative accumulated depreciation; equity includes current net income; difference = assets-liabilities-equity")
    for name, account in (("AR_AGING", "1100"), ("AP_AGING", "2000")):
        result[name + ".csv"] = csv_report(name, aging(data, account), "Journal balance by open_item_id; age unpaid balance by days after document due_date; current means not overdue")
    text = ["# Bank Reconciliation Report — TRAINING ONLY", "", f"Dataset: `{VERSION}`. Period: {START}–{END}; as of {END}. Accrual basis; USD.",
            "Sources: JOURNAL.csv (book), TRANSACTIONS.csv (posting dates), statements/*.csv (independent evidence), OUTSTANDING_ITEMS.csv and documents/DOCUMENTS.csv (timing confirmations).", "",
            "## Expected results and formulas", "", "Bank assets: opening + deposits − withdrawals = statement closing. Adjusted bank = statement closing + deposit in transit − outstanding check. Canonical book requires no further adjustment.",
            "Card liability is positive: opening + charges − credits/payments = statement closing. Add September unposted charges to reconcile to the book liability; never treat the card as cash.", "",
            "| Account | Opening | Increases | Decreases | Statement closing | Signed timing | Adjusted statement | Adjusted book | Difference | Matched lines |",
            "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |"]
    for s in summaries:
        text.append("| " + " | ".join([s["account"], *[usd(s[k]) for k in ("opening", "increases", "decreases", "statement_close", "timing", "adjusted_bank", "book", "difference")], str(s["matched"])]) + " |")
    text += ["", "## Documented timing items", "", "| Event | Type | Amount | Book date | Subsequent posting | Source / confirmation |", "| --- | --- | ---: | --- | --- | --- |"]
    for r in data["OUTSTANDING_ITEMS.csv"]:
        text.append(f"| {r['transaction_id']} | {r['timing_type']} | {usd(cents(r['amount_cents']))} | {r['book_date']} | {r['subsequent_posting_date']} | {r['source_document_id']} / {r['confirmation_document_id']} |")
    text += ["", "These October confirmations are fictional subsequent evidence, not September statement lines or October journal entries. No unexplained or undocumented unmatched lines remain.", "",
             "## One-to-one matching (not just equal ending balances)", "", "Positive signed amounts increase the asset or the card liability respectively. Each statement line maps to exactly one journal bank/card leg; transfer/card-payment sides match separately.", "",
             "| Account | Statement line | Journal line | Event | Document | Posting date | Signed amount |", "| --- | --- | --- | --- | --- | --- | ---: |"]
    for acc, line, leg, tx, doc, pd, n in matches:
        text.append(f"| {acc} | {line} | {leg} | {tx} | {doc} | {pd} | {usd(n)} |")
    text += ["", "## Separate learner variants", "", "- M03 removes only GVL-FEE from a copy: unadjusted book $16,944.00; Dr 6500 / Cr 1000 $35.00 restores $16,909.00. Do not post the fee a second time to the canonical book.",
             "- M01 adds a duplicate bank-feed receipt as revenue. Match ST-OPERATING-04 to GVL-RCPT-01-L01, do not Add a second receipt. Duplicate cash legs fail the one-to-one gate even if other errors offset their amounts.",
             "- Outstanding check VPAY-03 remains in the book; deposit RCPT-09 remains in the book. Neither is reversed solely because it is absent from the September statement.",
             "- Use mistakes/JOURNAL_PATCHES.csv on an in-memory copy only; explanations, effects and corrections: mistakes/README.md and lessons/02-bank-reconciliation.md.", "",
             "## Review boundary", "", "Machine reconciliation: PASS. Independent accounting methodology: METHODOLOGY REVIEW PENDING. This report is not a bank-issued document.", ""]
    result["RECONCILIATION.md"] = "\n".join(text)
    hashes = "\n".join(f"| {name} | `{hashlib.sha256(csv_bytes(data[name])).hexdigest()}` |" for name in INPUTS)
    total_dr = sum(cents(r["debit_cents"]) for r in journal)
    tb_total = sum(max(v, 0) for v in b.values())
    result["VALIDATION_REPORT.md"] = f"""# CP-01B Machine Validation — TRAINING ONLY

Dataset: `{VERSION}`. Validation date: 2026-10-15. Period: {START}–{END}; Accrual; USD.

**Machine validation: PASS. METHODOLOGY REVIEW PENDING.** Publication remains conditional; arithmetic is not a CPA/bookkeeper signoff.

## Reproducible commands

```sh
python3 tracks/booking-usa/cases/green-valley-landscaping/validate.py --check
python3 -m unittest discover -s tracks/booking-usa/cases/green-valley-landscaping -p 'test_*.py' -v
```

`--write` regenerates only the nine derived files (including this report), after auditing the read-only sources. `--check` does not write; it compares every derived file byte-for-byte against recalculation. No network, clock-dependent output, floats, packages or application imports. Input hashes below use canonical UTF-8 CSV bytes (LF), excluding OS newline differences.

## Accounting gates

| Check | Result / expected amount |
| --- | --- |
| Every entry balanced | PASS; {len({r['entry_id'] for r in journal})} entries / {len(journal)} lines |
| Total journal debits = credits, including opening | {usd(total_dr)} = {usd(total_dr)} |
| Opening debits = credits (includes contra asset) | $47,700.00 = $47,700.00 |
| Opening Assets = Liabilities + Equity | {usd(opening[0])} = {usd(opening[1])} + {usd(opening[2])} |
| Prior equity/cash/accrual bridge; no Opening Balance Equity plug | PASS |
| Trial Balance debit = credit balances | {usd(tb_total)} = {usd(tb_total)}; difference $0.00 |
| September service invoices | 12 distinct source documents; recognized revenue {usd(m['revenue'])} |
| Expenses / Net Income | {usd(m['expenses'])} / {usd(m['net_income'])} |
| Closing Assets = Liabilities + Equity | {usd(m['assets'])} = {usd(m['liabilities'])} + {usd(m['equity'])}; difference $0.00 |
| AR rollforward | $2,500 + $18,000 − $14,000 − $0 credits/write-offs = {usd(m['ar'])} |
| AP rollforward | $1,500 + $3,590 − $3,550 − $0 vendor credits = {usd(m['ap'])} |
| Closing checking / savings / card liability | {usd(m['checking'])} / {usd(m['savings'])} / {usd(m['card'])} |
| Bank/card reconciliation | All three differences $0.00; 25 individually matched lines; 3 evidenced timing items |
| Duplicate revenue, card-vs-cash and transfer classification | Document signatures and revenue controls PASS |
| Source-document expense total / prepaid releases / depreciation | Independently recomputed PASS |
| Reports derived from JOURNAL.csv | Ledger, opening, TB, P&L, BS and aging reproduce; reconciliation also uses independent statements |
| Wrong-ledger variants | All 5 remain balanced but fail their named semantic rules; all 5 corrections restore every account and AR/AP |

## Data and educational gates

- PASS: unique event/document/line IDs, account/document/event links, exact integer cents, USD/version/TRAINING ONLY metadata, ISO dates and allowed cutoffs.
- PASS: source quantities × unit prices, invoice completion dates, net-15 due dates, customer/vendor allocations and no overpayment.
- PASS: 3 lesson packages with observable tasks, hints, common errors, numeric answer keys and success criteria; 5 separate deterministic mistakes. Structural checks plus original-content editorial review; not professional certification.
- Synthetic IDs only; no identity/address/tax/bank-account fields. Pattern checks supplement, not replace, the documented synthetic-data authorship review.
- Application checks and Git scope evidence are in CP-01B_REPORT.md; this validator does not pretend to run the application suite.

## Source hashes

| Input | SHA-256 |
| --- | --- |
{hashes}

## Independent review

**METHODOLOGY REVIEW PENDING.** No qualified independent US bookkeeper/CPA participated. Reviewer must assess revenue recognition, expense classification, prepayments, book depreciation, accrual and AR/AP reconciliation; see ACCOUNTING_POLICIES.md. No US GAAP, tax-compliance or publication approval is asserted.
"""
    return result


def csv_bytes(rows):
    out = io.StringIO(newline="")
    writer = csv.DictWriter(out, fieldnames=list(rows[0]), lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    return out.getvalue().encode("utf-8")


def educational_checks(root=ROOT):
    data = load(root)
    expected = metrics(data)
    op_assets, op_liabilities, op_equity = opening_controls(data)
    expected.update(opening_assets=op_assets, opening_liabilities=op_liabilities, opening_equity=op_equity)
    answer = (root / "ANSWER_KEY.md").read_text(encoding="utf-8")
    for key, value in expected.items():
        need(f"| {key} | {usd(value)} |" in answer, f"ANSWER_KEY: {key}")
    # Every non-opening entry in the human-readable key is checked against the journal.
    for tx, t in transactions(data).items():
        if tx == "GVL-OPEN":
            continue
        lines = [r for r in data["JOURNAL.csv"] if r["transaction_id"] == tx]
        dr = next(r for r in lines if cents(r["debit_cents"]) > 0)
        cr = next(r for r in lines if cents(r["credit_cents"]) > 0)
        row = f"| {tx} | {t['transaction_date']} | {t['source_document_id']} | {dr['account_code']} | {cr['account_code']} | {usd(cents(dr['debit_cents']))} |"
        need(row in answer, f"ANSWER_KEY: entry {tx}")
    sections = ("Цель", "English terms", "Исходные документы", "Инструкция", "Ожидаемые проводки", "Подсказки", "Типичные ошибки", "Проверочные задания", "Answer key", "Критерии успешности")
    for filename in ("01-invoice-and-payment.md", "02-bank-reconciliation.md", "03-month-end-reporting.md"):
        text = (root / "lessons" / filename).read_text(encoding="utf-8")
        need(all(s in text for s in sections), f"LESSON: missing required section {filename}")
    mistakes = (root / "mistakes/README.md").read_text(encoding="utf-8")
    need(all(f"## {sid}" in mistakes for sid in ("M01", "M02", "M03", "M04", "M05")), "LESSON: five explanations")
    for file in [*root.rglob("*.md"), *root.rglob("*.py")]:
        text = file.read_text(encoding="utf-8")
        need("TRAINING ONLY" in text, f"LABEL: {file.name}")
        need(not re.search(r"\b\d{3}-\d{2}-\d{4}\b|\b\d{2}-\d{7}\b", text), f"SYNTHETIC: identifier-like pattern {file.name}")


def run(root=ROOT, write=False):
    data = load(root)
    reports = render_reports(data)
    educational_checks(root)
    for name, text in reports.items():
        path = root / name
        if write:
            path.write_bytes(text.encode("utf-8"))
        else:
            need(path.exists() and path.read_bytes() == text.encode("utf-8"), f"REPRODUCIBILITY: stale/missing {name}")
    print(f"PASS: {len(data['TRANSACTIONS.csv'])} events; {len(data['JOURNAL.csv'])} lines; 12 invoices; 5 mistake/correction pairs; {len(reports)} derived files verified.")
    return reports


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--write", action="store_true", help="regenerate derived reports only, after validating sources")
    mode.add_argument("--check", action="store_true", help="read-only validation (default)")
    args = parser.parse_args()
    try:
        run(write=args.write)
    except (ValueError, KeyError, OSError) as exc:
        parser.exit(1, f"FAIL: {exc}\n")
