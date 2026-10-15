import {
  Check,
  CircleDot,
  CircleHelp,
  MousePointerClick,
  Play,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  mergeLessonProgress,
  useProgress,
  type LessonProgress,
} from "../progress/progress";
import type { TrainingMode } from "./domain/customerCardScenario";
import {
  calculateDraftTotal,
  calculateSettlement,
  calculateTotal,
  createSalesCycleSeed,
  describeBalance,
  draftLineValues,
  findCustomer,
  findInvoice,
  findItem,
  formatKzt,
  isFormDirty,
  lineAmount,
  reduceSalesCycleState,
  SALES_CYCLE_DATE,
  SALES_CYCLE_EXPECTED,
  SALES_CYCLE_LESSON_ID,
  type DocumentLine,
  type DocumentStatus,
  type SalesCycleCommand,
  type SalesCycleState,
} from "./domain/salesCycleScenario";
import { verifySalesCycleState } from "./domain/salesCycleVerification";
import {
  getSalesCycleGuidance,
  getSalesCycleProgress,
  type SalesCycleStage,
} from "./guidance/salesCycleGuidance";
import {
  Target,
  TrainingHeader,
  VerificationResults,
} from "./shared/TrainingChrome";
import { useGuidanceBeacon } from "./shared/useGuidanceBeacon";
import "./training-workspace.css";
import "./sales-cycle.css";

const lessonId = SALES_CYCLE_LESSON_ID;
const DEMO_STEP_MS = 450;

type Run = (command: SalesCycleCommand) => void;

const stageLabels: Record<SalesCycleStage, string> = {
  invoice: "Счёт",
  payment: "Оплата",
  realization: "Реализация",
  control: "Контроль долга",
};

function StatusBadge({
  status,
  dirty,
}: {
  status: DocumentStatus | "new";
  dirty?: boolean;
}) {
  if (status === "new")
    return <span className="sc-badge sc-badge-new">Новый · не записан</span>;
  if (dirty)
    return (
      <span className="sc-badge sc-badge-dirty">
        Есть незаписанные изменения
      </span>
    );
  return status === "posted" ? (
    <span className="sc-badge sc-badge-posted">
      <Check size={13} /> Проведён
    </span>
  ) : (
    <span className="sc-badge sc-badge-saved">Записан · не проведён</span>
  );
}

function ListStatus({
  status,
  kind,
}: {
  status: DocumentStatus;
  kind: "invoice" | "document";
}) {
  if (kind === "invoice")
    return <span className="training-saved">Записан</span>;
  return status === "posted" ? (
    <span className="training-saved">
      <Check size={14} /> Проведён
    </span>
  ) : (
    <span className="sc-unposted">Записан · не проведён</span>
  );
}

function LinesTable({
  state,
  lines,
}: {
  state: SalesCycleState;
  lines: DocumentLine[];
}) {
  return (
    <div className="sc-lines sc-lines-readonly">
      <div className="sc-lines-head">
        <span>Номенклатура</span>
        <span>Кол-во</span>
        <span>Цена</span>
        <span>Сумма</span>
      </div>
      {lines.map((line) => (
        <div className="sc-line" key={line.id}>
          <strong>{findItem(state, line.itemId)?.name}</strong>
          <span>{line.quantity} шт</span>
          <span>{formatKzt(line.price)}</span>
          <span>{formatKzt(lineAmount(line))}</span>
        </div>
      ))}
    </div>
  );
}

