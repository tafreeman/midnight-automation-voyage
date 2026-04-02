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
  "signal-cobalt",
  "gamma-dark",
  "linear",
  "arctic-steel",
  "zine-pop",
  "handbook-notes",
];

export const routes = {
  login: "/login",
  dashboard: "/dashboard",
  products: "/products",
  contact: "/contact",
  orders: "/orders",
  settings: "/settings",
  admin: "/admin",
  checkoutShipping: "/checkout/shipping",
  checkoutPayment: "/checkout/payment",
  checkoutReview: "/checkout/review",
  checkoutConfirmation: "/checkout/confirmation",
} as const;

export const credentials = {
  editor: {
    email: "user@test.com",
    password: "Password123!",
  },
  admin: {
    email: "admin@test.com",
    password: "AdminPass1!",
  },
} as const;

const COURSE_SLUG = "copilot-first-testing";

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
  const moduleNumber = 200 + input.index;
  const padded = String(input.index).padStart(2, "0");
  const lessonId = `${COURSE_SLUG}-lesson-${padded}`;
  const moduleId = `${COURSE_SLUG}-module-${padded}`;

  return {
    id: moduleId,
    number: moduleNumber,
    title: input.title,
    subtitle: input.subtitle,
    icon: input.icon,
    theme: THEMES[(input.index - 1) % THEMES.length],
    difficulty: "intermediate",
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

export function buildCopilotFirstCourse(modules: Module[]): Course {
  const totalMinutes = modules.reduce(
    (sum, module) => sum + module.estimatedMinutes,
    0,
  );

  return {
    id: `course-${COURSE_SLUG}`,
    title: "COPILOT-FIRST TEST AUTOMATION",
    subtitle:
      "Direct GitHub Copilot to write Playwright tests — you review, it codes",
    difficulty: "intermediate",
    icon: "🤖",
    estimatedHours: Math.round((totalMinutes / 60) * 10) / 10,
    modules,
  };
}

export function duplicateExercise(exercise: CodeExercise): CodeExercise {
  return {
    ...exercise,
    hints: [...exercise.hints],
    lab: exercise.lab
      ? { ...exercise.lab, successCriteria: [...exercise.lab.successCriteria] }
      : undefined,
  };
}
