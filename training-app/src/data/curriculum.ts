import { lessons as legacyLessons } from "./index";
import type { Lesson as LegacyLesson } from "./types";
import type {
  Audience,
  Module,
  Lesson,
  Section,
  ThemeName,
} from "../types/curriculum";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function themeForModule(moduleNumber: number): ThemeName {
  const darkThemes: ThemeName[] = ["signal-cobalt", "gamma-dark"];
  const lightThemes: ThemeName[] = ["arctic-steel", "linear"];
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

function audienceForLesson(value?: string): Audience {
  if (!value) return "all";
  if (value.toLowerCase().includes("non-coder")) return "non-coder";
  if (value.toLowerCase().includes("developer")) return "developer";
  return "all";
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

function lessonFromLegacy(legacy: LegacyLesson): Lesson {
  const moduleNumber = legacy.id;
  return {
    id: `lesson-${pad(moduleNumber)}-01`,
    title: legacy.title,
    subtitle: legacy.subtitle,
    estimatedMinutes: estimatedMinutesFromLegacy(legacy),
    audience: audienceForLesson(legacy.audience),
    sections: sectionsFromLegacy(legacy),
    quiz: legacy.quiz,
    exercise: legacy.exercise ?? legacy.exercises?.[0],
    promptTemplates: legacy.promptTemplates,
    practiceLink: legacy.practiceLink,
  };
}

export const curriculum: Module[] = legacyLessons.map((legacy) => {
  const moduleNumber = legacy.id;
  const lesson = lessonFromLegacy(legacy);
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

export function findModule(moduleId: string) {
  return curriculum.find((module) => module.id === moduleId) ?? curriculum[0];
}

export function findLesson(moduleId: string, lessonId: string) {
  const module = findModule(moduleId);
  return (
    module.lessons.find((lesson) => lesson.id === lessonId) ?? module.lessons[0]
  );
}

export function flattenLessons(modules: Module[]) {
  return modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      module,
      lesson,
    }))
  );
}
