import type {
  AssertionResult,
  PracticalVerificationResult,
} from "./customerCardVerification";
import {
  calculateSettlement,
  calculateTotal,
  describeBalance,
  findCustomer,
  findItem,
  formatKzt,
  linesMatchExpected,
  SALES_CYCLE_EXPECTED,
  SALES_CYCLE_ITEMS,
  selectChainInvoice,
  type DocumentLine,
  type SalesCycleState,
} from "./salesCycleScenario";

const describeLines = (state: SalesCycleState, lines: DocumentLine[]) =>
  lines.length === 0
    ? "Строк нет"
    : lines
        .map(
          (line) =>
            `${findItem(state, line.itemId)?.name ?? "?"} × ${line.quantity} по ${formatKzt(line.price)}`,
        )
        .join("; ");

const expectedLinesText = SALES_CYCLE_EXPECTED.lines
  .map(
    (line) =>
      `${SALES_CYCLE_ITEMS.find((item) => item.id === line.itemId)?.name} × ${line.quantity} по ${formatKzt(line.price)}`,
  )
  .join("; ");

/**
 * State-based verification of the prepaid sales chain. Every assertion reads only persisted
 * training documents and values calculated by the domain; no typed answer can satisfy it.
 */
export function verifySalesCycleState(
  state: SalesCycleState,
): PracticalVerificationResult {
  const invoice = selectChainInvoice(state);
  const invoiceCustomer = findCustomer(state, invoice?.customerId);
  const invoiceTotal = invoice ? calculateTotal(invoice.lines) : 0;
  const unsavedInvoiceForm =
    state.form?.kind === "invoice" && !state.form.docId;
  const noInvoice = unsavedInvoiceForm
    ? "Счёт заполняется, но ещё не записан"
    : "Записанный счёт не найден";

  const customerPayments = state.payments.filter(
    (doc) => doc.customerId === SALES_CYCLE_EXPECTED.customerId,
  );
  const linkedPayments = invoice
    ? customerPayments.filter((doc) => doc.basisInvoiceId === invoice.id)
    : [];
  const postedLinkedPayments = linkedPayments.filter(
    (doc) => doc.status === "posted",
  );
  const paidByInvoice = postedLinkedPayments.reduce(
    (sum, doc) => sum + doc.amount,
    0,
  );

  const realization = invoice
    ? [...state.realizations]
        .reverse()
        .find((doc) => doc.basisInvoiceId === invoice.id)
    : undefined;
  const settlement = calculateSettlement(
    state,
    SALES_CYCLE_EXPECTED.customerId,
  );

  const paymentLinkActual = (() => {
    if (!invoice)
      return "Нет записанного счёта, к которому можно привязать оплату";
    if (state.payments.length === 0)
      return state.form?.kind === "payment" && !state.form.docId
        ? "Поступление заполняется, но ещё не записано"
        : "Поступление на текущий счёт не найдено";
    if (customerPayments.length === 0) {
      const other = findCustomer(
        state,
        state.payments[state.payments.length - 1].customerId,
      );
      return `Плательщик в поступлении: ${other?.name ?? "не указан"}`;
    }
    if (linkedPayments.length === 0)
      return "Поступление от покупателя не связано со счётом-основанием";
    if (postedLinkedPayments.length === 0)
      return "Поступление записано, но не проведено — взаиморасчёты не изменились";
    return `${postedLinkedPayments.map((doc) => doc.number).join(", ")} · ${invoiceCustomer?.name ?? ""} · основание ${invoice.number}`;
  })();

  const realizationActual = (() => {
    if (!invoice) return "Нет записанного счёта-основания";
    if (!realization)
      return state.form?.kind === "realization" && !state.form.docId
        ? "Реализация заполняется, но ещё не записана"
        : "Реализация на основании счёта не найдена";
    if (realization.status !== "posted")
      return `${realization.number} записана, но не проведена`;
    return `${realization.number} проведена на ${formatKzt(calculateTotal(realization.lines))}`;
  })();

  const assertions: AssertionResult[] = [
    {
      id: "invoice.customer",
      label: "Правильный покупатель в счёте",
      passed: invoice?.customerId === SALES_CYCLE_EXPECTED.customerId,
      expected: SALES_CYCLE_EXPECTED.customerName,
      actual: invoice
        ? (invoiceCustomer?.name ?? "Покупатель не выбран")
        : noInvoice,
      hint: "Откройте счёт и выберите покупателя из исходных данных задания, затем запишите счёт.",
    },
    {
      id: "invoice.lines",
      label: "Корректные позиции счёта",
      passed: Boolean(invoice && linesMatchExpected(invoice.lines)),
      expected: expectedLinesText,
      actual: invoice ? describeLines(state, invoice.lines) : noInvoice,
      hint: "Сравните номенклатуру, количество и цену каждой строки с исходными данными; лишние строки удалите.",
    },
    {
      id: "invoice.total",
      label: "Сумма счёта рассчитана системой",
      passed: Boolean(
        invoice &&
        linesMatchExpected(invoice.lines) &&
        invoiceTotal === SALES_CYCLE_EXPECTED.invoiceTotal,
      ),
      expected: `${formatKzt(SALES_CYCLE_EXPECTED.invoiceTotal)} — сумма строк «количество × цена»`,
      actual: invoice
        ? `${formatKzt(invoiceTotal)} — рассчитано из строк счёта`
        : noInvoice,
      hint: "Итог нельзя ввести вручную: исправьте количество или цену в строках, и система пересчитает сумму.",
    },
    {
      id: "invoice.saved",
      label: "Счёт записан",
      passed: invoice?.status === "saved",
      expected: "Счёт на оплату записан в учебной базе",
      actual: invoice ? `${invoice.number} записан` : noInvoice,
      hint: "Нажмите «Записать» в форме счёта: незаписанная форма не существует для следующих документов.",
    },
    {
      id: "payment.linked",
      label: "Оплата связана с покупателем и счётом",
      passed: Boolean(invoice && postedLinkedPayments.length > 0),
      expected: `Проведённое поступление от «${SALES_CYCLE_EXPECTED.customerName}» по счёту-основанию`,
      actual: paymentLinkActual,
      hint: "В поступлении на текущий счёт выберите плательщика, укажите счёт-основание и проведите документ.",
    },
    {
      id: "payment.amount",
      label: "Сумма предоплаты",
      passed:
        postedLinkedPayments.length > 0 &&
        paidByInvoice === SALES_CYCLE_EXPECTED.prepaymentAmount,
      expected: `${formatKzt(SALES_CYCLE_EXPECTED.prepaymentAmount)} — 50% от счёта`,
      actual:
        postedLinkedPayments.length > 0
          ? `${formatKzt(paidByInvoice)} по проведённым поступлениям`
          : "Проведённой оплаты по счёту нет",
      hint: "Откройте поступление, исправьте сумму по условиям предоплаты и проведите документ повторно.",
    },
    {
      id: "realization.posted",
      label: "Реализация проведена",
      passed: Boolean(
        realization &&
        realization.status === "posted" &&
        realization.customerId === SALES_CYCLE_EXPECTED.customerId &&
        linesMatchExpected(realization.lines),
      ),
      expected: `Проведённая реализация на основании счёта на ${formatKzt(SALES_CYCLE_EXPECTED.invoiceTotal)}`,
      actual: realizationActual,
      hint: "Создайте реализацию на основании записанного счёта и нажмите «Провести»: только проведённая отгрузка формирует долг.",
    },
    {
      id: "settlement.balance",
      label: "Остаток по учебной модели",
      passed: settlement.balance === SALES_CYCLE_EXPECTED.finalBalance,
      expected: describeBalance(SALES_CYCLE_EXPECTED.finalBalance),
      actual: `${describeBalance(settlement.balance)} (отгружено ${formatKzt(settlement.shipped)}, оплачено ${formatKzt(settlement.paid)})`,
      hint: "В этом тренажёре остаток равен проведённой реализации минус проведённая оплата. Сверьте документы и учебный отчёт.",
    },
  ];

  return {
    passed: assertions.every((assertion) => assertion.passed),
    assertions,
  };
}
