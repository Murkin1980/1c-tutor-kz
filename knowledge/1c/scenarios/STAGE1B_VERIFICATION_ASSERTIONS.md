# Stage 1B — Verification Assertions

Updated: 2026-08-15
Purpose: canonical state checks for Tutor practical completion.

## Rule

A practical accounting lesson is completed by environment state, never by an answer string alone.

Each assertion has:
- stable ID;
- reads;
- expected condition;
- learner-facing failure text;
- authority status.

---

## Scenario S1 — Create training counterparty

Scenario: `scenario:tutor:create-training-counterparty:v1`
Workflow: `workflow:accounting-kz:3.0:create-counterparty`

### A1 — saved counterparty exists
ID: `assert:counterparty:exists`
Reads: `TrainingCounterparty[]`
Expected: exactly one active scenario record matches the scenario identity.
Failure: `Учебный контрагент пока не создан.`
Authority: Tutor deterministic domain rule.

### A2 — expected name
ID: `assert:counterparty:name`
Reads: `TrainingCounterparty.name`
Expected: normalized value equals `ТОО Учебный Покупатель`.
Failure: `Проверьте название контрагента.`
Authority: Tutor scenario data.

### A3 — expected city
ID: `assert:counterparty:city`
Reads: `TrainingCounterparty.city`
Expected: `Кызылорда`.
Failure: `Проверьте город в карточке.`
Authority: Tutor scenario data.

### A4 — saved state
ID: `assert:counterparty:saved`
Reads: object lifecycle state.
Expected: record persisted to scenario state, not only draft form state.
Failure: `Карточка заполнена, но ещё не сохранена.`
Authority: Tutor learning rule; UI command mapping comes from passport.

### A5 — training-only identifiers
ID: `assert:counterparty:safe-identifier`
Reads: identifier fields/event log.
Expected: no real-looking user-provided BIN/IIN accepted; only seeded/generated training-safe identifier or blank where scenario permits.
Failure: `В учебном тренажёре нельзя использовать реальные ИИН/БИН.`
Authority: FOUNDATION safety rule.

Completion: A1–A5 PASS.

---

## Scenario S2 — Customer invoice

Scenario: `scenario:tutor:customer-invoice:v1`
Workflow: `workflow:accounting-kz:3.0:customer-invoice`

### I1 — invoice exists
ID: `assert:invoice:exists`
Expected: scenario invoice object persisted.
Failure: `Счёт покупателю ещё не создан.`

### I2 — correct customer
ID: `assert:invoice:customer`
Expected: invoice.counterpartyId points to S1 counterparty.
Failure: `Выбран не тот покупатель.`

### I3 — required line
ID: `assert:invoice:item`
Expected: required line contains `Шкаф учебный`.
Failure: `Добавьте учебную позицию «Шкаф учебный».`

### I4 — quantity
ID: `assert:invoice:quantity`
Expected: quantity = 2.
Failure: `Количество должно быть 2.`

### I5 — unit price
ID: `assert:invoice:unit-price`
Expected: 122500 KZT.
Failure: `Проверьте цену за единицу.`

### I6 — calculated total
ID: `assert:invoice:total`
Expected: calculated total = 245000 KZT from line state.
Failure: `Итог счёта должен получиться из строк документа — 245 000 ₸.`
Important: a standalone submitted number never satisfies I6.

### I7 — saved document state
ID: `assert:invoice:saved`
Expected: persisted state reached.
Failure: `Счёт заполнен, но не сохранён.`

### I8 — posting state
ID: `assert:invoice:posting-state`
Status: DISABLED_UNTIL_PASSPORT
Reason: do not invent whether/how this invoice object posts in selected Accounting KZ build.

Completion before passport: I1–I7 PASS; I8 not evaluated.

---

## Scenario S3 — Customer non-cash payment

Scenario: `scenario:tutor:customer-bank-payment:v1`
Workflow: `workflow:accounting-kz:3.0:customer-bank-payment`

### P1 — incoming payment exists
ID: `assert:payment:exists`
Expected: persisted incoming payment object exists.
Failure: `Поступление оплаты от покупателя ещё не зарегистрировано.`

### P2 — direction/type
ID: `assert:payment:incoming-customer`
Expected: Tutor domain type = incoming non-cash customer payment.
Failure: `Нужна входящая безналичная оплата от покупателя.`

### P3 — customer
ID: `assert:payment:customer`
Expected: same training counterparty as invoice.
Failure: `Проверьте плательщика.`

### P4 — amount
ID: `assert:payment:amount`
Expected: 245000 KZT.
Failure: `Проверьте сумму оплаты.`

### P5 — saved/registered state
ID: `assert:payment:registered`
Expected: persisted required lifecycle state according to passport mapping.
Failure: `Платёж заполнен, но не зарегистрирован.`

### P6 — settlement basis relation
ID: `assert:payment:settlement-basis`
Status: CONDITIONAL_PASSPORT
Expected: link to expected contract/invoice/settlement basis if canonical Accounting KZ workflow requires it for selected scenario.

### P7 — derived settlement result
ID: `assert:payment:settlement-result`
Status: DISABLED_UNTIL_ACCOUNTING_EVIDENCE
Reason: whether this creates an advance or closes a receivable depends on scenario/order of accounting events and must be methodically validated.

Completion before methodical evidence: P1–P5 PASS plus P6 only when passport requires it; P7 informational/disabled.

---

## Scoring / assistance

Practical correctness and assistance are separate dimensions.

Store:
- `result = pass|fail` from assertions;
- `assistanceLevel = none|hint1|hint2|show-action`;
- `mode = demo|guided|test`;
- `attemptCount`;
- failed assertion IDs.

A learner may eventually reach a correct state after hints; that is still a correct practice result but not an unassisted mastery result.

## Feedback order

On check:
1. show all high-level PASS/FAIL assertions;
2. reveal the first actionable failed condition;
3. do not reveal future steps automatically;
4. `Подсказка` may progressively expose more detail;
5. `Показать действие` is unavailable in Independent Test unless the user explicitly exits/marks the attempt assisted.