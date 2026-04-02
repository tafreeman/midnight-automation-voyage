import {
  createSingleLessonModule,
  createPracticeLink,
  createExerciseLab,
  routes,
} from "../shared";

export const copilotAgentModeModule = createSingleLessonModule({
  index: 6,
  title: "Copilot Agent Mode",
  subtitle: "Let Copilot generate, run, and fix tests autonomously",
  icon: "🤖",
  estimatedMinutes: 14,
  learningObjectives: [
    "Use Copilot Agent Mode to generate a test, run it, and auto-fix failures in a single autonomous loop",
    "Set boundaries for agent mode: what it should and should not do autonomously",
    "Review agent mode output using the same HITL checklist as manually-prompted tests",
  ],
  lesson: {
    title: "Copilot Agent Mode",
    subtitle: "Let Copilot generate, run, and fix tests autonomously",
    estimatedMinutes: 14,
    sections: [
      {
        type: "text",
        heading: "What Agent Mode Does Differently",
        content:
          "Chat mode: you prompt, Copilot responds, you copy code, you run, you paste error, Copilot fixes. Agent mode: you describe the goal, Copilot works autonomously — it reads files, writes code, runs terminal commands, reads error output, fixes, and re-runs until done. It automates the Review-Run-Fix loop from Module 5.",
      },
      {
        type: "text",
        heading: "When to Use Agent Mode",
        content:
          'Good for bounded, single-page tasks: "Write a test for /products, run it, fix any failures." "Add error path tests to the existing contact form spec." Bad for architectural tasks: "Rewrite all tests to use POM." "Refactor the entire test suite." Agent mode performs well on 1-2 file tasks but produces more mistakes across 10+ files. From governance principles: agent mode increases velocity, not authority. You still review every line.',
      },
      {
        type: "code",
        heading: "An Agent Mode Prompt With Boundaries",
        language: "text",
        code: `Generate a Playwright TypeScript test for the settings page at /settings.

The page has tabs: Profile, Notifications, Security.
Test: clicking each tab shows the correct content panel.
Test: updating the profile name field persists the change.

Boundaries:
- Only create or modify files in tests/e2e/
- Do not change any application source code in src/
- Use getByRole('tab') for tab buttons, getByRole('tabpanel') for content
- Use storageState from .auth/user.json for authentication
- Run the tests after generating and fix any failures

Stop after: tests pass or 3 fix attempts (whichever comes first).`,
      },
      {
        type: "table",
        heading: "Agent Mode vs Chat: When to Use Which",
        headers: ["Dimension", "Agent Mode", "Chat Mode"],
        rows: [
          [
            "Control",
            "Autonomous — you review after",
            "Interactive — you control each step",
          ],
          [
            "Best for",
            "Bounded single-page tasks",
            "Exploratory or learning new patterns",
          ],
          [
            "Speed",
            "Faster — automates run/fix loop",
            "Slower — you mediate each step",
          ],
          [
            "Risk",
            "May over-engineer or add unnecessary files",
            "You catch issues in real-time",
          ],
          [
            "Learning value",
            "Lower — you see the end result",
            "Higher — you see each decision",
          ],
        ],
      },
      {
        type: "text",
        heading: "Reviewing Agent Output",
        content:
          "Same HITL checklist from legacy Module 28, adapted: (1) Are selectors stable? getByRole/getByLabel preferred. (2) Are assertions meaningful? Not just toBeVisible but checking actual content. (3) No hidden waits? No waitForTimeout snuck in as a \"fix.\" (4) No over-engineering? Did agent mode create unnecessary helper classes, config files, or abstractions? (5) Is each test independent? No shared state between tests.",
      },
      {
        type: "callout",
        variant: "warning",
        heading: "The Over-Engineering Trap",
        content:
          "\"Copilot tends to create unnecessarily complex abstractions when simpler structure suffices\" (from T.J. Maher's experience). Watch for: POM class created for a single test, helper utility that's used once, custom fixture wrapping a standard Playwright fixture, constants file for two strings. If agent mode creates these, delete them and re-run. Simpler is better for 1-2 tests.",
      },
    ],
    quiz: {
      questions: [
        {
          question:
            "What is the key difference between Chat mode and Agent mode?",
          options: [
            "Agent mode uses a different AI model",
            "Agent mode can autonomously run terminal commands, read output, and iterate",
            "Agent mode writes better code",
            "Agent mode doesn't need instructions files",
          ],
          correctIndex: 1,
          explanation:
            "Agent mode's defining feature is autonomy — it can execute commands in the terminal, read their output, and iterate on fixes without you mediating each step. The underlying model and code quality are the same.",
        },
        {
          question:
            "Why should you set boundaries in an agent mode prompt?",
          options: [
            "To make agent mode run faster",
            "Without boundaries, it may modify source code, create unnecessary files, or over-engineer",
            "Boundaries are required by VS Code",
            "To limit Copilot's token usage",
          ],
          correctIndex: 1,
          explanation:
            "Without explicit boundaries, agent mode may modify application source code, create unnecessary abstractions, or make changes outside the test directory. Boundaries like \"only modify files in tests/e2e/\" prevent scope creep.",
        },
      ],
    },
    exercise: {
      title: "Agent Mode: Settings Page Test",
      description:
        "Switch to Agent Mode in Copilot Chat. Give it the bounded prompt to generate tests for the /settings page (tab navigation, profile update). Let it run and self-fix autonomously. Review the output against the HITL checklist. Note: how many iterations did it need? Did it over-engineer anything?",
      starterCode: `// No starter code — agent mode generates from scratch.
// Use this prompt template in Agent Mode:
//
// Generate a Playwright TypeScript test for the settings page at /settings.
//
// The page has tabs: Profile, Notifications, Security.
// Test: clicking each tab shows the correct content panel.
// Test: updating the profile name field persists the change.
//
// Boundaries:
// - Only create or modify files in tests/e2e/
// - Do not change any application source code in src/
// - Use getByRole('tab') for tab buttons, getByRole('tabpanel') for content
// - Use storageState from .auth/user.json for authentication
// - Run the tests after generating and fix any failures
//
// Stop after: tests pass or 3 fix attempts (whichever comes first).`,
      solutionCode: `import { test, expect } from "@playwright/test";

test.describe("Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings");
  });

  test("clicking each tab shows the correct content panel", async ({ page }) => {
    const tabs = ["Profile", "Notifications", "Security"];

    for (const tabName of tabs) {
      await page.getByRole("tab", { name: tabName }).click();
      const panel = page.getByRole("tabpanel");
      await expect(panel).toBeVisible();
      await expect(panel).toContainText(tabName);
    }
  });

  test("updating the profile name field persists the change", async ({ page }) => {
    await page.getByRole("tab", { name: "Profile" }).click();

    const nameField = page.getByLabel("Name");
    await nameField.clear();
    await nameField.fill("Updated Test User");

    await page.getByRole("button", { name: "Save" }).click();

    // Reload and verify persistence
    await page.reload();
    await page.getByRole("tab", { name: "Profile" }).click();
    await expect(page.getByLabel("Name")).toHaveValue("Updated Test User");
  });
});`,
      hints: [
        "Select Agent mode from the Copilot Chat dropdown before prompting",
        "Include the boundary rules in your prompt — especially 'only modify files in tests/e2e/'",
        "After agent mode finishes, review for over-engineering: did it create files you didn't ask for?",
      ],
      lab: createExerciseLab(
        "e2e/copilot-first-testing/lesson-06-settings.spec.ts",
        "pnpm exec playwright test e2e/copilot-first-testing/lesson-06-settings.spec.ts --project=chromium",
        [
          "Test file generated by agent mode, not typed manually",
          "Tests pass for tab navigation and profile update",
          "No unnecessary helper files or abstractions created",
          "All selectors use getByRole or getByLabel",
        ],
      ),
    },
    promptTemplates: [
      {
        label: "Agent Mode: Bounded Test Generation",
        context:
          "Template for any agent mode test generation task. Fill in the page details and boundaries.",
        prompt: `Generate a Playwright TypeScript test for [PAGE] at [ROUTE].

The page has: [DESCRIBE UI ELEMENTS]

Tests to generate:
1. [TEST SCENARIO 1]
2. [TEST SCENARIO 2]

Boundaries:
- Only create or modify files in tests/e2e/
- Do not change application source code in src/
- Use [SELECTOR STRATEGY] for interactive elements
- Use storageState for authentication if needed
- Run the tests after generating and fix any failures
- Stop after: tests pass or 3 fix attempts`,
      },
    ],
    practiceLink: createPracticeLink(
      routes.settings,
      "Open the settings page",
      "Explore the tab navigation and profile form before launching agent mode.",
    ),
    narrationScript: {
      intro:
        "Agent mode automates the Review-Run-Fix loop from Module 5. Instead of you mediating each step, Copilot works autonomously: generate, run, read errors, fix, re-run. Your job shifts to setting boundaries upfront and reviewing the result.",
      steps: [
        {
          text: "Select Agent mode from the Copilot Chat dropdown. This changes the interaction model: instead of one response, Copilot will work in a loop until the task is done.",
          duration: 14,
        },
        {
          text: "Paste the bounded prompt. Include explicit boundaries: what files to touch, what selectors to use, when to stop. Without boundaries, agent mode may modify source code or create unnecessary abstractions.",
          duration: 18,
        },
        {
          text: "Watch agent mode work. It will generate the test, run it in the terminal, read any errors, fix the code, and re-run. You can intervene at any point if it goes off track.",
          duration: 16,
        },
        {
          text: "When agent mode finishes, apply the HITL review checklist. Check for over-engineering: did it create helper classes for a two-test file? If so, simplify.",
          duration: 16,
        },
      ],
      outro:
        "Agent mode is powerful for bounded tasks. But it still generates selectors from code context alone. Next: Playwright MCP gives Copilot eyes on the real application through accessibility snapshots.",
    },
  },
});
