# Detailed Answer Key — TRAINING ONLY

Green Valley Landscaping LLC, dataset **GVL-2026-09-v1.0.0**. Reporting period **2026-09-01–2026-09-30**, as of **2026-09-30**; **Accrual / USD / double-entry**. Prepared 2026-10-15. **METHODOLOGY REVIEW PENDING.** Оригинальные синтетические факты, не финансовые данные реального клиента.

Это проверочное представление JOURNAL.csv и первичных документов, не дополнительный ввод сумм. Главный источник проводок — JOURNAL.csv. Ledger, TB, P&L, BS и aging рассчитываются из него; даты due из source documents; сверка дополнительно использует независимые statements. Все задачи трёх lessons имеют подробный ключ и ниже — полный monthly reference.

## 1. Проверяемая контрольная таблица

Формат этой таблицы проверяется программно: metric ID → expected USD. Суммы независимо сверяются с документами, не принимаются просто потому, что они написаны в ключе.

| Metric ID | Expected USD |
| --- | ---: |
| opening_assets | $41,700.00 |
| opening_liabilities | $3,500.00 |
| opening_equity | $38,200.00 |
| revenue | $18,000.00 |
| expenses | $5,601.00 |
| net_income | $12,399.00 |
| ar | $6,500.00 |
| ap | $1,540.00 |
| checking | $16,909.00 |
| savings | $10,500.00 |
| card | $1,270.00 |
| assets | $53,409.00 |
| liabilities | $2,810.00 |
| equity | $50,599.00 |
| trial_balance_difference | $0.00 |
| balance_sheet_difference | $0.00 |

## 2. Opening General Journal

Entry GVL-OPEN / JE-GVL-OPEN, book date **2026-09-01** (начало дня), primary document DOC-OPEN **2026-08-31**. Opening не входит в September turnovers. Поддержка историческими invoice/bill/capital/expense/cash schedules: documents/README.md, DOCUMENTS.csv и opening-history.csv.

| Account | Debit USD | Credit USD | Open item / support |
| --- | ---: | ---: | --- |
| 1000 Operating Checking | $12,000.00 | $0.00 | CASH-OPEN |
| 1010 Savings | $8,000.00 | $0.00 | SAV-OPEN |
| 1100 AR | $1,500.00 | $0.00 | INV-OPEN-01 |
| 1100 AR | $1,000.00 | $0.00 | INV-OPEN-02 |
| 1300 Prepaid | $1,200.00 | $0.00 | POLICY-OPEN |
| 1500 Equipment | $24,000.00 | $0.00 | ASSET-OPEN |
| 1590 Accumulated Depreciation | $0.00 | $6,000.00 | DEPR-OPEN |
| 2000 AP | $0.00 | $900.00 | BILL-OPEN-01 |
| 2000 AP | $0.00 | $600.00 | BILL-OPEN-02 |
| 2100 Card Payable | $0.00 | $2,000.00 | CARD-OPEN |
| 3000 Member Contributions | $0.00 | $30,000.00 | CAPITAL-OPEN |
| 3100 Retained Earnings | $0.00 | $8,200.00 | EARNINGS-OPEN |
| **TOTAL** | **$47,700.00** | **$47,700.00** | **Difference $0.00** |

Opening Assets $47,700 gross debit assets − $6,000 contra asset = **$41,700**. Liabilities $1,500 + $2,000 = **$3,500**. Equity $30,000 + ($45,000 prior revenue − $36,800 prior expenses) = **$38,200**. Нет suspense/Opening Balance Equity. Не переносить $8,200 в September Revenue.

## 3. Все September General Journal entries

В каждой строке ниже обе стороны равны указанной USD amount; исходные integer cents, journal line IDs и open_item_id находятся в JOURNAL.csv. `Date` — transaction date, а не всегда document/posting date. Полная разница каждого entry **$0.00**.

