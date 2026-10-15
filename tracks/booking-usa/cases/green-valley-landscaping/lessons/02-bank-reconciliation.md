# Lesson 02 — Bank Reconciliation — TRAINING ONLY

ID: `booking-usa-gvl-02`; dataset `GVL-2026-09-v1.0.0`; September 2026, as of 2026-09-30; Accrual; USD. Estimated 50 minutes. Status: content fixture, **METHODOLOGY REVIEW PENDING**. Термины controls не являются актуальным проверенным QBO UI walkthrough.

## Цель

Сверить **конкретные операции** checking, savings и card; отличить book-side error от timing difference; найти пропущенную комиссию и не удвоить customer payment при matching. Наблюдаемый результат — три reconciliation schedules с нулевой необъяснённой разницей и полным журналом соответствий.

## English terms

Bank Reconciliation; Statement period; Beginning/Ending balance; Posting date; Cleared; Outstanding check; Deposit in transit; Bank service charge; Adjusted Bank Balance; Adjusted Book Balance; Match versus Add; Credit Card Payable; Unposted charge; Reconcile.

## Исходные документы

- `../statements/operating-checking.csv`: 20 линий; opening **$12,000**, deposits **$12,500**, withdrawals **$8,691**, closing **$15,809**.
- `../statements/savings.csv`: 1 линия; opening **$8,000**, deposit **$2,500**, withdrawal **$0**, closing **$10,500**.
- `../statements/credit-card.csv`: 4 линии; **liability positive**, opening **$2,000**, charges **$700**, credits/payment **$1,500**, closing **$1,200**.
- `../JOURNAL.csv`, `../TRANSACTIONS.csv`, `../OUTSTANDING_ITEMS.csv`, `../documents/DOCUMENTS.csv`.
- Timing evidence: RCPT-09/CONF-RCPT-09 $1,500, VPAY-03/CONF-VPAY-03 $400, CC-04/CONF-CARD-04 $70.
- Для первой задачи — **только изолированный вариант M03**, где из копии JOURNAL удалены обе строки GVL-FEE. Тогда unadjusted book checking **$16,944**, а не $16,909. Источники никогда не исправлять в месте хранения.

## Инструкция

1. Обозначьте September 1–30, 2026 / Accrual / USD / dataset version. Создайте отдельную matching worksheet: statement line → journal line → event → source document → posting date → signed amount → status.
2. Пересчитайте opening + deposits − withdrawals каждой банковской выписки. Для card используйте opening + charges − credits. Не приравнивайте card liability к активу и не меняйте знак платежа.
3. Сопоставьте checking lines с **одной действительной book leg** каждая. По GVL-TRANSFER сопоставьте checking withdrawal и savings deposit отдельно, с одним source event. По GVL-CARDPAY сопоставьте bank withdrawal 09-21 и card credit 09-22, хотя book date — 09-18.
4. Найдите statement fee `ST-OPERATING-20` $35 без book entry в варианте M03. Подтвердите DOC-FEE; это **book adjustment**, не outstanding item. Запишите Dr Bank Charges / Cr Checking $35.
5. Расследуйте book items без September statement line. RCPT-09 $1,500 поступил 09-30, подтвердился 10-02: deposit in transit. VPAY-03 $400 выдан и передан поставщику 09-30, cleared 10-05: outstanding check. Свяжите каждый с confirmation; не исключайте эти операции из книги.
6. Составьте adjusted bank и adjusted book schedules. Если применяете canonical JOURNAL (fee уже есть), повторную fee запись не делайте.
7. **Повторная практика:** самостоятельно сверяйте Savings и Card. У card добавьте $70 September unposted charge к statement liability $1,200; отсутствие этой charge в выписке не отменяет сентябрьский expense.
8. **Отдельный вариант M01, не вместе с M03:** банковская строка `ST-OPERATING-04` уже связана с RCPT-01. Объясните, почему Match, а не Add income; покажите, какие две статьи завысит дубликат.
9. Сверьте все IDs с таблицей `../RECONCILIATION.md`. Сдайте не только три итога, но и полный список 25 matches + 3 evidenced timing items + 0 unexplained differences.

## Ожидаемые проводки и суммы

| Ситуация | Debit | Credit | USD | Нужно ли новое entry? |
| --- | --- | --- | ---: | --- |
| Только M03: missing fee | 6500 Bank Charges | 1000 Checking | $35 | Да; в эталоне уже есть |
| Existing transfer GVL-TRANSFER | 1010 Savings | 1000 Checking | $2,500 | Нет, только Match |
| Existing card payment GVL-CARDPAY | 2100 Card Payable | 1000 Checking | $1,500 | Нет, только Match |
| Deposit in transit GVL-RCPT-09 | 1000 Checking | 1100 AR, INV-10 | $1,500 | Нет, уже book receipt |
| Outstanding check GVL-VPAY-03 | 2000 AP, BILL-03 | 1000 Checking | $400 | Нет, уже bill payment |
| Unposted card charge GVL-CARD-04 | 6100 Fuel | 2100 Card Payable | $70 | Нет, уже September charge |

