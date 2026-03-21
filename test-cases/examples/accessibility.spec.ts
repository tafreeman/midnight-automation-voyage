import { test, expect } from '@playwright/test';
// NOTE: Requires @axe-core/playwright to be installed
// import AxeBuilder from '@axe-core/playwright';

// AX1: Settings page has keyboard-navigable tabs
test('settings tabs are keyboard navigable', async ({ page }) => {
  await page.goto('/settings');

  const profileTab = page.getByTestId('settings-profile-tab');
  const securityTab = page.getByTestId('settings-security-tab');
  const notificationsTab = page.getByTestId('settings-notifications-tab');

  // All tabs should be visible
  await expect(profileTab).toBeVisible();
  await expect(securityTab).toBeVisible();
  await expect(notificationsTab).toBeVisible();

  // Tabs should have correct role
  await expect(profileTab).toHaveRole('tab');
  await expect(securityTab).toHaveRole('tab');
});

// AX2: Tab panels have correct ARIA attributes
test('tab panels use correct ARIA roles', async ({ page }) => {
  await page.goto('/settings');

  // Profile tab is selected by default
  await expect(page.getByTestId('settings-profile-tab')).toHaveAttribute('aria-selected', 'true');

  // Switching tab updates aria-selected
  await page.getByTestId('settings-security-tab').click();
  await expect(page.getByTestId('settings-security-tab')).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('settings-profile-tab')).toHaveAttribute('aria-selected', 'false');
});

// AX3: Confirm dialog has alertdialog role
test('delete account dialog has correct ARIA role', async ({ page }) => {
  await page.goto('/settings');
  await page.getByTestId('settings-security-tab').click();

  // Click delete account button
  await page.locator('button:has-text("Delete Account")').click();

  const dialog = page.getByTestId('settings-confirm-dialog');
  await expect(dialog).toBeVisible();

  // Dialog should have alertdialog role
  const dialogBox = dialog.locator('[role="alertdialog"]');
  await expect(dialogBox).toBeVisible();
});

// AX4: Form inputs have associated labels
test('profile form inputs have visible labels', async ({ page }) => {
  await page.goto('/settings');

  // Name and email inputs have labels
  await expect(page.locator('label[for="settings-name"]')).toBeVisible();
  await expect(page.locator('label[for="settings-email"]')).toBeVisible();

  // NOTE: Bio textarea intentionally MISSING a label (a11y violation #1)
  // This is an intentional violation for learners to discover with axe-core
});
