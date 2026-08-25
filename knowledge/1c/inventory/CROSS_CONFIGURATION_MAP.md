# Cross-Configuration Capability Map — Kazakhstan

Updated: 2026-08-15
Status: high-level official inventory

## Purpose

This file prevents future Tutor expansion from treating each 1C configuration as an unrelated product. It records which business capabilities appear across configurations and where deeper configuration-specific behavior must remain separated.

## Configuration baselines currently resolved

| Configuration | Edition baseline in Atlas | Official evidence | Tutor priority |
|---|---|---|---|
| Бухгалтерия для Казахстана | 3.0 | KZ-ACC30-DOC / KZ-ACC30-TOC | P0 |
| ЗУП для Казахстана | 3.1, 2nd edition | KZ-ZUP31-DOC | P1 after Accounting core |
| Управление торговлей для Казахстана | 3.0 + 3.4 evidence | KZ-TRADE30-WAREHOUSE / KZ-TRADE34-SALES | P1/P2 depending business need |
| Управление нашей фирмой для Казахстана | 3.0 | KZ-UNF30-DOC | P1 for SMB owner track |
| ERP Управление предприятием 2 для Казахстана | 2.4 | KZ-ERP24-DOC | P3 advanced |
| Комплексная автоматизация для Казахстана | 2.4 | KZ-CA24-DOC | P2/P3 |

## Reusable capability families

### Master data / NSI
Appears across Accounting, Trade, UNF, ERP and Complex Automation:
- organizations;
- persons/counterparties/clients/suppliers depending configuration semantics;
- nomenclature;
- units/packaging/characteristics/series in richer configurations;
- departments and organizational structure.

Tutor rule: reuse visual/interaction primitives only. Do not assume identical object schemas or field semantics across configurations.

### Sales
Observed across Accounting, Trade, UNF, ERP and Complex Automation.

Typical capability family:
`customer/client → order/invoice/sales document → payment → shipment/realization → return → settlement/report`

Exact document names, sequence and states are configuration-specific.

### Purchases
Observed across Accounting, UNF, ERP/CA and trade-oriented solutions.

Typical capability family:
`supplier → procurement/order/payment → receipt → debt/settlement → return`

### Warehouse / Inventory
Observed strongly across Accounting, Trade, UNF, ERP and CA:
- nomenclature;
- warehouses;
- receipts;
- movements;
- inventory counts;
- assembly/complectation;
- series/characteristics in richer solutions.

Trade KZ documentation explicitly has a dedicated `Управление складом` chapter. ERP/CA have broader logistics/needs-planning models.

### Money / Treasury
Accounting and UNF contain bank/cash flows; ERP/CA expose richer treasury capabilities.

Tutor rule: teach the accounting meaning first, then configuration-specific treasury sophistication only when a track requires it.

### Production
Accounting KZ includes core production accounting. UNF includes production/work execution. ERP has a substantially deeper production domain.

For furniture training the capability ladder should be:
1. Accounting KZ: material write-off + finished-product output + cost/report basics;
2. UNF/other SMB track if operational production management is needed;
3. ERP only for advanced planning/shop-floor/resource scenarios.

### HR / Payroll
Accounting KZ includes basic payroll/HR accounting workflows. Dedicated ZUP KZ is a separate deep HR/payroll system. ERP/CA also contain payroll/personnel capabilities.

Tutor rule: never collapse these into one generic implementation. Reuse learned concepts, but link every lesson to the configuration-specific Atlas workflow.

## UNF KZ 3.0 high-level map

Official documentation confirms edition 3.0 and exposes chapters/contexts including:
- initial setup and reference information;
- nomenclature;
- CRM and sales;
- production/work execution context;
- money including non-cash funds;
- reports and other SMB functions.

UNF is therefore a strong future candidate for a `small-business operator` learning track because it connects CRM/sales, work/production and money in one configuration.

## Trade KZ high-level map

Official documentation evidence currently records:
- edition 3.0 warehouse-management and retail chapters;
- edition 3.4 sales examples including one customer order/sale spanning several warehouses.

Before Tutor implementation, choose one target edition/build and create a dedicated full map. Do not mix 3.0 UI with 3.4 workflows.

## ERP KZ 2.4 high-level map

Official ERP KZ 2.4 evidence exposes:
- enterprise/NSI;
- nomenclature;
- planning;
- sales;
- purchases;
- warehouse/delivery;
- production;
- payroll/personnel;
- treasury/cash;
- financial result/controlling and other enterprise domains.

ERP is intentionally not a near-term Tutor implementation target. Atlas inventory is retained so future advanced modules have a structured starting point.

## Complex Automation KZ 2.4 high-level map

Official documentation exposes:
- enterprise and nomenclature NSI;
- planning and needs provision;
- wholesale trade;
- broader integrated automation capabilities.

This track should only be deepened if a concrete learner/business use case appears.

## Transfer-of-learning rule

When two configurations share a capability, Tutor may teach a reusable mental model such as:
- list → create/open form → fill fields → save/post → inspect result;
- counterparty/client/supplier relationship;
- document chain;
- inventory movement;
- settlement balance.

But every practical simulator remains bound to:
`configuration + edition/build + workflow + Interface Passport + evidence`.

`ANALOGOUS_TO` is never equivalent to `IDENTICAL_TO`.
