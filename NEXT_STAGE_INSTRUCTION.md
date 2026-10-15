# NEXT STAGE INSTRUCTION — Session 06 Accepted / Next Checkpoint Pending

## Canonical checkpoint

MPE disposition: `EXTEND_EXISTING`.

The active checkpoint is the 120-minute embedded practice:

`Session 06 — Продажа по предоплате: счёт → оплата → реализация → контроль долга`

It covers `AKZ-M03-L02`, `AKZ-M03-L03` and `AKZ-M03-L04` at:

`/learn/sales-prepayment-cycle`

The Arena implementation at commit `e47c100` is the implementation base. Do not replace it with the conflicting 100%-prepayment draft from `agent/antigravity-sales-cycle-spec`.

## Current gate

Status: `OWNER_ACCEPTED` (`PASS WITH REMEDIATION`).

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

## Owner review result

The owner accepted the lesson, guidance behavior and current difficulty. The only remediation clarifies that the final return to `Продажи` opens the Tutor settlement-control report and does not create another sale.

Session 06 is complete. Prepare the next checkpoint through the desktop workflow: Antigravity design → Codex review → bounded Arena checkpoint. Do not start implementation from an unreviewed design.

## Stop boundary

Do not implement Session 07 or later lessons until Codex has reviewed its design and marked a bounded checkpoint `READY FOR ARENA`.

Do not add dependencies, a second persistence system, real 1C access, real identifiers, VAT/ESF logic, accounting entries, tax claims or production deployment as part of this checkpoint.

Training Workspace document state remains an isolated resettable scenario. MiniBase persists learner progress only; extending it to synchronize live simulated documents is a separate product decision, not part of this correction.
