// Sales by prepayment: invoice → incoming payment (advance) → realization → settlement control.
// Deterministic Tutor training domain. All data is fictional; amounts are KZT.
// This is a semantic teaching model of the Accounting KZ 3.0 workflow, not a clone of 1C.

export const SALES_CYCLE_LESSON_ID = "sales-prepayment-cycle";

export type SalesCycleScreen =
  | "home"
  | "sales"
  | "bank"
  | "invoice-list"
  | "invoice-form"
  | "payment-list"
  | "payment-form"
  | "realization-list"
  | "realization-form"
  | "settlements";

/** Lifecycle of a training document. Invoices are only written ("saved"), never posted. */
export type DocumentStatus = "saved" | "posted";

export interface TrainingCustomer {
  id: string;
  name: string;
  city: string;
}

export interface TrainingItem {
  id: string;
  name: string;
  unit: string;
  price: number;
}

export interface DocumentLine {
  id: string;
  itemId: string;
  quantity: number;
  price: number;
}

export interface CustomerInvoice {
  id: string;
  number: string;
  customerId: string;
  lines: DocumentLine[];
  status: "saved";
}

export interface IncomingPayment {
  id: string;
  number: string;
  kind: "customer_bank_receipt";
  customerId: string;
  basisInvoiceId: string | null;
  amount: number;
  status: DocumentStatus;
}

export interface Realization {
  id: string;
  number: string;
  customerId: string;
  basisInvoiceId: string;
  lines: DocumentLine[];
  status: DocumentStatus;
}

export interface DraftLine {
  id: string;
  itemId: string;
  quantityText: string;
  priceText: string;
}

export type SalesCycleForm =
  | {
      kind: "invoice";
      docId: string | null;
      customerId: string;
      lines: DraftLine[];
      error: string | null;
    }
  | {
      kind: "payment";
      docId: string | null;
      customerId: string;
      basisInvoiceId: string;
      amountText: string;
      error: string | null;
    }
  | {
      kind: "realization";
      docId: string | null;
      basisInvoiceId: string;
      error: string | null;
    };

export interface SalesCycleState {
  screen: SalesCycleScreen;
  customers: TrainingCustomer[];
  items: TrainingItem[];
  invoices: CustomerInvoice[];
  payments: IncomingPayment[];
  realizations: Realization[];
  form: SalesCycleForm | null;
  /** Set when the settlement report is opened after the last document change; guidance only, never verification. */
  settlementsViewed: boolean;
  nextId: number;
  actionLog: string[];
}

export const SALES_CYCLE_CUSTOMERS: TrainingCustomer[] = [
  {
    id: "customer-uchebny-pokupatel",
    name: "ТОО Учебный Покупатель",
    city: "Кызылорда",
  },
  {
    id: "customer-uchebny-zakazchik",
    name: "ИП Учебный Заказчик",
    city: "Алматы",
  },
  {
    id: "customer-uchebny-klient",
    name: "ТОО Учебный Клиент",
    city: "Шымкент",
  },
];

export const SALES_CYCLE_ITEMS: TrainingItem[] = [
  { id: "item-shkaf", name: "Шкаф учебный", unit: "шт", price: 122500 },
  { id: "item-stol", name: "Стол учебный", unit: "шт", price: 85000 },
  { id: "item-stul", name: "Стул учебный", unit: "шт", price: 18000 },
];

export const SALES_CYCLE_EXPECTED = {
  customerId: "customer-uchebny-pokupatel",
  customerName: "ТОО Учебный Покупатель",
  lines: [
    { itemId: "item-shkaf", quantity: 2, price: 122500 },
    { itemId: "item-stol", quantity: 1, price: 85000 },
  ],
  invoiceTotal: 330000,
  prepaymentShare: 0.5,
  prepaymentAmount: 165000,
  /** Positive = customer debt (receivable); negative = advance received. */
  finalBalance: 165000,
} as const;

export const SALES_CYCLE_DATE = "12.10.2026";

export const createSalesCycleSeed = (): SalesCycleState => ({
  screen: "home",
  customers: SALES_CYCLE_CUSTOMERS,
  items: SALES_CYCLE_ITEMS,
  invoices: [],
  payments: [],
  realizations: [],
  form: null,
  settlementsViewed: false,
  nextId: 1,
  actionLog: [],
});

