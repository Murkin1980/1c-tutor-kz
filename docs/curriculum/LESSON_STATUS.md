# Accounting KZ curriculum — canonical lesson status ledger

Updated: 2026-10-15

Branch: `agent/antigravity-sales-cycle-spec` (base: `mpe/stage-1-validation`)

Current lesson: `AKZ-M03-L02` (Session 06: Продажа по предоплате: счёт → оплата → реализация → контроль долга)

Current gate: `READY`
Next authorized implementation: **Session 06 / AKZ-M03-L02, AKZ-M03-L03, AKZ-M03-L04** per `STAGE_2_SALES_CYCLE_SPEC.md`

## Mandatory use

This file is the shared execution ledger for Murat, Codex and every external coder. Read it before work and update it in the same commit as any lesson checkpoint.

Allowed statuses:

- `PLANNED` — no implementation started;
- `RESEARCH_REQUIRED` — Atlas/evidence gap blocks implementation;
- `READY` — research/passport sufficient and owner authorized implementation;
- `IN_PROGRESS` — active work; resume details are mandatory;
- `BLOCKED` — exact blocker and unblock condition are mandatory;
- `ENGINEERING_REVIEW` — implementation exists, automated/manual checks incomplete;
- `OWNER_REVIEW` — engineering evidence complete, owner acceptance pending;
- `DONE` — owner accepted and all Definition of Done checks recorded;
- `DEFERRED` — intentionally outside the current portfolio priority.

Phases:

`ATLAS → PASSPORT → DOMAIN → UI → GUIDANCE → VERIFICATION → TESTS → OWNER`.

## Current checkpoint

`Session 06 (AKZ-M03-L02, AKZ-M03-L03, AKZ-M03-L04) — Продажа по предоплате: счёт → оплата → реализация → контроль долга`

- Status: `READY`.
- Implemented through: `PASSPORT / SPECIFICATION` (Specification approved in `STAGE_2_SALES_CYCLE_SPEC.md`).
- Owner decision on AKZ-M03-L01 (Customer card): passed, but deemed "слишком простым" for a standalone lesson. Owner authorized proceeding to full 120-minute commercial cycle.
- Next authorized implementation: Arena implements the unified 120-minute practical session in Training Workspace per `STAGE_2_SALES_CYCLE_SPEC.md`.
- Methodological mandate: Customer invoice cannot exist in isolation from payment and realization; the entire cycle is verified by environment state.
- Allowed Arena files: restricted to `src/features/training-workspace/...`, `e2e/sales-cycle-workspace.spec.ts`, `docs/curriculum/LESSON_STATUS.md`, `SESSION_NOTES.md`.
- Do not start unapproved lessons or expand scope outside the specification.

## Lesson register

