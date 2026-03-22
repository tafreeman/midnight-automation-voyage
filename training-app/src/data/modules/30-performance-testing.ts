import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 30,
  title: "Performance Baseline Testing",
  subtitle: "Measure Web Vitals, set budgets, and track drift before users feel it",
  icon: "⚡",
  sections: [
    {
      heading: "Start with Web Vitals",
      content:
        "Performance work is easier to sustain when it starts with a small baseline. Core Web Vitals such as LCP, CLS, and INP give you shared language for page load and interaction quality. You do not need a full performance program on day one, but you do need a repeatable way to see drift before it becomes a customer complaint.",
      table: {
        headers: ["Metric", "What It Signals", "Typical Team Use"],
        rows: [
          ["LCP", "How quickly the main content becomes visible", "Load budget for key landing and dashboard pages"],
          ["CLS", "How much the layout shifts unexpectedly", "Stability checks for content and images"],
          ["INP", "How responsive the UI feels to user input", "Interaction quality for forms and controls"],
        ],
      },
    },
    {
      heading: "Measure in Playwright",
      content:
        "Playwright can pull timing data directly from the browser with `page.evaluate()` and the Performance API. That makes it useful for establishing simple baselines on pages you already test. It is especially good for trend checks and regression alerts where you want performance evidence close to the same flows your functional suite already covers.",
      code: `test('dashboard stays within baseline budget', async ({ page }) => {
  await page.goto('/dashboard');

  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd,
      loadEventEnd: navigation.loadEventEnd,
    };
  });

  expect(metrics.domContentLoaded).toBeLessThan(2500);
});`,
      codeLanguage: "typescript",
      tip:
        "Keep performance assertions in their own project or job so they run under controlled conditions and do not compete with broad parallel functional runs.",
    },
    {
      heading: "Budgets and Controlled Conditions",
      content:
        "A performance budget turns 'this feels slower' into a concrete quality gate. Budgets only help when the test conditions are stable, so isolate them from noisy parallel jobs, define the network profile you care about, and compare against a baseline that is intentionally maintained.",
      callout:
        "Separate performance checks from functional checks. They answer different questions and need different levels of environmental control.",
    },
    {
      heading: "Know When to Escalate",
      content:
        "Playwright is excellent for lightweight baselines on critical pages, but it is not the only tool in the toolbox. When you need deep audits, lab scoring, or large-scale load traffic, pair these tests with Lighthouse, WebPageTest, k6, or your observability stack. The goal is not to force one tool to do everything. The goal is to make regressions visible early.",
      warning:
        "If a performance test shares CPU, network, or mocks with functional suites, the numbers become hard to trust. Isolation matters as much as the assertion itself.",
    },
  ],
  quiz: {
    question:
      "Why should performance tests run in a separate Playwright project from functional tests?",
    options: [
      "Because functional tests cannot use the Performance API",
      "Because performance checks need more consistent conditions and often different network settings",
      "Because Playwright does not support performance assertions in CI",
      "Because Web Vitals only work in headed browsers",
    ],
    correctIndex: 1,
    explanation:
      "Performance checks are only meaningful when the environment is controlled. Parallel functional runs, shared mocks, and mixed network settings can distort the numbers and hide real regressions.",
  },
  exercise: {
    title: "Measure a Dashboard Baseline",
    description:
      "Collect simple browser timing data for the Dashboard page and assert that LCP and CLS stay within an agreed baseline.",
    starterCode: `import { test, expect } from '@playwright/test';

test('dashboard meets baseline', async ({ page }) => {
  await page.goto('/dashboard');

  // TODO:
  // 1. Collect Web Vitals or navigation timing via page.evaluate()
  // 2. Assert LCP stays below 2500ms
  // 3. Assert CLS stays below 0.1
});`,
    solutionCode: `import { test, expect } from '@playwright/test';

test('dashboard meets baseline', async ({ page }) => {
  await page.goto('/dashboard');

  const metrics = await page.evaluate(() => {
    return new Promise<{ lcp: number; cls: number }>((resolve) => {
      let lcp = 0;
      let cls = 0;

      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        lcp = lastEntry.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as LayoutShift[]) {
          if (!entry.hadRecentInput) cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });

      requestAnimationFrame(() => resolve({ lcp, cls }));
    });
  });

  expect(metrics.lcp).toBeLessThan(2500);
  expect(metrics.cls).toBeLessThan(0.1);
});`,
    hints: [
      "Use page.evaluate() to read metrics from the browser context.",
      "Separate the measurement step from the budget assertions.",
      "A baseline is most useful when it runs under clearly defined conditions.",
    ],
  },
  promptTemplates: [
    {
      label: "Generate a Web Vitals Test",
      context: "Create a Playwright performance check with explicit budgets.",
      prompt:
        "Generate a Playwright performance test for [PAGE]. Measure Core Web Vitals or navigation timing, define clear budgets, and explain what environment assumptions are required for the results to be meaningful.",
    },
    {
      label: "Draft a Baseline Report",
      context: "Summarize current metrics against target thresholds.",
      prompt:
        "Create a short performance baseline report for [PAGE] comparing current metrics against target thresholds. Include the metric, the target budget, the observed value, and the next action if the budget is missed.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/dashboard",
    label: "Profile the Dashboard page",
    description:
      "Use the Dashboard as a baseline candidate for Web Vitals and navigation timing checks.",
  },
};
