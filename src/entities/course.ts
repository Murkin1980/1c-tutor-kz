export type LessonStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "submitted"
  | "completed"
  | "needs_retry";

export type Verification =
  | { type: "self_confirm"; prompt: string }
  | { type: "single_choice"; prompt: string; options: string[]; expected: string }
  | { type: "multiple_choice"; prompt: string; options: string[]; expected: string[] }
  | { type: "text_exact"; prompt: string; expected: string }
  | { type: "number"; prompt: string; expected: number; tolerance: number; unit: "KZT" }
  | { type: "sequence"; prompt: string; items: string[]; expected: string[] }
  | { type: "screenshot_manual"; prompt: string };

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  objective: string;
  context: string;
  estimatedMinutes: number;
  sourceData: Record<string, string>;
  steps: string[];
  hints: string[];
  verification: Verification;
  expectedResult: string;
  externalAppUrl: string;
  reviewedAt: string;
  configurationVersion: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  modules: CourseModule[];
}
