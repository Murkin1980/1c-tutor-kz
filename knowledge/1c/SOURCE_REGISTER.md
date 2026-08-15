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

## Primary — Kazakhstan / Accounting KZ

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

### KZ-ACC30-TOC
- authority: primary
- scope: официальное оглавление руководства Accounting KZ 3.0: документы, контрагенты, отчеты, банк/касса, торговля, склад, зарплата, закрытие периода
- url: `https://its.1c.kz/db/acc30kz/content/45/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.0
- notes: надежный источник для workflow inventory; часть детальных страниц требует ITS-доступа.

### KZ-ACC30-CHARACTERISTICS
- authority: primary
- scope: характеристика Accounting KZ 3.0 и функциональные области
- url: `https://its.1c.kz/db/acc30kz/content/2/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.0
- notes: подтверждает учет от документа, торговлю, склад, банк/кассу, расчеты с контрагентами и др.

### KZ-ACC30-OSV
- authority: primary
- scope: стандартный отчет `Оборотно-сальдовая ведомость`
- url: `https://its.1c.kz/db/acc30kz/content/28/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.0
- notes: exact report existence and documentation family.

### KZ-ACC30-ACCOUNT-CARD
- authority: primary
- scope: стандартный отчет `Карточка счета`
- url: `https://its.1c.kz/db/acc30kz/content/33/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.0
- notes: exact report existence and documentation family.

### KZ-ACC30-CONTRACTS
- authority: primary
- scope: виды договоров с контрагентами и их создание, Accounting KZ 3.0
- url: `https://its.1c.kz/db/accountingkz/content/103697/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.0
- notes: use for relationship between counterparty and contracts; exact fields require bounded detail verification.

### KZ-ACC30-REALIZATION
- authority: primary
- scope: отражение реализации ТМЗ и услуг, Accounting KZ 3.0
- url: `https://its.1c.kz/db/accountingkz/content/103699/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.0
- notes: sales realization workflow source.

### KZ-ACC30-INVENTORY
- authority: primary
- scope: номенклатура и склад, Accounting KZ 3.0
- url: `https://its.1c.kz/db/accountingkz/content/104007/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.0
- notes: inventory/warehouse methodological index.

### KZ-ACC30-WAREHOUSE
- authority: primary
- scope: складской учет, Accounting KZ 3.0
- url: `https://its.1c.kz/db/acc30kz/content/55/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.0
- notes: warehouse operations including movement, inventory count and assembly.

### KZ-ACC30-PRODUCT
- authority: primary
- scope: возможности и интерфейс `Бухгалтерия 8 для Казахстана`, ред. 3.0
- url: `https://1c.kz/v8/RegionalSolutions_KZ_BUH.php`
- access: public
- freshness: verify date/version
- notes: product overview and localization context.

### KZ-ACC30-TRANSITION
- authority: primary
- scope: знакомство с редакцией 3.0 и интерфейс `Такси`
- url: `https://its.1c.kz/db/content/ruk/src/%D0%B1%D0%BA/%D0%B7%D0%BD%D0%B0%D0%BA%D0%BE%D0%BC%D1%81%D1%82%D0%B2%D0%BE%20%D1%81%20%D0%BA%D0%BE%D0%BD%D1%84%D0%B8%D0%B3%D1%83%D1%80%D0%B0%D1%86%D0%B8%D0%B5%D0%B9%20%D0%B2%20%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%86%D0%B8%D0%B8%203.0%20%28%D0%B4%D0%BB%D1%8F%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D0%B5%D0%B9%2C%20%D0%BF%D0%B5%D1%80%D0%B5%D1%88%D0%B5%D0%B4%D1%88%D0%B8%D1%85%20%D1%81%202.0%29.%20%D0%B1%D0%BA.htm`
- access: public
- freshness: historical 3.0 transition
- notes: подтверждает интерфейс Taxi; layout must not be treated as immutable coordinates.

### KZ-ACC30-RELEASE
- authority: primary
- scope: выпуск редакции 3.0 `Бухгалтерия для Казахстана`
- url: `https://1c.kz/news/detail/89539/`
- access: public
- freshness: historical baseline
- notes: release baseline.

