import { test, expect } from '@playwright/test';

// S1: Search page loads with default products
test('search page loads with default products visible', async ({ page }) => {
  await page.goto('/products');

  await expect(page.getByTestId('search-input')).toBeVisible();
  await expect(page.getByTestId('search-button')).toBeVisible();

  const results = page.getByTestId('result-card');
  await expect(results.first()).toBeVisible();
  const count = await results.count();
  expect(count).toBeGreaterThan(0);
});

// S2: Valid search returns matching results with complete cards
test('search for Widget returns matching results with complete cards', async ({ page }) => {
  await page.goto('/products');

  await page.getByTestId('search-input').fill('Widget');
  await page.getByTestId('search-button').click();

  const results = page.getByTestId('result-card');
  await expect(results.first()).toBeVisible();
  const count = await results.count();
  expect(count).toBeGreaterThan(0);

  await expect(page.getByTestId('result-count')).toContainText(`${count} result`);

  const firstCard = results.first();
  await expect(firstCard.locator('[data-testid="product-name"]')).toBeVisible();
  await expect(firstCard.locator('[data-testid="product-price"]')).toBeVisible();
  await expect(firstCard.locator('[data-testid="product-image"]')).toBeVisible();
});

// S3: Search is case-insensitive
test('search is case-insensitive', async ({ page }) => {
  await page.goto('/products');

  const searchTerms = ['Widget', 'widget', 'WIDGET'];
  const counts: number[] = [];

  for (const term of searchTerms) {
    await page.getByTestId('search-input').clear();
    await page.getByTestId('search-input').fill(term);
    await page.getByTestId('search-button').click();
    await expect(page.getByTestId('result-card').first()).toBeVisible();
    counts.push(await page.getByTestId('result-card').count());
  }

  expect(counts[0]).toBeGreaterThan(0);
  expect(counts[1]).toBe(counts[0]);
  expect(counts[2]).toBe(counts[0]);
});

// S4: No-match search shows empty state
test('nonexistent search term shows empty state', async ({ page }) => {
  await page.goto('/products');

  await page.getByTestId('search-input').fill('xyznonexistent');
  await page.getByTestId('search-button').click();

  await expect(page.getByTestId('no-results')).toBeVisible();
  await expect(page.getByTestId('no-results')).toContainText('No products found');
  await expect(page.getByTestId('result-count')).toContainText('0 results');
  await expect(page.getByTestId('result-card')).toHaveCount(0);
});

// S5: Category filter narrows search results
test('category filter narrows search results', async ({ page }) => {
  await page.goto('/products');

  await page.getByTestId('search-input').fill('Widget');
  await page.getByTestId('search-button').click();
  await expect(page.getByTestId('result-card').first()).toBeVisible();
  const unfilteredCount = await page.getByTestId('result-card').count();

  await page.getByTestId('category-filter').selectOption('Electronics');

  // Give the filter a moment to apply
  const filteredCount = await page.getByTestId('result-card').count();
  expect(filteredCount).toBeLessThanOrEqual(unfilteredCount);
  expect(filteredCount).toBeGreaterThan(0);
});

// S6: Empty search resets to show all products
test('empty search resets to show all products', async ({ page }) => {
  await page.goto('/products');

  await expect(page.getByTestId('result-card').first()).toBeVisible();
  const defaultCount = await page.getByTestId('result-card').count();

  await page.getByTestId('search-input').fill('Widget');
  await page.getByTestId('search-button').click();

  await page.getByTestId('search-input').clear();
  await page.getByTestId('search-button').click();

  const resetCount = await page.getByTestId('result-card').count();
  expect(resetCount).toBe(defaultCount);
});

// S7: Enter key triggers search
test('Enter key triggers search', async ({ page }) => {
  await page.goto('/products');

  await page.getByTestId('search-input').fill('Widget');
  await page.getByTestId('search-input').press('Enter');

  await expect(page.getByTestId('result-card').first()).toBeVisible();
  const count = await page.getByTestId('result-card').count();
  expect(count).toBeGreaterThan(0);
});
