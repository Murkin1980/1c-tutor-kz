# SESSION NOTES

## 2026-08-15 — Stage 1B.1 Counterparty implementation pass

### MPE decision

`EXTEND_EXISTING`

Implementation followed the updated plan and stopped before Invoice.

### Implemented code

Created:
- `src/features/training-workspace/domain/customerCardScenario.ts`;
- `src/features/training-workspace/domain/customerCardVerification.ts`;
- `src/features/training-workspace/guidance/customerCardGuidance.ts`;
- `src/features/training-workspace/CustomerCardTrainingWorkspace.tsx`;
- `src/features/training-workspace/training-workspace.css`;
- `src/routes/CustomerCardLessonPage.tsx`;
- `src/features/training-workspace/domain/customerCardScenario.test.ts`;
- `e2e/customer-card-workspace.spec.ts`;
- `docs/validation/STAGE1B1_OWNER_REVIEW.md`.

Updated:
- `src/app/App.tsx`;
- `src/routes/CoursePage.tsx`;
- `src/entities/course.ts`;
- `src/content/course.ts`;
- `src/content/course.json`;
- `src/features/progress/progress.tsx`;
- `ROADMAP.md`;
- `STAGE_CHECKLIST.md`;
- `VISUAL_PROGRESS.md`;
- `NEXT_STAGE_INSTRUCTION.md`.

### New practical flow

`/learn/customer-card` now opens an embedded training workspace instead of using the generic external-1C lesson flow.

Supported narrow path:
`Главное → Продажи → Контрагенты → Создать → Наименование/Город → Сохранить`.

The UI is intentionally marked:
`УЧЕБНАЯ СРЕДА — НЕ 1С`.

The current screen is a semantic interaction model based on Atlas evidence. It does not claim pixel-perfect fidelity to a particular installed Accounting KZ build.

### Domain / verification

Deterministic state contains:
- current supported screen;
- counterparty draft;
- saved fictional counterparties;
- action log.

Required state:
- saved counterparty exists;
- name = `ТОО Учебный Покупатель`;
- city = `Кызылорда`;
- saved state = true.

Verification Engine v2 returns per-check:
- PASS/FAIL;
- expected;
- actual;
- corrective hint.

Knowing or typing the expected name outside the workspace cannot complete the practical scenario.

### Learning modes

Implemented:
- Demo / `Показать`;
- Guided / `Вести меня`;
- Independent Test / `Проверить себя`.

Demo is non-scored.

Guided uses semantic targets + spotlight, condition-driven guidance, `Почему?`, two hint levels and show-action.

Independent Test hides guidance and spotlight.

### Progress semantics

Existing local progress repository was extended additively with optional:
- `practiceMode`;
- `completionKind`;
- `hintCount`;
- `showActionCount`;
- `resetCount`.

Completion can be:
- `completed_unassisted`;
- `completed_assisted`.

### Legacy isolation

Only `customer-card` migrated to `practiceMode: embedded`.

Legacy lessons remain explicitly marked external/legacy and are not treated as current architecture authority.

The embedded validation slice is temporarily unlockable without completing those legacy Fresh-dependent prerequisites so the owner can review the new engine directly.

Invoice remains legacy and explicitly blocked until owner PASS.

### Tests added

Unit specifications cover:
- initial state cannot PASS;
- correct data before save cannot PASS;
- correct saved object PASS;
- wrong city produces field-level FAIL;
- guidance advances from state;
- reset returns deterministic seed.

Playwright specifications cover:
- guided successful flow;
- initial explicit failure;
- independent mode hides guidance and completes manually.

### Engineering-check limitation

Attempted to clone the branch into the available execution container to run checks.

The container failed with DNS/network error resolving `github.com`, so the repository could not be checked out there.

The GitHub connector reports no active CI status checks for the current branch head.

Therefore the following are **NOT claimed PASS yet**:
- lint;
- typecheck;
- unit test execution;
- build;
- secrets check;
- e2e execution;
- manual desktop/mobile smoke.

These are the next engineering gate, not a reason to start Invoice.

### Open UX/fidelity gaps

1. Exact installed-build UI observation remains pending.
2. Current guided UX uses side task panel + target spotlight; a separate anchored floating bubble is not yet implemented.
3. Mobile layout is coded responsively but has not been manually smoke-tested in a running build.

### Current status

`Stage 1B.1 = PRE-REVIEW / ENGINEERING CHECKS PENDING`.

Next instruction is now verification + owner review, not more feature expansion.

### Stop condition

Do not implement Invoice, Payment, FNO/ESF, server persistence, AI verification or International Track runtime until the relevant gates are passed.

---

## 2026-08-15 — International Accountant Track architecture + market research pass

### MPE decision

`EXTEND_EXISTING`

International Accounting / IFRS remains inside the same `1c-tutor-kz` product and same Atlas.

No new repository, second Atlas, second frontend or new runtime was introduced.

### Architecture result

Completed `INTERNATIONAL_TRACK_ARCHITECTURE_PASS`.

The existing Atlas was compatible with the international direction but lacked first-class cross-layer/normative semantics.

`knowledge/1c/GRAPH_SCHEMA.md` was extended backward-compatibly with:
- Topic;
- KnowledgeLayer;
- Jurisdiction;
- Standard;
- StandardParagraphReference;
- AccountingConcept;
- BusinessProcess;
- TransactionType;
- 1COperation;
- AccountingTreatment;
- FinancialStatementImpact;
- AccountingEntry;
- Terminology;
- Example / Case / Exercise / Assessment;
- Capability;
- DifficultyLevel / Prerequisite / LearningOutcome;
- SourceVersion / EffectiveDate.

