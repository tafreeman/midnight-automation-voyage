export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  additionalQuestions?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface CodeExercise {
  title: string;
  description: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  narration?: string;
}

export interface PromptTemplate {
  label: string;
  prompt: string;
  context: string;
}

export interface NarrationStep {
  text: string;
  highlight?: string;
  navigateTo?: string;
  duration?: number;
}

export interface NarrationScript {
  intro: string;
  steps: NarrationStep[];
  outro: string;
}

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  audience?: string;
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
  exercises?: CodeExercise[];
  promptTemplates?: PromptTemplate[];
  practiceLink?: {
    url: string;
    label: string;
    description: string;
  };
  narrationScript?: NarrationScript;
}
