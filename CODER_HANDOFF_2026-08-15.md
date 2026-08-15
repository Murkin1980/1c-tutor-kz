# CODER HANDOFF — 2026-08-15

## Source of truth

Repository: `Murkin1980/1c-tutor-kz`

Working branch: `mpe/stage-1-validation`

Draft PR: #2 — `MPE: embedded Training Workspace + Unified Accounting Atlas`

MPE decision: `EXTEND_EXISTING`.

Do not create a new repository, second frontend, second Atlas or parallel runtime.

## Current milestone

`Stage 1B.1 — Counterparty Vertical Slice`

Status: `PRE-REVIEW / ENGINEERING CHECKS PENDING`.

The first embedded practical scenario is implemented at:

`/learn/customer-card`

Do not begin Invoice or Payment implementation yet.

## What is already implemented

### Training Workspace
- embedded customer-card route;
- persistent `УЧЕБНАЯ СРЕДА — НЕ 1С` marker;
- deterministic fictional state;
- supported path: `Главное → Продажи → Контрагенты → Создать → Наименование/Город → Сохранить`;
- counterparty list/form/save/reset;
- responsive desktop/mobile CSS.

### Learning modes
- Demo / `Показать`;
- Guided / `Вести меня`;
- Independent Test / `Проверить себя`.

Guided currently uses semantic target IDs + spotlight + side-panel coach.

### Verification v2
PASS depends on domain state, not a typed answer.

Required assertions:
1. saved counterparty exists;
2. name = `ТОО Учебный Покупатель`;
3. city = `Кызылорда`;
4. saved state = true.

Verifier shows expected / actual / corrective hint per assertion.

### Progress
Existing local progress repository now supports optional:
- `practiceMode`;
- `completionKind`;
- `hintCount`;
- `showActionCount`;
- `resetCount`.

Completion kinds:
- `completed_unassisted`;
- `completed_assisted`.

Demo must not produce scored completion.

### Tests already authored
- unit tests for deterministic state, save, reset, field-level FAIL and guidance;
- Playwright specs for guided and independent flows.

These tests have been authored but NOT yet executed on this checkpoint.

## Atlas state

Unified Atlas remains under `knowledge/1c/`.

For the current slice read:
- `knowledge/1c/workflows/ACCOUNTING_KZ_3_0_STAGE1B_CORE.md`;
- `knowledge/1c/interfaces/ACCOUNTING_KZ_3_0_STAGE1B_PASSPORTS.md`;
- `knowledge/1c/evidence/ACCOUNTING_KZ_3_0_STAGE1B_EVIDENCE.md`;
- `knowledge/1c/COVERAGE.md`.

Current query state:

`accounting-kz / 3.0 / counterparties / create-counterparty`
→ `IMPLEMENTATION_SUPPORT_READY / EXACT_UI_OBSERVATION_PENDING`.

Do not invent exact 1C layout where the observation-grade Interface Passport is still unresolved.

## International track status

International Accounting / IFRS is already fixed as a long-term continuation inside the SAME project and SAME Atlas:

`1C Tutor → Accounting KZ → Professional Accountant → International Accounting → IFRS → International Practice`.

Architecture/research may be maintained, but do not implement International Track runtime/lessons while Stage 1B.1 is open.

## Mandatory first action for Codex

Read, in this order:
1. `FOUNDATION.md`
2. `ARCHITECTURE.md`
3. `DATA_MODEL.md`
4. `ROADMAP.md`
5. `STAGE_CHECKLIST.md`
6. `NEXT_STAGE_INSTRUCTION.md`
7. `CODER_INSTRUCTION.md`
8. `knowledge/1c/COVERAGE.md`
9. current Stage 1B.1 Atlas workflow/passport/evidence files
10. `SESSION_NOTES.md`
11. this handoff file.

Then inspect current git state before editing.

## Exact continuation order

### 1. Synchronize
- checkout `mpe/stage-1-validation`;
- pull latest remote state;
- confirm PR #2 is the matching draft PR;
- do not reset or overwrite remote changes.

