import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 8,
  title: "Prompt Template Library",
  subtitle: "Copy-paste prompts for every testing scenario",
  icon: "📋",
  audience: "All Roles — Non-Coder Essential",
  sections: [
    {
      heading: "How to Use These Templates",
      content: "These are ready-to-paste prompts for Copilot Chat. Replace the [BRACKETED] placeholders with your specific details. Each template produces a complete, reviewable test. Non-coders: this is your primary tool. You don't need to write code — you need to fill in templates accurately.",
      callout: "Tip: Save your most-used customized prompts in a personal snippets file. Build a library of templates for your project's specific pages."
    },
    {
      heading: "Template Categories",
      content: "Templates are organized by testing scenario. Each includes the Copilot Chat prompt and notes on what to verify in the output.",
    }
  ],
  promptTemplates: [
    {
      label: "🔐 Login / Authentication Flow",
      prompt: `Generate a Playwright test for [PAGE_NAME] authentication:

CONTEXT: [Describe the login form — fields, OAuth buttons, remember me, etc.]
USER FLOW:
1. Navigate to [URL_PATH]
2. Enter [TEST_EMAIL] and [TEST_PASSWORD]
3. Click login button
4. Verify redirect to [EXPECTED_DESTINATION]

ASSERTIONS TO INCLUDE:
- Login page loads with all form elements visible
- Error message appears for invalid credentials: "[EXPECTED_ERROR_TEXT]"
- Successful login redirects to [DESTINATION_URL]
- User's name or avatar appears in header after login

Use data-testid selectors. Follow Page Object Model pattern.`,
      context: "Use for any login, signup, or authentication page. Replace bracketed items with your actual page details."
    },
    {
      label: "📝 Form Submission + Validation",
      prompt: `Generate Playwright tests for a [FORM_TYPE] form at [URL_PATH]:

FORM FIELDS:
[List each field: name, type, required?, validation rules]
Example:
- Email (text, required, must be valid email format)
- Phone (text, optional, must match xxx-xxx-xxxx)
- State (dropdown, required)
- Terms checkbox (required)

TEST CASES TO GENERATE:
1. Happy path: fill all fields correctly → submit → verify success message
2. Required field validation: submit empty → verify each error message
3. Format validation: enter invalid email → verify format error
4. Optional fields: submit without optional fields → still succeeds

Use data-testid="[field-name]-input" and data-testid="[field-name]-error" pattern.`,
      context: "Works for any form — registration, contact, application, profile edit. List every field and its rules for best results."
    },
    {
      label: "🔍 Search + Filter + Results",
      prompt: `Generate Playwright tests for search functionality at [URL_PATH]:

SEARCH BEHAVIOR:
- Input: data-testid="search-input"
- Submit: data-testid="search-button" OR Enter key
- Results container: data-testid="results-list"
- Individual result: data-testid="result-card"
- No results message: data-testid="no-results"

TEST CASES:
1. Valid search "[SEARCH_TERM]" returns [EXPECTED_COUNT] results
2. Each result displays [REQUIRED_FIELDS: name, price, image, etc.]
3. Empty/whitespace search shows [EXPECTED_BEHAVIOR]
4. No-match search "[GIBBERISH_TERM]" shows "No results found"
5. Search is case-insensitive
[6. Filters: if applicable, describe filter controls and expected behavior]`,
      context: "Adapt for product search, user directory, document search, etc. Add filter-specific tests if the page has filter controls."
    },
    {
      label: "🛒 Multi-Step Workflow (Checkout, Wizard)",
      prompt: `Generate Playwright tests for a multi-step [WORKFLOW_TYPE] at [URL_PATH]:

STEPS:
1. [Step 1 name]: [What user does] → [What they should see]
2. [Step 2 name]: [What user does] → [What they should see]
3. [Step 3 name]: [What user does] → [What they should see]
4. Confirmation: [Final expected state]

NAVIGATION RULES:
- Back button returns to previous step with data preserved
- Direct URL access to step 3 redirects to step 1
- Progress indicator shows current step

ASSERTIONS PER STEP:
- Step heading matches expected text
- Required fields from previous step are preserved
- Form validation prevents advancing without required data
- Final confirmation shows summary of all entered data

Use data-testid="step-[N]-heading", "next-button", "back-button" pattern.`,
      context: "For checkout flows, onboarding wizards, multi-page forms. Define each step clearly — Copilot can't infer your workflow."
    },
    {
      label: "📊 Table / Data Grid",
      prompt: `Generate Playwright tests for a data table at [URL_PATH]:

TABLE STRUCTURE:
- Table: data-testid="data-table"
- Rows: data-testid="table-row"
- Headers: [List column names]
- Sortable columns: [Which ones]
- Pagination: data-testid="pagination" (if applicable)

TEST CASES:
1. Table loads with [EXPECTED_ROW_COUNT] rows
2. Column headers match: [HEADER_LIST]
3. Sort by [COLUMN] ascending/descending works
4. Pagination: page 2 shows different rows
5. Empty state: when no data, shows "[EMPTY_MESSAGE]"
[6. Row actions: click row → navigates to detail page]
[7. Inline edit: double-click cell → edit → save]`,
      context: "For admin dashboards, report views, user management tables. Include pagination and sort tests only if the table supports them."
    },
    {
      label: "♿ Accessibility Quick Check",
      prompt: `Generate a Playwright accessibility test for [PAGE_NAME] at [URL_PATH]:

CHECKS TO INCLUDE:
1. All images have alt text (non-empty alt attribute)
2. Form inputs have associated labels (aria-label or <label for>)
3. Page has exactly one h1 element
4. Tab order follows visual reading order (tab through interactive elements)
5. Focus indicators are visible on keyboard navigation
6. Color contrast: use @axe-core/playwright to run automated scan
7. ARIA landmarks: main, nav, footer regions exist

Include the axe-core import:
import AxeBuilder from '@axe-core/playwright';

Run axe scan and assert zero violations.`,
      context: "Run this on every page. Required for 508 compliance in federal delivery. Add page-specific checks as needed."
    },
    {
      label: "⚡ Refine a Recorded Test",
      prompt: `Refine this recorded Playwright test into production quality:

[PASTE RECORDED CODE HERE]

REFINEMENTS:
1. Replace auto-generated CSS/nth-child selectors with data-testid locators
2. Add a descriptive test name that explains the user scenario
3. Add assertions after each meaningful action:
 - Page/section is visible after navigation
 - Form values are reflected after input
 - Expected result appears after submission
4. Remove any page.waitForTimeout() calls
5. Add comments explaining each test section (Arrange / Act / Assert)
6. Extract repeated interactions into a Page Object if 3+ tests share the page`,
      context: "Non-coders: This is your go-to after every recording session. Paste the raw code and this prompt into Copilot Chat to get a clean, reviewable test."
    },
    {
      label: "🐛 Debug a Failing Test",
      prompt: `This Playwright test is failing. Help me diagnose and fix it:

TEST CODE:
[PASTE TEST CODE]

ERROR MESSAGE:
[PASTE ERROR OUTPUT]

QUESTIONS TO ANSWER:
1. What is the root cause of the failure?
2. Is this a test bug or an app bug?
3. If test bug: what's the fix?
4. If app bug: what should I report to the developer?
5. Are there any flaky patterns in this test that should be addressed?`,
      context: "Non-coders: Use this when a test fails and you're not sure why. The structured questions help Copilot give you an actionable diagnosis."
    }
  ],
  exercise: {
    title: "Write a CARD Prompt from a Manual Test Case",
    description: "You have a manual test case description below. Convert it into a structured CARD prompt that Copilot can use to generate a Playwright test.",
    starterCode: `// MANUAL TEST CASE:
// "Verify that searching for 'laptop' on the Products page
//  returns only products containing 'laptop' in the name,
//  and that clearing the search restores all products."

// Write your CARD prompt below:
// CONTEXT: [TODO]
//
// ACTIONS: [TODO]
//
// RULES: [TODO]
//
// DATA: [TODO]`,
    solutionCode: `// MANUAL TEST CASE:
// "Verify that searching for 'laptop' on the Products page
//  returns only products containing 'laptop' in the name,
//  and that clearing the search restores all products."

// CARD Prompt:
// CONTEXT: React e-commerce app with a Products page at /products.
// The page has a search input (data-testid="search-input") and
// a product grid (data-testid="product-card") showing all items.
//
// ACTIONS:
// 1. Navigate to /products
// 2. Type "laptop" into the search input
// 3. Verify filtered results only show laptop products
// 4. Clear the search input
// 5. Verify all products are restored
//
// RULES:
// - Search is case-insensitive
// - Filtering happens on keypress (no submit button needed)
// - Empty search shows all products
// - Each product card shows name and price
//
// DATA:
// - Search term: "laptop"
// - Expected: only products with "laptop" in name
// - After clear: full product count restored`,
    hints: [
      "Context should name the app, page, route, and key selectors",
      "Actions are the step-by-step user flow — number them",
      "Rules define business logic: is search case-sensitive? When does filtering trigger?",
    ],
  },
  quiz: {
    question: "When using a prompt template, what do [BRACKETED] items represent?",
    options: [
      "Code syntax that Copilot auto-generates",
      "Placeholders you replace with your specific project details",
      "Optional items you can delete",
      "Error messages to watch for"
    ],
    correctIndex: 1,
    explanation: "Bracketed items are placeholders. Replace them with your actual page names, URLs, test data, and expected behaviors. The quality of the generated test depends on the specificity of your replacements."
  },
  practiceLink: {
    url: "http://localhost:5173/contact",
    label: "Try using the prompt templates against the Contact form — it has validation, required fields, and success states",
    description: "The Contact form is perfect for practicing with form submission and validation templates",
  }
};
