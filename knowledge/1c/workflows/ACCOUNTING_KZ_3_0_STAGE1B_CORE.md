# Accounting KZ 3.0 — Stage 1B Core Workflows

Updated: 2026-08-15
Configuration: `accounting-kz`
Edition: `3.0`
Status: implementation-support knowledge

## Evidence basis

Primary exact-edition evidence:
- `KZ-ACC30-DOC` — official Accounting KZ 3.0 documentation.
- `KZ-ACC30-TRADE-TYPICAL` — official chapter `Типовые ситуации в торговой деятельности`; it explicitly defines the chain `Ввод данных о контрагенте` and, for prepaid sales, `Оформление счета покупателю` → `Регистрация безналичной оплаты от покупателя` → `Регистрация отгрузки покупателю`.
- `KZ-ACC30-CONTRACTS` — official methodical material for creation/types of counterparty contracts in Accounting KZ 3.0.
- `KZ-ACC30-REALIZATION` — official methodical material for realization of inventory/services.

Important evidence boundary: official web documentation proves the semantic workflow and terminology, but does not currently give us a legally captured, build-specific screen observation for every control position. Therefore all exact UI placement below remains `PASSPORT_REQUIRED` until observed in a selected accessible build.

---

## W1 — Create counterparty

ID: `workflow:accounting-kz:3.0:create-counterparty`
Tutor priority: `Stage 1B.1`
Confidence:
- workflow existence/role: `A`
- exact UI labels/placement: `B` until Interface Passport

### Business outcome

Create a reusable fictional counterparty record that can be selected by later sales/purchase documents and linked to a counterparty contract.

### Preconditions

- Training organization exists in seeded Tutor state.
- Learner is in the embedded Accounting KZ training workspace.
- No real BIN/IIN is required or accepted by Tutor.

### Semantic path

1. Open the functional area that exposes counterparties/customer-supplier master data.
2. Open the counterparty list.
3. Invoke creation of a new counterparty.
4. Enter the minimum Tutor scenario identity data.
5. Save the record.
6. Return to list/card state where the created counterparty can be selected later.

Exact section path and command placement: `PASSPORT_REQUIRED`.

### Tutor seed data v1

- name: `ТОО Учебный Покупатель`
- city: `Кызылорда`
- identifier: Tutor-generated obviously fictional training identifier; never a real BIN/IIN
- role/context: customer

### State assertions

The practical task passes only if training domain state contains a saved counterparty object with:
- `name == ТОО Учебный Покупатель`;
- `city == Кызылорда`;
- `isSaved == true`;
- `trainingData == true`;
- no forbidden real identifier was stored.

A typed answer containing the name does not pass the task.

### Coach checkpoints

Guided Practice should be condition-driven:
1. list opened;
2. create action invoked;
3. name field populated;
4. city field populated;
5. save action completed;
6. saved object exists.

Do not advance just because the learner clicks `Next`.

### Common learner errors to model

- opens the wrong master-data list;
- creates a record but leaves it unsaved;
- uses a different name than scenario data;
- attempts to enter a real BIN/IIN;
- closes form before save.

---

## W2 — Customer invoice

ID: `workflow:accounting-kz:3.0:customer-invoice`
Tutor priority: `Stage 1B.2`, blocked until Counterparty slice owner PASS
Confidence:
- workflow sequence: `A`
- exact document form/UI placement: `B` until Interface Passport

### Official process position

Official Accounting KZ 3.0 documentation places `Оформление счета покупателю` as the first step of `Продажа по предварительной оплате`, followed by registration of buyer payment and subsequent shipment.

### Business outcome

Create a sales invoice/offer to the fictional customer for the training item and obtain the expected total.

### Preconditions

- `ТОО Учебный Покупатель` exists and is saved.
- Training nomenclature/item exists or is seeded by the scenario.

### Tutor seed data v1

- customer: `ТОО Учебный Покупатель`
- item: `Шкаф учебный`
- quantity: `2`
- unit price: `122500 KZT`
- expected total: `245000 KZT`

