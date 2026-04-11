import { describe, it, expect } from "vitest";
import {
  courses,
  findModule,
  findLesson,
  findCourseForModule,
  flattenLessons,
} from "../curriculum";

describe("curriculum adapter", () => {
  describe("courses", () => {
    it("should export at least 3 courses", () => {
      expect(courses.length).toBeGreaterThanOrEqual(3);
    });

    it("each course has required fields", () => {
      for (const course of courses) {
        expect(course.id).toBeTruthy();
        expect(course.title).toBeTruthy();
        expect(course.modules.length).toBeGreaterThan(0);
      }
    });

    it("each module has valid lessons", () => {
      for (const course of courses) {
        for (const mod of course.modules) {
          expect(mod.id).toBeTruthy();
          expect(mod.title).toBeTruthy();
          expect(mod.lessons.length).toBeGreaterThan(0);
          for (const lesson of mod.lessons) {
            expect(lesson.id).toBeTruthy();
            expect(lesson.title).toBeTruthy();
            expect(lesson.sections.length).toBeGreaterThan(0);
            expect(lesson.estimatedMinutes).toBeGreaterThan(0);
          }
        }
      }
    });

    it("each lesson section has a valid type", () => {
      const validTypes = ["text", "code", "callout", "table"];
      for (const course of courses) {
        for (const mod of course.modules) {
          for (const lesson of mod.lessons) {
            for (const section of lesson.sections) {
              expect(validTypes).toContain(section.type);
            }
          }
        }
      }
    });
  });

  describe("findModule", () => {
    it("returns the correct module by id", () => {
      const firstModule = courses[0].modules[0];
      const found = findModule(firstModule.id);
      expect(found.id).toBe(firstModule.id);
      expect(found.title).toBe(firstModule.title);
    });

    it("returns fallback for unknown module id", () => {
      const found = findModule("nonexistent-module");
      expect(found).toBeTruthy();
      expect(found.id).toBe(courses[0].modules[0].id);
    });
  });

  describe("findLesson", () => {
    it("returns the correct lesson by module and lesson id", () => {
      const firstModule = courses[0].modules[0];
      const firstLesson = firstModule.lessons[0];
      const found = findLesson(firstModule.id, firstLesson.id);
      expect(found.id).toBe(firstLesson.id);
      expect(found.title).toBe(firstLesson.title);
    });

    it("returns fallback for unknown lesson id", () => {
      const firstModule = courses[0].modules[0];
      const found = findLesson(firstModule.id, "nonexistent-lesson");
      expect(found).toBeTruthy();
      expect(found.id).toBe(firstModule.lessons[0].id);
    });
  });

  describe("findCourseForModule", () => {
    it("returns the parent course for a module", () => {
      const firstModule = courses[0].modules[0];
      const found = findCourseForModule(firstModule.id);
      expect(found).toBeTruthy();
      expect(found!.id).toBe(courses[0].id);
    });

    it("returns undefined for unknown module", () => {
      const found = findCourseForModule("nonexistent");
      expect(found).toBeUndefined();
    });
  });

  describe("flattenLessons", () => {
    it("returns array of {module, lesson} pairs", () => {
      const modules = courses[0].modules;
      const flat = flattenLessons(modules);
      expect(flat.length).toBeGreaterThan(0);
      for (const item of flat) {
        expect(item.module).toBeTruthy();
        expect(item.lesson).toBeTruthy();
      }
    });

    it("total lessons matches sum of all module lessons", () => {
      const modules = courses[0].modules;
      const expectedTotal = modules.reduce((sum, m) => sum + m.lessons.length, 0);
      const flat = flattenLessons(modules);
      expect(flat.length).toBe(expectedTotal);
    });

    it("returns empty array for empty modules", () => {
      expect(flattenLessons([])).toEqual([]);
    });
  });
});
