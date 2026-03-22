import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 31,
  title: "Custom Reporters and Notifications",
  subtitle: "Shape test output for humans, pipelines, and trend tracking",
  icon: "📣",
  sections: [
    {
      heading: "Start with the Built-In Reporters",
      content:
        "Playwright already gives you strong built-in reporting options such as HTML, line, dot, JSON, and JUnit. The key is choosing the right combination for the audience. Local debugging usually wants HTML. CI often wants JUnit or JSON. Trend analysis wants structured data that can be stored and compared over time.",
      code: `export default defineConfig({
  reporter: [
    ['html'],
    ['json', { outputFile: 'results.json' }],
    ['junit', { outputFile: 'results.xml' }],
  ],
});`,
      codeLanguage: "typescript",
      tip:
        "Multiple reporters are normal. One reporter rarely satisfies local debugging, CI integration, and long-term reporting by itself.",
    },
    {
      heading: "Where Custom Reporters Help",
      content:
        "Custom reporters are useful when your team needs output tailored to its workflow, such as posting a summary to chat, publishing a compact release note, or storing pass-rate and duration trends. The custom reporter API gives you lifecycle hooks like `onBegin`, `onTestEnd`, and `onEnd` so you can summarize what happened without changing the tests themselves.",
      table: {
        headers: ["Hook", "When It Runs", "Typical Use"],
        rows: [
          ["onBegin", "Before execution starts", "Capture total test count or suite metadata"],
          ["onTestEnd", "After each test finishes", "Accumulate pass/fail data and timing"],
          ["onEnd", "After the whole run completes", "Print a summary or send a webhook payload"],
        ],
      },
    },
    {
      heading: "Shards, Merge Reports, and Trends",
      content:
        "As the suite scales, reporting has to scale too. Sharded jobs often produce blob or JSON artifacts that get merged later into one HTML or trend-friendly report. This is where `merge-reports`, artifact retention, and naming conventions matter. Reporting quality is not just about nicer dashboards. It is about making failures understandable at scale.",
      callout:
        "A good report shortens triage time. It tells people what failed, where to look, and how serious it is without forcing them to reverse-engineer the run.",
    },
    {
      heading: "Notification Design",
      content:
        "A useful Slack or Teams notification includes enough context to triage immediately: pass and fail counts, the failed test names, the branch or pull request, and a link to the detailed report. Keep the message compact and actionable. Chat alerts should point people toward the evidence, not try to replace it.",
      warning:
        "Do not send noisy, low-context notifications. If every failure message looks the same, people stop trusting them.",
    },
  ],
  quiz: {
    question:
      "What should a Slack notification include when tests fail?",
    options: [
      "Only the total test count",
      "Pass/fail counts, failed test names, branch or PR context, and a link to the full report",
      "The complete HTML report pasted into chat",
      "Only the name of the workflow that ran",
    ],
    correctIndex: 1,
    explanation:
      "A useful alert gives enough context to triage quickly and then points to the detailed artifact for deeper debugging.",
  },
  exercise: {
    title: "Build a Summary Reporter",
    description:
      "Implement a custom Playwright reporter that tracks pass and fail counts, logs a summary, and prepares a webhook payload at the end of the run.",
    starterCode: `import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';

export default class SummaryReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    // TODO: store total test count
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // TODO: track pass/fail status
  }

  async onEnd(result: FullResult) {
    // TODO: log a summary and prepare a webhook payload
  }
}`,
    solutionCode: `import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';

export default class SummaryReporter implements Reporter {
  private total = 0;
  private passed = 0;
  private failed: string[] = [];

  onBegin(_config: FullConfig, suite: Suite) {
    this.total = suite.allTests().length;
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'passed') {
      this.passed += 1;
      return;
    }

    if (result.status === 'failed' || result.status === 'timedOut') {
      this.failed.push(test.title);
    }
  }

  async onEnd(result: FullResult) {
    const payload = {
      status: result.status,
      total: this.total,
      passed: this.passed,
      failed: this.failed,
    };

    console.log('Playwright summary:', payload);
    console.log('Webhook payload preview:', JSON.stringify(payload, null, 2));
  }
}`,
    hints: [
      "onBegin is a good place to capture suite-wide totals.",
      "Track failed test titles as you go so the final message is easy to read.",
      "Even if you do not call a real webhook, shape the payload as if another system will consume it.",
    ],
  },
  promptTemplates: [
    {
      label: "Generate a Custom Reporter",
      context: "Create a reporter that summarizes test results for another system.",
      prompt:
        "Generate a custom Playwright reporter that tracks pass and fail counts, captures failed test names, and prepares a webhook payload on completion. Keep the output easy to read in CI logs.",
    },
    {
      label: "Design a Multi-Reporter Setup",
      context: "Choose reporters for local debugging, CI, and trends.",
      prompt:
        "Recommend a Playwright reporter configuration for local debugging, CI integration, and trend tracking. Explain when to use HTML, JSON, JUnit, blob reports, and a custom summary reporter together.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/",
    label: "Run the practice app suite with multiple reporters",
    description:
      "Use the practice app as the target for HTML, JSON, and custom summary reporting workflows.",
  },
};
