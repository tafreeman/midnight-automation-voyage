# Contributing

Thank you for your interest in contributing to Midnight Automation Voyage! This guide will help you get started.

## Ways to Contribute

### 1. Report Bugs or Issues

Found a problem? Please [open an issue](https://github.com/tafreeman/midnight-automation-voyage/issues) with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, Node version, browser)

### 2. Suggest Enhancements

Have an idea for improving the platform? Open an issue with the `enhancement` label:

- Describe the feature or improvement
- Explain the use case and benefits
- Provide examples if possible

### 3. Improve Documentation

Documentation improvements are always welcome:

- Fix typos or unclear instructions
- Add missing examples or explanations
- Improve course content or exercises
- Update README files

### 4. Contribute Code

#### Prerequisites

Before contributing code, ensure you have:

- Node.js 18+ installed
- pnpm 8+ (or npm as fallback)
- Git configured with your name and email
- A GitHub account

#### Development Setup

1. **Fork and clone the repository:**

```bash
git clone https://github.com/YOUR-USERNAME/midnight-automation-voyage.git
cd midnight-automation-voyage
```

2. **Install dependencies:**

```bash
# Install training-app dependencies
cd training-app && pnpm install

# Install practice-app dependencies
cd ../practice-app && pnpm install

# Install docs-site dependencies
cd ../docs-site && npm ci
```

3. **Start development servers:**

```bash
# Terminal 1 - Practice app
cd practice-app && pnpm dev     # http://localhost:5173

# Terminal 2 - Training app
cd training-app && pnpm dev     # http://localhost:5174

# Terminal 3 - Documentation site
cd docs-site && npm run dev     # http://localhost:5173 (different port)
```

#### Code Style

- **TypeScript:** Use strict mode, no `any` types
- **React:** Functional components with hooks
- **Formatting:** Run `pnpm lint` before committing
- **Naming:** Use descriptive variable and function names

#### Testing Your Changes

1. **Build all packages:**

```bash
pnpm -r build
```

2. **Run linters:**

```bash
pnpm lint
```

3. **Test manually:**
   - Verify your changes in both apps
   - Test on different browsers if UI-related
   - Check that all links work

#### Pull Request Process

1. **Create a feature branch:**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** with clear, focused commits

3. **Update documentation** if your changes affect user-facing behavior

4. **Push to your fork:**

```bash
git push origin feature/your-feature-name
```

5. **Open a Pull Request** with:
   - Clear title describing the change
   - Description explaining what and why
   - Reference to related issues
   - Screenshots for UI changes

## Content Contributions

### Content Architecture: Two Module Formats

The codebase has **two separate `Lesson` type definitions**. Importing the wrong one causes type errors and runtime failures. Understand which system you are working in before writing any code.

#### Legacy format — `training-app/src/data/types.ts`

Used by the 33 numbered files in `training-app/src/data/modules/` (e.g., `01-orientation.ts`).

```typescript
// training-app/src/data/types.ts
export interface Lesson {
  id: number;          // numeric — e.g. 0, 1, 2
  title: string;
  subtitle: string;
  icon: string;
  sections: {
    heading: string;
    content: string;
    code?: string;
    codeLanguage?: string;
    tip?: string;
    warning?: string;
    callout?: string;
    table?: { headers: string[]; rows: string[][] };
  }[];
  quiz?: Quiz;         // single question — { question, options, correctIndex, explanation }
  exercise?: CodeExercise;
  promptTemplates?: PromptTemplate[];
}
```

#### V2 / Standalone Courses format — `training-app/src/types/curriculum.ts`

Used by courses in `training-app/src/data/courses/` (e.g., `first-playwright-tests/`, `copilot-first-testing/`).

```typescript
// training-app/src/types/curriculum.ts
export interface Lesson {
  id: string;               // string — e.g. "first-playwright-tests-lesson-01"
  title: string;
  subtitle: string;
  estimatedMinutes: number; // required in V2; absent in legacy
  sections: Section[];      // discriminated union — see below
  quiz?: Quiz;              // array of questions — { questions: QuizQuestion[] }
  exercise?: CodeExercise;
}

// Section is a discriminated union — every section needs a "type" field
export type Section =
  | { type: "text";    heading: string; content: string }
  | { type: "code";    language: string; code: string; heading?: string }
  | { type: "callout"; variant: "tip" | "warning" | "info"; content: string; heading?: string }
  | { type: "table";   headers: string[]; rows: string[][]; heading?: string };
```

#### Which to use

| Situation | Format to use | Import from |
|-----------|--------------|-------------|
| Adding to an existing legacy module | Legacy | `../data/types` |
| Creating a new standalone course | V2 | `../../types/curriculum` |
| **New content** | **V2 (standalone courses)** | `../../types/curriculum` |

> **Key difference:** Legacy `quiz` is a single `{ question, options, correctIndex, explanation }` object. V2 `quiz` is `{ questions: QuizQuestion[] }` — an array. Mixing them causes silent data loss.

The adapter in `training-app/src/data/curriculum.ts` converts legacy lessons into V2 `Module`/`Course` shapes at runtime. You do **not** need to touch the adapter when adding a new standalone course.

---

### How to Author a New Module

**Always use the standalone courses format** (`data/courses/`) for new content. Legacy modules require touching the adapter chain and are not the recommended path for new contributions.

#### Step 1 — Choose a course and create the module file

Place the new module under the relevant course directory:

```
training-app/src/data/courses/<course-name>/modules/XX-your-module-name.ts
```

Where `XX` is the next sequential number in the course (e.g., `11` if there are already 10 modules).

#### Step 2 — Write the module using `createSingleLessonModule`

Each module in the standalone courses format is a single lesson wrapped in a `Module`. Use the `createSingleLessonModule` helper from the course's `shared.ts`:

```typescript
// training-app/src/data/courses/first-playwright-tests/modules/11-your-topic.ts
import { createSingleLessonModule } from "../shared";

export const yourTopicModule = createSingleLessonModule({
  index: 11,                          // Sequential number within the course
  title: "Your Module Title",
  subtitle: "One sentence describing what learners will do",
  icon: "🔬",
  estimatedMinutes: 10,
  learningObjectives: [
    "Describe what X means in a Playwright context",
    "Write a test that verifies Y",
  ],
  lesson: {
    title: "Your Module Title",
    subtitle: "One sentence describing what learners will do",
    estimatedMinutes: 10,
    sections: [
      {
        type: "text",
        heading: "Context Heading",
        content: "Explanation of the concept...",
      },
      {
        type: "code",
        heading: "Example",
        language: "typescript",
        code: `test("example", async ({ page }) => {\n  // your code\n});`,
      },
      {
        type: "callout",
        variant: "tip",
        content: "Short actionable tip for the learner.",
      },
    ],
    quiz: {
      questions: [
        {
          question: "What does X do?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctIndex: 0,
          explanation: "Explanation of why A is correct.",
        },
      ],
    },
    exercise: {
      title: "Exercise Title",
      description: "What the learner must build",
      starterCode: `// starter code here`,
      solutionCode: `// solution here`,
      hints: ["Hint 1", "Hint 2"],
      difficulty: "beginner",
    },
  },
});
```

#### Step 3 — Register the module in `course.ts`

```typescript
// training-app/src/data/courses/first-playwright-tests/course.ts
import { yourTopicModule } from "./modules/11-your-topic";

