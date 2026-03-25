/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  CourseProgress,
  ModuleProgress,
} from "../types/curriculum";

const DEFAULT_PROGRESS_KEY = "mav-progress-v3";

interface ProgressContextValue {
  progress: CourseProgress;
  currentModuleId: string;
  currentLessonId: string;
  completedLessonCount: number;
  navigateTo: (moduleId: string, lessonId: string) => void;
  markLessonComplete: (moduleId: string, lessonId: string) => void;
  isLessonCompleted: (moduleId: string, lessonId: string) => boolean;
  saveQuizScore: (moduleId: string, lessonId: string, score: number) => void;
  markExerciseComplete: (moduleId: string, lessonId: string, exerciseTitle?: string) => void;
  isExerciseCompleted: (moduleId: string, lessonId: string, exerciseTitle?: string) => boolean;
  saveNote: (moduleId: string, lessonId: string, note: string) => void;
  getNote: (moduleId: string, lessonId: string) => string;
  saveScrollPosition: (lessonId: string, scrollY: number) => void;
  getScrollPosition: (lessonId: string) => number;
  getModuleCompletion: (moduleId: string, totalLessons: number) => number;
  getCourseCompletion: (totalLessons: number) => number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function createDefaultProgress(
  initialModuleId: string,
  initialLessonId: string
): CourseProgress {
  return {
    currentCourseId: "course-get-testing",
    currentModuleId: initialModuleId,
    currentLessonId: initialLessonId,
    currentSectionIndex: 0,
    currentTab: "sections",
    modules: {},
    scrollPositions: {},
    lastAccessedAt: new Date().toISOString(),
  };
}

function loadProgress(
  initialModuleId: string,
  initialLessonId: string,
  storageKey: string,
): CourseProgress {
  const fallback = createDefaultProgress(initialModuleId, initialLessonId);
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<CourseProgress>;
    return {
      ...fallback,
      ...parsed,
      modules: parsed.modules ?? {},
      scrollPositions: parsed.scrollPositions ?? {},
    };
  } catch {
    return fallback;
  }
}

function getModuleProgress(
  progress: CourseProgress,
  moduleId: string
): ModuleProgress {
  return (
    progress.modules[moduleId] ?? {
      started: false,
      completedLessons: [],
      quizScores: {},
      exerciseCompleted: {},
      notes: {},
    }
  );
}

export function ProgressProvider({
  children,
  initialModuleId,
  initialLessonId,
  storageKey = DEFAULT_PROGRESS_KEY,
}: {
  children: ReactNode;
  initialModuleId: string;
  initialLessonId: string;
  storageKey?: string;
}) {
  const [progress, setProgress] = useState<CourseProgress>(() =>
    loadProgress(initialModuleId, initialLessonId, storageKey)
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // ignore storage failures
    }
  }, [progress, storageKey]);

  const navigateTo = useCallback((moduleId: string, lessonId: string) => {
    setProgress((prev) => ({
      ...prev,
      currentModuleId: moduleId,
      currentLessonId: lessonId,
      currentSectionIndex: 0,
      currentTab: "sections",
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
      const current = getModuleProgress(prev, moduleId);
      if (current.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        modules: {
          ...prev.modules,
          [moduleId]: {
            ...current,
            completedLessons: [...current.completedLessons, lessonId],
          },
        },
      };
    });
  }, []);

  const isLessonCompleted = useCallback(
    (moduleId: string, lessonId: string) =>
      getModuleProgress(progress, moduleId).completedLessons.includes(lessonId),
    [progress]
  );

  const saveQuizScore = useCallback(
    (moduleId: string, lessonId: string, score: number) => {
      setProgress((prev) => {
        const current = getModuleProgress(prev, moduleId);
        return {
          ...prev,
          modules: {
            ...prev.modules,
            [moduleId]: {
              ...current,
              quizScores: { ...current.quizScores, [lessonId]: score },
            },
          },
        };
      });
    },
    []
  );

  const markExerciseComplete = useCallback(
    (moduleId: string, lessonId: string, exerciseTitle?: string) => {
      const key = exerciseTitle ? `${lessonId}:${exerciseTitle}` : lessonId;
      setProgress((prev) => {
        const current = getModuleProgress(prev, moduleId);
        return {
          ...prev,
          modules: {
            ...prev.modules,
            [moduleId]: {
              ...current,
              exerciseCompleted: {
                ...current.exerciseCompleted,
                [key]: true,
              },
            },
          },
        };
      });
    },
    []
  );

  const isExerciseCompleted = useCallback(
    (moduleId: string, lessonId: string, exerciseTitle?: string) => {
      const key = exerciseTitle ? `${lessonId}:${exerciseTitle}` : lessonId;
      return getModuleProgress(progress, moduleId).exerciseCompleted[key] === true;
    },
    [progress]
  );

  const saveNote = useCallback(
    (moduleId: string, lessonId: string, note: string) => {
      setProgress((prev) => {
        const current = getModuleProgress(prev, moduleId);
        return {
          ...prev,
          modules: {
            ...prev.modules,
            [moduleId]: {
              ...current,
              notes: { ...current.notes, [lessonId]: note },
            },
          },
        };
      });
    },
    []
  );

  const getNote = useCallback(
    (moduleId: string, lessonId: string) =>
      getModuleProgress(progress, moduleId).notes[lessonId] ?? "",
    [progress]
  );

  const saveScrollPosition = useCallback((lessonId: string, scrollY: number) => {
    setProgress((prev) => ({
      ...prev,
      scrollPositions: { ...prev.scrollPositions, [lessonId]: scrollY },
    }));
  }, []);

  const getScrollPosition = useCallback(
    (lessonId: string) => progress.scrollPositions[lessonId] ?? 0,
    [progress]
  );

  const getModuleCompletion = useCallback(
    (moduleId: string, totalLessons: number) => {
      if (totalLessons <= 0) return 0;
      return Math.round(
        (getModuleProgress(progress, moduleId).completedLessons.length /
          totalLessons) *
          100
      );
    },
    [progress]
  );

  const getCourseCompletion = useCallback(
    (totalLessons: number) => {
      if (totalLessons <= 0) return 0;
      const completed = Object.values(progress.modules).reduce(
        (sum, current) => sum + current.completedLessons.length,
        0
      );
      return Math.round((completed / totalLessons) * 100);
    },
    [progress]
  );

  const completedLessonCount = useMemo(
    () =>
      Object.values(progress.modules).reduce(
        (sum, current) => sum + current.completedLessons.length,
        0
      ),
    [progress.modules]
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      currentModuleId: progress.currentModuleId,
      currentLessonId: progress.currentLessonId,
      completedLessonCount,
      navigateTo,
      markLessonComplete,
      isLessonCompleted,
      saveQuizScore,
      markExerciseComplete,
      isExerciseCompleted,
      saveNote,
      getNote,
      saveScrollPosition,
      getScrollPosition,
      getModuleCompletion,
      getCourseCompletion,
    }),
    [
      progress,
      completedLessonCount,
      navigateTo,
      markLessonComplete,
      isLessonCompleted,
      saveQuizScore,
      markExerciseComplete,
      isExerciseCompleted,
      saveNote,
      getNote,
      saveScrollPosition,
      getScrollPosition,
      getModuleCompletion,
      getCourseCompletion,
    ]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return context;
}
