import type { GuidanceStep } from "./customerCardGuidance";
import {
  calculateSettlement,
  draftLineValues,
  formatKzt,
  isFormDirty,
  linesMatchExpected,
  parseAmount,
  SALES_CYCLE_EXPECTED,
  SALES_CYCLE_ITEMS,
  selectChainInvoice,
  type SalesCycleCommand,
  type SalesCycleState,
} from "../domain/salesCycleScenario";

/** Guidance step plus the exact command used by «Показать действие» / «Сделать за меня». */
export interface SalesCycleGuidanceStep extends GuidanceStep {
  stage: SalesCycleStage;
  action: SalesCycleCommand;
}

export type SalesCycleStage = "invoice" | "payment" | "realization" | "control";

const itemName = (itemId: string) =>
  SALES_CYCLE_ITEMS.find((item) => item.id === itemId)?.name ?? itemId;
const prepayment = formatKzt(SALES_CYCLE_EXPECTED.prepaymentAmount);
const total = formatKzt(SALES_CYCLE_EXPECTED.invoiceTotal);

export interface SalesCycleProgress {
  invoiceDone: boolean;
  paymentDone: boolean;
  realizationDone: boolean;
  controlDone: boolean;
}

/** Stage completion derived from persisted documents. Used by guidance and by the chain stepper only. */
export function getSalesCycleProgress(
  state: SalesCycleState,
): SalesCycleProgress {
  const invoice = selectChainInvoice(state);
  const invoiceDone = Boolean(
    invoice &&
    invoice.customerId === SALES_CYCLE_EXPECTED.customerId &&
    linesMatchExpected(invoice.lines),
  );
  const paid = invoice
    ? state.payments
        .filter(
          (doc) =>
            doc.basisInvoiceId === invoice.id &&
            doc.customerId === invoice.customerId &&
            doc.status === "posted",
        )
        .reduce((sum, doc) => sum + doc.amount, 0)
    : 0;
  const settlement = calculateSettlement(
    state,
    SALES_CYCLE_EXPECTED.customerId,
  );
  // All posted money from the customer must belong to this invoice, otherwise the balance is distorted.
  const paymentDone =
    invoiceDone &&
    paid === SALES_CYCLE_EXPECTED.prepaymentAmount &&
    settlement.paid === paid;
  const realizationDone =
    paymentDone &&
    settlement.balance === SALES_CYCLE_EXPECTED.finalBalance &&
    state.realizations.some(
      (doc) =>
        doc.basisInvoiceId === invoice?.id &&
        doc.status === "posted" &&
        linesMatchExpected(doc.lines),
    );
  return {
    invoiceDone,
    paymentDone,
    realizationDone,
    controlDone: realizationDone && state.settlementsViewed,
  };
}

