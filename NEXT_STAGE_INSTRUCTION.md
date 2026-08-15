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
8. `knowledge/1c/README.md`
9. `knowledge/1c/SOURCE_REGISTER.md`
10. `knowledge/1c/TAXONOMY.md`
11. `knowledge/1c/GRAPH_SCHEMA.md`
12. `knowledge/1c/RETRIEVAL_RULES.md`
13. `knowledge/1c/INGESTION_RULES.md`
14. `knowledge/1c/COVERAGE.md`
15. `docs/research/EMBEDDED_TRAINING_REFERENCES.md`
16. `SESSION_NOTES.md`

Then inspect existing source and list reusable components before writing new ones.

## Goal

Replace the weak `Карточка учебного покупателя` lesson with one complete embedded practical scenario where the learner works inside a 1C-like Training Workspace and completion is verified from workspace state.

This iteration must establish reusable architecture for later invoice/payment slices.

## Phase 0 — Knowledge Atlas prerequisite

Before UI implementation run this retrieval query:

`accounting-kz / edition 3.0 / counterparties / create-counterparty`.

Current Atlas status is `RESEARCH_REQUIRED` until bounded evidence is added.

### Required ingestion
Using primary sources first, establish:
- selected/observed Accounting KZ 3.0 version context;
- navigation path to the counterparty list;
- observed list/form titles;
- create/save command labels and interaction sequence;
- fields required by our narrow fictional training scenario;
- important list/form layout relationships;
- state after save;
- known differences between observed 1C and Tutor replica.

Create:
- `knowledge/1c/configurations/accounting-kz/3.0/workflows/create-counterparty.md` from Workflow template;
- `knowledge/1c/configurations/accounting-kz/3.0/interfaces/create-counterparty.md` from Interface Passport template;
- evidence record(s);
- graph nodes/edges connecting workflow/screens/commands/evidence.

Do not bulk-copy manuals/screenshots. Store normalized facts + provenance.

If primary online documentation does not expose enough UI detail, mark the unknowns and require manual observation of a legally available 1C environment. Do not invent precise UI.

Only after Atlas retrieval is READY enough for the slice continue to Phase 1.

## Phase 1 — End-user flow

### Entry
- learner opens lesson;
- no paid 1C:Fresh requirement;
- embedded Training Workspace occupies main working area;
- task/help panel is secondary and collapsible;
- persistent marker: `УЧЕБНАЯ СРЕДА — НЕ 1С`.

### Workspace path
Implement only the minimum path confirmed by the Interface Passport:
- application shell;
- relevant navigation section;
- `Контрагенты` list;
- create command;
- counterparty form;
- scenario fields;
- save command;
- resulting list/form state.

Fictional scenario:
- name: `ТОО Учебный Покупатель`;
- city: `Кызылорда`;
- never request real BIN/IIN.

## Phase 2 — Three modes

### `Показать`
- demonstrate the confirmed route;
- concise what/why explanations;
- highlight relevant controls;
- no scored completion.

### `Вести меня`
- learner clicks/types personally;
- coach bubble anchored to actual simulated control;
- spotlight target;
- step advances only after required action/state;
- `Почему?`, hint 1, hint 2, `Показать действие`;
- recover if learner reaches a later valid state independently.

### `Проверить себя`
- hide step instructions/spotlights;
- show business task + source data + `Проверить работу`;
- free navigation inside supported workspace;
- hints, if exposed, mark result assisted.

## Phase 3 — Domain implementation

Create/reuse boundaries such as:

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

Exact paths may adapt to existing conventions.

Implement:
- `TrainingCounterparty`;
- minimal `TrainingScenarioState`;
- deterministic seed/reset;
- create/update/save commands;
- local repository adapter.

Do not add backend.

## Semantic target registry

No brittle instructional selectors like `.button:nth-child(3)`.

Use stable IDs, aligned with Atlas objects where possible:
- `nav.counterparties`;
- `counterparties.create`;
- `counterparty.name`;
- `counterparty.city`;
- `counterparty.save`.

Guidance resolves targets through registry.

## Verification Engine v2

Required assertions:
1. `Контрагент создан`;
2. `Название совпадает`;
3. `Город совпадает`;
4. `Карточка сохранена`.

`Проверить работу` shows each assertion PASS/FAIL.

Critical negative test:
- knowing/typing `ТОО Учебный Покупатель` without a saved domain object remains FAIL.

Legacy `text_exact`, `number`, `self_confirm` etc. may remain only for knowledge checks. Rename/refactor types if needed to remove ambiguity.

## Progress

Store at least:
- mode;
- attempt count;
- reset count;
- hints used;
- show-action count;
- last assertion result;
- completion assisted/unassisted.

Use existing progress repository abstraction where possible.

## Legacy cleanup allowed

Remove/replace obsolete code/content for this lesson when it conflicts with the new model, including:
- `externalAppUrl` dependency;
- opening 1C:Fresh as core action;
- answer-only practical completion;
- obsolete UI duplicating the Training Workspace task panel.

Do not preserve a broken learning loop solely to minimize diff size.

## UI fidelity

Build reusable 1C-like primitives from the approved Interface Passport. Prioritize:
- navigation hierarchy;
- density/structure of list and form;
- command relationships;
- labels/actions;
- focus behavior;
- save logic.

No official 1C logo or false affiliation.

## Mobile

At 360px:
- workspace remains usable;
- task/help becomes drawer/bottom sheet;
- coach does not cover target;
- user can type/save without horizontal trap;
- training marker remains visible.

## Tests

Unit:
- domain commands;
- deterministic reset;
- assertion pass/fail;
- answer-only cannot pass;
- assistance classification.

Integration:
- coach binds semantic target;
- guided waits for condition;
- test mode hides guidance;
- assertion checklist shows precise failure.

E2E desktop + mobile:
- guided complete path;
- independent complete path;
- wrong field → specific FAIL → correction → PASS;
- reset;
- no external 1C navigation required.

Run:
```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:secrets
npm run test:e2e
```

## Documentation at end

Update factual status in:
- `README.md`;
- `ROADMAP.md`;
- `STAGE_CHECKLIST.md`;
- `knowledge/1c/COVERAGE.md`;
- `VISUAL_PROGRESS.md`;
- `SESSION_NOTES.md`.

Do not mark owner review PASS yourself.

## Definition of Done

Engineering DONE requires:
- Atlas query + evidence + workflow + Interface Passport recorded;
- counterparty scenario works embedded;
- Demo/Guided/Test exist;
- domain state is real/resettable;
- practical verifier reads state;
- PASS/FAIL checklist explicit;
- answer guessing cannot pass;
- legacy 1C:Fresh requirement removed from this flow;
- desktop/mobile checks pass;
- no real identifiers/secrets;
- docs updated.

## STOP CONDITION

After engineering DONE, stop and present the counterparty vertical slice for owner UX/fidelity review.

Do not implement customer invoice, payment, FNO/ESF, Supabase, AI, browser automation, computer vision or additional accounting modules until owner explicitly passes this gate.