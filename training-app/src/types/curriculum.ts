export type ThemeName =
  | "signal-cobalt"
  | "arctic-steel"
  | "linear"
  | "gamma-dark";

export type Audience = "all" | "developer" | "non-coder";

export interface TextSection {
  type: "text";
  heading: string;
  content: string;
}

export interface CodeSection {
  type: "code";
  heading?: string;
  language: string;
  code: string;
}

export interface CalloutSection {
  type: "callout";
  heading?: string;
  variant: "tip" | "warning" | "info";
  content: string;
}

export interface TableSection {
  type: "table";
  heading?: string;
  headers: string[];
  rows: string[][];
}

export type Section =
  | TextSection
  | CodeSection
  | CalloutSection
  | TableSection;

export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CodeExercise {
  title: string;
  description: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
}

export interface PromptTemplate {
  label: string;
  context: string;
  prompt: string;
}

export interface PracticeLink {
  url: string;
  label: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  audience?: Audience;
  sections: Section[];
  quiz?: Quiz;
  exercise?: CodeExercise;
  promptTemplates?: PromptTemplate[];
  practiceLink?: PracticeLink;
}

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  theme: ThemeName;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  learningObjectives: string[];
  lessons: Lesson[];
}

export interface ModuleProgress {
  started: boolean;
  completedLessons: string[];
  quizScores: Record<string, number>;
  exerciseCompleted: Record<string, boolean>;
  notes: Record<string, string>;
}

export interface CourseProgress {
  currentModuleId: string;
  currentLessonId: string;
  modules: Record<string, ModuleProgress>;
  scrollPositions: Record<string, number>;
  lastAccessedAt: string;
}
