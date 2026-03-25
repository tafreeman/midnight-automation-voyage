# Implementation Plan: Curriculum Architecture Upgrade + Content Gaps

**Date:** 2026-03-22
**Status:** Approved for implementation
**Depends on:** ADR-01 through ADR-04 (see ROADMAP.md)

This plan addresses two categories of work:
1. **Architecture fixes** — the curriculum adapter drops content and flattens modules
2. **Content gaps** — missing Playwright topics and incomplete coverage

---

## Current State (Verified)

### What the adapter does today

`data/curriculum.ts` transforms 31 legacy module files into V2 `Module[]`:

```
modules/*.ts → data/index.ts (passthrough) → data/curriculum.ts (adapter) → App.tsx
```

**Problems confirmed by codebase inspection:**

| Issue | Evidence | Impact |
|-------|----------|--------|
| Single lesson per module | `lessons: [lesson]` at line 135 | Every module is one long page |
| Exercises dropped | `legacy.exercise ?? legacy.exercises?.[0]` at line 116 | 18 exercises hidden (9 modules x 3 tiers, only beginner kept) |
| Synthetic metadata | Difficulty from module number (line 24), time from section count (line 30), objectives from first 3 headings (line 37) | Inaccurate estimates, generic objectives |
| 4 block types only | text, code, callout, table in `types/curriculum.ts` | Can't render checklists, step sequences, stat groups |
| Single-question quiz | `Quiz = {question, options[], correctIndex, explanation}` | Shallow knowledge checks |

### What already works

- V2 `Module.lessons: Lesson[]` type supports multi-lesson — code in App.tsx already uses `findIndex` and `lessons.length`
- Legacy `LessonView.tsx` has a working `ExercisesSection` component that renders multiple exercises with difficulty filtering (currently dead code)
- `ProgressContext.tsx` with versioned localStorage key (`mav-progress-v3`) — ready for schema migration
- Hash routing already supports `#lesson/{moduleId}/{lessonId}` pattern

### Playwright content coverage (verified)

| Topic | Current Coverage | Gap Level |
|-------|-----------------|-----------|
| Network interception / `page.route()` | Module 10 — comprehensive with code examples | None |
| UI Mode (`--ui`) | Modules 05, 15 — command listed, not explained | Moderate |
| iFrames / `frameLocator()` | Not mentioned anywhere | Critical |
| Emulation (geolocation, timezone, locale) | Module 23 — viewports only | Moderate |
| File downloads/uploads/drag-and-drop | Not mentioned anywhere | Critical |
| Global setup/teardown | Modules 16, 20 — good but missing `globalTeardown` | Minor |

---

## Phase 1: Stop Content Loss (No UI Changes)

**Goal:** Surface all 27 authored exercises (9 hidden tiers x 3) without changing any UI components.

### 1a. Add `exercises[]` to V2 Lesson type

**File:** `training-app/src/types/curriculum.ts`

Add `exercises?: CodeExercise[]` alongside the existing `exercise?: CodeExercise`. Both remain optional for backward compatibility.

### 1b. Fix the adapter

**File:** `training-app/src/data/curriculum.ts`

Change `lessonFromLegacy()` (line 108-119):

```typescript
// Before
exercise: legacy.exercise ?? legacy.exercises?.[0],

// After
exercise: legacy.exercise ?? legacy.exercises?.[0],
exercises: legacy.exercises ?? (legacy.exercise ? [legacy.exercise] : undefined),
```

This normalizes both patterns into `exercises[]` while keeping `exercise` for backward compat.

### 1c. Update rendering to use exercises[]

**File:** `training-app/src/pages/LessonDetailPage.tsx`

Replace the single `ExercisePanel` render with a loop over `exercises[]`. Reuse the existing `ExercisesSection` pattern from the legacy `LessonView.tsx` (lines 411-462) which already supports difficulty filtering.

### 1d. Update progress tracking

**File:** `training-app/src/contexts/ProgressContext.tsx`

Exercise completion tracking needs to handle multiple exercises per lesson. Change from `exerciseCompleted: boolean` to `exercisesCompleted: string[]` (array of exercise titles). Add migration from `mav-progress-v3` to `mav-progress-v4`.

**Estimated effort:** Small-medium. 4 files changed, no new components needed.

---

## Phase 2: Authored Metadata

**Goal:** Replace synthetic metadata with accurate, authored values.

### 2a. Add metadata fields to legacy Lesson type

**File:** `training-app/src/data/types.ts`

Add optional fields to legacy `Lesson`:
- `estimatedMinutes?: number`
- `learningObjectives?: string[]`
- `prerequisites?: string[]`
- `difficulty?: 'beginner' | 'intermediate' | 'advanced'`

