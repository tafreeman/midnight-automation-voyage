import { useState, useRef, useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LocatorQuizProps {
  /** The question prompt */
  question: string;
  /** Context hint shown above the editor */
  context?: string;
  /** HTML snippet showing the target element */
  targetHtml?: string;
  /** The expected correct answer */
  expectedAnswer: string;
  /** Placeholder text for the code input */
  placeholder?: string;
  /** Optional hints the learner can reveal */
  hints?: string[];
  /** Callback when the learner submits an attempt */
  onAttempt?: () => void;
}

// ---------------------------------------------------------------------------
// Diff logic — character-level for short locators, line-level for multi-line
// ---------------------------------------------------------------------------

interface DiffSegment {
  text: string;
  type: "equal" | "added" | "removed";
}

/**
 * Simple character-level diff using longest common subsequence.
 * Good enough for single-line Playwright locators.
 */
function charDiff(actual: string, expected: string): DiffSegment[] {
  // Build LCS table
  const m = actual.length;
  const n = expected.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        actual[i - 1] === expected[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Backtrack to get segments
  const segments: DiffSegment[] = [];
  let i = m;
  let j = n;
  const raw: { char: string; type: DiffSegment["type"] }[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && actual[i - 1] === expected[j - 1]) {
      raw.push({ char: actual[i - 1], type: "equal" });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      raw.push({ char: expected[j - 1], type: "added" });
      j--;
    } else {
      raw.push({ char: actual[i - 1], type: "removed" });
      i--;
    }
  }

  raw.reverse();

  // Merge consecutive same-type chars into segments
  for (const { char, type } of raw) {
    const last = segments[segments.length - 1];
    if (last && last.type === type) {
      last.text += char;
    } else {
      segments.push({ text: char, type });
    }
  }

  return segments;
}

/**
 * Normalise whitespace for comparison — trim and collapse internal spaces.
 * This prevents purely-whitespace differences from causing confusion.
 */
function normalise(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}

/**
 * Generate a human-friendly summary of the diff.
 */
function diffSummary(segments: DiffSegment[]): string {
  const removedCount = segments.filter((s) => s.type === "removed").length;
  const addedCount = segments.filter((s) => s.type === "added").length;
  const totalChanges = removedCount + addedCount;
  if (totalChanges === 0) return "Perfect match!";
  if (totalChanges <= 2) return "Almost! Just a tiny difference.";
  if (totalChanges <= 5) return "Close — here's what's different.";
  return "Good effort — compare yours with the expected answer below.";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InlineDiffDisplay({ segments }: { segments: DiffSegment[] }) {
  return (
    <div className="space-y-3">
      {/* Your answer with removals highlighted */}
      <div>
        <div className="text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wider">
          Your answer
        </div>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-md p-3 font-mono text-xs leading-relaxed overflow-x-auto">
          {segments.map((seg, i) => {
            if (seg.type === "added") return null;
            return (
              <span
                key={i}
                className={
                  seg.type === "removed"
                    ? "bg-red-500/15 text-red-300/90 rounded-sm px-0.5 line-through decoration-red-400/40"
                    : "text-emerald-200/80"
                }
                aria-label={
                  seg.type === "removed" ? `removed: ${seg.text}` : undefined
                }
              >
                {seg.text}
              </span>
            );
          })}
        </div>
      </div>

      {/* Expected answer with additions highlighted */}
      <div>
        <div className="text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wider">
          Expected answer
        </div>
        <div className="bg-zinc-900/80 border border-emerald-500/20 rounded-md p-3 font-mono text-xs leading-relaxed overflow-x-auto">
          {segments.map((seg, i) => {
            if (seg.type === "removed") return null;
            return (
              <span
                key={i}
                className={
                  seg.type === "added"
                    ? "bg-emerald-500/15 text-emerald-300 rounded-sm px-0.5 underline decoration-emerald-400/40"
                    : "text-emerald-200/80"
                }
                aria-label={
                  seg.type === "added" ? `added: ${seg.text}` : undefined
                }
              >
                {seg.text}
              </span>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-red-500/15 border border-red-500/30" />
          <span className="sr-only">Red highlight means</span>
          In yours, not expected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-emerald-500/15 border border-emerald-500/30" />
          <span className="sr-only">Green highlight means</span>
          In expected, not yours
        </span>
      </div>
    </div>
  );
}

function HintSection({ hints }: { hints: string[] }) {
  const [showHints, setShowHints] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  const toggleHints = () => {
    if (!showHints) {
      setShowHints(true);
      setRevealedCount(1);
    } else {
      setShowHints(false);
    }
  };

  const showMore = () => {
    setRevealedCount((c) => Math.min(c + 1, hints.length));
  };

  return (
    <div className="mt-3">
      <button
        onClick={toggleHints}
        className="text-xs text-amber-500/80 hover:text-amber-400 transition-colors flex items-center gap-1"
        type="button"
      >
        {showHints ? "\u25BE Hide hints" : "\u25B8 Need a hint?"}
      </button>
      {showHints && (
        <div className="mt-2 space-y-1.5 pl-3 border-l border-amber-500/20">
          {hints.slice(0, revealedCount).map((h, i) => (
            <p key={i} className="text-xs text-zinc-400">
              <span className="text-amber-500/60 mr-1" aria-hidden="true">
                {"\u2192"}
              </span>
              {h}
            </p>
          ))}
          {revealedCount < hints.length && (
            <button
              onClick={showMore}
              className="text-xs text-amber-500/60 hover:text-amber-400 transition-colors"
              type="button"
            >
              Show another hint ({hints.length - revealedCount} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function LocatorQuiz({
  question,
  context,
  targetHtml,
  expectedAnswer,
  placeholder = 'page.getByRole("button", { name: "..." })',
  hints = [],
  onAttempt,
}: LocatorQuizProps) {
  const [userInput, setUserInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [segments, setSegments] = useState<DiffSegment[]>([]);
  const [showExpected, setShowExpected] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const feedbackId = useId();
  const inputId = useId();

  const isMatch =
    submitted && normalise(userInput) === normalise(expectedAnswer);

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    const result = charDiff(normalise(userInput), normalise(expectedAnswer));
    setSegments(result);
    setSubmitted(true);
    setHasAttempted(true);
    onAttempt?.();
  };

  const handleRetry = () => {
    setSubmitted(false);
    setSegments([]);
    setShowExpected(false);
    // Keep the user's input so they can edit it
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const copyExpected = () => {
    navigator.clipboard.writeText(expectedAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 border border-zinc-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 bg-zinc-800/40 border-b border-zinc-800 flex items-center gap-2">
        <span className="text-cyan-400" aria-hidden="true">
          {"\u2318"}
        </span>
        <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          Locator Challenge
        </span>
      </div>

      <div className="p-5">
        {/* Question */}
        <p className="text-sm text-zinc-200 mb-3 leading-relaxed">
          {question}
        </p>

        {/* Context */}
        {context && (
          <div className="mb-3 px-4 py-2.5 bg-blue-500/5 border border-blue-500/10 rounded-md">
            <p className="text-xs text-blue-300/80 leading-relaxed">
              <span className="font-semibold text-blue-400">Context: </span>
              {context}
            </p>
          </div>
        )}

        {/* Target HTML reference */}
        {targetHtml && (
          <div className="mb-4 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/80">
            <div className="flex items-center px-3 py-1.5 bg-zinc-800/60 border-b border-zinc-800">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                Target Element
              </span>
            </div>
            <pre className="p-3 overflow-x-auto text-xs leading-relaxed text-amber-200/80">
              <code>{targetHtml}</code>
            </pre>
          </div>
        )}

        {/* Code Input */}
        <div className="mb-3">
          <label
            htmlFor={inputId}
            className="block text-xs text-zinc-500 mb-1.5 font-medium"
          >
            Your Playwright locator:
          </label>
          <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/80 focus-within:border-emerald-500/30 transition-colors">
            <textarea
              ref={inputRef}
              id={inputId}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={submitted && isMatch}
              rows={2}
              className="w-full bg-transparent text-emerald-200/90 font-mono text-xs p-3 resize-none outline-none placeholder:text-zinc-600 disabled:opacity-50"
              aria-describedby={submitted ? feedbackId : undefined}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
          <p className="mt-1 text-xs text-zinc-600">
            Press Ctrl+Enter to check your answer
          </p>
        </div>

        {/* Action buttons (pre-submit) */}
        {!submitted && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={!userInput.trim()}
              className="px-4 py-2 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              type="button"
            >
              Check Your Answer
            </button>
            {hints.length > 0 && <HintSection hints={hints} />}
          </div>
        )}

        {/* Feedback area */}
        {submitted && (
          <div id={feedbackId} aria-live="polite" className="mt-4 space-y-4">
            {isMatch ? (
              /* ---- Success ---- */
              <div className="p-4 rounded-md border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-emerald-400 text-sm"
                    aria-hidden="true"
                  >
                    {"\u2713"}
                  </span>
                  <p className="text-sm font-semibold text-emerald-300">
                    Perfect match!
                  </p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your locator is exactly right. This targets the element
                  reliably using Playwright's recommended approach.
                </p>
              </div>
            ) : (
              /* ---- Diff feedback ---- */
              <>
                <div className="p-3 rounded-md border border-amber-500/20 bg-amber-500/5">
                  <p className="text-xs text-amber-200 leading-relaxed">
                    <span className="font-semibold text-amber-300">
                      {diffSummary(segments)}
                    </span>{" "}
                    Take a look at the comparison below.
                  </p>
                </div>

                <InlineDiffDisplay segments={segments} />

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 text-xs font-medium text-amber-400 hover:text-amber-300 border border-amber-500/30 rounded-md transition-colors"
                    type="button"
                  >
                    Try Again
                  </button>

                  {hasAttempted && !showExpected && (
                    <button
                      onClick={() => setShowExpected(true)}
                      className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-md transition-colors"
                      type="button"
                    >
                      Show Expected Answer
                    </button>
                  )}

                  {hints.length > 0 && <HintSection hints={hints} />}
                </div>

                {/* Full expected answer reveal */}
                {showExpected && (
                  <div className="rounded-lg overflow-hidden border border-emerald-500/20 bg-zinc-900/80">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-800/60 border-b border-zinc-800">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">
                        Expected Answer
                      </span>
                      <button
                        onClick={copyExpected}
                        className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors px-2 py-0.5"
                        type="button"
                      >
                        {copied ? "\u2713 Copied" : "Copy"}
                      </button>
                    </div>
                    <pre className="p-3 overflow-x-auto text-xs leading-relaxed text-emerald-200/90">
                      <code>{expectedAnswer}</code>
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
