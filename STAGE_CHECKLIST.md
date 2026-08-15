# STAGE CHECKLIST — 1C Tutor KZ

Обновлено: 2026-08-15.

## Общие ворота каждой итерации

- [ ] Прочитаны актуальные FOUNDATION / PRD / ARCHITECTURE / DATA_MODEL / ROADMAP / NEXT_STAGE.
- [ ] Проверен MPE scope и stop condition.
- [ ] Новый код расширяет существующий проект, а не создаёт параллельную систему.
- [ ] Использованы только вымышленные данные.
- [ ] Нет реальных ИИН/БИН, ЭЦП, паролей, банковских ключей.
- [ ] Нет обязательного 1C:Fresh или другого платного SaaS.
- [ ] Training Workspace явно маркирован как учебный.
- [ ] Practical completion определяется domain state.
- [ ] Правильный quiz-answer без операции не даёт PASS.
- [ ] Есть reset к deterministic seed.
- [ ] Coach не перекрывает активный control.
- [ ] Desktop и mobile smoke/e2e пройдены.
- [ ] lint/typecheck/unit/build/secrets/e2e PASS.
- [ ] SESSION_NOTES/VISUAL_PROGRESS обновлены.

## Stage 1B.1 — Counterparty vertical slice

### Domain
- [ ] `TrainingScenarioState` создан.
- [ ] `TrainingCounterparty` создан.
- [ ] seed содержит только fictional data.
- [ ] create/edit/save работают.
- [ ] reset полностью восстанавливает seed.

### Workspace UI
- [ ] embedded workspace route/surface.
- [ ] 1C-like navigation shell.
- [ ] список контрагентов.
- [ ] команда `Создать`.
- [ ] карточка контрагента.
- [ ] команда сохранения.
- [ ] training banner/watermark.
- [ ] никакого required external-tab flow.

### Demo
- [ ] демонстрация доходит до результата.
- [ ] объяснения краткие и привязаны к действиям.
- [ ] Demo не создаёт scored completion.

### Guided Practice
- [ ] bubble привязан к semantic target.
- [ ] spotlight виден.
- [ ] шаг меняется только после правильного action/state.
- [ ] `Почему?` работает.
- [ ] hint 1 работает.
- [ ] hint 2 работает.
- [ ] `Показать действие` работает.
- [ ] сценарий восстанавливается после допустимого свободного действия.

### Independent Test
- [ ] пошаговые bubbles скрыты.
- [ ] видна только задача/исходные данные/проверка.
- [ ] пользователь свободно навигирует в supported workspace.
- [ ] hints, если разрешены, помечают assisted result.

### Verification v2
- [ ] проверяется existence.
- [ ] проверяется expected name.
- [ ] проверяется expected city/required fields.
- [ ] проверяется saved state.
- [ ] отображается PASS/FAIL по каждому assertion.
- [ ] failure feedback не просто `Неверно`.
- [ ] typed expected text alone => FAIL.

### Progress
- [ ] mode сохраняется.
- [ ] attempts/resets считаются.
- [ ] hints/show-action считаются.
- [ ] `completed_unassisted` различается от `completed_assisted`.

### Owner gate
- [ ] owner прошёл Demo.
- [ ] owner прошёл Guided.
- [ ] owner прошёл Independent Test.
- [ ] интерфейс признан достаточно похожим по логике для обучения.
- [ ] проверка результата понятна.
- [ ] owner разрешил переход к invoice slice.

## Stage 1B.2 — Invoice

Не начинать, пока owner gate 1B.1 не PASS.

- [ ] переиспользованы workspace/guidance/verification primitives.
- [ ] counterparty selection.
- [ ] invoice lines.
- [ ] quantity/price/total.
- [ ] save/status.
- [ ] Demo/Guided/Test.
- [ ] state assertions.
- [ ] owner PASS.

## Stage 1B.3 — Payment

Не начинать, пока 1B.2 не PASS.

- [ ] payment state.
- [ ] linkage to counterparty/invoice.
- [ ] amount/status.
- [ ] derived balance.
- [ ] Demo/Guided/Test.
- [ ] state assertions.
- [ ] owner PASS.

## Архитектурные красные флаги

Немедленно остановиться и вернуть задачу через MPE, если требуется:
- полный клон 1С;
- новый repository/frontend;
- новый backend только ради одного vertical slice;
- real 1C automation;
- credential capture;
- FNO/ESF до roadmap gate;
- AI/computer vision как замена deterministic verification;
- массовая реализация нескольких сценариев до PASS текущего slice.
