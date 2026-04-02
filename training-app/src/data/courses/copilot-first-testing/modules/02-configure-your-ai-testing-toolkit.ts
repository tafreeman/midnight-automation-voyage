import {
  createSingleLessonModule,
  createPracticeLink,
  createExerciseLab,
  routes,
} from "../shared";

export const configureYourAiTestingToolkitModule = createSingleLessonModule({
  index: 2,
  title: "Configure Your AI Testing Toolkit",
  subtitle: "Set up the files that make Copilot follow your rules automatically",
  icon: "\u2699\uFE0F",
  estimatedMinutes: 14,
  learningObjectives: [
    "Create a `.github/copilot-instructions.md` that enforces your team's Playwright conventions",
    "Configure `testGeneration.instructions` in VS Code settings for test-specific rules",
    "Structure a project so Copilot finds exemplar tests and follows their patterns",
  ],
  lesson: {
    title: "Configure Your AI Testing Toolkit",
    subtitle:
      "Set up the files that make Copilot follow your rules automatically",
    estimatedMinutes: 14,
    sections: [
      {
        type: "text",
        heading: "Why Configuration Beats Repetition",
        content:
          "Without instructions, you repeat \"use getByRole\" in every prompt. With copilot-instructions.md, it's automatic. Every Copilot Chat request in the repo silently includes the instructions file, so your conventions are enforced without you typing them each time. Key insight: 2-3 well-written example tests are more effective than lengthy instructions alone. Copilot learns patterns from code in your workspace, so a clean exemplar test teaches structure, naming, and assertion style all at once.",
      },
      {
        type: "code",
        language: "markdown",
        heading: "Your First copilot-instructions.md",
        code: `# Project Testing Instructions

## Tech Stack
- TypeScript with strict mode
- Playwright for end-to-end testing
- Node.js runtime

## Playwright Conventions
- Wrap related tests in \`test.describe\` blocks
- Import Page Object Models from \`tests/pages/\`
- Locator priority: \`getByRole\` > \`getByLabel\` > \`getByTestId\` (never raw CSS/XPath)
- Use \`test.beforeEach\` for shared setup (navigation, auth)
- Every test must be independent — no shared state between tests
- Use \`expect(page).toHaveURL()\` for navigation assertions
- Use \`test.step()\` to group logical actions within a test
- Use \`page.route()\` for API mocking — never hit real external services

## Code Style
- Always use async/await (no .then() chains)
- Destructure \`{ page }\` from the test argument
- Name test files: \`<feature>.spec.ts\` (e.g., login.spec.ts, checkout.spec.ts)
- Name Page Object Models: \`<Page>Page.ts\` (e.g., LoginPage.ts, DashboardPage.ts)

## Do NOT
- Do NOT use \`waitForTimeout()\` — rely on Playwright auto-waiting
- Do NOT use CSS selectors when a semantic locator (getByRole, getByLabel) is available
- Do NOT hardcode URLs — use relative paths or baseURL from config
- Do NOT use \`page.evaluate()\` unless no Playwright API alternative exists`,
      },
      {
        type: "code",
        language: "jsonc",
        heading: "VS Code Settings for Test Generation",
        code: `// .vscode/settings.json
{
  "github.copilot.chat.testGeneration.instructions": [
    {
      "file": ".github/copilot-instructions.md"
    },
    {
      "text": "Use Playwright with TypeScript. Prefer getByRole and getByLabel over CSS selectors. Every test must be independent. Use test.describe for grouping and test.step for logical sections."
    }
  ],
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "file": ".github/copilot-instructions.md"
    }
  ],
  "github.copilot.chat.codeGeneration.useInstructionFiles": true
}`,
      },
      {
        type: "text",
        heading: "Project Structure That Helps Copilot",
        content:
          "Copilot uses your project structure as context. A well-organized repo helps it generate better code. Recommended layout:\n\n.github/copilot-instructions.md — repo-wide Copilot conventions\n.vscode/settings.json — editor and Copilot configuration\n.vscode/mcp.json — MCP server configuration\nplaywright.config.ts — Playwright configuration\ntests/e2e/ — exemplar spec files (your best tests live here)\ntests/pages/ — Page Object Models with a shared BasePage\ntests/fixtures/ — custom fixtures and test data\ntests/mocks/ — API mock handlers\nsrc/ — application source code\n\nWhen Copilot sees this structure, it knows where to import POMs from, how to name files, and where to place new tests. The tests/pages/ directory with a BasePage class is especially powerful — Copilot will extend it automatically when generating new POMs.",
      },
      {
        type: "callout",
        variant: "tip",
        heading: "The Exemplar Test Trick",
        content:
          "Keep your best test open in a split pane. Copilot reads open files and mimics their patterns. Having 2-3 excellent example tests teaches Copilot more than a 500-line instructions file. Pick tests that demonstrate your locator strategy, assertion style, describe/step structure, and POM usage. When you ask Copilot to generate a new test, it will mirror the patterns from those open tabs.",
      },
      {
        type: "table",
        heading: "Before and After: Output Quality",
        headers: ["Dimension", "Without Instructions", "With Instructions"],
        rows: [
          [
            "Selectors",
            "CSS classes (.btn-primary, #email)",
            "getByRole('button') / getByLabel('Email')",
          ],
          [
            "Waits",
            "waitForTimeout(3000)",
            "Auto-waiting only (no manual waits)",
          ],
          [
            "Assertions",
            "toBeVisible() only",
            "toHaveText / toHaveURL / toHaveCount",
          ],
          [
            "Structure",
            "Flat test body",
            "test.describe + test.step grouping",
          ],
          [
            "Naming",
            "test-1.spec.ts",
            "feature.spec.ts (login.spec.ts, checkout.spec.ts)",
          ],
        ],
      },
    ],
    quiz: {
      questions: [
        {
          question:
            "Where does `.github/copilot-instructions.md` get its power?",
          options: [
            "It runs as a pre-commit hook",
            "It's automatically appended to every Copilot Chat request in the repo",
            "It replaces your VS Code settings",
            "It validates generated code before saving",
          ],
          correctIndex: 1,
          explanation:
            "The file is silently injected as context into every Copilot Chat interaction within the repository, ensuring consistent conventions without manual repetition.",
        },
        {
          question:
            "What is more effective than a long instructions file for teaching Copilot your patterns?",
          options: [
            "Adding more rules to the instructions file",
            "Having 2-3 well-written exemplar test files Copilot can learn from",
            "Using a longer system prompt",
            "Installing additional Copilot extensions",
          ],
          correctIndex: 1,
          explanation:
            "Copilot learns patterns from existing code in your workspace. Well-structured example tests demonstrate conventions more effectively than lengthy written instructions.",
        },
      ],
    },
    exercise: {
      title: "Create Your Instructions File",
      description:
        "Create .github/copilot-instructions.md for the practice app workspace. Include the locator hierarchy, test structure rules, and DO NOT list. Then generate the same login test from Module 1 and compare output quality.",
      starterCode: `# Project Testing Instructions

## Tech Stack
<!-- TODO: List your tech stack (language, test framework, runtime) -->

## Playwright Conventions
<!-- TODO: Add locator priority (getByRole > getByLabel > getByTestId) -->
<!-- TODO: Add test structure rules (describe blocks, beforeEach, independent tests) -->
<!-- TODO: Add assertion patterns (toHaveURL, test.step, page.route) -->

## Code Style
<!-- TODO: Add async/await rule -->
<!-- TODO: Add file naming conventions -->
<!-- TODO: Add POM naming conventions -->

## Do NOT
<!-- TODO: Add at least 3 anti-patterns to avoid -->`,
      solutionCode: `# Project Testing Instructions

## Tech Stack
- TypeScript with strict mode
- Playwright for end-to-end testing
- Node.js runtime

## Playwright Conventions
- Wrap related tests in \`test.describe\` blocks
- Import Page Object Models from \`tests/pages/\`
- Locator priority: \`getByRole\` > \`getByLabel\` > \`getByTestId\` (never raw CSS/XPath)
- Use \`test.beforeEach\` for shared setup (navigation, auth)
- Every test must be independent — no shared state between tests
- Use \`expect(page).toHaveURL()\` for navigation assertions
- Use \`test.step()\` to group logical actions within a test
- Use \`page.route()\` for API mocking — never hit real external services

## Code Style
- Always use async/await (no .then() chains)
- Destructure \`{ page }\` from the test argument
- Name test files: \`<feature>.spec.ts\` (e.g., login.spec.ts, checkout.spec.ts)
- Name Page Object Models: \`<Page>Page.ts\` (e.g., LoginPage.ts, DashboardPage.ts)

## Do NOT
- Do NOT use \`waitForTimeout()\` — rely on Playwright auto-waiting
- Do NOT use CSS selectors when a semantic locator (getByRole, getByLabel) is available
- Do NOT hardcode URLs — use relative paths or baseURL from config
- Do NOT use \`page.evaluate()\` unless no Playwright API alternative exists`,
      hints: [
        "Start with the locator priority order: getByRole > getByLabel > getByTestId",
        "Add at least 3 items to the DO NOT list",
        "Test the difference by generating the login test with and without the file present",
      ],
      lab: createExerciseLab(
        ".github/copilot-instructions.md",
        "cat .github/copilot-instructions.md",
        [
          "Instructions file exists at .github/copilot-instructions.md",
          "File includes locator hierarchy (getByRole, getByLabel, getByTestId)",
          "File includes at least 3 DO NOT rules",
          "Regenerated login test uses better selectors than Module 1 attempt",
        ],
      ),
    },
    promptTemplates: [
      {
        label: "Generate copilot-instructions.md",
        context:
          "Meta-prompt: ask Copilot to draft its own instructions file based on your existing tests.",
        prompt: `I'm setting up a Playwright testing project. Review the test files in my workspace and generate a .github/copilot-instructions.md that captures our conventions.

Include sections for:
1. Tech stack and frameworks
2. Playwright-specific conventions (locator strategy, test structure, fixtures)
3. Code style (naming, async patterns, imports)
4. A DO NOT list of anti-patterns to avoid

Base the rules on patterns you see in my existing test files.`,
      },
    ],
    practiceLink: createPracticeLink(
      routes.login,
      "Open the login page",
      "Use the login page to compare test output quality before and after adding instructions.",
    ),
    narrationScript: {
      intro:
        "Every prompt you wrote in Course 1 included rules like 'use getByRole' and 'no waitForTimeout'. This lesson makes those rules automatic so you never repeat them again.",
      steps: [
        {
          text: "Create the instructions file at .github/copilot-instructions.md. This single file is automatically included in every Copilot Chat request made within this repository.",
          duration: 18,
        },
        {
          text: "Add the VS Code settings that point test generation to your instructions. The testGeneration.instructions setting lets you add test-specific rules on top of the general instructions.",
          duration: 16,
        },
        {
          text: "Open your best test from Course 1 in a split pane. Copilot reads open editor tabs as context. Two well-written tests teach it more than pages of written rules.",
          duration: 16,
        },
        {
          text: "Generate the login test again with the instructions in place. Compare the selectors, assertions, and structure to your Module 1 output.",
          duration: 14,
        },
      ],
      outro:
        "With the toolkit configured, every Copilot interaction in this project follows your standards automatically. Next: putting it to work with Chat-driven generation.",
    },
  },
});
