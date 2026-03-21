/**
 * LocatorQuiz Component — API Design
 *
 * PURPOSE:
 * An inline quiz component that asks the learner to write a Playwright locator
 * (e.g., for a login button). The learner types code into a textarea, submits it,
 * and receives a character-level visual diff against the expected answer with
 * gentle, encouraging feedback instead of pass/fail grading.
 *
 * DESIGN DECISIONS:
 * 1. Embeds in the lesson scroll (not a modal/page) — matches QuizSection and ExerciseSection patterns.
 * 2. Uses the existing dark zinc/emerald theme from LessonView.
 * 3. Accepts multiple valid answers (locators can be written many ways).
 * 4. Provides character-level diff, not line-level, since locators are typically single-line.
 * 5. Gentle feedback: "Almost — here's what's different" instead of "Wrong".
 * 6. Supports optional hints, same pattern as ExerciseSection.
 * 7. Data-driven via a new LocatorQuiz type that can be added to the Lesson type.
 */

// ---------- DATA TYPES ----------

export interface LocatorQuizData {
  /** The task prompt, e.g., "Write a Playwright locator for the login button" */
  prompt: string;

  /** HTML snippet shown to the learner as context */
  htmlContext: string;

  /** The primary expected answer */
  expectedAnswer: string;

  /** Alternative acceptable answers (all are treated as correct) */
  acceptableAnswers?: string[];

  /** Optional hints, revealed progressively */
  hints?: string[];

  /** Explanation shown after submission, regardless of correctness */
  explanation?: string;
}

// ---------- COMPONENT PROPS ----------

export interface LocatorQuizProps {
  quiz: LocatorQuizData;

  /** Optional callback when the learner submits an attempt */
  onAttempt?: () => void;
}

// ---------- RENDERING CONTRACT ----------

/**
 * The component renders inline in the lesson scroll with this structure:
 *
 * ┌─────────────────────────────────────────────┐
 * │ 🎯  LOCATOR CHALLENGE                       │  ← header bar (amber accent)
 * ├─────────────────────────────────────────────┤
 * │ Write a Playwright locator for the login... │  ← prompt text
 * │                                             │
 * │ ┌─ HTML Context ─────────────────────────┐  │
 * │ │ <button id="login" class="btn">Log in  │  │  ← readonly code block
 * │ │ </button>                              │  │
 * │ └────────────────────────────────────────┘  │
 * │                                             │
 * │ ┌─ Your Locator ─────────────────────────┐  │
 * │ │ page.getByRole('button', { name: '...' │  │  ← editable textarea (mono font)
 * │ └────────────────────────────────────────┘  │
 * │                                             │
 * │ [Check Locator]          ▸ Need a hint?     │  ← action row
 * │                                             │
 * │ ── After submission ──                      │
 * │                                             │
 * │ ┌─ Feedback ─────────────────────────────┐  │
 * │ │ ✓ Nice work! or Almost — here's diff:  │  │
 * │ │                                        │  │
 * │ │ Yours:    page.locator('#login')       │  │  ← with diff highlights
 * │ │ Expected: page.getByRole('button',...) │  │
 * │ │                                        │  │
 * │ │ Explanation text...                    │  │
 * │ └────────────────────────────────────────┘  │
 * │                                             │
 * │ [Try Again]                                 │  ← if not exact match
 * └─────────────────────────────────────────────┘
 *
 * STATES:
 * 1. Initial — textarea empty, Check Locator disabled
 * 2. Filled — textarea has content, Check Locator enabled
 * 3. Submitted (match) — green feedback, no Try Again
 * 4. Submitted (close) — amber feedback with diff, Try Again available
 */
