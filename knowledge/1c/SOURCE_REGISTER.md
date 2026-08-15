# SOURCE REGISTER — 1C Knowledge Atlas

Обновлено: 2026-08-15.

## Правило

Каждый knowledge record обязан ссылаться минимум на один source id из этого реестра или добавлять новый source id.

Поля:
- `id`;
- `authority` = primary / secondary;
- `scope`;
- `url`;
- `access` = public / ITS-login / licensed;
- `freshness`;
- `notes`.

## Primary — Kazakhstan

### KZ-ITS-USER-DOCS
- authority: primary
- scope: каталог пользовательской документации 1С Казахстан; Бухгалтерия, ЗУП, УНФ, ERP, Комплексная автоматизация и др.
- url: `https://its.1c.kz/section/i1c/doc_user`
- access: mixed/public-index
- freshness: check on ingestion
- notes: главный discovery index для казахстанских конфигураций.

### KZ-ACC30-DOC
- authority: primary
- scope: `Бухгалтерия для Казахстана`, редакция 3.0 — руководство по конфигурации
- url: `https://its.1c.kz/db/acc30kz`
- access: mixed
- freshness: version-aware
- notes: базовый источник для Accounting KZ workflows.

### KZ-ACC30-PRODUCT
- authority: primary
- scope: возможности и интерфейс `Бухгалтерия 8 для Казахстана`, ред. 3.0
- url: `https://1c.kz/v8/RegionalSolutions_KZ_BUH.php`
- access: public
- freshness: verify date/version
- notes: подтверждает Taxi UI и продуктовые области.

### KZ-ACC30-TRANSITION
- authority: primary
- scope: знакомство с редакцией 3.0 и изменения интерфейса
- url: `https://its.1c.kz/db/ruk/content/1383/hdoc`
- access: public/mixed
- freshness: historical 3.0 transition
- notes: полезен для структуры интерфейса Taxi и панелей.

### KZ-ACC30-RELEASE
- authority: primary
- scope: выпуск редакции 3.0 `Бухгалтерия для Казахстана`
- url: `https://1c.kz/news/detail/89539/`
- access: public
- freshness: historical baseline
- notes: содержит список разделов и ключевые возможности 3.0.

### KZ-HRM
- authority: primary
- scope: `Зарплата и Управление Персоналом для Казахстана`
- url: `https://its.1c.kz/section/i1c/doc_user`
- access: mixed
- freshness: discover actual edition before ingestion
- notes: создавать отдельные evidence по конкретной редакции.

### KZ-TRADE-RELEASES
- authority: primary
- scope: `Управление торговлей для Казахстана` release documentation
- url: `https://downloads.v8.1c.ru/content/TradeKzBase/`
- access: public release pages
- freshness: version-specific
- notes: использовать для version/change evidence, не как единственный UI source.

### KZ-LOCALIZED-SOLUTIONS
- authority: primary
- scope: список локализованных решений 1С для Казахстана
- url: `https://v8.1c.ru/static/lokalizovannye-prikladnye-resheniya-kazakhstan/`
- access: public
- freshness: current list
- notes: discovery конфигураций: торговля, ERP, документооборот, госсектор и др.

## Primary — Platform / common mechanisms

### PLATFORM-USER-GUIDE
- authority: primary
- scope: общие пользовательские механизмы `1С:Предприятие 8`
- url: `https://its.1c.ru/db/v8321doc`
- access: mixed
- freshness: platform-version-specific
- notes: интерфейс, формы, списки, общие объекты; конкретную конфигурацию описывает её собственная документация.

### RU-PRODUCT-DOC-INDEX
- authority: primary
- scope: общий каталог документации продуктов 1С
- url: `https://its.1c.ru/docs/program_documentation/`
- access: mixed
- freshness: current index
- notes: fallback discovery для общих механик и аналогичных российских решений, когда KZ docs недостаточны; факты локализации не переносить без KZ evidence.

## Secondary sources

Secondary source допускается для:
- поиска неизвестного workflow;
- UX-наблюдений;
- типичных ошибок;
- терминов пользователей.

Но факты о расположении интерфейса, обязательных полях, проводках, налоговой логике и version-specific behavior должны подтверждаться primary evidence или ручной проверкой выбранной версии.

## Source quality flags

- `A`: current primary + exact configuration/version.
- `B`: primary, но версия/дата не полностью совпадает.
- `C`: secondary, подтверждено вторым независимым источником.
- `D`: hypothesis only; запрещено использовать для финального simulator behavior.
