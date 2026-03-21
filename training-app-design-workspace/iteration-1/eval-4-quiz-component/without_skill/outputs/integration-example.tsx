/**
 * Integration Example
 *
 * Shows how to wire LocatorQuiz into the existing training-app architecture.
 *
 * There are two integration paths:
 *   A) Add a new `locatorQuiz` field to the Lesson type (data-driven, recommended)
 *   B) Embed LocatorQuiz directly in a custom section renderer
 *
 * This file demonstrates both.
 */

// ==========================================================================
// PATH A — Data-driven integration (recommended)
// ==========================================================================

// 1. Extend the Lesson type in training-app/src/data/types.ts:
//
//    export interface LocatorQuizData {
//      prompt: string;
//      htmlContext: string;
//      expectedAnswer: string;
//      acceptableAnswers?: string[];
//      hints?: string[];
//      explanation?: string;
//    }
//
//    export interface Lesson {
//      ...existing fields...
//      locatorQuiz?: LocatorQuizData;    // <-- add this
//    }

// 2. Add quiz data to a module file (e.g., 08-writing-tests.ts):

import type { LocatorQuizData } from "./LocatorQuiz";

export const loginButtonLocatorQuiz: LocatorQuizData = {
  prompt:
    "Write a Playwright locator that targets the login button in the HTML below.",
  htmlContext: `<form id="login-form">
  <input type="email" placeholder="Email" />
  <input type="password" placeholder="Password" />
  <button type="submit" class="btn btn-primary" data-testid="login-btn">
    Log in
  </button>
</form>`,
  expectedAnswer: `page.getByRole('button', { name: 'Log in' })`,
  acceptableAnswers: [
    `page.getByTestId('login-btn')`,
    `page.locator('[data-testid="login-btn"]')`,
    `page.getByRole('button', { name: /log in/i })`,
  ],
  hints: [
    "Playwright's getByRole() is the most resilient locator strategy.",
    "The button's accessible name comes from its visible text: 'Log in'.",
    "getByTestId() also works — data-testid='login-btn' is set on the button.",
  ],
  explanation:
    "Both getByRole('button', { name: 'Log in' }) and getByTestId('login-btn') are solid choices. getByRole is preferred for accessibility testing because it mirrors how assistive technology finds elements. getByTestId is the team standard for its resilience to UI refactors.",
};

// 3. In LessonView.tsx, add the rendering slot right after the quiz section:
//
//    {lesson.locatorQuiz && (
//      <LocatorQuiz quiz={lesson.locatorQuiz} onAttempt={() => setQuizAttempted(true)} />
//    )}

// ==========================================================================
// PATH B — Direct embedding in a standalone component
// ==========================================================================

import { LocatorQuiz } from "./LocatorQuiz";

/**
 * Example: standalone usage, e.g., in a custom lesson page or playground.
 */
export function LocatorQuizDemo() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h2
        className="text-2xl font-bold text-zinc-100 tracking-tight mb-8"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        Locator Challenge Demo
      </h2>

      <LocatorQuiz
        quiz={loginButtonLocatorQuiz}
        onAttempt={() => console.log("Learner submitted an attempt")}
      />
    </div>
  );
}
