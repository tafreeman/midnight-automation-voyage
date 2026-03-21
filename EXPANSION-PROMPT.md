# Playwright + Copilot Training Platform — Expansion Development Prompt

> Copy this entire prompt into a new session with the project folder mounted to execute the expansion plan.

---

## Role

You are a senior test automation architect expanding an existing Playwright + GitHub Copilot training platform. The platform teaches manual testers and developers how to write automated tests using Playwright with AI-assisted workflows (GitHub Copilot). You will be adding new training modules, new practice app features, new reference tests, and an assessment/certification system.

---

## Project Context

### Repository Structure

```
training-app/          # Interactive learning app (React 19 + TypeScript + Vite 8 + Tailwind 3.4)
  src/
    App.tsx            # Root — sidebar + LessonView, state for currentLesson/completedLessons
    components/
      Sidebar.tsx      # Nav sidebar with progress bar, lesson list, completion badges
      LessonView.tsx   # Renders lesson content: sections, code blocks, quizzes, exercises, prompt templates
      ui/              # shadcn/ui components (Radix-based)
    data/
      types.ts         # Lesson, Quiz, CodeExercise, PromptTemplate interfaces
      index.ts         # Lesson registry — imports all modules, exports ordered array
      modules/         # One .ts file per lesson (01-orientation.ts through 15-cicd-reference.ts)
    assets/

practice-app/          # Test target app (React 19 + TypeScript + Vite 8 + Tailwind 3.4 + react-router-dom 7)
  src/
    App.tsx            # BrowserRouter with Nav + Routes
    pages/             # LoginPage, DashboardPage, ProductsPage, ContactPage, OrdersPage,
                       # ShippingPage, PaymentPage, ReviewPage, ConfirmationPage
    data.ts            # Mock data (users, products, orders)
    CheckoutContext.tsx # Shared checkout state across wizard steps

test-cases/            # Reference tests and mapping documentation
  examples/            # 33 Playwright spec files (login.spec.ts, search.spec.ts, contact.spec.ts,
                       #   orders.spec.ts, checkout.spec.ts)
  test-case-mapping.md # Detailed decomposition: manual test → automated tests with rationale

playwright-copilot-learning.html  # Self-contained learning resource (standalone)
```

### Tech Stack

- **Package manager:** pnpm (lockfiles are pnpm-lock.yaml) — NOT npm/yarn
- **training-app** runs on port 5174, **practice-app** runs on port 5173
- Both apps use: React 19.2, TypeScript 5.9, Vite 8, Tailwind CSS 3.4, shadcn/ui (Radix primitives)
- practice-app additionally uses react-router-dom 7.13 for routing
- UI components: shadcn/ui in `src/components/ui/` (both apps share the same component set)

### Lesson Data Model

Every training module is a TypeScript file in `training-app/src/data/modules/` that exports a `Lesson` object:

```typescript
// training-app/src/data/types.ts
export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CodeExercise {
  title: string;
  description: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
}

export interface PromptTemplate {
  label: string;
  prompt: string;
  context: string;
}

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  audience?: string;    // "All Roles", "Developers", "Non-Coder Essential", etc.
  sections: {
    heading: string;
    content: string;
    code?: string;
    codeLanguage?: string;
    tip?: string;
    warning?: string;
    callout?: string;
    table?: { headers: string[]; rows: string[][] };
  }[];
  quiz?: Quiz;
  exercise?: CodeExercise;
  promptTemplates?: PromptTemplate[];
}
```

### Module Registration Pattern

To add a new module:
1. Create `training-app/src/data/modules/XX-module-name.ts` exporting `lesson`
2. Import it in `training-app/src/data/index.ts`
3. Add it to the `lessons` array (array order = sidebar order)

Example from index.ts:
```typescript
import { lesson as apiTesting } from "./modules/10-api-testing";
// ...
export const lessons: Lesson[] = [
  // ... existing lessons ...
  apiTesting,
];
```

### Practice App Routes

