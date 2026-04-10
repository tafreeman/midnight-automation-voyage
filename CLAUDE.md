# Midnight Automation Voyage

Playwright + GitHub Copilot training platform teaching manual testers to write automated tests.

## Project Structure

- `training-app/` - Interactive learning app (React + TypeScript + Vite + Tailwind, 33 legacy modules + 2 standalone courses)
- `practice-app/` - Test target app with intentional bugs (9 pages, 12 routes, 3 context providers)
- `test-cases/` - Reference Playwright specs (10 spec files, 59 tests) and lesson starter/solution files
- `packages/shared-config/` - Shared TypeScript, PostCSS, and Tailwind configuration
- `docs/` - Course plans, audit reports, and reference material
- `scripts/` - Utility scripts (standalone packaging, prompt runner)

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

From the repo root:

```bash
pnpm build              # Build all workspace packages
pnpm lint               # Lint all workspace packages
pnpm dev:training       # Start training-app dev server (port 5174)
pnpm dev:practice       # Start practice-app dev server (port 5173)
```

## Gotchas

- Uses pnpm (lockfiles are `pnpm-lock.yaml`) — not npm/yarn
- practice-app runs on :5173, training-app on :5174
- On Windows mounted drives or VMs, pnpm may fail with EPERM — use npm as fallback
- Always check `node_modules` exists before running build/dev/lint commands
- practice-app pages are intentionally buggy — do NOT fix lint errors in page components
- training-app has a dual data system: legacy modules in `data/modules/` and standalone courses in `data/courses/`

## Agent Configuration

See [AGENTS.md](AGENTS.md) for a complete guide to the AI agent setup in this repo.
