import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 17,
  title: "Visual Regression Testing",
  subtitle: "Catching CSS bugs and layout shifts with toHaveScreenshot()",
  icon: "📸",
  audience: "All Roles",
  sections: [
    {
      heading: "What Functional Tests Miss",
      content:
        "Functional tests assert behavior — button clicks, form submissions, API responses. But they're blind to visual defects. A CSS regression can move a button off-screen, change text color to match the background, or break responsive layout — all while every functional assertion passes. Visual regression testing captures pixel-level differences to catch these silent failures.",
      callout: "A button that passes `toBeVisible()` might still be invisible to a real user if its color matches the background. Visual tests catch what functional tests cannot.",
    },
    {
      heading: "toHaveScreenshot() Basics",
      content:
        "Playwright has built-in visual comparison via `toHaveScreenshot()`. On the first run, it creates a baseline image. On subsequent runs, it compares the current state against the baseline and fails if pixels differ beyond the configured threshold.",
      code: `import { test, expect } from '@playwright/test';

test('orders page matches visual baseline', async ({ page }) => {
  await page.goto('/orders');
  // Wait for data to load
  await expect(page.getByTestId('orders-table')).toBeVisible();

  // Compare entire page against stored baseline
  await expect(page).toHaveScreenshot('orders-page.png');
});`,
      codeLanguage: "typescript",
      tip: "Run `npx playwright test --update-snapshots` to create or update baseline images when you intentionally change the UI.",
    },
    {
      heading: "Full-Page vs Element Screenshots",
      content:
        "Full-page screenshots capture everything but are sensitive to any change anywhere on the page. Element-level screenshots focus on a specific component, making tests more stable and failures easier to diagnose.",
      code: `// Full page — sensitive to nav, footer, sidebar changes
await expect(page).toHaveScreenshot('full-page.png');

// Element only — isolated, more stable
const table = page.getByTestId('orders-table');
await expect(table).toHaveScreenshot('orders-table.png');

// Element with specific viewport
await page.setViewportSize({ width: 375, height: 812 });
await expect(table).toHaveScreenshot('orders-table-mobile.png');`,
      codeLanguage: "typescript",
    },
    {
      heading: "Masking Dynamic Content",
      content:
        "Timestamps, user avatars, animated elements, and randomized content change every run and cause false failures. Use the `mask` option to cover these areas with a solid block during comparison.",
      code: `test('orders table with masked dates', async ({ page }) => {
  await page.goto('/orders');

  await expect(page.getByTestId('orders-table')).toHaveScreenshot(
    'orders-table-masked.png',
    {
      mask: [
        page.locator('.date-column'),   // Dates change
        page.locator('.user-avatar'),     // Avatars vary
      ],
    }
  );
});`,
      codeLanguage: "typescript",
      warning: "Don't mask so much that the screenshot becomes meaningless. If you're masking more than 30% of an element, consider element-level screenshots instead.",
    },
    {
      heading: "Threshold Tuning",
      content:
        "Pixel-perfect comparison is too strict for most apps — anti-aliasing and font rendering differ across OSes. Playwright offers `maxDiffPixels` (absolute count) and `maxDiffPixelRatio` (percentage) to allow acceptable variance.",
      code: `await expect(page).toHaveScreenshot('dashboard.png', {
  // Allow up to 100 pixels to differ (anti-aliasing tolerance)
  maxDiffPixels: 100,
});

await expect(page).toHaveScreenshot('dashboard.png', {
  // Allow up to 1% of pixels to differ
  maxDiffPixelRatio: 0.01,
});

// Configure globally in playwright.config.ts:
// expect: {
//   toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
// }`,
      codeLanguage: "typescript",
      table: {
        headers: ["Option", "Type", "Use When"],
        rows: [
          ["maxDiffPixels", "number", "Small, predictable differences (e.g., font rendering)"],
          ["maxDiffPixelRatio", "0-1", "Proportional tolerance that scales with element size"],
          ["threshold", "0-1", "Per-pixel color sensitivity (default 0.2)"],
        ],
      },
    },
    {
      heading: "Baseline Management and Update Policy",
      content:
        "Baselines must be committed to version control so the whole team shares the same reference images. Establish a clear policy for when and how baselines are updated to prevent accidental regressions from being 'accepted' without review.",
      table: {
        headers: ["Rule", "Why"],
        rows: [
          ["Commit baselines to git", "Ensures all developers compare against the same images"],
          ["Never update baselines in a bug-fix PR", "Bug fixes shouldn't change visual expectations"],
          ["Review screenshot diffs in PR", "Treat visual changes like code changes — they need review"],
          ["Separate PRs for intentional redesigns", "Makes it clear when visual baselines are deliberately changing"],
          ["Run on a consistent OS/browser", "Cross-OS font rendering causes false diffs"],
        ],
      },
    },
    {
      heading: "CI Considerations",
      content:
        "Visual tests are most reliable when the rendering environment is consistent. Docker containers with pre-installed Playwright browsers eliminate OS-level differences that cause false failures.",
      code: `# Run visual tests in Docker for consistency
docker run --rm -v $(pwd):/work -w /work \\
  mcr.microsoft.com/playwright:v1.42.0-jammy \\
  npx playwright test --project=chromium`,
      codeLanguage: "bash",
      tip: "Generate baselines inside the same Docker image you use in CI. This eliminates cross-platform font rendering differences.",
    },
  ],
  quiz: {
    question: "What should you mask in visual regression tests?",
    options: [
      "All text content to focus on layout only",
      "Timestamps, animated elements, and user-specific data",
      "Nothing — pixel-perfect comparison is always best",
      "The entire page header and footer",
    ],
    correctIndex: 1,
    explanation:
      "Dynamic content like timestamps, animations, and user-specific data (avatars, names) changes every run and creates false failures. Masking these areas lets you focus on the stable visual elements that matter for regression detection.",
  },
  exercise: {
    title: "Visual Regression Test for Orders Table",
    description:
      "Write a visual regression test for the Orders table that masks the date column and sets a 1% pixel ratio threshold.",
    starterCode: `import { test, expect } from '@playwright/test';

test('orders table visual regression', async ({ page }) => {
  await page.goto('/orders');
  await expect(page.getByTestId('orders-table')).toBeVisible();

  // TODO: Add visual regression assertion with:
  // 1. Mask the date column to avoid false failures
  // 2. Set maxDiffPixelRatio to 0.01 (1% tolerance)
  await expect(page.getByTestId('orders-table')).toHaveScreenshot();
});`,
    solutionCode: `import { test, expect } from '@playwright/test';

test('orders table visual regression', async ({ page }) => {
  await page.goto('/orders');
  await expect(page.getByTestId('orders-table')).toBeVisible();

  await expect(page.getByTestId('orders-table')).toHaveScreenshot(
    'orders-table.png',
    {
      mask: [page.locator('td:nth-child(4)')], // Date column
      maxDiffPixelRatio: 0.01,
    }
  );
});`,
    hints: [
      "Pass a filename as the first argument to toHaveScreenshot() for readable baseline names",
      "Use the mask option with an array of locators to cover dynamic content",
      "maxDiffPixelRatio accepts a value between 0 and 1 (0.01 = 1%)",
    ],
  },
  promptTemplates: [
    {
      label: "Generate Visual Regression Test",
      prompt:
        "Generate a Playwright visual regression test for {page} that masks dynamic content (timestamps, avatars, user-specific data) and uses a maxDiffPixelRatio of 0.01. Include both full-page and element-level screenshot assertions.",
      context: "CARD format: Context — practice app with data tables. Action — generate visual test. Role — QE engineer. Deliverable — complete spec file with masked screenshots.",
    },
    {
      label: "Baseline Update Policy",
      prompt:
        "Create a baseline update policy document for a CI pipeline that uses Playwright visual regression. Include: when to update, who approves, how to review diffs, and Docker consistency requirements.",
      context: "CARD format: Context — enterprise CI pipeline. Action — create policy. Role — QE lead. Deliverable — markdown policy document.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/orders",
    label: "Orders Page",
    description: "Write visual regression tests against the sortable data table with date columns to mask.",
  },
};
