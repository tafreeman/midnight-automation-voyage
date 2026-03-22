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
  exercises: [
    {
      difficulty: 'beginner',
      title: 'Fix the Selectors in a Recorded Test',
      description: 'This raw codegen recording uses fragile CSS selectors. Replace each one with the correct data-testid selector. Don\'t change the test logic — just fix the selectors.',
      narration: 'Start by scanning each locator call and asking yourself: "what is this actually targeting?" The CSS nth-child selectors here are position-dependent — if someone adds a field to the form, they break silently. You\'ll replace each one with getByTestId(), which ties the locator to an explicit attribute that can\'t drift. Notice that the test logic — filling, clicking, waiting for the URL — stays exactly the same; you\'re only changing how Playwright finds the elements, not what it does with them.',
      starterCode: `import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  // FIX: Replace these fragile selectors with data-testid versions
  await page.locator('#root > div > form > input:nth-child(1)').fill('user@test.com');
  await page.locator('#root > div > form > input:nth-child(2)').fill('Password123!');
  await page.locator('#root > div > form > button').click();
  await page.waitForURL('**/dashboard');
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/dashboard');
});`,
      hints: [
        'Replace input:nth-child(1) with getByTestId(\'email-input\')',
        'Replace input:nth-child(2) with getByTestId(\'password-input\')',
        'Replace the button selector with getByTestId(\'login-button\')',
        'Use page.getByTestId() instead of page.locator() for data-testid selectors',
      ],
    },
    {
      difficulty: 'intermediate',
      title: 'Write a Refinement Prompt',
      description: 'This is raw recorded code from Playwright codegen. Write a Copilot Chat prompt that would refine it into a production-quality test.',
      narration: 'The key insight here is that Copilot can only act on what you tell it — vague prompts produce vague improvements. You\'ll craft a prompt that names the specific problems: the fragile CSS selectors (and what to replace them with), the missing test name, and the absent assertions. Notice that you should mention the actual data-testid values like email-input and login-button by name, because Copilot can\'t inspect the HTML itself. A well-structured prompt reads like a code review checklist — each item is a concrete, actionable instruction.',
      starterCode: `// Raw recorded test — needs refinement
test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.locator('#root > div > form > input:nth-child(1)').fill('user@test.com');
  await page.locator('#root > div > form > input:nth-child(2)').fill('Password123!');
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
//    - Dashboard shows welcome heading
// 4. Remove hardcoded URLs, use baseURL from config
// 5. Add Arrange/Act/Assert comments"`,
      hints: [
        'Focus on replacing the fragile CSS selectors first — that\'s the biggest reliability win',
        'Every click or navigation should have an assertion that verifies the expected outcome',
        'Mention the specific data-testid names so Copilot uses them',
      ],
    },
    {
      difficulty: 'advanced',
      title: 'Full Refinement: Recording to Production Test',
      description: 'Transform this raw codegen recording into a complete, production-quality test. Fix selectors, add a descriptive name, add assertions after every action, use baseURL, and structure with Arrange/Act/Assert.',
      narration: 'Think of this as a full code review pass in one shot. Start with the test name — "test" tells no one anything, so rename it to describe the user scenario and expected outcome. Next, switch the hardcoded URL to a relative path like \'/login\' because baseURL in your config handles the host, making the test portable across environments. Add your first assertion right after goto() to confirm the login page actually loaded before you try to fill anything in — that assertion acts as an early-fail guard. Then wrap the form fill and submit in an Act section, and follow the redirect with Assert calls that verify both the URL and visible dashboard content, so you\'re proving the right page appeared, not just that navigation happened.',
      starterCode: `import { test, expect } from '@playwright/test';

// Raw codegen output — transform this into a production-quality test
test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.locator('#root > div > form > input:nth-child(1)').fill('user@test.com');
  await page.locator('#root > div > form > input:nth-child(2)').fill('Password123!');
  await page.locator('#root > div > form > button').click();
  await page.waitForURL('**/dashboard');
});

// YOUR TASK: Rewrite the test above as production-quality code:
// 1. Descriptive test name explaining the user scenario
// 2. Replace all CSS selectors with data-testid locators
// 3. Use relative URL (baseURL handles the host)
// 4. Add assertions: page loaded, form visible, redirect happened, dashboard content visible
// 5. Structure with Arrange / Act / Assert comments`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('successful login redirects to dashboard', async ({ page }) => {
  // Arrange — navigate to login page
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();

  // Act — fill credentials and submit
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  // Assert — verify redirect and dashboard content
  await page.waitForURL('/dashboard');
  await expect(page.getByTestId('dashboard-heading')).toBeVisible();
});`,
      hints: [
        'Change the test name from \'test\' to something descriptive like \'successful login redirects to dashboard\'',
        'Use relative URLs like \'/login\' instead of full URLs — baseURL in config handles the host',
        'Add await expect() assertions after navigation and after clicking login',
        'Use Arrange/Act/Assert comments to structure the test clearly',
      ],
    },
  ],
  promptTemplates: [
    {
      label: "Refine Codegen Recording",
      context: "Paste raw Playwright Codegen output and ask Copilot to refine it into a production-ready test.",
      prompt: "Refine this Playwright Codegen recording into a production-quality test:\n\n[PASTE RECORDED CODE HERE]\n\nRefinements needed:\n1. Replace all auto-generated CSS/nth-child selectors with data-testid locators\n2. Add a descriptive test name that explains the user scenario\n3. Add expect() assertions after each meaningful action\n4. Remove any page.waitForTimeout() calls — rely on Playwright auto-wait\n5. Add Arrange/Act/Assert comments to structure the test\n6. Use baseURL from config instead of hardcoded URLs",
    },
    {
      label: "Convert Manual Step to Assertion",
      context: "For non-coders translating manual verification steps into Playwright assertions.",
      prompt: "I'm a manual tester. Convert this manual verification step into a Playwright assertion:\n\nManual step: \"[DESCRIBE WHAT YOU MANUALLY CHECK — e.g., 'I verify the success message says Thank you for your order']\"\n\nPage route: [URL_PATH]\nElement: [DESCRIBE THE ELEMENT — e.g., 'green banner at the top of the page']\n\nWrite the Playwright expect() assertion using data-testid or getByText selectors. Explain what the assertion does in plain English.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/checkout",
    label: "Record a checkout flow with Codegen",
    description: "Use Playwright Codegen to record a test on the multi-step checkout page.",
  },
  quiz: {
    question: "What is the primary purpose of the 'refine' step after recording with Codegen?",
    options: [
      "To make the test run faster",
      "To replace brittle auto-generated selectors with resilient ones and add meaningful assertions",
      "To convert JavaScript to TypeScript",
      "To add comments for documentation",
    ],
    correctIndex: 1,
    explanation: "Codegen captures user actions but generates fragile selectors and no assertions. The refine step replaces auto-generated selectors with role-based or test-id locators, adds expect() assertions, and structures the test for maintainability.",
  },
};
