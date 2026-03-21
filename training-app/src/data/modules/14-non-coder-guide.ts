import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 11,
  title: "Non-Coder Survival Guide",
  subtitle: "Practical tips for testers who don't code daily",
  icon: "🎯",
  audience: "Non-Coder Essential",
  sections: [
    {
      heading: "Your Superpower: Domain Knowledge",
      content: "You know the business rules better than any developer on the team. You know the edge cases users hit. You know which flows break in production. That knowledge is MORE valuable than coding skill for test quality. Your job is to specify WHAT to test — Copilot + Playwright handle HOW to test it.",
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
      heading: "When to Escalate to a Developer",
      content: "You don't need to solve everything. Here's your decision tree for when to escalate.",
      table: {
        headers: ["Situation", "Your Action"],
        rows: [
          ["Test fails — wrong selector", "Try the debug prompt template. If stuck after 5 min, escalate."],
          ["Test needs auth/fixture setup", "Escalate — fixture configuration is developer territory."],
          ["Need to mock an API response", "Escalate — network interception requires code understanding."],
          ["Copilot generates confusing code", "Use /explain command first. If still unclear, escalate."],
          ["Test passes but you're unsure it's correct", "ALWAYS escalate — false confidence is worse than no test."],
          ["Need to test a flow across multiple pages", "Record it as one flow. If it breaks, escalate for POM refactoring."],
        ]
      },
      tip: "Escalating is a sign of good judgment, not weakness. Better to ask for help than merge a bad test."
    },
    {
      heading: "Common Gotchas for Non-Coders",
      content: "These are the mistakes we see most often from people new to test automation.",
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
      content: "Industry research reveals an irony: the hardest skills in automation aren't programming — they're testing skills that manual testers already have. Knowing what to test, how to design meaningful scenarios, recognizing when something 'feels wrong,' understanding how system components affect each other, and triaging whether a failure is a real bug or a test environment issue. Developers learning automation often struggle with exactly these skills because they think like builders, not breakers. Your testing mindset is the foundation that makes automation valuable — without it, you just have scripts that click buttons and check nothing meaningful.",
      callout: "A developer who can code but can't think like a tester writes automation that misses real bugs. A manual tester who can think but is learning to code writes automation that catches real bugs. Invest in yourself — the hard part is already done."
    }
  ],
  quiz: {
    question: "A non-coder records a test, refines it with Copilot, and it passes. What's the critical next step before committing?",
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
      prompt: "Context: I'm a manual tester. I have this user story: 'As a user, I can log in with my email and password, and see my dashboard with my recent orders.'\n\nAction: Convert this user story into a Playwright test. I don't know code, so use simple, readable patterns.\n\nResult: The test should verify login works and the dashboard shows orders.\n\nDetails: Use getByRole and getByText selectors (they read like English). Add comments explaining each step.",
    },
    {
      label: "Record and Clean Up Test",
      context: "Use Codegen to record, then ask Copilot to clean up the generated code.",
      prompt: "I recorded this test with Playwright Codegen but the selectors look messy and fragile. Clean it up: replace auto-generated CSS selectors with getByRole, getByText, or data-testid selectors. Add meaningful test names and assertions. Group related steps with comments.",
    },
    {
      label: "Explain Test Code Simply",
      context: "When you encounter Playwright code you don't understand, ask for a plain-English explanation.",
      prompt: "Explain this Playwright test to me like I'm a manual tester who doesn't write code. For each line, tell me: what it does in plain English, why it's there, and what the equivalent manual testing step would be. Don't use jargon.",
    },
  ],
};
