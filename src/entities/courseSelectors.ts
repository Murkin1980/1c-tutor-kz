import type { LessonProgress } from "../features/progress/progress";
import type { Lesson } from "./course";

type ProgressMap = Record<string, LessonProgress>;

export function isLessonUnlocked(
  lessons: Lesson[],
  progress: ProgressMap,
  lesson: Lesson,
): boolean {
  const lessonIndex = lessons.findIndex(
    (candidate) => candidate.id === lesson.id,
  );
  if (lessonIndex < 0) return false;
  return (
    lesson.practiceMode === "embedded" ||
    lessonIndex === 0 ||
    progress[lessons[lessonIndex - 1].id]?.status === "completed" ||
    Boolean(progress[lesson.id])
  );
}

export function getCurrentLesson(
  lessons: Lesson[],
  progress: ProgressMap,
): Lesson | undefined {
  return (
    lessons.find((lesson) => progress[lesson.id]?.status === "in_progress") ??
    lessons.find(
      (lesson) =>
        isLessonUnlocked(lessons, progress, lesson) &&
        progress[lesson.id]?.status !== "completed",
    ) ??
    lessons[0]
  );
}
