# Accounting Policies — TRAINING ONLY

Green Valley Landscaping LLC — полностью вымышленная single-member service company, USA. Dataset `GVL-2026-09-v1.0.0`, подготовлен 2026-10-15. **METHODOLOGY REVIEW PENDING** — это учебная book-accounting модель, не US GAAP opinion и не определение налогового режима LLC.

## 1. Период, точность и границы

- Reporting period: **September 1–30, 2026**; Balance Sheet / aging / reconciliation: **September 30, 2026**.
- Accounting basis: **Accrual**; bookkeeping: **double-entry**; все суммы **USD**, только integer cents. Деление в расписаниях даёт точные целые центы; скрытого округления нет.
- Работает единственный участник собственными силами: 72 service hours разовых работ и 26 maintenance visits за месяц. При длительности visits около двух часов остаётся разумный объём месяца для организации и поездок. Стоимость работ — agreed service prices, а не ставка зарплаты. Не начисляется вымышленный payroll для уменьшения прибыли.
- Payroll, Inventory, Sales Tax, income/self-employment/payroll taxes, tax filings, owner draws, loan principal/interest, bad-debt allowance, discounts, refunds, customer/vendor credits и FX **не моделируются**. Loan Payable не вводится, поскольку займа в сценарии нет.
- Sales Tax exclusion — граница пилота, **не** утверждение о необлагаемости landscaping в конкретном штате. Нет выбора штата/налогового статуса, реального EIN/SSN, bank routing/account numbers, адресов, ФИО, телефонов или реквизитов клиентов.

## 2. Revenue recognition / Accounts Receivable

- Доход признаётся при завершении согласованной услуги: **Dr Accounts Receivable / Cr service revenue**, независимо от оплаты. Никаких customer deposits до выполнения работ в наборе нет.
- Шесть Landscaping invoices: 12, 16, 14, 10, 8, 12 service hours × $150 = **$10,800**. Эти цены включают использованные расходные материалы; отдельного inventory resale или повторной выручки за материалы нет.
- Шесть Maintenance invoices: 4 × $250; 4 × $300; 4 × $200; 5 × $300; 4 × $300; 5 × $300 = **$7,200**. Все сентябрьские visits выполнены к service_end соответствующего документа. Итого **$18,000**, 12 самостоятельных invoices, без балансирующего дохода.
- Для `INV-02` выполнение 2026-09-07, invoice document date 2026-09-08. Book transaction date — 09-07; документированный completion period поддерживает начисление. Это намеренное различение дат, не дополнительная реализация 09-08.
- Terms: **net 15 от document date**, due date зафиксирована на документе. `Receive Payment`: **Dr Operating Checking / Cr AR**, с конкретным invoice ID. Частичная оплата уменьшает AR только на полученную сумму, не повторяет revenue.
- Сумма AR aging — journal balance по `open_item_id`. `Current` = due date не наступила **или равна** отчётной дате; 1–30 / 31–60 / 61–90 / >90 — дни просрочки после due date, не возраст от invoice date. Нулевые остатки показаны для полного аудиторского следа.
- Credits/write-offs = **$0** в этом наборе; просрочка сама по себе не является списанием. Политика allowance требует отдельного профессионального рассмотрения перед публикацией.

## 3. Expenses / Accounts Payable / card

- Материалы закуплены под завершённые сентябрьские работы и полностью потреблены в сентябре. Остатка Inventory нет; расходы по bills/receipts относятся к **Materials and Supplies**.
- Vendor bill: услуга получена/материалы потреблены → **Dr Expense / Cr AP**. Bill payment → **Dr AP / Cr Operating Checking**. Повторный расход при оплате запрещён. Vendor bills также net 15. Aging AP строится по тому же cutoff due date.
- Fuel, vehicle cleaning и office supplies предназначены только для business use. Private-use allocation, mileage allowance, capitalization threshold и налоговые вычеты не предполагаются.
- Card purchase: **Dr Expense / Cr Credit Card Payable** в дату покупки/потребления, а не в дату выписки. Checking не меняется. Card payment: **Dr Credit Card Payable / Cr Checking**, без нового expense.
- `CC-04`: потреблённое топливо **$70** от 09-30, posting 10-01. Expense и liability входят в сентябрь; это отдельное card timing item.
- Bank fee **$35** датирована/проведена 09-30. В эталонной книге уже есть **Dr Bank Charges / Cr Checking**. Пропуск существует только в варианте M03.

## 4. Prepaid Expenses / Adjusting Entries

| Источник | Покрытие / расчёт | На 09-01 | Платёж сентября | Expense сентября | На 09-30 |
| --- | --- | ---: | ---: | ---: | ---: |
| `POLICY-OPEN` / `ADJ-INS` | Страховка Jan–Dec 2026, исходная премия $3,600; $300/month | $1,200 | $0 | $300 | $900 |
| `DOC-SOFTWARE` / `ADJ-SOFT` | Software Sep 2026–Aug 2027, $1,200; $100/month | $0 | $1,200 | $100 | $1,100 |
| Total | Opening + additions − consumed = closing | $1,200 | $1,200 | $400 | $2,000 |

Платёж `GVL-PREPAY` создаёт asset, не expense целиком. На 09-30: Dr Insurance Expense $300 / Cr Prepaid; Dr Software Subscriptions $100 / Cr Prepaid. Новая подписка начинается в сентябре; нет расхода за месяцы до начала покрытия или пропуска первого месяца. Это straight-line monthly allocation, а не daily proration.

