# Session Notes

## 2026-07-31 — Stage 2A: исследовательский каркас и simulator shells

### Выполнено

- Обновления `origin/main` объединены с рабочей веткой MiniBase; backend-конфликт разрешён в пользу `AGENTS.md` и `MINIBASE.md`.
- Создан `docs/official-ui/` с реестром источников и шаблонами версии, экрана, проверки и changelog.
- Добавлены Zod-модели, repository contract и защищённые маршруты simulator catalog/FNO/ESF/scenario.
- Реализованы постоянная учебная полоса, watermark, блокировка ИИН/БИН, network allowlist и локальные имитации подписи/отправки.
- Исправлено перекрытие действий нижней навигацией на mobile.

### Проверки

- `npm run lint` — PASS.
- `npm run typecheck` — PASS.
- `npm run test` — PASS, 20 тестов.
- `npm run build` — PASS.
- `npm run check:secrets` — PASS.
- `npm run test:e2e` — PASS, 10 сценариев desktop/mobile.

### Ограничения и следующий этап

- Официальные источники и первый паспорт ещё не утверждены; UI остаётся placeholder-shell.
- Переход на официальный портал не добавлен: утверждённого URL в реестре пока нет.
- Далее: исследовать и методически утвердить первый экран ФНО, затем реализовать L1/L2 без ослабления предохранителей.

## 2026-07-28 — архитектурная итерация MiniBase

### Выполнено

- Отказались от нового Supabase-проекта: бесплатный лимит владельца занят.
- MiniBase добавлена как отдельный этап и отдельная задача Codex.
- Зафиксированы отдельный Worker deployment, D1-база на проект и R2 для файлов.
- Определены `mb_publishable_*`, `mb_secret_*`, `mb_management_*`, их границы,
  хэширование, ротация, отзыв и аудит.
- Описаны идемпотентное создание D1 и миграция с Supabase с manifest,
  контрольными суммами и rollback.
- Создан корневой `AGENTS.md`, направляющий будущие задачи к MiniBase.
- Незавершённая прямая интеграция Supabase удалена; local fallback сохранён.
- Создана отдельная задача Codex `019faa0a-2fae-7742-a13e-0629e809d807`.

### Границы

- Реальные D1, R2, Worker и Cloudflare API token не создавались.
- GitHub-репозиторий и deployment MiniBase выполняются в отдельной задаче.
- Auth/прогресс подключаются после появления проверенного MiniBase endpoint.

## 2026-07-28 — итерация 1: frontend-прототип

### Выполнено

- Инициализирован React 19 + TypeScript strict + Vite + React Router + TanStack Query + Zod + Tailwind CSS.
- Созданы все маршруты первой итерации, mock-вход и role guard для `/admin`.
- Добавлен локальный курс из 2 модулей и 5 уроков на полностью вымышленных данных.
- Реализованы состояния урока и семь типов проверки: `self_confirm`, `single_choice`, `multiple_choice`, `text_exact`, `number`, `sequence`, `screenshot_manual`.
- Прогресс, текущий шаг, ответ и заметки сохраняются через `ProgressRepository` в `localStorage`.
- Внешняя 1С открывается через `window.open(..., "_blank", "noopener,noreferrer")`; перед открытием сохраняется шаг.
- Добавлены три последовательные подсказки, экран результата, предупреждение об учебной базе и методический дисклеймер.
- Добавлены Cloudflare Pages `_redirects` и `_headers`.
- GitHub Actions workflow сознательно не включён: владелец сообщил об исчерпанном лимите. Все проверки выполнены локально.

### Архитектурные решения

- Контент отделён от прогресса и валидируется Zod при загрузке.
- Browser repositories имеют интерфейсы, поэтому во второй итерации их можно заменить адаптерами Supabase без переписывания экранов.
- Mock-роли предназначены только для прототипа; это не серверная защита.
- Визуальное направление — «учебный рабочий журнал»: самостоятельный стиль, не имитирующий интерфейс 1С.

### Проверки

