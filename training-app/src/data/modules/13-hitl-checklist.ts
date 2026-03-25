import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 11,
  title: 'The Review Checklist and Next Steps',
  subtitle: 'A 10-point quality gate for AI-generated test code and your first-week roadmap',
  icon: '✅',
  sections: [
    {
      heading: 'Why a Checklist?',
      content: `AI-generated code compiles. It runs. It often passes. But passing and correct are not the same thing.

A test can pass with zero assertions — it exercises a flow and verifies nothing. A test can pass with a hallucinated selector that happens to match an unrelated element. A test can pass with hardcoded data that works today and breaks tomorrow.

This checklist is the quality gate between "Copilot wrote it" and "I'd stake my name on it." Apply it to every test before you commit. It takes two minutes and catches the problems that syntax checkers miss.

The checklist isn't about distrusting AI. It's about applying the same standard you'd apply to any code that goes into production — whether a person wrote it, a tool generated it, or something in between.`,
    },
    {
      heading: 'The 10-Point Review Checklist',
      content: `Run through these ten items for every AI-generated test before you approve it. Each one catches a specific category of problem.`,
      table: {
        headers: ['#', 'Check', 'Why'],
        rows: [
          ['1', 'Maps to acceptance criteria', 'A test that doesn\'t trace back to a requirement verifies nothing useful. If you can\'t point to the ticket or story it covers, it shouldn\'t exist.'],
          ['2', 'Has meaningful assertions (expect statements)', 'A test without assertions is a script, not a test. It will pass even when the feature is broken.'],
          ['3', 'Uses stable selectors (getByRole, getByTestId)', 'CSS selectors and XPath break when the UI is refactored. Stable selectors survive redesigns.'],
          ['4', 'No hardcoded waits (waitForTimeout)', 'Hardcoded waits slow tests down and still fail on slow machines. Playwright\'s auto-waiting is more reliable.'],
          ['5', 'Uses realistic but not real data', 'Test data should look real (proper email format, valid phone numbers) but never contain actual user data or credentials.'],
          ['6', 'Covers edge cases from the ticket', 'The happy path isn\'t enough. If the ticket mentions error states, empty fields, or boundary conditions, the test should cover them.'],
          ['7', 'Tests are independent (no shared state)', 'Each test should set up its own state and clean up after itself. Tests that depend on execution order break in parallel runs.'],
          ['8', 'Has a descriptive test name', 'The name should describe the scenario, not the implementation. "submits contact form with valid data" beats "test contact".'],
          ['9', 'No hardcoded URLs (uses baseURL)', 'Hardcoded URLs like http://localhost:5173 break in CI, staging, and production environments. Use relative paths with baseURL.'],
          ['10', 'No sensitive data (passwords, tokens, PII)', 'Test files are committed to version control. Real credentials in test code are a security incident waiting to happen.'],
        ],
      },
      tip: 'Print this checklist and keep it next to your monitor for the first two weeks. After that, it becomes automatic.',
    },
    {
      heading: 'Copilot Red Flags',
      content: `Copilot produces correct code most of the time. But it has patterns that should trigger extra scrutiny:

**Hallucinated selectors** — Copilot sometimes generates a \`data-testid\` that sounds right but doesn't exist in the app. If you see \`getByTestId('submit-form-btn')\` but the actual element uses \`submit-button\`, the test will fail with a timeout. Always verify selectors against the real page.

**Assertion-free tests** — Copilot tends to generate action-heavy code (fill this, click that) without adding assertions. If a generated test has zero \`expect()\` calls, it's incomplete. Add assertions that match the acceptance criteria.

**Over-commented code** — Copilot sometimes adds comments on every line: \`// Click the button\` above \`button.click()\`. Comments should explain why, not what. Strip the obvious ones.

**Hardcoded URLs and realistic-looking test data** — Copilot may use \`http://localhost:3000\` or generate email addresses that look like they belong to real people. Replace URLs with relative paths. Replace data with clearly fake values like \`jane.doe@example.com\`.`,
      code: `// 🚩 Red flag: hallucinated selector
await page.getByTestId('submit-form-btn'); // Does this exist? Check the app.

// 🚩 Red flag: no assertions
test('checkout flow', async ({ page }) => {
  await page.goto('/checkout/shipping');
  await page.getByTestId('address-input').fill('123 Main St');
  await page.getByRole('button', { name: 'Continue' }).click();
  // Where's the expect()? This test verifies nothing.
});

// 🚩 Red flag: hardcoded URL
await page.goto('http://localhost:5173/settings');
// Should be: await page.goto('/settings');

// 🚩 Red flag: over-commenting
// Navigate to the login page
await page.goto('/login');
// Fill in the email field with the test email
await page.getByTestId('email-input').fill('user@test.com');
// These comments add noise without value.`,
      codeLanguage: 'typescript',
      warning: 'Hallucinated selectors are the most dangerous red flag because the test fails with a generic timeout error, not a clear "this selector doesn\'t exist" message. Verify every selector against the running app.',
    },
    {
      heading: 'Your Daily Workflow',
      content: `Five steps, five minutes per test. This is the workflow that turns a ticket into a committed test:

**1. Read the ticket.** Identify the acceptance criteria. These define what to assert.

**2. Record the flow.** Use Playwright codegen to capture the user journey. Focus on capturing the steps — refinement comes next.

**3. Refine with Copilot.** Select the recorded code, open Copilot Chat, use the five-point refinement prompt (selectors, assertions, name, waits, URLs).

**4. Add assertions.** Check Copilot's suggestions against the acceptance criteria. Add any missing assertions. Remove any that don't map to requirements.

**5. Run and commit.** Execute the test. If it passes, run the checklist. If it passes the checklist, commit.

**When to pause:** If a test fails and you can't diagnose it in five minutes, pause. Open the trace viewer. If the trace doesn't help, ask a teammate. Don't spend an hour on something another person can answer in two minutes.

**Common gotchas:** Forgetting to start the dev server. Using the wrong port. Asserting text that includes whitespace or dynamic values. Testing a flow that requires login without setting up auth first.`,
      callout: 'The five-minute target is for writing the test, not debugging it. Debugging can take longer. But the act of recording, refining, and committing should become fast and repeatable.',
    },
    {
      heading: 'Your First Week',
      content: `Here's a day-by-day plan for your first week writing Playwright tests. Each day builds on the previous one.

**Monday — Run the examples.** Clone the repo, install dependencies, run the existing test suite. Read the HTML report. Open a trace. Get familiar with the tools before writing anything.

**Tuesday — Record three flows.** Pick three simple pages in the practice app (login, products search, contact form). Record each one with codegen. Don't refine yet — just capture the raw flows.

**Wednesday — Refine with prompts.** Take your three raw recordings and refine each one with Copilot Chat. Apply the five-point template. Compare the before and after.

**Thursday — Add assertions and submit.** Add assertions to each test based on what the page should do. Run them. Apply the 10-point checklist. Submit a merge request with all three tests.

**Friday — Review someone else's test.** Read a test written by a teammate. Apply the checklist. Leave feedback on selectors, assertions, and naming. This is where the checklist becomes second nature.

**Vocabulary reference:** test spec (the file), test suite (a group of specs), locator (how you find an element), assertion (what you verify), fixture (shared setup code), trace (step-by-step recording of a test run).`,
      tip: 'After your first week, aim for one new test per day. Quality matters more than quantity. One solid test that catches real bugs is worth ten that exercise flows without verifying anything.',
    },
    {
      heading: 'What Makes Automation Valuable',
      content: `Writing test code is a technical skill you've been building throughout this course. But the highest-leverage skills aren't about code — they're about judgment.

**Deciding what matters.** Not every flow needs a test. Picking the right scenarios to automate — the ones that catch real bugs, protect critical paths, and save the most manual effort — is a skill that comes from understanding the product.

**Designing scenarios.** A test that covers the happy path is useful. A test that also covers the error state, the empty state, and the boundary condition is valuable. Scenario design comes from testing experience.

**Recognizing when something's off.** A test passes, but the screenshot looks wrong. The data is there, but the order changed. The feature works, but the response is slower than it should be. Noticing these things requires product knowledge that no tool has.

**Understanding system interactions.** The checkout flow touches the cart, inventory, payment, and order systems. Knowing how these connect — and what to check when one changes — comes from understanding architecture, not just writing selectors.

**Triaging failures.** Is it a bug, a flaky test, or a deployment issue? Making this call quickly and correctly saves the whole team time. This judgment improves with every failure you diagnose.

Course 2 builds on this foundation with patterns that help automation scale: page objects for organizing locators, API testing for faster feedback, auth fixtures for handling login once, and CI integration for running tests on every commit.`,
    },
  ],
  quiz: {
    question: 'A Copilot-generated test passes but has no expect() assertions. What should you do?',
    options: [
      'Ship it — if it passes, it works',
      'Add a comment explaining that assertions aren\'t needed for this flow',
      'Add assertions that verify the acceptance criteria before approving',
      'Delete the test and rewrite it from scratch without Copilot',
    ],
    correctIndex: 2,
    explanation: 'A test without assertions passes regardless of whether the feature works. It exercises a flow but verifies nothing. Add expect() statements that check the outcomes described in the acceptance criteria. This is checklist item #2.',
    additionalQuestions: [
      {
        question: 'Why should tests be independent of each other (no shared state)?',
        options: [
          'Shared state makes test files larger',
          'Independent tests can run in parallel and in any order without affecting each other',
          'Playwright doesn\'t support shared state between tests',
          'Independent tests run faster than tests with shared state',
        ],
        correctIndex: 1,
        explanation: 'Tests that share state depend on execution order. If Test A creates data that Test B expects, running Test B alone — or running them in parallel — breaks Test B. Independent tests set up their own state and work regardless of what runs before or after them.',
      },
      {
        question: 'A Copilot-generated test uses getByTestId(\'checkout-submit-btn\'), but you can\'t find that test ID in the app. What happened?',
        options: [
          'The test ID was recently renamed and Copilot used the old name',
          'Copilot hallucinated a selector that doesn\'t exist in the app',
          'The test ID only appears after a specific user action',
          'Playwright doesn\'t support that test ID format',
        ],
        correctIndex: 1,
        explanation: 'Copilot sometimes generates selectors that sound correct but don\'t exist in the actual app. This is a hallucinated selector — Copilot\'s most dangerous red flag. Always verify selectors against the running application before committing.',
      },
    ],
  },
  exercises: [
    {
      title: 'Spot the Checklist Violations',
      description: 'This AI-generated test has five violations of the 10-point review checklist. Read the test carefully and identify each violation by its checklist number. Write your findings as comments.',
      starterCode: `import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/checkout/shipping');
  await page.locator('input.shipping-address').fill('742 Evergreen Terrace');
  await page.locator('input.shipping-city').fill('Springfield');
  await page.locator('input.shipping-zip').fill('62704');
  await page.waitForTimeout(2000);
  await page.locator('button.continue-btn').click();
  await page.waitForTimeout(3000);
});

// TODO: Identify 5 checklist violations by number.
// Violation 1 (#?):
// Violation 2 (#?):
// Violation 3 (#?):
// Violation 4 (#?):
// Violation 5 (#?):`,
      solutionCode: `import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/checkout/shipping');
  await page.locator('input.shipping-address').fill('742 Evergreen Terrace');
  await page.locator('input.shipping-city').fill('Springfield');
  await page.locator('input.shipping-zip').fill('62704');
  await page.waitForTimeout(2000);
  await page.locator('button.continue-btn').click();
  await page.waitForTimeout(3000);
});

// Violation 1 (#2): No assertions — zero expect() statements.
//   The test clicks through the shipping form but never verifies
//   that anything happened correctly.
//
// Violation 2 (#3): Uses CSS selectors (input.shipping-address,
//   button.continue-btn) instead of stable locators like getByTestId.
//
// Violation 3 (#4): Two hardcoded waits — waitForTimeout(2000) and
//   waitForTimeout(3000). Playwright's auto-waiting makes these
//   unnecessary.
//
// Violation 4 (#8): Generic test name — 'test' tells you nothing
//   about what this test covers. Should describe the scenario.
//
// Violation 5 (#9): Hardcoded URL — http://localhost:5173 should
//   be replaced with a relative path /checkout/shipping using baseURL.`,
      hints: [
        'Look for missing expect() statements — does this test verify anything?',
        'Check the selectors — are they using CSS classes or stable locator methods?',
        'Look for waitForTimeout calls — are there hardcoded waits?',
        'Read the test name — does it describe a scenario or is it generic?',
        'Check the URL — is it hardcoded or relative?',
      ],
      difficulty: 'beginner',
    },
    {
      title: 'Fix All Five Violations',
      description: 'Take the test from the previous exercise and fix all five checklist violations. Replace CSS selectors with getByTestId, add assertions for navigation to the payment step, give it a descriptive name, remove waits, and use a relative URL.',
      starterCode: `import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/checkout/shipping');
  await page.locator('input.shipping-address').fill('742 Evergreen Terrace');
  await page.locator('input.shipping-city').fill('Springfield');
  await page.locator('input.shipping-zip').fill('62704');
  await page.waitForTimeout(2000);
  await page.locator('button.continue-btn').click();
  await page.waitForTimeout(3000);
});

// TODO: Fix all 5 violations:
// 1. Add assertions
// 2. Replace CSS selectors with getByTestId
// 3. Remove hardcoded waits
// 4. Give the test a descriptive name
// 5. Use a relative URL`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('completes shipping step and advances to payment', async ({ page }) => {
  // Arrange — navigate to the shipping step
  await page.goto('/checkout/shipping');

  // Act — fill shipping details and continue
  await page.getByTestId('address-input').fill('742 Evergreen Terrace');
  await page.getByTestId('address-input').fill('Springfield');
  await page.getByTestId('address-input').fill('62704');
  await page.getByRole('button', { name: 'Continue' }).click();

  // Assert — verify we advanced to the payment step
  await expect(page.getByTestId('step-indicator')).toContainText('Payment');
  await expect(page.getByTestId('card-input')).toBeVisible();
});`,
      hints: [
        'Import expect from @playwright/test to use assertions.',
        'The checkout page uses test IDs: address-input, step-indicator, card-input.',
        'Remove both waitForTimeout calls — Playwright handles timing automatically.',
        'Name the test after what it verifies: completing shipping and advancing to payment.',
      ],
      difficulty: 'intermediate',
    },
    {
      title: 'Write and Self-Review an Admin Test',
      description: 'Write a test for the admin invite flow from scratch. Fill the invite form with a new user\'s email and role, submit it, and verify the user appears in the admin user table. Then self-review against the 10-point checklist and fix any violations you find in your own code.',
      starterCode: `import { test, expect } from '@playwright/test';

// TODO: Write a test for the admin invite flow:
// 1. Navigate to /admin
// 2. Fill the invite form with email and role
// 3. Submit the invitation
// 4. Verify the invited user appears in the user table
//
// After writing, self-review against the 10-point checklist.
// Fix any violations before submitting.
//
// Admin page test IDs:
//   admin-invite-form, admin-search-input,
//   admin-user-table, admin-bulk-action

test('TODO: descriptive test name', async ({ page }) => {
  // Your test code here
});

// Self-review notes:
// #1 Maps to acceptance criteria?
// #2 Has assertions?
// #3 Stable selectors?
// #4 No hardcoded waits?
// #5 Realistic data?
// #6 Edge cases?
// #7 Independent?
// #8 Descriptive name?
// #9 No hardcoded URLs?
// #10 No sensitive data?`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('invites a new user via admin form and verifies they appear in the user table', async ({ page }) => {
  // Arrange — navigate to the admin page
  await page.goto('/admin');

  // Act — fill and submit the invite form
  await page.getByTestId('admin-invite-form').getByRole('textbox', { name: 'Email' }).fill('newuser@example.com');
  await page.getByTestId('admin-invite-form').getByRole('combobox', { name: 'Role' }).selectOption('editor');
  await page.getByTestId('admin-invite-form').getByRole('button', { name: 'Invite' }).click();

  // Assert — verify the invited user appears in the table
  await expect(page.getByTestId('admin-user-table')).toContainText('newuser@example.com');
  await expect(page.getByTestId('admin-user-table')).toContainText('editor');
});

