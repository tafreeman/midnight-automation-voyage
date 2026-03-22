import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 21,
  title: "Assessment & Certification",
  subtitle: "Competency matrix, capstone structure, and three certification tiers",
  icon: "🎓",
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
  exercises: [
    {
      difficulty: 'beginner',
      title: "Write a Capstone Test Plan",
      description:
        "Given the Settings page as a feature, outline a capstone test suite plan that covers auth setup, functional tests, accessibility scanning, and a HITL review checklist.",
      narration:
        "Start with auth setup because every other section depends on being in an authenticated state — you'll reference the `storageState` fixture from Module 16 here rather than writing UI login steps in each test. From there, list your functional tests tab by tab: the Profile tab needs at least a happy-path save and a validation error, and the Security tab needs both the password-mismatch case and a successful change. For the axe-core section, note that you'll scan each tab panel separately because axe only sees what's currently rendered — scanning once on load would miss hidden panels. Close out the HITL checklist by working through Module 13's criteria one by one, and make sure you call out the three known intentional a11y violations by name so a reviewer knows they're documented rather than overlooked.",
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
    {
      difficulty: 'intermediate',
      title: 'E2E Checkout Happy Path',
      description: 'Write an end-to-end test that completes the full checkout flow: login → shipping → payment → review → confirmation. Assert the order number appears on the confirmation page.',
      narration:
        "This is a multi-step flow, so your strategy is to confirm each step loaded before filling the next one — that way a failure tells you exactly which stage broke. After clicking the shipping Next button, assert that `card-input` is visible before touching payment fields; this confirms the navigation completed rather than assuming it did. On the payment step, note that `state-select` uses `selectOption('IL')` rather than `fill()` because it's a `<select>` element — using the wrong method here will silently do nothing. When you reach the review page, assert `order-summary` is visible to confirm the page rendered before you click `place-order-button`, and then assert both `confirmation-message` and `confirmation-number` at the end because the rubric checks for meaningful assertions, not just `toBeVisible()` on a container.",
      starterCode: `import { test, expect } from '@playwright/test';

test('complete checkout flow', async ({ page }) => {
  // Step 1: Log in
  await page.goto('/login');
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();
  await page.waitForURL('/dashboard');

  // Step 2: Navigate to checkout
  await page.goto('/checkout/shipping');

  // TODO: Fill shipping form (address, city, state, zip) and click Next
  // TODO: Assert payment page loads (step indicator or card input visible)

  // TODO: Fill payment form (card, expiry, cvv) and click Next
  // TODO: Assert review page loads (order summary visible)

  // TODO: Click "Place Order"
  // TODO: Assert confirmation page shows order number
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('complete checkout flow', async ({ page }) => {
  // Step 1: Log in
  await page.goto('/login');
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();
  await page.waitForURL('/dashboard');

  // Step 2: Shipping
  await page.goto('/checkout/shipping');
  await page.getByTestId('address-input').fill('123 Test Street');
  await page.getByTestId('city-input').fill('Testville');
  await page.getByTestId('state-select').selectOption('IL');
  await page.getByTestId('zip-input').fill('62701');
  await page.getByTestId('next-button').click();

  // Step 3: Payment
  await expect(page.getByTestId('card-input')).toBeVisible();
  await page.getByTestId('card-input').fill('4000000000000000');
  await page.getByTestId('expiry-input').fill('12/28');
  await page.getByTestId('cvv-input').fill('123');
  await page.getByTestId('next-button').click();

  // Step 4: Review and place order
  await expect(page.getByTestId('order-summary')).toBeVisible();
  await page.getByTestId('place-order-button').click();

  // Step 5: Confirmation
  await expect(page.getByTestId('confirmation-message')).toBeVisible();
  await expect(page.getByTestId('confirmation-number')).toBeVisible();
});`,
      hints: [
        'Fill shipping fields: address-input, city-input, state-select (use selectOption), zip-input',
        'After each Next click, assert the next step loaded before filling more fields',
        'Use getByTestId(\'place-order-button\') on the review page to submit',
        'The confirmation page shows confirmation-message and confirmation-number',
      ],
    },
    {
      difficulty: 'advanced',
      title: 'Checkout Validation and Edge Cases',
      description: 'Write tests that verify form validation across the checkout flow. Test empty fields, invalid formats, and navigation between steps.',
      narration:
        "You'll structure these as three separate focused tests inside a `describe` block, with `beforeEach` handling login so none of the tests repeat that boilerplate. For the empty-field test, navigate straight to `/checkout/shipping` and click `next-button` without filling anything — then assert each error testid individually (`address-error`, `city-error`, `zip-error`) rather than just checking that one appeared, because the rubric rewards coverage breadth. For the card-format test, you need to get through the shipping step first with valid data so you reach the payment page legitimately, then enter a short card number like `'123'` and assert `card-error` is visible. For the back-navigation test, complete both steps with valid data, assert `order-summary` is visible on the review page to confirm you're there, then click `back-button` and assert `card-input` reappears — that confirms the navigation worked without needing to check whether data was preserved.",
      starterCode: `import { test, expect } from '@playwright/test';

test.describe('Checkout Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Log in first
    await page.goto('/login');
    await page.getByTestId('email-input').fill('user@test.com');
    await page.getByTestId('password-input').fill('Password123!');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');
  });

  test('shipping form rejects empty fields', async ({ page }) => {
    await page.goto('/checkout/shipping');
    // TODO: Click Next without filling any fields
    // TODO: Assert error messages appear for address, city, state, zip
  });

  test('payment form validates card format', async ({ page }) => {
    // TODO: Navigate through shipping with valid data
    // TODO: On payment, enter an invalid card number (too short)
    // TODO: Click Next
    // TODO: Assert card error message appears
  });

  test('can navigate back from review to payment', async ({ page }) => {
    // TODO: Complete shipping and payment with valid data
    // TODO: On review page, click Back
    // TODO: Assert payment form still has the previously entered data
    // TODO: Or assert you're back on the payment step
  });
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test.describe('Checkout Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('user@test.com');
    await page.getByTestId('password-input').fill('Password123!');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');
  });

  test('shipping form rejects empty fields', async ({ page }) => {
    await page.goto('/checkout/shipping');
    await page.getByTestId('next-button').click();
    await expect(page.getByTestId('address-error')).toBeVisible();
    await expect(page.getByTestId('city-error')).toBeVisible();
    await expect(page.getByTestId('zip-error')).toBeVisible();
  });

  test('payment form validates card format', async ({ page }) => {
    await page.goto('/checkout/shipping');
    await page.getByTestId('address-input').fill('123 Test St');
    await page.getByTestId('city-input').fill('Testville');
    await page.getByTestId('state-select').selectOption('IL');
    await page.getByTestId('zip-input').fill('62701');
    await page.getByTestId('next-button').click();

    await expect(page.getByTestId('card-input')).toBeVisible();
    await page.getByTestId('card-input').fill('123');
    await page.getByTestId('expiry-input').fill('12/28');
    await page.getByTestId('cvv-input').fill('123');
    await page.getByTestId('next-button').click();
    await expect(page.getByTestId('card-error')).toBeVisible();
  });

  test('can navigate back from review to payment', async ({ page }) => {
    await page.goto('/checkout/shipping');
    await page.getByTestId('address-input').fill('123 Test St');
    await page.getByTestId('city-input').fill('Testville');
    await page.getByTestId('state-select').selectOption('IL');
    await page.getByTestId('zip-input').fill('62701');
    await page.getByTestId('next-button').click();

    await page.getByTestId('card-input').fill('4000000000000000');
    await page.getByTestId('expiry-input').fill('12/28');
    await page.getByTestId('cvv-input').fill('123');
    await page.getByTestId('next-button').click();

    await expect(page.getByTestId('order-summary')).toBeVisible();
    await page.getByTestId('back-button').click();
    await expect(page.getByTestId('card-input')).toBeVisible();
  });
});`,
      hints: [
        'Use test.beforeEach to handle login so each test starts authenticated',
        'Click Next without filling fields to trigger validation errors',
        'Error testids follow the pattern: {field}-error (e.g., address-error, card-error)',
        'The review page has a back-button that navigates to payment',
      ],
    },
  ],
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
