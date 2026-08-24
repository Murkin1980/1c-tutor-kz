import { describe, expect, it } from "vitest";
import { LocalProgressRepository } from "./progress";
describe("local progress repository", () => {
  it("persists and restores an unfinished lesson", () => {
    const repository = new LocalProgressRepository();
    repository.save({
      lessonId: "customer-card",
      status: "in_progress",
      currentStep: 2,
      attemptCount: 0,
      note: "Вернуться позже",
      updatedAt: "2026-07-28",
    });
    expect(
      new LocalProgressRepository().getAll()["customer-card"],
    ).toMatchObject({
      status: "in_progress",
      currentStep: 2,
      note: "Вернуться позже",
    });
  });
});