function invoiceFormStep(
  state: SalesCycleState,
): SalesCycleGuidanceStep | null {
  const form = state.form;
  if (form?.kind !== "invoice") return null;
  const base = { stage: "invoice" as const };

  if (form.customerId !== SALES_CYCLE_EXPECTED.customerId) {
    return {
      ...base,
      id: "invoice-customer",
      targetId: "invoice.customer",
      instruction: `Выберите покупателя «${SALES_CYCLE_EXPECTED.customerName}».`,
      why: "Счёт выставляется конкретному контрагенту: по нему потом связываются оплата, отгрузка и долг. Ошибка в покупателе «уводит» деньги и долг на чужую карточку.",
      hint1:
        "Покупатель выбирается из справочника контрагентов, а не вводится текстом.",
      hint2: `В поле «Покупатель» выберите «${SALES_CYCLE_EXPECTED.customerName}».`,
      action: {
        type: "SET_INVOICE_CUSTOMER",
        customerId: SALES_CYCLE_EXPECTED.customerId,
      },
    };
  }

  for (const expected of SALES_CYCLE_EXPECTED.lines) {
    const line = form.lines.find(
      (candidate) => candidate.itemId === expected.itemId,
    );
    if (!line) {
      const emptyLine = form.lines.find((candidate) => !candidate.itemId);
      if (emptyLine) {
        return {
          ...base,
          id: "invoice-line-item",
          targetId: `invoice.line.${emptyLine.id}.item`,
          instruction: `Выберите номенклатуру «${itemName(expected.itemId)}» в новой строке.`,
          why: "Номенклатура определяет, что именно продаётся. Цена подставляется из учебного прайса, но её всё равно нужно сверить с договорённостью.",
          hint1: "Строка уже добавлена — заполните колонку «Номенклатура».",
          hint2: `Выберите «${itemName(expected.itemId)}».`,
          action: {
            type: "SET_LINE_ITEM",
            lineId: emptyLine.id,
            itemId: expected.itemId,
          },
        };
      }
      return {
        ...base,
        id: "invoice-add-line",
        targetId: "invoice.add-line",
        instruction: `Добавьте строку для товара «${itemName(expected.itemId)}».`,
        why: "Каждая позиция счёта — отдельная строка: так покупатель видит, за что платит, а реализация потом отгрузит те же позиции.",
        hint1:
          "Команда добавления строки находится над табличной частью «Товары».",
        hint2: "Нажмите «Добавить строку».",
        action: { type: "ADD_INVOICE_LINE" },
      };
    }
    const values = draftLineValues(line);
    if (values.quantity !== expected.quantity) {
      return {
        ...base,
        id: "invoice-line-quantity",
        targetId: `invoice.line.${line.id}.quantity`,
        instruction: `Укажите количество ${expected.quantity} для «${itemName(expected.itemId)}».`,
        why: "Количество умножается на цену, и сумма строки рассчитывается автоматически. Итог никогда не вводится вручную — так исключается расхождение между строками и итогом.",
        hint1: "Количество задаётся в строке товара, а не в итоге документа.",
        hint2: `Введите ${expected.quantity} в колонку «Кол-во».`,
        action: {
          type: "SET_LINE_QUANTITY",
          lineId: line.id,
          value: String(expected.quantity),
        },
      };
    }
    if (values.price !== expected.price) {
      return {
        ...base,
        id: "invoice-line-price",
        targetId: `invoice.line.${line.id}.price`,
        instruction: `Проверьте цену «${itemName(expected.itemId)}»: ${formatKzt(expected.price)} за единицу.`,
        why: "Частая ошибка — ввести в цену сумму строки. Цена указывается за единицу, а сумма считается системой.",
        hint1: "Цена — за одну штуку, а не за всё количество.",
        hint2: `Введите ${expected.price} в колонку «Цена».`,
        action: {
          type: "SET_LINE_PRICE",
          lineId: line.id,
          value: String(expected.price),
        },
      };
    }
  }

  const extra = form.lines.find(
    (line, index) =>
      !SALES_CYCLE_EXPECTED.lines.some(
        (expected) => expected.itemId === line.itemId,
      ) ||
      form.lines.findIndex((other) => other.itemId === line.itemId) !== index,
  );
  if (extra) {
    return {
      ...base,
      id: "invoice-remove-line",
      targetId: `invoice.line.${extra.id}.remove`,
      instruction: "Удалите лишнюю строку из счёта.",
      why: "Лишняя позиция увеличит сумму к оплате и попадёт в отгрузку. Покупатель оплатит не то, о чём договаривались.",
      hint1: "Сравните строки счёта с исходными данными задания.",
      hint2: "Нажмите «×» в лишней строке.",
      action: { type: "REMOVE_INVOICE_LINE", lineId: extra.id },
    };
  }

  if (isFormDirty(state)) {
    return {
      ...base,
      id: "invoice-save",
      targetId: "invoice.save",
      instruction: `Проверьте итог ${total} и запишите счёт.`,
      why: "Итог рассчитан системой из строк. Пока счёт не записан, его нельзя указать основанием оплаты и реализации — для учёта он не существует.",
      hint1: "Счёт на оплату не проводится, его достаточно записать.",
      hint2: "Нажмите «Записать».",
      action: { type: "SAVE_DOCUMENT" },
    };
  }
  return null;
}

