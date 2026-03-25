import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 3,
  title: 'What to Automate + The CARD Formula',
  subtitle: 'Decide what deserves automation and structure prompts that produce useful tests.',
  icon: '🃏',
  sections: [
    {
      heading: 'The Automation Decision',
      content: `Every test on your backlog costs time to automate, maintain, and debug when it breaks. Automating everything sounds thorough — but it wastes effort on tests that deliver little value. Teams that hit 60–80% automation coverage consistently outperform teams chasing 100%, because they spend their remaining time on exploratory testing that catches the bugs automation misses.

Before you write a single test, run each candidate through a four-question filter:

1. **Does this run more than three times?** One-time setup verifications or migration checks aren't worth the maintenance cost.
2. **Can code verify the result?** If the pass/fail decision requires human judgment ("Does this layout look right?" or "Is this copy clear?"), automation can't help.
3. **Is the feature stable?** Automating a screen that changes every sprint means rewriting the test every sprint.
4. **Is the data programmable?** If the test depends on data you can create, reset, or seed through an API or fixture, it's automatable. If it requires manual intervention — calling a third party, waiting for an external event — it's not.

A "no" on any question means: keep it manual.`,
      table: {
        headers: ['Automate', 'Keep Manual'],
        rows: [
          ['Regression suites (login, checkout, CRUD)', 'Exploratory testing (finding unknown bugs)'],
          ['Smoke tests (critical path after deploy)', 'UX and usability evaluation'],
          ['Data-driven tests (same flow, many inputs)', 'One-time verifications or migrations'],
          ['Cross-browser checks (same test, 3 browsers)', 'Visual design judgment (spacing, aesthetics)'],
        ],
      },
      tip: 'Start with your smoke tests — the 5–10 flows that absolutely cannot break in production. Automate those first, then expand.',
    },
    {
      heading: 'The CARD Formula',
      content: `When you ask Copilot to generate a test, the quality of the output depends entirely on the quality of your prompt. Vague prompts produce vague tests. The CARD formula gives you a repeatable structure for writing prompts that produce tests worth keeping.

**C — Context:** What page or component are you testing? Name the URL, the framework, and the key elements on screen. This tells Copilot where the test starts.

**A — Actions:** What does the user do? List the steps in order — click, fill, select, navigate. Be specific: "fill the email field with user@test.com" beats "enter credentials."

**R — Rules:** What are the business requirements? These become your assertions. "Error message appears after invalid login" is a rule. "Form should work correctly" is not — it's too vague for Copilot to translate into a meaningful check.

**D — Data:** What test data do you need? Include valid inputs, invalid inputs, edge cases, and boundary values. Specify exact values when they matter.

CARD maps directly to acceptance criteria on your tickets. If you're writing a story with clear AC, you already have most of a CARD prompt.`,
      callout: 'Think of CARD as the translation layer between your testing knowledge and Copilot\'s code generation. You bring the judgment. CARD structures it into something Copilot can act on.',
    },
    {
      heading: 'CARD in Practice',
      content: `Here's CARD applied to the practice app's login page. Walk through each part and notice how specific the language is.

**Context:** The login page at /login is a React form with two fields: \`[data-testid="email-input"]\` and \`[data-testid="password-input"]\`, plus a submit button \`[data-testid="login-button"]\`. Error feedback appears in \`[data-testid="error-message"]\`.

**Actions:**
1. Navigate to /login
2. Fill email with an invalid password
3. Click Login
4. Observe error message
5. Clear fields, enter correct credentials
6. Click Login
7. Arrive at /dashboard

**Rules:**
- Invalid credentials display "Invalid email or password" in the error element
- After five consecutive failed attempts, the account locks and \`[data-testid="lockout-message"]\` appears
- Successful login redirects to /dashboard within 2 seconds

**Data:**
- Valid: user@test.com / Password123!
- Invalid: user@test.com / WrongPassword
- Edge: empty fields, email without @ symbol

Feed this to Copilot and you get a test that actually validates business logic — not just that the page didn't crash.`,
      code: `// Copilot prompt built from the CARD above:
// "Write a Playwright test for the login page at /login.
// Use data-testid selectors: email-input, password-input, login-button, error-message.
// Test: enter user@test.com with WrongPassword, click login, verify error-message
// shows 'Invalid email or password'. Then enter correct password Password123!,
// click login, verify redirect to /dashboard."

import { test, expect } from '@playwright/test';

test('login shows error for wrong password, then succeeds with correct credentials', async ({ page }) => {
  await page.goto('/login');

  // Attempt login with wrong password
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('WrongPassword');
  await page.getByTestId('login-button').click();

  // Rule: error message appears
  await expect(page.getByTestId('error-message')).toHaveText('Invalid email or password');

  // Correct credentials
  await page.getByTestId('email-input').clear();
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').clear();
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  // Rule: redirect to dashboard
  await expect(page).toHaveURL(/\\/dashboard/);
});`,
      codeLanguage: 'typescript',
      tip: 'Notice how every assertion in the generated test traces back to a Rule in the CARD. That traceability is the whole point.',
    },
    {
      heading: 'The Assertion Trap',
      content: `Copilot generates syntactically correct code. That's not the same as generating correct assertions. Here's the trap: if you ask Copilot "what should this test check?", it'll guess — and its guesses are based on code patterns, not your business requirements.

**Anti-pattern:**
"Copilot, write a test for the contact form and add appropriate assertions."

Copilot might assert that the form has five fields, that the submit button is visible, or that the page title matches. Those are all technically valid assertions that test almost nothing useful.

**Correct approach:**
Spell out the exact business rule in your prompt. "After submitting the contact form with valid data, verify that \`[data-testid="success-message"]\` contains 'Thank you for your message'."

The assertion trap is the single biggest source of false confidence in automated tests. A passing test with weak assertions proves the page loaded — not that the feature works. Every assertion in your test should answer: "If this fails, does it mean a real user would see a bug?"`,
      warning: 'A test with no assertions always passes. A test with vague assertions almost always passes. Both give you false confidence. Write assertions that would actually fail if the feature broke.',
      code: `// BAD: Copilot guessed at assertions
test('contact form', async ({ page }) => {
  await page.goto('/contact');
  // These assertions are true but meaningless:
  await expect(page.getByTestId('name-input')).toBeVisible();
  await expect(page.getByTestId('submit-button')).toBeEnabled();
  await expect(page).toHaveTitle(/Contact/);
});

// GOOD: Assertions from specific business rules
test('contact form submission shows success message', async ({ page }) => {
  await page.goto('/contact');
  await page.getByTestId('name-input').fill('Jane Smith');
  await page.getByTestId('contact-email-input').fill('jane@example.com');
  await page.getByTestId('subject-select').selectOption('Support');
  await page.getByTestId('message-input').fill('Need help with order #1234');
  await page.getByTestId('submit-button').click();

  // This assertion tests actual business behavior:
  await expect(page.getByTestId('success-message')).toContainText('Thank you');
});`,
      codeLanguage: 'typescript',
    },
  ],
  quiz: {
    question: 'In the CARD formula, what does the "R" stand for?',
    options: [
      'Results — the expected test output',
      'Rules — the business requirements and validation logic',
      'Routes — the URLs the test navigates to',
      'Repeat — how many times to run the test',
    ],
    correctIndex: 1,
    explanation: 'R stands for Rules — the business requirements, validation logic, and acceptance criteria that your assertions will verify. Rules are what distinguish a meaningful test from one that just checks the page loaded.',
    additionalQuestions: [
      {
        question: 'Which of these should you keep as a manual test?',
        options: [
          'Login flow that runs in every regression cycle',
          'Cross-browser check of the checkout page',
          'Evaluating whether the new dashboard layout is intuitive',
          'Data-driven test with 50 product search queries',
        ],
        correctIndex: 2,
        explanation: 'Evaluating whether a layout is "intuitive" requires human judgment — code can\'t verify that. The other three are repetitive, verifiable, and data-driven, making them strong automation candidates.',
      },
      {
        question: 'What is the main risk of asking Copilot to choose assertions for you?',
        options: [
          'Copilot generates slow tests',
          'Copilot uses deprecated syntax',
          'Copilot creates assertions based on code patterns, not business rules',
          'Copilot only asserts on visible elements',
        ],
        correctIndex: 2,
        explanation: 'Copilot generates syntactically valid assertions, but it doesn\'t know your business rules. It will assert that elements exist or are visible — checks that rarely catch real bugs. You need to specify the exact business requirement each assertion should verify.',
      },
    ],
  },
  exercises: [
    {
      title: 'Map CARD to Test Code',
      description: 'Read the CARD prompt and the generated test below. Add comments identifying which lines correspond to Context, Actions, Rules, and Data. This builds your ability to trace between requirements and code.',
      difficulty: 'beginner',
      starterCode: `import { test, expect } from '@playwright/test';

// TODO: Add a comment above each section identifying it as
// Context (C), Actions (A), Rules (R), or Data (D)

test('login with invalid credentials shows error', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('WrongPassword');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('error-message')).toHaveText(
    'Invalid email or password'
  );
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('login with invalid credentials shows error', async ({ page }) => {
  // C (Context): Navigate to the login page
  await page.goto('/login');

  // A (Actions): Fill credentials and submit
  // D (Data): Invalid password "WrongPassword" for valid user
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('WrongPassword');
  await page.getByTestId('login-button').click();

  // R (Rules): Invalid credentials must display error message
  await expect(page.getByTestId('error-message')).toHaveText(
    'Invalid email or password'
  );
});`,
      hints: [
        'Context tells Copilot where the test starts — look for page.goto().',
        'Actions are the user steps — fill, click, select.',
        'Data is the specific values passed into those actions.',
        'Rules become assertions — the expect() calls.',
      ],
    },
    {
      title: 'Fix Vague Rules',
      description: 'The CARD prompt below has vague Rules that will produce weak assertions. Rewrite the Rules section with specific, testable business requirements for the contact form.',
      difficulty: 'intermediate',
      starterCode: `// CARD Prompt for Contact Form (/contact)
//
// Context: Contact form at /contact with fields: name-input,
//   contact-email-input, phone-input, subject-select,
//   message-input, and submit-button.
//
// Actions:
//   1. Fill all required fields with valid data
//   2. Click submit
//   3. Verify success
//
// Rules:
//   - The form should work correctly
//   - Validation should be good
//   - The user should see feedback
//
// Data:
//   - Name: "Jane Smith"
//   - Email: "jane@example.com"
//   - Subject: "Support"
//   - Message: "Order question"

// TODO: Rewrite the Rules section above to be specific and testable.
// Then update this test to use meaningful assertions:

import { test, expect } from '@playwright/test';

test('contact form submission', async ({ page }) => {
  await page.goto('/contact');
  await page.getByTestId('name-input').fill('Jane Smith');
  await page.getByTestId('contact-email-input').fill('jane@example.com');
  await page.getByTestId('subject-select').selectOption('Support');
  await page.getByTestId('message-input').fill('Order question');
  await page.getByTestId('submit-button').click();

  // TODO: Replace with specific assertions from your rewritten Rules
  await expect(page).toBeTruthy();
});`,
      solutionCode: `// CARD Prompt for Contact Form (/contact)
//
// Context: Contact form at /contact with fields: name-input,
//   contact-email-input, phone-input, subject-select,
//   message-input, and submit-button.
//
// Actions:
//   1. Fill all required fields with valid data
//   2. Click submit
//   3. Verify success feedback appears
//
// Rules:
//   - After successful submission, success-message appears with "Thank you"
//   - Submit button becomes disabled during submission to prevent duplicates
//   - All form fields clear after successful submission
//   - Submitting with empty required fields shows validation errors
//
// Data:
//   - Name: "Jane Smith"
//   - Email: "jane@example.com"
//   - Subject: "Support"
//   - Message: "Order question"

import { test, expect } from '@playwright/test';

test('contact form submission shows success and clears fields', async ({ page }) => {
  await page.goto('/contact');
  await page.getByTestId('name-input').fill('Jane Smith');
  await page.getByTestId('contact-email-input').fill('jane@example.com');
  await page.getByTestId('subject-select').selectOption('Support');
  await page.getByTestId('message-input').fill('Order question');
  await page.getByTestId('submit-button').click();

  // Rule: success message appears with "Thank you"
  await expect(page.getByTestId('success-message')).toContainText('Thank you');

  // Rule: form fields clear after submission
  await expect(page.getByTestId('name-input')).toHaveValue('');
  await expect(page.getByTestId('message-input')).toHaveValue('');
});`,
      hints: [
        'A testable rule names the exact element and expected content — e.g., "success-message contains Thank you."',
        'Think about what happens to the form after submission: do fields clear? Does the button disable?',
        'Consider the negative case too: what happens when required fields are empty?',
      ],
    },
    {
      title: 'Write a Complete CARD Prompt',
      description: 'Write a full CARD prompt for the Orders page sort-by-amount functionality. Then write the Playwright test that the prompt would generate. Use the data-testid values from the Orders page: data-table, table-row, col-amount, sort-indicator.',
      difficulty: 'advanced',
      starterCode: `// TODO: Write your CARD prompt as comments here
//
// Context:
//   (describe the Orders page, URL, key elements)
//
// Actions:
//   (list the user steps to sort by amount)
//
// Rules:
//   (what must be true after sorting?)
//
// Data:
//   (what data values help verify sort order?)

import { test, expect } from '@playwright/test';

test('orders table sorts by amount', async ({ page }) => {
  // TODO: Implement the test based on your CARD prompt
});`,
      solutionCode: `// CARD Prompt:
//
// Context:
//   Orders page at /orders with a data table [data-testid="data-table"]
//   containing rows [data-testid="table-row"]. The Amount column header
//   [data-testid="col-amount"] is clickable to sort. A sort indicator
//   [data-testid="sort-indicator"] shows current sort direction.
//
// Actions:
//   1. Navigate to /orders
//   2. Click the Amount column header to sort ascending
//   3. Verify sort order and indicator
//   4. Click again to sort descending
//   5. Verify reversed sort order and updated indicator
//
// Rules:
//   - Clicking col-amount sorts rows by amount ascending on first click
//   - sort-indicator shows ascending direction
//   - Clicking col-amount again reverses to descending
//   - Row order in the DOM reflects the sort (first row has smallest/largest value)
//
// Data:
//   - Use at least 3 rows to verify order
//   - Compare first and last row amounts to confirm direction

import { test, expect } from '@playwright/test';

test('orders table sorts by amount ascending then descending', async ({ page }) => {
  await page.goto('/orders');

  // Verify table is loaded
  await expect(page.getByTestId('data-table')).toBeVisible();

  // Click Amount column to sort ascending
  await page.getByTestId('col-amount').click();

  // Rule: sort indicator shows ascending
  await expect(page.getByTestId('sort-indicator')).toBeVisible();

  // Rule: rows are in ascending order by amount
  const rows = page.getByTestId('table-row');
  const firstRowAmount = await rows.first().getByTestId('cell-amount').textContent();
  const lastRowAmount = await rows.last().getByTestId('cell-amount').textContent();

  const firstValue = parseFloat(firstRowAmount?.replace(/[^\\d.]/g, '') || '0');
  const lastValue = parseFloat(lastRowAmount?.replace(/[^\\d.]/g, '') || '0');
  expect(firstValue).toBeLessThanOrEqual(lastValue);

  // Click again to sort descending
  await page.getByTestId('col-amount').click();

  // Rule: first row now has the largest amount
  const descFirstAmount = await rows.first().getByTestId('cell-amount').textContent();
  const descLastAmount = await rows.last().getByTestId('cell-amount').textContent();

  const descFirstValue = parseFloat(descFirstAmount?.replace(/[^\\d.]/g, '') || '0');
  const descLastValue = parseFloat(descLastAmount?.replace(/[^\\d.]/g, '') || '0');
  expect(descFirstValue).toBeGreaterThanOrEqual(descLastValue);
});`,
      hints: [
        'Context should name the URL (/orders) and the data-testid values for the table, rows, column header, and sort indicator.',
        'Actions should describe both the ascending and descending sort clicks.',
        'Rules need to specify what ascending and descending actually mean — first row vs. last row comparison.',
        'Extract text content from cells and parse the numeric amount for comparison.',
      ],
    },
  ],
  promptTemplates: [
    {
      label: 'CARD: Login Validation',
      context: 'Use this template to generate a test for login form validation on the practice app.',
      prompt: `Write a Playwright test for the login page.

Context: Login form at /login with data-testid selectors: email-input, password-input, login-button, error-message.

Actions:
1. Navigate to /login
2. Fill email-input with "user@test.com"
3. Fill password-input with "WrongPassword"
4. Click login-button
5. Verify error-message displays "Invalid email or password"
6. Fill correct password "Password123!" and click login
7. Verify redirect to /dashboard

Rules:
- Invalid credentials show error text "Invalid email or password"
- Valid credentials redirect to /dashboard
- Error message disappears after successful login

Data:
- Valid: user@test.com / Password123!
- Invalid: user@test.com / WrongPassword`,
    },
    {
      label: 'CARD: Product Search',
      context: 'Use this template to generate a test for search functionality on the Products page.',
      prompt: `Write a Playwright test for product search.

Context: Products page at /products with data-testid selectors: search-input, search-button, result-count, result-card, category-filter.

Actions:
1. Navigate to /products
2. Fill search-input with "laptop"
3. Click search-button
4. Verify results appear

Rules:
- result-count updates to show number of matches
- Each result-card contains the search term in its text
- Searching with no matches shows "No results found"
- Clearing search and clicking search-button shows all products

Data:
- Search terms: "laptop" (has results), "xyznonexistent" (no results)
- Category filter: "Electronics"`,
    },
    {
      label: 'CARD: Contact Form Submission',
      context: 'Use this template to generate a test for the contact form with validation.',
      prompt: `Write a Playwright test for the contact form.

Context: Contact page at /contact with data-testid selectors: name-input, contact-email-input, phone-input, subject-select, message-input, submit-button, success-message.

Actions:
1. Navigate to /contact
2. Fill name-input with "Jane Smith"
3. Fill contact-email-input with "jane@example.com"
4. Select "Support" from subject-select
5. Fill message-input with "Need help with my order"
6. Click submit-button
7. Verify success-message appears

Rules:
- Submitting with all required fields shows success-message containing "Thank you"
- Submitting with empty name-input shows validation error
- Email field requires valid email format
- Message must be at least 10 characters

Data:
- Valid: Name "Jane Smith", Email "jane@example.com", Subject "Support", Message "Need help with my order"
- Invalid: Empty name, malformed email "notanemail", short message "Hi"`,
    },
  ],
  practiceLink: {
    url: 'http://localhost:5173/orders',
    label: 'Open Orders Page',
    description: 'Practice writing CARD prompts against the orders table — try sorting, filtering, and pagination.',
  },
  narrationScript: {
    intro: 'Not every test belongs in automation. Before you write a single line, you need a way to decide what to automate — and a formula for turning that decision into a prompt Copilot can act on.',
    steps: [
      {
        text: 'Open the Orders page. This table with sorting, filtering, and pagination is a strong automation candidate — it runs in every regression cycle and the results are verifiable by code.',
        navigateTo: '/orders',
        duration: 25,
      },
      {
        text: 'Look at the data table. Each row has structured data that code can read and compare. Sorting, filtering, pagination — these are deterministic operations with clear pass/fail outcomes.',
        highlight: 'data-table',
        duration: 20,
      },
      {
        text: 'Run every candidate through the four-question filter. Does it run more than three times? Can code verify the result? Is the feature stable? Is the data programmable? A "no" on any question means keep it manual.',
        duration: 25,
      },
      {
        text: 'Now for the CARD formula — the structure that turns your testing knowledge into a prompt Copilot can use. C for Context, A for Actions, R for Rules, D for Data.',
        duration: 20,
      },
      {
        text: 'Switch to the login page. This is where we\'ll build a CARD prompt from scratch.',
        navigateTo: '/login',
        duration: 15,
      },
      {
        text: 'Context starts here: the email input. Name the page, the URL, and the key elements by their data-testid values. Copilot needs this to generate the right selectors.',
        highlight: 'email-input',
        duration: 20,
      },
      {
        text: 'Actions are the steps a user takes — fill email, fill password, click login. List them in order, with specific values. "Enter credentials" is too vague. "Fill email-input with user@test.com" is what Copilot needs.',
        highlight: 'password-input',
        duration: 25,
      },
      {
        text: 'Rules are your business requirements — "error message appears for invalid credentials," "redirect to dashboard on success." These become assertions. Without them, Copilot guesses, and guesses are usually wrong.',
        highlight: 'login-button',
        duration: 25,
      },
      {
        text: 'Data is the specific values: user@test.com with the wrong password, then the right password. Include edge cases — empty fields, missing @ symbol. Good data coverage catches the bugs that happy-path tests miss.',
        duration: 20,
      },
      {
        text: 'Watch out for the assertion trap. If you ask Copilot "add appropriate assertions," it\'ll check that buttons exist and pages load. Those tests pass even when the feature is broken. Spell out the exact business rule you want verified.',
        duration: 25,
      },
      {
        text: 'Here\'s the key insight: every assertion should answer one question — if this fails, does it mean a real user would see a bug? If not, the assertion isn\'t earning its keep.',
        duration: 20,
      },
    ],
    outro: 'You now have a filter for deciding what to automate and a formula for structuring your prompts. Next, we\'ll look at the tools that turn those prompts into running tests — Playwright and GitHub Copilot.',
  },
};
