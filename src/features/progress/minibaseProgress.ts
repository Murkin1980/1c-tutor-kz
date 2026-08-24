import { z } from "zod";
import type {
  LessonProgress,
  ProgressMap,
  ProgressRepository,
} from "./progress";

const lessonProgressSchema = z.object({
  lessonId: z.string().min(1),
  status: z.enum([
    "locked",
    "available",
    "in_progress",
    "submitted",
    "completed",
    "needs_retry",
  ]),
  currentStep: z.number().int().nonnegative(),
  attemptCount: z.number().int().nonnegative(),
  note: z.string(),
  answer: z.unknown().optional(),
  practiceMode: z.enum(["demo", "guided", "test"]).optional(),
  completionKind: z
    .enum(["completed_unassisted", "completed_assisted"])
    .optional(),
  hintCount: z.number().int().nonnegative().optional(),
  showActionCount: z.number().int().nonnegative().optional(),
  resetCount: z.number().int().nonnegative().optional(),
  updatedAt: z.iso.datetime(),
});

const progressEnvelopeSchema = z.object({
  schemaVersion: z.literal(1),
  updatedAt: z.iso.datetime().nullable(),
  lessonProgress: z.record(z.string(), lessonProgressSchema),
});

export type ProgressEnvelope = z.infer<typeof progressEnvelopeSchema>;

export function mergeProgressMaps(
  local: ProgressMap,
  remote: ProgressMap,
): ProgressMap {
  const merged = { ...remote };
  for (const [lessonId, localProgress] of Object.entries(local)) {
    const remoteProgress = remote[lessonId];
    if (
      !remoteProgress ||
      Date.parse(localProgress.updatedAt) >=
        Date.parse(remoteProgress.updatedAt)
    ) {
      merged[lessonId] = localProgress;
    }
  }
  return merged;
}

function latestUpdatedAt(progress: ProgressMap): string | null {
  return (
    Object.values(progress)
      .map((item) => item.updatedAt)
      .sort()
      .at(-1) ?? null
  );
}

export class MiniBaseProgressTransport {
  constructor(
    private readonly endpoint = "/api/progress",
    private readonly requestFetch: typeof fetch = globalThis.fetch.bind(
      globalThis,
    ),
  ) {}

  async load(): Promise<ProgressMap> {
    const response = await this.requestFetch(this.endpoint, {
      credentials: "same-origin",
      headers: { accept: "application/json" },
    });
    if (!response.ok) throw new Error(`progress_load_${response.status}`);
    return progressEnvelopeSchema.parse(await response.json()).lessonProgress;
  }

  async save(progress: ProgressMap): Promise<void> {
    const envelope: ProgressEnvelope = {
      schemaVersion: 1,
      updatedAt: latestUpdatedAt(progress),
      lessonProgress: progress,
    };
    const response = await this.requestFetch(this.endpoint, {
      method: "PUT",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(progressEnvelopeSchema.parse(envelope)),
    });
    if (!response.ok) throw new Error(`progress_save_${response.status}`);
  }
}

export class HybridProgressRepository implements ProgressRepository {
  private pendingSync: Promise<void> = Promise.resolve();

  constructor(
    private readonly local: ProgressRepository,
    private readonly remote: MiniBaseProgressTransport,
  ) {}

  getAll(): ProgressMap {
    return this.local.getAll();
  }

  save(progress: LessonProgress): Promise<void> {
    this.local.save(progress);
    return this.queueRemoteSave(this.local.getAll());
  }

  async hydrate(): Promise<ProgressMap> {
    const merged = mergeProgressMaps(
      this.local.getAll(),
      await this.remote.load(),
    );
    for (const progress of Object.values(merged)) this.local.save(progress);
    await this.remote.save(merged);
    return merged;
  }

  async flush(): Promise<void> {
    await this.pendingSync;
  }

  private queueRemoteSave(progress: ProgressMap): Promise<void> {
    this.pendingSync = this.pendingSync
      .catch(() => undefined)
      .then(() => this.remote.save(progress));
    void this.pendingSync.catch(() => undefined);
    return this.pendingSync;
  }
}
