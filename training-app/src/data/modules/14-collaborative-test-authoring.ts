import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 13,
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
  narrationScript: {
    intro: "At this point you have recorded flows, refined them with Copilot, read test results, and applied the HITL checklist. This lesson is about taking that workflow back to your desk and making it stick — the daily rhythm, the common gotchas, and how to work with your team on test contributions.",
    steps: [
      {
        text: "Here's your daily workflow. Five steps, five minutes per test flow once you're comfortable. Step one: read the ticket and pull out the acceptance criteria. Step two: open the recorder and click through the app like you normally would. Step three: paste the recorded code into Copilot with the refine prompt template. Step four: tell Copilot what to assert, based on those acceptance criteria. Step five: run it. Green means commit. Red means diagnose or ask for help.",
        duration: 30
      },
      {
        text: "Let's talk about that 'ask for help' part, because it's really important. You do not need to solve every problem in one pass. If a test fails because a selector changed, try the debug prompt template. If you're still stuck after five minutes, stop. Inspect the page. Ask a teammate. Five minutes of spinning your wheels is fine. Thirty minutes is not.",
        duration: 22
      },
      {
        text: "Reading error messages is a skill, and it's one that gets better fast. When a test fails, Playwright gives you a lot of information. The key parts to look for: which test failed, which line it failed on, and what the expected versus actual values were. Most of the time, a failed test means either the app changed, the selector drifted, or your assertion is checking the wrong element. Start with those three possibilities and you'll solve most failures.",
        duration: 28
      },
      {
        text: "When should you escalate? Here's a simple rule. If Copilot generates code you don't understand even after using the 'explain this' prompt, don't merge it. If you need to mock an API response or set up authentication fixtures, that might be a good time to pair with a developer. If a test passes but something feels off about the assertions, trust that instinct. Your testing judgment is exactly what prevents false confidence from creeping into the suite.",
        duration: 25
      },
      {
        text: "Let's talk about working with your team. When you submit a test for review, include a note saying which acceptance criteria it covers. That makes the reviewer's job much easier and shows traceability. When you review someone else's test, use the HITL checklist from last lesson. Every time. It takes two minutes and catches the majority of common problems.",
        duration: 22
      },
      {
        text: "Here are the gotchas that trip up almost everyone in the first week. Forgetting to start the app before running tests, so everything fails with 'connection refused.' Editing the wrong file, so your changes don't show up. Trusting Copilot's assertions without comparing them to the ticket. Not pulling the latest code, so tests fail because the app changed under you. And recording against the wrong environment so URLs get baked in. All of these are easy to avoid once you know to watch for them.",
        duration: 28
      },
      {
        text: "Your first week plan. Monday: make sure your environment works and run the example tests. Tuesday: record three simple flows, like login, search, and navigation. Wednesday: refine those recordings using the Copilot prompt templates. Thursday: add assertions and submit your first test as a merge request. Friday: review someone else's test using the HITL checklist. By Friday, you've contributed real tests and reviewed someone else's work. That's a full-stack contribution in your first week.",
        duration: 30
      },
      {
        text: "One more thing. Keep the vocabulary cheat sheet handy. Terms like assertion, locator, fixture, page object, flaky test, headless, trace, and CI pipeline come up constantly in stand-ups and pull request reviews. You don't need to memorize definitions. You need to recognize them when they fly by in conversation so you can follow along and ask the right follow-up questions.",
        duration: 22
      }
    ],
    outro: "That wraps up Course 1: Foundations. You have a working workflow — record, refine, review — and a checklist to keep quality high on every merge request. Course 2 covers page objects, API testing, auth fixtures, and CI pipelines. Start with Monday's plan: run the example tests, then record your first three flows against the practice app."
  }
};
