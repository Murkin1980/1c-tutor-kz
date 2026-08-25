# Accounting KZ 3.0 — Stage 1B Interface Passports

Updated: 2026-08-15
Status: DRAFT / observation required

## Passport policy

These passports separate facts already supported by official documentation from build-specific observations still required before Tutor claims interface fidelity.

Do not convert an unresolved item into an implementation fact by inference.

---

## P1 — Counterparty list/card

Passport ID: `passport:accounting-kz:3.0:counterparty:create:v1`
Workflow: `workflow:accounting-kz:3.0:create-counterparty`
Target edition: Accounting KZ 3.0
UI family: managed application / Taxi

### Confirmed semantic elements

- Counterparty master data exists as a reusable accounting object.
- Counterparties participate in contracts and settlements.
- Official Accounting KZ materials explicitly include `Ввод данных о контрагенте` in a standard trading scenario.

### Required observed regions

To be captured from a legally accessible selected build:
- application section used to reach the list;
- list title;
- create command exact label;
- list command-bar placement;
- card title for new item;
- name field exact label;
- legal/tax identifier field labels if visible;
- address/city presentation;
- customer/supplier classification if present;
- contract access/creation location;
- save/save-and-close exact commands;
- resulting list/card state after save.

### Tutor implementation constraints before observation

Allowed:
- use 1C-like list → card hierarchy;
- use generic `Создать`, `Записать`, `Записать и закрыть` only as provisional labels if visibly marked in code/data as `unverified`; better: keep labels sourced through passport config so they can change without component rewrite;
- model list, form, fields and command bar as reusable primitives.

Forbidden:
- claim pixel-perfect correspondence;
- hardcode exact coordinates as canonical facts;
- require a real BIN/IIN;
- use official 1C branding/logo.

---

## P2 — Customer invoice

Passport ID: `passport:accounting-kz:3.0:customer-invoice:v1`
Workflow: `workflow:accounting-kz:3.0:customer-invoice`

### Confirmed semantic elements

Official Accounting KZ 3.0 documentation identifies `Оформление счета покупателю` as a discrete step in `Продажа по предварительной оплате`.

The training representation therefore requires these semantic concepts:
- customer/contract or settlement context;
- document lines;
- nomenclature/item;
- quantity;
- price;
- calculated document amount;
- saved document state.

### Required observed regions

- section/path to customer invoices;
- list title;
- create command;
- exact document title;
- organization/customer/contract fields and their order;
- item table column labels;
- quantity and price columns;
- total location/label;
- save/post commands and exact applicability;
- print/related-document actions if relevant;
- whether creation may begin from another object/document.

### Tutor fidelity rule

The first implemented invoice may visually approximate 1C Taxi layout, but component/data structure must make every label and region replaceable from the passport. Posting/accounting behavior must not be invented.

---

## P3 — Incoming customer bank payment

Passport ID: `passport:accounting-kz:3.0:customer-bank-payment:v1`
Workflow: `workflow:accounting-kz:3.0:customer-bank-payment`

### Confirmed semantic elements

Official Accounting KZ 3.0 documentation includes `Регистрация безналичной оплаты от покупателя` in the prepaid-sale sequence after customer invoice and before shipment.

Tutor therefore requires semantic concepts:
- incoming bank receipt/payment;
- customer;
- amount;
- organization bank account;
- settlement basis/contract/document relation where applicable;
- saved/registered state;
- derived balance/settlement status.

### Required observed regions

- exact Bank/Cash navigation path;
- exact document/type name for incoming customer payment in selected build;
- operation/type selector if used;
- customer, bank account, amount and payment-purpose labels;
- contract/settlement-document selectors;
- save/post/register commands;
- derived state visible after completion;
- relationship to bank statement workflow.

### Accounting behavior gate

The Tutor must not teach whether the payment closes receivable or creates an advance until the exact scenario is reviewed against the selected Accounting KZ 3.0 behavior and accounting methodology. This assertion remains disabled until evidence is A-grade or specialist-approved.

---

## Observation checklist

For each passport capture:
- selected configuration edition/build;
- platform build if visible/relevant;
- observation date;
- source/access method;
- viewport/window class;
- screenshot reference stored only when licensing permits;
- visible section path;
- screen title;
- commands and fields;
- conditional controls;
- save/post state transitions;
- deviations caused by user UI customization.

## Why semantic anchors matter

Accounting KZ 3.0 uses a configurable managed/Taxi interface. Panel and command placement may be customized. Therefore Tutor guidance should anchor to semantic control IDs and screen state, not to a fixed x/y coordinate. Visual highlighting may compute geometry at runtime from the simulated component tree.