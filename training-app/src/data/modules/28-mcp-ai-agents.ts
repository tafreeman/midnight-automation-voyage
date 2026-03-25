import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 28,
  title: "Playwright MCP and AI Agents",
  subtitle: "Using shared AI context, bounded automation, and reviewable agent workflows",
  icon: "🤖",
  sections: [
    {
      heading: "What MCP Adds to Browser Automation",
      content:
        "Model Context Protocol, or MCP, is the bridge between an AI assistant and a live browser session. Instead of guessing at the DOM from static code alone, the assistant can inspect accessibility snapshots, reason about page state, and propose the next action with much better context. That makes browser guidance more grounded, but it does not remove the need for human review.",
      callout:
        "MCP increases visibility, not authority. The team still decides whether an agent action or generated test is acceptable."
    },
    {
      heading: "Planner, Generator, and Healer",
      content:
        "Recent Playwright agent workflows commonly split into three jobs. A planner turns a request into a test plan. A generator turns that plan into code. A healer proposes focused repairs when selectors drift or a test breaks for a known reason. This separation matters because it gives you a clean place to review intent before code and code before repair.",
      table: {
        headers: ["Agent", "Best Use", "Human Review Check"],
        rows: [
          ["Planner", "Turn a feature request into clear test intent", "Are the scenarios and assertions the right ones?"],
          ["Generator", "Draft a first version of the spec", "Are locators, waits, and assertions maintainable?"],
          ["Healer", "Suggest a narrow repair for a broken test", "Did it fix the cause without masking a product bug?"],
        ],
      },
    },
    {
      heading: "Reusable Copilot Context",
      content:
        "A repository-level prompt file such as `.github/copilot-instructions.md` gives every AI interaction the same codebase conventions. That is where you define selector strategy, assertion expectations, naming patterns, and review boundaries. Shared context is what keeps AI assistance from becoming a pile of inconsistent one-off prompts.",
      code: `# .github/copilot-instructions.md
# Shared Playwright guidance
- Prefer getByRole and data-testid selectors over CSS selectors
- Add at least one assertion after each meaningful action
- Use relative URLs with baseURL from config
- Do not use page.waitForTimeout()
- Flag any generated waits, force clicks, or brittle selectors for review
- When uncertain, ask for clarification instead of guessing`,
      codeLanguage: "markdown",
      tip:
        "The prompt file should describe project standards, not personal preferences. Keep it stable, reviewable, and version-controlled.",
    },
    {
      heading: "Boundaries and Governance",
      content:
        "The safest use of AI agents is bounded work with visible checkpoints. Ask for a plan before a spec. Ask for repairs with a stated failure reason. Record prompt provenance in comments or commit notes when the generated output changes test intent. Most importantly, run the same HITL review checklist on generated code that you would apply to handwritten code.",
      warning:
        "A generated test can pass while still being wrong. Brittle selectors, missing assertions, and hardcoded waits are still defects even when an agent wrote them.",
    },
  ],
  quiz: {
    question:
      "Why should AI-generated tests still go through the HITL review checklist?",
    options: [
      "Because the checklist is only for handwritten tests",
      "Because generated tests can still contain weak assertions, brittle selectors, or hidden waits",
      "Because AI-generated tests cannot run in CI",
      "Because MCP makes browser execution slower",
    ],
    correctIndex: 1,
    explanation:
      "AI assistance speeds up drafting, but it does not guarantee test quality. Human review is still needed to verify intent, assertions, selector quality, and maintenance risk.",
  },
  exercise: {
    title: "Draft Shared Copilot Guidance and a Bounded Agent Task",
    description:
      "Write a reusable Copilot prompt file for the practice app, then draft an agent request for generating a Contact form test with explicit review checkpoints.",
    starterCode: `# .github/copilot-instructions.md
# TODO: Define the Playwright conventions for this repository

Agent task:
"Generate a Playwright test for the Contact form."

# TODO:
# 1. Add selector strategy
# 2. Add assertion expectations
# 3. Add review checkpoints before merge`,
    solutionCode: `# .github/copilot-instructions.md
# Shared Playwright guidance for this repo
- Prefer getByRole and data-testid selectors over CSS selectors
- Use relative URLs with baseURL from config
- Add at least one assertion after each meaningful action
- Avoid page.waitForTimeout(); rely on auto-waiting
- Keep tests independent and deterministic
- Flag any guessed selectors or fallback waits for human review

Agent task:
"Generate a Playwright test for the Contact form submission flow.
Before writing code, produce a short test plan.
Use getByRole or data-testid selectors only.
Add assertions for validation, submit success, and visible confirmation.
After code generation, list any assumptions that need human review.
Do not auto-fix failures without explaining the cause."`,
    hints: [
      "Your prompt file should define stable conventions that can be reused consistently.",
      "A bounded agent request should ask for a plan, code, and explicit review notes.",
      "Include at least one checkpoint for assumptions or guessed selectors.",
    ],
  },
  promptTemplates: [
    {
      label: "Generate Shared Copilot Instructions",
      context: "Create a repository-level Copilot prompt file for Playwright work.",
      prompt:
        "Generate a reusable `.github/copilot-instructions.md` file for a Playwright project. Include selector strategy, assertion expectations, environment assumptions, review boundaries, and any patterns the repository should avoid.",
    },
    {
      label: "Create a Bounded Agent Task",
      context: "Ask an AI agent to generate a test while preserving review checkpoints.",
      prompt:
        "Create a bounded agent task for generating a Playwright test for [FEATURE]. Require a plan first, code second, and a final list of assumptions, risky selectors, and review checkpoints before merge.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/dashboard",
    label: "Use the Dashboard",
    description:
      "Practice bounded assertions, prompt provenance, and reviewable AI-assisted workflows on the dashboard.",
  },
};