function paymentFormStep(
  state: SalesCycleState,
): SalesCycleGuidanceStep | null {
  const form = state.form;
  if (form?.kind !== "payment") return null;
  const invoice = selectChainInvoice(state);
  const base = { stage: "payment" as const };

  if (form.customerId !== SALES_CYCLE_EXPECTED.customerId) {
    return {
      ...base,
      id: "payment-customer",
      targetId: "payment.customer",
      instruction: `Укажите плательщика «${SALES_CYCLE_EXPECTED.customerName}».`,
      why: "Деньги на расчётном счёте должны «принадлежать» конкретному покупателю — иначе аванс не будет учтён в его взаиморасчётах.",
      hint1: "Плательщик — это контрагент, который перечислил деньги.",
      hint2: `Выберите «${SALES_CYCLE_EXPECTED.customerName}» в поле «Плательщик».`,
      action: {
        type: "SET_PAYMENT_CUSTOMER",
        customerId: SALES_CYCLE_EXPECTED.customerId,
      },
    };
  }
  if (invoice && form.basisInvoiceId !== invoice.id) {
    return {
      ...base,
      id: "payment-basis",
      targetId: "payment.basis",
      instruction: `Укажите основание платежа — счёт ${invoice.number}.`,
      why: "Связь со счётом показывает, по какой договорённости пришли деньги, и позволяет контролировать оплату счёта.",
      hint1: "Основание выбирается из записанных счетов этого покупателя.",
      hint2: `Выберите «${invoice.number}» в поле «Счёт-основание».`,
      action: { type: "SET_PAYMENT_BASIS", invoiceId: invoice.id },
    };
  }
  if (parseAmount(form.amountText) !== SALES_CYCLE_EXPECTED.prepaymentAmount) {
    return {
      ...base,
      id: "payment-amount",
      targetId: "payment.amount",
      instruction: `Введите сумму предоплаты ${prepayment} — 50% от счёта на ${total}.`,
      why: "По условиям сделки покупатель вносит половину до отгрузки. Сумма берётся из банковской выписки; опечатка здесь сразу исказит долг покупателя.",
      hint1: "Предоплата — половина итога счёта.",
      hint2: `Введите ${SALES_CYCLE_EXPECTED.prepaymentAmount}.`,
      action: {
        type: "SET_PAYMENT_AMOUNT",
        value: String(SALES_CYCLE_EXPECTED.prepaymentAmount),
      },
    };
  }
  const saved = state.payments.find((doc) => doc.id === form.docId);
  if (!saved || saved.status !== "posted" || isFormDirty(state)) {
    return {
      ...base,
      id: "payment-post",
      targetId: "payment.post",
      instruction: "Проведите поступление.",
      why: "Только проведённый документ меняет учёт: пока поступление лишь записано, аванс покупателя в расчётах не появится.",
      hint1:
        "«Записать» сохраняет черновик, «Провести» — отражает операцию в учёте.",
      hint2: "Нажмите «Провести».",
      action: { type: "POST_DOCUMENT" },
    };
  }
  const postedForInvoice = state.payments.filter(
    (doc) =>
      doc.basisInvoiceId === invoice?.id &&
      doc.customerId === SALES_CYCLE_EXPECTED.customerId &&
      doc.status === "posted",
  );
  if (postedForInvoice.length > 1) {
    return {
      ...base,
      id: "payment-unpost-duplicate",
      targetId: "payment.unpost",
      instruction:
        "По счёту проведено несколько поступлений. Отмените проведение лишнего.",
      why: "Дубль поступления завышает оплату: покупатель будет выглядеть так, будто заплатил больше, чем перечислил банк.",
      hint1:
        "Сравните сумму проведённых поступлений по счёту с банковской выпиской.",
      hint2: "Нажмите «Отменить проведение».",
      action: { type: "UNPOST_DOCUMENT" },
    };
  }
  return null;
}

function realizationFormStep(
  state: SalesCycleState,
): SalesCycleGuidanceStep | null {
  const form = state.form;
  if (form?.kind !== "realization") return null;
  const invoice = selectChainInvoice(state);
  const base = { stage: "realization" as const };
  if (invoice && form.basisInvoiceId !== invoice.id) {
    return {
      ...base,
      id: "realization-basis",
      targetId: "realization.basis",
      instruction: `Выберите счёт-основание ${invoice.number}.`,
      why: "Реализация «на основании» переносит покупателя и строки из счёта — отгружается ровно то, что согласовали и частично оплатили.",
      hint1:
        "Строки реализации заполнятся автоматически после выбора основания.",
      hint2: `Выберите «${invoice.number}» в поле «Основание».`,
      action: { type: "SET_REALIZATION_BASIS", invoiceId: invoice.id },
    };
  }
  const saved = state.realizations.find((doc) => doc.id === form.docId);
  if (!saved || saved.status !== "posted" || isFormDirty(state)) {
    return {
      ...base,
      id: "realization-post",
      targetId: "realization.post",
      instruction: `Проверьте строки на ${total} и проведите реализацию.`,
      why: "Проведённая отгрузка признаёт выручку и долг покупателя на всю сумму; полученный ранее аванс зачитывается автоматически.",
      hint1:
        "Записанная, но не проведённая реализация не меняет взаиморасчёты.",
      hint2: "Нажмите «Провести».",
      action: { type: "POST_DOCUMENT" },
    };
  }
  const postedForInvoice = state.realizations.filter(
    (doc) => doc.basisInvoiceId === invoice?.id && doc.status === "posted",
  );
  if (postedForInvoice.length > 1) {
    return {
      ...base,
      id: "realization-unpost-duplicate",
      targetId: "realization.unpost",
      instruction:
        "По счёту проведено несколько реализаций. Отмените проведение лишней.",
      why: "Двойная отгрузка удваивает выручку и долг покупателя, хотя товар передан один раз.",
      hint1: "Одному счёту в этой сделке соответствует одна отгрузка.",
      hint2: "Нажмите «Отменить проведение».",
      action: { type: "UNPOST_DOCUMENT" },
    };
  }
  return null;
}

