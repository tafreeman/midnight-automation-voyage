# Design Framework Audit: LocatorQuiz Component

## Audit Summary

| Category | Rating | Notes |
|----------|--------|-------|
| Correctness & Trust | PASS | Expected answers are data-driven, not hardcoded in UI logic |
| Comprehension & Pacing | PASS | Follows concept-example-exercise cadence; fits inline scroll |
| Accessibility | PASS | Labels, aria-live, focus states, non-color-only diff, keyboard nav |
| Modularity & Reuse | PASS | Clean prop interface, no hardcoded content, composable |
| Implementation Realism | PASS | Follows existing LessonView patterns; drop-in compatible |
| Visual Polish | PASS | Consistent with existing dark workspace theme |

---

## 1. Correctness and Trust

**Status: PASS**

- The component does not contain any hardcoded answers. All quiz content (question, expectedAnswer, targetHtml, hints) flows through props, which come from the lesson data objects. This preserves the training triangle: lesson content, practice-app surface, and reference answer all remain synchronized through the data layer.
- The diff algorithm uses Longest Common Subsequence (LCS) for character-level comparison, which is appropriate for short Playwright locators. It normalizes whitespace before comparing, preventing false negatives from trivial spacing differences.
- The "Perfect match!" feedback only fires on exact normalized match, avoiding false positives.

**Potential concern:** The LCS-based diff has O(n*m) complexity. For typical Playwright locators (< 200 characters), this is negligible. For multi-line answers in future extensions, a line-level diff fallback should be considered.

---

## 2. Comprehension and Pacing

**Status: PASS**

- The component follows the instructional cadence from SKILL.md: question (concept) -> target HTML (example) -> code input (exercise) -> diff feedback (quiz) -> retry/reveal (recap).
- It embeds inline in the notebook-style scroll, maintaining the rhythmic "read - see - do" flow. It does NOT break the learner out to a separate page.
- Progressive hint reveal (one at a time) respects cognitive load limits.
- The diffSummary function provides calibrated encouragement: "Almost! Just a tiny difference" for near-matches, "Good effort" for larger gaps.

**Suggestion for future iteration:** Consider adding a "What to try next" micro-callout after the diff view for learners who are stuck, linking back to the relevant concept section.

---

## 3. Accessibility

**Status: PASS**

| Requirement | Implementation |
|-------------|---------------|
| Semantic labels | `<label htmlFor={inputId}>` on the code textarea |
| Screen reader announcements | `aria-live="polite"` on the feedback region |
| Non-color-only diff | Red/green diff highlights use text labels ("Your answer" / "Expected answer"), color swatches with text legend, and `aria-label` on diff segments |
| Keyboard navigation | Tab to input, Ctrl+Enter to submit, Tab to buttons |
| Focus states | `focus-within:border-emerald-500/30` on the input wrapper |
| Touch targets | All buttons use `px-4 py-2` padding (>44px effective height) |
| Code readability | 12px monospace font, adequate line height (`leading-relaxed`) |
| Contrast | Uses zinc-200/300/400 text on zinc-900 backgrounds (passes AA in dark theme) |

**Potential improvement:** Add `role="status"` to the diff summary line for explicit ARIA semantics. Consider adding `aria-describedby` linking the diff legend to the diff display.

---

## 4. Modularity and Reuse

**Status: PASS**

- Clean `LocatorQuizProps` interface with required and optional props.
- No internal dependencies on specific module content or routing.
- The component can be used for any code-answer quiz (not just locators) by adjusting props. The name "LocatorQuiz" is specific but the implementation is generic enough for reuse.
- Follows the existing component pattern: self-contained function component with local state, same as `QuizSection` and `ExerciseSection`.
- Sub-components (`InlineDiffDisplay`, `HintSection`) are internal but could be extracted if other components need them.
- The `charDiff` utility is a pure function that could be extracted to a shared utils file.

**Suggestion:** If more code-answer quiz types emerge, abstract the diff + feedback pattern into a shared `CodeAnswerQuiz` base component.

