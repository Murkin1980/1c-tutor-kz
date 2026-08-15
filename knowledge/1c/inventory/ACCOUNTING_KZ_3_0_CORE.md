# Accounting KZ 3.0 — Core Knowledge Inventory

Updated: 2026-08-15
Status: populated / progressive deepening

## Purpose

This inventory is the human-readable companion to `graph/nodes.jsonl` and `graph/edges.jsonl` for `1С:Бухгалтерия для Казахстана`, редакция 3.0.

It records what the official documentation proves exists, what Tutor intends to teach, and what still requires exact UI observation before high-fidelity simulation.

## Evidence baseline

Primary sources:
- `KZ-ACC30-TOC` — official Accounting KZ 3.0 user documentation contents;
- `KZ-ACC30-CHARACTERISTICS` — functional characteristics;
- `KZ-ACC30-CONTRACTS` — contracts/counterparties;
- `KZ-ACC30-REALIZATION` — realization of goods/services;
- `KZ-ACC30-WAREHOUSE` — warehouse operations;
- `KZ-ACC30-OSV` — turnover balance sheet;
- `KZ-ACC30-ACCOUNT-CARD` — account card;
- `KZ-ACC30-TRANSITION` — Taxi interface baseline.

## Core common document skills

Official documentation inventories these reusable skills:
- entering documents;
- finding previously entered documents;
- common document attributes;
- creating documents based on other documents;
- posting documents;
- viewing document movements;
- printing documents;
- automated filling of tabular sections;
- configuring visibility of table columns.

Tutor implication: these are cross-workflow skills and should become reusable training primitives rather than repeated hard-coded lesson logic.

## Counterparties and settlements

Cataloged workflows:
- create/input counterparty data;
- create contracts with counterparties;
- principles of settlements with counterparties;
- advance accounting;
- debt adjustment;
- mutual offset / debt write-off / debt transfer;
- reconciliation with counterparties.

### Stage 1B priority

`workflow:accounting-kz:3.0:create-counterparty`

Known with primary evidence:
- counterparty entry is an official prerequisite step in a standard acquisition scenario;
- contracts are separate related entities/workflows;
- counterparties participate in sales, purchases and payment workflows.

Still required before high-fidelity UI claim:
- observed current navigation path for selected Accounting KZ 3.0 build;
- exact list screen labels;
- exact create command label/placement;
- exact counterparty form regions and fields needed by the fictional Tutor scenario;
- save/close behavior observed in the chosen build;
- Interface Passport.

Therefore this workflow is `B` for UI fidelity but sufficiently established to drive domain model and scenario architecture.

## Sales

Official workflow inventory includes:
- customer invoice;
- receipt of non-cash payment from customer;
- realization of goods;
- realization of services;
- return of goods from customer;
- prepaid sale sequence;
- cash sale sequence;
- card-paid sales;
- issue of invoice / invoice-related downstream documents.

Tutor priority sequence after Counterparty PASS:
1. `customer-invoice`;
2. `customer-bank-payment` / advance;
3. `sales-realization`;
4. settlement/reconciliation view.

The official documentation explicitly describes the standard prepaid-sale chain as customer invoice → non-cash payment → shipment. This is the preferred first end-to-end business story for Tutor because it creates visible document/state dependencies.

## Purchases

Official workflow inventory includes:
- supplier / counterparty data;
- supplier payment order;
- non-cash supplier payment;
- receipt of material stocks / goods;
- return to supplier;
- acquisition of goods/services and related variants.

Tutor business relevance for furniture IP:
- receipt of board/hardware;
- supplier payment;
- debt check;
- later link to stock and production.

## Bank and cash

Official documentation inventories:
- cash receipt;
- cash expense;
- cash book;
- bank accounts;
- non-cash receipt;
- non-cash write-off;
- bank statement;
- client-bank exchange;
- payment card flows;
- DirectBank mechanisms.

Tutor MVP should teach manual accounting meaning first. External bank integrations and DirectBank remain outside current scope.

## Inventory / warehouse

Official documentation inventories:
- inventory nomenclature and accounting concepts;
- warehouse accounting;
- movement between warehouses;
- inventory count;
- assembly/complectation;
- goods receipts and returns;
- pricing and inventory-related methodological support.

For furniture workflows, later vertical slices can connect received materials → warehouse balance → production write-off.

## Reports

Official standard reports include:
- turnover balance sheet (ОСВ);
- turnover balance sheet by account;
- account turnovers;
- account analysis;
- account card;
- subconto analysis;
- subconto card;
- postings report;
- general ledger;
- universal report.

Tutor should treat reports as verification/diagnostic surfaces, not only passive reading material. Example: after sale/payment, learner verifies balance and settlements in a report.

## Production

Official Accounting KZ 3.0 documentation inventories:
- write-off of materials to production;
- output of finished goods and semi-finished products;
- returnable waste;
- work in progress;
- contract processing scenarios;
- production cost reports.

This is a high-value future furniture-specific track, but is not part of Stage 1B.

## Payroll / HR inside Accounting KZ

Accounting KZ 3.0 itself contains documented payroll/HR workflows including:
- personnel movement documents;
- payroll accrual;
- leave/sick leave;
- deductions;
- statutory taxes/contributions;
- salary payment;
- payroll reports.

Important: this does NOT replace a future dedicated ZUP/HRM KZ track. The Atlas keeps Accounting KZ payroll and ZUP KZ as separate configuration knowledge because behavior and depth differ.

Regulatory payroll nodes are cataloged only; Tutor must not teach current calculation rules until exact version/current legislation evidence and specialist validation exist.

## Period close

Official documentation inventories:
- preparation for period close;
- period-closing document/process;
- depreciation;
- FX revaluation;
- cost calculation/correction;
- closing advances/taxes and other regulatory operations;
- final income/loss calculation;
- balance reformation;
- tax accounting regulatory operations.

These are advanced modules and require methodological/accounting validation before teaching.

## Confidence convention for this inventory

- `A/cataloged`: official exact-edition documentation proves the workflow/report/domain exists.
- `B/cataloged-needs-ui-passport`: workflow is official, but exact current UI interaction has not yet been observed sufficiently for fidelity.
- `cataloged-regulatory`: existence is official; business/calculation rules require current legal/methodologist validation before course publication.

## Next ingestion queue

1. Counterparty Interface Passport for the selected Accounting KZ 3.0 build.
2. Customer Invoice Interface Passport.
3. Customer Payment / bank receipt Interface Passport.
4. Reusable common document screen primitives.
5. Basic report navigation/passports for OSV and settlements.
6. Nomenclature + goods receipt.
7. Supplier payment.
8. Furniture production path: material write-off → output → cost/report.
