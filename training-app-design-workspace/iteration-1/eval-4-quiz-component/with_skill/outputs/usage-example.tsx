/**
 * Usage Example: LocatorQuiz embedded in a lesson scroll
 *
 * This shows how the LocatorQuiz component fits into the existing
 * LessonView notebook-style flow. It sits between content sections
 * just like QuizSection and ExerciseSection do today.
 */

import { LocatorQuiz } from "./LocatorQuiz";

// ---------------------------------------------------------------------------
// Example 1: Simple login button locator
// ---------------------------------------------------------------------------
export function LoginButtonQuizExample() {
  return (
    <LocatorQuiz
      question="Write a Playwright locator that targets the login button on the practice app's login page."
      context='The button displays the text "Sign In" and uses a <button> element with role="button".'
      targetHtml='<button type="submit" class="btn-primary">Sign In</button>'
      expectedAnswer='page.getByRole("button", { name: "Sign In" })'
      placeholder='page.getByRole("button", { name: "..." })'
      hints={[
        "Playwright recommends using role-based locators over CSS selectors.",
        'The getByRole() method accepts a role name and an options object with a "name" property.',
        "The name should match the visible text on the button.",
      ]}
      onAttempt={() => console.log("Quiz attempted")}
    />
  );
}

// ---------------------------------------------------------------------------
// Example 2: Integration into a lesson data object (extending the Lesson type)
// ---------------------------------------------------------------------------

/**
 * To integrate LocatorQuiz with the existing data model, you could extend
 * the Lesson type to support a new `locatorQuiz` property:
 *
 * ```typescript
 * // In types.ts
 * export interface LocatorQuizData {
 *   question: string;
 *   context?: string;
 *   targetHtml?: string;
 *   expectedAnswer: string;
 *   placeholder?: string;
 *   hints?: string[];
 * }
 *
 * export interface Lesson {
 *   // ... existing fields ...
 *   locatorQuiz?: LocatorQuizData;
 * }
 * ```
 *
 * Then in LessonView.tsx, render it alongside the existing quiz/exercise:
 *
 * ```tsx
 * {lesson.locatorQuiz && (
 *   <LocatorQuiz
 *     {...lesson.locatorQuiz}
 *     onAttempt={() => setQuizAttempted(true)}
 *   />
 * )}
 * ```
 */

// ---------------------------------------------------------------------------
// Example 3: Multiple locator quizzes in sequence (progressive difficulty)
// ---------------------------------------------------------------------------
export function LocatorQuizSequence() {
  return (
    <div className="space-y-8">
      {/* Surrounding lesson content */}
      <section>
        <h3 className="text-sm font-semibold text-zinc-200 mb-2 flex items-center gap-2">
          <span className="w-1 h-4 bg-emerald-500 rounded-full inline-block flex-shrink-0" />
          Choosing the Right Locator
        </h3>
        <p className="text-[13px] text-zinc-400 leading-relaxed">
          Playwright offers several locator strategies. The recommended approach
          is to use role-based locators that mirror how users and assistive
          technologies interact with your application.
        </p>
      </section>

      {/* Quiz 1: Easy */}
      <LocatorQuiz
        question="Write a locator for the username input field."
        context='The input has a label "Username" and type="text".'
        targetHtml='<label for="username">Username</label>\n<input id="username" type="text" />'
        expectedAnswer='page.getByLabel("Username")'
        placeholder='page.getByLabel("...")'
        hints={[
          "When an input has a visible label, getByLabel() is the most reliable locator.",
        ]}
      />

      {/* More lesson content */}
      <section>
        <h3 className="text-sm font-semibold text-zinc-200 mb-2 flex items-center gap-2">
          <span className="w-1 h-4 bg-emerald-500 rounded-full inline-block flex-shrink-0" />
          Targeting Buttons by Role
        </h3>
        <p className="text-[13px] text-zinc-400 leading-relaxed">
          Buttons should typically be located by their accessible role and visible
          name. This approach is resilient to CSS class changes and DOM restructuring.
        </p>
      </section>

      {/* Quiz 2: Medium */}
      <LocatorQuiz
        question="Write a locator for the Sign In button."
        targetHtml='<button type="submit" class="btn-primary">Sign In</button>'
        expectedAnswer='page.getByRole("button", { name: "Sign In" })'
        hints={[
          'Use getByRole() with the "button" role.',
          "Include the name option to match the button text.",
        ]}
      />
    </div>
  );
}
