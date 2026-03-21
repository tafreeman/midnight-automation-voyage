import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 2,
  title: "Environment Setup",
  subtitle: "Getting your local dev environment ready",
  icon: "⚙️",
  audience: "All Roles",
  sections: [
    {
      heading: "Prerequisites",
      content: "You need Node.js 18+, VS Code, and three extensions. If you're a non-coder, ask a developer to walk through the initial npm install with you the first time. After setup, you won't need to touch the command line often — the VS Code extension handles most interactions.",
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
      tip: "Non-coders: You only run this once per project. After initial setup, you'll primarily use the VS Code GUI — not the terminal."
    },
    {
      heading: "VS Code Extensions",
      content: "Install these three extensions from the VS Code marketplace. The Playwright extension gives you a sidebar with a 'Record new' button — this is your primary entry point as a non-coder.",
      code: `# Search in VS Code Extensions panel (Ctrl+Shift+X):
ms-playwright.playwright        # Playwright Test for VS Code
GitHub.copilot                   # GitHub Copilot
GitHub.copilot-chat              # GitHub Copilot Chat`,
      codeLanguage: "text",
    },
    {
      heading: "Project Configuration",
      content: "The playwright.config.ts file controls which browsers to test, where your app runs, and how failures are recorded. Here's a production config. Non-coders: you rarely edit this directly — but understanding what it does helps you read test results.",
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
      heading: "Team Copilot Instructions",
      content: "This is the highest-leverage Copilot investment. A .github/copilot-instructions.md file in your repo root teaches Copilot your team's testing conventions. Every developer and non-coder gets the same guardrails automatically.",
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
  }
};
