import { describe, it, expect } from "vitest";
import {
  courses,
  findModule,
  findLesson,
  findCourseForModule,
  flattenLessons,
} from "../curriculum";

// Use the first two courses (firstPlaywrightTestsCourse, copilotFirstTestingCourse)
// which are built from standalone course data and are stable for lookup tests.
const stableCourse = courses[0];
const stableModule = stableCourse.modules[0];
const stableLesson = stableModule.lessons[0];

describe("findCourseForModule", () => {
  it("returns the course that contains a known module id", () => {
    const result = findCourseForModule(stableModule.id);
    expect(result).toBeDefined();
    expect(result!.id).toBe(stableCourse.id);
  });

  it("returns undefined for a non-existent module id", () => {
    const result = findCourseForModule("module-does-not-exist-xyz");
    expect(result).toBeUndefined();
  });
});

describe("flattenLessons", () => {
  it("returns items with module and lesson properties", () => {
    const flat = flattenLessons(stableCourse.modules);
    expect(flat.length).toBeGreaterThan(0);
    for (const item of flat) {
      expect(item.module).toBeDefined();
      expect(item.lesson).toBeDefined();
      expect(item.module.id).toBeTruthy();
      expect(item.lesson.id).toBeTruthy();
    }
  });

  it("total count equals the sum of all lesson counts across modules", () => {
    const modules = stableCourse.modules;
    const expectedTotal = modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const flat = flattenLessons(modules);
    expect(flat.length).toBe(expectedTotal);
  });

  it("returns an empty array when given an empty modules list", () => {
    expect(flattenLessons([])).toEqual([]);
  });
});

describe("findLesson", () => {
  it("returns the correct lesson by module id and lesson id", () => {
    const found = findLesson(stableModule.id, stableLesson.id);
    expect(found.id).toBe(stableLesson.id);
    expect(found.title).toBe(stableLesson.title);
  });

  it("falls back to the first lesson when lessonId is not found", () => {
    const found = findLesson(stableModule.id, "nonexistent-lesson-id");
    expect(found.id).toBe(stableModule.lessons[0].id);
  });
});

describe("findModule fallback behavior", () => {
  it("returns a module object (the first module of the first course) for an unknown id", () => {
    const found = findModule("completely-unknown-module-id");
    expect(found).toBeDefined();
    // Fallback is documented: returns first module of first course
    expect(found.id).toBe(courses[0].modules[0].id);
  });

  it("returns the correct module for a known id", () => {
    const found = findModule(stableModule.id);
    expect(found.id).toBe(stableModule.id);
  });
});
