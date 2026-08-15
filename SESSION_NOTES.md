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
