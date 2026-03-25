import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 102,
  title: 'Refine the Recording',
  subtitle: 'Turn raw codegen output into a production-quality test with Copilot Chat',
  icon: '✏️',
  sections: [
    {
      heading: 'The Refine Step',
      content: `Recording a test captures clicks and keystrokes — but the code it produces is rough. Selectors are brittle, assertions are missing, and the test name is generic. That's expected. Codegen's job is to capture the flow. Your job is to refine it into something that lasts.

Select the recorded code in your editor, open Copilot Chat (Ctrl+I or Cmd+I), and use a refinement prompt built around five points:

1. **Replace selectors** — Swap auto-generated CSS selectors with Playwright's built-in locator methods (getByRole, getByLabel, getByTestId).
2. **Add assertions** — Insert expect() statements that verify the behavior described in the acceptance criteria.
3. **Name the test** — Replace the generic test name with one that describes the scenario: \`test('submits contact form with valid data and shows success message')\`.
4. **Remove waits** — Delete any hardcoded \`waitForTimeout()\` calls. Playwright's auto-waiting handles most timing issues.
5. **Use baseURL** — Replace absolute URLs with relative paths so the test works in any environment.

This five-point template turns every recorded test into a maintainable one.`,
      code: `// Copilot Chat refinement prompt:
// "Refine this recorded Playwright test:
//  1. Replace CSS selectors with getByRole, getByLabel, or getByTestId
//  2. Add assertions: verify success message appears after submit
//  3. Rename the test to describe the scenario
//  4. Remove any waitForTimeout calls
//  5. Replace hardcoded URLs with relative paths using baseURL"`,
      codeLanguage: 'typescript',
      tip: 'Save your refinement prompt as a snippet in your editor. You\'ll reuse it on every recorded test.',
    },
    {
      heading: 'Locator Priority',
      content: `Playwright provides several ways to find elements. Some break when the UI changes; others survive redesigns. The priority order matters:

**getByRole** → **getByLabel** → **getByText** → **getByTestId** → **CSS selector (last resort)**

Why this order? User-facing locators track what the user sees, not how the HTML is structured. A button labeled "Sign In" stays labeled "Sign In" even if a developer changes the CSS class from \`btn-primary\` to \`button--action\`. The role and the visible text are stable because they're part of the product's interface.

When none of those work — for example, a div with no accessible role, label, or meaningful text — fall back to \`getByTestId\`. Test IDs are added specifically for automation and won't change accidentally during a redesign.

CSS selectors (\`page.locator('.btn.btn-primary')\`) are the last resort. They couple your test to implementation details that change frequently.`,
      code: `// ❌ Fragile — breaks when CSS classes change
await page.locator('button.btn.btn-primary').click();

// ❌ Fragile — breaks when DOM structure changes
await page.locator('#root > div > form > button:nth-child(3)').click();

// ✅ Stable — tracks the visible button label
await page.getByRole('button', { name: 'Sign In' }).click();

// ✅ Stable — tracks the form label
await page.getByLabel('Email').fill('user@test.com');

// ✅ Stable — explicit test ID when no accessible name exists
await page.getByTestId('error-message').toBeVisible();`,
      codeLanguage: 'typescript',
      callout: 'getByRole matches how assistive technology and real users find elements. It\'s stable because changing a button\'s role or label is a deliberate product decision, not an accidental side effect of refactoring CSS.',
    },
    {
      heading: 'Adding Assertions',
      content: `A recorded test captures what the user does — click here, type there, press submit. It doesn't capture what should happen next. That's the gap assertions fill.

Assertions come from domain knowledge. The acceptance criteria on the ticket tell you what the system should do after each action. Copilot can suggest assertions, but you validate them against the criteria.

Take the practice app's login flow. The acceptance criteria say: "After successful login, the user sees the dashboard with a heading that includes their name." That gives you two assertions:

1. The dashboard heading is visible.
2. The heading contains the expected text.

Without assertions, a test that navigates to the login page, fills credentials, and clicks "Sign In" will pass even if the login is broken — as long as no element throws an error. The test runs. It's green. It tells you nothing.`,
      code: `// ❌ No assertions — passes even when login is broken
test('login', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();
});

// ✅ Assertions verify the acceptance criteria
test('logs in and shows dashboard with user greeting', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('dashboard-heading')).toBeVisible();
  await expect(page.getByTestId('dashboard-heading')).toContainText('Dashboard');
});`,
      codeLanguage: 'typescript',
      warning: 'A test without assertions is a script, not a test. It exercises a flow but verifies nothing. Treat any test with zero expect() calls as incomplete.',
    },
    {
      heading: 'The Complete Refinement',
      content: `Here's a full before-and-after. The "before" is what codegen produces after recording the contact form flow in the practice app. The "after" is what it looks like after applying the five-point refinement.

Notice every change: generic name replaced, CSS selectors swapped for getByTestId and getByRole, hardcoded URL removed, waitForTimeout deleted, and assertions added to verify the success message.`,
      code: `// ══════════════════════════════════════════════
// BEFORE: Raw codegen output
// ══════════════════════════════════════════════
import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/contact');
  await page.locator('#name').fill('Jane Doe');
  await page.locator('#email').fill('jane@example.com');
  await page.locator('#phone').fill('555-0100');
  await page.locator('select').selectOption('support');
  await page.locator('textarea').fill('I need help with my order.');
  await page.waitForTimeout(1000);
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(2000);
});

// ══════════════════════════════════════════════
// AFTER: Refined with five-point template
// ══════════════════════════════════════════════
import { test, expect } from '@playwright/test';

test('submits contact form and shows success message', async ({ page }) => {
  // Arrange — navigate to the contact page
  await page.goto('/contact');

  // Act — fill and submit the form
  await page.getByTestId('name-input').fill('Jane Doe');
  await page.getByTestId('contact-email-input').fill('jane@example.com');
  await page.getByTestId('phone-input').fill('555-0100');
  await page.getByTestId('subject-select').selectOption('support');
  await page.getByTestId('message-input').fill('I need help with my order.');
  await page.getByTestId('submit-button').click();

  // Assert — verify success feedback
  await expect(page.getByTestId('success-message')).toBeVisible();
  await expect(page.getByTestId('success-message')).toContainText('received');
});`,
      codeLanguage: 'typescript',
      tip: 'The Arrange-Act-Assert pattern (AAA) makes every test readable at a glance. Arrange sets up the state, Act performs the action, Assert checks the outcome.',
    },
  ],
  quiz: {
    question: 'Which locator strategy should you try first?',
    options: [
      'page.locator() with a CSS selector',
      'page.getByTestId() with a data-testid attribute',
      'page.getByRole() with the element\'s accessible role',
      'page.locator() with an XPath expression',
    ],
    correctIndex: 2,
    explanation: 'getByRole is the top-priority locator because it matches elements the way users and assistive technology find them — by role and visible name. It survives CSS refactors, DOM restructuring, and class name changes because it tracks the product interface, not the implementation.',
    additionalQuestions: [
      {
        question: 'What is the main risk of a test that has no expect() assertions?',
        options: [
          'It runs slower than tests with assertions',
          'It passes even when the feature is broken',
          'Playwright refuses to execute it',
          'It produces a warning in the HTML report',
        ],
        correctIndex: 1,
        explanation: 'A test without assertions exercises a flow but verifies nothing. It will pass as long as no element throws an error — even if the feature under test is completely broken. Assertions are what make a test useful.',
      },
      {
        question: 'Why should you remove waitForTimeout() from recorded tests?',
        options: [
          'It makes the test file larger',
          'Playwright\'s auto-waiting handles timing, making hardcoded waits unnecessary and slow',
          'It causes syntax errors in CI environments',
          'Copilot cannot process tests that contain waits',
        ],
        correctIndex: 1,
        explanation: 'Playwright automatically waits for elements to be actionable before interacting with them. Hardcoded waits (waitForTimeout) add unnecessary delay and can still fail if the arbitrary duration isn\'t long enough. Remove them and let Playwright\'s built-in waiting handle timing.',
      },
    ],
  },
  exercises: [
    {
      title: 'Replace a Fragile Selector',
      description: 'This test uses a brittle CSS selector to find the search button on the products page. Replace it with the correct getByTestId locator so the test survives UI refactors.',
      starterCode: `import { test, expect } from '@playwright/test';

test('searches for a product', async ({ page }) => {
  await page.goto('/products');

  await page.getByTestId('search-input').fill('laptop');

  // ❌ This CSS selector is fragile — replace it
  await page.locator('button.search-btn.primary').click();

  await expect(page.getByTestId('result-count')).toBeVisible();
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('searches for a product', async ({ page }) => {
  await page.goto('/products');

  await page.getByTestId('search-input').fill('laptop');

  // ✅ Stable test ID selector
  await page.getByTestId('search-button').click();

  await expect(page.getByTestId('result-count')).toBeVisible();
});`,
      hints: [
        'Look at the practice app reference — the products page has a search-button test ID.',
        'Replace page.locator(\'button.search-btn.primary\') with page.getByTestId(\'search-button\').',
      ],
      difficulty: 'beginner',
    },
    {
      title: 'Write a Refinement Prompt',
      description: 'Write a Copilot Chat prompt that refines the raw recording below. Your prompt must address all five refinement points: selectors, assertions, test name, waits, and URLs. Write the prompt as a code comment, then show the refined test code.',
      starterCode: `// Raw recording to refine:
import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.locator('#email').fill('user@test.com');
  await page.locator('#password').fill('Password123!');
  await page.waitForTimeout(500);
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(2000);
});

// TODO: Write your Copilot Chat refinement prompt below as a comment,
// then write the refined test code.

// Prompt:
// "..."

// Refined test:
`,
      solutionCode: `// Copilot Chat refinement prompt:
// "Refine this recorded Playwright test:
//  1. Replace CSS selectors (#email, #password, button[type='submit'])
//     with getByTestId using: email-input, password-input, login-button
//  2. Add assertions: verify dashboard-heading is visible after login
//  3. Rename the test to 'logs in with valid credentials and reaches dashboard'
//  4. Remove both waitForTimeout calls — Playwright auto-waits
//  5. Replace http://localhost:5173/login with /login (use baseURL)"

// Refined test:
import { test, expect } from '@playwright/test';

test('logs in with valid credentials and reaches dashboard', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('dashboard-heading')).toBeVisible();
});`,
      hints: [
        'Your prompt should mention each of the five refinement points explicitly.',
        'Reference the actual test IDs from the practice app: email-input, password-input, login-button, dashboard-heading.',
        'Remove both waitForTimeout calls — Playwright handles timing automatically.',
      ],
      difficulty: 'intermediate',
    },
    {
      title: 'Full Contact Form Refinement',
      description: 'Below is raw codegen output from recording the contact form flow. Apply a full refinement: fix all selectors to use getByTestId, add assertions for the success message, name the test descriptively, remove waits, use relative URLs, and structure the test with Arrange-Act-Assert comments.',
      starterCode: `import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/contact');
  await page.locator('input[name="name"]').fill('Alex Smith');
  await page.locator('input[name="email"]').fill('alex@example.com');
  await page.locator('input[name="phone"]').fill('555-0199');
  await page.locator('select#subject').selectOption('billing');
  await page.locator('textarea#message').fill('Please update my billing address.');
  await page.waitForTimeout(1000);
  await page.locator('form button[type="submit"]').click();
  await page.waitForTimeout(3000);
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('submits contact form with billing inquiry and shows success', async ({ page }) => {
  // Arrange — navigate to the contact page
  await page.goto('/contact');

  // Act — fill out and submit the form
  await page.getByTestId('name-input').fill('Alex Smith');
  await page.getByTestId('contact-email-input').fill('alex@example.com');
  await page.getByTestId('phone-input').fill('555-0199');
  await page.getByTestId('subject-select').selectOption('billing');
  await page.getByTestId('message-input').fill('Please update my billing address.');
  await page.getByTestId('submit-button').click();

  // Assert — verify the submission succeeded
  await expect(page.getByTestId('success-message')).toBeVisible();
  await expect(page.getByTestId('success-message')).toContainText('received');
});`,
      hints: [
        'The contact form test IDs are: name-input, contact-email-input, phone-input, subject-select, message-input, submit-button, success-message.',
        'Remove both waitForTimeout calls — they\'re unnecessary with Playwright\'s auto-waiting.',
        'Add AAA comments (Arrange, Act, Assert) to structure the test clearly.',
        'Import expect from @playwright/test — the raw recording is missing it.',
      ],
      difficulty: 'advanced',
    },
  ],
  practiceLink: {
    url: 'http://localhost:5173/contact',
    label: 'Contact Form',
    description: 'Practice refining selectors and adding assertions against the contact form. Try recording with codegen first, then refine the output.',
  },
  narrationScript: {
    intro: 'This works. But it\'s fragile. One CSS class change and the test breaks. Let\'s turn this raw recording into something that lasts.',
    steps: [
      {
        text: 'Open the contact page in the practice app. This is the form we recorded in the previous lesson.',
        navigateTo: '/contact',
        duration: 15,
      },
      {
        text: 'Look at the raw codegen output. It uses CSS selectors like input[name="name"] and select#subject. These are tied to HTML attributes that developers change during refactors.',
        duration: 20,
      },
      {
        text: 'The first refinement step: replace every CSS selector with a Playwright locator method. For the contact form, each field has a data-testid. Use getByTestId for each one.',
        highlight: 'name-input',
        duration: 25,
      },
      {
        text: 'The locator priority order: getByRole first, then getByLabel, getByText, getByTestId, and CSS as a last resort. User-facing locators survive redesigns because they track the interface, not the implementation.',
        duration: 30,
      },
      {
        text: 'Next: add assertions. The recorded test clicks submit but never checks what happens. Add an expect statement that verifies the success message appears.',
        highlight: 'submit-button',
        duration: 25,
      },
      {
        text: 'Assertions come from the acceptance criteria, not from guessing. If the ticket says "show a confirmation message after submit," that\'s your assertion. Copilot can suggest the code, but you decide what to verify.',
        duration: 30,
      },
      {
        text: 'Give the test a name that describes the scenario. "test" tells you nothing. "submits contact form and shows success message" tells you exactly what this test validates.',
        duration: 20,
      },
      {
        text: 'Remove any waitForTimeout calls. Playwright automatically waits for elements to be ready before interacting with them. Hardcoded waits slow tests down and still fail on slow machines.',
        duration: 20,
      },
      {
        text: 'Replace the hardcoded URL with a relative path. Instead of http://localhost:5173/contact, use /contact. The baseURL in your config handles the rest.',
        duration: 20,
      },
      {
        text: 'Structure the final test with Arrange-Act-Assert comments. Arrange sets up the page. Act fills the form and clicks submit. Assert checks the success message.',
        highlight: 'success-message',
        duration: 25,
      },
    ],
    outro: 'Five refinement points, applied consistently, turn every raw recording into a production-quality test. Record captures the flow. You shape it into something that actually verifies the product works.',
  },
};
