# STAGE CHECKLIST — 1C Tutor KZ

Обновлено: 2026-08-15.

## Общие ворота каждой итерации

- [x] Прочитаны актуальные FOUNDATION / PRD / ARCHITECTURE / DATA_MODEL / ROADMAP / NEXT_STAGE.
- [x] Проверен MPE scope и stop condition.
- [x] Новый код расширяет существующий проект, а не создаёт параллельную систему.
- [x] Для 1C-like workflow выполнен Atlas retrieval.
- [x] Указаны Atlas node/evidence/source IDs и confidence.
- [x] RESEARCH_REQUIRED gaps закрыты bounded ingestion или явно оставлены как fidelity blocker.
- [x] Использованы только вымышленные данные.
- [x] Нет реальных ИИН/БИН, ЭЦП, паролей, банковских ключей.
- [x] Нет обязательного 1C:Fresh в новом Stage 1B.1 core loop.
- [x] Training Workspace явно маркирован как учебный.
- [x] Practical completion определяется domain state.
- [x] Правильный quiz-answer без операции не даёт PASS.
- [x] Есть reset к deterministic seed.
- [x] Coach/подсказка не перекрывает активный control; текущая версия использует side panel + target spotlight.
- [ ] Desktop и mobile smoke/e2e фактически пройдены в исполняемой среде.
- [ ] lint/typecheck/unit/build/secrets/e2e фактически PASS в исполняемой среде.
- [x] SESSION_NOTES/VISUAL_PROGRESS/COVERAGE обновлены при изменении факта или явно отмечены pending.

## Stage 1B.1 — Counterparty vertical slice

### Atlas prerequisite
- [x] query `accounting-kz / 3.0 / counterparties / create-counterparty` выполнен.
- [x] Workflow Record создан/обновлён.
- [x] Interface Passport draft создан для выбранной semantic model.
- [x] UI-sensitive facts имеют primary evidence на уровне workflow/topology.
- [x] unresolved exact-build gaps не маскируются выдуманным интерфейсом.
- [ ] observation-grade Interface Passport выбранной доступной сборки.

### Domain
- [x] `CustomerCardTrainingState` создан.
- [x] `TrainingCounterparty` создан.
- [x] seed содержит только fictional data.
- [x] create/edit/save работают в reducer/domain model.
- [x] reset полностью восстанавливает seed.

### Workspace UI
- [x] embedded workspace route/surface `/learn/customer-card`.
- [x] 1C-like navigation shell в пределах semantic model.
- [x] список контрагентов.
- [x] create command.
- [x] карточка контрагента.
- [x] save command.
- [x] training banner `УЧЕБНАЯ СРЕДА — НЕ 1С`.
- [x] никакого required external-tab flow для `customer-card`.
- [x] responsive desktop/mobile CSS layout реализован.
- [ ] manual mobile/desktop smoke-test в запущенном приложении.

### Demo
- [x] Demo может пройти весь сценарий через `Показать действие`.
- [x] объяснения краткие и связаны с текущим условием.
- [x] Demo не создаёт scored completion.

### Guided Practice
- [x] semantic target registry через `data-training-target`.
- [x] spotlight виден на текущем target.
- [x] шаг меняется только после требуемого action/state.
- [x] `Почему?` работает.
- [x] hint 1 работает.
- [x] hint 2 работает.
- [x] `Показать действие/Сделать за меня` работает и учитывается как помощь.
- [x] сценарий condition-driven, а не Next-button-driven.
- [ ] отдельный anchored floating coach bubble, физически привязанный к target bounds; текущая версия использует side panel + spotlight.

### Independent Test
- [x] пошаговые bubbles/guidance скрыты.
- [x] видна задача/исходные данные/проверка.
- [x] пользователь свободно навигирует в supported workspace.
- [x] result может быть `completed_unassisted` или `completed_assisted`.

### Verification v2
- [x] проверяется existence.
- [x] проверяется expected name.
- [x] проверяется expected city.
- [x] проверяется saved state.
- [x] отображается PASS/FAIL по каждому assertion.
- [x] failure feedback показывает expected/actual/hint.
- [x] typed expected text alone => FAIL по unit spec.
- [x] unit test описывает state-only completion path.

### Progress
- [x] mode сохраняется.
- [x] attempts считаются.
- [x] resets считаются.
- [x] hints/show-action считаются.
- [x] `completed_unassisted` различается от `completed_assisted`.

### Automated test coverage added
- [x] initial state cannot PASS.
- [x] correct unsaved draft cannot PASS.
- [x] expected saved state PASS.
- [x] wrong city produces field-level FAIL.
- [x] guidance advances by state.
- [x] deterministic reset covered.
- [x] Playwright spec for guided completion added.
- [x] Playwright spec for Independent Test added.
- [ ] tests actually executed in this environment.

### Owner gate
- [ ] owner прошёл Demo.
- [ ] owner прошёл Guided.
- [ ] owner прошёл Independent Test.
- [ ] интерфейс признан достаточно похожим по логике для обучения.
- [ ] проверка результата понятна.
- [ ] owner разрешил переход к invoice slice.

## Stage 1B.2 — Invoice

Не начинать, пока owner gate 1B.1 не PASS.

- [x] Atlas workflow/evidence skeleton.
- [ ] observation-grade Interface Passport.
- [ ] переиспользованы workspace/guidance/verification primitives в коде invoice.
- [ ] counterparty selection.
- [ ] invoice lines.
- [ ] quantity/price/total.
- [ ] save/status.
- [ ] Demo/Guided/Test.
- [ ] state assertions.
- [ ] owner PASS.

## Stage 1B.3 — Payment

Не начинать, пока 1B.2 не PASS.

- [x] Atlas workflow/evidence skeleton.
- [ ] observation-grade Interface Passport.
- [ ] payment state.
- [ ] linkage to counterparty/invoice.
- [ ] amount/status.
- [ ] derived balance.
- [ ] Demo/Guided/Test.
- [ ] state assertions.
- [ ] owner PASS.

## Stage K1 — Knowledge Atlas gate

До Stage 2:
- [x] platform common model.
- [x] Accounting KZ core workflow inventory.
- [x] HRM/ZUP KZ high-level inventory started.
- [x] Trade KZ high-level inventory started.
- [x] UNF KZ high-level inventory started.
- [x] ERP KZ high-level inventory started.
- [ ] graph validates: unique nodes, valid edges, source provenance.
- [x] `knowledge/1c/COVERAGE.md` актуален.
- [x] five retrieval proof queries documented.
- [x] no bulk copyrighted corpus committed.

## International Track gate

- [x] `EXTEND_EXISTING` зафиксирован.
- [x] Atlas schema расширен backward-compatible.
- [x] IFRS provenance/effective-date/licensing rules зафиксированы.
- [x] curriculum skeleton и topic bridges созданы.
- [x] initial market/capability research выполнен.
- [ ] International runtime/lessons не начинать до нового MPE implementation gate.

## Архитектурные красные флаги

Немедленно остановиться и вернуть задачу через MPE, если требуется:
- полный клон 1С;
- новый repository/frontend;
- новый backend только ради одного vertical slice;
- real 1C automation;
- credential capture;
- FNO/ESF до roadmap gate;
- AI/computer vision как замена deterministic verification;
- vector database как новый canonical source of truth;
- массовая реализация нескольких сценариев до PASS текущего slice;
- version-specific UI без достаточного Atlas evidence;
- International Track начинает вытеснять незавершённый основной learning engine без нового MPE gate.
