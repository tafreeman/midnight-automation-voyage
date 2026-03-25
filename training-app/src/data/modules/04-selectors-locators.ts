import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 100,
  title: 'Finding Elements — Selectors and Locators',
  subtitle: 'The locator priority, why selectors break, and how to write stable ones',
  icon: '🎯',
  sections: [
    {
      heading: 'How Playwright Finds Elements',
      content: `Every interaction in a test — clicking a button, filling an input, reading text — starts with finding the element on the page. A **locator** is the instruction you give Playwright to find that element.\n\nThe strategy you choose determines how stable your test is. Think of it like giving someone directions:\n\n- **CSS selector** ("turn left at the third building, right at the blue door, left at the vending machine") — precise, but if anything along the route changes, you're lost.\n- **Semantic locator** ("go to 42 Oak Street") — uses a stable identifier that doesn't change when the scenery does.\n\nPlaywright offers several locator strategies. Some are stable, some are fragile. The one you pick affects how much time you spend fixing tests when the UI changes.`,
      code: `// Three ways to find the login button on the practice app:

// CSS selector — fragile, breaks when classes change
await page.locator('button.btn-primary.mt-4').click();

// data-testid — stable, survives CSS refactors
await page.getByTestId('login-button').click();

// getByRole — most stable, uses semantic meaning
await page.getByRole('button', { name: 'Login' }).click();`,
      codeLanguage: 'typescript',
    },
    {
      heading: 'The Locator Priority',
      content: `Use this hierarchy when choosing a locator. Start at the top and move down only when the one above doesn't work for your situation.`,
      table: {
        headers: ['Priority', 'Locator', 'When to Use', 'Practice App Example'],
        rows: [
          [
            '1 (best)',
            'getByRole',
            'Default choice. Matches how assistive technology sees the page.',
            'page.getByRole(\'button\', { name: \'Login\' })',
          ],
          [
            '2',
            'getByLabel',
            'Form inputs with visible labels.',
            'page.getByLabel(\'Email\')',
          ],
          [
            '3',
            'getByText',
            'Static text content like headings or messages.',
            'page.getByText(\'Welcome back\')',
          ],
          [
            '4',
            'getByTestId',
            'Dynamic UIs, components without stable text, or when above options aren\'t unique.',
            'page.getByTestId(\'result-count\')',
          ],
          [
            '5 (last resort)',
            'CSS selector',
            'Only when nothing above works. Breaks often.',
            'page.locator(\'.product-card:nth-child(2)\')',
          ],
        ],
      },
      tip: 'getByRole is the default because it mirrors how real users and screen readers find elements — by their purpose ("button," "heading," "textbox"), not their implementation details.',
      callout: 'The practice app includes data-testid attributes on key elements. When getByRole or getByLabel don\'t produce a unique match, getByTestId is the reliable fallback.',
    },
    {
      heading: 'Why Selectors Break',
      content: `Here's a scenario that plays out on real teams:\n\nYou write 50 tests using CSS class selectors like \`.btn-primary\`, \`.card-title\`, and \`.nav-link.active\`. A developer redesigns the component library and renames every CSS class. All 50 tests fail. The application works perfectly — the bug is in your tests, not the product.\n\nYou spend three days updating selectors. The next sprint, the designer changes the color scheme and several class names shift again. More broken tests. More wasted time.\n\nNow imagine those same 50 tests used \`getByRole('button', { name: 'Login' })\` and \`getByTestId('result-count')\`. The redesign changes CSS classes, but the button is still a button labeled "Login" and the result count still has its test ID. Zero tests break. Zero maintenance.\n\nThis is why the locator priority exists: stable locators save future time.`,
      table: {
        headers: ['Selector Type', 'Breaks When...', 'Maintenance Cost'],
        rows: [
          ['CSS class (.btn-primary)', 'CSS classes are renamed or refactored', 'High — every class change breaks tests'],
          ['CSS structure (div > ul > li:nth-child(3))', 'DOM structure changes at all', 'Very high — any layout change breaks tests'],
          ['getByTestId', 'Developer removes the data-testid attribute (rare)', 'Low — test IDs are explicitly for testing'],
          ['getByRole', 'Element\'s role or accessible name changes (very rare)', 'Very low — semantic meaning rarely changes'],
        ],
      },
      warning: 'If you find yourself writing long CSS selectors with multiple class names or child combinators, stop. That selector will break. Use the priority hierarchy instead.',
    },
    {
      heading: 'Locators on the Practice App',
      content: `Let's look at how to find real elements on the practice app. The login page has data-testid attributes on every key element, which gives you multiple locator options.\n\nOpen the practice app login page and right-click the Login button → "Inspect" to see its HTML. You'll find attributes like \`data-testid="login-button"\` that are specifically there for test automation.\n\nHere's the same button targeted three ways:`,
      code: `// CSS selector — fragile
// If the developer changes the class from "btn-primary" to "btn-action",
// this selector breaks even though the button still works.
await page.locator('button.btn-primary').click();

// getByTestId — stable
// The data-testid attribute exists specifically for testing.
// Developers know not to remove it without updating tests.
await page.getByTestId('login-button').click();

// getByRole — most stable
// The button is still a button labeled "Login" regardless of
// CSS changes, layout changes, or component library swaps.
await page.getByRole('button', { name: 'Login' }).click();

// For form inputs, getByLabel often works well:
await page.getByLabel('Email').fill('user@test.com');
// Falls back to getByTestId when labels aren't unique:
await page.getByTestId('email-input').fill('user@test.com');`,
      codeLanguage: 'typescript',
      tip: 'Use DevTools to inspect elements. Right-click any element → Inspect. Look for data-testid attributes, visible labels, and ARIA roles. These tell you which locator strategy to use.',
    },
  ],
  quiz: {
    question: 'Which locator strategy should you try first?',
    options: [
      'CSS class selectors like .btn-primary',
      'getByTestId with data-testid attributes',
      'getByRole with accessible role and name',
      'XPath expressions',
    ],
    correctIndex: 2,
    explanation: 'getByRole is the top of the locator priority because it matches elements by their semantic purpose (button, heading, textbox), not by implementation details like CSS classes. It\'s the most stable because a button\'s role and visible name rarely change, even during redesigns.',
    additionalQuestions: [
      {
        question: 'You wrote 50 tests using CSS class selectors. A developer renames the CSS classes during a redesign. What happens?',
        options: [
          'The tests adapt automatically because Playwright is smart',
          'All 50 tests fail even though the application works correctly',
          'Only tests for the redesigned components fail',
          'Playwright falls back to other selectors automatically',
        ],
        correctIndex: 1,
        explanation: 'CSS class selectors are tightly coupled to implementation details. When classes change, every selector referencing them breaks — even though the application works fine. This is why getByRole and getByTestId are preferred: they don\'t depend on CSS class names.',
      },
    ],
  },
  exercises: [
    {
      title: 'Compare Three Locator Approaches',
      description: 'This test finds the login button three different ways. Run it, then answer: which approach breaks if a developer renames the CSS class from "btn-primary" to "btn-action"?',
      difficulty: 'beginner',
      starterCode: `import { test, expect } from '@playwright/test';

test('find login button three ways', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  // Approach 1: CSS class selector
  const byCss = page.locator('button.btn-primary');
  await expect(byCss).toBeVisible();

  // Approach 2: data-testid
  const byTestId = page.getByTestId('login-button');
  await expect(byTestId).toBeVisible();

  // Approach 3: getByRole
  const byRole = page.getByRole('button', { name: 'Login' });
  await expect(byRole).toBeVisible();

  // Question: If a developer renames the CSS class
  // from "btn-primary" to "btn-action", which approach breaks?
  // Answer here: ___
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('find login button three ways', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  // Approach 1: CSS class selector — BREAKS if class renamed
  const byCss = page.locator('button.btn-primary');
  await expect(byCss).toBeVisible();

  // Approach 2: data-testid — survives CSS changes
  const byTestId = page.getByTestId('login-button');
  await expect(byTestId).toBeVisible();

  // Approach 3: getByRole — survives CSS changes
  const byRole = page.getByRole('button', { name: 'Login' });
  await expect(byRole).toBeVisible();

  // Answer: Approach 1 (CSS class selector) breaks.
  // Approaches 2 and 3 are unaffected because they don't
  // reference CSS classes at all.
});`,
      hints: [
        'CSS selectors reference class names directly — .btn-primary is a class name',
        'getByTestId references the data-testid attribute, which is independent of CSS',
        'getByRole references the element\'s role (button) and visible text (Login)',
        'Only Approach 1 depends on the CSS class name',
      ],
    },
    {
      title: 'Replace Fragile CSS Selectors',
      description: 'This test uses CSS selectors that will break during the next UI refactor. Replace each one with the best locator from the priority hierarchy.',
      difficulty: 'intermediate',
      starterCode: `import { test, expect } from '@playwright/test';

test('login and verify dashboard', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  // TODO: Replace these CSS selectors with better locators
  await page.locator('input[type="email"].form-control').fill('user@test.com');
  await page.locator('input[type="password"].form-control').fill('Password123!');
  await page.locator('button.btn-primary.mt-4').click();

  // TODO: Replace this CSS selector too
  await expect(page.locator('h1.dashboard-title')).toBeVisible();
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('login and verify dashboard', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  // Replaced with getByTestId — stable, independent of CSS
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByRole('button', { name: 'Login' }).click();

  // Replaced with getByTestId — doesn't depend on CSS class names
  await expect(page.getByTestId('dashboard-heading')).toBeVisible();
});

// Why these replacements:
// - email input: getByTestId('email-input') — stable test ID
// - password input: getByTestId('password-input') — stable test ID
// - login button: getByRole('button', { name: 'Login' }) — semantic, most stable
// - dashboard heading: getByTestId('dashboard-heading') — stable test ID`,
      hints: [
        'Check the practice app reference for data-testid values: email-input, password-input, login-button',
        'For the login button, getByRole(\'button\', { name: \'Login\' }) is the top choice',
        'For inputs, getByTestId is reliable when labels might not be unique',
        'The dashboard heading has data-testid="dashboard-heading"',
      ],
    },
    {
      title: 'Write Locators for the Orders Page',
      description: 'Write locators for three elements on the Orders page: the status filter dropdown, a customer name in the first table row, and the sort indicator on the Amount column. Use the best locator strategy for each.',
      difficulty: 'advanced',
      starterCode: `import { test, expect } from '@playwright/test';

test('orders page locators', async ({ page }) => {
  await page.goto('http://localhost:5173/orders');

  // TODO: Write a locator for the status filter dropdown
  // Hint: it has data-testid="status-filter"
  const statusFilter = // your locator here

  // TODO: Write a locator for the customer name in the first table row
  // Hint: table rows have data-testid="table-row", cells vary
  const firstCustomerName = // your locator here

  // TODO: Write a locator for the sort indicator on the Amount column
  // Hint: column headers have data-testid like "col-amount"
  //       sort indicators have data-testid="sort-indicator"
  const amountSortIndicator = // your locator here

  // Verify all three are accessible
  await expect(statusFilter).toBeVisible();
  await expect(firstCustomerName).toBeVisible();
  await expect(amountSortIndicator).toBeVisible();
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('orders page locators', async ({ page }) => {
  await page.goto('http://localhost:5173/orders');

  // Status filter — getByTestId is best here because
  // the dropdown may not have a unique visible label
  const statusFilter = page.getByTestId('status-filter');

  // First customer name — chain locators to scope within the first row
  const firstCustomerName = page.getByTestId('table-row')
    .first()
    .getByTestId('cell-customer');

  // Sort indicator on Amount column — click the column header first,
  // then find the sort indicator within it
  await page.getByTestId('col-amount').click();
  const amountSortIndicator = page.getByTestId('col-amount')
    .getByTestId('sort-indicator');

  // Verify all three are accessible
  await expect(statusFilter).toBeVisible();
  await expect(firstCustomerName).toBeVisible();
  await expect(amountSortIndicator).toBeVisible();
});`,
      hints: [
        'Use page.getByTestId(\'status-filter\') for the filter dropdown',
        'Chain locators to narrow scope: page.getByTestId(\'table-row\').first() targets the first row',
        'Within a scoped element, call .getByTestId() again to find child elements',
        'You may need to click a column header to make the sort indicator appear',
        'Check the practice app reference table for available data-testid values',
      ],
    },
  ],
  practiceLink: {
    url: 'http://localhost:5173/login',
    label: 'Open Practice App Login',
    description: 'Right-click elements and select "Inspect" to see their HTML attributes, including data-testid values. Try finding the same element using different locator strategies.',
  },
  narrationScript: {
    intro: 'Every test interaction starts with finding an element on the page. There are three ways to find this login button, and the one you pick determines how much maintenance you\'ll do later.',
    steps: [
      {
        text: 'This is the login page. See the Login button? You could find it with a CSS class like ".btn-primary", or with a test ID like "login-button", or with its role — button with the name Login. All three work today. The question is which one works tomorrow.',
        navigateTo: '/login',
        highlight: 'login-button',
        duration: 30,
      },
      {
        text: 'The locator priority gives you a clear order. Start with getByRole — it matches elements by their purpose, like "button" or "textbox." It\'s the most stable because a button\'s role and name rarely change, even during redesigns.',
        duration: 25,
      },
      {
        text: 'Second choice: getByLabel. Works well for form inputs that have visible labels. On this login page, you could use getByLabel("Email") to find the email field.',
        highlight: 'email-input',
        duration: 20,
      },
      {
        text: 'Third: getByText. Use it for static text content like headings, messages, or links. It finds elements by their visible text, which is stable as long as the copy doesn\'t change.',
        duration: 20,
      },
      {
        text: 'Fourth: getByTestId. The practice app has data-testid attributes on key elements — "email-input", "login-button", "result-count." These exist specifically for testing and survive CSS refactors.',
        duration: 25,
      },
      {
        text: 'Last resort: CSS selectors. These reference class names and DOM structure, both of which change during redesigns. Use them only when nothing else works.',
        duration: 15,
      },
      {
        text: 'Here\'s why this matters. Imagine 50 tests with CSS selectors. A developer renames CSS classes during a component library upgrade. All 50 tests fail. The app works perfectly — you just spent three days fixing tests. With getByRole, that same upgrade breaks zero tests.',
        duration: 35,
      },
      {
        text: 'Let\'s look at the Orders page. It has a data table, a status filter, and sortable columns — all with data-testid attributes.',
        navigateTo: '/orders',
        highlight: 'status-filter',
        duration: 20,
      },
      {
        text: 'The column headers have test IDs too. You can chain locators — find the Amount column header, then find the sort indicator inside it. Scoping keeps your locators precise without relying on fragile CSS paths.',
        highlight: 'col-amount',
        duration: 25,
      },
      {
        text: 'Open DevTools on any page — right-click an element, click Inspect. Look for data-testid attributes, visible labels, and the element\'s role. These tell you which locator strategy to use.',
        duration: 20,
      },
    ],
    outro: 'You now know how to find elements on the page using stable locators. Start with getByRole, fall back through the hierarchy, and avoid CSS selectors when possible. Next up: deciding what to automate and where to focus your effort.',
  },
};
