# Embedded Training Workspace — reference research

Date: 2026-08-15
MPE decision: EXTEND_EXISTING

## Research question

How should 1C Tutor KZ teach a beginner a complex accounting UI without requiring paid 1C:Fresh and without pretending that a quiz answer proves a real task was completed?

## Reference patterns

### SAP Enable Now / SAP Companion

Useful patterns:
- distinct Demo / Practice / Test modes;
- Practice advances only after the expected user action;
- Test removes guidance and measures unaided execution;
- guided tours attach instructions directly to the active UI element;
- task description can remain visible separately from the simulated application.

Adopt:
- Show me / Guide me / Test me modes;
- contextual bubble next to the current control;
- guided mode waits for the expected action;
- test mode hides step-by-step assistance.

Do not adopt:
- dependence on recorded screenshots as the primary simulator model.

### Assima

Useful pattern:
- high-fidelity editable clone of the real application rather than a static screenshot sequence;
- learner can click, scroll, select dropdowns and enter data in a safe simulation.

Adopt:
- interactive HTML reconstruction of the selected 1C workflows;
- freedom to explore within the supported training surface;
- realistic data/state changes.

Do not adopt for MVP:
- attempt to clone all of 1C;
- automatic capture/cloning technology.

### Salesforce Trailhead Playground

Useful pattern:
- learning uses an isolated practice environment rather than the production account;
- hands-on challenges are attached to a safe training environment.

Adopt:
- resettable fictional company/workspace;
- each learner owns an isolated training state;
- exercises modify that state.

Do not adopt for MVP:
- provision a real external 1C tenant per learner.

### Oracle Guided Learning / WalkMe / Userlane

Useful patterns:
- contextual guidance on top of the application;
- instructions point at the exact button/field needed now;
- guides can wait for conditions/actions before advancing;
- help can be invoked on demand;
- form/input validation can prevent errors while learning.

Adopt:
- coach bubble anchored to UI elements;
- highlight / spotlight target;
- optional “Why?” and “Show me” help;
- condition-driven progression;
- error-specific feedback instead of generic “wrong”.

Do not adopt:
- browser-extension dependency;
- overlays on a third-party live application in MVP.

### Instruqt / Skillable

Useful patterns:
- lab and instructions live side-by-side;
- verification inspects the environment itself;
- learner can explicitly click Check;
- failed checks provide targeted hints;
- partial scoring can be based on multiple independent conditions;
- test environments can reset to a known initial state.

Adopt:
- state-based checks against the training workspace;
- Check task button with explicit list of verified conditions;
- partial completion visibility;
- deterministic reset/retry;
- hints tied to the failed condition.

Do not adopt for MVP:
- VM/container infrastructure;
- AI/computer-vision scoring as a primary verifier.

## Product conclusion

The new core should combine four ideas:

1. Assima-style interactive application replica for a deliberately small subset of 1C.
2. SAP-style three learning modes: Demo, Guided Practice, Independent Test.
3. WalkMe/Userlane-style contextual coach bubbles anchored to the real simulated controls.
4. Instruqt/Skillable-style deterministic state inspection for verification.

## Proposed learning loop

1. Scenario card explains the business event and expected result.
2. Learner enters the embedded 1C-like workspace.
3. Guided Practice highlights only the next relevant control.
4. User performs the action; the workspace state changes.
5. The coach advances only when the expected state/action is observed.
6. At checkpoints the learner can press `Проверить работу`.
7. Verification shows exactly what passed and what failed.
8. A targeted hint is offered for failed conditions.
9. After guided completion the learner repeats a similar task in Test mode with no bubbles.
10. Only after mastery does the course optionally ask the learner to repeat the flow in a real or desktop training copy of 1C.

## Verification principle

Never mark an accounting task complete only because the learner typed the expected final number into Tutor.

Verification must inspect workspace state, for example:
- counterparty exists;
- name and city match the scenario;
- invoice exists;
- invoice belongs to the expected counterparty;
- invoice contains exactly two required rows;
- quantity and price are correct;
- calculated total equals 245000 KZT;
- document is in the required status;
- learner reached the intended screen through supported actions.

Knowledge questions may remain as secondary checks, but they must not substitute for practical verification.

## UI layout recommendation

Desktop:
- left or center: 1C-like workspace occupying most of the screen;
- right: collapsible task/coach panel;
- anchored coach bubbles near active controls;
- top: scenario progress and mode selector;
- bottom/right: `Проверить работу`, `Подсказка`, `Сбросить шаг`.

Small screens:
- workspace remains primary;
- task panel becomes a bottom sheet;
- coach bubbles stay attached to controls;
- no requirement to keep two browser tabs open.

## MVP boundary

Implement only enough 1C-like UI to support three end-to-end workflows:

1. create a training counterparty;
2. create a customer invoice;
3. register a customer payment / advance and inspect the resulting status/balance.

Do not build a general-purpose accounting engine or full 1C clone.

## Success criteria

- no paid 1C service required for the core lesson loop;
- learner can complete the three workflows entirely in browser;
- every practical task has deterministic environment-state checks;
- user always sees what is being checked;
- guided mode can be completed without verbal coaching;
- test mode can distinguish successful execution from guessing;
- workspace resets to a deterministic fictional starting state;
- real credentials and real company identifiers are never requested.
