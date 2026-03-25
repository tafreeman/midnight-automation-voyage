import { practiceUrl } from "../../../config";
import type {
  CodeExercise,
  Course,
  ExerciseLab,
  Lesson,
  Module,
  PracticeLink,
  ThemeName,
} from "../../../types/curriculum";

const THEMES: ThemeName[] = [
  "handbook-notes",
  "signal-cobalt",
  "linear",
  "arctic-steel",
  "zine-pop",
  "gamma-dark",
];

export const firstPlaywrightTestRoutes = {
  login: "/login",
  dashboard: "/dashboard",
  products: "/products",
  contact: "/contact",
} as const;

export const firstPlaywrightTestCredentials = {
  editor: {
    email: "user@test.com",
    password: "Password123!",
  },
  admin: {
    email: "admin@test.com",
    password: "AdminPass1!",
  },
} as const;

export const hashRouteNote =
  "This practice app is packaged for standalone use, so the lab helper takes care of the hash-based route behind the scenes.";

export function createPracticeLink(
  route: string,
  label: string,
  description: string,
): PracticeLink {
  return {
    url: practiceUrl(route),
    label,
    description,
  };
}

export function createExerciseLab(
  targetFile: string,
  runCommand: string,
  successCriteria: string[],
): ExerciseLab {
  return {
    workspaceRoot: "practice-app",
    targetFile,
    runCommand,
    successCriteria,
  };
}

export function createSingleLessonModule(input: {
  index: number;
  title: string;
  subtitle: string;
  icon: string;
  estimatedMinutes: number;
  learningObjectives: string[];
  lesson: Omit<Lesson, "id">;
}): Module {
  const moduleNumber = 100 + input.index;
  const lessonId = `first-playwright-tests-lesson-${String(input.index).padStart(2, "0")}`;
  const moduleId = `first-playwright-tests-module-${String(input.index).padStart(2, "0")}`;

  return {
    id: moduleId,
    number: moduleNumber,
    title: input.title,
    subtitle: input.subtitle,
    icon: input.icon,
    theme: THEMES[(input.index - 1) % THEMES.length],
    difficulty: "beginner",
    estimatedMinutes: input.estimatedMinutes,
    learningObjectives: input.learningObjectives,
    lessons: [
      {
        id: lessonId,
        ...input.lesson,
      },
    ],
  };
}

export function buildStandaloneCourse(modules: Module[]): Course {
  const totalMinutes = modules.reduce((sum, module) => sum + module.estimatedMinutes, 0);

  return {
    id: "course-first-playwright-tests",
    title: "FIRST PLAYWRIGHT TESTS",
    subtitle: "A standalone onramp for Playwright, VS Code, and GitHub Copilot",
    difficulty: "beginner",
    icon: "🧪",
    estimatedHours: Math.round((totalMinutes / 60) * 10) / 10,
    modules,
  };
}

export function duplicateExercise(exercise: CodeExercise): CodeExercise {
  return {
    ...exercise,
    hints: [...exercise.hints],
    lab: exercise.lab ? { ...exercise.lab, successCriteria: [...exercise.lab.successCriteria] } : undefined,
  };
}
