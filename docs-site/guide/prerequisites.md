# Prerequisites

Everything you need before starting the courses.

## Required Software

### Node.js (v18 or later)

The training app and practice app both run on Node.js.

```bash
# Check your version
node --version
# Should output v18.x.x or higher
```

Download from [nodejs.org](https://nodejs.org) if not installed.

### Package Manager

The project uses **pnpm** for dependency management. npm works as a fallback.

::: code-group

```bash [Install pnpm]
npm install -g pnpm
pnpm --version
```

```bash [Use npm instead]
# No installation needed — npm ships with Node.js
npm --version
```

:::

### VS Code + Extensions

| Extension | ID | Purpose |
|-----------|-----|---------|
| Playwright Test for VS Code | `ms-playwright.playwright` | Run/debug tests from the editor |
| GitHub Copilot | `GitHub.copilot` | AI-assisted test writing |
| GitHub Copilot Chat | `GitHub.copilot-chat` | Conversational prompt interface |

### Playwright Browsers

After installing the practice-app dependencies, install Playwright's browser binaries:

```bash
cd practice-app
npx playwright install
```

This downloads Chromium, Firefox, and WebKit — the three browsers Playwright tests against.

## Recommended Setup

### VS Code Settings

Add these to your workspace settings for the best experience:

```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "Cascadia Code, JetBrains Mono, Fira Code, monospace",
  "editor.formatOnSave": true,
  "playwright.reuseBrowser": true
}
```

### Terminal Setup

The training workflow involves frequent terminal use. We recommend:

- **VS Code integrated terminal** — split into two panes (practice-app + test runner)
- **Separate terminal** for the training-app dev server

## Test Accounts

The practice app includes pre-configured test accounts:

| Email | Password | Role | Use For |
|-------|----------|------|---------|
| `user@test.com` | `Password123!` | Editor | Most exercises |
| `admin@test.com` | `AdminPass1!` | Admin | Admin page exercises |
| `locktest@test.com` | `LockPass123!` | Viewer | Account lockout testing |

::: warning
These are practice-app-only credentials. Never use these patterns for real applications.
:::

## Verifying Your Setup

Run this checklist after installation:

```bash
# 1. Practice app starts
cd practice-app && pnpm dev
# → Should open on http://localhost:5173

# 2. Training app starts
cd ../training-app && pnpm dev
# → Should open on http://localhost:5174

# 3. Playwright browsers installed
cd ../practice-app && npx playwright --version
# → Should show version number

# 4. Example tests pass
npx playwright test --project=chromium
# → Should run reference test suite
```

If all four checks pass, you're ready to start [Course 1: First Playwright Tests](/courses/first-playwright-tests).
