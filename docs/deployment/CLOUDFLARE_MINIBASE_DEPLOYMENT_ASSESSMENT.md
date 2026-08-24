# Cloudflare + MiniBase deployment assessment

Проверено: 2026-08-24

MPE disposition: `EXTEND_EXISTING`

## Вердикт

Frontend готов к preview-деплою на существующий Cloudflare Pages project, но production URL сейчас не работает. Полный продукт с серверным прогрессом пока не готов к безопасному production deployment: удалённые MiniBase/D1 ресурсы существуют, однако текущий локальный `minibase/` не содержит совпадающего data-plane API и не является источником истины для уже созданной схемы.

Не выполнять повторное provisioning и не применять локальную control-plane migration к удалённой базе до сверки актуального MiniBase source.

## Проверено фактически

| Область | Статус | Доказательство |
|---|---|---|
| Cloudflare account | VERIFIED | Wrangler 4.125.0 авторизован в account `ca7e89e2e4e294af2c7db130838cf0e0` |
| Pages project | VERIFIED | Существует `1c-tutor-kz` |
| Production Pages URL | BLOCKER | `https://1c-tutor-kz.pages.dev/` возвращает HTTP 404 `Deployment Not Found` |
| Preview deployments | VERIFIED | Есть семь старых preview deployments ветки `agent-project-progress`; актуальной ветки `mpe/stage-1-validation` нет |
| Frontend build | VERIFIED | `npm run build` создаёт `dist`; SPA fallback и security headers лежат в `public/` |
| MiniBase control D1 | VERIFIED | `minibase-control`, UUID `3eeda905-1d62-4637-a9d3-80f37c218bd6` |
| Project D1 | VERIFIED | `mb-1c-tutor-kz`, UUID `75fe1e15-8cbe-4788-98eb-a78f7daeb38e` |
| MiniBase registration | VERIFIED | Project `1c-tutor-kz` имеет статус `active`, три API-key records и разрешённые localhost/Pages origins |
| Project D1 schema | VERIFIED | Есть `_cf_KV`, `mb_files`, `mb_migration_imports`, `mb_records`, `mb_schema_versions` |
| Local MiniBase quality gate | VERIFIED | lint, typecheck и 3/3 unit tests PASS |
| Named local Worker | NOT FOUND | Worker `minibase-control-plane` отсутствует в Cloudflare account |
| Frontend → MiniBase integration | NOT IMPLEMENTED | frontend использует browser-local progress; MiniBase URL/publishable key и repository adapter отсутствуют |
| Source alignment | IMPORTANT | удалённая D1 схема богаче локальной единственной migration; локальный README ошибочно говорит, что production deployment не создан |

## Целевая схема

```text
Cloudflare Pages: 1c-tutor-kz
  React/Vite static assets
  VITE_MINIBASE_URL
  VITE_MINIBASE_PUBLISHABLE_KEY
          |
          v
MiniBase data-plane Worker
  CORS: production + preview origins
  publishable-key authorization
          |
          v
D1: mb-1c-tutor-kz
  learner profile
  scenario progress
  attempts / assistance counters
  verification summaries

MiniBase control plane (server/admin only)
  management key + Cloudflare API token
          |
          v
D1: minibase-control
```

Browser никогда не получает `mb_secret_*`, `mb_management_*` или Cloudflare API token. Учебное domain state остаётся детерминированным; на сервер сохраняются прогресс, попытки и проверяемые результаты, но не реальные бухгалтерские данные.

## Безопасная последовательность развёртывания

1. Найти канонический репозиторий/commit MiniBase, который создал текущие remote tables и API-key/origin records.
2. Сверить remote migrations, Worker names/routes, health endpoint и data-plane contracts с локальным `minibase/`. Не применять migration из локального каркаса к production до этой сверки.
3. Зафиксировать MiniBase как отдельную существующую платформу-компонент; в `1c-tutor-kz` хранить только typed client/repository adapter и проектную schema/migration policy.
4. Проверить data-plane Worker через `/health`, publishable-key auth, CORS для preview/production и CRUD только на вымышленных данных.
5. Добавить серверный progress repository за существующим интерфейсом с local fallback. Не переносить в D1 секреты и реальные реквизиты.
6. Выполнить frontend gate: curriculum, lint, typecheck, unit, build, secrets, serial E2E.
7. Выполнить frontend preview deploy текущей ветки:

   ```powershell
   npx.cmd wrangler pages deploy dist --project-name 1c-tutor-kz --branch mpe/stage-1-validation
   ```

8. Провести owner smoke на preview: вход, welcome, customer-card Demo/Guided/Test, перезагрузка страницы, восстановление прогресса, desktop/mobile.
9. Только после preview PASS развернуть production из принятой ветки по правилам репозитория.

## Актуальная конфигурация Pages

Cloudflare указывает для Vite build command `npm run build` и output directory `dist`. Текущий проект этому соответствует. `_redirects` даёт SPA fallback, `_headers` задаёт CSP и основные защитные заголовки.

## Следующий ограниченный этап

`MiniBase source reconciliation + read/write progress spike`.

Финишная черта: на preview один вымышленный learner progress создаётся через актуальный MiniBase data-plane, читается после перезагрузки, browser не видит секретных ключей, local fallback остаётся работоспособным, автоматические проверки и owner smoke проходят.

Не входит в этап: массовая миграция пользователей, admin CRUD, аналитическая платформа, новые уроки и production publication.
