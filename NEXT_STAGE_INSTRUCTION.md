# NEXT STAGE INSTRUCTION — Stage 1B.1 Engineering Verification + Owner Review

## Canonical handoff

Start with `CODER_HANDOFF_2026-08-15.md`.

That file is the short operational continuation guide for Codex. This document remains the detailed stage gate.

## MPE decision

`EXTEND_EXISTING`

The first embedded Counterparty vertical slice now exists in code. Do **not** start Invoice implementation yet.

## Current state

Implemented:
- route `/learn/customer-card`;
- deterministic customer-card domain state;
- create/edit/save/reset;
- Demo / Guided / Independent Test;
- semantic targets + spotlight;
- condition-driven guidance;
- `Почему?`, hint ladder and show-action;
- state-based Verification Engine v2;
- per-assertion expected/actual/hint feedback;
- assisted/unassisted completion metadata;
- unit-test specifications;
- Playwright guided + independent specs;
- customer-card content marked `practiceMode: embedded`;
- no required 1C:Fresh dependency in this lesson.

Still open:
- actual lint/typecheck/unit/build/secrets/e2e execution;
- desktop/mobile manual smoke;
- observation-grade Interface Passport for a legally accessible Accounting KZ 3.0 build;
- anchored floating coach by actual target bounds (current implementation uses side panel + spotlight);
- owner UX/fidelity review.

## Mandatory reading

Before changing code, read:
1. `CODER_HANDOFF_2026-08-15.md`
2. `FOUNDATION.md`
3. `ARCHITECTURE.md`
4. `DATA_MODEL.md`
5. `ROADMAP.md`
6. `STAGE_CHECKLIST.md`
7. `CODER_INSTRUCTION.md`
8. `knowledge/1c/COVERAGE.md`
9. `knowledge/1c/workflows/ACCOUNTING_KZ_3_0_STAGE1B_CORE.md`
10. `knowledge/1c/interfaces/ACCOUNTING_KZ_3_0_STAGE1B_PASSPORTS.md`
11. `knowledge/1c/evidence/ACCOUNTING_KZ_3_0_STAGE1B_EVIDENCE.md`
12. `SESSION_NOTES.md`

## Phase A — Run engineering checks

From a checkout of branch `mpe/stage-1-validation` run:

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:secrets
npm run test:e2e
```

Do not weaken tests to get green.

If checks fail:
- fix only Stage 1B.1/regression issues;
- rerun all affected checks;
- record exact command/result in `SESSION_NOTES.md`.

## Phase B — Desktop/mobile smoke

Verify `/learn/customer-card` on desktop and ~360px mobile viewport.

Required:
- training marker always visible;
- task data readable;
- section navigation usable;
- create form usable;
- save control usable;
- result checklist readable;
- no horizontal trap;
- task panel does not prevent workspace use.

## Phase C — Learning-mode smoke

### Demo
- use `Показать действие` through completion;
- verify Demo does not mark lesson completed.

### Guided
- perform actions personally;
- verify target spotlight advances by state;
- open `Почему?`, hint1, hint2;
- use show-action once and verify completion becomes assisted.

### Independent Test
- confirm guidance is hidden;
- complete scenario manually;
- verify completion can be `completed_unassisted`.

## Phase D — Owner review package

Present exactly one slice to owner.

Ask owner to evaluate:
1. Does the workspace feel close enough to 1C interaction logic to teach useful habits?
2. Is the task panel clear?
3. Is the target spotlight sufficient, or is an anchored floating coach required before broader work?
4. Is `Что будет проверено` understandable before starting?
5. Are per-check PASS/FAIL results understandable?
6. Is mobile interaction acceptable?

Record feedback in:
`docs/validation/STAGE1B1_OWNER_REVIEW.md`.

Do not mark PASS without explicit owner decision.

## Phase E — Fidelity evidence

If a legally accessible Accounting KZ 3.0 build is available, observe only the narrow Counterparty workflow and upgrade the draft Interface Passport:
- actual navigation path;
- visible command names;
- relevant field labels;
- save/close behavior;
- differences from Tutor.

Do not copy protected assets or bulk screenshots.

If no accessible build exists, keep `EXACT_UI_OBSERVATION_PENDING`; this does not justify inventing details.

## Definition of Stage 1B.1 PASS

All are required:
- engineering checks PASS;
- desktop/mobile smoke PASS;
- domain-state verification proven;
- owner reviews all three modes;
- owner accepts interaction direction;
- blocking UX issues fixed;
- remaining fidelity limitations explicitly documented;
- owner explicitly authorizes Stage 1B.2 Invoice.

## STOP CONDITION

Until the owner explicitly authorizes Stage 1B.2, do **not** implement:
- customer invoice;
- payment;
- new Accounting KZ vertical slices;
- FNO/ESF;
- Supabase;
- AI verification;
- browser automation/computer vision;
- International Track runtime/lessons.

Atlas/research maintenance may continue only if it does not displace this gate.
