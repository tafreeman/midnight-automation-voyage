import {
  createExerciseLab,
  createPracticeLink,
  createSingleLessonModule,
  duplicateExercise,
  firstPlaywrightTestRoutes,
} from "../shared";

const runModesExercise = {
  title: "Run the Same Test Three Ways",
  description:
    "Use one passing spec to practice the three views you will use constantly: terminal output, headed browser execution, and the HTML report.",
  starterCode: `import { test, expect } from "@playwright/test";
import { gotoRoute } from "../support/practice";

test("login form is visible", async ({ page }) => {
  await gotoRoute(page, "/login");

  await expect(page.getByTestId("email-input")).toBeVisible();
  await expect(page.getByTestId("password-input")).toBeVisible();
  await expect(page.getByTestId("login-button")).toBeVisible();
});`,
  // No solutionCode — this is an execution-only exercise (run the same test three ways)
  hints: [
    "Run the plain command first so you can read the text output cleanly.",
    "Use --headed when you want to watch the browser and sanity-check the flow.",
    "Open the report after the run so you can connect the command output to a saved result.",
  ],
  lab: createExerciseLab(
    "e2e/first-playwright-tests/lesson-04-run-login-check.spec.ts",
    "pnpm exec playwright test e2e/first-playwright-tests/lesson-04-run-login-check.spec.ts --headed --project=chromium",
    [
      "The same spec passes from both the terminal and the VS Code test runner.",
      "Headed mode opened a visible browser window and you observed the form fields being filled before the assertion ran.",
      "The HTML report opens and lists the spec with a passing status.",
    ],
  ),
};

export const runTestsFromVsCodeAndTerminalModule = createSingleLessonModule({
  index: 4,
  title: "Run Tests from VS Code and Terminal",
  subtitle: "Use the beaker view, headed mode, and the saved report without switching mental models",
  icon: "▶️",
  estimatedMinutes: 8,
  learningObjectives: [
    "Run a single Playwright spec from the terminal and from VS Code",
    "Know when to use plain output, headed mode, and the HTML report",
    "Read a passing run as a sequence of actions rather than a wall of text",
  ],
  lesson: {
    title: "Run Tests from VS Code and Terminal",
    subtitle: "Use the beaker view, headed mode, and the saved report without switching mental models",
    estimatedMinutes: 8,
    sections: [
      {
        type: "table",
        heading: "Three Useful Views",
        headers: ["View", "Best for", "Command or place"],
        rows: [
          ["Terminal output", "Fast feedback while you work", "`pnpm exec playwright test <file>`"],
          ["Headed browser", "Watching the user flow with your own eyes", "`pnpm exec playwright test <file> --headed`"],
          ["HTML report", "Reviewing the finished run after the fact", "`pnpm exec playwright show-report`"],
        ],
      },
      {
        type: "code",
        heading: "The Core Commands",
        language: "bash",
        code: `pnpm exec playwright test e2e/first-playwright-tests/lesson-04-run-login-check.spec.ts --project=chromium
pnpm exec playwright test e2e/first-playwright-tests/lesson-04-run-login-check.spec.ts --headed --project=chromium
pnpm exec playwright show-report`,
      },
      {
        type: "text",
        heading: "Use the Tool That Matches the Question",
        content:
          "If you only need to know pass or fail, the terminal is enough. If you are asking whether the flow looks right, use headed mode. If you need a saved artifact to review or share, open the report. They are three views on the same run, not three different workflows.",
      },
    ],
    quiz: {
      questions: [
        {
          question: "Which option is the best fit when you want to watch the browser perform the flow?",
          options: [
            "Open the HTML report first",
            "Run the spec with --headed",
            "Use only the VS Code Problems panel",
            "Switch to trace viewer before running the test",
          ],
          correctIndex: 1,
          explanation:
            "Headed mode keeps the execution visible while still using the normal Playwright runner. It is the simplest way to confirm the browser is taking the path you expect.",
        },
      ],
    },
    exercise: duplicateExercise(runModesExercise),
    practiceLink: createPracticeLink(
      firstPlaywrightTestRoutes.login,
      "Keep the login page open while you compare run modes",
      "The page gives you a visual anchor while you learn how the terminal, headed run, and report relate to each other.",
    ),
    narrationScript: {
      intro:
        "This lesson shows the same spec through three different windows.",
      steps: [
        {
          text: "Run the spec from the terminal first. That gives you the shortest path from command to result.",
          duration: 14,
        },
        {
          text: "Now run the same spec headed. The test is not different. What changes is your visibility into the browser steps.",
          duration: 16,
        },
        {
          text: "Finish by opening the HTML report. The report is the artifact you return to after the run, especially when you want a cleaner read than the scrolling terminal gives you.",
          duration: 18,
        },
      ],
      outro:
        "The mechanics are in place now. The next lesson shifts from running tests to reading whether a test is actually proving the right thing.",
    },
  },
});
