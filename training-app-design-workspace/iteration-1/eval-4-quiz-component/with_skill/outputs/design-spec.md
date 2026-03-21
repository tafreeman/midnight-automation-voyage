# LocatorQuiz Component Design Spec

## 1. Screen/Component Purpose

An inline code-answer quiz component that asks the learner to write a Playwright locator (e.g., for a login button). It accepts free-text code input, compares it to the expected answer with a character-level visual diff, and provides gentle, encouraging feedback. Designed to embed directly in the lesson scroll (notebook-style flow), not as a separate page.

## 2. Audience

Manual testers learning Playwright. May feel uncertain about writing code. The component must feel safe, educational, and non-punitive.

## 3. Visual Family

**Family A (Dark technical workspace)** for the shell and code editor areas, consistent with how the current `QuizSection` and `ExerciseSection` components render in `LessonView.tsx`. The component inherits the module's current theme tokens.

## 4. Layout Selection

**Inline within lesson scroll** -- not a standalone page. Uses the existing notebook-style content column (max `65ch` for prose, full-width for code blocks). This follows the `two-col` lesson detail layout where the quiz sits between content sections.

Layout ID: N/A (inline component within `two-col` lesson detail)

## 5. Components Used

- **CodeBlock** (existing) -- reference for styling code input/output areas
- **DiffView** (new inline variant) -- character-level diff between learner answer and expected answer
- **CalloutBox** (existing pattern) -- for feedback messaging
- **BadgePill** (existing pattern) -- for status indicators

## 6. Component API

```typescript
interface LocatorQuizProps {
  /** The question prompt, e.g., "Write a Playwright locator for the login button" */
  question: string;
  /** Context hint shown above the editor, e.g., "The button says 'Sign In' and has role='button'" */
  context?: string;
  /** HTML snippet showing the target element for reference */
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
```

### State Machine

```
idle -> attempted -> (matched | diffing)
                        |
                        v
                   can retry -> attempted -> ...
```

- **idle**: Editor visible, "Check your answer" button enabled
- **attempted**: Answer submitted, comparison runs
- **matched**: Perfect match -- success feedback
- **diffing**: Differences found -- gentle diff view with encouragement

## 7. Content Cadence

Within the lesson scroll:
1. Context/question text (1-2 sentences)
2. Optional HTML snippet showing the target element
3. Code input area (single-line or multi-line textarea styled as a code editor)
4. "Check your answer" button
5. Feedback area (diff view or success message)
6. "Try again" option (always available)
7. "Show expected answer" toggle (available after first attempt)
8. Optional hints (progressive reveal)

## 8. Theme/Token Guidance

All styling uses semantic tokens from the current module theme:

| Element | Token |
|---------|-------|
| Component border | `--border-subtle` (zinc-800 in current theme) |
| Header background | `--surface-elevated` (zinc-800/40) |
| Code input background | `--surface-code` (zinc-900/80) |
| Code input text | `--text-primary` (emerald-200/90 in dark) |
| Success feedback | `--accent-action` (emerald-500) |
| Diff added lines | `--diff-added-bg`, `--diff-added-text` |
| Diff removed lines | `--diff-removed-bg`, `--diff-removed-text` |
| Warning/hint accent | `--accent-highlight` (amber-500) |
| Neutral text | `--text-secondary` (zinc-400) |

Since the current codebase uses Tailwind utility classes with hardcoded zinc/emerald values (not CSS custom properties), the component follows the same convention for consistency with the existing `QuizSection`, `ExerciseSection`, and `DiffCodeBlock` components.

## 9. Accessibility Requirements

- Semantic `<label>` for the code input, associated via `htmlFor`/`id`
- `aria-live="polite"` region for feedback messages so screen readers announce results
- Diff view uses `+`/`-` prefixes and text labels alongside color (not color alone)
- All interactive elements have visible focus states
- Keyboard navigable: Tab to input, Enter/button to submit, Tab to hints/retry
- Min touch targets 44px for buttons
- Code input has adequate font size (min 12px/0.75rem monospace)

## 10. Anti-Patterns to Avoid

- Marking answers as "wrong" or "incorrect" -- use "Here's what's different"
- Red/alarming colors for mismatches -- use soft, muted diff colors
- Hiding the retry option -- always available
- Hiding the expected answer forever -- available after first attempt
- Making the diff feel like a test failure report
- Using a separate page/modal -- this embeds inline in the lesson scroll
- Hardcoding colors outside the existing Tailwind convention
- Overcomplicating the diff -- for single-line locators, a simple inline comparison is sufficient
