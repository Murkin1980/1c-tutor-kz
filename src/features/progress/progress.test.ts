import { describe, expect, it } from "vitest";
import {
  LocalProgressRepository,
  mergeLessonProgress,
  type LessonProgress,
} from "./progress";

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

const completed = (
  completionKind: LessonProgress["completionKind"],
): LessonProgress => ({
  lessonId: "sales-prepayment-cycle",
  status: "completed",
  currentStep: 8,
  attemptCount: 1,
  note: "",
  answer: [{ id: "settlement.balance", passed: true }],
  practiceMode: completionKind === "completed_unassisted" ? "test" : "guided",
  completionKind,
  hintCount: completionKind === "completed_unassisted" ? 0 : 1,
  showActionCount: completionKind === "completed_unassisted" ? 0 : 2,
  resetCount: 0,
  updatedAt: "2026-10-15T00:00:00.000Z",
});

describe("mergeLessonProgress", () => {
  it("keeps the successful independent evidence after a later Demo run", () => {
    const saved = completed("completed_unassisted");

    expect(
      mergeLessonProgress(saved, {
        status: "in_progress",
        currentStep: 3,
        answer: [{ id: "settlement.balance", passed: false }],
        practiceMode: "demo",
        showActionCount: 4,
        attemptCount: 2,
      }),
    ).toMatchObject({
      status: "completed",
      currentStep: 8,
      answer: saved.answer,
      practiceMode: "test",
      completionKind: "completed_unassisted",
      hintCount: 0,
      showActionCount: 0,
      attemptCount: 2,
    });
  });

  it("does not downgrade an independent completion with an assisted pass", () => {
    const saved = completed("completed_unassisted");

    expect(
      mergeLessonProgress(saved, {
        status: "completed",
        currentStep: 8,
        practiceMode: "guided",
        completionKind: "completed_assisted",
        hintCount: 2,
      }),
    ).toMatchObject({
      practiceMode: "test",
      completionKind: "completed_unassisted",
      hintCount: 0,
    });
  });

  it("upgrades an assisted completion after an independent pass", () => {
    expect(
      mergeLessonProgress(completed("completed_assisted"), {
        status: "completed",
        currentStep: 8,
        practiceMode: "test",
        completionKind: "completed_unassisted",
        hintCount: 0,
        showActionCount: 0,
      }),
    ).toMatchObject({
      status: "completed",
      practiceMode: "test",
      completionKind: "completed_unassisted",
      hintCount: 0,
      showActionCount: 0,
    });
  });
});
