import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 25,
  title: "Multi-Browser & Projects Config",
  subtitle: "Cross-browser testing with Chromium, Firefox, WebKit, and project dependencies",
  icon: "🌐",
  audience: "Developers",
  sections: [
    {
      heading: "Playwright's Browser Engines",
      content:
        "Playwright supports three browser engines, each rendering web content differently. Testing across all three catches browser-specific bugs that single-browser testing misses.",
      table: {
        headers: ["Engine", "Browsers It Powers", "Market Share", "Key Differences"],
        rows: [
          ["Chromium", "Chrome, Edge, Opera, Brave", "~65%", "Most permissive, widest API support, DevTools Protocol"],
          ["Gecko (Firefox)", "Firefox", "~3%", "Strict CSP handling, different scrollbar rendering, privacy features"],
          ["WebKit", "Safari (macOS, iOS)", "~18%", "Different date inputs, font rendering, strict same-origin policy"],
        ],
      },
      callout: "WebKit testing is a Playwright exclusive — no other framework can test Safari's engine on Linux or Windows. This is a key differentiator.",
    },
    {
      heading: "The Projects Array",
      content:
        "The `projects` array in playwright.config.ts defines multiple test configurations that share the same test files. Each project can have its own browser, viewport, auth state, and other settings.",
      code: `// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

// Run all projects:     npx playwright test
// Run one project:      npx playwright test --project=chromium
// Run multiple:         npx playwright test --project=chromium --project=firefox`,
      codeLanguage: "typescript",
    },
    {
      heading: "Browser-Specific Gotchas",
      content:
        "Each engine has quirks that can cause tests to behave differently. Knowing these helps you write cross-browser-compatible tests and understand why a test passes on one engine but fails on another.",
      table: {
        headers: ["Browser", "Gotcha", "Impact on Tests"],
        rows: [
          ["WebKit", "Date inputs render as text fields", "fill() for date inputs may need different format"],
          ["WebKit", "Stricter same-origin policy", "Some cross-origin requests blocked that Chrome allows"],
          ["Firefox", "Different scrollbar rendering", "Visual regression screenshots differ from Chromium"],
          ["Firefox", "Native dialog handling differs", "alert()/confirm() interactions may need adjustments"],
          ["Chromium", "DevTools Protocol exclusive features", "Some CDP-based tests won't work on Firefox/WebKit"],
          ["All", "Font rendering varies by engine", "Anti-aliasing differences cause pixel-level diffs"],
        ],
      },
      warning: "Never use Chromium-only DevTools Protocol features (like CDP sessions) in cross-browser tests. They'll silently fail on Firefox and WebKit.",
    },
    {
      heading: "Project Dependencies",
      content:
        "When tests require pre-conditions (like authentication), use a setup project that runs first. Test projects declare dependencies on the setup project, ensuring auth is ready before any test runs.",
      code: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // Setup project — runs first, creates auth state
    {
      name: 'setup',
      testMatch: /.*\\.setup\\.ts/,
    },

    // Browser projects — depend on setup
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './auth/admin.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: './auth/admin.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: './auth/admin.json',
      },
      dependencies: ['setup'],
    },
  ],
});`,
      codeLanguage: "typescript",
      tip: "The setup project runs once, not once per browser. This means a single auth setup serves all three browser projects — efficient and consistent.",
    },
    {
      heading: "Risk-Based Browser Selection",
      content:
        "Running all tests on all browsers triples your CI time. Use a risk-based strategy to focus browser coverage where it matters most.",
      table: {
        headers: ["Strategy", "Browsers", "When to Use"],
        rows: [
          ["Full matrix", "Chromium + Firefox + WebKit", "Nightly runs, release candidates"],
          ["Primary + spot", "Chromium (all tests) + WebKit (smoke only)", "Every PR — fast feedback with Safari coverage"],
          ["Single browser", "Chromium only", "Feature branches during active development"],
          ["Analytics-driven", "Top 2 browsers by user traffic", "Production apps with analytics data"],
        ],
      },
    },
    {
      heading: "Cross-Browser Visual Differences",
      content:
        "Visual regression tests will produce different baselines for each browser due to font rendering, scrollbar styles, and anti-aliasing differences. Playwright handles this by storing per-project baselines automatically.",
      code: `// Baselines are stored per-project:
