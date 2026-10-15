# Source document packet — TRAINING ONLY

Dataset `GVL-2026-09-v1.0.0`; company Green Valley Landscaping LLC; USD; Accrual. Оригинальные вымышленные первичные документы, подготовлены 2026-10-15. Ни одного реального клиента, bank account number, EIN/SSN или адреса нет. **METHODOLOGY REVIEW PENDING.**

## Формат документа

В `DOCUMENTS.csv` **каждая строка является отдельным полным минимальным учебным документом**, а не ссылкой на несуществующий PDF. `document_id` — его номер; `transaction_id` — событие в TRANSACTIONS/JOURNAL; `document_type`, date, counterparty ID, EN description / RU explanation, quantity, unit, unit_price_cents и total_cents — содержание. Для услуг указаны service_start/service_end (completion evidence); для invoices/bills — due_date. Для receipts/payments `applies_to_document_id` указывает конкретный invoice/bill и того же контрагента.

`account_code` и `settlement_account_code` — учебная классификационная аннотация к документу; проводки существуют **только в JOURNAL.csv**. Документы независимо подтверждают сумму и назначение; проверки сравнивают их с журналом. Нельзя исправлять «ошибку» заменой количества или суммы первичного документа ради совпадения с отчётом.

61 документ:

- 13 opening documents (summary, 2 invoices, 2 bills, prepaid, equipment, depreciation, capital, retained earnings, card, 2 bank balances), связанные с `GVL-OPEN`;
- 12 September customer invoices, 11 customer receipts (включая погашение одного opening invoice);
- 4 September bills, 5 vendor payments (включая два opening bills);
- 13 остальных документов: prepay, 2 direct bank expenses, 4 card purchases, card payment, internal transfer, bank fee, 3 adjustments;
- 3 последующих clearing confirmations, относящихся к сентябрьским timing items.

У invoices `INV-01`–`INV-12` разные counterparty IDs. Дата документа INV-02 — 09-08, completion и recognition — 09-07. Net 15 применяется к document date. В первых двух opening invoices сумма ещё не оплачена на 08-31; в opening bills расход уже признан до сентября. Последующие confirmations не создают новых расходов/доходов.

## Историческая поддержка opening equity и cash

`opening-history.csv` — синтетическая сводка **закрытого периода 2025-09-01–2026-08-31**, не второй журнал сентября. Каждый metric связан с документом из DOCUMENTS и событием GVL-OPEN. Предыдущие периоды здесь не переоткрываются.

| Prior-period fact | USD |
| --- | ---: |
| Member cash contributions, no draws | $30,000 |
| Recognized service revenue | $45,000 |
| Materials | $18,000 |
| Fuel | $5,400 |
| Vehicle | $3,600 |
| Insurance consumed Jan–Aug 2026 | $2,400 |
| Software | $600 |
| Bank charges | $120 |
| Office | $680 |
| Depreciation, 12 × $500 | $6,000 |
| **Total prior expenses** | **$36,800** |
| **Retained Earnings = $45,000 − $36,800** | **$8,200** |
| Customer cash receipts | $42,500 |
| Expense-related cash payments | $28,500 |
| Cash equipment purchase, September 2025 | $24,000 |
| Insurance original premium Jan–Dec 2026 | $3,600 |

Независимые мосты:

1. **AR**: $45,000 prior revenue − $42,500 prior receipts = **$2,500** = INV-OPEN-01 $1,500 + INV-OPEN-02 $1,000.
2. **Accrual → paid expenses**: $36,800 − $6,000 noncash depreciation + $1,200 unexpired prepaid − $1,500 unpaid AP − $2,000 unpaid card = **$28,500 cash payments**.
3. **Cash**: $30,000 capital + $42,500 receipts − $28,500 payments − $24,000 equipment = **$20,000** = checking $12,000 + savings $8,000.
4. **Prepaid**: $3,600 original annual premium − $2,400 consumed = **$1,200**.
5. **Equipment**: $24,000 ÷ 48 = $500/month; 12 months = **$6,000 accumulated depreciation**.

Сумма retained earnings задана поддержанными revenue/expense facts, не рассчитана как недостающая балансировка. Нет Opening Balance Equity или unexplained suspense. Opening Balance Sheet независимо сходится на **$41,700 = $3,500 + $38,200**, debits/credits на **$47,700**.

## Подтверждения временных расхождений

| Document ID | Related document / event | Date | USD | Смысл |
| --- | --- | --- | ---: | --- |
| `CONF-RCPT-09` | `RCPT-09` / `GVL-RCPT-09` | 2026-10-02 | $1,500 | Deposit accepted September 30; subsequently posted |
| `CONF-VPAY-03` | `VPAY-03` / `GVL-VPAY-03` | 2026-10-05 | $400 | Delivered check subsequently cleared |
| `CONF-CARD-04` | `CC-04` / `GVL-CARD-04` | 2026-10-01 | $70 | September purchase subsequently posted on card |

Это тоже **TRAINING ONLY**, не доказательство из реального банка. Ограниченное расширение диапазона дат относится только к первичным opening/coverage/due/subsequent-evidence данным; даты сентябрьских проводок всегда остаются в сентябре.
