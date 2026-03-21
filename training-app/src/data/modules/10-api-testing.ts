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
  ]
};
