# Comprehensive Test Plan — Midnight Automation Voyage Training App

> **Author:** Riley (QA Engineer)
> **Date:** 2026-04-02
> **Scope:** Phases 1-5 of the training app improvement project
> **Status:** Draft for team review

---

## 1. Current Test Infrastructure Assessment

### 1.1 What Exists Today

| Category | Status |
|----------|--------|
| Unit test runner (vitest/jest) | **Not installed** |
| Component test runner | **Not installed** |
| E2E test runner (Playwright) | **Not installed in training-app** (Playwright is a teaching topic, not a testing tool here) |
| Test files (`*.test.*`, `*.spec.*`) | **None** (zero project-level test files) |
| Test scripts in package.json | **None** (only `dev`, `build`, `lint`, `preview`) |
| Test configuration files | **None** (no vitest.config, jest.config, playwright.config) |
| Type checking | **Yes** — `tsc -b` runs as part of `build` |
| Linting | **Yes** — ESLint with `eslint .` |
| Visual/manual testing | **Informal** — dev server only |

### 1.2 Key Finding

The project has **zero automated tests**. The CLAUDE.md for the presentation project mentions "No vitest" and "Visual testing only via Storybook", but this training-app has neither vitest nor Storybook. The only quality gates are TypeScript compilation and ESLint.

### 1.3 Testing Gap Summary

- No unit tests for data transformation logic (curriculum.ts, ProgressContext)
- No integration tests for exercise preservation through the adapter pipeline
- No render tests for components (LessonDetailPage, ExercisesOrSingle, QuizPanel)
- No data validation tests for the 31+ module files and 2 course structures
- No regression tests for hash-based routing
- No accessibility tests for the UI

---

## 2. Test Strategy Recommendation

### 2.1 Framework Choice: Vitest

**Recommendation:** Install **Vitest** as the test runner.

**Rationale:**
- Native Vite integration (the project already uses Vite 8)
- Zero-config for the existing `vite.config.ts` setup
- Fast HMR-aware watch mode
- Compatible with the existing TypeScript + path alias (`@/`) configuration
- Supports both unit and component testing (via `@testing-library/react` if needed later)

**Installation:**
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Configuration (`vitest.config.ts`):**
```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
  },
}));
```

**Add to `package.json` scripts:**
```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage"
}
```

### 2.2 Test Tiers

| Tier | Tool | Scope | Run Frequency |
|------|------|-------|---------------|
| **T1: Data Validation** | Vitest (pure functions) | Module data, curriculum transforms, exercise counts | Every commit |
| **T2: Unit Tests** | Vitest | Adapter functions, metadata generation, progress logic | Every commit |
| **T3: Component Tests** | Vitest + Testing Library | Render tests for key components | Every PR |
| **T4: Manual Verification** | Checklist | Visual inspection, theme cycling, navigation | Each phase milestone |

---

## 3. Phase 1 Test Cases — Stop Content Loss

### Context
The `exercisesFromLegacy()` function in `curriculum.ts` (line 143-147) transforms legacy `exercise`/`exercises` fields into the new curriculum format. The `ExercisesOrSingle` component in `LessonDetailPage.tsx` (line 728-736) decides how to render based on `exercises.length`.

**Critical bug surface:** If `exercisesFromLegacy()` drops exercises, or if the adapter normalizes `exercises[]` to just `exercise` (singular), content is silently lost.

### T1-P1: Data Validation Tests

