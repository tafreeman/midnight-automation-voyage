import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 19,
  title: "Flaky Test Diagnosis & Recovery",
  subtitle: "Root cause taxonomy, quarantine protocol, and evidence-first triage",
  icon: "🔄",
  sections: [
    {
      heading: "What Makes a Test Flaky?",
      content:
        "A flaky test is one that passes and fails on the same code without any changes. It erodes team confidence in the test suite — when people stop trusting test results, they stop paying attention to failures. The most common causes are timing dependencies, shared state, environment differences, and animation interference. Every flaky test has a root cause; the challenge is diagnosing it.",
      callout: "A test suite with 5% flake rate and 200 tests means ~10 false failures per run. After a few weeks, people start ignoring all failures, including real bugs.",
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
        "Not all flaky tests are equal. Use a severity scale to prioritize fixes and understand impact. Communicate flaky test status clearly so it does not become invisible technical debt.",
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
    additionalQuestions: [
      {
        question: "What is the difference between expect(await locator.textContent()).toBe('text') and await expect(locator).toHaveText('text')?",
        options: [
          "They are functionally identical — just different syntax",
          "The first checks once immediately and fails if the text is not present; the second auto-retries until timeout",
          "The first is faster because it skips the retry loop",
          "The second only works with toHaveText, not with other matchers",
        ],
        correctIndex: 1,
        explanation: "expect(await locator.textContent()) resolves the text content once, right now, and passes a plain string to expect(). If the element has not rendered yet or its text has not populated, the assertion fails immediately. await expect(locator).toHaveText() is an auto-retrying assertion — Playwright keeps checking until the text matches or the timeout expires. The auto-retrying form eliminates timing-based flakiness.",
      },
      {
        question: "After fixing a flaky test, what should you do before removing the @flaky tag and restoring it to the main suite?",
        options: [
          "Run the test once to confirm it passes",
          "Run the test 10 times consecutively to confirm stability",
          "Add test.retries(2) as a safety net",
          "Wait 30 days to see if it flakes again in CI",
        ],
        correctIndex: 1,
        explanation: "Running a fixed test once only proves it can pass — it does not prove it is stable. The quarantine protocol requires running the test 10 times consecutively to confirm stability before restoring it. This catches fixes that only reduce flake frequency rather than eliminating the root cause. If any of the 10 runs fail, the fix is incomplete.",
      },
    ],
  },
  exercises: [
    {
      difficulty: 'beginner',
      title: 'Spot the Flaky Line',
      description:
        'This test passes most of the time but fails randomly in CI. Read the test carefully and add a comment on the line that causes flakiness. Then explain WHY it flakes in the comment.',
      narration:
        "Start by reading each line and asking yourself: does this assertion wait and retry, or does it check exactly once right now? Notice that Line 5 uses the pattern `expect(await toast.textContent())` — the `await` resolves the value immediately and hands a plain string to `expect()`, so Playwright has no way to retry if the toast hasn't rendered yet. That's your flaky line. Line 6 is also suspect because the `not.toBeVisible()` assertion might race against the auto-dismiss timer — if the toast is already gone, that passes by accident rather than by design. When you write your comments, explain the mechanism: the toast appears after a 200ms delay, and a one-shot assertion can run inside that window before the text exists.",
      starterCode: `import { test, expect } from '@playwright/test';

test('save shows success toast', async ({ page }) => {
  await page.goto('/settings');                                    // Line 1
  await page.getByTestId('settings-name-input').fill('New Name');  // Line 2
  await page.getByTestId('settings-save-button').click();          // Line 3
  const toast = page.getByTestId('toast-message-0');               // Line 4
  expect(await toast.textContent()).toBe('Profile saved successfully.'); // Line 5
  await expect(toast).not.toBeVisible();                           // Line 6
});

// YOUR TASK: Which line(s) cause flakiness? Add comments explaining:
// FLAKY LINE: ___
// REASON: ___
// FIX: ___`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('save shows success toast', async ({ page }) => {
  await page.goto('/settings');
  await page.getByTestId('settings-name-input').fill('New Name');
  await page.getByTestId('settings-save-button').click();
  const toast = page.getByTestId('toast-message-0');

  // FLAKY LINE: Line 5
  // REASON: expect(await toast.textContent()) is a NON-retrying assertion.
  // It reads textContent once. If the toast hasn't rendered yet (200ms delay),
  // textContent() returns null and the test fails.
  // FIX: Use await expect(toast).toHaveText('Profile saved successfully.')
  // which auto-retries until the text matches or timeout.
  expect(await toast.textContent()).toBe('Profile saved successfully.');

  // ALSO FLAKY: Line 6 — asserting toast disappears might race
  // if the auto-dismiss timer hasn't started yet.
  await expect(toast).not.toBeVisible();
});`,
      hints: [
        'Look for assertions that do NOT use await expect(locator) — those don\'t auto-retry',
        'The pattern expect(await locator.textContent()) only checks ONCE, right now',
        'If an element appears with a delay, a non-retrying assertion may check before it exists',
        'Playwright\'s auto-retrying assertions (toHaveText, toBeVisible) wait and retry automatically',
      ],
    },
    {
      difficulty: 'intermediate',
      title: 'Fix the Flaky Toast Test',
      description:
        'The starter code has a test that sometimes fails because it asserts toast content after the auto-dismiss timer fires. Fix it to be deterministic by properly waiting for the toast to appear before asserting.',
      narration:
        "You have two timing problems to solve: the toast content arrives after a 200ms async delay, and the toast auto-dismisses after 5 seconds — so a slow CI run can miss both windows. Start by replacing the non-retrying `expect(await toast.textContent())` call with `await expect(toast).toBeVisible({ timeout: 3000 })`, which tells Playwright to keep checking until the element is actually in the DOM. Once you've confirmed the element is present, chain `await expect(toast).toHaveText(...)` to verify the content — `toHaveText` auto-retries internally, so it handles the 200ms content delay without any extra waiting on your part. Notice that splitting visibility and text into two assertions also gives you clearer failure messages: if the first line fails, the toast never appeared; if the second fails, it appeared but with wrong content.",
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
  const toast = page.getByTestId('toast-message-0');

  // Wait for toast to be visible first (handles the 200ms content delay)
  await expect(toast).toBeVisible({ timeout: 3000 });

  // Then assert content with auto-retry (handles async content update)
  await expect(toast).toHaveText('Profile saved successfully.');
});`,
      hints: [
        'The root cause is using non-retrying expect() instead of auto-retrying await expect()',
        'await expect(locator).toBeVisible() waits until the element appears in the DOM',
        'await expect(locator).toHaveText() auto-retries until the text matches or times out',
      ],
    },
    {
      difficulty: 'advanced',
      title: 'Fix a Race Condition in Product Search',
      description:
        'This product search test has a subtle race condition. The test clicks search but asserts results before the DOM has updated. Fix ALL the flaky patterns.',
      narration:
        "There are three distinct bugs here, and you should fix them in order of 'establish a sync point first'. After clicking the search button, the DOM is still showing the old results — calling `.count()` immediately reads whatever is currently rendered, which may still be the unfiltered list. Your first move is to wait for `result-count` to change from its original value using `await expect(page.getByTestId('result-count')).not.toContainText(...)` — this gives you a reliable signal that the filter has completed before you measure anything. Once that sync point exists, replace the raw `textContent()` call on the first card with `await expect(...).toContainText('Laptop')` so Playwright can retry if the card text hasn't updated yet. Finally, delete `waitForTimeout(1000)` entirely — it's there as a band-aid over the missing sync point, and once you have real assertions in place you don't need it.",
      starterCode: `import { test, expect } from '@playwright/test';

test('search and verify results', async ({ page }) => {
  await page.goto('/products');

  // Get initial count
  const initialCount = await page.getByTestId('result-card').count();

  // Search for a specific product
  await page.getByTestId('search-input').fill('Laptop');
  await page.getByTestId('search-button').click();

  // BUG 1: This might still see the old count — DOM hasn't updated yet
  const newCount = await page.getByTestId('result-card').count();
  expect(newCount).toBeLessThan(initialCount);

  // BUG 2: Checking text content without waiting for re-render
  const firstName = await page.getByTestId('result-card').first()
    .getByTestId('product-name').textContent();
  expect(firstName).toContain('Laptop');

  // BUG 3: Hardcoded wait as a "fix" — brittle and slow
  await page.waitForTimeout(1000);
  await expect(page.getByTestId('result-count')).toBeVisible();
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('search and verify results', async ({ page }) => {
  await page.goto('/products');

  // Get initial count
  const initialCount = await page.getByTestId('result-card').count();

  // Search for a specific product
  await page.getByTestId('search-input').fill('Laptop');
  await page.getByTestId('search-button').click();

  // FIX 1: Wait for the result count to update (proves DOM re-rendered)
  await expect(page.getByTestId('result-count')).not.toContainText(
    \`\${initialCount} product\`
  );

  // FIX 2: Use auto-retrying assertion for text content
  await expect(
    page.getByTestId('result-card').first().getByTestId('product-name')
  ).toContainText('Laptop');

  // FIX 3: Remove waitForTimeout — use meaningful assertions instead
  const filteredCount = await page.getByTestId('result-card').count();
  expect(filteredCount).toBeLessThan(initialCount);
  expect(filteredCount).toBeGreaterThan(0);
});`,
      hints: [
        'After clicking search, wait for a visible change before asserting counts',
        'Use await expect(locator).toContainText() instead of reading textContent() directly',
        'Never use waitForTimeout() — replace with a meaningful await expect() assertion',
        'Wait for the result-count element to change as a signal that filtering completed',
      ],
    },
  ],
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
