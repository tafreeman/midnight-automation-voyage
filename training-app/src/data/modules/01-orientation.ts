import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 0,
  title: "Who This Is For",
  subtitle: "Whether you code daily or have never touched a test file",
  icon: "👋",
  sections: [
    {
      heading: "Two Tracks, One Goal",
      content: "This guide serves two audiences. Developers who write code daily and want to accelerate their test authoring. And non-coders — manual testers, QA analysts, BAs, and front-end testers — who want to use Playwright + Copilot without becoming full-time programmers. Every lesson marks which audience it targets. If a section says 'All Roles' — everyone reads it. If it says 'Developers' — non-coders can skim or skip. If it says 'Non-Coder Friendly' — it's written specifically for people without daily coding experience.",
      callout: "You do NOT need to be a developer to create useful Playwright tests. The recorder + Copilot workflow lets you generate, refine, and maintain tests with minimal hand-written code."
    },
    {
      heading: "What You'll Be Able To Do",
      content: "By the end of this guide, regardless of your role, you will be able to: record user flows and turn them into repeatable tests, use Copilot Chat prompts to generate and refine tests from plain English, read test output and identify what failed, contribute test cases to the team's test suite via merge requests, and apply the team's human-in-the-loop review checklist before merging.",
      table: {
        headers: ["Skill", "Developer Track", "Non-Coder Track"],
        rows: [
          ["Record a test", "✅ Lesson 4", "✅ Lesson 4"],
          ["Write tests from scratch", "✅ Lesson 5–6", "⏭ Optional"],
          ["Use Copilot prompts", "✅ Lesson 3", "✅ Lesson 3 + 8"],
          ["Read test results", "✅ Lesson 9", "✅ Lesson 9"],
          ["Page Object Model", "✅ Lesson 6", "⏭ Awareness only"],
          ["HITL Review Checklist", "✅ Lesson 10", "✅ Lesson 10"],
          ["Prompt Templates", "✅ Lesson 8", "✅ Lesson 8"],
        ]
      }
    },
    {
      heading: "The Mental Model",
      content: "Think of it this way: Playwright is a robot that clicks through your app exactly how a user would. Copilot is a writing assistant that helps you tell that robot what to do. You describe the user journey. Copilot translates it into instructions. Playwright executes those instructions across browsers. You review the results and confirm correctness. The human is always the final authority on whether a test is right.",
      tip: "If you've ever written a detailed bug report with steps to reproduce — you already have the core skill. That's exactly what a Playwright test is: steps to reproduce, plus expected results."
    }
  ],
  quiz: {
    question: "Who needs to review every AI-generated test before it merges?",
    options: [
      "Only senior developers",
      "The AI itself validates correctness",
      "A human reviewer — always",
      "Nobody, if the test passes"
    ],
    correctIndex: 2,
    explanation: "Human-in-the-loop governance means a human always reviews AI-generated test code against the acceptance criteria before merge. Passing tests can still be testing the wrong thing."
  }
};