```
TEST-P1-01: Count exercises in all 31 legacy module files
  Input: Import all lessons from src/data/modules/
  Assert: Total exercise count matches expected inventory
  Expected: 17 modules have exercises[] arrays, 15 modules have singular exercise

TEST-P1-02: Modules with exercises[] preserve all items through adapter
  Input: For each module with exercises[], run exercisesFromLegacy()
  Assert: Output array length === input exercises[] length
  Specific checks:
    - 08-writing-tests.ts: exercises[] has 3 items -> adapter returns 3
    - 19-flaky-test-diagnosis.ts: exercises[] has 3 items -> adapter returns 3
    - 16-auth-fixtures.ts: exercises[] has 3 items -> adapter returns 3
    - 17-visual-regression.ts: exercises[] has 3 items -> adapter returns 3

TEST-P1-03: Modules with singular exercise normalize to exercises[0]
  Input: Modules with only exercise (not exercises[])
  Assert: exercisesFromLegacy() returns [exercise] (array of 1)
  Assert: result[0] === original exercise object

TEST-P1-04: Modules with no exercise return undefined
  Input: Modules like 01-orientation (no exercise field)
  Assert: exercisesFromLegacy() returns undefined

TEST-P1-05: mergeExercises preserves all exercises from multiple legacy lessons
  Input: Two legacy lessons, each with 2 exercises
  Assert: mergeExercises() returns array of 4
  Assert: All exercise titles are present
```

### T2-P1: Adapter Unit Tests

```
TEST-P1-06: lessonFromLegacy preserves both exercise and exercises fields
  Input: Legacy lesson with exercises: [ex1, ex2, ex3]
  Assert: result.exercise === ex1
  Assert: result.exercises === [ex1, ex2, ex3]
  Assert: result.exercises.length === 3

TEST-P1-07: moduleFromLegacy creates lesson with correct exercise data
  Input: Legacy lesson index 9 (08-writing-tests, has 3 exercises)
  Assert: module.lessons[0].exercises.length === 3

TEST-P1-08: mergedModule preserves exercises from all source lessons
  Input: Two lessons, first with 2 exercises, second with 1
  Assert: merged module lesson has 3 exercises

TEST-P1-09: splitModuleFirstHalf has no exercises (by design)
  Input: Legacy lesson with exercises
  Assert: firstHalf.lessons[0].exercises === undefined

TEST-P1-10: splitModuleSecondHalf preserves all exercises
  Input: Legacy lesson with 3 exercises
  Assert: secondHalf.lessons[0].exercises.length === 3
```

### T3-P1: Render Integration Tests

```
TEST-P1-11: ExercisesOrSingle renders ExercisesPanel for multiple exercises
  Input: Lesson with exercises: [ex1, ex2, ex3]
  Assert: ExercisesPanel is rendered (not ExercisePanel)
  Assert: "Hands-On Exercises (3)" text is visible

TEST-P1-12: ExercisesOrSingle renders ExercisePanel for single exercise
  Input: Lesson with exercise: ex1, exercises: undefined
  Assert: ExercisePanel is rendered (singular)

TEST-P1-13: ExercisesOrSingle renders nothing when no exercises
  Input: Lesson with no exercise or exercises
  Assert: Component returns null

TEST-P1-14: LessonDetailPage correctly computes exercises array
  Input: Lesson with exercises: [ex1, ex2] (line 57 of LessonDetailPage.tsx)
  Assert: exercises variable has length 2
  Input: Lesson with only exercise: ex1
  Assert: exercises variable has length 1
```

### Manual Verification Checklist — Phase 1

- [ ] Navigate to module 08 (Writing Tests) — verify 3 exercise cards visible
- [ ] Navigate to module 19 (Flaky Test Diagnosis) — verify 3 exercise cards visible
- [ ] Navigate to module 16 (Auth Fixtures) — verify 3 exercise cards visible
- [ ] Navigate to module 05 (Environment Setup) — verify exercise card visible
- [ ] Navigate to module 01 (Orientation) — verify no exercise section shown
- [ ] Difficulty filter on exercises panel works (all/beginner/intermediate/advanced)

---

## 4. Phase 2 Test Cases — Authored Metadata

### Context
Modules currently generate synthetic metadata via helper functions:
- `themeForModule()` — assigns theme by module number
- `difficultyForModule()` — assigns difficulty by range
- `estimatedMinutesFromLegacy()` — estimates time from section count
- `learningObjectivesFromLegacy()` — generates objectives from section headings

