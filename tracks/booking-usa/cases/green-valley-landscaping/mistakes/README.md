# Mistake Library — TRAINING ONLY

Green Valley Landscaping LLC; dataset `GVL-2026-09-v1.0.0`; September 2026; Accrual; USD. **METHODOLOGY REVIEW PENDING.** Все варианты вымышленные и оригинальные. Эталонный `../JOURNAL.csv` **всегда остаётся правильным**.

## Воспроизводимые варианты

- `SCENARIOS.csv`: stable scenario IDs, EN term, RU explanation, original event, восемь ожидаемых report deltas, named controls и correction entry ID.
- `JOURNAL_PATCHES.csv`: `add` / `replace` / `remove` **только на копии**. У `replace` пустое поле означает «не менять»; `remove` адресует stable journal line ID; `add` создаёт явно помеченную erroneous entry.
- `CORRECTIONS.csv`: две строки исправляющего entry на сценарий, USD integer cents, source event и original invoice/bill references сохранены. Они **не входят** в canonical journal и P&L.
- `validate.py` накладывает каждый патч отдельно in memory; проверяет баланс ошибочных entries, точные последствия, обязательное срабатывание названных semantic controls и восстановление **каждого** account balance и AR/AP после correction.

Начальный эталон: Revenue $18,000; Expenses $5,601; NI $12,399; AR $6,500; AP $1,540; Checking $16,909; Savings $10,500; Card Payable $1,270.

**Все пять ошибочных вариантов остаются double-entry balanced**, TB difference = BS difference = $0.00. Поэтому «дебет равен кредиту» не доказывает правильность classification, allocation или matching.

## M01 — Duplicate bank-feed income

**English terms:** Match versus Add; Duplicate transaction; Double-counted revenue.

- **Исходная правильная операция:** `GVL-INV-01` / `INV-01`: Dr 1100 AR / Cr 4000 Revenue **$1,800**. `GVL-RCPT-01` / `RCPT-01`: Dr 1000 Checking / Cr 1100 AR **$1,800**. Invoice уже закрылся; исходная выручка признана ровно один раз.
- **Ошибочная версия:** после правильного receipt пользователь видит `ST-OPERATING-04` и выбирает Add income вместо Match. Добавляется `JE-ERR-M01`: Dr 1000 / Cr 4000 **$1,800**, с тем же receipt/event reference. Реального второго поступления нет.
- **Последствие:** Revenue **$19,800** (+$1,800), NI **$14,199** (+$1,800), Checking **$18,709** (+$1,800), Assets и Equity завышены на $1,800. AR **не меняется**: $6,500, поскольку исходный корректный receipt тоже сохранился.
- **Обнаружение:** ровно одна банковская строка `ST-OPERATING-04` должна соответствовать `GVL-RCPT-01-L01`. В книге две debit cash legs на один event; completion invoice подтверждает только $1,800 revenue. Это требуемая учебная **ошибка сопоставления**, ведущая к дубликату.
- **Правильное исправление:** `JE-FIX-M01`: Dr 4000 / Cr 1000 **$1,800**, отменить только лишнюю Add-income entry, сохранить invoice и правильный receipt. В worksheet вернуть исходное matching; в реальной системе void/reverse с audit trail, не стирать историю.
- **Русское объяснение:** входящий банковский платёж сам по себе не новая услуга. Его нужно связать с уже учтённым Receive Payment; иначе выручка и деньги удваиваются.
- **Deterministic rule:** `SOURCE_POSTINGS` — receipt должен содержать ровно исходные Dr cash/Cr AR; `BANK_MATCH` — один statement line ↔ одна действительная cash leg, без повторного event/account; `REVENUE` — source invoices = $18,000. Все три обязаны отвергнуть M01. Исправление возвращает все account balances к эталону.

## M02 — Transfer misclassified as revenue

**English terms:** Internal Transfer; Transfer Funds; Revenue misclassification.

- **Исходная операция:** `GVL-TRANSFER` / `DOC-TRANSFER` **$2,500**: Dr 1010 Savings / Cr 1000 Checking. Statement checking withdrawal `ST-OPERATING-09`; savings deposit `ST-SAVINGS-01`, posting 09-16.
- **Ошибочная версия:** credit 1000 заменён на credit 4000: **Dr Savings / Cr Revenue $2,500**. Savings entry выглядит как «поступление», но источник — собственный checking, не клиент.
- **Последствие:** Savings остаётся **$10,500**, Checking ошибочно **$19,409** (+$2,500), Revenue **$20,500**, NI **$14,899**; Assets/Equity +$2,500. AP/AR/Card не меняются.
- **Обнаружение:** withdrawal checking остался без действительной journal leg; receiving event ссылается на transfer, не invoice. P&L содержит внутреннее перемещение.
- **Правильное исправление:** `JE-FIX-M02`: Dr 4000 Revenue / Cr 1000 Checking **$2,500**; Savings второй раз не дебетовать. Одна transfer chain связывает обе банковские строки.
- **Русское объяснение:** компания лишь переложила свои деньги; Assets в сумме не должны расти и услуга никому не оказана.
- **Deterministic rule:** `SOURCE_POSTINGS` — единственная пара Dr 1010 / Cr 1000; `BANK_MATCH` — обе стороны event совпадают с выписками; `REVENUE` — ровно $18,000. M02 нарушает все три; correction восстанавливает счёт 1000 и доход, не меняя 1010.

## M03 — Unrecorded bank service charge

**English terms:** Bank service charge; Book-side adjustment; Unadjusted Book Balance.

