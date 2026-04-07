import { useEffect, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";

import { useProgress } from "../contexts/ProgressContext";
import { useTheme } from "../contexts/ThemeContext";
import type { Lesson, Module } from "../types/curriculum";

interface ModuleOverviewPageProps {
  module: Module;
  onSelectLesson: (lessonId: string) => void;
}

export function ModuleOverviewPage({
  module,
  onSelectLesson,
}: ModuleOverviewPageProps) {
  const { isLessonCompleted, getModuleCompletion } = useProgress();
  const { applyModuleTheme } = useTheme();
  const completion = getModuleCompletion(module.id, module.lessons.length);

  useEffect(() => {
    applyModuleTheme(module.number);
  }, [applyModuleTheme, module.number]);

  return (
    <div className="module-overview-page space-y-10">
      <section
        className="page-hero module-hero overflow-hidden rounded-2xl border"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--surface-elevated) 94%, transparent), color-mix(in srgb, var(--surface-hover) 90%, transparent))",
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-elevation)",
        }}
      >
        <div className="p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.28em]" style={{ color: "var(--text-muted)" }}>
            <span>Module {String(module.number).padStart(2, "0")}</span>
            <span>•</span>
            <span>{module.difficulty}</span>
            <span>•</span>
            <span>{module.estimatedMinutes} min</span>
          </div>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                {module.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                {module.subtitle}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border px-4 py-3" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
              <Sparkles size={14} style={{ color: "var(--accent-action)" }} />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {completion}% complete
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <HeroStat icon={<BookOpen size={18} />} label="Lessons" value={String(module.lessons.length)} />
            <HeroStat icon={<Clock3 size={18} />} label="Estimated" value={`${module.estimatedMinutes} min`} />
          </div>

          <div className="mt-8 h-2 overflow-hidden rounded-full" style={{ backgroundColor: "var(--border-subtle)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${completion}%`,
                background:
                  "linear-gradient(90deg, var(--accent-info), var(--accent-action))",
              }}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
          <Sparkles size={14} />
          Learning Objectives
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {module.learningObjectives.map((objective) => (
            <div
              key={objective}
              className="rounded-xl border p-5 text-sm leading-8"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--surface-elevated)",
                color: "var(--text-secondary)",
              }}
            >
              {objective}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
            Lessons
          </h2>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {module.lessons.length} total
          </span>
        </div>

        <div className="space-y-4">
          {module.lessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              lessonIndex={index}
              completed={isLessonCompleted(module.id, lesson.id)}
              onOpen={() => onSelectLesson(lesson.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function LessonCard({
  lesson,
  lessonIndex,
  completed,
  onOpen,
}: {
  lesson: Lesson;
  lessonIndex: number;
  completed: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="page-card lesson-card w-full rounded-2xl border p-5 text-left transition-colors"
      style={{
        borderColor: completed ? "var(--accent-action)" : "var(--border-subtle)",
        backgroundColor: "var(--surface-elevated)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--surface-code)",
            color: "var(--text-secondary)",
          }}
        >
          {completed ? <CheckCircle2 size={18} style={{ color: "var(--accent-action)" }} /> : lessonIndex + 1}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {lesson.title}
          </h3>
          <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
            {lesson.subtitle}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>{lesson.estimatedMinutes} min</span>
            <span>•</span>
            <span>{lesson.sections.length} sections</span>
            {lesson.quiz ? (
              <>
                <span>•</span>
                <span>quiz</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "var(--accent-info)" }}>
          Open
          <ArrowRight size={14} />
        </div>
      </div>
    </button>
  );
}

function HeroStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="page-card hero-stat rounded-xl border p-5"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--surface-code)",
      }}
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
        <span>{label}</span>
        <span style={{ color: "var(--accent-info)" }}>{icon}</span>
      </div>
      <div className="mt-2 text-lg font-medium" style={{ color: "var(--text-primary)" }}>
        {value}
      </div>
    </div>
  );
}
