import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { LessonStatus } from "../../entities/course";
import { MINIBASE_SESSION_EVENT, MiniBaseClientError } from "../../shared/minibase/client";
import {
  createProgressRepository,
  LocalProgressRepository,
  mergeProgressByUpdatedAt,
} from "./repositories";

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
  getCached(): Record<string, LessonProgress>;
  hydrate(): Promise<Record<string, LessonProgress>>;
  saveAll(progress: Record<string, LessonProgress>): Promise<void>;
}
interface ProgressContextValue {
  progress: Record<string, LessonProgress>;
  update: (lessonId: string, patch: Partial<LessonProgress>) => void;
  syncStatus: "local" | "syncing" | "synced" | "error";
  retrySync: () => void;
}
const ProgressContext = createContext<ProgressContextValue | null>(null);
export function ProgressProvider({ children, repository }: { children: ReactNode; repository?: ProgressRepository }) {
  const [activeRepository] = useState(() => repository ?? createProgressRepository());
  const [progress, setProgress] = useState(activeRepository.getCached());
  const [syncStatus, setSyncStatus] = useState<ProgressContextValue["syncStatus"]>(
    activeRepository instanceof LocalProgressRepository ? "local" : "syncing",
  );
  const [syncAttempt, setSyncAttempt] = useState(0);

  useEffect(() => {
    const retryAfterSessionChange = () => setSyncAttempt((attempt) => attempt + 1);
    globalThis.addEventListener?.(MINIBASE_SESSION_EVENT, retryAfterSessionChange);
    return () => globalThis.removeEventListener?.(MINIBASE_SESSION_EVENT, retryAfterSessionChange);
  }, []);

  useEffect(() => {
    let active = true;
    if (activeRepository instanceof LocalProgressRepository) return;
    setSyncStatus("syncing");
    void activeRepository.hydrate()
      .then((hydrated) => {
        if (!active) return;
        setProgress((current) => mergeProgressByUpdatedAt(current, hydrated));
        setSyncStatus("synced");
      })
      .catch((error: unknown) => {
        console.error("MiniBase progress hydration failed", error);
        if (active) setSyncStatus(
          error instanceof MiniBaseClientError && error.code === "session_required" ? "local" : "error",
        );
      });
    return () => { active = false; };
  }, [activeRepository, syncAttempt]);

  const value = useMemo(() => ({
    progress,
    syncStatus,
    retrySync: () => setSyncAttempt((attempt) => attempt + 1),
    update(lessonId: string, patch: Partial<LessonProgress>) {
      setProgress((current) => {
        const existing = current[lessonId] ?? { lessonId, status: "available", currentStep: 0, attemptCount: 0, note: "", updatedAt: new Date().toISOString() };
        const next = { ...existing, ...patch, lessonId, updatedAt: new Date().toISOString() };
        const allProgress = { ...current, [lessonId]: next };
        void activeRepository.saveAll(allProgress)
          .then(() => setSyncStatus(activeRepository instanceof LocalProgressRepository ? "local" : "synced"))
          .catch((error: unknown) => {
            console.error("MiniBase progress save failed", error);
            setSyncStatus(
              error instanceof MiniBaseClientError && error.code === "session_required" ? "local" : "error",
            );
          });
        return allProgress;
      });
    },
  }), [activeRepository, progress, syncStatus]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}

export { LocalProgressRepository } from "./repositories";
