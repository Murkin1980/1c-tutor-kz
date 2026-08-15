# ROADMAP — 1C Tutor KZ

Обновлено: 2026-08-15 после MPE pivot.

## North Star

Пользователь должен научиться выполнять бухгалтерский процесс в безопасной интерактивной среде и доказать навык через состояние этой среды, а не через тестовый ответ.

## Постоянный слой — 1C Knowledge Atlas

`knowledge/1c/` является source of truth для знаний об интерфейсах, конфигурациях, версиях, объектах, командах и workflow.

Правило каждой реализации:
`retrieve Atlas → identify gap → bounded ingestion → implement → link scenario back to Atlas`.

Интернет не должен заново исследоваться для уже описанного workflow.

## Stage 0 — Pivot foundation — DONE

- [x] выявлена зависимость от платного 1C:Fresh;
- [x] выявлена ложная practical verification через quiz answers;
- [x] owner approved deep change;
- [x] выбран EXTEND_EXISTING;
- [x] встроенная Training Workspace стала core MVP;
- [x] закреплены Demo/Guided/Test, contextual coach, isolated playground, state verification;
- [x] переписаны foundation/product/architecture/data/coder docs;
- [x] создан каркас `1C Knowledge Atlas`.

## Stage 1B.1 — Counterparty vertical slice — ACTIVE

Цель: доказать новый движок на одной законченной операции.

### Atlas prerequisite
- [ ] выполнить Atlas query `accounting-kz / 3.0 / counterparties / create-counterparty`;
- [ ] собрать bounded primary evidence;
- [ ] создать Workflow Record;
- [ ] создать Interface Passport выбранной версии/наблюдения;
- [ ] поднять confidence до уровня, достаточного для owner fidelity review.

### Workspace shell
- [ ] embedded route/surface;
- [ ] маркировка `УЧЕБНАЯ СРЕДА — НЕ 1С`;
- [ ] 1C-like header/navigation/list/form primitives;
- [ ] desktop/mobile layout.

### Counterparty domain
- [ ] deterministic seed;
- [ ] counterparty list;
- [ ] create form;
- [ ] fictional name/city;
- [ ] save state;
- [ ] reset.

### Learning modes
- [ ] Demo;
- [ ] Guided Practice;
- [ ] Independent Test.

### Guidance
- [ ] semantic target registry;
- [ ] anchored coach bubble;
- [ ] spotlight;
- [ ] `Почему?`;
- [ ] hint 1 / hint 2;
- [ ] show action;
- [ ] condition-driven advancement.

### Verification v2
- [ ] object exists;
- [ ] name correct;
- [ ] city correct;
- [ ] saved;
- [ ] readable assertion checklist;
- [ ] correct typed answer without state => FAIL.

### Gate
- [ ] owner UX/fidelity review;
- [ ] all engineering checks PASS.

**STOP:** invoice work forbidden until owner review PASS.

## Stage 1B.2 — Customer invoice vertical slice

Start only after 1B.1 PASS.

- [ ] Atlas workflow/passport ingestion first;
- [ ] reuse workspace primitives;
- [ ] create invoice;
- [ ] select counterparty;
- [ ] add line;
- [ ] quantity/price/total;
- [ ] save/status;
- [ ] Demo/Guided/Test;
- [ ] state assertions;
- [ ] owner review.

## Stage 1B.3 — Payment / advance vertical slice

Start only after 1B.2 PASS.

- [ ] Atlas workflow/passport ingestion first;
- [ ] payment form;
- [ ] link to counterparty/invoice;
- [ ] amount/status;
- [ ] derived training balance;
- [ ] Demo/Guided/Test;
- [ ] state assertions;
- [ ] owner review.

## Stage 1C — Learning engine hardening

После трёх PASS vertical slices:
- [ ] reusable scenario schema;
- [ ] reusable assertion library;
- [ ] robust guidance recovery;
- [ ] assisted/unassisted scoring;
- [ ] scenario analytics;
- [ ] accessibility pass;
- [ ] content authoring conventions;
- [ ] second-user usability test.

## Stage K1 — 1C Knowledge Atlas Bootstrap — REQUIRED BEFORE STAGE 2

Полная инструкция: `knowledge/1c/STAGE_K1_INSTRUCTION.md`.

Цель: сделать Atlas достаточно полным, чтобы масштабирование курса перестало зависеть от повторного web research.

### Required coverage
- [ ] generic `1С:Предприятие 8` platform/user-object model;
- [ ] Accounting KZ 3.0 core workflow inventory;
- [ ] HRM/ZUP KZ configuration + high-level workflow inventory;
- [ ] Trade KZ configuration + high-level workflow inventory;
- [ ] UNF KZ high-level inventory;
- [ ] ERP KZ high-level inventory;
- [ ] Complex Automation KZ inventory where relevant;
- [ ] source registry/provenance complete;
- [ ] graph nodes/edges validation;
- [ ] coverage matrix;
- [ ] five retrieval proof queries.

Do not bulk-copy 1C documentation. Store normalized facts, metadata and evidence links.

**GATE:** Stage 2 cannot begin until Stage K1 PASS.

## Stage 2 — Expand basic 1C curriculum

Only after Stage K1 + proven reusable learning engine.

Candidate Accounting KZ slices:
- номенклатура;
- поступление материалов;
- реализация;
- банк/касса;
- акт сверки;
- дебиторка/кредиторка;
- базовые отчёты;
- закрытие учебного месяца.

Each new process follows:
`Atlas retrieval → gap ingestion → Interface Passport → vertical slice → owner review`.

## Stage 3 — Cross-configuration tracks

Only after Accounting KZ core proves the system.

Possible tracks are selected by measurable user value, not because 1C has many products:
- ZUP/HRM KZ: кадры + зарплата;
- Trade KZ: продажи + склад;
- UNF KZ: SMB operations;
- ERP/Complex Automation only for justified advanced audiences.

Reuse shared platform/workspace primitives while preserving configuration-specific workflows.

## Stage 4 — Server persistence

Only after proven repeat use:
- Auth;
- server progress;
- cross-device continuation;
- roles;
- private analytics;
- reset/export/delete.

Supabase remains a candidate, not a commitment.

## Stage 5 — Transfer to real 1C

Not core practice, but skill-transfer assessment:
- separate mode;
- actual official/demo/training environment if legally/accessibly available;
- checklist before action;
- no credential capture;
- no automation of real 1C;
- manual transfer assessment.

## Stage 6 — FNO / ESF research

Return only after a mature learning engine and a new MPE decision. Old portal-replica concepts are not current implementation instructions.

## Stage 7 — Adaptive reinforcement

- spaced retry;
- new-number variants;
- error-pattern review;
- skill map;
- optional AI explanations only after deterministic rules are strong.

## Permanent stop criteria

Stop expansion if:
- practical PASS can be obtained without required domain state;
- coach teaches a wrong interaction habit;
- simulated UI conflicts with approved Interface Passport;
- a new module requires cloning large parts of 1C without measurable learning value;
- required Atlas evidence is missing/stale/conflicted;
- mandatory paid external dependency appears;
- real credentials/identifiers are required;
- current vertical slice lacks owner PASS;
- Stage K1 is not PASS before broad expansion;
- lint/typecheck/test/build/secrets/e2e fail.
