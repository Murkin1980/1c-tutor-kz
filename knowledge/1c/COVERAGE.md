# COVERAGE — 1C Knowledge Atlas

Обновлено: 2026-08-15.

| Configuration | Edition | Areas inventoried | Workflows cataloged/deep | UI passports | Confidence | Status / next gap |
|---|---|---:|---:|---:|---|---|
| Accounting KZ | 3.0 | 11 core areas | 35+ cataloged; 3 Stage 1B deep workflow records | 3 draft passports | A workflow / B build-specific UI | Counterparty → Invoice → Payment now implementation-support ready; exact build observation still required before fidelity claim |
| ZUP/HRM KZ | 3.1 (2nd ed.) | HR, time, payroll, taxes/contributions, reporting identified | high-level inventory started | 0 | A high-level | Build hiring/personnel/payroll workflow map; regulatory facts need current specialist validation |
| Trade KZ | 3.0 + 3.4 evidence | warehouse, retail; 3.4 sales example | high-level inventory started | 0 | A high-level | Choose target teaching edition before deep workflow map |
| UNF KZ | 3.0 | setup, nomenclature, sales/CRM, production context, money identified | high-level inventory started | 0 | A high-level | Map SMB end-to-end sales → production → money workflows |
| ERP KZ | 2.4 | NSI, sales, purchases, warehouse/delivery, production, treasury, payroll identified | high-level inventory started | 0 | A high-level | Keep top-level until Tutor has proven demand for ERP track |
| Complex Automation KZ | 2.4 | NSI, planning/needs, wholesale context identified | high-level inventory started | 0 | A high-level | Keep high-level; deepen only for a selected learning track |
| Platform | 8.x managed app / Taxi concepts | sections, command interface, list/form/document/tabular section, command bars, validation, state semantics | reusable common UI model added | n/a | A generic platform | Link platform primitives into graph/retrieval proof tests |

## Accounting KZ 3.0 populated layer

The graph/inventory contains:
- common document operations;
- counterparties and contracts;
- customer invoice and customer payment;
- supplier payments and goods receipt;
- goods/services realization and returns;
- bank/cash workflows;
- warehouse movement, inventory and assembly;
- standard reports including OSV and account card;
- production material write-off and product output;
- payroll existence map;
- period-close existence map.

Human-readable inventory: `inventory/ACCOUNTING_KZ_3_0_CORE.md`.

## Stage 1B deep pack

Created implementation-support records:
- `workflows/ACCOUNTING_KZ_3_0_STAGE1B_CORE.md`;
- `interfaces/ACCOUNTING_KZ_3_0_STAGE1B_PASSPORTS.md`;
- `evidence/ACCOUNTING_KZ_3_0_STAGE1B_EVIDENCE.md`;
- `scenarios/STAGE1B_VERIFICATION_ASSERTIONS.md`;
- `sources/ACCOUNTING_KZ_3_0_STAGE1B.md`.

The official exact-edition evidence supports the semantic training dependency:

`Counterparty → Customer Invoice → Customer non-cash Payment → later Shipment/Realization → later reconciliation/reports`.

Important: the official documentation supports workflow names and order, but exact installed-build layout/visible controls remain an observation task. Therefore the three Interface Passports are deliberately `DRAFT / observation required` rather than fictionalized completed passports.

## Platform reusable layer

Created `platform/MANAGED_APP_COMMON_UI_MODEL.md` with source-backed reusable concepts:
- application sections and section commands;
- list screen;
- object/card form;
- document form;
- tabular section;
- command bars;
- draft vs saved vs posted/registered state;
- validation/message focus;
- related navigation/history;
- semantic control IDs and event model for coach/testing.

This lets Tutor reuse one interaction engine across Accounting, ZUP, Trade, UNF and ERP while configuration passports supply exact labels/visibility/layout.

## Current implementation-support query

`accounting-kz / 3.0 / counterparties / create-counterparty` → **IMPLEMENTATION_SUPPORT_READY / EXACT_UI_OBSERVATION_PENDING**.

Known with official exact-edition evidence:
- target configuration and edition;
- counterparty workflow existence and role in trading flows;
- counterparty/contract conceptual separation;
- customer invoice → customer payment → later shipment sequence;
- managed/Taxi platform interaction model;
- state assertions for the first Tutor lesson.

Still missing before `FIDELITY_VERIFIED`:
- exact current navigation path in a selected installed build;
- visible list/form command labels and placement;
- exact field labels/conditional fields;
- save/post controls for the selected build;
- observation metadata/screenshots where licensing permits.

Codex may now implement the Counterparty vertical slice using the semantic model and data-driven passport slots. It must not claim pixel fidelity or hardcode unresolved labels as immutable facts.

## Stage K1 progress

Completed:
- [x] canonical source registry substantially expanded;
- [x] Accounting KZ core areas inventoried;
- [x] Accounting KZ core workflow graph populated;
- [x] three Stage 1B workflows deepened;
- [x] Stage 1B evidence pack created;
- [x] state-based verification assertions defined;
- [x] draft Interface Passports created with explicit unknowns;
- [x] generic managed-application UI primitive model created;
- [x] ZUP KZ relevant edition resolved;
- [x] UNF KZ relevant edition resolved;
- [x] ERP KZ relevant edition resolved;
- [x] Complex Automation KZ relevant edition resolved;
- [x] Trade KZ edition evidence recorded;
- [x] provenance preserved to primary 1C sources.

Still required for full Stage K1 PASS:
- [ ] map platform primitives into graph nodes/edges;
- [ ] detailed ZUP HR/payroll workflow graph;
- [ ] detailed UNF SMB workflow graph;
- [ ] selected-edition Trade workflow graph;
- [ ] graph validation script/tests;
- [ ] five retrieval proof queries with deterministic expected subgraphs;
- [ ] observed Interface Passport for every implemented Tutor practical scenario.

## Immediate queue

1. Add five retrieval proof queries and expected evidence bundles.
2. Link reusable platform UI nodes to Stage 1B workflows.
3. Build detailed ZUP KZ 3.1 employment/payroll learning chain.
4. Build UNF KZ 3.0 SMB sales/production/money chain.
5. When a legally accessible Accounting KZ 3.0 build is available, capture the first observed Counterparty Interface Passport and upgrade `B UI` → `A observed UI`.