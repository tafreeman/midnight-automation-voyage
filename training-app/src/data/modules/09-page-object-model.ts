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
  exercise: {
    title: "Extract a Page Object",
    description: "Refactor this inline test to use the Page Object Model. Move the repeated selectors and actions into a ContactPage class.",
    starterCode: `import { test, expect } from '@playwright/test';

// TODO: Create a ContactPage class that encapsulates:
// - Selectors for name, email, message fields and submit button
// - A fillForm() method
// - A submit() method
// - A getSuccessMessage() method

test('should submit contact form', async ({ page }) => {
  await page.goto('/contact');
  await page.locator('[data-testid="contact-name"]').fill('Jane');
  await page.locator('[data-testid="contact-email"]').fill('jane@test.com');
  await page.locator('[data-testid="contact-message"]').fill('Hello!');
  await page.locator('[data-testid="contact-submit"]').click();
  await expect(page.locator('[data-testid="success-msg"]')).toBeVisible();
});`,
    solutionCode: `import { test, expect, Page } from '@playwright/test';

class ContactPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/contact');
  }

  async fillForm(name: string, email: string, message: string) {
    await this.page.locator('[data-testid="contact-name"]').fill(name);
    await this.page.locator('[data-testid="contact-email"]').fill(email);
    await this.page.locator('[data-testid="contact-message"]').fill(message);
  }

  async submit() {
    await this.page.locator('[data-testid="contact-submit"]').click();
  }

  async getSuccessMessage() {
    return this.page.locator('[data-testid="success-msg"]');
  }
}

test('should submit contact form', async ({ page }) => {
  const contactPage = new ContactPage(page);
  await contactPage.goto();
  await contactPage.fillForm('Jane', 'jane@test.com', 'Hello!');
  await contactPage.submit();
  await expect(await contactPage.getSuccessMessage()).toBeVisible();
});`,
    hints: [
      "Create a class that takes the Page object in its constructor",
      "Each repeated selector should become a method on the class",
      "Group related actions (like filling a form) into a single method",
      "The test should read like plain English after refactoring",
    ],
  },
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
