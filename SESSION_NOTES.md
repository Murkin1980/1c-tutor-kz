# SESSION NOTES

## 2026-08-20 — Turquoise Driver.js beacon refinement

Owner disliked the gold glow around the active guidance target and requested a turquoise variant. The Driver.js beacon accent changed from gold `#c69300` to turquoise `#0f9f9a`; the outer glow now uses the matching translucent turquoise. Guidance behavior, target positioning, yellow action controls, and Independent mode remain unchanged.

Verification:
- `npm run lint` — PASS;
- `npm run typecheck` — PASS;
- `npm run build` — PASS;
- focused `npm run test:e2e -- e2e/customer-card-workspace.spec.ts --workers=1` — PASS, 8/8 desktop/mobile;
- visual screenshot inspection — PASS; turquoise beacon is distinct from the yellow instruction border and gray navigation background.

The E2E smoke now asserts the `--driver-hint-color` value to prevent accidental color regression. Owner acceptance of the new color remains pending.

## 2026-08-20 — Legacy prototype review remediation

### Decision

`EXTEND_EXISTING`

The external review was checked against the current Stage 1B foundation before implementation. Two recommendations were outdated for the active product model: moving answer verification and roles to Supabase would violate the current owner gate, which explicitly defers Supabase/server infrastructure until the embedded Training Workspace proves value. The active `customer-card` practical scenario already verifies deterministic workspace state and cannot pass from a quiz answer.

### Confirmed remediation

- removed the unused `@tanstack/react-query` provider and dependency;
- added `AuthRepository` / `LocalAuthRepository`, runtime validation of stored demo sessions, and auth repository tests;
- removed decorative email/password inputs and explicitly labelled the local editor login as a non-server-protected demo;
- centralized lesson unlock/current selection rules in `courseSelectors.ts` with unit coverage;
- replaced the `LessonPage` module non-null assertion with a safe redirect;
- expanded verification edge-case coverage for invalid numbers, empty collections and sequence ordering;
- expanded route coverage with the allowed local demo-editor path;
- labelled legacy answer checking as self-check rather than proof of Training Workspace execution;
- added Prettier and a focused `format:check`, then formatted the dense JSX named by the review.

### Intentionally deferred

- Legacy static quiz answers remain inspectable in the browser. They are no longer architecture authority or practical skill evidence; securing them requires a server verifier and a future MPE decision.
- The `/admin` role remains client-side because the current page is a read-only demo. Any future CRUD/admin API must add server authorization/RLS before release.

### Verification

- `npm run format:check` — PASS;
- `npm run lint` — PASS;
- `npm run typecheck` — PASS;
- `npm run test` — PASS (32 tests including 3 tests discovered in the preserved untracked `minibase/` directory);
- `npm run build` — PASS;
- `npm run check:secrets` — PASS;
- `npm run test:e2e -- --workers=1` — all 10 desktop/mobile tests completed without a test failure; the Windows runner again remained alive after the final test and was stopped during teardown.

The untracked `minibase/` directory was not modified or included in this remediation.

Codex Router independent read-only review found no blockers. Its five follow-up findings were resolved before commit: empty numeric input is now rejected even when zero is expected; non-contiguous/unknown lesson selector cases are covered; localStorage write/remove failures are tolerated in the local demo; an empty-course dashboard shows an explicit fallback; and the legacy self-confirm success wording no longer claims an answer matched.

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

## 2026-08-16 — Driver.js Hints discoverability refinement

Owner approved replacing the experimental custom halo with the reusable `Driver.js Hints` component (`driver.js@1.8.0`). The workspace now renders one official non-blocking beacon beside the current semantic guidance target in Demo and Guided. The beacon is rebound after each state-driven guidance transition and removed on Independent mode, reset, and unmount. It uses `pointer-events: none`, so the actual simulated control remains clickable; Driver.js official reduced-motion CSS disables the pulse animation under `prefers-reduced-motion: reduce`.

The textual `Начните здесь` cue remains because it names the first action for users who do not infer a beacon immediately. Its wording is universal across desktop and mobile: `Нажмите «Продажи» в меню.` No overlay, popover, full tour, Invoice, Payment, or other Stage 1B.2 scope was added. `Decision` remains `PENDING`.

Implementation verification completed the engineering checks below; owner visual acceptance is still pending. The updated E2E coverage checks:
- one beacon in Demo and Guided;
- beacon absence in Independent;
- beacon rebind after target advancement;
- reset/mode cleanup;
- no overlay/popover;
- click-through behavior;
- desktop/mobile screenshots;
- reduced-motion static behavior.

Verification result:
- `npm install` — PASS; added `driver.js@1.8.0` (npm reports the existing 5 audit vulnerabilities and esbuild allow-scripts notice);
- `npm run lint` — PASS;
- `npm run typecheck` — PASS;
- `npm run test` — PASS (6 files, 14 tests);
- `npm run build` — PASS;
- `npm run check:secrets` — PASS;
- focused `npm run test:e2e -- e2e/customer-card-workspace.spec.ts --workers=1` — 8 passed (desktop/mobile); bounded wrapper exit `124` at 45s because the runner continued teardown after the tests;
- full `npm run test:e2e -- --workers=1` — 10 passed (desktop/mobile); bounded wrapper exit `124` at 60s because the runner continued teardown after the tests, matching the pre-existing handoff behavior;
- screenshots captured at `test-results/training-workspace-driver-hint-desktop-1440x900.png` and `test-results/training-workspace-driver-hint-mobile-360x800.png`.

## 2026-08-17 — Driver.js WIP revalidation

Remote synchronization was checked before continuation: `HEAD` and `origin/mpe/stage-1-validation` both remain `0b12de5` with no divergence. The untracked `minibase/` directory was preserved. The universal initial cue is present in the workspace and E2E: `Нажмите «Продажи» в меню.` No old desktop-specific initial cue, `training-target-active` custom halo class, custom halo keyframes, or abandoned halo file/import remains.

Fresh verification:
- `npm install` — PASS; dependencies are up to date; existing npm audit and esbuild allow-scripts warnings remain;
- `npm run lint` — PASS;
- `npm run typecheck` — PASS;
- `npm run test` — PASS (6 files, 14 tests);
- `npm run build` — PASS;
- `npm run check:secrets` — PASS;
- `npm run test:e2e -- --workers=1` — PASS (10/10, 21.9s, desktop/mobile);
- manual browser smoke — PASS at 1440x900 and 360x800; no horizontal overflow, one visible non-blocking beacon, no Driver.js overlay/popover, and the beacon aligned to the current target after mobile target scroll.

Manual screenshots:
- `test-results/manual-driver-hint-desktop-1440x900.png`;
- `test-results/manual-driver-hint-mobile-360x800.png`.

Owner visual acceptance remains pending. `Decision` remains `PENDING`; Stage 1B.2 Invoice, Payment, and all other blocked scope remain untouched.

## 2026-08-17 — Responsive guidance wording correction

Root review found one remaining desktop-specific phrase in the initial Guided hint. The guidance now says `Ищите раздел в меню учебной рабочей области.` and the customer-card unit test asserts this universal wording. Focused customer-card E2E passed `8/8` across desktop/mobile; the full serial E2E gate passed `10/10`. `Decision` remains `PENDING`; Stage 1B.2 remains blocked.