function goToSales(
  stage: SalesCycleStage,
  why: string,
): SalesCycleGuidanceStep {
  return {
    stage,
    id: `${stage}-open-sales`,
    targetId: "nav.sales",
    instruction: "Откройте раздел «Продажи».",
    why,
    hint1: "Разделы находятся в левом меню учебной программы.",
    hint2: "Нажмите «Продажи».",
    action: { type: "NAVIGATE", screen: "sales" },
  };
}

export function getSalesCycleGuidance(
  state: SalesCycleState,
): SalesCycleGuidanceStep | null {
  const progress = getSalesCycleProgress(state);
  const invoice = selectChainInvoice(state);

  // 1. Steps inside an open form take priority while the form belongs to the current stage.
  const formStep =
    (!progress.invoiceDone ||
    (state.form?.kind === "invoice" && state.form.docId === invoice?.id)
      ? invoiceFormStep(state)
      : null) ??
    (progress.invoiceDone && !progress.paymentDone
      ? paymentFormStep(state)
      : null) ??
    (progress.paymentDone && !progress.realizationDone
      ? realizationFormStep(state)
      : null);
  if (formStep) return formStep;

  // 2. Stage: invoice.
  if (!progress.invoiceDone) {
    if (state.screen === "invoice-list") {
      const existing = [...state.invoices]
        .reverse()
        .find((doc) => doc.customerId === SALES_CYCLE_EXPECTED.customerId);
      if (existing) {
        return {
          stage: "invoice",
          id: "open-invoice",
          targetId: `invoices.row.${existing.id}`,
          instruction: `Откройте счёт ${existing.number} и исправьте его.`,
          why: "Ошибку исправляют в существующем документе — новый дубль счёта запутает покупателя и взаиморасчёты.",
          hint1: "Документ открывается щелчком по строке списка.",
          hint2: `Нажмите на строку «${existing.number}».`,
          action: { type: "OPEN_INVOICE", id: existing.id },
        };
      }
      return {
        stage: "invoice",
        id: "create-invoice",
        targetId: "invoices.create",
        instruction: "Создайте новый счёт на оплату.",
        why: "Продажа по предоплате начинается со счёта: он фиксирует покупателя, товары и сумму, которую покупатель должен оплатить до отгрузки.",
        hint1: "Основная команда находится над списком.",
        hint2: "Нажмите «Создать».",
        action: { type: "CREATE_INVOICE" },
      };
    }
    if (state.screen === "sales") {
      return {
        stage: "invoice",
        id: "open-invoices",
        targetId: "sales.invoices",
        instruction: "Откройте список «Счета на оплату покупателям».",
        why: "Счёт на оплату — коммерческое предложение покупателю. Он не меняет учёт, но становится основанием для оплаты и отгрузки.",
        hint1: "Ищите документ, который выставляется покупателю до оплаты.",
        hint2: "Нажмите «Счета на оплату покупателям».",
        action: { type: "NAVIGATE", screen: "invoice-list" },
      };
    }
    return goToSales(
      "invoice",
      "Документы для работы с покупателями — счета, реализации и расчёты — собраны в разделе продаж.",
    );
  }

  // 3. Stage: incoming payment (advance).
  if (!progress.paymentDone) {
    if (state.screen === "payment-list") {
      const candidates = [...state.payments]
        .reverse()
        .filter(
          (doc) =>
            doc.customerId === SALES_CYCLE_EXPECTED.customerId &&
            (!doc.basisInvoiceId || doc.basisInvoiceId === invoice?.id),
        );
      const existing =
        candidates.find(
          (doc) =>
            doc.amount !== SALES_CYCLE_EXPECTED.prepaymentAmount ||
            doc.status !== "posted" ||
            doc.basisInvoiceId !== invoice?.id,
        ) ?? candidates[0];
      if (existing) {
        return {
          stage: "payment",
          id: "open-payment",
          targetId: `payments.row.${existing.id}`,
          instruction: `Откройте поступление ${existing.number} и проверьте его.`,
          why: "Неверное поступление исправляют в самом документе и проводят повторно — без удаления всей цепочки.",
          hint1:
            "Сравните сумму и статус документа в списке с условиями сделки.",
          hint2: `Нажмите на строку «${existing.number}».`,
          action: { type: "OPEN_PAYMENT", id: existing.id },
        };
      }
      return {
        stage: "payment",
        id: "create-payment",
        targetId: "payments.create",
        instruction: "Создайте поступление на текущий счёт.",
        why: "Банк сообщил, что покупатель перечислил предоплату. Эти деньги нужно зарегистрировать как аванс от покупателя.",
        hint1: "Основная команда находится над списком поступлений.",
        hint2: "Нажмите «Создать».",
        action: { type: "CREATE_PAYMENT" },
      };
    }
    if (state.screen === "bank") {
      return {
        stage: "payment",
        id: "open-receipts",
        targetId: "bank.receipts",
        instruction: "Откройте «Поступления на текущий счёт».",
        why: "Безналичная оплата от покупателя регистрируется документом поступления по данным банковской выписки.",
        hint1: "Нужен документ поступления денег, а не списания.",
        hint2: "Нажмите «Поступления на текущий счёт».",
        action: { type: "NAVIGATE", screen: "payment-list" },
      };
    }
    return {
      stage: "payment",
      id: "open-bank",
      targetId: "nav.bank",
      instruction: "Счёт записан. Откройте раздел «Банк и касса».",
      why: "Счёт сам по себе не означает, что деньги пришли. Оплату подтверждает банк, поэтому следующий документ — в банковском разделе.",
      hint1: "Раздел находится в левом меню.",
      hint2: "Нажмите «Банк и касса».",
      action: { type: "NAVIGATE", screen: "bank" },
    };
  }

  // 4. Stage: realization.
  if (!progress.realizationDone) {
    if (state.screen === "realization-list") {
      const candidates = [...state.realizations]
        .reverse()
        .filter((doc) => doc.basisInvoiceId === invoice?.id);
      const existing =
        candidates.find((doc) => doc.status !== "posted") ?? candidates[0];
      if (existing) {
        return {
          stage: "realization",
          id: "open-realization",
          targetId: `realizations.row.${existing.id}`,
          instruction: `Откройте реализацию ${existing.number}.`,
          why: "Статус «Записан» означает, что отгрузка ещё не отражена в учёте. Документ нужно открыть и провести.",
          hint1: "Обратите внимание на колонку «Состояние».",
          hint2: `Нажмите на строку «${existing.number}».`,
          action: { type: "OPEN_REALIZATION", id: existing.id },
        };
      }
      return {
        stage: "realization",
        id: "create-realization",
        targetId: "realizations.create",
        instruction: "Создайте реализацию.",
        why: "Предоплата получена — товар можно отгружать. Реализация фиксирует передачу товара покупателю.",
        hint1: "Основная команда находится над списком.",
        hint2: "Нажмите «Создать».",
        action: { type: "CREATE_REALIZATION" },
      };
    }
    if (state.screen === "sales") {
      return {
        stage: "realization",
        id: "open-realizations",
        targetId: "sales.realizations",
        instruction: "Откройте «Реализация (акты, накладные)».",
        why: "Отгрузка товаров покупателю оформляется документом реализации.",
        hint1: "Нужен документ отгрузки, а не счёт.",
        hint2: "Нажмите «Реализация (акты, накладные)».",
        action: { type: "NAVIGATE", screen: "realization-list" },
      };
    }
    return goToSales(
      "realization",
      `Оплата ${prepayment} проведена. Отгрузку оформляют в разделе продаж.`,
    );
  }

  // 5. Stage: settlement control.
  if (!progress.controlDone) {
    if (state.screen === "sales") {
      return {
        stage: "control",
        id: "open-settlements",
        targetId: "sales.settlements",
        instruction: "Откройте отчёт «Расчёты с покупателями».",
        why: "Бухгалтер не доверяет цифре «на глаз»: остаток долга подтверждается отчётом по проведённым документам.",
        hint1: "Отчёт находится в разделе продаж рядом с документами.",
        hint2: "Нажмите «Расчёты с покупателями».",
        action: { type: "NAVIGATE", screen: "settlements" },
      };
    }
    return goToSales(
      "control",
      "Цепочка документов проведена. Осталось проверить итог взаиморасчётов по отчёту.",
    );
  }

  return null;
}
