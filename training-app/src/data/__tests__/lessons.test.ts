import { describe, it, expect, vi } from "vitest";

// Prevent the circular dependency: index.ts re-exports `courses` from
// curriculum.ts, which in turn imports `lessons` from index.ts. Without this
// mock the module graph deadlocks and legacyLessons arrives as undefined.
vi.mock("../curriculum", () => ({
  courses: [],
  curriculum: [],
  findModule: vi.fn(),
  findLesson: vi.fn(),
  findCourseForModule: vi.fn(),
  flattenLessons: vi.fn(),
  mergedModule: vi.fn(),
  splitModuleFirstHalf: vi.fn(),
  splitModuleSecondHalf: vi.fn(),
  legacyById: vi.fn(),
}));

import { lessons } from "../index";

describe("legacy lessons array", () => {
  it("contains at least 31 lessons", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(31);
  });

  it("every lesson has required fields: id (number), title, subtitle, icon, non-empty sections", () => {
    for (const lesson of lessons) {
      expect(typeof lesson.id).toBe("number");
      expect(lesson.title).toBeTruthy();
      expect(lesson.subtitle).toBeTruthy();
      expect(lesson.icon).toBeTruthy();
      expect(Array.isArray(lesson.sections)).toBe(true);
      expect(lesson.sections.length).toBeGreaterThan(0);
    }
  });

  it("every section has a non-empty heading and content string", () => {
    for (const lesson of lessons) {
      for (const section of lesson.sections) {
        expect(section.heading).toBeTruthy();
        expect(typeof section.content).toBe("string");
        expect(section.content.length).toBeGreaterThan(0);
      }
    }
  });

  it("every quiz (when present) has question, options array >=2, and a valid correctIndex", () => {
    for (const lesson of lessons) {
      if (!lesson.quiz) continue;
      expect(lesson.quiz.question).toBeTruthy();
      expect(Array.isArray(lesson.quiz.options)).toBe(true);
      expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(2);
      expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.quiz.correctIndex).toBeLessThan(lesson.quiz.options.length);
    }
  });

  it("at least half of lessons include a quiz", () => {
    const withQuiz = lessons.filter((l) => l.quiz != null);
    expect(withQuiz.length).toBeGreaterThan(lessons.length / 2);
  });

  it("spot-check: first lesson (index 0) has numeric id 0 and a non-empty title", () => {
    const first = lessons[0];
    expect(first.id).toBe(0);
    expect(first.title.length).toBeGreaterThan(0);
  });
});