| Event ID | Date | Source | Debit | Credit | USD |
| --- | --- | --- | --- | --- | ---: |
| GVL-PREPAY | 2026-09-01 | DOC-SOFTWARE | 1300 | 1000 | $1,200.00 |
| GVL-BILL-01 | 2026-09-02 | BILL-01 | 6000 | 2000 | $1,800.00 |
| GVL-INV-01 | 2026-09-03 | INV-01 | 1100 | 4000 | $1,800.00 |
| GVL-VPAY-OPEN-01 | 2026-09-04 | VPAY-OPEN-01 | 2000 | 1000 | $900.00 |
| GVL-RCPT-OPEN | 2026-09-05 | RCPT-OPEN | 1000 | 1100 | $1,500.00 |
| GVL-CARD-01 | 2026-09-06 | CC-01 | 6000 | 2100 | $450.50 |
| GVL-INV-02 | 2026-09-07 | INV-02 | 1100 | 4000 | $2,400.00 |
| GVL-RCPT-01 | 2026-09-08 | RCPT-01 | 1000 | 1100 | $1,800.00 |
| GVL-BILL-02 | 2026-09-09 | BILL-02 | 6200 | 2000 | $650.00 |
| GVL-INV-03 | 2026-09-10 | INV-03 | 1100 | 4000 | $2,100.00 |
| GVL-VPAY-OPEN-02 | 2026-09-10 | VPAY-OPEN-02 | 2000 | 1000 | $600.00 |
| GVL-CASH-01 | 2026-09-11 | EXP-FUEL | 6100 | 1000 | $185.75 |
| GVL-RCPT-02 | 2026-09-12 | RCPT-02 | 1000 | 1100 | $1,400.00 |
| GVL-CARD-02 | 2026-09-13 | CC-02 | 6100 | 2100 | $160.35 |
| GVL-INV-04 | 2026-09-14 | INV-04 | 1100 | 4000 | $1,500.00 |
| GVL-RCPT-03 | 2026-09-15 | RCPT-03 | 1000 | 1100 | $2,100.00 |
| GVL-TRANSFER | 2026-09-15 | DOC-TRANSFER | 1010 | 1000 | $2,500.00 |
| GVL-VPAY-01 | 2026-09-16 | VPAY-01 | 2000 | 1000 | $1,000.00 |
| GVL-CASH-02 | 2026-09-17 | EXP-VEHICLE | 6200 | 1000 | $120.25 |
| GVL-CARDPAY | 2026-09-18 | DOC-CARDPAY | 2100 | 1000 | $1,500.00 |
| GVL-INV-05 | 2026-09-18 | INV-05 | 1100 | 4000 | $1,200.00 |
| GVL-CARD-03 | 2026-09-19 | CC-03 | 6600 | 2100 | $89.15 |
| GVL-RCPT-04 | 2026-09-21 | RCPT-04 | 1000 | 1100 | $1,500.00 |
| GVL-RCPT-05 | 2026-09-22 | RCPT-05 | 1000 | 1100 | $1,200.00 |
| GVL-INV-06 | 2026-09-23 | INV-06 | 1100 | 4000 | $1,800.00 |
| GVL-BILL-03 | 2026-09-24 | BILL-03 | 6000 | 2000 | $900.00 |
| GVL-VPAY-02 | 2026-09-24 | VPAY-02 | 2000 | 1000 | $650.00 |
| GVL-INV-07 | 2026-09-25 | INV-07 | 1100 | 4100 | $1,000.00 |
| GVL-RCPT-06 | 2026-09-25 | RCPT-06 | 1000 | 1100 | $1,000.00 |
| GVL-INV-08 | 2026-09-26 | INV-08 | 1100 | 4100 | $1,200.00 |
| GVL-INV-09 | 2026-09-27 | INV-09 | 1100 | 4100 | $800.00 |
| GVL-INV-10 | 2026-09-28 | INV-10 | 1100 | 4100 | $1,500.00 |
| GVL-RCPT-07 | 2026-09-28 | RCPT-07 | 1000 | 1100 | $1,000.00 |
| GVL-BILL-04 | 2026-09-29 | BILL-04 | 6600 | 2000 | $240.00 |
| GVL-INV-11 | 2026-09-29 | INV-11 | 1100 | 4100 | $1,200.00 |
| GVL-RCPT-08 | 2026-09-29 | RCPT-08 | 1000 | 1100 | $600.00 |
| GVL-ADJ-DEPR | 2026-09-30 | ADJ-DEPR | 6800 | 1590 | $500.00 |
| GVL-ADJ-INS | 2026-09-30 | ADJ-INS | 6300 | 1300 | $300.00 |
| GVL-ADJ-SOFT | 2026-09-30 | ADJ-SOFT | 6400 | 1300 | $100.00 |
| GVL-CARD-04 | 2026-09-30 | CC-04 | 6100 | 2100 | $70.00 |
| GVL-FEE | 2026-09-30 | DOC-FEE | 6500 | 1000 | $35.00 |
| GVL-INV-12 | 2026-09-30 | INV-12 | 1100 | 4100 | $1,500.00 |
| GVL-RCPT-09 | 2026-09-30 | RCPT-09 | 1000 | 1100 | $1,500.00 |
| GVL-RCPT-10 | 2026-09-30 | RCPT-10 | 1000 | 1100 | $400.00 |
| GVL-VPAY-03 | 2026-09-30 | VPAY-03 | 2000 | 1000 | $400.00 |

