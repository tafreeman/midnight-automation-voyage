# First Playwright Tests

<Badge type="tip" text="Beginner" /> <Badge type="info" text="10 Modules" /> <Badge type="tip" text="Complete" />

The recommended starting point for manual testers. Each lesson builds on the previous — from watching a test run to building your own test pack. No prior coding experience required.

## Course Overview

This course teaches the **Record → Refine → Review** workflow that turns acceptance criteria into automated Playwright tests. You'll use GitHub Copilot to write code and the practice app as your test target.

::: tip Who Is This For?
Manual QA testers who are excellent at finding bugs but new to writing test automation code. If you can read a test plan, you can learn this.
:::

## Module Breakdown

### 1. See a Test Do Real Work
Watch an automated test run against the practice app. Understand what happens at each step — navigation, interaction, assertion — and why it matters.

### 2. Just Enough TypeScript and Tooling
The minimum TypeScript you need to read and modify tests. Variables, types, async/await, and the VS Code features that help.

### 3. Set Up the Workbench
Install Node.js, VS Code extensions, Playwright browsers. Configure your development environment so everything works on first run.

### 4. Run Tests from VS Code and Terminal
Two ways to run tests: the Playwright VS Code extension (click to run) and the terminal (`npx playwright test`). Learn when to use each.

### 5. Read a Test Like Evidence
Interpret test output, HTML reports, and trace files. Understand what passed, what failed, and why — the skills that make test results actionable.

### 6. Find the Right Element
Locator strategies — `getByTestId`, `getByRole`, `getByLabel`, `getByText`. When to use each, and why `data-testid` is the foundation.

### 7. Ask Copilot for a Useful Draft
Write prompts that produce useful test code. Structure your request with context, action, and expected outcome. Refine the output.

### 8. Record a Login Flow in VS Code
Use Playwright's codegen tool to record browser interactions. Walk through the login flow and capture it as executable test code.

### 9. Tighten and Re-Run the Recording
Transform rough recorded code into a reliable test. Add assertions, replace selectors, remove noise, and verify the test catches real bugs.

### 10. Build Your First Test Pack
Combine everything into a test suite. Write tests for multiple pages, organize them logically, and run the full pack.

## What You'll Build

By the end of this course, you'll have:

- A working Playwright test suite covering the practice app's login, products, and contact pages
- Familiarity with VS Code's Playwright integration
- Experience using Copilot to draft and refine test code
- A reference test pack you can adapt for real projects

## Skills Progression

| Module | Skill Gained | Practice App Pages |
|--------|-------------|-------------------|
| 1–3 | Environment & tooling | — (setup) |
| 4–5 | Running & reading tests | All pages |
| 6 | Element selection | Products, Contact |
| 7 | Copilot prompting | Login, Products |
| 8–9 | Recording & refining | Login |
| 10 | Full test authoring | Multiple pages |

## Reference Tests

After completing this course, compare your tests against the reference specs in `test-cases/examples/`:

| Spec File | Tests | Pages Covered |
|-----------|-------|---------------|
| `login.spec.ts` | 7 | Login |
| `search.spec.ts` | 7 | Products |
| `contact.spec.ts` | 7 | Contact |
| `checkout.spec.ts` | 6 | Checkout (4 steps) |

## Next Steps

After completing this course:
- [Copilot-First Testing](/courses/copilot-first-testing) — deeper dive into AI-assisted testing workflow
- [Build Skills](/courses/build-skills) — page objects, API testing, CI/CD integration
