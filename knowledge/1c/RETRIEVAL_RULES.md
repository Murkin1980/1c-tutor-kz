# RETRIEVAL RULES — 1C Knowledge Atlas

## Core rule

Before implementing or modifying any 1C-like workflow, the coder/agent must query the Atlas first.

## Retrieval order

1. Resolve exact `Configuration`.
2. Resolve `Edition` / `Version` or mark version unknown.
3. Resolve `BusinessArea`.
4. Resolve `Workflow`.
5. Pull connected Objects → Screens → Commands → Fields → States.
6. Pull `InterfacePassport`.
7. Pull supporting `Evidence` and `Source` records.
8. Pull existing `LearningScenario` and reusable primitives.
9. Evaluate confidence/freshness.

## Result classes

### READY
- exact configuration/edition;
- workflow found;
- UI/process evidence grade A or acceptable B;
- no unresolved contradictory evidence.

Implementation may proceed within current MPE scope.

### RESEARCH_REQUIRED
- workflow exists but interface/version evidence is incomplete;
- only C/D evidence;
- conflicting sources;
- no Interface Passport for a fidelity-sensitive screen.

Stop implementation of that detail and create an ingestion task.

### OUT_OF_SCOPE
- requested configuration/module is not in current roadmap;
- workflow requires new infrastructure or deep change;
- no measurable current learning value.

Return to MPE.

## Retrieval query record

For substantial simulator changes, put a small evidence summary in the PR/session notes:

```text
Atlas query: accounting-kz / 3.0 / counterparties / create-counterparty
Nodes used: ...
Evidence: ...
Confidence: A/B
Gaps: ...
```

## RAG policy

The first retrieval layer is deterministic metadata/graph lookup, not embeddings.

A future RAG index may index:
- summaries;
- labels/aliases;
- workflow descriptions;
- evidence abstracts;
- source metadata.

It must NOT make generated embeddings/vector results canonical. Any RAG answer used for implementation must resolve back to Atlas node IDs and evidence/source IDs.

## Web fallback

Use web research only when Atlas returns `RESEARCH_REQUIRED` or when freshness must be checked.

After web research:
1. register source;
2. create evidence record;
3. update nodes/edges/passport;
4. record observed date/version;
5. then implement.

Do not repeatedly solve the same knowledge gap from the web without updating Atlas.

## Cross-configuration reuse

Generic platform behavior can be reused through `platform` nodes. Similar workflows across RU/KZ or different configurations may be connected with `ANALOGOUS_TO`, but localization-sensitive facts cannot be inherited automatically.

Examples requiring KZ-specific evidence:
- taxes;
- payroll calculation;
- regulatory reports;
- local document forms;
- mandatory legal fields;
- posting/accounting rules.

## Freshness

At feature time, flag evidence as stale when:
- source indicates a newer edition/version;
- UI passport predates a known major interface change;
- regulatory behavior is involved and evidence has not been verified against current rules;
- source URL is unavailable or superseded.

Stale evidence remains in history and is linked with `SUPERSEDES`; do not delete history merely because a new version appears.