- `npm run lint` — PASS.
- `npm run typecheck` — PASS.
- `npm run test` — PASS, 6 тестов.
- `npm run build` — PASS.
- `npm run check:secrets` — PASS.
- `npm run test:e2e` — PASS, 2 сценария (desktop Chrome и mobile viewport).

### Известные ограничения

- Mock-авторизация и прогресс привязаны к текущему браузеру и не синхронизируются между устройствами.
- `/admin` защищён только клиентской mock-ролью; серверная защита появится вместе с Supabase и RLS.
- `screenshot_manual` представлен типом и полем выбора файла, но загрузка и очередь ручной проверки отложены до приватного Supabase Storage.
- Содержание уроков и маршруты 1С требуют проверки практикующим методистом на утверждённой версии конфигурации.
- Cloudflare Pages preview не опубликован.
- CI в GitHub Actions отключён из-за исчерпанного лимита; локальная проверка обязательна перед push.

### Следующий рекомендуемый этап

Подключить Supabase Auth, миграции PostgreSQL, RLS и серверное хранение прогресса/заметок, сохранив текущие repository interfaces.

### Соответствие FOUNDATION

Конфликтов не обнаружено: интерфейс русский, суммы в KZT, используются только вымышленные данные, 1С открывается отдельно, предупреждение об учебной базе показано в каждом уроке, материал обозначен как учебный, AI и управление 1С отсутствуют.

## 2026-07-28 — итерация статуса: этапы и визуальный прогресс

### Выполнено

- Создан `PROJECT_STATUS.md` с восемью этапами, критериями перехода, доказательствами и ограничениями.
- Прогресс MVP считается по 24 проверяемым пунктам delivery-этапов 0–5; исследовательские AI и интеграции исключены из процента.
- В `/admin` добавлены общий индикатор готовности, текущая контрольная точка, timeline этапов и чек-листы.
- Следующим этапом зафиксирована публикация Cloudflare Pages preview; Supabase начинается только после неё.

### Ограничение итерации

Изменён только слой управления статусом и его визуализация. Supabase, deployment и учебная логика не изменялись.

### Проверки

- `npm run lint` — PASS.
- `npm run typecheck` — PASS.
- `npm run test` — PASS, 7 тестов.
- `npm run build` — PASS.
- `npm run check:secrets` — PASS.
- `npm run test:e2e` — PASS, desktop и mobile.

## 2026-07-28 — итерация deployment: Cloudflare Pages preview

### Выполнено

- Создан бесплатный Direct Upload Pages-проект `1c-tutor-kz`; Workers и платные сервисы не добавлялись.
- Добавлены `wrangler.jsonc`, локальная devDependency Wrangler и команда `npm run deploy:preview`.
- Опубликован preview ветки `agent/project-progress`.
- Playwright получил поддержку `E2E_BASE_URL` и отдельный тест прямого SPA-маршрута.
- Этап 1 закрыт, визуальный прогресс обновлён до 33%, этап 2 Supabase обозначен текущим.

### Публичные адреса

- <https://agent-project-progress.1c-tutor-kz.pages.dev>
- <https://00c161a4.1c-tutor-kz.pages.dev>

### Проверки

- `/`, `/login`, `/learn/welcome` — HTTP 200.
- CSP, `Permissions-Policy`, `Referrer-Policy`, `X-Content-Type-Options` — применены.
- `X-Robots-Tag: noindex` — применён Cloudflare к preview.
- публичный `npm run test:e2e` — PASS, 4 теста (desktop и mobile).

### Известное поведение

Выпуск TLS-сертификата нового Pages-проекта занял несколько минут; первоначальная проверка возвращала `ERR_SSL_VERSION_OR_CIPHER_MISMATCH`, повторная проверка после выпуска сертификата прошла.

## 2026-07-29 — итерация MiniBase client adapter

### Выполнено

- Подтверждён production deployment отдельной платформы MiniBase.
- Добавлен типизированный Data API client, принимающий только publishable key.
- Добавлена Zod-валидация пары MiniBase URL/key и безопасный локальный fallback.
- Проверка bundle расширена на MiniBase server keys и Cloudflare API token.
- В профиле показан фактический режим хранения, визуальный прогресс обновлён до 38%.

### Архитектурное решение

