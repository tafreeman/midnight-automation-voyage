import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 12,
  title: "CI/CD & Quick Reference",
  subtitle: "Running tests in pipelines and command cheat sheet",
  icon: "🔧",
  sections: [
    {
      heading: "GitLab CI Pipeline",
      content: "Add this job to your .gitlab-ci.yml to run Playwright tests on every merge request. Tests run in a Docker container with browsers pre-installed.",
      code: `# .gitlab-ci.yml
playwright-tests:
image: mcr.microsoft.com/playwright:v1.42.0-jammy
stage: test
script:
  - npm ci
  - npx playwright test --reporter=junit
artifacts:
  when: always
  paths:
    - test-results/
    - playwright-report/
  reports:
    junit: results.xml
rules:
  - if: $CI_PIPELINE_SOURCE == "merge_request_event"`,
      codeLanguage: "yaml",
    },
    {
      heading: "Command Cheat Sheet",
      content: "The commands you'll use 90% of the time. Print this and tape it next to your monitor.",
      table: {
        headers: ["Command", "What It Does"],
        rows: [
          ["npx playwright test", "Run all tests (headless)"],
          ["npx playwright test --headed", "Run with visible browser"],
          ["npx playwright test --ui", "Open interactive test runner UI"],
          ["npx playwright test login.spec.ts", "Run one specific test file"],
          ["npx playwright test -g 'login'", "Run tests matching 'login' in name"],
          ["npx playwright test --project=chromium", "Run in Chrome only"],
          ["npx playwright codegen localhost:3000", "Launch recorder"],
          ["npx playwright show-report", "Open HTML test report"],
          ["npx playwright show-trace trace.zip", "Open trace viewer"],
          ["npx playwright test --update-snapshots", "Update visual baselines"],
        ]
      },
      tip: "Non-coders: The four commands you'll use most are: codegen (record), test --headed (run visible), show-report (see results), and show-trace (debug failures)."
    },
    {
      heading: "Resources",
      content: "Official references and recommended learning resources.",
      table: {
        headers: ["Resource", "URL", "Best For"],
        rows: [
          ["Playwright Docs", "playwright.dev", "API reference, guides, best practices"],
          ["Playwright Best Practices", "playwright.dev/docs/best-practices", "Official patterns for reliable tests"],
          ["Playwright Videos", "youtube.com/@playwright", "Visual walkthroughs"],
          ["GitHub Copilot Docs", "docs.github.com/copilot", "Copilot Chat features and commands"],
          ["Bondar Academy", "bondaracademy.com", "Structured Playwright learning path"],
          ["PractiTest Transition Guide", "practitest.com", "Manual → automated tester mindset shifts"],
          ["Team Slack", "#team-testing", "Questions, pairing requests"],
        ]
      }
    }
  ],
  practiceLink: {
    url: "http://localhost:5173/",
    label: "Use the practice app as your CI test target",
    description: "Configure a CI pipeline to run your Playwright tests against the full practice application.",
  },
  exercise: {
    title: "Write a CI Pipeline Configuration",
    description: "Complete the GitLab CI configuration below to run Playwright tests with artifact upload on failure and retry on first failure.",
    starterCode: `# .gitlab-ci.yml — complete the TODOs:
playwright-tests:
  image: # TODO: which Docker image?
  stage: test
  script:
    - # TODO: install dependencies
    - # TODO: run tests with retry
  artifacts:
    when: # TODO: when should artifacts upload?
    paths:
      - # TODO: which folders?
  rules:
    - # TODO: when should this job run?`,
    solutionCode: `# .gitlab-ci.yml — complete configuration:
playwright-tests:
  image: mcr.microsoft.com/playwright:v1.42.0-jammy
  stage: test
  script:
    - npm ci
    - npx playwright test --retries=1
  artifacts:
    when: always
    paths:
      - test-results/
      - playwright-report/
    reports:
      junit: results.xml
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == "main"`,
    hints: [
      "Playwright provides official Docker images: mcr.microsoft.com/playwright:v{version}-jammy",
      "Use 'when: always' for artifacts so reports upload even when tests fail — that's when you need them most",
      "Run on merge requests AND main branch pushes for comprehensive coverage",
    ],
  },
  promptTemplates: [
    {
      label: "Generate CI Pipeline Config",
      prompt: `Context: I have a web application tested with Playwright. My CI platform is [GitHub Actions / GitLab CI / Azure DevOps]. The project uses [npm/pnpm/yarn] and the test suite lives in the "tests/" directory. We run tests against a dev server at http://localhost:5173.

Actions:
1. Generate a complete CI pipeline configuration file for my platform.
2. Use the official Playwright Docker image (mcr.microsoft.com/playwright) as the base.
3. Install project dependencies and then run the full Playwright test suite in headless mode.
4. Upload test-results/ and playwright-report/ as build artifacts so failures can be debugged.
5. Include a retry strategy (1 automatic retry for flaky tests, plus job-level retry on infrastructure failure).
6. Add a step to start the dev server in the background before tests run, and wait for it to be ready.

Rules:
- Tests must run on every pull/merge request and on pushes to the main branch.
- Artifacts must upload even when tests fail (when: always / if: always()).
- Use caching for node_modules or the package manager store to speed up subsequent runs.
- Pin the Playwright Docker image version to match the version in my package.json.

Data:
- Node version: 20
- Playwright version: 1.42.0
- Test command: npx playwright test
- Reporter: junit (output to results.xml) and html`,
      context: "Use when setting up Playwright tests in a CI/CD pipeline for the first time or migrating to a new CI platform.",
    },
    {
      label: "Diagnose CI Test Failures",
      prompt: `Context: My Playwright tests pass locally on my development machine but fail in CI. The CI environment uses the official Playwright Docker image (mcr.microsoft.com/playwright:v1.42.0-jammy) running on Linux. My local machine runs [Windows/macOS]. The failures include [timeouts / element not found / visual mismatches / network errors].

Actions:
1. Analyze the key differences between my local environment and the CI Docker container that could cause test failures (OS rendering, fonts, screen resolution, timezone, locale, network access).
2. Review my test code for assumptions that depend on local environment specifics (hardcoded URLs, file paths, timezone-dependent date checks, viewport size).
3. Suggest concrete fixes for each identified issue, with code examples.
4. Recommend Playwright configuration settings (timeouts, retries, viewport, locale) that make tests reliable across both environments.
5. Show how to use Playwright trace files and screenshots from CI artifacts to pinpoint the exact failure point.

Rules:
- Prioritize fixes from most common CI failure causes to least common.
- All suggested fixes must work in both local and CI environments — no CI-only hacks.
- Include actionable playwright.config.ts changes, not just descriptions.

Data:
- CI logs show: [paste relevant error messages]
- Tests affected: [list failing test files or describe the pattern]
- Local OS: [Windows/macOS]
- CI base image: mcr.microsoft.com/playwright:v1.42.0-jammy (Debian)`,
      context: "Use when Playwright tests pass on your local machine but fail in the CI pipeline and you need to identify environment-specific issues.",
    },
  ],
  quiz: {
    question: "When should Playwright tests run in a CI pipeline?",
    options: [
      "Only before major releases",
      "On every pull request and merge to the main branch",
      "Only when QA manually triggers them",
      "Once a month during regression testing",
    ],
    correctIndex: 1,
    explanation: "Running tests on every PR and merge-to-main provides fast feedback, catches regressions early, and prevents broken code from reaching production. This is the foundation of shift-left testing — the earlier you catch bugs, the cheaper they are to fix.",
  },
};
