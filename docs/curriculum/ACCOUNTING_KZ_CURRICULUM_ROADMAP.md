# Accounting KZ 3.0 — curriculum roadmap

Updated: 2026-08-20

MPE disposition: `EXTEND_EXISTING`

Scope: `1С:Бухгалтерия для Казахстана`, редакция 3.0
Planned curriculum: **15 sections / 77 lessons**

## Purpose

This roadmap converts the open official Accounting KZ 3.0 documentation structure into an author-designed practical learning sequence. The official table of contents currently contains **17 chapters**; the **15 curriculum sections** below are not official chapter names or a one-to-one copy. Related chapters are regrouped around learnable business outcomes, while specialized subjects are listed as electives. The roadmap does not authorize bulk implementation. Each practical lesson is a separate, gated Training Workspace vertical slice.

The curriculum uses two complementary orders:

- **first validation story** — customer → invoice → incoming payment → realization, using explicitly seeded minimal nomenclature/bank prerequisites to prove the learning engine;
- **systematic deepening** — safe navigation → setup → documents/reports → sales → purchases → money → warehouse → control reports → assets/payroll/production → close/tax/reporting.

Therefore M03 introduces only the minimum item, price and payment concepts needed for one coherent customer story. M05 and M06 later teach bank/cash and inventory as full reusable subsystems. A lesson must declare any seeded prerequisite it uses; it must not pretend that the learner already mastered the later subsystem.

## Sources and evidence boundary

Primary open sources:

