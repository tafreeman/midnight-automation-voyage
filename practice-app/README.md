# Practice App

Test target application for the Midnight Automation Voyage curriculum. Built with React + TypeScript + Vite + Tailwind CSS + React Router.

## Overview

The practice app provides realistic web pages with `data-testid` attributes and **intentional bugs** for learners to write Playwright tests against. It is the hands-on companion to the training app's lessons.

> **Important:** Pages are intentionally hand-built with bugs — these are the curriculum's test surface. Do not "fix" lint errors or replace components with polished libraries.

## Pages

| Page | Route | What Learners Test |
|------|-------|--------------------|
| Login | `/login` | Form validation, auth errors, account lockout after 5 failures |
| Dashboard | `/dashboard` | Post-login landing, visual regression target |
| Products | `/products` | Search, filter, empty state |
| Contact | `/contact` | Required/optional fields, format validation |
| Orders | `/orders` | Sort, pagination, status filter |
| Checkout | `/checkout/shipping` → `/checkout/payment` → `/checkout/review` → `/checkout/confirmation` | Multi-step wizard, back navigation, data preservation |
| Settings | `/settings` | Tabs, profile updates, **3 intentional WCAG a11y violations** |
| Admin | `/admin` | Role-gated access, bulk actions, **stale state bugs** |
| Activity | `/activity` | Filters, detail views, mock modes (error/timeout/stale-cache) |

**Total:** 9 user-facing pages, 12 routes (checkout has 4 steps).

## Test Credentials

| Email | Password | Role |
|-------|----------|------|
| `user@test.com` | `Password123!` | Editor |
| `admin@test.com` | `AdminPass1!` | Admin |
| `locktest@test.com` | `LockPass123!` | Viewer (lockout testing) |

## Intentional Defects

These bugs exist by design as Playwright test targets:

- **SettingsPage:** Missing label, low contrast, bad focus order (WCAG violations)
- **AdminPage:** Stale state bugs, duplicate validation
- **ActivityPage:** Mock modes for error/timeout/stale-cache
- **ToastContext:** 3 documented race conditions
- **LoginPage:** Account lockout after 5 failed attempts

## Context Providers

| Provider | Purpose |
|----------|---------|
| `AuthContext` | Role-based authentication (admin/editor/viewer) |
| `CheckoutContext` | Multi-step checkout wizard state |
| `ToastContext` | Notifications with intentional race conditions |

## Development

```bash
pnpm install   # Install dependencies
pnpm dev       # Start dev server on http://localhost:5173
pnpm build     # Production build (tsc + vite)
pnpm lint      # ESLint
```

Or from the repo root: `pnpm dev:practice`

## E2E Tests

Playwright tests live in `e2e/`:

```bash
npx playwright test                    # Run all tests
npx playwright test --ui               # Interactive UI mode
npx playwright test e2e/first-playwright-tests/  # Run lesson tests only
```

```
e2e/
├── first-playwright-tests/           # Lesson starter test files (learner exercises)
├── first-playwright-tests-solutions/ # Reference solutions
└── support/                          # Test helpers and fixtures
```

## Deployment

Deployed to GitHub Pages via `.github/workflows/deploy-practice-app.yml` on push to `main`.

## Related

- [Training App](../training-app/) — The interactive learning platform
- [Test Cases](../test-cases/) — Additional reference Playwright specs
- [Root README](../README.md) — Project overview and quick start
