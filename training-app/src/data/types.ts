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
  prompt: string;
  context: string;
}

export type ModuleCategory = "foundations" | "core" | "workflows" | "advanced" | "devops";

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  audience?: string;
  category?: ModuleCategory;
  sections: {
    heading: string;
    content: string;
    code?: string;
    codeLanguage?: string;
    tip?: string;
    warning?: string;
    callout?: string;
    table?: { headers: string[]; rows: string[][] };
  }[];
  quiz?: Quiz;
  exercise?: CodeExercise;
  promptTemplates?: PromptTemplate[];
  practiceLink?: {
    url: string;
    label: string;
    description: string;
  };
}
