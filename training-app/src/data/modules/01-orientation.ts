import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 0,
  title: "Course Orientation",
  subtitle: "A practical workflow for learning Playwright and Copilot together",
  icon: "👋",
  sections: [
    {
      heading: "What This Guide Optimizes For",
      content: "This guide is built for people who want to turn acceptance criteria into reliable automated checks with as little friction as possible. Playwright handles browser automation, Copilot accelerates authoring, and the workflow stays grounded in visible assertions and human review. The goal is simple: faster, clearer feedback with less guesswork.",
      callout: "You do not need to be a full-time programmer to create useful Playwright tests. The record, refine, review workflow keeps the focus on behavior and evidence."
    },
    {
      heading: "What You'll Be Able To Do",
      content: "By the end of this guide, you will be able to record user flows and turn them into repeatable tests, use Copilot Chat prompts to generate and refine tests from plain English, read test output and identify what failed, contribute test cases through pull requests, and apply a human-in-the-loop review checklist before merging.",
      table: {
        headers: ["Skill", "Outcome", "Starting Point"],
        rows: [
          ["Record a test", "Capture a real user flow quickly", "Lesson 07"],
          ["Refine with Copilot", "Turn recordings into maintainable specs", "Lessons 06 and 07"],
          ["Add strong assertions", "Prove the expected outcome, not just clicks", "Lessons 08 and 13"],
          ["Read test results", "Triage failures with confidence", "Lesson 12"],
          ["Use shared abstractions", "Reuse page objects, fixtures, and prompts", "Lessons 09, 10, and 16"],
          ["Review before merge", "Apply human judgment to every generated test", "Lesson 13"],
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
  },
  practiceLink: {
    url: "http://localhost:5173/login",
    label: "Start by exploring the Practice App's login page — the first feature you'll automate",
    description: "The login page is your entry point into Playwright automation",
  }
};
