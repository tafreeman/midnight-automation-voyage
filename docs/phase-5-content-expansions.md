# Phase 5 Content Expansion Drafts

## Expansion 1: Module 23 — Emulation (Geolocation, Timezone, Locale, Permissions)

**File:** `src/data/modules/23-mobile-responsive.ts`
**Current sections:** 8 (Why Mobile Testing Matters through Mobile Accessibility)
**Proposed additions:** 4 new sections appended after existing content

### New Section 9: Geolocation Emulation

```typescript
{
  heading: "Geolocation Emulation",
  content:
    "Applications that use location-based features — store finders, delivery zones, local search, ride-sharing — need testing across different geographic positions. Playwright can override the browser's geolocation API at the context level, so every page in that context reports the faked position.\n\nThis is more reliable than mocking the API call because it affects every call to `navigator.geolocation` — including those inside third-party libraries and embedded maps.",
  code: `import { test, expect } from '@playwright/test';

// Set geolocation for the entire browser context
test('store finder shows nearest location in Chicago', async ({ browser }) => {
  const context = await browser.newContext({
    geolocation: { latitude: 41.8781, longitude: -87.6298 }, // Chicago
    permissions: ['geolocation'], // Grant permission automatically
  });
  const page = await context.newPage();

  await page.goto('/store-finder');
  await page.getByTestId('find-nearest-button').click();

  await expect(page.getByTestId('nearest-store')).toContainText('Chicago');
  await context.close();
});

// Change geolocation mid-test to simulate movement
test('delivery zone updates when location changes', async ({ browser }) => {
  const context = await browser.newContext({
    geolocation: { latitude: 40.7128, longitude: -74.0060 }, // NYC
    permissions: ['geolocation'],
  });
  const page = await context.newPage();
  await page.goto('/delivery');

  await expect(page.getByTestId('delivery-zone')).toContainText('Manhattan');

  // Move to Brooklyn
  await context.setGeolocation({ latitude: 40.6782, longitude: -73.9442 });
  await page.getByTestId('refresh-location').click();

  await expect(page.getByTestId('delivery-zone')).toContainText('Brooklyn');
  await context.close();
});`,
  codeLanguage: "typescript",
  tip: "Always pair geolocation with `permissions: ['geolocation']` — otherwise the browser may show a permission prompt that blocks test execution.",
}
```

### New Section 10: Timezone Emulation

```typescript
{
  heading: "Timezone Emulation",
  content:
    "Applications that display dates, times, or scheduling features must work correctly across timezones. A meeting scheduled at '3:00 PM EST' should display as '12:00 PM PST' for a West Coast user. Playwright can set the timezone at the context level via `timezoneId`, using standard IANA timezone identifiers.\n\nThis is especially valuable for catching bugs where the app uses `new Date()` without timezone awareness, or where date formatting libraries handle timezone conversion incorrectly.",
  code: `import { test, expect } from '@playwright/test';

// Test date display in different timezones
test('meeting time shows correctly in PST', async ({ browser }) => {
  const context = await browser.newContext({
    timezoneId: 'America/Los_Angeles',
  });
  const page = await context.newPage();

  await page.goto('/calendar/meeting/123');

  // The meeting was created at 3:00 PM EST = 12:00 PM PST
  await expect(page.getByTestId('meeting-time')).toContainText('12:00 PM');
  await context.close();
});

test('meeting time shows correctly in EST', async ({ browser }) => {
  const context = await browser.newContext({
    timezoneId: 'America/New_York',
  });
  const page = await context.newPage();

  await page.goto('/calendar/meeting/123');
  await expect(page.getByTestId('meeting-time')).toContainText('3:00 PM');
  await context.close();
});

// Parameterized timezone testing
const timezoneTestCases = [
  { tz: 'America/New_York', expected: '3:00 PM' },
  { tz: 'America/Chicago', expected: '2:00 PM' },
  { tz: 'America/Denver', expected: '1:00 PM' },
  { tz: 'America/Los_Angeles', expected: '12:00 PM' },
  { tz: 'Europe/London', expected: '8:00 PM' },
  { tz: 'Asia/Tokyo', expected: '5:00 AM' },
];