### 2b. Update adapter to prefer authored metadata

**File:** `training-app/src/data/curriculum.ts`

```typescript
// Before
estimatedMinutes: estimatedMinutesFromLegacy(legacy),
difficulty: difficultyForModule(moduleNumber),
learningObjectives: learningObjectivesFromLegacy(legacy),

// After
estimatedMinutes: legacy.estimatedMinutes ?? estimatedMinutesFromLegacy(legacy),
difficulty: legacy.difficulty ?? difficultyForModule(moduleNumber),
learningObjectives: legacy.learningObjectives ?? learningObjectivesFromLegacy(legacy),
```

### 2c. Author metadata for pilot modules

Add `estimatedMinutes`, `learningObjectives`, and `difficulty` to these 5 modules first:
- Module 01 (Orientation) — conceptual, should be ~10 min
- Module 07 (Record & Refine) — hands-on, should be ~25 min
- Module 16 (Auth Fixtures) — enterprise, should be ~30 min
- Module 21 (Assessment) — capstone prep, should be ~20 min
- Module 28 (MCP/AI Agents) — advanced, should be ~35 min

Remaining modules get authored metadata in a follow-up wave.

**Estimated effort:** Small. Adapter change is 3 lines; metadata authoring is content work.

---

## Phase 3: Multi-Lesson Modules

**Goal:** Let modules define multiple lessons so content isn't one endless scroll.

### 3a. Splitting strategy

Not every module needs splitting. Criteria:
- Modules with 8+ sections → split into 2-3 lessons
- Modules with 3 difficulty tiers of exercises → one lesson per tier
- Conceptual modules (01-03) → leave as single lessons

### 3b. Define V2 module files

Create a new directory `training-app/src/data/v2-modules/` for modules that define multiple lessons natively. The adapter checks for a V2 definition first, falls back to legacy:

```typescript
// curriculum.ts
import { v2Modules } from './v2-modules';

export const curriculum: Module[] = legacyLessons.map((legacy, index) => {
  const moduleNumber = index + 1;
  const v2 = v2Modules[moduleNumber];
  if (v2) return v2;
  // ... existing legacy conversion
});
```

### 3c. Progress migration

