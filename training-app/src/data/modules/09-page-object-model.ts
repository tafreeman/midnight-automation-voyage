import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 6,
  title: "Page Object Model",
  subtitle: "Organizing tests for long-term maintainability",
  icon: "🏗️",
  audience: "Developers — Non-coders: awareness only",
  sections: [
    {
      heading: "Why POM?",
      content: "Page Object Model encapsulates page interactions into reusable classes. When the UI changes, you update one class instead of every test that touches that page. Think of it as a contract: 'This page exposes these actions and these elements.'",
    },
    {
      heading: "POM Structure",
      content: "Each page gets a class. Locators are defined once. Actions become methods. Tests read like user stories.",
      code: `// e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
readonly page: Page;
readonly emailInput: Locator;
readonly passwordInput: Locator;
readonly loginButton: Locator;
readonly errorMessage: Locator;

constructor(page: Page) {
  this.page = page;
  this.emailInput = page.getByTestId('email-input');
  this.passwordInput = page.getByTestId('password-input');
  this.loginButton = page.getByTestId('login-button');
  this.errorMessage = page.getByTestId('error-message');
}

async goto() {
  await this.page.goto('/login');
}

async login(email: string, password: string) {
  await this.emailInput.fill(email);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
}
}`,
      codeLanguage: "typescript",
    },
    {
      heading: "Copilot POM Generation",
      content: "Use Copilot Chat to generate entire Page Objects from a description of the page. This is one of the highest-value Copilot use cases.",
      code: `// Copilot Chat prompt:
"Generate a Playwright Page Object Model class for a
product checkout page with these elements:
- Cart items list (data-testid='cart-items')
- Quantity inputs per item (data-testid='qty-{id}')
- Remove buttons per item (data-testid='remove-{id}')
- Subtotal display (data-testid='subtotal')
- Checkout button (data-testid='checkout-btn')
- Promo code input and apply button

Include methods: updateQuantity, removeItem, applyPromo,
getSubtotal, proceedToCheckout"`,
      codeLanguage: "typescript",
      tip: "List every data-testid in the prompt. Copilot can't see your HTML, so you must provide the selectors explicitly."
    }
  ],
  practiceLink: {
    url: "http://localhost:5173/contact",
    label: "Refactor the contact form test into a POM",
    description: "Extract repeated selectors from your contact form test into a page object.",
  },
  quiz: {
    question: "What is the primary benefit of the Page Object Model pattern for test maintenance?",
    options: [
      "It makes tests run in parallel automatically",
      "It centralizes selectors so a UI change only requires updating one place instead of every test",
      "It eliminates the need for assertions",
      "It generates test data automatically",
    ],
    correctIndex: 1,
    explanation: "POM encapsulates page selectors and actions in a single class. When the UI changes (e.g., a button's data-testid is renamed), you update the page object once rather than hunting through dozens of test files.",
  },
  exercises: [
    {
      difficulty: 'beginner',
      title: 'Use a Page Object in a Test',
      description: 'A ContactPage class has been provided for you. Write a test that uses the page object methods instead of raw selectors.',
      starterCode: `import { test, expect, Page } from '@playwright/test';

// This Page Object is provided — study its methods
class ContactPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/contact');
  }

  async fillForm(name: string, email: string, message: string) {
    await this.page.getByTestId('name-input').fill(name);
    await this.page.getByTestId('contact-email-input').fill(email);
    await this.page.getByTestId('message-input').fill(message);
  }

  async selectSubject(subject: string) {
    await this.page.getByTestId('subject-select').selectOption(subject);
  }

  async submit() {
    await this.page.getByTestId('submit-button').click();
  }

  get successMessage() {
    return this.page.getByTestId('success-message');
  }
}

// TODO: Write a test using the ContactPage class above
// 1. Create a ContactPage instance
// 2. Navigate to the contact page
// 3. Fill the form with valid data (name, email, message of 20+ chars)
// 4. Select a subject
// 5. Submit and assert the success message is visible
test('should submit contact form successfully', async ({ page }) => {

});`,
      solutionCode: `import { test, expect, Page } from '@playwright/test';

class ContactPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/contact');
  }

  async fillForm(name: string, email: string, message: string) {
    await this.page.getByTestId('name-input').fill(name);
    await this.page.getByTestId('contact-email-input').fill(email);
    await this.page.getByTestId('message-input').fill(message);
  }

  async selectSubject(subject: string) {
    await this.page.getByTestId('subject-select').selectOption(subject);
  }

  async submit() {
    await this.page.getByTestId('submit-button').click();
  }

  get successMessage() {
    return this.page.getByTestId('success-message');
  }
}

test('should submit contact form successfully', async ({ page }) => {
  const contactPage = new ContactPage(page);
  await contactPage.goto();
  await contactPage.fillForm('Jane Doe', 'jane@test.com', 'This is a test message that is long enough.');
  await contactPage.selectSubject('General');
  await contactPage.submit();
  await expect(contactPage.successMessage).toBeVisible();
});`,
      hints: [
        'Create the page object with: const contactPage = new ContactPage(page)',
        'Call contactPage.goto() to navigate',
        'The message must be at least 20 characters to pass validation',
        'Use contactPage.successMessage (a getter, not a method) for the assertion',
      ],
    },
    {
      difficulty: 'intermediate',
      title: 'Extract a Contact Page Object',
      description: 'Refactor this inline test into the Page Object Model pattern. Move all selectors and actions into a ContactPage class.',
      starterCode: `import { test, expect } from '@playwright/test';

// TODO: Create a ContactPage class that encapsulates:
// - Selectors for name, email, subject, message fields and submit button
// - A goto() method
// - A fillForm() method
// - A selectSubject() method
// - A submit() method
// - A successMessage getter

test('should submit contact form', async ({ page }) => {
  await page.goto('/contact');
  await page.getByTestId('name-input').fill('Jane Doe');
  await page.getByTestId('contact-email-input').fill('jane@test.com');
  await page.getByTestId('subject-select').selectOption('Support');
  await page.getByTestId('message-input').fill('I need help with my order please.');
  await page.getByTestId('submit-button').click();
  await expect(page.getByTestId('success-message')).toBeVisible();
});`,
      solutionCode: `import { test, expect, Page } from '@playwright/test';

class ContactPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/contact');
  }

  async fillForm(name: string, email: string, message: string) {
    await this.page.getByTestId('name-input').fill(name);
    await this.page.getByTestId('contact-email-input').fill(email);
    await this.page.getByTestId('message-input').fill(message);
  }

  async selectSubject(subject: string) {
    await this.page.getByTestId('subject-select').selectOption(subject);
  }

  async submit() {
    await this.page.getByTestId('submit-button').click();
  }

  get successMessage() {
    return this.page.getByTestId('success-message');
  }
}

test('should submit contact form', async ({ page }) => {
  const contact = new ContactPage(page);
  await contact.goto();
  await contact.fillForm('Jane Doe', 'jane@test.com', 'I need help with my order please.');
  await contact.selectSubject('Support');
  await contact.submit();
  await expect(contact.successMessage).toBeVisible();
});`,
      hints: [
        'Create a class that accepts Page in its constructor',
        'Each getByTestId() call should become a method on the class',
        'Group related actions (form fill) into a single method with parameters',
        'Use a getter (get successMessage()) for elements you only read, not interact with',
      ],
    },
    {
      difficulty: 'advanced',
      title: 'Build an Orders Page Object with Sort and Filter',
      description: 'Create a full-featured OrdersPage class for the data table. Include methods for sorting, filtering, pagination, and row data extraction.',
      starterCode: `import { test, expect, Page, Locator } from '@playwright/test';

// TODO: Create an OrdersPage class with:
// - goto() method
// - sortBy(column: 'id' | 'customer' | 'amount' | 'date' | 'status') method
// - filterByStatus(status: string) method
// - getRowCount() method that returns the displayed row count number
// - getRowData(index: number) method returning { id, customer, amount, date, status }
// - goToPage(pageNum: number) method for pagination

test.describe('Orders Page', () => {
  test('sort by amount descending', async ({ page }) => {
    // TODO: Use OrdersPage to navigate, sort by amount, and verify order
  });

  test('filter by shipped status', async ({ page }) => {
    // TODO: Use OrdersPage to filter by "Shipped" and assert row count changes
  });
});`,
      solutionCode: `import { test, expect, Page, Locator } from '@playwright/test';

class OrdersPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/orders');
  }

  async sortBy(column: 'id' | 'customer' | 'amount' | 'date' | 'status') {
    await this.page.getByTestId(\`col-\${column}\`).click();
  }

  async filterByStatus(status: string) {
    await this.page.getByTestId('status-filter').selectOption(status);
  }

  async getRowCount(): Promise<number> {
    return await this.page.getByTestId('table-row').count();
  }

  async getRowData(index: number) {
    const row = this.page.getByTestId('table-row').nth(index);
    return {
      id: await row.getByTestId('cell-id').textContent(),
      customer: await row.getByTestId('cell-customer').textContent(),
      amount: await row.getByTestId('cell-amount').textContent(),
      date: await row.getByTestId('cell-date').textContent(),
      status: await row.getByTestId('cell-status').textContent(),
    };
  }

  async goToPage(pageNum: number) {
    await this.page.getByTestId(\`page-\${pageNum}\`).click();
  }
}

test.describe('Orders Page', () => {
  test('sort by amount descending', async ({ page }) => {
    const orders = new OrdersPage(page);
    await orders.goto();
    await orders.sortBy('amount');
    await orders.sortBy('amount'); // Click twice for descending
    const first = await orders.getRowData(0);
    const second = await orders.getRowData(1);
    const firstAmount = parseFloat(first.amount!.replace('$', ''));
    const secondAmount = parseFloat(second.amount!.replace('$', ''));
    expect(firstAmount).toBeGreaterThanOrEqual(secondAmount);
  });

  test('filter by shipped status', async ({ page }) => {
    const orders = new OrdersPage(page);
    await orders.goto();
    const totalRows = await orders.getRowCount();
    await orders.filterByStatus('Shipped');
    const filteredRows = await orders.getRowCount();
    expect(filteredRows).toBeLessThan(totalRows);
  });
});`,
      hints: [
        'Column header testids follow the pattern: col-{columnName}',
        'Cell testids follow the pattern: cell-{columnName}',
        'Use .nth(index) to get a specific row from the table',
        'Click a column header twice to toggle to descending sort',
        'Parse amount strings by removing the $ prefix and using parseFloat()',
      ],
    },
  ],
  promptTemplates: [
    {
      label: "Extract Page Object from Test",
      context: "Give Copilot an existing test and ask it to refactor into the POM pattern.",
      prompt: "Refactor this Playwright test to use the Page Object Model pattern. Extract all selectors and page interactions into a separate class. The class should have methods for each user action and getters for key elements. Keep the test file clean — it should only contain test logic, not selectors.",
    },
    {
      label: "Generate Page Object Skeleton",
      context: "Create a page object class from a description of the page.",
      prompt: "Create a Playwright Page Object class for a checkout page. The page has: shipping address fields (name, street, city, state, zip), a payment section (card number, expiry, CVV), an order summary sidebar, and a 'Place Order' button. Include methods for fillShippingAddress(), fillPayment(), getOrderTotal(), and placeOrder(). Use data-testid selectors.",
    },
  ],
};
