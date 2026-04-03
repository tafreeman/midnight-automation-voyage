# Progress Migration Design: v3 to v4

## Overview

When single-lesson modules are split into multi-lesson modules, existing user progress must be preserved. This document specifies the migration from progress schema v3 (current) to v4.

## Current Schema (v3)

Storage key: `mav-progress-v3`

```typescript
interface CourseProgress {
  currentCourseId: string;
  currentModuleId: string;          // e.g., "module-07"
  currentLessonId: string;          // e.g., "lesson-07-01"
  currentSectionIndex: number;
  currentTab: string;
  modules: Record<string, ModuleProgress>;
  scrollPositions: Record<string, number>;
  lastAccessedAt: string;
  voicePreference?: { voice: string; speed: number };
}

interface ModuleProgress {
  started: boolean;
  completedLessons: string[];       // e.g., ["lesson-07-01"]
  quizScores: Record<string, number>;
  exerciseCompleted: Record<string, boolean>;
  notes: Record<string, string>;
}
```

## New Schema (v4)

Storage key: `mav-progress-v4`

Same TypeScript types — no structural changes needed. The types already support multiple lesson IDs per module. The migration is purely about data transformation.

### What Changes

| Field | v3 Value | v4 Value |
|-------|----------|----------|
| `completedLessons` | `["lesson-07-01"]` | `["lesson-07-01", "lesson-07-02"]` |
| `quizScores` | `{"lesson-07-01": 85}` | `{"lesson-07-02": 85}` (quiz moved to lesson 2) |
| `exerciseCompleted` | `{"lesson-07-01": true}` | `{"lesson-07-02": true}` (exercises moved to lesson 2) |
| `exerciseCompleted` | `{"lesson-07-01:Spot the Fragile Selectors": true}` | `{"lesson-07-02:Spot the Fragile Selectors": true}` |
| `currentLessonId` | `"lesson-07-01"` | `"lesson-07-01"` (no change — still valid) |
| `scrollPositions` | `{"lesson-07-01": 450}` | `{"lesson-07-01": 450}` (reset for split lessons is acceptable) |
| `notes` | `{"lesson-07-01": "my notes"}` | `{"lesson-07-01": "my notes"}` (keep on first lesson) |

## Migration Rules

### Rule 1: Grandfather Completion

If a user completed the single-lesson version of a module, mark ALL new lessons in that module as complete.

```typescript
// Before: completedLessons: ["lesson-07-01"]
// Module 07 now has 2 lessons
// After:  completedLessons: ["lesson-07-01", "lesson-07-02"]
```

**Rationale:** The user completed all the content. Splitting it into pieces doesn't un-complete what they learned.

### Rule 2: Relocate Quiz Scores

Quiz scores are keyed by lesson ID. When a quiz moves to a different lesson within the same module, remap the key.

```typescript
const QUIZ_RELOCATIONS: Record<string, string> = {
  // Module 07: quiz moves from lesson-07-01 to lesson-07-02
  "lesson-07-01": "lesson-07-02",
  // Module 14: quiz moves from lesson-14-01 to lesson-14-02
  "lesson-14-01": "lesson-14-02",
  // Module 21: quiz moves from lesson-21-01 to lesson-21-03
  "lesson-21-01": "lesson-21-03",
  // Module 25: quiz moves from lesson-25-01 to lesson-25-02
  "lesson-25-01": "lesson-25-02",
  // Module 30: quiz moves from lesson-30-01 to lesson-30-02
  "lesson-30-01": "lesson-30-02",
};
```

### Rule 3: Relocate Exercise Completion

Exercises are keyed as `lessonId` or `lessonId:exerciseTitle`. Remap based on which lesson now owns each exercise.

```typescript
const EXERCISE_RELOCATIONS: Record<string, string> = {
  // Module 07: all exercises move to lesson-07-02
  "lesson-07-01": "lesson-07-02",
  // Module 14: exercise stays in lesson-14-02
  "lesson-14-01": "lesson-14-02",
  // Module 21: exercises split across lessons 2 and 3
  // Beginner + Intermediate → lesson-21-02
  // Advanced → lesson-21-03
};

// For titled exercises, remap based on title
const EXERCISE_TITLE_RELOCATIONS: Record<string, string> = {
  "lesson-21-01:Write a Capstone Test Plan": "lesson-21-02:Write a Capstone Test Plan",
  "lesson-21-01:E2E Checkout Happy Path": "lesson-21-02:E2E Checkout Happy Path",
  "lesson-21-01:Checkout Validation and Edge Cases": "lesson-21-03:Checkout Validation and Edge Cases",
  "lesson-07-01:Spot the Fragile Selectors": "lesson-07-02:Spot the Fragile Selectors",
  "lesson-07-01:Replace Fragile Selectors with getByTestId": "lesson-07-02:Replace Fragile Selectors with getByTestId",
  "lesson-07-01:Transform Recording to Production Quality": "lesson-07-02:Transform Recording to Production Quality",
};
```