// tests/products.spec.ts-snapshots/
//   products-chromium.png
//   products-firefox.png
//   products-webkit.png

// Update baselines for a specific project:
// npx playwright test --project=firefox --update-snapshots`,
      codeLanguage: "bash",
    },
    {
      heading: "Browser Version Pinning",
      content:
        "Playwright bundles specific browser versions with each release. Pin your Playwright version to ensure consistent browser behavior across environments.",
      code: `# Check installed browser versions
npx playwright --version

# Install browsers matching your Playwright version
npx playwright install

# Install a specific browser only
npx playwright install chromium

# Install browsers with system dependencies (for CI)
npx playwright install --with-deps`,
      codeLanguage: "bash",
      tip: "When upgrading Playwright, always update baselines — browser version changes cause rendering differences that visual tests will flag.",
    },
  ],
  quiz: {
    question:
      "Why might a visual regression test pass on Chromium but fail on WebKit?",
    options: [
      "WebKit doesn't support screenshots",
      "Chromium has a larger viewport by default",
      "Font rendering, subpixel antialiasing, and scrollbar styles differ between engines",
      "WebKit runs tests in a different order",
    ],
    correctIndex: 2,
    explanation:
      "Each browser engine renders fonts, handles subpixel antialiasing, and styles scrollbars differently. These pixel-level differences cause visual regression screenshots to differ between browsers. The solution is per-browser baselines (Playwright handles this automatically) or increased diff thresholds for cross-browser visual tests.",
  },
  exercise: {
    title: "Multi-Browser Config with Auth Setup",
    description:
      "Configure a playwright.config.ts with 3 browser projects (Chromium, Firefox, WebKit) plus a setup project for authentication. Test projects should depend on setup.",
    starterCode: `// playwright.config.ts — single browser, no auth setup
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
});

// TODO: 1. Import devices from @playwright/test
// TODO: 2. Add a 'setup' project that matches *.setup.ts files
// TODO: 3. Add chromium, firefox, webkit projects
// TODO: 4. Each browser project should use storageState and depend on 'setup'`,
    solutionCode: `// playwright.config.ts — multi-browser with auth setup
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\\.setup\\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './auth/admin.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: './auth/admin.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: './auth/admin.json',
      },
      dependencies: ['setup'],
    },
  ],
});`,
    hints: [
      "Import { devices } alongside defineConfig from @playwright/test",
      "Setup project uses testMatch regex to only run *.setup.ts files",
      "Each browser project uses the spread operator: ...devices['Desktop Chrome']",
      "dependencies: ['setup'] ensures auth runs before browser tests",
    ],
  },
  promptTemplates: [
    {
      label: "Generate Multi-Browser Config",
      prompt:
        "Generate a Playwright playwright.config.ts with projects for {browsers} and an auth setup project. Include storageState paths, project dependencies, and trace configuration. Base URL: {url}.",
      context: "CARD format: Context — cross-browser test setup. Action — configure projects. Role — QE engineer. Deliverable — complete config file.",
    },
    {
      label: "Investigate Cross-Browser Failure",
      prompt:
        "This test passes on Chromium but fails on {browser}. Investigate the difference and suggest a cross-browser-compatible fix. Test code:\n{paste test code}\nError on {browser}:\n{paste error}",
      context: "CARD format: Context — cross-browser inconsistency. Action — diagnose and fix. Role — test engineer. Deliverable — root cause + cross-browser fix.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/",
    label: "Practice App",
    description:
      "Run your tests across all three browsers with --project flags and compare results to discover cross-browser differences.",
  },
};
