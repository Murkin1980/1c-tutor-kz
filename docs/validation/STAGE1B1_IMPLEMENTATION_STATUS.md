# Stage 1B.1 — Implementation Status

Date: 2026-08-15
Decision: `EXTEND_EXISTING`
Status: `PRE-REVIEW / ENGINEERING CHECKS PENDING`

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
- automated checks have not been executed in this ChatGPT environment;
- manual desktop/mobile smoke not yet recorded.

## Check execution status

Attempted local checkout from the available execution container, but DNS/network access to GitHub was unavailable.

Current branch head has no active GitHub CI status checks.

Therefore:
- lint: `NOT RUN`;
- typecheck: `NOT RUN`;
- unit tests: `NOT RUN`;
- build: `NOT RUN`;
- secrets: `NOT RUN`;
- e2e: `NOT RUN`.

## Next gate

Follow `NEXT_STAGE_INSTRUCTION.md`.

Do not implement Invoice until:
- engineering checks pass;
- owner reviews Demo/Guided/Independent;
- blocking UX issues are resolved;
- owner explicitly authorizes Stage 1B.2.
