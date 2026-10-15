# Lesson 03 — Month-End Reporting — TRAINING ONLY

ID: `booking-usa-gvl-03`; dataset `GVL-2026-09-v1.0.0`; period 2026-09-01–2026-09-30; as of 2026-09-30; Accrual; USD. Estimated 60 minutes. Content fixture only; **METHODOLOGY REVIEW PENDING**. Нет runtime integration и утверждения о текущем UI сторонних программ.

## Цель

Закрыть учебный месяц с документированными adjustments, получить **Trial Balance**, **Profit and Loss**, **Balance Sheet**, **AR/AP Aging** и доказать их согласованность с General Ledger и reconciliation. Наблюдаемый результат — отчётный пакет с формулами, references и нулевыми control differences, а не картинка отчёта.

## English terms

Month-end Close; Adjusting Entry; Prepaid Expense; Straight-line Depreciation; Accumulated Depreciation; Contra Asset; General Journal; General Ledger; Trial Balance; Profit and Loss (P&L); Net Income; Balance Sheet; Retained Earnings; Current-period earnings; AR/AP Aging; Accrual.

## Исходные документы

- `../ACCOUNTING_POLICIES.md`, `../CHART_OF_ACCOUNTS.csv`, source packet и immutable `../JOURNAL.csv`.
- `POLICY-OPEN`: оставшиеся Sep–Dec insurance $1,200 ($300/month).
- `DOC-SOFTWARE`: Sep 2026–Aug 2027 annual subscription $1,200 ($100/month), уже оплачена и капитализирована в Prepaid.
- `ASSET-OPEN`: equipment $24,000, 48 months, zero residual; opening accumulated depreciation $6,000.
- Adjustment evidence: `ADJ-INS`, `ADJ-SOFT`, `ADJ-DEPR`, все 09-30.
- Для самостоятельного close используйте копию **без трёх GVL-ADJ-* entries**, но со всеми прочими правильными событиями, включая bank fee. Все ошибки M01–M05 в этом упражнении выключены.
- Полный JOURNAL уже содержит adjustments: если просто строите его отчёты, второй раз их **не проводите**.

## Инструкция

1. Укажите reporting period / as-of / Accrual / USD / version. Отделите opening entry GVL-OPEN от September turnovers. Проверьте документированный opening bridge и contra asset.
2. На pre-adjustment copy посчитайте потреблённую страховку и software; рассчитайте depreciation. Внесите ровно три корректирующие проводки ниже. Не расходуйте всю предоплату и не списывайте equipment cost целиком.
3. Разнесите журнал в GL по account code; для каждой строки сохраните event, source document, open_item_id, дату, debit/credit и running debit-minus-credit balance. Отрицательный running balance liability — нормальный credit balance.
4. Составьте adjusted, **pre-closing** Trial Balance. Объясните, почему retained earnings остаётся $8,200, хотя September прибыль $12,399. Не добавляйте фиктивный closing entry только для уравнивания.
5. Составьте P&L только из **September Income/Expense movements**, исключая opening. Раскройте расходы по счетам; проверьте Revenue − Expenses = NI.
6. Составьте BS с contra asset: Equipment gross − Accumulated Depreciation. В Equity отдельно добавьте Current September Net Income; не добавляйте его дважды.
7. Сформируйте AR/AP aging по due dates и open_item_id. Сравните total с control account и source rollforward, а не только с красивой колонкой Total.
8. Согласуйте cash/card с Lesson 02. Финансовая прибыль не равна изменению банковских денег: есть AR/AP, prepaids, depreciation и card liability.
9. **Повторная практика:** восстановите материалы $3,150.50 из BILL-01, BILL-03 и CC-01; затем independently восстановите fuel $416.10 из EXP-FUEL, CC-02, CC-04. Сверьте суммы со своими GL/P&L, не создавая новых расходов.
10. Сверьте ручные результаты с CSV и выполните local `validate.py --check`. Ошибку ищите у source event; не редактируйте производные отчёты для получения зелёного gate.

## Ожидаемые проводки и суммы

| Entry | Debit | Credit | USD | Основание |
| --- | --- | --- | ---: | --- |
| GVL-ADJ-INS | 6300 Insurance Expense | 1300 Prepaid Expenses | $300 | $1,200 / 4 remaining months |
| GVL-ADJ-SOFT | 6400 Software Subscriptions | 1300 Prepaid Expenses | $100 | $1,200 / 12 months |
| GVL-ADJ-DEPR | 6800 Depreciation Expense | 1590 Accumulated Depreciation | $500 | $24,000 / 48 months |

Pre-adjustment Expenses **$4,701**, NI **$13,299**. После $900 adjustments: Expenses **$5,601**, NI **$12,399**. Prepaid $2,400 → **$2,000**, Accumulated Depreciation $6,000 → **$6,500**, net Equipment **$17,500**. Cash не меняется ни в одной из трёх корректировок.

## Подсказки

1. Balanced entry не означает правильно выбранные счета. Проверяйте документ, период потребления и debit/credit direction.
2. TB total — сумма **конечных** debit/credit balances, а не всех journal turnovers.
3. В BS net income — составляющая equity. В TB до closing entries income/expenses ещё на своих счетах, их не нужно дублировать в Retained Earnings.

## Типичные ошибки

