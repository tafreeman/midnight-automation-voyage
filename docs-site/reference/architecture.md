# Architecture

Technical architecture and design decisions for the Midnight Automation Voyage platform.

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                  User's Browser                      │
│                                                      │
│  ┌──────────────────┐    ┌───────────────────────┐  │
│  │   Training App    │    │    Practice App        │  │
│  │   :5174           │    │    :5173               │  │
│  │                   │    │                        │  │
│  │  React + Vite     │    │  React + Vite          │  │
│  │  Tailwind CSS     │    │  React Router          │  │
│  │  6 Theme Options  │    │  Tailwind CSS          │  │
│  │  Hash Routing     │    │  3 Context Providers   │  │
│  │  LocalStorage     │    │  Intentional Bugs      │  │
│  └──────────────────┘    └───────────────────────┘  │
│          │                         │                 │
│          │ Practice links          │ Test target     │
│          └─────────────────────────┘                 │
└─────────────────────────────────────────────────────┘
```

## Architecture Decision Records

The platform's design is documented in four ADRs:

### ADR-01: Standalone Zero-Installation Architecture
**Status:** Accepted (partially implemented)

Single-file builds via `vite-plugin-singlefile` for zero-installation distribution. Learners can open a single HTML file without running a dev server.

### ADR-02: Platform Architecture and Navigation
**Status:** Implemented

13 design audit items covering responsive layout, keyboard navigation, theme system, sidebar behavior, and progress persistence. All items complete.

### ADR-03: Enterprise Testing Curriculum Expansion
**Status:** Implemented

31-module curriculum across 4 tiers (Foundation → Core → Enterprise → Advanced). All modules authored with quizzes and exercises.

### ADR-04: Assessment and Certification Layer
**Status:** Partially implemented

Bronze/Silver/Gold certification tiers, quiz gating, competency matrix. Progress dashboard and certificate generation still in backlog.

## Data Architecture

### Dual Data System

The training app uses two content systems:

| System | Location | Modules | Used By |
|--------|----------|---------|---------|
| Legacy modules | `data/modules/` | 33 files | Courses 2, 3, 4 (via curriculum adapter) |
| Standalone courses | `data/courses/` | 22 modules (2 courses) | Course 1, Copilot-First |

Legacy modules cannot be removed — they feed 3 of 5 courses through the `curriculum.ts` adapter.

### Lesson Data Model

```typescript
interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  icon: string;                    // Emoji icon
  audience?: string;
  sections: Section[];             // Content blocks
  quiz?: Quiz;                     // Knowledge check
  exercise?: CodeExercise;         // Hands-on exercise
  exercises?: CodeExercise[];      // Multiple exercises
  promptTemplates?: PromptTemplate[]; // Copilot prompts
  practiceLink?: PracticeLink;     // Link to practice app
  narrationScript?: NarrationScript; // Guided walkthrough
}
```

### Theme System

6 theme options via CSS custom properties on `[data-theme]`:

| Theme | Mode | Font Pairing |
|-------|------|-------------|
| Signal Cobalt | Dark | Inter + JetBrains Mono |
| Arctic Steel | Light | Inter + JetBrains Mono |
| Linear | Light | Inter + JetBrains Mono |
| Gamma Dark | Dark | Inter + JetBrains Mono |
| Zine Pop | Light | Space Grotesk + Space Mono |
| Handbook Notes | Light | IBM Plex Sans + IBM Plex Mono |

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 18+ |
| Package Manager | pnpm | 8+ |
| Framework | React | 19.x |
| Build Tool | Vite | 8.x |
| Styling | Tailwind CSS | 3.4 |
| Language | TypeScript | 5.9 |
| Testing | Playwright | 1.58 |
| Router (practice-app) | React Router | 7.x |

## Workspace Structure

The repository uses pnpm workspaces:

```yaml
# pnpm-workspace.yaml
packages:
  - "training-app"
  - "practice-app"
  - "packages/*"
```

`packages/shared-config` provides shared TypeScript, PostCSS, and Tailwind configuration across both apps.
