# COVERAGE — 1C Knowledge Atlas

Обновлено: 2026-08-15.

| Configuration | Edition | Areas inventoried | Workflows cataloged/deep | UI passports | Confidence | Status / next gap |
|---|---|---:|---:|---:|---|---|
| Accounting KZ | 3.0 | 11 core areas | 35+ cataloged; 3 Stage 1B priority | 0 | A existence / B UI | Core map populated. Deepen Counterparty → Invoice → Payment with Interface Passports |
| ZUP/HRM KZ | 3.1 (2nd ed.) | HR, time, payroll, taxes/contributions, reporting identified | high-level inventory started | 0 | A high-level | Build hiring/personnel/payroll workflow map; regulatory facts need current specialist validation |
| Trade KZ | 3.0 + 3.4 evidence | warehouse, retail; 3.4 sales example | high-level inventory started | 0 | A high-level | Choose target teaching edition before deep workflow map |
| UNF KZ | 3.0 | setup, nomenclature, sales/CRM, production context, money identified | high-level inventory started | 0 | A high-level | Map SMB end-to-end sales → production → money workflows |
| ERP KZ | 2.4 | NSI, sales, purchases, warehouse/delivery, production, treasury, payroll identified | high-level inventory started | 0 | A high-level | Keep top-level until Tutor has proven demand for ERP track |
| Complex Automation KZ | 2.4 | NSI, planning/needs, wholesale context identified | high-level inventory started | 0 | A high-level | Keep high-level; deepen only for a selected learning track |
| Platform | 8.x | generic managed application concepts pending | 0 | 0 | A source | Ingest reusable list/form/document/command/navigation primitives |

## What is now populated

### Accounting KZ 3.0

The graph now contains:
- common document operations;
- counterparties and settlements;
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

### Cross-configuration discovery

Primary-source editions now resolved for future tracks:
- ZUP KZ — edition 3.1, 2nd edition documentation;
- UNF KZ — edition 3.0 documentation;
- ERP KZ — edition 2.4 documentation;
- Complex Automation KZ — edition 2.4 documentation;
- Trade KZ — official evidence for editions 3.0 and 3.4.

This removes the previous `edition discovery required` blocker for ZUP, UNF, ERP and Complex Automation at the high-level inventory layer.

## Current implementation-support query

`accounting-kz / 3.0 / counterparties / create-counterparty` → **WORKFLOW_FOUND / UI_PASSPORT_REQUIRED**.

Known with official exact-edition evidence:
- Accounting KZ 3.0 is the target configuration/edition;
- the official manual includes a standard trading scenario with `Ввод данных о контрагенте`;
- counterparties are linked to contracts and settlement accounting;
- customer invoice/payment and supplier acquisition workflows depend on counterparties;
- the UI family is managed application / Taxi, and user workspace placement is configurable.

Missing before fidelity claim:
- exact current navigation path in the selected installed build;
- list/form command labels and placement as observed in that build;
- fields required for Tutor's narrow fictional customer scenario;
- save/close behavior;
- Interface Passport with screenshots/observations from a legally accessible selected build.

Therefore Codex may build the domain model, reusable shell and guidance engine, but must not invent pixel positions or claim exact fidelity before the passport exists.

## Stage K1 progress

Completed in this pass:
- [x] canonical source registry substantially expanded;
- [x] Accounting KZ core areas inventoried;
- [x] Accounting KZ core workflow graph populated;
- [x] ZUP KZ relevant edition resolved;
- [x] UNF KZ relevant edition resolved;
- [x] ERP KZ relevant edition resolved;
- [x] Complex Automation KZ relevant edition resolved;
- [x] Trade KZ edition evidence recorded;
- [x] provenance preserved to primary 1C sources.

Still required for full Stage K1 PASS:
- [ ] Platform common UI/object model;
- [ ] detailed ZUP HR/payroll workflow graph;
- [ ] detailed UNF SMB workflow graph;
- [ ] selected-edition Trade workflow graph;
- [ ] graph validation script/tests;
- [ ] five retrieval proof queries with deterministic expected subgraphs;
- [ ] Interface Passport for every implemented Tutor practical scenario.

## Immediate ingestion queue

1. Accounting KZ 3.0 Counterparty Interface Passport.
2. Accounting KZ 3.0 Customer Invoice Interface Passport.
3. Accounting KZ 3.0 Customer Payment / bank receipt Interface Passport.
4. Platform generic list/form/document navigation model.
5. ZUP KZ 3.1: employee/personnel → hiring → work schedule/time → payroll → payment/reporting high-level workflow graph.
