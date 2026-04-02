import {
  createSingleLessonModule,
  createPracticeLink,
  createExerciseLab,
  routes,
} from "../shared";

export const pageObjectsAndMultiFileGenerationModule = createSingleLessonModule({
  index: 8,
  title: "Page Objects & Multi-File Generation",
  subtitle: "Generate POMs and tests together using Copilot Edits",
  icon: "🏗️",
  estimatedMinutes: 14,
  learningObjectives: [
    "Use Copilot Edits mode to generate a Page Object and its test file simultaneously",
    "Create a .prompt.md template for POM generation that your team can reuse",
    "Use Copilot Vision (screenshot paste) to generate locators from the UI",
  ],
  lesson: {
    title: "Page Objects & Multi-File Generation",
    subtitle: "Generate POMs and tests together using Copilot Edits",
    estimatedMinutes: 14,
    sections: [
      {
        type: "text",
        heading: "When You Need a Page Object",
        content:
          "Rule of thumb: when 3+ tests hit the same page, extract a POM. Before that, inline selectors are simpler and good enough. LLMs handle flat inline tests better than multi-file POM architectures for simple cases. But when you have multiple tests sharing the same selectors, a POM prevents duplication and makes maintenance easier. One selector change in the POM fixes every test that uses it.",
      },
      {
        type: "code",
        heading: "POM Pattern for Copilot",
        language: "typescript",
        code: `import { type Page, type Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.submitButton = page.getByRole("button", { name: "Log In" });
    this.errorMessage = page.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}

// Key patterns:
// - readonly locators as class properties
// - constructor takes Page, assigns all locators
// - Action methods for user interactions (goto, login)
// - Assertion methods with expect (expectError)
// - This is the seed template for all other POMs`,
      },
      {
        type: "text",
        heading: "Copilot Edits: Multi-File Generation",
        content:
          "Copilot Edits mode (Ctrl+Shift+I) lets you prompt Copilot to create or modify multiple files at once. For POM + test: (1) Open the Edits panel. (2) Add the source page file and an existing POM as context (drag/drop or \"Add Files\"). (3) Prompt: \"Create a ProductsPage class and a products-search.spec.ts that uses it. Follow the LoginPage pattern.\" Copilot generates both files as diffs you accept or reject. This is dramatically faster than generating each file separately and manually wiring them together.",
      },
      {
        type: "code",
        heading: "An Edits Prompt",
        language: "text",
        code: `Create two files:

1. tests/pages/ProductsPage.ts — Page Object for the products page
   - Follow the pattern in #file:tests/pages/LoginPage.ts
   - Locators: searchInput (getByTestId('search-input')),
     searchButton (getByTestId('search-button')),
     resultCount (getByTestId('result-count')),
     resultCards (getByTestId('result-card'))
   - Methods: goto(), search(term), getResultCount(),
     expectResultsContain(text)

2. tests/e2e/products-search.spec.ts — Tests using ProductsPage
   - Test: search for 'Widget' shows matching results
   - Test: empty search shows all products
   - Test: no-match search shows empty state
   - Import and use ProductsPage, not raw selectors`,
      },
      {
        type: "text",
        heading: "Screenshot to Locators",
        content:
          "Paste a screenshot of any practice app page into Copilot Chat. Ask: \"Generate a Page Object Model class for this page. Include locators for all visible interactive elements. Use getByRole for buttons and links, getByLabel for form fields.\" Research finding: LLMs achieve >70% element recognition from screenshots. Providing an existing POM as template brings accuracy much higher. This is especially useful when you inherit a UI with no documentation — screenshot it, generate a POM, then verify the locators against the real page.",
      },
      {
        type: "callout",
        variant: "info",
        heading: "Research Finding: POM Accuracy",
        content:
          "An arXiv study (2026) found LLMs achieve 32-54% accuracy on POM generation from scratch, but >70% element recognition. The gap closes dramatically when you provide an existing POM as a pattern. This is why the LoginPage template is so important — it is the seed that makes all other POMs better.",
      },
    ],
    quiz: {
      questions: [
        {
          question:
            "When should you introduce a Page Object instead of using inline selectors?",
          options: [
            "Always — every test should use a POM",
            "When 3 or more tests hit the same page — before that, inline is simpler",
            "Only when the page has more than 10 interactive elements",
            "Only when using Copilot Edits mode",
          ],
          correctIndex: 1,
          explanation:
            "The rule of thumb is 3+ tests sharing the same page selectors. Before that threshold, inline selectors are simpler and easier to maintain. POMs add a layer of indirection that is only worth it when it prevents real duplication.",
        },
        {
          question:
            "What is the most reliable way to get Copilot to generate a good POM?",
          options: [
            "Use the /tests command on the page source",
            "Provide an existing POM as a template — Copilot extends known patterns better than inventing from scratch",
            "Paste the complete HTML source",
            "Use CSS class names for precision",
          ],
          correctIndex: 1,
          explanation:
            "Research shows LLMs extend existing patterns reliably but struggle to invent good POM architecture from scratch. Providing a LoginPage template raises POM generation accuracy significantly.",
        },
      ],
    },
    exercise: {
      title: "Generate POM + Test in One Shot",
      description:
        "Use Copilot Edits to generate a ProductsPage POM class and a products-search.spec.ts that uses it. Provide the LoginPage POM as a pattern reference. Run the test. Review: did Copilot follow the POM pattern correctly?",
      starterCode: `// ---- File 1: tests/pages/LoginPage.ts (existing pattern) ----
import { type Page, type Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.submitButton = page.getByRole("button", { name: "Log In" });
    this.errorMessage = page.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}

// ---- File 2: tests/pages/ProductsPage.ts (TODO) ----
// TODO: Use Copilot Edits to generate this POM.
// Follow the LoginPage pattern above.
// Locators: searchInput, searchButton, resultCount, resultCards
// Methods: goto(), search(term), getResultCount(), expectResultsContain(text)

// ---- File 3: tests/e2e/products-search.spec.ts (TODO) ----
// TODO: Use Copilot Edits to generate tests that import ProductsPage.
// Tests: search for 'Widget', empty search, no-match search`,
      solutionCode: `// ---- File 1: tests/pages/ProductsPage.ts ----
import { type Page, type Locator, expect } from "@playwright/test";

export class ProductsPage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly resultCount: Locator;
  readonly resultCards: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByTestId("search-input");
    this.searchButton = page.getByTestId("search-button");
    this.resultCount = page.getByTestId("result-count");
    this.resultCards = page.getByTestId("result-card");
  }

  async goto() {
    await this.page.goto("/products");
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async getResultCount(): Promise<number> {
    const text = await this.resultCount.textContent();
    return parseInt(text ?? "0", 10);
  }

  async expectResultsContain(text: string) {
    await expect(this.resultCards.first()).toContainText(text);
  }
}

// ---- File 2: tests/e2e/products-search.spec.ts ----
import { test, expect } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";

test.describe("Products Search", () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    await productsPage.goto();
  });

  test("should show matching results when searching for 'Widget'", async () => {
    await productsPage.search("Widget");

    const count = await productsPage.getResultCount();
    expect(count).toBeGreaterThan(0);
    await productsPage.expectResultsContain("Widget");
  });

  test("should show all products on empty search", async () => {
    await productsPage.search("");

    const count = await productsPage.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  test("should show empty state for no-match search", async ({ page }) => {
    await productsPage.search("xyznonexistent");

    const count = await productsPage.getResultCount();
    expect(count).toBe(0);
    await expect(page.getByText("No products found")).toBeVisible();
  });
});`,
      hints: [
        "Add LoginPage.ts to the Edits context so Copilot can see the pattern",
        "The products page uses data-testid attributes: search-input, search-button, result-count, result-card",
        "Ask Copilot to generate both files in a single Edits prompt",
      ],
      lab: createExerciseLab(
        "e2e/copilot-first-testing/lesson-08-products-pom.spec.ts",
        "pnpm exec playwright test e2e/copilot-first-testing/lesson-08-products-pom.spec.ts --project=chromium",
        [
          "ProductsPage POM follows the same pattern as LoginPage",
          "Test file imports and uses ProductsPage, not raw selectors",
          "Search test verifies result count and matching cards",
          "Both files generated via Copilot Edits, not written manually",
        ],
      ),
    },
    promptTemplates: [
      {
        label: "Generate POM + Test",
        context:
          "Copilot Edits prompt for simultaneous POM and test file generation.",
        prompt: `Create two files:

1. tests/pages/[Name]Page.ts
   - Follow the pattern in #file:tests/pages/LoginPage.ts
   - Locators: [LIST LOCATORS with selector strategy]
   - Methods: goto(), [LIST ACTION METHODS]

2. tests/e2e/[feature].spec.ts
   - Import and use [Name]Page
   - Test: [SCENARIO 1]
   - Test: [SCENARIO 2]
   - Each test independent, proper assertions`,
      },
    ],
    practiceLink: createPracticeLink(
      routes.products,
      "Open the products page",
      "Inspect the search input, button, result cards, and count before generating the POM.",
    ),
    narrationScript: {
      intro:
        "Single-file test generation is great for getting started. But real projects need shared locators across multiple tests. This lesson teaches Copilot to generate Page Objects and tests together.",
      steps: [
        {
          text: "Start with the LoginPage POM as your pattern. This is the template that all other POMs will follow: readonly locator properties, constructor taking Page, action methods, and assertion methods.",
          duration: 16,
        },
        {
          text: "Open Copilot Edits mode. Add the LoginPage POM and the products page source as context. Prompt Copilot to generate both a ProductsPage POM and a test file that uses it.",
          duration: 18,
        },
        {
          text: "Review the generated POM: are locators readonly? Do methods use proper async/await? Does the test file import the POM instead of using raw selectors?",
          duration: 16,
        },
        {
          text: "Run the tests. If selectors are wrong, the POM is the single place to fix them. This is the maintenance advantage that justifies the extra file.",
          duration: 14,
        },
      ],
      outro:
        "Multi-file generation and Page Objects give your test suite structure. But before you scale up, you need to recognize what AI gets wrong. Next: the 8 anti-patterns that every AI-generated test should be reviewed for.",
    },
  },
});
