# CP-01B Machine Validation — TRAINING ONLY

Dataset: `GVL-2026-09-v1.0.0`. Validation date: 2026-10-15. Period: 2026-09-01–2026-09-30; Accrual; USD.

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
| Every entry balanced | PASS; 46 entries / 102 lines |
| Total journal debits = credits, including opening | $94,051.00 = $94,051.00 |
| Opening debits = credits (includes contra asset) | $47,700.00 = $47,700.00 |
| Opening Assets = Liabilities + Equity | $41,700.00 = $3,500.00 + $38,200.00 |
| Prior equity/cash/accrual bridge; no Opening Balance Equity plug | PASS |
| Trial Balance debit = credit balances | $65,510.00 = $65,510.00; difference $0.00 |
| September service invoices | 12 distinct source documents; recognized revenue $18,000.00 |
| Expenses / Net Income | $5,601.00 / $12,399.00 |
| Closing Assets = Liabilities + Equity | $53,409.00 = $2,810.00 + $50,599.00; difference $0.00 |
| AR rollforward | $2,500 + $18,000 − $14,000 − $0 credits/write-offs = $6,500.00 |
| AP rollforward | $1,500 + $3,590 − $3,550 − $0 vendor credits = $1,540.00 |
| Closing checking / savings / card liability | $16,909.00 / $10,500.00 / $1,270.00 |
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
| CHART_OF_ACCOUNTS.csv | `9c2fcc545c436495c3c01604621d1eefcc29f70bd16c38619e1773333cb9d966` |
| TRANSACTIONS.csv | `8ad7458f484a467430d54597239d8d905d40d678be62cd8971cc81760aa88207` |
| JOURNAL.csv | `b8d9e6ce4a11a72cbd412e4db87f7bf132bf35e73621fd54c173c9eeec6ee655` |
| documents/DOCUMENTS.csv | `e0f19fb42d73a1a0f35764ecd36227cdd62fdde6d9fa300e1717bd1cc270f715` |
| documents/opening-history.csv | `a3a1f5796ed82a09d8b71f49bd8f778e390a393b51a00479d61c3eb42ddc2ae0` |
| OUTSTANDING_ITEMS.csv | `2337548256f6c37483f84a4e7dea998108bf578322dbe7f563f10a8c36c764a1` |
| statements/operating-checking.csv | `12fa437dea7fac1701c4359c662215130d40d50b858fbd305e63d12faf09f0af` |
| statements/savings.csv | `dabb6886ed379a823806a96654e402168094cfc8dc8d316bc725b52f5e1f5bea` |
| statements/credit-card.csv | `a294eeeaea08340edfb4c26bb46af8977aad76afd74f4f7ec5e78fb20bab0624` |
| mistakes/SCENARIOS.csv | `6a4b5f10874a9d382cd139c8d5fb51e26f9a1af7f4df127e565ad39bbf2c4a0d` |
| mistakes/JOURNAL_PATCHES.csv | `95d7aba84b1283e116572901e5bff38f0ab6555488f624b02a694828a20a3d1e` |
| mistakes/CORRECTIONS.csv | `2a6aafb50898bd3deda27275e8cbc6bb2cc24a1050a38d3f12c896d303abbe98` |

## Independent review

**METHODOLOGY REVIEW PENDING.** No qualified independent US bookkeeper/CPA participated. Reviewer must assess revenue recognition, expense classification, prepayments, book depreciation, accrual and AR/AP reconciliation; see ACCOUNTING_POLICIES.md. No US GAAP, tax-compliance or publication approval is asserted.
