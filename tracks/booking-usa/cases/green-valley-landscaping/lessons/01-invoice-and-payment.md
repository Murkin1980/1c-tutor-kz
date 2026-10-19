# Lesson 01 — Customer Invoice and Payment — TRAINING ONLY

ID: `booking-usa-gvl-01`; dataset `GVL-2026-09-v1.0.0`; RU instruction / EN terms; USD; Accrual; September 2026. Estimated 40 minutes. Status: content fixture, **METHODOLOGY REVIEW PENDING**. Авторский synthetic worksheet; не подключён к runtime. QBO controls ниже — терминология, не проверенный UI walkthrough/version.

## Цель

Научиться признавать выручку за завершённую услугу, видеть **Accounts Receivable**, применять **Receive Payment** к существующему **Invoice** и оставлять правильный остаток после частичной оплаты. Наблюдаемый результат: две invoice/payment chains, AR по каждому документу, объяснение отличия revenue от cash.

## English terms

Invoice; Customer; Service completion; Accrual basis; Accounts Receivable (AR); Receive Payment; Apply payment; Partial payment; Open balance; Due date; Paid; Overdue; Match.

## Исходные документы

В `../documents/DOCUMENTS.csv` одна строка = один документ. Читайте `../ACCOUNTING_POLICIES.md` §§1–2 и реестр `../TRANSACTIONS.csv`.

| Document / event | Book date | Document date | Bank posting | Содержание |
| --- | --- | --- | --- | --- |
| INV-02 / GVL-INV-02 | 2026-09-07 | 2026-09-08 | — | 16 service hours × $150 = $2,400; completion 09-07; due 09-23 |
| RCPT-02 / GVL-RCPT-02 | 2026-09-12 | 2026-09-12 | 2026-09-14 | Оплата INV-02 $1,400 |
| INV-06 / GVL-INV-06 | 2026-09-23 | 2026-09-23 | — | 12 service hours × $150 = $1,800; due 10-08 |
| RCPT-06 / GVL-RCPT-06 | 2026-09-25 | 2026-09-25 | 2026-09-28 | Оплата INV-06 $1,000 |

Счета: `1000 Checking`, `1100 AR`, `4000 Landscaping Service Revenue`. Никаких налогов, sales tax или реальных клиентов. Полный эталон месяца в JOURNAL.csv **не изменять**.

## Инструкция

1. Создайте пустой worksheet для **этих четырёх событий**, не вторую полную книгу. Либо используйте отдельно разрешённую учебную среду, если доступ/права уже проверены вне CP-01B. Не вводите реальные данные и credentials; не предполагайте, что QBO demo сохраняет сессию.
2. Прочитайте completion evidence INV-02. Отдельно выпишите document date, transaction date и due date. Датой recognition используйте 09-07, даже если документ выпущен 09-08.
3. Создайте единственный Invoice INV-02 на $2,400, customer TRAIN-CUST-02, revenue 4000. Покажите обе стороны проводки. Банковского движения пока нет.
4. Примените RCPT-02 **$1,400** к INV-02: Receive Payment, а не новая Sales Receipt/Income. Укажите receipt date 09-12; bank posting 09-14 будет использоваться только при matching.
5. Покажите INV-02 status partially paid, open balance $1,000. Не нажимайте условное «Paid», не создавайте write-off, discount или фиктивный второй платёж.
6. Повторите цикл с **другими данными того же набора**: INV-06 / RCPT-06. Это повторная практика, не дополнительная реализация поверх уже загруженного эталона.
7. Сверьте worksheet: invoice revenue $4,200, receipts $2,400, closing AR этих двух invoices $1,800. Затем найдите эти же документы в полном `AR_AGING.csv` и объясните, почему total AR всего месяца больше.
8. Запишите RU объяснение с English terms: «Invoice creates revenue and AR; Receive Payment reduces AR, not revenue». Проверяйте числом/проводками, а не скриншотом или самоподтверждением.

## Ожидаемые проводки и суммы

| Event | Debit | Credit | USD |
| --- | --- | --- | ---: |
| GVL-INV-02 | 1100 Accounts Receivable | 4000 Landscaping Service Revenue | $2,400 |
| GVL-RCPT-02 | 1000 Operating Checking | 1100 Accounts Receivable | $1,400 |
| GVL-INV-06 | 1100 Accounts Receivable | 4000 Landscaping Service Revenue | $1,800 |
| GVL-RCPT-06 | 1000 Operating Checking | 1100 Accounts Receivable | $1,000 |

