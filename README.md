# Midnight Automation Voyage

**Playwright + GitHub Copilot training platform** — Interactive courses teaching manual testers to write automated tests. Built for QA engineers who know how to test but are new to code.

[![Documentation](https://img.shields.io/badge/docs-live-brightgreen)](https://tafreeman.github.io/midnight-automation-voyage/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-18%2B-brightgreen.svg)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/playwright-1.58%2B-45ba4b.svg)](https://playwright.dev/)
[![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-blue.svg)](packages/shared-config)
[![Modules](https://img.shields.io/badge/modules-55%2B-purple.svg)](https://tafreeman.github.io/midnight-automation-voyage/courses/)

[**Documentation**](https://tafreeman.github.io/midnight-automation-voyage/) • [**Getting Started**](https://tafreeman.github.io/midnight-automation-voyage/guide/getting-started) • [**Courses**](https://tafreeman.github.io/midnight-automation-voyage/courses/) • [**Contributing**](https://tafreeman.github.io/midnight-automation-voyage/reference/contributing)

---

## Why This Matters

Manual testing skill doesn't automatically transfer to automated testing — the barrier is the code layer, not the testing knowledge. Midnight Automation Voyage bridges that gap by pairing every concept with a purpose-built practice app, a reference Playwright spec that shows what a good test looks like, and Copilot prompt templates that lower the code barrier. The platform treats the test target's bugs as curriculum surface: learners discover them through testing rather than being told what to find.

---

## Quick Start

```bash
# 1. Install dependencies
cd training-app && pnpm install
cd ../practice-app && pnpm install

# 2. Start both apps
cd practice-app && pnpm dev          # http://localhost:5173  (test target)
cd ../training-app && pnpm dev       # http://localhost:5174  (learning app)
```

Open <http://localhost:5174> and pick a course.

> **Windows/pnpm issues?** If pnpm fails with EPERM, use `npm install` instead.

## What's Here

```text
midnight-automation-voyage/
├── training-app/           ← Interactive learning platform (React + Vite)
│   └── src/data/
│       ├── courses/        ← Standalone course modules (2 courses, 22 modules)
│       └── modules/        ← Legacy module library (33 modules)
├── practice-app/           ← Test target app (9 pages, 12 routes, intentional bugs)
├── packages/shared-config/ ← Shared TypeScript, PostCSS, Tailwind config
├── test-cases/             ← Reference Playwright specs (10 files, 59 tests)
├── scripts/                ← Utility scripts (packaging, prompt runner)
├── docs/                   ← Course plans, audit reports, reference material

└── ADR-*.md                ← Architecture Decision Records
```

## Features

| Feature | Description |
|---------|-------------|
| 🎭 **Real Playwright Tests** | 59 reference tests included — no mock data, no external dependencies |
| 🤖 **Copilot-First Workflow** | Master AI-assisted testing from day one with prompt templates |
| 📚 **55+ Interactive Modules** | Two standalone courses (22 modules) + legacy curriculum (33 modules) |
| 🧪 **Practice App Included** | 9 pages with intentional bugs, `data-testid` attributes throughout |
| 🎯 **Quizzes & Exercises** | Knowledge checks and hands-on coding in every module |
| 🚀 **Zero to CI/CD** | From first locator to GitHub Actions with parallel sharding |

## Courses

### Standalone Courses (Recommended Start)

| Course | Modules | Level | Time | Status |
| --- | --- | --- | --- | --- |
| [**First Playwright Tests**](https://tafreeman.github.io/midnight-automation-voyage/courses/first-playwright-tests) | 12 | Beginner | ~3 hrs | ✅ Complete |
| [**Copilot-First Testing**](https://tafreeman.github.io/midnight-automation-voyage/courses/copilot-first-testing) | 10 | Intermediate | ~3 hrs | ✅ Complete |

### Legacy Curriculum (4 Tiers, 33 Modules)

| Tier | Modules | Level | Time | Status |
| --- | --- | --- | --- | --- |
| [**Get Testing**](https://tafreeman.github.io/midnight-automation-voyage/courses/) | 01-10 | Beginner | ~2 hrs | ✅ Complete |
| [**Build Skills**](https://tafreeman.github.io/midnight-automation-voyage/courses/build-skills) | 11-21 | Intermediate | ~2 hrs | ⚡ Partial narration |
| [**Go Pro**](https://tafreeman.github.io/midnight-automation-voyage/courses/go-pro) | 22-33 | Advanced | ~2 hrs | ⚡ Partial |

## Learning Path

```
First Playwright Tests → Copilot-First Testing → Build Skills → Go Pro
     (Beginner)              (Intermediate)        (Intermediate)  (Advanced)
```

**What you'll learn:**

- **Beginner** → Record, refine, and run your first tests with Copilot
- **Intermediate** → Master selectors, page objects, API testing, and CI/CD
- **Advanced** → Trace viewer, accessibility, visual regression, performance testing

## Practice App

All exercises target this app. **9 pages, 12 routes, intentional bugs** — designed specifically for learning automation.

**Key Features:**

- ✅ `data-testid` attributes on all interactive elements
- ✅ Intentional bugs for test discovery (Settings: 3 a11y violations, Admin: stale state, Toast: race conditions)
- ✅ Multi-step wizard (Checkout: 4 steps)
- ✅ Role-based access (Admin panel requires admin credentials)
- ✅ 59 reference Playwright tests included in `test-cases/examples/`

**Test Credentials:**

| Email | Password | Role | Access |
|-------|----------|------|--------|
| `user@test.com` | `Password123!` | Editor | Standard pages |
| `admin@test.com` | `AdminPass1!` | Admin | Admin panel |
| `locktest@test.com` | `LockPass123!` | Viewer | Lockout testing |

[**Full Practice App Reference →**](https://tafreeman.github.io/midnight-automation-voyage/guide/practice-app)

## Standalone Build

Build Course 1 as a single HTML file (no server needed):

```bash
cd training-app
pnpm build --config vite.first-playwright-tests.config.ts
# Output: dist-first-playwright-tests/first-playwright-tests.html
```

## For Team Leads

### One-week onboarding plan

| Day | Course 1 Lessons | Activity |
|-----|-----------------|----------|
| Mon | 1-3 | Environment setup, run example tests |
| Tue | 4-6 | Understand test structure, selectors, elements |
| Wed | 7-8 | Copilot prompts, record first test |
| Thu | 9 | Refine recordings, add assertions |
| Fri | 10 | Build test pack, peer review |

### Evaluating learner tests

Compare against reference specs in `test-cases/examples/`. Check for:
- Independent tests (each navigates on its own)
- Real assertions (`expect()` mapped to acceptance criteria)
- Stable selectors (`data-testid`, no CSS)
- No `waitForTimeout` calls
- Descriptive test names

## Development

```bash
cd training-app    # or practice-app
pnpm install       # Install deps
pnpm dev           # Dev server
pnpm build         # Production build
pnpm lint          # ESLint
```

From the repo root:

```bash
pnpm build              # Build all workspace packages
pnpm lint               # Lint all workspace packages
pnpm dev:training       # Start training-app dev server (port 5174)
pnpm dev:practice       # Start practice-app dev server (port 5173)
```

Uses pnpm with `pnpm-lock.yaml`. Practice app on `:5173`, training app on `:5174`.

## Documentation

📖 **Full documentation:** <https://tafreeman.github.io/midnight-automation-voyage/>

| Resource | Description |
|----------|-------------|
| [**Getting Started**](https://tafreeman.github.io/midnight-automation-voyage/guide/getting-started) | Installation and setup guide |
| [**Course Catalog**](https://tafreeman.github.io/midnight-automation-voyage/courses/) | Browse all courses and modules |
| [**Practice App Reference**](https://tafreeman.github.io/midnight-automation-voyage/guide/practice-app) | Detailed page-by-page guide with test IDs |
| [**Architecture**](https://tafreeman.github.io/midnight-automation-voyage/reference/architecture) | Technical architecture and ADRs |
| [**Test Cases Reference**](https://tafreeman.github.io/midnight-automation-voyage/reference/test-cases) | 59 reference tests explained |
| [**Contributing**](https://tafreeman.github.io/midnight-automation-voyage/reference/contributing) | How to contribute |
| [**Changelog**](https://tafreeman.github.io/midnight-automation-voyage/reference/changelog) | Version history and roadmap |

### Repository Documentation

| Document | Description |
|----------|-------------|
| [ROADMAP.md](ROADMAP.md) | Implementation status and backlog |
| [AGENTS.md](AGENTS.md) | AI agent configuration guide |
| [ADR-01](ADR-01-Standalone.md) | Standalone zero-installation architecture |
| [ADR-02](ADR-02-Platform-Architecture.md) | Platform architecture & navigation |
| [ADR-03](ADR-03-Enterprise-Curriculum.md) | Enterprise testing curriculum expansion |

## Architecture Decisions

| ADR | Decision | Status |
|-----|----------|--------|
| [ADR-01](ADR-01-Standalone.md) | Hash routing + `vite-plugin-singlefile` so the training app runs from a local `file://` URL with no server required | Accepted (partially implemented) |
| [ADR-02](ADR-02-Platform-Architecture.md) | Custom `parseHash`/`hashForView` router, `localStorage` progress persistence, and persistent sidebar rail — all without React Router or a state library | Implemented |
| [ADR-03](ADR-03-Enterprise-Curriculum.md) | Expanded curriculum from 15 to 31 modules across three enterprise tiers, with intentional practice-app bugs as dedicated test targets | Implemented |

## Roadmap

Honest status of what's next — see [ROADMAP.md](ROADMAP.md) for the full backlog.

| Item | Priority | Description |
|------|----------|-------------|
| Standalone single-file build | Medium | Complete `vite-plugin-singlefile` integration for zero-install distribution (ADR-01) |
| Platform automated tests | Medium | Unit/integration tests for the training app itself — currently minimal |
| Tier-gated progression | Medium | Optional enforcement: Bronze required before Silver content unlocks |

## Contributing

We welcome contributions! See our [Contributing Guide](https://tafreeman.github.io/midnight-automation-voyage/reference/contributing) for:

- How to report bugs and suggest features
- Development setup instructions
- Code style guidelines
- Pull request process

## License

MIT License - see [LICENSE](LICENSE) for details.
