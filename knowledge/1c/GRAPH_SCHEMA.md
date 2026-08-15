# GRAPH SCHEMA — 1C Knowledge Atlas

## Purpose

The Atlas graph connects configuration/version knowledge to workflows and learning scenarios so a coder can retrieve the smallest trustworthy evidence set for a feature.

## Node types

### Product / platform
- `Platform`
- `Configuration`
- `Edition`
- `Version`

### Functional structure
- `BusinessArea`
- `Workspace`
- `Object`
- `Screen`
- `Command`
- `Field`
- `State`
- `ValidationRule`

### Process and learning
- `Workflow`
- `WorkflowStep`
- `LearningScenario`
- `GuidanceStep`
- `VerificationAssertion`
- `Skill`

### Evidence
- `Source`
- `Evidence`
- `InterfacePassport`

## Edge types

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
- `WORKFLOW_USES -> Object|Screen|Command|Field`
- `WORKFLOW_HAS_STEP -> WorkflowStep`
- `WORKFLOW_REQUIRES -> Workflow|Skill`
- `LEARNING_SCENARIO_TRAINS -> Workflow|Skill`
- `SCENARIO_HAS_GUIDANCE -> GuidanceStep`
- `SCENARIO_VERIFIED_BY -> VerificationAssertion`
- `ASSERTION_READS -> Object|State|Field`
- `PASSPORT_DESCRIBES -> Screen|Workflow`
- `EVIDENCE_SUPPORTS -> any knowledge node`
- `EVIDENCE_DERIVED_FROM -> Source`
- `SUPERSEDES -> Version|Evidence|InterfacePassport`
- `ANALOGOUS_TO -> Object|Workflow` (cross-configuration; never implies identical behavior)

## Stable identifiers

Use readable IDs:

```text
configuration:accounting-kz
edition:accounting-kz:3.0
area:accounting-kz:3.0:sales
object:accounting-kz:3.0:catalog:counterparties
screen:accounting-kz:3.0:counterparty-list
command:accounting-kz:3.0:counterparty-create
workflow:accounting-kz:3.0:create-counterparty
scenario:tutor:create-training-counterparty:v1
source:KZ-ACC30-DOC
evidence:accounting-kz:counterparty-create:2026-08-15:001
```

Do not put transient database UUIDs into source knowledge IDs.

## Node JSONL contract

`graph/nodes.jsonl` is append/review oriented. One JSON object per line.

```json
{
  "id": "workflow:accounting-kz:3.0:create-counterparty",
  "type": "Workflow",
  "label": "Создание контрагента",
  "configuration": "accounting-kz",
  "edition": "3.0",
  "status": "partial",
  "confidence": "B",
  "tags": ["counterparties", "master-data"]
}
```

## Edge JSONL contract

```json
{
  "from": "scenario:tutor:create-training-counterparty:v1",
  "type": "LEARNING_SCENARIO_TRAINS",
  "to": "workflow:accounting-kz:3.0:create-counterparty",
  "evidence": ["evidence:accounting-kz:counterparty-create:2026-08-15:001"]
}
```

## Retrieval shape

A feature query such as `create customer invoice in Accounting KZ` should return a subgraph containing:
1. Configuration + edition/version;
2. BusinessArea;
3. Workflow;
4. Objects/screens/commands/fields used by the workflow;
5. Interface Passport;
6. Evidence + source metadata;
7. existing LearningScenario, if any;
8. prerequisites and analogous reusable primitives.

## Confidence rule

A simulator implementation may use:
- `A`: directly;
- `B`: with explicit version caveat and owner/manual UI check;
- `C`: only for hypothesis/prototype, never final fidelity;
- `D`: research queue only.

Tax, payroll calculation, regulatory forms, posting logic and mandatory-field rules require `A` evidence or explicit specialist validation before being taught as authoritative.

## Storage strategy

Stage K1 uses Git-native Markdown + JSONL. Do not add a vector database yet.

If Atlas grows enough that retrieval becomes slow or fuzzy matching is valuable, add a generated search index later. The canonical facts remain Git-versioned records; embeddings/indexes are disposable derivatives, not source of truth.