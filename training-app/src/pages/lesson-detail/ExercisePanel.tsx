import {
  useMemo,
  useState,
} from "react";
import {
  BookOpen,
  Copy,
  Play,
  TerminalSquare,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { CodeExercise, ExerciseLab, Lesson } from "../../types/curriculum";
import { useNarration } from "./useNarration";

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

/* ─────────────────────────────────────────────────
   Exercises
   ───────────────────────────────────────────────── */

export function ExercisesOrSingle({ lesson }: { lesson: Lesson }) {
  if (lesson.exercises && lesson.exercises.length > 1) {
    return <ExercisesPanel exercises={lesson.exercises} />;
  }
  if (lesson.exercise) {
    return <ExercisePanel exercise={lesson.exercise} />;
  }
  return null;
}

type DifficultyFilter = "all" | "beginner" | "intermediate" | "advanced";

const DIFFICULTY_ACCENT: Record<Exclude<DifficultyFilter, "all">, string> = {
  beginner: "var(--accent-action)",
  intermediate: "var(--accent-info)",
  advanced: "var(--diff-removed-text)",
};

function ExercisesPanel({ exercises }: { exercises: CodeExercise[] }) {
  const [filter, setFilter] = useState<DifficultyFilter>("all");
  const filters: DifficultyFilter[] = ["all", "beginner", "intermediate", "advanced"];

  const filtered = useMemo(
    () => filter === "all" ? exercises : exercises.filter((e) => e.difficulty === filter),
    [exercises, filter],
  );

  return (
    <section
      className="lesson-panel rounded-2xl border p-5 md:p-6"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}
    >
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
        <Play size={14} />
        Hands-On Exercises ({exercises.length})
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = filter === f;
          const accent = f === "all" ? "var(--text-secondary)" : DIFFICULTY_ACCENT[f];
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                borderColor: active ? accent : "var(--border-subtle)",
                backgroundColor: active ? `color-mix(in srgb, ${accent} 12%, transparent)` : "transparent",
                color: active ? accent : "var(--text-muted)",
              }}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="py-4 text-sm italic" style={{ color: "var(--text-muted)" }}>
          No exercises match this difficulty level.
        </p>
      ) : (
        <div className="space-y-6">
          {filtered.map((exercise) => (
            <ExerciseCard key={exercise.title} exercise={exercise} />
          ))}
        </div>
      )}
    </section>
  );
}

function ExercisePanel({ exercise }: { exercise: CodeExercise }) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <section className="lesson-panel lesson-panel-exercise rounded-2xl border p-5 md:p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
        <Play size={14} />
        Hands-On Exercise
      </div>
      <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        {exercise.title}
      </h2>
      <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
        {exercise.description}
      </p>

      {exercise.narration && <NarrationControls narration={exercise.narration} />}

      <div className="lesson-code-surface mt-4 rounded-xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
        <div className="flex items-center justify-between border-b px-4 py-2 text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
          <span>{showSolution ? "Solution" : "Starter"}</span>
          <button
            type="button"
            onClick={() => setShowSolution((current) => !current)}
            className="text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--accent-info)" }}
          >
            {showSolution ? "Hide solution" : "Reveal solution"}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-[13px] leading-8" style={{ color: "var(--text-primary)" }}>
          <code>{showSolution ? exercise.solutionCode : exercise.starterCode}</code>
        </pre>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {exercise.hints.map((hint) => (
          <div key={hint} className="lesson-hint-surface rounded-lg border px-3 py-2 text-sm leading-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)", color: "var(--text-secondary)" }}>
            {hint}
          </div>
        ))}
      </div>

      {exercise.lab ? <ExerciseLabCard lab={exercise.lab} /> : null}
    </section>
  );
}

