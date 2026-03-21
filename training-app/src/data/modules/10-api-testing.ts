import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 7,
  title: "API & Network Testing",
  subtitle: "Testing beyond the UI",
  icon: "🌐",
  audience: "Developers",
  sections: [
    {
      heading: "API Testing with Playwright",
      content: "Playwright has a built-in API testing client — no Postman or separate tool required. Use request context for API-only tests, or intercept network calls during UI tests.",
      code: `import { test, expect } from '@playwright/test';

test('GET /api/products returns 200 with products', async ({ request }) => {
const response = await request.get('/api/products');
expect(response.status()).toBe(200);

const body = await response.json();
expect(body.products).toBeDefined();
expect(body.products.length).toBeGreaterThan(0);
expect(body.products[0]).toHaveProperty('name');
expect(body.products[0]).toHaveProperty('price');
});

test('POST /api/orders requires auth', async ({ request }) => {
const response = await request.post('/api/orders', {
  data: { productId: '123', quantity: 1 }
});
expect(response.status()).toBe(401);
});`,
      codeLanguage: "typescript",
    },
    {
      heading: "Network Interception (Mocking)",
      content: "Mock API responses to test UI behavior under specific conditions — slow responses, errors, empty data — without needing a real backend.",
      code: `test('shows error banner on server failure', async ({ page }) => {
// Intercept the API call and return a 500
await page.route('**/api/products', (route) => {
  route.fulfill({
    status: 500,
    body: JSON.stringify({ error: 'Internal Server Error' }),
  });
});

await page.goto('/products');
await expect(page.getByTestId('error-banner')).toBeVisible();
await expect(page.getByTestId('error-banner'))
  .toContainText('Something went wrong');
});`,
      codeLanguage: "typescript",
      tip: "Mocking is how you test error states, loading states, and empty states without breaking your backend. Essential for edge case coverage."
    }
  ],
  practiceLink: {
    url: "http://localhost:5173/orders",
    label: "Test the orders API endpoint",
    description: "Write API tests to validate the orders endpoint response.",
  },
  quiz: {
    question: "What is the key difference between UI tests and API tests in Playwright?",
    options: [
      "API tests cannot use assertions",
      "API tests use request.get()/post() directly without launching a browser, making them faster and more stable",
      "UI tests are always preferred over API tests",
      "API tests require a separate testing framework",
    ],
    correctIndex: 1,
    explanation: "Playwright's API testing uses request fixtures to call endpoints directly — no browser, no DOM, no flaky selectors. This makes API tests significantly faster and more reliable for validating backend behavior, data contracts, and status codes.",
  },
  exercise: {
    title: "Write an API Assertion",
    description: "Complete the API test by adding assertions for the response status code, content type, and body structure.",
    starterCode: `import { test, expect } from '@playwright/test';

test('GET /api/orders returns order list', async ({ request }) => {
  const response = await request.get('/api/orders');
  // TODO: Assert response status is 200
  // TODO: Assert content-type is application/json
  // TODO: Assert response body is an array
  // TODO: Assert each order has an id and total field
});`,
    solutionCode: `import { test, expect } from '@playwright/test';

test('GET /api/orders returns order list', async ({ request }) => {
  const response = await request.get('/api/orders');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  const body = await response.json();
  expect(Array.isArray(body)).toBe(true);
  for (const order of body) {
    expect(order).toHaveProperty('id');
    expect(order).toHaveProperty('total');
  }
});`,
    hints: [
      "Use response.status() to check the HTTP status code",
      "Use response.headers() to check content-type",
      "Use response.json() to parse the body as JSON",
      "Use toHaveProperty() to check each order has required fields",
    ],
  },
  promptTemplates: [
    {
      label: "Generate API Test Suite",
      context: "Ask Copilot to generate a full API test suite for a REST endpoint.",
      prompt: "Write Playwright API tests for a /api/orders REST endpoint. Cover: GET all orders (expect 200, array response), GET single order by ID (expect 200, correct shape), POST create order (expect 201, returns new order), and GET invalid ID (expect 404). Use request fixtures, not browser context.",
    },
    {
      label: "API Response Schema Validation",
      context: "Validate that API responses match expected data structures.",
      prompt: "Write a Playwright API test that validates the response schema of GET /api/products. Each product should have: id (number), name (string), price (number > 0), description (string), and inStock (boolean). Use expect assertions to verify each field type and constraint. Include a test for pagination parameters.",
    },
  ],
};
