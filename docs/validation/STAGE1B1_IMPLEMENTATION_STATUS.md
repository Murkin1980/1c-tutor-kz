# Stage 1B.1 — Implementation Status

Date: 2026-08-15
Decision: `EXTEND_EXISTING`
Status: `ENGINEERING GATE PASS / PENDING OWNER REVIEW`

## Implemented

- embedded `/learn/customer-card` route;
- deterministic customer-card domain state;
- create/edit/save/reset;
- Demo / Guided / Independent Test;
- semantic target IDs + spotlight;
- condition-driven guidance;
- `Почему?`, hints, show-action;
- state-based verification;
- per-assertion expected/actual/hint;
- assisted/unassisted completion metadata;
- local progress counters for attempts/resets/hints/show-action;
- unit test specifications;
- Playwright guided + independent specs;
- responsive desktop/mobile CSS;
- customer-card removed from mandatory 1C:Fresh flow.

## Owner feedback remediation

Date: 2026-08-16

Owner feedback (verbatim):

> сперва не сразу сообразил куда нажимать. потом понял. другие могут не понять

Classification: `Stage 1B.1 initial discoverability UX issue`.

Remediation status: `PASS WITH REMEDIATION` pending owner retest. Added a visible first-action cue on the initial workspace screen for Demo/Guided and covered its absence in Independent Test. Owner decision remains `PENDING`; Stage 1B.2 is still blocked.

## Verification assertions

1. counterparty exists;
2. name = `ТОО Учебный Покупатель`;
3. city = `Кызылорда`;
4. saved = true.

A typed answer outside Training Workspace cannot produce practical PASS.

## Known gaps

- observation-grade Accounting KZ 3.0 Interface Passport;
- exact-build field/button fidelity;
- separate anchored floating coach bubble; current guided UX uses side panel + target spotlight;
- owner Demo/Guided/Independent walkthrough;
- owner decision whether side panel + spotlight is sufficient for the next slice;
- exact-build UI observation remains pending.

## Check execution status

Executed on 2026-08-15 in the synced `mpe/stage-1-validation` checkout:

- `npm install`: PASS;
- `npm run lint`: PASS;
- `npm run typecheck`: PASS;
- `npm run test`: PASS (14/14);
- `npm run build`: PASS;
- `npm run check:secrets`: PASS;
- `npm run test:e2e -- --workers=1`: PASS (6/6);
- desktop 1440px and mobile 360px smoke: PASS;
- Demo, Guided and Independent behavior: PASS;
- negative state-verification scenarios: PASS.

The default parallel Playwright invocation did not complete in this Windows environment; the unchanged full suite passed serially with `--workers=1`.

## Next gate

Follow `NEXT_STAGE_INSTRUCTION.md`.

Do not implement Invoice until:
- engineering checks pass;
- owner reviews Demo/Guided/Independent;
- blocking UX issues are resolved;
- owner explicitly authorizes Stage 1B.2.
