# ZUP KZ 3.1 — Learning Chain Inventory

Updated: 2026-08-15
Configuration: `hrm-kz`
Edition: `3.1` (2nd edition documentation)
Status: high-confidence workflow map; UI passports not yet captured

## Primary evidence

Official ZUP KZ 3.1 documentation explicitly structures the product around:
- кадровый учет;
- учет рабочего времени;
- расчет и учет заработной платы;
- расчет и учет налогов, взносов и отчислений;
- регламентированная отчетность.

The same documentation gives a concrete HR/payroll chain with:
- employee creation/card;
- hiring;
- personnel transfer;
- change of pay;
- planned accruals;
- work-time data;
- payroll calculation;
- payroll payment by several channels;
- analysis of payroll debt;
- reflection of payroll in accounting.

## Recommended future Tutor learning chain

### Z1 — Employee / person master data

Workflow family:
- create employee;
- employee card;
- physical-person card.

Official documentation: Chapter 5.1.

Learning objective:
Understand the distinction between a physical person and an employee record rather than treating them as one free-text field.

Passport required before implementation.

### Z2 — Hire employee

Workflow: `Прием на работу`.
Official documentation: Chapter 5.2.1.

Prerequisites:
- organization structure;
- position/job context;
- employee/person exists.

Expected Tutor state:
- employment record created;
- organization/subdivision/position linked;
- employment start date stored;
- planned pay setup linked according to scenario.

Regulatory warning:
Exact statutory fields and current Kazakhstan labor/payroll rules require current specialist validation before authoritative teaching.

### Z3 — Personnel transfer / pay change

Official workflows:
- `Кадровый перевод`;
- `Изменение оплаты труда`;
- assignment/change of planned accruals.

Learning objective:
Teach that employment conditions are changed through explicit personnel events, not by silently editing historical results.

### Z4 — Work schedule and time

Official product domain includes work-time accounting; documentation includes individual schedules, incomplete time, night hours, holidays/overtime and timesheet reporting.

Learning objective:
Understand which time facts feed payroll calculation.

### Z5 — Payroll input data

Official documentation separates input data for calculation, including piecework (`Сдельные работы`) and other source data.

Learning objective:
Recognize payroll inputs before running calculation.

### Z6 — Calculate payroll and contributions

Official documentation has a dedicated `Расчет зарплаты и взносов` chapter with accruals/recalculations, contracts, deductions, loans and taxes/contributions.

Learning objective:
Run a controlled fictional payroll scenario and inspect calculation components.

Regulatory gate:
Tax/contribution percentages, bases, limits and current statutory rules are time-sensitive and must never be frozen in Atlas without source date/version and specialist review.

### Z7 — Pay salary

Official Chapter 16 separates payment places/channels and payment documents.

Confirmed payment channels include:
- cash desk;
- bank salary project;
- arbitrary employee bank accounts;
- distributor/responsible person.

Official transition material confirms distinct documents including:
- `Ведомость в банк` for salary project;
- `Ведомость в кассу`;
- `Ведомость на счета`;
- `Ведомость выплаты через раздатчика`.

Recommended first Tutor path:
`Ведомость в банк` in a fully fictional training scenario.

### Z8 — Analyze salary debt

Official workflow: `Анализ задолженности по зарплате`.

Learning objective:
Verify consequences after accrual/payment instead of treating payment document creation as the end of the lesson.

### Z9 — Reflect payroll in accounting

Official Chapter 20 includes:
- operation/reflection methods;
- specifying reflection methods;
- `Отражение зарплаты в бухучете`;
- accrued salary/contributions;
- regulated deductions;
- withheld salary.

Learning objective:
Teach boundary between HR/payroll calculation and accounting reflection/integration.

## Dependency graph

`Organization structure → Person/Employee → Hire → Planned pay/work schedule → Work-time/input data → Payroll calculation → Taxes/contributions → Payment statement → Debt analysis → Accounting reflection`.

This is a knowledge-map dependency, not authorization to implement all modules at once.

## Future Tutor tracks

### Beginner HR track
1. employee/person;
2. hire;
3. transfer/change pay;
4. leave/absence basics later;
5. HR reports.

### Beginner payroll track
1. prerequisites/planned accruals;
2. time/input data;
3. payroll calculation;
4. payment statement;
5. debt check;
6. accounting reflection.

## Evidence sources

- ZUP KZ 3.1 Chapter 1 general characteristics: `https://its.1c.kz/db/zup31kz/content/5/hdoc`
- organization structure / TOC context: `https://its.1c.kz/db/zup31kz/content/14/hdoc`
- HR workflows visible through Chapter 5 TOC context: `https://its.1c.kz/db/zup31kz/content/31/hdoc`
- payroll calculation: `https://its.1c.kz/db/zup31kz/content/85/hdoc`
- payment places/channels: `https://its.1c.kz/db/zup31kz/content/92/hdoc`
- bank statement: `https://its.1c.kz/db/zup31kz/content/94/hdoc`
- payroll debt analysis: `https://its.1c.kz/db/zup31kz/content/101/hdoc`
- accounting reflection: `https://its.1c.kz/db/zup31kz/content/155/hdoc`
- transition guide / distinct payment documents: official 1C KZ transition guide for edition 3.1.

## Confidence

- workflow/domain existence and dependency family: `A` primary exact-edition evidence;
- exact current UI labels/positions: `B / Interface Passport required`;
- current Kazakhstan payroll formulas/rates: `NOT INGESTED as canonical values` until dated regulatory validation.

## Atlas next gap for ZUP

Create graph nodes/edges for Z1–Z9 and an Interface Passport only when a ZUP training track becomes MPE-approved. Do not spend implementation time cloning ZUP UI before the Accounting Tutor engine proves reusable.