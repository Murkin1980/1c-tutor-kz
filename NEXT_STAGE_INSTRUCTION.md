# NEXT STAGE INSTRUCTION — Stage 1B Embedded Training Workspace

## MPE decision

`EXTEND_EXISTING`

Owner approved the deep change on 2026-08-15: the core MVP no longer depends on paid 1C:Fresh. The existing `1c-tutor-kz` repository remains the product. The next stage replaces the weak external-tab practice loop with an embedded, deterministic training workspace that imitates only the 1C workflows required by the course.

Reference research: `docs/research/EMBEDDED_TRAINING_REFERENCES.md`.

## Product principle

The learner must practice actions, not answer questions about actions.

A practical lesson is complete only when the training workspace reaches the expected state. A typed answer alone must never prove that a 1C operation was completed.

## Scope of Stage 1B

Build a narrow 1C-like training workspace for exactly three workflows:

1. create a fictional counterparty;
2. create a customer invoice;
3. register a customer payment/advance and inspect the resulting status/balance.

Do not build a complete accounting system or complete 1C clone.

## Learning modes

Every supported workflow must be able to run in three modes:

### 1. Demo — `Показать`
- the system demonstrates the path;
- controls may be highlighted automatically;
- explanations state what is happening and why;
- no score.

### 2. Guided Practice — `Вести меня`
- the learner performs each action;
- a contextual coach bubble points to the current relevant control;
- the next step appears only after the required action/state is observed;
- hints are available on demand;
- wrong actions receive specific feedback where safe and useful.

### 3. Independent Test — `Проверить себя`
- no step-by-step bubbles;
- only scenario, source data and expected business result are visible;
- learner may navigate freely within the supported workspace;
- deterministic state checks determine completion;
- hints, if requested, reduce or mark assisted completion.

## Workspace layout

Desktop:
- primary area: 1C-like application workspace;
- secondary collapsible panel: task, source data, progress and help;
- contextual coach bubbles anchored to the simulated controls;
- explicit `Проверить работу` action;
- `Подсказка`, `Сбросить шаг`, `Начать заново` actions.

Mobile:
- workspace remains primary;
- task/help panel becomes a bottom sheet or drawer;
- no two-tab requirement;
- coach remains attached to the active control without hiding it.

## UI fidelity rule

Reproduce the logic and visual language of the selected 1C:Бухгалтерия для Казахстана workflows closely enough that a beginner forms useful interface habits:
- main navigation structure;
- form hierarchy;
- common button placement and naming;
- tables, fields, selectors and document states;
- save/post/close logic where relevant.

Do not use official logos or imply that Tutor is an official 1C product. Keep a persistent visible training marker.

Until a specific 1C version is researched and approved, use an explicit `training replica` designation and avoid claiming pixel-perfect fidelity.

## Deterministic training state

Introduce a local training-domain state separate from quiz answers. At minimum model:
- `TrainingCounterparty`;
- `TrainingInvoice`;
- `TrainingInvoiceLine`;
- `TrainingPayment`;
- derived balance/status;
- scenario seed/reset state;
- user action/event log needed for guidance and diagnostics.

State must be resettable and deterministic. No real IIN/BIN or real company records.

## Verification engine v2

Replace practical-task verification with environment-state assertions.

Example for invoice task:
- expected counterparty exists;
- invoice exists for that counterparty;
- expected item exists;
- quantity = 2;
- price = 122500;
- total = 245000 KZT;
- required document state is reached.

`Проверить работу` must show a readable checklist such as:
- Контрагент создан — PASS
- Счёт создан — PASS
- Количество 2 — PASS
- Цена 122 500 ₸ — PASS
- Итог 245 000 ₸ — PASS

On failure, identify the failed condition without revealing the entire solution immediately.

Knowledge verification types may remain for theory, but `self_confirm`, `text_exact`, `number`, etc. cannot independently complete a practical accounting task.

## Coach / helper system

Create a reusable guidance layer with:
- anchored tooltip/bubble;
- spotlight/highlight target;
- current step counter;
- `Почему?` explanation;
- first-level hint;
- stronger second-level hint;
- optional `Показать действие` only in learning mode;
- ability to recover if learner is already at a later valid state.

Guidance logic must be condition-driven, not only next-button driven.

## First vertical slice

Implement only one complete lesson first: `Карточка учебного покупателя`.

The slice is accepted only if a learner can:
1. enter the embedded workspace;
2. navigate to counterparties;
3. create `ТОО Учебный Покупатель` with fictional scenario data;
4. save it;
5. press `Проверить работу`;
6. see exactly which state assertions passed;
7. retry after an incorrect entry;
8. reset the scenario;
9. repeat the same task in Independent Test mode.

After this vertical slice passes tests and owner UX review, reuse the same components for invoice and payment workflows.

## Reuse requirements

Reuse existing:
- React/TypeScript/Vite app;
- routing and shell;
- course content architecture where compatible;
- progress repository abstraction;
- existing verification code for theory-only questions;
- existing responsive/security foundations.

Do not create a new repository, separate frontend, second design system or external training service.

## Explicitly deferred

- full 1C clone;
- all accounting modules;
- FNO / ESF simulators;
- Supabase migration unless strictly needed after local vertical slice validation;
- browser extension;
- automated control of real 1C;
- computer vision as primary scoring;
- AI as primary verifier;
- paid 1C:Fresh dependency;
- real credentials or company data.

## Tests

Add tests proving:
- practical completion depends on workspace state, not typed expected answers;
- a correct final number without a created document does not pass;
- guided mode advances only after the required condition;
- test mode hides step instructions;
- reset returns to deterministic seed state;
- invalid/real-looking identifiers are rejected according to the training-data rules;
- mobile layout keeps the active simulated control usable;
- all existing security checks remain green.

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:secrets
npm run test:e2e
```

## Definition of Done — Stage 1B vertical slice

- no 1C:Fresh requirement in the selected lesson;
- embedded training workspace is usable on desktop and mobile;
- one counterparty workflow resembles the selected 1C interaction model sufficiently for owner review;
- Demo, Guided Practice and Independent Test are all functional for this workflow;
- state-based verification clearly explains what it checks;
- guessing the expected answer cannot pass the task;
- deterministic reset/retry works;
- no real credentials or identifiers are requested;
- documentation and session notes are updated;
- owner manually reviews the vertical slice before invoice/payment expansion.

## Stop condition

Do not implement invoice/payment workflows until the counterparty vertical slice is manually reviewed and judged directionally correct. If the replica teaches the wrong interaction habits or the coach obstructs normal use, fix the vertical slice before expanding scope.
