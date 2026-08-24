import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LessonStatus } from "../../entities/course";
import {
  HybridProgressRepository,
  MiniBaseProgressTransport,
} from "./minibaseProgress";

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  currentStep: number;
  attemptCount: number;
  note: string;
  answer?: unknown;
  practiceMode?: "demo" | "guided" | "test";
  completionKind?: "completed_unassisted" | "completed_assisted";
  hintCount?: number;
  showActionCount?: number;
  resetCount?: number;
  updatedAt: string;
}
export type ProgressMap = Record<string, LessonProgress>;
export interface ProgressRepository {
  getAll(): ProgressMap;
  save(progress: LessonProgress): void | Promise<void>;
  hydrate?(): Promise<ProgressMap>;
}
const KEY = "1c-tutor-progress";
export class LocalProgressRepository implements ProgressRepository {
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<
        string,
        LessonProgress
      >;
    } catch {
      return {};
    }
  }
  save(progress: LessonProgress) {
    localStorage.setItem(
      KEY,
      JSON.stringify({ ...this.getAll(), [progress.lessonId]: progress }),
    );
  }
}

export function createProgressRepository(): ProgressRepository {
  const local = new LocalProgressRepository();
  return import.meta.env.VITE_MINIBASE_SYNC === "enabled"
    ? new HybridProgressRepository(local, new MiniBaseProgressTransport())
    : local;
}

const defaultProgressRepository = createProgressRepository();
interface ProgressContextValue {
  progress: Record<string, LessonProgress>;
  syncStatus: "local" | "syncing" | "synced" | "offline";
  update: (lessonId: string, patch: Partial<LessonProgress>) => void;
}
const ProgressContext = createContext<ProgressContextValue | null>(null);
export function ProgressProvider({
  children,
  repository = defaultProgressRepository,
}: {
  children: ReactNode;
  repository?: ProgressRepository;
}) {
  const [progress, setProgress] = useState(repository.getAll());
  const [syncStatus, setSyncStatus] = useState<
    ProgressContextValue["syncStatus"]
  >(repository.hydrate ? "syncing" : "local");
  useEffect(() => {
    let active = true;
    void repository
      .hydrate?.()
      .then((hydrated) => {
        if (active) {
          setProgress(hydrated);
          setSyncStatus("synced");
        }
      })
      .catch(() => {
        if (active) setSyncStatus("offline");
      });
    return () => {
      active = false;
    };
  }, [repository]);
  const value = useMemo(
    () => ({
      progress,
      syncStatus,
      update(lessonId: string, patch: Partial<LessonProgress>) {
        setProgress((current) => {
          const existing = current[lessonId] ?? {
            lessonId,
            status: "available",
            currentStep: 0,
            attemptCount: 0,
            note: "",
            updatedAt: new Date().toISOString(),
          };
          const next = {
            ...existing,
            ...patch,
            lessonId,
            updatedAt: new Date().toISOString(),
          };
          const save = repository.save(next);
          if (save) {
            void Promise.resolve()
              .then(() => {
                setSyncStatus("syncing");
                return save;
              })
              .then(() => setSyncStatus("synced"))
              .catch(() => setSyncStatus("offline"));
          }
          return { ...current, [lessonId]: next };
        });
      },
    }),
    [progress, repository, syncStatus],
  );
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}
export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value)
    throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}