### 2. Install / run all engineering checks

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:secrets
npm run test:e2e
```

Do not weaken or delete tests merely to get green.

If something fails:
- classify as Stage 1B.1 defect vs pre-existing regression;
- fix the smallest correct scope;
- rerun affected checks and then the full gate;
- record exact command + result in `SESSION_NOTES.md`.

### 3. Manual smoke
Run the app and inspect `/learn/customer-card` on:
- desktop;
- approximately 360px mobile viewport.

Check:
- marker always visible;
- navigation usable;
- form fields usable;
- no horizontal trap;
- save works;
- result checklist readable;
- reset deterministic;
- task panel does not obstruct the workspace.

### 4. Validate all learning modes

Demo:
- complete using show-action;
- confirm no scored completion.

Guided:
- perform actions manually;
- verify spotlight advances by actual state;
- test `Почему?`, hint 1, hint 2;
- use show-action once and verify assisted completion metadata.

Independent:
- confirm coaching/spotlight are hidden;
- complete manually;
- verify unassisted completion metadata.

### 5. Negative verification test
Explicitly prove:
- no saved object => FAIL;
- correct name but wrong city => city-specific FAIL;
- correct data typed outside workspace cannot produce PASS;
- correction + save => PASS.

### 6. UX improvements allowed before owner review
Only fix issues directly blocking Stage 1B.1 review.

Allowed examples:
- layout/accessibility defects;
- mobile overflow;
- broken focus/labels;
- guidance not advancing correctly;
- progress counters wrong;
- assertion feedback unclear;
- test/build errors.

Do NOT broaden scope into Invoice/Payment.

### 7. Floating coach decision
Current implementation uses side-panel coach + spotlight.

Do not automatically build a more complex floating anchored coach unless:
- current UX demonstrably blocks the learning experience, or
- owner specifically requests it.

If implemented, anchor using actual target bounds and semantic IDs, never brittle CSS selectors.

### 8. Interface fidelity
If a legally accessible Accounting KZ 3.0 environment is available, observe only the narrow counterparty path and update the Interface Passport with:
- actual navigation path;
- visible command labels;
- field labels;
- save/close behavior;
- differences from Tutor;
- observed build/version/date.

Do not copy protected assets or bulk screenshots.

If no environment is available, retain `EXACT_UI_OBSERVATION_PENDING`.

### 9. Prepare owner review
Use:
`docs/validation/STAGE1B1_OWNER_REVIEW.md`.

Owner must review:
- Demo;
- Guided;
- Independent Test;
- desktop/mobile usability;
- clarity of `Что будет проверено`;
- clarity of PASS/FAIL feedback;
- whether side-panel coach + spotlight is sufficient;
- whether 1C interaction logic feels suitable for training.

Do not mark owner PASS yourself.

## Stage 1B.1 PASS requirements

All required:
- lint PASS;
- typecheck PASS;
- unit tests PASS;
- build PASS;
- secrets PASS;
- e2e PASS;
- desktop/mobile smoke PASS;
- state verification proven;
- blocking UX defects fixed;
- owner reviews all three modes;
- owner explicitly accepts direction;
- owner explicitly authorizes Stage 1B.2.

## STOP CONDITION

Until explicit owner authorization, DO NOT implement:
- customer invoice UI/domain;
- customer payment UI/domain;
- additional Accounting KZ slices;
- FNO/ESF runtime;
- Supabase merely for this slice;
- AI/computer-vision verification;
- real 1C automation;
- International Track runtime/lessons;
- marketplace/freelance platform;
- second repository / second Atlas.

## After owner PASS only

Next milestone becomes:
`Stage 1B.2 — Customer Invoice Vertical Slice`.

Before coding it:
1. retrieve its Atlas workflow/evidence;
2. upgrade Interface Passport where possible;
3. reuse existing Training Workspace, Guidance and Verification primitives;
4. implement only Invoice;
5. stop again for owner review before Payment.

## Documentation discipline

At the end of every work session update factual status only:
- `SESSION_NOTES.md`;
- `ROADMAP.md`;
- `STAGE_CHECKLIST.md`;
- `VISUAL_PROGRESS.md`;
- `knowledge/1c/COVERAGE.md` when knowledge status changes;
- PR #2 body if milestone status materially changes.

Never report a check as PASS unless it was actually executed.
