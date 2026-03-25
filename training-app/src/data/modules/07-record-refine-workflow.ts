import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 9,
  title: 'Record Your First Test',
  subtitle: 'Use Playwright\'s recorder to generate a working test draft, then understand what it gets right and wrong.',
  icon: '🔴',
  sections: [
    {
      heading: 'Why Record First?',
      content: `Writing a test from a blank file is intimidating. You need the right imports, the test structure, the correct selectors, the proper await calls — and you need all of it before the test does anything useful. Recording skips all of that.

Playwright's recorder watches you interact with your application and writes the test code as you go. Click a button, and it generates \`await page.getByTestId('login-button').click()\`. Fill a form field, and it generates the \`fill()\` call with the value you typed. Navigate to a page, and it writes \`page.goto()\`.

The result is a working first draft in minutes instead of hours. It runs. It doesn't crash. It follows the exact flow you walked through.

But — and this is important — a recording is a first draft, not a finished product. It captures what you did, not what you're testing. It has no assertions (it doesn't know what "correct" looks like). It often picks fragile selectors that break when the UI changes. The next lesson covers how to refine recordings into production-quality tests. This lesson focuses on getting that first draft.`,
      tip: 'Think of the recorder like a note-taker in a meeting. It captures what happened accurately, but it doesn\'t know which parts matter. That\'s your job in the refine step.',
    },
    {
      heading: 'Launch the Recorder',
      content: `You have two ways to start recording. Both produce the same output — pick whichever fits your workflow.

**Option 1: Terminal (works everywhere)**
Open a terminal in your project directory and run the codegen command with your practice app URL. This opens a browser window and a separate inspector panel showing the generated code in real time.

**Option 2: VS Code Test Explorer (preferred)**
If you have the Playwright VS Code extension installed, open the Test Explorer sidebar and click "Record New." This embeds the recorder directly in your editor, so you can see the generated code alongside your test files. It also auto-saves the file when you stop recording.

The VS Code approach is preferred because it keeps you in one tool and handles file creation automatically. The terminal approach is useful when you're working outside VS Code or need to record against a non-standard setup.

Either way, make sure the practice app is running on http://localhost:5173 before you start recording.`,
      code: `# Option 1: Terminal — opens browser + inspector panel
npx playwright codegen http://localhost:5173

# Option 2: VS Code
# 1. Open Test Explorer (beaker icon in sidebar)
# 2. Click "Record New" at the top of the panel
# 3. The browser opens — interact with your app
# 4. Stop recording — code appears in a new test file`,
      codeLanguage: 'bash',
      callout: 'Start the practice app first: cd practice-app && pnpm dev. The recorder needs a running application to interact with.',
    },
    {
      heading: 'Record a Login Flow',
      content: `Let's record the most common flow in the practice app: logging in. Follow these steps while the recorder is running.

**Step 1:** The recorder opens a browser pointing at http://localhost:5173. Navigate to /login if it doesn't land there automatically.

**Step 2:** Click the email input field and type \`user@test.com\`. Watch the inspector — it generates a \`fill()\` call the moment you finish typing.

**Step 3:** Click the password input field and type \`Password123!\`. Another \`fill()\` call appears.

**Step 4:** Click the "Sign In" button. The inspector generates a \`click()\` call.

**Step 5:** The page redirects to /dashboard. The recorder captures the navigation but doesn't assert that you arrived — it just records the next action you take on the dashboard.

**Step 6:** Stop the recording. In VS Code, click "Stop" in the Test Explorer. In the terminal, close the inspector window.

The entire interaction takes about 30 seconds. The generated code is a complete, runnable test file.`,
      code: `// What the recorder generates (approximately):
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();
});`,
      codeLanguage: 'typescript',
      tip: 'Record slowly and deliberately. Click each field individually, type the full value, then move to the next. Rushed interactions produce messy recordings with extra clicks and partial fills.',
    },
    {
      heading: 'What the Recording Gets Wrong',
      content: `The recording above runs without errors. It even follows the right flow. But it has two problems that make it useless as a real test.

**Problem 1: Fragile selectors.** The recorder sometimes picks CSS selectors based on position or class names instead of stable attributes. You might see \`page.locator('.form-group:nth-child(2) input')\` instead of \`page.getByTestId('password-input')\`. Position-based selectors break the moment someone adds a field above the password input. Class-based selectors break when a designer renames CSS classes.

Playwright's recorder is generally good at choosing \`getByTestId\` when data-testid attributes exist. But when they don't, it falls back to whatever CSS path it can find — and those paths are fragile.

**Problem 2: Zero assertions.** The recorded test navigates to /login, fills fields, clicks the button — and then does nothing. It proves the login form didn't throw a JavaScript error. It doesn't prove the login worked, that the user arrived at the dashboard, or that the right content appeared.

A test without assertions is a smoke detector with no alarm. It's in the room, but it won't tell you when something's on fire.

Both problems have the same fix: the refine step. Replace fragile selectors with \`getByTestId\` calls using the practice app's data-testid attributes. Add assertions that check for the business outcomes you care about. We'll cover the refine workflow in detail in the next lesson.`,
      warning: 'Never ship a recorded test without adding assertions. A test that always passes — regardless of whether the feature works — is worse than no test. It gives you false confidence that masks real bugs.',
    },
  ],
  quiz: {
    question: 'What is the primary purpose of the refine step after recording?',
    options: [
      'Add parallelism so the test runs faster',
      'Convert the test from TypeScript to JavaScript',
      'Replace brittle selectors with resilient ones and add meaningful assertions',
      'Minify the test code to reduce file size',
    ],
    correctIndex: 2,
    explanation: 'Recordings produce working code with fragile selectors and no assertions. The refine step replaces position-based or class-based selectors with stable data-testid locators and adds assertions that verify actual business outcomes — turning a first draft into a reliable test.',
    additionalQuestions: [
      {
        question: 'What is the biggest limitation of a recorded test?',
        options: [
          'It runs too slowly to be useful',
          'It can only record in Chromium',
          'It contains no assertions — it only proves the page didn\'t crash',
          'It requires manual editing before it will compile',
        ],
        correctIndex: 2,
        explanation: 'Recorded tests capture user interactions but add no assertions. They verify that the flow didn\'t throw errors, but they can\'t tell you whether the login actually succeeded, whether the right data appeared, or whether any business logic worked correctly.',
      },
    ],
  },
  exercises: [
    {
      title: 'Spot the Fragile Selectors',
      description: 'This test was generated by the Playwright recorder. Identify which selectors are fragile and explain why each one would break.',
      difficulty: 'beginner',
      starterCode: `import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  // Selector 1: Is this fragile or resilient? Why?
  await page.locator('.form-group:nth-child(1) input').fill('user@test.com');

  // Selector 2: Is this fragile or resilient? Why?
  await page.locator('input[type="password"]').fill('Password123!');

  // Selector 3: Is this fragile or resilient? Why?
  await page.locator('button.btn.btn-primary.mt-4').click();
});

// TODO: Add comments above each selector explaining:
// 1. Whether it's fragile or resilient
// 2. What specific change would break it
// 3. What you'd replace it with`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  // FRAGILE: nth-child(1) breaks if any element is added before this input.
  // A new heading, help text, or field above it shifts the position.
  // Replace with: page.getByTestId('email-input')
  await page.locator('.form-group:nth-child(1) input').fill('user@test.com');

  // MODERATE: type="password" works as long as there's only one password field.
  // Breaks if a "confirm password" field is added (two matches, ambiguous).
  // Replace with: page.getByTestId('password-input')
  await page.locator('input[type="password"]').fill('Password123!');

  // FRAGILE: CSS classes change during design updates. "mt-4" is a spacing
  // utility — a designer changing margins breaks this selector.
  // Replace with: page.getByTestId('login-button')
  await page.locator('button.btn.btn-primary.mt-4').click();
});`,
      hints: [
        'nth-child selectors depend on DOM order — what happens when a new element is inserted?',
        'Type-based selectors work until a second element of the same type appears.',
        'CSS utility classes like mt-4 are styling shortcuts that change during redesigns.',
      ],
    },
    {
      title: 'Replace Fragile Selectors with getByTestId',
      description: 'Rewrite the recorded test to use the practice app\'s data-testid attributes instead of fragile CSS selectors. Reference: email-input, password-input, login-button.',
      difficulty: 'intermediate',
      starterCode: `import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  // TODO: Replace these fragile selectors with getByTestId()
  await page.locator('.form-group:nth-child(1) input').fill('user@test.com');
  await page.locator('input[type="password"]').fill('Password123!');
  await page.locator('button.btn.btn-primary.mt-4').click();
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  // Resilient: data-testid selectors survive CSS and layout changes
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();
});`,
      hints: [
        'page.getByTestId(\'email-input\') finds [data-testid="email-input"].',
        'Replace all three selectors — email, password, and the login button.',
        'getByTestId is Playwright\'s recommended approach when data-testid attributes are available.',
      ],
    },
    {
      title: 'Transform Recording to Production Quality',
      description: 'Take this raw recording and transform it into a production-quality test: fix all selectors, add a descriptive test name, add meaningful assertions, use a relative URL, and structure it with Arrange-Act-Assert (AAA) comments.',
      difficulty: 'advanced',
      starterCode: `import { test, expect } from '@playwright/test';