Phase 2 adds optional authored metadata that overrides synthetic when present.

### T2-P2: Metadata Override Unit Tests

```
TEST-P2-01: Authored theme overrides synthetic theme
  Input: moduleFromLegacy(lesson, 1, { theme: "gamma-dark" })
  Assert: module.theme === "gamma-dark" (not "signal-cobalt" from themeForModule(1))

TEST-P2-02: Authored difficulty overrides synthetic difficulty
  Input: moduleFromLegacy(lesson, 1, { difficulty: "advanced" })
  Assert: module.difficulty === "advanced" (not "beginner" from difficultyForModule(1))

TEST-P2-03: Authored title/subtitle overrides legacy values
  Input: moduleFromLegacy(lesson, 1, { title: "Custom Title", subtitle: "Custom Sub" })
  Assert: module.title === "Custom Title"
  Assert: module.subtitle === "Custom Sub"

TEST-P2-04: Absent authored metadata falls back to synthetic
  Input: moduleFromLegacy(lesson, 1) — no overrides
  Assert: module.theme === themeForModule(1)
  Assert: module.difficulty === difficultyForModule(1)
  Assert: module.title === legacy.title

TEST-P2-05: themeForModule returns valid ThemeName for all 31 modules
  Input: moduleNumber 1..31
  Assert: All results are valid ThemeName values

TEST-P2-06: difficultyForModule returns correct tier boundaries
  Assert: difficultyForModule(1) === "beginner"
  Assert: difficultyForModule(12) === "beginner"
  Assert: difficultyForModule(13) === "intermediate"
  Assert: difficultyForModule(27) === "intermediate"
  Assert: difficultyForModule(28) === "advanced"
  Assert: difficultyForModule(31) === "advanced"

TEST-P2-07: estimatedMinutesFromLegacy clamps to [12, 36] range
  Input: Lesson with 1 section, no quiz, no exercise
  Assert: result >= 12
  Input: Lesson with 20 sections, quiz, exercises
  Assert: result <= 36
```

### T1-P2: Snapshot Tests for Pilot Modules

```
TEST-P2-08: Metadata snapshot for module-01 (Orientation)
  Assert: { theme, difficulty, estimatedMinutes, learningObjectives } matches snapshot

TEST-P2-09: Metadata snapshot for module-05 (Environment Setup)
  Assert: matches snapshot

TEST-P2-10: Metadata snapshot for module-10 (API Testing)
  Assert: matches snapshot

TEST-P2-11: Metadata snapshot for module-20 (Test Data Strategies)
  Assert: matches snapshot

TEST-P2-12: Metadata snapshot for module-31 (Custom Reporters)
  Assert: matches snapshot
```

### Manual Verification Checklist — Phase 2

- [ ] Module overview cards show correct difficulty badges
- [ ] Theme assignments produce visually distinct groupings in the sidebar
- [ ] Estimated time is reasonable (12-36 minutes per module)
- [ ] Learning objectives are readable and relevant

---

## 5. Phase 3 Test Cases — Multi-Lesson Modules

### Context
Currently all modules contain exactly 1 lesson (`lessons: [lesson]`). Phase 3 introduces multi-lesson modules where a single module can contain 2-4 lessons with their own navigation.

### T2-P3: Multi-Lesson Navigation Tests

```
TEST-P3-01: Module with 3 lessons provides correct lesson IDs
  Input: Module with lessons: [lesson1, lesson2, lesson3]
  Assert: module.lessons.length === 3
  Assert: Each lesson has unique ID

TEST-P3-02: findLesson resolves correct lesson from multi-lesson module
  Input: findLesson("module-05", "lesson-05-02")
  Assert: Returns second lesson, not first

TEST-P3-03: findLesson falls back to first lesson when ID not found
  Input: findLesson("module-05", "nonexistent-id")
  Assert: Returns module.lessons[0]

TEST-P3-04: flattenLessons correctly expands multi-lesson modules
  Input: [moduleWith1Lesson, moduleWith3Lessons]
  Assert: flattenLessons returns 4 items total
  Assert: Each item has correct { module, lesson } pairing
```

