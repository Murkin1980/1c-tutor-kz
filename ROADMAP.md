# ROADMAP — 1C Tutor KZ

Обновлено: 2026-08-15 после MPE pivot + International Track architecture pass.

## North Star

Пользователь должен научиться выполнять бухгалтерский процесс в безопасной интерактивной среде и доказать навык через состояние среды и рабочие результаты, а не через тестовый ответ.

Long-term professional North Star:

`1C Tutor → Accounting KZ → Professional Accountant → International Accounting → IFRS → International Practice`

Конечная проверка международного уровня: способен ли выпускник правильно выполнить реалистичную бухгалтерскую задачу международной компании с проверяемыми working papers / reconciliations / schedules / entries / statements.

## Постоянный слой — Unified Accounting Knowledge Atlas

`knowledge/1c/` является source of truth для:
- 1C interfaces/configurations/workflows;
- local accounting layers;
- accounting concepts;
- IFRS/IAS references and version metadata;
- international-practice capabilities;
- terminology;
- cases/exercises/assessments;
- provenance/evidence.

Правило реализации:

`retrieve Atlas → identify gap → bounded ingestion → implement → link scenario back to Atlas`.

Не создавать второй IFRS Atlas.

## Stage 0 — Pivot foundation — DONE

- [x] выявлена зависимость от платного 1C:Fresh;
- [x] выявлена ложная practical verification через quiz answers;
- [x] owner approved deep change;
- [x] выбран EXTEND_EXISTING;
- [x] встроенная Training Workspace стала core MVP;
- [x] закреплены Demo/Guided/Test, contextual coach, isolated playground, state verification;
- [x] переписаны foundation/product/architecture/data/coder docs;
- [x] создан каркас 1C Knowledge Atlas;
- [x] International Track design-pass подтверждает возможность additive/backward-compatible Atlas expansion без нового runtime/repo.

## Stage 1B.1 — Counterparty vertical slice — ACTIVE

Цель: доказать новый движок на одной законченной операции.

### Atlas prerequisite
- [x] выполнить Atlas query `accounting-kz / 3.0 / counterparties / create-counterparty`;
- [x] собрать bounded primary evidence на уровне workflow;
- [x] создать Workflow Record;
- [x] создать draft Interface Passport / evidence structure;
- [ ] получить observation-grade UI Passport выбранной доступной версии для fidelity review.

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

**STOP:** invoice implementation forbidden until owner review PASS.

## Stage 1B.2 — Customer invoice vertical slice

Start only after 1B.1 PASS.

- [x] Atlas workflow/evidence skeleton created;
- [ ] observation-grade Interface Passport;
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

- [x] Atlas workflow/evidence skeleton created;
- [ ] observation-grade Interface Passport;
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

## Stage K1 — 1C Knowledge Atlas Bootstrap — REQUIRED BEFORE BROAD ACCOUNTING EXPANSION

Полная инструкция: `knowledge/1c/STAGE_K1_INSTRUCTION.md`.

- [x] Accounting KZ core workflow inventory substantially populated;
- [x] ZUP KZ relevant edition/high-level chain started;
- [x] Trade/UNF/ERP/Complex Automation source inventory started;
- [x] source registry/provenance structure;
- [x] initial retrieval proof queries;
- [x] platform common UI model started;
- [ ] graph validation script/tests;
- [ ] selected Trade/UNF workflow maps to target depth;
- [ ] observation-grade Interface Passports for implemented Tutor scenarios.

Do not bulk-copy official documentation. Store normalized facts, metadata and evidence links.

## Stage 2 — Expand basic Accounting KZ curriculum

Only after Stage K1 + proven reusable learning engine.

Candidate slices:
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

## Stage 3 — Cross-configuration 1C tracks

Only after Accounting KZ core proves the system.

Possible tracks selected by measurable user value:
- ZUP/HRM KZ: кадры + зарплата;
- Trade KZ: продажи + склад;
- UNF KZ: SMB operations;
- ERP/Complex Automation only for justified advanced audiences.

## Stage 4 — Professional Accountant layer

Bridge from software operation to accounting reasoning.

Candidate capabilities:
- double-entry reasoning;
- source document → entry → ledger trace;
- AP/AR structure;
- reconciliations;
- accrual/prepayment logic;
- trial balance review;
- fixed assets/inventory support schedules;
- period-close logic;
- discrepancy investigation.

This stage is the prerequisite bridge before deep IFRS learning.

