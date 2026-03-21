import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 12,
  title: "CI/CD & Quick Reference",
  subtitle: "Running tests in pipelines and command cheat sheet",
  icon: "🔧",
  audience: "All Roles",
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
