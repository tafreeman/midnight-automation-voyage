import { createPracticeLink, createSingleLessonModule, firstPlaywrightTestRoutes } from "../shared";

export const seeATestDoRealWorkModule = createSingleLessonModule({
  index: 1,
  title: "See a Test Do Real Work",
  subtitle: "Start with a passing login check and read what it proves",
  icon: "🔎",
  estimatedMinutes: 6,
  learningObjectives: [
    "Describe what a browser test proves and what it leaves unanswered",
    "Recognize the run-read-refine loop used throughout the course",
    "Connect a test run to visible evidence in the practice app",
  ],
  lesson: {
    title: "See a Test Do Real Work",
    subtitle: "Start with a passing login check and read what it proves",
    estimatedMinutes: 6,
    sections: [
      {
        type: "text",
        heading: "Start With the Evidence",
        content:
          "This course does not begin with syntax. It begins with a test run. When a Playwright check opens the login page, submits real credentials, and lands on the dashboard, you can see the browser do the work and you can read the result afterward. That pairing matters because automation is only useful when the action and the proof stay connected.",
      },
      {
        type: "code",
        heading: "One Small Passing Test",
        language: "typescript",
        code: String.raw`import { test, expect } from "@playwright/test";
import { gotoRoute, credentials } from "../support/practice";

test("editor can sign in and reach the dashboard", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByTestId("email-input").fill(credentials.editor.email);
  await page.getByTestId("password-input").fill(credentials.editor.password);
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/#\/dashboard$/);
  await expect(page.getByTestId("dashboard-heading")).toContainText("Welcome, Test User");
});`,
      },
      {
        type: "code",
        heading: "Try It — Run This Test",
        language: "bash",
        code: `cd practice-app
pnpm exec playwright test e2e/first-playwright-tests/lesson-01-login.spec.ts --project=chromium --headed

# Slow it down so you can follow each step (1 second between actions)
pnpm exec playwright test e2e/first-playwright-tests/lesson-01-login.spec.ts --project=chromium --headed --slow-mo=1000`,
      },
      {
        type: "callout",
        variant: "tip",
        heading: "First Time Here?",
        content:
          "If the command fails with a missing package or browser error, skip ahead to Lesson 3 (Set Up the Workbench) for the full install steps, then come back and run this.",
      },
      {
        type: "table",
        heading: "What the Run Tells You",
        headers: ["Signal", "What you can trust", "What still needs judgment"],
        rows: [
          ["Page loaded", "The route resolved and the login form rendered", "Whether the login page is the right starting point for the story"],
          ["Credentials worked", "The app accepted the known test account", "Whether this is the right account for the scenario"],
          ["Dashboard heading appeared", "The happy-path redirect finished", "Whether that heading is enough proof for the acceptance criteria"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        heading: "The Course Loop",
        content:
          "Every lesson builds the same loop from a different angle: run or record a flow, read the output critically, tighten the selectors and assertions, then run it again.",
      },
    ],
    quiz: {
      questions: [
        {
          question: "Which step turns a browser demo into a real test?",
          options: [
            "Watching the browser window open",
            "Adding evidence with assertions",
            "Renaming the spec file",
            "Running the test in headed mode",
          ],
          correctIndex: 1,
          explanation:
            "The browser actions matter, but the assertions are what prove the expected outcome happened. Without them, you only know the app did not crash during the clicks.",
        },
      ],
    },
    practiceLink: createPracticeLink(
      firstPlaywrightTestRoutes.login,
      "Open the login page used throughout the first three lessons",
      "You will use this same route to watch a passing test, run it yourself, and then record it in VS Code.",
    ),
    narrationScript: {
      intro:
        "Open with the result, not the theory. In this first lesson, you are watching a browser test do one complete piece of work: sign in to the practice app and prove the dashboard loaded for the right user.",
      steps: [
        {
          text: "Start on the login page. Two inputs and one button are enough to show the full shape of an end-to-end check: arrange the page, act like a user, then verify the result.",
          navigateTo: "/login",
          highlight: "email-input",
          duration: 18,
        },
        {
          text: "The test fills real credentials and clicks the real submit button. Nothing about this is simulated from the learner's point of view. That is why Playwright is useful for training: you can see the same application behavior a customer would see.",
          highlight: "login-button",
          duration: 20,
        },
        {
          text: "The important part comes after the click. The test does not stop at navigation. It checks the dashboard heading and makes sure the route changed. That is the proof that turns the run into evidence.",
          navigateTo: "/dashboard",
          highlight: "dashboard-heading",
          duration: 22,
        },
      ],
      outro:
        "That is the standard for the rest of the course: visible action, explicit proof, and a report you can read afterward. Next, you will set up the local tools that let you run this yourself.",
    },
  },
});
