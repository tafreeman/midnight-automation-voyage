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
  narrationScript: {
    intro: "Before you write a single line of test code, you need to answer two questions. First: what should I automate? And second: how do I tell Copilot exactly what I want? Those two questions are the entire focus of this lesson. We are going to learn a framework called CARD that turns your domain knowledge — all that stuff you already know about how the app should behave — into prompts that produce real, reviewable Playwright tests. And just as importantly, we are going to talk about what not to automate, because not every test case deserves a script. Getting this decision right early saves your team hundreds of hours of maintenance down the road.",
    steps: [
      {
        text: "In the previous section we covered what to automate and what to leave manual. Now let's put that decision into action with a structured way to tell Copilot exactly what you want.",
        duration: 10
      },
      {
        text: "Here is a quick decision filter. When you look at a test case, ask four questions in order. Will this test run more than three times? Can the expected result be checked by code rather than human eyes? Is the feature stable enough that the test will not break next sprint? And can the test data be set up programmatically? If any answer is no, lean toward keeping it manual. Smoke tests, regression suites, data-driven form checks, cross-browser validations — those are automation gold. Exploratory testing, visual design reviews, features still in active redesign — those stay with you, the human.",
        duration: 40
      },
      {
        text: "Here is the formula. C-A-R-D. Context — what page or component are we working with? Action — what does the user do, step by step? Rules — what are the business requirements and validation logic? And Deliverable — what test data, edge cases, and boundary conditions should the test cover? Think of CARD as a structured brief. Your product knowledge becomes the spec; Copilot translates it into working code.",
        duration: 35
      },
      {
        text: "Let me show you what this looks like in practice. I have got the login page open in our practice app right now. Let's build a CARD prompt for it together.",
        navigateTo: "/login",
        highlight: "email-input",
        duration: 10
      },
      {
        text: "Here is our Context: we have a React login page with an email field and a password field, both using data-testid attributes. That is the setup. For Action, we want to test: enter a wrong password, see an error message, then retry with the correct password and land on the dashboard. Rules: the app should show an error on invalid credentials, and after five failed attempts it locks the account. Deliverable data: testuser@example.com for the email, badpass as the wrong password, and Passw0rd-exclamation-mark as the correct one. Now you paste that into Copilot Chat, add the instruction 'generate a Playwright test for this flow using data-testid selectors,' and Copilot has everything it needs to write a solid first draft.",
        navigateTo: "/login",
        highlight: "email-input",
        duration: 45
      },
      {
        text: "The reason CARD works so well is that it maps directly to how your team already writes acceptance criteria on tickets. If your story says 'Given a user on the login page, when they enter invalid credentials, then they see an error' — that is Context plus Action plus Rules, right there. CARD is valuable regardless of your experience level because it forces specificity. Vague prompts produce vague tests. A well-structured CARD prompt produces code you can review and trust.",
        duration: 30
      },
      {
        text: "Let's talk about what happens inside the editor. Beyond Chat, Copilot also responds to inline comments. Write a descriptive comment above an empty test block — mention the selectors, mention the expected text — and Copilot autocompletes the code. The more specific your comment, the better the output. Always include the selector strategy, like data-testid, and the exact expected text. Those act as constraints that steer Copilot away from guessing.",
        duration: 25
      },
      {
        text: "One critical warning before we move on. Copilot will generate syntactically valid assertions that test the wrong thing. It does not know your business rules. It sees the page structure and guesses. So always review: is this assertion verifying what the acceptance criteria actually requires? Or just what the page happens to show right now? Never ask Copilot 'what should this test assert' — tell it exactly what to assert, drawn from your specifications. That human-in-the-loop review is what separates a useful test suite from a pile of green-checkmark theater.",
        duration: 30
      },
      {
        text: "One more practical tip: keep a prompt library. Every time you write a CARD prompt that produces a good test, save it as a template. Over a few sprints you will build a collection of reusable prompts for login flows, form validation, navigation, data tables — each one tuned to your app's selectors and business rules. That library becomes a team asset that accelerates everyone's test authoring.",
        duration: 25
      }
    ],
    outro: "So that is your two-part foundation. First, use the decision filter to pick the right tests to automate — high frequency, code-verifiable results, stable features. Second, use CARD to turn your product knowledge into structured prompts that produce solid test drafts. Next up, we are going to take these ideas off the whiteboard and into the real thing — recording your very first Playwright test with Codegen."
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
