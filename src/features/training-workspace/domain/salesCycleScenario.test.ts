import { describe, expect, it } from "vitest";
import {
  mergeLessonProgress,
  type LessonProgress,
} from "../../progress/progress";
import {
  getSalesCycleGuidance,
  getSalesCycleProgress,
} from "../guidance/salesCycleGuidance";
import {
  calculateSettlement,
  createSalesCycleDiagnosticSeed,
  createSalesCycleSeed,
  parseAmount,
  reduceSalesCycleState,
  SALES_CYCLE_EXPECTED,
  type SalesCycleCommand,
  type SalesCycleState,
} from "./salesCycleScenario";
import { verifySalesCycleState } from "./salesCycleVerification";

const CUSTOMER = SALES_CYCLE_EXPECTED.customerId;

const apply = (state: SalesCycleState, ...commands: SalesCycleCommand[]) =>
  commands.reduce(reduceSalesCycleState, state);

const assertion = (state: SalesCycleState, id: string) => {
  const found = verifySalesCycleState(state).assertions.find(
    (item) => item.id === id,
  );
  if (!found) throw new Error(`assertion ${id} missing`);
  return found;
};

const lineIds = (state: SalesCycleState) =>
  state.form?.kind === "invoice" ? state.form.lines.map((line) => line.id) : [];

/** Fills the invoice form; `save` controls whether it is written. */
function fillInvoice(
  state: SalesCycleState,
  {
    quantity = "2",
    customerId = CUSTOMER as string,
    save = true,
  }: { quantity?: string; customerId?: string; save?: boolean } = {},
) {
  let next = apply(
    state,
    { type: "NAVIGATE", screen: "invoice-list" },
    { type: "CREATE_INVOICE" },
  );
  next = apply(
    next,
    { type: "SET_INVOICE_CUSTOMER", customerId },
    { type: "ADD_INVOICE_LINE" },
  );
  const [first] = lineIds(next);
  next = apply(
    next,
    { type: "SET_LINE_ITEM", lineId: first, itemId: "item-shkaf" },
    { type: "SET_LINE_QUANTITY", lineId: first, value: quantity },
  );
  next = apply(next, { type: "ADD_INVOICE_LINE" });
  const second = lineIds(next)[1];
  next = apply(next, {
    type: "SET_LINE_ITEM",
    lineId: second,
    itemId: "item-stol",
  });
  return save ? apply(next, { type: "SAVE_DOCUMENT" }) : next;
}

function addPayment(
  state: SalesCycleState,
  { amount = "165 000", post = true, basis = true } = {},
) {
  const invoiceId = state.invoices[0]?.id ?? "";
  let next = apply(
    state,
    { type: "NAVIGATE", screen: "payment-list" },
    { type: "CREATE_PAYMENT" },
  );
  next = apply(next, { type: "SET_PAYMENT_CUSTOMER", customerId: CUSTOMER });
  if (basis) next = apply(next, { type: "SET_PAYMENT_BASIS", invoiceId });
  next = apply(next, { type: "SET_PAYMENT_AMOUNT", value: amount });
  return apply(next, { type: post ? "POST_DOCUMENT" : "SAVE_DOCUMENT" });
}

function addRealization(state: SalesCycleState, { post = true } = {}) {
  const invoiceId = state.invoices[0]?.id ?? "";
  const next = apply(
    state,
    { type: "NAVIGATE", screen: "realization-list" },
    { type: "CREATE_REALIZATION" },
    { type: "SET_REALIZATION_BASIS", invoiceId },
  );
  return apply(next, { type: post ? "POST_DOCUMENT" : "SAVE_DOCUMENT" });
}

const completeChain = () =>
  addRealization(addPayment(fillInvoice(createSalesCycleSeed())));

