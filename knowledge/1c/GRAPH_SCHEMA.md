# GRAPH SCHEMA — Unified Accounting Knowledge Atlas

## Purpose

The Atlas is the canonical knowledge graph for the entire educational system. It connects 1C/configuration knowledge, local accounting, international accounting, IFRS concepts, professional capabilities, evidence and learning scenarios.

It is **one Atlas**, not separate 1C and IFRS knowledge bases.

The core retrieval principle remains:

`Topic → relevant KnowledgeLayers → evidence-backed concepts/workflows/treatments → learning scenario → verification/capability evidence`.

## Backward compatibility

All existing 1C node IDs and edge types remain valid. International-accounting support is additive. Existing code or documents that query `Configuration`, `Workflow`, `Screen`, `Command`, `Field`, `LearningScenario`, `VerificationAssertion`, `Source`, `Evidence` or `InterfacePassport` do not need migration.

## Node types

### Product / platform
- `Platform`
- `Configuration`
- `Edition`
- `Version`

### Cross-domain semantic spine
- `Topic` — canonical business/accounting subject such as Fixed Assets, Inventory, Revenue, Leases, Bank Reconciliation.
- `KnowledgeLayer` — `1c-practice`, `accounting-kz`, `tax-kz`, `accounting-concepts`, `ifrs`, `international-practice`, `accounting-english`, `assessment`.
- `Jurisdiction` — Kazakhstan, IFRS/global, or another future jurisdiction.
- `AccountingConcept` — recognition, measurement, accrual, matching, materiality, control, etc.
- `BusinessProcess` — procure-to-pay, order-to-cash, record-to-report, payroll-to-pay, inventory-to-cost, close-to-report.
- `TransactionType` — purchase, sale, receipt, payment, accrual, prepayment, depreciation, lease, impairment, etc.

### Standards / normative knowledge
- `Standard` — IFRS/IAS or other authoritative standard.
- `StandardParagraphReference` — a structured locator/reference, not a copied paragraph body.
- `AccountingTreatment` — normalized treatment with `layer` and/or `jurisdiction`; use this for both local and IFRS treatment instead of duplicating schemas.
- `AccountingEntry` — debit/credit or equivalent journal-entry representation where pedagogically appropriate.
- `FinancialStatementImpact` — effects on statement of financial position, profit or loss, OCI, cash flows, disclosures or notes.

### 1C / application functional structure
- `BusinessArea`
- `Workspace`
- `Object`
- `Screen`
- `Command`
- `Field`
- `State`
- `ValidationRule`
- `1COperation` — optional semantic bridge for a specific user operation; existing `Workflow` remains the implementation workflow node.

### Process and learning
- `Workflow`
- `WorkflowStep`
- `LearningScenario`
- `GuidanceStep`
- `VerificationAssertion`
- `Skill`
- `Capability`
- `LearningOutcome`
- `Prerequisite`
- `DifficultyLevel`
- `Terminology`
- `Example`
- `Case`
- `Exercise`
- `Assessment`

### Evidence / lifecycle
- `Source`
- `SourceVersion`
- `Evidence`
- `InterfacePassport`
- `EffectiveDate`

## Core edge types

### Existing 1C edges — retained
- `CONFIGURATION_RUNS_ON -> Platform`
- `CONFIGURATION_HAS_EDITION -> Edition`
- `EDITION_HAS_VERSION -> Version`
- `VERSION_HAS_AREA -> BusinessArea`
- `AREA_CONTAINS -> Workspace|Object`
- `OBJECT_HAS_SCREEN -> Screen`
- `SCREEN_HAS_COMMAND -> Command`
- `SCREEN_HAS_FIELD -> Field`
- `COMMAND_TRANSITIONS_TO -> State|Screen`
- `FIELD_REQUIRED_FOR -> Workflow|ValidationRule`
- `WORKFLOW_USES -> Object|Screen|Command|Field|1COperation`
- `WORKFLOW_HAS_STEP -> WorkflowStep`
- `WORKFLOW_REQUIRES -> Workflow|Skill|Prerequisite`
- `LEARNING_SCENARIO_TRAINS -> Workflow|Skill|Capability|Topic`
- `SCENARIO_HAS_GUIDANCE -> GuidanceStep`
- `SCENARIO_VERIFIED_BY -> VerificationAssertion|Assessment`
- `ASSERTION_READS -> Object|State|Field`
- `PASSPORT_DESCRIBES -> Screen|Workflow`
- `EVIDENCE_SUPPORTS -> any knowledge node`
- `EVIDENCE_DERIVED_FROM -> Source|SourceVersion`
- `SUPERSEDES -> Version|Evidence|InterfacePassport|AccountingTreatment`
- `ANALOGOUS_TO -> Object|Workflow|Topic`

