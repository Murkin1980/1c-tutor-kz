# TAXONOMY — 1C Knowledge Atlas

## 1. Configuration families

Initial Kazakhstan families:
- `accounting-kz` — Бухгалтерия для Казахстана;
- `hrm-kz` — Зарплата и Управление Персоналом для Казахстана;
- `trade-kz` — Управление торговлей для Казахстана;
- `unf-kz` — Управление нашей фирмой для Казахстана;
- `erp-kz` — ERP Управление предприятием для Казахстана;
- `ca-kz` — Комплексная автоматизация для Казахстана;
- `docflow-kz` — Документооборот для Казахстана;
- `platform` — общие механизмы 1С:Предприятия.

Новые family id добавляются только после появления подтвержденного учебного use case.

## 2. Business areas

Нормализованный словарь областей:
- `general` — Главное / начало работы;
- `settings` — настройки и учетная политика;
- `counterparties` — контрагенты;
- `catalogs` — справочники;
- `sales` — продажи;
- `purchases` — покупки/закупки;
- `bank` — банк;
- `cash` — касса;
- `inventory` — номенклатура и склад;
- `production` — производство;
- `fixed-assets` — ОС и НМА;
- `payroll` — зарплата;
- `hr` — кадровый учет;
- `tax` — налоги;
- `reports` — отчеты;
- `closing` — закрытие периода;
- `integration` — обмены/интеграции;
- `administration` — администрирование.

Конфигурация может использовать другие display names; Atlas хранит и normalized id, и observed label.

## 3. Object types

- `Catalog` / Справочник;
- `Document` / Документ;
- `Report` / Отчет;
- `Processing` / Обработка;
- `Register` / Регистр;
- `ChartOfAccounts` / План счетов;
- `Task`;
- `Workspace`;
- `Form`;
- `List`;
- `Command`;
- `Field`;
- `TablePart`;
- `Status`;
- `ValidationRule`.

## 4. Workflow types

- `create-master-data`;
- `create-document`;
- `post-document`;
- `receive-payment`;
- `make-payment`;
- `reconcile`;
- `review-balance`;
- `inventory-movement`;
- `payroll-operation`;
- `hr-operation`;
- `period-close`;
- `reporting`;
- `correction`;
- `configuration/setup`.

## 5. Learning levels

- `L0_orientation` — найти раздел/объект;
- `L1_guided_action` — выполнить с coach;
- `L2_independent_action` — выполнить без маршрута;
- `L3_multi_document_flow` — связать несколько документов;
- `L4_diagnostics` — найти и исправить ошибку;
- `L5_reconciliation` — сверить разные источники/регистры;
- `L6_transfer` — выполнить аналогичный процесс в реальной/официальной среде под контролем.

## 6. Evidence dimensions

Каждая факт-запись должна иметь:
- `configuration`;
- `edition/version`;
- `observed_at`;
- `source_id`;
- `source_url`;
- `authority`;
- `quality_grade`;
- `fact_type`;
- `summary`;
- `status`: `observed | inferred | verified | deprecated`.

## 7. Interface dimensions

Для UI знаний:
- section/navigation label;
- form title;
- command label;
- control type;
- approximate placement (`top-command-bar`, `left-nav`, `form-header`, `main-form`, etc.);
- enabled/disabled conditions;
- resulting state;
- error/warning behavior;
- keyboard/focus notes when observed.

Координаты пикселей не являются долговечным знанием и хранятся только в visual-regression fixtures конкретного Interface Passport.