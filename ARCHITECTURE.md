# Архитектура 1C Tutor KZ

## 1. Общая схема

```text
Browser
  ├─ Cloudflare Pages: React application
  ├─ MiniBase Auth через отдельный Cloudflare Worker
  ├─ изолированная MiniBase D1
  ├─ MiniBase R2: screenshots
  └─ External tab: 1C:Fresh Kazakhstan / local educational 1C
```

## 2. Почему 1С открывается отдельно

Тренажёр и 1С являются двумя независимыми системами. Это снижает риски:

- блокировки iframe;
- нарушения лицензионных условий;
- зависимости от DOM и обновлений интерфейса 1С;
- доступа тренажёра к учётным данным;
- утечки логина и пароля.

## 3. Frontend modules

```text
src/
├─ app/
├─ routes/
├─ features/
│  ├─ auth/
│  ├─ courses/
│  ├─ lessons/
│  ├─ progress/
│  ├─ verification/
│  ├─ notes/
│  └─ admin/
├─ entities/
├─ shared/
└─ content/
```

## 4. Контентная модель

Контент урока хранится отдельно от пользовательского прогресса. Поля урока:

- slug;
- title;
- objective;
- business_context;
- estimated_minutes;
- prerequisites;
- source_data;
- steps;
- hints;
- verification;
- expected_result;
- common_errors;
- external_app_url;
- version;
- publication_status.

## 5. Проверка заданий

Проверка выполняется в браузере для простых типов и дублируется серверной функцией для защиты от подмены результата.

Для `screenshot_manual`:

1. клиент получает signed upload URL;
2. изображение загружается в приватный bucket;
3. создаётся submission;
4. администратор видит его в очереди;
5. после проверки сохраняются статус и комментарий.

## 6. AI-слой в будущей версии

AI должен находиться за Cloudflare Worker. Клиент не получает API key.

Возможные функции:

- объяснение ошибки простым языком;
- проверка снимка экрана;
- персональная дополнительная задача;
- ответы только на основе курса.

AI не должен:

- подтверждать правильность налоговой отчётности;
- работать с реальными секретами;
- автоматически изменять 1С;
- заменять ручную проверку при низкой уверенности.

## 7. Deployment

### Cloudflare Pages

- production branch: `main`;
- build command: `npm run build`;
- output: `dist`;
- Node version закрепить в `.nvmrc`;
- SPA routes направлять на `index.html`;
- preview deployments включены.

### Заголовки

Добавить `_headers` или Worker middleware:

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data: blob:; connect-src 'self' https://minibase-cloudflare.muriktl.workers.dev; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; frame-ancestors 'none';
```

Не добавлять домен 1С в `frame-src`, пока не подтверждена возможность и необходимость iframe.

## 8. Наблюдаемость

MVP:

- таблица `app_events`;
- error boundary;
- структурированные console errors в development;
- необязательный Sentry после пилота.

События:

- `course_opened`;
- `lesson_started`;
- `external_1c_opened`;
- `hint_opened`;
- `answer_submitted`;
- `lesson_completed`;
- `lesson_abandoned`.

## 9. Переносимость backend

Экраны не зависят от HTTP MiniBase. Прогресс и заметки подключены через
repository-адаптеры; localStorage остаётся fallback при временной недоступности.
Для single-owner пилота используются records `tutor_progress/owner` и
`tutor_notes/lesson_<lessonId>`, конфликт решается по `updatedAt`.

MiniBase реализует базовые прикладные контракты на Cloudflare Workers,
отдельной D1 на проект и R2. Автоматическое создание баз выполняет только
защищённый control plane; Cloudflare API token не выдаётся приложениям.
Frontend-адаптер принимает исключительно publishable key. Доступ к приложению
ограничивается Cloudflare Access; один закрытый пилот использует одну учебную
запись. Публичный multi-user режим без пользовательской авторизации запрещён.
Подробности: [`MINIBASE.md`](MINIBASE.md).
## Симуляторы официальных порталов

`src/features/simulators` содержит Zod-модели, repository contract и предохранители. Окончательная структура экрана не реализуется, пока для неё нет утверждённого паспорта в `docs/official-ui/`.

Симулятор использует allowlist собственных ресурсов. Государственные домены, ЭЦП, NCALayer и реальные отправки не входят в клиентскую архитектуру; подпись и отправка являются только локальной учебной имитацией.
