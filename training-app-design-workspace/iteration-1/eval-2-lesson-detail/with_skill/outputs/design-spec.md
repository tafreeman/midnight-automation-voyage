# Design Spec: Module 7 Lesson 3 — Writing Your First Playwright Test

## 1. Screen Purpose
Teach the learner to write a basic Playwright test using `page.goto()` and `page.click()`, then apply that knowledge by writing a test against the practice-app login page. This is a core "hands-on first code" lesson — possibly the single most important lesson in the course.

## 2. Audience
Manual testers transitioning to automation. Mix of non-coders (primary) and developers (secondary). Learners have already seen codegen recording in Module 7 Lesson 1-2 and are now writing code by hand for the first time.

## 3. Visual Family
- **Family A (dark technical workspace)** — 80% of screen. Shell, navigation, code blocks.
- **Family B (editorial handbook)** — 20%. Prose sections in the content lane.
- Module 7 is odd-numbered, so **dark theme** per cycling rules.

## 4. Theme
**Signal Cobalt** — Module 7 is odd, and `Math.floor(7/4) % 2 === 1` maps to `darkThemes[1]` which is `gamma-dark` per the cycling function. However, since this is a code-heavy lesson about writing tests, Signal Cobalt (engineering-forward, monospace-friendly) is the better fit. The cycling function is a suggestion, not a mandate.

Correcting per the actual cycling function: `moduleNumber % 2 === 1` (true for 7), `Math.floor(7/4) % 2 = 1`, so `darkThemes[1]` = **Gamma Dark**.

**Final: Gamma Dark** — warm dark mode with orange/amber accents. Developer-friendly coding environment feel.

### Token Values Applied
```
--surface-primary: #1a1a2e
--surface-elevated: #242442
--surface-code: #0d1117
--text-primary: #f0f0f0
--text-secondary: #8b8fa3
--accent-action: #a3e635    (progress, success)
--accent-info: #60a5fa      (links, navigation)
--accent-highlight: #fb923c  (warnings, key facts)
--accent-special: #f472b6    (chapter accents)
```

## 5. Layout
**Layout ID:** `two-col` (lesson detail variant)
- Left rail: Module navigation (240px)
- Main column: Notebook-style scrolling content (max 720px prose, full-width code)
- Right rail: Collapsed by default on this lesson (no complex support content needed yet)
- Bottom sticky: Back / Mark Complete / Next Lesson

## 6. Components Used
| Component | Role |
|-----------|------|
| LessonHero | Title, duration, position (Lesson 3 of 8), objective |
| ProgressIndicator | Dual-level: Module 7/30 course + Lesson 3/8 module |
| ConceptSection | Explaining page.goto() and page.click() |
| CodeBlock | Syntax-highlighted code examples (TypeScript/Playwright) |
| CalloutBox (tip) | Best practice notes on auto-waiting |
| CalloutBox (important) | Key concept about navigation vs interaction |
| WorkedExample | Complete test showing goto + click + assertion |
| ExerciseEditor | Editable code area for writing login page test |
| DiffView | Side-by-side comparison when checking answer |
| QuizSection | Knowledge check at end |
| NavigationFooter | Back / Mark Complete / Next |

## 7. Content Cadence
```
LessonHero (title, objective, progress)
  ↓ space-xl
ConceptSection: What is page.goto()?
  ↓ space-md
CodeBlock: Basic goto example
  ↓ space-md
CalloutBox (tip): Auto-waiting behavior
  ↓ space-xl
ConceptSection: What is page.click()?
  ↓ space-md
CodeBlock: Click with different locators
  ↓ space-md
CalloutBox (important): Locator strategies preview
  ↓ space-xl
WorkedExample: Complete test — navigate + click + assert
  ↓ space-md
CodeBlock: Full test with annotations
  ↓ space-2xl
ExerciseSection: Write a login test
  ↓ space-md
ExerciseEditor with starter code
  ↓ space-md
DiffView (on "Check Answer")
  ↓ space-xl
QuizSection: Knowledge check
  ↓ space-xl
NavigationFooter
```

## 8. Accessibility Requirements
- Semantic headings: H1 = lesson title, H2 = concept sections, H3 = code annotations
- All code blocks have language labels
- DiffView uses +/- prefixes and text labels, not just color
- Focus states visible in Gamma Dark theme (use --accent-info glow)
- Keyboard navigation: Tab through interactive elements, Enter to check answer
- Min 44px touch targets on all buttons
- Code block copy buttons have aria-labels
- Progress indicators have aria-live regions

## 9. Implementation Guidance
- The lesson page is a standalone React component that receives lesson data as props
- Code blocks use the existing CodeBlock component pattern from LessonView.tsx
- DiffView follows the existing DiffCodeBlock pattern but with side-by-side layout
- Exercise section adds an editable textarea (not a full code editor — keep it simple)
- Progress tracking uses the existing completedLessons Set pattern
- Theme is applied via data-theme attribute on the wrapper
- All colors use CSS custom properties (tokens), not hardcoded values

## 10. Anti-Patterns to Avoid
- Do NOT make the code editor a full IDE — a textarea with monospace font is sufficient
- Do NOT add confetti or heavy animation on correct answer
- Do NOT hide the solution — make it available after first attempt
- Do NOT use raw hex colors — all through tokens
- Do NOT stack two prose blocks without a visual break
- Do NOT make the exercise feel like a test — frame as guided practice
- Do NOT contradict practice-app behavior — use actual data-testid values from LoginPage.tsx
