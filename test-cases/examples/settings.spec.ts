import { test, expect } from '@playwright/test';

// S1: Settings page loads with tab navigation
test('settings page renders with profile tab active by default', async ({ page }) => {
  await page.goto('/settings');

  await expect(page.getByTestId('settings-profile-tab')).toBeVisible();
  await expect(page.getByTestId('settings-security-tab')).toBeVisible();
  await expect(page.getByTestId('settings-notifications-tab')).toBeVisible();
  await expect(page.getByTestId('settings-profile-tab')).toHaveAttribute('aria-selected', 'true');
});

// S2: Profile form validates required fields
test('profile save shows error when name is empty', async ({ page }) => {
  await page.goto('/settings');

  await page.getByTestId('settings-name-input').clear();
  await page.getByTestId('settings-save-button').click();

  await expect(page.getByTestId('toast-message-0')).toHaveText('Name and email are required.');
});

// S3: Profile form saves successfully
test('profile save shows success toast with valid data', async ({ page }) => {
  await page.goto('/settings');

  await page.getByTestId('settings-name-input').fill('Updated Name');
  await page.getByTestId('settings-email-input').fill('updated@test.com');
  await page.getByTestId('settings-save-button').click();

  await expect(page.getByTestId('toast-message-0')).toBeVisible();
  await expect(page.getByTestId('toast-message-0')).toHaveText('Profile saved successfully.');
});

// S4: Password change validates mismatch
test('password change shows error when passwords do not match', async ({ page }) => {
  await page.goto('/settings');
  await page.getByTestId('settings-security-tab').click();

  await page.getByTestId('settings-current-password').fill('OldPass123!');
  await page.getByTestId('settings-new-password').fill('NewPass123!');
  await page.getByTestId('settings-confirm-password').fill('DifferentPass!');
  await page.getByTestId('settings-save-button').click();

  await expect(page.locator('.field-error')).toContainText('Passwords do not match');
});

// S5: Notification toggles change state
test('notification toggles respond to clicks', async ({ page }) => {
  await page.goto('/settings');
  await page.getByTestId('settings-notifications-tab').click();

  const pushToggle = page.getByTestId('settings-notification-push');
  await expect(pushToggle).not.toBeChecked();

  await pushToggle.click();
  await expect(pushToggle).toBeChecked();
});

// S6: Tab navigation switches visible panel
test('clicking security tab shows password change form', async ({ page }) => {
  await page.goto('/settings');

  await page.getByTestId('settings-security-tab').click();

  await expect(page.getByTestId('settings-current-password')).toBeVisible();
  await expect(page.getByTestId('settings-new-password')).toBeVisible();
  await expect(page.getByTestId('settings-confirm-password')).toBeVisible();
});
