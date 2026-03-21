import { test, expect } from '@playwright/test';

// A1: Unauthenticated user is redirected to login
test('unauthenticated user is redirected to login from admin', async ({ page }) => {
  // Clear any stored auth
  await page.goto('/login');
  await page.evaluate(() => {
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('user');
  });

  await page.goto('/admin');
  await expect(page).toHaveURL(/.*\/login/);
});

// A2: Admin user can see user table
test('admin user sees user table with seed data', async ({ page }) => {
  // Log in as admin
  await page.goto('/login');
  await page.getByTestId('email-input').fill('admin@test.com');
  await page.getByTestId('password-input').fill('AdminPass1!');
  await page.getByTestId('login-button').click();
  await page.waitForURL('/dashboard');

  await page.goto('/admin');
  await expect(page.getByTestId('admin-user-table')).toBeVisible();
  await expect(page.getByTestId('admin-user-row-u1')).toBeVisible();
});

// A3: Invite form validates required fields
test('invite form shows error when fields are empty', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('admin@test.com');
  await page.getByTestId('password-input').fill('AdminPass1!');
  await page.getByTestId('login-button').click();
  await page.waitForURL('/dashboard');

  await page.goto('/admin');
  await page.getByTestId('admin-invite-submit').click();

  await expect(page.locator('.field-error')).toContainText('Name and email are required');
});

// A4: Invite form rejects duplicate email
test('invite form rejects duplicate email address', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('admin@test.com');
  await page.getByTestId('password-input').fill('AdminPass1!');
  await page.getByTestId('login-button').click();
  await page.waitForURL('/dashboard');

  await page.goto('/admin');
  await page.getByTestId('admin-invite-name').fill('Duplicate User');
  await page.getByTestId('admin-invite-email').fill('alice@company.com');
  await page.getByTestId('admin-invite-submit').click();

  await expect(page.locator('.field-error')).toContainText('A user with this email already exists');
});

// A5: Search filters user table by name
test('search input filters users by name', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('admin@test.com');
  await page.getByTestId('password-input').fill('AdminPass1!');
  await page.getByTestId('login-button').click();
  await page.waitForURL('/dashboard');

  await page.goto('/admin');
  await page.getByTestId('admin-search-input').fill('Alice');

  // Should show rows containing "Alice" and hide others
  await expect(page.getByTestId('admin-user-row-u1')).toBeVisible();
  await expect(page.getByTestId('admin-user-row-u2')).not.toBeVisible();
});

// A6: Role filter narrows table to selected role
test('role filter shows only matching roles', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('admin@test.com');
  await page.getByTestId('password-input').fill('AdminPass1!');
  await page.getByTestId('login-button').click();
  await page.waitForURL('/dashboard');

  await page.goto('/admin');
  await page.getByTestId('admin-role-filter').selectOption('admin');

  await expect(page.getByTestId('admin-user-row-u1')).toBeVisible();
  await expect(page.getByTestId('admin-user-row-u2')).not.toBeVisible();
});

// A7: Seed reset restores default data
test('seed reset button restores default user data', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('admin@test.com');
  await page.getByTestId('password-input').fill('AdminPass1!');
  await page.getByTestId('login-button').click();
  await page.waitForURL('/dashboard');

  await page.goto('/admin');
  await page.getByTestId('admin-seed-reset').click();

  await expect(page.getByTestId('toast-message-0')).toBeVisible();
  await expect(page.getByTestId('toast-message-0')).toHaveText('Data reset to default seed.');
});
