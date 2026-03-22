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
  exercises: [
    {
      difficulty: 'beginner',
      title: 'Assert the Products Page Loads',
      description: 'Write your first Playwright test. Navigate to the Products page and verify key elements are visible.',
      narration: 'You\'ll start with page.goto(\'/products\') — that\'s your Arrange step, putting the browser in the right starting state. Check the heading first with getByRole(\'heading\', { name: \'Products\' }), because that confirms you\'re on the products page and not a redirect or error screen. Then assert the search input is visible using getByTestId(\'search-input\'), which matters because a broken import could render the page shell without the actual content. Finally, use getByTestId(\'result-card\').first() to verify at least one product loaded — notice you don\'t need to count them all, just confirm the list isn\'t empty.',
      starterCode: `import { test, expect } from '@playwright/test';

test('products page displays correctly', async ({ page }) => {
  // TODO: Navigate to /products
  // TODO: Assert the page has a heading with "Products"
  // TODO: Assert the search input is visible
  // TODO: Assert at least 1 product card is visible
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('products page displays correctly', async ({ page }) => {
  await page.goto('/products');
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  await expect(page.getByTestId('search-input')).toBeVisible();
  await expect(page.getByTestId('result-card').first()).toBeVisible();
});`,
      hints: [
        'Use page.goto(\'/products\') to navigate',
        'Use page.getByRole(\'heading\', { name: \'Products\' }) for the page title',
        'Use page.getByTestId(\'search-input\') for the search field',
        'Use .first() on a multi-element locator to check at least one exists',
      ],
    },
    {
      difficulty: 'intermediate',
      title: 'Search and Filter Products',
      description: 'Test the search and category filter functionality. Verify that results update correctly when searching and filtering.',
      narration: 'For the search test, you\'ll fill getByTestId(\'search-input\') and click getByTestId(\'search-button\'), then assert against getByTestId(\'result-count\') — that element gives you a reliable, semantic signal that the filter worked, rather than just guessing at the card count. In the filter test, capture the unfiltered count with .count() before you do anything, so you have a baseline to compare against after calling selectOption(\'Electronics\') on the category dropdown; that before/after comparison is what makes the assertion meaningful. When clearing the filter, pass an empty string to selectOption(\'\') to reset it, then assert the count returns to your baseline.',
      starterCode: `import { test, expect } from '@playwright/test';

test.describe('Product Search & Filter', () => {
  test('search filters products by name', async ({ page }) => {
    await page.goto('/products');
    // TODO: Type a search term into the search input
    // TODO: Click the search button
    // TODO: Assert the result count changed
    // TODO: Assert each visible product card contains the search term
  });

  test('category filter narrows results', async ({ page }) => {
    await page.goto('/products');
    // TODO: Select "Electronics" from the category filter
    // TODO: Assert the result count shows fewer items
    // TODO: Clear the filter back to "All"
    // TODO: Assert the full product list returns
  });
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test.describe('Product Search & Filter', () => {
  test('search filters products by name', async ({ page }) => {
    await page.goto('/products');
    await page.getByTestId('search-input').fill('Laptop');
    await page.getByTestId('search-button').click();
    await expect(page.getByTestId('result-count')).toContainText('1');
    const cards = page.getByTestId('result-card');
    for (const card of await cards.all()) {
      await expect(card.getByTestId('product-name')).toContainText(/laptop/i);
    }
  });

  test('category filter narrows results', async ({ page }) => {
    await page.goto('/products');
    const allCount = await page.getByTestId('result-card').count();
    await page.getByTestId('category-filter').selectOption('Electronics');
    const filteredCount = await page.getByTestId('result-card').count();
    expect(filteredCount).toBeLessThan(allCount);
    await page.getByTestId('category-filter').selectOption('');
    await expect(page.getByTestId('result-card')).toHaveCount(allCount);
  });
});`,
      hints: [
        'Use .fill() to type into the search input and .click() on the search button',
        'Use .count() to get the number of matching elements for comparison',
        'Use .selectOption() to change the category dropdown',
        'Use toContainText() with a regex for case-insensitive matching',
      ],
    },
    {
      difficulty: 'advanced',
      title: 'Negative Testing and Edge Cases',
      description: 'Write tests for scenarios where things go wrong or hit boundaries. Test empty results, combined filters, and verify the UI handles edge cases gracefully.',
      narration: 'Start the empty-state test by searching for something deliberately nonsensical like "xyznonexistent" — the point is to guarantee zero matches so you can assert getByTestId(\'no-results\') is visible and toHaveCount(0) on result cards, proving the UI handles the empty case rather than just going silent. For combined filters, the important technique is sequencing: apply the category filter first, snapshot that count, then layer on the search term and verify the result is less than or equal to the category-only count. The case-insensitivity test works by running two separate searches — lowercase then uppercase — and comparing the counts with toBe(), which means both searches must not only match each other but also return something greater than zero, proving the feature works rather than just equally failing.',
      starterCode: `import { test, expect } from '@playwright/test';

test.describe('Product Page Edge Cases', () => {
  test('search with no results shows empty state', async ({ page }) => {
    await page.goto('/products');
    // TODO: Search for a product that doesn't exist (e.g., "xyznonexistent")
    // TODO: Assert the "No products found" message appears
    // TODO: Assert zero product cards are visible
  });

  test('search combined with category filter', async ({ page }) => {
    await page.goto('/products');
    // TODO: Select "Electronics" category first
    // TODO: Then search for a specific product
    // TODO: Assert the results reflect BOTH filters
    // TODO: Clear the search, assert category filter still applies
  });

  test('search is case-insensitive', async ({ page }) => {
    await page.goto('/products');
    // TODO: Search in lowercase, count results
    // TODO: Search same term in UPPERCASE, count results
    // TODO: Assert both searches return the same count
  });
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test.describe('Product Page Edge Cases', () => {
  test('search with no results shows empty state', async ({ page }) => {
    await page.goto('/products');
    await page.getByTestId('search-input').fill('xyznonexistent');
    await page.getByTestId('search-button').click();
    await expect(page.getByTestId('no-results')).toBeVisible();
    await expect(page.getByTestId('result-card')).toHaveCount(0);
  });

  test('search combined with category filter', async ({ page }) => {
    await page.goto('/products');
    await page.getByTestId('category-filter').selectOption('Electronics');
    const categoryCount = await page.getByTestId('result-card').count();
    await page.getByTestId('search-input').fill('Laptop');
    await page.getByTestId('search-button').click();
    const combinedCount = await page.getByTestId('result-card').count();
    expect(combinedCount).toBeLessThanOrEqual(categoryCount);
    await page.getByTestId('search-input').fill('');
    await page.getByTestId('search-button').click();
    await expect(page.getByTestId('result-card')).toHaveCount(categoryCount);
  });

  test('search is case-insensitive', async ({ page }) => {
    await page.goto('/products');
    await page.getByTestId('search-input').fill('laptop');
    await page.getByTestId('search-button').click();
    const lowerCount = await page.getByTestId('result-card').count();
    await page.getByTestId('search-input').fill('LAPTOP');
    await page.getByTestId('search-button').click();
    const upperCount = await page.getByTestId('result-card').count();
    expect(lowerCount).toBe(upperCount);
    expect(lowerCount).toBeGreaterThan(0);
  });
});`,
      hints: [
        'Use getByTestId(\'no-results\') for the empty state message',
        'Use toHaveCount(0) to assert no product cards exist',
        'Test filter combinations by applying one filter, counting, then adding another',
        'For case-insensitivity, compare counts from lowercase and uppercase searches',
      ],
    },
  ],
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