## Primary — Kazakhstan / other configurations

### KZ-HRM
- authority: primary
- scope: `Зарплата и Управление Персоналом для Казахстана`
- url: `https://its.1c.kz/section/i1c/doc_user`
- access: mixed
- freshness: discover actual edition before deep ingestion
- notes: separate evidence required for each relevant edition.

### KZ-TRADE30-WAREHOUSE
- authority: primary
- scope: `Управление торговлей для Казахстана`, ред. 3.0 — управление складом
- url: `https://its.1c.kz/db/ut30kz/content/57/hdoc`
- access: public-index/mixed-detail
- freshness: historical edition 3.0
- notes: confirms warehouse topology, retail and warehouse workflow families; do not transfer to newer editions without evidence.

### KZ-TRADE34-SALES
- authority: primary
- scope: `Управление торговлей для Казахстана`, ред. 3.4 — заказ клиента и продажа по нескольким складам
- url: `https://its.1c.kz/db/tradekz/content/104820/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.4
- notes: proof that edition 3.4 is an active documented branch; deeper inventory still required.

### KZ-TRADE-RELEASES
- authority: primary
- scope: `Управление торговлей для Казахстана` release documentation
- url: `https://downloads.v8.1c.ru/content/TradeKzBase/`
- access: public release pages
- freshness: version-specific
- notes: use for version/change evidence, not as sole UI source.

### KZ-ERP24-DOC
- authority: primary
- scope: `ERP Управление предприятием 2 для Казахстана`, редакция 2.4 — official user documentation
- url: `https://its.1c.kz/db/erp24kz`
- access: public-index/mixed-detail
- freshness: edition 2.4
- notes: documented areas include enterprise NSI, nomenclature, planning, production and other ERP domains.

### KZ-ERP24-ENTERPRISE
- authority: primary
- scope: ERP KZ 2.4 — предприятие and NSI
- url: `https://its.1c.kz/db/erp24kz/bookmark/company/Company`
- access: public-index/mixed-detail
- freshness: edition 2.4
- notes: confirms organizations, persons, departments, calendars and related NSI.

### KZ-ERP24-METHOD
- authority: primary
- scope: ERP KZ 2.4 methodological support index
- url: `https://its.1c.kz/db/enterprise2kz/content/103461/hdoc`
- access: public-index/mixed-detail
- freshness: edition 2.4
- notes: indexes Sales, Purchases, Warehouse/Delivery, Production, Treasury, Payroll and other areas.

### KZ-LOCALIZED-SOLUTIONS
- authority: primary
- scope: список локализованных решений 1С для Казахстана
- url: `https://v8.1c.ru/static/lokalizovannye-prikladnye-resheniya-kazakhstan/`
- access: public
- freshness: current list
- notes: discovery of configuration families; not enough for UI fidelity.

## Primary — Platform / common mechanisms

### PLATFORM-USER-GUIDE
- authority: primary
- scope: общие пользовательские механизмы `1С:Предприятие 8`
- url: `https://its.1c.ru/db/v8321doc`
- access: mixed
- freshness: platform-version-specific
- notes: lists/forms/documents/navigation concepts; configuration-specific behavior still requires KZ evidence.

### RU-PRODUCT-DOC-INDEX
- authority: primary
- scope: общий каталог документации продуктов 1С
- url: `https://its.1c.ru/docs/program_documentation/`
- access: mixed
- freshness: current index
- notes: fallback discovery for generic mechanics; never transfer localization facts without KZ evidence.

## Secondary sources

Secondary source допускается для:
- поиска неизвестного workflow;
- UX-наблюдений;
- типичных ошибок;
- пользовательской терминологии.

Но факты о расположении интерфейса, обязательных полях, проводках, налоговой логике и version-specific behavior должны подтверждаться primary evidence или ручной проверкой выбранной версии.

## Source quality flags

- `A`: current/relevant primary + exact configuration/edition/version.
- `B`: primary, but exact build/layout/detail is not fully observed.
- `C`: secondary, corroborated by independent source.
- `D`: hypothesis only; forbidden for final simulator behavior.
