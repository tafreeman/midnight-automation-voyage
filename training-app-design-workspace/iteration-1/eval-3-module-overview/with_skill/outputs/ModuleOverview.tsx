/**
 * ModuleOverview.tsx
 *
 * Module Overview page for Module 14: Page Object Model
 * Theme: Linear (light) -- even-numbered module
 * Layout: nav-hub + stat-cards
 * Visual family: B (Editorial handbook) with A (dark workspace) left rail
 *
 * This component renders a complete module overview screen showing:
 * - ModuleHero with title, metadata, and learning objectives
 * - Prerequisite status callout
 * - 6-lesson list with completion states and estimated times
 * - "What you'll build" preview with before/after code comparison
 * - Progress snapshot with course and module progress
 * - Left navigation rail showing position in the 30-module course
 */

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LessonStatus = "completed" | "in-progress" | "available" | "locked";

interface ModuleLesson {
  number: number;
  title: string;
  estimatedMinutes: number;
  status: LessonStatus;
  description: string;
}

interface CourseModule {
  number: number;
  title: string;
  status: "completed" | "in-progress" | "locked";
}

interface ModuleOverviewProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onStartLesson: (lessonNumber: number) => void;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const MODULE_LESSONS: ModuleLesson[] = [
  {
    number: 1,
    title: "Why POM?",
    estimatedMinutes: 5,
    status: "completed",
    description:
      "Understand the maintenance problem that the Page Object Model pattern solves and when to apply it.",
  },
  {
    number: 2,
    title: "POM Structure",
    estimatedMinutes: 10,
    status: "completed",
    description:
      "Learn the class-based pattern for encapsulating page locators and actions into reusable objects.",
  },
  {
    number: 3,
    title: "Copilot POM Generation",
    estimatedMinutes: 8,
    status: "in-progress",
    description:
      "Use GitHub Copilot Chat to generate complete Page Object classes from page descriptions.",
  },
  {
    number: 4,
    title: "Multi-Page POM",
    estimatedMinutes: 10,
    status: "available",
    description:
      "Organize Page Objects across a multi-page application with shared base classes.",
  },
  {
    number: 5,
    title: "POM Best Practices",
    estimatedMinutes: 7,
    status: "locked",
    description:
      "Naming conventions, when to use inheritance vs. composition, and common POM anti-patterns.",
  },
  {
    number: 6,
    title: "POM Exercise",
    estimatedMinutes: 10,
    status: "locked",
    description:
      "Refactor an inline test with repeated selectors into a clean Page Object Model architecture.",
  },
];

const COURSE_MODULES: CourseModule[] = [
  { number: 1, title: "Orientation", status: "completed" },
  { number: 2, title: "Mindset Shifts", status: "completed" },
  { number: 3, title: "What to Automate", status: "completed" },
  { number: 4, title: "Why Playwright + Copilot", status: "completed" },
  { number: 5, title: "Environment Setup", status: "completed" },
  { number: 6, title: "Copilot Prompt Engineering", status: "completed" },
  { number: 7, title: "Record & Refine Workflow", status: "completed" },
  { number: 8, title: "Writing Tests", status: "completed" },
  { number: 9, title: "Page Object Model", status: "completed" },
  { number: 10, title: "API Testing", status: "completed" },
  { number: 11, title: "Prompt Templates", status: "completed" },
  { number: 12, title: "Reading Results", status: "completed" },
  { number: 13, title: "HITL Review Checklist", status: "completed" },
  { number: 14, title: "Page Object Model", status: "in-progress" },
  { number: 15, title: "CI/CD Reference", status: "locked" },
  { number: 16, title: "Auth Fixtures", status: "locked" },
  { number: 17, title: "Visual Regression", status: "locked" },
  { number: 18, title: "Accessibility Testing", status: "locked" },
  { number: 19, title: "Flaky Test Diagnosis", status: "locked" },
  { number: 20, title: "Test Data Strategies", status: "locked" },
  { number: 21, title: "Assessment & Certification", status: "locked" },
  { number: 22, title: "Trace Viewer", status: "locked" },
  { number: 23, title: "Mobile & Responsive", status: "locked" },
  { number: 24, title: "Parallel & Sharding", status: "locked" },
  { number: 25, title: "Multi-Browser Projects", status: "locked" },
  { number: 26, title: "Test Tagging", status: "locked" },
  { number: 27, title: "GitHub Actions", status: "locked" },
  { number: 28, title: "Network Mocking", status: "locked" },
  { number: 29, title: "Playwright MCP & AI Agents", status: "locked" },
  { number: 30, title: "Component Testing", status: "locked" },
];

