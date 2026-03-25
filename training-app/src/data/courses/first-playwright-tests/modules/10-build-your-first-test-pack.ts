import {
  createExerciseLab,
  createPracticeLink,
  createSingleLessonModule,
  firstPlaywrightTestRoutes,
} from "../shared";

export const buildYourFirstTestPackModule = createSingleLessonModule({
  index: 10,
  title: "Build Your First Test Pack",
  subtitle: "Finish the course with two independent passing tests and a clean report",
  icon: "📦",
  estimatedMinutes: 16,
  learningObjectives: [
    "Assemble two independent first-pass tests that cover different product behavior",
    "Keep each spec focused on one outcome instead of one long journey",
    "Read the report for the suite as a summary of your first working pack",
  ],
  lesson: {
    title: "Build Your First Test Pack",
    subtitle: "Finish the course with two independent passing tests and a clean report",
    estimatedMinutes: 16,
    sections: [
      {
        type: "text",
        heading: "A Test Pack Is Not One Long Script",
        content:
          "Your capstone is two separate checks: a login success flow and a products-search result check. Keeping them independent matters because each test should set up its own route, do its own work, and prove one clear outcome. That is easier to run, review, and debug than a single monolithic script.",
      },
      {
        type: "table",
        heading: "Capstone Coverage",
        headers: ["Spec", "User outcome", "Proof to keep"],
        rows: [
          ["Login success", "Editor reaches the dashboard", "Dashboard route and welcome heading"],
          ["Products search", "Search returns matching items", "Result count text and visible matching cards"],
        ],
      },
      {
        type: "code",
        heading: "Run the Pack",
        language: "bash",
        code: `pnpm exec playwright test e2e/first-playwright-tests/lesson-10-first-test-pack.spec.ts --project=chromium
pnpm exec playwright show-report`,
      },
      {
        type: "callout",
        variant: "tip",
        heading: "Good First Pack Standard",
        content:
          "If the suite is readable, each test proves one outcome, and the report is clean, you have completed the goal of this course. That is enough to start contributing and enough to know where later skills fit.",
      },
    ],
    quiz: {
      questions: [
        {
          question: "Why split the capstone into two tests instead of one longer script?",
          options: [
            "Because Playwright cannot run longer files",
            "Because separate tests are easier to read, rerun, and debug",
            "Because the HTML report only shows two results",
            "Because Copilot requires one assertion per file",
          ],
          correctIndex: 1,
          explanation:
            "Independent tests give you tighter failure signals and cleaner review boundaries. Each test can set its own start state and prove one outcome well.",
        },
      ],
    },
    exercise: {
      title: "Ship a Two-Test Pack",
      description:
        "Complete two independent tests: one for successful login and one for Widget search results. The practice app's seed data contains six Widget products. Then run the spec file and review the report as the closeout for the course.",
      starterCode: `import { test } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test.skip("editor can sign in and reach the dashboard", async ({ page }) => {
  // TODO: implement the login happy path
});

test.skip("widget search returns matching products", async ({ page }) => {
  // TODO: implement the products search check
});`,
      solutionCode: `import { test, expect } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test("editor can sign in and reach the dashboard", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByLabel("Email").fill(credentials.editor.email);
  await page.getByLabel("Password").fill(credentials.editor.password);
  await page.getByRole("button", { name: "Log In" }).click();

  await expect(page).toHaveURL(/#\\/dashboard$/);
  await expect(page.getByTestId("dashboard-heading")).toContainText("Welcome, Test User");
});

test("widget search returns matching products", async ({ page }) => {
  await gotoRoute(page, "/products");
  await page.getByTestId("search-input").fill("Widget");
  await page.getByTestId("search-button").click();

  await expect(page.getByTestId("result-count")).toContainText("6 results found");
  await expect(page.getByTestId("result-card")).toHaveCount(6);
  await expect(page.getByTestId("result-card").first()).toContainText("Widget");
});`,
      hints: [
        "Each test should arrange its own route before acting.",
        "Reuse the stable login selectors and the stable product-search selectors from earlier lessons.",
        "Run the full file after both tests are implemented so the report shows the pack together.",
      ],
      lab: createExerciseLab(
        "e2e/first-playwright-tests/lesson-10-first-test-pack.spec.ts",
        "pnpm exec playwright test e2e/first-playwright-tests/lesson-10-first-test-pack.spec.ts --project=chromium && pnpm exec playwright show-report",
        [
          "Both tests pass in the same spec file after you remove test.skip.",
          "Each test starts from its own route and proves one clear user outcome.",
          "The HTML report shows a clean two-test pack at the end of the run.",
        ],
      ),
    },
    promptTemplates: [
      {
        label: "Capstone Review Prompt",
        context: "Use this after writing the two-test pack to ask Copilot for a review focused on evidence.",
        prompt: `Review these two Playwright tests as if you were approving them for a first automation contribution.

Focus on:
- selector stability
- whether each test proves the intended outcome
- unnecessary waits or noise
- whether the two tests are independent

Tests:
[PASTE TEST FILE HERE]`,
      },
    ],
    practiceLink: createPracticeLink(
      firstPlaywrightTestRoutes.products,
      "Open the products page used by the second capstone test",
      "The capstone ends with one login check and one products check, each proving a different kind of user outcome.",
    ),
    narrationScript: {
      intro:
        "This is the closing lesson of the course. You are writing two small tests that read clearly and pass together.",
      steps: [
        {
          text: "The first test is familiar now: log in, reach the dashboard, prove the route and the heading.",
          navigateTo: "/dashboard",
          highlight: "dashboard-heading",
          duration: 18,
        },
        {
          text: "The second test starts fresh on the products page and proves that a Widget search produces matching results. That independence is the point.",
          navigateTo: "/products",
          highlight: "result-count",
          duration: 20,
        },
        {
          text: "Run the spec file as a pack, open the report, and read it as a summary of your first usable automation contribution.",
          duration: 18,
        },
      ],
      outro:
        "You now have the full beginner loop: setup, run, read, record, refine, and deliver a small passing pack. That is enough to start practicing on real stories.",
    },
  },
});
