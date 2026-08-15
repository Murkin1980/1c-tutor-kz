# COVERAGE — 1C Knowledge Atlas

Обновлено: 2026-08-15.

| Configuration | Edition | Areas inventoried | Workflows deep | UI passports | Confidence | Status / next gap |
|---|---|---:|---:|---:|---|---|
| Accounting KZ | 3.0 | Main, Sales, Purchase, Bank/Cash, Inventory, Reports | 1 partial | 0 | A/B | Deepen counterparty workflow first; then invoice/payment |
| HRM/ZUP KZ | edition discovery required | 0 | 0 | 0 | A inventory | Stage K1: resolve current/relevant edition and high-level workflow map |
| Trade KZ | multiple historical editions visible | 0 | 0 | 0 | A inventory | Stage K1: choose relevant edition before workflow map |
| UNF KZ | edition discovery required | 0 | 0 | 0 | A inventory | Stage K1 high-level inventory |
| ERP KZ | edition discovery required | 0 | 0 | 0 | A inventory | Stage K1 high-level inventory only |
| Complex Automation KZ | edition discovery required | 0 | 0 | 0 | A inventory | Stage K1 high-level inventory only |
| Platform | 8.x | generic object model pending | 0 | 0 | A source | Ingest reusable managed-app/list/form/command concepts |

## Current implementation-support query

`accounting-kz / 3.0 / counterparties / create-counterparty` → **RESEARCH_REQUIRED**.

Known:
- Accounting KZ 3.0 is an official managed-application/Taxi-based configuration.
- official Kazakhstan documentation is indexed and available as the primary source family.
- counterparty workflow is the first Tutor vertical slice.

Missing before fidelity claim:
- exact current navigation path in selected Accounting KZ 3.0 version;
- list/form command labels and placement;
- required fields for the narrow fictional scenario;
- Interface Passport with observed date/version.

Therefore Stage 1B may build reusable shell/domain/guidance architecture, but final interaction fidelity for the counterparty screen requires bounded ingestion/manual observation first.

## Stage K1 target

Before Stage 2 broad curriculum expansion:
- Accounting KZ core workflow inventory complete;
- platform common model present;
- HRM/Trade/UNF/ERP top-level inventories present;
- five retrieval proof queries completed;
- graph validation added;
- every implemented scenario linked to Atlas workflow + Interface Passport.
