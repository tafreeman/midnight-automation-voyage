# Copilot-First Testing

<Badge type="warning" text="Intermediate" /> <Badge type="info" text="10 Modules" /> <Badge type="tip" text="Complete" />

Master the prompt-driven testing workflow. This course teaches concepts before tools, following a research-aligned lesson order.

## Course Overview

Where Course 1 focuses on the mechanics of Playwright, this course focuses on the **thinking** behind test automation. You'll learn to identify what to test, how to structure tests, and how to leverage Copilot as your primary coding assistant.

::: tip Prerequisite
Complete [First Playwright Tests](/courses/first-playwright-tests) or have equivalent experience with Playwright basics.
:::

## Module Breakdown

### 1. How Automation Works
The Record-Refine-Review workflow explained. Three inputs to every test: what to verify, how to find elements, and what "correct" looks like.

### 2. Environment Setup
Detailed setup for Playwright + VS Code + Copilot. Workspace configuration, extension settings, and verification checklist.

### 3. Test Structure
Anatomy of a Playwright test — `test()`, `expect()`, `page` fixture, `describe` blocks. How test files map to features.

### 4. Selectors and Locators
Deep dive into locator strategies. Priority order: `getByTestId` → `getByRole` → `getByLabel` → `getByText`. Anti-patterns to avoid.

### 5. What to Automate
Decision framework for automation candidates. High-value patterns (regression, smoke, data-driven) vs. low-value targets (exploratory, visual-only).

### 6. Your Testing Toolkit
Playwright's built-in tools — codegen, trace viewer, HTML reporter, VS Code extension. When to use each.

### 7. Record and Refine
Full Record-Refine-Review cycle with guided examples. Record against the practice app, then systematically improve.

### 8. Writing Tests from Scratch
Move beyond recording — write tests from acceptance criteria. Structure, assertions, error handling.

### 9. Page Object Model
Encapsulate page interactions in reusable classes. Reduce duplication, improve maintainability, and make tests self-documenting.

### 10. API Testing
Playwright's `request` API for backend testing. Authentication tokens, API assertions, and combining UI + API tests.

## Concept → Tool Mapping

| Module | Concept | Playwright Feature |
|--------|---------|-------------------|
| 1 | Automation workflow | `codegen`, test runner |
| 3 | Test structure | `test()`, `describe()`, `expect()` |
| 4 | Element selection | Locator API, `getByTestId()` |
| 6 | Tool awareness | Trace viewer, HTML reporter |
| 7 | Recording | `npx playwright codegen` |
| 9 | Code organization | Page Object classes |
| 10 | API testing | `request` fixture, `APIRequestContext` |

## Next Steps

- [Build Skills](/courses/build-skills) — auth fixtures, visual regression, CI/CD
- [Go Pro](/courses/go-pro) — advanced topics for team leads
