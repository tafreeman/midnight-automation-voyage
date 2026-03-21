import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 27,
  title: "GitHub Actions CI/CD",
  subtitle: "Workflow YAML, artifact management, sharding matrix, and branch protection",
  icon: "🚀",
  audience: "All Roles",
  sections: [
    {
      heading: "GitHub Actions vs GitLab CI",
      content:
        "If you learned CI in Module 15 with GitLab CI, the concepts transfer directly. The terminology differs but the structure is the same.",
      table: {
        headers: ["Concept", "GitLab CI", "GitHub Actions"],
        rows: [
          ["Config file", ".gitlab-ci.yml", ".github/workflows/*.yml"],
          ["Pipeline / run", "Pipeline", "Workflow"],
          ["Group of steps", "Stage / Job", "Job"],
          ["Single command", "Script entry", "Step (run:)"],
          ["Docker image", "image:", "container: or runs-on:"],
          ["Conditional execution", "rules:", "if:"],
          ["Artifacts", "artifacts:", "actions/upload-artifact"],
          ["Variables", "variables:", "env: or secrets"],
          ["Parallel matrix", "parallel:matrix:", "strategy.matrix"],
        ],
      },
    },
    {
      heading: "Playwright Docker Image",
      content:
        "Playwright provides official Docker images with browsers pre-installed. Using these in CI ensures consistent browser versions and eliminates the 'works on my machine' problem.",
      code: `# Playwright Docker images include:
# - All three browser engines (Chromium, Firefox, WebKit)
# - System dependencies (fonts, graphics libraries)
# - Node.js runtime

# Latest image tag format:
# mcr.microsoft.com/playwright:v{version}-jammy

# Example:
# mcr.microsoft.com/playwright:v1.42.0-jammy`,
      codeLanguage: "bash",
      tip: "Pin the Playwright Docker image version to match your package.json Playwright version. Mismatches cause 'browser not found' errors.",
    },
    {
      heading: "Workflow YAML Structure",
      content:
        "A GitHub Actions workflow file defines when to run (triggers), what to run on (runner), and what to do (steps). Here's the anatomy of a Playwright workflow.",
      code: `# .github/workflows/playwright.yml
name: Playwright Tests

# When to trigger
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    # What to run on
    runs-on: ubuntu-latest

    steps:
      # 1. Get the code
      - uses: actions/checkout@v4

      # 2. Set up Node.js
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      # 3. Install dependencies
      - run: pnpm install

      # 4. Install Playwright browsers + system deps
      - run: npx playwright install --with-deps

      # 5. Run tests
      - run: npx playwright test

      # 6. Upload results (ALWAYS — even on failure)
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: |
            playwright-report/
            test-results/
          retention-days: 7`,
      codeLanguage: "yaml",
    },
    {
      heading: "Installing Playwright Browsers",
      content:
        "In CI, browsers aren't pre-installed unless you use the Playwright Docker image. The `--with-deps` flag installs both browser binaries and their system-level dependencies (fonts, graphics libraries).",
      code: `# Install ALL browsers + system dependencies
npx playwright install --with-deps

# Install only Chromium (faster if you only need one browser)
npx playwright install --with-deps chromium

# If using Playwright Docker image, browsers are pre-installed
# Just need: npx playwright install (for version sync)`,
      codeLanguage: "bash",
    },
    {
      heading: "Artifact Upload with if: always()",
      content:
        "The `if: always()` condition is critical. Without it, the artifact upload step is skipped when tests fail — which is exactly when you need the HTML report, traces, and screenshots for debugging.",
      code: `# WRONG — artifacts lost on test failure
- run: npx playwright test
- uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: playwright-report/

# CORRECT — artifacts uploaded even when tests fail
- run: npx playwright test
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: test-results
    path: |
      playwright-report/
      test-results/
    retention-days: 7`,
      codeLanguage: "yaml",
      warning: "This is the #1 GitHub Actions mistake with Playwright. Without `if: always()`, you lose debugging artifacts when they matter most — on failures.",
    },
    {
      heading: "Retries and Trace Collection",
      content:
        "Configure retries and trace capture together for optimal CI debugging. On-first-retry trace capture gives you diagnostic data without the storage cost of tracing every run.",
      code: `# In your workflow step:
- run: npx playwright test --retries=2 --trace on-first-retry

# Or configure in playwright.config.ts:
# retries: process.env.CI ? 2 : 0,
# use: { trace: 'on-first-retry' }`,
      codeLanguage: "yaml",
    },
    {
      heading: "Sharding with Matrix Strategy",
      content:
        "GitHub Actions' matrix strategy runs multiple copies of a job in parallel — perfect for Playwright sharding. Each matrix entry runs one shard, and a final job merges the results.",
      code: `name: Playwright Sharded
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1/4, 2/4, 3/4, 4/4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=\${{ matrix.shard }} --reporter=blob
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: blob-report-\${{ strategy.job-index }}
          path: blob-report/
          retention-days: 1

  merge-reports:
    if: always()
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
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
          path: playwright-report/
          retention-days: 7`,
      codeLanguage: "yaml",
      tip: "Set `fail-fast: false` in the matrix strategy. Otherwise, if one shard fails, GitHub cancels the others — losing their results and preventing the merge step.",
    },
    {
      heading: "Branch Protection Rules",
      content:
        "Connect your Playwright workflow to GitHub branch protection so tests must pass before code can merge. This is the enforcement mechanism for your quality gates.",
      table: {
        headers: ["Setting", "Where to Configure", "Effect"],
        rows: [
          ["Require status checks", "Repo → Settings → Branches → Rules", "Playwright job must pass to merge"],
          ["Require branches to be up to date", "Same location", "PR must be rebased on latest main"],
          ["Required checks", "Select your workflow job name", "Specific jobs that must pass"],
          ["Dismiss stale reviews", "Same location", "Re-run tests after new commits"],
        ],
      },
    },
    {
      heading: "Caching for Speed",
      content:
        "Cache node_modules and Playwright browser binaries to speed up CI runs. Browser binaries are ~500 MB per engine — caching them saves 1-2 minutes per run.",
      code: `# Cache pnpm store
- uses: actions/cache@v4
  with:
    path: ~/.pnpm-store
    key: pnpm-\${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: pnpm-

# Cache Playwright browsers
- uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-\${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: playwright-`,
      codeLanguage: "yaml",
    },
    {
      heading: "Comparing to GitLab CI (Module 15)",
      content:
        "If your team uses both platforms, here's how the Playwright configurations map between them.",
      table: {
        headers: ["Feature", "GitLab CI", "GitHub Actions"],
        rows: [
          ["Playwright image", "image: mcr.microsoft.com/playwright:...", "container: or npx playwright install --with-deps"],
          ["Artifacts", "artifacts: paths: [...]", "actions/upload-artifact with path:"],
          ["Always upload", "when: always", "if: always()"],
          ["Test sharding", "parallel: 4 + shard variables", "strategy.matrix.shard: [1/4, ...]"],
          ["Report merge", "manual merge job", "merge-reports job with download-artifact"],
          ["Branch protection", "Protected branches → Pipeline must pass", "Branch rules → Required status checks"],
        ],
      },
    },
  ],
  quiz: {
    question:
      "Why should you use if: always() on the artifact upload step?",
    options: [
      "It makes the upload faster by skipping compression",
      "Without it, the upload step is skipped when tests fail — exactly when you need artifacts for debugging",
      "It ensures artifacts are uploaded before tests start running",
      "It prevents GitHub from deleting artifacts after 24 hours",
    ],
    correctIndex: 1,
    explanation:
      "By default, GitHub Actions skips subsequent steps when a previous step fails. Since you run tests BEFORE uploading artifacts, a test failure skips the upload — losing your HTML report, traces, and screenshots. `if: always()` ensures the upload runs regardless of test outcomes, giving you debugging data when you need it most.",
  },
  exercise: {
    title: "Write a Complete GitHub Actions Workflow",
    description:
      "Write a GitHub Actions workflow that installs dependencies, runs Playwright tests with retries and traces, and uploads artifacts on failure. Include a sharded matrix strategy.",
    starterCode: `# .github/workflows/playwright.yml
name: Playwright Tests

# TODO: Add triggers for push to main and pull requests

jobs:
  test:
    # TODO: Configure runner
    # TODO: Add shard matrix strategy (4 shards)
    steps:
      # TODO: Checkout code
      # TODO: Setup Node.js 20
      # TODO: Install pnpm dependencies
      # TODO: Install Playwright browsers with system deps
      # TODO: Run tests with shard flag and blob reporter
      # TODO: Upload blob report artifacts (always)

  # TODO: Add merge-reports job that:
  #   - depends on test job
  #   - downloads all blob reports
  #   - merges them into HTML
  #   - uploads the final report`,
    solutionCode: `# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1/4, 2/4, 3/4, 4/4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=\${{ matrix.shard }} --reporter=blob --retries=2 --trace on-first-retry
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: blob-report-\${{ strategy.job-index }}
          path: blob-report/
          retention-days: 1

  merge-reports:
    if: always()
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
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
          path: playwright-report/
          retention-days: 7`,
    hints: [
      "Use on: push/pull_request with branches: [main] for triggers",
      "Set fail-fast: false so one shard failure doesn't cancel others",
      "Include --retries=2 --trace on-first-retry in the test run command",
      "The merge-reports job needs `needs: test` and `if: always()` to run after test completion",
    ],
  },
  promptTemplates: [
    {
      label: "Generate GitHub Actions Workflow",
      prompt:
        "Generate a complete GitHub Actions workflow for Playwright with: artifact upload (if: always()), sharding with {n} shards, blob report merging, retry and trace configuration. Target: pnpm project at {url}.",
      context: "CARD format: Context — new GitHub repo. Action — create CI workflow. Role — DevOps engineer. Deliverable — complete workflow YAML.",
    },
    {
      label: "Convert GitLab CI to GitHub Actions",
      prompt:
        "Convert this GitLab CI pipeline to a GitHub Actions workflow. Map: image → runs-on/container, script → run, artifacts → upload-artifact, rules → if conditions, parallel → matrix strategy.\n\nGitLab CI:\n{paste .gitlab-ci.yml}",
      context: "CARD format: Context — migration from GitLab to GitHub. Action — convert pipeline. Role — DevOps engineer. Deliverable — equivalent workflow YAML.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/",
    label: "Practice App",
    description:
      "Configure GitHub Actions to run your full test suite with artifacts — create the workflow YAML and push it to see CI in action.",
  },
};
