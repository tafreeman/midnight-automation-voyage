# Content & UI Audit Report

**Date:** 2026-03-24
**Scope:** All 9 active "First Playwright Tests" course modules, UI page density, legacy module overlap
**Total Issues Found:** 72 (27 High, 24 Medium, 21 Low)

---

## Executive Summary

Five parallel audit agents reviewed the entire training platform. The findings fall into four priority tiers:

| Priority | Category | Count | Impact |
|----------|----------|-------|--------|
| P0 | Broken references that block learners | 8 | Tests won't run, exercises reference wrong elements |
| P1 | Dead files and duplicate IDs | 4 | Build confusion, stale imports |
| P2 | Content quality (duplication, weak exercises) | 32 | Wasted learner time, inconsistent messaging |
| P3 | UI density (content below fold) | 28 | Poor UX, excessive scrolling on every page |

---

## P0: Fix Immediately (Broken References)

These items produce incorrect behavior — learners following instructions will hit errors.

| # | Module | Issue | Fix |
|---|--------|-------|-----|
| 1 | 05 (Install Playwright) | CLI commands use `npx` but CLAUDE.md says npm is required on Windows | Change to `npm exec playwright` or add platform note |
| 2 | 06 (Writing First Test) | Exercise calls `createExerciseLab(targetFile, runCommand, successCriteria, hints)` with 4 args — function signature only accepts 3 | Remove the 4th argument |
| 3 | 06 (Writing First Test) | Code example references `data-testid="login-button"` but practice app login page button uses `getByRole('button', { name: 'Sign In' })` pattern | Verify actual test IDs in practice app HTML and update |
| 4 | 07 (Recording) | Password in example uses `Password123` (no `!`) but practice app credentials are `Password123!` | Add the `!` |
| 5 | 07 (Recording) | Route `/checkout/shipping` referenced but practice app checkout starts at `/checkout` | Verify actual route and fix |
| 6 | 09 (Reading Results) | References trace viewer command `npx playwright show-trace` — correct command is `npx playwright show-report` for HTML report | Fix command |
| 7 | 10 (Build Test Pack) | Exercise references `admin-invite-form` data-testid — verify this exists in practice app | Check admin page HTML |
| 8 | 04 (Selectors) | Example shows `page.locator('.btn-primary')` as CSS — practice app may not use this class | Verify actual CSS classes |

---

## P1: Delete Dead Files

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `courses/first-playwright-tests/modules/06-ask-copilot-for-a-useful-draft.ts` | Stale duplicate — superseded by current module 06 | Delete file |
| 2 | `courses/first-playwright-tests/modules/08-tighten-and-rerun-the-recording.ts` | Stale duplicate — superseded by current module 08 | Delete file |
| 3 | `data/curriculum.ts` line 351 | `legacyById()` has duplicate id:3 | Fix ID mapping |
| 4 | `data/courses/` vs `data/modules/` | Two competing beginner courses in course selector (GET TESTING + FIRST PLAYWRIGHT TESTS) | Remove or hide the legacy "Get Testing" course |

---

## P2: Content Quality Fixes

### Duplicate Content (High)

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 1 | AAA pattern taught 3 times identically | Modules 03, 06, 07 | Teach in 03 only; reference in 06/07 |
| 2 | Locator priority table duplicated | Modules 04, 06, 08 | Definitive version in 04; quick reference in 06/08 |
| 3 | CARD formula explained twice | Modules 06, 07 | Introduce in 06; apply in 07 without re-explaining |
| 4 | "Five mindset shifts" listed in 2 modules | Modules 01, 03 | Keep in 01 (orientation); remove from 03 |
| 5 | Auto-wait explanation repeated | Modules 05, 06 | Explain in 05 (toolkit); reference in 06 |
| 6 | Practice app credentials listed in 4+ locations | Modules 01, 05, 06, 07 | Single source: shared.ts credentials constant; reference it |

### Exercise Quality (Medium)

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 7 | Module 01 has no exercises (orientation only) | Module 01 | Acceptable — orientation lesson |
| 8 | Module 02 exercise is just "run the app" | Module 02 | Add: "modify example test to navigate to practice app" |
| 9 | Module 03 beginner exercise is passive (just reading) | Module 03 | Add: "label each line as Arrange/Act/Assert" |
| 10 | Module 09 advanced exercise mentions "trace notes" but no trace data provided | Module 09 | Include sample trace output or screenshot |
| 11 | Module 10 exercises reference modules not yet built | Module 10 | Scope exercises to content covered in Course 1 |

### Cross-Reference Issues (Medium)

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 12 | Module 03 references "L5" and "L7" by old numbering | Module 03 | Update to current lesson numbers |
| 13 | Module 10 says "Course 2 adds page objects" but Course 2 isn't built yet | Module 10 | Change to "future courses will cover..." |
| 14 | Module 08 narration says "from L5" referring to old lesson order | Module 08 | Update reference |

### Narration Issues (Low)

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 15 | Module 01 narration step count mismatch (says 8, has 6) | Module 01 | Fix count or add missing steps |
| 16 | Module 05 narration refers to "the login test you wrote" — learner hasn't written one yet at this point | Module 05 | Reword to "the test you'll write" |
| 17 | Module 07 narration step for "honest about limitations" sounds defensive | Module 07 | Reword to state facts: "Two things to fix: selectors and assertions" |
| 18 | Several modules have narration that reads on-screen text verbatim | Modules 03, 04, 09 | Rewrite narration to add context, not repeat text |

