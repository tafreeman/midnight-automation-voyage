import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 1,
  title: "Why Playwright + Copilot",
  subtitle: "Understanding the productivity multiplier",
  icon: "🚀",
  audience: "All Roles",
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
