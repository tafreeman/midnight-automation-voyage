import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 101,
  title: "What to Automate (and What Not To)",
  subtitle: "Not every test deserves a script — here's how to decide",
  icon: "🎯",
  audience: "All Roles — Non-Coder Essential",
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
      tip: "Non-coders: Use this flowchart when deciding which acceptance criteria to record as Playwright tests vs. which to keep in your manual test suite. Not everything needs to be automated."
    },
    {
      heading: "The Hybrid Approach",
      content: "The best teams don't choose between manual and automated — they combine both strategically. Automate the repetitive regression checks so your manual testers are freed up for the high-value work: exploratory testing, usability evaluation, and creative edge case discovery. Think of it as: automation handles the checking (did the expected thing happen?), humans handle the testing (is this actually the right thing?).",
      callout: "Automation handles checking: did the button work? Did the page load? Did the data save? Humans handle testing: is this confusing? Does this flow make sense? What would a real user try that we haven't thought of?"
    },
    {
      heading: "Start Small, Expand Gradually",
      content: "Don't try to automate your entire regression suite in week one. Start with the 10 most-repeated manual test cases. Automate those. Stabilize them. Then expand. Industry guidance is consistent: begin with small, low-risk pilot projects, validate the approach, and gradually increase coverage. Teams that try to automate everything at once typically see their suites decay within months because maintenance overwhelms the team.",
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
  quiz: {
    question: "Your team wants to automate a test for a feature that is actively being redesigned and will change significantly next sprint. What should you do?",
    options: [
      "Automate it now so testing is covered during the redesign",
      "Wait until the feature stabilizes — automating now creates maintenance debt",
      "Automate it but skip assertions so it doesn't break",
      "Ask a developer to handle it since it's complicated"
    ],
    correctIndex: 1,
    explanation: "Automating unstable features creates tests that break every time the feature changes. This wastes more time maintaining the test than running it manually. Wait until the feature is stable, then automate. Use manual/exploratory testing during the redesign phase."
  }
};
