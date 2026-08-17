import { FileSpreadsheet, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";
import { TrainingModeGuard } from "../features/simulators/TrainingMode";

export function SimulatorsPage() {
  return <TrainingModeGuard><div className="page simulator-catalog">
    <div className="eyebrow">Безопасная практика</div>
    <h1>Учебные симуляторы</h1>
    <p>Оболочки подготовлены для исследования. Окончательная структура появится только после утверждения паспорта официального интерфейса.</p>
    <div className="simulator-grid">
      <Link className="simulator-card" to="/simulators/fno"><FileSpreadsheet /><h2>Налоговая отчётность</h2><p>Учебный shell журнала ФНО, без подписи и отправки.</p></Link>
      <Link className="simulator-card" to="/simulators/esf"><ReceiptText /><h2>ИС ЭСФ</h2><p>Учебный shell журнала ЭСФ, без ЭЦП и регистрации.</p></Link>
    </div>
  </div></TrainingModeGuard>;
}
