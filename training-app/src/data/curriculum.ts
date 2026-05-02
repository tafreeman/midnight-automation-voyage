import { lessons as legacyLessons } from "./index";
import { firstPlaywrightTestsCourse } from "./courses/first-playwright-tests/course";
import { copilotFirstTestingCourse } from "./courses/copilot-first-testing/course";
import type { Lesson as LegacyLesson } from "./types";
import type {
  Course,
  Module,
  Lesson,
  Quiz,
  Section,
  ThemeName,
} from "../types/curriculum";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function themeForModule(moduleNumber: number): ThemeName {
  const darkThemes: ThemeName[] = ["signal-cobalt", "gamma-dark"];
  const lightThemes: ThemeName[] = ["arctic-steel", "linear", "zine-pop", "handbook-notes"];
  const groupIndex = Math.floor((moduleNumber - 1) / 3);
  if (groupIndex % 2 === 0) {
    return darkThemes[Math.floor(groupIndex / 2) % darkThemes.length];
  }
  return lightThemes[Math.floor(groupIndex / 2) % lightThemes.length];
}

function difficultyForModule(moduleNumber: number): Module["difficulty"] {
  if (moduleNumber <= 12) return "beginner";
  if (moduleNumber <= 27) return "intermediate";
  return "advanced";
}

function estimatedMinutesFromLegacy(legacy: LegacyLesson) {
  const sectionMinutes = legacy.sections.length * 3;
  const quizMinutes = legacy.quiz ? 3 : 0;
  const exerciseMinutes = legacy.exercise || legacy.exercises?.length ? 6 : 0;
  return Math.max(12, Math.min(36, sectionMinutes + quizMinutes + exerciseMinutes));
}

function learningObjectivesFromLegacy(legacy: LegacyLesson) {
  const objectives = legacy.sections
    .slice(0, 3)
    .map((section) => `Explain ${section.heading.toLowerCase()}`);

  if (legacy.exercise) {
    objectives.push(`Practice ${legacy.exercise.title.toLowerCase()}`);
  }

  return objectives.slice(0, 4);
}

function learningObjectivesFromMultiple(legacies: LegacyLesson[]) {
  const objectives = legacies.flatMap((legacy) =>
    legacy.sections
      .slice(0, 2)
      .map((section) => `Explain ${section.heading.toLowerCase()}`)
  );

  for (const legacy of legacies) {
    if (legacy.exercise) {
      objectives.push(`Practice ${legacy.exercise.title.toLowerCase()}`);
    }
  }

  return objectives.slice(0, 4);
}

function sectionsFromLegacy(legacy: LegacyLesson): Section[] {
  return legacy.sections.flatMap((section) => {
    const next: Section[] = [
      {
        type: "text",
        heading: section.heading,
        content: section.content,
      },
    ];

    if (section.callout) {
      next.push({
        type: "callout",
        heading: section.heading,
        variant: "info",
        content: section.callout,
      });
    }

    if (section.tip) {
      next.push({
        type: "callout",
        heading: section.heading,
        variant: "tip",
        content: section.tip,
      });
    }

    if (section.warning) {
      next.push({
        type: "callout",
        heading: section.heading,
        variant: "warning",
        content: section.warning,
      });
    }

    if (section.table) {
      next.push({
        type: "table",
        heading: section.heading,
        headers: section.table.headers,
        rows: section.table.rows,
      });
    }

    if (section.code) {
      next.push({
        type: "code",
        heading: section.heading,
        language: section.codeLanguage ?? "text",
        code: section.code,
      });
    }

    return next;
  });
}

function quizFromLegacy(legacy: LegacyLesson): Quiz | undefined {
  if (!legacy.quiz) return undefined;
  const { additionalQuestions, ...primary } = legacy.quiz;
  return { questions: [primary, ...(additionalQuestions ?? [])] };
}