function NarrationControls({ narration, audioFile }: { narration: string; audioFile?: string }) {
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const { playing, toggle, hasAudio, speed, setSpeed } = useNarration(narration, audioFile);

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setShowWalkthrough(!showWalkthrough)}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: "var(--accent-info)" }}
        >
          <BookOpen size={13} />
          <span>{showWalkthrough ? "Hide Walkthrough" : "Walkthrough Guide"}</span>
        </button>
        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-all"
          style={{
            borderColor: playing ? "var(--accent-action)" : "var(--border-subtle)",
            backgroundColor: playing ? "color-mix(in srgb, var(--accent-action) 12%, transparent)" : "transparent",
            color: playing ? "var(--accent-action)" : "var(--text-muted)",
          }}
          title={playing ? "Stop narration" : "Listen to walkthrough"}
        >
          {playing ? <VolumeX size={13} /> : <Volume2 size={13} />}
          <span>{playing ? "Stop" : "Listen"}</span>
          {hasAudio && <span className="text-[9px] opacity-50">HD</span>}
        </button>
        <div className="flex items-center gap-0.5 rounded-md border px-1 py-0.5" style={{ borderColor: "var(--border-subtle)" }}>
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className="rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors"
              style={{
                backgroundColor: speed === s ? "color-mix(in srgb, var(--accent-info) 15%, transparent)" : "transparent",
                color: speed === s ? "var(--accent-info)" : "var(--text-muted)",
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
      {showWalkthrough && (
        <div
          className="rounded-lg border p-3 text-[12.5px] leading-7 whitespace-pre-line"
          style={{
            borderColor: "color-mix(in srgb, var(--accent-info) 20%, transparent)",
            backgroundColor: "color-mix(in srgb, var(--accent-info) 5%, transparent)",
            color: "var(--text-secondary)",
          }}
        >
          {narration}
        </div>
      )}
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: CodeExercise }) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {exercise.title}
        </h3>
        {exercise.difficulty && (
          <span
            className="rounded-md border px-2 py-0.5 text-[11px] font-medium"
            style={{
              color: DIFFICULTY_ACCENT[exercise.difficulty],
              borderColor: `color-mix(in srgb, ${DIFFICULTY_ACCENT[exercise.difficulty]} 30%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${DIFFICULTY_ACCENT[exercise.difficulty]} 8%, transparent)`,
            }}
          >
            {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm leading-8" style={{ color: "var(--text-secondary)" }}>
        {exercise.description}
      </p>

      {exercise.narration && <NarrationControls narration={exercise.narration} />}

      <div className="mt-3 overflow-hidden rounded-lg border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-primary)" }}>
        <div className="flex items-center justify-between border-b px-4 py-2 text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
          <span>{showSolution ? "Solution" : "Starter"}</span>
          <button
            type="button"
            onClick={() => setShowSolution((c) => !c)}
            className="text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--accent-info)" }}
          >
            {showSolution ? "Hide solution" : "Reveal solution"}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-[13px] leading-8" style={{ color: "var(--text-primary)" }}>
          <code>{showSolution ? exercise.solutionCode : exercise.starterCode}</code>
        </pre>
      </div>

      {exercise.hints.length > 0 && (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {exercise.hints.map((hint) => (
            <div
              key={hint}
              className="rounded-lg border px-3 py-2 text-[12px] leading-6"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)", color: "var(--text-secondary)" }}
            >
              {hint}
            </div>
          ))}
        </div>
      )}

      {exercise.lab ? <ExerciseLabCard lab={exercise.lab} /> : null}
    </div>
  );
}

function ExerciseLabCard({ lab }: { lab: ExerciseLab }) {
  const [copiedField, setCopiedField] = useState<"file" | "command" | null>(null);

  async function copy(value: string, field: "file" | "command") {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    window.setTimeout(() => setCopiedField(null), 1500);
  }

  return (
    <section
      className="mt-4 rounded-xl border p-4"
      style={{
        borderColor: "color-mix(in srgb, var(--accent-info) 24%, transparent)",
        backgroundColor: "color-mix(in srgb, var(--accent-info) 5%, var(--surface-elevated))",
      }}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--accent-info)" }}>
        <TerminalSquare size={14} />
        Try It In VS Code
      </div>

      <div className="mt-4 space-y-3">
        <LabField label="Workspace" value={lab.workspaceRoot} />
        <LabField
          label="Target File"
          value={lab.targetFile}
          actionLabel={copiedField === "file" ? "Copied" : "Copy"}
          onAction={() => copy(lab.targetFile, "file")}
        />
        <LabField
          label="Run Command"
          value={lab.runCommand}
          actionLabel={copiedField === "command" ? "Copied" : "Copy"}
          onAction={() => copy(lab.runCommand, "command")}
        />
      </div>

      <div className="mt-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
          Success Looks Like
        </div>
        <div className="mt-2 space-y-2">
          {lab.successCriteria.map((criterion) => (
            <div
              key={criterion}
              className="rounded-lg border px-3 py-2 text-[12px] leading-6"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--surface-primary)",
                color: "var(--text-secondary)",
              }}
            >
              {criterion}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LabField({
  label,
  value,
  actionLabel,
  onAction,
}: {
  label: string;
  value: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-lg border px-3 py-3" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-primary)" }}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
          {label}
        </div>
        {onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--accent-info)" }}
          >
            <Copy size={12} />
            {actionLabel}
          </button>
        ) : null}
      </div>
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[12px] leading-6" style={{ color: "var(--text-primary)" }}>
        <code>{value}</code>
      </pre>
    </div>
  );
}
