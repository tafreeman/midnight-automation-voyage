import {
  createExerciseLab,
  createPracticeLink,
  createSingleLessonModule,
  firstPlaywrightTestCredentials,
  firstPlaywrightTestRoutes,
} from "../shared";

export const readATestLikeEvidenceModule = createSingleLessonModule({
  index: 5,
  title: "Read a Test Like Evidence",
  subtitle: "Separate the browser actions from the proof that the feature behaved correctly",
  icon: "🧾",
  estimatedMinutes: 10,
  learningObjectives: [
    "Break a Playwright spec into Arrange, Act, and Assert",
    "Recognize a test that clicks through a flow without proving enough",
    "Add a small set of assertions that match the user story",
  ],
  lesson: {
    title: "Read a Test Like Evidence",
    subtitle: "Separate the browser actions from the proof that the feature behaved correctly",
    estimatedMinutes: 10,
    sections: [
      {
        type: "text",
        heading: "Arrange, Act, Assert",
        content:
          "A readable test sets the starting point, performs the user action, then checks the result. That three-part shape is not academic. It is what lets a reviewer decide whether the test matches the story or only resembles it.",
      },
      {
        type: "code",
        heading: "A Thin Test and a Better Test",
        language: "typescript",
        code: `// Thin: the flow runs, but the proof is weak
await gotoRoute(page, "/login");
await page.getByTestId("email-input").fill("user@test.com");
await page.getByTestId("password-input").fill("Password123!");
await page.getByTestId("login-button").click();

// Better: the flow runs and the result is checked
await expect(page).toHaveURL(/#\\/dashboard$/);
await expect(page.getByTestId("dashboard-heading")).toContainText("Welcome, Test User");`,
      },
      {
        type: "table",
        heading: "Questions to Ask Any Assertion",
        headers: ["Question", "Why it matters"],
        rows: [
          ["Would this fail if the redirect never happened?", "It catches broken navigation instead of assuming it."],
          ["Would this fail if the wrong user landed on the page?", "It keeps role or account mistakes from sliding through."],
          ["Would this fail if the page shell loaded but the real content did not?", "It prevents false confidence from shallow checks."],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        heading: "A Passing Test Can Still Be Weak",
        content:
          "Green does not mean complete. A test that clicks and waits can pass while the wrong feature is on screen. Review the proof, not just the result icon.",
      },
    ],
    quiz: {
      questions: [
        {
          question: "Which assertion adds the strongest proof after a successful login click?",
          options: [
            "Check that the login button still exists",
            "Check that the URL includes #/dashboard and the dashboard heading welcomes the user",
            "Check that the page title contains Practice App",
            "Check that the browser window stayed open",
          ],
          correctIndex: 1,
          explanation:
            "That pair of assertions proves both the route change and the visible outcome the user cares about. It is much stronger than checking that the page kept rendering.",
        },
      ],
    },
    exercise: {
      title: "Add the Missing Proof",
      description:
        "This starter spec signs in successfully, but it stops before proving the destination page is correct. Add assertions that would catch a bad redirect or the wrong user landing on the dashboard.",
      starterCode: `import { test } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test.skip("editor can sign in", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByTestId("email-input").fill(credentials.editor.email);
  await page.getByTestId("password-input").fill(credentials.editor.password);
  await page.getByTestId("login-button").click();

  // TODO: add proof that the right page loaded for the right user
});`,
      solutionCode: `import { test, expect } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test("editor can sign in", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByTestId("email-input").fill(credentials.editor.email);
  await page.getByTestId("password-input").fill(credentials.editor.password);
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/#\\/dashboard$/);
  await expect(page.getByTestId("dashboard-heading")).toContainText("Welcome, Test User");
});`,
      hints: [
        "One assertion should check where the browser landed.",
        "One assertion should check what the user can actually see on the dashboard.",
        "The editor account's display name is 'Test User', which appears in the dashboard heading after login.",
      ],
      lab: createExerciseLab(
        "e2e/first-playwright-tests/lesson-05-add-proof-to-login.spec.ts",
        "pnpm exec playwright test e2e/first-playwright-tests/lesson-05-add-proof-to-login.spec.ts --project=chromium",
        [
          "The updated test passes without test.skip.",
          "The spec would fail if the dashboard route never loaded.",
          "The spec would fail if the welcome heading showed the wrong user name.",
        ],
      ),
    },
    practiceLink: createPracticeLink(
      firstPlaywrightTestRoutes.dashboard,
      "Inspect the dashboard output used by the login proof",
      "You are checking for a route change and a user-specific heading, not just any page after the click.",
    ),
    narrationScript: {
      intro:
        "This lesson is where browser action turns into evidence. You are reading a small login spec and deciding whether it proves enough.",
      steps: [
        {
          text: `Start with the login flow. The credentials are known and stable: ${firstPlaywrightTestCredentials.editor.email}. The click itself is not the interesting part. The proof after the click is.`,
          navigateTo: "/login",
          highlight: "login-button",
          duration: 18,
        },
        {
          text: "Look at the destination next. If the route changes and the welcome heading includes the right name, the spec is now proving something that matters to the story.",
          navigateTo: "/dashboard",
          highlight: "dashboard-heading",
          duration: 20,
        },
        {
          text: "That is the habit to build: every major action should earn its own visible check, especially on the first version of a test.",
          duration: 16,
        },
      ],
      outro:
        "Now that the idea of proof is clear, the next lesson focuses on how the test finds the page elements in the first place.",
    },
  },
});
