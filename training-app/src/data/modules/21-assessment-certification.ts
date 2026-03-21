import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 21,
  title: "Assessment & Certification",
  subtitle: "Competency matrix, capstone structure, and three certification tiers",
  icon: "🎓",
  audience: "All Roles",
  sections: [
    {
      heading: "Why Assessment Matters",
      content:
        "Completing training modules proves exposure, not competency. Assessment bridges that gap — it measures whether learners can APPLY what they learned. In Kirkpatrick's framework, quizzes measure Level 2 (Learning), but capstone exercises measure Level 3 (Behavior). Enterprise clients and certification bodies require evidence of applied skill, not just content consumption.",
      callout: "Without assessment, a team can complete 100% of training modules and still write zero automated tests. Assessment forces the transition from learning to doing.",
    },
    {
      heading: "Competency Matrix",
      content:
        "The competency matrix defines what each certification tier proves. It maps directly to the skills taught in the training modules.",
      table: {
        headers: ["Competency", "Bronze", "Silver", "Gold"],
        rows: [
          ["Core concepts (Modules 1-5)", "Knows what to automate and why", "Can explain trade-offs", "Can coach others"],
          ["Test writing (Modules 6-10)", "Can read/modify generated tests", "Can write tests from scratch", "Can design test architecture"],
          ["Results & review (Modules 11-15)", "Can read reports and traces", "Can diagnose failures", "Can set up CI quality gates"],
          ["Auth & data (Modules 16, 20)", "Understands the concepts", "Can implement auth fixtures", "Can design data strategies"],
          ["Visual & a11y (Modules 17-18)", "Understands the concepts", "Can write visual/a11y tests", "Can set up compliance pipelines"],
          ["Flaky tests (Module 19)", "Knows the taxonomy", "Can diagnose and fix", "Can design quarantine systems"],
          ["Capstone", "Not required", "Pass capstone exercise", "Contribute real tests to a project"],
        ],
      },
    },
    {
      heading: "Three Certification Tiers",
      content:
        "Certification is earned incrementally. Each tier builds on the previous one and requires demonstrating progressively deeper competency.",
      table: {
        headers: ["Tier", "Requirements", "Proves"],
        rows: [
          ["Bronze", "Complete Modules 01-15, pass all quizzes with 80%+", "Foundational knowledge of test automation concepts and Playwright basics"],
          ["Silver", "Bronze + complete Modules 16-21, pass capstone exercise", "Applied competency — can write auth fixtures, a11y scans, handle flaky tests"],
          ["Gold", "Silver + complete Tier 2/3 modules, contribute a real test to a project repo", "Production-ready — can independently automate and maintain tests in a real codebase"],
        ],
      },
      tip: "Most team members should target Silver. Gold is for dedicated QE engineers and automation champions.",
    },
    {
      heading: "Capstone Structure",
      content:
        "The Silver capstone requires writing a mini test suite for ONE practice app feature. The suite must demonstrate auth setup, functional testing, accessibility scanning, and a HITL review checklist. This proves you can combine skills from multiple modules into a cohesive testing strategy.",
      code: `// Capstone test suite structure for the Settings page:

// 1. Auth Setup (Module 16)
//    - Use storageState fixture for authenticated context
//    - No UI login in test code

// 2. Functional Tests (Modules 8-10)
//    - Profile form validation (required fields, save confirmation)
//    - Password change (validation rules, mismatch detection)
//    - Tab navigation (keyboard accessible, correct panel displayed)

// 3. Accessibility Scan (Module 18)
//    - axe-core scan targeting WCAG 2.1 AA
//    - Document any known violations with remediation plan

// 4. HITL Review Checklist (Module 13)
//    - [ ] All data-testid selectors are stable and descriptive
//    - [ ] No waitForTimeout() or arbitrary delays
//    - [ ] Assertions use auto-retrying expect()
//    - [ ] Tests are independent and can run in any order
//    - [ ] Test names describe the expected behavior`,
      codeLanguage: "typescript",
    },
    {
      heading: "Rubric Criteria",
      content:
        "Capstone submissions are evaluated against five criteria, each scored 1-5. A passing score requires 3+ on every criterion and 18+ total.",
      table: {
        headers: ["Criterion", "What Evaluators Look For", "Common Deductions"],
        rows: [
          ["Assertion Quality", "Specific, meaningful assertions that verify real behavior", "Vague assertions (toBeVisible only), no negative cases"],
          ["Selector Strategy", "Consistent use of data-testid, no fragile CSS/XPath", "Mixing selector strategies, using auto-generated selectors"],
          ["Data Independence", "Each test creates/manages its own data, no shared state", "Hardcoded credentials, tests that depend on execution order"],
          ["HITL Compliance", "Follows the human-in-the-loop checklist from Module 13", "Missing review checklist, no documentation of known limitations"],
          ["Coverage Breadth", "Tests cover auth, functional, and a11y aspects of the feature", "Only functional tests, no a11y scan, no edge cases"],
        ],
      },
    },
    {
      heading: "Peer Review Calibration",
      content:
        "Capstone submissions are peer-reviewed to build a culture of code review and knowledge sharing. To ensure fair and consistent evaluation, reviewers calibrate by scoring the same reference submission independently, then discussing discrepancies. This alignment session should happen before any live capstone reviews begin.",
      tip: "Provide a reference capstone submission (both a good and bad example) for calibration. This reduces scoring variance from 40% to under 10%.",
    },
    {
      heading: "Continuous Improvement",
      content:
        "Certification is not a one-time event. As the platform grows (new modules, new practice features), the competency matrix expands. Encourage recertification when major new capabilities are added, and track team-wide metrics to identify skill gaps.",
      table: {
        headers: ["Metric", "What It Measures", "Target"],
        rows: [
          ["Certification rate", "% of team at each tier", "80%+ at Bronze within 30 days"],
          ["Capstone pass rate", "% of Silver attempts that pass", "70%+ (if lower, review module content)"],
          ["Time to Silver", "Days from start to Silver certification", "Under 45 days for full-time learners"],
          ["Knowledge retention", "Quiz score 90 days after certification", "80%+ indicates lasting learning"],
        ],
      },
    },
  ],
  quiz: {
    question: "What distinguishes a Silver-tier certification from Bronze?",
    options: [
      "Silver requires completing more modules and taking a longer quiz",
      "Silver requires completing applied Tier 1 modules AND passing a capstone exercise that demonstrates practical competency",
      "Silver requires contributing code to a production repository",
      "Silver requires a minimum of 6 months of testing experience",
    ],
    correctIndex: 1,
    explanation:
      "Bronze proves knowledge (completing modules, passing quizzes). Silver proves competency (completing advanced modules on auth, a11y, flaky tests, and data management, PLUS passing a hands-on capstone exercise). Gold proves production-readiness (contributing real tests to a project). The key differentiator is the capstone — it requires applying multiple skills together.",
  },
  exercise: {
    title: "Write a Capstone Test Plan",
    description:
      "Given the Settings page as a feature, outline a capstone test suite plan that covers auth setup, functional tests, accessibility scanning, and a HITL review checklist.",
    starterCode: `// Capstone Test Plan: Settings Page
// Feature URL: http://localhost:5173/settings

// 1. Auth Setup
// TODO: Describe how you'll handle authentication

// 2. Functional Tests (list 3-5 test descriptions)
// TODO: Test 1 -
// TODO: Test 2 -
// TODO: Test 3 -

// 3. Accessibility Scan
// TODO: Describe the axe-core configuration

// 4. HITL Review Checklist
// TODO: List 5 review items`,
    solutionCode: `// Capstone Test Plan: Settings Page
// Feature URL: http://localhost:5173/settings

// 1. Auth Setup
// Use storageState fixture from globalSetup
// Load ./auth/editor.json for standard user context
// Separate test for admin-specific Settings behavior (if any)

// 2. Functional Tests
// Test 1: Profile tab — fill name/email/bio, click Save, verify success toast
// Test 2: Security tab — change password with mismatched confirm, verify error
// Test 3: Security tab — change password successfully, verify success toast
// Test 4: Notifications tab — toggle all switches, save, verify preferences persist
// Test 5: Tab navigation — click each tab, verify correct panel renders

// 3. Accessibility Scan
// AxeBuilder with tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
// Scan each tab panel separately (Profile, Security, Notifications)
// Document 3 known intentional violations with remediation notes:
//   - Missing label on bio textarea → add htmlFor + id binding
//   - Low-contrast helper text → increase to 4.5:1 ratio
//   - Incorrect dialog focus → focus dialog container, not cancel button

// 4. HITL Review Checklist
// [x] All interactive elements have data-testid attributes
// [x] No waitForTimeout() — all waits use auto-retrying assertions
// [x] Tests are order-independent (no shared state between tests)
// [x] Assertion messages are descriptive (toHaveText over toContainText where possible)
// [x] Known a11y violations documented with fix recommendations`,
    hints: [
      "Auth setup should use storageState, not UI login — reference Module 16",
      "Functional tests should cover at least one happy path and one validation error per tab",
      "The a11y scan should document the 3 known intentional violations with fixes",
      "The HITL checklist should reference the criteria from Module 13",
    ],
  },
  promptTemplates: [
    {
      label: "Generate Capstone Test Plan",
      prompt:
        "Generate a capstone test plan for the {feature} feature at {url}. Include: auth setup strategy (using storageState), 5 functional test descriptions, axe-core a11y scan configuration, and a HITL review checklist with 5+ items. Format as a structured test plan document.",
      context: "CARD format: Context — certification capstone assessment. Action — generate test plan. Role — Silver-tier candidate. Deliverable — complete capstone plan.",
    },
    {
      label: "Create Grading Rubric",
      prompt:
        "Create a grading rubric for evaluating a Playwright test suite submission. Include 5 criteria (assertion quality, selector strategy, data independence, HITL compliance, coverage breadth) each scored 1-5 with descriptions for each score level.",
      context: "CARD format: Context — certification program evaluation. Action — create rubric. Role — QE program lead. Deliverable — detailed scoring rubric with examples.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/",
    label: "Practice App",
    description: "Use the full practice app as your capstone assessment target — combine auth, functional testing, a11y scanning, and HITL review into one test suite.",
  },
};
