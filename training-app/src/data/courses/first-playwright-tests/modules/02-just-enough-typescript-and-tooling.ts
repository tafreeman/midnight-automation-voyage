import { createPracticeLink, createSingleLessonModule, firstPlaywrightTestRoutes } from "../shared";

export const justEnoughTypescriptAndToolingModule = createSingleLessonModule({
  index: 2,
  title: "Just Enough TypeScript and Tooling",
  subtitle: "Read the four patterns that every test file uses and see where Playwright fits",
  icon: "🔧",
  estimatedMinutes: 8,
  learningObjectives: [
    "Read async/await, arrow functions, template literals, and type annotations in test code",
    "Explain why Playwright's auto-wait removes the most common cause of flaky tests",
    "Name the three roles — Playwright, Copilot, and you — and what each one owns",
  ],
  lesson: {
    title: "Just Enough TypeScript and Tooling",
    subtitle: "Read the four patterns that every test file uses and see where Playwright fits",
    estimatedMinutes: 8,
    sections: [
      {
        type: "text",
        heading: "Four Patterns You Will See Everywhere",
        content:
          "Every test file in this course uses four TypeScript patterns. You do not need to memorize them — just recognize them when they appear. The table below is your cheat sheet; come back to it whenever a line looks unfamiliar.",
      },
      {
        type: "table",
        heading: "TypeScript Cheat Sheet",
        headers: ["Pattern", "Looks Like", "Means", "When You Will See It"],
        rows: [
          ["async / await", "`await page.click()`", "Wait for this step to finish before moving on", "Every line that talks to the browser"],
          ["Arrow function", "`({ page }) => { ... }`", "A function definition (shorthand)", "Wrapping test bodies and callbacks"],
          ["Template literal", "`` `/products/${id}` ``", "A string with a variable inserted", "Dynamic URLs and test descriptions"],
          ["Type annotation", "`name: string`", "This variable holds text", "Function parameters and config objects"],
        ],
      },
      {
        type: "table",
        heading: "Playwright vs. Alternatives",
        headers: ["Feature", "Selenium", "Cypress", "Playwright"],
        rows: [
          ["Waits", "Manual sleep / WebDriverWait", "Auto-retry on assertions only", "Auto-wait on every action"],
          ["Browser support", "All (via drivers)", "Chromium only (beta Firefox/WebKit)", "Chromium, Firefox, WebKit"],
          ["Multi-tab / multi-window", "Yes (complex API)", "No", "Yes (built-in)"],
          ["Parallel execution", "Via Selenium Grid (complex)", "Via Dashboard (paid tier)", "Built-in (free)"],
          ["Recorder / codegen", "No", "No", "Yes — record interactions as code"],
          ["Trace viewer", "No", "Dashboard (paid tier)", "Yes — free, built-in"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        heading: "Auto-Wait Is the Biggest Reason",
        content:
          "Flaky tests caused by timing issues are the number-one reason teams abandon test automation. Playwright eliminates that category of failure at the framework level. Every action — click, fill, check — waits for the element to be ready before it acts.",
      },
      {
        type: "text",
        heading: "Three Roles, Clear Boundaries",
        content:
          "Every test you write involves three actors. Keeping their roles distinct prevents the most common mistakes.\n\n**Playwright** runs your tests. It opens browsers, navigates pages, clicks buttons, fills forms, reads text, and reports results. It handles timing, retries, and parallel execution.\n\n**Copilot** writes code from your descriptions. It translates plain-language prompts into Playwright calls, suggests selectors, and explains errors.\n\n**You** decide what to test. You choose which assertions matter. You review Copilot's output for correctness. The judgment calls — what is worth testing, what is a meaningful assertion, when coverage is sufficient — those are yours.",
      },
      {
        type: "callout",
        variant: "tip",
        heading: "The Mental Model",
        content:
          "Think of it as a car, a GPS, and a driver. Playwright is the car — reliable, fast, handles the mechanics. Copilot is the GPS — suggests the route, but does not know whether the destination is right. You are the driver — you choose where to go and when to override the GPS.",
      },
    ],
    quiz: {
      questions: [
        {
          question: "What does `await` mean in a Playwright test line?",
          options: [
            "Run this line in the background",
            "Wait for this step to finish before moving on",
            "Skip this line if it takes too long",
            "Repeat this line until it works",
          ],
          correctIndex: 1,
          explanation:
            "await pauses execution until the browser action completes. Without it, the test would race ahead before the page is ready.",
        },
        {
          question: "In the three-role model, who decides whether a test assertion is meaningful?",
          options: [
            "Playwright — it checks the page automatically",
            "Copilot — it generates the best assertion",
            "You — judgment calls are the human's job",
            "The CI pipeline — it validates on merge",
          ],
          correctIndex: 2,
          explanation:
            "Copilot can suggest assertions and Playwright can run them, but deciding whether an assertion actually proves the right thing is a judgment call that belongs to the tester.",
        },
      ],
    },
    practiceLink: createPracticeLink(
      firstPlaywrightTestRoutes.login,
      "Open the login page",
      "Look at the form fields you will target in later lessons. Notice the visible labels and the data-testid attributes in DevTools.",
    ),
    narrationScript: {
      intro:
        "Before you write a single test, let's get comfortable with the language and the tools.",
      steps: [
        {
          text: "Every test file uses async/await, arrow functions, template literals, and type annotations. You do not need to write them from scratch — Copilot handles that. But you need to read them when reviewing generated code.",
          duration: 20,
        },
        {
          text: "Playwright was built for modern web testing. Auto-wait means your tests do not break from timing issues. A built-in recorder lets you capture flows as code. A free trace viewer lets you debug failures frame by frame.",
          navigateTo: "/login",
          duration: 18,
        },
        {
          text: "Three actors in every test: Playwright runs it, Copilot writes it, you judge it. When a test fails, you review the logic, fix the gap, and rerun. That review step is where your testing expertise matters most.",
          duration: 18,
        },
      ],
      outro:
        "That is the foundation. Next lesson: set up your local tools and run your first passing check.",
    },
  },
});
