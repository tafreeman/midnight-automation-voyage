import {
  createSingleLessonModule,
  createPracticeLink,
  createExerciseLab,
  routes,
  credentials,
} from "../shared";

export const theReviewRunFixLoopModule = createSingleLessonModule({
  index: 5,
  title: "The Review-Run-Fix Loop",
  subtitle: "Turn failing AI-generated tests into passing ones without rewriting them",
  icon: "\uD83D\uDD04",
  estimatedMinutes: 16,
  learningObjectives: [
    "Feed test failures back to Copilot using #terminalLastCommand and structured error descriptions",
    "Apply the 3-iteration rule: if not fixed in 3 rounds, the prompt needs restructuring",
    "Distinguish between fixable failures (wrong selector, timing) and prompt failures (wrong approach)",
  ],
  lesson: {
    title: "The Review-Run-Fix Loop",
    subtitle:
      "Turn failing AI-generated tests into passing ones without rewriting them",
    estimatedMinutes: 16,
    sections: [
      {
        type: "text",
        heading: "The Loop in Practice",
        content:
          "The four steps in detail. First, generate from a structured prompt — describe the page, actions, guardrails, and evidence. Second, review: check selectors, assertions, isolation, and anti-patterns before running. Third, run: expect first-attempt failures — this is normal, not a sign of failure. Fourth, fix: feed the specific error back to Copilot with context. Key insight from Checkly: running steps one-by-one via MCP produces better results than generating all code from a description alone.",
      },
      {
        type: "table",
        heading: "Failure Types and Fix Strategies",
        headers: ["Error Type", "What It Means", "How to Prompt the Fix"],
        rows: [
          [
            "TimeoutError",
            "Element not found or not actionable",
            "\"Element getByRole('button', { name: 'Submit' }) was not found. Here is the error: [paste]. What button elements exist on this page? What is the correct locator?\"",
          ],
          [
            "Strict mode violation",
            "Locator matched multiple elements",
            "\"Locator matched 3 elements. Here are the matches: [paste]. Which is the correct target? How should I disambiguate?\"",
          ],
          [
            "Assertion mismatch",
            "Expected value differs from actual",
            "\"Expected text 'Welcome back' but got 'Loading...'. The page has not finished its API call. How should I wait for the correct value?\"",
          ],
          [
            "Navigation error",
            "URL didn't change as expected",
            "\"Expected URL /dashboard but still on /login. The login may have failed or redirect may be async.\"",
          ],
        ],
      },
      {
        type: "code",
        heading: "Feeding Errors Back",
        language: "text",
        code: `Prompt 1 — Wrong selector:
"The test at line 14 failed with TimeoutError. #terminalLastCommand
What is the correct selector for the submit button on /checkout/shipping?"

Prompt 2 — Timing issue:
"#terminalLastCommand This assertion failed because the page shows
'Loading...' instead of the expected content. How should I wait for
the API to complete before asserting?"

Prompt 3 — Ambiguous locator:
"#terminalLastCommand Strict mode violation — the locator matches
3 buttons. How do I target only the primary submit button?"`,
      },
      {
        type: "text",
        heading: "The 3-Iteration Rule",
        content:
          "Research finding: beyond 3 fix attempts, the LLM makes lateral changes rather than converging on a solution. If still failing after 3 rounds: restructure the prompt with more context, break the test into smaller independent pieces, add a #file reference to a working test for pattern guidance, or consider whether the test approach itself is wrong.",
      },
      {
        type: "callout",
        variant: "warning",
        heading: "When to Stop and Rethink",
        content:
          "Signs the prompt is wrong, not just the test: Copilot keeps changing unrelated code each iteration. Fixes break other assertions that previously passed. The test gets longer and more complex with each fix. Copilot adds waitForTimeout as a \"fix.\" When you see these signs, stop iterating and restructure the prompt from scratch.",
      },
      {
        type: "text",
        heading: "Fix via Re-Prompt, Not Manual Edit",
        content:
          "The discipline of this course: resist editing code yourself. Instead, improve your prompt or error description. This builds the skill that scales — your prompting ability works across every future test. Exception: obvious typos or one-character fixes where re-prompting is slower than typing.",
      },
    ],
    quiz: {
      questions: [
        {
          question:
            "A generated test fails with TimeoutError on getByRole('button', { name: 'Submit' }). What is the best next step?",
          options: [
            "Add page.waitForTimeout(5000) before the click",
            "Manually change the selector to a CSS class",
            "Ask Copilot what button elements exist on the page, providing the error as context",
            "Delete the test and start over",
          ],
          correctIndex: 2,
          explanation:
            "Feeding the specific error and asking Copilot to identify the correct element uses the Review-Run-Fix loop. Manual waits hide the problem. Manual selector changes bypass the prompting skill you're building.",
        },
        {
          question:
            "You have tried 3 iterations of fixing a generated test and it is still failing differently each time. What should you do?",
          options: [
            "Keep trying \u2014 the 4th iteration usually works",
            "Add more waitForTimeout calls to handle timing",
            "Restructure the prompt with more context, break the test into smaller pieces, or try a different approach",
            "Accept the test as-is since it almost works",
          ],
          correctIndex: 2,
          explanation:
            "The 3-iteration rule is research-backed. Beyond 3 attempts, the LLM makes lateral changes rather than converging. Restructuring the prompt, adding context, or breaking the test down is more productive.",
        },
      ],
    },
    exercise: {
      title: "Fix a Failing Generated Test",
      description:
        "A pre-generated test for the checkout shipping page has 3 intentional failures: (1) wrong selector for the continue button, (2) missing navigation wait after form submit, (3) assertion checking text that doesn't exist. Use the Review-Run-Fix loop with Copilot Chat to fix all 3 without editing code manually. Track how many iterations each fix takes.",
      starterCode: `import { test, expect } from "@playwright/test";

test.describe("Checkout Shipping — Review-Run-Fix Exercise", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/checkout/shipping");
  });

  test("should complete shipping and proceed to payment", async ({ page }) => {
    await page.getByLabel("Full Name").fill("Jane Doe");
    await page.getByLabel("Address").fill("123 Main St");
    await page.getByLabel("City").fill("Springfield");
    await page.getByLabel("Zip Code").fill("62701");

    // FAILURE 1: Wrong selector — button is labeled "Continue to Payment", not "Next"
    await page.getByRole("button", { name: "Next" }).click();

    // FAILURE 2: Assertion placed before click completes — needs auto-waiting
    await expect(page).toHaveURL("/checkout/payment");

    // FAILURE 3: This text does not exist on the page — should check payment page heading
    await expect(page.getByText("Shipping confirmed")).toBeVisible();
  });
});`,
      solutionCode: `import { test, expect } from "@playwright/test";

test.describe("Checkout Shipping — Review-Run-Fix Exercise", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/checkout/shipping");
  });

  test("should complete shipping and proceed to payment", async ({ page }) => {
    await page.getByLabel("Full Name").fill("Jane Doe");
    await page.getByLabel("Address").fill("123 Main St");
    await page.getByLabel("City").fill("Springfield");
    await page.getByLabel("Zip Code").fill("62701");

    // FIX 1: Correct button label
    await page.getByRole("button", { name: "Continue to Payment" }).click();

    // FIX 2: URL assertion after click — Playwright auto-waits for navigation
    await expect(page).toHaveURL("/checkout/payment");

    // FIX 3: Check the actual payment page heading instead of non-existent text
    await expect(
      page.getByRole("heading", { name: "Payment Details" })
    ).toBeVisible();
  });
});`,
      hints: [
        "Run the test first to see all three failures in the output",
        "Feed each error to Copilot one at a time \u2014 fix sequentially, not all at once",
        "If a fix breaks something else, that counts as an iteration",
      ],
      lab: createExerciseLab(
        "e2e/copilot-first-testing/lesson-05-fix-failures.spec.ts",
        "pnpm exec playwright test e2e/copilot-first-testing/lesson-05-fix-failures.spec.ts --project=chromium",
        [
          "All 3 failures fixed via Copilot Chat re-prompting, not manual edits",
          "Test passes on chromium",
          "No waitForTimeout added as a fix",
          "Each fix took 1-3 iterations maximum",
        ],
      ),
    },
    promptTemplates: [
      {
        label: "Fix: TimeoutError",
        context: "Use when a selector can't find its element.",
        prompt: `The Playwright test failed with TimeoutError.

#terminalLastCommand

The element was not found on the page. Please:
1. Identify what elements actually exist in that area of the page
2. Suggest the correct selector
3. Explain why the original selector was wrong`,
      },
      {
        label: "Fix: Assertion Mismatch",
        context: "Use when an assertion checks the wrong value.",
        prompt: `The Playwright test assertion failed — expected value does not match actual.

#terminalLastCommand

Please:
1. Explain what the page actually shows vs what the test expected
2. Determine if the assertion target is wrong or if the page needs time to update
3. Provide the corrected assertion`,
      },
    ],
    practiceLink: createPracticeLink(
      routes.checkoutShipping,
      "Open the checkout shipping page",
      "The page the intentionally-failing test targets.",
    ),
    narrationScript: {
      intro:
        "Every AI-generated test fails on the first run. That is normal. The skill is not avoiding failures \u2014 it is fixing them efficiently through re-prompting instead of rewriting.",
      steps: [
        {
          text: "Run the pre-written test and read the failures carefully. Each error type tells you something different: TimeoutError means wrong selector, assertion mismatch means wrong expectation, strict mode means ambiguous target.",
          duration: 18,
        },
        {
          text: "Feed the first failure to Copilot using #terminalLastCommand or by pasting the error. Ask a specific question: 'What is the correct selector?' Not a vague one: 'Fix this test.'",
          duration: 16,
        },
        {
          text: "After each fix, run again. Track your iteration count. If you hit 3 iterations on one failure, stop and restructure your prompt with more context.",
          duration: 16,
        },
        {
          text: "Resist the urge to edit the code yourself. Every manual fix is a missed opportunity to improve your prompting. The discipline of re-prompting builds the skill that scales.",
          duration: 14,
        },
      ],
      outro:
        "The Review-Run-Fix loop is the heartbeat of Copilot-first testing. Next: Copilot Agent Mode automates this loop entirely \u2014 generate, run, fix, repeat \u2014 without your intervention.",
    },
  },
});