function mergeQuizzes(...legacies: LegacyLesson[]): Quiz | undefined {
  const allQuestions = legacies.flatMap((legacy) => {
    if (!legacy.quiz) return [];
    const { additionalQuestions, ...primary } = legacy.quiz;
    return [primary, ...(additionalQuestions ?? [])];
  });
  return allQuestions.length > 0 ? { questions: allQuestions } : undefined;
}

function exercisesFromLegacy(legacy: LegacyLesson) {
  if (legacy.exercises?.length) return legacy.exercises;
  if (legacy.exercise) return [legacy.exercise];
  return undefined;
}

function mergeExercises(...legacies: LegacyLesson[]) {
  const all = legacies.flatMap((legacy) => exercisesFromLegacy(legacy) ?? []);
  return all.length > 0 ? all : undefined;
}

function narrationScriptFromLegacy(legacy: LegacyLesson): Lesson["narrationScript"] {
  return legacy.narrationScript ?? undefined;
}

function lessonFromLegacy(legacy: LegacyLesson, moduleNumber: number): Lesson {
  const allExercises = exercisesFromLegacy(legacy);
  return {
    id: `lesson-${pad(moduleNumber)}-01`,
    title: legacy.title,
    subtitle: legacy.subtitle,
    estimatedMinutes: estimatedMinutesFromLegacy(legacy),
    sections: sectionsFromLegacy(legacy),
    quiz: quizFromLegacy(legacy),
    exercise: allExercises?.[0],
    exercises: allExercises,
    promptTemplates: legacy.promptTemplates,
    practiceLink: legacy.practiceLink,
    narrationScript: narrationScriptFromLegacy(legacy),
  };
}

/** Create a module from a single legacy lesson */
function moduleFromLegacy(
  legacy: LegacyLesson,
  moduleNumber: number,
  overrides?: Partial<Pick<Module, "title" | "subtitle" | "difficulty" | "theme">>,
): Module {
  const lesson = lessonFromLegacy(legacy, moduleNumber);
  return {
    id: `module-${pad(moduleNumber)}`,
    number: moduleNumber,
    title: overrides?.title ?? legacy.title,
    subtitle: overrides?.subtitle ?? legacy.subtitle,
    icon: legacy.icon,
    theme: overrides?.theme ?? themeForModule(moduleNumber),
    difficulty: overrides?.difficulty ?? difficultyForModule(moduleNumber),
    estimatedMinutes: lesson.estimatedMinutes,
    learningObjectives: learningObjectivesFromLegacy(legacy),
    lessons: [lesson],
  };
}

/** Create a module by merging multiple legacy lessons into one */
export function mergedModule(
  legacies: LegacyLesson[],
  moduleNumber: number,
  title: string,
  subtitle: string,
  icon: string,
  difficulty: Module["difficulty"],
): Module {
  const allSections = legacies.flatMap((l) => sectionsFromLegacy(l));
  const quiz = mergeQuizzes(...legacies);
  const allExercises = mergeExercises(...legacies);
  const allPromptTemplates = legacies.flatMap((l) => l.promptTemplates ?? []);
  const practiceLink = legacies.find((l) => l.practiceLink)?.practiceLink;

  const estimatedMinutes = legacies.reduce(
    (sum, l) => sum + estimatedMinutesFromLegacy(l),
    0,
  );

  const lesson: Lesson = {
    id: `lesson-${pad(moduleNumber)}-01`,
    title,
    subtitle,
    estimatedMinutes,
    sections: allSections,
    quiz,
    exercise: allExercises?.[0],
    exercises: allExercises,
    promptTemplates: allPromptTemplates.length > 0 ? allPromptTemplates : undefined,
    practiceLink,
    narrationScript: legacies[0] ? narrationScriptFromLegacy(legacies[0]) : undefined,
  };

  return {
    id: `module-${pad(moduleNumber)}`,
    number: moduleNumber,
    title,
    subtitle,
    icon,
    theme: themeForModule(moduleNumber),
    difficulty,
    estimatedMinutes,
    learningObjectives: learningObjectivesFromMultiple(legacies),
    lessons: [lesson],
  };
}

