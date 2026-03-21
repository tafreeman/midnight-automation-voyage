# Midnight Automation Voyage

Playwright + GitHub Copilot training platform teaching manual testers to write automated tests.

## Project Structure

- `training-app/` - Interactive learning app (React + TypeScript + Vite + Tailwind, 27 modules)
- `practice-app/` - Test target app (login, dashboard, products, contact, orders, checkout, settings, admin, activity)
- `test-cases/` - Test mapping reference and example Playwright specs
- `playwright-copilot-learning.html` - Self-contained learning resource

## Prerequisites

Before running any commands, verify dependencies are installed:

```bash
# 1. Check pnpm is available
which pnpm || npm install -g pnpm

# 2. Check node_modules exist in each app
ls training-app/node_modules/.package-lock.json 2>/dev/null || (cd training-app && pnpm install)
ls practice-app/node_modules/.package-lock.json 2>/dev/null || (cd practice-app && pnpm install)
```

If pnpm has permission errors (e.g. EPERM on mounted/shared drives), fall back to npm:
```bash
cd training-app && npm install   # creates node_modules from package.json
cd practice-app && npm install
```

## Commands

Each app has its own `package.json`. Run from inside the app directory:

```bash
cd training-app   # or practice-app
pnpm install      # Install deps (skip if node_modules exists)
pnpm dev          # Dev server
pnpm build        # Production build
pnpm lint         # ESLint
```

## Gotchas

- Uses pnpm (lockfiles are `pnpm-lock.yaml`) — not npm/yarn
- practice-app runs on :5173, training-app on :5174
- On Windows mounted drives or VMs, pnpm may fail with EPERM — use npm as fallback
- Always check `node_modules` exists before running build/dev/lint commands

## Completed Roadmap Items

- **Workstream A (Platform UX):** All 13 design audit fixes implemented (typography, a11y, responsive, keyboard nav)
- **Workstream B (Assessment Backfill):** 27/27 quizzes, 24/27 exercises (modules 01-03 intentionally conceptual)
- **Workstream C (Content Expansion):** 12 new modules (16-27) covering auth fixtures, visual regression, a11y testing, flaky tests, test data, certification, trace viewer, mobile, parallel execution, multi-browser, test tagging, GitHub Actions
- **Workstream D (Practice App Features):** 5 new pages (settings, admin, activity, payment, review) + AuthContext, CheckoutContext, ToastContext
