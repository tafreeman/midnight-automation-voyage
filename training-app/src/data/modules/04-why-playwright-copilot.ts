import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 1,
  title: "Why Playwright + Copilot",
  subtitle: "Understanding the productivity multiplier",
  icon: "🚀",
  sections: [
    {
      heading: "The Testing Bottleneck",
      content: "Test automation is consistently the top bottleneck in delivery. Not because testing is hard — but because writing test code is slow, maintaining it is tedious, and most test frameworks fight you with flaky behavior. Playwright solves the execution side (reliable, fast, multi-browser). Copilot solves the authoring side (describe what you want, get working code). Together, they compress the create → run → maintain cycle dramatically.",
    },
    {
      heading: "Playwright vs. Alternatives",
      content: "Playwright was built by the team behind Puppeteer at Microsoft. It addresses the core pain points of Selenium (flaky waits, browser driver management) and Cypress (single-browser limitation, no multi-tab). Key differentiator: auto-wait. Playwright automatically waits for elements to be ready before interacting, eliminating the single biggest source of flaky tests.",
      table: {
        headers: ["Capability", "Selenium", "Cypress", "Playwright"],
        rows: [
          ["Auto-wait", "❌ Manual sleeps", "⚠️ Partial", "✅ Built-in"],
          ["Multi-browser", "✅ Config-heavy", "❌ Chromium-focused", "✅ One API"],
          ["Parallel execution", "⚠️ Grid required", "❌ Serial default", "✅ Native"],
          ["Network interception", "❌", "✅", "✅"],
          ["Built-in recorder", "❌", "⚠️ Limited", "✅ Full codegen"],
          ["Trace viewer", "❌", "⚠️ Screenshots", "✅ Time-travel debug"],
        ]
      }
    },
    {
      heading: "The Copilot Multiplier",
      content: "Copilot doesn't replace testers — it removes the mechanical translation step between 'I know what to test' and 'I have working test code.' The shift: you stop writing tests character-by-character and start describing what needs testing in structured English.",
      table: {
        headers: ["Phase", "Without Copilot", "With Copilot"],
        rows: [
          ["Scaffolding", "30–60 min manual", "5–10 min prompted"],
          ["Selector authoring", "Trial & error in DevTools", "Context-aware suggestions"],
          ["Edge case coverage", "Developer-dependent", "Copilot surfaces common gaps"],
          ["Debugging failures", "Manual trace reading", "Copilot explains stack traces"],
          ["Test maintenance", "High (brittle selectors)", "Stable locator patterns"],
        ]
      }
    },
    {
      heading: "The Governance Boundary",
      content: "Copilot generates code. It does NOT validate business logic. Every generated test must be reviewed against acceptance criteria before merge. This is the same human-in-the-loop standard we apply across all AI-augmented development.",
      warning: "Never merge Copilot-generated tests without validating: correct assertions, realistic test data, no hardcoded waits, and alignment with the acceptance criteria on the ticket."
    }
  ],
  practiceLink: {
    url: "http://localhost:5173/login",
    label: "Explore the practice app",
    description: "See the login page, products, and checkout flow — the test targets you'll automate with Playwright + Copilot.",
  },
  exercise: {
    title: "Compare Locator Strategies",
    description: "Given this HTML snippet from the practice app, write three different Playwright locator approaches and identify which is most resilient to UI refactoring.",
    starterCode: `// HTML element to locate:
// <button class="btn btn-primary mt-4" data-testid="login-button" type="submit">
//   Sign In
// </button>

// Write three locator strategies:

// 1. CSS selector approach:
const cssLocator = page.locator(''); // TODO

// 2. data-testid approach:
const testIdLocator = page.locator(''); // TODO

// 3. getByRole approach:
const roleLocator = page.locator(''); // TODO

// Which is most resilient? Why?
// ANSWER: `,
    solutionCode: `// HTML element to locate:
// <button class="btn btn-primary mt-4" data-testid="login-button" type="submit">
//   Sign In
// </button>

// Write three locator strategies:

// 1. CSS selector approach:
const cssLocator = page.locator('button.btn.btn-primary.mt-4');
// Fragile: breaks if any CSS class changes

// 2. data-testid approach:
const testIdLocator = page.locator('[data-testid="login-button"]');
// Resilient: only breaks if testid is removed

// 3. getByRole approach:
const roleLocator = page.getByRole('button', { name: 'Sign In' });
// Resilient: semantic, accessible, reads like English

// Which is most resilient? Why?
// ANSWER: data-testid is the repository convention — it survives
// CSS refactors, text changes (if localized), and restructuring.
// getByRole is also excellent and preferred by Playwright docs.
// CSS selectors are the most fragile and should be avoided.`,
    hints: [
      "CSS selectors use class names — think about what happens when a designer changes styling",
      "data-testid attributes exist specifically for testing and are unlikely to change during refactoring",
      "getByRole uses semantic HTML roles — it's the most 'user-like' way to find elements",
    ],
  },
  promptTemplates: [
    {
      label: "Compare Testing Approaches",
      context: "Use when evaluating Playwright against Selenium and Cypress to justify framework selection.",
      prompt: "Context: I am evaluating test automation frameworks for a web application. I need to compare Selenium, Cypress, and Playwright side by side with concrete code examples.\n\nAction: Write a sample test for the following scenario in all three frameworks — navigate to a login page, fill in email and password fields, click the submit button, and assert the user is redirected to a dashboard page.\n\nRules:\n- Highlight how each framework handles waiting for elements (auto-wait vs explicit waits vs manual sleeps)\n- Show the selector strategy each framework encourages (CSS selectors, data attributes, role-based locators)\n- Note the verbosity difference — count the lines of code for each\n- Call out any required boilerplate (driver setup, browser launch, config files)\n\nData:\n- Login URL: /login\n- Email field: data-testid=\"email-input\"\n- Password field: data-testid=\"password-input\"\n- Submit button: text \"Sign In\"\n- Success URL after login: /dashboard",
    },
    {
      label: "Estimate Automation Time Savings",
      context: "Use when building a business case for adopting Playwright + Copilot automation over manual testing.",
      prompt: "Context: I currently run a manual testing workflow and want to understand the return on investment from automating it with Playwright and GitHub Copilot.\n\nAction: Given the manual workflow described below, estimate the time savings from automation. Break down your analysis into: (1) one-time setup cost in hours, (2) per-execution time comparison (manual vs automated), (3) break-even point in number of test runs, and (4) projected monthly savings after break-even.\n\nRules:\n- Be realistic about setup costs — include learning curve, writing tests, CI integration, and maintenance overhead\n- Factor in Copilot's productivity boost for writing and maintaining tests (estimate 40-60% faster test authoring)\n- Account for parallel execution reducing total suite run time\n- Include the value of catching regressions earlier in the pipeline\n\nData — Manual workflow:\n- 12 test cases covering login, product search, add-to-cart, checkout, and order confirmation\n- Each manual run takes approximately 45 minutes per tester\n- Tests are executed 3 times per week across 2 browsers\n- 1 tester is dedicated to this regression cycle\n- Average bug escape rate with manual testing: 2 per month",
    },
  ],
  quiz: {
    question: "What is Playwright's primary advantage over Selenium for test reliability?",
    options: [
      "It uses JavaScript instead of Java",
      "Built-in auto-wait eliminates manual sleep() calls",
      "It only runs in Chrome so there's less to configure",
      "It doesn't require any selectors"
    ],
    correctIndex: 1,
    explanation: "Playwright's auto-wait mechanism automatically waits for elements to be actionable before interacting, eliminating the most common source of flaky Selenium tests."
  }
};
