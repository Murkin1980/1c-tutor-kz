# SESSION NOTES

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

The Atlas now separates two levels explicitly:

1. `workflow exists / topology is documented` — may be `A` when proven by exact-edition official documentation;
2. `exact UI interaction is fidelity-ready` — remains `B` until an Interface Passport records the selected build's navigation, command labels, form structure and relevant fields.

This prevents Codex from turning an official documentation table of contents into invented button positions.

### Current implementation-support query

`accounting-kz / 3.0 / counterparties / create-counterparty` → `WORKFLOW_FOUND / UI_PASSPORT_REQUIRED`.

The workflow and its place in standard trading/accounting scenarios are now proven by official Accounting KZ 3.0 documentation. Exact UI observation for the selected build is the remaining fidelity blocker.

### New/updated Atlas files

- `knowledge/1c/SOURCE_REGISTER.md`;
- `knowledge/1c/COVERAGE.md`;
- `knowledge/1c/graph/nodes.jsonl`;
- `knowledge/1c/graph/edges.jsonl`;
- `knowledge/1c/inventory/ACCOUNTING_KZ_3_0_CORE.md`;
- `knowledge/1c/inventory/ZUP_KZ_3_1_CORE.md`;
- `knowledge/1c/inventory/CROSS_CONFIGURATION_MAP.md`.

### Next Atlas queue

1. Counterparty Interface Passport.
2. Customer Invoice Interface Passport.
3. Customer Payment / bank receipt Interface Passport.
4. Platform generic list/form/document UI primitives.
5. Detailed ZUP hiring/personnel/payroll graph.

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

Core practice moves into an embedded 1C-like Training Workspace with:
- deterministic fictional domain state;
- Demo / Guided Practice / Independent Test;
- contextual coach bubbles/spotlight;
- condition-driven guidance;
- state-based Verification Engine v2;
- transparent assertion checklist;
- assisted/unassisted completion;
- deterministic reset/retry.

Real 1C becomes a later transfer-of-skill stage, not a core MVP dependency.

### Knowledge Atlas decision

Owner requested a durable structured source for the broad 1C ecosystem so future work does not repeatedly research interfaces/workflows from scratch.

Created `knowledge/1c/` with:
- `README.md`;
- `SOURCE_REGISTER.md`;
- `TAXONOMY.md`;
- `GRAPH_SCHEMA.md`;
- `RETRIEVAL_RULES.md`;
- `INGESTION_RULES.md`;
- `COVERAGE.md`;
- `STAGE_K1_INSTRUCTION.md`;
- Interface/Workflow/Evidence templates;
- seed `graph/nodes.jsonl` and `graph/edges.jsonl`.

Canonical Atlas is Git-native. A future RAG/vector index may be generated, but cannot become source of truth.

### Documentation rewritten

- `FOUNDATION.md`;
- `PRODUCT_REQUIREMENTS.md`;
- `ARCHITECTURE.md`;
- `DATA_MODEL.md`;
- `CODER_INSTRUCTION.md`;
- `ROADMAP.md`;
- `STAGE_CHECKLIST.md`;
- `NEXT_STAGE_INSTRUCTION.md`;
- `COURSE_STRUCTURE.md`;
- `README.md`;
- `SECURITY_AND_LEGAL.md`;
- `VISUAL_PROGRESS.md`.

### Legacy cleanup

- deleted `FIRST_STAGE_INSTRUCTION.md` because it required external 1C + answer-only completion;
- replaced `PORTAL_REPLICA_SPEC.md` with a DEFERRED marker; historical content remains in git history;
- old FNO/ESF work is not current implementation scope.

### Current active stage

`Stage 1B.1 — Counterparty Vertical Slice`.

Before UI implementation Codex must:
1. query Atlas for `accounting-kz / 3.0 / counterparties / create-counterparty`;
2. use bounded primary-source ingestion for any remaining gaps;
3. create Interface Passport + evidence;
4. only then build the embedded Counterparty workflow.

### Stop condition

After Counterparty engineering is complete, stop for owner UX/fidelity review.

Do NOT continue to Invoice/Payment without explicit owner PASS.

Do NOT start broad curriculum expansion until full Stage K1 Knowledge Atlas gate passes.

### Code status

This 2026-08-15 session changed architecture/documentation/knowledge records only. Existing application code has not yet been migrated to Training Workspace.

Therefore no claim is made that the new vertical slice works yet.

---

## 2026-07-28 — historical frontend prototype

The first prototype established reusable React/TypeScript/Vite routing, mock auth, browser repositories, local progress, lesson UI, verification primitives, Cloudflare SPA/security files and tests.

Historical behavior included external `window.open()` to 1C and answer-based practical checks. Those parts are now legacy and may be removed/reworked under `NEXT_STAGE_INSTRUCTION.md`.

Historical local checks were PASS for lint/typecheck/unit/build/secrets/e2e at the time of that iteration.