# NEXT STAGE INSTRUCTION — Stage 1 Validation Experiment

## MPE decision

`EXPERIMENT`

Before expanding into FNO/ESF simulators, Supabase, AI checking, browser extensions, computer vision, or deeper automation, validate the existing five-lesson 1C learning loop with real users.

Authoritative decision record: `docs/decisions/MPE-2026-08-15-STAGE1-VALIDATION.md`.

## Mandatory reading

Before work, read fully:

1. `FOUNDATION.md`
2. `README.md`
3. `PRODUCT_REQUIREMENTS.md`
4. `ARCHITECTURE.md`
5. `DATA_MODEL.md`
6. `ROADMAP.md`
7. `STAGE_CHECKLIST.md`
8. `VISUAL_PROGRESS.md`
9. `SECURITY_AND_LEGAL.md`
10. `SESSION_NOTES.md`
11. `docs/decisions/MPE-2026-08-15-STAGE1-VALIDATION.md`

If documents conflict, `FOUNDATION.md` wins. For sequencing of the next iteration, the MPE decision record wins unless it conflicts with `FOUNDATION.md`.

## Goal

Prove or disprove that a beginner can use the current 1C Tutor prototype to complete the existing learning loop with minimal external explanation and reach a verifiable result in the training 1C environment.

## Scope

Use the existing five-lesson prototype only. Do not add new product surfaces unless required to remove a blocker in the validation experiment.

### 1. Stable preview

Prepare and publish the current frontend to Cloudflare Pages using the existing project architecture.

Required:

- production branch: `main`;
- build command: `npm run build`;
- output directory: `dist`;
- SPA fallback remains functional;
- security headers remain functional;
- no secrets in repository or client bundle;
- preview works on desktop and smartphone.

If direct Cloudflare publication cannot be completed from the available environment, prepare the exact deployment configuration and document the remaining external action. Do not replace Cloudflare with a new hosting stack.

### 2. Owner walkthrough

Run all five existing lessons end-to-end.

For every lesson record:

- start state;
- task understood: yes/no;
- 1C action completed: yes/no;
- return to Tutor understood: yes/no;
- validation result;
- time or obvious friction point where observable;
- unclear wording;
- blocker/high/medium/low issue;
- expected result visible: yes/no.

Fix only blocker/high issues required to continue the experiment.

### 3. Second-user alpha test

A beginner should attempt the same five lessons with no live step-by-step coaching whenever possible.

Allowed help:

- opening the preview URL;
- opening the training 1C environment;
- resolving technical access failures unrelated to Tutor UX.

Do not explain the intended lesson flow while measuring whether the interface itself is understandable.

### 4. UX evidence register

Create `docs/validation/STAGE1_UX_EVIDENCE.md` with one row/item per observed issue.

Each entry must include:

- participant: owner / second user;
- lesson;
- observation;
- severity: blocker/high/medium/low;
- evidence;
- root-cause hypothesis;
- fix applied or deferred;
- retest result.

Do not store personal or sensitive data about the participant.

### 5. Validation result

Create `docs/validation/STAGE1_VALIDATION_RESULT.md` containing the final PASS/FAIL result against these metrics:

- preview opens on desktop and smartphone;
- 5/5 lessons reachable and completable;
- owner completion rate = 100%;
- second-user completion rate >= 80% without live step-by-step coaching;
- no normal-flow blocker loses progress;
- every lesson has a clear expected result;
- context switch to 1C and back is understood without verbal explanation in at least 4/5 lessons;
- zero requests for real IIN/BIN, passwords, ECP keys, or government-system submission.

If any mandatory metric fails, overall result is `FAIL` and the next iteration remains Stage 1 remediation.

## Engineering checks

Before reporting completion, run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:secrets
npm run test:e2e
```

All existing checks must remain green. Do not weaken or delete tests to obtain PASS.

## Allowed changes

- deployment configuration required for Cloudflare Pages;
- wording, navigation, focus states, responsive behavior, validation feedback, and progress handling that directly remove observed blocker/high issues;
- test fixes required by those changes;
- validation evidence documentation;
- README / ROADMAP / STAGE_CHECKLIST / VISUAL_PROGRESS / SESSION_NOTES updates reflecting actual evidence.

## Explicitly outside this iteration

- FNO simulator implementation;
- ESF simulator implementation;
- official-portal replica UI-shell;
- Supabase migration;
- new authentication architecture;
- AI evaluation;
- browser extension;
- computer vision;
- automated control of 1C;
- new repository;
- unrelated refactors.

## Definition of Done

This iteration is complete only when:

- stable preview is available or the only remaining blocker is an explicitly documented external Cloudflare action;
- owner walkthrough evidence exists;
- second-user alpha evidence exists;
- PASS/FAIL is calculated against the fixed metrics above;
- blocker/high issues discovered during testing are fixed or explicitly justify FAIL;
- lint/typecheck/unit/build/secrets/e2e results are recorded;
- `SESSION_NOTES.md`, `VISUAL_PROGRESS.md`, `ROADMAP.md`, and `STAGE_CHECKLIST.md` reflect the actual experiment result;
- a new MPE gate is run before selecting the next substantial stage.

## Stop condition

Do not begin downstream feature work merely because the implementation is technically ready. Stop after the validation result and run MPE again.

## Final report format

```markdown
## MPE decision applied
- EXPERIMENT

## Participants
- owner: completed / not completed
- second user: completed / not completed

## Metrics
- preview desktop/mobile: PASS/FAIL
- lessons reachable: X/5
- owner completion: X%
- second-user completion: X%
- context-switch clarity: X/5
- unsafe-data requests: 0 / N

## UX findings
- blocker: N
- high: N
- medium: N
- low: N

## Checks
- npm run lint — PASS/FAIL
- npm run typecheck — PASS/FAIL
- npm run test — PASS/FAIL
- npm run build — PASS/FAIL
- npm run check:secrets — PASS/FAIL
- npm run test:e2e — PASS/FAIL

## Overall validation
- PASS/FAIL

## Next action
- run MPE gate again before selecting Stage 2, Stage 3, Stage 4, or Stage 1 remediation
```