### T2-P3: Hash URL Resolution Tests

```
TEST-P3-05: Old hash URLs resolve after lesson splits
  Input: parseHash("#lesson/module-05/lesson-05-01")
  Assert: Returns { kind: "lesson", moduleId: "module-05", lessonId: "lesson-05-01" }

TEST-P3-06: New multi-lesson hash URLs parse correctly
  Input: parseHash("#lesson/module-05/lesson-05-03")
  Assert: Returns { kind: "lesson", moduleId: "module-05", lessonId: "lesson-05-03" }

TEST-P3-07: Module hash URL still works
  Input: parseHash("#module/module-05")
  Assert: Returns { kind: "module", moduleId: "module-05" }

TEST-P3-08: hashForView round-trips correctly
  Input: view = { kind: "lesson", moduleId: "module-05", lessonId: "lesson-05-02" }
  Assert: parseHash(hashForView(view)) deep-equals view
```

### T2-P3: Progress Migration Tests

```
TEST-P3-09: Progress v3 loads correctly (backward compat)
  Input: localStorage has mav-progress-v3 with existing completion data
  Assert: loadProgress returns valid CourseProgress with all modules intact

TEST-P3-10: Completed lessons survive module restructuring
  Input: Progress has completedLessons: ["lesson-05-01"]
  Assert: isLessonCompleted("module-05", "lesson-05-01") === true after migration

TEST-P3-11: Quiz scores survive progress migration
  Input: Progress has quizScores: { "lesson-05-01": 80 }
  Assert: getModuleProgress returns quizScores with original values

TEST-P3-12: getModuleCompletion calculates correctly for multi-lesson modules
  Input: Module has 3 lessons, 2 completed
  Assert: getModuleCompletion returns 67 (Math.round(2/3 * 100))

TEST-P3-13: getCourseCompletion counts lessons across multi-lesson modules
  Input: 2 modules: one single-lesson (completed), one 3-lesson (1 completed)
  Assert: getCourseCompletion(4) === 50
```

### Manual Verification Checklist — Phase 3

