import type { ReactNode } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Play,
} from "lucide-react";

import { useProgress } from "../contexts/ProgressContext";
import type { Module } from "../types/curriculum";

interface ProgressDashboardProps {
  modules: Module[];
  onSelectModule: (moduleId: string) => void;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
}

export function ProgressDashboardPage({
  modules,
  onSelectModule,
  onSelectLesson,
}: ProgressDashboardProps) {
  const {
    progress,
    getCourseCompletion,
    getModuleCompletion,
    completedLessonCount,
    isLessonCompleted,
  } = useProgress();

  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const courseCompletion = getCourseCompletion(totalLessons);

  const currentModule =
    modules.find((module) => module.id === progress.currentModuleId) ??
    modules[0];
  const currentLesson =
    currentModule?.lessons.find(
      (lesson) => lesson.id === progress.currentLessonId
    ) ?? currentModule?.lessons[0];
  const resume =
    currentModule && currentLesson ? { currentModule, currentLesson } : null;

  let nextLesson: { module: Module; lesson: Module["lessons"][number] } | null =
    null;
  for (const module of modules) {
    for (const lesson of module.lessons) {
      if (!isLessonCompleted(module.id, lesson.id)) {
        nextLesson = { module, lesson };
        break;
      }
    }
    if (nextLesson) break;
  }

  return (
    <div className="dashboard-page space-y-8">
      <section
        className="page-hero dashboard-hero overflow-hidden rounded-2xl border"
        style={{
          borderColor: "var(--border-subtle)",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--surface-elevated) 94%, transparent), color-mix(in srgb, var(--surface-hover) 90%, transparent))",
          boxShadow: "var(--shadow-elevation)",
        }}
      >
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.28em]" style={{ color: "var(--text-muted)" }}>
            <span>Course Overview</span>
            <span>•</span>
            <span>{modules.length} modules</span>
            <span>•</span>
            <span>{totalLessons} lessons</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
            Progress Dashboard
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
            Track your learning journey, resume where you left off, and open the next lesson with one click.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <StatCard label="Course Completion" value={`${courseCompletion}%`} icon={<Award size={18} />} accent="var(--accent-action)" />
            <StatCard label="Lessons Completed" value={`${completedLessonCount} / ${totalLessons}`} icon={<CheckCircle2 size={18} />} accent="var(--accent-info)" />
            <StatCard label="Modules Complete" value={`${modules.filter((module) => getModuleCompletion(module.id, module.lessons.length) === 100).length} / ${modules.length}`} icon={<BookOpen size={18} />} accent="var(--accent-special)" />
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full" style={{ backgroundColor: "var(--border-subtle)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${courseCompletion}%`,
                background:
                  "linear-gradient(90deg, var(--accent-info), var(--accent-action))",
              }}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {resume ? (
          <ActionCard
            label="Resume Learning"
            title={resume.currentLesson.title}
            description={`${resume.currentModule.title} • ${resume.currentLesson.estimatedMinutes} min`}
            buttonLabel="Open lesson"
            onClick={() => onSelectLesson(resume.currentModule.id, resume.currentLesson.id)}
            icon={<Play size={18} />}
          />
        ) : null}

        {nextLesson ? (
          <ActionCard
            label="Next Up"
            title={nextLesson.lesson.title}
            description={`${nextLesson.module.title} • ${nextLesson.lesson.sections.length} sections`}
            buttonLabel="Continue"
            onClick={() => onSelectLesson(nextLesson.module.id, nextLesson.lesson.id)}
            icon={<ArrowRight size={18} />}
          />
        ) : null}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
            All Modules
          </h2>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {new Date(progress.lastAccessedAt).toLocaleString()}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {modules.map((module) => {
            const completion = getModuleCompletion(module.id, module.lessons.length);
            const moduleComplete = completion === 100;
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => onSelectModule(module.id)}
                className="rounded-2xl border p-4 text-left transition-colors"
                style={{
                  borderColor: moduleComplete ? "var(--accent-action)" : "var(--border-subtle)",
                  backgroundColor: "var(--surface-elevated)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em]" style={{ color: "var(--text-muted)" }}>
                      Module {String(module.number).padStart(2, "0")}
                    </div>
                    <h3 className="mt-2 text-lg font-medium" style={{ color: "var(--text-primary)" }}>
                      {module.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                      {module.subtitle}
                    </p>
                  </div>
                  {moduleComplete ? (
                    <CheckCircle2 size={18} style={{ color: "var(--accent-action)" }} />
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>{module.lessons.length} lessons</span>
                  <span>•</span>
                  <span>{module.estimatedMinutes} min</span>
                  <span>•</span>
                  <span>{completion}%</span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "var(--border-subtle)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${completion}%`,
                      background:
                        "linear-gradient(90deg, var(--accent-info), var(--accent-action))",
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  accent: string;
}) {
  return (
    <div
      className="page-card stat-card rounded-2xl border p-4"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--surface-code)",
      }}
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
        <span>{label}</span>
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
        {value}
      </div>
    </div>
  );
}

function ActionCard({
  label,
  title,
  description,
  buttonLabel,
  onClick,
  icon,
}: {
  label: string;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <section
      className="page-card action-card rounded-2xl border p-5 md:p-6"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--surface-elevated)",
      }}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
        {icon}
        {label}
      </div>
      <h3 className="mt-3 text-xl font-medium" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
      <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
        {description}
      </p>
      <button
        type="button"
        onClick={onClick}
        className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        style={{
          backgroundColor: "var(--accent-action)",
          color: "var(--surface-primary)",
        }}
      >
        {buttonLabel}
      </button>
    </section>
  );
}
