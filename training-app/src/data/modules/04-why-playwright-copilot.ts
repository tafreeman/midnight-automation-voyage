import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 101,
  title: 'Your Testing Toolkit + Just Enough TypeScript',
  subtitle: 'Meet Playwright and Copilot — and learn the four TypeScript patterns you\'ll see in every test.',
  icon: '🧰',
  sections: [
    {
      heading: 'Just Enough TypeScript',
      content: `Playwright tests are written in TypeScript. You don't need to learn the whole language — you need to recognize four patterns that appear in every test file. Once you can read these, you can read any Playwright test.

**1. async/await** — The browser takes time to load pages, find elements, and click buttons. \`await\` means "wait for this step to finish before moving on." Without it, your test would race ahead before the page is ready.

**2. Arrow functions** — \`() => {}\` is shorthand for defining a function. You'll see it wrapping every test body: \`test('name', async ({ page }) => { ... })\`. The \`{ page }\` part gives you the browser tab to work with.

**3. Template literals** — Backtick strings with \`\${variable}\` inject values. Useful for dynamic URLs like \`\`/products/\${productId}\`\` or building test descriptions.

**4. Types** — TypeScript adds labels like \`string\`, \`number\`, and \`boolean\` to variables. The main benefit for testing: your editor catches typos before you run anything. If you write \`page.getByTestId(123)\` instead of \`page.getByTestId('123')\`, TypeScript flags it immediately.`,
      table: {
        headers: ['Pattern', 'Looks Like', 'Means', 'When You\'ll See It'],
        rows: [
          ['async/await', 'await page.click()', 'Wait for this step to finish', 'Every line that talks to the browser'],
          ['Arrow functions', '() => { ... }', 'A function definition (shorthand)', 'Wrapping test bodies and callbacks'],
          ['Template literals', '`/products/${id}`', 'String with a variable inserted', 'Dynamic URLs and test descriptions'],
          ['Types', 'name: string', 'This variable holds text', 'Function parameters and config objects'],
        ],
      },
      tip: 'You don\'t need to write TypeScript from scratch. Copilot handles that. You need to read it well enough to review what Copilot generates and spot when something looks wrong.',
    },
    {
      heading: 'The Testing Bottleneck',
      content: `Test automation is consistently the top bottleneck in software delivery. The problem isn't that teams don't value testing — it's that the mechanics of writing and maintaining tests consume disproportionate time.

Writing a test from scratch means: learning a framework's API, figuring out the right selectors, handling timing and waits, debugging cryptic error messages, and maintaining all of it as the application changes. For a manual tester moving into automation, each of these is a separate learning curve stacked on top of the last.

This is where the tooling split matters. The automation problem is really two problems:

**Execution:** Running tests reliably across browsers, handling timing, managing parallel runs, producing useful reports. This is a solved problem — Playwright handles it.

**Authoring:** Translating "I know what this feature should do" into working test code. This is where most of the time goes, and it's where Copilot makes the biggest difference.

Separating these two problems — execution vs. authoring — is the key to understanding why Playwright and Copilot work well together. They solve different halves of the same bottleneck.`,
    },
    {
      heading: 'Playwright vs. Alternatives',
      content: `Three frameworks dominate browser test automation. Here's how they compare on the things that matter day-to-day.

**Selenium** has been around the longest and supports the most languages. But it requires manual waits (\`sleep()\` calls scattered through your code), separate browser driver management, and verbose setup. Most flaky test complaints trace back to Selenium's timing model.

**Cypress** simplified the developer experience significantly. However, it runs tests in a single browser (Chromium-based), can't handle multi-tab or multi-origin scenarios, and uses a custom command chain that doesn't work like standard JavaScript.

**Playwright** combines Selenium's multi-browser support with a modern API. The critical feature: **auto-wait**. Every action — click, fill, assert — automatically waits for the element to be ready. No manual sleeps. No retry loops. This single feature eliminates the most common source of flaky tests.`,
      table: {
        headers: ['Feature', 'Selenium', 'Cypress', 'Playwright'],
        rows: [
          ['Waits', 'Manual sleep()/WebDriverWait', 'Auto-retry on assertions', 'Auto-wait on every action'],
          ['Browsers', 'All (via drivers)', 'Chromium only', 'Chromium, Firefox, WebKit'],
          ['Multi-tab', 'Yes (complex)', 'No', 'Yes (built-in)'],
          ['Parallel', 'Via Grid (complex)', 'Via Dashboard (paid)', 'Built-in (free)'],
          ['Codegen', 'No', 'No', 'Yes — record interactions as code'],
          ['Trace viewer', 'No', 'Dashboard (paid)', 'Yes — free, built-in'],
        ],
      },
      callout: 'Auto-wait is the single biggest reason to choose Playwright. Flaky tests from timing issues are the #1 reason teams abandon test automation. Playwright eliminates that problem at the framework level.',
    },
    {
      heading: 'The Copilot Workflow',
      content: `Copilot removes the mechanical translation between "I know what to test" and "working test code." It doesn't replace your testing knowledge — it removes the friction of expressing that knowledge as code.

Here's where the time savings are real:

**Scaffolding:** Setting up a test file with imports, test blocks, and basic structure takes 30–60 minutes when you're learning a framework. Copilot generates it in seconds. Time saved: 30–60 minutes → 5–10 minutes (including review).

**Selectors:** Finding the right selector for an element usually means inspecting the DOM, trying different approaches, and debugging failures. Copilot generates context-aware selectors from your description. Time saved: trial-and-error → first-attempt accuracy.

**Debugging:** When a test fails, understanding the error message and fixing the code is where beginners spend the most time. Copilot can explain errors in plain language and suggest fixes. Time saved: manual Stack Overflow searches → inline explanations.

But here's the governance boundary: Copilot generates code. It doesn't validate logic. It'll happily produce a test that checks the wrong thing if your prompt is vague. Your CARD formula from the previous lesson is what keeps Copilot's output aligned with your actual requirements.`,
      warning: 'Copilot is a code generator, not a test designer. It can\'t tell you what to test, whether your assertions are meaningful, or if your test coverage has gaps. Those decisions stay with you.',
    },
    {
      heading: 'Three Roles, Clear Boundaries',
      content: `Every test you write involves three actors. Keeping their roles distinct prevents the most common mistakes.

**Playwright — Execution**
Playwright runs your tests. It opens browsers, navigates pages, clicks buttons, fills forms, reads text, takes screenshots, and reports results. It handles timing, retries, and parallel execution. You don't need to manage any of this — Playwright's job is making test execution reliable.

**Copilot — Authoring**
Copilot writes code from your descriptions. It translates "fill the email field and click submit" into \`await page.getByTestId('email-input').fill(...)\`. It generates boilerplate, suggests selectors, and explains errors. Copilot's job is making test authoring fast.

**You — Judgment**
You decide what to test. You choose which assertions matter. You review Copilot's output for correctness. You decide whether a test is ready to merge. The judgment calls — what's worth testing, what's a meaningful assertion, when coverage is sufficient — those are yours.

When a test fails in CI, you don't blame Playwright (it ran what you gave it) or Copilot (it generated what you asked for). You review the test logic, fix the gap, and rerun. That review step is where your testing expertise matters most.`,
      tip: 'A useful mental model: Playwright is the car. Copilot is the GPS giving turn-by-turn directions. You\'re the driver deciding where to go and whether the suggested route makes sense.',
    },
  ],
  quiz: {
    question: 'What is Playwright\'s primary advantage over Selenium for test reliability?',
    options: [
      'Playwright supports more programming languages',
      'Playwright has a larger community and more plugins',
      'Built-in auto-wait eliminates manual sleep() calls',
      'Playwright tests run faster due to a lighter browser engine',
    ],
    correctIndex: 2,
    explanation: 'Playwright\'s auto-wait means every action — click, fill, assert — automatically waits for the element to be actionable before proceeding. This eliminates the manual sleep() calls and explicit waits that are the #1 source of flaky tests in Selenium.',
    additionalQuestions: [
      {
        question: 'In the three-role model, what is Copilot\'s responsibility?',
        options: [
          'Deciding what to test and which assertions matter',
          'Running tests across browsers and handling timing',
          'Translating your test descriptions into working code',
          'Validating that business logic is correctly tested',
        ],
        correctIndex: 2,
        explanation: 'Copilot\'s role is authoring — translating your descriptions into code. It doesn\'t decide what to test (that\'s your judgment) or run the tests (that\'s Playwright\'s execution). Understanding these boundaries prevents over-reliance on any single tool.',
      },
      {
        question: 'What does "await" mean in a Playwright test?',
        options: [
          'Skip this step if it takes too long',
          'Wait for this step to finish before moving on',
          'Run this step in a background thread',
          'Retry this step if it fails the first time',
        ],
        correctIndex: 1,
        explanation: 'await tells the test to pause and wait for the browser action to complete before executing the next line. Without await, the test would race ahead before the page finishes loading, clicking, or navigating — causing failures.',
      },
    ],
  },
  exercise: {
    title: 'Compare Locator Strategies',
    description: 'Given an HTML button from the practice app, write three different Playwright locator approaches. Then identify which is most resilient to UI changes and explain why.',
    starterCode: `// The practice app login page has this button:
// <button data-testid="login-button" class="btn btn-primary mt-4" type="submit">
//   Sign In
// </button>

import { test, expect } from '@playwright/test';

test('find the login button three ways', async ({ page }) => {
  await page.goto('/login');

  // Approach 1: CSS selector (fragile)
  // TODO: Write a CSS class-based locator
  const button1 = page.locator(''); // fill this in

  // Approach 2: Text-based (moderate)
  // TODO: Write a text-based locator
  const button2 = page.locator(''); // fill this in

  // Approach 3: data-testid (resilient)
  // TODO: Write a data-testid locator
  const button3 = page.locator(''); // fill this in

  // TODO: Add a comment explaining which approach is most resilient and why
});`,
    solutionCode: `import { test, expect } from '@playwright/test';

test('find the login button three ways', async ({ page }) => {
  await page.goto('/login');

  // Approach 1: CSS selector (fragile)
  // Breaks when designers rename classes or restructure the layout
  const button1 = page.locator('button.btn.btn-primary.mt-4');

  // Approach 2: Text-based (moderate)
  // Survives CSS changes but breaks if button text changes ("Sign In" → "Log In")
  const button2 = page.getByRole('button', { name: 'Sign In' });

  // Approach 3: data-testid (resilient)
  // Survives CSS and text changes — only breaks if a developer removes the testid
  const button3 = page.getByTestId('login-button');

  // Verify all three find the same button
  await expect(button1).toBeVisible();
  await expect(button2).toBeVisible();
  await expect(button3).toBeVisible();

  // data-testid is most resilient because:
  // - It's decoupled from visual styling (CSS classes change often)
  // - It's decoupled from display text (copy changes during i18n or UX updates)
  // - It exists solely for testing, so developers won't change it accidentally
  // - Playwright's getByTestId() is the recommended approach for stable selectors
});`,
    hints: [
      'For CSS: use the class names on the button element — btn, btn-primary, mt-4.',
      'For text: use getByRole(\'button\') with a name option matching the visible text.',
      'For data-testid: use getByTestId() with the testid attribute value.',
      'Think about what changes more often — CSS class names, button labels, or test identifiers.',
    ],
  },
  narrationScript: {
    intro: 'Two tools solve the test automation bottleneck. Playwright handles execution — running tests reliably. Copilot handles authoring — turning your test ideas into code. Let\'s see how they fit together.',
    steps: [
      {
        text: 'Test automation has two hard problems. First: getting tests to run reliably across browsers without flaky failures. Second: writing the test code in the first place. Most of the pain is in the second problem.',
        duration: 25,
      },
      {
        text: 'Playwright solves the execution problem. Its auto-wait feature is the key — every action automatically waits for the element to be ready. No manual sleeps. No retry loops. No "works on my machine" failures.',
        duration: 25,
      },
      {
        text: 'Compare that to Selenium, where you write explicit wait calls after every action. Those waits are either too short — causing flaky tests — or too long — making your suite slow. Playwright removes this entire category of problems.',
        duration: 25,
      },
      {
        text: 'Copilot solves the authoring problem. You describe what to test, and Copilot generates the code. Scaffolding drops from 30 minutes to 5. Selector hunting becomes a single prompt. Error debugging gets plain-language explanations.',
        duration: 25,
      },
      {
        text: 'But Copilot has a boundary: it generates code, it doesn\'t validate logic. It\'ll write a syntactically perfect test that checks the wrong thing if your prompt is vague. That\'s why the CARD formula from the last lesson matters — it keeps Copilot\'s output aligned with your requirements.',
        duration: 30,
      },
      {
        text: 'Before you look at any test code, learn four TypeScript patterns: async/await means "wait for this step." Arrow functions wrap your test body. Template literals insert variables into strings. Types catch typos before you run anything.',
        duration: 30,
      },
      {
        text: 'Here\'s the three-role model. Playwright: execution — runs tests, manages browsers, handles timing. Copilot: authoring — generates code from your descriptions. You: judgment — decides what to test, reviews output, approves assertions.',
        duration: 25,
      },
      {
        text: 'When a test fails, trace it through the three roles. Did Playwright run it wrong? Unlikely — it\'s deterministic. Did Copilot generate bad code? Check the prompt. Did you specify the wrong requirement? Check the CARD. The answer is almost always in the prompt.',
        duration: 30,
      },
    ],
    outro: 'You now understand what each tool does and where your judgment fits in. Next lesson, you\'ll record your first real test using Playwright\'s codegen — and see what it gets right and wrong.',
  },
};
