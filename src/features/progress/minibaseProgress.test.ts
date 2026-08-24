import { describe, expect, it, vi } from "vitest";
import type { LessonProgress, ProgressMap } from "./progress";
import {
  HybridProgressRepository,
  mergeProgressMaps,
  MiniBaseProgressTransport,
} from "./minibaseProgress";

function progress(lessonId: string, updatedAt: string): LessonProgress {
  return {
    lessonId,
    status: "in_progress",
    currentStep: 1,
    attemptCount: 0,
    note: "",
    updatedAt,
  };
}

class MemoryRepository {
  data: ProgressMap;

  constructor(initial: ProgressMap = {}) {
    this.data = initial;
  }

  getAll(): ProgressMap {
    return this.data;
  }

  save(value: LessonProgress): void {
    this.data = { ...this.data, [value.lessonId]: value };
  }
}

describe("MiniBase progress sync", () => {
  it("keeps the newest lesson version while merging local and remote state", () => {
    const local = {
      welcome: progress("welcome", "2026-08-25T10:00:00.000Z"),
    };
    const remote = {
      welcome: progress("welcome", "2026-08-24T10:00:00.000Z"),
      "customer-card": progress("customer-card", "2026-08-25T09:00:00.000Z"),
    };
    expect(mergeProgressMaps(local, remote)).toEqual({
      welcome: local.welcome,
      "customer-card": remote["customer-card"],
    });
  });

  it("loads and saves a validated progress envelope through the same-origin API", async () => {
    const stored = { welcome: progress("welcome", "2026-08-25T10:00:00.000Z") };
    const requestFetch = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        Response.json({
          schemaVersion: 1,
          updatedAt: "2026-08-25T10:00:00.000Z",
          lessonProgress: stored,
        }),
      )
      .mockResolvedValueOnce(Response.json({ saved: true }));
    const transport = new MiniBaseProgressTransport(
      "/api/progress",
      requestFetch,
    );

    await expect(transport.load()).resolves.toEqual(stored);
    await transport.save(stored);

    expect(requestFetch).toHaveBeenNthCalledWith(
      2,
      "/api/progress",
      expect.objectContaining({ method: "PUT", credentials: "same-origin" }),
    );
    expect(JSON.parse(String(requestFetch.mock.calls[1][1]?.body))).toEqual(
      expect.objectContaining({ schemaVersion: 1, lessonProgress: stored }),
    );
  });

  it("hydrates local progress and serializes later writes to MiniBase", async () => {
    const local = new MemoryRepository({
      welcome: progress("welcome", "2026-08-25T10:00:00.000Z"),
    });
    const requestFetch = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        Response.json({
          schemaVersion: 1,
          updatedAt: null,
          lessonProgress: {},
        }),
      )
      .mockResolvedValue(Response.json({ saved: true }));
    const repository = new HybridProgressRepository(
      local,
      new MiniBaseProgressTransport("/api/progress", requestFetch),
    );

    await expect(repository.hydrate()).resolves.toEqual(local.data);
    repository.save(progress("customer-card", "2026-08-25T11:00:00.000Z"));
    await repository.flush();

    expect(local.data["customer-card"]).toBeDefined();
    expect(requestFetch).toHaveBeenCalledTimes(3);
  });

  it("rejects malformed server progress instead of poisoning local state", async () => {
    const transport = new MiniBaseProgressTransport(
      "/api/progress",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(
          Response.json({
            schemaVersion: 1,
            updatedAt: null,
            lessonProgress: [],
          }),
        ),
    );
    await expect(transport.load()).rejects.toBeDefined();
  });
});
