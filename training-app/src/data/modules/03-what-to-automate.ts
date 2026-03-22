import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 101,
  title: "What to Automate (and What Not To)",
  subtitle: "Not every test deserves a script — here's how to decide",
  icon: "🎯",
  sections: [
    {
      heading: "The Automation Decision Framework",
      content: "One of the most common mistakes new automation teams make is trying to automate everything. Industry leaders typically achieve 60–80% automation coverage for regression testing, and that's considered excellent. The remaining 20–40% consists of tests where manual execution is more practical, cost-effective, or genuinely necessary. Your goal isn't 100% automation — it's automating the RIGHT things.",
    },
    {
      heading: "Automate These (High Value)",
      content: "These test types deliver the highest return on automation investment. They run often, they're repetitive, and they catch regression bugs early.",
      table: {
        headers: ["Test Type", "Why Automate", "Example"],
        rows: [
          ["Regression tests", "Run every sprint — too many for manual execution", "Login flow, core navigation, CRUD operations"],
          ["Smoke tests", "Must pass before any other testing starts", "Homepage loads, API responds, auth works"],
          ["Data-driven tests", "Same flow with hundreds of input variations", "Form validation with valid/invalid email formats"],
          ["Cross-browser checks", "Impractical to test 3+ browsers manually every time", "Layout renders correctly in Chrome, Firefox, Safari"],
          ["Happy path flows", "Critical business paths that must never break", "User signup → first order → confirmation"],
        ]
      }
    },
    {
      heading: "Keep These Manual (Low Automation Value)",
      content: "These tests require human judgment, are run rarely, or cost more to automate and maintain than they save.",
      table: {
        headers: ["Test Type", "Why Keep Manual", "Example"],
        rows: [
          ["Exploratory testing", "Requires curiosity, intuition, and creative deviation from scripts", "Trying unexpected inputs to see what breaks"],
          ["Usability / UX testing", "Automation can't judge if a flow 'feels confusing'", "Is the checkout flow intuitive for first-time users?"],
          ["One-time tests", "Automating a test you'll run once wastes time", "Verifying a data migration completed correctly"],
          ["Visual design review", "Automation can't assess aesthetic quality", "Does the new design match the mockups?"],
          ["Edge cases in unstable features", "Features still changing → tests break every sprint", "A feature in active development that changes weekly"],
        ]
      }
    },
    {
      heading: "The Decision Flowchart",
      content: "When looking at a test case, ask these four questions in order. If any answer is 'No,' consider keeping it manual.",
      table: {
        headers: ["#", "Question", "If No →"],
        rows: [
          ["1", "Will this test run more than 3 times?", "Keep manual — automation ROI too low"],
          ["2", "Can the expected result be verified by code (not human judgment)?", "Keep manual — need human eyes"],
          ["3", "Is the feature stable enough that the test won't break next sprint?", "Wait to automate — too much maintenance debt"],
          ["4", "Can test data be created programmatically?", "Automate with caution — data setup may be fragile"],
        ]
      },
      tip: "Use this flowchart when deciding which acceptance criteria belong in Playwright and which should stay as human-led checks. Not everything needs to be automated."
    },
    {
      heading: "The Hybrid Approach",
      content: "The best automation programs do not treat manual and automated work as competing paths. They combine them strategically. Automate the repetitive regression checks so more time can go toward exploratory testing, usability evaluation, and creative edge case discovery. Think of it as: automation handles the checking, humans handle the deeper testing judgment.",
      callout: "Automation handles checking: did the button work? Did the page load? Did the data save? Humans handle testing: is this confusing? Does this flow make sense? What would a real user try that we haven't thought of?"
    },
    {
      heading: "Start Small, Expand Gradually",
      content: "Don't try to automate your entire regression suite in week one. Start with the 10 most-repeated manual test cases. Automate those. Stabilize them. Then expand. Industry guidance is consistent: begin with small, low-risk pilot projects, validate the approach, and gradually increase coverage. Efforts that try to automate everything at once typically see their suites decay within months because maintenance quickly overwhelms the available capacity.",
      table: {
        headers: ["Week", "Target", "Expected Outcome"],
        rows: [
          ["1–2", "Automate 5 smoke tests (login, nav, homepage)", "Team learns the toolchain, builds confidence"],
          ["3–4", "Add 10 regression tests for core features", "First real regression catches in CI pipeline"],
          ["5–8", "Expand to 25–30 tests covering all critical paths", "Manual regression load drops noticeably"],
          ["Ongoing", "Add 3–5 new tests per sprint, maintain existing", "Sustainable growth without maintenance debt"],
        ]
      }
    }
  ],
  promptTemplates: [
    {
      label: "Automation Decision Matrix",
      context: "Use when you have a new feature and need to classify its tests into automate vs. keep manual buckets.",
      prompt: "Context: I am deciding which tests for a new feature should be automated with Playwright and which should remain manual. I need a structured decision matrix.\n\nActions:\n1. Read the feature description below and identify all testable scenarios (happy path, error cases, edge cases, UX flows).\n2. For each scenario, evaluate it against these four criteria:\n   - Will it run more than 3 times? (Yes/No)\n   - Can the expected result be verified by code without human judgment? (Yes/No)\n   - Is the feature stable enough that the test won't break next sprint? (Yes/No)\n   - Can test data be created programmatically? (Yes/No)\n3. Classify each scenario into one of three buckets:\n   - AUTOMATE: All four answers are Yes — write a Playwright test.\n   - DEFER: Feature is unstable — automate after it stabilizes.\n   - KEEP MANUAL: Requires human judgment or runs too infrequently.\n4. For each AUTOMATE scenario, suggest the test type (smoke, regression, data-driven, cross-browser) and list key assertions.\n\nRules:\n- Exploratory testing, usability evaluation, and visual design review should always be KEEP MANUAL.\n- Smoke tests and regression tests for stable critical paths should always be AUTOMATE.\n- If a feature is under active redesign, classify as DEFER regardless of other factors.\n- Provide reasoning for every classification — not just the label.\n\nData — Feature Description:\n[PASTE THE FEATURE DESCRIPTION, USER STORIES, OR ACCEPTANCE CRITERIA HERE]",
    },
    {
      label: "Generate Test Priority Backlog",
      context: "Use when you have a list of application features and need a prioritized automation backlog.",
      prompt: "Context: I am building a Playwright test automation backlog for an application. I need to prioritize which features to write automated tests for first, based on risk, frequency, and complexity.\n\nActions:\n1. For each feature in the list below, assess three factors (1–5 scale):\n   - Risk: What is the business impact if this feature breaks? (5 = blocks revenue or core workflow, 1 = minor cosmetic issue)\n   - Frequency: How often do users interact with this feature? (5 = every session, 1 = rarely used)\n   - Complexity: How complex is it to automate? (5 = simple form or click flow, 1 = requires complex setup, third-party integrations, or visual validation)\n2. Calculate a priority score: (Risk × Frequency × Complexity) to surface high-value, low-effort candidates first.\n3. Generate a prioritized backlog table sorted by score (highest first).\n4. Group the backlog into three phases:\n   - Phase 1 (Weeks 1–2): Top 5 highest-scoring features — automate these first as smoke tests.\n   - Phase 2 (Weeks 3–4): Next 10 features — expand into regression coverage.\n   - Phase 3 (Ongoing): Remaining features — add 3–5 tests per sprint.\n5. Flag any features that should remain manual-only, with reasoning.\n\nRules:\n- Login, authentication, and checkout flows should be prioritized regardless of score.\n- Features under active development should be deferred to Phase 3 or kept manual.\n- Each phase should include estimated test count and expected time investment.\n- Complexity score is inverted: higher score means EASIER to automate (to reward quick wins).\n\nData — Application Features:\n[PASTE YOUR LIST OF APPLICATION FEATURES HERE, ONE PER LINE, WITH A BRIEF DESCRIPTION OF EACH]",
    },
  ],
  quiz: {
    question: "Your team wants to automate a test for a feature that is actively being redesigned and will change significantly next sprint. What should you do?",
    options: [
      "Automate it now so testing is covered during the redesign",
      "Wait until the feature stabilizes — automating now creates maintenance debt",
      "Automate it but skip assertions so it doesn't break",
      "Hand it off to someone else because it's complicated"
    ],
    correctIndex: 1,
    explanation: "Automating unstable features creates tests that break every time the feature changes. This wastes more time maintaining the test than running it manually. Wait until the feature is stable, then automate. Use manual/exploratory testing during the redesign phase."
  },
  practiceLink: {
    url: "http://localhost:5173/orders",
    label: "Explore the Orders page — a great candidate for automation with its table, pagination, and sorting",
    description: "The Orders page demonstrates a data-heavy feature that is ideal for automation",
  }
};
