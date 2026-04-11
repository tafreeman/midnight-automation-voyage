import { useMemo } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Layers3,
  Play,
  Sparkles,
} from "lucide-react";

import { useProgress } from "../contexts/ProgressContext";
import type { Course } from "../types/curriculum";

/* ─────────────────────────────────────────────────
   Props
   ───────────────────────────────────────────────── */

interface CourseSelectPageProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  onResume: () => void;
}

/* ─────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────── */

const DIFFICULTY_COLORS: Record<Course["difficulty"], { bg: string; text: string; label: string }> = {
  beginner: { bg: "rgba(74, 222, 128, 0.14)", text: "#4ade80", label: "Beginner" },
  intermediate: { bg: "rgba(251, 191, 36, 0.14)", text: "#fbbf24", label: "Intermediate" },
  advanced: { bg: "rgba(248, 113, 113, 0.14)", text: "#f87171", label: "Advanced" },
};

function totalLessonsInCourse(course: Course): number {
  return course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
}

function totalModulesInCourse(course: Course): number {
  return course.modules.length;
}

/* ─────────────────────────────────────────────────
   Progress Ring (SVG)
   ───────────────────────────────────────────────── */

function ProgressRing({ percent, size = 56 }: { percent: number; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-info)" />
            <stop offset="100%" stopColor="var(--accent-action)" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className="absolute text-xs font-semibold"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
      >
        {percent}%
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Resume Banner
   ───────────────────────────────────────────────── */

function ResumeBanner({
  courseTitle,
  moduleTitle,
  lessonTitle,
  onResume,
}: {
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  onResume: () => void;
}) {
  return (
    <section
      className="overflow-hidden rounded-2xl border"
      style={{
        borderColor: "var(--border-subtle)",
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--accent-action) 8%, var(--surface-elevated)), color-mix(in srgb, var(--accent-info) 6%, var(--surface-elevated)))",
        boxShadow: "var(--shadow-elevation)",
      }}
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <div
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--accent-action)" }}
          >
            <Play size={12} />
            Resume where you left off
          </div>
          <h3 className="mt-2 truncate text-base font-medium sm:text-lg" style={{ color: "var(--text-primary)" }}>
            {lessonTitle}
          </h3>
          <p className="mt-1 truncate text-sm" style={{ color: "var(--text-secondary)" }}>
            {courseTitle} &middot; {moduleTitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onResume}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--accent-action)",
            color: "var(--surface-primary)",
          }}
        >
          Continue
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────
   Course Card
   ───────────────────────────────────────────────── */

