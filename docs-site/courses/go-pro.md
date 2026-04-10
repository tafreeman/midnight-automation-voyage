# Go Pro

<Badge type="danger" text="Advanced" /> <Badge type="info" text="11 Modules" /> <Badge type="tip" text="Partial" />

Advanced Playwright topics for team leads and senior automation engineers. Trace viewer mastery, mobile testing, parallel execution, GitHub Actions CI/CD, and emerging tools.

## Course Overview

Go Pro covers the scale and advanced tiers of the curriculum (modules 22–32). These modules assume familiarity with Playwright fundamentals and focus on production-grade practices.

::: warning Prerequisites
Complete [Build Skills](/courses/build-skills) or have equivalent experience with Playwright page objects, auth fixtures, and CI/CD basics.
:::

## Module Breakdown

### 22. Trace Viewer
Deep dive into Playwright's trace viewer. Capture traces, analyze step-by-step execution, inspect network calls, and debug failures visually.

### 23. Mobile and Responsive Testing
Device emulation, viewport configuration, and touch event simulation. Test responsive layouts across phone, tablet, and desktop breakpoints.

### 24. Parallel Execution and Sharding
Run tests across multiple workers and machines. `fullyParallel`, `--shard`, and CI matrix strategies for fast feedback.

### 25. Multi-Browser Projects
Configure Playwright projects for Chromium, Firefox, and WebKit. Browser-specific selectors, platform differences, and cross-browser CI.

### 26. Test Tagging
Organize tests with tags — `@smoke`, `@regression`, `@critical`. Filter test runs by tag, combine tags, and integrate with CI pipelines.

### 27. GitHub Actions
Production-ready CI/CD configuration. Caching, artifacts, matrix builds, scheduled runs, and Playwright-specific GitHub Actions patterns.

### 28. MCP and AI Agents
Emerging patterns — Model Context Protocol for test generation, AI-powered test maintenance, and agent-based testing workflows.

### 29. Component Testing
Test React components in isolation with Playwright's experimental component testing. Setup, mounting, and assertions without a full app server.

### 30. Performance Testing
Measure and assert on web performance metrics. Core Web Vitals, network timing, and custom performance budgets with Playwright.

### 31. Custom Reporters
Build custom Playwright reporters. JSON, HTML, and API integrations for test management tools. Reporter lifecycle hooks.

### 32. Complex DOM Interactions
Advanced interaction patterns — drag and drop, file uploads, iframes, shadow DOM, and canvas elements.

## Topic Categories

| Category | Modules | Focus |
|----------|---------|-------|
| Debugging | 22 | Trace analysis |
| Cross-platform | 23, 25 | Mobile, multi-browser |
| Scale | 24, 26, 27 | Parallel, tagging, CI/CD |
| Emerging | 28 | AI/MCP integration |
| Specialized | 29, 30, 31, 32 | Components, perf, reporters, DOM |

## Reference Test Suite

The `test-cases/examples/` directory contains 10 reference spec files with 59 total tests:

| Spec | Tests | Patterns Demonstrated |
|------|-------|-----------------------|
| `accessibility.spec.ts` | 4 | axe-core integration, WCAG checks |
| `activity.spec.ts` | 5 | Async content, filters, detail views |
| `admin.spec.ts` | 7 | Role-gated access, bulk operations |
| `checkout.spec.ts` | 6 | Multi-step wizard, data preservation |
| `contact.spec.ts` | 7 | Form validation, required fields |
| `login.spec.ts` | 7 | Auth flow, error handling, lockout |
| `orders.spec.ts` | 6 | Table operations, sorting, pagination |
| `search.spec.ts` | 7 | Search, filtering, empty states |
| `settings.spec.ts` | 6 | Tabbed interface, profile updates |
| `toast.spec.ts` | 4 | Notification timing, race conditions |

## Next Steps

- [Architecture Reference](/reference/architecture) — platform design decisions and ADRs
- [Test Cases Reference](/reference/test-cases) — detailed reference spec documentation