- **Исходная операция:** `GVL-FEE` / `DOC-FEE`, 09-30: **Dr 6500 Bank Charges / Cr 1000 Checking $35**. Есть в эталоне и `ST-OPERATING-20`.
- **Ошибочная версия:** обе строки fee удалены из учебной копии; никаких иных изменений.
- **Последствие:** Checking **$16,944** (+$35), Expenses **$5,566** (−$35), NI **$12,434** (+$35), Assets/Equity +$35. AR/AP/Savings/Card/Revenue не меняются.
- **Обнаружение:** bank statement line не сопоставлена. Adjusted bank $15,809 + $1,500 − $400 = **$16,909**, но unadjusted book **$16,944**: unexplained difference **−$35 bank minus book**.
- **Правильное исправление:** `JE-FIX-M03`: Dr 6500 / Cr 1000 **$35**, после подтверждения service fee. Adjusted book = $16,944 − $35 = **$16,909**. В эталон fee **не добавлять повторно**.
- **Русское объяснение:** это пропущенная операция книги, а не timing item. Outstanding check и deposit in transit не являются расходами и не заменяют запись комиссии.
- **Deterministic rule:** `SOURCE_POSTINGS` — событие fee обязано присутствовать; `BANK_MATCH` — statement fee имеет ровно одну book leg. M03 должен быть отвергнут обоими. После correction Bank Charges = $35, Checking = $16,909, NI = $12,399.

## M04 — Credit card liability versus cash

**English terms:** Credit Card Payable; Card charge; Liability reconciliation.

- **Исходная операция:** `GVL-CARD-01` / `CC-01`, 09-06: **Dr 6000 Materials / Cr 2100 Card Payable $450.50**, posting card 09-07 (`ST-CARD-01`).
- **Ошибочная версия:** credit 2100 ошибочно заменён на credit 1000; **Dr Materials / Cr Checking $450.50**. Покупка по карте ошибочно изображена как уже оплаченная банком.
- **Последствие:** Checking **$16,458.50** (−$450.50); Card Payable **$819.50** (−$450.50). Assets и Liabilities занижены одинаково, BS по-прежнему сходится. Expenses $5,601 и NI $12,399 **не меняются**.
- **Обнаружение:** в checking statement нет такого withdrawal; в card statement есть charge без liability leg. Нельзя компенсировать расхождение expense ещё раз.
- **Правильное исправление:** `JE-FIX-M04`: **Dr 1000 Checking / Cr 2100 Credit Card Payable $450.50**. Materials расход не изменять; будущий card payment — отдельное погашение долга.
- **Русское объяснение:** кредитная карта означает, что расходы понесены, но деньги банка ещё не списаны за эту покупку. Долг и cash — разные счета.
- **Deterministic rule:** `SOURCE_POSTINGS` — card purchase кредитует только 2100; `BANK_MATCH` — card line связан с liability, checking не содержит вымышленного leg. Оба должны отказать M04; correction восстанавливает 1000/2100 без изменения P&L.

## M05 — Partial payment closes the whole invoice

**English terms:** Partial payment; Apply payment; Open invoice balance; AR control account.

- **Исходная операция:** `GVL-INV-02` **$2,400**; `GVL-RCPT-02` / `RCPT-02`, 09-12, получено **$1,400**: Dr 1000 / Cr 1100 $1,400 с `open_item_id=INV-02`. Остаток invoice **$1,000**, overdue 7 days на 09-30.
- **Ошибочная версия:** обе суммы receipt заменены на **$2,400**, чтобы закрыть invoice полностью. Реальный remittance и `ST-OPERATING-07` подтверждают только $1,400.
- **Последствие:** invoice balance ошибочно $0; общий AR **$5,500** (−$1,000), Checking **$17,909** (+$1,000). Total Assets, Revenue, Expenses, NI и Equity **не изменились**; баланс и TB не ловят эту перестановку внутри Assets.
- **Обнаружение:** per-invoice rollforward $2,400 − $1,400 = $1,000; receipt total и банковская строка не подтверждают $2,400. AR aggregate должен быть $6,500, а не $5,500.
- **Правильное исправление:** `JE-FIX-M05`: **Dr 1100 AR / Cr 1000 Checking $1,000**, сохраняя `open_item_id=INV-02`. Не создавать write-off/discount без основания и не уменьшать Revenue.
- **Русское объяснение:** статус Paid нельзя получить простым закрытием суммы invoice; нужно доказательство получения остатка. Частичная оплата не означает полное погашение.
- **Deterministic rule:** `SOURCE_POSTINGS` — receipt = source remittance $1,400; `BANK_MATCH` — точная сумма statement leg; `AR_CONTROL` — INV-02 = $1,000 и total AR = $6,500. Все три нарушены. Correction восстанавливает и контрольный счёт, и конкретный invoice, без новой revenue.

## Как завершить исправление и сверку

Counter-entries в `CORRECTIONS.csv` демонстрируют **экономический эффект исправления**, не новую эталонную книгу. Скрипт проверяет их balance, все конечные account balances, AR/AP и отчётные дельты. Они не маскируют исходные ошибочные строки под правильные документы.

После исправления учащийся обязан показать audit trail «ошибочная entry → correcting entry» и исходную действительную операцию. Для повторного fixture gate использовать нормализованную учебную копию с первоначальной правильной entry (ошибочная entry помечена отменённой/исключённой), затем заново проверить **каждый** statement line и timing evidence. Строгий canonical gate намеренно не принимает сырую смесь ошибочных и компенсирующих строк как будто это JOURNAL.csv: для reversal-chain bank matching нужен отдельный будущий runtime contract, здесь он не создаётся.

**Критерий:** не только «после исправления сошлись суммы», но и объяснены причина, affected accounts, ровно один действительный match, остаток открытого документа, восстановленные отчёты. Ни один из этих вариантов не должен попадать в исходные CSV или использоваться в ответе на другой сценарий одновременно.
