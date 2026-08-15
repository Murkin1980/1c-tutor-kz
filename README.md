# 1C Tutor KZ — интерактивный тренажёр по 1С и бухгалтерскому учёту

## Текущая продуктовая модель

1C Tutor KZ развивается как единая практическая образовательная система:

`1C Tutor → Accounting KZ → Professional Accountant → International Accounting → IFRS → International Practice`.

Core learning loop больше не строится вокруг обязательного открытия платного 1C:Fresh. Практика переносится во встроенную Training Workspace, где действия пользователя создают детерминированное учебное состояние, а результат проверяется по этому состоянию.

## Первый новый практический сценарий

Stage 1B.1 реализует:

`Карточка учебного покупателя` → `/learn/customer-card`.

Поддерживается:
- Demo / `Показать`;
- Guided Practice / `Вести меня`;
- Independent Test / `Проверить себя`;
- semantic target spotlight;
- condition-driven guidance;
- `Почему?`, hints и show-action;
- state-based Verification Engine v2;
- transparent PASS/FAIL assertions;
- assisted/unassisted completion;
- deterministic reset.

Сценарий использует только вымышленные данные:
- `ТОО Учебный Покупатель`;
- `Кызылорда`.

Практический PASS требует, чтобы сохранённая карточка действительно существовала в состоянии Training Workspace. Отдельный текстовый ответ не может завершить сценарий.

## Fidelity status

Текущая версия — semantic / interaction-model replica.

Atlas подтверждает workflow и структуру взаимодействия, но observation-grade Interface Passport конкретной доступной сборки Accounting KZ 3.0 ещё не завершён. Поэтому продукт не заявляет pixel-perfect совпадение с конкретной версией 1С.

Постоянно показывается маркировка:

`УЧЕБНАЯ СРЕДА — НЕ 1С`.

## Unified Accounting Knowledge Atlas

`knowledge/1c/` является source of truth для:
- 1C configurations/editions/workflows/interfaces;
- Accounting KZ;
- platform UI primitives;
- ZUP/Trade/UNF/ERP inventories;
- accounting concepts;
- future local→IFRS bridges;
- IFRS/IAS provenance/version/effective-date metadata;
- international accounting capabilities;
- cases/exercises/assessments.

Implementation rule:

`retrieve Atlas → identify gap → bounded ingestion → implement → link scenario back to Atlas`.

Не создавать отдельный IFRS Atlas.

## Архитектура Stage 1B

```text
React + TypeScript + Vite
├─ Learning Shell
├─ Training Workspace
│  ├─ deterministic training domain
│  ├─ simulated screens/forms/lists
│  └─ reset/seed
├─ Guidance
│  ├─ semantic targets
│  ├─ spotlight
│  └─ condition-driven steps
├─ Verification Engine v2
│  └─ domain-state assertions
└─ ProgressRepository
   └─ localStorage now, server adapter later
```

Frontend deployment target remains Cloudflare Pages.

## Current repository state

Active branch for the pivot:

`mpe/stage-1-validation`

Draft PR #2 contains the architecture reset, Atlas work, International Track design-pass and first Counterparty embedded workspace implementation.

`main` remains the target production branch and should not receive the pivot until review/merge.

## Local commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:secrets
npm run test:e2e
```

The Stage 1B.1 implementation added tests, but this ChatGPT execution environment could not check out the GitHub branch because its container had no network/DNS access to GitHub. Current GitHub head also has no active CI status checks. Therefore the new code is `PRE-REVIEW`, not falsely marked engineering PASS.

## Current gate

Next work is **not** Invoice implementation.

Follow `NEXT_STAGE_INSTRUCTION.md`:
1. run engineering checks in a real checkout;
2. smoke-test desktop/mobile;
3. owner reviews Demo / Guided / Independent Test;
4. record feedback in `docs/validation/STAGE1B1_OWNER_REVIEW.md`;
5. resolve blocking UX/fidelity issues;
6. only after explicit owner PASS start Stage 1B.2 Invoice.

## International Accounting / IFRS

International Track is already represented in architecture and Atlas, but runtime implementation is deferred until the 1C/Accounting KZ learning engine proves itself.

No separate repository, product or knowledge base is authorized.

Long-term direction focuses on verified professional capabilities such as reconciliations, close, journal entries, accruals/prepayments, GL/TB, working papers, audit support and IFRS treatment — not lecture completion alone.

## Safety

- fictional training data only;
- no real IIN/BIN in training fixtures;
- no EDS/NCALayer/bank credentials;
- no government submission;
- no automated control of real 1C;
- no mandatory paid external service in the embedded core loop;
- no official 1C logo/false affiliation;
- no bulk copying of 1C or IFRS copyrighted content.

## Source-of-truth order

1. `FOUNDATION.md`
2. `ROADMAP.md`
3. `NEXT_STAGE_INSTRUCTION.md`
4. `STAGE_CHECKLIST.md`
5. `CODER_INSTRUCTION.md`
6. `knowledge/1c/`
7. architecture/product/data documentation
8. `SESSION_NOTES.md`