## 5. Equipment / contra asset

Equipment введено в эксплуатацию 2025-09-01, стоимость **$24,000**, zero residual, useful life **48 months**. Учебная **book straight-line depreciation** = **$500/month**. За Sep 2025–Aug 2026 накоплено $6,000; за September 2026 ещё $500: **Dr Depreciation Expense / Cr Accumulated Depreciation**. Net Equipment 09-30 = $24,000 − $6,500 = **$17,500**. Налоговые MACRS/bonus depreciation не рассматриваются.

## 6. Opening balances — документированный перенос, не plug

Состояние на конец 2026-08-31 переносится entry `GVL-OPEN` на начало 09-01. Предшествующие операции не добавляются в сентябрьский P&L. `OPENING_BALANCES.csv` рассчитывается из opening-entry журнала; первичная поддержка — `documents/DOCUMENTS.csv`, `opening-history.csv`, `documents/README.md`.

- Prior member contributions **$30,000** (без draws).
- Prior recognized revenue **$45,000**; prior expenses **$36,800**, включая depreciation $6,000 → **Retained Earnings $8,200**. Подробный состав expenses и независимый cash bridge приведены в документах. Это утверждённые синтетические исторические факты, а не residual от текущего баланса.
- Opening AR **$2,500**: INV-OPEN-01 $1,500 + INV-OPEN-02 $1,000; доход уже признан ранее.
- Opening AP **$1,500**: BILL-OPEN-01 $900 + BILL-OPEN-02 $600; расход уже признан ранее. Opening card liability **$2,000**, также ранее признанные расходы.
- Opening cash **$20,000**: checking $12,000 + savings $8,000. Нет opening outstanding items; суммы совпадают с prior statement evidence.
- Opening assets: $12,000 + $8,000 + $2,500 + $1,200 + $24,000 − $6,000 = **$41,700**.
- Opening liabilities **$3,500**, equity **$38,200**; **$41,700 = $3,500 + $38,200**.
- Gross opening debits **$47,700** = credits **$47,700**, difference **$0.00**. Accumulated Depreciation имеет Credit normal balance и уменьшает assets. **Opening Balance Equity не используется**.

## 7. Bank reconciliation / cutoff

- Book date = дата возникновения/получения/передачи; document date = дата первичного документа; bank posting date = дата проведения банка. Сопоставление выполняется по event ID, account, source document, posting date, amount и direction; один statement line не может закрыть две journal legs.
- Все операции открытых счетов учитываются с 09-01; выписки строго 09-01–09-30. Суммарно **25 statement transaction lines ≤ 45**, не считая metadata; двойная сторона внутреннего перевода — две строки, но одно хозяйственное событие.
- Internal transfer **$2,500** checking → savings: Dr Savings / Cr Checking; ни revenue, ни expense.
- Deposit in transit `GVL-RCPT-09` **$1,500**, book 09-30, posted 10-02; outstanding check `GVL-VPAY-03` **$400**, выдан и передан 09-30, cleared 10-05. Последующие synthetic confirmations включены в пакет, но не в сентябрьскую выписку/октябрьский журнал.
- Operating statement $15,809 + $1,500 − $400 = **$16,909 adjusted bank** = **$16,909 adjusted book**. Savings $10,500 = $10,500. Эталонная книга не требует второй записи по комиссии.
- Card statement liability $1,200 + $70 unposted charge = **$1,270 book liability**. Statement opening + charges − credits = closing; знак card liability не инвертируется как у cash account.
- Оставлять документированные timing items в книге; не создавать искусственный доход/расход для нулевой разницы.

## 8. Reports / controls / publication gate

TB — **adjusted, pre-closing**. September income/expense accounts не закрываются в Retained Earnings. Balance Sheet показывает current September Net Income **отдельно** в Equity, не удваивая его. Все reports Accrual/USD/versioned, каждый итог связан с JOURNAL.csv; aging использует также документные due dates; reconciliation — независимые выписки и подтверждения.

Machine validation отдельно проверяет source quantities, document allocations, signatures проводок, balanced entries, opening bridge, per-invoice/bill AR/AP, P&L/BS, все statement lines, timing evidence, воспроизводимость и пять wrong-ledger variants. Она **не заменяет** professional methodology review.

**Independent reviewer: not assigned. Review date/signature: absent. Status: METHODOLOGY REVIEW PENDING.** Перед публикацией независимый US bookkeeper/CPA должен проверить:

1. Completion evidence и accrual revenue, разумность цен/объёма, отсутствие double recognition.
2. Expense vs asset classification, потребление materials, business-use assumptions и отсутствие скрытого payroll/inventory.
3. Insurance/software coverage, ежемесячные releases и book depreciation.
4. Opening historical support, equity bridge, AR/AP balances/aging и отсутствие plug.
5. Deposit/check/card cutoff, fee variant, пооперационную сверку.
6. Все answer keys и исправления ошибок; ограничения tax/payroll/sales tax.

Замечания по данным/ключам → исправить внутри отдельно порученного **CP-01B.1**, перевыпустить версию и повторить gate. До этого допустимо техническое CP-01B PASS, но **не окончательное разрешение публикации**. CP-01C и runtime integration в этом checkpoint не исполняются.
