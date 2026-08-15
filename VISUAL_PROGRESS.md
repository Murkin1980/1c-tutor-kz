# VISUAL PROGRESS — 1C Tutor KZ

Обновлено: 2026-08-15.

После MPE pivot старые проценты frontend/ФНО не отражают реальную готовность продукта. Прогресс пересчитан по новой архитектуре.

## Общая готовность

```text
MPE pivot / product foundation       ██████████ 100%
1C Knowledge Atlas bootstrap         ███░░░░░░░  30%
Training Workspace engine            ░░░░░░░░░░   0%
Guidance Engine                       ░░░░░░░░░░   0%
Verification Engine v2                ░░░░░░░░░░   0%
Counterparty vertical slice           ░░░░░░░░░░   0%
Invoice vertical slice                ░░░░░░░░░░   0%
Payment/advance vertical slice        ░░░░░░░░░░   0%
Learning engine hardening             ░░░░░░░░░░   0%
Stage K1 full Atlas coverage          █░░░░░░░░░  10%
Broad Accounting KZ curriculum        ░░░░░░░░░░   0%
Cross-configuration tracks            ░░░░░░░░░░   0%
Server persistence                    ░░░░░░░░░░   0%
Real-1C transfer assessment           ░░░░░░░░░░   0%
FNO / ESF                              ░░░░░░░░░░   0%
```

## Что уже есть и переиспользуется

🟢 React + TypeScript + Vite frontend shell.

🟢 Routing, local repositories, progress infrastructure, responsive/security setup и tests первого прототипа.

🟢 Новая product/architecture/data/coder документация согласована вокруг embedded Training Workspace.

🟢 Создан `knowledge/1c/`: source registry, taxonomy, graph schema, retrieval/ingestion rules, templates, seed graph, coverage matrix и Stage K1 instruction.

🟢 Старый `FIRST_STAGE_INSTRUCTION.md` удалён как конфликтующий.

🟢 FNO/ESF Portal Replica Spec явно переведён в deferred status.

## Текущий рубеж

### Milestone M1B.1 — Counterparty vertical slice

```text
[ ] Atlas bounded ingestion: create-counterparty
[ ] Workflow Record
[ ] Interface Passport
[ ] embedded Training Workspace shell
[ ] counterparty domain state
[ ] Demo
[ ] Guided Practice + contextual coach
[ ] Independent Test
[ ] state-based Verification v2
[ ] transparent PASS/FAIL assertions
[ ] deterministic reset
[ ] desktop/mobile e2e
[ ] owner UX/fidelity PASS
```

## Knowledge Atlas status

Current retrieval:

`accounting-kz / 3.0 / counterparties / create-counterparty` → `RESEARCH_REQUIRED`.

Atlas уже знает configuration families и официальные source families, но точный Interface Passport контрагента ещё не создан.

## Главные gates

1. Нельзя реализовывать точный 1C-like workflow по догадке — сначала Atlas evidence.
2. Нельзя начать Invoice до owner PASS Counterparty.
3. Нельзя начать Payment до owner PASS Invoice.
4. Нельзя массово расширять курс до Stage K1 PASS.
5. Нельзя превращать Atlas в зеркало ИТС или полный клон 1С.
6. Нельзя внедрять Supabase/AI/vector DB как обязательную инфраструктуру без нового MPE value gate.

## Следующее действие Codex

Следовать `NEXT_STAGE_INSTRUCTION.md`:
1. bounded Atlas ingestion для Counterparty;
2. затем реализовать один vertical slice;
3. остановиться на owner review.

## Правило обновления

Проценты повышаются только при наличии фактического кода/данных/evidence и соответствующих проверок. Документальная готовность не выдаётся за готовность пользовательского workflow.