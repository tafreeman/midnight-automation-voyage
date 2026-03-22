import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 26,
  title: "Test Tagging & Pipeline Gating",
  subtitle: "Smoke, regression, and selective execution strategies for CI pipelines",
  icon: "🏷️",
  sections: [
    {
      heading: "Why Tagging Matters",
      content:
        "Not all tests need to run on every code change. A 500-test regression suite running on every PR wastes 20+ minutes of developer time and CI resources. Tagging lets you define tiers — fast smoke tests for PRs, comprehensive regression on merge, full nightly runs with visual and a11y checks. This tiered approach gives fast feedback when speed matters and deep coverage when thoroughness matters.",
      table: {
        headers: ["Tier", "Tests", "Run Time", "When to Run"],
        rows: [
          ["Smoke", "20-30 critical path tests", "~2 min", "Every PR, every push"],
          ["Regression", "100-200 feature tests", "~10 min", "Merge to main, nightly"],
          ["Full", "All tests + visual + a11y", "~30 min", "Nightly, release candidate"],
        ],
      },
    },
    {
      heading: "Playwright's Tag Annotation Syntax",
      content:
        "Playwright supports tagging tests using `@tag` annotations in test titles or with `test.describe`. Tags are just text markers that the `--grep` flag can filter on.",
      code: `import { test, expect } from '@playwright/test';

// Tag in test title
test('@smoke login with valid credentials succeeds', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('admin@test.com');
  await page.getByTestId('password-input').fill('AdminPass1!');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL('/dashboard');
});

// Tag in describe block
test.describe('@regression @a11y Settings Page', () => {
  test('profile form saves successfully', async ({ page }) => {
    await page.goto('/settings');
    await page.getByTestId('settings-name-input').fill('Tagged User');
    await page.getByTestId('settings-save-button').click();
    await expect(page.getByTestId('toast-message-0')).toBeVisible();
  });
});

// Multiple tags on a single test
test('@smoke @critical admin panel loads for admin user', async ({ page }) => {
  // ...
});`,
      codeLanguage: "typescript",
    },
    {
      heading: "Tag Taxonomy",
      content:
        "Establish a standard set of tags across your team. Consistent tags make pipeline configuration predictable and make it easy for anyone to understand what a test covers.",
      table: {
        headers: ["Tag", "Meaning", "Run Frequency", "Typical Count"],
        rows: [
          ["@smoke", "Critical user path — login, core feature, checkout", "Every PR", "20-30 tests"],
          ["@regression", "Comprehensive feature coverage", "Merge to main", "100-200 tests"],
          ["@visual", "Screenshot comparison tests", "Nightly", "20-50 tests"],
          ["@a11y", "Accessibility scans with axe-core", "Nightly or merge to main", "10-20 tests"],
          ["@slow", "Tests taking > 10 seconds", "Nightly only", "Varies"],
          ["@critical", "Tests that block deployment if they fail", "Every PR", "10-15 tests"],
        ],
      },
      tip: "Start with just @smoke and @regression. Add more tags as your suite grows. Over-tagging creates maintenance burden without proportional value.",
    },
    {
      heading: "Running by Tag",
      content:
        "Use Playwright's `--grep` and `--grep-invert` flags to select tests by tag. These use regex matching against the full test title (including describe blocks).",
      code: `# Run only smoke tests
npx playwright test --grep @smoke

# Run regression tests (includes smoke since they're a subset)
npx playwright test --grep "@smoke|@regression"

# Run everything EXCEPT slow tests
npx playwright test --grep-invert @slow

# Run a11y tests on a specific project
npx playwright test --grep @a11y --project=chromium

# Combine with sharding
npx playwright test --grep @regression --shard=1/4`,
      codeLanguage: "bash",
    },
    {
      heading: "Pipeline Integration",
      content:
        "Map your tag tiers to CI pipeline stages. Each stage has its own quality gate — what must pass before code progresses.",
      code: `# GitHub Actions example — tiered test execution
name: Test Pipeline
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  schedule:
    - cron: '0 3 * * *'  # Nightly at 3 AM

jobs:
  smoke:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test --grep @smoke --project=chromium

  regression:
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: npx playwright test --grep "@smoke|@regression"

  nightly:
    if: github.event_name == 'schedule'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: npx playwright test  # Run ALL tests`,
      codeLanguage: "yaml",
    },
    {
      heading: "Quality Gates",
      content:
        "Tags become actionable when tied to quality gates — rules that block or alert based on test results.",
      table: {
        headers: ["Gate", "Trigger", "Tests", "Action on Failure"],
        rows: [
          ["PR merge blocker", "Pull request created/updated", "@smoke + @critical", "Block merge, require green status check"],
          ["Main branch alert", "Push to main", "@regression", "Alert team on Slack, don't block deploy"],
          ["Deploy blocker", "Release candidate branch", "All tests", "Block deployment, require manual override"],
          ["Nightly dashboard", "Scheduled cron trigger", "All + @visual + @a11y", "Update trend dashboard, create issues for new failures"],
        ],
      },
    },
    {
      heading: "Tag Governance",
      content:
        "Tags are only useful if they're consistent. Establish governance rules so they are applied correctly.",
      table: {
        headers: ["Rule", "Why"],
        rows: [
          ["Every test must have at least one tier tag", "Untagged tests can't be selectively run"],
          ["@smoke tests must pass in under 3 minutes total", "Smoke should be fast — if it's slow, it's not smoke"],
          ["Tag assignment is reviewed in PR", "Prevents tag inflation (everything marked @smoke)"],
          ["@critical tags require team lead approval", "Critical status has pipeline-blocking power"],
          ["Review tags quarterly", "Tests change scope; tags should follow"],
        ],
      },
    },
  ],
  quiz: {
    question:
      "When should you run @regression tests vs @smoke tests in a CI pipeline?",
    options: [
      "Smoke on nightly, regression on every PR",
      "Smoke on every PR for fast feedback; regression on merge to main for comprehensive coverage",
      "Both on every PR for maximum coverage",
      "Regression on every push, smoke only on release branches",
    ],
    correctIndex: 1,
    explanation:
      "Smoke tests are the fast critical-path subset that runs on every PR — they give developers feedback in 2-3 minutes. Regression tests are comprehensive and take 10+ minutes — running them on every PR wastes CI resources and blocks developers. Run regression on merge to main or nightly to catch issues without slowing down development.",
  },
  exercise: {
    title: "Tag Tests and Write Grep Commands",
    description:
      "Add appropriate tags to a set of existing tests and write the grep commands for smoke, regression, and nightly execution.",
    starterCode: `import { test, expect } from '@playwright/test';

// TODO: Add appropriate tags to each test

test('login with valid credentials redirects to dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('admin@test.com');
  await page.getByTestId('password-input').fill('AdminPass1!');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL('/dashboard');
});

test('invalid email shows validation error', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('not-an-email');
  await page.getByTestId('password-input').fill('ValidPass1!');
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('email-error')).toBeVisible();
});

test('products page displays items', async ({ page }) => {
  await page.goto('/products');
  await expect(page.locator('.product-card').first()).toBeVisible();
});

test('settings page accessibility scan', async ({ page }) => {
  await page.goto('/settings');
  // axe-core scan here
});

// TODO: Write CLI commands:
// Smoke run:
// Regression run:
// Nightly run (exclude @slow):`,
    solutionCode: `import { test, expect } from '@playwright/test';

test('@smoke @critical login with valid credentials redirects to dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('admin@test.com');
  await page.getByTestId('password-input').fill('AdminPass1!');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL('/dashboard');
});

test('@regression invalid email shows validation error', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('not-an-email');
  await page.getByTestId('password-input').fill('ValidPass1!');
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('email-error')).toBeVisible();
});

test('@smoke products page displays items', async ({ page }) => {
  await page.goto('/products');
  await expect(page.locator('.product-card').first()).toBeVisible();
});

test('@a11y @regression settings page accessibility scan', async ({ page }) => {
  await page.goto('/settings');
  // axe-core scan here
});

// CLI commands:
// Smoke run:              npx playwright test --grep @smoke
// Regression run:         npx playwright test --grep "@smoke|@regression"
// Nightly (all except):   npx playwright test --grep-invert @slow`,
    hints: [
      "Login success is @smoke (critical path) and @critical (blocks deploy)",
      "Validation errors are @regression — important but not critical path",
      "a11y scans are @a11y and @regression — run on merge and nightly",
      "Use --grep with regex OR syntax for multiple tags: --grep '@smoke|@regression'",
    ],
  },
  promptTemplates: [
    {
      label: "Tag Existing Tests",
      prompt:
        "Review these Playwright tests and assign appropriate tags (@smoke, @regression, @a11y, @visual, @critical, @slow) based on their scope, criticality, and execution time. Explain your reasoning for each tag assignment.\n\nTests:\n{paste test code}",
      context: "CARD format: Context — untagged test suite. Action — assign tags. Role — QE lead. Deliverable — tagged tests with justification.",
    },
    {
      label: "Generate CI Pipeline Strategy",
      prompt:
        "Generate a CI pipeline strategy that runs @smoke on every PR, @regression on merge to main, and full suite nightly. Include: GitHub Actions workflow YAML, grep commands, quality gate rules, and estimated run times.",
      context: "CARD format: Context — enterprise CI pipeline. Action — design tiered execution. Role — DevOps engineer. Deliverable — workflow YAML + strategy doc.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/",
    label: "Practice App",
    description:
      "Tag your reference tests with @smoke/@regression/@a11y and run selective suites with --grep to see tiered execution in action.",
  },
};
