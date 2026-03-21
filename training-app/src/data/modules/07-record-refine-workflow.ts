import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 4,
  title: "Record → Refine Workflow",
  subtitle: "The fastest path from zero to production test",
  icon: "🎬",
  audience: "All Roles — Non-Coder Primary Path",
  sections: [
    {
      heading: "Why Record-First?",
      content: "Recording is the recommended onramp for everyone, especially non-coders. You interact with the app normally — Playwright writes the test code. Then Copilot refines that code into something maintainable. You never start from a blank file.",
      callout: "This is the non-coder golden path. Record → Copilot Refine → Review → Merge. You can contribute real test coverage from day one."
    },
    {
      heading: "Step 1: Launch the Recorder",
      content: "Use either the terminal command or the VS Code GUI button. The recorder opens a browser window where every click, type, and navigation is captured as test code in real time.",
      code: `# Terminal approach
npx playwright codegen http://localhost:3000

# With mobile emulation
npx playwright codegen --device="iPhone 14" http://localhost:3000

# VS Code approach (preferred):
# 1. Open Test Explorer sidebar (beaker icon)
# 2. Click "Record new" button
# 3. Interact with your app
# 4. Code appears in editor automatically`,
      codeLanguage: "bash",
      tip: "VS Code recorder is preferred — the generated code appears directly in your editor and is easier to save into the right test file."
    },
    {
      heading: "Step 2: Refine with Copilot",
      content: "Raw recordings use auto-generated selectors that break easily. Select the recorded code, open Copilot Chat (Ctrl+I or Cmd+I), and use one of these refine prompts to upgrade it.",
      code: `// Copilot Chat prompt — paste after selecting recorded code:

"Refine this recorded Playwright test:
1. Replace auto-generated selectors with data-testid attributes
2. Add meaningful assertions after each action
3. Extract page interactions into a Page Object class
4. Add descriptive test name and comments
5. Remove any waitForTimeout calls"`,
      codeLanguage: "typescript",
    },
    {
      heading: "Step 3: Add Assertions",
      content: "A recorded test only captures actions (click, type, navigate). It does NOT capture expected results. You must add assertions — this is the human judgment Copilot can't provide. Use this prompt pattern:",
      code: `// After recording a checkout flow, ask Copilot:

"Add assertions to verify:
- Cart total updates when quantity changes
- Shipping form shows validation on empty required fields
- Order confirmation page displays the order number
- User receives a success message containing 'Thank you'"`,
      codeLanguage: "typescript",
      warning: "A test without assertions is just a demo. It proves the app doesn't crash — not that it works correctly. Always add at least one assertion per user action."
    },
    {
      heading: "Step 4: Save and Run",
      content: "Save the refined test file in your e2e/ folder. Run it from VS Code's Test Explorer (green play button) or from the terminal. Check the HTML report for results.",
      code: `# Run all tests
npx playwright test

# Run a specific test file
npx playwright test e2e/login.spec.ts

# Run with headed browser (watch it execute)
npx playwright test --headed

# View the HTML report
npx playwright show-report`,
      codeLanguage: "bash",
      tip: "Non-coders: Run with --headed the first few times so you can watch the browser execute your test. It builds confidence and helps you spot incorrect flows."
    }
  ],
  exercise: {
    title: "Refine a Raw Recording",
    description: "This is raw recorded code from Playwright codegen. Write a Copilot Chat prompt that would refine it into a production-quality test.",
    starterCode: `// Raw recorded test — needs refinement
test('test', async ({ page }) => {
await page.goto('http://localhost:3000/login');
await page.locator('#root > div > form > input:nth-child(1)').fill('user@test.com');
await page.locator('#root > div > form > input:nth-child(2)').fill('password123');
await page.locator('#root > div > form > button').click();
await page.waitForURL('**/dashboard');
});

// YOUR TASK: Write the Copilot Chat prompt you would use
// to refine this into a maintainable, assertion-rich test.
// Write your prompt as a comment below:

// PROMPT: "`,
    solutionCode: `// Suggested Copilot Chat prompt:

// PROMPT: "Refine this recorded Playwright test:
// 1. Replace CSS nth-child selectors with data-testid locators
//    (email-input, password-input, login-button)
// 2. Add a descriptive test name: 'successful login redirects to dashboard'
// 3. Add assertions:
//    - Login page loads (heading visible)
//    - After login, dashboard URL is reached
//    - Dashboard shows welcome message with user's name
// 4. Remove implicit waits, rely on Playwright auto-wait
// 5. Extract locators into a LoginPage class if possible"`,
    hints: [
      "Focus on replacing the fragile CSS selectors first — that's the biggest reliability win",
      "Every click or navigation should have an assertion that verifies the expected outcome",
      "Mention the specific data-testid names so Copilot uses them"
    ]
  }
};
