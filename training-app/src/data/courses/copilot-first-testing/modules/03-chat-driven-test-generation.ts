import {
  createSingleLessonModule,
  createPracticeLink,
  createExerciseLab,
  routes,
} from "../shared";

export const chatDrivenTestGenerationModule = createSingleLessonModule({
  index: 3,
  title: "Chat-Driven Test Generation",
  subtitle: "Use Copilot Chat to generate complete tests from structured descriptions",
  icon: "💬",
  estimatedMinutes: 16,
  learningObjectives: [
    "Use Copilot Chat with @workspace, #file, and #selection to provide rich context",
    "Generate a complete test for a practice app page using a single Chat prompt",
    "Compare output from /tests command vs freeform Chat prompts",
  ],
  lesson: {
    title: "Chat-Driven Test Generation",
    subtitle:
      "Use Copilot Chat to generate complete tests from structured descriptions",
    estimatedMinutes: 16,
    sections: [
      {
        type: "table",
        heading: "Chat Context Variables",
        headers: ["Variable", "What It Does", "Example"],
        rows: [
          [
            "@workspace",
            "Searches your project for relevant code",
            "How are tests structured in this project?",
          ],
          [
            "#file:path",
            "Includes a specific file as context",
            "#file:tests/e2e/auth.spec.ts Follow this pattern",
          ],
          [
            "#selection",
            "Includes the code you highlighted in the editor",
            "Write a test for this component",
          ],
          [
            "#terminalLastCommand",
            "Includes the last terminal output",
            "Fix this test failure",
          ],
        ],
      },
      {
        type: "text",
        heading: "The /tests Command vs Freeform Chat",
        content:
          "The /tests command is quick: select code, type /tests, and get unit-adjacent tests. But for E2E tests, freeform Chat is better because you can include page context, acceptance criteria, selector preferences, and reference existing patterns. The /tests command only sees the selected code, not the broader testing context. When you need Playwright tests that navigate pages, fill forms, and verify outcomes, freeform Chat with rich context variables will consistently produce better results.",
      },
      {
        type: "code",
        heading: "A Complete Chat Prompt and Its Output",
        language: "typescript",
        code: `// ---- Chat Prompt ----
// Generate a Playwright TypeScript test for the contact form at /contact.
//
// Page: /contact — a form with Name, Email, and Message fields.
// Actions: fill all fields, submit the form.
// Guardrails: use getByLabel for inputs, getByRole for buttons, no waits.
// Evidence: success toast appears after valid submission,
//           validation errors appear for empty required fields.
//
// Generate a happy path test and a validation error test.

// ---- Generated Output ----
import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("should submit the form successfully with valid data", async ({ page }) => {
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Message").fill("Hello, I have a question about your services.");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Message sent successfully")).toBeVisible();
  });

  test("should show validation errors for empty required fields", async ({ page }) => {
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Message is required")).toBeVisible();
  });
});`,
      },
      {
        type: "text",
        heading: "Reading and Reviewing the Output",
        content:
          "Before running any generated test, check four things. First, selector choices: are they semantic (getByRole, getByLabel) or fragile (CSS class selectors, nth-child)? Second, assertion correctness: do the assertions match your acceptance criteria, or do they just check that something is visible? Third, test isolation: does each test navigate and set up its own state, or do tests depend on each other? Fourth, anti-patterns: look for waitForTimeout, hardcoded full URLs, or shared mutable state between tests. These four checks catch the majority of Copilot generation mistakes before you ever run the test.",
      },
      {
        type: "code",
        heading: "Richer Context With #file",
        language: "typescript",
        code: `// ---- Chat Prompt With #file References ----
// #file:tests/e2e/auth.spec.ts Follow the patterns in this test file.
// #file:src/pages/Contact.tsx Use this component's structure for context.
//
// Generate a Playwright test for the contact form at /contact.
// Include a happy path test and a validation error test.
// Match the describe/beforeEach/test structure from the auth test.

// ---- Generated Output (follows auth test patterns exactly) ----
import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("should submit successfully with valid inputs", async ({ page }) => {
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Message").fill("I would like to learn more about your products.");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByRole("alert")).toContainText("Message sent");
  });

  test("should display validation errors when submitting empty form", async ({ page }) => {
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Message is required")).toBeVisible();
  });
});

// Key insight: the #file references gave Copilot two things —
// a pattern to follow (auth test structure) and real component
// details (actual field names from Contact.tsx).
// More context = better output.`,
      },
      {
        type: "callout",
        variant: "warning",
        heading: "The Assertion Trap",
        content:
          "Copilot generates syntactically valid assertions that may test the wrong thing. An assertion like expect(heading).toBeVisible() passes for any heading on any page. Always verify: does this assertion actually fail when the feature is broken? Would expect(heading).toHaveText('Message Sent') catch a real bug?",
      },
    ],
    quiz: {
      questions: [
        {
          question:
            "What does #file:tests/e2e/auth.spec.ts do in a Chat prompt?",
          options: [
            "It runs the auth test before generating",
            "It includes that file as context so Copilot can follow its patterns",
            "It imports the auth test into the new test",
            "It locks the auth test from editing",
          ],
          correctIndex: 1,
          explanation:
            "The #file reference includes the contents of that file as context in your Chat prompt, allowing Copilot to see and follow established patterns.",
        },
        {
          question:
            "Why is freeform Chat often better than /tests for E2E test generation?",
          options: [
            "/tests generates slower code",
            "You can provide page context, acceptance criteria, and patterns — /tests only sees selected code",
            "/tests doesn't support TypeScript",
            "Freeform Chat uses a more powerful model",
          ],
          correctIndex: 1,
          explanation:
            "E2E tests need broader context: what pages are involved, what constitutes success, what selectors to use. Freeform Chat lets you provide all of this; /tests only has the selected code snippet.",
        },
      ],
    },
    exercise: {
      title: "Generate a Contact Form Test via Chat",
      description:
        "Write a Chat prompt that generates a complete test for the /contact page. Include: fields to fill, validation rules, success criteria. Do not write any test code yourself. Run the generated test. Fix any failures by re-prompting (not manual editing).",
      starterCode: `import { test, expect } from "@playwright/test";

// TODO: Use Copilot Chat to generate the test body.
// Describe the contact page fields (Name, Email, Message),
// validation rules, and success criteria in your prompt.
// Do NOT write test code manually.

test.describe("Contact Form — Chat Generated", () => {
  // Copilot will generate tests here
});`,
      solutionCode: `import { test, expect } from "@playwright/test";

test.describe("Contact Form — Chat Generated", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("should submit the form successfully with valid data", async ({ page }) => {
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Message").fill("I have a question about your services.");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Message sent successfully")).toBeVisible();
  });

  test("should show validation errors when submitting empty form", async ({ page }) => {
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Message is required")).toBeVisible();
  });

  test("should show email format error for invalid email", async ({ page }) => {
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Message").fill("Test message.");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Please enter a valid email")).toBeVisible();
  });
});`,
      hints: [
        "Name the exact form fields in your prompt: Name, Email, Message",
        "Ask for both happy path and validation tests in one prompt",
        "If selectors are wrong, use #terminalLastCommand to feed the error back",
      ],
      lab: createExerciseLab(
        "e2e/copilot-first-testing/lesson-03-contact-form.spec.ts",
        "pnpm exec playwright test e2e/copilot-first-testing/lesson-03-contact-form.spec.ts --project=chromium",
        [
          "Tests generated by Copilot Chat, not written manually",
          "Happy path test submits form and checks for success feedback",
          "Validation test verifies required field errors appear",
          "All selectors use getByLabel or getByRole (no CSS selectors)",
        ],
      ),
    },
    promptTemplates: [
      {
        label: "Contact Form: Full Generation",
        context:
          "Paste into Copilot Chat to generate a complete contact form test suite.",
        prompt: `Generate a Playwright TypeScript test for the contact form at /contact.

Fields:
- Name (required, text input)
- Email (required, must be valid email format)
- Message (required, textarea)

Tests to generate:
1. Happy path: fill all fields with valid data, submit, verify success feedback
2. Required fields: submit empty form, verify validation messages
3. Email format: enter invalid email, verify format-specific error

Use getByLabel for form inputs, getByRole for buttons.
Each test navigates to /contact independently.
No waitForTimeout or manual waits.`,
      },
      {
        label: "Products Search: With @workspace",
        context:
          "Uses @workspace to let Copilot discover your project patterns.",
        prompt: `@workspace Generate a Playwright test for the products search feature at /products.

Follow the same test patterns used in existing test files.
The search has: a search input, a search button, result cards, and a result count.

Test:
1. Valid search returns matching results and updates count
2. Empty search shows all products
3. No-match search shows empty state`,
      },
    ],
    practiceLink: createPracticeLink(
      routes.contact,
      "Open the contact form",
      "The page your Chat-generated test will target.",
    ),
    narrationScript: {
      intro:
        "This is where the director workflow becomes real. You describe what to test, Copilot writes it, you run and review.",
      steps: [
        {
          text: "Open Copilot Chat and start with a freeform prompt. Describe the contact page, its fields, the validation rules, and what success looks like. Be specific about selectors and assertions.",
          duration: 18,
        },
        {
          text: "Review the generated output before running it. Check the four points: selector choices, assertion correctness, test isolation, and anti-patterns.",
          duration: 16,
        },
        {
          text: "Run the test. If it fails, copy the error and feed it back to Copilot using #terminalLastCommand or by pasting the error directly. Let Copilot fix it.",
          duration: 18,
        },
        {
          text: "Try the same prompt with a #file reference to an existing test. Notice how the output quality improves when Copilot has a pattern to follow.",
          duration: 14,
        },
      ],
      outro:
        "Chat-driven generation works well for individual tests. Next: the PAGE framework makes your prompts consistently produce better output regardless of the page.",
    },
  },
});
