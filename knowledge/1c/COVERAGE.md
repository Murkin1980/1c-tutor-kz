# COVERAGE — Unified Accounting Knowledge Atlas

Обновлено: 2026-08-15.

| Domain / Configuration | Version | Coverage | Deep workflows / topic bridges | Passports / provenance | Confidence | Next gap |
|---|---|---|---:|---:|---|---|
| Accounting KZ | 3.0 | 11 core areas | 35+ cataloged; 3 Stage 1B deep records | 3 draft UI passports | A workflow / B build-specific UI | observed Counterparty passport |
| ZUP/HRM KZ | 3.1 (2nd ed.) | HR, time, payroll, taxes/contributions, reporting | high-level inventory + learning chain | 0 | A high-level | deepen selected workflows when prioritized |
| Trade KZ | 3.0 + 3.4 evidence | warehouse, retail, sales examples | high-level inventory | 0 | A high-level | choose teaching edition before deep map |
| UNF KZ | 3.0 | setup, nomenclature, sales/CRM, production, money | high-level inventory | 0 | A high-level | map SMB end-to-end workflows later |
| ERP KZ | 2.4 | NSI, sales, purchases, warehouse, production, treasury, payroll | high-level inventory | 0 | A high-level | keep high-level until justified |
| Complex Automation KZ | 2.4 | NSI/planning/wholesale context | high-level inventory | 0 | A high-level | keep high-level until justified |
| 1C Platform | 8.x managed app / Taxi | sections, command interface, list/form/document primitives | reusable common UI model | n/a | A/B | map common primitives deeper into graph/tests |
| International Accounting | architecture v0 | curriculum skeleton + capability backbone | 30+ candidate capabilities; P0 matrix defined | market evidence pack | A source sample / not statistical | expand geography and junior/intermediate sample |
| IFRS | Required 2026 baseline | source registry + unified normative schema | 7 initial topic bridges | source/version/effective-date model | A source / treatment not yet ingested | ingest exact treatments only when a learning stage is authorized |

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

Implementation-support records:
- `workflows/ACCOUNTING_KZ_3_0_STAGE1B_CORE.md`;
- `interfaces/ACCOUNTING_KZ_3_0_STAGE1B_PASSPORTS.md`;
- `evidence/ACCOUNTING_KZ_3_0_STAGE1B_EVIDENCE.md`;
- `scenarios/STAGE1B_VERIFICATION_ASSERTIONS.md`;
- `sources/ACCOUNTING_KZ_3_0_STAGE1B.md`.

Semantic dependency:

`Counterparty → Customer Invoice → Customer non-cash Payment → later Shipment/Realization → later reconciliation/reports`.

Exact installed-build layout remains an observation task.

## Platform reusable layer

`platform/MANAGED_APP_COMMON_UI_MODEL.md` describes source-backed reusable concepts:
- application sections and commands;
- list screen;
- object/card form;
- document form;
- tabular section;
- command bars;
- draft/saved/posted/registered state;
- validation/message focus;
- related navigation/history;
- semantic control IDs.

## International Accountant Track coverage

Architecture and planning records:
- `docs/architecture/INTERNATIONAL_TRACK_ARCHITECTURE_PASS.md`;
- `knowledge/1c/international/SOURCE_REGISTER.md`;
- `knowledge/1c/international/CURRICULUM_SKELETON.md`;
- `knowledge/1c/international/TOPIC_BRIDGES.md`;
- `docs/research/INTERNATIONAL_CAPABILITY_RESEARCH_PASS_2026-08-15.md`.

Unified graph schema now supports:
- Topic / KnowledgeLayer / Jurisdiction;
- Standard / StandardParagraphReference;
- AccountingConcept / BusinessProcess / TransactionType;
- 1COperation / AccountingTreatment;
- AccountingEntry / FinancialStatementImpact;
- Terminology / Case / Exercise / Assessment;
- Capability / LearningOutcome / Prerequisite / DifficultyLevel;
- SourceVersion / EffectiveDate.

This is additive and backward-compatible with all current 1C graph records.

## Initial IFRS topic bridges

- Fixed Assets ↔ IAS 16;
- Inventory ↔ IAS 2;
- Revenue ↔ IFRS 15;
- Leases ↔ IFRS 16;
- Cash / Cash Flows ↔ IAS 7;
- Impairment ↔ IAS 36;
- Financial Instruments ↔ IFRS 9.

No full Standard text or full treatment corpus is ingested. Normative treatment nodes will be created only for authorized learning stages, with exact source/version/effective-date provenance.

## International capability demand — initial market pass

P0 signals from sampled current roles:
- bank reconciliation;
- month-end close;
- journal entries;
- GL/trial balance;
- accruals;
- prepayments;
- AP/AR;
- fixed assets;
- discrepancy/root-cause investigation;
- supporting schedules/working papers;
- Excel;
- English remote communication;
- cloud accounting/ERP literacy.

P1/P2 signals:
- financial statements;
- audit preparation;
- intercompany reconciliation;
- consolidation fundamentals;
- IFRS treatment;
- revenue recognition specialization;
- process automation.

This is an initial evidence sample, not a statistically representative labor-market dataset.

## Current implementation-support query

`accounting-kz / 3.0 / counterparties / create-counterparty` → **IMPLEMENTATION_SUPPORT_READY / EXACT_UI_OBSERVATION_PENDING**.

Known:
- target configuration/edition;
- workflow and dependencies;
- semantic interaction model;
- state assertions;
- reusable platform primitives.

Missing before `FIDELITY_VERIFIED`:
- exact current navigation path in a selected installed build;
- visible command labels/placement;
- exact field labels/conditional fields;
- save/post controls;
- observation metadata/screenshots where licensing permits.

## Stage K1 progress

Completed:
- [x] canonical source registry substantially expanded;
- [x] Accounting KZ core areas inventoried;
- [x] Accounting KZ core workflow graph populated;
- [x] three Stage 1B workflows deepened;
- [x] Stage 1B evidence/assertion pack;
- [x] draft Interface Passports with explicit unknowns;
- [x] generic managed-application UI primitive model;
- [x] ZUP/UNF/ERP/CA/Trade edition discovery/inventory;
- [x] provenance to primary 1C sources;
- [x] international/IFRS graph schema extension;
- [x] IFRS 2026 source registry baseline;
- [x] international curriculum skeleton;
- [x] local→IFRS topic bridges;
- [x] international capability research pass v0.

Still required for full K1 PASS:
- [ ] graph validation script/tests;
- [ ] selected deeper Trade/UNF maps where required;
- [ ] deterministic retrieval proof tests in code;
- [ ] observed Interface Passport for every implemented Tutor practical scenario.

## Immediate queue

1. Capture observed Counterparty Interface Passport when a legally accessible Accounting KZ 3.0 build is available.
2. Build Counterparty Training Workspace vertical slice.
3. Owner UX/fidelity PASS.
4. Invoice vertical slice.
5. Payment vertical slice.
6. Continue International Capability Research as a separate evidence stream without displacing core implementation.

International Track remains architecture/research-only until the roadmap gate allows substantive implementation.