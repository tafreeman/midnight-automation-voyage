import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 23,
  title: "Mobile & Responsive Testing",
  subtitle: "Device emulation, viewport assertions, and touch interactions",
  icon: "📱",
  audience: "All Roles",
  sections: [
    {
      heading: "Why Mobile Testing Matters",
      content:
        "Over 50% of global web traffic comes from mobile devices. A responsive layout that works on desktop can break on a phone — text overflow, overlapping buttons, unreachable navigation, and touch targets too small to tap. Playwright's device emulation lets you test mobile behavior without physical devices, covering viewport sizes, user agents, touch support, and device pixel ratios.",
      callout: "An enterprise app that works perfectly on desktop but fails on mobile loses half its users. Mobile testing is not optional — it's where your users are.",
    },
    {
      heading: "Device Descriptors",
      content:
        "Playwright ships with a registry of real device configurations — viewport, user agent, pixel ratio, and touch support. Use these instead of guessing dimensions.",
      code: `import { devices } from '@playwright/test';

// Access built-in device descriptors
const iPhone14 = devices['iPhone 14'];
// { viewport: { width: 390, height: 844 },
//   userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0...',
//   deviceScaleFactor: 3,
//   isMobile: true,
//   hasTouch: true }

const pixel7 = devices['Pixel 7'];
const iPadPro = devices['iPad Pro 11'];

// See all available devices:
// npx playwright show-devices`,
      codeLanguage: "typescript",
      tip: "Always use device descriptors instead of raw viewport sizes. They include userAgent, deviceScaleFactor, and hasTouch — all of which affect how the app renders and responds.",
    },
    {
      heading: "Configuring Device Projects",
      content:
        "Add device projects to your playwright.config.ts alongside desktop browsers. Each project runs your entire test suite (or tagged subset) on that device profile.",
      code: `// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // Desktop browsers
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },

    // Mobile devices
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },

    // Tablet
    {
      name: 'tablet',
      use: { ...devices['iPad Pro 11'] },
    },
  ],
});`,
      codeLanguage: "typescript",
    },
    {
      heading: "Viewport Assertions",
      content:
        "Use visual regression screenshots at mobile breakpoints to catch responsive layout issues. Combine with element-level assertions to verify that mobile-specific UI elements (hamburger menus, bottom nav bars) appear at the right breakpoints.",
      code: `import { test, expect } from '@playwright/test';

test('products page layout adapts to mobile viewport', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/products');

  // Verify mobile-specific layout
  const grid = page.locator('.results-grid');
  await expect(grid).toBeVisible();

  // On mobile, grid should stack to single column
  // Visual regression captures the layout
  await expect(page).toHaveScreenshot('products-mobile.png', {
    maxDiffPixelRatio: 0.02,
  });
});`,
      codeLanguage: "typescript",
    },
    {
      heading: "Touch Interactions",
      content:
        "Mobile devices don't have mouse hover states — they use tap, swipe, and long-press. When running with a mobile device descriptor that has `hasTouch: true`, Playwright automatically uses touch events instead of mouse events for `click()`. You can also use explicit touch APIs.",
      code: `import { test, expect } from '@playwright/test';

test('product card responds to tap on mobile', async ({ page }) => {
  // With a mobile device project, click() uses touch events
  await page.goto('/products');

  // Tap a product card
  await page.locator('.product-card').first().click();

  // For explicit touch gestures:
  await page.locator('.product-card').first().tap();
});

// Swipe pattern (emulate with touchscreen)
test('swipe to reveal actions', async ({ page }) => {
  await page.goto('/orders');

  // Simulate swipe with touchscreen drag
  const row = page.locator('.data-table tbody tr').first();
  const box = await row.boundingBox();
  if (box) {
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  }
});`,
      codeLanguage: "typescript",
    },
    {
      heading: "Orientation Changes",
      content:
        "Test how your app responds to orientation changes (portrait ↔ landscape) by resizing the viewport mid-test. This catches layout issues that only appear at landscape aspect ratios.",
      code: `test('orders table adapts to landscape orientation', async ({ page }) => {
  // Start in portrait
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/orders');
  await expect(page.locator('.data-table')).toBeVisible();

  // Rotate to landscape
  await page.setViewportSize({ width: 844, height: 390 });

  // Table should still be usable — verify horizontal scroll or adapted layout
  await expect(page.locator('.data-table')).toBeVisible();
  await expect(page).toHaveScreenshot('orders-landscape.png');
});`,
      codeLanguage: "typescript",
    },
    {
      heading: "Mobile-Specific Gotchas",
      content:
        "Mobile testing introduces patterns that don't exist on desktop. Watch for these common issues:",
      table: {
        headers: ["Gotcha", "Why It Happens", "How to Handle"],
        rows: [
          ["No hover states", "Touch devices don't have mouse hover", "Test with and without hover — use @media (hover: hover)"],
          ["Fixed positioning bugs", "iOS Safari handles fixed elements differently", "Test with actual device descriptors, not just viewport"],
          ["Virtual keyboard overlap", "On-screen keyboard pushes content up", "Ensure form fields remain visible after focus"],
          ["Touch target size", "Buttons < 44x44px are hard to tap", "Assert min dimensions in a11y tests"],
          ["Viewport units (vh)", "Mobile browsers have dynamic viewport height", "Use dvh or test with and without browser chrome"],
        ],
      },
      warning: "A common mistake is testing 'mobile' by just setting a small viewport size. Real mobile emulation requires the full device descriptor — userAgent, touch support, and pixel ratio all affect behavior.",
    },
    {
      heading: "When to Split vs Parameterize",
      content:
        "Some tests work identically on desktop and mobile; others need completely different flows (hamburger menu vs sidebar nav). Choose the right strategy for each test.",
      table: {
        headers: ["Strategy", "When to Use", "Example"],
        rows: [
          ["Shared test + device matrix", "Same flow works on all devices", "Login form, data tables, search"],
          ["Separate mobile tests", "Mobile has a different UI flow", "Hamburger menu navigation, swipe actions"],
          ["Tag-based filtering", "Mobile subset of the full suite", "@mobile tag on touch-specific tests"],
        ],
      },
    },
    {
      heading: "Mobile Accessibility",
      content:
        "Mobile a11y has unique requirements beyond desktop WCAG. Touch targets must be at least 44x44 CSS pixels. Zoom support must not be disabled (no `user-scalable=no`). Content must be readable without horizontal scrolling at 320px width.",
      tip: "Run axe-core scans on mobile viewports too. Some violations only appear at smaller sizes — text overflow, truncated labels, and contrast issues from different background images.",
    },
  ],
  quiz: {
    question:
      "What's the difference between setting viewport in config vs using page.setViewportSize()?",
    options: [
      "Config viewport is only for screenshots; setViewportSize is for all tests",
      "Config viewport applies to the entire test from the start, while setViewportSize changes mid-test",
      "There is no difference — they do the same thing",
      "Config viewport is permanent; setViewportSize is temporary and resets between tests",
    ],
    correctIndex: 1,
    explanation:
      "The viewport set in playwright.config.ts (via device descriptors or explicit config) applies from the moment the browser context is created — every test in that project starts at that size. page.setViewportSize() changes the viewport mid-test, which is useful for testing responsive behavior on resize or orientation change. Both are useful, but for different purposes.",
  },
  exercise: {
    title: "Mobile Test for Products Page",
    description:
      "Adapt the Products page search test for iPhone 14. Configure a mobile device project and add mobile-specific assertions.",
    starterCode: `// playwright.config.ts — add a mobile project
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // TODO: Add an iPhone 14 project
  ],
});

// products-mobile.spec.ts
import { test, expect } from '@playwright/test';

test('products search works on mobile', async ({ page }) => {
  // TODO: This test runs on desktop. Make it mobile-aware:
  // 1. The test should run in the iPhone 14 project
  // 2. Assert the products grid is visible
  // 3. Search for a product and verify results
  // 4. Take a mobile viewport screenshot for visual regression
  await page.goto('/products');
  await page.getByTestId('search-input').fill('Widget');
  await page.getByTestId('search-button').click();
});`,
    solutionCode: `// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],
});

// products-mobile.spec.ts
import { test, expect } from '@playwright/test';

test('products search works on mobile', async ({ page }) => {
  await page.goto('/products');

  // Verify the grid renders at mobile width
  await expect(page.locator('.results-grid')).toBeVisible();

  // Search for a product
  await page.getByTestId('search-input').fill('Widget');
  await page.getByTestId('search-button').click();

  // Verify results appear
  await expect(page.getByTestId('result-count')).toBeVisible();

  // Visual regression at mobile viewport
  await expect(page).toHaveScreenshot('products-mobile-search.png', {
    maxDiffPixelRatio: 0.02,
  });
});`,
    hints: [
      "Add a project with `use: { ...devices['iPhone 14'] }` to the config",
      "Run with `--project=mobile-safari` to execute only on the mobile device",
      "Use toHaveScreenshot() to capture the mobile layout for visual regression",
    ],
  },
  promptTemplates: [
    {
      label: "Generate Mobile Device Project",
      prompt:
        "Generate a Playwright playwright.config.ts project configuration for {device} with mobile-specific settings. Include device descriptor, mobile assertions examples, and touch interaction patterns.",
      context: "CARD format: Context — responsive web app. Action — configure mobile testing. Role — QE engineer. Deliverable — config + example spec.",
    },
    {
      label: "Convert Desktop Test to Mobile",
      prompt:
        "Convert this desktop Playwright test to work on mobile with touch interactions and responsive assertions. Handle: touch events instead of hover, viewport-appropriate layout checks, and mobile-specific UI elements.\n\nDesktop test:\n{paste test code}",
      context: "CARD format: Context — existing desktop test. Action — mobile adaptation. Role — test engineer. Deliverable — mobile-compatible spec.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/products",
    label: "Products Page",
    description:
      "Test the search and filter features at mobile breakpoints — try iPhone 14, Pixel 7, and iPad Pro configurations.",
  },
};
