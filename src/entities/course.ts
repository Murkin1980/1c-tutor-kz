export type LessonStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "submitted"
  | "completed"
  | "needs_retry";

export type PracticeMode = "embedded";

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
  expectedResult: string;
  practiceMode?: PracticeMode;
  practicalScenarioId?: string;
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