/** Create a module from the first half of a legacy lesson's sections */
export function splitModuleFirstHalf(
  legacy: LegacyLesson,
  moduleNumber: number,
  title: string,
  subtitle: string,
  difficulty: Module["difficulty"],
): Module {
  const allSections = sectionsFromLegacy(legacy);
  const midpoint = Math.ceil(allSections.length / 2);
  const firstHalfSections = allSections.slice(0, midpoint);

  const estimatedMinutes = Math.max(12, Math.ceil(estimatedMinutesFromLegacy(legacy) / 2));

  const lesson: Lesson = {
    id: `lesson-${pad(moduleNumber)}-01`,
    title,
    subtitle,
    estimatedMinutes,
    sections: firstHalfSections,
    quiz: undefined,
    exercise: undefined,
    exercises: undefined,
    promptTemplates: legacy.promptTemplates,
    practiceLink: legacy.practiceLink,
    narrationScript: narrationScriptFromLegacy(legacy),
  };

  return {
    id: `module-${pad(moduleNumber)}`,
    number: moduleNumber,
    title,
    subtitle,
    icon: legacy.icon,
    theme: themeForModule(moduleNumber),
    difficulty,
    estimatedMinutes,
    learningObjectives: learningObjectivesFromLegacy(legacy).slice(0, 2),
    lessons: [lesson],
  };
}

/** Create a module from the second half of a legacy lesson's sections */
export function splitModuleSecondHalf(
  legacy: LegacyLesson,
  moduleNumber: number,
  title: string,
  subtitle: string,
  difficulty: Module["difficulty"],
): Module {
  const allSections = sectionsFromLegacy(legacy);
  const midpoint = Math.ceil(allSections.length / 2);
  const secondHalfSections = allSections.slice(midpoint);

  const estimatedMinutes = Math.max(12, Math.floor(estimatedMinutesFromLegacy(legacy) / 2));
  const quiz = quizFromLegacy(legacy);
  const allExercises = exercisesFromLegacy(legacy);

  const lesson: Lesson = {
    id: `lesson-${pad(moduleNumber)}-01`,
    title,
    subtitle,
    estimatedMinutes,
    sections: secondHalfSections,
    quiz,
    exercise: allExercises?.[0],
    exercises: allExercises,
    promptTemplates: undefined,
    practiceLink: legacy.practiceLink,
    narrationScript: narrationScriptFromLegacy(legacy),
  };

  return {
    id: `module-${pad(moduleNumber)}`,
    number: moduleNumber,
    title,
    subtitle,
    icon: "🔄",
    theme: themeForModule(moduleNumber),
    difficulty,
    estimatedMinutes,
    learningObjectives: learningObjectivesFromLegacy(legacy).slice(2, 4),
    lessons: [lesson],
  };
}

// ---------------------------------------------------------------------------
// Legacy flat module list (backward compat)
// ---------------------------------------------------------------------------

/** All 31 original modules as a flat array, preserved for backward compatibility. */
export const curriculum: Module[] = legacyLessons.map((legacy, index) => {
  const moduleNumber = index + 1;
  const lesson = lessonFromLegacy(legacy, moduleNumber);
  return {
    id: `module-${pad(moduleNumber)}`,
    number: moduleNumber,
    title: legacy.title,
    subtitle: legacy.subtitle,
    icon: legacy.icon,
    theme: themeForModule(moduleNumber),
    difficulty: difficultyForModule(moduleNumber),
    estimatedMinutes: lesson.estimatedMinutes,
    learningObjectives: learningObjectivesFromLegacy(legacy),
    lessons: [lesson],
  };
});

