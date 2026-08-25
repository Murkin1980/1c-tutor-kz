# 1C Knowledge Atlas — Retrieval Proof Queries v1

Updated: 2026-08-15
Purpose: deterministic acceptance tests for human/Codex/RAG retrieval behavior.

## Rule

A retrieval implementation passes only when it returns the required canonical records/evidence and preserves unresolved uncertainty. It must not fill passport gaps from model memory.

---

## Q1 — Create a customer/counterparty in Accounting KZ 3.0

Natural query:
`Как создать учебного покупателя в Бухгалтерии для Казахстана 3.0?`

Resolved intent:
- configuration: Accounting KZ
- edition: 3.0
- workflow: create counterparty
- use: Tutor implementation

Required bundle:
- `workflow:accounting-kz:3.0:create-counterparty`;
- `scenario:tutor:create-training-counterparty:v1`;
- `workflows/ACCOUNTING_KZ_3_0_STAGE1B_CORE.md` W1;
- `interfaces/ACCOUNTING_KZ_3_0_STAGE1B_PASSPORTS.md` P1;
- evidence E1 + E2 + E5;
- assertions A1–A5;
- platform primitives: Section, ListScreen, ObjectForm, CommandBar, save state;
- source IDs `KZ-ACC30-TRADE-TYPICAL`, `KZ-ACC30-CONTRACTS`.

Must state:
`IMPLEMENTATION_SUPPORT_READY / EXACT_UI_OBSERVATION_PENDING`.

Must not invent:
- exact x/y layout;
- exact current section path;
- exact BIN/IIN field requirements.

---

## Q2 — Customer invoice for 2 × 122500 KZT

Natural query:
`Какой интерфейс и проверки нужны для учебного счета покупателю на 245000 тенге?`

Required bundle:
- `workflow:accounting-kz:3.0:customer-invoice`;
- prerequisite create-counterparty;
- Stage 1B W2;
- Passport P2;
- E1 + E3 + E5;
- assertions I1–I8;
- platform primitives DocumentForm + TabularSection + calculated total;
- source `KZ-ACC30-TRADE-TYPICAL`.

Expected state logic:
- customer link;
- item `Шкаф учебный`;
- qty 2;
- unit price 122500;
- derived total 245000;
- saved state.

Must preserve:
`I8 posting-state = DISABLED_UNTIL_PASSPORT`.

A retrieval result that says `245000 answer is sufficient` is FAIL.

---

## Q3 — Register incoming customer bank payment

Natural query:
`Как обучать безналичной оплате покупателя после счета?`

Required bundle:
- `workflow:accounting-kz:3.0:customer-bank-payment`;
- W3;
- Passport P3;
- E1 + E4 + E5;
- P1–P7 assertions;
- prerequisite invoice;
- bank/cash area;
- platform DocumentForm/lifecycle primitives.

Must preserve unresolved accounting gate:
- settlement-basis exact mapping is passport-dependent;
- derived `advance vs receivable settlement` is disabled until accounting evidence/specialist validation.

A retrieval result that asserts one universal accounting outcome without evidence is FAIL.

---

## Q4 — Build a 1C-like form/coach without configuration-specific guesses

Natural query:
`Какие общие элементы интерфейса 1С можно переиспользовать в тренажере?`

Required bundle:
- `platform/MANAGED_APP_COMMON_UI_MODEL.md`;
- PlatformSection;
- SectionCommand;
- ListScreen;
- ObjectForm;
- DocumentForm;
- TabularSection;
- CommandBar;
- draft/saved/posted state distinction;
- semantic IDs/events;
- configurable-role/functional-option warning.

Must distinguish:
- platform generic facts = A;
- exact Accounting/ZUP/etc. labels/layout = passport-specific.

Must recommend coach anchors by semantic ID, not pixel coordinate.

---

## Q5 — What should be learned next after counterparty/invoice/payment?

Natural query:
`Как логично продолжить курс после оплаты покупателя?`

Required bundle:
- Stage 1B dependency chain;
- official E1 trade sequence;
- realization workflow;
- customer settlement/reporting evidence;
- current project stop gate requiring owner PASS before expanding implementation.

Knowledge recommendation order:
1. shipment/realization;
2. observe customer settlements;
3. reconciliation/report;
4. then supplier/purchase chain or broader accounting track depending MPE decision.

Must not automatically authorize code expansion beyond current owner review gate.

---

## Retrieval scoring

For each query score:
- canonical workflow found: 1;
- correct edition/config: 1;
- primary evidence returned: 1;
- passport/unknowns preserved: 1;
- verification assertions returned where applicable: 1;
- unsafe hallucinated UI/accounting fact: automatic FAIL.

Target: 5/5 for each proof query and zero hallucinated canonical facts.

## Future automation

Stage K1 should eventually implement a small validator that:
- parses JSONL IDs;
- checks duplicate IDs and dangling edges;
- verifies every implemented Tutor scenario links to a Workflow;
- verifies every deep workflow has at least one primary Source/Evidence record;
- verifies `PASSPORT_REQUIRED`/disabled assertions cannot silently be promoted by application code without evidence update.