| ID | Lesson | Status | Last completed phase | Exact next action |
|---|---|---|---|---|
| AKZ-M00-L01 | Training boundary and safety | PLANNED | — | Atlas retrieval |
| AKZ-M00-L02 | Sections, lists, forms, commands | PLANNED | — | Atlas retrieval |
| AKZ-M00-L03 | Search, filters, favorites, recent | PLANNED | — | Atlas retrieval |
| AKZ-M00-L04 | Document lifecycle | PLANNED | — | Atlas retrieval |
| AKZ-M01-L01 | Organization card | PLANNED | — | Atlas retrieval |
| AKZ-M01-L02 | Accounting policy | PLANNED | — | Atlas retrieval |
| AKZ-M01-L03 | Accounting parameters and currencies | PLANNED | — | Atlas retrieval |
| AKZ-M01-L04 | Departments, warehouses, accounts, cash desks | PLANNED | — | Atlas retrieval |
| AKZ-M01-L05 | Initial balances | PLANNED | — | Atlas retrieval |
| AKZ-M02-L01 | Accounts and analytics | PLANNED | — | Atlas retrieval |
| AKZ-M02-L02 | Documents, journals and registers | PLANNED | — | Atlas retrieval |
| AKZ-M02-L03 | Posting and movements | PLANNED | — | Atlas retrieval |
| AKZ-M02-L04 | First turnover balance sheet | PLANNED | — | Atlas retrieval |
| AKZ-M02-L05 | Account card and trace | PLANNED | — | Atlas retrieval |
| AKZ-M03-L01 | Customer card | DONE | OWNER | Accepted by owner; evaluated as too simple in isolation; authorized Session 06 |
| AKZ-M03-L02 | Customer invoice | READY | SPECIFICATION | Implement Training Workspace per STAGE_2_SALES_CYCLE_SPEC.md |
| AKZ-M03-L03 | Incoming customer payment/advance | READY | SPECIFICATION | Implement Training Workspace per STAGE_2_SALES_CYCLE_SPEC.md |
| AKZ-M03-L04 | Realization/shipment | READY | SPECIFICATION | Implement Training Workspace per STAGE_2_SALES_CYCLE_SPEC.md |
| AKZ-M03-L05 | Customer return | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M03-L06 | Customer contract and settlement settings | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M03-L07 | Reconciliation and customer debt | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M04-L01 | Supplier card and contract | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M04-L02 | Supplier payment basis/order | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M04-L03 | Non-cash supplier payment | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M04-L04 | Receipt of goods/materials | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M04-L05 | Receipt of services/additional costs | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M04-L06 | Return and supplier debt | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M05-L01 | Bank accounts and cash-flow items | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M05-L02 | Bank receipt/write-off | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M05-L03 | Bank statement control | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M05-L04 | Cash documents and cash book | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M05-L05 | Accountable person and expense report | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M05-L06 | Foreign currency basics | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M06-L01 | Nomenclature and accounting settings | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M06-L02 | Warehouse balances | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M06-L03 | Warehouse transfer | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M06-L04 | Inventory count | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M06-L05 | Surplus, shortage and write-off | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M06-L06 | Assembly/complectation | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M07-L01 | Turnover balance sheet | PLANNED | Atlas inventory | Report Passport |
| AKZ-M07-L02 | Account analysis and card | PLANNED | Atlas inventory | Report Passport |
| AKZ-M07-L03 | Subconto analysis | PLANNED | Atlas inventory | Report Passport |
| AKZ-M07-L04 | General ledger and postings | PLANNED | Atlas inventory | Report Passport |
| AKZ-M07-L05 | Discrepancy investigation | PLANNED | — | Define prerequisite case |
| AKZ-M08-L01 | Fixed-asset receipt | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M08-L02 | Acceptance for accounting | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M08-L03 | Depreciation | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M08-L04 | Movement, modernization, inventory | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M08-L05 | Disposal and reports | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M09-L01 | Employee and hiring | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M09-L02 | Payroll setup/accruals | PLANNED | Atlas inventory | Regulatory evidence |
| AKZ-M09-L03 | Time, leave and sick leave | PLANNED | Atlas inventory | Regulatory evidence |
| AKZ-M09-L04 | Payroll calculation/review | PLANNED | Atlas inventory | Regulatory evidence |
| AKZ-M09-L05 | Payroll taxes/contributions | RESEARCH_REQUIRED | Atlas catalog | Current-law validation |
| AKZ-M09-L06 | Salary payment/debt | RESEARCH_REQUIRED | Atlas catalog | Current-law validation |
| AKZ-M10-L01 | Production setup/specifications | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M10-L02 | Materials to production | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M10-L03 | Finished-goods output | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M10-L04 | Semi-finished/WIP/waste | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M10-L05 | Indirect expenses | PLANNED | Atlas inventory | Methodology validation |
| AKZ-M10-L06 | Actual cost and reports | PLANNED | Atlas inventory | Methodology validation |
| AKZ-M11-L01 | Pre-close checklist | PLANNED | Atlas inventory | Workflow deepening |
| AKZ-M11-L02 | Depreciation/RBP/FX | PLANNED | Atlas inventory | Methodology validation |
| AKZ-M11-L03 | Cost and indirect allocation | PLANNED | Atlas inventory | Methodology validation |
| AKZ-M11-L04 | Financial result/period close | PLANNED | Atlas inventory | Methodology validation |
| AKZ-M11-L05 | Post-close control | PLANNED | Atlas inventory | Define control case |
| AKZ-M12-L01 | VAT settings/boundaries | RESEARCH_REQUIRED | Atlas catalog | Current-law validation |
| AKZ-M12-L02 | Input VAT | RESEARCH_REQUIRED | Atlas catalog | Current-law validation |
| AKZ-M12-L03 | Output VAT | RESEARCH_REQUIRED | Atlas catalog | Current-law validation |
| AKZ-M12-L04 | VAT reconciliation/declaration | RESEARCH_REQUIRED | Atlas catalog | Current-law validation |
| AKZ-M12-L05 | Corporate income tax/registers | RESEARCH_REQUIRED | Atlas catalog | Current-law validation |
| AKZ-M13-L01 | Reporting list/status | RESEARCH_REQUIRED | Atlas catalog | Current forms/version evidence |
| AKZ-M13-L02 | Pre-fill controls | RESEARCH_REQUIRED | Atlas catalog | Current forms/version evidence |
| AKZ-M13-L03 | Preparation/export, no submission | RESEARCH_REQUIRED | Atlas catalog | Safe non-submission design |
| AKZ-M14-L01 | Users and roles | PLANNED | Atlas inventory | Admin workflow boundary |
| AKZ-M14-L02 | Report variants/personalization | PLANNED | Atlas inventory | Report Passport |
| AKZ-M14-L03 | Backup/update/support concepts | PLANNED | Atlas inventory | Safe operations scope |

