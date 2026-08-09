import { z } from "zod";
import { MiniBaseClient, MiniBaseClientError } from "../../shared/minibase/client";
import { miniBaseConfig } from "../../shared/minibase/config";
import type { LessonProgress, ProgressRepository } from "./progress";

const STORAGE_KEY = "1c-tutor-progress";
const MIGRATION_KEY = "1c-tutor-minibase-migration-v1";

const lessonProgressSchema = z.object({
  lessonId: z.string().min(1),
  status: z.enum(["locked", "available", "in_progress", "submitted", "completed", "needs_retry"]),
  currentStep: z.number().int().nonnegative(),
  attemptCount: z.number().int().nonnegative(),
  note: z.string(),
  answer: z.unknown().optional(),
  updatedAt: z.string().datetime({ offset: true }),
});

const progressDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  updatedAt: z.string().datetime({ offset: true }),
  lastLessonId: z.string().nullable(),
  courseProgress: z.record(z.string(), z.unknown()),
  lessonProgress: z.record(z.string(), lessonProgressSchema),
  settings: z.record(z.string(), z.unknown()),
});

const noteDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  lessonId: z.string().min(1),
  text: z.string(),
  updatedAt: z.string().datetime({ offset: true }),
});

export function mergeProgressByUpdatedAt(
  local: Record<string, LessonProgress>,
  remote: Record<string, LessonProgress>,
): Record<string, LessonProgress> {
  const merged = { ...remote };
  for (const [lessonId, progress] of Object.entries(local)) {
    const remoteProgress = remote[lessonId];
    if (!remoteProgress || Date.parse(progress.updatedAt) > Date.parse(remoteProgress.updatedAt)) {
      merged[lessonId] = progress;
    }
  }
  return merged;
}

export class LocalProgressRepository implements ProgressRepository {
  getCached(): Record<string, LessonProgress> {
    try {
      return z.record(z.string(), lessonProgressSchema).parse(
        JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"),
      );
    } catch {
      return {};
    }
  }

  async hydrate(): Promise<Record<string, LessonProgress>> {
    return this.getCached();
  }

  async saveAll(progress: Record<string, LessonProgress>): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  save(progress: LessonProgress): void {
    void this.saveAll({ ...this.getCached(), [progress.lessonId]: progress });
  }

  getAll(): Record<string, LessonProgress> {
    return this.getCached();
  }
}

export class MiniBaseProgressRepository implements ProgressRepository {
  private pendingProgress: Record<string, LessonProgress> | null = null;
  private flushPromise: Promise<void> | null = null;

  constructor(
    private readonly client: MiniBaseClient,
    private readonly local = new LocalProgressRepository(),
  ) {}

  getCached(): Record<string, LessonProgress> {
    return this.local.getCached();
  }

  private async getRemote(): Promise<Record<string, LessonProgress>> {
    let lessonProgress: Record<string, LessonProgress> = {};
    try {
      const record = await this.client.get<Record<string, unknown>>("tutor_progress", "owner");
      lessonProgress = progressDocumentSchema.parse(record.data).lessonProgress;
    } catch (error) {
      if (!(error instanceof MiniBaseClientError && error.status === 404)) throw error;
    }

    const notes = await this.client.list<Record<string, unknown>>("tutor_notes", { limit: 100 });
    for (const record of notes.records) {
      const note = noteDocumentSchema.parse(record.data);
      const current = lessonProgress[note.lessonId];
      if (current && Date.parse(note.updatedAt) >= Date.parse(current.updatedAt)) {
        lessonProgress[note.lessonId] = { ...current, note: note.text, updatedAt: note.updatedAt };
      }
    }
    return lessonProgress;
  }

  async hydrate(): Promise<Record<string, LessonProgress>> {
    const remoteProgress = await this.getRemote();
    const localProgress = this.local.getCached();
    const merged = mergeProgressByUpdatedAt(localProgress, remoteProgress);
    await this.local.saveAll(merged);

    if (localStorage.getItem(MIGRATION_KEY) !== "done" || JSON.stringify(merged) !== JSON.stringify(remoteProgress)) {
      await this.enqueueRemote(merged);
      localStorage.setItem(MIGRATION_KEY, "done");
    }
    return merged;
  }

  private async saveRemote(progress: Record<string, LessonProgress>): Promise<void> {
    const entries = Object.values(progress);
    const updatedAt = entries.reduce(
      (latest, item) => Date.parse(item.updatedAt) > Date.parse(latest) ? item.updatedAt : latest,
      "1970-01-01T00:00:00.000Z",
    );
    const lastLessonId = entries.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0]?.lessonId ?? null;
    const document = progressDocumentSchema.parse({
      schemaVersion: 1,
      updatedAt,
      lastLessonId,
      courseProgress: {},
      lessonProgress: progress,
      settings: {},
    });
    await this.client.put("tutor_progress", "owner", document);
    await Promise.all(entries.map((item) => this.client.put("tutor_notes", `lesson_${item.lessonId}`, {
      schemaVersion: 1,
      lessonId: item.lessonId,
      text: item.note,
      updatedAt: item.updatedAt,
    })));
  }

  private enqueueRemote(progress: Record<string, LessonProgress>): Promise<void> {
    this.pendingProgress = progress;
    if (!this.flushPromise) {
      this.flushPromise = (async () => {
        while (this.pendingProgress) {
          const latest = this.pendingProgress;
          this.pendingProgress = null;
          await this.saveRemote(latest);
        }
      })().finally(() => {
        this.flushPromise = null;
      });
    }
    return this.flushPromise;
  }

  async saveAll(progress: Record<string, LessonProgress>): Promise<void> {
    await this.local.saveAll(progress);
    return this.enqueueRemote(progress);
  }
}

export function createProgressRepository(): ProgressRepository {
  if (miniBaseConfig.mode === "local") return new LocalProgressRepository();
  return new MiniBaseProgressRepository(new MiniBaseClient({
    baseUrl: miniBaseConfig.baseUrl,
    publishableKey: miniBaseConfig.publishableKey,
    requireSession: true,
  }));
}

export const progressRepositoryInternals = {
  newest: mergeProgressByUpdatedAt,
  STORAGE_KEY,
  MIGRATION_KEY,
};
