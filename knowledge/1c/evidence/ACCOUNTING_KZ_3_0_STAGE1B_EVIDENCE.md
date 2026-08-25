# Accounting KZ 3.0 — Stage 1B Evidence Pack

Updated: 2026-08-15

## Evidence grading

`A` = official primary source and exact target edition/subject.
`B` = official primary source but insufficient for exact build-specific UI placement.

---

## E1 — Standard trading sequence

Evidence ID: `evidence:accounting-kz:stage1b:trade-sequence:2026-08-15`
Grade: `A` for workflow sequence
Source: `KZ-ACC30-TRADE-TYPICAL`

Official Accounting KZ 3.0 documentation under `Типовые ситуации в торговой деятельности` exposes:

### Acquisition with prepayment
- `Ввод данных о контрагенте`
- `Подготовка платежного поручения`
- `Регистрация безналичной оплаты поставщику`
- `Регистрация поступления материальных запасов`

### Sale with prepayment
- `Оформление счета покупателю`
- `Регистрация безналичной оплаты от покупателя`
- subsequent shipment/realization step

Implementation consequence:
- Counterparty is a prerequisite master-data concept for trading workflows.
- Tutor Stage 1B dependency `Counterparty → Customer Invoice → Customer Bank Payment` is source-backed.
- The invoice and payment are separate workflow states; one cannot be substituted by answering the resulting amount.

UI limitation:
- this evidence does not prove exact current control placement in an installed build.

---

## E2 — Counterparty contracts

Evidence ID: `evidence:accounting-kz:counterparty-contracts:2026-08-15`
Grade: `A` for feature existence; `B` for exact UI
Source: `KZ-ACC30-CONTRACTS`

Official methodical material is specifically titled `Виды договоров с контрагентами и их создание в конфигурации "Бухгалтерия для Казахстана", ред. 3.0`.

Implementation consequence:
- Tutor domain should not model a customer merely as a free-text name inside an invoice.
- Counterparty and contract/settlement context are distinct concepts.
- Initial Counterparty slice may defer contract creation, but future Invoice/Payment models must be able to reference a contract/settlement context without schema replacement.

---

## E3 — Realization terminology

Evidence ID: `evidence:accounting-kz:realization:2026-08-15`
Grade: `A` for workflow existence
Source: `KZ-ACC30-REALIZATION`

Official methodical material exists for `Отражение реализации ТМЗ и услуг` in Accounting KZ 3.0, while the official manual separately includes `Реализация товаров` and `Реализация услуг`.

Implementation consequence:
- Tutor must distinguish customer invoice from actual realization/shipment.
- Completing an invoice must not mark goods/services as realized.
- Future scenario graph should preserve `invoice → payment/advance → realization` as separate state transitions where the selected scenario uses that sequence.

---

## E4 — Customer settlement/reporting is observable

Evidence ID: `evidence:accounting-kz:customer-settlements-reporting:2026-08-15`
Grade: `A` for reporting feature existence
Source: `KZ-ACC30-CUSTOMER-REPORTS`

Official methodical material includes management reports for `Расчеты с покупателями` in Accounting KZ 3.0.

Implementation consequence:
- Tutor's eventual success criteria should go beyond document creation and include observable settlement consequences.
- Later modules can verify whether invoice/payment/realization changed customer balance/status as expected.
- The current Stage 1B payment slice may expose a simplified derived balance panel, but its accounting semantics must be evidence-backed before presented as authoritative.

---

## E5 — Configurable Taxi interface

Evidence ID: `evidence:accounting-kz:taxi-configurable-ui:2026-08-15`
Grade: `A` for interface family; `B` for selected build layout
Sources: `KZ-ACC30-PRODUCT`, `KZ-ACC30-TRANSITION`

Accounting KZ 3.0 uses the managed/Taxi application family, and user panel/command placement can be customized.

Implementation consequence:
- Atlas stores semantic regions and control relationships rather than canonical screen coordinates.
- Coach steps target component/control IDs.
- Interface Passport records one observed reference layout, not an immutable universal x/y map.

---

## Evidence-to-implementation rule

Codex may use E1–E5 to implement:
- domain objects and dependencies;
- lesson sequence;
- state-based verification;
- generic 1C-like list/form/document primitives;
- semantic coach targets.

Codex may NOT use E1–E5 alone to claim:
- exact pixel fidelity;
- exact section/command placement;
- exact required tax/legal fields;
- posting/ledger consequences;
- whether a given payment is receivable settlement vs advance in every case.

Those facts require an Interface Passport from an observed selected build and, where accounting semantics matter, methodologist/accountant validation.