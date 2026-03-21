import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Copy,
  ExternalLink,
  Lightbulb,
  Play,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { useProgress } from "../contexts/ProgressContext";
import { useTheme } from "../contexts/ThemeContext";
import type {
  CodeExercise,
  Lesson,
  Module,
  PromptTemplate,
  Section,
  Quiz,
} from "../types/curriculum";

interface LessonDetailPageProps {
  module: Module;
  lesson: Lesson;
  lessonIndex: number;
  onQuizAttempt: () => void;
}

export function LessonDetailPage({
  module,
  lesson,
  lessonIndex,
  onQuizAttempt,
}: LessonDetailPageProps) {
  const { isLessonCompleted, saveScrollPosition, getScrollPosition } =
    useProgress();
  const { applyModuleTheme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const completed = isLessonCompleted(module.id, lesson.id);

  useEffect(() => {
    applyModuleTheme(module.number);
  }, [applyModuleTheme, module.number]);

  useEffect(() => {
    const saved = getScrollPosition(lesson.id);
    if (saved > 0 && scrollRef.current) {
      scrollRef.current.scrollTop = saved;
    }
  }, [getScrollPosition, lesson.id]);

  return (
    <div
      ref={scrollRef}
      onScroll={() => {
        if (scrollRef.current) {
          saveScrollPosition(lesson.id, scrollRef.current.scrollTop);
        }
      }}
      className="space-y-8"
    >
      <LessonHero
        module={module}
        lesson={lesson}
        lessonIndex={lessonIndex}
        completed={completed}
      />

      <div className="space-y-6">
        {lesson.sections.map((section, index) => (
          <SectionBlock key={`${section.type}-${index}`} section={section} />
        ))}
      </div>

      {lesson.quiz && (
        <QuizPanel quiz={lesson.quiz} onAttempt={onQuizAttempt} />
      )}

      {lesson.exercise && <ExercisePanel exercise={lesson.exercise} />}

      {lesson.promptTemplates?.length ? (
        <PromptTemplatesPanel templates={lesson.promptTemplates} />
      ) : null}

      {lesson.practiceLink ? (
        <PracticeLinkCard
          url={lesson.practiceLink.url}
          label={lesson.practiceLink.label}
          description={lesson.practiceLink.description}
        />
      ) : null}

      <div style={{ height: "var(--space-2xl)" }} />
    </div>
  );
}

function LessonHero({
  module,
  lesson,
  lessonIndex,
  completed,
}: {
  module: Module;
  lesson: Lesson;
  lessonIndex: number;
  completed: boolean;
}) {
  return (
    <section
      className="overflow-hidden rounded-2xl border"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--surface-elevated) 92%, transparent), color-mix(in srgb, var(--surface-hover) 88%, transparent))",
        borderColor: "var(--border-subtle)",
        boxShadow: "var(--shadow-elevation)",
      }}
    >
      <div className="flex flex-col gap-5 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>Module {String(module.number).padStart(2, "0")}</span>
          <span>•</span>
          <span>
            Lesson {String(lessonIndex + 1).padStart(2, "0")} of {String(module.lessons.length).padStart(2, "0")}
          </span>
          <span>•</span>
          <span>{lesson.estimatedMinutes} min</span>
          {completed && (
            <>
              <span>•</span>
              <span style={{ color: "var(--accent-action)" }}>Completed</span>
            </>
          )}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.28em]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>
              <BookOpen size={12} />
              <span>{lesson.audience ?? "all"}</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
              {lesson.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
              {lesson.subtitle}
            </p>
          </div>
          <div className="hidden shrink-0 rounded-2xl border px-4 py-3 md:block" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
            <div className="text-[11px] uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
              Current Theme
            </div>
            <div className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {module.theme}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <HeroChip icon={<Sparkles size={14} />} label={`${lesson.sections.length} sections`} />
          <HeroChip icon={<ChevronRight size={14} />} label={lesson.quiz ? "Quiz included" : "No quiz"} />
          <HeroChip icon={<Play size={14} />} label={lesson.exercise ? "Practice exercise" : "No exercise"} />
        </div>
      </div>
    </section>
  );
}