- Смешаны opening revenue/expenses с September; $8,200 prior retained earnings повторно отнесены к выручке.
- Software $1,200 полностью списан в expense вместо $100; depreciation $500 пропущена либо прибавлена к Equipment вместо contra asset.
- BS использует Equipment $24,000, игнорируя contra account, или вычитает accumulated depreciation два раза.
- Net Income включён одновременно в Retained Earnings и Current-period earnings.
- TB принимается за достаточную проверку; transfer/duplicate receipt/card misclassification из библиотеки ошибок могут оставаться balanced.
- Непросроченный balance по invoice отнесён в 1–30 лишь по возрасту документа, а не due date.

## Проверочные задания

1. Рассчитайте все три adjustments и ending Prepaid / Accumulated Depreciation / net Equipment.
2. Каковы opening debit/credit total, September journal debit/credit total и adjusted TB ending debit/credit total? Чем отличаются эти величины?
3. Постройте P&L с разбивкой восьми expense accounts и двумя revenue accounts; найдите Net Income.
4. Рассчитайте Assets, Liabilities, Equity (с раскрытием current income) и difference. Покажите cash, AR, prepaid и net Equipment.
5. Сверьте AR/AP rollforward и aging buckets. Назовите просроченный opening invoice и частично оплаченный September bill.
6. Согласуйте BS cash/card с adjusted bank/card balances. Чему равно изменение cash двух банков и почему оно не равно NI?
7. Объясните на M04 или M05, почему нулевой TB difference недостаточен; назовите конкретный дополнительный control.

## Answer key

1. Insurance **$300**, software **$100**, depreciation **$500**, каждый balanced. Ending Prepaid **$2,000** = insurance $900 + software $1,100; AccumDep **$6,500**, net Equipment **$17,500**. Все основаны на policies, а не на сумме, необходимой для баланса.
2. Opening debits/credits **$47,700 / $47,700**. September (без opening) journal debits/credits **$46,351 / $46,351**. All journal debits/credits **$94,051 / $94,051**. Adjusted TB ending debit/credit balances **$65,510 / $65,510**, difference **$0**. Journal turnovers суммируют движения, TB net balances по счетам.
3. Landscaping **$10,800** + Maintenance **$7,200** = Revenue **$18,000**. Expenses: Materials **$3,150.50**, Fuel **$416.10**, Vehicle **$770.25**, Insurance **$300**, Software **$100**, Bank Charges **$35**, Office **$329.15**, Depreciation **$500** = **$5,601**. NI = $18,000 − $5,601 = **$12,399**. Материалы: $1,800 + $900 + $450.50; fuel: $185.75 + $160.35 + $70.
4. Assets: Checking **$16,909** + Savings **$10,500** + AR **$6,500** + Prepaid **$2,000** + Equipment **$24,000** − AccumDep **$6,500** = **$53,409**. Liabilities: AP **$1,540** + Card **$1,270** = **$2,810**. Equity: Member Contributions **$30,000** + Retained Earnings **$8,200** + September NI **$12,399** = **$50,599**. $53,409 − $2,810 − $50,599 = **$0**.
5. AR: $2,500 + $18,000 − $14,000 − $0 = **$6,500**; buckets Current **$4,500**, 1–30 **$1,000**, 31–60 **$1,000**, остальные $0. INV-OPEN-02 due 08-15: **46 days overdue**, $1,000. AP: $1,500 + $3,590 − $3,550 − $0 = **$1,540**; Current **$740**, 1–30 **$800**, остальные $0. BILL-01 due 09-17: $1,800 − $1,000 = **$800**, 13 days overdue; BILL-03 current $500, BILL-04 current $240.
6. Adjusted checking **$16,909**, savings **$10,500**, card liability **$1,270**, all differences **$0**. Ending bank cash $27,409 − opening $20,000 = **$7,409 increase**, не $12,399 NI. Например AR признан без оплаты, prepay payment не expense целиком, depreciation noncash, AP/card имеют неоплаченные расходы. Это объяснение, не заявленный Cash Flow Statement.
7. M04 уменьшает Checking и Card Payable одинаково на $450.50 при неизменном NI, TB/BS сходятся: нужен card/bank line matching. M05 завышает Checking и занижает AR на $1,000: total Assets не меняется, но нужен per-invoice/source remittance AR_CONTROL. Одна лишь balance equation ошибок не обнаружит.

Полная таблица конечных balances и AR/AP documents: `../ANSWER_KEY.md`; производные отчёты и `../VALIDATION_REPORT.md`. Учётная методология остаётся на независимом review, машинный PASS не заменяет signoff.

## Критерии успешности

- Три adjustments из расчётных schedule, без повторного ввода в full canonical Journal; cash change от adjustments $0.
- Каждый entry balanced; TB $65,510/$65,510; revenue $18,000; NI $12,399; BS $53,409/$53,409, все differences $0.00.
- AR/AP total и buckets согласованы с конкретными invoices/bills, cash/card с line-level reconciliation.
- Все 7 ответов содержат формулу и source reference; преподаватель видит источник неправильной суммы и даёт адресную обратную связь.
- Учащийся повторяет восстановление другого expense account, исправляет найденную ошибку и предъявляет проверяемые отчёты/числа, не self-confirm или screenshot alone.
- Не делаются выводы о налогах, CPA certification или готовности runtime. Следующий checkpoint требует отдельного разрешения.
