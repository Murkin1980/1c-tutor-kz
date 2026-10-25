<!-- MPE:SCOPE-CHANGE-CONTROL:START -->
## Mandatory first read — MPE Scope & Change Control

Before planning, coding, refactoring, dependency changes, testing strategy, deployment, or checkpoint execution, read:

- `docs/governance/SCOPE-CHANGE-CONTROL.md`

Read it before project-specific source-of-truth documents. Then follow this repository's local rules and the current checkpoint/spec.

The scope policy governs minimal change, reuse, checkpoint boundaries, deep-change, testing, evidence, merge/deploy authority, and stopping conditions.

If a local rule appears to conflict with the scope policy, apply the documented source-of-truth priority. Do not silently weaken either rule; surface a deep-change conflict when required.
<!-- MPE:SCOPE-CHANGE-CONTROL:END -->

# AGENTS — mandatory project entry point

These rules apply to every human or AI contributor working in this repository.

## Read before any work

Read in this order:

1. `FOUNDATION.md`;
2. `CODER_HANDOFF_2026-08-15.md` (or its explicitly named successor);
3. `docs/curriculum/ACCOUNTING_KZ_CURRICULUM_ROADMAP.md`;
4. `docs/curriculum/LESSON_STATUS.md`;
5. `NEXT_STAGE_INSTRUCTION.md`;
6. `CODER_INSTRUCTION.md`;
7. the relevant Atlas workflow, Interface Passport and evidence records;
8. `SESSION_NOTES.md`.

Do not start a lesson merely because it appears in the roadmap. `LESSON_STATUS.md` is the canonical execution ledger and `NEXT_STAGE_INSTRUCTION.md` is the current gate.

## Lesson status discipline

- Only one practical lesson may be `IN_PROGRESS` unless the owner explicitly authorizes parallel work.
- Before editing, record the selected lesson, current phase and starting commit in `LESSON_STATUS.md`.
- After a checkpoint, update its status, last completed phase, evidence, blockers and exact next action.
- Run `npm run check:curriculum` after changing either curriculum file.
- Never mark `DONE` from code presence or a successful build alone. A practical lesson requires engineering checks, desktop/mobile verification and explicit owner acceptance.
- If work stops unfinished, leave the lesson as `IN_PROGRESS` or `BLOCKED` and describe the precise resume point. Do not reset it to `PLANNED`.
- Do not overwrite another contributor's work. Preserve the untracked `minibase/` directory unless the owner creates a separate task for it.

## Permanent implementation rules

- MPE disposition: `EXTEND_EXISTING`.
- Use the existing Training Workspace, Guidance, Verification and Progress primitives.
- Follow `Atlas retrieval → gap ingestion → Interface Passport → vertical slice → tests → owner review`.
- Practical completion must come from deterministic domain state, never from a typed quiz answer.
- Use fictional data only. Never request real identifiers, passwords, EDS, bank credentials or production 1C access.
- Do not build several curriculum lessons at once. Finish and accept the current slice before expanding.
