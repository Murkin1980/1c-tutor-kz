# Bank Reconciliation Report — TRAINING ONLY

Dataset: `GVL-2026-09-v1.0.0`. Period: 2026-09-01–2026-09-30; as of 2026-09-30. Accrual basis; USD.
Sources: JOURNAL.csv (book), TRANSACTIONS.csv (posting dates), statements/*.csv (independent evidence), OUTSTANDING_ITEMS.csv and documents/DOCUMENTS.csv (timing confirmations).

## Expected results and formulas

Bank assets: opening + deposits − withdrawals = statement closing. Adjusted bank = statement closing + deposit in transit − outstanding check. Canonical book requires no further adjustment.
Card liability is positive: opening + charges − credits/payments = statement closing. Add September unposted charges to reconcile to the book liability; never treat the card as cash.

| Account | Opening | Increases | Decreases | Statement closing | Signed timing | Adjusted statement | Adjusted book | Difference | Matched lines |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1000 | $12,000.00 | $12,500.00 | $8,691.00 | $15,809.00 | $1,100.00 | $16,909.00 | $16,909.00 | $0.00 | 20 |
| 1010 | $8,000.00 | $2,500.00 | $0.00 | $10,500.00 | $0.00 | $10,500.00 | $10,500.00 | $0.00 | 1 |
| 2100 | $2,000.00 | $700.00 | $1,500.00 | $1,200.00 | $70.00 | $1,270.00 | $1,270.00 | $0.00 | 4 |

## Documented timing items

| Event | Type | Amount | Book date | Subsequent posting | Source / confirmation |
| --- | --- | ---: | --- | --- | --- |
| GVL-RCPT-09 | deposit_in_transit | $1,500.00 | 2026-09-30 | 2026-10-02 | RCPT-09 / CONF-RCPT-09 |
| GVL-VPAY-03 | outstanding_check | $400.00 | 2026-09-30 | 2026-10-05 | VPAY-03 / CONF-VPAY-03 |
| GVL-CARD-04 | unposted_card_charge | $70.00 | 2026-09-30 | 2026-10-01 | CC-04 / CONF-CARD-04 |

These October confirmations are fictional subsequent evidence, not September statement lines or October journal entries. No unexplained or undocumented unmatched lines remain.

## One-to-one matching (not just equal ending balances)

Positive signed amounts increase the asset or the card liability respectively. Each statement line maps to exactly one journal bank/card leg; transfer/card-payment sides match separately.

| Account | Statement line | Journal line | Event | Document | Posting date | Signed amount |
| --- | --- | --- | --- | --- | --- | ---: |
| 1000 | ST-OPERATING-01 | GVL-PREPAY-L02 | GVL-PREPAY | DOC-SOFTWARE | 2026-09-02 | -$1,200.00 |
| 1000 | ST-OPERATING-02 | GVL-RCPT-OPEN-L01 | GVL-RCPT-OPEN | RCPT-OPEN | 2026-09-08 | $1,500.00 |
| 1000 | ST-OPERATING-03 | GVL-VPAY-OPEN-01-L02 | GVL-VPAY-OPEN-01 | VPAY-OPEN-01 | 2026-09-08 | -$900.00 |
| 1000 | ST-OPERATING-04 | GVL-RCPT-01-L01 | GVL-RCPT-01 | RCPT-01 | 2026-09-09 | $1,800.00 |
| 1000 | ST-OPERATING-05 | GVL-VPAY-OPEN-02-L02 | GVL-VPAY-OPEN-02 | VPAY-OPEN-02 | 2026-09-11 | -$600.00 |
| 1000 | ST-OPERATING-06 | GVL-CASH-01-L02 | GVL-CASH-01 | EXP-FUEL | 2026-09-14 | -$185.75 |
| 1000 | ST-OPERATING-07 | GVL-RCPT-02-L01 | GVL-RCPT-02 | RCPT-02 | 2026-09-14 | $1,400.00 |
| 1000 | ST-OPERATING-08 | GVL-RCPT-03-L01 | GVL-RCPT-03 | RCPT-03 | 2026-09-16 | $2,100.00 |
| 1000 | ST-OPERATING-09 | GVL-TRANSFER-L02 | GVL-TRANSFER | DOC-TRANSFER | 2026-09-16 | -$2,500.00 |
| 1000 | ST-OPERATING-10 | GVL-VPAY-01-L02 | GVL-VPAY-01 | VPAY-01 | 2026-09-17 | -$1,000.00 |
| 1000 | ST-OPERATING-11 | GVL-CASH-02-L02 | GVL-CASH-02 | EXP-VEHICLE | 2026-09-18 | -$120.25 |
| 1000 | ST-OPERATING-12 | GVL-CARDPAY-L02 | GVL-CARDPAY | DOC-CARDPAY | 2026-09-21 | -$1,500.00 |
| 1000 | ST-OPERATING-13 | GVL-RCPT-04-L01 | GVL-RCPT-04 | RCPT-04 | 2026-09-22 | $1,500.00 |
| 1000 | ST-OPERATING-14 | GVL-RCPT-05-L01 | GVL-RCPT-05 | RCPT-05 | 2026-09-23 | $1,200.00 |
| 1000 | ST-OPERATING-15 | GVL-VPAY-02-L02 | GVL-VPAY-02 | VPAY-02 | 2026-09-25 | -$650.00 |
| 1000 | ST-OPERATING-16 | GVL-RCPT-06-L01 | GVL-RCPT-06 | RCPT-06 | 2026-09-28 | $1,000.00 |
| 1000 | ST-OPERATING-17 | GVL-RCPT-07-L01 | GVL-RCPT-07 | RCPT-07 | 2026-09-29 | $1,000.00 |
| 1000 | ST-OPERATING-18 | GVL-RCPT-08-L01 | GVL-RCPT-08 | RCPT-08 | 2026-09-30 | $600.00 |
| 1000 | ST-OPERATING-19 | GVL-RCPT-10-L01 | GVL-RCPT-10 | RCPT-10 | 2026-09-30 | $400.00 |
| 1000 | ST-OPERATING-20 | GVL-FEE-L02 | GVL-FEE | DOC-FEE | 2026-09-30 | -$35.00 |
| 1010 | ST-SAVINGS-01 | GVL-TRANSFER-L01 | GVL-TRANSFER | DOC-TRANSFER | 2026-09-16 | $2,500.00 |
| 2100 | ST-CARD-01 | GVL-CARD-01-L02 | GVL-CARD-01 | CC-01 | 2026-09-07 | $450.50 |
| 2100 | ST-CARD-02 | GVL-CARD-02-L02 | GVL-CARD-02 | CC-02 | 2026-09-14 | $160.35 |
| 2100 | ST-CARD-03 | GVL-CARD-03-L02 | GVL-CARD-03 | CC-03 | 2026-09-21 | $89.15 |
| 2100 | ST-CARD-04 | GVL-CARDPAY-L01 | GVL-CARDPAY | DOC-CARDPAY | 2026-09-22 | -$1,500.00 |

## Separate learner variants

- M03 removes only GVL-FEE from a copy: unadjusted book $16,944.00; Dr 6500 / Cr 1000 $35.00 restores $16,909.00. Do not post the fee a second time to the canonical book.
- M01 adds a duplicate bank-feed receipt as revenue. Match ST-OPERATING-04 to GVL-RCPT-01-L01, do not Add a second receipt. Duplicate cash legs fail the one-to-one gate even if other errors offset their amounts.
- Outstanding check VPAY-03 remains in the book; deposit RCPT-09 remains in the book. Neither is reversed solely because it is absent from the September statement.
- Use mistakes/JOURNAL_PATCHES.csv on an in-memory copy only; explanations, effects and corrections: mistakes/README.md and lessons/02-bank-reconciliation.md.

## Review boundary

Machine reconciliation: PASS. Independent accounting methodology: METHODOLOGY REVIEW PENDING. This report is not a bank-issued document.
