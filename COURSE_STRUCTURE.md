# COURSE STRUCTURE — 1C Tutor KZ

Обновлено: 2026-08-15.

## Принцип курса

Курс строится не как последовательность текстовых уроков, а как карта практических навыков, связанных с 1C Knowledge Atlas.

Каждый practical lesson обязан ссылаться на:
- `configuration`;
- `edition/version`;
- `workflow_id` из Atlas;
- `interface_passport_id`;
- `learning_level`;
- state assertions;
- Demo / Guided / Test сценарии.

## Track 1 — Accounting KZ / практический старт

Целевая конфигурация: `Бухгалтерия для Казахстана`, ред. 3.0, конкретная версия/наблюдение уточняется через Atlas.

### Phase A — Orientation
- устройство Training Workspace;
- безопасная учебная среда;
- основные принципы разделов/списков/форм;
- навигация без создания данных.

### Phase B — Master data
1. `Создать учебного покупателя` — текущий vertical slice.
2. создать учебного поставщика.
3. создать номенклатуру.
4. создать услугу.

Каждый следующий урок начинается только после наличия Atlas workflow + Interface Passport.

### Phase C — Sales
1. создать счёт/документ продажи согласно подтвержденному workflow;
2. проверить строки/количество/цену/итог;
3. зарегистрировать оплату/аванс;
4. выполнить реализацию;
5. проверить расчёты с покупателем.

### Phase D — Purchases
- поставщик;
- поступление материалов;
- оплата поставщику;
- корректировка/возврат только после доказанной необходимости.

### Phase E — Bank / Cash
- входящий платёж;
- исходящий платёж;
- кассовые операции;
- сверка движения денег.

### Phase F — Inventory
- номенклатура;
- остатки;
- поступление/списание/перемещение только по подтвержденным Accounting KZ workflows.

### Phase G — Control / Reports
- расчёты с покупателями;
- расчёты с поставщиками;
- стандартные отчёты;
- поиск расхождения;
- закрытие периода — advanced gate.

### Capstone
Провести вымышленный мебельный заказ через несколько связанных документов и доказать итог по state assertions/отчетам.

## Learning progression внутри одного workflow

### L0 — Orientation
Найти нужный раздел/объект.

### L1 — Demo
Посмотреть правильный путь.

### L1 — Guided Practice
Повторить самостоятельно с contextual coach.

### L2 — Independent Test
Получить только бизнес-задачу и выполнить её без пошаговой помощи.

### L3 — Variation
Та же логика с другими учебными данными.

### L4 — Diagnostics
Исправить намеренную ошибку.

### L5 — Cross-document reconciliation
Связать несколько документов/состояний.

Не каждый workflow обязан доходить до L5.

## Future tracks after Accounting KZ proof + Stage K1

### Track 2 — HRM/ZUP KZ
Potential areas:
- сотрудники/физлица;
- приём;
- кадровые изменения;
- отпуск;
- увольнение;
- начисление/выплата зарплаты;
- кадровые/зарплатные отчёты.

Расчётная и регуляторная логика требует exact-version primary evidence + specialist review.

### Track 3 — Trade KZ
Potential areas:
- контрагенты;
- номенклатура;
- цены;
- продажи;
- закупки;
- склад;
- инвентаризация;
- взаиморасчёты.

### Track 4 — UNF KZ
Только после подтверждённой аудитории/ценности.

### Track 5 — ERP / Complex Automation
Advanced audience only; не строить просто ради полноты каталога 1С.

## Practical scenario schema

```yaml
id: training-counterparty-v1
configuration: accounting-kz
edition: "3.0"
workflowId: workflow:accounting-kz:3.0:create-counterparty
interfacePassportId: passport:accounting-kz:3.0:create-counterparty:<observed-version>
learningLevel: L1_guided_action
businessGoal: Создать карточку вымышленного покупателя
sourceData:
  name: ТОО Учебный Покупатель
  city: Кызылорда
modes:
  demo: true
  guided: true
  test: true
assertions:
  - counterparty.exists
  - counterparty.name_equals
  - counterparty.city_equals
  - counterparty.saved
```

## Course publication gate

Практический урок нельзя публиковать как готовый, если:
- нет Atlas workflow ID;
- нет достаточного Interface Passport для UI-sensitive сценария;
- state verification можно обойти answer-only вводом;
- используются непроверенные реальные/регуляторные правила;
- нет owner UX review для нового типа vertical slice;
- сценарий требует обязательного платного внешнего сервиса без отдельного решения.