### Semantic workflow

1. Open sales document workspace.
2. Create a customer invoice.
3. Select the training customer.
4. Add the training item.
5. Set quantity `2`.
6. Set/confirm unit price `122500`.
7. Ensure total resolves to `245000`.
8. Save the document.

Whether document posting is applicable to this exact invoice object must be derived from the selected Interface Passport/configuration behavior; Tutor must not invent accounting posting semantics.

### State assertions

Pass only when:
- invoice object exists;
- invoice is linked to the expected counterparty;
- exactly the required line exists;
- quantity = 2;
- unitPrice = 122500;
- calculated total = 245000;
- document state satisfies selected workflow passport (`saved` at minimum; posting rule TBD from passport).

`245000` typed into a quiz field alone must fail practical completion.

### Coach checkpoints

- sales workspace opened;
- invoice create command invoked;
- customer selected;
- line added;
- quantity correct;
- price correct;
- calculated total correct;
- save state reached.

### Common learner errors

- chooses wrong counterparty;
- quantity remains 1;
- price entered as total;
- creates extra line;
- document not saved.

---

## W3 — Register customer bank payment

ID: `workflow:accounting-kz:3.0:customer-bank-payment`
Tutor priority: `Stage 1B.3`, blocked until previous slices PASS
Confidence:
- process order/existence: `A`
- exact payment document UI/operation value: `B` until Interface Passport

### Official process position

Official Accounting KZ 3.0 `Продажа по предварительной оплате` explicitly places `Регистрация безналичной оплаты от покупателя` after `Оформление счета покупателю` and before shipment/realization.

### Business outcome

Register a fictional incoming non-cash customer payment against the training customer/invoice and update settlement state.

### Preconditions

- saved training customer exists;
- saved customer invoice exists for `245000 KZT`;
- seeded fictional bank account exists.

### Tutor seed data v1

- customer: `ТОО Учебный Покупатель`
- payment amount: `245000 KZT`
- payment method: non-cash/bank
- target: settle the training invoice/advance scenario

### Semantic workflow

1. Open bank/cash or incoming-payment workspace relevant to the selected build.
2. Create/register incoming non-cash payment from customer.
3. Select training customer.
4. Enter/confirm `245000 KZT`.
5. Associate the settlement basis according to the selected passport/workflow.
6. Save/register the payment.
7. Observe derived settlement status/balance.

Exact operation label, form fields, and settlement-link mechanics: `PASSPORT_REQUIRED`.

### State assertions

Pass only when:
- incoming payment object exists;
- type/category is customer non-cash receipt in Tutor domain;
- counterparty = expected customer;
- amount = 245000 KZT;
- payment is saved/registered;
- derived settlement state matches the scenario (invoice settled or customer advance recorded, depending on the canonical passport/accounting rule selected for Tutor).

The final assertion must not be activated until the exact settlement behavior is confirmed with primary evidence/manual specialist review.

### Coach checkpoints

- payment workspace reached;
- correct receipt type selected;
- customer selected;
- amount correct;
- settlement basis/contract/invoice relation correctly set where applicable;
- save/register action completed;
- resulting balance/status observed.

### Common learner errors

- creates outgoing instead of incoming payment;
- chooses cash instead of bank;
- selects supplier/other counterparty;
- amount differs from invoice;
- payment not linked to expected settlement basis;
- saves but does not reach required registered state.

---

## Stage 1B dependency chain

`Create Counterparty` → `Customer Invoice` → `Customer Bank Payment` → later `Shipment/Realization` → later reports/reconciliation.

This chain is not invented by Tutor: the official Accounting KZ 3.0 manual explicitly describes the prepaid-sale sequence of invoice, non-cash customer payment and shipment.

## Implementation rule

For each workflow Codex must retrieve:
1. this Workflow Record;
2. the corresponding Interface Passport;
3. evidence IDs/source IDs;
4. Tutor verification assertions;
5. unresolved questions.

If a required exact UI fact is marked `PASSPORT_REQUIRED`, Codex must not silently guess it.