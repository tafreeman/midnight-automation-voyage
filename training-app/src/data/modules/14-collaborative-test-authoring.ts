import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 11,
  title: "Test Authoring Guide",
  subtitle: "Practical habits for turning product knowledge into reliable automation",
  icon: "🎯",
  sections: [
    {
      heading: "Your Superpower: Domain Knowledge",
      content: "The people closest to requirements, defects, and customer behavior bring the strongest ideas for what should be automated. Business rules, edge cases, and production pain points are often more valuable than raw typing speed. Your job is to specify what matters; Playwright and Copilot help express that precisely.",
      callout: "The best test suite isn't the one with the most code — it's the one that catches the most real bugs. That comes from domain knowledge, not programming skill."
    },
    {
      heading: "The 5-Minute Workflow",
      content: "This is your daily routine for contributing tests. It takes about 5 minutes per test flow once you're comfortable.",
      table: {
        headers: ["Step", "Time", "Tool", "Your Action"],
        rows: [
          ["1. Read the ticket", "1 min", "Jira/ADO", "Identify the acceptance criteria to test"],
          ["2. Record the flow", "2 min", "VS Code Recorder", "Click through the app normally"],
          ["3. Refine with Copilot", "1 min", "Copilot Chat", "Paste the 'Refine' prompt template"],
          ["4. Add assertions", "1 min", "Copilot Chat", "Tell Copilot what to verify (from the AC)"],
          ["5. Run and commit", "1 min", "VS Code / Terminal", "Green = commit. Red = diagnose or escalate"],
        ]
      }
    },
    {
      heading: "When to Pause and Re-Evaluate",
      content: "You do not need to solve every problem in one pass. Here is a quick decision tree for when to stop, gather more context, or get a second set of eyes before making the test more complex.",
      table: {
        headers: ["Situation", "Your Action"],
        rows: [
          ["Test fails because a selector drifted", "Try the debug prompt template. If you are still blocked after 5 minutes, stop and inspect the page state before changing more code."],
          ["Test needs auth or fixture setup", "Check whether the setup belongs in a reusable fixture instead of inlining it into the spec."],
          ["Need to mock an API response", "Pause and decide whether network interception is really needed or whether a more stable test boundary exists."],
          ["Copilot generates confusing code", "Use /explain first. If it still feels opaque, do not merge it until the logic is clear."],
          ["Test passes but you are unsure it is correct", "Always pause and review the assertions. False confidence is worse than no test."],
          ["Need to cover a long multi-page flow", "Record it first, then decide whether it should stay inline or move into page objects."],
        ]
      },
      tip: "Stopping to clarify the boundary is a sign of good judgment. Better to pause than merge a bad test."
    },
    {
      heading: "Common Early-Stage Gotchas",
      content: "These are the mistakes we see most often from people who are new to test automation.",
      table: {
        headers: ["Gotcha", "What Happens", "Prevention"],
        rows: [
          ["Forgetting to start the app", "All tests fail with connection refused", "Run 'npm run dev' first or configure webServer in config"],
          ["Editing the wrong file", "Your changes don't appear in test runs", "Always work in e2e/ folder — check file path"],
          ["Trusting Copilot assertions blindly", "Tests pass but check the wrong thing", "Compare every assertion to the ticket's AC"],
          ["Not pulling latest code", "Tests fail because app changed", "Always git pull before recording"],
          ["Recording on wrong environment", "Tests have wrong URLs baked in", "Record against localhost, use baseURL config"],
        ]
      }
    },
    {
      heading: "Your First Week Plan",
      content: "Follow this progression. Each day builds on the previous.",
      table: {
        headers: ["Day", "Goal", "Lesson Reference"],
        rows: [
          ["Mon", "Complete environment setup + run example tests", "Lessons 2–4"],
          ["Tue", "Record 3 simple flows (login, search, nav)", "Lesson 6"],
          ["Wed", "Refine recordings with Copilot prompt templates", "Lessons 5–6, 10"],
          ["Thu", "Add assertions and submit first test MR", "Lessons 7, 12"],
          ["Fri", "Review someone else's test using HITL checklist", "Lesson 12"],
        ]
      }
    },
    {
      heading: "Vocabulary Cheat Sheet",
      content: "Terms you'll encounter in test reviews and stand-ups. Knowing the vocabulary makes you a more effective participant even before you're comfortable with the code.",
      table: {
        headers: ["Term", "Plain English Meaning"],
        rows: [
          ["Assertion / expect()", "A check that verifies something is correct — 'I expect this text to say Welcome'"],
          ["Selector / Locator", "How the test finds an element on the page — like an address for a button or input field"],
          ["data-testid", "A special HTML tag added specifically for tests to find elements reliably"],
          ["Fixture", "Pre-made setup that runs before a test — like logging in automatically so every test doesn't repeat login"],
          ["Page Object Model (POM)", "Organizing test code so each page has its own file with all its buttons and actions defined once"],
          ["Flaky test", "A test that sometimes passes and sometimes fails with no code change — usually a timing or selector problem"],
          ["Headless / Headed", "Headless = browser runs invisibly (fast). Headed = you can see the browser window (useful for debugging)"],
          ["Trace", "A recording of everything the browser did during a test — screenshots, network calls, DOM at each step"],
          ["CI/CD Pipeline", "Automatic system that runs tests every time code is submitted — you don't have to remember to run them"],
          ["Regression test", "A test that checks existing features still work after new changes — the core use case for automation"],
        ]
      }
    },
    {
      heading: "The Automation Paradox: Why You're Already Ahead",
      content: "Industry research reveals an irony: the hardest skills in automation are often not syntax. They are deciding what matters, designing meaningful scenarios, recognizing when something feels wrong, understanding how system components affect each other, and triaging whether a failure is a real bug or a test environment issue. Those testing skills are what make automation valuable. Without them, you just have scripts that click buttons and verify very little.",
      callout: "Strong automation comes from combining product insight, testing judgment, and implementation discipline. The win is the combination, not one role outranking another."
    }
  ],
  quiz: {
    question: "A test is recorded, refined with Copilot, and passes. What is the critical next step before committing?",
    options: [
      "Run it again to make sure",
      "Verify every assertion maps to an acceptance criterion from the ticket",
      "Ask Copilot if the test is correct",
      "Check that the test is under 50 lines of code"
    ],
    correctIndex: 1,
    explanation: "A passing test that checks the wrong things gives false confidence. The human review step — mapping assertions to acceptance criteria — is the non-negotiable governance gate."
  },
  exercise: {
    title: "Refine a Codegen Recording with CARD",
    description: "Below is raw output from Playwright Codegen. Apply the CARD refinement approach to clean it into a production-quality test with proper selectors and assertions.",
    starterCode: `// Raw codegen output — needs refinement:
test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/contact');
  await page.locator('#root > div > form > input:nth-child(1)').fill('Jane');
  await page.locator('#root > div > form > input:nth-child(2)').fill('jane@test.com');
  await page.locator('#root > div > form > textarea').fill('Hello');
  await page.locator('#root > div > form > button').click();
});

// YOUR TASK: Refine this using what you learned:
// 1. Replace CSS selectors with data-testid locators
// 2. Add a descriptive test name
// 3. Add assertions that verify the form submission worked
// REFINED TEST: [TODO]`,
    solutionCode: `// Refined test with proper selectors and assertions:
test('contact form submits successfully with valid data', async ({ page }) => {
  await page.goto('/contact');

  // Fill required fields using stable selectors
  await page.locator('[data-testid="contact-name"]').fill('Jane');
  await page.locator('[data-testid="contact-email"]').fill('jane@test.com');
  await page.locator('[data-testid="contact-message"]').fill('Hello, this is a test message.');

  // Submit the form
  await page.locator('[data-testid="contact-submit"]').click();

  // Verify success feedback
  await expect(page.locator('[data-testid="contact-success"]')).toBeVisible();
  await expect(page.locator('[data-testid="contact-success"]')).toContainText('Thank you');
});`,
    hints: [
      "Replace nth-child selectors with data-testid — check the practice app HTML for the actual testid names",
      "The test name should describe the user scenario: 'contact form submits successfully with valid data'",
      "Always add at least one assertion that verifies the expected outcome after submission",
    ],
  },
  practiceLink: {
    url: "http://localhost:5173/login",
    label: "Record a login test with Codegen",
    description: "Use Codegen to generate a login flow test without writing code.",
  },
  promptTemplates: [
    {
      label: "Generate Test from User Story",
      context: "Convert a plain-English user story into a Playwright test using CARD format.",
      prompt: "Context: I have this user story: 'As a user, I can log in with my email and password, and see my dashboard with my recent orders.'\n\nAction: Convert this user story into a Playwright test using simple, readable patterns.\n\nResult: The test should verify login works and the dashboard shows orders.\n\nDetails: Use getByRole and getByText selectors where possible. Add comments explaining each step.",
    },
    {
      label: "Record and Clean Up Test",
      context: "Use Codegen to record, then ask Copilot to clean up the generated code.",
      prompt: "I recorded this test with Playwright Codegen but the selectors look messy and fragile. Clean it up: replace auto-generated CSS selectors with getByRole, getByText, or data-testid selectors. Add meaningful test names and assertions. Group related steps with comments.",
    },
    {
      label: "Explain Test Code Simply",
      context: "When you encounter Playwright code you don't understand, ask for a plain-English explanation.",
      prompt: "Explain this Playwright test in plain English. For each line, tell me what it does, why it is there, and what the equivalent exploratory or verification step would be. Do not use jargon.",
    },
  ],
};
