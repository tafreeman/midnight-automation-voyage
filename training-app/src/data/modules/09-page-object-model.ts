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
  ]
};