function InvoiceForm({ state, run }: { state: SalesCycleState; run: Run }) {
  const form = state.form;
  if (form?.kind !== "invoice") return null;
  const saved = findInvoice(state, form.docId);
  const dirty = isFormDirty(state);
  const total = calculateDraftTotal(form.lines);
  return (
    <div>
      <div className="training-page-title">
        <div>
          <small>Документ · {SALES_CYCLE_DATE}</small>
          <h2>Счёт на оплату {saved ? saved.number : "(новый)"}</h2>
        </div>
        <StatusBadge
          status={saved ? "saved" : "new"}
          dirty={Boolean(saved) && dirty}
        />
      </div>
      <div className="training-form sc-form">
        <Target id="invoice.customer" className="training-field-wrap">
          <label htmlFor="invoice-customer">Покупатель</label>
          <select
            id="invoice-customer"
            value={form.customerId}
            onChange={(event) =>
              run({
                type: "SET_INVOICE_CUSTOMER",
                customerId: event.target.value,
              })
            }
          >
            <option value="">— выберите контрагента —</option>
            {state.customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.city})
              </option>
            ))}
          </select>
        </Target>

        <div className="sc-section-title">
          <strong>Товары</strong>
          <Target id="invoice.add-line">
            <button
              className="sc-secondary"
              onClick={() => run({ type: "ADD_INVOICE_LINE" })}
            >
              Добавить строку
            </button>
          </Target>
        </div>
        <div className="sc-lines">
          <div className="sc-lines-head sc-lines-head-edit">
            <span>Номенклатура</span>
            <span>Кол-во</span>
            <span>Цена, ₸</span>
            <span>Сумма</span>
            <span aria-hidden="true" />
          </div>
          {form.lines.length === 0 && (
            <div className="training-empty">Строк пока нет</div>
          )}
          {form.lines.map((line, index) => {
            const values = draftLineValues(line);
            const amount =
              values.quantity && values.price
                ? lineAmount({ quantity: values.quantity, price: values.price })
                : 0;
            const n = index + 1;
            return (
              <div className="sc-line sc-line-edit" key={line.id}>
                <Target
                  id={`invoice.line.${line.id}.item`}
                  className="sc-cell sc-cell-item"
                >
                  <label
                    className="sc-mobile-label"
                    htmlFor={`line-${line.id}-item`}
                  >
                    Номенклатура
                  </label>
                  <select
                    id={`line-${line.id}-item`}
                    aria-label={`Номенклатура, строка ${n}`}
                    value={line.itemId}
                    onChange={(event) =>
                      run({
                        type: "SET_LINE_ITEM",
                        lineId: line.id,
                        itemId: event.target.value,
                      })
                    }
                  >
                    <option value="">— выберите —</option>
                    {state.items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </Target>
                <Target
                  id={`invoice.line.${line.id}.quantity`}
                  className="sc-cell"
                >
                  <label
                    className="sc-mobile-label"
                    htmlFor={`line-${line.id}-qty`}
                  >
                    Кол-во
                  </label>
                  <input
                    id={`line-${line.id}-qty`}
                    aria-label={`Количество, строка ${n}`}
                    inputMode="decimal"
                    value={line.quantityText}
                    onChange={(event) =>
                      run({
                        type: "SET_LINE_QUANTITY",
                        lineId: line.id,
                        value: event.target.value,
                      })
                    }
                  />
                </Target>
                <Target
                  id={`invoice.line.${line.id}.price`}
                  className="sc-cell"
                >
                  <label
                    className="sc-mobile-label"
                    htmlFor={`line-${line.id}-price`}
                  >
                    Цена, ₸
                  </label>
                  <input
                    id={`line-${line.id}-price`}
                    aria-label={`Цена, строка ${n}`}
                    inputMode="decimal"
                    value={line.priceText}
                    onChange={(event) =>
                      run({
                        type: "SET_LINE_PRICE",
                        lineId: line.id,
                        value: event.target.value,
                      })
                    }
                  />
                </Target>
                <div
                  className="sc-cell sc-cell-amount"
                  aria-label={`Сумма, строка ${n}`}
                >
                  <span className="sc-mobile-label">Сумма</span>
                  {formatKzt(amount)}
                </div>
                <Target
                  id={`invoice.line.${line.id}.remove`}
                  className="sc-cell sc-cell-remove"
                >
                  <button
                    className="sc-remove"
                    aria-label={`Удалить строку ${n}`}
                    onClick={() =>
                      run({ type: "REMOVE_INVOICE_LINE", lineId: line.id })
                    }
                  >
                    ×
                  </button>
                </Target>
              </div>
            );
          })}
        </div>
        <Target id="invoice.total" className="sc-total">
          <span>Всего (рассчитано системой)</span>
          <output aria-label="Итог счёта">{formatKzt(total)}</output>
        </Target>
        <div className="training-form-note">
          Итог не вводится вручную: он всегда равен сумме строк «количество ×
          цена». Счёт на оплату не проводится — его достаточно записать.
        </div>
        {form.error && (
          <div className="sc-error" role="alert">
            {form.error}
          </div>
        )}
        <div className="sc-commands">
          <Target id="invoice.save">
            <button
              className="training-save"
              onClick={() => run({ type: "SAVE_DOCUMENT" })}
            >
              Записать
            </button>
          </Target>
          {saved && !dirty && (
            <>
              <button
                className="sc-secondary"
                onClick={() =>
                  run({ type: "CREATE_PAYMENT", basisInvoiceId: saved.id })
                }
              >
                На основании: поступление
              </button>
              <button
                className="sc-secondary"
                onClick={() =>
                  run({ type: "CREATE_REALIZATION", basisInvoiceId: saved.id })
                }
              >
                На основании: реализация
              </button>
            </>
          )}
          <button
            className="sc-secondary"
            onClick={() => run({ type: "CLOSE_FORM" })}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentForm({ state, run }: { state: SalesCycleState; run: Run }) {
  const form = state.form;
  if (form?.kind !== "payment") return null;
  const saved = state.payments.find((doc) => doc.id === form.docId);
  const dirty = isFormDirty(state);
  const basisOptions = state.invoices.filter(
    (invoice) => invoice.customerId === form.customerId,
  );
  return (
    <div>
      <div className="training-page-title">
        <div>
          <small>Банк · {SALES_CYCLE_DATE}</small>
          <h2>
            Поступление на текущий счёт {saved ? saved.number : "(новое)"}
          </h2>
        </div>
        <StatusBadge
          status={saved ? saved.status : "new"}
          dirty={Boolean(saved) && dirty}
        />
      </div>
      <div className="training-form sc-form">
        <div className="sc-readonly-field">
          <span>Вид операции</span>
          <strong>Оплата от покупателя</strong>
        </div>
        <div className="sc-readonly-field">
          <span>Банковский счёт</span>
          <strong>Учебный расчётный счёт (вымышленный)</strong>
        </div>
        <Target id="payment.customer" className="training-field-wrap">
          <label htmlFor="payment-customer">Плательщик</label>
          <select
            id="payment-customer"
            value={form.customerId}
            onChange={(event) =>
              run({
                type: "SET_PAYMENT_CUSTOMER",
                customerId: event.target.value,
              })
            }
          >
            <option value="">— выберите контрагента —</option>
            {state.customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.city})
              </option>
            ))}
          </select>
        </Target>
        <Target id="payment.basis" className="training-field-wrap">
          <label htmlFor="payment-basis">Счёт-основание</label>
          <select
            id="payment-basis"
            value={form.basisInvoiceId}
            onChange={(event) =>
              run({ type: "SET_PAYMENT_BASIS", invoiceId: event.target.value })
            }
          >
            <option value="">
              {basisOptions.length
                ? "— не указан —"
                : "— нет записанных счетов плательщика —"}
            </option>
            {basisOptions.map((invoice) => (
              <option key={invoice.id} value={invoice.id}>
                {invoice.number} · {formatKzt(calculateTotal(invoice.lines))}
              </option>
            ))}
          </select>
        </Target>
        <Target id="payment.amount" className="training-field-wrap">
          <label htmlFor="payment-amount">Сумма платежа, ₸</label>
          <input
            id="payment-amount"
            inputMode="decimal"
            placeholder="Сумма из банковской выписки"
            value={form.amountText}
            onChange={(event) =>
              run({ type: "SET_PAYMENT_AMOUNT", value: event.target.value })
            }
          />
        </Target>
        <div className="training-form-note">
          «Записать» сохраняет документ, но не меняет учёт. «Провести» отражает
          поступление в расчётах с покупателем.
        </div>
        {form.error && (
          <div className="sc-error" role="alert">
            {form.error}
          </div>
        )}
        <div className="sc-commands">
          <Target id="payment.post">
            <button
              className="training-save"
              onClick={() => run({ type: "POST_DOCUMENT" })}
            >
              Провести
            </button>
          </Target>
          <button
            className="sc-secondary"
            onClick={() => run({ type: "SAVE_DOCUMENT" })}
          >
            Записать
          </button>
          {saved?.status === "posted" && (
            <Target id="payment.unpost">
              <button
                className="sc-secondary"
                onClick={() => run({ type: "UNPOST_DOCUMENT" })}
              >
                Отменить проведение
              </button>
            </Target>
          )}
          <button
            className="sc-secondary"
            onClick={() => run({ type: "CLOSE_FORM" })}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

