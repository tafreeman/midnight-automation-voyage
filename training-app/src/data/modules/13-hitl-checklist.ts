import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 10,
  title: "HITL Review Checklist",
  subtitle: "The governance gate before any test merges",
  icon: "✅",
  audience: "All Roles",
  sections: [
    {
      heading: "Why a Checklist?",
      content: "AI-generated code passes syntax checks and even runs successfully — but it can still be wrong. A test that clicks buttons without asserting outcomes, or asserts the wrong thing, gives false confidence. This checklist is the team's quality gate.",
      callout: "This checklist applies to ALL test code entering the repo — whether hand-written, recorded, or Copilot-generated. No exceptions."
    },
    {
      heading: "The Review Checklist",
      content: "Run through these items before approving any test MR. Each item is a yes/no gate. Any 'No' requires a fix before merge.",
      table: {
        headers: ["#", "Check", "Why It Matters"],
        rows: [
          ["1", "Does each test map to an acceptance criterion?", "Untraceable tests become orphaned and unmaintainable"],
          ["2", "Does every user action have a corresponding assertion?", "Actions without assertions only prove 'no crash' — not correctness"],
          ["3", "Are all selectors using data-testid or getByRole?", "CSS selectors break on every UI refactor"],
          ["4", "Zero instances of waitForTimeout or sleep?", "Hardcoded waits are the #1 source of flaky tests"],
          ["5", "Does the test use realistic (not mocked) data for happy path?", "Mocked happy paths miss integration bugs"],
          ["6", "Are error/edge cases covered (empty state, 500, timeout)?", "Edge cases are where production bugs hide"],
          ["7", "Is test data independent (no shared state between tests)?", "Shared state creates hidden ordering dependencies"],
          ["8", "Does the test name describe the user scenario?", "test('test 1') tells reviewers nothing"],
          ["9", "No hardcoded URLs or environment-specific values?", "Tests must run against any environment via baseURL"],
          ["10", "No sensitive data (real passwords, PII, tokens)?", "Test code is committed to the repo and visible to the team"],
        ]
      }
    },
    {
      heading: "Copilot-Specific Red Flags",
      content: "These are patterns that Copilot frequently generates that should be caught in review.",
      table: {
        headers: ["Red Flag", "What Copilot Did", "Correct Fix"],
        rows: [
          ["Assertion-free test", "Generated clicks with no expect()", "Add assertion per action"],
          ["Hardcoded wait", "Added page.waitForTimeout(3000)", "Remove — rely on auto-wait"],
          ["Hallucinated selector", "Used data-testid that doesn't exist", "Verify against actual HTML"],
          ["Wrong assertion target", "Asserts page title instead of error msg", "Match assertion to AC"],
          ["Shared state", "Test 2 depends on Test 1's data", "Add setup/teardown per test"],
          ["Magic strings", "Hardcoded 'localhost:3000' in goto()", "Use baseURL from config"],
        ]
      },
      warning: "The hallucinated selector is the most dangerous pattern. Copilot will confidently use a data-testid that doesn't exist in your HTML. The test fails with a timeout, and the error doesn't tell you the selector is wrong — only that the element wasn't found."
    }
  ],
  quiz: {
    question: "A Copilot-generated test passes but has no expect() assertions. What should you do?",
    options: [
      "Approve it — if it passes, it works",
      "Add assertions that verify the acceptance criteria before approving",
      "Delete it and write the test manually",
      "Ask Copilot to add assertions automatically without reviewing them"
    ],
    correctIndex: 1,
    explanation: "A test without assertions only proves the app doesn't crash during the flow — not that it produces correct results. Add assertions that map to the ticket's acceptance criteria, then verify those assertions are checking the right things."
  }
};
