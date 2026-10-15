import { Check, RotateCcw, X } from "lucide-react";
import type { ReactNode } from "react";
import type { TrainingMode } from "../domain/customerCardScenario";
import type { PracticalVerificationResult } from "../domain/customerCardVerification";

/** Semantic guidance target: the beacon and show-action reference it by stable id. */
export function Target({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-training-target={id} className={className}>
      {children}
    </div>
  );
}

/** Training marker + learning-mode tabs + reset, shared by every embedded scenario. */
export function TrainingHeader({
  mode,
  onModeChange,
  onReset,
}: {
  mode: TrainingMode;
  onModeChange: (mode: TrainingMode) => void;
  onReset: () => void;
}) {
  return (
    <>
      <div className="training-banner">
        <strong>УЧЕБНАЯ СРЕДА — НЕ 1С</strong>
        <span>Вымышленные данные. Никаких реальных реквизитов.</span>
      </div>

      <div className="training-toolbar">
        <div>
          <span>Режим обучения</span>
          <div className="training-mode-tabs">
            <button
              className={mode === "demo" ? "active" : ""}
              onClick={() => onModeChange("demo")}
            >
              Показать
            </button>
            <button
              className={mode === "guided" ? "active" : ""}
              onClick={() => onModeChange("guided")}
            >
              Вести меня
            </button>
            <button
              className={mode === "test" ? "active" : ""}
              onClick={() => onModeChange("test")}
            >
              Проверить себя
            </button>
          </div>
        </div>
        <button className="training-reset" onClick={onReset}>
          <RotateCcw size={16} /> Начать заново
        </button>
      </div>
    </>
  );
}

/** Transparent per-assertion PASS/FAIL list produced by a state-based verifier. */
export function VerificationResults({
  verification,
  mode,
  onDismiss,
}: {
  verification: PracticalVerificationResult;
  mode: TrainingMode;
  onDismiss: () => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`training-results ${verification.passed ? "success" : "error"}`}
    >
      <h3>
        {verification.passed
          ? mode === "demo"
            ? "Демонстрация завершена"
            : "Работа выполнена"
          : "Нужно исправить"}
      </h3>
      {verification.assertions.map((item) => (
        <div
          className="training-result-row"
          key={item.id}
          data-assertion={item.id}
          data-passed={item.passed}
        >
          <span>{item.passed ? <Check size={17} /> : <X size={17} />}</span>
          <div>
            <strong>{item.label}</strong>
            <p>Ожидалось: {item.expected}</p>
            {!item.passed && (
              <>
                <p>Сейчас: {item.actual}</p>
                <small>{item.hint}</small>
              </>
            )}
          </div>
        </div>
      ))}
      {!verification.passed && (
        <button onClick={onDismiss}>Исправить и проверить снова</button>
      )}
    </div>
  );
}
