import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 20,
  title: "Test Data Strategies",
  subtitle: "Factories, seeding, isolation, and parallel-safe data patterns",
  icon: "🏭",
  sections: [
    {
      heading: "The Problem with Hardcoded Data",
      content:
        "Hardcoded test credentials like `user@test.com / Password123!` work fine for a single developer running tests sequentially. But the moment you scale — parallel execution, multiple developers, CI pipelines — shared data becomes a landmine. Two tests using the same account can trigger account lockout. Shared order data leads to flaky assertions when counts change. Hardcoded IDs break when the database is seeded differently.",
      table: {
        headers: ["Problem", "Symptom", "Root Cause"],
        rows: [
          ["Parallel collision", "Account locked after 5 attempts", "Two workers log in as same user simultaneously"],
          ["State leak", "Test B fails because Test A deleted the data", "Shared mutable state between tests"],
          ["Brittle assertion", "Expected 15 orders, got 16", "Another test created an order in the same dataset"],
          ["Environment drift", "Tests pass locally, fail in CI", "Local DB has different seed data than CI"],
        ],
      },
      warning: "If your test suite has a shared `user@test.com`, you have a ticking time bomb. It will cause parallel test failures the moment you scale.",
    },
    {
      heading: "Data Factories",
      content:
        "A data factory generates unique test data on demand. Each test gets its own users, orders, and entities with unique identifiers. This eliminates collisions and makes tests self-contained.",
      code: `// factories.ts
import { randomUUID } from 'crypto';

export function createTestUser(overrides = {}) {
  const id = randomUUID().slice(0, 8);
  return {
    name: \`Test User \${id}\`,
    email: \`test-\${id}@example.com\`,
    password: \`Pass\${id}!\`,
    role: 'editor' as const,
    ...overrides,
  };
}

export function createTestOrder(overrides = {}) {
  return {
    id: \`ORD-\${randomUUID().slice(0, 6)}\`,
    customer: \`Customer \${randomUUID().slice(0, 4)}\`,
    amount: Math.floor(Math.random() * 500) + 10,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending' as const,
    ...overrides,
  };
}`,
      codeLanguage: "typescript",
      tip: "Factories should produce valid data by default but accept overrides for specific test scenarios. This balances convenience with flexibility.",
    },
    {
      heading: "API-Based Seeding",
      content:
        "Creating test data through the UI is slow and fragile. Use API calls or direct database operations in fixtures to set up data before tests run. This is faster, more reliable, and independent of UI changes.",
      code: `import { test as base } from '@playwright/test';
import { createTestUser } from './factories';

// Fixture that seeds a user via API before each test
export const test = base.extend({
  testUser: async ({ request }, use) => {
    const user = createTestUser();

    // Create user via API (faster than UI)
    await request.post('/api/users', { data: user });

    // Provide the user to the test
    await use(user);

    // Cleanup after test
    await request.delete(\`/api/users/\${user.email}\`);
  },
});

// Usage:
test('new user can access dashboard', async ({ page, testUser }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', testUser.email);
  await page.fill('[data-testid="password-input"]', testUser.password);
  await page.click('[data-testid="login-button"]');
  await expect(page).toHaveURL('/dashboard');
});`,
      codeLanguage: "typescript",
    },
    {
      heading: "Seed/Reset Controls",
      content:
        "For applications without APIs, build seed/reset controls into the test target app. A reset button that restores the database to a known state ensures every test run starts from the same baseline. The key is idempotency — running reset twice should produce the same result.",
      code: `// In your test setup:
test.beforeEach(async ({ page }) => {
  // Reset to known state before each test
  await page.goto('/admin');
  await page.getByTestId('admin-seed-reset').click();

  // Wait for confirmation toast
  await expect(page.getByTestId('toast-message-0'))
    .toHaveText('Data reset to default seed.');
});`,
      codeLanguage: "typescript",
    },
    {
      heading: "Role-Based Data",
      content:
        "Different user roles see different data. Admin sees all users, viewer sees a subset, editor can modify. Your test data strategy must account for these visibility boundaries to avoid assertion failures caused by permission differences.",
      table: {
        headers: ["Role", "Can See", "Can Modify", "Test Strategy"],
        rows: [
          ["Admin", "All users, all actions", "Everything", "Full CRUD tests, bulk operations"],
          ["Editor", "All users, limited actions", "Own profile, assigned items", "Edit/create tests, verify permission boundaries"],
          ["Viewer", "All users, no actions", "Nothing", "Read-only tests, verify buttons are disabled"],
        ],
      },
    },
    {
      heading: "Parallel-Safe Patterns",
      content:
        "When Playwright runs tests in parallel (default behavior), each worker process needs its own isolated data. Use unique identifiers, namespaced data, and per-worker fixtures to prevent collisions.",
      code: `import { test as base } from '@playwright/test';

// Per-worker unique namespace prevents parallel collisions
export const test = base.extend({
  workerNamespace: [async ({}, use, workerInfo) => {
    const ns = \`worker-\${workerInfo.workerIndex}\`;
    await use(ns);
  }, { scope: 'worker' }],
});

// Tests use the namespace to isolate data
test('create order with unique data', async ({ page, workerNamespace }) => {
  const orderId = \`\${workerNamespace}-\${Date.now()}\`;
  // This order ID is guaranteed unique across all parallel workers
});`,
      codeLanguage: "typescript",
      tip: "Playwright's workerInfo.workerIndex provides a stable per-worker identifier. Use it as a namespace prefix for all test data.",
    },
    {
      heading: "Cleanup Strategies",
      content:
        "Every test that creates data should clean up after itself — or rely on a global teardown that resets to baseline. Choose the strategy that fits your app's capabilities.",
      table: {
        headers: ["Strategy", "How It Works", "Best For"],
        rows: [
          ["Per-test teardown", "afterEach() deletes data created by the test", "Apps with delete APIs, fast cleanup"],
          ["Global reset", "globalTeardown resets DB to seed state", "Apps with seed/reset capabilities"],
          ["Ephemeral environment", "Each CI run gets a fresh database", "Containerized apps, Docker Compose"],
          ["Time-based expiry", "Test data auto-expires after N hours", "Long-running environments, shared staging"],
        ],
      },
    },
  ],
  quiz: {
    question: "Why is user@test.com a problematic test credential?",
    options: [
      "The password is too short for modern security requirements",
      "The email domain test.com might not exist",
      "Parallel tests sharing the same user create state collisions — account lockout, session conflicts",
      "The email format is invalid according to RFC 5322",
    ],
    correctIndex: 2,
    explanation:
      "When multiple parallel test workers all log in as user@test.com simultaneously, they compete for the same session. One worker's login can invalidate another's session. Five failed attempts from different workers trigger account lockout. The fix is to give each test its own unique user via a data factory.",
  },
  exercise: {
    title: "Refactor Hardcoded Login to Data Factory",
    description:
      "The starter code uses hardcoded credentials that will fail in parallel execution. Refactor it to use a data factory that generates unique test users.",
    starterCode: `import { test, expect } from '@playwright/test';

test('user can view orders', async ({ page }) => {
  // Hardcoded credentials — will collide in parallel
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', 'user@test.com');
  await page.fill('[data-testid="password-input"]', 'Password123!');
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');

  await page.goto('/orders');
  await expect(page.getByTestId('orders-table')).toBeVisible();
});`,
    solutionCode: `import { test as base, expect } from '@playwright/test';

// Data factory — generates unique credentials per test
function createTestUser() {
  const id = Math.random().toString(36).slice(2, 8);
  return {
    email: \`test-\${id}@example.com\`,
    password: \`Pass\${id}!1\`,
    name: \`User \${id}\`,
  };
}

// Fixture that provides a unique test user
const test = base.extend({
  testUser: async ({}, use) => {
    const user = createTestUser();
    // In a real app, you'd create this user via API here
    await use(user);
  },
});

test('user can view orders', async ({ page, testUser }) => {
  // Each test run gets unique credentials — no parallel collisions
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', testUser.email);
  await page.fill('[data-testid="password-input"]', testUser.password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');

  await page.goto('/orders');
  await expect(page.getByTestId('orders-table')).toBeVisible();
});`,
    hints: [
      "Create a factory function that returns an object with unique email, password, and name",
      "Use Math.random() or crypto.randomUUID() to generate unique identifiers",
      "Extend the base test with a fixture that calls the factory and provides the user to each test",
    ],
  },
  promptTemplates: [
    {
      label: "Generate Test Data Factory",
      prompt:
        "Generate a TypeScript test data factory for {entity} (e.g., user, order, product) with unique identifiers per instance. Include: factory function with sensible defaults, override support, and a Playwright fixture that provides the factory data to tests.",
      context: "CARD format: Context — parallel Playwright test suite. Action — create data factory. Role — test automation engineer. Deliverable — factory function + fixture.",
    },
    {
      label: "Convert Hardcoded to Factory",
      prompt:
        "Convert these Playwright tests from hardcoded test credentials to use fixture-based data seeding with unique identifiers. Ensure the refactored tests are safe for parallel execution. Tests:\n{paste test code here}",
      context: "CARD format: Context — existing tests with shared credentials. Action — refactor to factories. Role — QE engineer. Deliverable — updated spec + fixtures file.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/admin",
    label: "Admin Panel",
    description: "Use the Seed/Reset controls to practice data isolation patterns — reset to baseline, create users, and verify state independence.",
  },
};
