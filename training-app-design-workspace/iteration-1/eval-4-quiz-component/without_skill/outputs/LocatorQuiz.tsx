import { useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LocatorQuizData {
  /** The task prompt, e.g., "Write a Playwright locator for the login button" */
  prompt: string;
  /** HTML snippet shown to the learner as context */
  htmlContext: string;
  /** The primary expected answer */
  expectedAnswer: string;
  /** Alternative acceptable answers (all treated as correct) */
  acceptableAnswers?: string[];
  /** Optional hints, revealed progressively */
  hints?: string[];
  /** Explanation shown after submission */
  explanation?: string;
}

interface LocatorQuizProps {
  quiz: LocatorQuizData;
  /** Callback when the learner submits an attempt (useful for gating lesson completion) */
  onAttempt?: () => void;
}

// ---------------------------------------------------------------------------
// Diff helpers
// ---------------------------------------------------------------------------

interface DiffSegment {
  text: string;
  kind: "match" | "expected" | "yours";
}

/**
 * Produces a simple character-level diff between two strings.
 * Returns two arrays of segments: one for the user's answer, one for the expected.
 *
 * Uses a longest-common-subsequence approach to align matching characters and
 * highlight the differences.
 */
function computeDiff(
  userStr: string,
  expectedStr: string
): { userSegments: DiffSegment[]; expectedSegments: DiffSegment[] } {
  const a = userStr;
  const b = expectedStr;
  const m = a.length;
  const n = b.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Backtrack to build aligned sequences
  const userParts: { ch: string; matched: boolean }[] = [];
  const expectedParts: { ch: string; matched: boolean }[] = [];

  let i = m;
  let j = n;
  const userStack: { ch: string; matched: boolean }[] = [];
  const expectedStack: { ch: string; matched: boolean }[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      userStack.push({ ch: a[i - 1], matched: true });
      expectedStack.push({ ch: b[j - 1], matched: true });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      expectedStack.push({ ch: b[j - 1], matched: false });
      j--;
    } else {
      userStack.push({ ch: a[i - 1], matched: false });
      i--;
    }
  }

  userStack.reverse().forEach((p) => userParts.push(p));
  expectedStack.reverse().forEach((p) => expectedParts.push(p));

  // Collapse consecutive same-kind characters into segments
  function collapse(
    parts: { ch: string; matched: boolean }[],
    unmatchedKind: "expected" | "yours"
  ): DiffSegment[] {
    const segments: DiffSegment[] = [];
    let current: DiffSegment | null = null;
    for (const p of parts) {
      const kind = p.matched ? "match" : unmatchedKind;
      if (current && current.kind === kind) {
        current.text += p.ch;
      } else {
        if (current) segments.push(current);
        current = { text: p.ch, kind };
      }
    }
    if (current) segments.push(current);
    return segments;
  }

  return {
    userSegments: collapse(userParts, "yours"),
    expectedSegments: collapse(expectedParts, "expected"),
  };
}

