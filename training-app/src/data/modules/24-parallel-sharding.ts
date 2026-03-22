import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 24,
  title: "Parallel Execution & Sharding",
  subtitle: "Scaling test suites with workers, shards, and blob reports",
  icon: "⚡",
  sections: [
    {
      heading: "Why Serial Execution Doesn't Scale",
      content:
        "A test suite with 200 tests averaging 3 seconds each takes 10 minutes running serially. Add 3 browser projects and you're at 30 minutes. With 4 shards, that same suite finishes in ~2.5 minutes per browser. The math is simple: parallelism turns a 30-minute pipeline into a 7-minute one. At enterprise scale, this is the difference between developers waiting for feedback and moving on to the next task.",
      table: {
        headers: ["Configuration", "200 Tests x 3s Each", "With 3 Browsers"],
        rows: [
          ["Serial (1 worker)", "10 min", "30 min"],
          ["4 workers (default)", "~3 min", "~9 min"],
          ["4 workers + 4 shards", "~45 sec per shard", "~2.5 min per shard"],
        ],
      },
    },
    {
      heading: "Built-in Parallelism: Workers",
      content:
        "Playwright runs tests in parallel using worker processes. Each worker gets its own browser instance and runs tests independently. The `workers` config controls how many run simultaneously.",
      code: `// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Number of parallel workers
  // Default: 50% of CPU cores
  workers: process.env.CI ? 4 : undefined,

  // Run ALL tests in parallel (not just across files)
  fullyParallel: true,
});`,
      codeLanguage: "typescript",
      tip: "In CI, set workers explicitly (e.g., 4) rather than relying on CPU detection. CI containers often report more cores than are actually available, leading to resource contention.",
    },
    {
      heading: "Test Isolation for Parallelism",
      content:
        "Parallel execution requires every test to be independent. No shared database records, no sequential dependencies, no global variables. If Test A creates a user and Test B deletes it, they'll fail when running simultaneously.",
      table: {
        headers: ["Violation", "What Happens in Parallel", "Fix"],
        rows: [
          ["Shared login credentials", "Account lockout from simultaneous logins", "Per-test data factories (Module 20)"],
          ["Sequential test order", "Test B depends on Test A's state", "Each test sets up its own preconditions"],
          ["Shared database records", "Race conditions on read/write", "Per-worker data isolation or unique records"],
          ["Global mutable state", "Workers overwrite each other's state", "Use Playwright fixtures for scoped state"],
        ],
      },
      warning: "If your tests fail when you add `fullyParallel: true`, that's a test isolation problem — not a parallelism problem. Fix the tests, don't disable parallelism.",
    },
    {
      heading: "Sharding: Distribute Across CI Jobs",
      content:
        "Sharding splits your test suite across multiple CI jobs. Each shard runs a subset of tests independently. This is the key to sub-minute feedback at scale — instead of one machine running 200 tests, four machines each run 50.",
      code: `# Run shard 1 of 4
npx playwright test --shard=1/4

# Run shard 2 of 4
npx playwright test --shard=2/4

# Playwright distributes tests evenly across shards
# Each shard runs approximately 1/N of the total tests`,
      codeLanguage: "bash",
    },
    {
      heading: "Blob Reports",
      content:
        "When sharding, each shard produces its own test results. The `blob` reporter serializes results into a binary file that can be merged later. This is the key to getting a unified HTML report from a sharded run.",
      code: `// playwright.config.ts — use blob reporter for sharding
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: process.env.CI
    ? [['blob', { outputDir: './blob-report' }]]
    : [['html']],
});`,
      codeLanguage: "typescript",
    },
    {
      heading: "Merging Reports",
      content:
        "After all shards complete, merge the blob reports into a single HTML report. This gives you the complete picture — all tests, all results, unified.",
      code: `# After all shards complete, merge blob reports
npx playwright merge-reports --reporter html ./blob-report

# This produces a unified playwright-report/ directory
# Open it:
npx playwright show-report`,
      codeLanguage: "bash",
    },
    {
      heading: "CI Matrix Strategy",
      content:
        "Use your CI platform's matrix feature to run shards as parallel jobs. Each job runs one shard, and a final job merges the results.",
      code: `# GitHub Actions — sharded Playwright
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        shard: [1/4, 2/4, 3/4, 4/4]
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=\${{ matrix.shard }} --reporter=blob
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: blob-report-\${{ strategy.job-index }}
          path: blob-report/

  merge-reports:
    needs: test
    if: always()
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-report-*
          merge-multiple: true
      - run: npx playwright merge-reports --reporter html ./all-blob-reports
      - uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/`,
      codeLanguage: "yaml",
    },
    {
      heading: "Debugging Shard Failures",
      content:
        "When a test fails in one shard, you need to know which shard, which worker, and ideally have the trace. Use structured artifact naming and trace configuration to make this easy.",
      table: {
        headers: ["Question", "How to Answer"],
        rows: [
          ["Which shard failed?", "Check CI job matrix output — each shard is a separate job"],
          ["Which worker in that shard?", "Trace and report artifacts include worker index"],
          ["What was the actual failure?", "Download the blob report for that shard, or check traces"],
          ["Is it shard-specific?", "Run with --shard=N/M locally to reproduce"],
          ["Is it a parallelism bug?", "Run the failing test solo — if it passes, it's a test isolation issue"],
        ],
      },
    },
    {
      heading: "Cost vs Benefit",
      content:
        "Sharding adds CI infrastructure complexity and cost. Evaluate whether it's worth it for your team.",
      table: {
        headers: ["Suite Size", "Recommendation", "Why"],
        rows: [
          ["< 50 tests", "Workers only, no sharding", "Not worth the merge complexity"],
          ["50-200 tests", "2-4 shards", "Sweet spot for most teams"],
          ["200-500 tests", "4-8 shards", "Significant time savings justify the setup"],
          ["> 500 tests", "8+ shards + tag-based subsetting", "Combine sharding with @smoke/@regression tags"],
        ],
      },
    },
  ],
  quiz: {
    question:
      "What must be true about your tests before enabling fullyParallel: true?",
    options: [
      "All tests must use the same browser project",
      "Every test must be fully independent — no shared state, no sequential dependencies",
      "Tests must be sorted alphabetically by filename",
      "Each test file must contain exactly one test",
    ],
    correctIndex: 1,
    explanation:
      "fullyParallel: true allows Playwright to run tests from different files simultaneously AND run tests within the same file in parallel. This means every test must be completely independent — it can't depend on another test's state, shared database records, or execution order. If tests aren't isolated, they'll flake under parallelism.",
  },
  exercise: {
    title: "Configure 4-Shard Setup with Blob Reports",
    description:
      "Configure a playwright.config.ts for sharded CI execution with blob reporters, and write the merge command.",
    starterCode: `// playwright.config.ts — single runner, no sharding
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['html']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
});

// TODO: 1. Add fullyParallel: true
// TODO: 2. Set workers to 4 for CI
// TODO: 3. Switch reporter to 'blob' when in CI
// TODO: 4. Write the CLI commands to run 4 shards
// TODO: 5. Write the merge command`,
    solutionCode: `// playwright.config.ts — sharded with blob reports
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI
    ? [['blob', { outputDir: './blob-report' }]]
    : [['html']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
});

// CLI commands for 4-shard execution:
// npx playwright test --shard=1/4
// npx playwright test --shard=2/4
// npx playwright test --shard=3/4
// npx playwright test --shard=4/4

// Merge all shard reports into unified HTML:
// npx playwright merge-reports --reporter html ./blob-report`,
    hints: [
      "Set fullyParallel: true to allow maximum parallelism",
      "Use process.env.CI to switch between blob (CI) and html (local) reporters",
      "The blob reporter needs an outputDir — use './blob-report'",
      "merge-reports takes the blob directory as input and --reporter flag for output format",
    ],
  },
  promptTemplates: [
    {
      label: "Generate Sharded Config",
      prompt:
        "Generate a playwright.config.ts configured for {n} shards with blob reporting, fullyParallel execution, and trace capture on first retry. Include the CLI commands to run each shard and merge the results.",
      context: "CARD format: Context — enterprise CI pipeline. Action — configure sharding. Role — DevOps engineer. Deliverable — config + CLI commands.",
    },
    {
      label: "Diagnose Parallel Failure",
      prompt:
        "This test passes in serial but fails in parallel. Diagnose the test isolation issue and fix it. Test code:\n{paste test code}",
      context: "CARD format: Context — test that flakes under parallelism. Action — root cause analysis. Role — QE engineer. Deliverable — isolation fix.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/",
    label: "Practice App",
    description:
      "Run your full test suite with --shard=1/2 and --shard=2/2, then merge the blob reports into a unified HTML report.",
  },
};
