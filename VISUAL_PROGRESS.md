# VISUAL PROGRESS — 1C Tutor KZ

Обновлено: 2026-08-15.

Прогресс отражает новую архитектуру после MPE pivot и не засчитывает документирование как готовый пользовательский workflow.

## Общая готовность

```text
MPE pivot / product foundation       ██████████ 100%
Unified Accounting Knowledge Atlas   ██████░░░░  60%
Training Workspace engine            ███████░░░  70%
Guidance Engine                       ██████░░░░  60%
Verification Engine v2                ███████░░░  75%
Counterparty vertical slice           ███████░░░  70%
Invoice vertical slice                █░░░░░░░░░  10%  (Atlas only; code blocked)
Payment/advance vertical slice        █░░░░░░░░░  10%  (Atlas only; code blocked)
Learning engine hardening             ██░░░░░░░░  20%
Stage K1 full Atlas coverage          █████░░░░░  50%
Broad Accounting KZ curriculum        ██░░░░░░░░  20%  (knowledge map, not lessons)
Cross-configuration tracks            ██░░░░░░░░  20%  (Atlas inventory only)
Professional Accountant layer         █░░░░░░░░░  10%  (architecture only)
International Track architecture      ██████████ 100%  (design only)
International capability research     █████░░░░░  50%
Server persistence                    ░░░░░░░░░░   0%
Real-1C transfer assessment           ░░░░░░░░░░   0%
FNO / ESF                              ░░░░░░░░░░   0%
```

## Что уже есть и переиспользуется

🟢 React + TypeScript + Vite frontend shell.

🟢 Routing, local repositories, progress infrastructure, responsive/security setup и tests первого прототипа.

🟢 `knowledge/1c/` содержит source registry, taxonomy, graph schema, retrieval/ingestion rules, evidence, workflow records, draft Interface Passports, retrieval proof queries и cross-configuration inventories.

🟢 Unified Atlas расширен для Accounting KZ + будущего International Accounting / IFRS без второго knowledge base.

🟢 Для Stage 1B.1 реализован embedded route `/learn/customer-card`.

🟢 Реализован deterministic counterparty domain state, save/reset, action log.

🟢 Реализованы Demo / Guided / Independent Test.

🟢 Реализованы semantic targets, spotlight, condition-driven guidance, `Почему?`, hints и show-action.

🟢 Реализован Verification Engine v2: existence/name/city/saved assertions с expected/actual/hint.

🟢 Практический PASS больше не зависит от отдельного typed answer.

🟢 Прогресс различает assisted/unassisted completion и считает hints/show-action/resets/attempts.

🟢 Добавлены unit specifications и Playwright scenarios для нового workspace.

🟡 Exact installed-build UI fidelity ещё не подтверждена observation-grade Interface Passport.

🟡 Automated tests добавлены, но в текущей ChatGPT execution environment не запущены: container не имеет сетевого доступа к GitHub, а текущий head не имеет активных CI status checks.

## Текущий рубеж

### Milestone M1B.1 — Counterparty vertical slice — PRE-REVIEW

```text
[x] Atlas bounded ingestion: create-counterparty
[x] Workflow Record
[x] draft Interface Passport + unresolved exact-build gaps
[x] embedded Training Workspace shell
[x] counterparty domain state
[x] Demo (non-scored)
[x] Guided Practice + target spotlight
[x] Independent Test
[x] state-based Verification v2
[x] transparent PASS/FAIL assertions
[x] assisted/unassisted completion metadata
[x] deterministic reset
[x] responsive CSS
[x] unit/e2e test specifications written
[ ] anchored floating coach bubble by target bounds
[ ] lint/typecheck/unit/build/secrets/e2e actually executed
[ ] desktop/mobile manual smoke
[ ] observation-grade UI Passport
[ ] owner UX/fidelity PASS
```

## Knowledge Atlas status

Current retrieval:

`accounting-kz / 3.0 / counterparties / create-counterparty` → `IMPLEMENTATION_SUPPORT_READY / EXACT_UI_OBSERVATION_PENDING`.

The Atlas supports semantic implementation and state verification. It does not yet authorize a pixel-fidelity claim for a specific Accounting KZ build.

## International Track status

Architecture is fixed but runtime implementation is deferred.

Progression:

`1C Tutor → Accounting KZ → Professional Accountant → International Accounting → IFRS → International Practice`.

Current international work remains Atlas/research only. Initial market evidence prioritizes reconciliations, close, journal entries, accruals/prepayments, GL/TB, working papers and audit support over lecture-first IFRS.

## Главные gates

1. Нельзя заявлять exact 1C fidelity без observation-grade Interface Passport.
2. Нельзя начать Invoice implementation до owner PASS Counterparty.
3. Нельзя начать Payment implementation до owner PASS Invoice.
4. Нельзя массово расширять курс до Stage K1 PASS.
5. Нельзя превращать Atlas в зеркало ИТС/IFRS Standards или полный клон 1С.
6. Нельзя внедрять Supabase/AI/vector DB как обязательную инфраструктуру без MPE value gate.
7. International Track не должен вытеснять незавершённый основной learning engine.

## Следующее действие

1. Выполнить engineering checks в среде с checkout ветки.
2. Открыть `/learn/customer-card` и пройти Demo / Guided / Independent Test.
3. Зафиксировать owner UX feedback.
4. Закрыть anchored coach/fidelity gaps, если они реально мешают обучению.
5. Только после owner PASS разрешить Stage 1B.2 Invoice.

## Правило обновления

Проценты повышаются только при наличии фактического кода/данных/evidence и соответствующих проверок. Документальная готовность не выдаётся за готовность пользовательского workflow.