- [ ] Multi-lesson module shows lesson selector/tabs in UI
- [ ] Navigating between lessons within a module works
- [ ] Back button returns to module overview, not previous lesson
- [ ] Progress bar reflects per-lesson completion
- [ ] Bookmark URLs (#lesson/module-XX/lesson-XX-02) load correct lesson
- [ ] Old bookmarks (#lesson/module-XX/lesson-XX-01) still work

---

## 6. Phase 4 Test Cases — New Block Types

### Context
Current section types: `text`, `code`, `callout`, `table`. Phase 4 adds new block types for richer content.

### T3-P4: Render Tests for New Block Types

```
TEST-P4-01: Each new block type renders without crashing
  Input: Section with type = "<new-type>" and sample data
  Assert: Component mounts and produces visible content
  (Repeat for each new block type added)

TEST-P4-02: Unknown section type renders graceful fallback
  Input: Section with type = "nonexistent"
  Assert: Component renders fallback or null (no crash)

TEST-P4-03: Code block renders with copy button
  Input: CodeSection with language "typescript"
  Assert: Copy button is present and accessible

TEST-P4-04: Callout block renders all three variants
  Input: CalloutSection with variant = "tip" / "warning" / "info"
  Assert: Each variant has distinct visual styling

TEST-P4-05: Table block renders headers and rows
  Input: TableSection with 3 headers, 4 rows
  Assert: All cells are rendered
```

### T3-P4: Theme Compatibility Tests

```
TEST-P4-06: New block types render in all 6 themes
  Input: Each new block type with each ThemeName
  Assert: No missing CSS variables, no invisible text
  Themes: signal-cobalt, arctic-steel, linear, gamma-dark, zine-pop, handbook-notes

TEST-P4-07: Dark theme blocks have sufficient contrast
  Input: New blocks in signal-cobalt and gamma-dark
  Assert: Text color has WCAG AA contrast ratio against background
```

### T3-P4: Accessibility Tests

```
TEST-P4-08: All interactive elements are keyboard accessible
  Assert: Tab order includes all buttons, links, inputs in new blocks
  Assert: Enter/Space activates buttons

TEST-P4-09: Code blocks have appropriate ARIA labels
  Assert: Code blocks have role="code" or aria-label

TEST-P4-10: Callout blocks have appropriate roles
  Assert: Warning callouts have role="alert" or aria-live
  Assert: Info/tip callouts have role="note" or equivalent
```

### Manual Verification Checklist — Phase 4

- [ ] Each new block type is visually correct in light themes
- [ ] Each new block type is visually correct in dark themes
- [ ] Copy button works in code blocks
- [ ] Keyboard navigation reaches all interactive elements
- [ ] Screen reader announces block types appropriately

---

## 7. Phase 5 Test Cases — Content Gaps

### Context
Phase 5 fills content gaps — potentially adding Module 32 and expanding existing modules with more exercises, sections, and cross-references.

### T1-P5: Content Validation Tests

```
TEST-P5-01: All modules have required fields
  Input: Every module in all courses
  Assert: id, number, title, subtitle, icon, theme, difficulty, estimatedMinutes, learningObjectives, lessons are present
  Assert: lessons.length >= 1

TEST-P5-02: All lessons have required fields
  Input: Every lesson in all modules
  Assert: id, title, subtitle, estimatedMinutes, sections are present
  Assert: sections.length >= 1

TEST-P5-03: Module IDs are unique across all courses
  Input: Collect all module IDs from all courses
  Assert: No duplicates

TEST-P5-04: Lesson IDs are unique within their module
  Input: Each module's lessons
  Assert: No duplicate lesson IDs per module

TEST-P5-05: All code sections have valid language tags
  Input: Every CodeSection across all modules
  Assert: language is a non-empty string
  Assert: language is one of: typescript, javascript, bash, text, json, yaml, html, css

TEST-P5-06: All exercises have starter and solution code
  Input: Every CodeExercise across all modules
  Assert: starterCode is non-empty
  Assert: solutionCode is non-empty
  Assert: hints.length >= 1

TEST-P5-07: All quiz questions have valid structure
  Input: Every Quiz across all modules
  Assert: questions.length >= 1
  Assert: Each question has options.length >= 2
  Assert: correctIndex is within bounds (0..options.length-1)
  Assert: explanation is non-empty

TEST-P5-08: No orphan module references in courses
  Input: All modules referenced in course1Modules, course2Modules, course3Modules
  Assert: Each references a valid legacyLessons index

TEST-P5-09: Course exercise counts match expected totals
  Input: Each course
  Assert: Total exercises >= minimum threshold per course
```

### T1-P5: Code Example Syntax Validation

```
TEST-P5-10: TypeScript code examples parse without errors
  Input: Every CodeSection with language "typescript"
  Assert: Code parses as valid TypeScript (can use ts.createSourceFile)

TEST-P5-11: Exercise starter code is syntactically valid
  Input: Every CodeExercise.starterCode
  Assert: Parses as valid TypeScript/JavaScript

TEST-P5-12: Exercise solution code is syntactically valid
  Input: Every CodeExercise.solutionCode
  Assert: Parses as valid TypeScript/JavaScript
```

### T1-P5: Cross-Reference Validation

```
TEST-P5-13: Practice links use valid routes
  Input: All practiceLink.url values
  Assert: Each resolves to a known practice app route

TEST-P5-14: Exercise lab targetFiles reference valid paths
  Input: All ExerciseLab.targetFile values
  Assert: Path follows expected pattern (e.g., "tests/*.spec.ts")

TEST-P5-15: Narration step highlights reference valid testIds
  Input: All NarrationStep.highlight values
  Assert: Each is a plausible data-testid string
```

### Manual Verification Checklist — Phase 5

- [ ] New Module 32 (if added) appears in correct course and position
- [ ] All code examples in new content are syntax-highlighted correctly
- [ ] Cross-references between modules navigate correctly
- [ ] No "undefined" or "null" text appears in any lesson content
- [ ] Expanded exercises are properly difficulty-tagged

---

## 8. Regression Testing Strategy

### 8.1 What to Run on Every PR

| Test Suite | Scope | Expected Duration |
|------------|-------|-------------------|
| `vitest run` | All T1 + T2 tests | < 10 seconds |
| `tsc -b` | Type checking | < 15 seconds |
| `eslint .` | Lint rules | < 10 seconds |

### 8.2 What to Run on Phase Milestones

| Check | When |
|-------|------|
| Full manual verification checklist for the phase | Phase merge to main |
| Cross-phase regression (all previous checklists) | Every 2nd phase merge |
| Theme cycling through all 6 themes | Phase 4 and after |
| Progress data migration test (clear localStorage, verify fresh start) | Phase 3 and after |

### 8.3 Data Integrity Regression

After any module data change, run:
1. Exercise count validation (TEST-P1-01)
2. Module field validation (TEST-P5-01, TEST-P5-02)
3. Quiz structure validation (TEST-P5-07)
4. Course composition validation (TEST-P5-08)

### 8.4 Key Invariants to Monitor

| Invariant | Test |
|-----------|------|
| 31 legacy modules exist | `legacyLessons.length === 31` |
| 5 courses exist | `courses.length === 5` |
| Every module has at least 1 lesson | `module.lessons.length >= 1` |
| exercises[] is never silently truncated | TEST-P1-02 |
| Hash URLs round-trip | TEST-P3-08 |
| Progress localStorage key is stable | `DEFAULT_PROGRESS_KEY === "mav-progress-v3"` |

---

## 9. Test File Organization

```
src/
  test/
    setup.ts                          # Vitest setup (jsdom, test-library matchers)
  data/
    __tests__/
      exercise-preservation.test.ts   # Phase 1: T1-P1, T2-P1
      metadata-overrides.test.ts      # Phase 2: T2-P2
      metadata-snapshots.test.ts      # Phase 2: T1-P2
      curriculum-integrity.test.ts    # Phase 5: T1-P5
      code-syntax.test.ts             # Phase 5: syntax validation
  pages/
    __tests__/
      LessonDetailPage.test.tsx       # Phase 1: T3-P1, Phase 4: T3-P4
  contexts/
    __tests__/
      ProgressContext.test.tsx         # Phase 3: T2-P3 progress tests
  __tests__/
    routing.test.ts                   # Phase 3: hash URL tests
    navigation.test.ts                # Phase 3: multi-lesson navigation
```

---

## 10. Priority Order

| Priority | Test Group | Phase | Reason |
|----------|-----------|-------|--------|
| **P0** | Exercise preservation (T1-P1, T2-P1) | 1 | Content loss is the most critical bug |
| **P0** | Data integrity (T1-P5) | 5 | Prevents shipping broken content |
| **P1** | Metadata overrides (T2-P2) | 2 | Validates the authored-vs-synthetic contract |
| **P1** | Progress migration (T2-P3) | 3 | User data loss is high-severity |
| **P2** | Render tests (T3-P1, T3-P4) | 1,4 | Component correctness |
| **P2** | Hash URL round-trips (T2-P3) | 3 | Bookmarkability |
| **P3** | Theme compatibility (T3-P4) | 4 | Visual quality |
| **P3** | Accessibility (T3-P4) | 4 | Compliance |
| **P3** | Code syntax validation (T1-P5) | 5 | Content quality |
