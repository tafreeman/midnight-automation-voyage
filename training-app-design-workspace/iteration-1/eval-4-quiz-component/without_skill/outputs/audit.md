# LocatorQuiz Component — Audit

## 1. Consistency with Existing Patterns

| Aspect | Existing Pattern | LocatorQuiz | Status |
|--------|-----------------|-------------|--------|
| **Wrapper** | `mt-8 border border-zinc-800 rounded-lg overflow-hidden` | Same | PASS |
| **Header bar** | Colored icon + uppercase label in `px-5 py-3 bg-zinc-800/40` | Same (amber icon) | PASS |
| **Code blocks** | `bg-zinc-900/80`, `text-[12px]`, JetBrains Mono | Same | PASS |
| **Buttons** | `bg-emerald-600 hover:bg-emerald-500` primary, amber for secondary actions | Same | PASS |
| **Feedback panel** | Conditional green/amber bg with border | Same | PASS |
| **Hints** | Progressive reveal with `border-l border-amber-500/20` | Same + "show another" progressive reveal | PASS |
| **Try Again** | Amber border button, resets state | Same | PASS |
| **Typography** | `text-xs`, `text-sm`, zinc color scale | Same | PASS |

## 2. Accessibility Review

| Check | Status | Notes |
|-------|--------|-------|
| Textarea has implicit label via header | WARN | Could add `aria-label` for better screen reader support |
| Buttons have descriptive text | PASS | "Check Locator", "Try Again", "Need a hint?" |
| Color is not sole indicator | PASS | Text labels accompany color changes |
| Keyboard navigable | PASS | All interactive elements are native `<button>` and `<textarea>` |
| Disabled states communicated | PASS | `disabled` attribute + `opacity-30` + `cursor-not-allowed` |
| Diff legend provided | PASS | Color-coded legend with text labels for both diff colors |

### Recommendation
Add `aria-label="Your Playwright locator"` to the textarea for screen reader users.

## 3. Functional Review

| Scenario | Behavior | Status |
|----------|----------|--------|
| Empty input, click Check | Button disabled, no submission | PASS |
| Exact match (primary answer) | Green feedback, no diff shown, textarea locks | PASS |
| Exact match (acceptable alternative) | Same green feedback | PASS |
| Whitespace-only difference | Normalized comparison ignores extra spaces | PASS |
| Partial match / wrong answer | Amber feedback with character-level diff | PASS |
| Try Again resets | Clears submitted state, keeps input text | PASS — user can edit their previous attempt |
| Hints revealed progressively | Shows one at a time with "show another" button | PASS |
| onAttempt callback fires on submit | Called once per submission | PASS |

## 4. Diff Algorithm Review

The component uses a Longest Common Subsequence (LCS) approach for character-level diffing.

**Strengths:**
- Produces intuitive diffs for short strings (locators are typically <100 chars)
- Correctly handles insertions, deletions, and substitutions
- Segments are collapsed for clean rendering (no per-character spans)

**Limitations:**
- O(m*n) complexity — fine for locator-length strings, would need optimization for longer content
- Does not detect moves/transpositions as a unit (e.g., swapped arguments appear as separate edits)

**Verdict:** Appropriate for the use case. Locators are short enough that performance is not a concern.

## 5. Data Model Integration

The `LocatorQuizData` interface is designed to be added as an optional field on the existing `Lesson` type, following the same pattern as `quiz?: Quiz` and `exercise?: CodeExercise`.

**Type extension required in `training-app/src/data/types.ts`:**
```typescript
locatorQuiz?: LocatorQuizData;
```

**LessonView rendering slot (after line 442 in LessonView.tsx):**
```typescript
{lesson.locatorQuiz && (
  <LocatorQuiz quiz={lesson.locatorQuiz} onAttempt={() => setQuizAttempted(true)} />
)}
```

No changes needed to the lesson registry or navigation logic.

## 6. Theme Compliance

The component uses exclusively the zinc/emerald/amber color palette established by the existing LessonView components. No new colors, no inline styles (except the shared JetBrains Mono font-family pattern). Tailwind classes match the existing utility patterns.

## 7. Edge Cases

| Edge Case | Handling |
|-----------|----------|
| Very long locator input | `whitespace-pre-wrap break-all` on diff output, `overflow-x-auto` on textarea |
| Pasting multi-line code | Textarea supports multiple lines (rows=2, resizable) |
| No hints provided | Hint button hidden entirely |
| No explanation provided | Explanation paragraph omitted |
| No acceptable alternatives | Only primary answer used for matching |
| User submits, gets diff, tries again, matches | Green feedback on second attempt works correctly |

## 8. Summary

The component is ready for integration. It follows all existing patterns, uses gentle feedback language, provides character-level visual diffs, and slots cleanly into the lesson scroll. The only recommended enhancement is adding an `aria-label` to the textarea.
