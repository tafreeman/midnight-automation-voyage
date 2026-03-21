# Midnight Automation Voyage

Playwright + GitHub Copilot training platform teaching manual testers to write automated tests.

## Project Structure

- `training-app/` - Interactive learning app (React + TypeScript + Vite + Tailwind, 15 modules)
- `practice-app/` - Test target app (login, products, contact, orders, checkout)
- `test-cases/` - Test mapping reference and 33 example Playwright specs
- `playwright-copilot-learning.html` - Self-contained learning resource

## Commands

Each app has its own `package.json`. Run from inside the app directory:

```bash
cd training-app   # or practice-app
pnpm install
pnpm dev          # Dev server
pnpm build        # Production build
pnpm lint         # ESLint
```

## Gotchas

- Uses pnpm (lockfiles are `pnpm-lock.yaml`) — not npm/yarn
- practice-app runs on :5173, training-app on :5174
