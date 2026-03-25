import {
  createExerciseLab,
  createPracticeLink,
  createSingleLessonModule,
  firstPlaywrightTestCredentials,
  firstPlaywrightTestRoutes,
} from "../shared";

export const tightenAndRerunTheRecordingModule = createSingleLessonModule({
  index: 8,
  title: "Tighten and Re-Run the Recording",
  subtitle: "Turn the saved draft into a stable check with clear proof and rerun it with artifacts",
  icon: "🛠️",
  estimatedMinutes: 10,
  learningObjectives: [
    "Refine a recorded login draft into a readable spec with meaningful assertions",
    "Use Copilot to tighten code without giving up review control",
    "Rerun the refined spec and inspect the report and trace-producing settings",
  ],
  lesson: {
    title: "Tighten and Re-Run the Recording",
    subtitle: "Turn the saved draft into a stable check with clear proof and rerun it with artifacts",
    estimatedMinutes: 10,
    sections: [
      {
        type: "text",
        heading: "What to Tighten First",
        content:
          "Start with the things a reviewer notices fastest: placeholder names, weak locators, and missing proof. You are not polishing for style points. You are making the intent of the test obvious before someone else has to trust it.",
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
  await page.getByLabel("Email").fill(credentials.editor.email);
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
        "e2e/first-playwright-tests/lesson-08-refine-recording.spec.ts",
        "npx playwright test e2e/first-playwright-tests/lesson-08-refine-recording.spec.ts --project=chromium && npx playwright show-report",
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