Current routes in practice-app:
```
/login           → LoginPage
/dashboard       → DashboardPage
/products        → ProductsPage
/contact         → ContactPage
/orders          → OrdersPage
/checkout/shipping    → ShippingPage
/checkout/payment     → PaymentPage
/checkout/review      → ReviewPage
/checkout/confirmation → ConfirmationPage
```

New routes need to be added to `practice-app/src/App.tsx` (Routes + Nav links array).

### Reference Test Pattern

All reference tests follow this pattern (from test-cases/examples/login.spec.ts):
```typescript
import { test, expect } from '@playwright/test';

// L1: Login page loads with all elements
test('login page renders with all form elements', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByTestId('email-input')).toBeVisible();
  await expect(page.getByTestId('password-input')).toBeVisible();
  await expect(page.getByTestId('login-button')).toBeVisible();
  await expect(page.getByTestId('login-button')).toBeDisabled();
});
```

Conventions: use `data-testid` selectors, one test per behavior, descriptive test names, comment prefix (e.g. `// L1:`) for traceability.

### Existing 15 Modules (Current State)

| # | Module | Category | Audience |
|---|--------|----------|----------|
| 01 | Who This Is For (Orientation) | Foundation | All |
| 02 | Mindset Shifts: Manual → Automated | Foundation | All |
| 03 | What to Automate (and What Not To) | Foundation | All |
| 04 | Why Playwright + Copilot | Foundation | All |
| 05 | Environment Setup | Practical | All |
| 06 | Copilot Prompt Engineering (CARD Formula) | AI Skills | All |
| 07 | Record → Refine Workflow | Practical | All (Non-coder primary) |
| 08 | Writing Tests from Scratch | Practical | Developers |
| 09 | Page Object Model | Intermediate | Developers |
| 10 | API & Network Testing | Intermediate | Developers |
| 11 | Prompt Template Library | AI Skills | All |
| 12 | Reading Test Results | Practical | All |
| 13 | HITL Review Checklist | Intermediate | All |
| 14 | Non-Coder Survival Guide | Practical | Non-coders |
| 15 | CI/CD & Quick Reference | Intermediate | All |

### Existing Practice App Features & Test Counts

| Feature | Tests | Patterns |
|---------|-------|----------|
| Login | 7 | Form validation, auth errors, lockout, redirect |
| Products/Search | 7 | Search, filter, empty state, keyboard events |
| Contact Form | 7 | Required/optional fields, format validation |
| Orders Table | 6 | Sort, pagination, status filter, data extraction |
| Checkout Wizard | 6 | Multi-step, back nav, data preservation, guards |

---

## What to Build — End State

When complete, the platform will have **31 training modules** (16 new), **10 practice app features** (5 new), **~70 reference tests** (37 new), and an **assessment system** with per-module quizzes and a capstone project.

### Phase 1: New Training Modules (Tier 1 — Critical)

#### Module 16: Auth Fixtures & Storage State
- **File:** `training-app/src/data/modules/16-auth-fixtures.ts`
- **Audience:** All Roles
- **Sections to cover:**
  - Why re-logging in via UI is wasteful (time math: 200 tests × 3s login = 10 min wasted)
  - Playwright's `storageState` concept — global setup saves auth cookies/tokens to a JSON file
  - Setting up `global-setup.ts` that logs in once and saves state
  - Configuring `playwright.config.ts` to use `storageState` in all projects
  - When to skip auth fixtures (login page tests themselves)
  - Copilot prompt template for generating auth fixture setup
- **Quiz:** Ask about when NOT to use storageState
- **Exercise:** Given a starter `playwright.config.ts`, add storageState configuration
- **Practice app dependency:** Needs Admin Panel page (new)

#### Module 17: Visual Regression Testing
- **File:** `training-app/src/data/modules/17-visual-regression.ts`
- **Audience:** All Roles
- **Sections to cover:**
  - What visual regression catches that functional tests miss (CSS bugs, layout shifts, responsive breakage)
  - `toHaveScreenshot()` API — basic usage, options (maxDiffPixels, threshold)
  - Baseline management — first run creates baselines, subsequent runs compare
  - Masking dynamic content (timestamps, avatars, ads) with `mask` option
  - Updating baselines intentionally (`--update-snapshots`)
  - CI integration — storing baselines in git, handling cross-OS pixel differences
  - Copilot prompt template for generating visual tests
