# NEXT STAGE INSTRUCTION — Session 06 Owner Review

## Canonical checkpoint

MPE disposition: `EXTEND_EXISTING`.

The active checkpoint is the 120-minute embedded practice:

`Session 06 — Продажа по предоплате: счёт → оплата → реализация → контроль долга`

It covers `AKZ-M03-L02`, `AKZ-M03-L03` and `AKZ-M03-L04` at:

`/learn/sales-prepayment-cycle`

The Arena implementation at commit `e47c100` is the implementation base. Do not replace it with the conflicting 100%-prepayment draft from `agent/antigravity-sales-cycle-spec`.

## Current gate

Status: `OWNER_REVIEW_PENDING`.

Engineering implementation exists for:

- Demo / `Показать`;
- Guided / `Вести меня`;
- diagnostic error repair without reset;
- Independent / `Проверить себя`;
- deterministic verification from persisted workspace documents;
- assisted/unassisted learner progress;
- local progress with optional MiniBase synchronization;
- desktop and mobile browser coverage.

`AKZ-M03-L01` is accepted as the completed foundation. The owner explicitly authorized Session 06 after finding the standalone customer-card lesson too simple.

## Methodology boundary

The session uses a fictional scenario:

- invoice: 330 000 KZT;
- incoming prepayment: 165 000 KZT (50%);
- realization: 330 000 KZT;
- resulting Tutor balance: customer debt 165 000 KZT.

The balance formula is an explicitly labeled Tutor teaching model. Do not present it as evidence of exact postings, advance-offset behavior or form behavior in a concrete Accounting KZ 3.0 build. Those claims require an observation-grade Interface Passport or specialist approval.

## Required owner walkthrough

1. Complete Demo and confirm that it explains the whole chain without granting completion.
2. Complete Guided and inspect the two-level hints and `Почему?` explanations.
3. Load the diagnostic chain, identify the wrong payment and unposted realization, and repair both without resetting.
4. Complete Independent without guidance.
5. Repeat Demo or Guided and verify that the previous best completion result is not downgraded.
6. Check the mobile route at approximately 360 px and confirm that the fixed bottom navigation does not cover the final controls/results.

Record `PASS`, `PASS WITH REMEDIATION` or `FAIL` in `docs/validation/SALES_CYCLE_IMPLEMENTATION_STATUS.md` and `docs/curriculum/LESSON_STATUS.md`.

## Stop boundary

Do not implement Session 07 or later lessons before the Session 06 owner decision.

Do not add dependencies, a second persistence system, real 1C access, real identifiers, VAT/ESF logic, accounting entries, tax claims or production deployment as part of this checkpoint.

Training Workspace document state remains an isolated resettable scenario. MiniBase persists learner progress only; extending it to synchronize live simulated documents is a separate product decision, not part of this correction.