When a legacy single-lesson module splits into multiple lessons:
- If the old `lesson-07-01` was completed → mark all new lessons in module-07 as complete
- Notes move to the first lesson
- Scroll positions are discarded (can't map accurately)
- Bump to `mav-progress-v5`

### 3d. Pilot migration — 5 modules

| Module | Current Sections | Proposed Lessons |
|--------|-----------------|-----------------|
| 07 | 5 sections + 3 exercises | Lesson 1: Concept + beginner exercise; Lesson 2: Refinement + intermediate; Lesson 3: Full workflow + advanced |
| 14 | 6 sections | Lesson 1: Team workflows; Lesson 2: Review processes |
| 21 | 7 sections + 3 exercises | Lesson 1: Competency matrix; Lesson 2: Tier definitions; Lesson 3: Capstone prep |
| 25 | 6 sections | Lesson 1: Browser config; Lesson 2: Projects & matrix |
| 30 | 5 sections | Lesson 1: Baselines; Lesson 2: Thresholds & CI |

**Estimated effort:** Medium. New directory, adapter branching, progress migration, 5 module rewrites.

---

## Phase 4: Expand Block Types

**Goal:** Richer rendering without rewriting existing content.

### 4a. Add section types to V2

**File:** `training-app/src/types/curriculum.ts`

Add to the `Section` discriminated union:
- `ChecklistSection` (type: "checklist") — for HITL checklists, review criteria
- `StepsSection` (type: "steps") — for workflows, numbered sequences
- `StatGroupSection` (type: "stat-group") — for metrics, coverage stats
- `SummarySection` (type: "summary") — for lesson/module recaps

### 4b. Add renderers

**File:** `training-app/src/pages/LessonDetailPage.tsx`

Add cases to the `SectionBlock` switch for each new type. Keep rendering simple — these are content blocks, not interactive widgets.

### 4c. Optional `presentationHint`

Add `presentationHint?: 'default' | 'slide' | 'compact'` to Section base type. This lets the same content render differently in lesson view vs. a future deck/slide context without duplicating the data.

**Estimated effort:** Small-medium. Type additions + 4 new renderer components.

---

## Phase 5: Playwright Content Gaps

**Goal:** Fill the two critical and two moderate content gaps identified in the topic audit.

### 5a. New Module: Complex DOM Interactions (Module 32)

Covers the two critical gaps in one module:
- **iFrames & frameLocator()** — targeting elements in embedded frames, nested iframes, third-party widgets
- **File uploads** — `setInputFiles()`, hidden file inputs, drag-and-drop with `dragTo()`
- **File downloads** — `waitForEvent('download')`, saving and asserting downloaded files
- **Multiple tabs/pages** — `browserContext.waitForEvent('page')`, cross-tab flows
- **Clipboard** — reading/writing clipboard content in tests

**Practice app support:** Add a file upload component and an iframe embed to an existing practice page (or create a minimal `/interactions` page).

### 5b. Expand Module 23: Advanced Emulation

Add a new section to the existing Mobile & Responsive module:
- `geolocation` — `context.setGeolocation()`, permission grants
- `timezone` — `launchOptions.timezoneId` for date rendering tests
- `locale` — `contextOptions.locale` for i18n testing
- `permissions` — granting/denying camera, clipboard, notifications

### 5c. Expand Module 07 or 22: UI Mode

Add a dedicated section explaining Playwright UI Mode (`--ui`):
- What it is (interactive dashboard combining runner + trace + watch mode)
- When to use it vs. `--headed` vs. `--debug`
- How it accelerates the Record & Refine loop
- Best fits Module 07 (authoring workflow) or Module 22 (debugging tools)

### 5d. Expand Module 16: globalTeardown

Add a subsection covering:
- `globalTeardown` hook in `playwright.config.ts`
- Database cleanup patterns
- Multi-step global setup chains (seed → auth → cache warm)

**Estimated effort:** Medium. One new module file, 3 section expansions to existing modules, optional practice app page.

---

## Phase 6: Enrich Quiz Model (Future)

**Not in immediate scope.** Documented here for roadmap visibility.

The current quiz model (`Quiz = {question, options[], correctIndex, explanation}`) supports only one multiple-choice question per lesson. A richer model would support:
- Multiple questions per quiz
- Question types beyond multiple choice (fill-in-the-blank, ordering, matching)
- Scoring thresholds for certification gating

This is deferred because the current model is functional and the certification platform (ADR-04) is the higher-priority blocker.

---

## Delivery Sequence

```
Phase 1 ─── Stop content loss (18 hidden exercises surfaced)
  │
Phase 2 ─── Authored metadata (pilot 5 modules, then remaining)
  │
Phase 3 ─── Multi-lesson modules (pilot 5, then waves A+B)
  │
Phase 4 ─── Expanded block types (checklist, steps, stat-group, summary)
  │
Phase 5 ─── Playwright content gaps (Module 32 + expansions)
  │
Phase 6 ─── Quiz model enrichment (future, after ADR-04 certification)
```

Phases 1-2 can ship independently. Phase 3 depends on Phase 1 (exercises[] must work before splitting modules). Phase 4 is independent of 3. Phase 5 is pure content work, independent of all architecture phases.

---

## Test Plan

### Unit tests
- Adapter preserves all exercises from `exercises[]` arrays (9 modules x 3 = 27 total)
- Singular `exercise` normalizes to one-item `exercises[]`
- Authored metadata overrides generated metadata when present
- Legacy modules without V2 definitions still convert correctly
- Progress migration from v3→v4 preserves completed lessons and quiz scores

### Integration tests
- Modules with 3 exercises render all 3 with difficulty filters
- Multi-lesson modules (Phase 3) navigate correctly with prev/next
- Old hash URLs resolve to correct targets after module splits
- Progress migration doesn't lose completed state

### Manual verification
- Module 07: all 3 exercises visible (beginner/intermediate/advanced)
- Module 21: all 3 exercises visible with capstone plan prominently displayed
- New block types render correctly across all 4 themes
- Module 32 content is technically accurate against Playwright docs

---

## Files Changed (Phase 1 — Immediate)

| File | Change |
|------|--------|
| `training-app/src/types/curriculum.ts` | Add `exercises?: CodeExercise[]` to Lesson |
| `training-app/src/data/curriculum.ts` | Preserve full exercises[] in adapter |
| `training-app/src/pages/LessonDetailPage.tsx` | Render exercises[] with difficulty filter |
| `training-app/src/contexts/ProgressContext.tsx` | Multi-exercise completion tracking + v4 migration |

---

## Documents Updated

This plan supersedes and consolidates:
- The "Curriculum V2 Implementation Plan" from the Gemini conversation
- The "What's Holding It Back" analysis
- The Playwright ecosystem gap analysis

When implementation begins, update:
- `ROADMAP.md` — mark curriculum architecture as "active upgrade"
- `CLAUDE.md` — add note about V2 content model transition
- `ADR-03` — update status to note architecture work in progress