/** Look up a legacy lesson by its numeric id field */
export function legacyById(id: number): LegacyLesson {
  const found = legacyLessons.find((l) => l.id === id);
  if (!found) throw new Error(`Legacy lesson with id ${id} not found`);
  return found;
}

// ---------------------------------------------------------------------------
// Course 1 — GET TESTING (Beginner)
// ---------------------------------------------------------------------------

const course1Modules: Module[] = [
  // L1: How Automation Works (01-orientation, index 0)
  moduleFromLegacy(legacyLessons[0], 1, {
    title: "How Automation Works",
    subtitle: "The record-refine-review workflow and the practice app",
    difficulty: "beginner",
  }),
  // L2: Setting Up Your Environment (05-environment-setup, index 5)
  moduleFromLegacy(legacyLessons[5], 2, {
    title: "Setting Up Your Environment",
    subtitle: "Install Playwright, VS Code, and run your first test",
    difficulty: "beginner",
  }),
  // L3: How Tests Are Structured (02-mindset-shifts, index 1)
  moduleFromLegacy(legacyLessons[1], 3, {
    title: "How Tests Are Structured",
    subtitle: "Arrange-Act-Assert and why assertions are non-negotiable",
    difficulty: "beginner",
  }),
  // L4: Finding Elements — Selectors and Locators (04-selectors-locators, index 3)
  moduleFromLegacy(legacyLessons[3], 4, {
    title: "Finding Elements — Selectors and Locators",
    subtitle: "The locator priority hierarchy and why selector choice matters",
    difficulty: "beginner",
  }),
  // L5: What to Automate + The CARD Formula (03-what-to-automate, index 2)
  moduleFromLegacy(legacyLessons[2], 5, {
    title: "What to Automate + The CARD Formula",
    subtitle: "Decision filter and structured prompts for Copilot",
    difficulty: "beginner",
  }),
  // L6: Your Testing Toolkit + Just Enough TypeScript (04-why-playwright-copilot, index 4)
  moduleFromLegacy(legacyLessons[4], 6, {
    title: "Your Testing Toolkit",
    subtitle: "Why Playwright + Copilot, and just enough TypeScript",
    difficulty: "beginner",
  }),
  // L7: Record Your First Test (07-record-refine-workflow, index 7)
  moduleFromLegacy(legacyLessons[7], 7, {
    title: "Record Your First Test",
    subtitle: "Use Codegen to capture your first browser interaction",
    difficulty: "beginner",
  }),
  // L8: Refine the Recording (08-refine-recording, index 8)
  moduleFromLegacy(legacyLessons[8], 8, {
    title: "Refine the Recording",
    subtitle: "Fix selectors, add assertions, and make tests production-quality",
    difficulty: "beginner",
  }),
  // L9: Reading Test Results (12-reading-results, index 13)
  moduleFromLegacy(legacyLessons[13], 9, {
    title: "Reading Test Results",
    subtitle: "HTML reports, error patterns, and the bug-or-bad-test diagnostic",
    difficulty: "beginner",
  }),
  // L10: The Review Checklist and Next Steps (13-hitl-checklist, index 14)
  moduleFromLegacy(legacyLessons[14], 10, {
    title: "The Review Checklist and Next Steps",
    subtitle: "10-point HITL checklist, daily workflow, and your first week",
    difficulty: "beginner",
  }),
];

// ---------------------------------------------------------------------------
// Course 2 — BUILD SKILLS (Intermediate)
// ---------------------------------------------------------------------------