- **Quiz:** Ask about masking dynamic content
- **Exercise:** Write a visual regression test for the Dashboard page, masking the date
- **Practice app dependency:** Dashboard Charts page (new)

#### Module 18: Accessibility Testing with axe-core
- **File:** `training-app/src/data/modules/18-accessibility-testing.ts`
- **Audience:** All Roles
- **Sections to cover:**
  - Why accessibility testing matters (legal, brand, user impact, WCAG 2.1 AA standard)
  - Installing and configuring `@axe-core/playwright`
  - Running a full-page a11y scan in 5 lines of code
  - Understanding violation output (impact levels: critical, serious, moderate, minor)
  - Testing specific rules (color-contrast, aria-labels, keyboard-nav)
  - Fixing common violations (missing alt text, form labels, focus management)
  - Adding a11y checks to existing test suites without rewriting
  - Copilot prompt template for a11y test generation
- **Quiz:** Ask about WCAG violation impact levels
- **Exercise:** Add axe-core scan to an existing login test and interpret results
- **Practice app dependency:** Settings/Profile page (new, with intentional a11y issues to find)

#### Module 19: Flaky Test Diagnosis & Recovery
- **File:** `training-app/src/data/modules/19-flaky-test-diagnosis.ts`
- **Audience:** All Roles — Non-Coder Essential
- **Sections to cover:**
  - Root cause taxonomy table: race conditions, selector drift, shared state, test data collisions, timing dependencies, network variability
  - Using the Trace Viewer to diagnose flakiness (step-by-step walkthrough)
  - Playwright's built-in retry configuration (`retries` in config) and when it masks vs. solves problems
  - Quarantine protocol: tag as `@flaky`, move to quarantine suite, diagnose, fix, re-enable
  - The `test.describe.configure({ mode: 'serial' })` escape hatch and why it's usually wrong
  - Prevention checklist (recap of existing HITL items + new items)
  - Copilot prompt template: "Diagnose why this test is flaky"
- **Quiz:** Given a test error output, identify the root cause category
- **Exercise:** Given a deliberately flaky test (timing-dependent), identify and fix the race condition
- **Practice app dependency:** Notifications/Toast system (new, with intentional timing challenges)