## Stage 5 — Server persistence / durable learner record

Only after proven repeat use:
- Auth;
- server progress;
- cross-device continuation;
- roles;
- private analytics;
- reset/export/delete;
- durable capability evidence where justified.

Supabase remains a candidate, not a commitment.

## Stage 6 — Transfer to real 1C

Skill-transfer assessment:
- separate mode;
- official/demo/training environment if legally/accessibly available;
- checklist before action;
- no credential capture;
- no automation of real 1C;
- manual transfer assessment.

## Stage I0 — International Track Architecture — DONE (design only)

Documents:
- `docs/architecture/INTERNATIONAL_TRACK_ARCHITECTURE_PASS.md`;
- `knowledge/1c/international/SOURCE_REGISTER.md`;
- `knowledge/1c/international/CURRICULUM_SKELETON.md`;
- `knowledge/1c/international/TOPIC_BRIDGES.md`.

Completed:
- [x] confirmed EXTEND_EXISTING;
- [x] no second repo / no second Atlas;
- [x] Atlas schema extended backward-compatibly;
- [x] IFRS provenance/effective-date model defined;
- [x] initial local→IFRS topic bridges defined;
- [x] curriculum skeleton recorded;
- [x] IFRS licensing boundary recorded.

This stage does **not** authorize full IFRS content implementation.

## Stage I1 — International Capability Research — RESEARCH PASS

Purpose: determine what actually enables paid international accounting work.

Research areas:
- international/remote accountant roles;
- remote bookkeeping roles;
- shared-service / outsourcing roles;
- IFRS accountant job descriptions;
- ACCA FA/FR/DipIFR competency maps;
- operational accounting workflows;
- common accounting software;
- month-end close workflows;
- practical work-sample/accounting assessments.

Deliverable:
`capability-demand matrix`, not a copied course curriculum.

## Stage I2 — Accounting English Basics — FUTURE

Only after core Tutor is stable enough to justify international implementation.

Target: understand and work from common English accounting source documents and terminology.

## Stage I3 — International Accounting Foundations — FUTURE

- GL;
- AP;
- AR;
- double entry;
- bank reconciliation;
- accruals/prepayments;
- fixed assets/inventory;
- trial balance;
- financial-statement bridge.

## Stage I4 — Core IFRS Topic Bridges — FUTURE

Initial candidates:
- IAS 2 Inventory;
- IAS 16 PPE;
- IFRS 15 Revenue;
- IFRS 16 Leases;
- IAS 7 Cash Flows;
- IAS 36 Impairment;
- IFRS 9 Financial Instruments.

Every normative node requires source/version/effective-date provenance.

## Stage I5 — Operational International Accounting Simulator — FUTURE

Candidate workspaces:
- bank reconciliation;
- AP/AR reconciliation;
- accrual/prepayment schedules;
- fixed asset register;
- inventory reconciliation;
- supporting schedules;
- journal preparation/review.

## Stage I6 — Month-End Close Simulator — FUTURE

Integrated close package with work products, dependencies, discrepancies and reviewer feedback.

## Stage I7 — IFRS Case Simulator — FUTURE

Case-based application of IFRS to business evidence, calculations, entries and statement impact.

## Stage I8 — International Accountant Practice / Job Readiness — FUTURE

Integrated work-sample cases with English source documents and capability verification.

No marketplace/freelance platform is authorized by this roadmap.

## Stage F — FNO / ESF research — DEFERRED

Return only after a mature learning engine and a new MPE decision. Old portal-replica concepts are not current implementation instructions.

## Stage A — Adaptive reinforcement — LATER

- spaced retry;
- new-number variants;
- error-pattern review;
- skill/capability graph;
- optional AI explanations after deterministic rules are strong.

## Permanent stop criteria

Stop expansion if:
- practical PASS can be obtained without required domain state/work product;
- coach teaches a wrong interaction habit;
- simulated UI conflicts with approved Interface Passport;
- a new module requires cloning large parts of software without measurable learning value;
- required Atlas evidence is missing/stale/conflicted;
- normative IFRS/local rule lacks required provenance/version/effective-date support;
- AI-generated explanation is treated as normative source;
- copyrighted standards are bulk-copied without rights;
- mandatory paid external dependency appears in the core loop;
- real credentials/identifiers are required;
- current vertical slice lacks owner PASS;
- lint/typecheck/test/build/secrets/e2e fail;
- International Track begins displacing unfinished core 1C learning engine without a new MPE gate.
