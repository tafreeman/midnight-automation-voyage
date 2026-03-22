import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 2,
  title: "Environment Setup",
  subtitle: "Getting your local dev environment ready",
  icon: "⚙️",
  sections: [
    {
      heading: "Prerequisites",
      content: "You need Node.js 18+, VS Code, and three extensions. If local setup is new to you, follow the install once carefully and capture the steps in your project README. After the initial setup, most day-to-day interaction can happen through the VS Code Playwright tooling.",
      code: `# Check your Node version (must be 18+)
node --version

# Create Playwright project in your repo
npm init playwright@latest

# When prompted, select:
#   Language: TypeScript
#   Test folder: e2e/
#   GitHub Actions: Yes
#   Install browsers: Yes`,
      codeLanguage: "bash",
      tip: "Treat setup as a reusable project asset, not tribal knowledge. Good setup notes pay off every time the environment needs to be recreated."
    },
    {
      heading: "VS Code Extensions",
      content: "Install these three extensions from the VS Code marketplace. The Playwright extension gives you a sidebar with a 'Record new' button, which is a fast onramp for capturing real flows before refining them.",
      code: `# Search in VS Code Extensions panel (Ctrl+Shift+X):
ms-playwright.playwright        # Playwright Test for VS Code
GitHub.copilot                   # GitHub Copilot
GitHub.copilot-chat              # GitHub Copilot Chat`,
      codeLanguage: "text",
    },
    {
      heading: "Project Configuration",
      content: "The playwright.config.ts file controls which browsers to test, where your app runs, and how failures are recorded. You may not edit this file every day, but understanding what it does helps everyone read failures, reason about retries, and spot environment drift.",
      code: `// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
testDir: './e2e',
fullyParallel: true,
forbidOnly: !!process.env.CI,
retries: process.env.CI ? 2 : 0,
reporter: [['html'], ['junit', { outputFile: 'results.xml' }]],
use: {
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
},
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
],
});`,
      codeLanguage: "typescript",
    },
    {
      heading: "Repository Copilot Instructions",
      content: "This is the highest-leverage Copilot investment. A `.github/copilot-instructions.md` file in your repo root teaches Copilot the testing conventions for that codebase so suggestions stay consistent automatically.",
      code: `<!-- .github/copilot-instructions.md -->
# Testing Conventions
- Use Playwright Test (@playwright/test) for all E2E tests
- Follow Page Object Model pattern (see e2e/pages/)
- Use data-testid attributes for selectors, not CSS classes
- Include at least one assertion per user action
- Never use page.waitForTimeout() — rely on auto-wait
- Tests must be independent — no shared state between tests
- Use test fixtures for authentication setup`,
      codeLanguage: "markdown",
      tip: "This file shapes every Copilot suggestion project-wide. A 10-minute investment that pays off on every test written afterward."
    }
  ],
  exercise: {
    title: "Spot the Config Issue",
    description: "This config has a common mistake. Can you identify and fix it?",
    starterCode: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
testDir: './e2e',
use: {
  baseURL: 'http://localhost:3000',
  trace: 'on-first-retry',
},
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
],
// Problem: tests depend on dev server but it's not configured
// How do you tell Playwright to start the server automatically?
});`,
    solutionCode: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
testDir: './e2e',
use: {
  baseURL: 'http://localhost:3000',
  trace: 'on-first-retry',
},
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
],
webServer: {
  command: 'npm run dev',
  port: 3000,
  reuseExistingServer: !process.env.CI,
},
});`,
    hints: [
      "The webServer config object tells Playwright how to start your app",
      "You need command (how to start), port (where to find it), and reuseExistingServer"
    ]
  },
  promptTemplates: [
    {
      label: "Troubleshoot Playwright Setup",
      context: "Use when Playwright installation or browser download fails and you need to diagnose the error.",
      prompt: "Context: I am setting up Playwright for test automation and ran into an error during installation. My environment is [OPERATING_SYSTEM] with Node.js [VERSION]. I installed Playwright using npm init playwright@latest.\n\nAction: Diagnose the following error message and provide step-by-step instructions to resolve it. Also list the 5 most common Playwright setup failures and their fixes so I can check for related issues.\n\nRules:\n- Cover these common failure categories: browser binary download failures, missing OS-level dependencies (especially on Linux), permission errors on Windows/macOS, proxy/firewall blocking downloads, and Node.js version incompatibility\n- For each diagnosis, provide the exact terminal command to fix the issue\n- If the error suggests a dependency is missing, show how to install it for the user's OS\n- Include a verification command to confirm the fix worked (e.g., npx playwright install --dry-run, npx playwright doctor)\n\nData — Error message:\n[PASTE YOUR ERROR OUTPUT HERE]",
    },
    {
      label: "Generate playwright.config.ts",
      context: "Use when starting a new project and you need a complete, well-commented Playwright configuration file.",
      prompt: "Context: I am setting up Playwright for a [FRAMEWORK — e.g., React/Next.js/Vue] project. The dev server runs on [PORT] using the command [DEV_COMMAND — e.g., npm run dev]. Tests will live in the [TEST_DIR — e.g., e2e/] directory.\n\nAction: Generate a complete playwright.config.ts file with detailed comments explaining every option.\n\nRules:\n- Include projects for Chromium, Firefox, and WebKit using Playwright's built-in device descriptors\n- Configure baseURL to read from an environment variable with a localhost fallback\n- Set up the HTML reporter plus a JUnit reporter for CI integration\n- Configure trace capture on first retry so failures are debuggable\n- Add screenshot capture on failure only\n- Include a webServer block that starts the dev server automatically and reuses an existing server outside CI\n- Set fullyParallel to true and configure 2 retries in CI, 0 locally\n- Use forbidOnly in CI to prevent accidental .only commits\n- Add a comment block at the top explaining how to run tests (npx playwright test, --headed, --ui flags)\n\nData:\n- Framework: [YOUR_FRAMEWORK]\n- Dev server command: [YOUR_DEV_COMMAND]\n- Dev server port: [YOUR_PORT]\n- Test directory: [YOUR_TEST_DIR]",
    },
  ],
  quiz: {
    question: "Which command installs Playwright browsers after adding Playwright to your project?",
    options: [
      "npm install browsers",
      "npx playwright install",
      "playwright setup --browsers",
      "npm run playwright:browsers",
    ],
    correctIndex: 1,
    explanation: "After installing @playwright/test, you must run 'npx playwright install' to download the actual browser binaries (Chromium, Firefox, WebKit). Without this step, tests will fail because the browsers aren't available on your machine.",
  },
  practiceLink: {
    url: "http://localhost:5173/login",
    label: "Use the Practice App login page to verify your Playwright setup is working",
    description: "Once your environment is set up, the login page is perfect for testing your first automated interactions",
  }
};
