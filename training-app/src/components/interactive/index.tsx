import { useState, type CSSProperties } from "react";

import type {
  CodeExercise,
  PromptTemplate,
  PracticeLink,
  Quiz,
} from "../../types/curriculum";

interface QuizSectionProps {
  quiz: Quiz;
  onAttempt?: () => void;
}

interface ExerciseSectionProps {
  exercise: CodeExercise;
  onComplete?: () => void;
}

interface PromptTemplatesSectionProps {
  templates: PromptTemplate[];
}

interface PracticeLinkCardProps {
  practiceLink: PracticeLink;
}

export function QuizSection({ quiz, onAttempt }: QuizSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selectedIndex === quiz.correctIndex;

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setSubmitted(true);
    onAttempt?.();
  };

  return (
    <section className="rounded-xl border p-5" style={panelStyle}>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.18em]" style={mutedTextStyle}>
          Knowledge Check
        </p>
        <h3 className="mt-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {quiz.question}
        </h3>
      </div>

      <div className="space-y-2">
        {quiz.options.map((option, index) => {
          const active = selectedIndex === index;
          const correct = submitted && index === quiz.correctIndex;
          const wrong = submitted && active && !isCorrect;

          return (
            <button
              key={option}
              type="button"
              onClick={() => !submitted && setSelectedIndex(index)}
              className="w-full rounded-lg border px-4 py-3 text-left text-[13px] transition-colors"
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
                  ? "color-mix(in srgb, var(--accent-info) 10%, transparent)"
                  : "transparent",
                color: "var(--text-primary)",
              }}
            >
              <span className="mr-2 font-mono" style={{ color: "var(--text-muted)" }}>
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedIndex === null}
            className="rounded-md px-4 py-2 text-xs font-medium transition-colors disabled:opacity-40"
            style={primaryButtonStyle}
          >
            Check Answer
          </button>
        ) : (
          <div
            className="rounded-lg border px-4 py-3 text-[13px] leading-relaxed"
            style={{
              borderColor: isCorrect ? "var(--accent-action)" : "var(--accent-highlight)",
              backgroundColor: isCorrect ? "var(--diff-added-bg)" : "var(--diff-removed-bg)",
              color: "var(--text-primary)",
            }}
          >
            <p className="font-semibold">{isCorrect ? "Correct" : "Not quite"}</p>
            <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
              {quiz.explanation}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export function ExerciseSection({ exercise, onComplete }: ExerciseSectionProps) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <section className="rounded-xl border p-5" style={panelStyle}>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.18em]" style={mutedTextStyle}>
          Hands-On Exercise
        </p>
        <h3 className="mt-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {exercise.title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {exercise.description}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CodePane title="Starter" code={exercise.starterCode} />
        <CodePane title="Solution" code={exercise.solutionCode} dimmed={!showSolution} />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setShowSolution((current) => !current)}
          className="rounded-md px-4 py-2 text-xs font-medium transition-colors"
          style={secondaryButtonStyle}
        >
          {showSolution ? "Hide Solution" : "Reveal Solution"}
        </button>
        {onComplete && (
          <button
            type="button"
            onClick={onComplete}
            className="rounded-md px-4 py-2 text-xs font-medium transition-colors"
            style={primaryButtonStyle}
          >
            Mark Complete
          </button>
        )}
      </div>

      {exercise.hints.length > 0 && (
        <div className="mt-4 rounded-lg border px-4 py-3" style={hintStyle}>
          <p className="text-xs uppercase tracking-[0.18em]" style={mutedTextStyle}>
            Hints
          </p>
          <ul className="mt-2 space-y-2 text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {exercise.hints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function PromptTemplatesSection({ templates }: PromptTemplatesSectionProps) {
  if (templates.length === 0) return null;

  return (
    <section className="rounded-xl border p-5" style={panelStyle}>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.18em]" style={mutedTextStyle}>
          Prompt Templates
        </p>
      </div>
      <div className="space-y-4">
        {templates.map((template) => (
          <article key={template.label} className="rounded-lg border p-4" style={templateCardStyle}>
            <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {template.label}
            </h4>
            <p className="mt-1 text-xs italic" style={{ color: "var(--text-muted)" }}>
              {template.context}
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg border p-3 text-[12px] leading-relaxed" style={promptStyle}>
              <code>{template.prompt}</code>
            </pre>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PracticeLinkCard({ practiceLink }: PracticeLinkCardProps) {
  return (
    <section className="rounded-xl border p-5" style={panelStyle}>
      <p className="text-xs uppercase tracking-[0.18em]" style={mutedTextStyle}>
        Practice Link
      </p>
      <h3 className="mt-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {practiceLink.label}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {practiceLink.description}
      </p>
      <a
        href={practiceLink.url}
        className="mt-4 inline-flex rounded-md px-4 py-2 text-xs font-medium transition-colors"
        style={primaryButtonStyle}
      >
        Open Practice App
      </a>
    </section>
  );
}

function CodePane({
  title,
  code,
  dimmed = false,
}: {
  title: string;
  code: string;
  dimmed?: boolean;
}) {
  return (
    <div className="rounded-lg border" style={codePaneStyle}>
      <div className="border-b px-3 py-2 text-xs uppercase tracking-[0.18em]" style={codeHeaderStyle}>
        {title}
      </div>
      <pre
        className="overflow-x-auto px-3 py-3 text-[12px] leading-relaxed"
        style={{
          backgroundColor: "var(--surface-code)",
          color: "var(--text-primary)",
          opacity: dimmed ? 0.65 : 1,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

const panelStyle: CSSProperties = {
  borderColor: "var(--border-subtle)",
  backgroundColor: "var(--surface-elevated)",
  boxShadow: "var(--shadow-elevation)",
};

const codePaneStyle: CSSProperties = {
  borderColor: "var(--border-subtle)",
  backgroundColor: "var(--surface-elevated)",
};

const codeHeaderStyle: CSSProperties = {
  color: "var(--text-muted)",
  borderColor: "var(--border-subtle)",
  backgroundColor: "var(--surface-hover)",
};

const promptStyle: CSSProperties = {
  borderColor: "var(--border-subtle)",
  backgroundColor: "var(--surface-code)",
  color: "var(--text-primary)",
};

const hintStyle: CSSProperties = {
  borderColor: "var(--border-subtle)",
  backgroundColor: "color-mix(in srgb, var(--accent-info) 8%, transparent)",
};

const templateCardStyle: CSSProperties = {
  borderColor: "var(--border-subtle)",
  backgroundColor: "var(--surface-primary)",
};

const primaryButtonStyle: CSSProperties = {
  color: "var(--surface-primary)",
  backgroundColor: "var(--accent-action)",
};

const secondaryButtonStyle: CSSProperties = {
  color: "var(--text-primary)",
  backgroundColor: "var(--surface-hover)",
  border: "1px solid var(--border-subtle)",
};

const mutedTextStyle: CSSProperties = {
  color: "var(--text-muted)",
};
