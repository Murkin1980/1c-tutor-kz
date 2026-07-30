# Модель данных

## Таблицы

### profiles

- `id uuid` — FK auth.users;
- `display_name text`;
- `role text check ('learner','admin')`;
- `locale text default 'ru-KZ'`;
- `created_at timestamptz`.

### courses

- `id uuid`;
- `slug text unique`;
- `title text`;
- `description text`;
- `status text`;
- `version integer`;
- `created_at`;
- `updated_at`.

### modules

- `id uuid`;
- `course_id uuid`;
- `title text`;
- `description text`;
- `position integer`.

### lessons

- `id uuid`;
- `module_id uuid`;
- `slug text`;
- `title text`;
- `objective text`;
- `business_context text`;
- `estimated_minutes integer`;
- `content jsonb`;
- `verification jsonb`;
- `external_app_url text`;
- `position integer`;
- `status text`;
- `version integer`.

### lesson_progress

- `id uuid`;
- `user_id uuid`;
- `lesson_id uuid`;
- `status text`;
- `current_step integer`;
- `attempt_count integer`;
- `started_at timestamptz`;
- `completed_at timestamptz`;
- `updated_at timestamptz`;
- unique `(user_id, lesson_id)`.

### submissions

- `id uuid`;
- `user_id uuid`;
- `lesson_id uuid`;
- `attempt_number integer`;
- `answer jsonb`;
- `result text`;
- `score numeric`;
- `feedback text`;
- `reviewed_by uuid null`;
- `created_at timestamptz`.

### user_notes

- `id uuid`;
- `user_id uuid`;
- `lesson_id uuid`;
- `body text`;
- `updated_at timestamptz`;
- unique `(user_id, lesson_id)`.

### app_events

- `id bigint generated always as identity`;
- `user_id uuid null`;
- `event_name text`;
- `properties jsonb`;
- `created_at timestamptz`.

## RLS

- пользователь читает опубликованные курсы;
- пользователь читает и изменяет только собственный прогресс, ответы и заметки;
- admin имеет полный доступ к учебному контенту;
- screenshots хранятся в приватном bucket;
- signed URL выдаётся на ограниченное время;
- изменение роли запрещено самому пользователю.

## Пример verification JSON

```json
{
  "type": "number",
  "prompt": "Какова итоговая сумма документа?",
  "expected": 245000,
  "tolerance": 0,
  "unit": "KZT",
  "explanation": "Итог должен совпадать с суммой двух позиций."
}
```

## Хранение в MiniBase

Прикладные идентификаторы остаются строками, даты передаются в ISO 8601 UTC,
а JSON-поля имеют версионированную Zod-схему.

В project D1 используются две records-коллекции:

- `tutor_progress`, запись `owner`: `schemaVersion`, `updatedAt`,
  `lastLessonId`, `lessonProgress`, `courseProgress`, `settings`;
- `tutor_notes`, записи `lesson_<lessonId>`: `schemaVersion`, `lessonId`,
  `text`, `updatedAt`.

Control plane MiniBase хранится в отдельной D1 и не смешивается с учебными
records 1C Tutor.

## Версионирование

При изменении задания после публикации увеличить `lesson.version`. Результат пользователя хранит версию урока, по которой он проходил проверку. Существенное изменение может пометить урок как требующий повторного прохождения, но это действие выполняется администратором явно.
