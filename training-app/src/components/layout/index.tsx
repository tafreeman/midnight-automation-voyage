import {
  BookOpen,
  Clock3,
  FileText,
  GraduationCap,
  Lightbulb,
  NotebookPen,
  Target,
} from "lucide-react";
import type { ReactNode } from "react";

import { useProgress } from "../../contexts/ProgressContext";
import type { Lesson, Module } from "../../types/curriculum";

interface ModuleHeroProps {
  module: Module;
}

export function ModuleHero({ module }: ModuleHeroProps) {
  return (
    <section
      className="rounded-2xl border p-6 md:p-8"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--surface-elevated) 94%, transparent), var(--surface-elevated))",
        borderColor: "var(--border-subtle)",
        boxShadow: "var(--shadow-elevation)",
      }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              borderColor: "var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            <span style={{ color: "var(--accent-info)" }}>
              Module {String(module.number).padStart(2, "0")}
            </span>
            <span aria-hidden="true">•</span>
            <span>{module.difficulty}</span>
          </div>
          <div>
            <h1
              className="text-2xl font-semibold tracking-tight md:text-3xl"
              style={{ color: "var(--text-primary)" }}
            >
              {module.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-secondary)" }}>
              {module.subtitle}
            </p>
          </div>
        </div>

        <div className="grid gap-2 text-xs md:min-w-56">
          <StatPill icon={<Clock3 size={14} />} label="Est. time" value={`${module.estimatedMinutes} min`} />
          <StatPill icon={<BookOpen size={14} />} label="Lessons" value={`${module.lessons.length}`} />
          <StatPill icon={<GraduationCap size={14} />} label="Theme" value={module.theme} />
        </div>
      </div>

      {module.learningObjectives.length > 0 && (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {module.learningObjectives.slice(0, 4).map((objective) => (
            <div
              key={objective}
              className="flex items-start gap-3 rounded-xl border px-4 py-3"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "color-mix(in srgb, var(--surface-primary) 84%, transparent)",
              }}
            >
              <Target size={14} style={{ color: "var(--accent-action)", marginTop: 2 }} />
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {objective}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

interface LessonHeroProps {
  module: Module;
  lesson: Lesson;
  lessonIndex: number;
  totalLessons: number;
  isCompleted: boolean;
}

export function LessonHero({
  module,
  lesson,
  lessonIndex,
  totalLessons,
  isCompleted,
}: LessonHeroProps) {
  return (
    <section
      className="rounded-2xl border p-6 md:p-8"
      style={{
        backgroundColor: "var(--surface-elevated)",
        borderColor: "var(--border-subtle)",
        boxShadow: "var(--shadow-elevation)",
      }}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
        <span className="rounded-full border px-2.5 py-1" style={{ borderColor: "var(--border-subtle)" }}>
          {String(lessonIndex + 1).padStart(2, "0")} of {String(totalLessons).padStart(2, "0")}
        </span>
        <span className="rounded-full border px-2.5 py-1" style={{ borderColor: "var(--border-subtle)" }}>
          Module {String(module.number).padStart(2, "0")}
        </span>
        <span className="rounded-full border px-2.5 py-1" style={{ borderColor: "var(--border-subtle)" }}>
          {lesson.audience ?? "all"}
        </span>
        {isCompleted && (
          <span className="rounded-full border px-2.5 py-1" style={{ borderColor: "var(--accent-action)", color: "var(--accent-action)" }}>
            Completed
          </span>
        )}
      </div>

      <h2 className="mt-4 text-2xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {lesson.title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-secondary)" }}>
        {lesson.subtitle}
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <MetaCard icon={<NotebookPen size={16} />} label="Practice focus" value="Notebook-style lesson flow" />
        <MetaCard icon={<FileText size={16} />} label="Sections" value={`${lesson.sections.length} blocks`} />
        <MetaCard icon={<Lightbulb size={16} />} label="Effort" value={`${lesson.estimatedMinutes} min`} />
      </div>
    </section>
  );
}

interface SupportRailProps {
  module: Module;
  lesson: Lesson;
}

export function SupportRail({ module, lesson }: SupportRailProps) {
  const { getNote, saveNote, getModuleCompletion, completedLessonCount } = useProgress();
  const note = getNote(module.id, lesson.id);

  return (
    <aside className="h-full overflow-y-auto p-4 md:p-5">
      <div className="space-y-4">
        <section
          className="rounded-2xl border p-4"
          style={{
            backgroundColor: "var(--surface-primary)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            Lesson Notes
          </h3>
          <textarea
            value={note}
            onChange={(event) => saveNote(module.id, lesson.id, event.target.value)}
            placeholder="Capture observations, risks, or follow-up actions..."
            className="mt-3 h-36 w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none"
            style={{
              backgroundColor: "var(--surface-elevated)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          />
        </section>

        <section
          className="rounded-2xl border p-4"
          style={{
            backgroundColor: "var(--surface-primary)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            Session Context
          </h3>
          <div className="mt-3 space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <p>
              <span style={{ color: "var(--text-primary)" }}>Module:</span> {module.title}
            </p>
            <p>
              <span style={{ color: "var(--text-primary)" }}>Lesson:</span> {lesson.title}
            </p>
            <p>
              <span style={{ color: "var(--text-primary)" }}>Module progress:</span> {getModuleCompletion(module.id, module.lessons.length)}%
            </p>
            <p>
              <span style={{ color: "var(--text-primary)" }}>Lessons completed:</span> {completedLessonCount}
            </p>
          </div>
        </section>

        {lesson.practiceLink && (
          <section
            className="rounded-2xl border p-4"
            style={{
              backgroundColor: "var(--surface-primary)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
              Practice Link
            </h3>
            <a
              href={lesson.practiceLink.url}
              className="mt-3 block rounded-xl border px-3 py-3 text-sm transition-colors hover:opacity-90"
              style={{
                borderColor: "var(--border-subtle)",
                color: "var(--accent-info)",
              }}
            >
              <span className="block font-medium" style={{ color: "var(--text-primary)" }}>
                {lesson.practiceLink.label}
              </span>
              <span className="block mt-1 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {lesson.practiceLink.description}
              </span>
            </a>
          </section>
        )}
      </div>
    </aside>
  );
}

function StatPill({
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
      className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
      style={{
        backgroundColor: "color-mix(in srgb, var(--surface-primary) 86%, transparent)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="flex items-center gap-2">
        <span style={{ color: "var(--accent-info)" }}>{icon}</span>
        <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
          {label}
        </span>
      </div>
      <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

function MetaCard({
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
      className="flex items-center gap-3 rounded-xl border px-4 py-3"
      style={{
        backgroundColor: "color-mix(in srgb, var(--surface-primary) 84%, transparent)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <span style={{ color: "var(--accent-action)" }}>{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
