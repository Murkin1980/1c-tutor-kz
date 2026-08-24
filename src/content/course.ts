import { z } from "zod";
import rawCourse from "./course.json";
import type { Course, Lesson } from "../entities/course";

const lessonSchema: z.ZodType<Lesson> = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  objective: z.string(),
  context: z.string(),
  estimatedMinutes: z.number().positive(),
  sourceData: z.record(z.string(), z.string()),
  steps: z.array(z.string()).min(1),
  hints: z.array(z.string()).max(3),
  expectedResult: z.string(),
  practiceMode: z.literal("embedded").optional(),
  practicalScenarioId: z.string().optional(),
  reviewedAt: z.string(),
  configurationVersion: z.string(),
});

const courseSchema: z.ZodType<Course> = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  modules: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      lessons: z.array(lessonSchema),
    }),
  ),
});

export const course = courseSchema.parse(rawCourse);
export const allLessons = course.modules.flatMap((module) => module.lessons);
export const getLesson = (id: string) =>
  allLessons.find((lesson) => lesson.id === id);