---

## 5. Implementation Realism

**Status: PASS**

- The component uses the same patterns as existing `LessonView.tsx` components:
  - Same border/background/text color classes (zinc-800, zinc-900/80, emerald-200/90)
  - Same header bar pattern (bg-zinc-800/40 with border-b)
  - Same button styles (bg-emerald-600, border-amber-500/30)
  - Same hint reveal pattern (border-l border-amber-500/20)
- Uses React hooks (`useState`, `useRef`, `useId`) -- all available in React 18+.
- No external dependencies beyond React itself.
- Integrates with the existing `Lesson` type via a simple `locatorQuiz` property extension.
- The `onAttempt` callback integrates with `LessonView`'s existing `canComplete` gating (quiz must be attempted before marking the lesson complete).

**Integration path:**
1. Add `LocatorQuizData` interface and `locatorQuiz?` field to `types.ts`
2. Import `LocatorQuiz` in `LessonView.tsx`
3. Render it alongside existing quiz/exercise sections
4. Populate quiz data in module data files

---

## 6. Visual Polish

**Status: PASS**

- Consistent with the dark workspace aesthetic (Family A, 70-80% usage).
- Uses the same visual vocabulary as existing components: zinc backgrounds, emerald accents for success, amber for hints/warnings, blue for info callouts.
- The diff view uses soft, muted red/green overlays (15% opacity) -- not alarming saturated colors. This matches the DiffView design rules from code-patterns.md.
- The component header uses a cyan icon to differentiate it from the existing quiz (amber) and exercise (blue) sections, creating a clear visual identity for "locator challenges" within the lesson scroll.

---

## 7. Voice & Tone

**Status: PASS**

| What it says | What it avoids |
|-------------|---------------|
| "Check Your Answer" | "Submit for Evaluation" |
| "Almost! Just a tiny difference." | "Wrong answer" |
| "Here's what's different" | "Errors found: 3" |
| "Try Again" | "Failed. Retry?" |
| "Need a hint?" | "You seem stuck" |
| "Perfect match!" | "CORRECT! 100%!" |
| "Good effort -- compare yours with the expected answer below." | "Incorrect. See the correct answer." |

This follows the SKILL.md voice guidance: clear, capable, calm, encouraging, technically specific.

---

## 8. Anti-Pattern Check

| Anti-Pattern | Status |
|-------------|--------|
| Marking answers as "wrong" | AVOIDED -- uses "Here's what's different" |
| Alarming red/green diff colors | AVOIDED -- uses rgba at 15% opacity |
| Hiding retry option | AVOIDED -- always available after attempt |
| Hiding expected answer | AVOIDED -- available after first attempt |
| Test-failure-report feel | AVOIDED -- uses summary line + gentle language |
| Separate page/modal | AVOIDED -- inline in lesson scroll |
| Hardcoded colors outside convention | AVOIDED -- same Tailwind classes as LessonView |
| Color-only diff signaling | AVOIDED -- uses text labels + legend + aria-labels |
| Decorative gradients | AVOIDED -- functional styling only |
| Magic numbers | AVOIDED -- uses standard Tailwind scale |

---

## Recommendations for Future Iterations

1. **Syntax highlighting**: Add syntax highlighting to the code input and diff display using a lightweight library (e.g., Prism.js or highlight.js) for better readability of TypeScript/Playwright code.

2. **Multiple acceptable answers**: Some locators have valid alternatives (e.g., `getByRole("button", { name: /sign in/i })` with regex). Consider supporting an array of `acceptableAnswers` and matching against the closest one.

3. **Partial credit scoring**: Instead of binary match/no-match, score how close the answer is (0-100%) and provide calibrated encouragement at each level.

4. **Answer history**: Track the learner's attempts so they can see their progression toward the correct answer.

5. **Theme token migration**: When the codebase migrates from hardcoded Tailwind classes to CSS custom property tokens, update this component to use semantic tokens (`--surface-code`, `--diff-added-bg`, etc.).
