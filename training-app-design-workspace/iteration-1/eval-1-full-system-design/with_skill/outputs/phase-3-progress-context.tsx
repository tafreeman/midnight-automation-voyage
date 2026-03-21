/**
 * ProgressContext.tsx
 * Target: training-app/src/contexts/ProgressContext.tsx
 *
 * Course progress tracking with localStorage persistence.
 * Tracks completion at module/lesson level, quiz scores,
 * exercise completion, user notes, and scroll positions.
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { CourseProgress, ModuleProgress } from '../types/curriculum';

// ─── Storage ──────────────────────────────────────────────────────

const PROGRESS_KEY = 'mav-progress-v2';

function createDefaultProgress(): CourseProgress {
  return {
    currentModuleId: 'module-01',
    currentLessonId: 'lesson-01-01',
    modules: {},
    scrollPositions: {},
    themePreference: 'auto',
    lastAccessedAt: new Date().toISOString(),
  };
}

function loadProgress(): CourseProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...createDefaultProgress(), ...parsed };
    }
  } catch {
    // corrupted data or localStorage unavailable
  }
  return createDefaultProgress();
}

function persistProgress(progress: CourseProgress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // localStorage unavailable
  }
}

function getModuleProgress(progress: CourseProgress, moduleId: string): ModuleProgress {
  return (
    progress.modules[moduleId] || {
      started: false,
      completedLessons: [],
      quizScores: {},
      exerciseCompleted: {},
      notes: {},
    }
  );
}

// ─── Context Shape ────────────────────────────────────────────────

interface ProgressContextValue {
  progress: CourseProgress;
  currentModuleId: string;
  currentLessonId: string;

  // Navigation
  navigateTo: (moduleId: string, lessonId: string) => void;

  // Completion
  markLessonComplete: (moduleId: string, lessonId: string) => void;
  isLessonCompleted: (moduleId: string, lessonId: string) => boolean;
  getModuleCompletion: (moduleId: string, totalLessons: number) => number;
  getCourseCompletion: (totalLessons: number) => number;
  completedLessonCount: number;

  // Quiz & Exercise
  saveQuizScore: (moduleId: string, lessonId: string, score: number) => void;
  markExerciseComplete: (moduleId: string, lessonId: string) => void;

  // Notes
  saveNote: (moduleId: string, lessonId: string, note: string) => void;
  getNote: (moduleId: string, lessonId: string) => string;

  // Scroll Position
  saveScrollPosition: (lessonId: string, scrollY: number) => void;
  getScrollPosition: (lessonId: string) => number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<CourseProgress>(loadProgress);

  // Auto-persist on every change
  useEffect(() => {
    persistProgress(progress);
  }, [progress]);

  const navigateTo = useCallback((moduleId: string, lessonId: string) => {
    setProgress((prev) => ({
      ...prev,
      currentModuleId: moduleId,
      currentLessonId: lessonId,
      lastAccessedAt: new Date().toISOString(),
      modules: {
        ...prev.modules,
        [moduleId]: {
          ...getModuleProgress(prev, moduleId),
          started: true,
        },
      },
    }));
  }, []);

  const markLessonComplete = useCallback((moduleId: string, lessonId: string) => {
    setProgress((prev) => {
      const mod = getModuleProgress(prev, moduleId);
      if (mod.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        modules: {
          ...prev.modules,
          [moduleId]: {
            ...mod,
            completedLessons: [...mod.completedLessons, lessonId],
          },
        },
      };
    });
  }, []);

  const isLessonCompleted = useCallback(
    (moduleId: string, lessonId: string): boolean => {
      return getModuleProgress(progress, moduleId).completedLessons.includes(lessonId);
    },
    [progress]
  );

  const getModuleCompletion = useCallback(
    (moduleId: string, totalLessons: number): number => {
      if (totalLessons === 0) return 0;
      return Math.round(
        (getModuleProgress(progress, moduleId).completedLessons.length / totalLessons) * 100
      );
    },
    [progress]
  );

  const getCourseCompletion = useCallback(
    (totalLessons: number): number => {
      if (totalLessons === 0) return 0;
      const completed = Object.values(progress.modules).reduce(
        (sum, mod) => sum + mod.completedLessons.length,
        0
      );
      return Math.round((completed / totalLessons) * 100);
    },
    [progress]
  );

  const completedLessonCount = Object.values(progress.modules).reduce(
    (sum, mod) => sum + mod.completedLessons.length,
    0
  );

  const saveQuizScore = useCallback((moduleId: string, lessonId: string, score: number) => {
    setProgress((prev) => {
      const mod = getModuleProgress(prev, moduleId);
      return {
        ...prev,
        modules: {
          ...prev.modules,
          [moduleId]: { ...mod, quizScores: { ...mod.quizScores, [lessonId]: score } },
        },
      };
    });
  }, []);

  const markExerciseComplete = useCallback((moduleId: string, lessonId: string) => {
    setProgress((prev) => {
      const mod = getModuleProgress(prev, moduleId);
      return {
        ...prev,
        modules: {
          ...prev.modules,
          [moduleId]: {
            ...mod,
            exerciseCompleted: { ...mod.exerciseCompleted, [lessonId]: true },
          },
        },
      };
    });
  }, []);

  const saveNote = useCallback((moduleId: string, lessonId: string, note: string) => {
    setProgress((prev) => {
      const mod = getModuleProgress(prev, moduleId);
      return {
        ...prev,
        modules: {
          ...prev.modules,
          [moduleId]: { ...mod, notes: { ...mod.notes, [lessonId]: note } },
        },
      };
    });
  }, []);

  const getNote = useCallback(
    (moduleId: string, lessonId: string): string => {
      return getModuleProgress(progress, moduleId).notes[lessonId] || '';
    },
    [progress]
  );

  const saveScrollPosition = useCallback((lessonId: string, scrollY: number) => {
    setProgress((prev) => ({
      ...prev,
      scrollPositions: { ...prev.scrollPositions, [lessonId]: scrollY },
    }));
  }, []);

  const getScrollPosition = useCallback(
    (lessonId: string): number => {
      return progress.scrollPositions[lessonId] || 0;
    },
    [progress]
  );

  return (
    <ProgressContext.Provider
      value={{
        progress,
        currentModuleId: progress.currentModuleId,
        currentLessonId: progress.currentLessonId,
        navigateTo,
        markLessonComplete,
        isLessonCompleted,
        getModuleCompletion,
        getCourseCompletion,
        saveQuizScore,
        markExerciseComplete,
        saveNote,
        getNote,
        saveScrollPosition,
        getScrollPosition,
        completedLessonCount,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
