import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { LessonStatus } from "../../entities/course";

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  currentStep: number;
  attemptCount: number;
  note: string;
  answer?: unknown;
  updatedAt: string;
}
export interface ProgressRepository {
  getAll(): Record<string, LessonProgress>;
  save(progress: LessonProgress): void;
}
const KEY = "1c-tutor-progress";
export class LocalProgressRepository implements ProgressRepository {
  getAll() {
    try { return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, LessonProgress>; }
    catch { return {}; }
  }
  save(progress: LessonProgress) {
    localStorage.setItem(KEY, JSON.stringify({ ...this.getAll(), [progress.lessonId]: progress }));
  }
}
interface ProgressContextValue {
  progress: Record<string, LessonProgress>;
  update: (lessonId: string, patch: Partial<LessonProgress>) => void;
}
const ProgressContext = createContext<ProgressContextValue | null>(null);
export function ProgressProvider({ children, repository = new LocalProgressRepository() }: { children: ReactNode; repository?: ProgressRepository }) {
  const [progress, setProgress] = useState(repository.getAll());
  const value = useMemo(() => ({
    progress,
    update(lessonId: string, patch: Partial<LessonProgress>) {
      setProgress((current) => {
        const existing = current[lessonId] ?? { lessonId, status: "available", currentStep: 0, attemptCount: 0, note: "", updatedAt: new Date().toISOString() };
        const next = { ...existing, ...patch, lessonId, updatedAt: new Date().toISOString() };
        repository.save(next);
        return { ...current, [lessonId]: next };
      });
    },
  }), [progress, repository]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}
