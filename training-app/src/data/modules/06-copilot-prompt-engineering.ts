import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 3,
  title: "Copilot Prompt Engineering",
  subtitle: "Structured prompts that produce reviewable tests",
  icon: "💬",
  audience: "All Roles",
  sections: [
    {
      heading: "The CARD Formula",
      content: "For any feature, structure your Copilot Chat prompt with four parts: Context (what page or component), Actions (the user flow — steps the user takes), Rules (business requirements and validation logic), Data (test data, edge cases, and boundary conditions). This maps directly to acceptance criteria on tickets and produces tests a reviewer can trace back to the story.",
      code: `// Example CARD prompt in Copilot Chat:

// CONTEXT: Login page with email + password form
// ACTIONS: Enter wrong password → see error → retry with correct → land on dashboard
// RULES: Show error on invalid credentials, lock account after 5 failed attempts
// DATA: testuser@example.com, wrong password "badpass", correct password "Passw0rd!"
//
// Generate a Playwright test for this flow using data-testid selectors.`,
      codeLanguage: "typescript",
      callout: "Non-coders: This is your most important skill. You don't need to understand the generated code perfectly — you need to write great prompts. The CARD formula turns your domain knowledge into test specifications."
    },
    {
      heading: "Inline Comment Triggers",
      content: "In the editor, write a descriptive comment above an empty test block. Copilot auto-completes the code based on your description. The more specific your comment, the better the output.",
      code: `// Test: user sees validation error when submitting empty login form
// Selectors: data-testid="email-input", "password-input", "login-btn", "error-msg"
// Expected: error message contains "Email is required"
test('shows validation on empty submit', async ({ page }) => {
// Copilot auto-completes from here ↓
});`,
      codeLanguage: "typescript",
      tip: "Always mention the selector strategy (data-testid) and expected text in your comment. Copilot uses these as constraints."
    },
    {
      heading: "Chat Commands Quick Reference",
      content: "VS Code Copilot Chat has slash commands purpose-built for testing workflows. These are faster than freeform prompts for specific tasks.",
      table: {
        headers: ["Command", "When To Use", "Example"],
        rows: [
          ["/tests", "Generate tests for open file", "Open login.ts → /tests"],
          ["/fix", "Diagnose a failing test", "Paste error → /fix"],
          ["/explain", "Understand unfamiliar code", "Select test block → /explain"],
          ["@workspace", "Project-wide test generation", "@workspace generate auth tests"],
          ["#file:path", "Reference specific file for context", "#file:LoginPage.ts write tests"],
        ]
      }
    },
    {
      heading: "The Assertion Trap",
      content: "Copilot will generate syntactically valid assertions that test the wrong thing. It doesn't know your business rules. Always verify: Is this asserting what the acceptance criteria requires? Or just what the page happens to show?",
      warning: "Anti-pattern: 'Copilot, what should this test assert?' → It guesses.\nCorrect: 'Assert that after 5 failed logins, the user sees: Account locked. Contact support.' → Specific, verifiable."
    }
  ],
  quiz: {
    question: "In the CARD prompt formula, what does the 'A' stand for?",
    options: [
      "Assertions",
      "Actions — the user flow steps",
      "Accessibility checks",
      "API endpoints"
    ],
    correctIndex: 1,
    explanation: "CARD = Context, Actions, Rules, Data. Actions describes the step-by-step user flow the test should walk through — this is the sequence Playwright will automate."
  }
};