function CourseCard({
  course,
  completion,
  hasStarted,
  resumeInfo,
  onSelect,
}: {
  course: Course;
  completion: number;
  hasStarted: boolean;
  resumeInfo: { moduleTitle: string; lessonTitle: string } | null;
  onSelect: () => void;
}) {
  const diff = DIFFICULTY_COLORS[course.difficulty];
  const lessonCount = totalLessonsInCourse(course);
  const moduleCount = totalModulesInCourse(course);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col rounded-2xl border text-left transition-all"
      style={{
        borderColor: completion === 100 ? "var(--accent-action)" : "var(--border-subtle)",
        backgroundColor: "var(--surface-elevated)",
        boxShadow: "var(--shadow-elevation)",
      }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 p-6 pb-0 sm:p-7 sm:pb-0">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl border text-xl"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "var(--surface-code)",
            }}
          >
            {course.icon}
          </div>
          <div
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: diff.bg, color: diff.text }}
          >
            {diff.label}
          </div>
        </div>
        <ProgressRing percent={completion} />
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-6 pt-5 sm:p-7 sm:pt-5">
        <h3
          className="text-lg font-semibold tracking-tight sm:text-xl"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
        >
          {course.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {course.subtitle}
        </p>

        {/* Stats row */}
        <div
          className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={12} />
            {course.estimatedHours}h
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Layers3 size={12} />
            {moduleCount} modules
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={12} />
            {lessonCount} lessons
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--border-subtle)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${completion}%`,
              background: "linear-gradient(90deg, var(--accent-info), var(--accent-action))",
              transition: "width 0.6s ease",
            }}
          />
        </div>

        {/* Resume indicator */}
        {resumeInfo && hasStarted && completion < 100 ? (
          <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <Sparkles size={11} style={{ color: "var(--accent-highlight)" }} />
            <span className="truncate">
              Last: {resumeInfo.lessonTitle}
            </span>
          </div>
        ) : null}

        {/* Spacer to push button to bottom */}
        <div className="flex-1" />

        {/* CTA */}
        <div
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity group-hover:opacity-90"
          style={{
            backgroundColor: hasStarted ? "var(--accent-action)" : "var(--surface-code)",
            color: hasStarted ? "var(--surface-primary)" : "var(--text-primary)",
            border: hasStarted ? "none" : "1px solid var(--border-subtle)",
          }}
        >
          {completion === 100 ? (
            <>Review</>
          ) : hasStarted ? (
            <>
              Continue
              <ArrowRight size={14} />
            </>
          ) : (
            <>
              Start Course
              <Play size={14} />
            </>
          )}
        </div>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────────── */

export function CourseSelectPage({
  courses,
  onSelectCourse,
  onResume,
}: CourseSelectPageProps) {
  const { progress } = useProgress();

  // Compute per-course completion and resume info
  const courseData = useMemo(() => {
    return courses.map((course) => {
      const totalLessons = totalLessonsInCourse(course);

      // Count completed lessons across all modules in this course
      let completedCount = 0;
      for (const mod of course.modules) {
        const modProgress = progress.modules[mod.id];
        if (modProgress) {
          completedCount += modProgress.completedLessons.length;
        }
      }
      const completion = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
      const hasStarted = completedCount > 0 || course.modules.some((m) => progress.modules[m.id]?.started);

      // Find resume info: last module/lesson the user was on within this course
      let resumeInfo: { moduleTitle: string; lessonTitle: string } | null = null;
      if (hasStarted) {
        const currentMod = course.modules.find((m) => m.id === progress.currentModuleId);
        if (currentMod) {
          const currentLesson = currentMod.lessons.find((l) => l.id === progress.currentLessonId);
          if (currentLesson) {
            resumeInfo = { moduleTitle: currentMod.title, lessonTitle: currentLesson.title };
          }
        }
      }

      return { course, completion, hasStarted, resumeInfo };
    });
  }, [courses, progress]);

  // Find active resume target across all courses
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const resumeTarget = useMemo(() => {
    for (const { course, hasStarted, completion } of courseData) {
      if (!hasStarted || completion === 100) continue;
      const currentMod = course.modules.find((m) => m.id === progress.currentModuleId);
      if (currentMod) {
        const currentLesson = currentMod.lessons.find((l) => l.id === progress.currentLessonId);
        if (currentLesson) {
          return {
            courseTitle: course.title,
            moduleTitle: currentMod.title,
            lessonTitle: currentLesson.title,
          };
        }
      }
    }
    return null;
  }, [courseData, progress.currentModuleId, progress.currentLessonId]);

  const totalAllLessons = courses.reduce((s, c) => s + totalLessonsInCourse(c), 0);
  const totalAllModules = courses.reduce((s, c) => s + totalModulesInCourse(c), 0);

  return (
    <div className="course-select-page mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <header className="space-y-2">
        <div
          className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.28em]"
          style={{ color: "var(--text-muted)" }}
        >
          <span>{courses.length} courses</span>
          <span>&middot;</span>
          <span>{totalAllModules} modules</span>
          <span>&middot;</span>
          <span>{totalAllLessons} lessons</span>
        </div>
        <h1
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
        >
          Playwright Training
        </h1>
        <p className="max-w-2xl text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
          Master test automation at your own pace. Pick a course below to start learning, or continue where you left off.
        </p>
      </header>

      {/* Resume banner */}
      {resumeTarget ? (
        <ResumeBanner
          courseTitle={resumeTarget.courseTitle}
          moduleTitle={resumeTarget.moduleTitle}
          lessonTitle={resumeTarget.lessonTitle}
          onResume={onResume}
        />
      ) : null}

      {/* Course grid */}
      <section className="space-y-4">
        <h2
          className="text-sm font-semibold uppercase tracking-[0.25em]"
          style={{ color: "var(--text-muted)" }}
        >
          Available Courses
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courseData.map(({ course, completion, hasStarted, resumeInfo }) => (
            <CourseCard
              key={course.id}
              course={course}
              completion={completion}
              hasStarted={hasStarted}
              resumeInfo={resumeInfo}
              onSelect={() => onSelectCourse(course.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