// TODO: Transform this raw recording into a production-quality test
test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.locator('.form-group:nth-child(1) input').fill('user@test.com');
  await page.locator('input[type="password"]').fill('Password123!');
  await page.locator('button.btn.btn-primary.mt-4').click();
});

// Requirements:
// 1. Give the test a descriptive name
// 2. Replace all selectors with getByTestId()
// 3. Use a relative URL (not absolute)
// 4. Add AAA comments (Arrange, Act, Assert)
// 5. Add assertions: verify redirect to /dashboard and heading visible`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('successful login redirects to dashboard', async ({ page }) => {
  // Arrange: navigate to the login page
  await page.goto('/login');

  // Act: fill credentials and submit
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  // Assert: verify successful login
  await expect(page).toHaveURL(/\\/dashboard/);
  await expect(page.getByTestId('dashboard-heading')).toBeVisible();
});`,
      hints: [
        'A descriptive name answers "what does this test verify?" — e.g., "successful login redirects to dashboard."',
        'Relative URLs like \'/login\' work when baseURL is configured in playwright.config.ts.',
        'AAA structure: Arrange sets up the page, Act performs the user action, Assert checks the result.',
        'Two assertions give confidence: URL changed to /dashboard AND the dashboard heading is visible.',
      ],
    },
  ],
  practiceLink: {
    url: 'http://localhost:5173/login',
    label: 'Open Login Page',
    description: 'Run the recorder against this page: npx playwright codegen http://localhost:5173/login',
  },
  narrationScript: {
    intro: 'This is it — your first test. You\'re going to record a login flow, watch Playwright write the code, and then look honestly at what the recording gets right and wrong.',
    steps: [
      {
        text: 'Start on the login page. The recorder is going to watch every click and keystroke, translating your interactions into Playwright code in real time.',
        navigateTo: '/login',
        duration: 20,
      },
      {
        text: 'Click the email field. In the recorder\'s inspector panel, you\'d see a fill() call appear the moment you type. The recorder picks a selector automatically — sometimes getByTestId, sometimes a CSS path.',
        highlight: 'email-input',
        duration: 25,
      },
      {
        text: 'Move to the password field. Same thing — another fill() call. Notice the recorder captures the exact value you typed. It doesn\'t mask passwords or redact data, so be careful with real credentials.',
        highlight: 'password-input',
        duration: 25,
      },
      {
        text: 'Click the login button. The recorder generates a click() call. After the page redirects, it records the next page you interact with — but it doesn\'t add an assertion that you actually arrived at the dashboard.',
        highlight: 'login-button',
        duration: 25,
      },
      {
        text: 'And there it is — you\'re on the dashboard. The recorder captured the entire flow: navigate, fill, fill, click. Four lines of code that took 30 seconds to generate. That\'s the speed of recording.',
        navigateTo: '/dashboard',
        duration: 20,
      },
      {
        text: 'Look at the dashboard heading. A recorded test would never check for this element. It doesn\'t know the heading matters. It doesn\'t know that "landing on /dashboard" means "login worked." Assertions come from you, not the recorder.',
        highlight: 'dashboard-heading',
        duration: 25,
      },
      {
        text: 'Now the honest part: what the recording gets wrong. Selectors might be fragile — CSS class names and positional paths that break when the UI changes. Every one of those needs to be replaced with a stable getByTestId locator.',
        duration: 25,
      },
      {
        text: 'And there are zero assertions. The test proves the login form accepted input without throwing an error. It doesn\'t prove the login succeeded, the right page loaded, or the correct user session started. A test without assertions always passes — even when the feature is broken.',
        duration: 30,
      },
      {
        text: 'The recording is a first draft. It gives you the structure, the flow, and the basic code. The refine step — fixing selectors and adding assertions — is what turns it into a test that actually catches bugs.',
        duration: 25,
      },
    ],
    outro: 'You\'ve recorded your first test. It runs, it follows the right flow, and it took 30 seconds. In the next lesson, we\'ll refine it — replace the fragile selectors, add assertions that test real business logic, and make it production-ready.',
  },
};
