import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 3,
  title: "Copilot Prompt Engineering",
  subtitle: "Structured prompts that produce reviewable tests",
  icon: "💬",
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
  },
  practiceLink: {
    url: "http://localhost:5173/products",
    label: "Write CARD prompts against the Products page",
    description: "Practice writing CARD-formatted prompts for the search, filter, and product display features.",
  },
  exercise: {
    title: "Build a CARD Prompt",
    description: "Complete the CARD-format prompt template below. Fill in each section (Context, Action, Result, Details) to generate a Playwright test for a login form.",
    starterCode: `// CARD Prompt Template for Copilot Chat
// Context: [TODO: Describe the app and page]
//
// Action: [TODO: What should the test do?]
//
// Result: [TODO: What should be verified?]
//
// Details: [TODO: Any constraints or specifics?]`,
    solutionCode: `// CARD Prompt Template for Copilot Chat
// Context: I have a React app with a login page at /login.
// It has email and password fields with data-testid attributes,
// and a submit button.
//
// Action: Write a Playwright test that fills in valid
// credentials and submits the login form.
//
// Result: After login, the user should be redirected to
// /dashboard and see a welcome message.
//
// Details: Use data-testid selectors. Test both success
// and invalid-credentials scenarios. The valid credentials
// are user@test.com / password123.`,
    hints: [
      "Context should describe your app's tech stack and the specific page",
      "Action should be a clear, specific instruction — not vague",
      "Result defines what 'success' looks like — think assertions",
      "Details add constraints: selectors to use, edge cases, test data",
    ],
  },
  promptTemplates: [
    {
      label: "CARD: Login Form Test",
      context: "Use this CARD-format prompt to generate a complete login test with Copilot Chat.",
      prompt: "Context: React app with login page at /login. Email and password fields have data-testid attributes. Submit button triggers form validation.\n\nAction: Write a Playwright test that tests both successful login and validation errors.\n\nResult: Successful login redirects to /dashboard. Invalid credentials show an error message.\n\nDetails: Use data-testid selectors. Valid credentials: user@test.com / password123. Test empty field validation too.",
    },
    {
      label: "CARD: Form Validation Test",
      context: "Generate tests for form validation behavior using the CARD structure.",
      prompt: "Context: Contact form with name (required), email (required, must be valid format), and message (required, min 10 chars) fields.\n\nAction: Write Playwright tests covering all validation rules.\n\nResult: Each invalid submission should show the specific error message next to the field. Valid submission shows success.\n\nDetails: Use getByRole and getByText for selectors. Test one field at a time. Include boundary values.",
    },
    {
      label: "CARD: Navigation Test",
      context: "Prompt template for testing navigation flows across multiple pages.",
      prompt: "Context: E-commerce app with navbar containing links to Home, Products, Cart, and Account pages.\n\nAction: Write Playwright tests that verify all navigation links work correctly.\n\nResult: Each link should navigate to the correct URL and show the expected page heading.\n\nDetails: Use getByRole('link') selectors. Test both desktop and mobile nav. Verify URL changes with expect(page).toHaveURL().",
    },
  ],
};
