# ZUP KZ 3.1 — Core Knowledge Inventory

Updated: 2026-08-15
Configuration: `1С:Зарплата и Управление Персоналом для Казахстана`
Edition baseline: `3.1 (2-е издание)`
Status: high-level populated; workflow deepening pending

## Primary evidence

- `KZ-ZUP31-DOC`
- `KZ-ZUP31-ORG`
- `KZ-ZUP31-TRANSITION`
- `KZ-ZUP31-PIECEWORK`
- `KZ-ZUP31-ACCOUNTING-REFLECTION`

## Official top-level capability map

Official ZUP KZ 3.1 documentation explicitly identifies:
1. кадровый учет;
2. учет рабочего времени;
3. расчет и учет заработной платы;
4. расчет и учет налогов, взносов и отчислений;
5. регламентированную отчетность.

The configuration is built on 1C:Enterprise 8.3 and its transition material describes a modern configurable workspace. Therefore Tutor must reuse generic managed-application interaction skills where valid, but still create ZUP-specific Interface Passports.

## Proposed Atlas business areas

- `organization-structure`
- `employees-personnel`
- `staffing`
- `hiring-movement-dismissal`
- `work-schedules-time`
- `payroll-input-data`
- `payroll-calculation`
- `taxes-contributions`
- `payments`
- `accounting-reflection`
- `reports-regulated-reporting`
- `administration-rights`

## First future Tutor learning chain

Preferred beginner chain after Accounting track is proven:

`organization structure → employee/person data → hiring/personnel event → schedule/time → payroll input → payroll calculation → payment → payroll/report review`

This is a curriculum hypothesis assembled from the official functional hierarchy. Each step must be deepened into exact workflows and Interface Passports before implementation.

## Known official anchors

### Organization structure
Official documentation has a dedicated `Структура организации` section.

### Payroll input
Documentation contains a dedicated chapter for input data used in payroll calculation and includes examples such as premiums, KPI-related additions and piecework.

### Payroll calculation
Official product characterization separates payroll calculation from working-time records and regulatory taxes/contributions.

### Accounting reflection
Official documentation contains `Отражение зарплаты в бухучете`, which is an important boundary between ZUP payroll results and accounting.

## Regulatory safety

Payroll amounts, tax bases, contributions, rates, deductions, reporting forms and statutory calculations are time-sensitive Kazakhstan regulatory facts.

For Tutor:
- existence and workflow topology may be cataloged from exact-edition docs;
- actual calculation rules require current primary legal/configuration evidence;
- final lessons require specialist/methodologist validation;
- never infer current rates from historical ZUP manual examples.

## Next deep-ingestion queue

1. create employee/personnel record;
2. hiring/personnel movement;
3. work schedule/time record;
4. payroll input data;
5. payroll calculation;
6. salary payment;
7. payroll reports;
8. reflection in accounting.

Each deep workflow should produce:
- workflow node + steps;
- object/screen/command/field nodes;
- Interface Passport;
- deterministic Tutor verification assertions;
- current regulatory validation marker when calculations are taught.
