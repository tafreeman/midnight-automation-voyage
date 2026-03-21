import { test, expect } from '@playwright/test';

// L1: Login page loads with all elements
test('login page renders with all form elements', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByTestId('email-input')).toBeVisible();
  await expect(page.getByTestId('password-input')).toBeVisible();
  await expect(page.getByTestId('login-button')).toBeVisible();
  await expect(page.getByTestId('login-button')).toBeDisabled();
});

// L2: Empty form shows required field errors
test('empty form submission shows required field errors', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('login-button').click({ force: true });

  await expect(page.getByTestId('email-error')).toContainText('Email is required');
  await expect(page.getByTestId('password-error')).toContainText('Password is required');
});

// L3: Invalid email format shows format error
test('invalid email format shows validation error', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('email-input').fill('not-an-email');
  await page.getByTestId('password-input').fill('ValidPassword1');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('email-error'))
    .toContainText('Please enter a valid email address');
});

// L4: Short password shows length error
test('short password shows minimum length error', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('short');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('password-error'))
    .toContainText('Password must be at least 8 characters');
});

// L5: Wrong credentials show authentication error
test('wrong credentials show generic authentication error', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('WrongPassword1');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('error-message'))
    .toContainText('Invalid email or password');
  await expect(page).toHaveURL(/.*\/login/);
});

// L6: Account locks after 5 failed attempts
test('account locks after 5 failed login attempts', async ({ page }) => {
  await page.goto('/login');

  for (let i = 0; i < 5; i++) {
    await page.getByTestId('email-input').fill('locktest@test.com');
    await page.getByTestId('password-input').fill('WrongPassword1');
    await page.getByTestId('login-button').click();

    if (i < 4) {
      await expect(page.getByTestId('error-message')).toBeVisible();
      await page.getByTestId('email-input').clear();
      await page.getByTestId('password-input').clear();
    }
  }

  await expect(page.getByTestId('lockout-message'))
    .toContainText('Account locked. Please try again in 15 minutes.');
  await expect(page.getByTestId('login-button')).toBeDisabled();
});

// L7: Valid credentials redirect to dashboard
test('valid login redirects to dashboard with welcome message', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  await expect(page).toHaveURL(/.*\/dashboard/);
  await expect(page.getByTestId('dashboard-heading'))
    .toContainText('Welcome, Test User');
});