September debit turnovers **$46,351** = credit turnovers **$46,351**. Including opening: **$94,051 each**. Это не TB ending balance total.

Revenue proof: 72 completed landscaping hours × $150 = **$10,800**; 26 completed maintenance visits по agreed rates = **$7,200**; 12 уникальных invoices → **$18,000**. Customer receipts $14,000 (включая $1,500 opening invoice) только уменьшают AR. Transfer $2,500 не затрагивает P&L. Card purchases $770 увеличивают liability, не уменьшают checking; payment $1,500 погашает liability.

## 4. Adjusted pre-closing Trial Balance и P&L

GL running balance = cumulative debits − credits per account, opening first. TB ending debit = max(signed balance,0), credit = max(−signed balance,0). Все суммы этой таблицы связаны с теми же journal lines, не независимая загрузка.

| Account | Name | Closing Debit USD | Closing Credit USD |
| --- | --- | ---: | ---: |
| 1000 | Operating Checking | $16,909.00 | $0.00 |
| 1010 | Savings Account | $10,500.00 | $0.00 |
| 1100 | Accounts Receivable | $6,500.00 | $0.00 |
| 1300 | Prepaid Expenses | $2,000.00 | $0.00 |
| 1500 | Equipment | $24,000.00 | $0.00 |
| 1590 | Accumulated Depreciation | $0.00 | $6,500.00 |
| 2000 | Accounts Payable | $0.00 | $1,540.00 |
| 2100 | Credit Card Payable | $0.00 | $1,270.00 |
| 3000 | Member Contributions | $0.00 | $30,000.00 |
| 3100 | Retained Earnings | $0.00 | $8,200.00 |
| 4000 | Landscaping Service Revenue | $0.00 | $10,800.00 |
| 4100 | Maintenance Service Revenue | $0.00 | $7,200.00 |
| 6000 | Materials and Supplies | $3,150.50 | $0.00 |
| 6100 | Fuel Expense | $416.10 | $0.00 |
| 6200 | Vehicle Expense | $770.25 | $0.00 |
| 6300 | Insurance Expense | $300.00 | $0.00 |
| 6400 | Software Subscriptions | $100.00 | $0.00 |
| 6500 | Bank Charges | $35.00 | $0.00 |
| 6600 | Office Expenses | $329.15 | $0.00 |
| 6800 | Depreciation Expense | $500.00 | $0.00 |
| **TOTAL** | **Adjusted TB** | **$65,510.00** | **$65,510.00** |

P&L = только non-opening Income/Expense movements:

| Expense account | Source events / formula | USD |
| --- | --- | ---: |
| 6000 Materials | BILL-01 $1,800 + BILL-03 $900 + CARD-01 $450.50 | $3,150.50 |
| 6100 Fuel | CASH-01 $185.75 + CARD-02 $160.35 + CARD-04 $70 | $416.10 |
| 6200 Vehicle | BILL-02 $650 + CASH-02 $120.25 | $770.25 |
| 6300 Insurance | ADJ-INS: $1,200 / 4 | $300.00 |
| 6400 Software | ADJ-SOFT: $1,200 / 12 | $100.00 |
| 6500 Bank Charges | FEE | $35.00 |
| 6600 Office | BILL-04 $240 + CARD-03 $89.15 | $329.15 |
| 6800 Depreciation | ADJ-DEPR: $24,000 / 48 | $500.00 |
| **Total Expenses** | Sum of eight accounts | **$5,601.00** |

