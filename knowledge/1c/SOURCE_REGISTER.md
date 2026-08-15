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

### KZ-ACC30-INVOICE-EXAMPLES
- authority: primary
- scope: `1С:Бухгалтерия для Казахстана в примерах` — Счет на оплату покупателю
- url: `https://its.1c.kz/db/accountingexampleskz/content/104559/hdoc`
- access: public-index/mixed-detail
- freshness: verify linked build/date on deep ingestion
- notes: high-value next source for customer-invoice Interface Passport and workflow detail.

### KZ-ACC30-INVOICE-NEW
- authority: primary
- scope: новые возможности документа `Счет на оплату покупателю`
- url: `https://its.1c.kz/db/accountingkz/content/104271/hdoc`
- access: public-index/mixed-detail
- freshness: verify article date/build on deep ingestion
- notes: use as change evidence, not sole baseline UI evidence.

### KZ-ACC30-METHOD-INDEX
- authority: primary
- scope: methodological support index for Accounting KZ 3.0
- url: `https://its.1c.kz/db/accountingkz/content/104049/hdoc`
- access: public-index/mixed-detail
- freshness: current index
- notes: broad discovery source for cash settlements, card payments, starting balances, VAT, ESF and many other topics.

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

## Primary — Kazakhstan / ZUP HRM

### KZ-ZUP31-DOC
- authority: primary
- scope: `Зарплата и Управление Персоналом для Казахстана`, редакция 3.1, 2-е издание
- url: `https://its.1c.kz/db/zup31kz`
- access: public-index/mixed-detail
- freshness: edition 3.1
- notes: canonical current Atlas baseline for the dedicated HR/payroll configuration until a newer relevant edition is verified.

### KZ-ZUP31-ORG
- authority: primary
- scope: ZUP KZ 3.1 — структура организации and documentation TOC context
- url: `https://its.1c.kz/db/zup31kz/content/14/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.1, 2nd edition
- notes: confirms major domains: HR records, time, payroll, statutory taxes/contributions, regulated reporting.

### KZ-ZUP31-TRANSITION
- authority: primary
- scope: transition guide to ZUP KZ 3.1 and interface modernization
- url: `https://its.1c.kz/db/content/ruk/src/%D0%B7%D1%83%D0%BF/%D0%B7%D0%BD%D0%B0%D0%BA%D0%BE%D0%BC%D1%81%D1%82%D0%B2%D0%BE%20%D1%81%20%D0%BA%D0%BE%D0%BD%D1%84%D0%B8%D0%B3%D1%83%D1%80%D0%B0%D1%86%D0%B8%D0%B5%D0%B9%20%D0%B2%20%D1%80%D0%B5%D0%B4.3.1_%D0%B7%D1%83%D0%BF%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%B0%D0%B7%D0%B0%D1%85%D1%81%D1%82%D0%B0%D0%BD%D0%B0.htm`
- access: public
- freshness: published 2021, edition baseline
- notes: confirms 1C:Enterprise 8.3 and customizable modern workspace concepts.

### KZ-ZUP31-PIECEWORK
- authority: primary
- scope: ZUP KZ 3.1 — input data for payroll, piecework
- url: `https://its.1c.kz/db/zup31kz/content/83/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.1
- notes: proves payroll-input chapter and relationship to payroll calculation.

### KZ-ZUP31-ACCOUNTING-REFLECTION
- authority: primary
- scope: ZUP KZ 3.1 — отражение зарплаты в бухучете
- url: `https://its.1c.kz/db/zup31kz/content/155/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.1
- notes: integration boundary between payroll results and accounting.

## Primary — Kazakhstan / Trade

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
- notes: proof that edition 3.4 is a documented branch; deeper inventory still required.

### KZ-TRADE-RELEASES
- authority: primary
- scope: `Управление торговлей для Казахстана` release documentation
- url: `https://downloads.v8.1c.ru/content/TradeKzBase/`
- access: public release pages
- freshness: version-specific
- notes: use for version/change evidence, not as sole UI source.

## Primary — Kazakhstan / UNF

### KZ-UNF30-DOC
- authority: primary
- scope: `Управление нашей фирмой для Казахстана`, редакция 3.0
- url: `https://its.1c.kz/db/unf30kz`
- access: public-index/mixed-detail
- freshness: edition 3.0
- notes: high-value SMB cross-functional configuration; documented setup, nomenclature, sales, production, money and other domains.

### KZ-UNF30-MONEY
- authority: primary
- scope: UNF KZ 3.0 — безналичные денежные средства
- url: `https://its.1c.kz/db/unf30kz/content/87/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.0
- notes: confirms money domain and production/report context from documentation TOC.

### KZ-UNF30-SALES
- authority: primary
- scope: UNF KZ 3.0 — Sales chapter context
- url: `https://its.1c.kz/db/unf30kz/content/40/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.0
- notes: confirms Sales chapter plus CRM/settings context.

## Primary — Kazakhstan / ERP

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

## Primary — Kazakhstan / Complex Automation

### KZ-CA24-DOC
- authority: primary
- scope: `Комплексная автоматизация для Казахстана`, редакция 2.4
- url: `https://its.1c.kz/db/ka24kz`
- access: public-index/mixed-detail
- freshness: edition 2.4
- notes: canonical baseline for CA KZ 2.4.

### KZ-CA24-NSI
- authority: primary
- scope: CA KZ 2.4 — enterprise/nomenclature/series NSI context
- url: `https://its.1c.kz/db/ka24kz/content/891/hdoc`
- access: public-index/mixed-detail
- freshness: edition 2.4
- notes: source page is inside needs planning chapter but exposes detailed product TOC and NSI hierarchy.

### KZ-CA24-WHOLESALE
- authority: primary
- scope: CA KZ 2.4 — оптовая торговля
- url: `https://its.1c.kz/db/ka24kz/content/888/hdoc`
- access: public-index/mixed-detail
- freshness: edition 2.4
- notes: wholesale trade context.

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