// Self-review notes:
// #1 Maps to acceptance criteria? YES — tests the invite flow end to end.
// #2 Has assertions? YES — two expect() calls verify table content.
// #3 Stable selectors? YES — uses getByTestId and getByRole.
// #4 No hardcoded waits? YES — no waitForTimeout calls.
// #5 Realistic data? YES — newuser@example.com is clearly fake but realistic format.
// #6 Edge cases? PARTIAL — happy path only. Could add: duplicate invite, invalid email.
// #7 Independent? YES — no shared state with other tests.
// #8 Descriptive name? YES — describes the full scenario.
// #9 No hardcoded URLs? YES — uses relative path /admin.
// #10 No sensitive data? YES — no real credentials or PII.`,
      hints: [
        'Start by navigating to /admin with page.goto(\'/admin\').',
        'Use getByTestId(\'admin-invite-form\') to scope your locators to the invite form.',
        'After submitting, assert that the admin-user-table contains the invited email.',
        'Use example.com for fake email addresses — it\'s reserved for testing.',
        'After writing the test, walk through all 10 checklist items honestly.',
      ],
      difficulty: 'advanced',
    },
  ],
  practiceLink: {
    url: 'http://localhost:5173/checkout/shipping',
    label: 'Checkout Flow',
    description: 'Walk through the multi-step checkout flow to practice writing tests with the review checklist. Try the admin page at /admin for the advanced exercise.',
  },
  narrationScript: {
    intro: 'AI-generated code runs and passes. But passing and correct are not the same thing. This checklist is the quality gate that separates "it works" from "I trust it."',
    steps: [
      {
        text: 'Open the checkout flow. We\'ll use this multi-step process to walk through the review checklist with a real example.',
        navigateTo: '/checkout/shipping',
        duration: 15,
      },
      {
        text: 'Look at the shipping form. A Copilot-generated test might fill these fields and click continue — but does it verify that the payment step actually loads? Without assertions, a passing test means nothing.',
        highlight: 'address-input',
        duration: 25,
      },
      {
        text: 'Checklist item one: does the test map to acceptance criteria? If the ticket says "user completes shipping and sees payment form," the test must assert both of those outcomes.',
        duration: 25,
      },
      {
        text: 'Checklist items three and four: stable selectors and no hardcoded waits. Replace CSS classes with getByTestId. Delete every waitForTimeout call.',
        highlight: 'step-indicator',
        duration: 20,
      },
      {
        text: 'Watch for Copilot red flags. Hallucinated selectors that sound right but don\'t exist. Tests with zero assertions. Over-commented code. Hardcoded localhost URLs.',
        duration: 25,
      },
      {
        text: 'Now switch to the admin page. The advanced exercise asks you to write a test for the invite flow and self-review it against all ten checklist items.',
        navigateTo: '/admin',
        duration: 20,
      },
      {
        text: 'The invite form has test IDs: admin-invite-form for the form itself, admin-user-table for the results. Verify selectors exist in the app before trusting Copilot\'s suggestions.',
        highlight: 'admin-invite-form',
        duration: 25,
      },
      {
        text: 'Your daily workflow: read the ticket, record the flow, refine with Copilot, add assertions, run the checklist, commit. Five steps, five minutes per test.',
        duration: 20,
      },
      {
        text: 'Your first week: Monday run examples, Tuesday record three flows, Wednesday refine with prompts, Thursday add assertions and submit, Friday review a teammate\'s test.',
        duration: 30,
      },
      {
        text: 'The skills that make automation valuable aren\'t about code. They\'re about judgment — deciding what to test, designing good scenarios, recognizing when results look wrong, and triaging failures quickly.',
        duration: 30,
      },
    ],
    outro: 'You have the tools, the checklist, and the workflow. Course 2 adds patterns that make it scale — page objects, API testing, auth fixtures, and CI integration. But the foundation is here: record, refine, review, commit.',
  },
};
