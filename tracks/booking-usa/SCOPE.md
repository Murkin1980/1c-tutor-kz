# Scope, architecture boundary and safeguards

## CP-00 authorization
Documentation-only framework in a dedicated Git branch. Existing application code, `main`, KZ course, database and deploy untouched. Parent MPE result: EXTEND_EXISTING.

## Constraints inherited from the project
Read repository `AGENTS.md` and `docs/governance/SCOPE-CHANGE-CONTROL.md` before work. Preserve `FOUNDATION.md` and local roadmap as authoritative for the KZ track. USD/US locale must NOT override KZT/ru-KZ globally.

## Track-specific invariants (proposal, subject to CP-01 approval)
- Russian teaching language with original English names of software controls and accounting terms.
- USD, fictional US company, fictional documents, visibly labeled TRAINING ONLY.
- Separate tab for QuickBooks Online demo or other legal training instance; no iframe dependency or credential interception.
- No live bank connections, no real taxpayer IDs, SSNs, EINs, credentials, API keys, or client financial records in lessons.
- Avoid copying paid courses, restricted interfaces or logos; create original instructional commentary and synthetic datasets. Track licensing/source checks.
- No legal, tax, CPA or enrolled-agent claims; tax preparer/representation, payroll tax filings and complex sales tax out of initial service scope.
- State and federal requirements must be reviewed with qualified US tax/legal experts before instruction is labeled authoritative.
- AI may explain but cannot be the sole authority for reconciliations, tax rules, or certification.

## Deep-change gate
Require explicit owner approval before any shared data schema change, generic multi-jurisdiction refactor, revised authentication/security boundary, new service or integration, production deployment, migrations, recurring costs, or changes to foundational KZ behavior.

## Reuse inventory (preliminary from README/FOUNDATION, needs code audit)
- Existing React/Vite training routes and course/lesson navigation.
- Existing mock lesson progress repositories and verification types.
- Existing manual 'open external program' workflow and practice feedback.
Do not claim cross-device persisted progress: existing README says this awaits Supabase.

## Out of scope
Production US accounting platform, automated scraping/translation of protected courses, imitating official tax portals, collecting real personal data, using a third-party training service against its terms, enrolling in certification on behalf of the user.
