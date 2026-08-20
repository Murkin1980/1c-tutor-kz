import { allLessons } from "../content/course";
import type { LessonProgress } from "../features/progress/progress";
import { getCurrentLesson, isLessonUnlocked } from "./courseSelectors";

const completed = (lessonId: string): LessonProgress => ({
  lessonId,
  status: "completed",
  currentStep: 0,
  attemptCount: 1,
  note: "",
  updatedAt: "2026-08-20T00:00:00.000Z",
});

describe("course selectors", () => {
  it("keeps the embedded validation slice directly available", () => {
    const embedded = allLessons.find(
      (lesson) => lesson.practiceMode === "embedded",
    );
    expect(embedded).toBeDefined();
    expect(isLessonUnlocked(allLessons, {}, embedded!)).toBe(true);
  });

  it("selects an in-progress lesson before another unlocked lesson", () => {
    const progress = {
      [allLessons[0].id]: {
        ...completed(allLessons[0].id),
        status: "in_progress" as const,
      },
    };
    expect(getCurrentLesson(allLessons, progress)?.id).toBe(allLessons[0].id);
  });

  it("unlocks a legacy lesson after its predecessor is complete", () => {
    expect(
      isLessonUnlocked(
        allLessons,
        { [allLessons[0].id]: completed(allLessons[0].id) },
        allLessons[1],
      ),
    ).toBe(true);
  });

  it("selects the first unfinished unlocked lesson when completion is non-contiguous", () => {
    const progress = {
      [allLessons[0].id]: completed(allLessons[0].id),
      [allLessons[2].id]: completed(allLessons[2].id),
    };
    expect(getCurrentLesson(allLessons, progress)?.id).toBe(allLessons[1].id);
  });

  it("does not unlock a lesson outside the course", () => {
    expect(
      isLessonUnlocked(allLessons, {}, { ...allLessons[0], id: "unknown" }),
    ).toBe(false);
  });
});