export const firstPlaywrightTestsCourse = buildStandaloneCourse([
  // ... existing modules ...
  yourTopicModule,   // append here
]);
```

The course `id`, `estimatedHours`, and module IDs are computed automatically by `buildStandaloneCourse` and `createSingleLessonModule`.

#### ID naming convention

Module and lesson IDs are generated by `createSingleLessonModule` from the course name and `index`:

```
Module ID:  first-playwright-tests-module-11
Lesson ID:  first-playwright-tests-lesson-11
```

Do **not** set `id` manually in standalone course modules — it is injected by the helper.

#### Quiz format

V2 quizzes use an **array** of questions, not a single question:

```typescript
// ✅ Correct — V2 format
quiz: {
  questions: [
    { question: "...", options: [...], correctIndex: 0, explanation: "..." },
  ],
},

// ❌ Wrong — this is the legacy format
quiz: {
  question: "...",
  options: [...],
  correctIndex: 0,
  explanation: "...",
},
```

#### Exercise format (optional `lab` field)

If the exercise has a file the learner must edit, add the `lab` field using `createExerciseLab` from `shared.ts`:

```typescript
import { createExerciseLab } from "../shared";

exercise: {
  title: "Write a login test",
  description: "Fill in the missing assertions",
  starterCode: `// ...`,
  solutionCode: `// ...`,
  hints: ["Use getByTestId", "Check the URL after login"],
  difficulty: "beginner",
  lab: createExerciseLab(
    "e2e/first-playwright-tests/lesson-11.spec.ts",  // targetFile
    "pnpm exec playwright test lesson-11 --project=chromium",
    ["✓ Login test passes", "✓ Dashboard heading assertion present"],
  ),
},
```

#### Warning: legacy adapter chain

If you must add to the legacy modules (`data/modules/XX-name.ts`), note the full chain you must update:

1. Create `training-app/src/data/modules/XX-name.ts` (uses `data/types.ts` `Lesson` with numeric `id`)
2. Export it from `training-app/src/data/index.ts`
3. The adapter in `training-app/src/data/curriculum.ts` picks it up automatically — but only if the lesson `id` matches its position in the `lessons` array from `index.ts`
4. Verify the adapter's `sectionsFromLegacy`, `quizFromLegacy`, and `learningObjectivesFromLegacy` functions handle any non-standard fields you add

For new content, **avoid the legacy path**. Use standalone courses.

---

### Adding Practice App Features

The practice app (`practice-app/`) is designed with intentional bugs for testing practice. When adding features:

- Add `data-testid` attributes for all interactive elements
- Include intentional bugs or edge cases (document them)
- Update `test-cases/examples/` with reference tests
- Document the feature in `docs-site/guide/practice-app.md`

### Writing Reference Tests

Reference tests in `test-cases/examples/` serve as quality benchmarks. Ensure:

- Tests are independent (no dependencies between specs)
- Use `data-testid` selectors (avoid CSS classes)
- Include real assertions validating behavior
- No `waitForTimeout` calls
- Descriptive test names

## Commit Message Guidelines

Use clear, descriptive commit messages:

```
type(scope): brief description