Existing 1C node IDs/edges remain valid.

### IFRS provenance rule

Authoritative IFRS treatment must link to:
- source;
- source version;
- standard;
- paragraph/reference locator when permitted;
- effective date;
- verification date/status.

AI-generated explanations are not normative sources.

IFRS Standards are not bulk-copied into Atlas; Atlas stores structured provenance, identifiers, bounded summaries and Tutor-authored explanations/cases. Licensing must be re-checked before commercial embedding of licensed IFRS content.

### New documents

- `docs/architecture/INTERNATIONAL_TRACK_ARCHITECTURE_PASS.md`;
- `knowledge/1c/international/SOURCE_REGISTER.md`;
- `knowledge/1c/international/CURRICULUM_SKELETON.md`;
- `knowledge/1c/international/TOPIC_BRIDGES.md`;
- `docs/research/INTERNATIONAL_CAPABILITY_RESEARCH_PASS_2026-08-15.md`.

Updated:
- `knowledge/1c/GRAPH_SCHEMA.md`;
- `ARCHITECTURE.md`;
- `ROADMAP.md`.

### Long-term progression fixed

`1C Tutor → Accounting KZ → Professional Accountant → International Accounting → IFRS → International Practice`

International implementation is sequenced after a stable core learning engine and sustainable Accounting KZ capability layer.

### Initial market evidence

Current remote/international accounting role sample strongly emphasizes:
- month-end close;
- bank/balance-sheet reconciliations;
- journal entries;
- accruals/prepayments;
- AP/AR;
- GL/trial balance;
- fixed assets;
- supporting schedules/working papers;
- audit support;
- discrepancy/root-cause investigation;
- Excel;
- cloud ERP/accounting systems;
- professional English/autonomous remote work.

A particularly relevant current CIS role combines Kazakhstan 1C records, NetSuite reconciliation, IFRS, local compliance, English/Russian, Excel and account reconciliation. This supports the planned bridge rather than an isolated IFRS course.

### Market-derived product implications

- Bank reconciliation is a strong first international practical simulator candidate.
- Month-end close should be a later integrated capstone.
- IFRS should enter through business cases/treatment decisions, not standard-number memorization.
- Job readiness should use asynchronous work-sample cases with ambiguity and reviewable work products.
- Software transfer should focus on accounting concepts/work products first; do not clone NetSuite/QuickBooks/Xero indiscriminately.

### Current implementation priority remains unchanged

The active product implementation remains `Stage 1B.1 — Counterparty Vertical Slice`.

International Track work in this pass is architecture + Atlas + research only. It must not displace completion of the embedded Training Workspace.

---

## 2026-08-15 — Atlas population pass 1

### Result

The 1C Knowledge Atlas is no longer a seed-only scaffold.

Populated from official 1C Kazakhstan sources:
- Accounting KZ 3.0 core functional map;
- 35+ Accounting KZ workflow nodes across documents, counterparties, sales, purchases, bank/cash, warehouse, reports, production, payroll and period close;
- workflow dependency edges for the first Tutor learning chain;
- expanded primary source registry;
- human-readable `Accounting KZ 3.0` core inventory;
- ZUP KZ 3.1 core inventory;
- cross-configuration capability map;
- edition baselines for ZUP 3.1, UNF 3.0, ERP 2.4, Complex Automation 2.4 and Trade 3.0/3.4 evidence.

### Important evidence rule

The Atlas separates:
1. `workflow exists / topology is documented`;
2. `exact UI interaction is fidelity-ready` only after observed Interface Passport.

### Current implementation-support query

`accounting-kz / 3.0 / counterparties / create-counterparty` → `IMPLEMENTATION_SUPPORT_READY / EXACT_UI_OBSERVATION_PENDING`.

### Stop condition

Do NOT start broad curriculum expansion until full Stage K1 Knowledge Atlas gate passes.

---

## 2026-08-15 — MPE deep pivot: embedded Training Workspace + 1C Knowledge Atlas

### MPE decision

`EXTEND_EXISTING`

The existing repository remains the product. No new repository is created.

### Why the old MVP loop was rejected

Owner testing identified two blockers:
1. all current practical lessons depended on paid `1C:Fresh`;
2. practical completion could be passed by submitting the expected answer without performing the operation in 1C.

The old external-tab/answer-only architecture is no longer authoritative.

### Approved product direction

Core practice moves into an embedded 1C-like Training Workspace with deterministic fictional state, Demo/Guided/Test, contextual guidance, state-based verification, transparent assertions and deterministic reset/retry.

Real 1C becomes a later transfer-of-skill stage, not a core MVP dependency.

### Knowledge Atlas decision

Created `knowledge/1c/` as Git-native canonical knowledge with provenance. A future RAG/vector index may be generated but cannot become source of truth.

### Legacy cleanup

- deleted obsolete `FIRST_STAGE_INSTRUCTION.md`;
- FNO/ESF Portal Replica Spec deferred;
- external 1C answer-only flow classified legacy.

---

## 2026-07-28 — historical frontend prototype

The first prototype established reusable React/TypeScript/Vite routing, mock auth, browser repositories, local progress, lesson UI, verification primitives, Cloudflare SPA/security files and tests.

Historical behavior included external `window.open()` to 1C and answer-based practical checks. Those parts are legacy.

Historical local checks were PASS for lint/typecheck/unit/build/secrets/e2e at that time.
