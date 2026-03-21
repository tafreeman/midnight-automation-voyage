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
  }
};
