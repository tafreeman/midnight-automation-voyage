# V2 Module Format Specification

## Overview

Phase 3 introduces multi-lesson modules — a single module can contain 2-3 lessons instead of exactly one. This document specifies the V2 module format, adapter changes, and migration path.

## Current State (V1)

Each legacy module file (`src/data/modules/XX-name.ts`) exports a single `Lesson` object. The `curriculum.ts` adapter wraps each into a `Module` with a `lessons: Lesson[]` array containing exactly one entry.

```
Legacy Lesson → moduleFromLegacy() → Module { lessons: [Lesson] }
```

The `Module` type in `src/types/curriculum.ts` already supports `lessons: Lesson[]` — no type changes needed.

## V2 Format

### Option A: Extend Legacy Files (Recommended)

Add an optional `lessons` array to the legacy `Lesson` type. When present, the adapter splits the module into multiple curriculum Lessons.

```typescript
// src/data/types.ts — add V2 support
export interface LessonV2 extends Lesson {
  lessons?: {
    title: string;
    subtitle: string;
    sectionRange: [number, number]; // indices into parent sections[]
    quizIncluded?: boolean;
    exerciseIndices?: number[];     // indices into parent exercises[]
  }[];
}
```

### Detection Logic

```typescript
function isV2Module(lesson: Lesson): lesson is LessonV2 {
  return 'lessons' in lesson && Array.isArray((lesson as any).lessons);
}
```

### Adapter Function

```typescript
// curriculum.ts — new function
function multiLessonModule(
  legacy: LessonV2,
  moduleNumber: number,
  overrides?: Partial<Pick<Module, 'title' | 'subtitle' | 'difficulty' | 'theme'>>,
): Module {
  const allSections = sectionsFromLegacy(legacy);
  const allExercises = exercisesFromLegacy(legacy) ?? [];
  
  const lessons: CurriculumLesson[] = legacy.lessons!.map((def, idx) => {
    const [start, end] = def.sectionRange;
    const lessonSections = allSections.slice(start, end);
    const lessonExercises = def.exerciseIndices?.map(i => allExercises[i]);
    
    return {
      id: `lesson-${pad(moduleNumber)}-${pad(idx + 1)}`,
      title: def.title,
      subtitle: def.subtitle,
      estimatedMinutes: Math.max(8, lessonSections.length * 3 + (lessonExercises?.length ?? 0) * 6),
      sections: lessonSections,
      quiz: def.quizIncluded ? quizFromLegacy(legacy) : undefined,
      exercise: lessonExercises?.[0],
      exercises: lessonExercises?.length ? lessonExercises : undefined,
      promptTemplates: idx === 0 ? legacy.promptTemplates : undefined,
      practiceLink: legacy.practiceLink,
      narrationScript: idx === 0 ? narrationScriptFromLegacy(legacy) : undefined,
    };
  });

  const totalMinutes = lessons.reduce((sum, l) => sum + l.estimatedMinutes, 0);

  return {
    id: `module-${pad(moduleNumber)}`,
    number: moduleNumber,
    title: overrides?.title ?? legacy.title,
    subtitle: overrides?.subtitle ?? legacy.subtitle,
    icon: legacy.icon,
    theme: overrides?.theme ?? themeForModule(moduleNumber),
    difficulty: overrides?.difficulty ?? difficultyForModule(moduleNumber),
    estimatedMinutes: totalMinutes,
    learningObjectives: learningObjectivesFromLegacy(legacy),
    lessons,
  };
}
```

### Option B: Separate V2 Directory

Create `src/data/v2-modules/` with a new file format. Rejected because:
- Duplicates content already in legacy files
- Requires a separate registry
- More code to maintain

## Splitting Criteria

A module is a candidate for multi-lesson splitting when:

| Criterion | Threshold | Weight |
|-----------|-----------|--------|
| Section count | >= 6 | Primary |
| Exercise count | >= 2 | Secondary |
| Total content items (sections + exercises + quiz questions) | >= 10 | Combined |
| Estimated minutes (current formula) | >= 25 | Confirmation |

If any primary threshold is met AND at least one secondary/combined threshold is met, the module should be split.

## Directory Structure

No new directories. V2 modules continue to live in `src/data/modules/` with optional `lessons` metadata added to existing exports. The adapter in `curriculum.ts` handles the branching.

## Lesson ID Scheme

```
lesson-{moduleNumber}-{lessonIndex}
  lesson-07-01  (first lesson in module 07)
  lesson-07-02  (second lesson in module 07)
  lesson-21-01  (first lesson in module 21)
  lesson-21-02  (second lesson in module 21)
  lesson-21-03  (third lesson in module 21)
```

Module numbers are padded to 2 digits. Lesson indices start at 01.