- `KZ-ACC30-TOC` — [official Accounting KZ 3.0 documentation contents](https://its.1c.kz/db/acc30kz/content/1/hdoc);
- `KZ-ACC30-CHARACTERISTICS` — [official product capabilities](https://1c.kz/v8/RegionalSolutions_KZ_BUH.php);
- `KZ-ACC30-FEATURES` — [official solution feature page](https://solutions.1c.ru/catalog/buhv8-kz/features);
- `KZ-ACC30-RELEASE-3` — [official edition 3.0 functional overview and section list](https://1c.kz/news/detail/89539/);
- `KZ-ACC30-TRADE` — [official Chapter 7: trade operations](https://its.1c.kz/db/acc30kz/content/45/hdoc);
- `KZ-ACC30-CLOSE` — [official Chapter 11: period close](https://its.1c.kz/db/acc30kz/content/85/hdoc);
- `KZ-ACC30-REPORTING` — [official Chapter 13: regulated reporting](https://its.1c.kz/db/acc30kz/content/95/hdoc);
- existing normalized Atlas inventory: `knowledge/1c/inventory/ACCOUNTING_KZ_3_0_CORE.md`.

Evidence levels:

- `A` — official exact-edition documentation confirms the domain/workflow;
- `B` — workflow confirmed, exact current UI still requires an Interface Passport;
- `R` — regulatory topic; current law/version and accountant review are mandatory before publication.

Open documentation proves the functional map and many workflow dependencies. It does not automatically prove exact control placement in a currently installed build or current tax calculation rules.

## Delivery waves

| Wave | Sections | Outcome | Gate |
|---|---:|---|---|
| A — foundation | M00–M02 | safe navigation, setup, documents and reports | reusable learning primitives proven |
| B — first business cycle | M03 | complete customer sale and settlement cycle | each lesson receives owner PASS |
| C — operating cycle | M04–M06 | purchases, money and warehouse | prior dependent slices accepted |
| D — control and people | M07–M09 | diagnostics, assets and basic payroll | regulatory lessons separately validated |
| E — advanced accounting | M10–M13 | production, close, VAT/tax and reporting | methodologist + owner gates |
| F — operations | M14 | service, access and safe maintenance | no production admin automation |

## Sections and lessons

### M00 — Safe start and interface — 4 lessons

1. `AKZ-M00-L01` — Training Workspace and the boundary between training and real 1C.
2. `AKZ-M00-L02` — Sections, navigation, lists, forms and commands.
3. `AKZ-M00-L03` — Search, filters, favorites and recent objects.
4. `AKZ-M00-L04` — Safe document lifecycle: create, save, post, movements, print.

### M01 — Organization and initial setup — 5 lessons

1. `AKZ-M01-L01` — Organization card and core fictional details.
2. `AKZ-M01-L02` — Accounting policy: what settings affect later operations.
3. `AKZ-M01-L03` — Accounting parameters, functional options and currencies.
4. `AKZ-M01-L04` — Departments, warehouses, bank accounts and cash desks.
5. `AKZ-M01-L05` — Initial balances and opening-control checklist.

### M02 — Accounting objects and basic control — 5 lessons

1. `AKZ-M02-L01` — Charts of accounts, analytics and subconto.
2. `AKZ-M02-L02` — Documents, journals, registers and operation history.
3. `AKZ-M02-L03` — Posting and document movements without manual guessing.
4. `AKZ-M02-L04` — Turnover balance sheet as the first control report.
5. `AKZ-M02-L05` — Account card and tracing a document to its accounting effect.

### M03 — Customers, sales and settlements — 7 lessons

1. `AKZ-M03-L01` — Create and save a fictional customer card.
2. `AKZ-M03-L02` — Create a customer invoice with quantity, price and total.
3. `AKZ-M03-L03` — Register incoming non-cash customer payment/advance.
4. `AKZ-M03-L04` — Register realization/shipment of goods and services.
5. `AKZ-M03-L05` — Customer return and correction of the sales chain.
6. `AKZ-M03-L06` — Customer contract and settlement-detail settings.
7. `AKZ-M03-L07` — Reconciliation statement and customer debt diagnosis.

Dependencies inside the first validation story:

- `M03-L02` uses a seeded training item and teaches only selection, quantity, price and total; full nomenclature mastery belongs to `M06-L01`.
- `M03-L03` uses a seeded fictional bank account and introduces only the incoming customer-payment path; full bank setup/control belongs to `M05`.
- before the course is released as a strict linear learner route, these just-in-time prerequisites must be represented in lesson onboarding or M05/M06 prerequisite micro-lessons must be promoted earlier by an owner decision.

### M04 — Suppliers and purchases — 6 lessons

1. `AKZ-M04-L01` — Supplier card and contract.
2. `AKZ-M04-L02` — Supplier invoice/payment basis and payment order.
3. `AKZ-M04-L03` — Non-cash payment to supplier.
4. `AKZ-M04-L04` — Receipt of goods and materials.
5. `AKZ-M04-L05` — Receipt of services and additional acquisition expenses.
6. `AKZ-M04-L06` — Return to supplier and supplier debt check.

### M05 — Bank, cash and accountable persons — 6 lessons

1. `AKZ-M05-L01` — Bank accounts, cash-flow items and payment purpose.
2. `AKZ-M05-L02` — Bank receipt and bank write-off.
3. `AKZ-M05-L03` — Bank statement matching and daily bank control.
4. `AKZ-M05-L04` — Cash receipt, cash expense and cash book.
5. `AKZ-M05-L05` — Advance to an accountable person and expense report.
6. `AKZ-M05-L06` — Foreign-currency basics and exchange differences.

### M06 — Nomenclature and warehouse — 6 lessons

1. `AKZ-M06-L01` — Nomenclature, units, groups, prices and accounting accounts.
2. `AKZ-M06-L02` — Warehouse balances after receipt and sale.
3. `AKZ-M06-L03` — Movement between warehouses.
4. `AKZ-M06-L04` — Inventory count and comparison with accounting data.
5. `AKZ-M06-L05` — Surplus, shortage and write-off after inventory.
6. `AKZ-M06-L06` — Assembly/complectation and stock verification.

### M07 — Standard reports and error investigation — 5 lessons

1. `AKZ-M07-L01` — Turnover balance sheet: balances and turnovers.
2. `AKZ-M07-L02` — Account analysis and account card.
3. `AKZ-M07-L03` — Subconto analysis for customers, suppliers and inventory.
4. `AKZ-M07-L04` — General ledger, postings report and drill-down.
5. `AKZ-M07-L05` — End-to-end discrepancy investigation case.

### M08 — Fixed assets and intangible assets — 5 lessons

1. `AKZ-M08-L01` — Receipt of a fixed asset.
2. `AKZ-M08-L02` — Acceptance for accounting and useful-life settings.
3. `AKZ-M08-L03` — Monthly depreciation and allocation.
4. `AKZ-M08-L04` — Movement, modernization and inventory.
5. `AKZ-M08-L05` — Disposal/write-off and control reports.

### M09 — Personnel and payroll in Accounting KZ — 6 lessons

1. `AKZ-M09-L01` — Employee card, hiring and personnel movement.
2. `AKZ-M09-L02` — Payroll setup and recurring accruals.
3. `AKZ-M09-L03` — Time/absence inputs, leave and sick leave overview.
4. `AKZ-M09-L04` — Payroll calculation and review of results.
5. `AKZ-M09-L05` — Taxes, contributions and deductions (`R`).
6. `AKZ-M09-L06` — Salary payment and payroll debt reports (`R`).

This section covers only the Accounting KZ payroll subset and does not replace the future ZUP KZ track.

### M10 — Production accounting — 6 lessons

1. `AKZ-M10-L01` — Production items, specifications and cost groups.
2. `AKZ-M10-L02` — Transfer/write-off of materials to production.
3. `AKZ-M10-L03` — Output of finished goods.
4. `AKZ-M10-L04` — Semi-finished products, waste and work in progress.
5. `AKZ-M10-L05` — Indirect expenses and distribution bases.
6. `AKZ-M10-L06` — Actual cost calculation and production reports.

### M11 — Period close — 5 lessons

1. `AKZ-M11-L01` — Pre-close checklist and correction of blocking errors.
2. `AKZ-M11-L02` — Depreciation, deferred expenses and FX revaluation.
3. `AKZ-M11-L03` — Cost calculation and indirect-expense allocation.
4. `AKZ-M11-L04` — Financial result and period-closing operation.
5. `AKZ-M11-L05` — Post-close control with calculation certificates and reports.

### M12 — VAT and tax accounting — 5 lessons

1. `AKZ-M12-L01` — VAT settings and taxable/non-taxable operation boundaries (`R`).
2. `AKZ-M12-L02` — Input VAT and acceptance for offset (`R`).
3. `AKZ-M12-L03` — Output VAT and sales documents (`R`).
4. `AKZ-M12-L04` — VAT reconciliation and declaration preparation (`R`).
5. `AKZ-M12-L05` — Corporate-income-tax accounting and tax registers (`R`).

### M13 — Regulated reporting — 3 lessons

1. `AKZ-M13-L01` — Reporting list, periods, versions and status (`R`).
2. `AKZ-M13-L02` — Pre-fill controls and explanation of discrepancies (`R`).
3. `AKZ-M13-L03` — Preparation/export workflow without government submission (`R`).

The Tutor never submits reports to government systems and never requests real credentials.

### M14 — Service and administration — 3 lessons

1. `AKZ-M14-L01` — Users, roles and least-privilege concepts.
2. `AKZ-M14-L02` — Report settings, variants and safe personalization.
3. `AKZ-M14-L03` — Backup/update/support concepts and escalation boundaries.

## Specialized electives outside the required 77 lessons

The official documentation also contains specialized workflows that are real but are not required for the general beginner-to-competent route. They remain cataloged backlog, not silently omitted:

- import/export and EAEU confirmation workflows;
- excise accounting;
- payment cards, acquiring, WebKassa and DirectBank;
- structural subdivisions on a separate balance;
- joint activity and production-sharing arrangements;
- advanced foreign-currency and nonresident operations;
- tolling/contract-processing variants beyond the core production path;
- specialized IFRS 15 revenue scenarios;
- advanced/basic-version administration differences.
- distributed information bases and synchronization;
- collaboration/exchange with other 1C configurations.

An elective becomes a lesson only after a separate MPE priority decision, Atlas workflow deepening, legally accessible Interface Passport evidence and a measurable target audience. Real bank, fiscal, government or 1C integrations remain outside the embedded core loop.

## Definition of a finished practical lesson

A practical lesson is `DONE` only when all are true:

1. Atlas workflow, evidence IDs and confidence are recorded.
2. Exact UI-sensitive facts have an Interface Passport or remain explicitly bounded.
3. Demo, Guided and Independent Test are implemented.
4. Completion is verified from deterministic Training Workspace state.
5. Negative and recovery scenarios are tested.
6. Lint, typecheck, unit, build, secrets and relevant E2E pass.
7. Desktop and 360px mobile smoke pass.
8. Documentation and `LESSON_STATUS.md` are updated.
9. Owner explicitly accepts the lesson.

## Scope gates

- The roadmap is planning authority, not blanket implementation authorization.
- Current execution remains at `AKZ-M03-L01` owner review.
- `AKZ-M03-L02` may not start until the owner explicitly accepts `AKZ-M03-L01` and authorizes the next slice.
- Regulatory lessons marked `R` require current-law evidence and accountant/methodologist review.
- Cross-configuration tracks such as ZUP, Trade, UNF and ERP remain separate future tracks inside the same Atlas.