describe("sales-by-prepayment domain model", () => {
  it("calculates invoice totals and the settlement balance from documents only", () => {
    const state = completeChain();
    expect(state.invoices).toHaveLength(1);
    expect(state.invoices[0].lines).toEqual([
      expect.objectContaining({
        itemId: "item-shkaf",
        quantity: 2,
        price: 122500,
      }),
      expect.objectContaining({
        itemId: "item-stol",
        quantity: 1,
        price: 85000,
      }),
    ]);
    expect(state.payments[0]).toMatchObject({
      customerId: CUSTOMER,
      basisInvoiceId: state.invoices[0].id,
      amount: 165000,
      status: "posted",
    });
    expect(state.realizations[0]).toMatchObject({
      customerId: CUSTOMER,
      basisInvoiceId: state.invoices[0].id,
      status: "posted",
    });
    expect(calculateSettlement(state, CUSTOMER)).toEqual({
      shipped: 330000,
      paid: 165000,
      balance: 165000,
    });
  });

  it("shows an advance before shipment and a debt after it", () => {
    const paid = addPayment(fillInvoice(createSalesCycleSeed()));
    expect(calculateSettlement(paid, CUSTOMER).balance).toBe(-165000);
    expect(calculateSettlement(addRealization(paid), CUSTOMER).balance).toBe(
      165000,
    );
  });

  it("does not persist an invoice without a customer and explains why", () => {
    const state = apply(
      createSalesCycleSeed(),
      { type: "CREATE_INVOICE" },
      { type: "ADD_INVOICE_LINE" },
      { type: "SAVE_DOCUMENT" },
    );
    expect(state.invoices).toHaveLength(0);
    expect(state.form?.error).toBe("Не заполнено поле «Покупатель».");
  });

  it("unposting a document removes it from the settlement balance", () => {
    let state = completeChain();
    state = apply(
      state,
      { type: "OPEN_REALIZATION", id: state.realizations[0].id },
      { type: "UNPOST_DOCUMENT" },
    );
    expect(calculateSettlement(state, CUSTOMER).balance).toBe(-165000);
  });

  it("parses learner-typed KZT amounts", () => {
    expect(parseAmount("165 000")).toBe(165000);
    expect(parseAmount("165\u00a0000 ₸")).toBe(165000);
    expect(parseAmount("16,5")).toBe(16.5);
    expect(parseAmount("abc")).toBeNull();
    expect(parseAmount("")).toBeNull();
  });
});