Каждое entry balanced. В JOURNAL обе строки invoice и receipt имеют соответствующий `open_item_id`. Revenue возникает только в двух invoice events. Ни Savings, ни AP, ни Credit Card Payable не изменяются от этих событий.

## Подсказки

1. Сначала выясните, выполнена ли услуга. Получение денег не обязательно совпадает с recognition.
2. AR — asset: Invoice увеличивает его по дебету; receipt уменьшает по кредиту.
3. Сумма к применению берётся из remittance, не из полной суммы invoice: $2,400 − $1,400 = $1,000.

## Типичные ошибки

- Receipt кредитует Revenue вместо AR или повторно добавляется из bank feed: двойная выручка, неправильный AR/cash. См. M01.
- Receipt на $1,400 записан как $2,400 для статуса Paid: Checking завышен на $1,000, AR занижен на $1,000. TB всё ещё сходится. См. M05.
- Использование bank posting date 09-14 вместо completion/receipt date; утрата связи документов.
- Повторное внесение операций при чтении уже заполненного JOURNAL. Эталон — read-only; практика выполняется отдельно.

## Проверочные задания

1. В какие даты и на какие суммы признаётся revenue по INV-02 и INV-06? Изменяется ли revenue при RCPT-02/06?
2. Покажите обе проводки для INV-02/RCPT-02 и точный остаток.
3. Найдите unpaid amounts по INV-06 и aging bucket обоих invoices на 09-30. На сколько дней просрочен INV-02?
4. Рассчитайте revenue, cash increase и AR этих **двух** chains, не всего месяца.
5. В полном наборе Opening AR $2,500, invoices $18,000, receipts $14,000, credits/write-offs $0. Какой Closing AR? Почему receipt открытия не становится revenue сентября?
6. Контрпример: invoice INV-07 $1,000, RCPT-07 $1,000. Какой remaining balance и дополнительная revenue от receipt?
7. Объясните M05: почему Assets = Liabilities + Equity может всё ещё выполняться при ошибочном закрытии частичной оплаты?

## Answer key

1. Revenue INV-02: **09-07 $2,400**, INV-06: **09-23 $1,800**. При обоих receipts Revenue change **$0**. Invoice INV-02 document date 09-08 не вызывает второе recognition.
2. Dr 1100 / Cr 4000 $2,400; затем Dr 1000 / Cr 1100 $1,400; AR INV-02 **$1,000**. Дебет и кредит каждого entry равны своей сумме.
3. INV-06 **$800**, due 10-08, Current. INV-02 **$1,000**, due 09-23, **7 days overdue**, bucket 1–30. Это aging по due date, не по дате создания.
4. Two-chain Revenue **$4,200**; cash increase **$2,400**; AR **$1,800**. Это не closing checking всего месяца; собственные opening balances и другие события сюда не добавлялись.
5. $2,500 + $18,000 − $14,000 − $0 = **$6,500**. Opening revenue уже включён в предшествующую прибыль; поступление по INV-OPEN-01 только погашает перенесённый AR.
6. INV-07 remaining **$0**; receipt revenue **$0**. Сама Invoice признала Maintenance Service Revenue $1,000.
7. В M05 ошибочный receipt $2,400 вместо $1,400 переместил лишнюю $1,000 из AR в Checking. Total Assets не изменился, но две статьи и конкретный invoice неверны. Source remittance и per-invoice/bank controls находят ошибку, balance equation — нет.

Детальные все-month entries и контрольная таблица: `../ANSWER_KEY.md`; машинные правила: SOURCE_POSTINGS, REVENUE, AR_CONTROL, BANK_MATCH в `../validate.py`. Никакого автоматического наблюдения за действиями в QBO эти проверки не обещают.

## Критерии успешности

- 4 entries и 8 debit/credit lines без ошибки в account, amount или reference; каждый entry difference $0.
- Все 7 проверочных ответов верны; $1,000 и $800 остаются открытыми, ageing 7 days/Current объяснён.
- Нет revenue от receipts, необоснованных write-offs, двойного invoice или реальных персональных данных.
- Учащийся предъявляет worksheet/числовые ответы и RU объяснение, получает обратную связь, исправляет ошибку и повторяет на INV-06. Screenshot alone не считается подтверждением правильности.
- Результат можно вручную сверить с immutable JOURNAL/aging и затем выполнить локальный fixture gate. Runtime/progress интеграция отложена до отдельного согласования.