function SectionBlock({ section }: { section: Section }) {
  if (section.type === "text") {
    return (
      <article className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wide" style={{ color: "var(--text-primary)" }}>
          {section.heading}
        </h2>
        <p className="max-w-3xl text-[13px] leading-7" style={{ color: "var(--text-secondary)" }}>
          {section.content}
        </p>
      </article>
    );
  }

  if (section.type === "callout") {
    const tone =
      section.variant === "warning"
        ? "var(--diff-removed-bg)"
        : section.variant === "tip"
        ? "var(--diff-added-bg)"
        : "color-mix(in srgb, var(--accent-info) 10%, transparent)";
    const accent =
      section.variant === "warning"
        ? "var(--diff-removed-text)"
        : section.variant === "tip"
        ? "var(--accent-action)"
        : "var(--accent-info)";
    return (
      <aside
        className="rounded-xl border p-4"
        style={{ backgroundColor: tone, borderColor: "var(--border-subtle)" }}
      >
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: accent }}>
          {section.variant === "warning" ? <ShieldAlert size={14} /> : <Lightbulb size={14} />}
          {section.variant}
        </div>
        {section.heading ? (
          <div className="mb-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {section.heading}
          </div>
        ) : null}
        <p className="text-[13px] leading-7" style={{ color: "var(--text-secondary)" }}>
          {section.content}
        </p>
      </aside>
    );
  }

  if (section.type === "table") {
    return (
      <section className="space-y-3">
        {section.heading ? (
          <h2 className="text-sm font-semibold tracking-wide" style={{ color: "var(--text-primary)" }}>
            {section.heading}
          </h2>
        ) : null}
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-subtle)" }}>
          <table className="w-full text-left text-[13px]">
            <thead style={{ backgroundColor: "var(--surface-elevated)" }}>
              <tr>
                {section.headers.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "var(--surface-code)" }}>
              {section.rows.map((row, rowIndex) => (
                <tr key={`${rowIndex}-${row.join("-")}`} className="border-t" style={{ borderColor: "var(--border-subtle)" }}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 leading-6" style={{ color: "var(--text-secondary)" }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return <CodeBlock section={section} />;
}

function CodeBlock({ section }: { section: Extract<Section, { type: "code" }> }) {
  const [copied, setCopied] = useState(false);

  return (
    <section className="space-y-3">
      {section.heading ? (
        <h2 className="text-sm font-semibold tracking-wide" style={{ color: "var(--text-primary)" }}>
          {section.heading}
        </h2>
      ) : null}
      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
        <div className="flex items-center justify-between border-b px-4 py-2 text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
          <span>{section.language}</span>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(section.code);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            }}
            className="inline-flex items-center gap-1"
            style={{ color: "var(--accent-info)" }}
          >
            <Copy size={12} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-[12px] leading-7" style={{ color: "var(--text-primary)" }}>
          <code>{section.code}</code>
        </pre>
      </div>
    </section>
  );
}

function QuizPanel({ quiz, onAttempt }: { quiz: Quiz; onAttempt: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = selected === quiz.correctIndex;

  return (
    <section className="rounded-2xl border p-5 md:p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
        <CheckCircle2 size={14} />
        Knowledge Check
      </div>
      <p className="text-sm leading-7" style={{ color: "var(--text-primary)" }}>
        {quiz.question}
      </p>
      <div className="mt-4 space-y-2">
        {quiz.options.map((option, index) => {
          const active = selected === index;
          const correct = submitted && index === quiz.correctIndex;
          const wrong = submitted && active && !isCorrect;
          return (
            <button
              key={option}
              type="button"
              onClick={() => !submitted && setSelected(index)}
              className="w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors"
              style={{
                borderColor: correct
                  ? "var(--accent-action)"
                  : wrong
                  ? "var(--diff-removed-text)"
                  : active
                  ? "var(--accent-info)"
                  : "var(--border-subtle)",
                backgroundColor: correct
                  ? "var(--diff-added-bg)"
                  : wrong
                  ? "var(--diff-removed-bg)"
                  : active
                  ? "color-mix(in srgb, var(--accent-info) 8%, transparent)"
                  : "transparent",
                color: correct || active ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              <span className="mr-2 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {!submitted ? (
        <button
          type="button"
          disabled={selected === null}
          onClick={() => {
            if (selected === null) return;
            setSubmitted(true);
            onAttempt();
          }}
          className="mt-4 rounded-lg px-4 py-2 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "var(--accent-action)", color: "#081012" }}
        >
          Check Answer
        </button>
      ) : (
        <div className="mt-4 rounded-xl border p-4" style={{ borderColor: isCorrect ? "var(--accent-action)" : "var(--diff-removed-text)", backgroundColor: isCorrect ? "var(--diff-added-bg)" : "var(--diff-removed-bg)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {isCorrect ? "Correct" : "Not quite"}
          </p>
          <p className="mt-1 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
            {quiz.explanation}
          </p>
        </div>
      )}
    </section>
  );
}

function ExercisePanel({ exercise }: { exercise: CodeExercise }) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <section className="rounded-2xl border p-5 md:p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
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

      <div className="mt-4 rounded-xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
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
        <pre className="overflow-x-auto p-4 text-[12px] leading-7" style={{ color: "var(--text-primary)" }}>
          <code>{showSolution ? exercise.solutionCode : exercise.starterCode}</code>
        </pre>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {exercise.hints.map((hint) => (
          <div key={hint} className="rounded-lg border px-3 py-2 text-sm leading-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)", color: "var(--text-secondary)" }}>
            {hint}
          </div>
        ))}
      </div>
    </section>
  );
}

function PromptTemplatesPanel({ templates }: { templates: PromptTemplate[] }) {
  return (
    <section className="rounded-2xl border p-5 md:p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
        <Sparkles size={14} />
        Copilot Prompts
      </div>
      <div className="space-y-3">
        {templates.map((template) => (
          <details key={template.label} className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
            <summary className="cursor-pointer list-none text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {template.label}
            </summary>
            <p className="mt-2 text-xs italic leading-6" style={{ color: "var(--text-muted)" }}>
              {template.context}
            </p>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-[12px] leading-7" style={{ color: "var(--text-secondary)" }}>
              {template.prompt}
            </pre>
          </details>
        ))}
      </div>
    </section>
  );
}

function PracticeLinkCard({
  url,
  label,
  description,
}: {
  url: string;
  label: string;
  description: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block rounded-2xl border p-5 md:p-6 transition-colors"
      style={{
        borderColor: "var(--accent-action)",
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--accent-action) 15%, transparent), color-mix(in srgb, var(--accent-info) 8%, transparent))",
      }}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--accent-action)" }}>
        <ExternalLink size={14} />
        Practice Link
      </div>
      <div className="mt-2 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        {label}
      </div>
      <p className="mt-1 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
        {description}
      </p>
    </a>
  );
}

function HeroChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
      style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
    >
      {icon}
      {label}
    </div>
  );
}