**Net Income = $18,000 − $5,601 = $12,399**. Other income/expenses отсутствуют. Pre-adjustment (только без 3 ADJ entries) expense $4,701, NI $13,299; корректировки $900 не меняют cash.

## 5. Balance Sheet

| Section | Formula | USD |
| --- | --- | ---: |
| Cash | Checking $16,909 + Savings $10,500 | $27,409 |
| AR | See per-invoice rollforward | $6,500 |
| Prepaid | $1,200 opening + $1,200 purchase − $300 insurance − $100 software | $2,000 |
| Net Equipment | $24,000 cost − ($6,000 opening accumulated + $500 September) | $17,500 |
| **Assets** | Sum of four lines above | **$53,409** |
| AP | See per-bill rollforward | $1,540 |
| Credit Card Payable | $2,000 + $770 charges − $1,500 payment | $1,270 |
| **Liabilities** | $1,540 + $1,270 | **$2,810** |
| Member Contributions | Opening, no September changes | $30,000 |
| Retained Earnings | Historical closed earnings only | $8,200 |
| Current September Net Income | P&L | $12,399 |
| **Equity** | $30,000 + $8,200 + $12,399 | **$50,599** |

**Assets − Liabilities − Equity = $53,409 − $2,810 − $50,599 = $0.00**. Доходы/расходы остаются в pre-closing TB, current NI отображается в BS ровно один раз.

## 6. Accounts Receivable Aging

Formula per invoice: initial AR journal debits − applied payment credits = unpaid balance. Due dates из source documents; age after due date на 09-30. Original включает открытие и September invoices; credits/write-offs отсутствуют.

| Invoice | Due date | Original USD | Payments USD | Closing USD | Bucket / overdue |
| --- | --- | ---: | ---: | ---: | --- |
| INV-01 | 2026-09-18 | $1,800.00 | $1,800.00 | $0.00 | Paid |
| INV-02 | 2026-09-23 | $2,400.00 | $1,400.00 | $1,000.00 | 1–30 / 7 days |
| INV-03 | 2026-09-25 | $2,100.00 | $2,100.00 | $0.00 | Paid |
| INV-04 | 2026-09-29 | $1,500.00 | $1,500.00 | $0.00 | Paid |
| INV-05 | 2026-10-03 | $1,200.00 | $1,200.00 | $0.00 | Paid |
| INV-06 | 2026-10-08 | $1,800.00 | $1,000.00 | $800.00 | Current |
| INV-07 | 2026-10-10 | $1,000.00 | $1,000.00 | $0.00 | Paid |
| INV-08 | 2026-10-11 | $1,200.00 | $600.00 | $600.00 | Current |
| INV-09 | 2026-10-12 | $800.00 | $0.00 | $800.00 | Current |
| INV-10 | 2026-10-13 | $1,500.00 | $1,500.00 | $0.00 | Paid |
| INV-11 | 2026-10-14 | $1,200.00 | $400.00 | $800.00 | Current |
| INV-12 | 2026-10-15 | $1,500.00 | $0.00 | $1,500.00 | Current |
| INV-OPEN-01 | 2026-08-30 | $1,500.00 | $1,500.00 | $0.00 | Paid |
| INV-OPEN-02 | 2026-08-15 | $1,000.00 | $0.00 | $1,000.00 | 31–60 / 46 days |

**AR = $2,500 opening + $18,000 invoices − $14,000 receipts − $0 credits/write-offs = $6,500**. Buckets: Current **$4,500**; 1–30 **$1,000** (INV-02); 31–60 **$1,000** (INV-OPEN-02); later **$0**. Четыре частично оплаченных invoices: INV-02, INV-06, INV-08, INV-11. Полностью неоплачены INV-OPEN-02, INV-09, INV-12.

## 7. Accounts Payable Aging

