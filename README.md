# 1C Tutor KZ

Интерактивный браузерный тренажёр по пользовательским сценариям `1С:Бухгалтерия для Казахстана` с перспективой отдельных учебных треков для других конфигураций 1С Казахстана.

## Core MVP после MPE pivot

С 2026-08-15 основной практический контур больше не зависит от платного 1C:Fresh и переключения между двумя вкладками.

Практика проходит во встроенной **Training Workspace** — ограниченной 1C-like учебной рабочей области с вымышленными данными, contextual coach и детерминированной проверкой состояния.

Практический урок считается выполненным только тогда, когда нужный объект/документ/состояние действительно создано внутри Training Workspace. Правильный ответ в тестовом поле сам по себе не доказывает практический навык.

## Learning model

Каждый practical workflow развивается по трём режимам:

1. **Показать / Demo** — увидеть правильный путь и объяснение.
2. **Вести меня / Guided Practice** — выполнять действия самому, получая помощь рядом с нужным контролом.
3. **Проверить себя / Independent Test** — только бизнес-задача и исходные данные; результат определяют state assertions.

Дополнительно:
- contextual coach + spotlight;
- `Почему?`;
- двухуровневые подсказки;
- optional `Показать действие`;
- assisted/unassisted completion;
- deterministic reset/retry;
- прозрачный `Проверить работу` с PASS/FAIL по каждому условию.

Паттерны выбраны по исследованию SAP Enable Now/Companion, Salesforce Trailhead, Oracle Guided Learning, Assima, Skillable и Instruqt. Исследование: `docs/research/EMBEDDED_TRAINING_REFERENCES.md`.

## 1C Knowledge Atlas

`knowledge/1c/` — постоянный source of truth для знаний проекта о 1С.

Он хранит не копии руководств, а структурированные факты и provenance:

```text
Platform
→ Configuration
→ Edition / Version
→ BusinessArea
→ Workspace / Object
→ Screen
→ Command / Field / State
→ Workflow
→ LearningScenario
→ VerificationAssertion
```

Начальные configuration families:
- Accounting KZ;
- HRM/ZUP KZ;
- Trade KZ;
- UNF KZ;
- ERP KZ;
- Complex Automation KZ;
- generic 1C:Enterprise platform concepts.

Перед реализацией нового 1C-like workflow Codex обязан сначала сделать Atlas retrieval. Если данных не хватает, выполняется bounded ingestion из официальных источников и Atlas обновляется до начала fidelity implementation.

Подробнее:
- `knowledge/1c/README.md`;
- `knowledge/1c/SOURCE_REGISTER.md`;
- `knowledge/1c/GRAPH_SCHEMA.md`;
- `knowledge/1c/RETRIEVAL_RULES.md`;
- `knowledge/1c/STAGE_K1_INSTRUCTION.md`.

## Current stage

**Stage 1B.1 — Counterparty Vertical Slice.**

Нужно реализовать ровно один полный practical workflow:

`Контрагенты → создать ТОО Учебный Покупатель → сохранить → Проверить работу`.

Перед UI implementation требуется завершить Atlas Workflow Record + Interface Passport для выбранной/наблюдаемой `Бухгалтерия для Казахстана 3.0`.

До ручного owner PASS запрещено расширять код на счёт и оплату.

## Что должен доказать первый slice

- встроенная среда формирует полезные 1С-интерфейсные привычки;
- Demo/Guided/Test работают на одном domain state;
- coach привязан к semantic controls;
- practical verifier читает состояние среды;
- правильный текст без сохранённого контрагента остаётся FAIL;
- пользователь видит, что именно проверено;
- reset полностью восстанавливает seed;
- desktop/mobile работают;
- платный внешний сервис не требуется.

## Architecture

```text
React + TypeScript
├─ Learning Shell
├─ Training Workspace
│  ├─ 1C-like screens
│  ├─ training domain state
│  └─ seed/reset engine
├─ Guidance Engine
│  ├─ semantic target registry
│  ├─ coach bubble / spotlight
│  └─ condition-driven steps
├─ Verification Engine v2
│  └─ state assertions
├─ Progress Repository
└─ 1C Knowledge Atlas
   ├─ source registry
   ├─ taxonomy
   ├─ graph nodes/edges
   ├─ workflow records
   ├─ interface passports
   └─ evidence records
```

Stage 1B remains frontend/local-state first. Server persistence is deliberately deferred until the learning engine proves value.

## Source-of-truth order

1. `FOUNDATION.md`
2. `PRODUCT_REQUIREMENTS.md`
3. `ARCHITECTURE.md`
4. `DATA_MODEL.md`
5. `ROADMAP.md`
6. `STAGE_CHECKLIST.md`
7. `NEXT_STAGE_INSTRUCTION.md`
8. `CODER_INSTRUCTION.md`
9. `knowledge/1c/*`
10. `SESSION_NOTES.md`

Historical files are not implementation authority when they conflict with this order.

## Roadmap shape

1. prove Counterparty vertical slice;
2. owner gate;
3. reuse engine for Invoice;
4. owner gate;
5. reuse engine for Payment/Advance;
6. harden learning engine;
7. complete **Stage K1 Knowledge Atlas Bootstrap**;
8. only then expand Accounting KZ curriculum broadly;
9. later select ZUP/Trade/UNF tracks by measurable user value;
10. server persistence / transfer to real 1C / FNO-ESF are separate later gates.

## Safety / legal

- only fictional data;
- `УЧЕБНАЯ СРЕДА — НЕ 1С` always visible;
- no real IIN/BIN/password/ECP/bank keys;
- no automatic real-1C or government-system actions;
- no official 1C logo or claim of affiliation;
- no bulk mirroring of ITS/manuals/screenshots/paywalled courses;
- Atlas stores normalized facts, source metadata and evidence links;
- regulation/payroll/tax logic requires exact KZ evidence and specialist validation before publication.

See `SECURITY_AND_LEGAL.md`.

## Existing reusable prototype assets

The original frontend prototype already contains useful pieces:
- React/TypeScript/Vite shell;
- routes;
- browser repository abstractions;
- progress infrastructure;
- responsive/security setup;
- theory verification types;
- test setup.

Code that enforces the obsolete `externalAppUrl → 1C:Fresh → answer-only practical check` flow may be removed or rewritten. Reusable abstractions should be retained where they fit the new architecture.

## Commands

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

## Current source branch

The architectural pivot is being prepared in `mpe/stage-1-validation` and draft PR #2. `main` is intentionally not treated as already migrated until the new direction is reviewed/merged.