import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 100,
  title: "Mindset Shifts: Manual → Automated",
  subtitle: "The 5 mental model changes that trip up every manual tester",
  icon: "🧠",
  audience: "All Roles — Non-Coder Essential",
  sections: [
    {
      heading: "Your Manual Testing Skills ARE the Foundation",
      content: "Here's what the industry gets wrong: they treat automation as an upgrade from manual testing, when it's actually a different output format for the same core skills. You already know how to analyze requirements, identify edge cases, think about user flows, and recognize when something 'feels wrong.' Those skills are harder to teach than any programming language. The research is clear — the real skill in automation is the testing thinking that goes into the test, not the code.",
      callout: "If you've ever written a detailed bug report with steps to reproduce, expected vs. actual results, and environment details — you already think like a test automator. A Playwright test is just that same report written in a format a computer can execute."
    },
    {
      heading: "Shift 1: From 'I Am the Test Tool' to 'I Instruct the Test Tool'",
      content: "In manual testing, you ARE the software agent executing the test. Your eyes validate the UI, your brain catches oddities, your intuition flags issues. In automation, you hand those instructions to a robot. The critical shift: the robot only checks what you explicitly tell it to check. It has no eyes, no intuition, and no understanding of your application. If you don't write an assertion, it won't notice a problem — even if the entire page is broken.",
      warning: "The #1 mistake manual testers make in automation: creating flows with no assertions. The test 'passes' because the app didn't crash, but nothing was actually verified. A test without assertions is like a manual test where you click through the app with your eyes closed."
    },
    {
      heading: "Shift 2: From End-to-End Flows to Targeted Checks",
      content: "Manual testers are trained to walk through entire workflows. You test login → search → add to cart → checkout as one continuous flow, because you can't teleport to the middle of a workflow. Automated tests CAN start anywhere. You can navigate directly to the checkout page with pre-loaded data. Testing everything in one long flow is called 'over-testing' in automation — it makes tests slow, fragile, and hard to debug because you can't tell which step actually failed.",
      table: {
        headers: ["Manual Habit", "Why It's a Problem in Automation", "Better Approach"],
        rows: [
          ["Test the full flow every time", "Long tests are slow and fragile — one early failure hides all later results", "Break into focused tests: login test, search test, checkout test"],
          ["Verify everything you see on a page", "Too many assertions = too many failure points = flaky tests", "Assert only the specific behavior this test is checking"],
          ["Always start from the login page", "Wastes time re-testing login in every test", "Use auth fixtures to skip login and go directly to the page you're testing"],
          ["Create test data through the UI", "Slow and unreliable — the UI might change", "Use API calls or database fixtures to create test data before the test runs"],
        ]
      }
    },
    {
      heading: "Shift 3: From One-Time Execution to Repeatable Scripts",
      content: "Manual tests adapt on the fly. If a button moved, you find it. If a label changed, you read the new one. Automated tests are deterministic — they do exactly what you told them, no more, no less. If the button moved and your selector doesn't match, the test fails. This means you have to think about resilience when writing tests: using stable selectors (data-testid, not CSS classes), avoiding hardcoded values, and designing tests that aren't brittle when the UI changes.",
      tip: "Think of an automated test like a recipe for someone who has never cooked. You can't say 'add a pinch of salt' — you need to say 'measure 1/4 teaspoon of salt and add it to the bowl.' Every instruction must be explicit and unambiguous."
    },
    {
      heading: "Shift 4: From 'It Works' to 'The Right Thing Happened'",
      content: "Manual testers naturally evaluate the whole screen. You notice if the layout looks weird, if text is truncated, or if a color is off. Automation can't do that (yet). A test that clicks 'Submit' and doesn't crash reports a pass — even if the form submitted to the wrong endpoint, saved the wrong data, or showed a success message with an error code behind it. You must teach the test what 'correct' looks like with specific assertions.",
      table: {
        headers: ["Scenario", "Manual Tester Catches This", "Automation Misses Unless You Assert"],
        rows: [
          ["Form submits but shows 'Error 500' in small text", "✅ You see the error message", "❌ Test passed — it just checked the page loaded"],
          ["Cart total shows $0.00 after adding items", "✅ You know that's wrong", "❌ Test passed — it only verified the element exists"],
          ["Login works but lands on the wrong dashboard", "✅ You notice the wrong page", "❌ Test passed — it only checked the URL changed"],
          ["Search returns results but they're from wrong category", "✅ You read the results", "❌ Test passed — it only counted the result count"],
        ]
      },
      warning: "Every scenario above is a real bug that would pass automated testing without proper assertions. This is why the HITL review checklist exists — humans catch what robots miss."
    },
    {
      heading: "Shift 5: From Ad-Hoc Execution to Structured Maintenance",
      content: "In manual testing, updating test cases is straightforward — change the steps document. In automation, test maintenance is a continuous discipline. When the app changes, selectors break, expected text changes, and flows evolve. Industry data shows that teams that don't plan for maintenance see their test suites decay within 3–6 months. The Page Object Model pattern (Lesson 6) exists specifically to make maintenance manageable by centralizing selectors in one place.",
      tip: "Budget 20% of your testing time for maintenance. If you write 10 new tests this sprint, expect to fix or update 2 existing ones. This is normal — not a failure."
    },
    {
      heading: "What Stays the Same",
      content: "Some of your most valuable manual testing skills transfer directly and require zero adjustment. Exploratory testing — automation handles regression, which frees you to explore and find the bugs no one anticipated. Risk-based prioritization — you know which features break most often and where users struggle. Domain knowledge — you understand the business rules that determine whether a test assertion is actually correct. Bug triage — you can read a failing test and determine whether it's a test problem, an environment problem, or a real application defect. These are the skills that make you irreplaceable, and no amount of AI changes that.",
      callout: "Automation handles the boring, repetitive checking. You handle the interesting, creative testing. That's the division of labor that makes a great QA team."
    }
  ],
  quiz: {
    question: "A manual tester records a Playwright test that walks through the entire checkout flow (login → search → add to cart → pay → confirm). What's the problem?",
    options: [
      "Nothing — comprehensive tests are always better",
      "The test is too long; if login fails, you won't know if checkout also has a bug",
      "Playwright can't handle multi-step flows",
      "The test should be written in Python, not TypeScript"
    ],
    correctIndex: 1,
    explanation: "Long end-to-end tests are fragile because an early failure masks all later checks. If login breaks, you learn nothing about search, cart, or checkout. Break it into focused, independent tests — each targeting one capability with one clear set of assertions."
  }
};
