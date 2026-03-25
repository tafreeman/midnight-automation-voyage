import {
  createExerciseLab,
  createPracticeLink,
  createSingleLessonModule,
  firstPlaywrightTestRoutes,
} from "../shared";

export const askCopilotForAUsefulDraftModule = createSingleLessonModule({
  index: 7,
  title: "Ask Copilot for a Useful Draft",
  subtitle: "Use PAGE prompts so the generated test starts close to reviewable",
  icon: "📝",
  estimatedMinutes: 15,
  learningObjectives: [
    "Use a prompt frame that gives Copilot the page, actions, guardrails, and evidence to target",
    "Keep the generated output grounded in selectors and acceptance criteria from the practice app",
    "Review AI output as a first draft instead of a finished answer",
  ],
  lesson: {
    title: "Ask Copilot for a Useful Draft",
    subtitle: "Use PAGE prompts so the generated test starts close to reviewable",
    estimatedMinutes: 15,
    sections: [
      {
        type: "text",
        heading: "Use PAGE, Not Vibes",
        content:
          "This course uses a four-part prompt shape called PAGE. The table below shows what goes in each part and how it applies to the products page.",
      },
      {
        type: "table",
        heading: "The PAGE Prompt Shape",
        headers: ["Part", "What belongs there", "Products-page example"],
        rows: [
          ["Page", "Where the flow starts and what UI is on screen", "Products page with search input, search button, and result cards"],
          ["Actions", "What the user does", "Search for Widget and submit the query"],
          ["Guardrails", "Rules the test must obey", "Use Playwright Test, use stable selectors, avoid waitForTimeout"],
          ["Evidence", "What must be proven after the action", "Result count updates and visible cards contain Widget"],
        ],
      },
      {
        type: "code",
        heading: "A Prompt Worth Reusing",
        language: "text",
        code: `Page:
Products page in the practice app. The page has data-testid selectors for search-input, search-button, result-count, and result-card.

Actions:
Open the page, search for "Widget", and submit the search.

Guardrails:
Use Playwright Test and TypeScript.
Use getByTestId selectors where they exist.
Do not use waitForTimeout.

Evidence:
Assert the result count updates and the visible product cards contain the word "Widget".`,
      },
      {
        type: "callout",
        variant: "warning",
        heading: "Guardrails Are Not Optional",
        content:
          "If you leave out the rules, Copilot will happily invent brittle selectors, weak assertions, or unnecessary waits. Be explicit before the draft is written instead of cleaning up preventable mistakes later.",
      },
      {
        type: "text",
        heading: "The CARD Alternative",
        content:
          "PAGE works well for quick drafts. For more complex scenarios — multi-step flows, edge cases, validation rules — try CARD: **C**ontext (what page or component), **A**ctions (the user flow steps), **R**ules (business requirements and validation logic), **D**ata (test data, edge cases, and boundary conditions).\n\nCARD maps directly to acceptance criteria on tickets and produces tests a reviewer can trace back to the story. Use PAGE for simple one-page checks; switch to CARD when the acceptance criteria have multiple conditions.",
      },
      {
        type: "code",
        heading: "A CARD Prompt for Login Validation",
        language: "text",
        code: "// CONTEXT: Login page with email + password form\n// ACTIONS: Enter wrong password → see error → retry with correct → land on dashboard\n// RULES: Show error on invalid credentials, lock account after 5 failed attempts\n// DATA: user@test.com, wrong password \"badpass\", correct password from test fixtures\n//\n// Generate a Playwright test for this flow using data-testid selectors.",
      },
      {
        type: "text",
        heading: "Inline Comment Triggers",
        content:
          "In the editor, write a descriptive comment above an empty test block. Copilot auto-completes the code based on your description. The more specific your comment, the better the output. Always mention the selector strategy and expected text.",
      },
      {
        type: "code",
        heading: "Comment-Driven Autocomplete",
        language: "typescript",
        code: "// Test: user sees validation error when submitting empty login form\n// Selectors: data-testid=\"email-input\", \"password-input\", \"login-btn\", \"error-msg\"\n// Expected: error message contains \"Email is required\"\ntest('shows validation on empty submit', async ({ page }) => {\n  // Copilot auto-completes from here ↓\n});",
      },
      {
        type: "table",
        heading: "Chat Commands Quick Reference",
        headers: ["Command", "When to Use", "Example"],
        rows: [
          ["/tests", "Generate tests for the open file", "Open login.ts → type /tests"],
          ["/fix", "Diagnose a failing test", "Paste the error → type /fix"],
          ["/explain", "Understand unfamiliar code", "Select a test block → type /explain"],
          ["@workspace", "Project-wide test generation", "@workspace generate auth tests"],
          ["#file:path", "Reference a specific file for context", "#file:LoginPage.ts write tests for this page"],
        ],
      },
      {
        type: "callout",
        heading: "The Assertion Trap",
        variant: "warning",
        content:
          "Copilot generates syntactically valid assertions that may test the wrong thing. It does not know your business rules. Always verify: is this asserting what the acceptance criteria require, or just what the page happens to show?\n\n**Anti-pattern:** 'Copilot, what should this test assert?' — it guesses.\n**Correct:** 'Assert that after 5 failed logins, the user sees: Account locked. Contact support.' — specific, verifiable.",
      },
    ],
    quiz: {
      questions: [
        {
          question: "In the PAGE prompt model, what belongs in Evidence?",
          options: [
            "The steps the user clicks through",
            "The selectors available on the page",
            "The proof the finished test must check",
            "The extension names installed in VS Code",
          ],
          correctIndex: 2,
          explanation:
            "Evidence is where you define what the test has to prove after the action. It is the assertion target, not the setup or the clicks.",
        },
        {
          question: "In the CARD prompt formula, what does the 'R' stand for?",
          options: [
            "Results — expected test outcomes",
            "Rules — business requirements and validation logic",
            "Routes — page URLs to navigate",
            "Retries — how many times to rerun on failure",
          ],
          correctIndex: 1,
          explanation:
            "R stands for Rules — the business requirements and validation logic that the test should verify. This maps directly to acceptance criteria on the ticket.",
        },
      ],
    },
    exercise: {
      title: "Draft a Search Test With PAGE",
      description:
        "Use the PAGE structure to turn product-search acceptance criteria into a Playwright draft. The practice app's seed data contains six products matching 'Widget'. Tighten the resulting spec so it proves the search worked.",
      starterCode: `import { test } from "@playwright/test";
import { gotoRoute } from "../support/practice";

test.skip("search returns matching widget products", async ({ page }) => {
  await gotoRoute(page, "/products");

  // TODO: ask Copilot for a draft using a PAGE prompt
  // TODO: fill the search input with "Widget"
  // TODO: submit the search
  // TODO: prove the result count and visible cards match the query
});`,
      solutionCode: `import { test, expect } from "@playwright/test";
import { gotoRoute } from "../support/practice";

test("search returns matching widget products", async ({ page }) => {
  await gotoRoute(page, "/products");
  await page.getByTestId("search-input").fill("Widget");
  await page.getByTestId("search-button").click();

  await expect(page.getByTestId("result-count")).toContainText("6 results found");
  const cards = page.getByTestId("result-card");
  await expect(cards).toHaveCount(6);
  await expect(cards.first()).toContainText("Widget");
});`,
      hints: [
        "Name the exact test IDs in the prompt so Copilot does not guess.",
        "Ask for both the action and the proof in the same prompt.",
        "Verify the expected count by searching for 'Widget' in the browser before you write the assertion.",
      ],
      lab: createExerciseLab(
        "e2e/first-playwright-tests/lesson-07-products-search-draft.spec.ts",
        "pnpm exec playwright test e2e/first-playwright-tests/lesson-07-products-search-draft.spec.ts --project=chromium",
        [
          "The draft is rewritten into a passing Playwright test without test.skip.",
          "The spec checks both the count text and at least one visible matching card.",
          "The finished version uses stable selectors and no arbitrary waits.",
        ],
      ),
    },
    promptTemplates: [
      {
        label: "PAGE: Products Search",
        context: "Use this as the first pass for a generated product-search test.",
        prompt: `Page:
Products page in the practice app. Search field: search-input. Submit button: search-button. Results text: result-count. Product cards: result-card.

Actions:
Open the page, search for "Widget", and submit the search.

Guardrails:
Use Playwright Test with TypeScript.
Use getByTestId selectors.
Do not use waitForTimeout.

Evidence:
Assert the result count updates to 6 results found and the visible cards include the word "Widget".`,
      },
      {
        label: "Tighten a Draft",
        context: "Use this after Copilot gives you a first draft that still feels loose.",
        prompt: `Please tighten this Playwright draft.

Requirements:
- keep the same user flow
- replace weak selectors with the exact test IDs I provide
- add assertions that directly prove the acceptance criteria
- remove any unnecessary waits or comments

Draft:
[PASTE TEST HERE]`,
      },
      {
        label: "CARD: Login Form Test",
        context: "Use when testing a login form with both happy path and validation",
        prompt:
          "Context: React app with login page at /login. Email and password fields have data-testid attributes. Submit button triggers form validation.\n\nActions: Write a Playwright test that tests both successful login and validation errors.\n\nRules: Successful login redirects to /dashboard. Invalid credentials show an error message.\n\nData: Use data-testid selectors. Valid credentials: user@test.com / password123. Test empty field validation too.",
      },
      {
        label: "CARD: Form Validation Test",
        context: "Use when testing forms with multiple validation rules",
        prompt:
          "Context: Contact form with name (required), email (required, valid format), and message (required, min 10 chars) fields.\n\nActions: Write Playwright tests covering all validation rules.\n\nRules: Each invalid submission shows the specific error message next to the field. Valid submission shows success.\n\nData: Use getByRole and getByText for selectors. Test one field at a time. Include boundary values.",
      },
      {
        label: "CARD: Navigation Test",
        context: "Use when testing navigation links across pages",
        prompt:
          "Context: App with navbar containing links to Home, Products, Cart, and Account pages.\n\nActions: Write Playwright tests verifying all navigation links work correctly.\n\nRules: Each link navigates to the correct URL and shows the expected page heading.\n\nData: Use getByRole('link') selectors. Verify URL changes with expect(page).toHaveURL().",
      },
    ],
    practiceLink: createPracticeLink(
      firstPlaywrightTestRoutes.products,
      "Open the products page before you write the PAGE prompt",
      "Use the page itself to confirm the selectors and the visible evidence you want the generated test to prove.",
    ),
    narrationScript: {
      intro:
        "Copilot is most useful when you treat it like a fast first-draft partner. This lesson gives it a clear brief instead of a vague wish.",
      steps: [
        {
          text: "Start on the products page. You can see the search input, button, result count, and product cards that the test needs to reference.",
          navigateTo: "/products",
          highlight: "search-input",
          duration: 18,
        },
        {
          text: "The PAGE structure keeps the prompt anchored. Page and Actions describe the flow. Guardrails and Evidence tell Copilot what a reviewer will insist on later.",
          duration: 18,
        },
        {
          text: "When the draft comes back, check three things: are the selectors real test IDs from the page, does the assertion match the acceptance criteria, and is there an unnecessary wait? Fix any of those before you run it.",
          highlight: "result-count",
          duration: 20,
        },
        {
          text: "PAGE handles simple single-page checks. For flows with multiple conditions — validation rules, edge cases, error paths — switch to CARD: Context, Actions, Rules, Data. CARD maps directly to acceptance criteria on tickets, so a reviewer can trace every assertion back to a requirement.",
          duration: 18,
        },
      ],
      outro:
        "The next lesson shifts from text prompts to recorded browser actions. You will let VS Code capture the flow and then save that output in the right place.",
    },
  },
});
