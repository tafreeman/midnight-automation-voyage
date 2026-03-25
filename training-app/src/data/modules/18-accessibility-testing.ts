import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 18,
  title: "Accessibility Testing with axe-core",
  subtitle: "Automated WCAG compliance scanning for enterprise applications",
  icon: "♿",
  sections: [
    {
      heading: "Why Accessibility Matters",
      content:
        "Accessibility isn't optional — it's a legal requirement (ADA, Section 508, EAA), a user experience imperative, and a brand differentiator. Over 1 billion people worldwide live with some form of disability. Building accessible software means reaching more users, avoiding lawsuits, and demonstrating corporate responsibility. Enterprise clients increasingly require WCAG 2.1 AA compliance as a procurement condition.",
      callout: "In the US alone, digital accessibility lawsuits exceeded 4,000 in 2023. Automated testing catches the low-hanging fruit before legal teams find it.",
    },
    {
      heading: "What Automation Can (and Cannot) Prove",
      content:
        "The axe-core engine can automatically detect approximately 57% of WCAG violations — things like missing labels, insufficient contrast, missing alt text, and incorrect ARIA roles. The remaining 43% requires manual review: is the alt text actually descriptive? Does the tab order make logical sense? Is the content understandable?",
      table: {
        headers: ["Auto-Detectable", "Requires Manual Review"],
        rows: [
          ["Missing form labels", "Alt text quality/accuracy"],
          ["Color contrast ratios", "Logical tab order"],
          ["Missing ARIA attributes", "Content readability"],
          ["Duplicate IDs", "Meaningful link text"],
          ["Missing document language", "Consistent navigation"],
          ["Image without alt text", "Error identification clarity"],
        ],
      },
      tip: "Automated scans are a floor, not a ceiling. They catch what machines can detect, but human review is essential for complete WCAG compliance.",
    },
    {
      heading: "Setting Up @axe-core/playwright",
      content:
        "Playwright integrates with axe-core through the `@axe-core/playwright` package. Install it alongside Playwright and use the `AxeBuilder` class to run scans within your tests.",
      code: `// Install the package
// pnpm add -D @axe-core/playwright

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no a11y violations', async ({ page }) => {
  await page.goto('/dashboard');

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});`,
      codeLanguage: "typescript",
    },
    {
      heading: "AxeBuilder Configuration and WCAG Targeting",
      content:
        "You can target specific WCAG conformance levels, include/exclude page regions, and disable specific rules. This lets you focus on the violations that matter most for your compliance requirements.",
      code: `import AxeBuilder from '@axe-core/playwright';

test('settings page meets WCAG 2.1 AA', async ({ page }) => {
  await page.goto('/settings');

  const results = await new AxeBuilder({ page })
    // Target WCAG 2.0 A + AA and 2.1 A + AA
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    // Exclude known third-party widgets
    .exclude('.third-party-chat-widget')
    // Scan only the main content area
    .include('#main-content')
    .analyze();

  // Log violations for debugging
  for (const v of results.violations) {
    console.log(\`[\${v.impact}] \${v.id}: \${v.description}\`);
    for (const node of v.nodes) {
      console.log(\`  → \${node.html}\`);
    }
  }

  expect(results.violations).toEqual([]);
});`,
      codeLanguage: "typescript",
    },
    {
      heading: "Understanding Violation Output",
      content:
        "Each axe-core violation includes structured data that tells you exactly what's wrong, how severe it is, and which DOM elements are affected. Understanding this output is critical for prioritizing fixes.",
      table: {
        headers: ["Field", "What It Tells You"],
        rows: [
          ["id", "Rule identifier (e.g., 'color-contrast', 'label')"],
          ["impact", "Severity: critical, serious, moderate, minor"],
          ["description", "Human-readable explanation of the rule"],
          ["help", "Short fix suggestion"],
          ["helpUrl", "Link to Deque's detailed documentation"],
          ["nodes[]", "Array of affected DOM elements"],
          ["nodes[].html", "The actual HTML that violated the rule"],
          ["nodes[].failureSummary", "Specific fix instructions for this element"],
        ],
      },
      tip: "Always log violations in your test output. When a scan fails, the violation details tell you exactly where to look and what to fix.",
    },
    {
      heading: "Keyboard and Focus Testing Beyond axe",
      content:
        "axe-core detects structural issues, but keyboard navigation requires behavioral testing. Can users Tab through all interactive elements? Does focus move logically? Do modals trap focus correctly? These tests complement axe scans.",
      code: `test('settings tabs are keyboard navigable', async ({ page }) => {
  await page.goto('/settings');

  // Tab to the first tab button
  await page.keyboard.press('Tab');

  // Check that Profile tab has focus
  const profileTab = page.getByTestId('settings-profile-tab');
  await expect(profileTab).toBeFocused();

  // Tab to next tab
  await page.keyboard.press('Tab');
  const securityTab = page.getByTestId('settings-security-tab');
  await expect(securityTab).toBeFocused();
});`,
      codeLanguage: "typescript",
    },
    {
      heading: "CI Quality Gate Pattern",
      content:
        "Integrate accessibility scans as a CI quality gate that blocks merges when violations are found. Start by allowing existing violations (baseline) and only blocking on NEW violations. Over time, ratchet down the baseline to zero.",
      code: `test('no new accessibility violations', async ({ page }) => {
  await page.goto('/settings');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  // Filter to critical and serious only for CI gate
  const blockers = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious'
  );

  expect(blockers).toEqual([]);
});`,
      codeLanguage: "typescript",
      warning: "Don't disable axe rules to make tests pass. Fix the violations or document exceptions with a timeline for remediation.",
    },
    {
      heading: "Common Violations and Fixes",
      content:
        "These are the violations you'll encounter most frequently. Each has a straightforward fix.",
      table: {
        headers: ["Violation", "Impact", "Fix"],
        rows: [
          ["color-contrast", "Serious", "Increase text/background contrast to 4.5:1 (AA) or 7:1 (AAA)"],
          ["label", "Critical", "Add <label> with for/htmlFor pointing to the input's id"],
          ["image-alt", "Critical", "Add descriptive alt text or alt='' for decorative images"],
          ["button-name", "Critical", "Add visible text or aria-label to buttons"],
          ["link-name", "Serious", "Ensure links have descriptive text, not 'click here'"],
          ["focus-order-semantics", "Moderate", "Ensure focus moves in a logical, predictable order"],
        ],
      },
    },
  ],
  quiz: {
    question: "What can axe-core NOT detect?",
    options: [
      "Missing alt attributes on images",
      "Color contrast ratio failures",
      "Whether alt text is actually meaningful and descriptive",
      "Missing form labels on input elements",
    ],
    correctIndex: 2,
    explanation:
      "axe-core can detect whether an alt attribute EXISTS, but it cannot judge whether the text is actually meaningful. An image with alt='image123.jpg' technically passes the automated check but fails the spirit of WCAG. Human review is required to assess content quality.",
  },
  exercises: [{
    title: "Accessibility Scan for Settings Page",
    description:
      "Write an axe-core scan for the Settings page that targets WCAG 2.1 AA and asserts zero critical violations. The Settings page has 3 intentional violations for you to discover.",
    starterCode: `import { test, expect } from '@playwright/test';
// TODO: Import AxeBuilder from '@axe-core/playwright'

test('settings page accessibility scan', async ({ page }) => {
  await page.goto('/settings');

  // TODO: Create an AxeBuilder instance
  // TODO: Target WCAG 2.0 A, 2.0 AA, 2.1 A, 2.1 AA tags
  // TODO: Run the analysis
  // TODO: Log any violations found
  // TODO: Assert zero violations
});`,
    solutionCode: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('settings page accessibility scan', async ({ page }) => {
  await page.goto('/settings');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  // Log violations for debugging
  for (const violation of results.violations) {
    console.log(
      \`[\${violation.impact}] \${violation.id}: \${violation.description}\`
    );
    for (const node of violation.nodes) {
      console.log(\`  → \${node.html}\`);
    }
  }

  expect(results.violations).toEqual([]);
});`,
    hints: [
      "Install @axe-core/playwright: pnpm add -D @axe-core/playwright",
      "Use .withTags() to target specific WCAG levels — pass an array of tag strings",
      "The Settings page has 3 intentional violations: missing label, low contrast, incorrect focus",
    ],
  }],
  promptTemplates: [
    {
      label: "Generate A11y Scan",
      prompt:
        "Generate a Playwright accessibility test using @axe-core/playwright for {page} that targets WCAG 2.1 AA conformance. Include violation logging, critical/serious filtering, and clear assertion messages.",
      context: "CARD format: Context — enterprise app needing WCAG compliance. Action — generate a11y test. Role — QE engineer. Deliverable — complete spec with AxeBuilder configuration.",
    },
    {
      label: "Diagnose and Fix Violations",
      prompt:
        "Given these axe-core violations, diagnose the root cause and write Playwright regression tests that verify each fix. Violations: {paste violation output here}",
      context: "CARD format: Context — failing a11y scan results. Action — diagnose and write regression tests. Role — accessibility specialist. Deliverable — fix recommendations + test code.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/settings",
    label: "Settings Page",
    description: "Scan the Settings page to find the 3 intentional WCAG violations: missing label, low contrast, incorrect focus.",
  },
};
