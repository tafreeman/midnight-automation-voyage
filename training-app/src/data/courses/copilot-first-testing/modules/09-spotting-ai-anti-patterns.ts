import {
  createSingleLessonModule,
  createPracticeLink,
  createExerciseLab,
  routes,
} from "../shared";

export const spottingAiAntiPatternsModule = createSingleLessonModule({
  index: 9,
  title: "Spotting AI Anti-Patterns",
  subtitle:
    "The 8 mistakes Copilot makes most \u2014 and how to catch them in review",
  icon: "\uD83D\uDD0D",
  estimatedMinutes: 14,
  learningObjectives: [
    "Identify the 8 most common LLM test anti-patterns in generated code",
    "Fix each anti-pattern using re-prompting (not manual editing)",
    "Explain why a test that passes can still be worthless (the assertion trap / mutation testing gap)",
  ],
  lesson: {
    title: "Spotting AI Anti-Patterns",
    subtitle:
      "The 8 mistakes Copilot makes most \u2014 and how to catch them in review",
    estimatedMinutes: 14,
    sections: [
      {
        type: "table",
        heading: "The 8 Anti-Patterns",
        headers: ["#", "Anti-Pattern", "What Copilot Does", "Correct Approach"],
        rows: [
          [
            "1",
            "Hardcoded waits",
            "page.waitForTimeout(2000)",
            "Remove entirely \u2014 Playwright auto-waits",
          ],
          [
            "2",
            "CSS selectors",
            "locator('.btn-primary')",
            "getByRole('button', { name: '...' })",
          ],
          [
            "3",
            "Deprecated APIs",
            "page.waitForNavigation()",
            "expect(page).toHaveURL() pattern",
          ],
          [
            "4",
            "Hallucinated selectors",
            "Invents selectors without seeing DOM",
            "Use MCP snapshot or provide HTML context",
          ],
          [
            "5",
            "Non-retrying assertions",
            "const text = ...; expect(text).toBe(...)",
            "await expect(locator).toHaveText(...)",
          ],
          [
            "6",
            "Test interdependence",
            "Tests share state or rely on execution order",
            "Each test sets up its own state independently",
          ],
          [
            "7",
            "Strict mode band-aids",
            ".first() or .nth(0) everywhere",
            "Fix the ambiguous locator with filter() or more specific role",
          ],
          [
            "8",
            "Over-engineering",
            "POM class for one test with helper utilities",
            "Flat inline test \u2014 YAGNI for simple cases",
          ],
        ],
      },
      {
        type: "code",
        heading: "Spot the Anti-Patterns",
        language: "typescript",
        code: `import { test, expect } from "@playwright/test";

// Can you spot all 4 anti-patterns?

test.describe("Orders Page", () => {
  test("should display the correct number of orders", async ({ page }) => {
    await page.goto("/orders");

    // Wait for the order table to fully render
    await page.waitForTimeout(2000);

    await page.locator('.sort-btn').click();
    await expect(page.getByRole("table")).toBeVisible();

    const count = await page.getByTestId("order-count").textContent();
    expect(count).toBe("5");
  });

  test("should show orders in sorted order after sort", async ({ page }) => {
    // Relies on the sort state set by the previous test
    await page.goto("/orders");

    const firstRow = page.getByTestId("order-row-0");
    await expect(firstRow).toContainText("Order #1001");

    const lastRow = page.getByTestId("order-row-4");
    await expect(lastRow).toContainText("Order #1005");
  });
});`,
      },
      {
        type: "text",
        heading: "The Assertion Trap at Scale",
        content:
          "Most LLM-generated tests that pass prove unsuitable for mutation testing \u2014 they can pass without verifying meaningful behavior. Example: expect(heading).toBeVisible() passes for any heading on any page. It does not fail when the feature is broken. Better: expect(heading).toHaveText('Order Confirmed') \u2014 this actually verifies the right content. Research from arXiv (2025): LLM-generated tests have near-zero mutation scores because they check interfaces and visibility, not actual logic. The tests pass, but they do not protect you from bugs.",
      },
      {
        type: "text",
        heading: "The Over-Engineering Problem",
        content:
          "From industry experience: \"Copilot Over-Engineered My Playwright Framework.\" Warning signs: (1) POM class created for a single test file. (2) Custom fixture wrapping a standard Playwright fixture. (3) Helper utility function used exactly once. (4) Constants file created for two string values. (5) Base class with abstract methods for three concrete pages. Ask: \"Would deleting this abstraction break more than one test?\" If no, delete it.",
      },
      {
        type: "code",
        heading: "Before and After: Anti-Pattern Fixes",
        language: "typescript",
        code: `// --- Anti-Pattern 1: Hardcoded wait ---

// BEFORE (anti-pattern)
await page.waitForTimeout(2000);
await page.locator('.sort-btn').click();

// AFTER (fixed) — Playwright's click() auto-waits for the element
await page.getByRole("button", { name: "Sort" }).click();


// --- Anti-Pattern 2: CSS selector ---

// BEFORE (anti-pattern)
await page.locator('.sort-btn').click();

// AFTER (fixed) — semantic locator resilient to class name changes
await page.getByRole("button", { name: "Sort" }).click();


// --- Anti-Pattern 3: Non-retrying assertion ---

// BEFORE (anti-pattern) — reads text once, no retry on timing
const count = await page.getByTestId("order-count").textContent();
expect(count).toBe("5");

// AFTER (fixed) — web-first assertion with auto-retry
await expect(page.getByTestId("order-count")).toHaveText("5");


// --- Anti-Pattern 4: Test interdependence ---

// BEFORE (anti-pattern) — test 2 assumes sort state from test 1
test("should show orders in sorted order after sort", async ({ page }) => {
  await page.goto("/orders");
  // Missing: click sort button — relies on previous test's state
  const firstRow = page.getByTestId("order-row-0");
  await expect(firstRow).toContainText("Order #1001");
});

// AFTER (fixed) — each test sets up its own state
test("should show orders in sorted order after sort", async ({ page }) => {
  await page.goto("/orders");
  await page.getByRole("button", { name: "Sort" }).click();
  const firstRow = page.getByTestId("order-row-0");
  await expect(firstRow).toContainText("Order #1001");
});`,
      },
      {
        type: "callout",
        variant: "warning",
        heading: "The Cost of Flakiness",
        content:
          "An industrial case study found developers spend 1.28% of working time repairing flaky tests \u2014 about $2,250 per month per developer, or $270,000 per year for a team of 10. AI-generated tests with hardcoded waits and fragile selectors are flaky by default. Catching anti-patterns in review costs minutes; fixing flaky tests in CI costs hours.",
      },
    ],
    quiz: {
      questions: [
        {
          question:
            "Which assertion is more valuable: expect(heading).toBeVisible() or expect(heading).toHaveText('Order Confirmed')?",
          options: [
            "toBeVisible \u2014 it verifies the element exists",
            "toHaveText \u2014 it actually verifies the content and fails when the feature is broken",
            "They are equally valuable",
            "Neither \u2014 you should use toMatchSnapshot instead",
          ],
          correctIndex: 1,
          explanation:
            "toBeVisible passes for any heading on any page. It does not fail when the content is wrong. toHaveText verifies actual content and catches bugs where the wrong page or wrong text appears.",
        },
        {
          question:
            "A generated test uses page.waitForTimeout(3000) before clicking a button. What is the correct fix?",
          options: [
            "Increase the timeout to 5000 for reliability",
            "Remove the waitForTimeout entirely \u2014 Playwright's click() auto-waits for the element to be actionable",
            "Replace with page.waitForSelector()",
            "Add a try-catch around the click",
          ],
          correctIndex: 1,
          explanation:
            "Playwright's actions (click, fill, check) auto-wait for the element to be attached, visible, stable, enabled, and unobscured. Manual waits are always unnecessary and make tests slower and flakier.",
        },
        {
          question:
            "Copilot generated a test that creates a helper class, a constants file, and a custom fixture for a single two-test spec file. What anti-pattern is this?",
          options: [
            "Test interdependence",
            "Hallucinated selectors",
            "Over-engineering \u2014 a simple inline test is better for a one-off scenario",
            "Deprecated API usage",
          ],
          correctIndex: 2,
          explanation:
            "Creating abstractions for code that is used once adds complexity without value. The helper, constants, and fixture should be inlined into the spec file. Abstractions earn their keep only when they prevent real duplication across 3+ tests.",
        },
      ],
    },
    exercise: {
      title: "Anti-Pattern Code Review",
      description:
        "Review a pre-generated test file with 6 hidden anti-patterns. Identify each one, then use Copilot Chat to fix them one at a time via re-prompting. Goal: a clean test with zero anti-patterns.",
      starterCode: `import { test, expect } from "@playwright/test";

// Helper to get order count element
function getOrderCount(page) {
  return page.getByTestId("order-count");
}

test.describe("Orders Page — Anti-Pattern Review Exercise", () => {
  test("should display orders and allow sorting", async ({ page }) => {
    await page.goto("/orders");

    // Wait for the API to return order data
    await page.waitForTimeout(2000);

    await expect(page.getByRole("table")).toBeVisible();

    // Verify the order count
    const count = await getOrderCount(page).textContent();
    expect(count).toBe("5");

    // Click the sort button
    await page.locator('.order-row').first();
    await page.locator('.sort-asc').click();
  });

  test("should show sorted results", async ({ page }) => {
    // Continues from sorted state in previous test
    await page.goto("/orders");

    const firstOrder = page.getByTestId("order-row-0");
    await expect(firstOrder).toContainText("Order #1001");

    const lastOrder = page.getByTestId("order-row-4");
    await expect(lastOrder).toContainText("Order #1005");
  });
});`,
      solutionCode: `import { test, expect } from "@playwright/test";

test.describe("Orders Page — Anti-Pattern Review Exercise", () => {
  test("should display orders and allow sorting", async ({ page }) => {
    await page.goto("/orders");

    await expect(page.getByRole("table")).toBeVisible();

    // Web-first assertion with auto-retry
    await expect(page.getByTestId("order-count")).toHaveText("5");

    // Semantic locators instead of CSS selectors
    await page.getByRole("button", { name: "Sort ascending" }).click();

    const firstOrder = page.getByTestId("order-row-0");
    await expect(firstOrder).toContainText("Order #1001");
  });

  test("should show sorted results independently", async ({ page }) => {
    // Each test sets up its own state
    await page.goto("/orders");

    // Sort within this test — no dependency on previous test
    await page.getByRole("button", { name: "Sort ascending" }).click();

    const firstOrder = page.getByTestId("order-row-0");
    await expect(firstOrder).toContainText("Order #1001");

    const lastOrder = page.getByTestId("order-row-4");
    await expect(lastOrder).toContainText("Order #1005");
  });
});`,
      hints: [
        "Read through the test before running it \u2014 some anti-patterns are visible on inspection",
        "Ask Copilot: 'Review this test for the 8 common AI anti-patterns and suggest fixes'",
        "Check: would each test pass if run alone in random order?",
      ],
      lab: createExerciseLab(
        "e2e/copilot-first-testing/lesson-09-anti-patterns.spec.ts",
        "pnpm exec playwright test e2e/copilot-first-testing/lesson-09-anti-patterns.spec.ts --project=chromium",
        [
          "All 6 anti-patterns identified and fixed",
          "No waitForTimeout in the final code",
          "All selectors use getByRole, getByLabel, or getByTestId",
          "Each test is independently runnable",
          "No unnecessary helper functions or abstractions",
        ],
      ),
    },
    promptTemplates: [
      {
        label: "Anti-Pattern Review",
        context:
          "Ask Copilot to review a test for the 8 known LLM anti-patterns.",
        prompt: `Review this Playwright test for the 8 common AI-generated anti-patterns:
1. Hardcoded waits (waitForTimeout)
2. CSS selectors instead of semantic locators
3. Deprecated Playwright APIs
4. Hallucinated selectors that don't match real DOM
5. Non-retrying assertions (reading value then asserting)
6. Test interdependence (tests sharing state)
7. Strict mode band-aids (.first()/.nth(0))
8. Over-engineering (unnecessary abstractions)

For each anti-pattern found, show the problematic line and the corrected version.

#selection`,
      },
    ],
    practiceLink: createPracticeLink(
      routes.orders,
      "Open the orders page",
      "The page the anti-pattern test targets \u2014 check the real selectors.",
    ),
    narrationScript: {
      intro:
        "Every AI-generated test needs review. The question is: what are you looking for? This lesson gives you a concrete checklist of the 8 most common mistakes Copilot makes \u2014 and teaches you to catch them before they reach your test suite.",
      steps: [
        {
          text: "The 8 anti-patterns are ranked by frequency. Hardcoded waits and CSS selectors appear in almost every unguided generation. Non-retrying assertions and test interdependence are subtler but equally damaging.",
          duration: 18,
        },
        {
          text: "The assertion trap is the hardest to spot: a test that passes is not necessarily a test that works. If the assertion would still pass when the feature is broken, it is protecting nothing.",
          duration: 16,
        },
        {
          text: "Open the exercise test and find all 6 anti-patterns before running it. Then use Copilot to fix each one via the Anti-Pattern Review prompt template.",
          duration: 18,
        },
        {
          text: "Over-engineering is the anti-pattern unique to AI: humans rarely create a POM class for a single test, but Copilot does it routinely. Delete abstractions that serve only one consumer.",
          duration: 12,
        },
      ],
      outro:
        "You now have a review checklist that catches what AI gets wrong. The final lesson turns everything you have learned into shareable team infrastructure: prompt files, scoped instructions, and governance standards.",
    },
  },
});
