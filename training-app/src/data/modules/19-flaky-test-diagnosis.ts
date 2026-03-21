import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 19,
  title: "Flaky Test Diagnosis & Recovery",
  subtitle: "Root cause taxonomy, quarantine protocol, and evidence-first triage",
  icon: "🔄",
  audience: "All Roles",
  sections: [
    {
      heading: "What Makes a Test Flaky?",
      content:
        "A flaky test is one that passes and fails on the same code without any changes. It erodes team confidence in the test suite — when people stop trusting test results, they stop paying attention to failures. The most common causes are timing dependencies, shared state, environment differences, and animation interference. Every flaky test has a root cause; the challenge is diagnosing it.",
      callout: "A test suite with 5% flake rate and 200 tests means ~10 false failures per run. After a few weeks, the team starts ignoring ALL failures — including real bugs.",
    },
    {
      heading: "Root Cause Taxonomy",
      content:
        "Categorizing flaky tests by root cause helps you apply the right fix. Here's the taxonomy used by enterprise QE teams:",
      table: {
        headers: ["Category", "Root Cause", "Example", "Fix Pattern"],
        rows: [
          ["Timing", "Race condition", "Assert toast content before 200ms delay completes", "Use expect().toBeVisible() with auto-retry, never waitForTimeout"],
          ["Timing", "Animation interference", "Click during CSS transition fails", "Use { force: true } or wait for animation to complete"],
          ["State", "Shared state between tests", "Test A creates data that Test B deletes", "Isolate test data per test; use factories"],
          ["State", "Stale DOM reference", "Element re-rendered after action, locator stale", "Re-query the locator after state changes"],
          ["Network", "Slow/flaky API response", "API timeout in CI but not locally", "Mock slow APIs or increase timeout for network-dependent tests"],
          ["Environment", "OS/browser rendering diff", "Font rendering differs on Linux CI vs Mac local", "Use Docker for consistent environment"],
          ["DOM", "Element not yet in DOM", "Click before component mounts", "Use expect(locator).toBeVisible() before interacting"],
        ],
      },
    },
    {
      heading: "Retry vs Fix",
      content:
        "Playwright's `test.retries()` re-runs failed tests automatically. This is appropriate for genuinely environment-dependent tests (network timeouts, container startup latency) but dangerous when used to mask real bugs. Retries should be a temporary bridge while you fix the root cause, not a permanent workaround.",
      code: `// playwright.config.ts — global retries
export default defineConfig({
  retries: process.env.CI ? 2 : 0, // Retry in CI only
});

// Per-test retry for known environment-dependent test
test('external API integration', async ({ page }) => {
  test.retries(2); // This specific test has legitimate network variance
  await page.goto('/api-status');
  await expect(page.getByTestId('status')).toContainText('Connected');
});`,
      codeLanguage: "typescript",
      warning: "If you're adding retries to more than 5% of your tests, you have a systemic problem — not a retry problem. Stop and fix the root causes.",
    },
    {
      heading: "Quarantine Protocol",
      content:
        "When a flaky test is discovered, it needs to be isolated immediately so it doesn't block other work. The quarantine protocol ensures flaky tests are tracked, isolated, and fixed within an SLA.",
      table: {
        headers: ["Step", "Action", "Owner"],
        rows: [
          ["1. Tag", "Add @flaky tag and link to tracking issue", "Discoverer"],
          ["2. Isolate", "Move to quarantine test project (runs separately)", "Discoverer"],
          ["3. Diagnose", "Collect trace, screenshot, video; classify root cause", "Assigned engineer"],
          ["4. Fix", "Address root cause (not just add retries)", "Assigned engineer"],
          ["5. Validate", "Run fixed test 10x consecutively to confirm stability", "Assigned engineer"],
          ["6. Restore", "Remove @flaky tag, move back to main suite", "Assigned engineer"],
        ],
      },
      tip: "Set an SLA: flaky tests must be fixed within 5 business days or they get deleted. This prevents the quarantine from becoming a graveyard.",
    },
    {
      heading: "Evidence-First Triage",
      content:
        "Never guess at flaky test causes. Playwright provides four evidence sources that together tell the complete story of what happened during a test run.",
      code: `// playwright.config.ts — capture all evidence on failure
export default defineConfig({
  use: {
    trace: 'on-first-retry',    // Full trace on retry
    screenshot: 'only-on-failure', // Screenshot at failure point
    video: 'retain-on-failure',    // Video of the full test
  },
});

// View the trace after a failure:
// npx playwright show-trace test-results/my-test/trace.zip`,
      codeLanguage: "typescript",
      table: {
        headers: ["Evidence", "What It Shows", "Best For"],
        rows: [
          ["Trace", "Every action, network request, DOM snapshot, console log", "Timing issues, race conditions, state changes"],
          ["Screenshot", "Exact visual state at failure moment", "Layout issues, missing elements, unexpected UI state"],
          ["Video", "Full test execution playback", "Understanding the sequence of events leading to failure"],
          ["Console logs", "JavaScript errors, warnings, app logging", "Runtime errors, failed API calls, state corruption"],
        ],
      },
    },
    {
      heading: "Communicating Failure Severity",
      content:
        "Not all flaky tests are equal. Use a severity scale to help the team prioritize fixes and understand impact. Communicate flaky test status in standups and sprint reviews so they don't become invisible technical debt.",
      table: {
        headers: ["Severity", "Definition", "SLA"],
        rows: [
          ["P1 — Blocker", "Flakes >50% of runs, blocks CI pipeline", "Fix within 1 day or delete"],
          ["P2 — High", "Flakes 10-50% of runs, causes team to ignore results", "Fix within 3 days"],
          ["P3 — Medium", "Flakes <10% of runs, occasional noise", "Fix within 5 days"],
          ["P4 — Low", "Flaked once, cannot reproduce", "Monitor for recurrence"],
        ],
      },
    },
  ],
  quiz: {
    question: "When is adding test.retries(2) the RIGHT solution?",
    options: [
      "When a test fails due to a CSS selector that sometimes doesn't match",
      "When a test flakes because the toast auto-dismisses before the assertion runs",
      "For genuinely environment-dependent tests like external network timeouts",
      "When you don't have time to investigate the root cause before a release",
    ],
    correctIndex: 2,
    explanation:
      "Retries are appropriate only for tests that depend on genuinely variable external factors — network latency, container startup time, third-party service availability. For selector issues, fix the selector. For timing issues like toast auto-dismiss, fix the assertion pattern. Retries should never be a substitute for proper diagnosis.",
  },
  exercise: {
    title: "Diagnose a Flaky Toast Test",
    description:
      "The starter code has a test that sometimes fails because it asserts toast content after the auto-dismiss timer fires. Fix it to be deterministic by properly waiting for the toast to appear before asserting.",
    starterCode: `import { test, expect } from '@playwright/test';

test('save shows success toast', async ({ page }) => {
  await page.goto('/settings');

  // Fill in profile and save
  await page.getByTestId('settings-name-input').fill('Updated Name');
  await page.getByTestId('settings-save-button').click();

  // BUG: This sometimes fails because:
  // 1. Toast content appears after a 200ms delay
  // 2. Toast auto-dismisses after 5 seconds
  // 3. If the test runs slowly, toast may be gone before assertion
  const toast = page.getByTestId('toast-message-0');
  expect(await toast.textContent()).toBe('Profile saved successfully.');
});`,
    solutionCode: `import { test, expect } from '@playwright/test';

test('save shows success toast', async ({ page }) => {
  await page.goto('/settings');

  // Fill in profile and save
  await page.getByTestId('settings-name-input').fill('Updated Name');
  await page.getByTestId('settings-save-button').click();

  // Fix: Use auto-retrying assertions that wait for the element
  // to appear and match, avoiding the race condition
  const toast = page.getByTestId('toast-message-0');

  // Wait for toast to be visible first (handles the 200ms content delay)
  await expect(toast).toBeVisible({ timeout: 3000 });

  // Then assert content with auto-retry (handles async content update)
  await expect(toast).toHaveText('Profile saved successfully.');
});`,
    hints: [
      "The root cause is using non-retrying expect() instead of auto-retrying await expect()",
      "await expect(locator).toBeVisible() waits until the element appears in the DOM",
      "await expect(locator).toHaveText() auto-retries until the text matches or times out",
    ],
  },
  promptTemplates: [
    {
      label: "Analyze Flaky Test Root Cause",
      prompt:
        "Analyze this failing Playwright test and classify the root cause using the flaky test taxonomy (Timing/State/Network/Environment/DOM). Provide the specific subcategory, explain why it flakes, and suggest a fix. Test code:\n{paste test code here}",
      context: "CARD format: Context — test that passes/fails intermittently. Action — root cause analysis. Role — QE engineer. Deliverable — classification + fix.",
    },
    {
      label: "Generate Quarantine Tracking Issue",
      prompt:
        "Generate a quarantine tracking issue for this flaky test. Include: test name, file path, flake rate, root cause classification, evidence collected (trace/screenshot/video), proposed fix, and SLA deadline. Test: {test name}",
      context: "CARD format: Context — flaky test discovered in CI. Action — create tracking issue. Role — QE lead. Deliverable — structured issue template.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/settings",
    label: "Settings Page",
    description: "Trigger save actions and test the toast timing behavior — the 200ms content delay and 5-second auto-dismiss create a realistic flaky test surface.",
  },
};