/**
 * Intentionally wrong chain for the diagnostic exercise: the invoice is correct,
 * but the bank receipt has a typo (16 500 instead of 165 000) and the realization
 * was only written, not posted. The learner fixes it without a full reset.
 */
export const createSalesCycleDiagnosticSeed = (): SalesCycleState => ({
  ...createSalesCycleSeed(),
  screen: "sales",
  invoices: [
    {
      id: "invoice-1",
      number: "СЧ-0001",
      customerId: SALES_CYCLE_EXPECTED.customerId,
      lines: [
        { id: "line-1", itemId: "item-shkaf", quantity: 2, price: 122500 },
        { id: "line-2", itemId: "item-stol", quantity: 1, price: 85000 },
      ],
      status: "saved",
    },
  ],
  payments: [
    {
      id: "payment-1",
      number: "ПТС-0001",
      kind: "customer_bank_receipt",
      customerId: SALES_CYCLE_EXPECTED.customerId,
      basisInvoiceId: "invoice-1",
      amount: 16500,
      status: "posted",
    },
  ],
  realizations: [
    {
      id: "realization-1",
      number: "РТУ-0001",
      customerId: SALES_CYCLE_EXPECTED.customerId,
      basisInvoiceId: "invoice-1",
      lines: [
        { id: "line-3", itemId: "item-shkaf", quantity: 2, price: 122500 },
        { id: "line-4", itemId: "item-stol", quantity: 1, price: 85000 },
      ],
      status: "saved",
    },
  ],
  nextId: 5,
  actionLog: ["diagnostic.loaded"],
});

// ---------- pure calculations / selectors (shared by UI, guidance and verification) ----------

const moneyFormatter = new Intl.NumberFormat("ru-KZ", {
  style: "currency",
  currency: "KZT",
  maximumFractionDigits: 0,
});

export const formatKzt = (amount: number) => moneyFormatter.format(amount);