Formula per bill: original AP credits − applied vendor-payment debits = unpaid. Не считать expense второй раз при payment.

| Bill | Due date | Original USD | Payments USD | Closing USD | Bucket / overdue |
| --- | --- | ---: | ---: | ---: | --- |
| BILL-01 | 2026-09-17 | $1,800.00 | $1,000.00 | $800.00 | 1–30 / 13 days |
| BILL-02 | 2026-09-24 | $650.00 | $650.00 | $0.00 | Paid |
| BILL-03 | 2026-10-09 | $900.00 | $400.00 | $500.00 | Current |
| BILL-04 | 2026-10-14 | $240.00 | $0.00 | $240.00 | Current |
| BILL-OPEN-01 | 2026-09-04 | $900.00 | $900.00 | $0.00 | Paid |
| BILL-OPEN-02 | 2026-09-12 | $600.00 | $600.00 | $0.00 | Paid |

**AP = $1,500 opening + $3,590 bills − $3,550 payments − $0 vendor credits = $1,540**. Current **$740** (BILL-03 $500 + BILL-04 $240); 1–30 **$800** (BILL-01, 13 days overdue); later **$0**. Outstanding check $400 уже уменьшил BILL-03 и AP, несмотря на проведение банка в октябре.

## 8. Reconciliation key

| Account | Statement equation | Adjusted statement | Adjusted book | Difference |
| --- | --- | --- | ---: | ---: |
| Checking | $12,000 + $12,500 − $8,691 = $15,809 | $15,809 + $1,500 deposit − $400 check = $16,909 | $16,909 | $0 |
| Savings | $8,000 + $2,500 − $0 = $10,500 | $10,500 | $10,500 | $0 |
| Card liability | $2,000 + $700 − $1,500 = $1,200 | $1,200 + $70 unposted charge = $1,270 | $1,270 | $0 |

Все **25** line matches и **3** последующих подтверждения приведены в RECONCILIATION.md; нельзя засчитать лишь совпадение суммы. Check VPAY-03 $400 → 10-05, deposit RCPT-09 $1,500 → 10-02, card CC-04 $70 → 10-01. Ни одно timing item не требует второй September entry.

M03: unadjusted book **$16,944**, missing fee **$35**, adjusted book **$16,909**. Эталон уже содержит fee; book-side adjustment в canonical reconciliation = **$0**. M01: ST-OPERATING-04 → GVL-RCPT-01-L01; Match, не Add income. При создании дубликата cash/revenue/NI завышаются на $1,800, хотя TB/BS differences всё ещё нулевые.

## 9. Ключ уроков и ошибок / наблюдаемая проверка

- **Lesson 01:** INV-02 revenue $2,400 09-07, receipt $1,400 09-12, open $1,000 (7 days overdue); INV-06 $1,800 − $1,000 = $800 Current. Two-chain revenue $4,200, cash receipts $2,400, AR $1,800. Full-month AR $6,500. INV-07 $1,000 − $1,000 = $0; receipt revenue $0.
- **Lesson 02:** fee entry Dr 6500/Cr 1000 $35 только в M03, then all differences $0; 20 checking + 1 savings + 4 card matches, 3 documented timing, 0 unexplained. До fee bank minus unadjusted book −$35. Все source/date/direction/ref должны совпасть.
- **Lesson 03:** adjustments $300/$100/$500, prepaid $2,000, net equipment $17,500; TB $65,510 each, P&L NI $12,399, BS $53,409; aging totals/buckets выше. Ending bank cash $27,409 − $20,000 opening = $7,409, не NI.
- **M01–M05:** точные wrong-version effects, признаки и исправления — mistakes/README.md; executable patches/corrections и deltas — CSV рядом. Каждая ошибка balanced, но нарушает наблюдаемый source/matching/AR/revenue control; counter-entries восстанавливают все account balances и AR/AP, не стирая audit trail.

Успех — правильные accounts, amounts, dates, allocations, documented matching и объяснение причины ошибки. Screenshot/self-confirm не доказательство бухгалтерской правильности. Публикация answer key остаётся условной до независимого US bookkeeper/CPA review; runtime и CP-01C здесь не исполняются.
