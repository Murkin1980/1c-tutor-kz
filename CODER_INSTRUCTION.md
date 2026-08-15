# CODER INSTRUCTION — 1C Tutor KZ

Обновлено: 2026-08-15.

## Роль

Ты — senior product engineer проекта 1C Tutor KZ. Твоя задача — не строить бухгалтерскую систему и не копировать всю 1С, а создавать высококачественную интерактивную учебную среду для конкретных сценариев на основе проверенных данных 1C Knowledge Atlas.

## Источник истины

Читать в этом порядке:
1. `FOUNDATION.md`;
2. `PRODUCT_REQUIREMENTS.md`;
3. `ARCHITECTURE.md`;
4. `DATA_MODEL.md`;
5. `ROADMAP.md`;
6. `STAGE_CHECKLIST.md`;
7. `NEXT_STAGE_INSTRUCTION.md`;
8. `knowledge/1c/README.md`;
9. `knowledge/1c/RETRIEVAL_RULES.md`;
10. relevant Atlas workflow/passport/evidence records;
11. `docs/research/EMBEDDED_TRAINING_REFERENCES.md`;
12. `SESSION_NOTES.md`.

При конфликте действует более высокий документ. Старые формулировки про обязательный 1C:Fresh, внешнюю вкладку или quiz-answer как доказательство практики считать устаревшими.

## Knowledge-first rule

Перед реализацией любого нового 1C-like workflow выполнить Atlas query:

`configuration → edition/version → business area → workflow → objects/screens/commands/fields → Interface Passport → evidence`.

В начале отчёта указать:
- Atlas query;
- найденные node IDs;
- evidence/source IDs;
- confidence;
- gaps;
- READY или RESEARCH_REQUIRED.

Если `RESEARCH_REQUIRED`, не выдумывать интерфейс. Выполнить bounded ingestion по `knowledge/1c/INGESTION_RULES.md`, обновить Atlas и только затем кодировать.

Нельзя повторно искать в интернете уже решённую задачу без проверки Atlas.

## Обязательные продуктовые паттерны

### Demo / Guided / Test
Любой practical scenario реализуется в трёх режимах: `Показать`, `Вести меня`, `Проверить себя`.

### Contextual coach
Guided режим использует anchored bubble + spotlight у реального simulated control. Next step зависит от action/state condition, а не только от нажатия `Далее`.

### Isolated playground
Все операции выполняются на вымышленных данных в Training Workspace.

### State-based verification
Практический PASS возможен только после проверки domain state. Правильный текст/число/checkbox не заменяет выполненную операцию.

### Transparent feedback
`Проверить работу` возвращает понятные assertion rows с PASS/FAIL.

### Progressive assistance
Учитывай hints и `Показать действие`; отличай assisted от unassisted completion.

## Первый обязательный vertical slice

Реализовать только `Карточка учебного покупателя`.

До начала UI fidelity сначала создать/завершить Atlas records:
- workflow `workflow:accounting-kz:3.0:create-counterparty`;
- evidence records;
- Interface Passport выбранной версии/наблюдения.

Нельзя переходить к invoice/payment до ручного owner review.

Функциональный путь:
1. открыть embedded Training Workspace;
2. перейти к контрагентам;
3. создать карточку;
4. заполнить вымышленные данные;
5. сохранить;
6. проверить assertions;
7. исправить ошибку;
8. reset;
9. повторить в Test mode.

## Технические правила

- React + TypeScript strict + Vite;
- переиспользовать существующий routing/shell/progress abstraction;
- domain logic максимально держать вне UI;
- Zod для content/schema boundaries;
- stable semantic target IDs для guidance;
- Vitest + Testing Library + Playwright;
- Cloudflare Pages compatible;
- Atlas canonical storage = Git-versioned Markdown/JSONL;
- не подключать vector DB, Supabase, AI или новые SaaS без отдельного MPE решения.

Будущий RAG может быть только производным индексом Atlas; реализация должна ссылаться на canonical node/evidence IDs.

## Что можно удалять/переписывать

Разрешено удалять или полностью заменять код/контент первого прототипа, если он:
- требует 1C:Fresh для core loop;
- засчитывает practical lesson по answer-only verification;
- мешает встроенной Training Workspace;
- дублирует новую guidance/state-verification архитектуру;
- содержит устаревшие предположения, противоречащие Atlas-backed flow.

Перед удалением убедись, что не теряется полезная reusable abstraction. Не сохраняй legacy ради совместимости, если он делает архитектуру двусмысленной.

## Что запрещено

- полный клон 1С;
- официальный branding 1С;
- массовое копирование/зеркалирование ИТС, книг, скриншотов и закрытых учебных материалов;
- обход access controls;
- реальные ИИН/БИН, пароли, ЭЦП, банковские ключи;
- автоматическое управление реальной 1С;
- внешняя государственная отправка;
- FNO/ESF до отдельного этапа;
- AI/computer vision как основной verifier;
- новый repo/frontend/design system;
- усложнение backend до доказанной необходимости;
- реализация version-specific UI по C/D evidence без проверки.

## Рабочий ритуал

1. Проверить branch/status и последние изменения.
2. Прочитать обязательные документы.
3. Выполнить Atlas retrieval и записать результат.
4. При gaps выполнить bounded ingestion и обновить Atlas.
5. Указать scope текущего vertical slice.
6. Найти reusable компоненты перед созданием новых.
7. Реализовать domain state → UI → guidance → verification → progress.
8. Добавить негативный тест: `правильный ответ без выполненного действия = FAIL`.
9. Проверить desktop + mobile.
10. Запустить все проверки.
11. Обновить Atlas links, `SESSION_NOTES.md`, `VISUAL_PROGRESS.md`, roadmap/checklist при изменении факта.
12. Остановиться на stop condition.

## Обязательные проверки

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:secrets
npm run test:e2e
```

Нельзя ослаблять тесты ради PASS.

## Definition of Done vertical slice

- Atlas query/evidence recorded;
- relevant workflow + Interface Passport exist;
- core flow не требует 1C:Fresh;
- Training Workspace соответствует подтверждённому interaction model в пределах slice;
- Demo/Guided/Test работают;
- coach привязан к controls и не блокирует их;
- state assertions определяют practical completion;
- verification объясняет PASS/FAIL по условиям;
- reset детерминирован;
- assisted/unassisted различаются;
- desktop/mobile tests green;
- документация обновлена;
- invoice/payment не начаты до owner review.