import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 22,
  title: "Trace Viewer Deep-Dive",
  subtitle: "Debugging failures with actions, snapshots, network, and timeline",
  icon: "🔍",
  audience: "All Roles",
  sections: [
    {
      heading: "What's Inside a Trace File",
      content:
        "A Playwright trace is a zip archive that records everything that happened during a test: every action (click, fill, navigate), DOM snapshots before and after each step, network requests/responses, console messages, and rendering timing. Think of it as a flight recorder for your test — when something goes wrong, the trace tells you exactly what happened and when.",
      table: {
        headers: ["Trace Content", "What It Captures", "Debugging Use"],
        rows: [
          ["Actions", "Every Playwright API call with timing", "Identify which step failed and how long it took"],
          ["DOM Snapshots", "Full HTML state before/after each action", "See what the page looked like when the assertion failed"],
          ["Network", "All HTTP requests, responses, status codes, timing", "Find slow APIs, failed requests, CORS issues"],
          ["Console", "console.log, console.error, warnings", "Spot JavaScript errors or app-level diagnostics"],
          ["Screenshots", "Automatic capture at key points", "Visual confirmation of page state"],
        ],
      },
    },
    {
      heading: "Configuring Tracing",
      content:
        "Playwright offers three tracing strategies, each balancing diagnostic value against storage and performance cost. Choose based on your CI budget and how often tests fail.",
      code: `// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Option 1: Trace only on retry (recommended for CI)
    // Captures trace when a test fails and is retried
    trace: 'on-first-retry',

    // Option 2: Always trace (local debugging)
    // trace: 'on',

    // Option 3: Keep trace only on failure
    // trace: 'retain-on-failure',
  },
  retries: process.env.CI ? 2 : 0,
});`,
      codeLanguage: "typescript",
      table: {
        headers: ["Strategy", "When Traced", "Storage Cost", "Best For"],
        rows: [
          ["on-first-retry", "Only when a test fails and retries", "Low — only failing tests", "CI pipelines (recommended default)"],
          ["on", "Every test, every run", "High — every test generates ~5-20 MB", "Local debugging sessions"],
          ["retain-on-failure", "Every test, but only keeps failures", "Medium — disk used then cleaned", "When you want traces without retries"],
          ["off", "Never", "None", "Speed-critical runs (not recommended)"],
        ],
      },
      tip: "Start with `trace: 'on-first-retry'` in CI. It captures traces exactly when you need them — on failures — without the storage overhead of tracing every run.",
    },
    {
      heading: "Opening Traces",
      content:
        "Trace files can be opened locally with the CLI or online via Playwright's hosted viewer. Both show the same data; the online viewer is convenient for sharing with teammates.",
      code: `# Open a local trace file
npx playwright show-trace test-results/login-test/trace.zip

# Or drag-and-drop into the online viewer:
# https://trace.playwright.dev

# Traces are in test-results/{test-name}/ after a failed run
# with trace enabled`,
      codeLanguage: "bash",
      callout: "The online trace viewer at trace.playwright.dev processes everything client-side — your trace data never leaves the browser. Safe for sensitive test data.",
    },
    {
      heading: "The Timeline Tab",
      content:
        "Playwright's Timeline tab (introduced in v1.58) shows a chronological view that correlates actions, network requests, and page rendering on a shared time axis. This is the most powerful debugging tool for timing-related flakes — you can see exactly when a network request completed relative to when your assertion ran.",
      table: {
        headers: ["Timeline Lane", "What It Shows", "What to Look For"],
        rows: [
          ["Actions", "Playwright API calls with duration bars", "Long-running actions, unexpected waits"],
          ["Network", "HTTP requests with waterfall timing", "Slow responses, 4xx/5xx errors, pending requests at assertion time"],
          ["Rendering", "Browser paint and layout events", "Layout shifts, delayed renders that cause visual flakes"],
        ],
      },
    },
    {
      heading: "Network Panel",
      content:
        "The trace network panel shows every HTTP request made during the test, including headers, bodies, and timing. This is essential for diagnosing API-related failures — you can see if a request timed out, returned an error, or returned unexpected data.",
      code: `// Common network issues visible in traces:

// 1. API returned 500 during test
//    → Network tab shows: POST /api/users 500 Internal Server Error
//    → Fix: Check server logs, add API health check before test

// 2. CORS error blocking request
//    → Network tab shows: OPTIONS /api/data (blocked by CORS)
//    → Fix: Configure test server CORS headers

// 3. Request still pending when assertion ran
//    → Timeline shows: GET /api/orders started, assertion failed,
//                       response arrived 200ms later
//    → Fix: Wait for response before asserting`,
      codeLanguage: "typescript",
    },
    {
      heading: "Action Snapshots",
      content:
        "Each action in the trace captures a DOM snapshot before and after execution. Clicking any action in the trace viewer shows exactly what the page looked like at that moment. This is invaluable for understanding 'why did my locator not match?' — you can see the actual DOM state and compare it to what you expected.",
      tip: "When a locator fails, find the action in the trace and check the 'Before' snapshot. Often the element exists but has different text, a different attribute, or is in a different position than expected.",
    },
    {
      heading: "Debugging Workflow",
      content:
        "Follow this systematic workflow when a test fails. Resist the urge to guess — let the trace tell you what happened.",
      table: {
        headers: ["Step", "Action", "What You Learn"],
        rows: [
          ["1. Reproduce", "Run the failing test with --trace on", "Confirm the failure and capture evidence"],
          ["2. Open trace", "npx playwright show-trace trace.zip", "Get the full picture of what happened"],
          ["3. Find failure", "Click the red (failed) action in the action list", "See exactly which step failed"],
          ["4. Check snapshot", "View Before/After DOM state at the failed action", "See what the page actually looked like"],
          ["5. Check network", "Look at pending/failed requests at failure time", "Identify API or timing issues"],
          ["6. Check console", "Review console errors around the failure", "Spot JavaScript errors or warnings"],
          ["7. Fix", "Address the root cause (selector, timing, data, API)", "Apply the correct fix category"],
          ["8. Verify", "Run the test 10x to confirm stability", "Ensure the fix is robust"],
        ],
      },
    },
    {
      heading: "Trace Artifacts in CI",
      content:
        "In CI, traces must be uploaded as artifacts so you can download and analyze them after the pipeline finishes. Always upload with `if: always()` — otherwise artifacts are skipped when tests fail, which is exactly when you need them.",
      code: `# GitHub Actions — upload traces as artifacts
- name: Upload test artifacts
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-traces
    path: |
      test-results/
      playwright-report/
    retention-days: 7`,
      codeLanguage: "yaml",
    },
  ],
  quiz: {
    question: "What does trace: 'on-first-retry' do?",
    options: [
      "Records a trace for every test on every run",
      "Captures a trace only when a test fails on first attempt and is retried",
      "Creates a trace file only for the first test in the suite",
      "Retries all tests once and traces the retry attempts",
    ],
    correctIndex: 1,
    explanation:
      "The 'on-first-retry' strategy captures traces only when a test fails and Playwright retries it. This balances diagnostic value (you get traces for failing tests) with performance and storage cost (passing tests don't generate traces). It's the recommended default for CI pipelines.",
  },
  exercises: [
    {
      difficulty: 'beginner',
      title: "Trace-Based Root Cause Analysis",
      description:
        "Given a failing test and trace analysis notes, identify the root cause and write the fix. The test clicks a save button and asserts a toast message, but fails intermittently.",
      narration:
        "Read the trace analysis notes carefully before touching any code — the timeline numbers tell the whole story. Notice that the assertion ran at T+1300ms but the text content didn't populate until T+1450ms, which means `toHaveText` fired during a 150ms window when the element existed but held empty text. That maps directly to the Timing → Race condition category from Module 19. Your fix adds `await expect(msg).toBeVisible({ timeout: 3000 })` before the text assertion because you want Playwright to confirm the element is present and stable before checking its content — and then `toHaveText` handles the remaining async delay through its own auto-retry loop. You're not guessing at a root cause here; you're reading the evidence the trace gave you and applying the right fix category.",
      starterCode: `import { test, expect } from '@playwright/test';

// This test fails ~30% of the time in CI
test('settings save shows confirmation', async ({ page }) => {
  await page.goto('/settings');
  await page.getByTestId('settings-name-input').fill('Trace Debug');
  await page.getByTestId('settings-save-button').click();

  // Fails with: expect(locator).toHaveText - expected "Profile saved successfully."
  //                                          received ""
  const msg = page.getByTestId('toast-message-0');
  await expect(msg).toHaveText('Profile saved successfully.');
});

// TRACE ANALYSIS NOTES:
// - Action list: fill(name) ✓ → click(save) ✓ → expect(toHaveText) ✗
// - Timeline: click(save) completed at T+1200ms,
//   toast-message-0 element appeared at T+1250ms with empty text,
//   text content populated at T+1450ms (200ms async delay),
//   assertion ran at T+1300ms (BEFORE text populated)
// - Network: no failed requests
// - Console: no errors
//
// TODO: What is the root cause? What category from Module 19?
// TODO: Write the fix below`,
      solutionCode: `import { test, expect } from '@playwright/test';

// ROOT CAUSE: Timing → Race condition
// The toast element appears immediately but content populates after
// a 200ms async delay. The assertion runs during this window when
// the toast exists but has empty text.
//
// The fix: Use toBeVisible() first to ensure the element is present,
// then use toHaveText() which auto-retries until the text matches.

test('settings save shows confirmation', async ({ page }) => {
  await page.goto('/settings');
  await page.getByTestId('settings-name-input').fill('Trace Debug');
  await page.getByTestId('settings-save-button').click();

  const msg = page.getByTestId('toast-message-0');

  // Wait for the toast element to be visible
  await expect(msg).toBeVisible({ timeout: 3000 });

  // toHaveText auto-retries, handling the 200ms content delay
  await expect(msg).toHaveText('Profile saved successfully.');
});`,
      hints: [
        "Look at the Timeline: the assertion ran at T+1300ms but text populated at T+1450ms",
        "The root cause is a Timing → Race condition (Module 19 taxonomy)",
        "The fix is to wait for visibility first, then use auto-retrying toHaveText()",
      ],
    },
    {
      difficulty: 'intermediate',
      title: 'Test Async Loading States on Activity Page',
      description: 'The Activity page has mock controls that simulate different loading states. Write tests that verify the loading spinner, error state, and empty state render correctly.',
      narration:
        "The key insight here is that these mock controls let you force specific states on demand, so your test pattern is always the same: click the mode button, click `activity-refresh` to trigger the new fetch, then assert the expected UI element. For the slow-loading test, you'll assert `activity-loading` is visible immediately after refresh — that checks the spinner — and then assert `activity-list` is visible with a generous `{ timeout: 10000 }` to wait out the simulated delay; you need both assertions because one without the other doesn't prove the loading state worked. For the error test, assert `activity-error` is visible AND that `activity-list` is not visible — the negative assertion matters because it proves the app cleared the previous data rather than showing both. The empty-state test is the simplest: just assert `activity-empty` is visible after switching modes.",
      starterCode: `import { test, expect } from '@playwright/test';

test.describe('Activity Page Loading States', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByTestId('email-input').fill('user@test.com');
    await page.getByTestId('password-input').fill('Password123!');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');
  });

  test('shows loading state during data fetch', async ({ page }) => {
    await page.goto('/activity');
    // TODO: Click the "slow" mode button to simulate slow loading
    // TODO: Click refresh
    // TODO: Assert the loading indicator appears
    // TODO: Wait for loading to complete, assert activity list appears
  });

  test('shows error state on failure', async ({ page }) => {
    await page.goto('/activity');
    // TODO: Click the "error" mode button
    // TODO: Click refresh
    // TODO: Assert the error message appears
    // TODO: Assert the activity list is NOT visible
  });

  test('shows empty state when no activities', async ({ page }) => {
    await page.goto('/activity');
    // TODO: Click the "empty" mode button
    // TODO: Click refresh
    // TODO: Assert the empty state message appears
  });
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test.describe('Activity Page Loading States', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('user@test.com');
    await page.getByTestId('password-input').fill('Password123!');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');
  });

  test('shows loading state during data fetch', async ({ page }) => {
    await page.goto('/activity');
    await page.getByTestId('activity-mode-slow').click();
    await page.getByTestId('activity-refresh').click();
    await expect(page.getByTestId('activity-loading')).toBeVisible();
    await expect(page.getByTestId('activity-list')).toBeVisible({ timeout: 10000 });
  });

  test('shows error state on failure', async ({ page }) => {
    await page.goto('/activity');
    await page.getByTestId('activity-mode-error').click();
    await page.getByTestId('activity-refresh').click();
    await expect(page.getByTestId('activity-error')).toBeVisible();
    await expect(page.getByTestId('activity-list')).not.toBeVisible();
  });

  test('shows empty state when no activities', async ({ page }) => {
    await page.goto('/activity');
    await page.getByTestId('activity-mode-empty').click();
    await page.getByTestId('activity-refresh').click();
    await expect(page.getByTestId('activity-empty')).toBeVisible();
  });
});`,
      hints: [
        'Mock controls use testid pattern: activity-mode-{mode} (success, error, slow, empty)',
        'After changing mode, click activity-refresh to trigger the new state',
        'For slow loading, increase the timeout: toBeVisible({ timeout: 10000 })',
        'Use not.toBeVisible() to assert an element should NOT be present',
      ],
    },
    {
      difficulty: 'advanced',
      title: 'Test Activity Filters and Detail Panel',
      description: 'Write tests for the Activity page\'s filter buttons and detail panel. Verify that clicking a filter narrows results and clicking an activity row opens its detail view.',
      narration:
        "Start the filter test by capturing the unfiltered count using `page.locator('[data-testid^=\"activity-row-\"]').count()` — the `^=` attribute selector matches all rows regardless of their numeric suffix, which is more robust than trying to count by a fixed testid. After clicking the first filter button (scoped inside `activity-filters` to avoid ambiguity), assert that the new count is less than or equal to the original, then click the same button again to deselect and assert `toHaveCount(totalCount)` to confirm the full list restored. For the detail panel test, click the first row using the same `^=` selector, assert `activity-detail` is visible — this confirms the panel opened — then click `activity-detail-close` and assert the detail is no longer visible. The error-recovery test is worth doing because it proves your `beforeEach` state doesn't leak: switch to error, refresh, confirm the error state, then switch back and confirm the list reappears with rows.",
      starterCode: `import { test, expect } from '@playwright/test';

test.describe('Activity Filters and Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('user@test.com');
    await page.getByTestId('password-input').fill('Password123!');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');
    await page.goto('/activity');
    // Ensure we're in success mode with data
    await page.getByTestId('activity-mode-success').click();
    await page.getByTestId('activity-refresh').click();
    await expect(page.getByTestId('activity-list')).toBeVisible();
  });

  test('filter buttons narrow activity list', async ({ page }) => {
    // TODO: Count total activities
    // TODO: Click a filter button
    // TODO: Assert the count changed (or stayed the same if all match)
    // TODO: Click the same filter again to deselect
    // TODO: Assert original count returns
  });

  test('clicking activity opens detail panel', async ({ page }) => {
    // TODO: Click the first activity row
    // TODO: Assert the detail panel appears
    // TODO: Click the close button on the detail panel
    // TODO: Assert the detail panel disappears
  });

  test('switching from error to success mode recovers', async ({ page }) => {
    // TODO: Switch to error mode, refresh, assert error state
    // TODO: Switch back to success mode, refresh
    // TODO: Assert activity list reappears with data
  });
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test.describe('Activity Filters and Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('user@test.com');
    await page.getByTestId('password-input').fill('Password123!');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');
    await page.goto('/activity');
    await page.getByTestId('activity-mode-success').click();
    await page.getByTestId('activity-refresh').click();
    await expect(page.getByTestId('activity-list')).toBeVisible();
  });

  test('filter buttons narrow activity list', async ({ page }) => {
    const allRows = page.locator('[data-testid^="activity-row-"]');
    const totalCount = await allRows.count();

    // Click first filter
    const firstFilter = page.getByTestId('activity-filters').locator('button').first();
    await firstFilter.click();
    const filteredCount = await allRows.count();
    expect(filteredCount).toBeLessThanOrEqual(totalCount);

    // Deselect filter
    await firstFilter.click();
    await expect(allRows).toHaveCount(totalCount);
  });

  test('clicking activity opens detail panel', async ({ page }) => {
    const firstRow = page.locator('[data-testid^="activity-row-"]').first();
    await firstRow.click();
    await expect(page.getByTestId('activity-detail')).toBeVisible();
    await page.getByTestId('activity-detail-close').click();
    await expect(page.getByTestId('activity-detail')).not.toBeVisible();
  });

  test('switching from error to success mode recovers', async ({ page }) => {
    await page.getByTestId('activity-mode-error').click();
    await page.getByTestId('activity-refresh').click();
    await expect(page.getByTestId('activity-error')).toBeVisible();

    await page.getByTestId('activity-mode-success').click();
    await page.getByTestId('activity-refresh').click();
    await expect(page.getByTestId('activity-list')).toBeVisible();
    const rows = page.locator('[data-testid^="activity-row-"]');
    expect(await rows.count()).toBeGreaterThan(0);
  });
});`,
      hints: [
        'Activity rows have testids like activity-row-1, activity-row-2 — use [data-testid^="activity-row-"] to match all',
        'The detail panel has a close button: activity-detail-close',
        'Filters are inside the activity-filters container as button elements',
        'Test error recovery: switch modes and verify the UI updates accordingly',
      ],
    },
  ],
  promptTemplates: [
    {
      label: "Analyze Trace Error",
      prompt:
        "Analyze this Playwright error message and trace summary to identify the root cause. Error: {error message}. Trace notes: {timeline observations, network state, DOM snapshot}. Classify using the flaky test taxonomy and suggest a fix.",
      context: "CARD format: Context — failing CI test with trace. Action — root cause analysis. Role — QE engineer. Deliverable — classification + fix + prevention.",
    },
    {
      label: "Trace Debugging Checklist",
      prompt:
        "Generate a trace-based debugging checklist for this test failure category: {category}. Include: what to check in the action list, timeline, network panel, and DOM snapshots. Provide specific things to look for and common fixes.",
      context: "CARD format: Context — recurring test failure pattern. Action — create debugging checklist. Role — QE lead. Deliverable — step-by-step trace analysis guide.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/",
    label: "Practice App",
    description: "Run tests with `npx playwright test --trace on` and open the trace viewer to explore actions, snapshots, network, and timeline.",
  },
};