Longer explanation if needed
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(training-app): add module on accessibility testing
fix(practice-app): correct validation on checkout form
docs(getting-started): add Windows-specific instructions
```

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and different perspectives
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment, discrimination, or personal attacks
- Trolling or insulting comments
- Publishing private information without permission
- Any conduct that would be inappropriate in a professional setting

## Questions?

- **General questions:** [Open a discussion](https://github.com/tafreeman/midnight-automation-voyage/discussions)
- **Bug reports:** [Open an issue](https://github.com/tafreeman/midnight-automation-voyage/issues)
- **Security issues:** See [Security Policy](./security.md)

## License

By contributing to Midnight Automation Voyage, you agree that your contributions will be licensed under the MIT License.

---

## How to Author a Module

This guide covers adding a new **legacy module** — the format used by the Build Skills, Go Pro, and Foundations courses. If you are adding to First Playwright Tests or Copilot-First Testing, use the standalone course format described in the section above instead.

### Step 1 — Choose the right format

| Target course | Format | Module location |
|---|---|---|
| Build Skills, Go Pro, Foundations | **Legacy** | `training-app/src/data/modules/` |
| First Playwright Tests, Copilot-First Testing | **Standalone** | `training-app/src/data/courses/*/modules/` |

Most new content added by contributors goes in the legacy format. The standalone format is reserved for entirely new courses.

### Step 2 — Create the module file

Name the file with the next available numeric prefix and place it in `training-app/src/data/modules/`:

```
training-app/src/data/modules/32-your-topic.ts
```

Use the `Lesson` type imported from `"../types"`. The `id` field must be a **number** matching the file's zero-based position in the `lessons[]` array in `index.ts` (so the 32nd entry has `id: 31`).

```typescript
// training-app/src/data/modules/32-your-topic.ts
import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 31,           // 0-based index in the lessons[] array in index.ts
  title: 'Your Module Title',
  subtitle: 'One sentence describing what the learner will do',
  icon: '🔬',
  sections: [
    {
      heading: 'First Concept',
      content: 'Explanation of the concept. Use **bold** for key terms.',
      tip: 'Optional short tip displayed below this section.',
    },
    {
      heading: 'Code Example',
      content: 'Introduce the example before showing the code.',
      code: `test('example', async ({ page }) => {
  await page.goto('/products');
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
});`,
      codeLanguage: 'typescript',
    },
  ],
  quiz: {
    question: 'What does X do?',
    options: [
      'Correct answer',
      'Plausible wrong answer',
      'Another wrong answer',
      'A fourth option',
    ],
    correctIndex: 0,
    explanation: 'Explanation of why the first option is correct.',
  },
  exercise: {
    title: 'Write a test for Y',
    description: 'What the learner must build or fix',
    starterCode: `// starter code here
test('your test', async ({ page }) => {
  // fill this in
});`,
    solutionCode: `// solution
test('your test', async ({ page }) => {
  await page.goto('/products');
  await expect(page.getByRole('heading')).toBeVisible();
});`,
    hints: [
      'Navigate to the relevant page first',
      'Use getByRole for the main heading',
    ],
    difficulty: 'intermediate',
  },
};
```

> **Legacy quiz format:** The `quiz` field is a single `{ question, options, correctIndex, explanation }` object — not an array. See the [Content Data Model](#content-data-model) section for the difference between legacy and standalone quiz shapes.

### Step 3 — Register in `index.ts`

Add an import and append the lesson to the `lessons[]` array. **Order matters** — the array index determines the lesson's `id` value and its position in the sidebar.

```typescript
// training-app/src/data/index.ts

// Add the import alongside the other module imports
import { lesson as yourTopic } from "./modules/32-your-topic";

// Append to the lessons[] array (maintain sequential order)
export const lessons: Lesson[] = [
  // ... existing entries ...
  customReporters,
  yourTopic,       // must be at index 31 to match id: 31 in the module file
];
```

### Step 4 — Add to a course in `curriculum.ts`

Open `training-app/src/data/curriculum.ts` and add the lesson to the appropriate course array using `moduleFromLegacy()`. `legacyLessons` is the imported `lessons[]` array — **0-indexed**. Module numbers inside a course start at 1.

```typescript
// training-app/src/data/curriculum.ts

// Inside the Build Skills course modules array:
moduleFromLegacy(legacyLessons[31], 18, { difficulty: "intermediate" }), // 32-your-topic
```

The comment format convention is `// NN-module-filename` to make the mapping readable. The module number (`18` above) is the sequential position within that course's module list — check the existing entries in the course to find the next available number.

### Step 5 — Run typecheck

```bash
cd training-app && npx tsc --noEmit
```

Fix any type errors before opening a PR. Common mistakes:
- Wrong `id` value (must match the 0-based index in `lessons[]`)
- Using the `Lesson` type from `"../../types/curriculum"` instead of `"../types"` (the standalone type — see [Content Data Model](#content-data-model))
- Malformed `quiz` — legacy format uses a single object, not `{ questions: [] }`

---

## Content Data Model

The training app has **two separate `Lesson` type definitions** in two different files. Importing the wrong one causes type errors that can be hard to trace.

### Why two formats exist

The legacy format (`data/types.ts`) predates the richer curriculum type (`types/curriculum.ts`). The 31 original modules were written against the simpler shape and are kept as-is to avoid a large-scale rewrite. New standalone courses (First Playwright Tests, Copilot-First Testing) use the richer format directly.

### Which type to import

| Situation | Import from |
|---|---|
| Adding or editing a legacy module (`data/modules/`) | `"../types"` |
| Adding or editing a standalone course module (`data/courses/*/modules/`) | `"../../types/curriculum"` |

**Never mix the two.** The `id` field alone will cause a type error: legacy expects `number`, standalone expects `string`.

### Key differences

| Field | Legacy (`data/types.ts`) | Standalone (`types/curriculum.ts`) |
|---|---|---|
| `id` | `number` (e.g. `0`, `1`, `31`) | `string` (e.g. `"first-playwright-tests-lesson-11"`) |
| `sections[]` item | Plain object with optional `code`, `tip`, `warning`, `callout`, `table` fields | Discriminated union — each item has a required `type` field (`"text"` \| `"code"` \| `"callout"` \| `"table"`) |
| `quiz` | Single `{ question, options, correctIndex, explanation }` object | `{ questions: QuizQuestion[] }` — an array |
| `exercise` | `CodeExercise` object (optional `lab` field not present) | `CodeExercise` object with optional `lab` field via `createExerciseLab()` |
| `estimatedMinutes` | Not present — computed by the adapter from section count | Required field |
| `learningObjectives` | Not present — generated by the adapter from section headings | Required field (`string[]`) |

### The adapter

`training-app/src/data/curriculum.ts` converts legacy lessons into the richer `Module`/`Course` shapes expected by the UI. The entry point is `moduleFromLegacy()`, which is called inside each course's module array in that file.

You do **not** call `moduleFromLegacy()` yourself when creating a new legacy module. The chain is:

1. Your lesson exported from `modules/NN-name.ts`
2. Added to `lessons[]` in `index.ts`
3. `curriculum.ts` imports `lessons` as `legacyLessons` and you reference it by index in the course array

`moduleFromLegacy()` automatically derives `estimatedMinutes` from section count, generates `learningObjectives` from section headings, and converts the flat `sections[]` into typed `Section` discriminated union objects. You don't need to provide these fields in the legacy module file.
