import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 4,
  title: 'Setting Up Your Environment',
  subtitle: 'Install the tools, run the example tests, and confirm everything works',
  icon: '⚙️',
  sections: [
    {
      heading: 'What You\'ll Install',
      content: `Three tools get you from zero to running tests. Each one has a specific job:\n\n**Node.js** is the runtime that executes JavaScript and TypeScript outside a browser. Playwright is built on it. Install the LTS (Long Term Support) version from nodejs.org.\n\n**VS Code** is the editor where you'll write, run, and debug tests. It has a built-in terminal and extensions that integrate directly with Playwright.\n\n**Playwright** is the test framework. It launches browsers, interacts with pages, and checks results — all from code you write in TypeScript.`,
      table: {
        headers: ['Tool', 'What It Does', 'Where to Get It'],
        rows: [
          ['Node.js (LTS)', 'Runs JavaScript/TypeScript outside the browser', 'nodejs.org — download the LTS version'],
          ['VS Code', 'Code editor with built-in terminal and extensions', 'code.visualstudio.com'],
          ['Playwright', 'Test framework that automates browsers', 'Installed via npm (next section)'],
          ['GitHub Copilot (optional)', 'AI assistant that suggests test code as you type', 'VS Code extension marketplace'],
        ],
      },
      tip: 'Verify Node.js installed correctly by opening a terminal and running: node --version. You should see v18 or higher.',
    },
    {
      heading: 'The Terminal — A Quick Orientation',
      content: `Open the terminal inside VS Code with **Ctrl+\`** (backtick). This is where you'll run every Playwright command.\n\nThe pattern is always the same: type a command, press Enter, read the output. Three commands cover 90% of what you'll do:`,
      table: {
        headers: ['Command', 'What It Does'],
        rows: [
          ['npx playwright test', 'Runs all your tests (headless by default — no visible browser)'],
          ['npx playwright show-report', 'Opens the HTML test report in your browser'],
          ['npx playwright codegen', 'Opens a browser and records your actions as test code'],
        ],
      },
      tip: 'Error messages are helpful, not scary. When a command fails, the output tells you what went wrong. Read the last few lines first — that\'s where the actual problem is described.',
      code: `# Open the VS Code terminal: Ctrl+\`\n# Then try these commands:\n\nnode --version          # Should print v18 or higher\nnpm --version           # Should print a version number\nnpx playwright --help   # Shows available Playwright commands`,
      codeLanguage: 'bash',
    },
    {
      heading: 'Install Playwright',
      content: `Run this command in your terminal to scaffold a new Playwright project:\n\n\`npm init playwright@latest\`\n\nThe installer asks a few questions. Accept the defaults — they're sensible starting points. When it finishes, your project has three new things:`,
      table: {
        headers: ['Created', 'Purpose'],
        rows: [
          ['playwright.config.ts', 'Settings file — which browsers, where your app runs, how to report results'],
          ['tests/ folder', 'Where your test files live (each file ends in .spec.ts)'],
          ['tests/example.spec.ts', 'A working example test you can run immediately'],
        ],
      },
      code: `# Scaffold a new Playwright project\nnpm init playwright@latest\n\n# When prompted:\n#   Language: TypeScript\n#   Test folder: tests/\n#   GitHub Actions: Yes (adds CI config)\n#   Install browsers: Yes\n\n# After installation, install the VS Code extension:\n# Open Extensions (Ctrl+Shift+X) → search \"Playwright Test for VS Code\" → Install`,
      codeLanguage: 'bash',
      callout: 'The installer downloads browser binaries for Chromium, Firefox, and WebKit. This takes a minute or two depending on your connection. If the download fails behind a corporate proxy, run: npx playwright install --with-deps',
    },
    {
      heading: 'Run the Example Tests',
      content: `Playwright ships with a working example test. Run it to confirm your environment is set up correctly.\n\n\`npx playwright test\` runs all tests headlessly (no visible browser window). To see the browser while tests run, add the \`--headed\` flag.\n\nAfter tests finish, open the HTML report with \`npx playwright show-report\`. This report shows every test, its status, duration, and — for failures — screenshots and traces.\n\n**Checkpoint:** If you see green results in the report, your environment works. If something failed, read the error message — it usually points to a missing browser binary or a Node.js version issue.`,
      code: `# Run all tests (headless — fast, no visible browser)\nnpx playwright test\n\n# Run with a visible browser window\nnpx playwright test --headed\n\n# Open the HTML report after tests finish\nnpx playwright show-report\n\n# Run a specific test file\nnpx playwright test tests/example.spec.ts`,
      codeLanguage: 'bash',
      tip: 'The --headed flag is useful for debugging. You\'ll watch the browser open, navigate, and interact — exactly like a user would. Use it when a test fails and you want to see what\'s happening.',
    },
  ],
  quiz: {
    question: 'What command runs Playwright tests with a visible browser window?',
    options: [
      'npx playwright test --browser',
      'npx playwright test --headed',
      'npx playwright test --visible',
      'npx playwright test --show',
    ],
    correctIndex: 1,
    explanation: 'The --headed flag tells Playwright to show the browser window while tests run. Without it, tests run headlessly (no visible window), which is faster but harder to debug visually.',
  },
  exercises: [
    {
      title: 'Run the Example Test and Read the Report',
      description: 'Run the built-in example test, open the HTML report, and answer: How many tests ran? How many passed? This confirms your environment is working.',
      difficulty: 'beginner',
      starterCode: `// Step 1: Open your terminal (Ctrl+\` in VS Code)
// Step 2: Run the example test
//   npx playwright test

// Step 3: Open the HTML report
//   npx playwright show-report

// Step 4: Answer these questions:
// - How many tests ran?
// - How many passed?
// - Which browsers were they tested in?

// If all tests passed: your environment is ready.
// If any failed: read the error message and fix the issue.`,
      solutionCode: `// Expected results after running: npx playwright test
//
// The example.spec.ts file contains 2 tests:
//   1. "has title" — verifies the page title
//   2. "get started link" — clicks a link and checks navigation
//
// With the default config, these run in 3 browsers:
//   Chromium, Firefox, WebKit = 6 total test runs
//
// After running: npx playwright show-report
// You should see all 6 results with green checkmarks.
//
// If something failed, common fixes:
//   npx playwright install          # reinstall browsers
//   node --version                  # verify Node.js 18+`,
      hints: [
        'Open the terminal in VS Code with Ctrl+` (backtick key)',
        'The command is: npx playwright test',
        'After tests finish, run: npx playwright show-report',
        'The report opens in your browser and shows pass/fail for each test',
      ],
    },
    {
      title: 'Navigate to the Practice App',
      description: 'Modify the example test to navigate to the practice app login page instead of the default URL. Run it with --headed to watch the browser open your login page.',
      difficulty: 'intermediate',
      starterCode: `import { test, expect } from '@playwright/test';

// This is the default example test.
// Change it to navigate to the practice app login page
// and verify the page loaded.

test('navigate to practice app', async ({ page }) => {
  // TODO: Navigate to http://localhost:5173/login
  // TODO: Verify the page has loaded (check for a heading or input)
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('navigate to practice app', async ({ page }) => {
  // Arrange: navigate to the login page
  await page.goto('http://localhost:5173/login');

  // Assert: verify the page loaded by checking for the email input
  await expect(page.getByTestId('email-input')).toBeVisible();
});

// Run with: npx playwright test --headed
// You should see the browser open and navigate to the login page.`,
      hints: [
        'Use page.goto() to navigate to a URL',
        'The practice app login page is at http://localhost:5173/login',
        'Use page.getByTestId(\'email-input\') to find the email field',
        'Wrap visibility checks in expect(...).toBeVisible()',
      ],
    },
  ],
  practiceLink: {
    url: 'http://localhost:5173/login',
    label: 'Open Practice App Login',
    description: 'Make sure the practice app is running (cd practice-app && pnpm dev) so your tests have something to test against.',
  },
  narrationScript: {
    intro: 'Before you write any tests, you need three tools installed. The whole setup takes about five minutes.',
    steps: [
      {
        text: 'First, Node.js. This is the runtime that makes everything else work. Download the LTS version from nodejs.org and install it. After installation, open a terminal and run "node --version" to confirm it\'s v18 or higher.',
        duration: 25,
      },
      {
        text: 'Second, VS Code. This is your editor. Download it from code.visualstudio.com. The key feature for us is the built-in terminal — open it with Ctrl+backtick. Every Playwright command runs here.',
        duration: 20,
      },
      {
        text: 'Third, Playwright itself. Run "npm init playwright@latest" in your terminal. Accept the defaults when prompted. This creates your config file, a tests folder, and a working example test.',
        duration: 25,
      },
      {
        text: 'The installer also downloads browser binaries — Chromium, Firefox, and WebKit. This takes a minute. If it fails behind a proxy, run "npx playwright install --with-deps" afterward.',
        duration: 20,
      },
      {
        text: 'Install the Playwright extension for VS Code. Open Extensions with Ctrl+Shift+X, search for "Playwright Test for VS Code", and install it. This gives you a sidebar for running tests and a "Record new" button for codegen.',
        duration: 25,
      },
      {
        text: 'Now let\'s confirm everything works. Run "npx playwright test" in your terminal. This runs the example test across all three browsers.',
        duration: 20,
      },
      {
        text: 'After the tests finish, run "npx playwright show-report" to open the HTML report. You should see green results for every test. If you do, your environment is ready.',
        duration: 20,
      },
      {
        text: 'Try running with the --headed flag: "npx playwright test --headed". Now you\'ll see the browser open, navigate, and interact. This is useful when you need to watch what a test is doing.',
        duration: 25,
      },
    ],
    outro: 'Your environment is set up. You\'ve got Node.js, VS Code, and Playwright installed, and you\'ve confirmed everything works by running the example test. Next, let\'s look at how tests are structured.',
  },
};
