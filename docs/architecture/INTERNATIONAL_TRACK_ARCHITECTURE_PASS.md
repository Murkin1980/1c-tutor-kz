# INTERNATIONAL_TRACK_ARCHITECTURE_PASS

Date: 2026-08-15
MPE decision: `EXTEND_EXISTING`
Status: architecture fixed / implementation deferred

## 1. Decision

International accounting and IFRS are the next professional layers of the same educational system, not a separate product.

Canonical progression:

`1C Tutor → Accounting KZ → Professional Accountant → International Accounting → IFRS → International Practice`

No new repository, second Atlas, second runtime or parallel learning engine is introduced by this pass.

## 2. Reuse assessment

Existing components can be reused directly:
- Learning Shell;
- scenario schema;
- Demo / Guided Practice / Independent Test model;
- Guidance Engine;
- Verification Engine v2;
- state-based assertions;
- capability-oriented progress model;
- deterministic simulators;
- Atlas provenance/retrieval model;
- source/evidence lifecycle;
- Cloudflare-compatible frontend architecture.

International modules should become new scenario families over the same engine.

## 3. Architectural constraints found

The old Atlas was optimized for application/configuration knowledge. It could represent workflows, skills, evidence and scenarios, but lacked first-class semantics for:
- one topic spanning multiple accounting layers;
- jurisdiction;
- IFRS/IAS standards and paragraph locators;
- effective-date/version lifecycle;
- local vs IFRS treatment;
- financial-statement impact;
- journal entries;
- terminology;
- professional capability assessments.

This is solved with an additive, backward-compatible extension to `knowledge/1c/GRAPH_SCHEMA.md`.

No deep-change is required.

## 4. Unified knowledge model

Use one canonical Topic and connect it to multiple layers.

Example:

`topic:fixed-assets`

may connect to:
- `layer:1c-practice`;
- `layer:accounting-kz`;
- `layer:tax-kz`;
- `layer:ifrs`;
- `layer:international-practice`;
- `layer:accounting-english`;
- `layer:assessment`.

This avoids maintaining seven disconnected copies of “Fixed Assets”.

## 5. Learning bridge

International learning should follow:

`1C Practice → Accounting Logic → Economic Substance → IFRS Treatment → Financial Statements → International Practice → Capability Assessment`

Example: acquisition of equipment.

The learner first knows how to process an acquisition in the Training Workspace. The advanced layer then asks the learner to reason about:
- whether an asset exists;
- which costs belong in initial measurement;
- which costs are expensed;
- when depreciation starts;
- the journal-entry logic;
- statement-of-financial-position / profit-or-loss / cash-flow effects;
- the applicable IFRS source;
- how to maintain the supporting fixed asset register and reconcile it.

Theory is introduced at the point where the task needs it.

## 6. Normative IFRS architecture

IFRS knowledge is versioned normative knowledge.

Every authoritative treatment must link to:
- `Source`;
- `SourceVersion`;
- `Standard`;
- optional `StandardParagraphReference`;
- `EffectiveDate`;
- `lastVerifiedAt`;
- current/superseded status.

Current 2026 baseline research:
- IFRS Foundation Standards Navigator is the official standards collection;
- IFRS Accounting Standards—Required 2026 contains standards/amendments required at 1 January 2026;
- standards continue to change and amendments may have later effective dates.

Do not treat model-generated explanations as normative authority.

## 7. Licensing boundary

Do not bulk-ingest or reproduce IFRS Standard text.

The IFRS Foundation states that integration/use of IFRS Standards in products and services can require licensing. Store:
- standard IDs;
- structured references/locators;
- source/version metadata;
- bounded factual summaries where permitted;
- Tutor-authored explanations and cases;
- links to authoritative material.

A later content-commercialization phase must re-check licensing before embedding licensed material.

## 8. Professional capability progression

International progression should be capability-based, not quiz-point based.

Candidate verified capabilities:
- bank reconciliation;
- AP reconciliation;
- AR reconciliation;
- accrual preparation;
- prepaid expense schedule;
- fixed asset register / roll-forward;
- inventory reconciliation;
- month-end close checklist;
- trial balance review;
- discrepancy investigation;
- supporting schedule preparation;
- basic financial statement preparation;
- IFRS treatment explanation with source;
- processing English-language supporting documents.

A capability is “proven” only through an observable work product/state plus assessment assertions.

## 9. Curriculum hypothesis

The long-term levels remain planning hypotheses, not implementation commitments:

- Level 0 — Accounting English Basics
- Level 1 — International Accounting Foundations
- Level 2 — Financial Statements
- Level 3 — Core IFRS
- Level 4 — Operational International Accounting
- Level 5 — Month-End Close Simulator
- Level 6 — IFRS Case Simulator
- Level 7 — International Accountant Practice
- Level 8 — Job / Freelance Readiness

Detailed curriculum must later be derived from real capabilities and employment/work-sample research, not copied from any one exam provider.

## 10. External competency frameworks

ACCA FA/FR and DipIFR are useful benchmark sources for breadth, learning outcomes and assessment depth, but are not the Tutor curriculum source of truth.

Use them to answer:
- what accounting/financial-reporting capabilities are commonly assessed;
- prerequisite ordering;
- expected reasoning depth;
- terminology coverage.

Do not automatically reproduce their curriculum.

## 11. Runtime implications

No new runtime is required now.

Future international simulations can use the same architecture with new domain-state models, for example:
- reconciliation workspace;
- close workspace;
- working-paper workspace;
- financial-statement builder;
- case evidence pack;
- supporting schedule editor.

These are future surfaces behind MPE gates, not requirements for current Stage 1B.

## 12. Sequencing gate

International implementation must not displace the active core work.

Before substantive International Accountant Track implementation:
1. core Training Workspace is proven;
2. reusable learning engine is stable;
3. Accounting KZ reaches sustainable practical coverage;
4. capability assessment mechanics are reliable;
5. a new MPE gate confirms priority and scope.

Architecture and Atlas preparation are allowed now; full IFRS content creation is not.

## 13. Future research pass

After architecture fixation, perform a separate evidence pass on:
- international accountant vacancies;
- remote accounting/bookkeeping roles;
- outsourcing/shared-service job descriptions;
- IFRS accountant roles;
- ACCA/DipIFR competency maps;
- real bookkeeping workflows;
- month-end close workflows;
- common accounting software;
- practical accounting assessments/work samples.

Output should be a capability-demand matrix, not a list of courses.

## 14. Success criterion

Long-term success is demonstrated when a learner can receive a realistic international accounting work package and complete it correctly with verifiable work products—not merely pass an IFRS knowledge quiz.
