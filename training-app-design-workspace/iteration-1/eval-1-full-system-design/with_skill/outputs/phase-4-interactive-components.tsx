/**
 * Interactive Components
 * Target: training-app/src/components/interactive/
 *
 * Components: QuizSection, ExerciseSection, InteractiveCheck, GuidedPractice
 *
 * These handle learner interaction: quizzes, exercises, and inline checks.
 * All use semantic tokens and educational tone ("Here's what's different"
 * not "Errors found").
 */

import { useState } from 'react';
import { Check, X, ChevronRight, ChevronLeft, Lightbulb, Eye, EyeOff } from 'lucide-react';
import type { Quiz, CodeExercise, InteractiveCheckSection, GuidedPracticeSection, PracticeStep } from '../../types/curriculum';

// ─── QuizSection ──────────────────────────────────────────────────

interface QuizSectionProps {
  quiz: Quiz;
  onAttempt?: () => void;
}

export function QuizSection({ quiz, onAttempt }: QuizSectionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === quiz.correctIndex;

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
      onAttempt?.();
    }
  };

  const handleRetry = () => {
    setSubmitted(false);
    setSelected(null);
  };

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span style={{ color: 'var(--accent-highlight)' }}>&#10022;</span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Knowledge Check
        </span>
      </div>

      <div className="p-5">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>
          {quiz.question}
        </p>

        {/* Options */}
        <div className="space-y-2">
          {quiz.options.map((opt, i) => {
            let borderColor = 'var(--border-subtle)';
            let bgColor = 'transparent';
            let textColor = 'var(--text-secondary)';

            if (submitted && i === quiz.correctIndex) {
              borderColor = 'var(--accent-action)';
              bgColor = 'var(--diff-added-bg)';
              textColor = 'var(--accent-action)';
            } else if (submitted && i === selected && !isCorrect) {
              borderColor = 'var(--diff-removed-text)';
              bgColor = 'var(--diff-removed-bg)';
              textColor = 'var(--diff-removed-text)';
            } else if (!submitted && i === selected) {
              borderColor = 'var(--accent-info)';
              bgColor = 'rgba(var(--accent-info-rgb, 56, 189, 248), 0.05)';
              textColor = 'var(--text-primary)';
            }

            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted && selected === quiz.correctIndex}
                className="w-full text-left px-4 py-3 rounded-md text-xs leading-relaxed transition-all"
                style={{ border: `1px solid ${borderColor}`, backgroundColor: bgColor, color: textColor }}
              >
                <span className="mr-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Submit button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="mt-4 px-4 py-2 rounded-md text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--accent-action)',
              color: 'var(--surface-primary)',
            }}
          >
            Check Answer
          </button>
        )}

        {/* Feedback */}
        {submitted && (
          <div
            className="mt-4 p-3 rounded-md text-xs leading-relaxed"
            style={{
              backgroundColor: isCorrect ? 'var(--diff-added-bg)' : 'rgba(var(--accent-highlight-rgb, 251, 191, 36), 0.08)',
              border: `1px solid ${isCorrect ? 'var(--accent-action)' : 'var(--accent-highlight)'}`,
              color: 'var(--text-primary)',
            }}
          >
            <p className="font-semibold mb-1 flex items-center gap-1.5">
              {isCorrect ? (
                <>
                  <Check size={14} style={{ color: 'var(--accent-action)' }} /> Correct!
                </>
              ) : (
                <>
                  <X size={14} style={{ color: 'var(--accent-highlight)' }} /> Not quite.
                </>
              )}
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>{quiz.explanation}</p>
          </div>
        )}

        {/* Retry */}
        {submitted && !isCorrect && (
          <button
            onClick={handleRetry}
            className="mt-3 text-xs px-3 py-1.5 rounded transition-colors"
            style={{
              color: 'var(--accent-highlight)',
              border: '1px solid var(--accent-highlight)',
            }}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

// ─── ExerciseSection ──────────────────────────────────────────────

interface ExerciseSectionProps {
  exercise: CodeExercise;
  onComplete?: () => void;
}

export function ExerciseSection({ exercise, onComplete }: ExerciseSectionProps) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span style={{ color: 'var(--accent-info)' }}>&#9889;</span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Hands-On Exercise
        </span>
      </div>

      <div className="p-5">
        <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          {exercise.title}
        </h4>
        <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          {exercise.description}
        </p>

        {/* Diff display (reuses the pattern from DiffView) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Starter */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-code)' }}>
            <div className="flex items-center justify-between px-3 py-1.5" style={{ backgroundColor: 'var(--surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Your Starting Point</span>
            </div>
            <pre className="p-3 overflow-x-auto text-xs leading-relaxed" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              <code>{exercise.starterCode}</code>
            </pre>
          </div>

          {/* Solution */}
          <div className="rounded-lg overflow-hidden" style={{
            border: `1px solid ${showSolution ? 'var(--accent-action)' : 'var(--border-subtle)'}`,
            backgroundColor: 'var(--surface-code)',
            transition: 'border-color 0.3s ease',
          }}>
            <div className="flex items-center justify-between px-3 py-1.5" style={{ backgroundColor: 'var(--surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Solution</span>
            </div>
            {showSolution ? (
              <pre className="p-3 overflow-x-auto text-xs leading-relaxed" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                <code>{exercise.solutionCode}</code>
              </pre>
            ) : (
              <div className="p-8 flex items-center justify-center">
                <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
                  Click "Reveal Solution" to see the answer
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => {
              setShowSolution(!showSolution);
              if (!showSolution) onComplete?.();
            }}
            className="px-4 py-2 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
            style={{
              backgroundColor: showSolution ? 'transparent' : 'var(--accent-action)',
              color: showSolution ? 'var(--text-secondary)' : 'var(--surface-primary)',
              border: showSolution ? '1px solid var(--border-subtle)' : 'none',
            }}
          >
            {showSolution ? (
              <><EyeOff size={14} /> Hide Solution</>
            ) : (
              <><Eye size={14} /> Reveal Solution</>
            )}
          </button>
          {exercise.hints.length > 0 && (
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-xs flex items-center gap-1 transition-colors"
              style={{ color: 'var(--accent-highlight)' }}
            >
              <Lightbulb size={14} />
              {showHints ? 'Hide hints' : 'Need a hint?'}
            </button>
          )}
        </div>

        {/* Hints */}
        {showHints && exercise.hints.length > 0 && (
          <div className="mt-3 space-y-1.5 pl-3" style={{ borderLeft: '2px solid var(--accent-highlight)' }}>
            {exercise.hints.map((h, i) => (
              <p key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-highlight)', marginRight: 4 }}>&#8594;</span>
                {h}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── InteractiveCheck (Inline) ────────────────────────────────────

export function InteractiveCheck({ section }: { section: InteractiveCheckSection }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = userAnswer.trim().toLowerCase() === section.answer.trim().toLowerCase();

  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: 'var(--accent-info)' }}>
        <Check size={14} /> Quick Check
      </p>
      <p className="text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
        {section.question}
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !submitted && setSubmitted(true)}
          placeholder="Type your answer..."
          className="flex-1 px-3 py-2 rounded-md text-xs"
          style={{
            backgroundColor: 'var(--surface-code)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
          }}
          disabled={submitted && isCorrect}
        />
        {!submitted && (
          <button
            onClick={() => setSubmitted(true)}
            disabled={!userAnswer.trim()}
            className="px-3 py-2 text-xs rounded-md disabled:opacity-30"
            style={{ backgroundColor: 'var(--accent-action)', color: 'var(--surface-primary)' }}
          >
            Check
          </button>
        )}
      </div>
      {submitted && (
        <div className="mt-2 text-xs flex items-center gap-1.5" style={{ color: isCorrect ? 'var(--accent-action)' : 'var(--accent-highlight)' }}>
          {isCorrect ? (
            <><Check size={14} /> Correct!</>
          ) : (
            <>
              <X size={14} /> Not quite.
              <button onClick={() => { setSubmitted(false); setUserAnswer(''); }} className="underline ml-1">Try again</button>
            </>
          )}
        </div>
      )}
      {section.hint && !submitted && (
        <button
          onClick={() => setShowHint(!showHint)}
          className="mt-2 text-xs"
          style={{ color: 'var(--accent-highlight)' }}
        >
          {showHint ? 'Hide hint' : 'Need a hint?'}
        </button>
      )}
      {showHint && section.hint && (
        <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          Hint: {section.hint}
        </p>
      )}
    </div>
  );
}

// ─── GuidedPractice ───────────────────────────────────────────────

export function GuidedPractice({ section }: { section: GuidedPracticeSection }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showAnswer, setShowAnswer] = useState(false);

  const step = section.steps[currentStep];
  const totalSteps = section.steps.length;

  const markStepComplete = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Step {currentStep + 1} of {totalSteps}: {step.title}
        </span>
      </div>

      <div className="p-5">
        {/* Instruction */}
        <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          {step.instruction}
        </p>

        {/* Code area */}
        <div className="rounded-lg overflow-hidden mb-4" style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-code)' }}>
          <pre className="p-3 overflow-x-auto text-xs leading-relaxed" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            <code>{showAnswer ? step.expectedCode : step.starterCode}</code>
          </pre>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={markStepComplete}
            className="px-4 py-2 text-xs font-medium rounded-md"
            style={{ backgroundColor: 'var(--accent-action)', color: 'var(--surface-primary)' }}
          >
            {completedSteps.has(currentStep) ? 'Completed' : currentStep < totalSteps - 1 ? 'Complete & Next' : 'Finish'}
          </button>
          {step.hint && (
            <button className="text-xs" style={{ color: 'var(--accent-highlight)' }}>
              <Lightbulb size={14} className="inline mr-1" />
              Hint
            </button>
          )}
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-xs"
            style={{ color: 'var(--accent-info)' }}
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        </div>

        {/* Step progress dots */}
        <div className="flex items-center gap-1.5 mt-4">
          {section.steps.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-colors"
              style={{
                backgroundColor: completedSteps.has(i)
                  ? 'var(--accent-action)'
                  : i === currentStep
                  ? 'var(--accent-info)'
                  : 'var(--border-subtle)',
              }}
            />
          ))}
        </div>

        {/* Step navigation */}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setShowAnswer(false); }}
            disabled={currentStep === 0}
            className="text-xs flex items-center gap-1 disabled:opacity-20"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronLeft size={14} /> Previous Step
          </button>
          <button
            onClick={() => { setCurrentStep(Math.min(totalSteps - 1, currentStep + 1)); setShowAnswer(false); }}
            disabled={currentStep === totalSteps - 1}
            className="text-xs flex items-center gap-1 disabled:opacity-20"
            style={{ color: 'var(--text-secondary)' }}
          >
            Next Step <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
