import {
  createExerciseLab,
  createPracticeLink,
  createSingleLessonModule,
  firstPlaywrightTestCredentials,
  firstPlaywrightTestRoutes,
} from "../shared";

export const tightenAndRerunTheRecordingModule = createSingleLessonModule({
  index: 9,
  title: "Tighten and Re-Run the Recording",
  subtitle: "Turn the saved draft into a stable check with clear proof and rerun it with artifacts",
  icon: "🛠️",
  estimatedMinutes: 16,
  learningObjectives: [
    "Refine a recorded login draft into a readable spec with meaningful assertions",
    "Use Copilot to tighten code without giving up review control",
    "Rerun the refined spec and inspect the report and trace-producing settings",
  ],
  lesson: {
    title: "Tighten and Re-Run the Recording",
    subtitle: "Turn the saved draft into a stable check with clear proof and rerun it with artifacts",
    estimatedMinutes: 16,
    sections: [
      {
        type: "text",
        heading: "What to Tighten First",
        content:
          "Start with the things a reviewer notices fastest: placeholder names, weak locators, and missing proof. You are not polishing for style points. You are making the intent of the test obvious before someone else has to trust it.",
      },
      {
        type: "text",
        heading: "A Practical Refinement Prompt",
        content:
          "Use the Refine a Recorder Draft template from the prompt sidebar to ask Copilot for a cleanup pass. The template covers the four priorities: keep the real flow, keep stable selectors, add real assertions, and strip recorder noise.",
      },
      {
        type: "text",
        heading: "Why This Locator Order",
        content:
          "Playwright provides several ways to find elements. The priority order matters because user-facing locators track what the user sees, not how the HTML is structured.\n\nA button labeled 'Sign In' stays labeled 'Sign In' even if a developer changes the CSS class from `btn-primary` to `button--action`. The role and the visible text are stable because they are part of the product's interface.\n\nWhen none of those work — for example, a div with no accessible role, label, or meaningful text — fall back to `getByTestId`. Test IDs are added specifically for automation and will not change accidentally during a redesign.\n\nCSS selectors (`page.locator('.btn.btn-primary')`) are the last resort. They couple your test to implementation details that change frequently.",
      },
      {
        type: "text",
        heading: "Where Assertions Come From",
        content:
          "A recorded test captures what the user does — click here, type there, press submit. It does not capture what should happen next. That gap is what assertions fill.\n\nAssertions come from acceptance criteria, not from guessing. The ticket says 'After successful login, the user sees the dashboard with a heading that includes their name.' That gives you two assertions: the dashboard heading is visible, and the heading contains the expected name.\n\nWithout assertions, a test that fills credentials and clicks Sign In will pass even if the login is broken — as long as no element throws an error. The test runs. It is green. It proves nothing.\n\nA test without `expect()` calls is a script, not a test. Treat any test with zero assertions as incomplete.",
      },
      {
        type: "code",
        heading: "Before-and-After: Contact Form",
        language: "typescript",
        code: "// BEFORE: Raw codegen output\nimport { test } from '@playwright/test';\n\ntest('test', async ({ page }) => {\n  await page.goto('http://localhost:5173/contact');\n  await page.locator('#name').fill('Jane Doe');\n  await page.locator('#email').fill('jane@example.com');\n  await page.locator('#phone').fill('555-0100');\n  await page.locator('select').selectOption('support');\n  await page.locator('textarea').fill('I need help with my order.');\n  await page.waitForTimeout(1000);\n  await page.locator('button[type=\"submit\"]').click();\n  await page.waitForTimeout(2000);\n});\n\n// AFTER: Refined with the five-point template\nimport { test, expect } from '@playwright/test';\n\ntest('submits contact form and shows success message', async ({ page }) => {\n  // Arrange — navigate to the contact page\n  await page.goto('/contact');\n\n  // Act — fill and submit the form\n  await page.getByTestId('name-input').fill('Jane Doe');\n  await page.getByTestId('contact-email-input').fill('jane@example.com');\n  await page.getByTestId('phone-input').fill('555-0100');\n  await page.getByTestId('subject-select').selectOption('support');\n  await page.getByTestId('message-input').fill('I need help with my order.');\n  await page.getByTestId('submit-button').click();\n\n  // Assert — verify success feedback\n  await expect(page.getByTestId('success-message')).toBeVisible();\n  await expect(page.getByTestId('success-message')).toContainText('received');\n});",
      },
      {
        type: "table",
        heading: "Refinement Checklist",
        headers: ["Keep", "Improve", "Remove"],
        rows: [
          ["The real login path", "The test name and assertions", "Noise comments or dead clicks"],
          ["Stable selectors the recorder found", "The proof after the click", "Any unnecessary wait or duplicate step"],
          ["The shared credentials helper", "The readability of the spec", "Placeholder output from the recorder"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        heading: "Re-Run With Artifacts",
        content:
          "After the cleanup, run the test again and open the HTML report. If the project is configured for trace on first retry, you now have the right shape of spec to debug cleanly the first time it fails.",
      },
    ],
    quiz: {
      questions: [
        {
          question: "Which change has the highest payoff after recording a flow?",
          options: [
            "Changing the quote style",
            "Adding proof that the intended outcome happened",
            "Splitting one import into two lines",
            "Moving the test into a different folder immediately",
          ],
          correctIndex: 1,
          explanation:
            "Assertions and outcome checks are the biggest upgrade because they turn the recorded path into a genuine automated check instead of a replay script.",
        },
        {
          question:
            "What is the main risk of a test that has no expect() assertions?",
          options: [
            "The test runs slower because Playwright waits for assertions",
            "The test passes even when the feature is broken",
            "Playwright throws an error if no assertions are found",
            "The test cannot be recorded with codegen",
          ],
          correctIndex: 1,
          explanation:
            "A test without assertions exercises a flow but verifies nothing. It will pass as long as no element throws an error — even if the actual feature is broken. Always add expect() calls that prove the expected outcome.",
        },
      ],
    },
    exercise: {
      title: "Refine the Recorded Login Spec",
      description:
        "Take the recorded login draft and turn it into a stable check you would be comfortable showing in review. Keep the same path, but tighten the name, the proof, and the rerun workflow.",
      starterCode: `import { test } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test.skip("recorded login draft for editor account", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByLabel("Email").click();
  await page.getByLabel("Email").fill(credentials.editor.email);
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill(credentials.editor.password);
  await page.getByRole("button", { name: "Log In" }).click();

  // TODO: add route proof
  // TODO: add visible dashboard proof
});`,
      solutionCode: `import { test, expect } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test("editor login reaches the dashboard", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByLabel("Email").fill(credentials.editor.email);
  await page.getByLabel("Password").fill(credentials.editor.password);
  await page.getByRole("button", { name: "Log In" }).click();

  await expect(page).toHaveURL(/#\\/dashboard$/);
  await expect(page.getByTestId("dashboard-heading")).toContainText("Welcome, Test User");
});`,
      hints: [
        "Keep the Arrange-Act-Assert shape visible in the finished test, even without comments.",
        "Check both the route and the dashboard heading after the click.",
        "Run the finished spec again and open the report while the change is still fresh in your head.",
      ],
      lab: createExerciseLab(
        "e2e/first-playwright-tests/lesson-09-refine-recording.spec.ts",
        "pnpm exec playwright test e2e/first-playwright-tests/lesson-09-refine-recording.spec.ts --project=chromium && pnpm exec playwright show-report",
        [
          "The refined test passes without test.skip.",
          "The spec proves both the route change and the dashboard content.",
          "You rerun the test and open the report after the cleanup pass.",
        ],
      ),
    },
    promptTemplates: [
      {
        label: "Refine a Recorder Draft",
        context: "Use this when the recorder gave you the right path but not enough proof.",
        prompt: `Tighten this recorded Playwright spec.

Rules:
- keep the same user flow
- keep only stable selectors
- add assertions for the actual expected outcome
- remove dead steps, dead comments, and unnecessary noise

Draft:
[PASTE TEST HERE]`,
      },
    ],
    practiceLink: createPracticeLink(
      firstPlaywrightTestRoutes.dashboard,
      "Review the dashboard output the refined login test should prove",
      `Your assertions should confirm this page loaded for ${firstPlaywrightTestCredentials.editor.email}, not just that a click happened.`,
    ),
    narrationScript: {
      intro:
        "The recorder did its job. This lesson is where you do yours: turn the draft into something readable, defensible, and easy to rerun.",
      steps: [
        {
          text: "Start by reading the saved draft as if a teammate sent it to you. Is the scenario name useful? Is the proof visible? Those answers tell you what to tighten first.",
          duration: 18,
        },
        {
          text: "Assertions come from acceptance criteria, not from guessing. The ticket tells you what should happen after each action. A test without expect calls is a script, not a test — it exercises a flow but proves nothing. Always add proof that the expected outcome appeared.",
          duration: 20,
        },
        {
          text: "After the login click, add proof for the dashboard route and the visible heading. That is the minimum evidence the happy path needs.",
          navigateTo: "/dashboard",
          highlight: "dashboard-heading",
          duration: 20,
        },
        {
          text: "Finish by rerunning the test and opening the report. Cleanup is only complete when the better version has produced a clean result.",
          duration: 18,
        },
      ],
      outro:
        "You now have one passing refined test. The capstone turns that into a tiny but real test pack with two independent checks.",
    },
  },
});