for (const { tz, expected } of timezoneTestCases) {
  test(\`meeting time in \${tz} shows \${expected}\`, async ({ browser }) => {
    const context = await browser.newContext({ timezoneId: tz });
    const page = await context.newPage();
    await page.goto('/calendar/meeting/123');
    await expect(page.getByTestId('meeting-time')).toContainText(expected);
    await context.close();
  });
}`,
  codeLanguage: "typescript",
  warning: "Use IANA timezone IDs (e.g., 'America/New_York'), not abbreviations like 'EST' or 'PST'. Abbreviations are ambiguous and not supported by the API.",
}
```

### New Section 11: Locale Emulation

```typescript
{
  heading: "Locale Emulation",
  content:
    "Locale affects number formatting (1,000.50 vs 1.000,50), date formatting (MM/DD vs DD/MM), currency symbols, and sort order. Playwright's `locale` option at the context level changes `navigator.language` and affects all locale-sensitive APIs including `Intl.NumberFormat`, `Intl.DateTimeFormat`, and `toLocaleString()`.\n\nThis is critical for internationalized applications where the same data must render differently based on the user's locale.",
  code: `import { test, expect } from '@playwright/test';

// Test number formatting in German locale
test('prices use German number format', async ({ browser }) => {
  const context = await browser.newContext({
    locale: 'de-DE',
  });
  const page = await context.newPage();

  await page.goto('/products');

  // German format: 1.234,56 (period for thousands, comma for decimal)
  await expect(page.getByTestId('product-price').first())
    .toMatch(/\\d{1,3}\\.\\d{3},\\d{2}/);
  await context.close();
});

// Test date formatting across locales
test('date displays in US format', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();
  await page.goto('/orders');

  // US format: 01/15/2026
  await expect(page.getByTestId('order-date').first())
    .toMatch(/\\d{2}\\/\\d{2}\\/\\d{4}/);
  await context.close();
});

test('date displays in UK format', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-GB' });
  const page = await context.newPage();
  await page.goto('/orders');

  // UK format: 15/01/2026
  await expect(page.getByTestId('order-date').first())
    .toMatch(/\\d{2}\\/\\d{2}\\/\\d{4}/);
  await context.close();
});

// Combine locale with timezone for full i18n testing
test('Japanese user sees correct date and currency', async ({ browser }) => {
  const context = await browser.newContext({
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
  });
  const page = await context.newPage();
  await page.goto('/dashboard');

  // Japanese yen has no decimal places
  await expect(page.getByTestId('total-revenue')).toContainText('¥');
  await context.close();
});`,
  codeLanguage: "typescript",
  tip: "Combine locale, timezone, and geolocation for comprehensive i18n testing. A single browser context can set all three simultaneously.",
}
```

### New Section 12: Permissions Emulation

```typescript
{
  heading: "Permissions Emulation",
  content:
    "Modern web applications request browser permissions for camera, microphone, notifications, geolocation, and clipboard access. Testing permission-gated features requires controlling whether the browser grants or denies these permissions.\n\nPlaywright's `context.grantPermissions()` and `context.clearPermissions()` control permission state without showing browser prompts. This lets you test both the granted and denied paths.",
  code: `import { test, expect } from '@playwright/test';

// Grant notifications permission — test the granted path
test('notification permission granted shows push settings', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['notifications'],
  });
  const page = await context.newPage();

  await page.goto('/settings/notifications');

  // With permission granted, the push notification toggle should be enabled
  await expect(page.getByTestId('push-notification-toggle')).toBeEnabled();
  await context.close();
});

// Deny notifications permission — test the denied path
test('notification permission denied shows enable prompt', async ({ browser }) => {
  // No permissions granted — browser defaults to 'prompt' or 'denied'
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('/settings/notifications');

  // Without permission, the app should show an "Enable Notifications" prompt
  await expect(page.getByTestId('enable-notifications-prompt')).toBeVisible();
  await expect(page.getByTestId('push-notification-toggle')).toBeDisabled();
  await context.close();
});

// Grant and then revoke permissions mid-test
test('revoking camera permission disables video chat', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['camera', 'microphone'],
  });
  const page = await context.newPage();

  await page.goto('/video-chat');
  await expect(page.getByTestId('video-preview')).toBeVisible();

  // Revoke permissions
  await context.clearPermissions();

  // Refresh to trigger re-check
  await page.reload();
  await expect(page.getByTestId('camera-permission-prompt')).toBeVisible();
  await context.close();
});

// Available permissions:
// 'geolocation', 'midi', 'notifications', 'camera', 'microphone',
// 'background-sync', 'ambient-light-sensor', 'accelerometer',
// 'gyroscope', 'magnetometer', 'clipboard-read', 'clipboard-write'`,
  codeLanguage: "typescript",
  callout: "Permission emulation works at the context level, not the page level. All pages in the same context share the same permission state.",
}
```

---

## Expansion 2: Module 22 — UI Mode Deep-Dive

**File:** `src/data/modules/22-trace-viewer.ts`
**Current sections:** 7 (What's Inside a Trace File through Trace Artifacts in CI)
**Proposed addition:** 1 new section inserted after "Debugging Workflow" (section index 6)

### New Section 7: UI Mode — Interactive Test Runner

```typescript
{
  heading: "UI Mode — Interactive Test Runner",
  content:
    "Playwright's UI Mode (`npx playwright test --ui`) is the most powerful local debugging tool. It combines the trace viewer, watch mode, and a test runner into a single interface. Unlike the CLI, UI Mode lets you see test execution in real time, step through actions, filter tests, and re-run selectively — all without leaving the browser.\n\nUI Mode vs. CLI Tracing:\n- **CLI + trace files:** Run tests, then open traces after the fact. Good for CI and post-mortem debugging.\n- **UI Mode:** Watch tests execute live, inspect at each step, re-run instantly. Good for local development and writing new tests.\n\nUse UI Mode during development. Use CLI tracing in CI.",
  code: `# Launch UI Mode
npx playwright test --ui

# UI Mode with a specific test file
npx playwright test login.spec.ts --ui

# UI Mode features:
# - Left panel: test tree with pass/fail status
# - Center: live browser rendering during execution
# - Bottom: action list with timeline, identical to trace viewer
# - Filter bar: search tests, filter by status, tag, or project
# - Watch mode: re-runs tests automatically when files change
# - Step-through: click any action to see the DOM state at that moment`,
  codeLanguage: "bash",
  table: {
    headers: ["Feature", "CLI + Trace", "UI Mode"],
    rows: [
      ["When to use", "CI, post-mortem debugging", "Local development, test authoring"],
      ["Execution", "Batch run, results after", "Live, interactive"],
      ["Re-running", "Manual: re-run entire command", "Click to re-run single test"],
      ["Filtering", "CLI flags: -g, --project", "Visual filter bar in UI"],
      ["Watch mode", "Not available", "Built-in: re-runs on file save"],
      ["DOM inspection", "After the fact via snapshots", "Live during execution"],
      ["Network", "Trace file after run", "Live network panel"],
      ["Performance", "Adds ~100ms overhead for tracing", "Adds visual rendering overhead"],
    ],
  },
  tip: "UI Mode's watch feature makes it excellent for TDD-style test writing. Change a test file, save, and it re-runs automatically — showing you the result in the browser instantly.",
}
```

---

## Expansion 3: Module 16 — globalTeardown Patterns

**File:** `src/data/modules/16-auth-fixtures.ts`
**Current sections:** 6 (Why UI Login Doesn't Scale through Common Pitfalls)
**Proposed addition:** 1 new section appended after "Common Pitfalls"

### New Section 7: globalTeardown for Cleanup

```typescript
{
  heading: "globalTeardown for Cleanup",
  content:
    "Playwright's `globalSetup` runs before all tests. Its counterpart, `globalTeardown`, runs after all tests finish — regardless of pass or fail. Use it to clean up resources created during testing: delete test users, remove uploaded files, reset database state, or close external service connections.\n\nglobalTeardown is configured in playwright.config.ts alongside globalSetup. It receives the same FullConfig parameter, so it can access project settings and base URLs.",
  code: `// global-teardown.ts
import { chromium, type FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Option 1: Use the app's admin reset endpoint
  await page.goto('http://localhost:5173/admin');
  await page.fill('[data-testid="admin-email"]', 'admin@test.com');
  await page.fill('[data-testid="admin-password"]', 'AdminPass1!');
  await page.click('[data-testid="admin-login"]');
  await page.click('[data-testid="admin-seed-reset"]');
  await page.waitForSelector('[data-testid="toast-message-0"]');

  await browser.close();
}

export default globalTeardown;

// -----------------------------------------------
// playwright.config.ts — register both setup and teardown
// -----------------------------------------------
// import { defineConfig } from '@playwright/test';
//
// export default defineConfig({
//   globalSetup: './global-setup.ts',
//   globalTeardown: './global-teardown.ts',
//   // ...
// });`,
  codeLanguage: "typescript",
  table: {
    headers: ["Cleanup Strategy", "When It Runs", "Best For"],
    rows: [
      ["globalTeardown", "Once after all tests in all projects", "Database reset, temp file cleanup, service shutdown"],
      ["afterAll (in spec)", "After all tests in that file", "File-level cleanup, closing custom connections"],
      ["afterEach (in spec)", "After each individual test", "Per-test data deletion, state reset"],
      ["Fixture teardown", "After each test that uses the fixture", "Fixture-scoped resources (browser contexts, API clients)"],
    ],
  },
  warning: "globalTeardown runs even when tests fail or are interrupted. However, it does NOT run if the Playwright process is killed with SIGKILL (kill -9). For critical cleanup, pair globalTeardown with time-based data expiry.",
  tip: "If your test environment supports API-based reset (DELETE /api/test-data or POST /api/reset), prefer that over UI-based teardown — it's faster, less fragile, and doesn't require a browser.",
}
```

---

## Implementation Notes

### Module 23 Expansion
- The 4 new sections should be inserted AFTER the existing "Mobile Accessibility" section (index 7)
- Update the module title/subtitle to reflect broader emulation coverage
- Consider renaming from "Mobile & Responsive Testing" to "Emulation & Responsive Testing"
- Add quiz questions covering at least geolocation and timezone

### Module 22 Expansion
- The UI Mode section should be inserted after "Debugging Workflow" and before "Trace Artifacts in CI"
- Add a quiz question about when to use UI Mode vs. CLI tracing

### Module 16 Expansion
- The globalTeardown section appends naturally after "Common Pitfalls"
- Add a quiz question about the difference between globalSetup and globalTeardown
