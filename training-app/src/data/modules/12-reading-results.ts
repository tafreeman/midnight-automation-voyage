import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 10,
  title: 'Reading Test Results',
  subtitle: 'Interpret failures, distinguish bugs from bad tests, and use the trace viewer',
  icon: '📊',
  sections: [
    {
      heading: 'The HTML Report',
      content: `After a test run, Playwright generates an HTML report. Open it with:

\`npx playwright show-report\`

Green rows mean the test passed. Red rows mean it failed. Click into any failed test to see the full detail: the error message, a screenshot at the moment of failure, and a trace file you can inspect step by step.

The report groups tests by file and shows timing for each one. Slow tests stand out immediately. If a test that usually takes 2 seconds suddenly takes 30, something changed — either in the app or in the test.

Read the report top-down. Start with the summary: how many passed, how many failed. Then dig into each failure individually. Each one needs a verdict: real bug, broken test, or environment issue.`,
      code: `# Run tests and open the report
npx playwright test
npx playwright show-report

# Run a single test file and open its report
npx playwright test tests/products.spec.ts
npx playwright show-report`,
      codeLanguage: 'bash',
      tip: 'Add --reporter=html to your playwright.config.ts so the report generates automatically after every run. You won\'t have to remember the flag.',
    },
    {
      heading: 'Reading Error Messages',
      content: `Playwright error messages follow predictable patterns. Once you recognize the pattern, you can diagnose most failures in under a minute. Here are the four most common errors and what to do about each one.`,
      table: {
        headers: ['Error Pattern', 'What It Means', 'Most Likely Cause', 'How to Fix'],
        rows: [
          [
            'expect(locator).toBeVisible — Timeout 30000ms exceeded',
            'Playwright waited for the element but it never appeared on the page.',
            'The selector doesn\'t match any element. Either the test ID is wrong, the page didn\'t navigate correctly, or the element renders conditionally.',
            'Check the selector against the actual page. Open the app manually and inspect the element. Verify the test ID exists in the DOM.',
          ],
          [
            'strict mode violation: locator resolved to N elements',
            'The selector matched more than one element. Playwright doesn\'t know which one you meant.',
            'The locator is too broad. For example, getByRole(\'button\') on a page with multiple buttons.',
            'Make the locator more specific. Add a name filter: getByRole(\'button\', { name: \'Submit\' }). Or use getByTestId with a unique ID.',
          ],
          [
            'net::ERR_CONNECTION_REFUSED at http://localhost:5173',
            'Playwright tried to reach the app but nothing was listening on that port.',
            'The dev server isn\'t running. Either it wasn\'t started, crashed, or is on a different port.',
            'Start the dev server before running tests. Check that the port in playwright.config.ts matches the server\'s actual port.',
          ],
          [
            'expect(locator).toHaveText — Expected "Welcome" / Received "Welcome, Jane"',
            'The element exists but its text doesn\'t match what the test expected.',
            'The expected value in the test is wrong, or the app\'s output changed. It could also mean a real bug if the text is supposed to say "Welcome" but the app shows something different.',
            'Decide: is the test expectation outdated, or is the app output wrong? Update whichever one is incorrect. Use toContainText if partial matching is acceptable.',
          ],
        ],
      },
      callout: 'The error message almost always tells you the type of problem. Read it carefully before changing code. "Timeout" means the element wasn\'t found. "Strict mode" means too many matches. "Connection refused" means no server. "Expected/Received" means wrong value.',
    },
    {
      heading: 'Bug or Bad Test?',
      content: `When a test fails, there are three possible explanations:

**1. Real defect** — The app is broken. The test caught an actual bug. This is the test doing its job.

**2. Fragile test** — The app works fine, but the test is poorly written. A selector broke, an assertion is too strict, or there's a timing issue.

**3. Environment issue** — The app and test are both fine, but the test environment has a problem. Server not running, database not seeded, wrong config.

Use this three-step diagnostic to figure out which one:

**Step 1: Check the screenshot.** Playwright captures a screenshot at the moment of failure. Look at it. Does the page look right? Is the element you expected actually there? If the screenshot shows an error page or a blank screen, that's a clue.

**Step 2: Run it again.** Does it fail every time, or only sometimes? Deterministic failures point to real bugs or broken selectors. Intermittent failures point to timing issues or race conditions.

**Step 3: Do it manually.** Open the app in a browser and walk through the same steps. If the manual flow works, the test is wrong. If the manual flow fails the same way, you found a bug.

This diagnostic judgment — deciding what a failure means — is a core skill. Tools can run tests. Interpreting what the results mean requires understanding the product.`,
      warning: 'Don\'t assume a failing test found a bug. And don\'t assume it didn\'t. Diagnose first, then decide. Rushing to "fix the test" when the app is actually broken means a real bug ships to users.',
    },
    {
      heading: 'The Trace Viewer',
      content: `When the error message and screenshot aren't enough, open the trace. It's a time-travel debugger that records every action, network request, and DOM snapshot during the test run.

Open it from the HTML report by clicking the trace icon next to a failed test, or run it directly:

\`npx playwright show-trace trace.zip\`

The trace shows a timeline of every step the test took. Click any step to see:
- **The DOM snapshot** — what the page looked like at that exact moment
- **The action** — what Playwright tried to do (click, fill, assert)
- **Network requests** — what API calls were in flight
- **Console logs** — any errors the app logged

When you're stuck on why a test fails, the trace almost always has the answer. It shows you the state of the page at the exact moment things went wrong — not what you imagine happened, but what actually happened.`,
      code: `// Enable tracing in playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Capture trace on first retry of a failed test
    trace: 'on-first-retry',

    // Capture screenshot on failure
    screenshot: 'only-on-failure',
  },
});`,
      codeLanguage: 'typescript',
      tip: 'Set trace to \'on-first-retry\' in your config. This captures traces for failures without slowing down passing tests. When a test fails, it retries once with full tracing enabled.',
    },
  ],
  quiz: {
    question: 'A test fails with "expect(locator).toBeVisible — Timeout 30000ms exceeded". What\'s the most likely cause?',
    options: [
      'The test is running too slowly and needs a longer timeout',
      'The element selector doesn\'t match anything on the page',
      'The dev server crashed during the test run',
      'Playwright has a bug in its toBeVisible implementation',
    ],
    correctIndex: 1,
    explanation: 'A toBeVisible timeout means Playwright waited for the element to appear but it never did. The most common reason is that the selector — the test ID, role, or CSS used to find the element — doesn\'t match any element in the DOM. Check the selector against the actual page first.',
    additionalQuestions: [
      {
        question: 'A test passes locally but fails in CI. What should you check first?',
        options: [
          'Whether the test framework version is different in CI',
          'Whether the dev server is running and accessible in the CI environment',
          'Whether the CI machine has a faster processor',
          'Whether Playwright supports the CI operating system',
        ],
        correctIndex: 1,
        explanation: 'The most common cause of "works locally, fails in CI" is the dev server not running in the CI environment. A "connection refused" error in the CI logs confirms this. Make sure your CI pipeline starts the server before running tests.',
      },
      {
        question: 'A test fails intermittently — sometimes green, sometimes red. What does this pattern suggest?',
        options: [
          'A real bug that only appears under certain conditions',
          'A timing issue or race condition in the test',
          'A syntax error in the test code',
          'An outdated version of Playwright',
        ],
        correctIndex: 1,
        explanation: 'Intermittent failures (sometimes passing, sometimes failing) almost always indicate a timing issue. The test expects something to be ready before it actually is. The fix is usually to replace a fragile wait or assertion with a more resilient one that retries automatically.',
      },
    ],
  },
  exercises: [
    {
      title: 'Read the Error Message',
      description: 'Read the Playwright error message below and identify the root cause using the error pattern table. Write a comment explaining the problem and what you\'d do to fix it.',
      starterCode: `// This test failed with the following error:
//
// Error: expect(locator).toBeVisible
//   Locator: getByTestId('search-results')
//   Timeout: 30000ms exceeded
//   Call log:
//     - waiting for getByTestId('search-results')
//
// What is the root cause?
// TODO: Write your diagnosis as a comment below.

import { test, expect } from '@playwright/test';

test('searches for products and shows results', async ({ page }) => {
  await page.goto('/products');
  await page.getByTestId('search-input').fill('laptop');
  await page.getByTestId('search-button').click();

  // This line fails:
  await expect(page.getByTestId('search-results')).toBeVisible();
});

// Diagnosis:
// Root cause:
// Fix:`,
      solutionCode: `// Diagnosis:
// The error is a toBeVisible timeout. Playwright waited 30 seconds
// for an element with data-testid="search-results" but it never appeared.
//
// Root cause:
// The test ID 'search-results' doesn't match any element on the page.
// Looking at the practice app reference, the correct test ID for
// search results is 'result-count' (for the count) or 'result-card'
// (for individual result items).
//
// Fix:
// Replace getByTestId('search-results') with the correct test ID.

import { test, expect } from '@playwright/test';

test('searches for products and shows results', async ({ page }) => {
  await page.goto('/products');
  await page.getByTestId('search-input').fill('laptop');
  await page.getByTestId('search-button').click();

  // Fixed: use the correct test ID
  await expect(page.getByTestId('result-count')).toBeVisible();
});`,
      hints: [
        'The error says "waiting for getByTestId(\'search-results\')" — but does that test ID exist in the practice app?',
        'Check the practice app reference table. The products page uses result-count and result-card, not search-results.',
      ],
      difficulty: 'beginner',
    },
    {
      title: 'Diagnose the Failure',
      description: 'This test fails with the error shown in the comment. Diagnose whether it\'s a real bug, a selector problem, or an environment issue. Then fix the test.',
      starterCode: `// Error output:
// Error: expect(locator).toHaveText
//   Locator: getByTestId('dashboard-heading')
//   Expected: "Welcome to Your Dashboard"
//   Received: "Dashboard"
//
// Diagnose: Is this a real bug, a selector problem, or an environment issue?
// Then fix the test.

import { test, expect } from '@playwright/test';

test('logs in and sees welcome message', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('dashboard-heading')).toHaveText(
    'Welcome to Your Dashboard'
  );
});

// Diagnosis:
// Category (real bug / selector problem / environment issue):
// Fix:`,
      solutionCode: `// Diagnosis:
// This is NOT a real bug and NOT an environment issue.
// The selector (dashboard-heading) found the element correctly.
// The problem is the assertion: the test expects "Welcome to Your Dashboard"
// but the actual text is "Dashboard".
//
// Category: Selector/assertion problem — the expected value is wrong.
//
// Fix: Update the expected text to match the actual application output,
// or use toContainText for a partial match.

import { test, expect } from '@playwright/test';

test('logs in and sees dashboard heading', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  // Fixed: use toContainText for a partial match, or update the expected text
  await expect(page.getByTestId('dashboard-heading')).toContainText('Dashboard');
});`,
      hints: [
        'The error says Expected vs Received — the element was found, but the text didn\'t match.',
        'The selector is correct (dashboard-heading exists). The assertion expectation is wrong.',
        'Decide: is the app wrong, or is the expected value wrong? The app shows "Dashboard" — if that\'s correct behavior, update the test.',
      ],
      difficulty: 'intermediate',
    },
    {
      title: 'Fix an Intermittent Failure',
      description: 'This test fails about 30% of the time. The trace notes below show a timing race: the test asserts result count before the search API response arrives. Identify the root cause and write a fix that eliminates the race condition.',
      starterCode: `// Trace notes (from playwright show-trace):
// - 0ms: page.goto('/products') — page loaded
// - 150ms: fill search-input with 'monitor'
// - 200ms: click search-button
// - 210ms: assert result-count toContainText('3 results')
//          FAILED — element text was "0 results"
// - 450ms: network response: GET /api/products?q=monitor (200 OK, 3 items)
// - 460ms: DOM updated — result-count now shows "3 results"
//
// The assertion runs at 210ms but the API responds at 450ms.
// The test checks before the data arrives.

import { test, expect } from '@playwright/test';

test('searches products and shows result count', async ({ page }) => {
  await page.goto('/products');
  await page.getByTestId('search-input').fill('monitor');
  await page.getByTestId('search-button').click();

  // This fails ~30% of the time
  await expect(page.getByTestId('result-count')).toContainText('3 results');
});

// Root cause:
// Fix:`,
      solutionCode: `// Root cause:
// The test asserts the result count immediately after clicking search,
// but the search triggers an API call that takes ~250ms to respond.
// Sometimes Playwright's auto-retry catches the update in time;
// sometimes it checks too early and sees "0 results."
//
// Fix:
// Wait for the search API response to complete before asserting.
// Use page.waitForResponse to wait for the API call, then assert.

import { test, expect } from '@playwright/test';

test('searches products and shows result count', async ({ page }) => {
  await page.goto('/products');
  await page.getByTestId('search-input').fill('monitor');

  // Wait for the search API response before asserting
  const searchResponse = page.waitForResponse(
    (response) => response.url().includes('/api/products') && response.status() === 200
  );
  await page.getByTestId('search-button').click();
  await searchResponse;

  // Now the data has arrived — assertion is reliable
  await expect(page.getByTestId('result-count')).toContainText('3 results');
});`,
      hints: [
        'The trace shows the assertion runs at 210ms but the API responds at 450ms. The test checks before the data arrives.',
        'Use page.waitForResponse() to wait for the API call to complete before asserting.',
        'Set up the waitForResponse promise BEFORE clicking the button, then await it after the click.',
      ],
      difficulty: 'advanced',
    },
  ],
  practiceLink: {
    url: 'http://localhost:5173/products',
    label: 'Products Page',
    description: 'Run tests against the products page to practice reading error messages and diagnosing failures. Try intentionally breaking selectors to see the error patterns.',
  },
  narrationScript: {
    intro: 'Your test just ran. Red X. Now what? The difference between staring at a failure and fixing it in two minutes is knowing how to read what Playwright tells you.',
    steps: [
      {
        text: 'Open the products page. We\'ll use this page to walk through common error patterns and how to diagnose them.',
        navigateTo: '/products',
        duration: 15,
      },
      {
        text: 'The HTML report is your first stop after a test run. Green rows passed, red rows failed. Click into any failure to see the error message, screenshot, and trace.',
        duration: 20,
      },
      {
        text: 'Error pattern one: toBeVisible timeout. This means Playwright waited for an element but it never appeared. The most common cause is a wrong selector. Check the test ID against the actual page.',
        highlight: 'search-input',
        duration: 30,
      },
      {
        text: 'Error pattern two: strict mode violation. The locator matched multiple elements. Make it more specific — add a name filter or use a unique test ID.',
        duration: 25,
      },
      {
        text: 'Error pattern three: connection refused. The dev server isn\'t running. Start it before running tests.',
        duration: 15,
      },
      {
        text: 'Error pattern four: expected vs received text mismatch. The element exists but shows different text than the test expected. Decide: is the app wrong, or is the test wrong?',
        highlight: 'result-count',
        duration: 25,
      },
      {
        text: 'Three-step diagnostic: First, check the failure screenshot — does the page look right? Second, run the test again — is the failure deterministic or intermittent? Third, try the flow manually — if it works by hand, the test is wrong.',
        duration: 35,
      },
      {
        text: 'When the error message and screenshot aren\'t enough, open the trace viewer. It records every action, network request, and DOM snapshot. Click any step to see exactly what the page looked like at that moment.',
        duration: 30,
      },
      {
        text: 'Intermittent failures — passing sometimes, failing sometimes — almost always point to timing issues. The test checks for something before it\'s ready. Use waitForResponse or more specific assertions to eliminate the race.',
        highlight: 'search-button',
        duration: 30,
      },
    ],
    outro: 'Tools run tests. You interpret the results. Knowing the error patterns, applying the three-step diagnostic, and using the trace viewer when you\'re stuck — that\'s what turns a red X into either a bug report or a better test.',
  },
};
