# AI-Assisted Playwright Test Writing — Knowledge Base

> **Purpose:** Research foundation for a new training course/content set focused on using GitHub Copilot (and LLMs generally) to write Playwright E2E tests with minimal manual effort.
>
> **Last updated:** 2026-03-26
>
> **Sources:** Official docs, academic papers, industry blogs, Microsoft Learn, Playwright team content. All URLs cited inline.

---

## Table of Contents

1. [The AI-Assisted Testing Workflow](#1-the-ai-assisted-testing-workflow)
2. [GitHub Copilot for Playwright — Features & Modes](#2-github-copilot-for-playwright--features--modes)
3. [Configuring Copilot for Optimal Test Generation](#3-configuring-copilot-for-optimal-test-generation)
4. [Prompt Engineering for Test Generation](#4-prompt-engineering-for-test-generation)
5. [Playwright Best Practices for AI-Generated Tests](#5-playwright-best-practices-for-ai-generated-tests)
6. [Common Failure Patterns & How to Fix Them](#6-common-failure-patterns--how-to-fix-them)
7. [Playwright MCP & Agent Architecture](#7-playwright-mcp--agent-architecture)
8. [Page Object Model with LLMs](#8-page-object-model-with-llms)
9. [Copilot vs Claude vs ChatGPT — Comparison](#9-copilot-vs-claude-vs-chatgpt--comparison)
10. [Academic Research & Industry Evidence](#10-academic-research--industry-evidence)
11. [Tools & Ecosystem](#11-tools--ecosystem)
12. [Concrete Prompt Library](#12-concrete-prompt-library)
13. [Mapping to Existing MAV Content](#13-mapping-to-existing-mav-content)
14. [Proposed Course Outline](#14-proposed-course-outline)
15. [Pitfalls & Warnings](#15-pitfalls--warnings)

---

## 1. The AI-Assisted Testing Workflow

### The Generate → Review → Run → Fix Loop

The consensus across industry sources is that optimal AI-assisted test writing is **iterative, not one-shot**. Simply asking an LLM to "write a Playwright test" without context produces hallucinated selectors and deprecated API calls.

**The proven loop:**

```
┌─────────────────────────────────────────────────┐
│  1. CONTEXT  →  Provide page structure, existing │
│                 patterns, selector preferences    │
│  2. GENERATE →  LLM produces test (step-by-step  │
│                 via MCP is best, not one-shot)    │
│  3. REVIEW   →  Human checks selectors, waits,   │
│                 assertions, anti-patterns          │
│  4. RUN      →  Execute test, expect failures     │
│  5. FIX      →  Feed errors + DOM snapshot back   │
│                 to LLM (max 3 iterations)          │
└─────────────────────────────────────────────────┘
```

**Key insight from Checkly research:** Running test steps one-by-one via Playwright MCP tools produces far better results than generating all code from a scenario description alone.

**Key insight from Microsoft Azure DevOps team:** "Quality of context is important — teams need to either improve their test cases by writing clearer, more detailed steps, or spend more time fixing the generated scripts later."

**Sources:**
- [Checkly: Generating E2E tests with AI and Playwright MCP](https://www.checklyhq.com/blog/generate-end-to-end-tests-with-ai-and-playwright/)
- [Azure DevOps Blog: From Manual Testing to AI-Generated Automation](https://devblogs.microsoft.com/devops/from-manual-testing-to-ai-generated-automation-our-azure-devops-mcp-playwright-success-story/)

---

## 2. GitHub Copilot for Playwright — Features & Modes

### 2.1 Inline Completions (Ghost Text)

The most common Copilot interaction. Works best when you **seed the pattern**:

```typescript
// Type a descriptive comment → Copilot completes the test
// Test that the login form shows validation error for empty email
test('shows validation error for empty email', async ({ page }) => {
  // Copilot autocompletes from here based on:
  // - The comment above
  // - Other test files in the workspace
  // - The page objects and fixtures it can see
});
```

**How to get better completions:**
- Write a good `test.describe()` block name — Copilot uses it as context
- Add a one-line comment before each `test()` describing the scenario
- Keep an exemplar test file open in a split pane — Copilot reads open files
- Use consistent naming: `feature.spec.ts`, `FeaturePage.ts`

### 2.2 Copilot Chat Commands

| Command | Usage | Best For |
|---------|-------|----------|
| `/tests` | Select code, type `/tests` | Generate tests for selected code |
| `/fix` | Paste error output | Fix failing tests |
| `/explain` | Select test code | Understand what a test does |
| `@workspace` | Ask about your project | Find patterns, understand structure |
| `#file:path` | Reference specific file | Include file as context |
| `#selection` | Reference selection | Include highlighted code |
| `#terminalLastCommand` | Reference terminal | Include test error output |

**Example Chat prompts:**
```
@workspace Generate a Playwright test for the user settings page,
following the same pattern as auth.spec.ts and using the existing
BasePage class from tests/pages/

#file:tests/e2e/auth.spec.ts #file:tests/pages/BasePage.ts
Generate a similar test for the checkout flow
```

### 2.3 Copilot Edits (Multi-File)

Copilot Edits mode can generate or modify multiple files at once. Use for:
- Creating a Page Object + its test file simultaneously
- Refactoring selectors across multiple test files
- Adding fixtures and updating tests that use them

### 2.4 Copilot Agent Mode (VS Code)

The newest capability — Copilot runs autonomously in a loop:
1. Generates code
2. Runs terminal commands (tests)
3. Reads error output
4. Fixes and re-runs

**Ideal for:** "Write a Playwright test for the checkout flow, run it, and fix any failures."

### 2.5 Copilot Coding Agent (Cloud, GitHub-Hosted)

A separate capability from local Agent Mode — runs on GitHub's infrastructure:
- Triggered via GitHub issues or PRs
- Has **Playwright MCP built-in by default** (since July 2025)
- Can autonomously open a browser, test changes, and verify its work
- Accessible only on localhost/127.0.0.1 within its environment
- Best for: CI-triggered test generation and validation

**Key distinction:** Local agent mode = interactive development. Cloud coding agent = automated PR workflows.

**Reference:** [GitHub Docs: MCP and Coding Agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/mcp-and-coding-agent)

### 2.6 Vision Capabilities

Copilot Chat in VS Code supports image attachments:
- **Paste screenshots** of the UI → generate tests from what you see
- **Paste failed screenshot diffs** → diagnose visual regression failures
- **Generate Page Objects from UI screenshots** → locators for visible elements

**Sources:**
- [VS Code Copilot Getting Started](https://code.visualstudio.com/docs/copilot/getting-started-chat)
- [Microsoft Learn: Test like a pro with Playwright and GitHub Copilot](https://learn.microsoft.com/en-us/shows/visual-studio-code/test-like-a-pro-with-playwright-and-github-copilot)

---

## 3. Configuring Copilot for Optimal Test Generation

### 3.1 Repository Instructions (`.github/copilot-instructions.md`)

Automatically appended to every Copilot Chat request. Create this file at your repo root:

```markdown
# Project Testing Instructions

## Tech Stack
- TypeScript with strict mode
- Playwright for E2E testing (v1.49+)
- Page Object Model pattern for all test files
- Tests located in `tests/e2e/` directory

## Playwright Conventions
- Always use `test.describe` blocks to group related tests
- Use POM classes from `tests/pages/` — never use raw selectors in test files
- Prefer `getByRole`, `getByTestId`, `getByText` locator strategies (in that priority)
- Use `test.beforeEach` for navigation and auth setup
- All tests must be independently runnable (no test ordering dependencies)
- Use `expect(page).toHaveURL()` for navigation assertions
- Use `expect(locator).toBeVisible()` before interacting with elements
- Fixtures defined in `tests/fixtures/` — extend base test with custom fixtures
- Use `test.step()` for logical grouping within a test
- API mocking uses `page.route()` — mock definitions in `tests/mocks/`

## Code Style
- Use `async/await` throughout (no `.then()` chains)
- Destructure `{ page, request }` from test fixtures
- Name test files as `<feature>.spec.ts`
- Name page objects as `<Page>Page.ts` (e.g., `LoginPage.ts`)

## Do NOT
- Do not use `page.waitForTimeout()` — use proper auto-waiting
- Do not use CSS selectors when a role/testid/text locator is available
- Do not hardcode URLs — use baseURL from playwright.config.ts
- Do not use `page.evaluate()` unless absolutely necessary
```

**Reference:** [GitHub Docs: Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)

### 3.2 VS Code Settings

```jsonc
// .vscode/settings.json
{
  // Test generation specific instructions
  "github.copilot.chat.testGeneration.instructions": [
    { "file": ".github/copilot-instructions.md" },
    { "text": "Use Playwright. Use Page Object Model. Use getByRole locators. Follow AAA pattern." }
  ],

  // Code generation instructions
  "github.copilot.chat.codeGeneration.instructions": [
    { "file": ".github/copilot-instructions.md" },
    { "file": "docs/testing-standards.md" }
  ],

  // Enable instruction files (default true since early 2025)
  "github.copilot.chat.codeGeneration.useInstructionFiles": true
}
```

### 3.3 Reusable Prompt Files (`.github/prompts/*.prompt.md`)

New feature (2025+). Define reusable prompts team members can invoke from Chat:

```markdown
<!-- .github/prompts/playwright-test.prompt.md -->
---
mode: agent
description: Generate a Playwright E2E test for a given feature
---

# Generate Playwright E2E Test

## Context
- Read existing Page Object Model classes in `tests/pages/`
- Read `playwright.config.ts` for project configuration
- Check `tests/fixtures/` for available custom fixtures

## Requirements
1. Create a new `.spec.ts` file in `tests/e2e/`
2. Import and use existing POM classes, or create new ones if needed
3. Use `test.describe()` for grouping
4. Use `test.beforeEach()` for setup (navigation, auth)
5. Each `test()` should be independent
6. Use role-based locators: `getByRole`, `getByTestId`, `getByText`
7. Include both happy path and error cases
8. Use soft assertions (`expect.soft()`) for non-critical checks

## Locator Priority
1. `getByRole()` — ARIA roles (preferred)
2. `getByTestId()` — data-testid attributes
3. `getByText()` — visible text
4. `getByLabel()` — form labels
5. CSS/XPath — last resort only
```

Invoke in Chat: type `#` and select the prompt file.

```markdown
<!-- .github/prompts/page-object.prompt.md -->
---
mode: agent
description: Create a Page Object Model class for Playwright
---

# Create Page Object Model

1. File goes in `tests/pages/<Name>Page.ts`
2. Class name: `<Name>Page`
3. Constructor takes `page: Page` from Playwright
4. All locators as readonly properties using `this.page.getByRole()` etc.
5. Methods for user actions (click, fill, navigate)
6. Methods return `Promise<void>` or the page object for chaining
```

**Reference:** [VS Code: Prompt Files](https://code.visualstudio.com/docs/copilot/copilot-customization#_reusable-prompt-files-experimental)

### 3.4 File-Scoped Instructions (`.github/instructions/*.instructions.md`)

Target specific file types with YAML `applyTo` globs:

```markdown
<!-- .github/instructions/playwright-tests.instructions.md -->
---
applyTo: "tests/**/*.spec.ts"
---

# Playwright Test File Instructions

- Import from `@playwright/test` only
- Use Page Object classes from `pages/` directory
- Every test must have at least one assertion
- Group related assertions in `test.step()` blocks
- Use `test.slow()` for tests that need extended timeout
```

```markdown
<!-- .github/instructions/page-objects.instructions.md -->
---
applyTo: "tests/pages/**/*.ts"
---

# Page Object Instructions

- One class per page/major component
- All locators as readonly properties in constructor
- Use getByRole for buttons/links, getByLabel for inputs
- Methods return Promise<void> or this for chaining
```

This gives you **layered control**: repo-wide conventions in `copilot-instructions.md`, file-type-specific rules in scoped instructions.

### 3.5 Agent Skills (SKILL.md)

As of VS Code 1.108+, you can define **Agent Skills** — folders of instructions, scripts, and resources that Copilot loads when relevant:

```yaml
# skills/webapp-testing/SKILL.md
---
name: webapp-testing
description: >
  Toolkit for interacting with and testing local web applications
  using Playwright. Supports verifying frontend functionality,
  debugging UI behavior, capturing browser screenshots, and
  viewing browser logs.
---
```

The `github/awesome-copilot` repo provides an official `webapp-testing` skill and `playwright-typescript.instructions.md` with rules like:
- Favor semantic queries over implementation details
- Use `test.step()` for test clarity in reports
- Rely on auto-waiting — NO manual delays
- Use `toMatchAriaSnapshot()` for accessibility tree verification
- Avoid `toBeVisible()` except for visibility transitions

**Reference:** [VS Code: Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)

### 3.6 Writing Effective Instructions — Tips from GitHub

From the official "5 tips for better custom instructions" blog:

1. **Include WHY behind rules** — AI makes better edge-case decisions
2. **Show preferred AND avoided patterns** with concrete code
3. **Focus on non-obvious rules** — skip what linters catch
4. **Keep instructions short and self-contained**
5. **Limit to ~1,000 lines** per file — quality degrades beyond this
6. **Iterate continuously** — start small, test with real PRs

**Reference:** [GitHub Blog: 5 tips for custom instructions](https://github.blog/ai-and-ml/github-copilot/5-tips-for-writing-better-custom-instructions-for-copilot/)

### 3.7 Project Structure That Helps Copilot

```
project/
├── .github/
│   ├── copilot-instructions.md      # Repo-level instructions
│   └── prompts/
│       ├── playwright-test.prompt.md
│       └── page-object.prompt.md
├── .vscode/
│   ├── settings.json                # Copilot settings
│   └── mcp.json                     # MCP server config
├── playwright.config.ts
├── tests/
│   ├── e2e/
│   │   ├── auth.spec.ts             # Exemplar tests (Copilot learns from these)
│   │   └── dashboard.spec.ts
│   ├── pages/
│   │   ├── BasePage.ts              # Base class — Copilot follows this pattern
│   │   ├── LoginPage.ts
│   │   └── DashboardPage.ts
│   ├── fixtures/
│   │   └── test-fixtures.ts
│   └── mocks/
│       └── api-mocks.ts
└── src/                              # Application source
```

**Critical insight:** Having 2-3 well-written example tests is **more effective** than lengthy instructions alone. Copilot mimics the patterns it finds in your codebase.

---

## 4. Prompt Engineering for Test Generation

### 4.1 The PAGE Framework (from existing MAV content)

Designed specifically for prompting Copilot to write Playwright tests:

- **P**age — Where the flow starts (URL, page name)
- **A**ctions — User steps in order
- **G**uardrails — Rules, constraints, patterns to follow
- **E**vidence — What assertions to make

**Example:**
```
Page: /checkout/shipping (authenticated user)
Actions:
1. Fill shipping address form (name, street, city, state, zip)
2. Select "Express" shipping option
3. Click "Continue to Payment"
Guardrails:
- Use getByLabel for form fields
- Use storageState for authentication (don't log in manually)
- Mock the shipping API to return fixed rates
Evidence:
- Form validates required fields before submission
- Express option shows "$12.99" price
- After continue, URL changes to /checkout/payment
- Shipping summary shows entered address
```

### 4.2 The CARD Framework (from existing MAV content)

Alternative prompt structure:

- **C**ontext — Page/component under test
- **A**ctions — User flow steps
- **R**ules — Business logic, validation rules
- **D**ata — Test data and edge cases

### 4.3 Comment-Driven Autocomplete

Copilot responds strongly to descriptive comments:

```typescript
test.describe('Product Search', () => {
  // Test that searching for a product by name shows matching results
  test('filters products by search term', async ({ page }) => {
    // Navigate to products page
    // Type "widget" in the search input
    // Click the search button
    // Verify that only products containing "widget" appear
    // Verify the result count badge shows the correct number
  });

  // Test that searching for a non-existent product shows empty state
  test('shows empty state for no results', async ({ page }) => {
    // ...Copilot fills in based on the pattern above
  });
});
```

### 4.4 Effective Chat Prompts — Concrete Examples

**Simple test generation:**
```
Generate a Playwright test for the login page at /login.
Test credentials: user@test.com / Password123!
Test: successful login redirects to /dashboard
Test: wrong password shows "Invalid credentials" error
Test: empty email shows validation message
Use getByRole and getByLabel locators.
```

**With existing pattern reference:**
```
#file:tests/e2e/auth.spec.ts
Generate a similar test for the /contact page.
Follow the same pattern: beforeEach navigation, describe block,
independent tests, getByRole locators.
Test: submit with valid data shows success toast
Test: submit with empty required fields shows validation errors
Test: email field rejects invalid format
```

**Fixing a failure:**
```
#terminalLastCommand
This Playwright test is failing with TimeoutError on the getByRole('button', { name: 'Submit' }).
The button text might be different. Can you check what button elements
exist on the page and fix the locator?
```

**From a screenshot:**
```
[paste screenshot of settings page]
Generate a Page Object Model class for this settings page.
Include locators for all visible interactive elements.
Use getByRole for buttons and tabs, getByLabel for form fields.
```

### 4.5 The Assertion Trap

**Warning from existing MAV content:** Copilot generates syntactically valid assertions that may test the wrong thing. Always verify:
- Is the assertion checking the **right element**?
- Is it checking the **right property** (text vs visibility vs count)?
- Would the assertion **actually fail** if the feature were broken?

```typescript
// Copilot might generate this — looks right but tests nothing meaningful:
await expect(page.getByRole('heading')).toBeVisible(); // Always true if page loads

// Better — tests actual content:
await expect(page.getByRole('heading', { level: 1 })).toHaveText('Order Confirmed');
```

---

## 5. Playwright Best Practices for AI-Generated Tests

### 5.1 Selector Priority (Non-Negotiable)

| Priority | Locator | When |
|----------|---------|------|
| 1 | `getByRole('button', { name: 'Submit' })` | Always try first |
| 2 | `getByLabel('Email')` | Form fields with labels |
| 3 | `getByPlaceholder('Enter email')` | Inputs without visible labels |
| 4 | `getByText('Welcome back')` | Visible text |
| 5 | `getByTestId('submit-btn')` | Escape hatch only |
| 6 | CSS/XPath | Last resort, document why |

**Why role-based selectors:** They mirror how assistive technology sees the page. If your test can find it by role, a user can too. Survives CSS refactors, DOM restructuring, and styling overhauls.

### 5.2 Auto-Waiting — Never Use Sleep

```typescript
// WRONG — LLMs love generating this
await page.waitForTimeout(2000);
await page.waitForSelector('#element');

// RIGHT — Playwright auto-waits for actionability
await page.getByRole('button', { name: 'Submit' }).click();
// Auto-waits for: attached, visible, stable, enabled, unobscured
```

### 5.3 Web-First Assertions (Auto-Retry)

```typescript
// WRONG — evaluates once, flaky
const text = await page.getByRole('heading').textContent();
expect(text).toBe('Dashboard');

// RIGHT — retries until match or timeout
await expect(page.getByRole('heading')).toHaveText('Dashboard');
await expect(page.getByRole('listitem')).toHaveCount(5);
await expect(page).toHaveURL(/.*dashboard/);
```

### 5.4 Test Isolation

Each test must be independent:
```typescript
// WRONG — depends on previous test
test('create user', async ({ page }) => { /* ... */ });
test('edit user', async ({ page }) => { /* assumes user from above */ });

// RIGHT — each test sets up its own state
test('edit user', async ({ page, request }) => {
  await request.post('/api/users', { data: { name: 'Test' } }); // API setup
  await page.goto('/users');
  // ...
});
```

### 5.5 Authentication Pattern

```typescript
// auth.setup.ts — runs once, saves state
setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@test.com');
  await page.getByLabel('Password').fill('AdminPass1!');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.context().storageState({ path: '.auth/user.json' });
});

// Tests reuse saved auth state — no login per test
// Configured in playwright.config.ts via storageState
```

### 5.6 Network Mocking

```typescript
// Mock API response
await page.route('**/api/products', (route) => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Widget', price: 9.99 }]),
  });
});

// Simulate API failure
await page.route('**/api/users', (route) => {
  route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) });
});

// Modify real response
await page.route('**/api/items', async (route) => {
  const response = await route.fetch();
  const json = await response.json();
  json.push({ id: 999, title: 'Injected Item' });
  await route.fulfill({ response, json });
});
```

**References:**
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Playwright Auto-Waiting](https://playwright.dev/docs/actionability)
- [Playwright Network Mocking](https://playwright.dev/docs/mock)

---

## 6. Common Failure Patterns & How to Fix Them

### 6.1 What LLMs Get Wrong (Most Frequent → Least)

| # | Anti-Pattern | What LLMs Do | Correct Approach |
|---|---|---|---|
| 1 | **Hardcoded waits** | `page.waitForTimeout(2000)` | Remove — Playwright auto-waits |
| 2 | **CSS selectors** | `locator('.btn-primary')` | `getByRole('button', { name: '...' })` |
| 3 | **Deprecated APIs** | `page.waitForNavigation()` | Modern patterns (`expect(page).toHaveURL()`) |
| 4 | **Hallucinated selectors** | Invents selectors without seeing DOM | Use MCP snapshot or provide HTML context |
| 5 | **Non-retrying assertions** | `const text = ...; expect(text).toBe(...)` | `await expect(locator).toHaveText(...)` |
| 6 | **Test interdependence** | Tests share state, rely on order | Each test sets up its own state |
| 7 | **Strict mode band-aids** | `.first()` or `.nth(0)` everywhere | Fix the ambiguous locator properly |
| 8 | **Over-engineering** | Complex abstractions for simple tests | YAGNI — flat inline tests are fine for simple cases |

### 6.2 The CHATREPAIR Pattern (Iterative Fix Loop)

When a test fails, feed back to the LLM:
1. **Test name** and relevant test code
2. **Full error message** (TimeoutError, assertion mismatch, strict mode violation)
3. **Accessibility snapshot** of the current page state
4. **Specific question** targeting the failure type

**Examples:**
```
TimeoutError: "Element getByRole('button', { name: 'Submit' }) was not found.
Here is the accessibility tree of the page: [snapshot].
What is the correct locator for the submit button?"

Strict mode: "Locator matched 3 elements. Here are the matches: [list].
Which one is the correct target and how should I disambiguate?"

Assertion: "Expected 'Welcome back' but got 'Loading...'.
The page hasn't finished its API call. How should I wait for it?"
```

**Key finding:** 3 iterations is the sweet spot. Beyond that, the LLM makes lateral changes rather than converging.

### 6.3 Cost of Flakiness

An industrial case study found developers spend **1.28% of working time** repairing flaky tests — ~$2,250/month per developer ($270,000/year for a team of 10). Teaching people to avoid generating flaky tests is high-ROI.

**Sources:**
- [TestDino: Why Playwright Tests Fail](https://testdino.com/blog/playwright-test-failure/)
- [Checkly: Evaluating Copilot for Playwright](https://www.checklyhq.com/blog/playwright-codegen-with-github-copilot/)
- [arXiv: Fixing Code Generation Errors](https://arxiv.org/html/2409.00676v1/)

---

## 7. Playwright MCP & Agent Architecture

### 7.1 Playwright MCP Server

Microsoft's official MCP server gives LLMs structured browser access:

```jsonc
// .vscode/mcp.json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "type": "stdio"
    }
  }
}
```

**Tools provided:**
- `browser_navigate` — go to URL
- `browser_click` — click element (by accessibility snapshot)
- `browser_type` — type into input
- `browser_screenshot` — take screenshot
- `browser_snapshot` — get accessibility tree
- `browser_console_messages` — read console

**Usage in Copilot Agent mode:**
```
Use the Playwright MCP server to navigate to http://localhost:5173/login,
take an accessibility snapshot, then generate a test based on what you see.
```

### 7.2 Playwright Test Agents (v1.56+, 2026)

Playwright now ships three specialized AI agents:

| Agent | Role |
|-------|------|
| **Planner** | Explores the app, produces a structured Markdown test plan |
| **Generator** | Transforms plan into executable tests, validates selectors against live browser |
| **Healer** | Automatically repairs failing tests by re-examining the UI |

**The Seed Test Pattern:** Provide one working "seed test" as context. The Planner runs it to execute global setup, fixtures, and uses it as a pattern for all generated tests.

### 7.3 Playwright CLI (Lighter Alternative)

`@playwright/cli` (2026) saves accessibility snapshots to disk instead of streaming them. ~4x fewer tokens per task.

**Sources:**
- [Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- [Playwright Docs: Test Agents](https://playwright.dev/docs/test-agents)
- [VS Code MCP Servers](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)

---

## 8. Page Object Model with LLMs

### 8.1 Research Findings

An arXiv study (Feb 2026) evaluated GPT-4o and DeepSeek Coder on Page Object generation:
- **Accuracy:** 32.6% to 54.0% (moderate)
- **Element recognition:** >70%
- **Struggles with:** Navigation methods, return types, lengthy HTML

### 8.2 What Works

- **POM with examples** — provide an existing Page Object as template, LLMs extend it reliably
- **Flat inline tests for simple cases** — LLMs produce better single-file tests for simple scenarios
- **Typed fixtures** — LLMs handle Playwright's `test.extend()` well with examples

### 8.3 Recommended POM Pattern for LLM Generation

```typescript
// tests/pages/LoginPage.ts — Give this to Copilot as a pattern
import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toHaveText(message);
  }
}
```

**Sources:**
- [arXiv: Automated Page Object Generation with LLMs](https://arxiv.org/html/2602.19294v1)
- [DZone: Create POM with Copilot and Playwright MCP](https://dzone.com/articles/create-pom-with-llm-github-copilot-playwright-mcp)

---

## 9. Copilot vs Claude vs ChatGPT — Comparison

| Dimension | GitHub Copilot | Claude | ChatGPT |
|---|---|---|---|
| **Best for** | In-editor flow, inline suggestions, live context | Well-architected solutions, clean implementations | Learning, debugging, exploring ideas |
| **Context access** | Open files, MCP, workspace index | Paste/upload, Claude Code with file access | Paste/upload, browsing plugin |
| **Playwright MCP** | Native integration | Via Claude Code `claude mcp add` | Not natively supported |
| **Test quality** | Good for boilerplate and pattern continuation | Best for production-ready architecture | Good drafts, more refinement needed |
| **Common issue** | Over-engineers framework structure | Slightly less suited for rapid back-and-forth | Uses deprecated methods |
| **Selector strategy** | Follows conventions of open files | Follows explicit instructions well | Defaults to CSS without guidance |

**Practical pattern:** Copilot for daily flow (~60% acceptance rate), Claude for architecture and complex design, ChatGPT for debugging and learning.

**Gotcha from T.J. Maher:** "GitHub Copilot Over-Engineered My Playwright Framework" — Copilot tends to create unnecessarily complex abstractions when simpler structure suffices.

**Sources:**
- [Checkly: Evaluating Copilot for Playwright](https://www.checklyhq.com/blog/playwright-codegen-with-github-copilot/)
- [T.J. Maher: Copilot Over-Engineered My Framework](https://www.tjmaher.com/2026/03/github-copilot-over-engineered-my.html)
- [DEV.to: Generate Tests Without Code Access Using MCP and Copilot](https://dev.to/debs_obrien/generate-playwright-tests-without-code-access-using-mcp-and-copilot-2m05)

---

## 10. Academic Research & Industry Evidence

### Key Papers

| Paper | Year | Key Finding |
|---|---|---|
| "LLMs for Unit Test Generation: Road Ahead" (arXiv:2511.21382) | 2025 | 84 studies reviewed; prompt engineering is dominant strategy (89%); iterative loops are standard |
| "Large-scale Study of LLMs for Test Generation" (arXiv:2407.00225) | 2024 | GPT-4, Mistral, Mixtral vs EvoSuite across 216K tests; LLMs struggle with complex methods |
| "Automated Page Object Generation with LLMs" (arXiv:2602.19294) | 2026 | 32-54% accuracy, >70% element recognition |
| "LLM Test Generation Under Software Evolution" (arXiv:2603.23443) | 2026 | LLM tests rely on surface-level cues, struggle with regression awareness |
| "Quality of LLM-generated Code" (arXiv:2511.10271) | 2025 | LLM code increases smell rates by 63%; largest in implementation smells |
| "E2E Tests with Screen Transition Graphs" (arXiv:2506.02529) | 2025 | Screen transition graphs + LLMs for navigation test generation |

### Critical Finding

Most LLM-generated tests that pass prove unsuitable for **mutation testing** — they target interfaces, abstract classes, or trivial methods without engaging actual logic. **LLM tests can pass without verifying meaningful behavior.** This is the "assertion trap" at scale.

### Growth

Papers on LLM-driven test generation: 1 (2021) → 1 (2022) → 5 (2023) → 55 (2024) — exponential.

---

## 11. Tools & Ecosystem

### Tier 1: Native Playwright + AI

| Tool | Status | Description |
|---|---|---|
| **Playwright MCP** | Production | Structured browser access via accessibility tree |
| **Playwright CLI** | 2026 | Lighter MCP alternative, ~4x fewer tokens |
| **Playwright Test Agents** | 2026 (v1.56+) | Planner/Generator/Healer agents |
| **Playwright Codegen** | Mature | Record-and-playback code generation |

### Tier 2: AI Testing Platforms

| Tool | Description |
|---|---|
| **Bug0** | Plain-English test generation via Gemini |
| **Octomind** | Autonomous test flow generation |
| **ZeroStep** | Natural language test execution within Playwright |
| **Quorvex AI** | Open-source: English to self-healing Playwright tests |
| **Vibium AI** | No-code intent-based testing (by Selenium creator) |

### Tier 3: Community Resources

| Resource | URL |
|---|---|
| awesome-copilot-for-testers | https://github.com/jaktestowac/awesome-copilot-for-testers |
| awesome-copilot (official) | https://github.com/github/awesome-copilot |

---

## 12. Concrete Prompt Library

### Login Test

```
Write a Playwright test for the login page at /login.

Page Object: Create LoginPage class with locators for email input (getByLabel),
password input (getByLabel), submit button (getByRole), and error message (getByRole('alert')).

Tests:
1. Successful login with user@test.com / Password123! → redirects to /dashboard
2. Wrong password → shows "Invalid credentials" error
3. Empty email field → shows field validation message
4. Account lockout after 5 failed attempts → shows lockout message

Use storageState pattern for auth fixture.
Each test must be independent.
```

### Form Validation Test

```
Write a Playwright test for the contact form at /contact.

Use getByLabel for form fields, getByRole for buttons.
Mock the POST /api/contact endpoint to return 200.

Tests:
1. Submit with all valid fields → success toast appears
2. Submit with empty required fields → validation messages for each
3. Submit with invalid email format → email-specific error
4. Submit with very long input (1000+ chars) → handles gracefully

Assert toast notifications with getByRole('status') or getByText.
```

### Table Interaction Test

```
Write a Playwright test for the orders table at /orders.

Tests:
1. Table loads with data → verify row count matches API response
2. Click column header → rows sort ascending, click again → descending
3. Type in search filter → table filters to matching rows
4. Pagination → click page 2, verify new rows load, URL updates

Mock GET /api/orders to return deterministic test data (10 orders).
Use getByRole('table'), getByRole('row'), getByRole('columnheader').
```

### Multi-Step Wizard Test

```
Write a Playwright test for the checkout flow:
/checkout/shipping → /checkout/payment → /checkout/review → /checkout/confirmation

Prerequisites: User logged in (use storageState), cart has items (setup via API).

Test the happy path:
1. Fill shipping form (all fields via getByLabel)
2. Click "Continue to Payment" → URL changes to /checkout/payment
3. Fill payment form
4. Click "Review Order" → URL changes to /checkout/review
5. Verify summary shows correct shipping + payment info
6. Click "Place Order" → URL changes to /checkout/confirmation
7. Verify confirmation number appears

Test error paths:
- Skip required shipping field → validation prevents navigation
- Invalid card number → payment-specific error
```

---

## 13. Mapping to Existing MAV Content

The existing Midnight Automation Voyage platform already covers AI-assisted testing in several modules:

| Existing Module | Coverage | Gap for New Copilot-Focused Course |
|---|---|---|
| Module 6: Copilot Prompt Engineering | CARD and PAGE formulas | Needs hands-on lab with MCP, agent mode, prompt files |
| Module 7: Record & Refine | Using Copilot to draft from recordings | Needs MCP-first workflow (not codegen-first) |
| Module 8: Writing Your First Tests | Basic test structure | Needs "Copilot writes it, you review it" framing |
| Module 9: Page Objects | POM pattern | Needs "prompt Copilot to generate POMs" exercises |
| Module 28: MCP/AI Agents | Advanced AI agents | Needs practical MCP setup + Playwright agent walkthrough |

**Key difference:** Existing content teaches Playwright with Copilot as a helper. The new course should teach **Copilot as the primary author** with the human as reviewer/director.

---

## 14. Proposed Course Outline

### Course: "Copilot-First Playwright Testing"

**Audience:** Manual testers transitioning to automation, using Copilot as their primary test-writing tool.

**Prerequisite:** Basic VS Code familiarity, Copilot subscription active.

| # | Module | Key Skills | Lab/Exercise |
|---|---|---|---|
| 1 | **Setup: Your AI Testing Toolkit** | Install Playwright extension, configure Copilot, create `.github/copilot-instructions.md` | Configure a project from scratch, verify Copilot reads instructions |
| 2 | **Your First AI-Generated Test** | Copilot Chat `/tests`, inline completions, comment-driven generation | Write comments, let Copilot generate login test, run it, review output |
| 3 | **The PAGE Prompt Framework** | Structured prompts for consistent output | Write PAGE prompts for 3 different pages, compare output quality |
| 4 | **Selectors: Teaching Copilot the Right Way** | `getByRole` hierarchy, fixing CSS selector suggestions, `copilot-instructions.md` enforcement | Generate tests, identify wrong selectors, fix via re-prompting |
| 5 | **The Review-Run-Fix Loop** | Reading errors, feeding them back, 3-iteration limit | Intentionally generate a failing test, iteratively fix it with Copilot |
| 6 | **Page Objects with Copilot** | Prompt for POM generation, `page-object.prompt.md` template | Generate POM from screenshot + prompt, then generate tests using it |
| 7 | **Copilot Agent Mode & MCP** | MCP setup, agent mode autonomous loop, accessibility snapshots | Set up Playwright MCP, have agent mode write + run + fix a test |
| 8 | **API Mocking & Network Control** | `page.route()` patterns, prompt Copilot for mock generation | Prompt Copilot to add mocking for an existing test, test error paths |
| 9 | **Avoiding the Traps** | Assertion trap, over-engineering, flaky patterns, deprecated APIs | Quiz: identify anti-patterns in AI-generated code, fix them |
| 10 | **Your Prompt Library** | Building reusable `.prompt.md` files, team standards, CI integration | Create 3 prompt files for your team's common test patterns |

### Per-Module Structure (follows existing MAV format)

Each module includes:
- **Sections:** Text + code blocks + callouts explaining concepts
- **Narration:** Step-by-step guided walkthrough
- **Quiz:** 2-3 questions testing understanding (not memorization)
- **Exercise:** Beginner/intermediate/advanced tiers
- **Prompt Templates:** Copy-paste prompts for the module's scenario
- **Practice Link:** Points to relevant practice-app page

---

## 15. Pitfalls & Warnings

### False-Positive Tests (Critical)

From Checkly's evaluation: generating a "working" test case with Copilot might be quick, but **what if you generated a false-positive test that always passes?** Your test suite becomes worthless because you miss regressions. Always review AI-generated assertions manually.

### Codegen vs Copilot — When to Use Which

From Checkly: "Playwright Codegen is often better and quicker than AI Codegen." Recording with `npx playwright codegen` takes seconds with high success rate and produces best-practice locators. **Use codegen for initial recording, Copilot for enhancement/refactoring.**

### Complex Applications

Copilot does "surprisingly well for simple applications" with vanilla JavaScript, but **struggles with complex frameworks** (Next.js, complex React). When tested on a Next.js marketing site, "it sometimes got confused about the code, forcing into an AI conversation of death."

### Multi-File Architectural Tasks

The Copilot coding agent "performs well on tasks touching one or two files, but tasks requiring changes across 10+ files with architectural implications produce noticeably more mistakes."

### The Two-Step MCP Pattern

When using Playwright MCP, always break into two phases to prevent hallucinated selectors:
1. **Explore:** "Navigate to /login and take an accessibility snapshot"
2. **Generate:** "Based on that snapshot, generate a Playwright test"

### Playwright Codegen vs MCP Snapshots

| Approach | Speed | Accuracy | Best For |
| -------- | ----- | -------- | -------- |
| `npx playwright codegen` | Fastest | Highest (real interactions) | Initial test recording |
| MCP accessibility snapshot | Fast | High (real DOM) | AI agent test generation |
| Copilot without context | Fastest | Low (hallucinated selectors) | Only with `copilot-instructions.md` + exemplar files |

### Industry Efficiency Metrics

- TTC Global reported Copilot + Playwright MCP **boosted test automation efficiency by up to 37%**
- Accelirate reports significant speed and cost savings with Playwright + Copilot workflows

**Sources:**
- [Checkly: ChatGPT vs Playwright Codegen](https://www.checklyhq.com/blog/chatgpt-vs-playwright-codegen/)
- [TTC Global: Copilot + Playwright MCP 37% efficiency boost](https://ttcglobal.com/what-we-think/blog/how-github-copilot-playwright-mcp-boosted-test-automation-efficiency-by-up-to-37)
- [Accelirate: Playwright + Copilot](https://www.accelirate.com/playwright-automation-testing/)

---

## Appendix: Complete Reference Links

### Official Documentation — Playwright

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Playwright Codegen](https://playwright.dev/docs/codegen-intro)
- [Playwright Fixtures](https://playwright.dev/docs/test-fixtures)
- [Playwright Auth](https://playwright.dev/docs/auth)
- [Playwright Mocking](https://playwright.dev/docs/mock)
- [Playwright Config](https://playwright.dev/docs/test-configuration)
- [Playwright POM](https://playwright.dev/docs/pom)
- [Playwright Test Agents](https://playwright.dev/docs/test-agents)
- [Playwright MCP Server](https://github.com/microsoft/playwright-mcp)
- [GitHub Copilot Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
- [VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [VS Code MCP Servers](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)

### Microsoft Learn
- [Test like a pro with Playwright and GitHub Copilot](https://learn.microsoft.com/en-us/shows/visual-studio-code/test-like-a-pro-with-playwright-and-github-copilot)
- [Build with Playwright Training Module](https://learn.microsoft.com/en-us/training/modules/build-with-playwright/)

### Industry Research & Blog Posts
- [Checkly: Generating E2E tests with AI and Playwright MCP](https://www.checklyhq.com/blog/generate-end-to-end-tests-with-ai-and-playwright/)
- [Checkly: Evaluating Copilot for Playwright Code Generation](https://www.checklyhq.com/blog/playwright-codegen-with-github-copilot/)
- [Azure DevOps: Manual Testing to AI-Generated Automation](https://devblogs.microsoft.com/devops/from-manual-testing-to-ai-generated-automation-our-azure-devops-mcp-playwright-success-story/)
- [Microsoft Developer: Complete Playwright E2E Story](https://developer.microsoft.com/blog/the-complete-playwright-end-to-end-story-tools-ai-and-real-world-workflows)
- [DEV.to: Playwright Agents in Action](https://dev.to/playwright/playwright-agents-planner-generator-and-healer-in-action-5ajh)
- [DEV.to: Generate Tests Without Code Access (Debbie O'Brien)](https://dev.to/debs_obrien/generate-playwright-tests-without-code-access-using-mcp-and-copilot-2m05)
- [T.J. Maher: Copilot Over-Engineered My Framework](https://www.tjmaher.com/2026/03/github-copilot-over-engineered-my.html)
- [TestDino: Playwright AI Ecosystem 2026](https://testdino.com/blog/playwright-ai-ecosystem/)
- [TestDino: AI Test Generation Tools](https://testdino.com/blog/ai-test-generation-tools/)

### Academic Papers
- [LLMs for Unit Test Generation: Road Ahead (arXiv:2511.21382)](https://arxiv.org/html/2511.21382v1)
- [Large-scale Study of LLMs for Test Generation (arXiv:2407.00225)](https://arxiv.org/html/2407.00225)
- [Automated Page Object Generation (arXiv:2602.19294)](https://arxiv.org/html/2602.19294v1)
- [LLM Test Generation Under Evolution (arXiv:2603.23443)](https://arxiv.org/html/2603.23443)
- [E2E Tests with Screen Transition Graphs (arXiv:2506.02529)](https://arxiv.org/html/2506.02529)
- [Quality of LLM-generated Code (arXiv:2511.10271)](https://arxiv.org/html/2511.10271)
- [Fixing Code Generation Errors (arXiv:2409.00676)](https://arxiv.org/html/2409.00676v1/)

### Official Documentation — GitHub Copilot

- [GitHub Docs: Create E2E Tests with Copilot](https://docs.github.com/en/copilot/tutorials/copilot-chat-cookbook/testing-code/create-end-to-end-tests)
- [GitHub Blog: Debug with Playwright MCP and Copilot](https://github.blog/ai-and-ml/github-copilot/how-to-debug-a-web-app-with-playwright-mcp-and-github-copilot/)
- [GitHub Blog: Debugging UI with Agent Mode + MCP](https://github.blog/ai-and-ml/github-copilot/debugging-ui-with-ai-github-copilot-agent-mode-meets-mcp-servers/)
- [GitHub Blog: 5 Tips for Custom Instructions](https://github.blog/ai-and-ml/github-copilot/5-tips-for-writing-better-custom-instructions-for-copilot/)
- [GitHub Docs: MCP and Coding Agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/mcp-and-coding-agent)
- [GitHub Docs: Coding Agent Best Practices](https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/best-practices-for-using-copilot-to-work-on-tasks)
- [VS Code Blog: Introducing Copilot Agent Mode](https://code.visualstudio.com/blogs/2025/02/24/introducing-copilot-agent-mode)
- [VS Code: Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [VS Code: Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [VS Code: Copilot Settings Reference](https://code.visualstudio.com/docs/copilot/copilot-settings)
- [GitHub Blog: Custom Instructions Changelog](https://github.blog/changelog/2024-10-29-custom-instructions-for-github-copilot-in-vs-code-public-preview/)
- [GitHub Blog: Prompt Files Changelog](https://github.blog/changelog/2025-02-07-prompt-files-in-copilot/)
- [awesome-copilot (official)](https://github.com/github/awesome-copilot) — includes `playwright-typescript.instructions.md` and `webapp-testing` skill
- [awesome-copilot Playwright Instructions](https://github.com/github/awesome-copilot/blob/main/instructions/playwright-typescript.instructions.md)

### Community Resources

- [awesome-copilot-for-testers](https://github.com/jaktestowac/awesome-copilot-for-testers)
- [NearForm: Supercharging Playwright with MCP](https://nearform.com/digital-community/supercharging-playwright-testing/)
- [Mark Heath: Using Playwright MCP in Copilot](https://markheath.net/post/2025/4/10/mcp-playwright)
- [Shipyard: Playwright Agents with Claude Code](https://shipyard.build/blog/playwright-agents-claude-code/)
- [C# Corner: Integrating Copilot with Playwright](https://www.c-sharpcorner.com/article/integrating-github-copilot-with-playwright/)
- [Testleaf: 10x Automation with Playwright and Copilot](https://www.testleaf.com/blog/10x-your-automation-speed-how-i-used-playwright-and-copilot-in-vs-code/)
- [Gary Parker: AI Prompts for Playwright Testers](https://medium.com/@qa.gary.parker/ai-prompts-for-playwright-testers-getting-the-most-out-of-your-ai-assistants-2fc4a48e6f9e)
- [Tim Deschryver: Vibe Testing with Playwright](https://timdeschryver.dev/blog/vibe-testing-with-playwright)
- [Testcollab: Playwright CLI (Token-Efficient Alternative to MCP)](https://testcollab.com/blog/playwright-cli)
