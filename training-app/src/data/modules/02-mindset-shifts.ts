import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 1,
  title: 'How Tests Are Structured',
  subtitle: 'Arrange-Act-Assert, assertion depth, and five shifts in how you think about testing',
  icon: '🧪',
  sections: [
    {
      heading: 'Arrange, Act, Assert',
      content: `Every test has three parts:\n\n**Arrange** — Set up the starting conditions. Navigate to a page, log in, seed data. This puts the app in the state you need.\n\n**Act** — Do the thing you're testing. Fill a form, click a button, submit a search. This is the user action under test.\n\n**Assert** — Check the result. Verify a heading appeared, an error message displayed, a table row exists. This is what makes the test meaningful.\n\nHere's a login test broken into these three parts:`,
      code: `import { test, expect } from '@playwright/test';

test('successful login navigates to dashboard', async ({ page }) => {
  // Arrange — navigate to the login page
  await page.goto('http://localhost:5173/login');

  // Act — fill credentials and click Login
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  // Assert — verify we landed on the dashboard
  await expect(page.getByTestId('dashboard-heading')).toBeVisible();
});`,
      codeLanguage: 'typescript',
      tip: 'Label the sections in your code with comments: // Arrange, // Act, // Assert. It makes tests easier to read and review, especially when someone else needs to understand what the test does.',
    },
    {
      heading: 'Why Assertions Are Non-Negotiable',
      content: `Without assertions, a test always passes — as long as the app doesn't crash. That's like a factory checkpoint that waves every product through without inspecting it.\n\nConsider these scenarios on the practice app:`,
      table: {
        headers: ['Scenario', 'Without Assertion', 'With Assertion'],
        rows: [
          [
            'Contact form submits to wrong endpoint',
            'Test passes — form submitted without error',
            'expect(page.getByTestId(\'success-message\')).toContainText(\'received\')',
          ],
          [
            'Products search returns $0 items',
            'Test passes — page loaded, no crash',
            'expect(page.getByTestId(\'result-count\')).not.toContainText(\'0 results\')',
          ],
          [
            'Login succeeds but lands on wrong page',
            'Test passes — URL changed',
            'expect(page.getByTestId(\'dashboard-heading\')).toBeVisible()',
          ],
          [
            'Orders table sorts but data is wrong',
            'Test passes — sort indicator appeared',
            'expect(firstRow).toContainText(expectedTopValue)',
          ],
        ],
      },
      warning: 'A test without assertions is like clicking through the app with your eyes closed. It proves the app didn\'t crash. It says nothing about whether the app worked correctly.',
    },
    {
      heading: 'Assertion Depth',
      content: `Not all assertions are equal. Ask three questions about every assertion you write:\n\n**1. Would this test fail if the feature were completely removed?**\nIf the answer is no, your assertion is too shallow. Checking that a page loads doesn't catch a missing search feature.\n\n**2. Would this test fail if the feature returned garbage data?**\nIf the answer is no, your assertion is too generic. Checking that "some text exists" doesn't catch wrong text.\n\n**3. Would this test fail if the feature worked for the wrong user?**\nIf the answer is no, your assertion doesn't verify authorization. Checking that the admin panel renders doesn't confirm the right user is seeing it.\n\nIf any answer is "no," the assertion has gaps. Tighten it.`,
      code: `// Shallow — only checks the page loaded
await expect(page).toHaveURL('/products');

// Better — checks that search results exist
await expect(page.getByTestId('result-count')).toBeVisible();

// Best — checks that results match the search query
await expect(page.getByTestId('result-count')).toContainText('3 results');
await expect(page.getByTestId('result-card').first()).toContainText('Widget');`,
      codeLanguage: 'typescript',
      callout: 'Depth doesn\'t mean quantity. One precise assertion that checks the right value beats five vague assertions that check generic properties.',
    },
    {
      heading: 'Five Mindset Shifts',
      content: `Moving from running tests yourself to writing instructions for a tool changes how you think. Here are five shifts that matter:\n\n**1. Executing → Instructing**\nWhen you test by hand, your eyes catch problems the test never mentioned. Automation has no eyes. It checks exactly what you tell it to check and ignores everything else. If you don't write an assertion for a broken layout, the test passes.\n\n**2. Marathons → Targeted checks**\nTesting login → search → cart → checkout as one flow makes sense when you can't skip steps. Automated tests can navigate directly to any page with pre-loaded state. Break long flows into focused tests so failures point to exactly what broke.\n\n**3. One-time → Repeatable**\nWhen you test by hand and a button moves, you find it. Automation can't adapt — if the selector doesn't match, the test fails. Use stable selectors (data-testid, getByRole) so tests survive UI refactors.\n\n**4. "Didn't crash" → "Right thing happened"**\nA test that clicks Submit and doesn't crash reports a pass. But did the form save correct data? Did the confirmation show the right order number? Assertions turn "it didn't crash" into "the right thing happened."\n\n**5. Ad-hoc → Structured**\nUpdating a manual test case means editing a document. Updating automated tests means maintaining selectors, expected values, and test data. Plan for it. The Page Object Model pattern (covered later) keeps maintenance manageable by centralizing selectors.`,
      tip: 'These shifts don\'t happen overnight. Each one becomes natural as you write more tests. By lesson 8, you\'ll think in Arrange-Act-Assert automatically.',
    },
  ],
  quiz: {
    question: 'A test navigates to /products, types "widget" in the search box, clicks Search, and completes without errors. No expect() assertions exist. What happened?',
    options: [
      'The test verified that search works correctly',
      'The test proved the app didn\'t crash, but never verified search results were correct',
      'The test failed because assertions are required',
      'The test checked the search results automatically',
    ],
    correctIndex: 1,
    explanation: 'Without expect() assertions, the test only proves the app didn\'t throw an error during those interactions. It never checked whether the search returned results, whether the results were relevant, or whether the result count was correct. Always add assertions that verify the outcome.',
    additionalQuestions: [
      {
        question: 'In the Arrange-Act-Assert pattern, which part verifies the outcome?',
        options: [
          'Arrange — it sets up the expected state',
          'Act — the action produces the result',
          'Assert — it checks the result matches expectations',
          'All three parts verify the outcome together',
        ],
        correctIndex: 2,
        explanation: 'Assert is the verification step. Arrange sets up preconditions, Act performs the user action, and Assert checks that the result matches what you expected.',
      },
    ],
  },
  exercises: [
    {
      title: 'Label the Arrange-Act-Assert Sections',
      description: 'This login test works but has no comments. Add // Arrange, // Act, and // Assert comments to identify each section. Then answer: which lines are Arrange? Which are Act? Which are Assert?',
      difficulty: 'beginner',
      starterCode: `import { test, expect } from '@playwright/test';

test('login with valid credentials', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('dashboard-heading')).toBeVisible();
  await expect(page).toHaveURL(/dashboard/);
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('login with valid credentials', async ({ page }) => {
  // Arrange — navigate to the login page
  await page.goto('http://localhost:5173/login');

  // Act — fill in credentials and submit the form
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  // Assert — verify successful login
  await expect(page.getByTestId('dashboard-heading')).toBeVisible();
  await expect(page).toHaveURL(/dashboard/);
});

// Arrange: line 4 (page.goto)
// Act: lines 7-9 (fill email, fill password, click login)
// Assert: lines 12-13 (check heading visible, check URL)`,
      hints: [
        'Arrange is everything that sets up the starting state — here, it\'s navigating to the login page',
        'Act is the user behavior under test — filling credentials and clicking Login',
        'Assert is the verification — checking the dashboard heading and URL',
      ],
    },
    {
      title: 'Add Missing Assertions',
      description: 'This test logs in and searches for products, but has NO assertions. It always passes, even if search is broken. Add assertions that verify: the page title, the search input is visible, and at least one product card appears.',
      difficulty: 'intermediate',
      starterCode: `import { test, expect } from '@playwright/test';

test('search for products after login', async ({ page }) => {
  // Arrange
  await page.goto('http://localhost:5173/login');
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  // Act — navigate to products and search
  await page.goto('http://localhost:5173/products');
  await page.getByTestId('search-input').fill('widget');
  await page.getByTestId('search-button').click();

  // TODO: Add assertions here
  // 1. Verify the page has a title containing "Products"
  // 2. Verify the search input is still visible
  // 3. Verify at least one result card appeared
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('search for products after login', async ({ page }) => {
  // Arrange
  await page.goto('http://localhost:5173/login');
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  // Act — navigate to products and search
  await page.goto('http://localhost:5173/products');
  await page.getByTestId('search-input').fill('widget');
  await page.getByTestId('search-button').click();

  // Assert — verify search results
  await expect(page).toHaveTitle(/Products/i);
  await expect(page.getByTestId('search-input')).toBeVisible();
  await expect(page.getByTestId('result-card').first()).toBeVisible();
});`,
      hints: [
        'Use expect(page).toHaveTitle() to check the page title',
        'Use expect(element).toBeVisible() to verify an element is on screen',
        'Use .first() to target the first matching element when multiple exist',
        'The result cards use data-testid="result-card"',
      ],
    },
    {
      title: 'Write a Contact Form Test from Scratch',
      description: 'Given these acceptance criteria, write a complete test using Arrange-Act-Assert:\n\nAC: When a user fills out all required fields on the contact form and clicks Submit, a success message appears containing the text "received".\n\nRequired fields: name, email, phone, subject (dropdown), message.',
      difficulty: 'advanced',
      starterCode: `import { test, expect } from '@playwright/test';

// Acceptance criteria:
// When a user fills out all required fields on the contact form
// and clicks Submit, a success message appears containing "received".
//
// Required fields: name, email, phone, subject (dropdown), message
//
// Practice app test-ids:
//   name-input, contact-email-input, phone-input,
//   subject-select, message-input, submit-button,
//   success-message

test('contact form submission shows success message', async ({ page }) => {
  // TODO: Write the complete test using Arrange-Act-Assert
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('contact form submission shows success message', async ({ page }) => {
  // Arrange — navigate to the contact page
  await page.goto('http://localhost:5173/contact');

  // Act — fill all required fields and submit
  await page.getByTestId('name-input').fill('Jane Doe');
  await page.getByTestId('contact-email-input').fill('jane@example.com');
  await page.getByTestId('phone-input').fill('555-123-4567');
  await page.getByTestId('subject-select').selectOption('Support');
  await page.getByTestId('message-input').fill('I need help with my order.');
  await page.getByTestId('submit-button').click();

  // Assert — verify the success message appears
  await expect(page.getByTestId('success-message')).toBeVisible();
  await expect(page.getByTestId('success-message')).toContainText('received');
});`,
      hints: [
        'Start with page.goto() to navigate to /contact',
        'Use fill() for text inputs and selectOption() for dropdown selects',
        'The subject field is a <select> element — use selectOption() with the option text',
        'Check both visibility and text content of the success message',
        'The acceptance criteria says "received" — use toContainText() to check for that word',
      ],
    },
  ],
  practiceLink: {
    url: 'http://localhost:5173/login',
    label: 'Open Practice App Login',
    description: 'Log in and explore the app to see the elements referenced in the exercises: login form, products search, contact form.',
  },
  narrationScript: {
    intro: 'Every test you write follows the same structure. Let\'s break it down on the login page and then talk about why assertions are the most important part.',
    steps: [
      {
        text: 'This is the login page. A test for this page has three parts: Arrange, Act, Assert. Arrange navigates here. Act fills the email and password fields, then clicks Login. Assert checks that the dashboard heading appeared.',
        navigateTo: '/login',
        duration: 30,
      },
      {
        text: 'The Arrange step is just one line: page.goto with the login URL. It puts the app in the state you need before doing anything else.',
        highlight: 'email-input',
        duration: 20,
      },
      {
        text: 'The Act step has three actions: fill the email, fill the password, click the login button. These are the user actions you\'re testing.',
        highlight: 'login-button',
        duration: 20,
      },
      {
        text: 'The Assert step checks the outcome. After login, you verify the dashboard heading is visible. Without this assertion, the test passes even if login redirects to an error page.',
        duration: 25,
      },
      {
        text: 'Here\'s the critical point: without assertions, tests always pass as long as the app doesn\'t crash. A contact form could submit to the wrong endpoint. A search could return zero results. A login could land on the wrong page. Without assertions, you\'d never know.',
        duration: 30,
      },
      {
        text: 'Test your assertions with three questions. Would this test fail if the feature were removed? If the feature returned garbage? If it worked for the wrong user? If any answer is no, tighten the assertion.',
        duration: 25,
      },
      {
        text: 'Let\'s look at the products page. If you test search here with no assertions, the test proves you can type in a box. Add an assertion that checks result count, and now the test proves search actually works.',
        navigateTo: '/products',
        highlight: 'search-input',
        duration: 25,
      },
      {
        text: 'Five shifts change how you think about testing: from executing to instructing, from long flows to targeted checks, from one-time to repeatable, from "didn\'t crash" to "right thing happened," and from ad-hoc to structured maintenance.',
        duration: 30,
      },
      {
        text: 'These shifts become natural as you write more tests. The key takeaway: every test needs at least one assertion that verifies the right thing happened, not just that the app survived.',
        duration: 20,
      },
    ],
    outro: 'You now know how tests are structured and why assertions matter. Next, let\'s learn how to find elements on the page — the locators and selectors that tell Playwright where to click, fill, and check.',
  },
};
