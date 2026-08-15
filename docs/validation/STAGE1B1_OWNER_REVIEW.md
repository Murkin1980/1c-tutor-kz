# Stage 1B.1 — Owner UX / Fidelity Review

Status: `PENDING_OWNER_REVIEW`
Date: 2026-08-15
Route: `/learn/customer-card`

## Review scope

Only the first Counterparty vertical slice is in scope.

Do not review Invoice/Payment implementation because those slices are blocked until this gate passes.

## Preconditions

- user is logged in as learner;
- open `/learn/customer-card`;
- use only fictional scenario data;
- if a deployed preview is unavailable, run the branch locally.

## 1. Demo — `Показать`

- [ ] route is understandable;
- [ ] explanations are concise;
- [ ] `Показать действие` demonstrates the whole flow;
- [ ] Demo does not incorrectly count as independent completion;
- [ ] training marker is obvious.

Owner notes:

> pending

## 2. Guided Practice — `Вести меня`

- [ ] target spotlight is obvious;
- [ ] next instruction changes only after the relevant action/state;
- [ ] `Почему?` is useful;
- [ ] hint 1 is useful without giving everything away;
- [ ] hint 2 is sufficiently explicit;
- [ ] using show-action is clearly treated as assistance;
- [ ] task panel does not block the simulated application.

Owner notes:

> pending

## 3. Independent Test — `Проверить себя`

- [ ] step guidance is hidden;
- [ ] task/source data remain sufficient;
- [ ] user can navigate freely;
- [ ] successful manual work is marked unassisted;
- [ ] wrong state cannot pass.

Owner notes:

> pending

## 4. Verification clarity

Before task:
- [ ] `Что будет проверено` is clear.

After task:
- [ ] each PASS/FAIL line is understandable;
- [ ] expected value is useful;
- [ ] actual value is useful on failure;
- [ ] corrective hint is specific enough;
- [ ] result does not feel like an opaque quiz.

Owner notes:

> pending

## 5. 1C learning fidelity

Current fidelity level:
`SEMANTIC / INTERACTION MODEL — exact installed-build UI observation pending`.

Evaluate:
- [ ] navigation logic is directionally useful for learning 1C;
- [ ] list → create → form → save mental model is appropriate;
- [ ] terminology is not misleading;
- [ ] density/layout is sufficiently 1C-like for the training goal;
- [ ] lack of pixel-perfect fidelity is acceptable at this stage.

### Anchored coach decision

Choose one after trying the slice:
- [ ] current side panel + spotlight is sufficient for next slice;
- [ ] anchored floating coach is required before Invoice;
- [ ] anchored coach can be deferred to Stage 1C hardening.

## 6. Mobile

- [ ] usable around 360px width;
- [ ] target/control remains tappable;
- [ ] task information remains readable;
- [ ] form can be completed without horizontal trap;
- [ ] result checklist remains readable.

Owner notes:

> pending

## Blocking issues

| Severity | Issue | Expected fix |
|---|---|---|
| — | pending review | — |

## Owner decision

One of:
- `PASS — authorize Stage 1B.2 Invoice`
- `PASS WITH REMEDIATION — fix listed items, then Invoice may start`
- `FAIL — remain in Stage 1B.1`

Decision: `PENDING`

## Explicit authorization

Stage 1B.2 Invoice remains **BLOCKED** until the owner explicitly changes the decision above.