Timing items корректируют reconciliation schedule, **не** создают повторные entries. При работе с M03 единственное новое entry — fee.

## Подсказки

1. Начните с формулы выписки, затем сверяйте события. Равный ending balance может скрывать две встречные ошибки.
2. Банковская разница и бухгалтерская корректировка — разные стороны schedule. Deposits in transit добавляются к bank balance, outstanding checks вычитаются.
3. У карты charge увеличивает liability, payment уменьшает. Здесь $1,200 + $70 = $1,270, не $1,130 и не −$1,270.

## Типичные ошибки

- Outstanding check назван expense второй раз, deposit in transit исключён из AR/cash, fee спрятана как timing.
- Fee внесена поверх правильной canonical entry: повторное уменьшение cash/NI на $35.
- Receipt RCPT-01 повторно Add income из feed (M01) или transfer классифицирован как income (M02).
- Credit card charge уменьшает checking (M04); card payment повторно списан в expense.
- Отчёт принят из-за совпадения остатка без 25 individual matches и evidence дат следующего месяца.

## Проверочные задания

1. Пересчитайте closing каждого statement из opening/increases/decreases.
2. Покажите checking adjusted bank с двумя timing items и знаками. Почему сумма не $14,709?
3. Для M03 рассчитайте unadjusted book, adjustment, adjusted book, difference bank minus book до и после fee.
4. Назовите event, source document, subsequent date и confirmation каждого timing item. Какие записи делать в сентябре повторно?
5. Сверьте Savings и card liability отдельно, объясните card sign.
6. Сколько cleared statement lines сопоставляется и сколько timing items осталось? Есть ли unexplained items?
7. Для M01 покажите правильную cash leg и ошибочную Add-income entry; определите влияние на checking, revenue и NI. Что проверять, если итог «случайно» сошёлся?

## Answer key

1. Operating: $12,000 + $12,500 − $8,691 = **$15,809**. Savings: $8,000 + $2,500 − $0 = **$10,500**. Card: $2,000 + $700 − $1,500 = **$1,200 liability**.
2. Adjusted bank = $15,809 **+ $1,500 − $400 = $16,909**. Неверные $14,709 получаются при обратных знаках timing items.
3. M03: unadjusted book **$16,944**; Dr 6500 / Cr 1000 **$35**; adjusted book **$16,909**. Bank minus unadjusted book = **−$35**; после fee **$0**. Canonical book изначально $16,909; для него book adjustment **$0**.
4. Deposit: GVL-RCPT-09 / RCPT-09 → **10-02 CONF-RCPT-09 $1,500**. Check: GVL-VPAY-03 / VPAY-03 → **10-05 CONF-VPAY-03 $400**. Card: GVL-CARD-04 / CC-04 → **10-01 CONF-CARD-04 $70**. Повторных entries **нет**. У invoice INV-10 и BILL-03 уже отражены соответствующие receipt/payment allocations.
5. Savings adjusted bank/book **$10,500**, difference **$0**, нет timing. Card statement **$1,200 + $70 = $1,270** = book liability; difference **$0**. Card credits $1,500 — это payment, не revenue/отрицательный expense.
6. **20 checking + 1 savings + 4 card = 25 lines**, каждая matched exactly once; **3** документированных book-side timing items, из них 2 bank и 1 card; **0 unexplained**. Новых September statement lines для timing не придумывать.
7. `ST-OPERATING-04` → `GVL-RCPT-01-L01`, Dr Checking $1,800. Original invoice уже создал $1,800 revenue; receipt уменьшил AR. Лишняя Dr Checking / Cr Revenue $1,800 завышает Checking до **$18,709**, Revenue до **$19,800**, NI до **$14,199**. Отменить лишнюю entry; сохранить исходный match. Проверять source/event uniqueness, amounts, dates, directions и coverage, даже при нулевом aggregate difference.

Все line-by-line matches: `../RECONCILIATION.md`; formulas и машинные checks BANK_MATCH / STATEMENT_ARITHMETIC / TIMING / BANK_RECONCILIATION: `../validate.py`. Аудит исправлений не подменять стиранием исходной истории.

## Критерии успешности

- Все 25 matches указаны без дубликатов и все три timing items подтверждены документами/датами.
- Все три statement arithmetic equations и adjusted balances точны до цента, reconciliation differences **$0.00**.
- Единственная fee entry внесена только в M03, знаки карты и timing верны, transfer/card payment не признаны revenue/expense.
- Все 7 заданий выполнены и объяснены; учащийся способен показать, почему matching failure не исправляется фиктивной балансировкой.
- Возврат в существующий lesson loop концептуальный: сдача worksheet/чисел → конкретная обратная связь → исправление → повтор на Savings/Card. Ни screenshot, ни self-confirm не выдаются за machine verification действий в банке/QBO.
