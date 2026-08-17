import { MiniBaseClient } from "../../shared/minibase/client";
import type { LessonProgress } from "./progress";
import {
  LocalProgressRepository,
  MiniBaseProgressRepository,
  progressRepositoryInternals,
} from "./repositories";

const progress = (updatedAt: string, note = ""): LessonProgress => ({
  lessonId: "welcome",
  status: "in_progress",
  currentStep: 2,
  attemptCount: 1,
  note,
  updatedAt,
});

function memoryMiniBase(initial?: LessonProgress) {
  const records = new Map<string, Record<string, unknown>>();
  if (initial) {
    records.set("tutor_progress/owner", {
      schemaVersion: 1,
      updatedAt: initial.updatedAt,
      lastLessonId: initial.lessonId,
      courseProgress: {},
      lessonProgress: { [initial.lessonId]: initial },
      settings: {},
    });
  }
  const request = vi.fn<typeof fetch>(async (input, init) => {
    const url = new URL(String(input));
    const key = url.pathname.replace("/v1/data/", "");
    if (init?.method === "PUT") {
      const data = JSON.parse(String(init.body)) as Record<string, unknown>;
      records.set(key, data);
      return new Response(JSON.stringify({ id: key.split("/").at(-1), data, updatedAt: new Date().toISOString() }));
    }
    if (key === "tutor_notes") {
      const noteRecords = [...records.entries()]
        .filter(([recordKey]) => recordKey.startsWith("tutor_notes/"))
        .map(([recordKey, data]) => ({
          id: recordKey.split("/").at(-1),
          data,
          createdAt: "2026-07-30T00:00:00.000Z",
          updatedAt: "2026-07-30T00:00:00.000Z",
        }));
      return new Response(JSON.stringify({ records: noteRecords, nextAfter: null }));
    }
    const data = records.get(key);
    if (!data) return new Response(JSON.stringify({ error: { code: "record_not_found" } }), { status: 404 });
    return new Response(JSON.stringify({
      id: key.split("/").at(-1),
      data,
      createdAt: "2026-07-30T00:00:00.000Z",
      updatedAt: "2026-07-30T00:00:00.000Z",
    }));
  });
  return {
    records,
    request,
    client: new MiniBaseClient({
      baseUrl: "https://minibase.example.test",
      publishableKey: "mb_publishable_test",
      fetch: request,
    }),
  };
}

describe("MiniBase progress repository", () => {
  it("handles an empty database and migrates local progress once", async () => {
    const remote = memoryMiniBase();
    const local = new LocalProgressRepository();
    await local.saveAll({ welcome: progress("2026-07-30T10:00:00.000Z", "Локальная заметка") });
    const repository = new MiniBaseProgressRepository(remote.client, local);

    const loaded = await repository.hydrate();

    expect(loaded.welcome.note).toBe("Локальная заметка");
    expect(remote.records.get("tutor_progress/owner")).toBeDefined();
    expect(remote.records.get("tutor_notes/lesson_welcome")).toMatchObject({ text: "Локальная заметка" });
    expect(localStorage.getItem(progressRepositoryInternals.MIGRATION_KEY)).toBe("done");
  });

  it("keeps newer server data during the one-time migration", async () => {
    const remote = memoryMiniBase(progress("2026-07-30T12:00:00.000Z", "С сервера"));
    const local = new LocalProgressRepository();
    await local.saveAll({ welcome: progress("2026-07-30T10:00:00.000Z", "Старое локальное") });

    const loaded = await new MiniBaseProgressRepository(remote.client, local).hydrate();

    expect(loaded.welcome.note).toBe("С сервера");
  });

  it("retains the local cache when MiniBase is unavailable", async () => {
    const local = new LocalProgressRepository();
    await local.saveAll({ welcome: progress("2026-07-30T10:00:00.000Z") });
    const client = new MiniBaseClient({
      baseUrl: "https://minibase.example.test",
      publishableKey: "mb_publishable_test",
      fetch: vi.fn<typeof fetch>().mockRejectedValue(new Error("offline")),
    });
    const repository = new MiniBaseProgressRepository(client, local);

    await expect(repository.hydrate()).rejects.toThrow("offline");
    expect(repository.getCached().welcome.currentStep).toBe(2);
  });
});