Удалённая запись прогресса не включена. Текущий MiniBase авторизует проектный
ключ, но ещё не конечного пользователя и владельца записи. Синхронизация будет
разрешена только после теста, подтверждающего изоляцию двух пользователей.
Ранее раскрытый management key признан скомпрометированным и не используется.

### Известные ограничения

- Auth, восстановление доступа и межустройственная синхронизация ещё локальные.
- Проект 1C Tutor в MiniBase не provisioned до ротации management key.
- Client adapter реализует Data API; Storage подключится вместе с ручной проверкой.

### Следующий рекомендуемый этап

Реализовать end-user sessions и owner-level authorization в MiniBase, отозвать
скомпрометированный management key, проверить изоляцию и только затем создать
проект 1C Tutor.

## 2026-07-30 — onboarding 1C Tutor в MiniBase

### Выполнено

- MiniBase `npm run check` — PASS: lint, typecheck, 56 тестов, D1, release,
  Worker integration и build.
- Authenticated production smoke `0.22.2` — PASS.
- Исправлен подтверждённый slug-дефект MiniBase; commit `8caa370`, Worker version
  `fc0c5465-210d-4c33-8939-79bb4d5aba0b`.
- Исправлен browser fetch binding SDK; commit `fbe02f6`.
- Создан ровно один проект `1c-tutor-kz`, project ID
  `f9ef1634-91ca-42b7-8923-a687d6060cc9`.
- Idempotency replay вернул тот же project; дубль не создан.
- Project D1 `75fe1e15-8cbe-4788-98eb-a78f7daeb38e` физически отделена от control D1.
- Origins настроены; localhost разрешён, посторонний origin получает HTTP 403.
- Добавлены MiniBase progress/notes repositories, Zod-схемы, local fallback,
  одноразовая миграция и conflict resolution по `updatedAt`.
- Desktop/mobile e2e с реальным MiniBase — PASS, 4/4.

### Безопасность

- Утраченный management key отозван, новый проверен production smoke.
- Раскрытый в чате первоначальный project secret немедленно отозван; активна
  только замена, сохранённая владельцем вне репозитория.
- Frontend содержит только publishable key; secret/management keys отсутствуют.
- Новые технические проекты создаются в ASCII-путях `C:\Projects\<slug>`.

### Пилотный сценарий

Владелец сначала проводит ручную приёмку. Затем тестовый record `owner` очищается,
и закрытая Pages-ссылка передаётся одному ученику. Публичный multi-user режим в
текущей архитектуре запрещён.

### Осталось

- Опубликовать свежую Pages-версию с environment variables.
- Закрыть Pages через Cloudflare Access и добавить email владельца и ученика.

## 2026-07-30 — проверенный Pages preview с MiniBase

### Выполнено

- В CSP разрешён только production endpoint MiniBase; остальные внешние
  подключения остаются запрещены.
- Опубликован branch preview
  <https://agent-project-progress.1c-tutor-kz.pages.dev> и immutable deployment
  <https://e5c2cea7.1c-tutor-kz.pages.dev>.
- Фактические HTTP-заголовки проверены на прямом SPA-маршруте: CSP,
  `Referrer-Policy` и `X-Content-Type-Options` применены.
- Публичный desktop/mobile e2e с production MiniBase прошёл: 4/4.
- E2E выполняется последовательно, потому что до появления end-user auth
  пилот намеренно использует один общий record `owner`.

### Проверки

- `npm run lint` — PASS.
- `npm run typecheck` — PASS.
- `npm run test` — PASS, 15 тестов.
- `npm run build` — PASS.
- `npm run check:secrets` — PASS.
- `npm run test:e2e` локально — PASS, 4/4.
- `E2E_BASE_URL=https://agent-project-progress.1c-tutor-kz.pages.dev npm run test:e2e`
  — PASS, 4/4.

### Осталось

- Закрыть branch preview через Cloudflare Access и разрешить email владельца и
  ученика.
- Провести ручную приёмку владельцем.
- После приёмки очистить тестовый record `owner` перед передачей курса ученику.
- Провести ручную приёмку владельцем и очистить тестовый прогресс перед передачей.