const SECTION_LABELS: Record<string, [number, number]> = {
  Foundations: [1, 4],
  "Core Skills": [5, 10],
  "Advanced Practices": [11, 15],
  "Specialized Topics": [16, 22],
  Infrastructure: [23, 27],
  Extended: [28, 30],
};

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: LessonStatus }) {
  const config: Record<
    LessonStatus,
    { label: string; className: string; icon: string }
  > = {
    completed: {
      label: "Completed",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: "\u2713",
    },
    "in-progress": {
      label: "In Progress",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      icon: "\u25B6",
    },
    available: {
      label: "Available",
      className:
        "bg-slate-50 text-slate-600 border-slate-200",
      icon: "\u25CB",
    },
    locked: {
      label: "Locked",
      className: "bg-slate-50 text-slate-400 border-slate-200",
      icon: "\uD83D\uDD12",
    },
  };
  const c = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${c.className}`}
      aria-label={c.label}
    >
      <span aria-hidden="true">{c.icon}</span>
      {c.label}
    </span>
  );
}

function LessonCard({
  lesson,
  onStart,
}: {
  lesson: ModuleLesson;
  onStart: () => void;
}) {
  const isClickable =
    lesson.status === "available" || lesson.status === "in-progress";
  const isLocked = lesson.status === "locked";

  return (
    <button
      onClick={isClickable ? onStart : undefined}
      disabled={isLocked}
      className={`w-full text-left rounded-xl border p-4 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${
        isLocked
          ? "bg-white/60 border-slate-200 opacity-60 cursor-not-allowed"
          : lesson.status === "in-progress"
          ? "bg-white border-blue-300 shadow-sm hover:shadow-md hover:border-blue-400"
          : lesson.status === "completed"
          ? "bg-white border-emerald-200 hover:border-emerald-300 hover:shadow-sm"
          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer"
      }`}
      aria-label={
        isLocked
          ? `Lesson ${lesson.number}: ${lesson.title} -- Locked, complete previous lessons first`
          : `Lesson ${lesson.number}: ${lesson.title}`
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Lesson number */}
          <span
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
              lesson.status === "completed"
                ? "bg-emerald-100 text-emerald-700"
                : lesson.status === "in-progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {lesson.status === "completed" ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8.5L6.5 12L13 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              lesson.number
            )}
          </span>
          <div className="min-w-0">
            <h3
              className={`text-sm font-semibold leading-snug ${
                isLocked ? "text-slate-400" : "text-slate-800"
              }`}
            >
              {lesson.title}
            </h3>
            <p
              className={`text-xs mt-1 leading-relaxed ${
                isLocked ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {lesson.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <StatusBadge status={lesson.status} />
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {lesson.estimatedMinutes} min
          </span>
        </div>
      </div>
    </button>
  );
}

function CourseNavRail({
  modules,
  currentModule,
  open,
  onToggle,
}: {
  modules: CourseModule[];
  currentModule: number;
  open: boolean;
  onToggle: () => void;
}) {
  if (!open) {
    return (
      <aside className="w-10 h-full bg-zinc-900/95 border-r border-zinc-800 flex flex-col items-center pt-4">
        <button
          onClick={onToggle}
          className="p-1 hover:bg-zinc-800 rounded text-zinc-400"
          aria-label="Open navigation"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 3h12M2 8h12M2 13h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </aside>
    );
  }

  const completedCount = modules.filter(
    (m) => m.status === "completed"
  ).length;
  const progress = Math.round((completedCount / modules.length) * 100);

  return (
    <aside className="w-72 flex-shrink-0 border-r border-zinc-800 bg-zinc-950 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1
              className="text-sm font-bold tracking-wide text-emerald-400"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              PLAYWRIGHT
            </h1>
            <p className="text-xs text-zinc-500 tracking-widest uppercase mt-0.5">
              + GitHub Copilot
            </p>
          </div>
          <button
            onClick={onToggle}
            className="text-zinc-600 hover:text-zinc-400 transition-colors p-1"
            aria-label="Close navigation"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M12 12L4 4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-1.5" aria-live="polite" role="status">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Course Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress
            value={progress}
            className="h-1.5 bg-zinc-800 [&>[role=progressbar]]:bg-emerald-500"
            aria-label={`Course progress: ${completedCount} of ${modules.length} modules completed`}
          />
          <p className="text-xs text-zinc-600">
            {completedCount} of {modules.length} modules
          </p>
        </div>
      </div>

      {/* Module list grouped by section */}
      <nav
        className="flex-1 overflow-y-auto p-2"
        aria-label="Course modules"
      >
        {Object.entries(SECTION_LABELS).map(([sectionName, [start, end]]) => (
          <div key={sectionName} className="mb-3">
            <p className="px-3 py-1 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              {sectionName}
            </p>
            <div className="space-y-0.5">
              {modules
                .filter((m) => m.number >= start && m.number <= end)
                .map((mod) => {
                  const isCurrent = mod.number === currentModule;
                  return (
                    <div
                      key={mod.number}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-all ${
                        isCurrent
                          ? "bg-blue-500/15 border border-blue-500/25"
                          : "border border-transparent hover:bg-zinc-900"
                      }`}
                      aria-current={isCurrent ? "page" : undefined}
                    >
                      {/* Status icon */}
                      <span className="flex-shrink-0 w-5 text-center">
                        {mod.status === "completed" ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="inline text-emerald-400"
                            aria-label="Completed"
                          >
                            <path
                              d="M3 8.5L6.5 12L13 4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : mod.status === "in-progress" ? (
                          <span
                            className="inline-block w-2 h-2 rounded-full bg-blue-400"
                            aria-label="In progress"
                          />
                        ) : (
                          <span
                            className="inline-block w-2 h-2 rounded-full bg-zinc-700"
                            aria-label="Locked"
                          />
                        )}
                      </span>
                      {/* Module info */}
                      <div className="min-w-0 flex items-center gap-2">
                        <span className="text-zinc-600 font-mono tabular-nums">
                          {String(mod.number).padStart(2, "0")}
                        </span>
                        <span
                          className={`truncate ${
                            isCurrent
                              ? "text-blue-300 font-medium"
                              : mod.status === "completed"
                              ? "text-zinc-400"
                              : "text-zinc-500"
                          }`}
                        >
                          {mod.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
          <span>Interactive Learning Guide</span>
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ModuleOverview({
  sidebarOpen,
  onToggleSidebar,
  onStartLesson,
}: ModuleOverviewProps) {
  const [, setHoveredLesson] = useState<number | null>(null);

  const completedLessons = MODULE_LESSONS.filter(
    (l) => l.status === "completed"
  ).length;
  const totalMinutes = MODULE_LESSONS.reduce(
    (sum, l) => sum + l.estimatedMinutes,
    0
  );
  const remainingMinutes = MODULE_LESSONS.filter(
    (l) => l.status !== "completed"
  ).reduce((sum, l) => sum + l.estimatedMinutes, 0);
  const moduleProgress = Math.round(
    (completedLessons / MODULE_LESSONS.length) * 100
  );
  const courseCompletedModules = COURSE_MODULES.filter(
    (m) => m.status === "completed"
  ).length;
  const courseProgress = Math.round(
    (courseCompletedModules / COURSE_MODULES.length) * 100
  );

  // Find the current/next actionable lesson
  const currentLesson = MODULE_LESSONS.find(
    (l) => l.status === "in-progress" || l.status === "available"
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Navigation Rail -- stays dark (Family A) */}
      <CourseNavRail
        modules={COURSE_MODULES}
        currentModule={14}
        open={sidebarOpen}
        onToggle={onToggleSidebar}
      />

      {/* Main Content -- Linear light theme (Family B) */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ backgroundColor: "#fafbfe" }}
      >
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Top bar with course position */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={onToggleSidebar}
                  className="text-slate-400 hover:text-slate-600 transition-colors mr-1"
                  aria-label="Open navigation"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M3 5h12M3 9h12M3 13h12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
              <span className="text-xs text-slate-400 font-mono">
                Module 14 of 30
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-xs border-blue-200 text-blue-600"
            >
              Developers -- Non-coders: awareness
            </Badge>
          </div>

          {/* Course progress bar */}
          <div className="mb-8">
            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${courseProgress}%` }}
                role="progressbar"
                aria-valuenow={courseCompletedModules}
                aria-valuemax={COURSE_MODULES.length}
                aria-label={`Course progress: ${courseCompletedModules} of ${COURSE_MODULES.length} modules completed`}
              />
            </div>
          </div>

          {/* ============================================================= */}
          {/* MODULE HERO                                                    */}
          {/* ============================================================= */}
          <section className="mb-10">
            {/* Eyebrow */}
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#6b7489" }}
            >
              Module 14
            </p>

            {/* Title */}
            <h1
              className="text-3xl font-bold tracking-tight mb-2"
              style={{
                color: "#1e2330",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              Page Object Model
            </h1>
            <p className="text-base mb-5" style={{ color: "#6b7489" }}>
              Organizing tests for long-term maintainability
            </p>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 4.5v4l2.5 1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                ~{totalMinutes} minutes
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="2"
                    y="6"
                    width="12"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="2"
                    y="10"
                    width="8"
                    height="2"
                    rx="1"
                    fill="currentColor"
                    opacity="0.5"
                  />
                  <rect
                    x="2"
                    y="2"
                    width="12"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                </svg>
                Intermediate
              </span>
              <span className="text-xs text-slate-400">
                6 lessons
              </span>
            </div>

            {/* Module progress */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">
                  Module Progress
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {completedLessons} of {MODULE_LESSONS.length} lessons
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${moduleProgress}%`,
                    backgroundColor: "#10b981",
                  }}
                  role="progressbar"
                  aria-valuenow={completedLessons}
                  aria-valuemax={MODULE_LESSONS.length}
                  aria-label={`Module progress: ${completedLessons} of ${MODULE_LESSONS.length} lessons completed`}
                />
              </div>
            </div>
          </section>

          {/* ============================================================= */}
          {/* PREREQUISITE NOTICE                                            */}
          {/* ============================================================= */}
          <section className="mb-8" role="status">
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-lg border-l-4"
              style={{
                borderLeftColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.04)",
                borderColor: "rgba(16, 185, 129, 0.12)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                className="flex-shrink-0 mt-0.5"
                style={{ color: "#10b981" }}
                aria-hidden="true"
              >
                <path
                  d="M3 8.5L6.5 12L13 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <p className="text-sm font-medium" style={{ color: "#1e2330" }}>
                  Prerequisite complete
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#6b7489" }}>
                  Module 13: HITL Review Checklist is complete. You are ready
                  to begin this module.
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================= */}
          {/* LEARNING OBJECTIVES                                            */}
          {/* ============================================================= */}
          <section className="mb-8">
            <h2
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#6b7489" }}
            >
              What you will learn
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-xs text-slate-500 mb-3">
                After this module, you will be able to:
              </p>
              <ul className="space-y-2.5">
                {[
                  "Explain why Page Object Model improves test maintainability",
                  "Create a Page Object class that encapsulates locators and actions",
                  "Use Copilot to generate Page Object skeletons from page descriptions",
                  "Refactor inline tests into the POM pattern",
                ].map((objective, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5"
                      style={{
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        color: "#3b82f6",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-sm leading-relaxed"
                      style={{ color: "#1e2330" }}
                    >
                      {objective}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ============================================================= */}
          {/* LESSON LIST                                                     */}
          {/* ============================================================= */}
          <section className="mb-10">
            <h2
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: "#6b7489" }}
            >
              Lessons
            </h2>
            <div className="space-y-3">
              {MODULE_LESSONS.map((lesson) => (
                <LessonCard
                  key={lesson.number}
                  lesson={lesson}
                  onStart={() => onStartLesson(lesson.number)}
                />
              ))}
            </div>
          </section>

          {/* ============================================================= */}
          {/* WHAT YOU WILL BUILD -- PREVIEW                                  */}
          {/* ============================================================= */}
          <section className="mb-10">
            <h2
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: "#6b7489" }}
            >
              What you will build
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{ color: "#ec4899" }}
                  aria-hidden="true"
                >
                  <rect
                    x="1"
                    y="2"
                    width="14"
                    height="12"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M1 6h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="text-xs font-semibold text-slate-600">
                  Before & After: Inline Test vs. Page Object Model
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                {/* Before */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-red-300" />
                    <span className="text-xs font-medium text-red-600">
                      Before -- Inline selectors
                    </span>
                  </div>
                  <pre
                    className="text-xs leading-relaxed p-3 rounded-lg overflow-x-auto"
                    style={{
                      backgroundColor: "#f4f6fb",
                      color: "#1e2330",
                      fontFamily:
                        "'Fira Code', 'JetBrains Mono', monospace",
                    }}
                  >
                    <code>{`test('submit contact', async ({ page }) => {
  await page.goto('/contact');
  await page.locator('[data-testid="name"]')
    .fill('Jane');
  await page.locator('[data-testid="email"]')
    .fill('jane@test.com');
  await page.locator('[data-testid="submit"]')
    .click();
  await expect(
    page.locator('[data-testid="success"]')
  ).toBeVisible();
});`}</code>
                  </pre>
                </div>
                {/* After */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-medium text-emerald-600">
                      After -- Page Object Model
                    </span>
                  </div>
                  <pre
                    className="text-xs leading-relaxed p-3 rounded-lg overflow-x-auto"
                    style={{
                      backgroundColor: "#f4f6fb",
                      color: "#1e2330",
                      fontFamily:
                        "'Fira Code', 'JetBrains Mono', monospace",
                    }}
                  >
                    <code>{`test('submit contact', async ({ page }) => {
  const contact = new ContactPage(page);
  await contact.goto();
  await contact.fillForm(
    'Jane', 'jane@test.com'
  );
  await contact.submit();
  await expect(
    contact.successMessage
  ).toBeVisible();
});`}</code>
                  </pre>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                <p className="text-xs text-slate-500">
                  By the end of this module, you will refactor inline tests
                  like the left example into clean, reusable Page Objects like
                  the right.
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================= */}
          {/* PROGRESS SNAPSHOT                                               */}
          {/* ============================================================= */}
          <section className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Course progress */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-2xl font-bold" style={{ color: "#1e2330" }}>
                  {courseCompletedModules}
                  <span className="text-sm font-normal text-slate-400">
                    {" "}
                    / {COURSE_MODULES.length}
                  </span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Modules completed
                </p>
                <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${courseProgress}%` }}
                  />
                </div>
              </div>
              {/* Module progress */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-2xl font-bold" style={{ color: "#1e2330" }}>
                  {completedLessons}
                  <span className="text-sm font-normal text-slate-400">
                    {" "}
                    / {MODULE_LESSONS.length}
                  </span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Lessons in this module
                </p>
                <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${moduleProgress}%` }}
                  />
                </div>
              </div>
              {/* Time remaining */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-2xl font-bold" style={{ color: "#1e2330" }}>
                  {remainingMinutes}
                  <span className="text-sm font-normal text-slate-400">
                    {" "}
                    min
                  </span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Estimated remaining
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================= */}
          {/* CTA -- CONTINUE / START                                        */}
          {/* ============================================================= */}
          <section className="mb-12">
            <div className="flex items-center justify-center gap-4">
              {currentLesson && (
                <button
                  onClick={() => onStartLesson(currentLesson.number)}
                  className="px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all duration-150 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                  style={{ backgroundColor: "#3b82f6" }}
                >
                  {currentLesson.status === "in-progress"
                    ? `Continue: Lesson ${currentLesson.number} -- ${currentLesson.title}`
                    : `Start Lesson ${currentLesson.number}: ${currentLesson.title}`}
                </button>
              )}
            </div>
          </section>

          {/* Bottom spacer */}
          <div className="h-12" />
        </div>
      </main>
    </div>
  );
}

export default ModuleOverview;
