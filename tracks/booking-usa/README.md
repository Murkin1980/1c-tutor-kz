# Booking USA — US Bookkeeping Track

Status: **CP-01B content/fixtures — MACHINE PASS / METHODOLOGY REVIEW PENDING**. Date: 2026-10-15. MPE decision: **EXTEND_EXISTING**. TRAINING ONLY. No US runtime integration.

**Booking USA** is the owner-approved name of a Russian-language learning track for US **bookkeeping** (small-business accounting services), **not** travel/hotel reservations.

## Purpose
Prepare Russian-speaking learners to perform scoped remote bookkeeping tasks for US small businesses: transaction classification, invoicing, bills, bank reconciliation, month close, financial reporting, and communication with US clients and supervising accountants.

## Repository boundary
- Remains in `Murkin1980/1c-tutor-kz`, branch `booking-usa`.
- All US-specific content stays inside `tracks/booking-usa/`.
- Existing KZ foundation, KZT/ru-KZ defaults, 1C tax/ESF safeguards and existing routes remain unchanged.
- US track parameters (USD, US English terminology, state-specific caveats) apply **only** to this track. Extending runtime to support multiple jurisdictions is a **future deep-change proposal**, not authorized here.
- Reuse the existing lesson loop: scenario → user action in external training environment → manual verification → feedback → practice.
- No new packages, credentials, hosting, database, external SaaS integration or API connection in CP-00.

## Start here
1. [Scope and risks](SCOPE.md)
2. [Curriculum](CURRICULUM.md)
3. [Checkpoint index](CHECKPOINTS.md)
4. [First experiment](checkpoints/CP-01.md)
5. [Sources and licensing](SOURCES.md)
6. [Lesson template](LESSON_TEMPLATE.md)
7. [English/Russian glossary](GLOSSARY_RU_EN.md)
8. [Training case](cases/green-valley-landscaping.md)
9. [Commercial validation](MARKET_VALIDATION.md)
10. [CP-00 evidence](CP-00_REPORT.md)
11. [CP-01B validated case packet and lessons](cases/green-valley-landscaping/README.md) — machine PASS, independent methodology PENDING; no runtime integration.

## Definition of pilot success
One legally sourced, methodically reviewed RU/EN lesson with wholly fictional data; learner completes invoice → payment → expenses → reconciliation → P&L in a permissible external demo/sandbox; expected balances and errors are independently checked. Do not promise automatic verification of QuickBooks actions.

**Not yet built:** an executable US track, login, US simulator, production features, official certification, paid service, US tax filing, or integrations.