### Cross-layer / international edges
- `TOPIC_HAS_LAYER -> KnowledgeLayer`
- `TOPIC_RELATES_TO -> AccountingConcept|BusinessProcess|TransactionType|Workflow|1COperation|Standard|Capability`
- `PROCESS_HAS_TRANSACTION -> TransactionType`
- `TRANSACTION_IMPLEMENTED_BY -> Workflow|1COperation`
- `TRANSACTION_HAS_TREATMENT -> AccountingTreatment`
- `TREATMENT_APPLIES_IN -> KnowledgeLayer|Jurisdiction`
- `TREATMENT_SUPPORTED_BY -> Standard|StandardParagraphReference|Evidence`
- `STANDARD_HAS_REFERENCE -> StandardParagraphReference`
- `STANDARD_EFFECTIVE_FROM -> EffectiveDate`
- `TREATMENT_HAS_ENTRY -> AccountingEntry`
- `TREATMENT_IMPACTS -> FinancialStatementImpact`
- `TOPIC_HAS_TERMINOLOGY -> Terminology`
- `TERMINOLOGY_EQUIVALENT_TO -> Terminology`
- `CASE_COVERS -> Topic|TransactionType|AccountingConcept|Standard|BusinessProcess`
- `EXERCISE_TRAINS -> Skill|Capability|LearningOutcome|Topic`
- `ASSESSMENT_VERIFIES -> Skill|Capability|LearningOutcome`
- `CAPABILITY_REQUIRES -> Skill|Prerequisite|LearningOutcome`
- `LEARNING_OUTCOME_REQUIRES -> Prerequisite`
- `NODE_HAS_DIFFICULTY -> DifficultyLevel`
- `SOURCE_HAS_VERSION -> SourceVersion`
- `SOURCE_VERSION_EFFECTIVE_FROM -> EffectiveDate`

## Stable identifiers

Existing identifiers remain valid:

```text
configuration:accounting-kz
edition:accounting-kz:3.0
workflow:accounting-kz:3.0:create-counterparty
scenario:tutor:create-training-counterparty:v1
source:KZ-ACC30-DOC
```

International examples:

```text
topic:fixed-assets
layer:1c-practice
layer:accounting-kz
layer:ifrs
layer:international-practice
jurisdiction:kz
jurisdiction:ifrs-global
standard:ias-16
standard-ref:ias-16:recognition-cost:v2026
concept:asset-recognition
transaction:fixed-asset-acquisition
treatment:fixed-asset-acquisition:ifrs:v2026
impact:fixed-asset-acquisition:financial-statements
capability:maintain-fixed-asset-register
assessment:international:fixed-assets:case-001
```

Do not put transient database UUIDs into source knowledge IDs.

## Normative metadata contract

Any node that teaches a normative IFRS/local-accounting rule must support:

```json
{
  "sourceIds": ["source:IFRS-STANDARDS-NAVIGATOR"],
  "sourceVersionId": "source-version:ifrs-required-2026",
  "standardId": "standard:ias-16",
  "paragraphReferenceIds": ["standard-ref:ias-16:..."],
  "effectiveDate": "2026-01-01",
  "lastVerifiedAt": "2026-08-15",
  "status": "current",
  "interpretationStatus": "source-backed"
}
```

`paragraphReferenceIds` are locators/references. Do not bulk-copy copyrighted IFRS text into Atlas.

AI-generated explanations may be stored separately as pedagogical content but **must never be the normative source**.

## Topic bridge model

One topic can connect all learning layers without duplicate topic records.

Example:

```text
Topic: Fixed Assets
├─ 1C Practice → acquisition / commissioning / depreciation workflow
├─ Accounting KZ → local accounting treatment
├─ Tax KZ → tax layer when later authorized and sourced
├─ IFRS → IAS 16 treatment
├─ International Practice → fixed asset register / roll-forward / reconciliation
├─ Accounting English → PPE, useful life, residual value, depreciation
├─ Case → acquisition + directly attributable costs
└─ Assessment → prepare schedule and explain statement impact
```

## Retrieval shape

### Application workflow query
A query such as `create customer invoice in Accounting KZ` returns:
1. Configuration + edition/version;
2. BusinessArea;
3. Workflow;
4. objects/screens/commands/fields;
5. Interface Passport;
6. evidence + source metadata;
7. existing LearningScenario;
8. prerequisites and analogous primitives.

### Cross-layer topic query
A query such as `fixed assets from 1C to IFRS` returns:
1. canonical `Topic`;
2. relevant `KnowledgeLayer` nodes;
3. 1C workflows/operations already mastered;
4. local treatment if sourced;
5. IFRS Standard + structured paragraph references + effective/source version;
6. accounting concepts and journal-entry models;
7. financial-statement impact;
8. English terminology;
9. international-practice capability;
10. case/exercise/assessment nodes and prerequisites.

## Confidence rule

A simulator implementation may use:
- `A`: directly;
- `B`: with explicit version caveat and manual/source check;
- `C`: hypothesis/prototype only;
- `D`: research queue only.

Tax, payroll calculation, regulatory forms, IFRS treatment, posting logic and mandatory-field rules require `A` evidence or explicit specialist validation before being taught as authoritative.

## IFRS licensing/provenance rule

The IFRS Foundation is the normative source for IFRS Accounting Standards. Atlas should store identifiers, provenance, version/effective-date metadata, bounded factual summaries and original Tutor explanations. It must not become an unlicensed mirror of IFRS Standards.

## Storage strategy

Canonical knowledge remains Git-native Markdown + JSONL during the current stages. Do not add a vector database merely for the International Accountant Track.

If Atlas grows enough that retrieval becomes slow, a generated search/RAG index may be added later. Embeddings/indexes remain disposable derivatives; the canonical graph and evidence records remain source of truth.