describe("sales-by-prepayment verification", () => {
  it("fails every assertion for an empty chain", () => {
    const result = verifySalesCycleState(createSalesCycleSeed());
    expect(result.passed).toBe(false);
    expect(result.assertions.map((item) => item.id)).toEqual([
      "invoice.customer",
      "invoice.lines",
      "invoice.total",
      "invoice.saved",
      "payment.linked",
      "payment.amount",
      "realization.posted",
      "settlement.balance",
    ]);
    expect(result.assertions.every((item) => !item.passed)).toBe(true);
  });

  it("does not pass with a correct saved invoice but no payment or realization", () => {
    const state = fillInvoice(createSalesCycleSeed());
    const result = verifySalesCycleState(state);
    expect(result.passed).toBe(false);
    const byId = Object.fromEntries(
      result.assertions.map((item) => [item.id, item.passed]),
    );
    expect(byId).toEqual({
      "invoice.customer": true,
      "invoice.lines": true,
      "invoice.total": true,
      "invoice.saved": true,
      "payment.linked": false,
      "payment.amount": false,
      "realization.posted": false,
      "settlement.balance": false,
    });
  });

  it("reports a concrete FAIL for a wrong payment amount", () => {
    const state = addRealization(
      addPayment(fillInvoice(createSalesCycleSeed()), { amount: "16500" }),
    );
    const result = verifySalesCycleState(state);
    expect(result.passed).toBe(false);
    expect(assertion(state, "payment.linked").passed).toBe(true);
    const amount = assertion(state, "payment.amount");
    expect(amount.passed).toBe(false);
    expect(amount.expected).toContain("165\u00a0000");
    expect(amount.actual).toContain("16\u00a0500");
    const balance = assertion(state, "settlement.balance");
    expect(balance.passed).toBe(false);
    expect(balance.actual).toContain("Долг покупателя 313\u00a0500");
    expect(assertion(state, "realization.posted").passed).toBe(true);
  });

  it("does not pass while the invoice form is filled but not written", () => {
    const state = fillInvoice(createSalesCycleSeed(), { save: false });
    expect(state.invoices).toHaveLength(0);
    const saved = assertion(state, "invoice.saved");
    expect(saved.passed).toBe(false);
    expect(saved.actual).toBe("Счёт заполняется, но ещё не записан");
    expect(verifySalesCycleState(state).passed).toBe(false);
  });

  it("does not pass when the payment is only saved, not posted", () => {
    const state = addRealization(
      addPayment(fillInvoice(createSalesCycleSeed()), { post: false }),
    );
    const linked = assertion(state, "payment.linked");
    expect(linked.passed).toBe(false);
    expect(linked.actual).toContain("не проведено");
    expect(verifySalesCycleState(state).passed).toBe(false);
  });

  it("does not pass when the realization is only saved, not posted", () => {
    const state = addRealization(
      addPayment(fillInvoice(createSalesCycleSeed())),
      { post: false },
    );
    const realization = assertion(state, "realization.posted");
    expect(realization.passed).toBe(false);
    expect(realization.actual).toBe("РТУ-0001 записана, но не проведена");
    expect(assertion(state, "settlement.balance").actual).toContain(
      "Аванс покупателя 165\u00a0000",
    );
    expect(verifySalesCycleState(state).passed).toBe(false);
  });

  it("does not pass when the payment is not linked to the invoice basis", () => {
    const state = addRealization(
      addPayment(fillInvoice(createSalesCycleSeed()), { basis: false }),
    );
    expect(assertion(state, "payment.linked").actual).toBe(
      "Поступление от покупателя не связано со счётом-основанием",
    );
    expect(assertion(state, "settlement.balance").passed).toBe(true);
    expect(verifySalesCycleState(state).passed).toBe(false);
  });

  it("reports the wrong customer and the system-calculated total for wrong quantities", () => {
    const wrongCustomer = fillInvoice(createSalesCycleSeed(), {
      customerId: "customer-uchebny-zakazchik",
    });
    expect(assertion(wrongCustomer, "invoice.customer")).toMatchObject({
      passed: false,
      actual: "ИП Учебный Заказчик",
    });

    const wrongQuantity = fillInvoice(createSalesCycleSeed(), {
      quantity: "1",
    });
    expect(assertion(wrongQuantity, "invoice.lines").passed).toBe(false);
    expect(assertion(wrongQuantity, "invoice.total")).toMatchObject({
      passed: false,
    });
    expect(assertion(wrongQuantity, "invoice.total").actual).toContain(
      "207\u00a0500",
    );
  });

  it("passes the complete correct chain", () => {
    const result = verifySalesCycleState(completeChain());
    expect(result.passed).toBe(true);
    expect(result.assertions.every((item) => item.passed)).toBe(true);
  });

  it("never passes from a correct number entered on its own", () => {
    // The expected prepayment / final debt typed as a lone payment amount proves nothing.
    const loneNumber = addPayment(createSalesCycleSeed(), {
      amount: String(SALES_CYCLE_EXPECTED.finalBalance),
      basis: false,
    });
    expect(verifySalesCycleState(loneNumber).passed).toBe(false);
    expect(assertion(loneNumber, "invoice.total").passed).toBe(false);
    // Typing the invoice total as a payment does not repair wrong invoice lines: the total is always recalculated.
    const typedTotal = addPayment(
      fillInvoice(createSalesCycleSeed(), { quantity: "1" }),
      { amount: "330000" },
    );
    expect(assertion(typedTotal, "invoice.total").passed).toBe(false);
    expect(verifySalesCycleState(typedTotal).passed).toBe(false);
  });
});

