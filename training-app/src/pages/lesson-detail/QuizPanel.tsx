import { useCallback, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Quiz, QuizQuestion } from "../../types/curriculum";

export function QuizPanel({ quiz, onAttempt }: Readonly<{ quiz: Quiz; onAttempt: () => void }>) {
  const { questions } = quiz;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [attemptFired, setAttemptFired] = useState(false);

  const total = questions.length;
  const q = questions[currentQ];
  const selected = answers[currentQ] ?? null;
  const isSubmitted = submitted[currentQ] ?? false;
  const isCorrect = selected === q.correctIndex;

  const answeredCount = Object.keys(submitted).length;
  const correctCount = Object.entries(submitted).filter(
    ([idx]) => answers[Number(idx)] === questions[Number(idx)].correctIndex,
  ).length;

  const handleSubmit = useCallback(() => {
    if (selected === null) return;
    setSubmitted((prev) => ({ ...prev, [currentQ]: true }));
    if (!attemptFired) {
      setAttemptFired(true);
      onAttempt();
    }
  }, [selected, currentQ, attemptFired, onAttempt]);

  return (
    <section
      className="lesson-panel lesson-panel-quiz rounded-2xl border p-6 md:p-8"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
          <CheckCircle2 size={14} />
          Knowledge Check
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          Question {currentQ + 1} of {total}
          {answeredCount > 0 && (
            <span style={{ color: "var(--accent-action)" }}> — {correctCount}/{answeredCount} correct</span>
          )}
        </div>
      </div>

      {/* Question dots */}
      {total > 1 && (
        <div className="mb-4 flex gap-1.5">
          {questions.map((_, i) => {
            const answered = submitted[i];
            const correct = answered && answers[i] === questions[i].correctIndex;
            const wrong = answered && answers[i] !== questions[i].correctIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentQ(i)}
                aria-label={`Question ${i + 1}`}
                className="h-2 rounded-full transition-all"
                style={{
                  width: i === currentQ ? "1.5rem" : "0.5rem",
                  backgroundColor: correct
                    ? "var(--accent-action)"
                    : wrong
                    ? "var(--diff-removed-text)"
                    : i === currentQ
                    ? "var(--accent-info)"
                    : "var(--border-subtle)",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Question content */}
      <QuestionCard
        question={q}
        selected={selected}
        isSubmitted={isSubmitted}
        isCorrect={isCorrect}
        onSelect={(i) => !isSubmitted && setAnswers((prev) => ({ ...prev, [currentQ]: i }))}
        onSubmit={handleSubmit}
      />

      {/* Prev/Next question */}
      {total > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            disabled={currentQ === 0}
            onClick={() => setCurrentQ((i) => i - 1)}
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-30"
            style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
          >
            <ChevronLeft size={14} />
            Previous
          </button>
          <button
            type="button"
            disabled={currentQ === total - 1}
            onClick={() => setCurrentQ((i) => i + 1)}
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-30"
            style={{ borderColor: "var(--accent-action)", color: "var(--accent-action)" }}
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </section>
  );
}

function QuestionCard({
  question,
  selected,
  isSubmitted,
  isCorrect,
  onSelect,
  onSubmit,
}: Readonly<{
  question: QuizQuestion;
  selected: number | null;
  isSubmitted: boolean;
  isCorrect: boolean;
  onSelect: (index: number) => void;
  onSubmit: () => void;
}>) {
  return (
    <div>
      <p className="text-sm leading-7" style={{ color: "var(--text-primary)" }}>
        {question.question}
      </p>
      <div className="mt-4 space-y-2">
        {question.options.map((option, index) => {
          const active = selected === index;
          const correct = isSubmitted && index === question.correctIndex;
          const wrong = isSubmitted && active && !isCorrect;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(index)}
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
      {!isSubmitted ? (
        <button
          type="button"
          disabled={selected === null}
          onClick={onSubmit}
          className="mt-4 rounded-lg px-4 py-2 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "var(--accent-action)", color: "var(--surface-primary)" }}
        >
          Check Answer
        </button>
      ) : (
        <div
          className="mt-4 rounded-xl border p-4"
          style={{
            borderColor: isCorrect ? "var(--accent-action)" : "var(--diff-removed-text)",
            backgroundColor: isCorrect ? "var(--diff-added-bg)" : "var(--diff-removed-bg)",
          }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {isCorrect ? "Correct" : "Not quite"}
          </p>
          <p className="mt-1 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
