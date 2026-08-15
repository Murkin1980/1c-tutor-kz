# ROADMAP — 1C Tutor KZ

Обновлено: 2026-08-15 после MPE pivot.

## North Star

Пользователь должен научиться выполнять бухгалтерский процесс в безопасной интерактивной среде и доказать навык через состояние этой среды, а не через тестовый ответ.

## Stage 0 — Pivot foundation — DONE

- [x] выявлена зависимость от платного 1C:Fresh;
- [x] выявлена ложная practical verification через quiz answers;
- [x] owner approved deep change;
- [x] выбран EXTEND_EXISTING;
- [x] встроенная Training Workspace стала core MVP;
- [x] закреплены мировые паттерны Demo/Guided/Test, contextual coach, isolated playground, state verification;
- [x] переписаны foundation/product/architecture/data/coder docs.

## Stage 1B.1 — Counterparty vertical slice — ACTIVE

Цель: доказать новый движок на одной законченной операции.

### Workspace shell
- [ ] отдельный embedded route/surface;
- [ ] постоянная маркировка `УЧЕБНАЯ СРЕДА — НЕ 1С`;
- [ ] 1C-like header/navigation/list/form primitives;
- [ ] desktop/mobile layout.

### Counterparty domain
- [ ] deterministic seed;
- [ ] counterparty list;
- [ ] create form;
- [ ] fictional name/city;
- [ ] save state;
- [ ] reset.

### Learning modes
- [ ] Demo;
- [ ] Guided Practice;
- [ ] Independent Test.

### Guidance
- [ ] semantic target registry;
- [ ] anchored coach bubble;
- [ ] spotlight;
- [ ] `Почему?`;
- [ ] hint 1 / hint 2;
- [ ] show action;
- [ ] condition-driven advancement.

### Verification v2
- [ ] object exists;
- [ ] name correct;
- [ ] city correct;
- [ ] saved;
- [ ] readable assertion checklist;
- [ ] correct typed answer without state => FAIL.

### Gate
- [ ] owner UX review;
- [ ] all engineering checks PASS.

**STOP:** invoice work forbidden until owner review PASS.

## Stage 1B.2 — Customer invoice vertical slice

Start only after 1B.1 PASS.

- [ ] reuse workspace primitives;
- [ ] create invoice;
- [ ] select counterparty;
- [ ] add line;
- [ ] quantity/price/total;
- [ ] save/status;
- [ ] Demo/Guided/Test;
- [ ] state assertions;
- [ ] owner review.

## Stage 1B.3 — Payment / advance vertical slice

Start only after 1B.2 PASS.

- [ ] payment form;
- [ ] link to counterparty/invoice;
- [ ] amount/status;
- [ ] derived training balance;
- [ ] Demo/Guided/Test;
- [ ] state assertions;
- [ ] owner review.

## Stage 1C — Learning engine hardening

После трёх PASS vertical slices:
- [ ] reusable scenario schema;
- [ ] reusable assertion library;
- [ ] robust guidance recovery;
- [ ] assisted/unassisted scoring;
- [ ] scenario analytics;
- [ ] accessibility pass;
- [ ] content authoring conventions;
- [ ] second-user usability test.

## Stage 2 — Expand basic 1C curriculum

Только доказанные reusable primitives:
- [ ] номенклатура;
- [ ] поступление материалов;
- [ ] реализация;
- [ ] банк/касса;
- [ ] акт сверки;
- [ ] дебиторка/кредиторка;
- [ ] базовые отчёты;
- [ ] закрытие учебного месяца.

Каждый новый процесс — отдельный vertical slice с Interface Passport + owner review.

## Stage 3 — Server persistence

Только после доказанного повторного использования продукта:
- Auth;
- server progress;
- cross-device continuation;
- roles;
- private analytics;
- reset/export/delete.

Supabase остаётся кандидатом, не обязательством.

## Stage 4 — Transfer to real 1C

Не core practice, а проверка переноса навыка:
- отдельный режим;
- актуальная официальная/демо/учебная среда, если доступна;
- checklist before action;
- никакого credential capture;
- никакой автоматизации real 1C;
- manual transfer assessment.

## Stage 5 — FNO / ESF research

Вернуться только после зрелого learning engine и нового MPE решения. Старый `PORTAL_REPLICA_SPEC.md` не является текущим implementation instruction.

## Stage 6 — Adaptive reinforcement

- spaced retry;
- задания с другими цифрами;
- error-pattern review;
- skill map;
- optional AI explanations only after deterministic rules are strong.

## Постоянные stop criteria

Остановить расширение, если:
- practical PASS можно получить без нужного domain state;
- coach ведёт пользователя неправильной интерфейсной привычкой;
- simulated UI существенно расходится с утверждённым Interface Passport;
- новый модуль требует копировать большой объём 1С без измеримой учебной ценности;
- появляется обязательная платная внешняя зависимость;
- нужны реальные credentials/identifiers;
- текущий vertical slice не прошёл owner review;
- lint/typecheck/test/build/secrets/e2e не проходят.
