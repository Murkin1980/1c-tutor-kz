import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TrainingModeGuard } from "../features/simulators/TrainingMode";
import { assertTrainingIdentifier } from "../features/simulators/safety";

export function SimulatorShellPage({ type }: { type?: "fno" | "esf" }) {
  const params = useParams();
  const simulatorType = type ?? (params.type === "esf" ? "esf" : "fno");
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const title = simulatorType === "esf" ? "Shell ИС ЭСФ" : "Shell налоговой отчётности";

  function validateIdentifier() {
    try {
      assertTrainingIdentifier(identifier);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Недопустимое значение");
    }
  }

  return <TrainingModeGuard><div className="simulator-shell">
    <aside className="simulator-nav" aria-label="Навигация симулятора">
      <strong>{title}</strong>
      <span>Версия UI: не утверждена</span>
      <nav><Link to="/simulators">Каталог</Link><button type="button">Журнал — placeholder</button><button type="button">Черновики — placeholder</button></nav>
    </aside>
    <section className="simulator-workspace">
      <header><div><span className="eyebrow">Исследовательский UI-shell</span><h1>{params.scenarioId ? `Сценарий: ${params.scenarioId}` : title}</h1></div><span className="status-chip">Только локальная имитация</span></header>
      <div className="simulator-notice">Паспорт официального экрана ещё не утверждён. Названия и расположение ниже не являются копией портала.</div>
      <div className="simulator-panel">
        <label htmlFor="training-identifier">Учебный идентификатор</label>
        <div className="simulator-field-row"><input id="training-identifier" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="Например, TRAINING-OWNER" /><button type="button" onClick={validateIdentifier}>Проверить</button></div>
        {error && <p className="field-error" role="alert">{error}</p>}
      </div>
      <div className="simulator-actions"><button type="button" onClick={() => alert("Учебная подпись имитирована. ЭЦП не запрашивалась.")}>Имитировать подпись</button><button type="button" className="button accent" onClick={() => alert("Учебная отправка имитирована локально. Сетевой запрос не выполнялся.")}>Имитировать отправку</button></div>
    </section>
  </div></TrainingModeGuard>;
}
