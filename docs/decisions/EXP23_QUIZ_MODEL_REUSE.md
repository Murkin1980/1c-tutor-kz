# EXP-23 Quiz Model Reuse — bounded adoption checkpoint

Status: PLANNED  
Owner decision: **EXTEND_EXISTING**  
Source: Murat Project Engineer EXP-23 — **PASS / REUSE_COMPONENT**

## Purpose

Evaluate only the reusable quiz/verification data-model semantics proven useful in EXP-23 and map them onto the existing 1C Tutor KZ lesson-verification engine.

Do **not** adopt Papermorph, its engine, runtime, renderer, authoring pipeline, or UI.

## Reuse candidate

The candidate model includes:

- question/check types equivalent to:
  - choice;
  - blanks;
  - grid;
  - tap/visual-target;
- per-attempt feedback;
- per-mistake explanation;
- first-attempt scoring semantics;
- explicit show-answer flow;
- finish/completion state.

This is a semantic/model reuse task, not a redesign of the tutor.

## Existing-project rule

Before adding fields or types, audit the current 1C Tutor KZ verification engine and its seven supported check types.

Prefer:
1. mapping EXP-23 semantics onto existing types;
2. extending existing discriminated unions/schemas only where a real gap exists;
3. preserving current lesson content compatibility.

Do not duplicate an existing verification type under a new name.

## Bounded proof

Use one existing lesson/check fixture.

Prove:
- first attempt is scored deterministically;
- later retries can provide learning feedback without rewriting the original first-attempt score;
- one wrong option can expose a specific explanation;
- show-answer is explicit and does not masquerade as a successful answer;
- completion/finish state remains compatible with current lesson progress;
- existing verification fixtures continue to pass.

If visual tap/grid behavior would require new screenshot/CV infrastructure, STOP and keep that part as schema-only until separately authorized.

## Safety / scope

- No change to real 1C integration boundaries.
- No external AI judging.
- No Supabase requirement for this checkpoint.
- No new service, database, queue, auth system, or analytics platform.
- Do not interrupt Stage 2A.
- Implement only when the owner explicitly starts this checkpoint after the current stage gate.

## PASS

PASS if the existing verification engine can absorb the useful semantics with a small compatible extension and tests, without a parallel quiz engine.

Final decision after the bounded run:
- REUSE_COMPONENT;
- HOLD;
- or REJECT.