### Rule 4: Preserve Current Position

If `currentLessonId` is `lesson-XX-01` and that lesson still exists after the split, keep it. The user will see their current lesson unchanged.

### Rule 5: Preserve Notes and Scroll Positions

Notes stay on `lesson-XX-01` (the first lesson of the split module). Scroll positions reset for split modules — this is acceptable since the content is now reorganized.

## Migration Function

```typescript
// src/utils/progress-migration.ts

const SPLIT_MODULES = {
  "module-07": ["lesson-07-01", "lesson-07-02"],
  "module-14": ["lesson-14-01", "lesson-14-02"],
  "module-21": ["lesson-21-01", "lesson-21-02", "lesson-21-03"],
  "module-25": ["lesson-25-01", "lesson-25-02"],
  "module-30": ["lesson-30-01", "lesson-30-02"],
};

export function migrateV3toV4(v3: CourseProgress): CourseProgress {
  const v4 = structuredClone(v3);
  
  for (const [moduleId, newLessonIds] of Object.entries(SPLIT_MODULES)) {
    const moduleProgress = v4.modules[moduleId];
    if (!moduleProgress) continue;
    
    const oldLessonId = `lesson-${moduleId.replace('module-', '')}-01`;
    const wasCompleted = moduleProgress.completedLessons.includes(oldLessonId);
    
    // Rule 1: Grandfather completion
    if (wasCompleted) {
      moduleProgress.completedLessons = [...new Set([
        ...moduleProgress.completedLessons,
        ...newLessonIds,
      ])];
    }
    
    // Rule 2: Relocate quiz scores
    for (const [from, to] of Object.entries(QUIZ_RELOCATIONS)) {
      if (from in moduleProgress.quizScores) {
        moduleProgress.quizScores[to] = moduleProgress.quizScores[from];
        delete moduleProgress.quizScores[from];
      }
    }
    
    // Rule 3: Relocate exercise completion
    const newExerciseCompleted: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(moduleProgress.exerciseCompleted)) {
      const relocated = EXERCISE_TITLE_RELOCATIONS[key] ?? EXERCISE_RELOCATIONS[key] ?? key;
      newExerciseCompleted[relocated] = value;
    }
    moduleProgress.exerciseCompleted = newExerciseCompleted;
  }
  
  return v4;
}
```

## Integration Point

In `ProgressContext.tsx`, modify `loadProgress()`:

```typescript
function loadProgress(initialModuleId: string, initialLessonId: string, storageKey: string): CourseProgress {
  const fallback = createDefaultProgress(initialModuleId, initialLessonId);
  if (typeof window === "undefined") return fallback;
  
  try {
    // Check for v3 data first
    const v3Raw = window.localStorage.getItem("mav-progress-v3");
    if (v3Raw && !window.localStorage.getItem("mav-progress-v4")) {
      const v3 = JSON.parse(v3Raw) as CourseProgress;
      const v4 = migrateV3toV4(v3);
      window.localStorage.setItem("mav-progress-v4", JSON.stringify(v4));
      // Keep v3 as backup — do not delete
      return { ...fallback, ...v4 };
    }
    
    // Normal v4 load
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<CourseProgress>;
    return { ...fallback, ...parsed, modules: parsed.modules ?? {}, scrollPositions: parsed.scrollPositions ?? {} };
  } catch {
    return fallback;
  }
}
```

## Edge Cases

### Partially Completed Module
If a user started but did not complete the single-lesson module:
- `started: true, completedLessons: []` → No change needed. Module is started but no lessons are complete.
- User will see the first lesson of the split module.

### Quiz Score Without Completion
If a user has a quiz score but the lesson is not in `completedLessons`:
- Relocate the quiz score to the new lesson ID.
- Do not mark the lesson as complete — the user may have taken the quiz but not finished reading.

### Exercise Completed Without Lesson Completion
Same as quiz: relocate the exercise key, do not auto-complete the lesson.

### Module Not in Progress Data
If the user never visited the module, `modules[moduleId]` is undefined. No migration needed — the module defaults will create the correct multi-lesson structure.

### Storage Key Transition
- v3 key: `mav-progress-v3`
- v4 key: `mav-progress-v4`
- Migration runs once: when v3 exists but v4 does not
- v3 data is preserved as a backup (never deleted)
- After migration, v4 is the active storage key
