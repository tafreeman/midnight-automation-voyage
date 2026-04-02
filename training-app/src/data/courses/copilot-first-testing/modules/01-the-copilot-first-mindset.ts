import {
  createSingleLessonModule,
  createPracticeLink,
  createExerciseLab,
  routes,
  credentials,
} from "../shared";

export const theCopilotFirstMindsetModule = createSingleLessonModule({
  index: 1,
  title: "The Copilot-First Mindset",
  subtitle: "Stop typing tests — start directing them",
  icon: "🧠",
  estimatedMinutes: 10,
  learningObjectives: [
    "Distinguish 'Copilot helps me code' from 'Copilot writes, I review'",
    "Name the three roles in AI-assisted testing: execution, authoring, and judgment",
    "Describe the Generate → Review → Run → Fix loop as the core workflow",
  ],
  lesson: {
    title: "The Copilot-First Mindset",
    subtitle: "Stop typing tests — start directing them",
    estimatedMinutes: 10,
    sections: [
      {
        type: "text",
        heading: "Two Ways to Use an AI",
        content:
          "Most people use Copilot in helper mode: you write the code, Copilot fills in the next line. That is useful but slow. This course teaches director mode: you describe the test in structured English, Copilot writes the entire first draft, and you review it like a pull request. The skill shifts from memorizing Playwright APIs to giving clear instructions and spotting bad output.",
      },
      {
        type: "table",
        heading: "Three Roles, Clear Boundaries",
        headers: ["Role", "Who / What", "Responsibility"],
        rows: [
          [
            "Execution",
            "Playwright",
            "Drives the browser, handles timing, manages contexts, reports results",
          ],
          [
            "Authoring",
            "GitHub Copilot",
            "Generates test code from your descriptions and context",
          ],
          [
            "Judgment",
            "You",
            "Decide what to test, set acceptance criteria, review output, approve assertions",
          ],
        ],
      },
      {
        type: "text",
        heading: "The Generate → Review → Run → Fix Loop",
        content:
          "The core workflow has four steps that repeat until the test is clean. First, provide Copilot with rich context (the page, actions, rules, expected evidence) and let it generate a complete test. Second, review the output: are the selectors stable? Are the assertions meaningful? Third, run the test — expect failures on the first attempt. Fourth, feed the error message back to Copilot with specific context and let it fix the issue. Research shows three iterations is the sweet spot; beyond that, restructure the prompt instead of iterating further.",
      },
      {
        type: "callout",
        variant: "info",
        heading: "What This Course Assumes",
        content:
          "You have completed Course 1 (First Playwright Tests) or have equivalent experience: you can run a Playwright test, read a spec file, and know the locator hierarchy (getByRole → getByLabel → getByTestId). You have a GitHub Copilot subscription and the Copilot extension installed in VS Code.",
      },
      {
        type: "table",
        heading: "What Changes From Course 1",
        headers: ["Dimension", "Course 1: Helper Mode", "This Course: Director Mode"],
        rows: [
          [
            "Who writes the test",
            "You write code, Copilot completes lines",
            "Copilot writes the full draft, you review",
          ],
          [
            "Key skill",
            "Playwright API knowledge",
            "Structured prompting and output review",
          ],
          [
            "How you fix failures",
            "Debug and edit code manually",
            "Feed errors back to Copilot, re-prompt",
          ],
          [
            "What scales",
            "Your typing speed",
            "Your ability to direct and configure Copilot",
          ],
        ],
      },
    ],
    quiz: {
      questions: [
        {
          question:
            "In 'director mode', who writes the first draft of the test?",
          options: [
            "You write it and Copilot suggests improvements",
            "Copilot writes it based on your structured prompt",
            "The Playwright recorder captures it",
            "A teammate writes it and you review",
          ],
          correctIndex: 1,
          explanation:
            "In director mode, you provide the structured description (page, actions, rules, evidence) and Copilot generates the entire first draft. Your job is review and iteration, not line-by-line authoring.",
        },
        {
          question:
            "After Copilot generates a test that runs but has wrong assertions, what is the best next step?",
          options: [
            "Delete the test and start over with a new prompt",
            "Manually edit the assertions yourself",
            "Feed the specific failure back to Copilot with context and let it fix",
            "Accept the test as-is since it passes",
          ],
          correctIndex: 2,
          explanation:
            "The Review-Run-Fix loop is the core skill. Feeding specific error context back to Copilot builds the prompting skill that scales across all future tests. Manual editing is a last resort.",
        },
      ],
    },
    exercise: {
      title: "Generate Your First Directed Test",
      description:
        "Open Copilot Chat and paste the prompt template below. Do not write any test code yourself — let Copilot generate the entire test. Run it. Note what passed and what failed. This is your first experience with director mode.",
      starterCode: `import { test, expect } from "@playwright/test";

// TODO: Paste the prompt template from the sidebar into Copilot Chat.
// Let Copilot generate the entire test body below.
// Do NOT write code yourself — only review and run what Copilot produces.

test.describe("Login — Director Mode First Draft", () => {
  // Copilot will generate tests here
});`,
      solutionCode: `import { test, expect } from "@playwright/test";

test.describe("Login — Director Mode First Draft", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should redirect to dashboard on successful login", async ({ page }) => {
    await page.getByLabel("Email").fill("${credentials.editor.email}");
    await page.getByLabel("Password").fill("${credentials.editor.password}");
    await page.getByRole("button", { name: "Log In" }).click();

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByTestId("dashboard-heading")).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.getByLabel("Email").fill("wrong@test.com");
    await page.getByLabel("Password").fill("WrongPass1!");
    await page.getByRole("button", { name: "Log In" }).click();

    await expect(page.getByRole("alert")).toContainText("Invalid");
  });
});`,
      hints: [
        "Copy the prompt template from the sidebar — do not type test code.",
        "Run with: pnpm exec playwright test <filename> --project=chromium",
        "If selectors are wrong, note which ones failed for the next lesson on fixing.",
      ],
      lab: createExerciseLab(
        "e2e/copilot-first-testing/lesson-01-first-directed.spec.ts",
        "pnpm exec playwright test e2e/copilot-first-testing/lesson-01-first-directed.spec.ts --project=chromium",
        [
          "The test file contains code generated by Copilot, not typed by you.",
          "At least one test passes (login happy path).",
          "You can articulate what Copilot got right and what needs fixing.",
        ],
      ),
    },
    promptTemplates: [
      {
        label: "Director Mode: Login Test",
        context:
          "Paste this into Copilot Chat to generate your first directed test. Do not modify it — use exactly as written.",
        prompt: `Using Playwright with TypeScript, generate an e2e test for the login page at /login.

Page: Login page with Email and Password fields and a "Log In" button.
Actions:
1. Navigate to /login
2. Fill email with ${credentials.editor.email}
3. Fill password with ${credentials.editor.password}
4. Click the Log In button
5. Verify redirect to /dashboard

Guardrails:
- Use getByLabel for form fields, getByRole for buttons
- Use expect(page).toHaveURL() for navigation checks
- No waitForTimeout or manual waits
- Each test must be independent

Evidence:
- Successful login redirects to /dashboard
- Invalid credentials show an error alert

Generate two tests: happy path and invalid credentials.`,
      },
    ],
    practiceLink: createPracticeLink(
      routes.login,
      "Open the login page",
      "The page your first directed test will target.",
    ),
    narrationScript: {
      intro:
        "This course flips the script. Instead of learning Playwright syntax and using Copilot to fill in blanks, you will learn to direct Copilot to write entire tests — then review what it produces like a code reviewer.",
      steps: [
        {
          text: "There are three roles in AI-assisted testing. Playwright handles execution — driving the browser, managing timing. Copilot handles authoring — turning your descriptions into code. You handle judgment — deciding what to test and whether the output is correct.",
          duration: 20,
        },
        {
          text: "The core workflow is a loop: generate a test from a structured prompt, review the output for selector quality and assertion correctness, run it and expect first-attempt failures, then feed the errors back to Copilot for fixing. Three iterations maximum before you restructure the prompt.",
          duration: 22,
        },
        {
          text: "Try it now. Open Copilot Chat, paste the prompt template, and let it generate a login test. Do not type any test code yourself. Run the result and see what happens.",
          duration: 16,
        },
      ],
      outro:
        "With the mindset in place, the next lesson sets up the configuration that makes Copilot consistently produce good output — without repeating yourself in every prompt.",
    },
  },
});
