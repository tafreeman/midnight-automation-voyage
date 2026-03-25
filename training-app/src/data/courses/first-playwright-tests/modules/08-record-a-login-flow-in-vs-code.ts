import {
  createExerciseLab,
  createPracticeLink,
  createSingleLessonModule,
  firstPlaywrightTestCredentials,
  firstPlaywrightTestRoutes,
} from "../shared";

export const recordALoginFlowInVsCodeModule = createSingleLessonModule({
  index: 8,
  title: "Record a Login Flow in VS Code",
  subtitle: "Use the recorder to capture the happy path and save a first draft spec",
  icon: "🎥",
  estimatedMinutes: 8,
  learningObjectives: [
    "Open the Playwright recorder from VS Code and capture a real login flow",
    "Recognize what recorded output includes automatically and what it leaves for you to refine",
    "Save recorded code into the intended lesson workspace instead of leaving it temporary",
  ],
  lesson: {
    title: "Record a Login Flow in VS Code",
    subtitle: "Use the recorder to capture the happy path and save a first draft spec",
    estimatedMinutes: 8,
    sections: [
      {
        type: "text",
        heading: "Why Record First",
        content:
          "Recording is the quickest way to turn a real user path into editable code. It is especially useful the first time you automate a flow because it removes the blank-page problem. The tradeoff is that recorded code is only a draft, which is why the next lesson exists.",
      },
      {
        type: "code",
        heading: "Terminal Recorder Command",
        language: "bash",
        code: `pnpm exec playwright codegen http://localhost:5173`,
      },
      {
        type: "text",
        heading: "VS Code Recorder Steps",
        content:
          "1. Open the Testing view (beaker icon). 2. Choose Record new. 3. Interact with the practice app in the launched browser. The recorder captures each action as a line of Playwright code in the editor.",
      },
      {
        type: "table",
        heading: "What Recording Gives You",
        headers: ["Captured automatically", "Still your job afterward"],
        rows: [
          ["Clicks, fills, and navigation", "Naming the test for the user scenario"],
          ["A working first draft of the steps", "Replacing weak selectors when needed"],
          ["A file you can save and rerun", "Adding assertions that prove the outcome"],
        ],
      },
      {
        type: "callout",
        variant: "tip",
        heading: "Save the Draft Where the Course Expects It",
        content:
          "Do not leave the recorded output in a temporary scratch file. Save it into the lesson workspace so the next refinement pass starts in the same place you ran the rest of the labs.",
      },
    ],
    quiz: {
      questions: [
        {
          question: "What is the recorder best thought of as?",
          options: [
            "A final answer generator",
            "A browser debugger only",
            "A first draft that captures the flow quickly",
            "A replacement for assertions",
          ],
          correctIndex: 2,
          explanation:
            "The recorder is valuable because it captures the path fast. The proof, cleanup, and naming still belong to you afterward.",
        },
      ],
    },
    exercise: {
      title: "Save the Recorded Draft",
      description:
        "Treat the recorder output like a first draft. Save it into the lesson file, give the test a useful name, and keep the happy-path login steps intact for the refinement lesson.",
      starterCode: `import { test } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test.skip("test", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByLabel("Email").click();
  await page.getByLabel("Email").fill(credentials.editor.email);
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill(credentials.editor.password);
  await page.getByRole("button", { name: "Log In" }).click();
});`,
      solutionCode: `import { test } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test("recorded login draft for editor account", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByLabel("Email").click(); // recorder noise — cleaned in lesson 09
  await page.getByLabel("Email").fill(credentials.editor.email);
  await page.getByLabel("Password").click(); // recorder noise — cleaned in lesson 09
  await page.getByLabel("Password").fill(credentials.editor.password);
  await page.getByRole("button", { name: "Log In" }).click();
});`,
      hints: [
        "Keep the flow exactly as recorded for now.",
        "Rename the test so the scenario is obvious before anyone reads the body.",
        "You will add assertions in the next lesson, not in this one.",
      ],
      lab: createExerciseLab(
        "e2e/first-playwright-tests/lesson-08-recorded-login.spec.ts",
        "pnpm exec playwright test e2e/first-playwright-tests/lesson-08-recorded-login.spec.ts --project=chromium",
        [
          "The recorder output is saved into the expected lesson file.",
          "The test name explains the scenario instead of using a placeholder name.",
          "The spec body still reflects the same login flow you recorded in VS Code.",
        ],
      ),
    },
    practiceLink: createPracticeLink(
      firstPlaywrightTestRoutes.login,
      "Use the login page as the recorder target",
      `Record the happy path with ${firstPlaywrightTestCredentials.editor.email} so the next lesson can focus on cleanup instead of path selection.`,
    ),
    narrationScript: {
      intro:
        "This lesson is about momentum. You are using the recorder to capture a real login flow in seconds so your attention stays on the behavior, not on typing boilerplate.",
      steps: [
        {
          text: "Launch the recorder from the Testing view in VS Code. The point is to let the browser interactions create the first draft for you.",
          duration: 16,
        },
        {
          text: "On the login page, fill the editor account and submit the form. Watch how each action becomes a line of code in the editor.",
          navigateTo: "/login",
          highlight: "email-input",
          duration: 22,
        },
        {
          text: "Once the flow is captured, save the draft in the lesson file and give it a name that tells the next reader what the scenario is.",
          duration: 18,
        },
      ],
      outro:
        "The draft is ready. Next you will tighten it: better naming, stronger proof, and a rerun with artifacts you can inspect.",
    },
  },
});
