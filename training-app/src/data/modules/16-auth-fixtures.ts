import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 16,
  title: "Auth Fixtures & Storage State",
  subtitle: "Reusable authentication for fast, role-based test execution",
  icon: "🔐",
  audience: "All Roles",
  sections: [
    {
      heading: "Why UI Login Doesn't Scale",
      content:
        "Every test that begins with filling in a login form wastes time and creates fragile dependencies. Consider the math: if you have 200 tests and each login takes 3 seconds, you burn 10 minutes per run just on authentication. Multiply that across 3 browser projects (Chromium, Firefox, WebKit) and you lose 30 minutes — before a single assertion runs. Playwright's `storageState` solves this by logging in once and reusing the authenticated session across all tests.",
      tip: "Authentication is a prerequisite, not a test objective. Only test the login flow itself in dedicated login tests.",
    },
    {
      heading: "What Is storageState?",
      content:
        "Playwright can serialize a browser's cookies and localStorage into a JSON file — this is `storageState`. When a test launches, it can load this file to start already authenticated, skipping the login UI entirely. The JSON file contains all session cookies, tokens, and localStorage entries that make the app think the user is logged in.",
      code: `// Save storage state after login
const context = await browser.newContext();
const page = await context.newPage();
await page.goto('/login');
await page.fill('[data-testid="email-input"]', 'admin@test.com');
await page.fill('[data-testid="password-input"]', 'AdminPass1!');
await page.click('[data-testid="login-button"]');
await page.waitForURL('/dashboard');

// Save the authenticated state
await context.storageState({ path: './auth/admin.json' });`,
      codeLanguage: "typescript",
    },
    {
      heading: "Global Setup with globalSetup",
      content:
        "Playwright's `globalSetup` option runs a script once before all tests. This is the ideal place to authenticate and save `storageState` files. The setup runs before any test file, so every test starts with a valid session.",
      code: `// global-setup.ts
import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();

  // Authenticate as admin
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await adminPage.goto('http://localhost:5173/login');
  await adminPage.fill('[data-testid="email-input"]', 'admin@test.com');
  await adminPage.fill('[data-testid="password-input"]', 'AdminPass1!');
  await adminPage.click('[data-testid="login-button"]');
  await adminPage.waitForURL('/dashboard');
  await adminContext.storageState({ path: './auth/admin.json' });
  await adminContext.close();

  await browser.close();
}

export default globalSetup;`,
      codeLanguage: "typescript",
      tip: "Store auth JSON files in a gitignored directory (e.g., `./auth/`). They contain session tokens and should never be committed.",
    },
    {
      heading: "Per-Role Fixtures with test.extend()",
      content:
        "For multi-role testing, create custom fixtures that provide pre-authenticated pages for each role. This way tests can declare which role they need, and Playwright handles the auth setup automatically.",
      code: `// fixtures.ts
import { test as base } from '@playwright/test';

type Fixtures = {
  adminPage: import('@playwright/test').Page;
  viewerPage: import('@playwright/test').Page;
};

export const test = base.extend<Fixtures>({
  adminPage: async ({ browser }, use) => {
    const ctx = await browser.newContext({
      storageState: './auth/admin.json',
    });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },
  viewerPage: async ({ browser }, use) => {
    const ctx = await browser.newContext({
      storageState: './auth/viewer.json',
    });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },
});

// Usage in tests:
// test('admin can invite users', async ({ adminPage }) => { ... });
// test('viewer sees disabled buttons', async ({ viewerPage }) => { ... });`,
      codeLanguage: "typescript",
    },
    {
      heading: "Project Dependencies for Auth Ordering",
      content:
        "When using `globalSetup`, all auth files must be created before any test runs. Playwright's `project.dependencies` config ensures projects run in the correct order. Define a `setup` project that runs first, then make your test projects depend on it.",
      code: `// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './global-setup.ts',
  projects: [
    { name: 'setup', testMatch: /global-setup\\.ts/ },
    {
      name: 'chromium',
      use: { storageState: './auth/admin.json' },
      dependencies: ['setup'],
    },
  ],
});`,
      codeLanguage: "typescript",
    },
    {
      heading: "Common Pitfalls",
      content:
        "Auth fixtures introduce their own class of bugs. Watch for these common issues:",
      table: {
        headers: ["Pitfall", "Symptom", "Fix"],
        rows: [
          ["Token expiry", "Tests pass locally, fail in CI (long runs)", "Re-authenticate in globalSetup; set short-lived tokens in test env"],
          ["Cookie scope", "Auth works on /dashboard but not /admin", "Ensure cookies are set for the correct domain/path"],
          ["Role confusion", "Admin test runs as viewer", "Verify the correct storageState file is loaded per project"],
          ["Stale session", "Tests fail after app deploy", "Always regenerate storageState in globalSetup, never cache between runs"],
          ["Login flow test", "Auth fixture bypasses the flow you want to test", "Use a separate project WITHOUT storageState for login tests"],
        ],
      },
      warning: "Never reuse storageState from a previous CI run. Always regenerate in globalSetup to ensure tokens are fresh.",
    },
  ],
  quiz: {
    question: "When should you NOT reuse storageState?",
    options: [
      "When testing API endpoints that require authentication",
      "When testing the login flow itself",
      "When running tests in parallel across multiple browsers",
      "When the application uses session cookies",
    ],
    correctIndex: 1,
    explanation:
      "The login flow is the one place where you WANT to exercise the UI login. If you skip it with storageState, you're not testing it at all. Dedicate a separate test project (without storageState) specifically for login flow tests.",
  },
  exercise: {
    title: "Convert Inline Login to Auth Fixture",
    description:
      "The starter code logs in via the UI before every test. Refactor it to use a storageState fixture so tests start already authenticated.",
    starterCode: `import { test, expect } from '@playwright/test';

test('admin can see user table', async ({ page }) => {
  // Inline login — runs every test, slow and fragile
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', 'admin@test.com');
  await page.fill('[data-testid="password-input"]', 'AdminPass1!');
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');

  // Actual test
  await page.goto('/admin');
  await expect(page.getByTestId('admin-user-table')).toBeVisible();
});`,
    solutionCode: `// fixtures.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ browser }, use) => {
    const ctx = await browser.newContext({
      storageState: './auth/admin.json',
    });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },
});

// admin.spec.ts
import { test } from './fixtures';
import { expect } from '@playwright/test';

test('admin can see user table', async ({ page }) => {
  await page.goto('/admin');
  await expect(page.getByTestId('admin-user-table')).toBeVisible();
});`,
    hints: [
      "Create a fixtures.ts file that extends the base test with a pre-authenticated context",
      "Use browser.newContext({ storageState: './auth/admin.json' }) to load the saved session",
      "Import your custom `test` instead of from @playwright/test in spec files",
    ],
  },
  promptTemplates: [
    {
      label: "Generate Global Setup",
      prompt:
        "Generate a Playwright globalSetup script that authenticates as {role} against the login page at {url} and saves storageState to ./auth/{role}.json. Use data-testid selectors for the email input, password input, and login button.",
      context: "CARD format: Context — training practice app with role-based auth. Action — generate globalSetup. Role — QE engineer. Deliverable — complete TypeScript file.",
    },
    {
      label: "Convert Tests to Shared Auth Fixture",
      prompt:
        "Convert these Playwright tests to use a shared auth fixture with storageState instead of logging in via the UI. Create a fixtures.ts file with role-based page fixtures (adminPage, editorPage, viewerPage) and update the test imports.",
      context: "CARD format: Context — existing tests with inline login. Action — refactor to fixtures. Role — automation engineer. Deliverable — fixtures.ts + updated spec file.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/admin",
    label: "Admin Panel",
    description: "Test role-based access with the Admin Panel — try logging in as admin, editor, and viewer to see different permission levels.",
  },
};