const course2Modules: Module[] = [
  moduleFromLegacy(legacyLessons[9], 9, { difficulty: "intermediate" }),   // 08-writing-tests
  moduleFromLegacy(legacyLessons[10], 10, { difficulty: "intermediate" }), // 09-page-object-model
  moduleFromLegacy(legacyLessons[11], 11, { difficulty: "intermediate" }), // 10-api-testing
  moduleFromLegacy(legacyLessons[17], 12, { difficulty: "intermediate" }), // 16-auth-fixtures
  moduleFromLegacy(legacyLessons[21], 13, { difficulty: "intermediate" }), // 20-test-data-strategies
  moduleFromLegacy(legacyLessons[29], 14, { difficulty: "intermediate" }), // 28-mcp-ai-agents (network mocking)
  moduleFromLegacy(legacyLessons[20], 15, { difficulty: "intermediate" }), // 19-flaky-test-diagnosis
  moduleFromLegacy(legacyLessons[23], 16, { difficulty: "intermediate" }), // 22-trace-viewer
  moduleFromLegacy(legacyLessons[12], 17, { difficulty: "intermediate" }), // 11-prompt-templates
];

// ---------------------------------------------------------------------------
// Course 3 — GO PRO (Advanced)
// ---------------------------------------------------------------------------

const course3Modules: Module[] = [
  moduleFromLegacy(legacyLessons[18], 19, { difficulty: "advanced" }), // 17-visual-regression
  moduleFromLegacy(legacyLessons[19], 20, { difficulty: "advanced" }), // 18-accessibility-testing
  moduleFromLegacy(legacyLessons[24], 21, { difficulty: "advanced" }), // 23-mobile-responsive
  moduleFromLegacy(legacyLessons[25], 22, { difficulty: "advanced" }), // 24-parallel-sharding
  moduleFromLegacy(legacyLessons[26], 23, { difficulty: "advanced" }), // 25-multi-browser-projects
  moduleFromLegacy(legacyLessons[27], 24, { difficulty: "advanced" }), // 26-test-tagging
  moduleFromLegacy(legacyLessons[28], 25, { difficulty: "advanced" }), // 27-github-actions
  moduleFromLegacy(legacyLessons[30], 26, { difficulty: "advanced" }), // 29-component-testing
  moduleFromLegacy(legacyLessons[31], 27, { difficulty: "advanced" }), // 30-performance-testing
  moduleFromLegacy(legacyLessons[32], 28, { difficulty: "advanced" }), // 31-custom-reporters
];

// ---------------------------------------------------------------------------
// Build Course objects
// ---------------------------------------------------------------------------

function buildCourse(
  id: string,
  title: string,
  subtitle: string,
  difficulty: Course["difficulty"],
  icon: string,
  modules: Module[],
): Course {
  const totalMinutes = modules.reduce((sum, m) => sum + m.estimatedMinutes, 0);
  return {
    id,
    title,
    subtitle,
    difficulty,
    icon,
    estimatedHours: Math.round((totalMinutes / 60) * 10) / 10,
    modules,
  };
}

export const courses: Course[] = [
  firstPlaywrightTestsCourse,
  copilotFirstTestingCourse,
  buildCourse(
    "course-get-testing",
    "GET TESTING",
    "From manual tester to automation-ready in one course",
    "beginner",
    "🚀",
    course1Modules,
  ),
  buildCourse(
    "course-build-skills",
    "BUILD SKILLS",
    "Deepen your test automation craft with real-world patterns",
    "intermediate",
    "🔧",
    course2Modules,
  ),
  buildCourse(
    "course-go-pro",
    "GO PRO",
    "Advanced techniques for production-grade test suites",
    "advanced",
    "⚡",
    course3Modules,
  ),
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export function findModule(moduleId: string) {
  for (const course of courses) {
    const found = course.modules.find((m) => m.id === moduleId);
    if (found) return found;
  }
  return courses[0].modules[0];
}

export function findLesson(moduleId: string, lessonId: string) {
  const module = findModule(moduleId);
  return (
    module.lessons.find((lesson) => lesson.id === lessonId) ?? module.lessons[0]
  );
}

export function findCourseForModule(moduleId: string): Course | undefined {
  return courses.find((course) => course.modules.some((m) => m.id === moduleId));
}

export function flattenLessons(modules: Module[]) {
  return modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      module,
      lesson,
    }))
  );
}
