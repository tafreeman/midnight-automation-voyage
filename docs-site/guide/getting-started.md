# Getting Started

Get the training platform running in under 5 minutes.

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/tafreeman/midnight-automation-voyage.git
cd midnight-automation-voyage
```

### 2. Install Dependencies

::: code-group

```bash [pnpm (recommended)]
cd training-app && pnpm install
cd ../practice-app && pnpm install
```

```bash [npm (fallback)]
cd training-app && npm install
cd ../practice-app && npm install
```

:::

::: tip Windows Users
If pnpm fails with `EPERM` on mounted or shared drives, use `npm install` instead.
:::

### 3. Start Both Apps

Open two terminal windows:

```bash
# Terminal 1 — Practice app (test target)
cd practice-app && pnpm dev
# → http://localhost:5173

# Terminal 2 — Training app (learning platform)
cd training-app && pnpm dev
# → http://localhost:5174
```

### 4. Open the Training App

Navigate to [http://localhost:5174](http://localhost:5174) and pick a course.

::: info Recommended Start
Begin with **First Playwright Tests** — it's the beginner onramp that takes you from zero to your first test pack.
:::

## What You'll Need

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | 18+ | Runtime for both apps |
| pnpm | 8+ | Package manager (npm works too) |
| VS Code | Latest | Recommended editor |
| Playwright VS Code extension | Latest | Test runner integration |
| GitHub Copilot | Active subscription | AI-assisted test writing |

## Repository Structure

```text
midnight-automation-voyage/
├── training-app/           ← Interactive learning platform (React + Vite)
│   └── src/data/
│       ├── courses/        ← Standalone course modules (2 courses, 22 modules)
│       └── modules/        ← Legacy module library (33 modules)
├── practice-app/           ← Test target app (9 pages, intentional bugs)
├── packages/shared-config/ ← Shared TypeScript, PostCSS, Tailwind config
├── test-cases/             ← Reference Playwright specs (10 files, 59 tests)
├── scripts/                ← Utility scripts
├── docs/                   ← Course plans and reference material
└── ADR-*.md                ← Architecture Decision Records
```

## Next Steps

- [Browse the Course Catalog](/courses/) to pick your learning path
- [Explore the Practice App](/guide/practice-app) to understand what you'll test
- [Check Prerequisites](/guide/prerequisites) for detailed setup instructions