---

## P3: UI Density Fixes

### Viewport Budget (1080p baseline)

Current state at 100% zoom on a 1080px display:

| Element | Height | Notes |
|---------|--------|-------|
| TopBar | 64px | Fixed navigation |
| Module breadcrumb | 48px | Could be inline with TopBar |
| LessonHero card | ~170px | Padded card with title + metadata |
| Narration bar (expanded) | ~200px | Expanded by default |
| Tab bar | 45px | Shown even for single-tab lessons |
| Spacing (space-y-10) | ~100px | 40px gaps between elements |
| **Total chrome before content** | **~627px** | **58% of viewport** |
| **Remaining for content** | **~453px** | Only 42% for actual lesson material |

### Top 5 Density Fixes (~400px recovery)

| # | Fix | Savings | File | Change |
|---|-----|---------|------|--------|
| 1 | **Collapse narration bar by default** | ~180px | `LessonDetailPage.tsx` | Change `useState(true)` → `useState(false)` on narration expanded state |
| 2 | **Flatten LessonHero** | ~80px | `LessonDetailPage.tsx` | Remove card wrapper, reduce padding from p-8 to p-4, inline metadata |
| 3 | **Hide tab bar for single-tab lessons** | ~45px | `LessonDetailPage.tsx` | Conditional render: only show tabs when lesson has multiple content tabs |
| 4 | **Reduce spacing** | ~60px | `LessonDetailPage.tsx` | Change `space-y-10` to `space-y-4`, remove trailing 64px spacer |
| 5 | **Widen content area** | 0px (width) | `AppShell.tsx` | Change `max-w-4xl` (896px) to `max-w-6xl` (1152px) — recovers ~256px horizontal |

### Additional UI Issues

| # | Issue | File | Fix |
|---|-------|------|-----|
| 6 | ModuleOverviewPage hero consumes ~280px before lesson list | `ModuleOverviewPage.tsx` | Flatten hero, move stats inline |
| 7 | Learning objectives section pushes lesson list below fold | `ModuleOverviewPage.tsx` | Collapse by default or move after lesson list |
| 8 | HeroStat cards show redundant info (lesson count shown twice) | `ModuleOverviewPage.tsx` | Remove duplicate stats |
| 9 | "Active Theme" badge in layout header | `layout/index.tsx` | Remove for production |
| 10 | BottomBar (64px) mostly empty space | `AppShell.tsx` | Reduce height or make contextual |
| 11 | Duplicate LessonHero component exists in `layout/index.tsx` | `layout/index.tsx` | Remove duplicate, use single source |
| 12 | `md:py-10` on main content area adds 40px top padding stacking with page padding | `AppShell.tsx` | Reduce to `md:py-4` |

---

## P4: Legacy Module Cleanup

### Modules Fully Superseded by New Course

These legacy modules in `src/data/modules/` are fully replaced by the "First Playwright Tests" course:

| Legacy Module | Superseded By | Action |
|---------------|---------------|--------|
| 01-orientation | Course modules 01-02 | Archive or hide |
| 02-mindset-shifts | Course module 03 | Archive or hide |
| 03-what-to-automate | Course module 06 | Archive or hide |
| 05-environment-setup | Course module 05 | Archive or hide |
| 06-copilot-prompt-engineering | Course module 06 | Archive or hide |
| 07-record-refine-workflow | Course modules 07-08 | Archive or hide |
| 12-reading-results | Course module 09 | Archive or hide |
| 13-hitl-checklist | Course module 10 | Archive or hide |

### Orphaned Legacy Modules (Not in Any Course)

| Module | Content | Recommendation |
|--------|---------|----------------|
| 04-why-playwright-copilot | Tool comparison | Merge relevant content into Course 1 Module 05 |
| 14-collaborative-test-authoring | Team workflows | Move to Course 2 or 3 |

### Content Taught in 3+ Locations

| Topic | Locations | Single Home |
|-------|-----------|-------------|
| AAA pattern | Legacy 02, Course 03, Course 06, Course 07 | Course 03 |
| Locator hierarchy | Legacy 04, Course 04, Course 06, Course 08 | Course 04 |
| CARD formula | Legacy 06, Course 06, Course 07 | Course 06 |
| Auto-wait | Legacy 04, Legacy 05, Course 05, Course 06 | Course 05 |

---

## Recommended Fix Order

1. **P0 broken references** (30 min) — Fix the 8 items that make exercises fail
2. **P1 dead files** (10 min) — Delete 2 stale files, fix duplicate ID, hide legacy course
3. **P3 top 5 density fixes** (20 min) — Recover ~400px of viewport, narration collapsed by default
4. **P2 deduplication** (60 min) — Remove repeated AAA/locator/CARD content from non-primary modules
5. **P3 remaining UI** (30 min) — ModuleOverview hero, redundant stats, misc chrome
6. **P4 legacy cleanup** (30 min) — Archive superseded modules, resolve orphans
7. **P2 narration fixes** (45 min) — Step count mismatches, verbatim reading, forward references

Total estimated effort: ~4 hours of focused work, parallelizable across 3 agents.
