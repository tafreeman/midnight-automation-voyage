import {
  createSingleLessonModule,
  createPracticeLink,
  createExerciseLab,
  routes,
} from "../shared";

export const pagePromptsUpgradedModule = createSingleLessonModule({
  index: 4,
  title: "PAGE Prompts, Upgraded",
  subtitle: "Structured prompts that produce reviewable first drafts every time",
  icon: "\uD83D\uDCD0",
  estimatedMinutes: 14,
  learningObjectives: [
    "Write PAGE prompts that include practice app selectors, acceptance criteria, and anti-pattern rules",
    "Use comment-driven autocomplete to guide inline Copilot suggestions",
    "Apply the seed test pattern: one excellent test that teaches Copilot your style",
  ],
  lesson: {
    title: "PAGE Prompts, Upgraded",
    subtitle:
      "Structured prompts that produce reviewable first drafts every time",
    estimatedMinutes: 14,
    sections: [
      {
        type: "text",
        heading: "PAGE Review",
        content:
          "Quick recap: Page (where the flow starts), Actions (user steps), Guardrails (rules the test must obey), Evidence (what must be proven). In Course 1 this was a mental model for thinking about tests. Now it becomes the actual structure of every Chat prompt you write. Each section maps to a block of text in the prompt, and Copilot uses those blocks to generate targeted, reviewable code.",
      },
      {
        type: "code",
        language: "text",
        heading: "An Upgraded PAGE Prompt",
        code: `Page: /orders (authenticated user, table with sortable columns)

Actions:
1. Click "Date" column header to sort ascending
2. Verify rows are in chronological order
3. Click again to sort descending
4. Verify reverse order

Guardrails:
- Use getByRole('columnheader') for column headers
- Use getByRole('row') for table rows
- Use storageState for auth — do not log in manually
- No waitForTimeout
- Follow AAA pattern with test.step

Evidence:
- After first click, first row date is earliest
- After second click, first row date is latest
- Column header shows sort indicator`,
      },
      {
        type: "text",
        heading: "Comment-Driven Autocomplete",
        content:
          "Write a test.describe block name, then add a descriptive comment before each test(). Copilot autocompletes the test body from the comment plus open files plus your instructions file. This works best when: (1) your copilot-instructions.md is present in the repo, (2) an exemplar test is open in a split pane, and (3) comments mention specific selectors and expected text. The comment acts as a mini-prompt that triggers inline suggestions without opening Chat.",
      },
      {
        type: "code",
        language: "typescript",
        heading: "Comment-Driven Example",
        code: `import { test, expect } from "@playwright/test";

test.describe("Orders Table", () => {
  test.use({ storageState: "auth.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/orders");
  });

  // Test that clicking the Date column header sorts rows ascending
  test("should sort by date ascending on first click", async ({ page }) => {
    await test.step("Act: click Date header", async () => {
      await page.getByRole("columnheader", { name: "Date" }).click();
    });

    await test.step("Assert: rows are in chronological order", async () => {
      const rows = page.getByRole("row");
      const firstDate = await rows.nth(1).getByRole("cell").first().textContent();
      const lastDate = await rows.nth(-1).getByRole("cell").first().textContent();
      expect(new Date(firstDate!).getTime())
        .toBeLessThan(new Date(lastDate!).getTime());
    });
  });

  // Test that searching filters rows to matching results
  test("should filter rows when searching", async ({ page }) => {
    await test.step("Act: type search query", async () => {
      await page.getByRole("searchbox").fill("ORD-100");
    });

    await test.step("Assert: only matching rows visible", async () => {
      const rows = page.getByRole("row");
      await expect(rows).toHaveCount(2); // header + 1 match
      await expect(rows.nth(1)).toContainText("ORD-100");
    });
  });
});`,
      },
      {
        type: "text",
        heading: "The Seed Test Pattern",
        content:
          "Write one excellent test manually (or generate and refine it until it is clean). Keep it open in a split pane. All subsequent generated tests follow its patterns \u2014 selector choices, assertion style, test.step usage, naming conventions. This mirrors how Playwright's own test agents work: the Planner uses a seed test to run global setup and as a pattern template for the tests it generates. Your seed test does the same for Copilot. The seed test should be your simplest happy-path scenario, polished to your exact standards. Every convention you want Copilot to follow should appear in the seed test at least once.",
      },
      {
        type: "callout",
        variant: "tip",
        heading: "CARD for Complex Flows",
        content:
          "For multi-step wizards like checkout, CARD adds a Data dimension: Context (page), Actions (flow), Rules (business logic), Data (test data and edge cases). Use CARD when the test involves three or more pages or conditional logic. It extends PAGE with explicit test data variants and boundary conditions that PAGE alone does not capture. Reference Course 1 Module 07 for the full CARD framework.",
      },
    ],
    quiz: {
      questions: [
        {
          question:
            "In the seed test pattern, why do you keep an excellent test open in a split pane?",
          options: [
            "Copilot needs it for syntax validation",
            "Copilot reads open files and mimics their patterns for all subsequent generations",
            "It prevents Copilot from modifying other files",
            "It serves as a backup if generation fails",
          ],
          correctIndex: 1,
          explanation:
            "Copilot uses open editor tabs as context. A well-structured seed test teaches Copilot your selector hierarchy, assertion style, test.step usage, and naming conventions better than any written instructions.",
        },
        {
          question:
            "What goes in the Evidence section of a PAGE prompt?",
          options: [
            "The test data to use",
            "The selectors to find elements",
            "The proof the finished test must check \u2014 specific assertions and expected values",
            "The anti-patterns to avoid",
          ],
          correctIndex: 2,
          explanation:
            "Evidence tells Copilot exactly what to assert. Vague evidence like 'page works' produces vague assertions. Specific evidence like 'first row date is earliest after sort' produces targeted, meaningful assertions.",
        },
      ],
    },
    exercise: {
      title: "Seed Test + PAGE Generation",
      description:
        "First, take your login test from Module 1 and refine it into a seed test (fix selectors, add assertions, use test.step). Then write a PAGE prompt for an orders table test. Open the seed test in a split pane and generate the orders test via Chat. Compare output quality with and without the seed test visible.",
      starterCode: `import { test, expect } from "@playwright/test";

// --- SEED TEST (refine this first) ---
// This rough login test needs cleanup to become your seed test.
// TODO: Add test.step() for Arrange / Act / Assert phases
// TODO: Fix selectors to use getByRole / getByLabel
// TODO: Add meaningful assertions beyond just visibility

test.describe("Login — Seed Test", () => {
  test("should log in successfully", async ({ page }) => {
    await page.goto("/login");
    await page.locator("#email").fill("user@test.com");
    await page.locator("#password").fill("Password123!");
    await page.locator("button").click();
    await expect(page).toHaveURL(/dashboard/);
  });
});

// --- ORDERS TEST (generate this with PAGE prompt + seed test open) ---
// TODO: Write a PAGE prompt in Copilot Chat
// TODO: Open the refined seed test in a split pane
// TODO: Let Copilot generate the test below

test.describe("Orders Table", () => {
  // Copilot will generate tests here
});`,
      solutionCode: `import { test, expect } from "@playwright/test";

// --- SEED TEST (refined) ---
test.describe("Login — Seed Test", () => {
  test("should redirect to dashboard on successful login", async ({ page }) => {
    await test.step("Arrange: navigate to login page", async () => {
      await page.goto("/login");
    });

    await test.step("Act: fill credentials and submit", async () => {
      await page.getByLabel("Email").fill("user@test.com");
      await page.getByLabel("Password").fill("Password123!");
      await page.getByRole("button", { name: "Log In" }).click();
    });

    await test.step("Assert: redirected to dashboard", async () => {
      await expect(page).toHaveURL(/dashboard/);
      await expect(
        page.getByRole("heading", { name: /dashboard/i })
      ).toBeVisible();
    });
  });
});

// --- ORDERS TEST (generated with seed test open, follows same patterns) ---
test.describe("Orders Table", () => {
  test.use({ storageState: "auth.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/orders");
  });

  test("should sort by date ascending on first click", async ({ page }) => {
    await test.step("Arrange: confirm table is loaded", async () => {
      await expect(page.getByRole("table")).toBeVisible();
    });

    await test.step("Act: click Date column header", async () => {
      await page.getByRole("columnheader", { name: "Date" }).click();
    });

    await test.step("Assert: rows are in chronological order", async () => {
      const rows = page.getByRole("row");
      const firstRowDate = await rows.nth(1).getByRole("cell").first().textContent();
      const secondRowDate = await rows.nth(2).getByRole("cell").first().textContent();
      expect(new Date(firstRowDate!).getTime())
        .toBeLessThanOrEqual(new Date(secondRowDate!).getTime());
    });
  });

  test("should sort by date descending on second click", async ({ page }) => {
    await test.step("Act: click Date header twice", async () => {
      const dateHeader = page.getByRole("columnheader", { name: "Date" });
      await dateHeader.click();
      await dateHeader.click();
    });

    await test.step("Assert: rows are in reverse chronological order", async () => {
      const rows = page.getByRole("row");
      const firstRowDate = await rows.nth(1).getByRole("cell").first().textContent();
      const secondRowDate = await rows.nth(2).getByRole("cell").first().textContent();
      expect(new Date(firstRowDate!).getTime())
        .toBeGreaterThanOrEqual(new Date(secondRowDate!).getTime());
    });
  });
});`,
      hints: [
        "The seed test should use test.step() to group Arrange / Act / Assert",
        "Keep the seed test open in the left pane while generating in the right",
        "Your PAGE prompt Evidence section should specify exact expected values, not just 'it works'",
      ],
      lab: createExerciseLab(
        "e2e/copilot-first-testing/lesson-04-orders-table.spec.ts",
        "pnpm exec playwright test e2e/copilot-first-testing/lesson-04-orders-table.spec.ts --project=chromium",
        [
          "Orders test follows the same patterns as the seed test",
          "Uses getByRole('columnheader') and getByRole('row')",
          "Assertions check actual sort order, not just visibility",
          "test.step groups logical phases of each test",
        ],
      ),
    },
    promptTemplates: [
      {
        label: "PAGE: Orders Table",
        context:
          "Sort, filter, and pagination testing for the orders page.",
        prompt: `Page: /orders (authenticated user with editor role)
Table with columns: Order ID, Date, Status, Total

Actions:
1. Click Date column header to sort ascending
2. Verify rows sorted by date (earliest first)
3. Click Date again to sort descending
4. Verify reverse order (latest first)

Guardrails:
- Use storageState for auth
- getByRole('columnheader', { name: 'Date' }) for headers
- getByRole('row') for data rows
- No waitForTimeout
- Use test.step for each phase

Evidence:
- After ascending sort, first row has the earliest date
- After descending sort, first row has the latest date
- Sort indicator visible on active column`,
      },
      {
        label: "PAGE: Settings Page",
        context:
          "Tab navigation and form update testing.",
        prompt: `Page: /settings (authenticated user)
Tabbed interface with Profile, Notifications, Security tabs

Actions:
1. Navigate to /settings
2. Verify Profile tab is active by default
3. Click Notifications tab
4. Verify tab content changes
5. Update a notification preference
6. Verify change persists

Guardrails:
- getByRole('tab') for tab buttons
- getByRole('tabpanel') for tab content
- No hardcoded waits

Evidence:
- Profile tab active on load
- Clicking Notifications tab shows notification settings
- Changed preference is reflected in the UI`,
      },
    ],
    practiceLink: createPracticeLink(
      routes.orders,
      "Open the orders page",
      "Inspect the table columns and sort behavior before writing the PAGE prompt.",
    ),
    narrationScript: {
      intro:
        "Course 1 introduced PAGE as a mental model. Now it becomes the actual structure of every prompt. Combined with the seed test pattern, your prompts will produce reviewable first drafts consistently.",
      steps: [
        {
          text: "Refine your login test into a seed test. Add test.step() for Arrange, Act, Assert phases. Use the locators and assertions that match your instructions file. This becomes the pattern all generated tests follow.",
          duration: 20,
        },
        {
          text: "Write a PAGE prompt for the orders table. Be specific in the Evidence section: 'first row has earliest date' is better than 'sorted correctly'. Specific evidence produces specific assertions.",
          duration: 18,
        },
        {
          text: "Open your seed test in a split pane. Generate the orders test via Chat with the PAGE prompt. Compare the selector choices, test.step usage, and assertion style to your seed test.",
          duration: 16,
        },
        {
          text: "Try generating without the seed test visible. Notice how the output loses the patterns. The seed test is free context that improves every generation.",
          duration: 12,
        },
      ],
      outro:
        "Structured prompts produce structured tests. But even the best prompt produces failures on the first run. Next: the Review-Run-Fix loop that turns failing drafts into passing tests.",
    },
  },
});
