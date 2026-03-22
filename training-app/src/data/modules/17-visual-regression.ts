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
  exercises: [
    {
      difficulty: 'beginner',
      title: 'Assert Orders Table Basics',
      description: 'Write a test that verifies the Orders table loads correctly with the expected data. Check row count, column headers, and basic data presence.',
      narration: "Start by asserting that getByTestId('data-table') is visible — you check this first because it confirms the page fully rendered and there's something to inspect. Then assert toHaveCount(5) on getByTestId('table-row') to confirm the first page of results loaded; a count of zero would tell you data fetching is broken even if the table shell is present. For the final check, grab .first() from the table-row locator and then chain getByTestId('cell-id'), getByTestId('cell-customer'), and getByTestId('cell-amount') off that single-row reference — asserting each is visible confirms the row has data in all expected columns, not just that a row element exists.",
      starterCode: `import { test, expect } from '@playwright/test';

test('orders table displays data', async ({ page }) => {
  await page.goto('/orders');

  // TODO: Assert the data table is visible
  // TODO: Assert 5 rows are visible (first page shows 5 of 15)
  // TODO: Assert the row count indicator shows the total
  // TODO: Assert the first row has an ID, customer name, and amount
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('orders table displays data', async ({ page }) => {
  await page.goto('/orders');

  await expect(page.getByTestId('data-table')).toBeVisible();
  await expect(page.getByTestId('table-row')).toHaveCount(5);
  await expect(page.getByTestId('row-count')).toBeVisible();

  const firstRow = page.getByTestId('table-row').first();
  await expect(firstRow.getByTestId('cell-id')).toBeVisible();
  await expect(firstRow.getByTestId('cell-customer')).toBeVisible();
  await expect(firstRow.getByTestId('cell-amount')).toBeVisible();
});`,
      hints: [
        'The table testid is data-table (not orders-table)',
        'Use toHaveCount(5) since the table shows 5 rows per page',
        'Use .first() to get the first table-row, then find cells inside it',
        'Cell testids follow the pattern: cell-{columnName}',
      ],
    },
    {
      difficulty: 'intermediate',
      title: 'Sort, Filter, and Paginate the Orders Table',
      description: 'Write tests that exercise the table\'s interactive features: column sorting, status filtering, and pagination.',
      narration: "Each of these three tests follows the same pattern: trigger an interaction, then assert that the data changed in the expected way — not just that no error appeared. For sorting, click getByTestId('col-amount'), then read the textContent of cell-amount from the first and second rows and compare them numerically after stripping the dollar sign; you're verifying the sort actually reordered data, not just that a sort indicator appeared. For filtering, capture the row count before selecting 'Shipped' from getByTestId('status-filter'), then confirm the count decreased and that every visible cell-status contains exactly 'Shipped' — looping through statusCells.all() is the only way to catch a filter that shows some wrong rows. For pagination, snapshot the first row's cell-id before and after clicking getByTestId('page-2'), then assert they differ; that ID comparison proves a new dataset loaded, which is more reliable than asserting page number text.",
      starterCode: `import { test, expect } from '@playwright/test';

test.describe('Orders Table Interactions', () => {
  test('sort by amount column', async ({ page }) => {
    await page.goto('/orders');
    // TODO: Click the Amount column header to sort
    // TODO: Assert the sort indicator appears
    // TODO: Get the first two amounts and verify they're in order
  });

  test('filter by Shipped status', async ({ page }) => {
    await page.goto('/orders');
    // TODO: Select "Shipped" from the status filter
    // TODO: Assert the row count decreased
    // TODO: Assert every visible status cell says "Shipped"
  });

  test('navigate to page 2', async ({ page }) => {
    await page.goto('/orders');
    // TODO: Click page 2 in the pagination
    // TODO: Assert different rows are now visible
    // TODO: Assert the page info updated
  });
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test.describe('Orders Table Interactions', () => {
  test('sort by amount column', async ({ page }) => {
    await page.goto('/orders');
    await page.getByTestId('col-amount').click();
    await expect(page.getByTestId('sort-indicator')).toBeVisible();
    const firstAmount = await page.getByTestId('table-row').first()
      .getByTestId('cell-amount').textContent();
    const secondAmount = await page.getByTestId('table-row').nth(1)
      .getByTestId('cell-amount').textContent();
    const first = parseFloat(firstAmount!.replace('$', ''));
    const second = parseFloat(secondAmount!.replace('$', ''));
    expect(first).toBeLessThanOrEqual(second);
  });

  test('filter by Shipped status', async ({ page }) => {
    await page.goto('/orders');
    const allRows = await page.getByTestId('table-row').count();
    await page.getByTestId('status-filter').selectOption('Shipped');
    const filteredRows = await page.getByTestId('table-row').count();
    expect(filteredRows).toBeLessThan(allRows);
    const statusCells = page.getByTestId('table-row').getByTestId('cell-status');
    for (const cell of await statusCells.all()) {
      await expect(cell).toHaveText('Shipped');
    }
  });

  test('navigate to page 2', async ({ page }) => {
    await page.goto('/orders');
    const firstPageId = await page.getByTestId('table-row').first()
      .getByTestId('cell-id').textContent();
    await page.getByTestId('page-2').click();
    const secondPageId = await page.getByTestId('table-row').first()
      .getByTestId('cell-id').textContent();
    expect(firstPageId).not.toBe(secondPageId);
    await expect(page.getByTestId('page-info')).toBeVisible();
  });
});`,
      hints: [
        'Click col-amount to sort — the sort-indicator element appears when sorted',
        'Parse amounts by stripping the $ prefix: parseFloat(text.replace("$", ""))',
        'After filtering, loop through all visible cell-status elements to verify they match',
        'Compare row IDs between page 1 and page 2 to confirm different data loaded',
      ],
    },
    {
      difficulty: 'advanced',
      title: 'Visual Regression with Dynamic Masking',
      description: 'Write a visual regression test for the Orders table. Mask the date column and status badges (which change between test runs) to prevent false failures.',
      narration: "You're taking a screenshot of the data-table element specifically rather than the full page, because the table is what you care about and a full-page shot would fail any time the page header or footer changed. Pass 'orders-table.png' as the first argument to toHaveScreenshot() so the baseline file has a meaningful name you can identify later in the snapshots directory. In the options object, set mask to an array containing getByTestId('cell-date') and getByTestId('cell-status') — dates change every day and status values vary per seed, so without masking those cells you'd get false failures on every run that has different data. Finally, set maxDiffPixelRatio: 0.01 to allow a 1% pixel variance, which absorbs minor font-rendering differences between environments without hiding a real layout regression.",
      starterCode: `import { test, expect } from '@playwright/test';

test('orders table visual snapshot', async ({ page }) => {
  await page.goto('/orders');
  await expect(page.getByTestId('data-table')).toBeVisible();

  // TODO: Take a screenshot of the data table with:
  // 1. A descriptive filename
  // 2. Mask the date column cells (cell-date) to avoid time-based failures
  // 3. Set maxDiffPixelRatio to 0.01 (1% tolerance)
  // 4. Also mask the status cells since statuses may differ between runs
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('orders table visual snapshot', async ({ page }) => {
  await page.goto('/orders');
  await expect(page.getByTestId('data-table')).toBeVisible();

  await expect(page.getByTestId('data-table')).toHaveScreenshot(
    'orders-table.png',
    {
      mask: [
        page.getByTestId('cell-date'),
        page.getByTestId('cell-status'),
      ],
      maxDiffPixelRatio: 0.01,
    }
  );
});`,
      hints: [
        'The table testid is data-table (not orders-table)',
        'Pass a filename as the first argument: toHaveScreenshot("orders-table.png", options)',
        'The mask option takes an array of locators — use getByTestId for date and status cells',
        'maxDiffPixelRatio: 0.01 means 1% pixel difference tolerance',
      ],
    },
  ],
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
