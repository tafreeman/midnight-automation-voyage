import { test, expect } from '@playwright/test';

// T1: Toast appears on settings save action
test('success toast appears after saving profile', async ({ page }) => {
  await page.goto('/settings');

  await page.getByTestId('settings-name-input').fill('Toast Test User');
  await page.getByTestId('settings-save-button').click();

  // Wait for toast to be visible (handles 200ms content delay)
  const toast = page.getByTestId('toast-0');
  await expect(toast).toBeVisible({ timeout: 3000 });

  await expect(page.getByTestId('toast-message-0')).toHaveText('Profile saved successfully.');
});

// T2: Toast auto-dismisses after timeout
test('toast auto-dismisses after 5 seconds', async ({ page }) => {
  await page.goto('/settings');

  await page.getByTestId('settings-name-input').fill('Auto Dismiss Test');
  await page.getByTestId('settings-save-button').click();

  const toast = page.getByTestId('toast-0');
  await expect(toast).toBeVisible({ timeout: 3000 });

  // Wait for auto-dismiss (5 second timeout + buffer)
  await expect(toast).not.toBeVisible({ timeout: 7000 });
});

// T3: Toast can be manually dismissed
test('toast disappears when dismiss button is clicked', async ({ page }) => {
  await page.goto('/settings');

  await page.getByTestId('settings-name-input').fill('Dismiss Test');
  await page.getByTestId('settings-save-button').click();

  const toast = page.getByTestId('toast-0');
  await expect(toast).toBeVisible({ timeout: 3000 });

  await page.getByTestId('toast-dismiss-0').click();
  await expect(toast).not.toBeVisible();
});

// T4: Toast shows correct icon for type
test('success toast shows checkmark icon', async ({ page }) => {
  await page.goto('/settings');

  await page.getByTestId('settings-name-input').fill('Icon Test');
  await page.getByTestId('settings-save-button').click();

  const icon = page.getByTestId('toast-icon-0');
  await expect(icon).toBeVisible({ timeout: 3000 });
  await expect(icon).toHaveText('✓');
});
