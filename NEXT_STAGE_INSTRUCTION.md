# NEXT STAGE INSTRUCTION — Stage 1B.1 Counterparty Vertical Slice

## MPE decision

`EXTEND_EXISTING`

Owner approved the deep change on 2026-08-15. The old mandatory external-1C loop is obsolete for core MVP.

## Mandatory reading before code

Read in full:
1. `FOUNDATION.md`
2. `PRODUCT_REQUIREMENTS.md`
3. `ARCHITECTURE.md`
4. `DATA_MODEL.md`
5. `ROADMAP.md`
6. `STAGE_CHECKLIST.md`
7. `CODER_INSTRUCTION.md`
8. `docs/research/EMBEDDED_TRAINING_REFERENCES.md`
9. `SESSION_NOTES.md`

Then inspect existing source and list reusable components before writing new ones.

## Goal

Replace the weak `Карточка учебного покупателя` lesson with one complete embedded practical scenario where the learner works inside a 1C-like Training Workspace and completion is verified from workspace state.

This iteration is not a prototype mockup. It must establish reusable architecture for later invoice/payment slices.

## Required end-user flow

### Entry
- learner opens lesson;
- no paid 1C:Fresh requirement;
- embedded Training Workspace occupies the main working area;
- task/help panel is secondary and collapsible;
- persistent marker: `УЧЕБНАЯ СРЕДА — НЕ 1С`.

### Workspace path
Implement only the minimum supported path:
- application shell;
- relevant navigation section;
- `Контрагенты` list;
- `Создать`;
- counterparty form;
- fields required by scenario;
- `Сохранить` / equivalent supported action;
- return/list state if appropriate.

Use fictional scenario:
- name: `ТОО Учебный Покупатель`;
- city: `Кызылорда`;
- do not request real BIN/IIN.

## Three modes

### 1. `Показать`
- demonstrate the route automatically or semi-automatically;
- show concise explanation of what/why;
- highlight relevant controls;
- no scored completion.

### 2. `Вести меня`
- learner clicks/types personally;
- coach bubble is anchored to actual simulated control;
- spotlight target;
- step advances only after required action/state;
- include `Почему?`, hint 1, hint 2, `Показать действие`;
- if learner reaches a later valid state independently, recover rather than forcing obsolete earlier clicks.

### 3. `Проверить себя`
- hide step instructions/spotlights;
- show business task + source data + `Проверить работу`;
- learner navigates freely within implemented workspace;
- hints, if exposed, mark result as assisted.

## Domain implementation

Create/reuse a clear boundary such as:

```text
src/features/training-workspace/
├─ domain/
├─ repository/
├─ screens/
└─ components/

src/features/guidance/
├─ engine/
├─ components/
└─ target-registry/
```

Exact paths may adapt to existing conventions, but boundaries must remain.

Implement:
- `TrainingCounterparty`;
- minimal `TrainingScenarioState`;
- deterministic seed/reset;
- commands for create/update/save;
- local repository adapter.

Do not add backend.

## Semantic target registry

No brittle instructional selectors such as `.button:nth-child(3)`.

Use IDs/registry equivalents:
- `nav.counterparties`;
- `counterparties.create`;
- `counterparty.name`;
- `counterparty.city`;
- `counterparty.save`.

Guidance resolves targets through this registry.

## Verification Engine v2

Create a separate practical verifier.

Required assertions:
1. `Контрагент создан`;
2. `Название совпадает`;
3. `Город совпадает`;
4. `Карточка сохранена`.

`Проверить работу` shows each assertion and PASS/FAIL.

Critical negative test:
- entering/knowing `ТОО Учебный Покупатель` without a saved domain object must remain FAIL.

Legacy `text_exact`, `number`, `self_confirm` etc. may remain only for knowledge checks. Refactor types/naming if needed so nobody can confuse them with practical verification.

## Progress

Store at least:
- mode;
- attempt count;
- reset count;
- hints used;
- show-action count;
- last assertion result;
- completion = assisted/unassisted.

Use existing progress repository abstraction where possible.

## Legacy cleanup allowed

Inspect and remove/replace obsolete code/content related to this lesson when it conflicts with the new model, including:
- `externalAppUrl` dependency;
- button/flow whose only purpose is opening 1C:Fresh;
- answer-only practical completion;
- obsolete UI that duplicates Training Workspace task panel.

Do not preserve backward compatibility with a broken learning loop merely to reduce diff size.

Before deleting reusable abstractions, migrate their useful behavior first.

## UI fidelity

Create reusable 1C-like primitives rather than one-off pixel art.

Prioritize:
- hierarchy of app navigation;
- density and structure of lists/forms;
- command placement;
- labels/actions;
- focus behavior;
- save logic.

Do not use official 1C logo or claim official affiliation. Exact visual fidelity is gated by a future approved `Interface Passport` based on the selected 1C version.

## Mobile

At 360px:
- workspace remains usable;
- task/help becomes drawer/bottom sheet;
- active coach target is not covered;
- user can type and save without horizontal-trap failure;
- training marker remains visible.

## Tests

Unit:
- domain commands;
- reset deterministic;
- assertion pass/fail;
- answer-only cannot pass;
- assistance classification.

Component/integration:
- coach binds target;
- guided waits for condition;
- test mode hides guidance;
- assertion checklist renders precise failure.

E2E desktop + mobile:
- guided complete path;
- independent complete path;
- wrong field → specific FAIL → correction → PASS;
- reset;
- no external 1C navigation required.

Run all:
```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:secrets
npm run test:e2e
```

## Documentation update at end

Update factual status in:
- `README.md`;
- `ROADMAP.md`;
- `STAGE_CHECKLIST.md`;
- `VISUAL_PROGRESS.md`;
- `SESSION_NOTES.md`.

Do not mark owner review PASS yourself.

## Definition of Done

Engineering DONE requires:
- counterparty scenario works embedded;
- Demo/Guided/Test exist;
- domain state is real and resettable;
- practical verifier reads state;
- PASS/FAIL checklist is explicit;
- answer guessing cannot pass;
- legacy 1C:Fresh requirement removed from this flow;
- desktop/mobile checks pass;
- no real identifiers/secrets;
- docs updated.

## STOP CONDITION

After engineering DONE, stop and present the counterparty vertical slice for owner UX review.

Do not implement customer invoice, payment, FNO/ESF, Supabase, AI, browser automation, computer vision or additional accounting modules until owner explicitly passes this gate.