# MPE — International Accountant Track

Date: 2026-08-15
Decision: `EXTEND_EXISTING`
Status: architecture approved / implementation deferred

## Owner direction

International Accounting / IFRS is the next professional layer after strong 1C and local accounting capability.

It is not a separate product by default.

Target progression:

`1C Tutor → Accounting KZ → Professional Accountant → International Accounting → IFRS → International Practice`

## MPE assessment

### Existing-system fit
PASS.

The current Learning Shell, Training Workspace pattern, Guidance Engine, Verification Engine v2, scenario model, capability progression and Atlas can support the international direction.

### Duplication risk
High if a separate IFRS product/Atlas/runtime is created.

Therefore no new repository, second knowledge base or parallel infrastructure is approved.

### Data-model fit
PASS with minimal extension.

The existing graph supports workflow/skill/scenario/evidence semantics. It was extended additively for cross-layer topics, jurisdictions, standards, treatments, financial-statement impact, capabilities and source lifecycle.

### Deep-change test
NO DEEP CHANGE REQUIRED for architecture/data-model preparation.

Substantive future runtime changes such as a new working-paper engine, external software integrations or a marketplace require a fresh MPE gate.

## Approved now

- unified Atlas schema extension;
- IFRS source/provenance rules;
- curriculum skeleton;
- local→IFRS topic bridges;
- professional capability map;
- labor-market / work-sample research;
- roadmap placement after sustainable core Tutor maturity.

## Not approved now

- separate IFRS Tutor product;
- new repo;
- second Atlas;
- bulk IFRS content ingestion;
- full IFRS lesson implementation;
- marketplace/freelance platform;
- new international runtime;
- displacement of active Stage 1B implementation.

## Evidence signal

Initial current-role research supports a capability-first model: month-end close, reconciliations, journal entries, accruals/prepayments, AP/AR, GL/TB, fixed assets, supporting schedules, audit support, Excel, cloud accounting systems and English remote work recur across roles.

A current CIS role explicitly combines Kazakhstan 1C, NetSuite reconciliation, IFRS and bilingual accounting work, strengthening the bridge hypothesis.

## Next gate

Continue core `Stage 1B.1` implementation.

International work remains architecture/research until:
- core learning engine is stable;
- Accounting KZ practical coverage is sustainable;
- capability verification is proven;
- MPE re-ranks International Track high enough for implementation.
