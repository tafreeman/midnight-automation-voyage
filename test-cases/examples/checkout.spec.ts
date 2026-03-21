import { test, expect } from '@playwright/test';

// Helper: fill shipping form and advance
async function fillShipping(page: import('@playwright/test').Page) {
  await page.goto('/checkout/shipping');
  await page.getByTestId('address-input').fill('123 Main St');
  await page.getByTestId('city-input').fill('Springfield');
  await page.getByTestId('state-select').selectOption('IL');
  await page.getByTestId('zip-input').fill('62701');
  await page.getByTestId('next-button').click();
}

// Helper: fill payment form and advance
async function fillPayment(page: import('@playwright/test').Page) {
  await page.getByTestId('card-input').fill('4111111111111111');
  await page.getByTestId('expiry-input').fill('12/28');
  await page.getByTestId('cvv-input').fill('123');
  await page.getByTestId('next-button').click();
}

// W1: Step 1 loads and accepts shipping info
test('shipping form accepts valid address and advances to payment', async ({ page }) => {
  await fillShipping(page);

  await expect(page).toHaveURL(/.*\/checkout\/payment/);
  await expect(page.getByTestId('step-indicator')).toContainText('Step 2');
});

// W2: Step 2 loads and accepts payment info
test('payment form accepts valid card and advances to review', async ({ page }) => {
  await fillShipping(page);
  await fillPayment(page);

  await expect(page).toHaveURL(/.*\/checkout\/review/);
  await expect(page.getByTestId('step-indicator')).toContainText('Step 3');
});

// W3: Back button preserves shipping data
test('back button preserves previously entered shipping data', async ({ page }) => {
  await page.goto('/checkout/shipping');

  await page.getByTestId('address-input').fill('123 Main St');
  await page.getByTestId('city-input').fill('Springfield');
  await page.getByTestId('state-select').selectOption('IL');
  await page.getByTestId('zip-input').fill('62701');
  await page.getByTestId('next-button').click();

  await expect(page).toHaveURL(/.*\/checkout\/payment/);

  await page.getByTestId('back-button').click();
  await expect(page).toHaveURL(/.*\/checkout\/shipping/);

  await expect(page.getByTestId('address-input')).toHaveValue('123 Main St');
  await expect(page.getByTestId('city-input')).toHaveValue('Springfield');
  await expect(page.getByTestId('state-select')).toHaveValue('IL');
  await expect(page.getByTestId('zip-input')).toHaveValue('62701');
});

// W4: Direct URL to step 3 redirects to step 1
test('direct navigation to review step redirects to shipping', async ({ page }) => {
  await page.goto('/checkout/review');

  await expect(page).toHaveURL(/.*\/checkout\/shipping/);
});

// W5: Review page shows summary of all entered data
test('review page displays shipping and payment summary', async ({ page }) => {
  await fillShipping(page);
  await fillPayment(page);

  await expect(page).toHaveURL(/.*\/checkout\/review/);

  await expect(page.getByTestId('shipping-summary')).toContainText('123 Main St');
  await expect(page.getByTestId('shipping-summary')).toContainText('Springfield');
  await expect(page.getByTestId('shipping-summary')).toContainText('IL');
  await expect(page.getByTestId('shipping-summary')).toContainText('62701');

  await expect(page.getByTestId('payment-summary')).toContainText('1111');
  await expect(page.getByTestId('payment-summary')).toContainText('12/28');
});

// W6: Place order shows confirmation
test('placing order shows confirmation with order number', async ({ page }) => {
  await fillShipping(page);
  await fillPayment(page);

  await expect(page).toHaveURL(/.*\/checkout\/review/);
  await page.getByTestId('place-order-button').click();

  await expect(page).toHaveURL(/.*\/checkout\/confirmation/);
  await expect(page.getByTestId('confirmation-message')).toContainText('Order Confirmed');
  await expect(page.getByTestId('confirmation-number')).toBeVisible();
});
