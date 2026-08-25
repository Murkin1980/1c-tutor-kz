# STAGE K1 INSTRUCTION — 1C Knowledge Atlas Bootstrap

## MPE decision

`EXTEND_EXISTING`

This stage is a required gate before broad curriculum expansion beyond the first proven Training Workspace vertical slices.

## Purpose

Build a reusable, versioned knowledge base so future 1C Tutor work retrieves structured evidence from the repository instead of repeatedly searching the internet.

## When to run

- Bootstrap structure starts now and is used by Stage 1B.
- Full Stage K1 must PASS before Stage 2 expands into many accounting processes or new configurations such as ZUP/Trade/UNF/ERP.

## Mandatory reading

- `FOUNDATION.md`
- `ROADMAP.md`
- `CODER_INSTRUCTION.md`
- `knowledge/1c/README.md`
- `knowledge/1c/SOURCE_REGISTER.md`
- `knowledge/1c/TAXONOMY.md`
- `knowledge/1c/GRAPH_SCHEMA.md`
- `knowledge/1c/INGESTION_RULES.md`
- `knowledge/1c/RETRIEVAL_RULES.md`

## Work package A — Platform common model

Ingest and model reusable 1C:Enterprise user concepts:
- Taxi/managed-application navigation concepts relevant to training;
- sections/panels;
- catalogs;
- documents;
- lists/forms;
- command bars;
- reports/processings;
- save/post/close concepts where documented;
- generic search/history/favorites only if they matter to course navigation.

Create `platform` nodes so configuration records can reuse common mechanics instead of duplicating them.

## Work package B — Kazakhstan configuration inventory

Create top-level Configuration/Edition nodes and source coverage for at least:
1. Accounting KZ;
2. HRM/ZUP KZ;
3. Trade KZ;
4. UNF KZ;
5. ERP KZ;
6. Complex Automation KZ if source coverage is available.

For each record:
- canonical name;
- configuration id;
- known current/relevant edition(s);
- official source ids;
- broad business areas;
- confidence/freshness;
- status `inventory_only` until deeper ingestion.

Do not implement simulator screens merely because a configuration is inventoried.

## Work package C — Accounting KZ 3.0 workflow map

Build a workflow inventory for core learning areas:
- orientation/main;
- counterparties;
- nomenclature/inventory;
- sales;
- purchases;
- bank/cash;
- reconciliation;
- reports;
- period close;
- payroll touchpoints where Accounting KZ exposes them.

For each workflow create at least:
- Workflow node;
- prerequisite relations;
- primary objects;
- source evidence;
- learning level candidate;
- status: `inventory | partial | implementation_ready`.

Deep UI records/passports are required only for workflows scheduled for implementation.

## Work package D — HRM / Trade / UNF expansion map

Create workflow-level inventory, not detailed clones.

### HRM/ZUP KZ examples
- employee/person master data;
- hiring;
- transfer;
- leave;
- dismissal;
- payroll calculation;
- payroll payment;
- кадровая/зарплатная отчетность.

### Trade KZ examples
- customers/suppliers;
- nomenclature;
- prices;
- purchase;
- sales order/sale;
- warehouse movement;
- inventory;
- payments/settlements.

### UNF/ERP
Map business areas and high-value workflows only. Detailed ingestion happens when roadmap reaches them.

Regulatory/calculation details remain `research_only` until exact-version primary evidence + specialist validation.

## Work package E — Templates and validation

Create and use:
- Interface Passport template;
- Workflow Record template;
- Evidence Record template;
- schema/check script or Zod schemas for graph nodes/edges when coding begins;
- duplicate-id validation;
- broken-edge validation;
- missing-source validation;
- confidence/freshness validation.

## Work package F — Retrieval proof

Demonstrate Atlas retrieval for at least five queries:
1. create counterparty in Accounting KZ;
2. create customer invoice/sales document candidate in Accounting KZ;
3. receive/register customer payment in Accounting KZ;
4. employee hiring workflow in HRM KZ;
5. warehouse/sales workflow in Trade KZ.

Each query report must identify:
- nodes returned;
- evidence/source ids;
- confidence;
- gaps;
- READY vs RESEARCH_REQUIRED.

## Coverage artifact

Create `knowledge/1c/COVERAGE.md` with a matrix:

```text
Configuration | Edition | Areas inventoried | Workflows | UI passports | Confidence | Freshness | Next gaps
```

This is the human-readable entry point for project planning.

## Copyright and access gate

Never mirror whole ITS manuals, books, screenshots, courses, or paywalled content.

Store factual summaries + provenance. If a source requires licensed access, record metadata/access class; do not bypass access controls.

## Definition of Done

Stage K1 PASS requires:
- source registry covers all initial KZ configuration families;
- platform common model exists;
- Accounting KZ workflow map covers all listed core areas;
- HRM/Trade/UNF/ERP high-level inventories exist;
- graph nodes/edges validate;
- every factual node has provenance or explicit `research_only` status;
- coverage matrix exists;
- five retrieval proof queries documented;
- no bulk copyrighted corpus committed;
- current implemented Tutor scenarios point to Atlas workflow/passport IDs.

## Stop condition

Do not turn Stage K1 into an attempt to recreate all 1C documentation. Stop when the Atlas can reliably support roadmap planning and on-demand deepening.

After K1, new learning modules follow: `retrieve → identify gaps → ingest bounded evidence → implement vertical slice`.