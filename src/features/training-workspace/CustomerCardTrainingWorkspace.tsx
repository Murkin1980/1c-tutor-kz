import { Check, CircleHelp, MousePointerClick, RotateCcw, Sparkles, X } from "lucide-react";
import { hints, type Hints } from "driver.js/hints";
import { useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { useProgress } from "../progress/progress";
import {
  createCustomerCardSeed,
  CUSTOMER_CARD_EXPECTED,
  reduceCustomerCardState,
  type CustomerCardCommand,
  type TrainingMode,
} from "./domain/customerCardScenario";
import { verifyCustomerCardState } from "./domain/customerCardVerification";
import { getCustomerCardGuidance } from "./guidance/customerCardGuidance";
import "./training-workspace.css";
import "driver.js/dist/hints.css";

const lessonId = "customer-card";

function Target({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return <div data-training-target={id} className={className}>{children}</div>;
}

export function CustomerCardTrainingWorkspace() {
  const [state, dispatch] = useReducer(reduceCustomerCardState, undefined, createCustomerCardSeed);
  const [mode, setMode] = useState<TrainingMode>("guided");
  const [hintLevel, setHintLevel] = useState(0);
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [sessionHintCount, setSessionHintCount] = useState(0);
  const [sessionShowActionCount, setSessionShowActionCount] = useState(0);
  const [sessionResetCount, setSessionResetCount] = useState(0);
  const { progress, update } = useProgress();
  const savedProgress = progress[lessonId];

  const guidance = useMemo(() => mode === "test" ? null : getCustomerCardGuidance(state), [mode, state]);
  const verification = useMemo(() => verifyCustomerCardState(state), [state]);
  const activeTarget = mode === "test" ? undefined : guidance?.targetId;
  const hintsRef = useRef<Hints | null>(null);
  const assisted = sessionHintCount > 0 || sessionShowActionCount > 0;

  useEffect(() => {
    const currentHints = hintsRef.current ?? hints({
      overlay: false,
      beacon: {
        side: "right",
        align: "center",
        animate: true,
        className: "training-driver-hint",
      },
    });
    hintsRef.current = currentHints;

    currentHints.hide();
    if (!activeTarget || !guidance) {
      currentHints.setHints([]);
      return;
    }

    const target = document.querySelector(`[data-training-target="${activeTarget}"]`);
    if (!target) {
      currentHints.setHints([]);
      return;
    }

    currentHints.setHints([{
      id: guidance.id,
      element: target,
      beacon: {
        side: "right",
        align: "center",
        animate: true,
        className: "training-driver-hint",
      },
    }]);
    currentHints.show();

    return () => {
      currentHints.hide();
    };
  }, [activeTarget, guidance]);

  useEffect(() => () => {
    hintsRef.current?.hide();
    hintsRef.current = null;
  }, []);

  const persistSessionMeta = (patch: Record<string, unknown> = {}) => {
    update(lessonId, {
      practiceMode: mode,
      hintCount: sessionHintCount,
      showActionCount: sessionShowActionCount,
      resetCount: sessionResetCount,
      ...patch,
    });
  };

  const run = (command: CustomerCardCommand) => {
    dispatch(command);
    setHintLevel(0);
    setVerificationVisible(false);
    persistSessionMeta({ status: "in_progress", currentStep: state.actionLog.length + 1 });
  };

  const reset = (countReset = true) => {
    dispatch({ type: "RESET" });
    setHintLevel(0);
    setVerificationVisible(false);
    setSessionHintCount(0);
    setSessionShowActionCount(0);
    if (countReset) {
      const nextResetCount = sessionResetCount + 1;
      setSessionResetCount(nextResetCount);
      update(lessonId, { status: "in_progress", currentStep: 0, practiceMode: mode, hintCount: 0, showActionCount: 0, resetCount: nextResetCount });
    } else {
      update(lessonId, { status: "in_progress", currentStep: 0, practiceMode: mode, hintCount: 0, showActionCount: 0 });
    }
  };

  const changeMode = (nextMode: TrainingMode) => {
    setMode(nextMode);
    dispatch({ type: "RESET" });
    setHintLevel(0);
    setVerificationVisible(false);
    setSessionHintCount(0);
    setSessionShowActionCount(0);
    update(lessonId, { status: "in_progress", currentStep: 0, practiceMode: nextMode, hintCount: 0, showActionCount: 0 });
  };

  const verify = () => {
    const result = verifyCustomerCardState(state);
    setVerificationVisible(true);
    const isScored = mode !== "demo";
    update(lessonId, {
      status: isScored ? (result.passed ? "completed" : "needs_retry") : "in_progress",
      currentStep: result.passed ? 6 : savedProgress?.currentStep ?? 0,
      attemptCount: (savedProgress?.attemptCount ?? 0) + 1,
      answer: result.assertions.map((item) => ({ id: item.id, passed: item.passed })),
      practiceMode: mode,
      completionKind: isScored && result.passed ? (assisted ? "completed_assisted" : "completed_unassisted") : undefined,
      hintCount: sessionHintCount,
      showActionCount: sessionShowActionCount,
      resetCount: sessionResetCount,
    });
  };

  const openHint = () => {
    setHintLevel((level) => Math.min(2, level + 1));
    const nextCount = sessionHintCount + 1;
    setSessionHintCount(nextCount);
    update(lessonId, { practiceMode: mode, hintCount: nextCount, showActionCount: sessionShowActionCount, resetCount: sessionResetCount });
  };

  const showAction = () => {
    if (!guidance) return;
    const actionByStep: Record<string, CustomerCardCommand> = {
      "open-sales": { type: "OPEN_SALES" },
      "open-counterparties": { type: "OPEN_COUNTERPARTIES" },
      "create-counterparty": { type: "CREATE_COUNTERPARTY" },
      "fill-name": { type: "SET_NAME", value: CUSTOMER_CARD_EXPECTED.name },
      "fill-city": { type: "SET_CITY", value: CUSTOMER_CARD_EXPECTED.city },
      "save-counterparty": { type: "SAVE_COUNTERPARTY" },
    };
    const command = actionByStep[guidance.id];
    if (!command) return;
    const nextCount = sessionShowActionCount + 1;
    setSessionShowActionCount(nextCount);
    dispatch(command);
    setHintLevel(0);
    setVerificationVisible(false);
    update(lessonId, {
      status: "in_progress",
      currentStep: state.actionLog.length + 1,
      practiceMode: mode,
      hintCount: sessionHintCount,
      showActionCount: nextCount,
      resetCount: sessionResetCount,
    });
  };

  return <div className="training-shell">
    <div className="training-banner"><strong>УЧЕБНАЯ СРЕДА — НЕ 1С</strong><span>Вымышленные данные. Никаких реальных реквизитов.</span></div>

    <div className="training-toolbar">
      <div>
        <span>Режим обучения</span>
        <div className="training-mode-tabs">
          <button className={mode === "demo" ? "active" : ""} onClick={() => changeMode("demo")}>Показать</button>
          <button className={mode === "guided" ? "active" : ""} onClick={() => changeMode("guided")}>Вести меня</button>
          <button className={mode === "test" ? "active" : ""} onClick={() => changeMode("test")}>Проверить себя</button>
        </div>
      </div>
      <button className="training-reset" onClick={() => reset(true)}><RotateCcw size={16}/> Начать заново</button>
    </div>

    <div className="training-grid">
      <section className="training-app" aria-label="Учебная рабочая область">
        <header className="training-app-header">
          <div className="training-app-brand">Учебная бухгалтерия</div>
          <div className="training-app-context">ИП «Учебная Мебель»</div>
        </header>

        <div className="training-app-body">
          <nav className="training-nav" aria-label="Разделы учебной программы">
            <button className={state.screen === "home" ? "active" : ""} onClick={() => reset(false)}>Главное</button>
            <Target id="nav.sales">
              <button className={["sales", "counterparties", "counterparty-form"].includes(state.screen) ? "active" : ""} onClick={() => run({ type: "OPEN_SALES" })}>Продажи</button>
            </Target>
            <button disabled title="Раздел появится в следующих принятых занятиях">Покупки</button>
            <button disabled title="Раздел появится в следующих принятых занятиях">Банк и касса</button>
          </nav>

          <main className="training-workarea">
            {state.screen === "home" && <div className="training-start-screen"><span>Учебный сценарий</span><h2>Карточка покупателя</h2><p>Откройте раздел продаж и создайте вымышленного контрагента.</p>{mode !== "test" && <div className="training-start-cue" role="status"><MousePointerClick size={18}/><div><strong>Начните здесь</strong><span>Нажмите «Продажи» в меню.</span></div></div>}</div>}

            {state.screen === "sales" && <div>
              <div className="training-page-title"><div><small>Раздел</small><h2>Продажи</h2></div></div>
              <div className="training-command-cards">
                <Target id="sales.counterparties">
                  <button onClick={() => run({ type: "OPEN_COUNTERPARTIES" })}><strong>Контрагенты</strong><span>Покупатели, поставщики и другие деловые партнёры</span></button>
                </Target>
                <button disabled aria-describedby="invoice-availability"><strong>Счета покупателям</strong><span id="invoice-availability">Будет доступно после проверки первого сценария</span></button>
              </div>
            </div>}

            {state.screen === "counterparties" && <div>
              <div className="training-page-title"><div><small>Справочник</small><h2>Контрагенты</h2></div><Target id="counterparties.create"><button className="training-primary-command" onClick={() => run({ type: "CREATE_COUNTERPARTY" })}>Создать</button></Target></div>
              <div className="training-list">
                <div className="training-list-head"><span>Наименование</span><span>Город</span><span>Состояние</span></div>
                {state.counterparties.length === 0 ? <div className="training-empty">Пока нет учебных контрагентов</div> : state.counterparties.map((item) => <div className="training-list-row" key={item.id}><strong>{item.name}</strong><span>{item.city}</span><span className="training-saved"><Check size={14}/> Сохранён</span></div>)}
              </div>
            </div>}

            {state.screen === "counterparty-form" && <div>
              <div className="training-page-title"><div><small>Новая карточка</small><h2>Контрагент</h2></div></div>
              <div className="training-form">
                <Target id="counterparty.name" className="training-field-wrap">
                  <label htmlFor="counterparty-name">Наименование</label>
                  <input id="counterparty-name" value={state.draft.name} onChange={(event) => run({ type: "SET_NAME", value: event.target.value })} placeholder="Введите учебное название" />
                </Target>
                <Target id="counterparty.city" className="training-field-wrap">
                  <label htmlFor="counterparty-city">Город</label>
                  <input id="counterparty-city" value={state.draft.city} onChange={(event) => run({ type: "SET_CITY", value: event.target.value })} placeholder="Введите учебный город" />
                </Target>
                <div className="training-form-note">Точные названия и расположение полей подлежат сверке с Interface Passport выбранной сборки 1С. Этот экран проверяет учебную логику, а не заявляет pixel-perfect копию.</div>
                <Target id="counterparty.save">
                  <button className="training-save" disabled={!state.draft.name.trim() || !state.draft.city.trim()} onClick={() => run({ type: "SAVE_COUNTERPARTY" })}>Сохранить и закрыть</button>
                </Target>
              </div>
            </div>}
          </main>
        </div>
      </section>

      <aside className="training-task-panel">
        <div className="training-task-kicker">Практическая задача</div>
        <h2>Создайте учебного покупателя</h2>
        <dl><div><dt>Покупатель</dt><dd>{CUSTOMER_CARD_EXPECTED.name}</dd></div><div><dt>Город</dt><dd>{CUSTOMER_CARD_EXPECTED.city}</dd></div></dl>

        <div className="training-check-plan"><strong>Что будет проверено</strong><ul><li>карточка реально создана;</li><li>название совпадает;</li><li>город совпадает;</li><li>карточка сохранена.</li></ul></div>

        {mode !== "test" && guidance && <div className="training-coach">
          <div className="training-coach-head"><Sparkles size={18}/><strong>{mode === "demo" ? "Демонстрация" : "Следующий шаг"}</strong></div>
          <p>{guidance.instruction}</p>
          <details><summary>Почему?</summary><p>{guidance.why}</p></details>
          {hintLevel > 0 && <div className="training-hint"><CircleHelp size={16}/>{hintLevel === 1 ? guidance.hint1 : guidance.hint2}</div>}
          <div className="training-coach-actions">
            <button onClick={openHint}>Подсказка</button>
            <button onClick={showAction}>{mode === "demo" ? "Показать действие" : "Сделать за меня"}</button>
          </div>
        </div>}

        {mode === "test" && <div className="training-test-note"><strong>Самостоятельный режим</strong><p>Подсказки и подсветка отключены. Выполните задачу свободно и затем проверьте результат.</p></div>}

        {!guidance && mode !== "test" && verification.passed && <div className="training-ready"><Check/> Шаги выполнены. Проверьте состояние среды.</div>}

        {assisted && mode !== "demo" && <div className="training-assisted-note">Результат будет отмечен как выполненный с помощью.</div>}
        {mode === "demo" && <div className="training-demo-note">Demo показывает механику, но не засчитывает завершение урока.</div>}

        <button className="training-verify" onClick={verify}>Проверить работу</button>

        {verificationVisible && <div role="status" aria-live="polite" className={`training-results ${verification.passed ? "success" : "error"}`}>
          <h3>{verification.passed ? (mode === "demo" ? "Демонстрация завершена" : "Работа выполнена") : "Нужно исправить"}</h3>
          {verification.assertions.map((item) => <div className="training-result-row" key={item.id}>
            <span>{item.passed ? <Check size={17}/> : <X size={17}/>}</span>
            <div><strong>{item.label}</strong><p>Ожидалось: {item.expected}</p>{!item.passed && <><p>Сейчас: {item.actual}</p><small>{item.hint}</small></>}</div>
          </div>)}
          {!verification.passed && <button onClick={() => setVerificationVisible(false)}>Исправить и проверить снова</button>}
        </div>}
      </aside>
    </div>
  </div>;
}
