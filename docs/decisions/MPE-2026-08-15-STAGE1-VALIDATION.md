# MPE Gate — Stage 1 Validation

Date: 2026-08-15
Decision: EXPERIMENT

## Why this decision

The project already exists as `Murkin1980/1c-tutor-kz`, so no new repository or parallel training system is justified.

The current codebase already contains the core frontend learning loop: routes, mock authentication, five lessons, seven validation types, local progress, and desktop/mobile tests. The highest-value uncertainty is therefore not whether more simulator infrastructure can be built, but whether the current 1C learning loop is understandable and useful to a real beginner.

`ROADMAP.md` and `STAGE_CHECKLIST.md` both require a Cloudflare preview, an owner walkthrough, and an alpha test by a second user before moving deeper into the product. `NEXT_STAGE_INSTRUCTION.md` had moved directly toward FNO/ESF simulator work, creating a sequencing conflict.

## Existing-project check

- Existing repository: YES — `Murkin1980/1c-tutor-kz`.
- Existing reusable lesson engine: YES.
- Existing validation engine: YES.
- Existing progress repository abstraction: YES.
- Existing simulator roadmap: YES, but it is downstream of the current validation gate.
- Need for a new repository: NO.

## Reuse / duplication check

Reuse the current React/Vite frontend, lesson content model, seven validation types, routing, local persistence, and current Cloudflare Pages preparation.

Do not create a second tutor shell, separate simulator app, new auth stack, or duplicate course engine during this experiment.

## Measurable business/product value

The experiment must answer one question:

> Can a beginner complete the current 1C training loop from a mobile or desktop browser with minimal external explanation and reach a verifiable result in the actual training 1C environment?

This directly tests whether the product can reduce dependence on one-to-one explanation and become a repeatable training asset.

## Minimal experiment

Scope is limited to the existing five-lesson prototype.

1. Publish a stable Cloudflare Pages preview.
2. Owner completes all five lessons end-to-end.
3. Fix only blocking or high-severity UX defects.
4. A second beginner completes the same flow without live coaching whenever possible.
5. Record completion, errors, unclear instructions, and context-switch friction between Tutor and 1C.

## Success metrics

PASS requires all of the following:

- preview opens successfully on desktop and smartphone;
- 5/5 existing lessons are reachable and completable;
- owner completion rate: 100%;
- second-user completion rate: at least 80% without live step-by-step coaching;
- no blocker causes loss of progress in the normal flow;
- every lesson has a clear expected result;
- context switch to 1C and back is understood without verbal explanation in at least 4/5 lessons;
- zero unsafe requests for real IIN/BIN, passwords, ECP keys, or government-system submission;
- UX issues are classified as blocker/high/medium/low with evidence.

## Stop conditions

Do not start FNO/ESF UI-shell implementation, Supabase migration, AI checking, browser extensions, computer vision, or deeper 1C automation until this experiment has a recorded result.

If the second user cannot complete at least 80% of the five lessons, remain on Stage 1 and improve the learning loop instead of expanding scope.

## Deep-change check

No deep change is approved. FOUNDATION architecture remains unchanged. This decision changes sequencing only: validate the existing learning loop before investing in downstream simulator complexity.

## Next gate

After PASS, run MPE again to choose between:

- Stage 2 official-interface research;
- Stage 3 Supabase/inter-device progress;
- Stage 4 expansion of the 1C course.

The choice must be based on evidence from this experiment, not the previous roadmap order alone.
