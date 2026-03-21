import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 5,
  title: "Writing Tests from Scratch",
  subtitle: "From acceptance criteria to working test code",
  icon: "✍️",
  audience: "Developers — Non-coders: skim for awareness",
  sections: [
    {
      heading: "From Ticket to Test",
      content: "Every test should trace back to an acceptance criterion. Start with the ticket, extract the testable behaviors, and use Copilot to scaffold each one. This workflow ensures full coverage and makes reviews faster because reviewers can map each test to a requirement.",
      code: `// Given this acceptance criteria from a ticket:
// AC1: User can search by product name
// AC2: Results show product name, price, and thumbnail
// AC3: No results shows "No products found" message
// AC4: Search is case-insensitive

// Copilot Chat prompt:
"Generate Playwright tests for a product search page.
Use data-testid selectors. One test per acceptance criterion:
- AC1: Search by name returns matching results
- AC2: Each result shows name, price, thumbnail
- AC3: Nonsense query shows 'No products found'
- AC4: 'WIDGET' and 'widget' return same results
Base URL: /products/search
Test data: search for 'Widget Pro'"`,
      codeLanguage: "typescript",
    },
    {
      heading: "Test Anatomy",
      content: "Every Playwright test follows the Arrange → Act → Assert pattern. Understanding this structure helps you review Copilot output, even if you didn't write it.",
      code: `import { test, expect } from '@playwright/test';

test('search returns matching products', async ({ page }) => {
// ARRANGE — set up the starting state
await page.goto('/products/search');

// ACT — perform the user action
await page.getByTestId('search-input').fill('Widget Pro');
await page.getByTestId('search-button').click();

// ASSERT — verify the expected outcome
const results = page.getByTestId('product-card');
await expect(results).toHaveCount(3);
await expect(results.first()).toContainText('Widget Pro');
});`,
      codeLanguage: "typescript",
      tip: "Non-coders: When reviewing tests, look for these three sections. If a test has Arrange + Act but no Assert — flag it. That's the #1 review catch."
    },
    {
      heading: "Selector Strategy",
      content: "The single most impactful decision for test maintainability. Data-testid attributes are immune to CSS refactors and content changes. The team standard is: always use data-testid for test selectors.",
      table: {
        headers: ["Strategy", "Example", "Resilience", "Use When"],
        rows: [
          ["data-testid", "getByTestId('login-btn')", "🟢 Excellent", "Always — team default"],
          ["Role + name", "getByRole('button', { name: 'Log in' })", "🟢 Good", "Accessibility-first flows"],
          ["Text content", "getByText('Submit')", "🟡 Medium", "Labels unlikely to change"],
          ["CSS selector", "locator('.btn-primary')", "🔴 Fragile", "Last resort only"],
        ]
      },
      warning: "If you see CSS selectors like .btn-primary or #main > div:nth-child(3) in a test — flag it in review. These break on any UI refactor."
    }
  ],
  quiz: {
    question: "What's the recommended selector strategy for the team?",
    options: [
      "CSS class selectors for readability",
      "XPath for precision",
      "data-testid attributes",
      "Auto-generated selectors from the recorder"
    ],
    correctIndex: 2,
    explanation: "data-testid attributes are the team standard because they are immune to CSS refactors, content text changes, and layout restructuring. They exist solely for testing and won't break when designers restyle the UI."
  },
  practiceLink: {
    url: "http://localhost:5173/products",
    label: "Write your first product page test",
    description: "Practice writing assertions against the products listing page.",
  },
  exercise: {
    title: "Complete a Product Page Test",
    description: "Fill in the assertions for this product page test. The page at /products displays a list of product cards, each with a name, price, and 'Add to Cart' button.",
    starterCode: `import { test, expect } from '@playwright/test';

test.describe('Product Page', () => {
  test('should display product list', async ({ page }) => {
    await page.goto('/products');
    // TODO: Assert the page has a heading with "Products"
    // TODO: Assert at least 3 product cards are visible
    // TODO: Assert each product card has a price
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/products');
    // TODO: Click the first "Add to Cart" button
    // TODO: Assert a success message appears
  });
});`,
    solutionCode: `import { test, expect } from '@playwright/test';

test.describe('Product Page', () => {
  test('should display product list', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    const cards = page.locator('[data-testid="product-card"]');
    await expect(cards).toHaveCount(await cards.count());
    expect(await cards.count()).toBeGreaterThanOrEqual(3);
    for (const card of await cards.all()) {
      await expect(card.locator('[data-testid="product-price"]')).toBeVisible();
    }
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/products');
    await page.locator('[data-testid="add-to-cart"]').first().click();
    await expect(page.getByText('Added to cart')).toBeVisible();
  });
});`,
    hints: [
      "Use page.getByRole('heading') to find the page title",
      "Use page.locator('[data-testid=\"product-card\"]') to find product cards",
      "Use .toHaveCount() or .count() to verify the number of products",
      "For prices, check that each card contains a price element with toBeVisible()",
    ],
  },
  promptTemplates: [
    {
      label: "Generate Test for Page",
      context: "Ask Copilot to write a complete test for any page in your application.",
      prompt: "Write a Playwright test for the products page at /products. The page displays a grid of product cards, each with a name, price, image, and 'Add to Cart' button. Write tests that verify: the page loads with the correct title, all products are visible, prices are formatted correctly, and the add-to-cart button works. Use data-testid selectors where available.",
    },
    {
      label: "Generate Assertion Set",
      context: "When you have a test structure but need help writing assertions.",
      prompt: "I have a Playwright test that navigates to /checkout and fills in shipping details. Help me write assertions to verify: the order summary shows correct items, the total price is calculated correctly, form validation works for required fields, and the submit button is disabled until all fields are valid.",
    },
  ],
};
