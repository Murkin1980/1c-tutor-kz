# MPE — Practice and Verification Blockers

Date: 2026-08-15
Decision: EXTEND_EXISTING
Status: BLOCKED_BY_DEEP_CHANGE_GATE

## User evidence

During owner validation two blocking defects were found:

1. Every current lesson routes practice to `https://1cfresh.kz/`, while 1C:Fresh is a paid service and therefore cannot be treated as a frictionless prerequisite for the learning MVP.
2. The current verification engine verifies only the learner's submitted answer (`true`, option, exact text, number, sequence or uploaded file). It does not verify that the target action was performed in 1C.

## MPE conclusion

The current Stage 1 validation cannot produce trustworthy evidence of the product's learning value. A learner can pass lessons without performing the accounting action, while another learner may be unable to begin because access to the external practice environment is paid.

Do not proceed to FNO/ESF simulators, Supabase, AI checking, browser automation or a larger course until these two blockers are resolved.

## Non-deep remediation

The following changes are safe within the current architecture:

- remove 1C:Fresh as a hard-coded universal dependency;
- model the practice environment explicitly (`practiceMode`, availability, setup instructions, external URL only when applicable);
- make every verification card display what is being checked, why it proves the lesson outcome, and what it does NOT prove;
- separate `knowledge_check` from `action_evidence` and `lesson_completion`;
- prevent `self_confirm`, arithmetic answers and recall questions from being presented as proof that an external 1C action was completed;
- mark lessons requiring unavailable external practice as `practice_unavailable` rather than passable.

## Deep-change option requiring owner approval

The strongest low-friction product direction is to add an in-app training workspace that reproduces only the small set of 1C workflows needed by the course, with deterministic state and automatic evidence of user actions. This would allow the tutor to verify actual state changes (e.g. a counterparty exists, an invoice has two lines and totals 245000 KZT) rather than quiz answers.

This is a material product change because FOUNDATION currently defines the main accounting practice as work in a separate 1C training base. Therefore implementation of an embedded 1C-like accounting practice workspace must not begin without explicit owner approval.

## Free alternative reviewed

Official 1C sources provide a free desktop educational version of 1C:Accounting/1C:Enterprise, but it is not a browser-based Kazakhstan accounting environment and therefore is not an equivalent replacement for the current cross-device web workflow. It may remain an optional desktop practice path, not the default MVP dependency.

## Required next decision

Owner approval is required for one of two paths:

A. Keep real/external 1C practice as the canonical environment and accept setup/licensing friction; improve evidence semantics only.

B. Approve the deep change: make an embedded deterministic training workspace the default MVP practice environment, while real 1C becomes a later transfer-of-skill step.

MPE recommendation: B, because it removes the paid prerequisite and makes progress objectively verifiable without external automation.
