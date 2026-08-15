# MPE — Practice and Verification Blockers

Date: 2026-08-15
Decision: EXTEND_EXISTING
Status: **RESOLVED BY OWNER-APPROVED DEEP PIVOT**

## Original blockers

Owner validation found two defects:

1. the original five practical lessons hard-coded paid `1C:Fresh` as the practice environment;
2. the original verification engine validated learner-submitted answers rather than proving the target accounting action was performed.

## Resolution approved by owner

The existing `1c-tutor-kz` repository remains the product.

Core practice moves to an embedded deterministic **Training Workspace** that reproduces only the 1C workflows needed by the course.

Practical completion is verified from Training Workspace domain state. Real 1C becomes a later transfer-of-skill stage rather than an MVP dependency.

The owner also approved systematic preparation for future expansion. `1C Knowledge Atlas` is now the permanent evidence/retrieval layer for configuration/version/interface/workflow knowledge.

## Current implementation authority

Follow, in order:
- `FOUNDATION.md`;
- `PRODUCT_REQUIREMENTS.md`;
- `ARCHITECTURE.md`;
- `DATA_MODEL.md`;
- `ROADMAP.md`;
- `STAGE_CHECKLIST.md`;
- `NEXT_STAGE_INSTRUCTION.md`;
- `knowledge/1c/*`.

The prior `BLOCKED_BY_DEEP_CHANGE_GATE` status no longer applies because explicit approval was received in this conversation.

## Remaining gates

- Counterparty vertical slice must pass owner UX/fidelity review before Invoice.
- Invoice must pass before Payment.
- Stage K1 Knowledge Atlas must pass before broad course/configuration expansion.
- New deep architectural changes still require MPE.