## Active resume record — AKZ-M03-L02

```text
Lesson ID: AKZ-M03-L02 (with AKZ-M03-L03, AKZ-M03-L04 in Session 06)
Owner/agent: Murat / Antigravity / Arena
Branch: agent/antigravity-sales-cycle-spec
Starting implementation commit: pending Arena implementation
Last verified implementation commit: 1181723 (AKZ-M03-L01 foundation)
Status: READY
Current phase: DOMAIN
Completed: Owner review of AKZ-M03-L01 recorded; Stage 2 120-minute specification authored (STAGE_2_SALES_CYCLE_SPEC.md); 18 deterministic assertions defined; 3 diagnostic errors modeled; Atlas evidence mapped.
Primary files: STAGE_2_SALES_CYCLE_SPEC.md; docs/curriculum/LESSON_STATUS.md
Checks passed: curriculum check PASS, lint PASS, typecheck PASS, unit PASS, secrets PASS
Known defects: none
Blocker/unblock condition: unblocked by owner decision; specification ready; awaiting Arena coding implementation
Exact next action: Arena implements salesCycleScenario.ts, salesCycleVerification.ts, salesCycleGuidance.ts, and SalesCycleTrainingWorkspace.tsx per STAGE_2_SALES_CYCLE_SPEC.md
Last updated: 2026-10-15
```

## Completed record — AKZ-M03-L01

```text
Lesson ID: AKZ-M03-L01
Owner/agent: Murat / Codex
Branch: mpe/stage-1-validation
Starting implementation commit: 0b12de5
Last verified implementation commit: 1181723
Status: DONE
Current phase: OWNER
Completed: Atlas skeleton, domain, UI, Demo/Guided/Test, Driver.js beacon, state verification, unit/E2E, desktop/mobile smoke
Result: Owner reviewed and accepted as foundation, but evaluated as too simple in isolation. Authorized composite Session 06.
Last updated: 2026-10-15
```

## Resume record template

When a lesson becomes active, append this block below the register and keep it current:

```text
Lesson ID:
Owner/agent:
Branch:
Starting commit:
Status:
Current phase:
Completed:
Files changed:
Checks passed:
Known defects:
Blocker/unblock condition:
Exact next action:
Last updated:
```

## Change log

- 2026-10-15 — Owner reviewed `AKZ-M03-L01` (Customer Card) and noted it is too simple as a standalone lesson; owner authorized 120-minute practical session covering «Продажа по предоплате: счёт → оплата → реализация → контроль долга». Specification `STAGE_2_SALES_CYCLE_SPEC.md` authored. Marked `AKZ-M03-L01` as `DONE`, `AKZ-M03-L02`–`L04` as `READY`.
- 2026-08-25 — MiniBase progress integration authorized separately; curriculum execution gate remains `OWNER_REVIEW`.
- 2026-08-24 — owner accepted the substantial-session curriculum plan; MiniBase recorded as the required future server-persistence platform; practical workspace gate remains `OWNER_REVIEW`.
- 2026-08-24 — 77 atomic skill units grouped one-to-one into one orientation plus 28 substantial learner sessions; legacy micro-quizzes removed from the active learner route. Current owner gate remains unchanged.
- 2026-08-20 — canonical 15-section / 77-lesson register created from open official Accounting KZ 3.0 documentation and existing Atlas inventory.
