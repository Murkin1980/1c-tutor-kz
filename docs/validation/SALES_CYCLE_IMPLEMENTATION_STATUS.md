# Session 06 — Продажа по предоплате: implementation status

Date: 2026-10-15
Decision: `EXTEND_EXISTING`
Status: `ENGINEERING GATE PASS / PENDING OWNER REVIEW`
Route: `/learn/sales-prepayment-cycle`
Coverage units: `AKZ-M03-L02` (invoice), `AKZ-M03-L03` (incoming payment/advance), `AKZ-M03-L04` (realization)
Base implementation: Arena commit `e47c100` from `mpe/stage-1-validation` @ `883b42a`; corrected on `codex/sales-cycle-integration`. `origin/main` was not merged.

Spec reconciliation: the later `agent/antigravity-sales-cycle-spec` draft conflicts with the implementation (100% prepayment / zero balance versus 50% prepayment / remaining debt) and contains unsupported settlement semantics. The owner-directed Arena scenario remains canonical because it is more diagnostic and stays inside the existing Atlas boundary. The Antigravity draft is not merged.

## Scenario (fictional data, KZT, ru-KZ formatting)

- Customer: `ТОО Учебный Покупатель` (Кызылорда); distractors `ИП Учебный Заказчик`, `ТОО Учебный Клиент`.
- Invoice lines: `Шкаф учебный` 2 × 122 500 ₸, `Стол учебный` 1 × 85 000 ₸ → 330 000 ₸ (calculated, never typed). Distractor item `Стул учебный`.
- Terms: 50% prepayment before shipment → incoming payment 165 000 ₸ linked to the invoice.
- Realization on the basis of the invoice (lines copied) → shipped 330 000 ₸.
- Expected final settlement: customer debt 165 000 ₸ (advance 165 000 ₸ before shipment).

## Domain model (`domain/salesCycleScenario.ts`)

- `TrainingCustomer`, `TrainingItem` (price list).
- `CustomerInvoice` with `DocumentLine[]`; state `saved` (an invoice is written, not posted).
- `IncomingPayment` (`customer_bank_receipt`) with customer, `basisInvoiceId`, amount; state `saved | posted`.
- `Realization` with basis invoice, copied lines; state `saved | posted`.
- Open form = editable draft (`SalesCycleForm`); unsaved drafts never count. `isFormDirty` shows unsaved changes.
- `calculateTotal(lines)` is the only source of a total. `calculateSettlement` = posted realizations − posted payments (positive = debt, negative = advance).
- Commands: `Записать`, `Провести`, `Отменить проведение`, `Закрыть`, creation from lists and «на основании» from the invoice.

## Learning modes

- Demo (`Показать`): «Показать действие» step-by-step or «Показать всю цепочку» autoplay through the full chain. Verification shows results but never sets `completed`/`completionKind`.
- Guided (`Вести меня`): condition-driven next step with stage chip, `Почему?` (business meaning), 2-level hint, «Сделать за меня», chain stepper, Driver.js turquoise beacon. Any hint/show-action ⇒ `completed_assisted`.
- Independent (`Проверить себя`): coach, hints, beacon, stepper, start cue and diagnostic exercise are hidden. Without help ⇒ `completed_unassisted`.
- Intentional error state (Guided → «Разбор ошибки»): correct invoice, posted payment 16 500 ₸ (typo), realization only saved. The learner fixes the existing documents without «Начать заново». A preloaded chain is always counted as assisted.

## Verification assertions (`domain/salesCycleVerification.ts`)

1. `invoice.customer` — правильный покупатель в счёте.
2. `invoice.lines` — корректные позиции (item, quantity, price; no extra lines).
3. `invoice.total` — сумма 330 000 ₸ рассчитана системой из строк.
4. `invoice.saved` — счёт записан (unsaved form reports «заполняется, но ещё не записан»).
5. `payment.linked` — проведённое поступление от покупателя связано со счётом-основанием (unlinked / wrong payer / saved-not-posted reported separately).
6. `payment.amount` — сумма предоплаты 165 000 ₸ по проведённым связанным поступлениям.
7. `realization.posted` — реализация на основании счёта проведена.
8. `settlement.balance` — остаток по явно обозначенной учебной модели Tutor = долг 165 000 ₸.

Each assertion exposes expected / actual / hint. A separately entered correct number cannot pass: totals and balances are derived from persisted documents only (covered by unit tests).

## Progress

Reuses `useProgress` / `LessonProgress` (local + optional MiniBase sync, unchanged): `practiceMode`, `hintCount`, `showActionCount`, `resetCount`, `attemptCount`, `answer` (per-assertion pass map), `completionKind`. New `mergeLessonProgress` prevents a later Demo/retry/assisted run from downgrading an earlier completion; an unassisted completion upgrades an assisted one.

## Reuse / refactor

Extracted from the customer-card workspace without behavior change: `shared/useGuidanceBeacon.ts` (Driver.js beacon), `shared/TrainingChrome.tsx` (`Target`, `TrainingHeader`, `VerificationResults`). Customer-card E2E 8/8 still pass, including the beacon color/position checks.

## Engineering checks (2026-10-15, sandbox, Node 22)

| Command                           | Result                                           |
| --------------------------------- | ------------------------------------------------ |
| `npm run lint`                    | PASS                                             |
| `npm run typecheck`               | PASS                                             |
| `npm run test`                    | PASS — 9 files, 55 tests                         |
| `npm run build`                   | PASS                                             |
| `npm run build:functions`         | PASS                                             |
| `npm run check:secrets`           | PASS                                             |
| `npm run check:curriculum`        | PASS — 77 units, 29 sessions                     |
| `npm run test:e2e -- --workers=1` | PASS — 20/20 (desktop 1440×900 + mobile 360×800) |

E2E browser note: the sandbox could not download Playwright's Chrome; a Chromium build from the npm package `@sparticuz/chromium` was installed at `/opt/google/chrome/chrome` outside the repository to satisfy `channel: "chrome"`. No repository config was changed for this.

## Known gaps / not verified

- Observation-grade Interface Passport for invoice, bank receipt and realization forms (labels/placement are semantic, not pixel-accurate).
- Settlement rule is visibly labeled in the learner interface as a Tutor teaching model; Atlas W3 still requires specialist review of exact settlement behavior.
- MiniBase synchronizes `LessonProgress`, including per-assertion results and completion kind. Live simulated documents intentionally remain resettable local workspace state and are not synchronized.
- No contract/договор, VAT, accounting entries or ESF in this session (by scope).
- Manual owner walkthrough on a physical phone, real touch keyboards and screen readers not performed; mobile verified at 360 px viewport in headless Chromium.
- Workspace state is not persisted across page reloads (only progress is).

## Owner review

Decision: `PENDING`.
