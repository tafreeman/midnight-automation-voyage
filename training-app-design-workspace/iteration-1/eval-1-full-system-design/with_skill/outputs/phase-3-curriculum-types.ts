/**
 * curriculum.ts
 * Target: training-app/src/types/curriculum.ts
 *
 * Hierarchical data model: Module > Lesson > Section
 * Typed content blocks for notebook-style rendering.
 */

// ─── Theme ────────────────────────────────────────────────────────

export type ThemeName = 'signal-cobalt' | 'arctic-steel' | 'linear' | 'gamma-dark';

// ─── Section Types (typed content blocks for notebook flow) ──────

export interface TextSection {
  type: 'text';
  heading: string;
  content: string;
}

export interface CodeSection {
  type: 'code';
  language: string;
  code: string;
  filename?: string;
  highlightLines?: number[];
}

export interface CalloutSection {
  type: 'callout';
  variant: 'tip' | 'warning' | 'info' | 'important';
  content: string;
}

export interface TableSection {
  type: 'table';
  heading?: string;
  headers: string[];
  rows: string[][];
}

export interface DiffSection {
  type: 'diff';
  before: string;
  after: string;
  language: string;
  description?: string;
}

export interface ImageSection {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
}

export interface InteractiveCheckSection {
  type: 'interactive-check';
  question: string;
  answer: string;
  hint?: string;
}

export interface GuidedPracticeSection {
  type: 'guided-practice';
  steps: PracticeStep[];
}

export type Section =
  | TextSection
  | CodeSection
  | CalloutSection
  | TableSection
  | DiffSection
  | ImageSection
  | InteractiveCheckSection
  | GuidedPracticeSection;

// ─── Practice Step ──────────────────────────────────────────────

export interface PracticeStep {
  title: string;
  instruction: string;
  starterCode: string;
  expectedCode: string;
  hint?: string;
  validation?: string;
}

// ─── Quiz ───────────────────────────────────────────────────────

export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ─── Code Exercise ──────────────────────────────────────────────

export interface CodeExercise {
  title: string;
  description: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
}

// ─── Prompt Template ────────────────────────────────────────────

export interface PromptTemplate {
  label: string;
  prompt: string;
  context: string;
}

// ─── Practice Link ──────────────────────────────────────────────

export interface PracticeLink {
  url: string;
  label: string;
  description: string;
}

// ─── Lesson ─────────────────────────────────────────────────────

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  audience?: 'all' | 'developer' | 'non-coder';
  sections: Section[];
  quiz?: Quiz;
  exercise?: CodeExercise;
  promptTemplates?: PromptTemplate[];
  practiceLink?: PracticeLink;
}

// ─── Module ─────────────────────────────────────────────────────

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  theme: ThemeName;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  prerequisites?: string[];
  learningObjectives: string[];
  lessons: Lesson[];
}

// ─── Progress ───────────────────────────────────────────────────

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
  themePreference: ThemeName | 'auto';
  lastAccessedAt: string;
}