function RealizationForm({ state, run }: { state: SalesCycleState; run: Run }) {
  const form = state.form;
  if (form?.kind !== "realization") return null;
  const saved = state.realizations.find((doc) => doc.id === form.docId);
  const dirty = isFormDirty(state);
  const basis = findInvoice(state, form.basisInvoiceId);
  const lines =
    saved && saved.basisInvoiceId === form.basisInvoiceId
      ? saved.lines
      : (basis?.lines ?? []);
  return (
    <div>
      <div className="training-page-title">
        <div>
          <small>Документ · {SALES_CYCLE_DATE}</small>
          <h2>Реализация товаров {saved ? saved.number : "(новая)"}</h2>
        </div>
        <StatusBadge
          status={saved ? saved.status : "new"}
          dirty={Boolean(saved) && dirty}
        />
      </div>
      <div className="training-form sc-form">
        <Target id="realization.basis" className="training-field-wrap">
          <label htmlFor="realization-basis">Основание (счёт на оплату)</label>
          <select
            id="realization-basis"
            value={form.basisInvoiceId}
            onChange={(event) =>
              run({
                type: "SET_REALIZATION_BASIS",
                invoiceId: event.target.value,
              })
            }
          >
            <option value="">— выберите счёт —</option>
            {state.invoices.map((invoice) => (
              <option key={invoice.id} value={invoice.id}>
                {invoice.number} ·{" "}
                {findCustomer(state, invoice.customerId)?.name} ·{" "}
                {formatKzt(calculateTotal(invoice.lines))}
              </option>
            ))}
          </select>
        </Target>
        <div className="sc-readonly-field">
          <span>Покупатель (из основания)</span>
          <strong>
            {basis ? findCustomer(state, basis.customerId)?.name : "—"}
          </strong>
        </div>
        <div className="sc-section-title">
          <strong>Товары (заполнены по счёту)</strong>
        </div>
        {lines.length ? (
          <LinesTable state={state} lines={lines} />
        ) : (
          <div className="training-empty">Выберите основание</div>
        )}
        <div className="sc-total">
          <span>Всего к отгрузке</span>
          <output aria-label="Итог реализации">
            {formatKzt(calculateTotal(lines))}
          </output>
        </div>
        {form.error && (
          <div className="sc-error" role="alert">
            {form.error}
          </div>
        )}
        <div className="sc-commands">
          <Target id="realization.post">
            <button
              className="training-save"
              onClick={() => run({ type: "POST_DOCUMENT" })}
            >
              Провести
            </button>
          </Target>
          <button
            className="sc-secondary"
            onClick={() => run({ type: "SAVE_DOCUMENT" })}
          >
            Записать
          </button>
          {saved?.status === "posted" && (
            <Target id="realization.unpost">
              <button
                className="sc-secondary"
                onClick={() => run({ type: "UNPOST_DOCUMENT" })}
              >
                Отменить проведение
              </button>
            </Target>
          )}
          <button
            className="sc-secondary"
            onClick={() => run({ type: "CLOSE_FORM" })}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

function DocumentList({
  title,
  kicker,
  createTarget,
  rows,
  onCreate,
  emptyText,
}: {
  title: string;
  kicker: string;
  createTarget: string;
  rows: {
    id: string;
    target: string;
    number: string;
    customer: string;
    amount: number;
    status: DocumentStatus;
    kind: "invoice" | "document";
    open: () => void;
  }[];
  onCreate: () => void;
  emptyText: string;
}) {
  return (
    <div>
      <div className="training-page-title">
        <div>
          <small>{kicker}</small>
          <h2>{title}</h2>
        </div>
        <Target id={createTarget}>
          <button className="training-primary-command" onClick={onCreate}>
            Создать
          </button>
        </Target>
      </div>
      <div className="training-list sc-doc-list">
        <div className="training-list-head">
          <span>Номер · контрагент</span>
          <span>Сумма</span>
          <span>Состояние</span>
        </div>
        {rows.length === 0 ? (
          <div className="training-empty">{emptyText}</div>
        ) : (
          rows.map((row) => (
            <Target id={row.target} key={row.id}>
              <button
                className="training-list-row sc-doc-row"
                onClick={row.open}
                aria-label={`Открыть ${row.number}`}
              >
                <span>
                  <strong>{row.number}</strong> · {row.customer}
                </span>
                <span>{formatKzt(row.amount)}</span>
                <ListStatus status={row.status} kind={row.kind} />
              </button>
            </Target>
          ))
        )}
      </div>
    </div>
  );
}

function SettlementsReport({ state }: { state: SalesCycleState }) {
  const customerIds = state.customers
    .map((customer) => customer.id)
    .filter(
      (id) =>
        state.payments.some((doc) => doc.customerId === id) ||
        state.realizations.some((doc) => doc.customerId === id),
    );
  const movements = [
    ...state.payments
      .filter((doc) => doc.status === "posted")
      .map((doc) => ({
        id: doc.id,
        text: `${doc.number} · оплата от ${findCustomer(state, doc.customerId)?.name}`,
        amount: -doc.amount,
      })),
    ...state.realizations
      .filter((doc) => doc.status === "posted")
      .map((doc) => ({
        id: doc.id,
        text: `${doc.number} · отгрузка ${findCustomer(state, doc.customerId)?.name}`,
        amount: calculateTotal(doc.lines),
      })),
  ];
  return (
    <div>
      <div className="training-page-title">
        <div>
          <small>Отчёт</small>
          <h2>Расчёты с покупателями</h2>
        </div>
      </div>
      <Target id="settlements.report">
        <div className="training-list sc-report">
          <div className="training-list-head sc-report-row">
            <span>Покупатель</span>
            <span>Отгружено</span>
            <span>Оплачено</span>
            <span>Остаток</span>
          </div>
          {customerIds.length === 0 ? (
            <div className="training-empty">Движений по расчётам нет</div>
          ) : (
            customerIds.map((id) => {
              const summary = calculateSettlement(state, id);
              return (
                <div
                  className="training-list-row sc-report-row"
                  key={id}
                  data-customer={id}
                >
                  <strong>{findCustomer(state, id)?.name}</strong>
                  <span>
                    <span className="sc-mobile-label">Отгружено</span>
                    {formatKzt(summary.shipped)}
                  </span>
                  <span>
                    <span className="sc-mobile-label">Оплачено</span>
                    {formatKzt(summary.paid)}
                  </span>
                  <span
                    className={
                      summary.balance > 0
                        ? "sc-debt"
                        : summary.balance < 0
                          ? "sc-advance"
                          : ""
                    }
                  >
                    {describeBalance(summary.balance)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </Target>
      <div className="sc-movements">
        <strong>Проведённые движения</strong>
        {movements.length === 0 ? (
          <p>
            Нет проведённых документов. Записанные, но не проведённые документы
            в отчёт не попадают.
          </p>
        ) : (
          <ul>
            {movements.map((movement) => (
              <li key={movement.id}>
                <span>{movement.text}</span>
                <span>
                  {movement.amount > 0 ? "+" : "−"}
                  {formatKzt(Math.abs(movement.amount))}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="training-form-note">
          Остаток = отгружено − оплачено. Положительный остаток — долг
          покупателя, отрицательный — полученный аванс.
        </p>
        <aside className="sc-model-notice" role="note">
          <strong>Учебная модель расчёта</strong>
          <span>
            Формула показывает логику этого сценария. Она не подтверждает точные
            проводки или автоматический зачёт аванса в конкретной сборке
            «1С:Бухгалтерии для Казахстана».
          </span>
        </aside>
      </div>
    </div>
  );
}

function Workarea({
  state,
  run,
  mode,
}: {
  state: SalesCycleState;
  run: Run;
  mode: TrainingMode;
}) {
  const customerName = (id: string) => findCustomer(state, id)?.name ?? "—";
  switch (state.screen) {
    case "home":
      return (
        <div className="training-start-screen">
          <span>Учебный сценарий · 120 минут</span>
          <h2>Продажа по предоплате</h2>
          <p>
            Счёт → оплата → реализация → контроль долга. Все документы и суммы
            вымышленные, валюта — тенге.
          </p>
          {mode !== "test" && (
            <div className="training-start-cue" role="status">
              <MousePointerClick size={18} />
              <div>
                <strong>Начните здесь</strong>
                <span>Нажмите «Продажи» в меню.</span>
              </div>
            </div>
          )}
        </div>
      );
    case "sales":
      return (
        <div>
          <div className="training-page-title">
            <div>
              <small>Раздел</small>
              <h2>Продажи</h2>
            </div>
          </div>
          <div className="training-command-cards">
            <Target id="sales.invoices">
              <button
                onClick={() =>
                  run({ type: "NAVIGATE", screen: "invoice-list" })
                }
              >
                <strong>Счета на оплату покупателям</strong>
                <span>Что и на какую сумму покупатель должен оплатить</span>
              </button>
            </Target>
            <Target id="sales.realizations">
              <button
                onClick={() =>
                  run({ type: "NAVIGATE", screen: "realization-list" })
                }
              >
                <strong>Реализация (акты, накладные)</strong>
                <span>Отгрузка товаров и услуг покупателю</span>
              </button>
            </Target>
            <Target id="sales.settlements">
              <button
                onClick={() => run({ type: "NAVIGATE", screen: "settlements" })}
              >
                <strong>Расчёты с покупателями</strong>
                <span>Отчёт: долг и авансы по проведённым документам</span>
              </button>
            </Target>
            <button disabled>
              <strong>Контрагенты</strong>
              <span>
                Учебные покупатели уже заведены в занятии «Покупатель»
              </span>
            </button>
          </div>
        </div>
      );
    case "bank":
      return (
        <div>
          <div className="training-page-title">
            <div>
              <small>Раздел</small>
              <h2>Банк и касса</h2>
            </div>
          </div>
          <div className="training-command-cards">
            <Target id="bank.receipts">
              <button
                onClick={() =>
                  run({ type: "NAVIGATE", screen: "payment-list" })
                }
              >
                <strong>Поступления на текущий счёт</strong>
                <span>Безналичные деньги, пришедшие по банковской выписке</span>
              </button>
            </Target>
            <button disabled>
              <strong>Списания с текущего счёта</strong>
              <span>Будет доступно в занятии о поставщиках</span>
            </button>
          </div>
        </div>
      );
    case "invoice-list":
      return (
        <DocumentList
          title="Счета на оплату покупателям"
          kicker="Документы"
          createTarget="invoices.create"
          emptyText="Счетов пока нет"
          onCreate={() => run({ type: "CREATE_INVOICE" })}
          rows={state.invoices.map((doc) => ({
            id: doc.id,
            target: `invoices.row.${doc.id}`,
            number: doc.number,
            customer: customerName(doc.customerId),
            amount: calculateTotal(doc.lines),
            status: "saved",
            kind: "invoice",
            open: () => run({ type: "OPEN_INVOICE", id: doc.id }),
          }))}
        />
      );
    case "payment-list":
      return (
        <DocumentList
          title="Поступления на текущий счёт"
          kicker="Банк"
          createTarget="payments.create"
          emptyText="Поступлений пока нет"
          onCreate={() => run({ type: "CREATE_PAYMENT" })}
          rows={state.payments.map((doc) => ({
            id: doc.id,
            target: `payments.row.${doc.id}`,
            number: doc.number,
            customer: customerName(doc.customerId),
            amount: doc.amount,
            status: doc.status,
            kind: "document",
            open: () => run({ type: "OPEN_PAYMENT", id: doc.id }),
          }))}
        />
      );
    case "realization-list":
      return (
        <DocumentList
          title="Реализация (акты, накладные)"
          kicker="Документы"
          createTarget="realizations.create"
          emptyText="Реализаций пока нет"
          onCreate={() => run({ type: "CREATE_REALIZATION" })}
          rows={state.realizations.map((doc) => ({
            id: doc.id,
            target: `realizations.row.${doc.id}`,
            number: doc.number,
            customer: customerName(doc.customerId),
            amount: calculateTotal(doc.lines),
            status: doc.status,
            kind: "document",
            open: () => run({ type: "OPEN_REALIZATION", id: doc.id }),
          }))}
        />
      );
    case "invoice-form":
      return <InvoiceForm state={state} run={run} />;
    case "payment-form":
      return <PaymentForm state={state} run={run} />;
    case "realization-form":
      return <RealizationForm state={state} run={run} />;
    case "settlements":
      return <SettlementsReport state={state} />;
  }
}

export function SalesCycleTrainingWorkspace() {
  const [state, dispatch] = useReducer(
    reduceSalesCycleState,
    undefined,
    createSalesCycleSeed,
  );
  const [mode, setMode] = useState<TrainingMode>("guided");
  const [hintLevel, setHintLevel] = useState(0);
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [sessionHintCount, setSessionHintCount] = useState(0);
  const [sessionShowActionCount, setSessionShowActionCount] = useState(0);
  const [sessionResetCount, setSessionResetCount] = useState(0);
  const [diagnosticLoaded, setDiagnosticLoaded] = useState(false);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  // On narrow screens the task panel sits above the workspace, so source data starts collapsed.
  const [sourceOpenByDefault] = useState(
    () => !window.matchMedia?.("(max-width: 900px)").matches,
  );
  const { progress, update } = useProgress();
  const savedProgress = progress[lessonId];

  const guidance = useMemo(
    () => (mode === "test" ? null : getSalesCycleGuidance(state)),
    [mode, state],
  );
  const verification = useMemo(() => verifySalesCycleState(state), [state]);
  const chain = useMemo(() => getSalesCycleProgress(state), [state]);
  const activeTarget = mode === "test" ? undefined : guidance?.targetId;
  // A preloaded diagnostic chain was not built by the learner, so it can only be an assisted completion.
  const assisted =
    sessionHintCount > 0 || sessionShowActionCount > 0 || diagnosticLoaded;

  useGuidanceBeacon(activeTarget, guidance);

  const save = (patch: Partial<LessonProgress>) =>
    update(lessonId, mergeLessonProgress(savedProgress, patch));

  const sessionMeta = (
    overrides: Partial<LessonProgress> = {},
  ): Partial<LessonProgress> => ({
    practiceMode: mode,
    hintCount: sessionHintCount,
    showActionCount: sessionShowActionCount,
    resetCount: sessionResetCount,
    ...overrides,
  });

  const passedCount = verification.assertions.filter(
    (item) => item.passed,
  ).length;

  const run: Run = (command) => {
    dispatch(command);
    setHintLevel(0);
    setVerificationVisible(false);
    save(sessionMeta({ status: "in_progress", currentStep: passedCount }));
  };

  const clearSession = () => {
    setHintLevel(0);
    setVerificationVisible(false);
    setSessionHintCount(0);
    setSessionShowActionCount(0);
    setDiagnosticLoaded(false);
    setDemoPlaying(false);
  };

  const reset = () => {
    dispatch({ type: "RESET" });
    clearSession();
    const nextResetCount = sessionResetCount + 1;
    setSessionResetCount(nextResetCount);
    save({
      status: "in_progress",
      currentStep: 0,
      practiceMode: mode,
      hintCount: 0,
      showActionCount: 0,
      resetCount: nextResetCount,
    });
  };

  const changeMode = (nextMode: TrainingMode) => {
    setMode(nextMode);
    dispatch({ type: "RESET" });
    clearSession();
    save({
      status: "in_progress",
      currentStep: 0,
      practiceMode: nextMode,
      hintCount: 0,
      showActionCount: 0,
      resetCount: sessionResetCount,
    });
  };

  const loadDiagnostic = () => {
    dispatch({ type: "LOAD_DIAGNOSTIC_CASE" });
    setDiagnosticLoaded(true);
    setHintLevel(0);
    setVerificationVisible(false);
    save(sessionMeta({ status: "in_progress", currentStep: 0 }));
  };

  const verify = () => {
    const result = verifySalesCycleState(state);
    setVerificationVisible(true);
    const isScored = mode !== "demo";
    save({
      status: isScored
        ? result.passed
          ? "completed"
          : "needs_retry"
        : "in_progress",
      currentStep: result.assertions.filter((item) => item.passed).length,
      attemptCount: (savedProgress?.attemptCount ?? 0) + 1,
      answer: result.assertions.map((item) => ({
        id: item.id,
        passed: item.passed,
      })),
      completionKind:
        isScored && result.passed
          ? assisted
            ? "completed_assisted"
            : "completed_unassisted"
          : undefined,
      ...sessionMeta(),
    });
  };

  useEffect(() => {
    if (verificationVisible)
      resultsRef.current?.scrollIntoView?.({
        block: "nearest",
        behavior: "smooth",
      });
  }, [verificationVisible]);

  const openHint = () => {
    setHintLevel((level) => Math.min(2, level + 1));
    const nextCount = sessionHintCount + 1;
    setSessionHintCount(nextCount);
    save(sessionMeta({ hintCount: nextCount }));
  };

  const showAction = () => {
    if (!guidance) return;
    const nextCount = sessionShowActionCount + 1;
    setSessionShowActionCount(nextCount);
    dispatch(guidance.action);
    setHintLevel(0);
    setVerificationVisible(false);
    save(
      sessionMeta({
        status: "in_progress",
        currentStep: passedCount,
        showActionCount: nextCount,
      }),
    );
  };

  // Demo autoplay walks the whole chain through the same show-action commands.
  const showActionRef = useRef(showAction);
  showActionRef.current = showAction;
  useEffect(() => {
    if (!demoPlaying || mode !== "demo") return;
    if (!guidance) {
      setDemoPlaying(false);
      return;
    }
    const timer = window.setTimeout(
      () => showActionRef.current(),
      DEMO_STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [demoPlaying, guidance, mode]);

  const stageOrder: SalesCycleStage[] = [
    "invoice",
    "payment",
    "realization",
    "control",
  ];
  const stageDone: Record<SalesCycleStage, boolean> = {
    invoice: chain.invoiceDone,
    payment: chain.paymentDone,
    realization: chain.realizationDone,
    control: chain.controlDone,
  };
  const currentStage = stageOrder.find((stage) => !stageDone[stage]);
  const inSales = [
    "sales",
    "invoice-list",
    "invoice-form",
    "realization-list",
    "realization-form",
    "settlements",
  ].includes(state.screen);
  const inBank = ["bank", "payment-list", "payment-form"].includes(
    state.screen,
  );

  return (
    <div className="training-shell sc-shell">
      <TrainingHeader mode={mode} onModeChange={changeMode} onReset={reset} />

      <div className="training-grid">
        <section className="training-app" aria-label="Учебная рабочая область">
          <header className="training-app-header">
            <div className="training-app-brand">Учебная бухгалтерия</div>
            <div className="training-app-context">ИП «Учебная Мебель»</div>
          </header>
          <div className="training-app-body">
            <nav
              className="training-nav"
              aria-label="Разделы учебной программы"
            >
              <button
                className={state.screen === "home" ? "active" : ""}
                onClick={() => run({ type: "NAVIGATE", screen: "home" })}
              >
                Главное
              </button>
              <Target id="nav.sales">
                <button
                  className={inSales ? "active" : ""}
                  onClick={() => run({ type: "NAVIGATE", screen: "sales" })}
                >
                  Продажи
                </button>
              </Target>
              <Target id="nav.bank">
                <button
                  className={inBank ? "active" : ""}
                  onClick={() => run({ type: "NAVIGATE", screen: "bank" })}
                >
                  Банк и касса
                </button>
              </Target>
              <button
                disabled
                title="Раздел появится в следующих принятых занятиях"
              >
                Покупки
              </button>
            </nav>
            <main className="training-workarea">
              <Workarea state={state} run={run} mode={mode} />
            </main>
          </div>
        </section>

        <aside className="training-task-panel">
          <div className="training-task-kicker">
            Практическая задача · 120 мин
          </div>
          <h2>Продажа по предоплате 50%</h2>
          {mode !== "test" && (
            <ol className="sc-stepper" aria-label="Ход цепочки">
              {stageOrder.map((stage) => (
                <li
                  key={stage}
                  className={
                    stageDone[stage]
                      ? "done"
                      : stage === currentStage
                        ? "current"
                        : ""
                  }
                  aria-current={stage === currentStage ? "step" : undefined}
                >
                  {stageDone[stage] ? (
                    <Check size={14} />
                  ) : (
                    <CircleDot size={14} />
                  )}{" "}
                  {stageLabels[stage]}
                </li>
              ))}
            </ol>
          )}

          {mode !== "test" && guidance && (
            <div className="training-coach">
              <div className="training-coach-head">
                <Sparkles size={18} />
                <strong>
                  {mode === "demo" ? "Демонстрация" : "Следующий шаг"}
                </strong>
                <span className="sc-stage-chip">
                  {stageLabels[guidance.stage]}
                </span>
              </div>
              <p>{guidance.instruction}</p>
              <details>
                <summary>Почему?</summary>
                <p>{guidance.why}</p>
              </details>
              {hintLevel > 0 && (
                <div className="training-hint">
                  <CircleHelp size={16} />
                  {hintLevel === 1 ? guidance.hint1 : guidance.hint2}
                </div>
              )}
              <div className="training-coach-actions">
                <button onClick={openHint}>Подсказка</button>
                <button onClick={showAction}>
                  {mode === "demo" ? "Показать действие" : "Сделать за меня"}
                </button>
                {mode === "demo" && (
                  <button onClick={() => setDemoPlaying((playing) => !playing)}>
                    <Play size={14} />{" "}
                    {demoPlaying ? "Пауза" : "Показать всю цепочку"}
                  </button>
                )}
              </div>
            </div>
          )}

          <details className="sc-source" open={sourceOpenByDefault}>
            <summary>Исходные данные</summary>
            <dl>
              <div>
                <dt>Покупатель</dt>
                <dd>{SALES_CYCLE_EXPECTED.customerName}, Кызылорда</dd>
              </div>
              <div>
                <dt>Заказ</dt>
                <dd>
                  Шкаф учебный — 2 шт по {formatKzt(122500)}
                  <br />
                  Стол учебный — 1 шт по {formatKzt(85000)}
                </dd>
              </div>
              <div>
                <dt>Условия</dt>
                <dd>50% предоплата до отгрузки, остаток — после отгрузки</dd>
              </div>
              <div>
                <dt>Банковская выписка</dt>
                <dd>
                  Поступила предоплата покупателя по счёту — 50% от его суммы
                </dd>
              </div>
              <div>
                <dt>Отгрузка</dt>
                <dd>После поступления предоплаты — весь заказ по счёту</dd>
              </div>
            </dl>
          </details>

          <details className="training-check-plan sc-check-plan">
            <summary>
              <strong>Что будет проверено</strong>
            </summary>
            <ul>
              <li>правильный покупатель в счёте;</li>
              <li>корректные позиции счёта;</li>
              <li>сумма рассчитана системой из строк;</li>
              <li>счёт записан;</li>
              <li>оплата связана с покупателем и счётом;</li>
              <li>сумма предоплаты;</li>
              <li>реализация проведена;</li>
              <li>остаток совпадает с учебной моделью расчёта.</li>
            </ul>
            <p>
              Проверяется состояние учебной базы. Число, введённое отдельно,
              ничего не доказывает.
            </p>
            <p className="sc-model-summary">
              Расчёт остатка в этом занятии — учебная модель. Точные проводки и
              правила зачёта для конкретной сборки 1С требуют отдельного
              подтверждения специалистом.
            </p>
          </details>

          {mode === "test" && (
            <div className="training-test-note">
              <strong>Самостоятельный режим</strong>
              <p>
                Подсказки, подсветка и ход цепочки скрыты. Проведите всю цепочку
                и затем проверьте результат.
              </p>
            </div>
          )}

          {!guidance && mode !== "test" && verification.passed && (
            <div className="training-ready">
              <Check /> Цепочка проведена и сверена. Проверьте состояние среды.
            </div>
          )}

          {mode === "guided" && (
            <div className="sc-diagnostic">
              <div className="training-coach-head">
                <Wrench size={16} />
                <strong>Разбор ошибки</strong>
              </div>
              {diagnosticLoaded ? (
                <p>
                  Загружена цепочка с ошибками. Нажмите «Проверить работу»,
                  найдите FAIL и исправьте документы — без «Начать заново».
                </p>
              ) : (
                <>
                  <p>
                    Загрузите цепочку, в которой бухгалтер ошибся, и исправьте
                    её без полного сброса.
                  </p>
                  <button onClick={loadDiagnostic}>
                    Загрузить цепочку с ошибками
                  </button>
                </>
              )}
            </div>
          )}

          {assisted && mode !== "demo" && (
            <div className="training-assisted-note">
              Результат будет отмечен как выполненный с помощью.
            </div>
          )}
          {mode === "demo" && (
            <div className="training-demo-note">
              Demo показывает механику, но не засчитывает завершение урока.
            </div>
          )}
          {savedProgress?.status === "completed" && (
            <div
              className="sc-completion"
              data-completion={savedProgress.completionKind}
            >
              Засчитано:{" "}
              {savedProgress.completionKind === "completed_unassisted"
                ? "самостоятельно, без помощи"
                : "с помощью"}
            </div>
          )}

          <button className="training-verify" onClick={verify}>
            Проверить работу
          </button>

          <div ref={resultsRef}>
            {verificationVisible && (
              <VerificationResults
                verification={verification}
                mode={mode}
                onDismiss={() => setVerificationVisible(false)}
              />
            )}
            {verificationVisible && mode === "demo" && (
              <div className="training-demo-note">
                Результат Demo не засчитывается. Выполните цепочку в режиме
                «Вести меня» или «Проверить себя».
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