/** Normalize whitespace for comparison: trim + collapse internal whitespace */
function normalize(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DiffLine({
  label,
  segments,
  highlightColor,
}: {
  label: string;
  segments: DiffSegment[];
  highlightColor: string;
}) {
  return (
    <div className="flex items-start gap-2 text-xs font-mono">
      <span className="text-zinc-500 w-20 flex-shrink-0 text-right select-none">
        {label}
      </span>
      <code className="flex-1 whitespace-pre-wrap break-all">
        {segments.map((seg, i) =>
          seg.kind === "match" ? (
            <span key={i} className="text-zinc-300">
              {seg.text}
            </span>
          ) : (
            <span
              key={i}
              className={`${highlightColor} rounded-sm px-0.5`}
            >
              {seg.text}
            </span>
          )
        )}
      </code>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function LocatorQuiz({ quiz, onAttempt }: LocatorQuizProps) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [revealedHintCount, setRevealedHintCount] = useState(1);

  const allAcceptable = [
    quiz.expectedAnswer,
    ...(quiz.acceptableAnswers ?? []),
  ];

  const normalizedInput = normalize(input);
  const isExactMatch = allAcceptable.some(
    (ans) => normalize(ans) === normalizedInput
  );

  // Find the closest acceptable answer for the diff
  const closestAnswer = allAcceptable.reduce((best, ans) => {
    const dist = Math.abs(normalize(ans).length - normalizedInput.length);
    const bestDist = Math.abs(normalize(best).length - normalizedInput.length);
    return dist < bestDist ? ans : best;
  }, allAcceptable[0]);

  const { userSegments, expectedSegments } = computeDiff(
    normalizedInput,
    normalize(closestAnswer)
  );

  const handleSubmit = () => {
    if (normalizedInput.length === 0) return;
    setSubmitted(true);
    onAttempt?.();
  };

  const handleTryAgain = () => {
    setSubmitted(false);
  };

  const handleRevealMoreHints = () => {
    if (quiz.hints && revealedHintCount < quiz.hints.length) {
      setRevealedHintCount((c) => c + 1);
    }
  };

  return (
    <div className="mt-8 border border-zinc-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 bg-zinc-800/40 border-b border-zinc-800 flex items-center gap-2">
        <span className="text-amber-400">&#127919;</span>
        <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          Locator Challenge
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Prompt */}
        <p className="text-sm text-zinc-200 leading-relaxed">{quiz.prompt}</p>

        {/* HTML Context */}
        <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/80">
          <div className="px-3 py-1.5 bg-zinc-800/60 border-b border-zinc-800">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">
              HTML Context
            </span>
          </div>
          <pre className="p-3 overflow-x-auto text-[12px] leading-relaxed text-emerald-200/90">
            <code>{quiz.htmlContext}</code>
          </pre>
        </div>

        {/* Input area */}
        <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/80">
          <div className="px-3 py-1.5 bg-zinc-800/60 border-b border-zinc-800">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">
              Your Locator
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={submitted && isExactMatch}
            placeholder="page.getByRole('button', { name: '...' })"
            rows={2}
            className="w-full bg-transparent p-3 text-[12px] leading-relaxed text-emerald-200/90 font-mono placeholder:text-zinc-700 focus:outline-none resize-none"
            spellCheck={false}
          />
        </div>

        {/* Action row */}
        <div className="flex items-center gap-3">
          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={normalizedInput.length === 0}
              className="px-4 py-2 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Check Locator
            </button>
          )}

          {quiz.hints && quiz.hints.length > 0 && !submitted && (
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-xs text-amber-500/80 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              {showHints ? "\u25BE Hide hints" : "\u25B8 Need a hint?"}
            </button>
          )}
        </div>

        {/* Hints */}
        {showHints && quiz.hints && quiz.hints.length > 0 && (
          <div className="space-y-1.5 pl-3 border-l border-amber-500/20">
            {quiz.hints.slice(0, revealedHintCount).map((h, i) => (
              <p key={i} className="text-xs text-zinc-400">
                <span className="text-amber-500/60 mr-1">{"\u2192"}</span> {h}
              </p>
            ))}
            {revealedHintCount < quiz.hints.length && (
              <button
                onClick={handleRevealMoreHints}
                className="text-xs text-amber-500/60 hover:text-amber-400 transition-colors mt-1"
              >
                Show another hint...
              </button>
            )}
          </div>
        )}

        {/* Feedback */}
        {submitted && (
          <div
            className={`p-4 rounded-md text-xs leading-relaxed border space-y-3 ${
              isExactMatch
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-amber-500/5 border-amber-500/20"
            }`}
          >
            {/* Feedback headline */}
            <p
              className={`font-semibold ${
                isExactMatch ? "text-emerald-300" : "text-amber-300"
              }`}
            >
              {isExactMatch
                ? "\u2713 Nice work! That locator is spot on."
                : "Almost \u2014 here\u2019s what\u2019s different:"}
            </p>

            {/* Visual diff (only when not exact match) */}
            {!isExactMatch && (
              <div className="space-y-2 bg-zinc-900/60 rounded-md p-3 border border-zinc-800">
                <DiffLine
                  label="Yours:"
                  segments={userSegments}
                  highlightColor="bg-red-500/20 text-red-300"
                />
                <DiffLine
                  label="Expected:"
                  segments={expectedSegments}
                  highlightColor="bg-emerald-500/20 text-emerald-300"
                />
                <div className="flex items-center gap-4 mt-2 pt-2 border-t border-zinc-800">
                  <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <span className="inline-block w-2 h-2 rounded-sm bg-red-500/40" />
                    Only in yours
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <span className="inline-block w-2 h-2 rounded-sm bg-emerald-500/40" />
                    Only in expected
                  </span>
                </div>
              </div>
            )}

            {/* Explanation */}
            {quiz.explanation && (
              <p className="text-zinc-400">{quiz.explanation}</p>
            )}
          </div>
        )}

        {/* Try Again */}
        {submitted && !isExactMatch && (
          <button
            onClick={handleTryAgain}
            className="text-xs text-amber-400 hover:text-amber-300 border border-amber-500/30 rounded px-3 py-1.5 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
