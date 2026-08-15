# SESSION NOTES

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

### Official source findings

Primary discovery sources identified:
- `its.1c.kz` user documentation index for Kazakhstan configurations;
- official Accounting KZ 3.0 documentation;
- `1c.kz` Accounting KZ product/release material;
- official platform user documentation;
- official release pages for localized configurations.

Official Kazakhstan documentation already separates major product families and functional areas, making it suitable as a structured ingestion source.

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
2. perform bounded primary-source ingestion;
3. create Workflow Record + Interface Passport + evidence;
4. only then build the embedded Counterparty workflow.

### Current Atlas query state

`create-counterparty` → `RESEARCH_REQUIRED` because exact navigation/form/command evidence for the selected observed Accounting KZ 3.0 version still must be captured.

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