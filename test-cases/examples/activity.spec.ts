import { test, expect } from '@playwright/test';

// AF1: Activity feed loads with data in normal mode
test('activity feed loads and displays activity rows', async ({ page }) => {
  await page.goto('/activity');

  // Loading skeleton should appear first
  await expect(page.getByTestId('activity-loading')).toBeVisible();

  // Then data loads
  await expect(page.getByTestId('activity-list')).toBeVisible({ timeout: 5000 });
  await expect(page.getByTestId('activity-row-act-1')).toBeVisible();
});

// AF2: Filter chips narrow the activity list
test('filter chips narrow activity list by type', async ({ page }) => {
  await page.goto('/activity');
  await expect(page.getByTestId('activity-list')).toBeVisible({ timeout: 5000 });

  await page.getByTestId('activity-filter-login').click();

  // Only login activities should be visible
  await expect(page.getByTestId('activity-row-act-1')).toBeVisible();
  // Purchase activity should be hidden
  await expect(page.getByTestId('activity-row-act-2')).not.toBeVisible();
});

// AF3: Error mode shows error state
test('error mode displays error message with retry button', async ({ page }) => {
  await page.goto('/activity');
  await expect(page.getByTestId('activity-list')).toBeVisible({ timeout: 5000 });

  await page.getByTestId('activity-mode-error').click();
  await page.getByTestId('activity-refresh').click();

  await expect(page.getByTestId('activity-error')).toBeVisible({ timeout: 5000 });
  await expect(page.getByTestId('activity-error')).toContainText('500 Internal Server Error');
});

// AF4: Empty mode shows empty state
test('empty mode shows no activity message', async ({ page }) => {
  await page.goto('/activity');
  await expect(page.getByTestId('activity-list')).toBeVisible({ timeout: 5000 });

  await page.getByTestId('activity-mode-empty').click();
  await page.getByTestId('activity-refresh').click();

  await expect(page.getByTestId('activity-empty')).toBeVisible({ timeout: 5000 });
  await expect(page.getByTestId('activity-empty')).toContainText('No activity found');
});

// AF5: Clicking a row opens detail drawer
test('clicking activity row opens detail drawer', async ({ page }) => {
  await page.goto('/activity');
  await expect(page.getByTestId('activity-list')).toBeVisible({ timeout: 5000 });

  await page.getByTestId('activity-row-act-2').click();

  await expect(page.getByTestId('activity-detail')).toBeVisible();
  await expect(page.getByTestId('activity-detail')).toContainText('Bob Smith');
});
