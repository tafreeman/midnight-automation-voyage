import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 9,
  title: "Reading Test Results",
  subtitle: "Understanding what passed, what failed, and why",
  icon: "📊",
  audience: "All Roles — Non-Coder Essential",
  sections: [
    {
      heading: "The HTML Report",
      content: "After every test run, Playwright generates an HTML report. Open it with 'npx playwright show-report'. This shows every test: green for pass, red for fail, with screenshots and traces attached to failures.",
      code: `# Run tests and open report
npx playwright test
npx playwright show-report

# Report shows:
# ✅ 12 passed
# ❌ 2 failed
# ⏭ 1 skipped
# Click any failed test to see: screenshot, trace, error message`,
      codeLanguage: "bash",
    },
    {
      heading: "Reading Error Messages",
      content: "Playwright errors follow a consistent pattern. Learn to read them and you can diagnose 80% of failures without touching code.",
      table: {
        headers: ["Error Pattern", "Meaning", "Likely Cause"],
        rows: [
          ["locator.click: Target closed", "Page navigated away or closed", "Test is too fast, or URL changed"],
          ["expect(locator).toBeVisible — timeout", "Element never appeared on page", "Wrong selector, or page didn't load"],
          ["expect(received).toBe(expected)", "Value mismatch", "App returned different data than expected"],
          ["page.goto: net::ERR_CONNECTION_REFUSED", "App server not running", "Start dev server before running tests"],
          ["strict mode violation: locator matched 3 elements", "Selector is too broad", "Make selector more specific (add text filter)"],
        ]
      },
      tip: "Non-coders: You don't need to fix every error. Your job is to identify whether it's a test problem (wrong selector) or an app problem (feature is broken) and route it to the right person."
    },
    {
      heading: "The Trace Viewer",
      content: "Playwright's trace viewer is a time-travel debugger. It records every action, network request, and DOM snapshot. When a test fails, the trace shows you exactly what the app looked like at each step.",
      code: `# View trace from a failed test
npx playwright show-trace test-results/[test-folder]/trace.zip

# Trace viewer shows:
# Timeline: every action plotted on a timeline
# Snapshots: DOM state before/after each action
# Network: every API call with request/response
# Console: browser console logs and errors`,
      codeLanguage: "bash",
      callout: "The trace viewer is the single most powerful debugging tool. Before asking a developer for help with a failure, open the trace and screenshot the step where things go wrong."
    }
  ],
  quiz: {
    question: "A test fails with 'expect(locator).toBeVisible — timeout'. What's the most likely cause?",
    options: [
      "The test data is wrong",
      "The network is slow",
      "The element selector doesn't match anything on the page",
      "Playwright has a bug"
    ],
    correctIndex: 2,
    explanation: "A toBeVisible timeout means Playwright waited for an element to appear and it never did. The most likely cause is a wrong selector — the data-testid doesn't match the actual attribute in the HTML, or the element genuinely isn't rendered."
  },
  practiceLink: {
    url: "http://localhost:5173/orders",
    label: "Run reference tests and read the report",
    description: "Run the orders table tests, then use 'npx playwright show-report' to practice reading HTML report output.",
  },
  exercise: {
    title: "Diagnose a Failing Test from Its Error",
    description: "Read the Playwright error message below, identify the root cause, and write the corrected test code.",
    starterCode: `// FAILING TEST:
test('order status filter shows pending orders', async ({ page }) => {
  await page.goto('/orders');
  await page.locator('.filter-dropdown').selectOption('Pending');
  await expect(page.locator('.order-row')).toHaveCount(3);
});

// ERROR MESSAGE:
// Error: locator.selectOption: Error: strict mode violation
//   locator('.filter-dropdown') resolved to 2 elements
//
// ROOT CAUSE: [TODO - explain why this failed]
// FIX: [TODO - rewrite the test]`,
    solutionCode: `// FAILING TEST (FIXED):
test('order status filter shows pending orders', async ({ page }) => {
  await page.goto('/orders');
  // Use data-testid instead of CSS class to avoid strict mode violation
  await page.locator('[data-testid="status-filter"]').selectOption('Pending');
  await expect(page.locator('[data-testid="order-row"]')).toHaveCount(3);
});

// ROOT CAUSE: The CSS selector '.filter-dropdown' matched 2 elements
// on the page. Playwright's strict mode requires locators to resolve
// to exactly one element. This is a selector problem, not an app bug.
//
// FIX: Replace CSS class selectors with data-testid attributes that
// uniquely identify the intended element.`,
    hints: [
      "'strict mode violation' means the selector matched more than one element",
      "The fix is about making the selector more specific — not changing the app",
      "data-testid attributes are unique by convention, solving the ambiguity",
    ],
  },
  promptTemplates: [
    {
      label: "Explain Playwright Error",
      context: "Paste a Playwright error message and ask Copilot to diagnose the root cause.",
      prompt: "Explain this Playwright error and suggest a fix:\n\nError: locator.click: Error: strict mode violation\n  locator('button') resolved to 3 elements.\n\nWhat does this mean, why did it happen, and what are the best ways to fix it? Show me the corrected code.",
    },
    {
      label: "Debug Flaky Test",
      context: "When a test passes sometimes and fails other times, ask Copilot for diagnosis.",
      prompt: "This Playwright test is flaky — it passes locally but fails in CI about 30% of the time. The failure is always a timeout on this line: await expect(page.getByText('Order confirmed')).toBeVisible(). What are the most common causes of this type of flakiness, and how should I fix the test to be reliable?",
    },
    {
      label: "Interpret Test Report",
      context: "Help understand what a test report is telling you about your test suite health.",
      prompt: "I have a Playwright HTML report showing 45 passed, 3 failed, and 2 skipped tests. The failures are all in the checkout flow on the 'payment processing' step. What should I investigate first? How do I use the trace viewer to diagnose the failures? What patterns indicate a test problem vs. an app problem?",
    },
  ],
};
