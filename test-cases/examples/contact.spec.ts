import { test, expect } from '@playwright/test';

// F1: Contact form loads with all fields visible
test('contact form loads with all fields visible', async ({ page }) => {
  await page.goto('/contact');

  await expect(page.getByTestId('name-input')).toBeVisible();
  await expect(page.getByTestId('contact-email-input')).toBeVisible();
  await expect(page.getByTestId('phone-input')).toBeVisible();
  await expect(page.getByTestId('subject-select')).toBeVisible();
  await expect(page.getByTestId('message-input')).toBeVisible();
  await expect(page.getByTestId('submit-button')).toBeVisible();
});

// F2: Empty submit shows all required field errors (not phone)
test('empty submission shows errors for all required fields', async ({ page }) => {
  await page.goto('/contact');

  await page.getByTestId('submit-button').click();

  await expect(page.getByTestId('name-error')).toBeVisible();
  await expect(page.getByTestId('contact-email-error')).toBeVisible();
  await expect(page.getByTestId('subject-error')).toBeVisible();
  await expect(page.getByTestId('message-error')).toBeVisible();

  // Phone is optional — no error should appear
  await expect(page.getByTestId('phone-error')).not.toBeVisible();
});

// F3: Name minimum length validation
test('short name shows minimum length error', async ({ page }) => {
  await page.goto('/contact');

  await page.getByTestId('name-input').fill('A');
  await page.getByTestId('contact-email-input').fill('test@example.com');
  await page.getByTestId('subject-select').selectOption('General');
  await page.getByTestId('message-input').fill('This message is long enough for validation.');
  await page.getByTestId('submit-button').click();

  await expect(page.getByTestId('name-error'))
    .toContainText('Name must be at least 2 characters');
});

// F4: Email format validation
test('invalid email format shows validation error', async ({ page }) => {
  await page.goto('/contact');

  await page.getByTestId('name-input').fill('Test User');
  await page.getByTestId('contact-email-input').fill('bad-format');
  await page.getByTestId('subject-select').selectOption('General');
  await page.getByTestId('message-input').fill('This message is long enough for validation.');
  await page.getByTestId('submit-button').click();

  await expect(page.getByTestId('contact-email-error'))
    .toContainText('Please enter a valid email address');
});

// F5: Phone format validation (optional field)
test('invalid phone format shows format error', async ({ page }) => {
  await page.goto('/contact');

  await page.getByTestId('name-input').fill('Test User');
  await page.getByTestId('contact-email-input').fill('test@example.com');
  await page.getByTestId('phone-input').fill('123');
  await page.getByTestId('subject-select').selectOption('Support');
  await page.getByTestId('message-input').fill('This message is long enough for validation.');
  await page.getByTestId('submit-button').click();

  await expect(page.getByTestId('phone-error'))
    .toContainText('Phone must be xxx-xxx-xxxx');
});

// F6: Message minimum length validation
test('short message shows minimum length error', async ({ page }) => {
  await page.goto('/contact');

  await page.getByTestId('name-input').fill('Test User');
  await page.getByTestId('contact-email-input').fill('test@example.com');
  await page.getByTestId('subject-select').selectOption('Sales');
  await page.getByTestId('message-input').fill('Too short');
  await page.getByTestId('submit-button').click();

  await expect(page.getByTestId('message-error'))
    .toContainText('Message must be at least 20 characters');
});

// F7: Happy path — successful submission clears form
test('valid form submission shows success and clears fields', async ({ page }) => {
  await page.goto('/contact');

  await page.getByTestId('name-input').fill('Test User');
  await page.getByTestId('contact-email-input').fill('test@example.com');
  await page.getByTestId('subject-select').selectOption('Support');
  await page.getByTestId('message-input').fill(
    'I need help with my account settings and preferences please.'
  );
  await page.getByTestId('submit-button').click();

  await expect(page.getByTestId('success-message'))
    .toContainText("Thank you! We'll respond within 24 hours.");

  await expect(page.getByTestId('name-input')).toHaveValue('');
  await expect(page.getByTestId('contact-email-input')).toHaveValue('');
  await expect(page.getByTestId('message-input')).toHaveValue('');
});
