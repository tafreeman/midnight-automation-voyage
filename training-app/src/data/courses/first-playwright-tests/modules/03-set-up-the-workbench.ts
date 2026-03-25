import {
  createExerciseLab,
  createPracticeLink,
  createSingleLessonModule,
  firstPlaywrightTestRoutes,
  hashRouteNote,
} from "../shared";

const setupExercise = {
  title: "Run the Starter Smoke Check",
  description:
    "Use the provided smoke-check spec to confirm your machine can launch Playwright, open the practice app, and report a passing result.",
  starterCode: `import { test, expect } from "@playwright/test";
import { gotoRoute } from "../support/practice";

test("login form is visible", async ({ page }) => {
  await gotoRoute(page, "/login");

  await expect(page.getByTestId("email-input")).toBeVisible();
  await expect(page.getByTestId("password-input")).toBeVisible();
  await expect(page.getByTestId("login-button")).toBeVisible();
});`,
  // No solutionCode — this is an execution-only exercise (run and verify green)
  hints: [
    "Install Playwright into the local workspace before you try to run the spec.",
    "Open the integrated terminal in VS Code so the command runs from practice-app.",
    "If the browser does not launch, install the browsers with pnpm exec playwright install.",
  ],
  lab: createExerciseLab(
    "e2e/first-playwright-tests/lesson-03-smoke-login.spec.ts",
    "pnpm exec playwright test e2e/first-playwright-tests/lesson-03-smoke-login.spec.ts --project=chromium",
    [
      "The command finishes with a green result for the smoke check.",
      "The report lists one test and zero failures.",
      "You can see the login form selectors in the passing test output.",
    ],
  ),
};

export const setUpTheWorkbenchModule = createSingleLessonModule({
  index: 3,
  title: "Set Up the Workbench",
  subtitle: "Install the local tools and verify your first passing run",
  icon: "🧰",
  estimatedMinutes: 12,
  learningObjectives: [
    "Install the Playwright runtime, browsers, and editor extensions used in this course",
    "Identify the small set of commands needed to run and inspect tests",
    "Separate zero-install browsing from the local build workflow in VS Code",
  ],
  lesson: {
    title: "Set Up the Workbench",
    subtitle: "Install the local tools and verify your first passing run",
    estimatedMinutes: 12,
    sections: [
      {
        type: "table",
        heading: "What Each Tool Does",
        headers: ["Tool", "Why it is in the stack", "What you will use it for first"],
        rows: [
          ["Node.js", "Runs the local tooling", "Install Playwright and execute the test runner"],
          ["VS Code", "Gives you the terminal, explorer, and Playwright UI", "Open the workspace and inspect the starter spec"],
          ["GitHub Copilot", "Speeds up drafting and cleanup", "Help turn prompts and recordings into test code"],
          ["Playwright", "Drives the browser and reports outcomes", "Run the smoke check against the login page"],
        ],
      },
      {
        type: "code",
        heading: "Install and Verify",
        language: "bash",
        code: `cd practice-app
pnpm install
pnpm add -D @playwright/test
pnpm exec playwright install chromium
pnpm exec playwright test e2e/first-playwright-tests/lesson-03-smoke-login.spec.ts --project=chromium`,
      },
      {
        type: "text",
        heading: "Two Lanes, One Course",
        content:
          "Browse mode is for reading the training app and exploring the practice app without setup drama. Build mode starts when you open the repo in VS Code and run the local Playwright commands. The course uses both on purpose: one lane explains the workflow, the other gives you a real place to try it.",
      },
      {
        type: "callout",
        variant: "tip",
        heading: "Repo-Specific Detail",
        content: hashRouteNote,
      },
    ],
    quiz: {
      questions: [
        {
          question: "What is the fastest proof that your local Playwright setup is working?",
          options: [
            "Opening the practice app in a browser tab",
            "Seeing the VS Code extension install successfully",
            "Running the smoke check and getting a green result",
            "Signing in manually with the test account",
          ],
          correctIndex: 2,
          explanation:
            "The smoke check exercises the actual stack: Playwright, the browser binary, the practice app route, and the selectors used by the test. A passing result proves the toolchain works together.",
        },
      ],
    },
    exercise: { ...setupExercise },
    promptTemplates: [
      {
        label: "Fix a Setup Blocker",
        context: "Use this in Copilot Chat when installation or browser launch fails.",
        prompt: `I am setting up Playwright in the practice-app workspace.

Command that failed:
[PASTE COMMAND]

Error output:
[PASTE ERROR]

Please do three things:
1. Explain what the failure means in plain language.
2. Give me the next exact terminal command to try.
3. Tell me how I can verify the fix worked with one follow-up command.`,
      },
    ],
    practiceLink: createPracticeLink(
      firstPlaywrightTestRoutes.login,
      "Open the login page that the smoke check targets",
      "Use the same page in the browser while you install Playwright locally in VS Code.",
    ),
    narrationScript: {
      intro:
        "This lesson is about friction removal. You need just enough setup to open the repo, run a Playwright command, and prove the toolchain is alive.",
      steps: [
        {
          text: "Open the practice-app workspace in VS Code. The editor gives you the two things you need right away: the file tree and the integrated terminal.",
          duration: 16,
        },
        {
          text: "Install the test runner and the browser binary before you do anything clever with Copilot. A clean local run is the foundation for every later lesson.",
          duration: 18,
        },
        {
          text: "Once the smoke check passes, setup is complete. Move straight to the next lesson.",
          duration: 18,
        },
      ],
      outro:
        "With the workbench in place, the next lesson moves from setup to execution. You will run the same test from the terminal, from VS Code, and through the HTML report.",
    },
  },
});
