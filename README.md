# Midnight Automation Voyage

Playwright + GitHub Copilot training platform. Four courses, 40 modules, ~9 hours of interactive content teaching manual testers to write automated tests.

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
│       ├── courses/        ← New course structure (standalone modules)
│       └── modules/        ← Legacy module library (31 modules)
├── practice-app/           ← Test target app (9 pages with intentional bugs)
├── test-cases/             ← Reference Playwright specs (33 tests)
├── scripts/                ← Tooling and audit prompts
└── docs/                   ← Content audit reports
```

## Courses

| Course | Level | Modules | Hours | Status |
| --- | --- | --- | --- | --- |
| **First Playwright Tests** | Beginner | 10 | ~2 | Complete (narration, quizzes, exercises) |
| **Get Testing** | Beginner | 10 | ~2.5 | Complete |
| **Build Skills** | Intermediate | 10 | ~2.3 | Partial (missing narration on most) |
| **Go Pro** | Advanced | 10 | ~2.3 | Partial (some stub modules) |

### Course 1: First Playwright Tests (recommended start)

The standalone beginner onramp. Each lesson builds on the previous:

1. See a Test Do Real Work
2. Just Enough TypeScript and Tooling
3. Set Up the Workbench
4. Run Tests from VS Code and Terminal
5. Read a Test Like Evidence
6. Find the Right Element
7. Ask Copilot for a Useful Draft
8. Record a Login Flow in VS Code
9. Tighten and Re-Run the Recording
10. Build Your First Test Pack

### Course 2: Get Testing

Research-aligned lesson order teaching concepts before tools:

1. How Automation Works → 2. Environment Setup → 3. Test Structure → 4. Selectors → 5. What to Automate → 6. Your Toolkit → 7. Record → 8. Refine → 9. Read Results → 10. Review Checklist

### Course 3: Build Skills

Page objects, API testing, auth fixtures, test data, network mocking, flaky test diagnosis, trace viewer, prompt templates, certification.

### Course 4: Go Pro

Visual regression, accessibility, mobile/responsive, parallel execution, multi-browser, test tagging, GitHub Actions CI/CD, component testing, performance, custom reporters.

## Practice App

All exercises target this app. Nine pages with `data-testid` attributes and intentional bugs.

| Page | URL | What Learners Test |
|------|-----|--------------------|
| Login | `/login` | Form validation, auth errors, lockout |
| Dashboard | `/dashboard` | Post-login landing |
| Products | `/products` | Search, filter, empty state |
| Contact | `/contact` | Required/optional fields, format validation |
| Orders | `/orders` | Sort, pagination, status filter |
| Checkout | `/checkout/*` | Multi-step wizard, back nav, data preservation |
| Settings | `/settings` | Tabs, profile updates, notifications |
| Admin | `/admin` | User management, bulk actions |
| Activity | `/activity` | Filters, detail views, async content |

**Test credentials:**

| Email | Password | Role |
|-------|----------|------|
| user@test.com | Password123! | Editor |
| admin@test.com | AdminPass1! | Admin |
| locktest@test.com | LockPass123! | Viewer (lockout testing) |

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

Uses pnpm with `pnpm-lock.yaml`. Practice app on `:5173`, training app on `:5174`.
