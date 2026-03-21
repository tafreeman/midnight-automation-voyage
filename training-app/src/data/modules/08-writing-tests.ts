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
  }
};
