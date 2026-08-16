# SESSION NOTES

## 2026-08-15 — Coder handoff checkpoint

### Checkpoint

Progress is frozen at `Stage 1B.1 — Counterparty Vertical Slice` with status:

`PRE-REVIEW / ENGINEERING CHECKS PENDING`.

Canonical continuation file added:
`CODER_HANDOFF_2026-08-15.md`.

`NEXT_STAGE_INSTRUCTION.md` now explicitly points Codex to that handoff first.

### Required next action

Codex must NOT add new business functionality first.

Required order:
1. sync `mpe/stage-1-validation`;
2. read handoff + stage source-of-truth docs;
3. run lint/typecheck/unit/build/secrets/e2e;
4. fix only Stage 1B.1/regression defects;
5. run desktop/mobile smoke;
6. validate Demo/Guided/Independent behavior and assisted/unassisted progress;
7. prepare owner review using `docs/validation/STAGE1B1_OWNER_REVIEW.md`;
8. stop for explicit owner decision.

### Stop condition

Do not implement Invoice, Payment, additional Accounting KZ vertical slices, International Track runtime, FNO/ESF, Supabase, AI verification or parallel infrastructure before explicit Stage 1B.1 owner authorization.

### Source-of-truth locations

- `CODER_HANDOFF_2026-08-15.md` — operational continuation;
- `NEXT_STAGE_INSTRUCTION.md` — detailed current gate;
- `ROADMAP.md` — sequence and long-term track;
- `STAGE_CHECKLIST.md` — acceptance criteria;
- `knowledge/1c/` — Unified Accounting Knowledge Atlas;
- PR #2 — current integration review surface.

---

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

## 2026-08-15 — Stage 1B.1 engineering gate and smoke

### Git state

- Checkout: `mpe/stage-1-validation`.
- `git fetch` required a local `safe.directory` override because the ASCII worktree is owned by the Codex sandbox account; after fetch, `HEAD...origin/mpe/stage-1-validation` was `0 0`.
- Existing tracked edits in `e2e/customer-card-workspace.spec.ts`, `src/features/training-workspace/CustomerCardTrainingWorkspace.tsx`, and `vitest.config.ts` were preserved.
- Existing untracked `minibase/` was not modified.

### Engineering checks

Executed on 2026-08-15:

- `npm install` — PASS; dependencies already up to date. npm reported 5 audit vulnerabilities and a pending `esbuild` allow-scripts notice.
- `npm run lint` — PASS.
- `npm run typecheck` — PASS.
- `npm run test` — PASS; 6 files / 14 tests.
- `npm run build` — PASS; Vite production build completed.
- `npm run check:secrets` — PASS; no forbidden client secret markers.
- `npm run test:e2e -- --workers=1` — PASS; 6/6 tests across desktop/mobile projects.

The default parallel `npm run test:e2e` invocation did not complete in this Windows environment and was stopped after it produced no result. The serial full suite passed without changing tests.

### Desktop/mobile smoke

Direct Playwright browser inspection of `/learn/customer-card` passed at 1440x900 and 360x800:

- training marker visible;
- task panel visible and usable;
- body width did not exceed viewport width;
- navigation, form labels/inputs, save and verification controls usable;
- successful completion visible after save and verification.

### Learning modes and negative verification

- Demo: six `Показать действие` steps completed; verification showed `Демонстрация завершена`; progress remained `in_progress` with `practiceMode=demo`.
- Guided: `Почему?`, hint 1 and hint 2 rendered; manual completion recorded `completed_assisted` when hints were used.
- Guided assisted path: one `Сделать за меня` action recorded `showActionCount=1` and `completed_assisted`.
- Independent: coaching/spotlight controls hidden; manual completion recorded `completed_unassisted`.
- Negative checks: empty state failed; correct values left unsaved failed; wrong city produced city-specific FAIL (`Сейчас: Алматы`); correction plus save produced PASS. Unit tests also cover state-only verification.

### Gate status

Engineering and smoke checks are complete. Owner review remains `PENDING_OWNER_REVIEW`; no owner PASS or Stage 1B.2 authorization is inferred. Invoice/Payment implementation remains blocked.

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

## 2026-08-16 — Initial discoverability remediation

Owner feedback (verbatim):

> сперва не сразу сообразил куда нажимать. потом понял. другие могут не понять

Classified as `Stage 1B.1 initial discoverability UX issue` with remediation status `PASS WITH REMEDIATION` pending owner retest. The initial embedded workspace now shows a visible `Начните здесь` cue that names the first click (`Продажи`) in Demo and Guided. Independent Test keeps coaching and spotlight hidden.

`Decision` remains `PENDING`; Stage 1B.2 Invoice, Payment, and all other blocked scope remain untouched.

## 2026-08-16 — Training Workspace stylesheet regression remediation

Owner reported that the screen appeared unstyled and the visual order/layout was broken. Root cause was isolated to commit `4800a70`: `training-workspace.css` was replaced by a one-rule `.training-start-cue` stylesheet, removing the existing shell, grid, sidebar, form, task panel, and responsive rules.

Blocker fix: restored the complete stylesheet from parent commit `899c956` and retained the `.training-start-cue` rule at the end of the file. No JSX flow, business scope, or `minibase/` files were changed.

Verification:
- `npm run lint` — PASS;
- `npm run typecheck` — PASS;
- `npm run test` — PASS (6 files, 14 tests);
- `npm run build` — PASS (`index-DuMC0AV2.css`, 30.67 kB);
- `npm run check:secrets` — PASS;
- `npm run test:e2e -- --workers=1` — PASS (6/6);
- authenticated browser smoke — PASS at 1440x900 and 360x800; body/document scroll width matched viewport, shell/grid/sidebar/task panel rendered, and no horizontal overflow;
- mode visibility — Demo/Guided cue visible; Independent cue, coaching, and spotlight hidden.

Screenshots:
- `test-results/training-workspace-desktop-1440x900.png`;
- `test-results/training-workspace-mobile-360x800.png`.

Owner retest remains pending. `Decision` remains `PENDING`; Stage 1B.2 Invoice, Payment, and all other blocked scope remain untouched.
