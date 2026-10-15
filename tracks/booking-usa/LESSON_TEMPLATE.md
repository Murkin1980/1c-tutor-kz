# RU/EN lesson authoring template

Store a single lesson in structured content according to the **existing repository model after CP-01A audit**; do NOT add a competing schema prematurely.

```yaml
id: booking-usa-bank-reconciliation-001
track: booking-usa
status: draft
titleRu: "Банковская сверка"
titleEn: "Bank Reconciliation"
estimatedMinutes: 25
learningOutcomeRu: "Сверить остаток в учете с выпиской"
jurisdiction: US
currency: USD
locale: ru-RU
englishControlLabels:
  - "Reconcile"
sourceDate: "2026-10-15"
sourceUrls: []
syntheticCase: "green-valley-landscaping"
setup: "External authorized demo or synthetic worksheet"
studentTask: "Find missing bank fee and record it"
verification:
  method: manual-with-deterministic-answer-key
  reviewed: false
rubric:
  - "Explains the discrepancy"
  - "Identifies the appropriate account"
  - "Balances the reconciliation"
commonErrors:
  - "Treats a transfer as income"
safety: "TRAINING ONLY — no real financial or identity data"
```

This example is documentation, NOT a committed parser contract. Each released lesson must have expected journal entries, tested balances, versioned UI terms, dated sources, bilingual glossary, accessibility check, and reviewer signature.
