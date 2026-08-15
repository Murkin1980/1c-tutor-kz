import { z } from "zod";
import rawCourse from "./course.json";
import type { Course, Lesson } from "../entities/course";

const verificationSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("self_confirm"), prompt: z.string() }),
  z.object({ type: z.literal("single_choice"), prompt: z.string(), options: z.array(z.string()), expected: z.string() }),
  z.object({ type: z.literal("multiple_choice"), prompt: z.string(), options: z.array(z.string()), expected: z.array(z.string()) }),
  z.object({ type: z.literal("text_exact"), prompt: z.string(), expected: z.string() }),
  z.object({ type: z.literal("number"), prompt: z.string(), expected: z.number(), tolerance: z.number(), unit: z.literal("KZT") }),
  z.object({ type: z.literal("sequence"), prompt: z.string(), items: z.array(z.string()), expected: z.array(z.string()) }),
  z.object({ type: z.literal("screenshot_manual"), prompt: z.string() }),
]);

const lessonSchema: z.ZodType<Lesson> = z.object({
  id: z.string(), slug: z.string(), title: z.string(), objective: z.string(),
  context: z.string(), estimatedMinutes: z.number().positive(),
  sourceData: z.record(z.string(), z.string()), steps: z.array(z.string()).min(1),
  hints: z.array(z.string()).max(3), verification: verificationSchema,
  expectedResult: z.string(),
  practiceMode: z.enum(["embedded", "external", "theory"]).optional(),
  practicalScenarioId: z.string().optional(),
  externalAppUrl: z.url().optional(),
  reviewedAt: z.string(), configurationVersion: z.string(),
});

const courseSchema: z.ZodType<Course> = z.object({
  slug: z.string(), title: z.string(), description: z.string(),
  modules: z.array(z.object({
    id: z.string(), title: z.string(), description: z.string(),
    lessons: z.array(lessonSchema),
  })),
});

export const course = courseSchema.parse(rawCourse);
export const allLessons = course.modules.flatMap((module) => module.lessons);
export const getLesson = (id: string) => allLessons.find((lesson) => lesson.id === id);