describe("intentional error state", () => {
  it("starts with specific failures and is fixed without a full reset", () => {
    let state = createSalesCycleDiagnosticSeed();
    const failing = verifySalesCycleState(state)
      .assertions.filter((item) => !item.passed)
      .map((item) => item.id);
    expect(failing).toEqual([
      "payment.amount",
      "realization.posted",
      "settlement.balance",
    ]);

    const invoiceBefore = state.invoices[0];
    state = apply(
      state,
      { type: "NAVIGATE", screen: "payment-list" },
      { type: "OPEN_PAYMENT", id: "payment-1" },
      { type: "SET_PAYMENT_AMOUNT", value: "165000" },
      { type: "POST_DOCUMENT" },
      { type: "NAVIGATE", screen: "realization-list" },
      { type: "OPEN_REALIZATION", id: "realization-1" },
      { type: "POST_DOCUMENT" },
    );
    expect(verifySalesCycleState(state).passed).toBe(true);
    expect(state.invoices[0]).toBe(invoiceBefore);
    expect(state.payments.map((doc) => doc.number)).toEqual(["ПТС-0001"]);
    expect(state.actionLog).not.toContain("reset");
  });
});

describe("sales-by-prepayment guidance", () => {
  const walk = (start: SalesCycleState) => {
    let state = start;
    const visited: string[] = [];
    for (let step = 0; step < 60; step += 1) {
      const guidance = getSalesCycleGuidance(state);
      if (!guidance) break;
      visited.push(guidance.id);
      state = reduceSalesCycleState(state, guidance.action);
    }
    return { state, visited };
  };

  it("walks the whole chain from an empty base through show-action commands", () => {
    const { state, visited } = walk(createSalesCycleSeed());
    expect(getSalesCycleGuidance(state)).toBeNull();
    expect(verifySalesCycleState(state).passed).toBe(true);
    expect(getSalesCycleProgress(state)).toEqual({
      invoiceDone: true,
      paymentDone: true,
      realizationDone: true,
      controlDone: true,
    });
    expect(visited[0]).toBe("invoice-open-sales");
    expect(visited).toContain("invoice-save");
    expect(visited).toContain("payment-amount");
    expect(visited).toContain("realization-post");
    expect(visited.at(-1)).toBe("open-settlements");
  });

  it("guides the learner to repair the diagnostic chain instead of recreating it", () => {
    const { state, visited } = walk(createSalesCycleDiagnosticSeed());
    expect(verifySalesCycleState(state).passed).toBe(true);
    expect(visited).toContain("open-payment");
    expect(visited).toContain("open-realization");
    expect(visited).not.toContain("create-payment");
    expect(visited).not.toContain("create-realization");
    expect(state.payments).toHaveLength(1);
  });

  it("is condition-driven: it does not advance until the state changes", () => {
    const state = apply(createSalesCycleSeed(), {
      type: "NAVIGATE",
      screen: "sales",
    });
    expect(getSalesCycleGuidance(state)?.targetId).toBe("sales.invoices");
    expect(getSalesCycleGuidance(state)?.why).toMatch(
      /основанием для оплаты и отгрузки/,
    );
    const afterSave = fillInvoice(createSalesCycleSeed());
    expect(getSalesCycleGuidance(afterSave)?.targetId).toBe("nav.bank");
  });
});

describe("lesson progress merge", () => {
  const completed = (
    completionKind: LessonProgress["completionKind"],
  ): LessonProgress => ({
    lessonId: "sales-prepayment-cycle",
    status: "completed",
    currentStep: 8,
    attemptCount: 1,
    note: "",
    completionKind,
    updatedAt: "2026-10-15T00:00:00.000Z",
  });

  it("does not downgrade a completion through demo or retry", () => {
    expect(
      mergeLessonProgress(completed("completed_assisted"), {
        status: "in_progress",
        practiceMode: "demo",
      }),
    ).toMatchObject({
      status: "completed",
      completionKind: "completed_assisted",
    });
    expect(
      mergeLessonProgress(completed("completed_unassisted"), {
        status: "completed",
        completionKind: "completed_assisted",
      }),
    ).toMatchObject({
      completionKind: "completed_unassisted",
    });
  });

  it("upgrades an assisted completion to unassisted", () => {
    expect(
      mergeLessonProgress(completed("completed_assisted"), {
        status: "completed",
        completionKind: "completed_unassisted",
      }),
    ).toMatchObject({
      completionKind: "completed_unassisted",
    });
    expect(mergeLessonProgress(undefined, { status: "needs_retry" })).toEqual({
      status: "needs_retry",
    });
  });
});