/** Parses learner-typed numbers such as "165000", "165 000" or "165 000,00". */
export function parseAmount(text: string): number | null {
  const normalized = text.replace(/[\s\u00a0\u202f₸]/g, "").replace(",", ".");
  if (!normalized) return null;
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export const lineAmount = (line: Pick<DocumentLine, "quantity" | "price">) =>
  Math.round(line.quantity * line.price * 100) / 100;

/** The only source of a document total: always calculated from lines, never typed. */
export const calculateTotal = (
  lines: Pick<DocumentLine, "quantity" | "price">[],
) => lines.reduce((sum, line) => sum + lineAmount(line), 0);

export const draftLineValues = (line: DraftLine) => ({
  itemId: line.itemId,
  quantity: parseAmount(line.quantityText),
  price: parseAmount(line.priceText),
});

export const calculateDraftTotal = (lines: DraftLine[]) =>
  lines.reduce((sum, line) => {
    const { quantity, price } = draftLineValues(line);
    return quantity && price ? sum + lineAmount({ quantity, price }) : sum;
  }, 0);

export const findCustomer = (
  state: SalesCycleState,
  id: string | null | undefined,
) => state.customers.find((customer) => customer.id === id);

export const findItem = (
  state: SalesCycleState,
  id: string | null | undefined,
) => state.items.find((item) => item.id === id);

export const findInvoice = (
  state: SalesCycleState,
  id: string | null | undefined,
) => state.invoices.find((invoice) => invoice.id === id);

export const linesMatchExpected = (
  lines: Pick<DocumentLine, "itemId" | "quantity" | "price">[],
) =>
  lines.length === SALES_CYCLE_EXPECTED.lines.length &&
  SALES_CYCLE_EXPECTED.lines.every((expected) =>
    lines.some(
      (line) =>
        line.itemId === expected.itemId &&
        line.quantity === expected.quantity &&
        line.price === expected.price,
    ),
  );

export interface SettlementSummary {
  shipped: number;
  paid: number;
  /** shipped − paid. Positive = customer debt, negative = advance received. */
  balance: number;
}

/** Settlement balance is derived only from posted documents. Saved/draft documents do not move it. */
export function calculateSettlement(
  state: SalesCycleState,
  customerId: string,
): SettlementSummary {
  const shipped = state.realizations
    .filter((doc) => doc.customerId === customerId && doc.status === "posted")
    .reduce((sum, doc) => sum + calculateTotal(doc.lines), 0);
  const paid = state.payments
    .filter((doc) => doc.customerId === customerId && doc.status === "posted")
    .reduce((sum, doc) => sum + doc.amount, 0);
  return { shipped, paid, balance: shipped - paid };
}

export function describeBalance(balance: number) {
  if (balance > 0) return `Долг покупателя ${formatKzt(balance)}`;
  if (balance < 0) return `Аванс покупателя ${formatKzt(-balance)}`;
  return "Расчёты закрыты, остаток 0 ₸";
}

/** The invoice the chain is built on: the realization basis, else the expected customer's invoice, else the latest. */
export function selectChainInvoice(
  state: SalesCycleState,
): CustomerInvoice | undefined {
  const realizationBasis = [...state.realizations]
    .reverse()
    .map((doc) => findInvoice(state, doc.basisInvoiceId))
    .find(Boolean);
  if (realizationBasis) return realizationBasis;
  const expectedCustomer = [...state.invoices]
    .reverse()
    .find((invoice) => invoice.customerId === SALES_CYCLE_EXPECTED.customerId);
  return expectedCustomer ?? state.invoices[state.invoices.length - 1];
}

export const isFormDirty = (state: SalesCycleState) => {
  const form = state.form;
  if (!form) return false;
  if (!form.docId) return true;
  if (form.kind === "invoice") {
    const doc = findInvoice(state, form.docId);
    if (!doc) return true;
    const values = form.lines.map(draftLineValues);
    return (
      doc.customerId !== form.customerId ||
      doc.lines.length !== values.length ||
      doc.lines.some(
        (line, index) =>
          line.itemId !== values[index].itemId ||
          line.quantity !== values[index].quantity ||
          line.price !== values[index].price,
      )
    );
  }
  if (form.kind === "payment") {
    const doc = state.payments.find((payment) => payment.id === form.docId);
    return (
      !doc ||
      doc.customerId !== form.customerId ||
      (doc.basisInvoiceId ?? "") !== form.basisInvoiceId ||
      doc.amount !== parseAmount(form.amountText)
    );
  }
  const doc = state.realizations.find(
    (realization) => realization.id === form.docId,
  );
  return !doc || doc.basisInvoiceId !== form.basisInvoiceId;
};

// ---------- commands ----------

export type SalesCycleCommand =
  | {
      type: "NAVIGATE";
      screen:
        | "home"
        | "sales"
        | "bank"
        | "invoice-list"
        | "payment-list"
        | "realization-list"
        | "settlements";
    }
  | { type: "CREATE_INVOICE" }
  | { type: "OPEN_INVOICE"; id: string }
  | { type: "SET_INVOICE_CUSTOMER"; customerId: string }
  | { type: "ADD_INVOICE_LINE" }
  | { type: "SET_LINE_ITEM"; lineId: string; itemId: string }
  | { type: "SET_LINE_QUANTITY"; lineId: string; value: string }
  | { type: "SET_LINE_PRICE"; lineId: string; value: string }
  | { type: "REMOVE_INVOICE_LINE"; lineId: string }
  | { type: "CREATE_PAYMENT"; basisInvoiceId?: string }
  | { type: "OPEN_PAYMENT"; id: string }
  | { type: "SET_PAYMENT_CUSTOMER"; customerId: string }
  | { type: "SET_PAYMENT_BASIS"; invoiceId: string }
  | { type: "SET_PAYMENT_AMOUNT"; value: string }
  | { type: "CREATE_REALIZATION"; basisInvoiceId?: string }
  | { type: "OPEN_REALIZATION"; id: string }
  | { type: "SET_REALIZATION_BASIS"; invoiceId: string }
  | { type: "SAVE_DOCUMENT" }
  | { type: "POST_DOCUMENT" }
  | { type: "UNPOST_DOCUMENT" }
  | { type: "CLOSE_FORM" }
  | { type: "LOAD_DIAGNOSTIC_CASE" }
  | { type: "RESET" };

const listScreenFor = {
  invoice: "invoice-list",
  payment: "payment-list",
  realization: "realization-list",
} as const;
const formScreenFor = {
  invoice: "invoice-form",
  payment: "payment-form",
  realization: "realization-form",
} as const;
const pad = (value: number) => String(value).padStart(4, "0");

function withForm(
  state: SalesCycleState,
  form: SalesCycleForm,
  event: string,
): SalesCycleState {
  return {
    ...state,
    form,
    screen: formScreenFor[form.kind],
    actionLog: [...state.actionLog, event],
  };
}

function updateForm<K extends SalesCycleForm["kind"]>(
  state: SalesCycleState,
  kind: K,
  patch: (
    form: Extract<SalesCycleForm, { kind: K }>,
  ) => Extract<SalesCycleForm, { kind: K }>,
  event: string,
): SalesCycleState {
  if (state.form?.kind !== kind) return state;
  const next = patch(state.form as Extract<SalesCycleForm, { kind: K }>);
  return {
    ...state,
    form: { ...next, error: null },
    actionLog: [...state.actionLog, event],
  };
}

function setFormError(state: SalesCycleState, error: string): SalesCycleState {
  if (!state.form) return state;
  return {
    ...state,
    form: { ...state.form, error },
    actionLog: [...state.actionLog, "form.validation-error"],
  };
}

/** Writes the open form to the document list. Returns an error message when required data is missing. */
function persistForm(
  state: SalesCycleState,
  targetStatus: "keep" | DocumentStatus,
): SalesCycleState | string {
  const form = state.form;
  if (!form) return "Нет открытой формы.";
  let nextId = state.nextId;
  const newId = (prefix: string) => `${prefix}-${nextId++}`;

  if (form.kind === "invoice") {
    if (!findCustomer(state, form.customerId))
      return "Не заполнено поле «Покупатель».";
    if (form.lines.length === 0) return "Добавьте хотя бы одну строку товаров.";
    const lines: DocumentLine[] = [];
    for (const draft of form.lines) {
      const { itemId, quantity, price } = draftLineValues(draft);
      if (!findItem(state, itemId)) return "В строке не выбрана номенклатура.";
      if (!quantity || quantity <= 0)
        return "Количество должно быть положительным числом.";
      if (!price || price <= 0) return "Цена должна быть положительным числом.";
      lines.push({ id: draft.id, itemId, quantity, price });
    }
    const existing = findInvoice(state, form.docId);
    const id = existing?.id ?? newId("invoice");
    const invoice: CustomerInvoice = {
      id,
      number: existing?.number ?? `СЧ-${pad(state.invoices.length + 1)}`,
      customerId: form.customerId,
      lines,
      status: "saved",
    };
    const invoices = existing
      ? state.invoices.map((doc) => (doc.id === id ? invoice : doc))
      : [...state.invoices, invoice];
    return {
      ...state,
      invoices,
      nextId,
      form: { ...form, docId: id, error: null },
    };
  }

  if (form.kind === "payment") {
    if (!findCustomer(state, form.customerId))
      return "Не заполнено поле «Плательщик».";
    const amount = parseAmount(form.amountText);
    if (!amount || amount <= 0)
      return "Сумма платежа должна быть положительным числом.";
    const existing = state.payments.find((doc) => doc.id === form.docId);
    const id = existing?.id ?? newId("payment");
    const payment: IncomingPayment = {
      id,
      number: existing?.number ?? `ПТС-${pad(state.payments.length + 1)}`,
      kind: "customer_bank_receipt",
      customerId: form.customerId,
      basisInvoiceId: form.basisInvoiceId || null,
      amount,
      status:
        targetStatus === "keep" ? (existing?.status ?? "saved") : targetStatus,
    };
    const payments = existing
      ? state.payments.map((doc) => (doc.id === id ? payment : doc))
      : [...state.payments, payment];
    return {
      ...state,
      payments,
      nextId,
      form: { ...form, docId: id, error: null },
    };
  }

  const basis = findInvoice(state, form.basisInvoiceId);
  if (!basis) return "Выберите счёт-основание: реализация заполняется по нему.";
  const existing = state.realizations.find((doc) => doc.id === form.docId);
  const id = existing?.id ?? newId("realization");
  const lines =
    existing && existing.basisInvoiceId === basis.id
      ? existing.lines
      : basis.lines.map((line) => ({ ...line, id: newId("line") }));
  const realization: Realization = {
    id,
    number: existing?.number ?? `РТУ-${pad(state.realizations.length + 1)}`,
    customerId: basis.customerId,
    basisInvoiceId: basis.id,
    lines,
    status:
      targetStatus === "keep" ? (existing?.status ?? "saved") : targetStatus,
  };
  const realizations = existing
    ? state.realizations.map((doc) => (doc.id === id ? realization : doc))
    : [...state.realizations, realization];
  return {
    ...state,
    realizations,
    nextId,
    form: { ...form, docId: id, error: null },
  };
}

export function reduceSalesCycleState(
  state: SalesCycleState,
  command: SalesCycleCommand,
): SalesCycleState {
  const log = (event: string) => [...state.actionLog, event];

  switch (command.type) {
    case "NAVIGATE":
      return {
        ...state,
        screen: command.screen,
        form: null,
        settlementsViewed:
          state.settlementsViewed || command.screen === "settlements",
        actionLog: log(`nav.${command.screen}`),
      };

    case "CREATE_INVOICE":
      return withForm(
        state,
        {
          kind: "invoice",
          docId: null,
          customerId: "",
          lines: [],
          error: null,
        },
        "invoice.create",
      );

    case "OPEN_INVOICE": {
      const doc = findInvoice(state, command.id);
      if (!doc) return state;
      return withForm(
        state,
        {
          kind: "invoice",
          docId: doc.id,
          customerId: doc.customerId,
          lines: doc.lines.map((line) => ({
            id: line.id,
            itemId: line.itemId,
            quantityText: String(line.quantity),
            priceText: String(line.price),
          })),
          error: null,
        },
        "invoice.open",
      );
    }

    case "SET_INVOICE_CUSTOMER":
      return updateForm(
        state,
        "invoice",
        (form) => ({ ...form, customerId: command.customerId }),
        "invoice.customer",
      );

    case "ADD_INVOICE_LINE": {
      if (state.form?.kind !== "invoice") return state;
      const line: DraftLine = {
        id: `line-${state.nextId}`,
        itemId: "",
        quantityText: "1",
        priceText: "",
      };
      return {
        ...updateForm(
          state,
          "invoice",
          (form) => ({ ...form, lines: [...form.lines, line] }),
          "invoice.line.add",
        ),
        nextId: state.nextId + 1,
      };
    }

    case "SET_LINE_ITEM": {
      const item = findItem(state, command.itemId);
      return updateForm(
        state,
        "invoice",
        (form) => ({
          ...form,
          lines: form.lines.map((line) =>
            line.id === command.lineId
              ? {
                  ...line,
                  itemId: command.itemId,
                  priceText: item ? String(item.price) : line.priceText,
                }
              : line,
          ),
        }),
        "invoice.line.item",
      );
    }

    case "SET_LINE_QUANTITY":
      return updateForm(
        state,
        "invoice",
        (form) => ({
          ...form,
          lines: form.lines.map((line) =>
            line.id === command.lineId
              ? { ...line, quantityText: command.value }
              : line,
          ),
        }),
        "invoice.line.quantity",
      );

    case "SET_LINE_PRICE":
      return updateForm(
        state,
        "invoice",
        (form) => ({
          ...form,
          lines: form.lines.map((line) =>
            line.id === command.lineId
              ? { ...line, priceText: command.value }
              : line,
          ),
        }),
        "invoice.line.price",
      );

    case "REMOVE_INVOICE_LINE":
      return updateForm(
        state,
        "invoice",
        (form) => ({
          ...form,
          lines: form.lines.filter((line) => line.id !== command.lineId),
        }),
        "invoice.line.remove",
      );

    case "CREATE_PAYMENT": {
      const basis = findInvoice(state, command.basisInvoiceId);
      return withForm(
        state,
        {
          kind: "payment",
          docId: null,
          customerId: basis?.customerId ?? "",
          basisInvoiceId: basis?.id ?? "",
          amountText: "",
          error: null,
        },
        basis ? "payment.create-from-invoice" : "payment.create",
      );
    }

    case "OPEN_PAYMENT": {
      const doc = state.payments.find((payment) => payment.id === command.id);
      if (!doc) return state;
      return withForm(
        state,
        {
          kind: "payment",
          docId: doc.id,
          customerId: doc.customerId,
          basisInvoiceId: doc.basisInvoiceId ?? "",
          amountText: String(doc.amount),
          error: null,
        },
        "payment.open",
      );
    }

    case "SET_PAYMENT_CUSTOMER":
      return updateForm(
        state,
        "payment",
        (form) => ({
          ...form,
          customerId: command.customerId,
          basisInvoiceId:
            findInvoice(state, form.basisInvoiceId)?.customerId ===
            command.customerId
              ? form.basisInvoiceId
              : "",
        }),
        "payment.customer",
      );

    case "SET_PAYMENT_BASIS": {
      const basis = findInvoice(state, command.invoiceId);
      return updateForm(
        state,
        "payment",
        (form) => ({
          ...form,
          basisInvoiceId: basis?.id ?? "",
          customerId: basis?.customerId ?? form.customerId,
        }),
        "payment.basis",
      );
    }

    case "SET_PAYMENT_AMOUNT":
      return updateForm(
        state,
        "payment",
        (form) => ({ ...form, amountText: command.value }),
        "payment.amount",
      );

    case "CREATE_REALIZATION": {
      const basis = findInvoice(state, command.basisInvoiceId);
      return withForm(
        state,
        {
          kind: "realization",
          docId: null,
          basisInvoiceId: basis?.id ?? "",
          error: null,
        },
        basis ? "realization.create-from-invoice" : "realization.create",
      );
    }

    case "OPEN_REALIZATION": {
      const doc = state.realizations.find(
        (realization) => realization.id === command.id,
      );
      if (!doc) return state;
      return withForm(
        state,
        {
          kind: "realization",
          docId: doc.id,
          basisInvoiceId: doc.basisInvoiceId,
          error: null,
        },
        "realization.open",
      );
    }

    case "SET_REALIZATION_BASIS":
      return updateForm(
        state,
        "realization",
        (form) => ({ ...form, basisInvoiceId: command.invoiceId }),
        "realization.basis",
      );

    case "SAVE_DOCUMENT": {
      const result = persistForm(state, "keep");
      if (typeof result === "string") return setFormError(state, result);
      return {
        ...result,
        settlementsViewed: false,
        actionLog: log(`${state.form?.kind}.saved`),
      };
    }

    case "POST_DOCUMENT": {
      if (!state.form || state.form.kind === "invoice") return state;
      const result = persistForm(state, "posted");
      if (typeof result === "string") return setFormError(state, result);
      return {
        ...result,
        settlementsViewed: false,
        actionLog: log(`${state.form.kind}.posted`),
      };
    }

    case "UNPOST_DOCUMENT": {
      const form = state.form;
      if (!form || form.kind === "invoice" || !form.docId) return state;
      if (form.kind === "payment") {
        return {
          ...state,
          payments: state.payments.map((doc) =>
            doc.id === form.docId ? { ...doc, status: "saved" } : doc,
          ),
          settlementsViewed: false,
          actionLog: log("payment.unposted"),
        };
      }
      return {
        ...state,
        realizations: state.realizations.map((doc) =>
          doc.id === form.docId ? { ...doc, status: "saved" } : doc,
        ),
        settlementsViewed: false,
        actionLog: log("realization.unposted"),
      };
    }

    case "CLOSE_FORM":
      if (!state.form) return state;
      return {
        ...state,
        screen: listScreenFor[state.form.kind],
        form: null,
        actionLog: log(`${state.form.kind}.closed`),
      };

    case "LOAD_DIAGNOSTIC_CASE":
      return createSalesCycleDiagnosticSeed();

    case "RESET":
      return createSalesCycleSeed();
  }
}
