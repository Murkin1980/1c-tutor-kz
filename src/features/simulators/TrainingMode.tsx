import type { PropsWithChildren } from "react";

export function TrainingModeBanner() {
  return <div className="training-banner" role="status">УЧЕБНЫЙ СИМУЛЯТОР — ДАННЫЕ НЕ ОТПРАВЛЯЮТСЯ</div>;
}

export function TrainingWatermark() {
  return <div className="training-watermark" aria-hidden="true">TRAINING ONLY</div>;
}

export function TrainingModeGuard({ children }: PropsWithChildren) {
  return <div className="training-mode"><TrainingModeBanner /><TrainingWatermark />{children}</div>;
}
