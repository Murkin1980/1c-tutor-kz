# Cloudflare + MiniBase deployment assessment

Проверено: 2026-08-25

MPE disposition: `EXTEND_EXISTING`

## Вердикт

Frontend и Pages Function готовы к preview-сборке, но production URL сейчас не работает. Канонический MiniBase найден в `C:\Projects\minibase-cloudflare`; production Worker `0.23.0` отвечает успешно, а project D1 уже создан. Live progress sync остаётся заблокирован только конфигурацией доступа: в Pages нет секретов/Access variables, raw active project secret отсутствует в текущем окружении, а legacy publishable key имеет запрещённый для браузера write-scope.

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
| Canonical MiniBase source | VERIFIED | `C:\Projects\minibase-cloudflare`, `main` at `28165db` |
| MiniBase production | VERIFIED | `https://minibase-cloudflare.muriktl.workers.dev/health` → 200, version `0.23.0` |
| MiniBase quality gate | VERIFIED | 61/61 unit tests, D1 integration, release gate, Worker integration and dry-run build PASS |
| Frontend → MiniBase integration | ENGINEERING PASS | hybrid repository + `/api/progress` Pages Function + Access JWT verification implemented and tested |
| Live configuration | BLOCKED | Pages secrets list empty; Access issuer/audience/owner and active raw project secret not configured |
| Legacy publishable key | IMPORTANT | remote key still has `data:read,data:write`; current MiniBase policy requires publishable keys to be read-only |

## Целевая схема

```text
Cloudflare Pages: 1c-tutor-kz
  React/Vite static assets
  VITE_MINIBASE_SYNC=enabled
  /api/progress Pages Function
  verify Access JWT + owner email
  server-only MINIBASE_SECRET_KEY
          |
          v
MiniBase data-plane Worker
  secret-key authorization from Pages Function
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

1. Через штатный MiniBase management flow выпустить новый scoped `mb_secret_*` либо безопасно восстановить существующий raw secret из доверенного хранилища. Не менять hashes напрямую в D1.
2. Отозвать/заменить legacy publishable key с `data:write`; браузерная запись напрямую запрещена.
3. Создать Cloudflare Access application для preview/production, ограниченную владельцем.
4. В Pages добавить encrypted secrets/variables: `MINIBASE_SECRET_KEY`, `MINIBASE_URL`, `MINIBASE_OWNER_EMAIL`, `CLOUDFLARE_ACCESS_ISSUER`, `CLOUDFLARE_ACCESS_AUD`; build variable `VITE_MINIBASE_SYNC=enabled`.
5. Выполнить frontend gate: curriculum, lint, typecheck, unit, build, functions build, secrets, serial E2E.
6. Выполнить frontend preview deploy текущей ветки:

   ```powershell
   npx.cmd wrangler pages deploy dist --project-name 1c-tutor-kz --branch mpe/stage-1-validation
   ```

7. Провести owner smoke на preview: Access login, welcome, customer-card Demo/Guided/Test, перезагрузка страницы, восстановление прогресса, desktop/mobile.
8. Только после preview PASS развернуть production из принятой ветки по правилам репозитория.

## Актуальная конфигурация Pages

Cloudflare указывает для Vite build command `npm run build` и output directory `dist`. Текущий проект этому соответствует. `_redirects` даёт SPA fallback, `_headers` задаёт CSP и основные защитные заголовки.

## Следующий ограниченный этап

`MiniBase credentials + Access + preview smoke`.

Финишная черта: на preview один вымышленный learner progress создаётся через Pages Function, читается после перезагрузки, browser не видит секретных ключей, Access JWT проверяется, local fallback остаётся работоспособным, автоматические проверки и owner smoke проходят.

Не входит в этап: массовая миграция пользователей, admin CRUD, аналитическая платформа, новые уроки и production publication.
