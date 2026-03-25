export type ThemeName =
  | "signal-cobalt"
  | "arctic-steel"
  | "linear"
  | "gamma-dark"
  | "zine-pop"
  | "handbook-notes";

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

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface NarrationStep {
  text: string;
  highlight?: string;       // data-testid to highlight in practice app
  navigateTo?: string;      // URL path to navigate iframe to
  duration?: number;         // Estimated seconds for this step
}

export interface NarrationScript {
  intro: string;
  steps: NarrationStep[];
  outro: string;
}

export interface ExerciseLab {
  workspaceRoot: string;
  targetFile: string;
  runCommand: string;
  successCriteria: string[];
}

export interface CodeExercise {
  title: string;
  description: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  narration?: string;
  narrationSteps?: NarrationStep[];
  lab?: ExerciseLab;
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
  sections: Section[];
  quiz?: Quiz;
  exercise?: CodeExercise;
  exercises?: CodeExercise[];
  promptTemplates?: PromptTemplate[];
  practiceLink?: PracticeLink;
  narrationScript?: NarrationScript;
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

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: string;
  estimatedHours: number;
  modules: Module[];
}

export interface ModuleProgress {
  started: boolean;
  completedLessons: string[];
  quizScores: Record<string, number>;
  exerciseCompleted: Record<string, boolean>;
  notes: Record<string, string>;
}

export interface CourseProgress {
  currentCourseId: string;
  currentModuleId: string;
  currentLessonId: string;
  currentSectionIndex: number;
  currentTab: string;
  modules: Record<string, ModuleProgress>;
  scrollPositions: Record<string, number>;
  lastAccessedAt: string;
  voicePreference?: {
    voice: string;
    speed: number;
  };
}
