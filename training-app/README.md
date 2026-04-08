# Training App

Interactive learning platform for the Midnight Automation Voyage curriculum. Built with React + TypeScript + Vite + Tailwind CSS.

## Overview

The training app delivers Playwright + GitHub Copilot courses through an interactive browser-based interface. Learners progress through modules with quizzes, code exercises, and prompt templates.

### Key Features

- **33 training modules** organised in 6 tiers (Foundation → Advanced)
- **2 standalone courses** with their own module sets (First Playwright Tests, Copilot-First Testing)
- **Hash-based routing** — `#dashboard`, `#module/{id}`, `#lesson/{moduleId}/{lessonId}`
- **Progress persistence** — localStorage with `ProgressContext`
- **6 themes** via custom `ThemeContext` and CSS custom properties (`data-theme` attribute)
- **Assessment system** — quizzes with gated completion, exercises with starter/solution code, prompt templates
- **Responsive layout** — 3-column AppShell with collapsible sidebar (desktop) / overlay (mobile)
- **Keyboard navigation** — arrow keys for lesson traversal
- **43 shadcn/Radix UI components** for accessible UI primitives

## Development

```bash
pnpm install   # Install dependencies
pnpm dev       # Start dev server on http://localhost:5174
pnpm build     # Production build (tsc + vite)
pnpm lint      # ESLint
```

Or from the repo root: `pnpm dev:training`

## Project Structure

```
src/
├── components/    # UI components (AppShell, Quiz, CodeExercise, DiffCodeBlock, etc.)
├── contexts/      # React contexts (Progress, Theme, Navigation)
├── data/
│   ├── modules/   # Legacy module library (33 modules, used by 3 of 5 course views)
│   ├── courses/   # Standalone course definitions (first-playwright-tests, copilot-first-testing)
│   ├── types.ts   # Lesson, Quiz, CodeExercise, PromptTemplate types
│   └── curriculum.ts  # Adapter mapping legacy modules into course structures
├── hooks/         # Custom hooks
├── layouts/       # Page layout components
├── pages/         # Route-level page components
├── themes/        # Theme tokens (tokens.css) and definitions
└── types/         # Shared TypeScript type definitions
```

### Dual Data System

The app has two content systems:

1. **Legacy modules** (`data/modules/`) — 33 flat lesson files imported in `data/index.ts`. These feed 3 of 5 course views via the `curriculum.ts` adapter.
2. **Standalone courses** (`data/courses/`) — Self-contained course definitions with their own module sets. Currently: First Playwright Tests (12 modules) and Copilot-First Testing (10 modules).

Legacy modules cannot be removed yet — they are still consumed by active courses.

## Standalone Build

Build Course 1 as a single HTML file (no server needed):

```bash
pnpm build --config vite.first-playwright-tests.config.ts
# Output: dist-first-playwright-tests/first-playwright-tests.html
```

## Related

- [Practice App](../practice-app/) — The test target app that exercises run against
- [Test Cases](../test-cases/) — Reference Playwright specs
- [Root README](../README.md) — Project overview and quick start
