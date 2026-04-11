import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ProgressProvider, useProgress } from "../ProgressContext";
import type { ReactNode } from "react";

const TEST_STORAGE_KEY = "test-progress";

function wrapper({ children }: { children: ReactNode }) {
  return (
    <ProgressProvider
      initialModuleId="module-01"
      initialLessonId="lesson-01"
      storageKey={TEST_STORAGE_KEY}
    >
      {children}
    </ProgressProvider>
  );
}

describe("ProgressContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with default progress", () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    expect(result.current.currentModuleId).toBe("module-01");
    expect(result.current.currentLessonId).toBe("lesson-01");
    expect(result.current.completedLessonCount).toBe(0);
  });

  it("navigates to a new module and lesson", () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => {
      result.current.navigateTo("module-02", "lesson-02");
    });
    expect(result.current.currentModuleId).toBe("module-02");
    expect(result.current.currentLessonId).toBe("lesson-02");
  });

  it("marks a lesson as completed", () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => {
      result.current.markLessonComplete("module-01", "lesson-01");
    });
    expect(result.current.isLessonCompleted("module-01", "lesson-01")).toBe(true);
    expect(result.current.completedLessonCount).toBe(1);
  });

  it("does not double-count lesson completions", () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => {
      result.current.markLessonComplete("module-01", "lesson-01");
      result.current.markLessonComplete("module-01", "lesson-01");
    });
    expect(result.current.completedLessonCount).toBe(1);
  });

  it("saves and retrieves quiz scores", () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => {
      result.current.saveQuizScore("module-01", "lesson-01", 85);
    });
    expect(result.current.progress.modules["module-01"]?.quizScores["lesson-01"]).toBe(85);
  });

  it("marks exercises as completed", () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => {
      result.current.markExerciseComplete("module-01", "lesson-01", "Ex 1");
    });
    expect(result.current.isExerciseCompleted("module-01", "lesson-01", "Ex 1")).toBe(true);
    expect(result.current.isExerciseCompleted("module-01", "lesson-01", "Other")).toBe(false);
  });

  it("saves and retrieves notes", () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => {
      result.current.saveNote("module-01", "lesson-01", "My notes");
    });
    expect(result.current.getNote("module-01", "lesson-01")).toBe("My notes");
  });

  it("returns empty string for non-existent notes", () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    expect(result.current.getNote("module-01", "lesson-99")).toBe("");
  });

  it("saves and retrieves scroll positions", () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => {
      result.current.saveScrollPosition("lesson-01", 250);
    });
    expect(result.current.getScrollPosition("lesson-01")).toBe(250);
  });

  it("calculates module completion percentage", () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => {
      result.current.markLessonComplete("module-01", "lesson-01");
      result.current.markLessonComplete("module-01", "lesson-02");
    });
    expect(result.current.getModuleCompletion("module-01", 4)).toBe(50);
  });

  it("returns 0 completion when totalLessons is 0", () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    expect(result.current.getModuleCompletion("module-01", 0)).toBe(0);
  });

  it("persists progress to localStorage", () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => {
      result.current.markLessonComplete("module-01", "lesson-01");
    });
    const stored = localStorage.getItem(TEST_STORAGE_KEY);
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.modules["module-01"].completedLessons).toContain("lesson-01");
  });
});