#### Module 20: Test Data Strategies
- **File:** `training-app/src/data/modules/20-test-data-strategies.ts`
- **Audience:** Developers (Non-coders: awareness)
- **Sections to cover:**
  - Why hardcoded test data fails at scale (collision, staleness, environment coupling)
  - Test data hierarchy: hardcoded → fixtures → factories → API-seeded → database-seeded
  - Playwright fixtures (`test.extend`) for custom test data injection
  - `beforeEach` / `afterEach` for data setup and teardown
  - API-seeding pattern: call backend API to create test data before each test
  - Data isolation: each test creates its own data with unique identifiers
  - Shared data anti-patterns (tests that depend on other tests' data)
  - Copilot prompt template for generating data factory code
- **Quiz:** Identify the data isolation violation in a code sample
- **Exercise:** Refactor a test that uses hardcoded data to use fixtures
- **Practice app dependency:** Admin Panel (new, with API endpoints for data seeding)

#### Module 21: Assessment & Certification (meta-module)
- **File:** `training-app/src/data/modules/21-assessment.ts`
- **Audience:** All Roles
- **Sections to cover:**
  - How the assessment system works (per-module quizzes + capstone project)
  - Capstone project spec: "Given the following acceptance criteria for a new feature, write a complete Playwright test suite including: functional tests, a visual regression test, an accessibility scan, and auth fixture usage. Use Copilot prompts to generate initial code, then refine."
  - Grading rubric (10-point scale matching HITL checklist + new criteria for visual/a11y/fixture usage)
  - Self-assessment vs. peer review workflow
  - Certification levels: Bronze (Modules 1–15 quizzes passed), Silver (+ Modules 16–20 + capstone), Gold (+ advanced modules)

### Phase 2: New Training Modules (Tier 2 — Significant)

#### Module 22: Trace Viewer Deep-Dive
- **File:** `training-app/src/data/modules/22-trace-viewer.ts`
- **Audience:** All Roles
- **Sections:** Time-travel debugging, DOM snapshots at each step, network waterfall, console log correlation, comparing passing vs. failing traces, using `trace: 'on-first-retry'` config
- **Quiz + Exercise:** Given a trace screenshot, identify the failure point

#### Module 23: Mobile & Responsive Testing
- **File:** `training-app/src/data/modules/23-mobile-responsive.ts`
- **Audience:** All Roles
- **Sections:** Device emulation config, viewport assertions, touch event simulation, responsive breakpoint testing, `projects` array for device matrix, Copilot template for mobile test generation
- **Quiz + Exercise:** Configure a test to run against iPhone 14 and iPad

#### Module 24: Parallel Execution & Sharding
- **File:** `training-app/src/data/modules/24-parallel-sharding.ts`
- **Audience:** Developers
- **Sections:** `fullyParallel` config, worker count tuning, CI sharding (`--shard=1/4`), artifact collection from shards, when serial mode is justified, performance benchmarks (serial vs. parallel)
- **Quiz + Exercise:** Configure sharding for a GitHub Actions matrix

#### Module 25: Multi-Browser & Projects Config
- **File:** `training-app/src/data/modules/25-multi-browser.ts`
- **Audience:** Developers
- **Sections:** `projects` array in config, browser-specific assertions, cross-browser CI matrix, handling browser-specific quirks, `browserName` conditional logic
- **Quiz + Exercise:** Add Firefox and WebKit to an existing config

#### Module 26: Test Tagging & Pipeline Gating
- **File:** `training-app/src/data/modules/26-test-tagging.ts`
- **Audience:** All Roles
- **Sections:** `@smoke`, `@regression`, `@p1`, `@visual`, `@a11y` tags, `--grep` and `--grep-invert` filters, CI gate configurations (smoke on every commit, full regression nightly), tag naming conventions
- **Quiz + Exercise:** Tag existing tests and write CI config to run only @smoke on PRs

#### Module 27: GitHub Actions CI/CD
- **File:** `training-app/src/data/modules/27-github-actions.ts`
- **Audience:** All Roles
- **Sections:** Complete GitHub Actions workflow YAML, artifact upload for reports, PR status checks, matrix strategy for browsers, caching node_modules, Playwright container image, comparing GitHub Actions vs. GitLab CI
- **Quiz + Exercise:** Write a workflow that runs smoke tests on PRs and full regression on main

### Phase 3: New Training Modules (Tier 3 — Advanced)

#### Module 28: Playwright MCP & AI Agents
- **File:** `training-app/src/data/modules/28-playwright-mcp.ts`
- **Audience:** All Roles
- **Sections:** What MCP is (Model Context Protocol), how Playwright MCP differs from Copilot inline, setting up @playwright/mcp, AI-driven test generation workflow, self-healing locators concept, autonomous debugging, limitations and human oversight requirements
- **Copilot prompt templates** for MCP-native workflows

#### Module 29: Component Testing (React)
- **File:** `training-app/src/data/modules/29-component-testing.ts`
- **Audience:** Developers
- **Sections:** Playwright CT setup for React, isolated component rendering, prop testing, event simulation, comparing CT vs. E2E for different scenarios

#### Module 30: Performance Baseline Testing
- **File:** `training-app/src/data/modules/30-performance-testing.ts`
- **Audience:** Developers
- **Sections:** Measuring Web Vitals (LCP, FCP, CLS) in Playwright, setting performance thresholds, detecting performance regressions in CI, `page.metrics()` API

#### Module 31: Custom Reporters & Notifications
- **File:** `training-app/src/data/modules/31-custom-reporters.ts`
- **Audience:** Developers
- **Sections:** Built-in reporters (HTML, JSON, JUnit), Allure integration, custom reporter API, Slack/Teams webhook notifications, trend dashboards

### New Practice App Features

Build these 5 new pages/features in the practice-app:

#### 1. File Upload Page (`/upload`)
- **File:** `practice-app/src/pages/UploadPage.tsx`
- **Features:** File input with `data-testid="file-input"`, drag-and-drop zone (`data-testid="drop-zone"`), file preview with name/size, upload button, success/error feedback
- **Testing patterns taught:** File input interaction, drag-and-drop testing, visual diff of uploaded preview
- **Reference tests:** `test-cases/examples/upload.spec.ts` (~5 tests)

#### 2. Dashboard Charts (`/dashboard` enhancement)
- **Modify:** `practice-app/src/pages/DashboardPage.tsx`
- **Features:** Add summary stat cards (`data-testid="stat-revenue"`, etc.), a chart container (`data-testid="chart-container"`) with dynamic data, date range selector, loading skeleton
- **Testing patterns taught:** Dynamic content masking for visual tests, canvas/SVG assertions, performance metrics
- **Reference tests:** Add to `test-cases/examples/dashboard.spec.ts` (~5 tests)

#### 3. Settings / Profile Page (`/settings`)
- **File:** `practice-app/src/pages/SettingsPage.tsx`
- **Features:** Profile form (name, email, avatar upload), notification preferences (toggle switches), theme selector (light/dark), keyboard-navigable tab sections
- **Intentional a11y issues:** Missing form labels on 2 fields, low-contrast text on 1 element, missing skip-to-content link — for learners to discover via axe-core
- **Testing patterns taught:** ARIA labels, form accessibility, responsive layout, keyboard navigation
- **Reference tests:** `test-cases/examples/settings.spec.ts` (~6 tests including a11y scans)

#### 4. Notifications / Toast System (global)
- **Modify:** Add toast/notification system across the app
- **Features:** Toast notifications on form submit, order status change, etc. using `data-testid="toast-container"` and `data-testid="toast-message"`. Include auto-dismiss after 3s and manual close button.
- **Testing patterns taught:** Timing-dependent UI, animation waits, deliberate flakiness scenarios for diagnosis exercises
- **Reference tests:** `test-cases/examples/notifications.spec.ts` (~4 tests)

#### 5. Admin Panel (`/admin`)
- **File:** `practice-app/src/pages/AdminPage.tsx`
- **Features:** Role-gated access (admin vs. regular user), user management table, API-style data seeding endpoints (simulated), bulk actions
- **Testing patterns taught:** Multi-role auth fixtures, storageState per role, API-seeded test data, parallel-safe data isolation
- **Reference tests:** `test-cases/examples/admin.spec.ts` (~7 tests)

### Assessment System Enhancements

Every existing module (01–15) that does NOT already have a quiz should get one added. Follow the Quiz interface:

```typescript
quiz: {
  question: "...",
  options: ["A...", "B...", "C...", "D..."],
  correctIndex: 0, // 0-based
  explanation: "..."
}
```

Every module that does NOT already have an exercise should get one where it makes sense (skip for pure conceptual modules like 01-orientation and 02-mindset-shifts).

### Updated test-case-mapping.md

Add new sections to `test-cases/test-case-mapping.md` covering:
- Auth fixture decomposition (how the 33 existing tests would be refactored to use storageState)
- Visual regression mapping for each practice feature
- Accessibility test mapping for Settings page
- Admin panel data isolation patterns

---

## Implementation Guidelines

### Content Quality Standards

1. **Every module must be production-quality training content** — not placeholder text. Write as if this is being delivered to a Deloitte engagement team.
2. **Code samples must be correct and runnable** against the practice app. No pseudo-code.
3. **Tables should use concrete examples**, not generic descriptions.
4. **Each section.content should be 2-4 sentences** — information-dense, not padded.
5. **Warnings and tips must be actionable**, not generic ("avoid flaky tests" ✗ → "replace waitForTimeout(3000) with expect(locator).toBeVisible()" ✓).
6. **Copilot prompt templates must follow the CARD formula** established in Module 06.

### Practice App Standards

1. **All interactive elements must have `data-testid` attributes** for Playwright selector compatibility.
2. **Use the existing UI component library** (shadcn/ui from `src/components/ui/`).
3. **Follow the existing routing pattern** in App.tsx (add Route + Nav link).
4. **Mock data should live in `src/data.ts`** following the existing pattern.
5. **New pages should match the existing visual style** (check LoginPage.tsx and ProductsPage.tsx for reference).

### Reference Test Standards

1. **One test per behavior** — no multi-assertion mega-tests.
2. **Use `data-testid` selectors** exclusively (getByTestId or getByRole).
3. **Descriptive test names** that describe the user scenario, not the implementation.
4. **Comment prefix** for traceability (e.g., `// U1: File upload succeeds for valid PNG`).
5. **No `waitForTimeout`** — use Playwright's auto-wait or explicit `expect` waits.
6. **Each test navigates independently** — no shared state between tests.

### File Naming Conventions

- Modules: `XX-kebab-case-name.ts` (e.g., `16-auth-fixtures.ts`)
- Practice pages: `PascalCasePage.tsx` (e.g., `SettingsPage.tsx`)
- Reference tests: `feature-name.spec.ts` (e.g., `settings.spec.ts`)

---

## Execution Order

Work in this order to avoid dependency issues:

1. **Practice app features first** — build the 5 new pages/features so training content can reference real code and selectors
2. **Reference tests second** — write the ~37 new spec files targeting the new + existing features
3. **Tier 1 modules (16–21)** — these are the critical training gaps
4. **Add quizzes/exercises to existing modules (01–15)** — backfill assessment content
5. **Tier 2 modules (22–27)** — significant enhancements
6. **Tier 3 modules (28–31)** — advanced/future-proofing content
7. **Update index.ts** — register all new modules in the lessons array
8. **Update test-case-mapping.md** — add new decomposition sections
9. **Verify builds** — run `pnpm build` in both training-app and practice-app

---

## Verification Checklist

Before considering this complete:

- [ ] `cd training-app && pnpm install && pnpm build` succeeds with no TypeScript errors
- [ ] `cd practice-app && pnpm install && pnpm build` succeeds with no TypeScript errors
- [ ] All 31 modules render correctly in the training app (no missing sections, broken code blocks)
- [ ] All 10 practice app routes load without errors
- [ ] All new practice pages have consistent `data-testid` attributes
- [ ] Every new module has at least: 3+ sections, 1 code sample, audience tag
- [ ] Every Tier 1 module has: quiz, exercise, and at least 1 prompt template
- [ ] Reference test count is ~70 (33 existing + ~37 new)
- [ ] No `waitForTimeout` in any reference test
- [ ] `test-case-mapping.md` has sections for all 10 features
- [ ] Settings page has 3 intentional a11y violations for the accessibility module exercise
- [ ] Toast system has timing-dependent behavior for the flaky test diagnosis exercise

---

## End State Summary

| Metric | Current | Target |
|--------|---------|--------|
| Training modules | 15 | 31 |
| Practice app features | 5 | 10 |
| Practice app routes | 9 | 14 |
| Reference tests | 33 | ~70 |
| Modules with quizzes | ~5 | 31 |
| Modules with exercises | ~4 | 20+ |
| Prompt templates | ~8 | 20+ |
| Maturity level | Level 2 (Managed) | Level 4 (Measured) |
| Assessment/cert system | None | 3-tier (Bronze/Silver/Gold) |
| CI providers covered | GitLab only | GitLab + GitHub Actions |
| Browser coverage | Single | Multi-browser (Chrome/Firefox/WebKit) |
| Testing types | Functional only | Functional + Visual + Accessibility + Performance |
