import {
  createSingleLessonModule,
  createPracticeLink,
  createExerciseLab,
  routes,
} from "../shared";

export const yourTeamsPromptPlaybookModule = createSingleLessonModule({
  index: 10,
  title: "Your Team's Prompt Playbook",
  subtitle: "Build reusable prompt files and team standards that scale",
  icon: "\uD83D\uDCDA",
  estimatedMinutes: 16,
  learningObjectives: [
    "Create .prompt.md files that team members invoke from Copilot Chat",
    "Write file-scoped instructions (.github/instructions/*.instructions.md) for test files and POM files",
    "Define a governance checklist for AI-generated tests that fits into your team's PR review process",
  ],
  lesson: {
    title: "Your Team's Prompt Playbook",
    subtitle: "Build reusable prompt files and team standards that scale",
    estimatedMinutes: 16,
    sections: [
      {
        type: "text",
        heading: "From Single Prompts to a Playbook",
        content:
          "Course 1 taught PAGE and CARD as mental models. Modules 3-7 of this course used them as Chat prompts. Now the final step: make them concrete files in your repository that anyone on the team can invoke. A prompt playbook is version-controlled, shared automatically, and improves over time \u2014 unlike prompts in someone's clipboard or wiki page.",
      },
      {
        type: "code",
        language: "markdown",
        heading: "Your First .prompt.md File",
        code: `---
mode: agent
description: Generate a Playwright E2E test for a given feature
---

# Generate Playwright E2E Test

## Context
- Read existing Page Object Model classes in tests/pages/
- Read playwright.config.ts for project configuration
- Check tests/fixtures/ for available custom fixtures

## Requirements
1. Create a new .spec.ts file in tests/e2e/
2. Import and use existing POM classes, or create new ones if needed
3. Use test.describe() for grouping
4. Use test.beforeEach() for setup (navigation, auth)
5. Each test() should be independent
6. Use role-based locators: getByRole, getByLabel, getByTestId
7. Include both happy path and error cases
8. Use test.step() for logical groupings

## Locator Priority
1. getByRole() \u2014 ARIA roles (preferred)
2. getByLabel() \u2014 form labels
3. getByTestId() \u2014 data-testid attributes
4. CSS/XPath \u2014 last resort only, document why`,
      },
      {
        type: "code",
        language: "markdown",
        heading: "File-Scoped Instructions",
        code: `# File 1: .github/instructions/playwright-tests.instructions.md

---
applyTo: "tests/**/*.spec.ts"
---

# Playwright Test Standards

- Import from @playwright/test only
- Use Page Object classes from tests/pages/
- Every test must have at least one meaningful assertion (not just toBeVisible)
- Group related assertions in test.step()
- No waitForTimeout or manual sleeps
- Tests must be independently runnable

---

# File 2: .github/instructions/page-objects.instructions.md

---
applyTo: "tests/pages/**/*.ts"
---

# Page Object Standards

- One class per page or major component
- All locators as readonly properties in constructor
- Use getByRole for buttons and links, getByLabel for inputs
- Methods return Promise<void> or this for chaining`,
      },
      {
        type: "table",
        heading: "A Prompt Playbook for Your Team",
        headers: ["File", "Scenario", "When to Invoke"],
        rows: [
          [
            "new-e2e-test.prompt.md",
            "Generate a complete test from scratch",
            "Starting a new test for any page",
          ],
          [
            "page-object.prompt.md",
            "Create a POM class following team conventions",
            "When 3+ tests need the same selectors",
          ],
          [
            "fix-failure.prompt.md",
            "Diagnose and fix a failing test",
            "After running tests with failures",
          ],
          [
            "add-mocking.prompt.md",
            "Add API mocking to an existing test",
            "When a test needs isolated network responses",
          ],
          [
            "review-test.prompt.md",
            "Review a test for the 8 anti-patterns",
            "Before submitting a PR with AI-generated tests",
          ],
        ],
      },
      {
        type: "text",
        heading: "Governance: The PR Review Checklist",
        content:
          "Combine the HITL checklist from Module 6 and the anti-patterns from Module 9 into a PR review checklist for AI-generated tests: (1) Selectors: getByRole/getByLabel preferred, no CSS unless documented. (2) Assertions: verify behavior, not just visibility. Would this assertion fail if the feature were broken? (3) No waits: zero instances of waitForTimeout or explicit sleep. (4) Independence: each test runnable in isolation and in any order. (5) No over-engineering: no abstractions serving a single consumer. (6) Prompt provenance: commit message notes which tests were AI-generated. This last point matters: reviewers apply extra scrutiny to AI-generated code.",
      },
      {
        type: "callout",
        variant: "tip",
        heading: "Start Small, Iterate",
        content:
          "From GitHub's \"5 tips for custom instructions\": start with 3-5 rules, test with real PRs, expand based on what works. Keep each instruction file under ~1,000 lines \u2014 beyond that, quality degrades. Your best team prompt will be discovered through use, not designed upfront. Ship 3 prompt files this week, review in two weeks, refine.",
      },
    ],
    quiz: {
      questions: [
        {
          question:
            "What is the advantage of .prompt.md files over copy-pasting prompts from a wiki?",
          options: [
            ".prompt.md files use a more advanced AI model",
            "They are invoked directly from Copilot Chat, version-controlled in the repo, and shared automatically with the team",
            "They bypass the instructions file",
            "They generate code faster",
          ],
          correctIndex: 1,
          explanation:
            "Prompt files are part of your codebase. They are version-controlled (changes are tracked), shared automatically (everyone on the team has them), and invokable directly from Chat (no copy-paste). Wiki prompts go stale; repo prompts evolve with the code.",
        },
        {
          question:
            "Why should you record prompt provenance in commit notes?",
          options: [
            "It makes commits easier to search",
            "So reviewers know which tests were AI-generated and can apply the appropriate review checklist",
            "It is required by GitHub",
            "It helps Copilot generate better code next time",
          ],
          correctIndex: 1,
          explanation:
            "AI-generated tests need extra review scrutiny (the 8 anti-patterns, assertion trap, over-engineering). Recording which tests were AI-generated in commit notes tells reviewers to apply that checklist.",
        },
      ],
    },
    exercise: {
      title: "Build a 3-File Prompt Playbook",
      description:
        "Create 3 prompt files for the practice app: (1) new-e2e-test.prompt.md for generating tests from scratch, (2) page-object.prompt.md for POM generation, (3) fix-failure.prompt.md for iterative repair. Then create one file-scoped instructions file for test specs. Test each prompt by invoking it in Copilot Chat against a practice app page.",
      starterCode: `# .github/prompts/new-e2e-test.prompt.md
---
mode: agent
description: TODO - describe the test generation scenario
---

# TODO: Add prompt content

---

# .github/prompts/page-object.prompt.md
---
mode: agent
description: TODO - describe the POM generation scenario
---

# TODO: Add prompt content

---

# .github/prompts/fix-failure.prompt.md
---
mode: agent
description: TODO - describe the failure repair scenario
---

# TODO: Add prompt content

---

# .github/instructions/playwright-tests.instructions.md
---
applyTo: "tests/**/*.spec.ts"
---

# TODO: Add scoped rules for test specs`,
      solutionCode: `# .github/prompts/new-e2e-test.prompt.md
---
mode: agent
description: Generate a Playwright E2E test for a given feature
---

# Generate Playwright E2E Test

## Context
- Read existing Page Object Model classes in tests/pages/
- Read playwright.config.ts for project configuration
- Check tests/fixtures/ for available custom fixtures

## Requirements
1. Create a new .spec.ts file in tests/e2e/
2. Import and use existing POM classes, or create new ones if needed
3. Use test.describe() for grouping
4. Use test.beforeEach() for setup (navigation, auth)
5. Each test() should be independent
6. Use role-based locators: getByRole, getByLabel, getByTestId
7. Include both happy path and error cases
8. Use test.step() for logical groupings

## Locator Priority
1. getByRole() — ARIA roles (preferred)
2. getByLabel() — form labels
3. getByTestId() — data-testid attributes
4. CSS/XPath — last resort only, document why

---

# .github/prompts/page-object.prompt.md
---
mode: agent
description: Create a Page Object Model class following team conventions
---

# Create Page Object Model

## Context
- Read tests/pages/BasePage.ts for the base class
- Read existing POM classes in tests/pages/ for naming patterns
- Check the target page's HTML for interactive elements

## Requirements
1. Create one class per page or major component
2. Extend BasePage if it exists
3. Define all locators as readonly properties in the constructor
4. Use getByRole for buttons and links, getByLabel for inputs
5. Create methods for common user actions (login, fillForm, submitOrder)
6. Methods return Promise<void> or this for chaining
7. Add JSDoc comments for public methods

---

# .github/prompts/fix-failure.prompt.md
---
mode: agent
description: Diagnose and fix a failing Playwright test
---

# Fix Failing Test

## Context
- Read the failing test file
- Read #terminalLastCommand for the error output
- Read the Page Object Model used by the test
- Check the target page's current HTML structure

## Diagnosis Steps
1. Identify the failing line and error type (timeout, assertion, selector)
2. Compare the selector to the actual page HTML
3. Check if the page structure changed since the test was written
4. Verify the test's assumptions about page state

## Fix Rules
- Update selectors to match current page structure
- Prefer getByRole/getByLabel over fragile selectors
- Do not add waitForTimeout — fix the root cause
- Keep the test's original intent and assertions
- If the feature changed, update assertions to match new behavior

---

# .github/instructions/playwright-tests.instructions.md
---
applyTo: "tests/**/*.spec.ts"
---

# Playwright Test Standards

- Import from @playwright/test only
- Use Page Object classes from tests/pages/
- Every test must have at least one meaningful assertion (not just toBeVisible)
- Group related assertions in test.step()
- No waitForTimeout or manual sleeps
- Tests must be independently runnable`,
      hints: [
        "Each prompt file needs the frontmatter block (---) with mode and description",
        "Test your prompts by invoking them against the products page",
        "The fix-failure prompt should reference #terminalLastCommand for error context",
      ],
      lab: createExerciseLab(
        ".github/prompts/new-e2e-test.prompt.md",
        "ls .github/prompts/ && ls .github/instructions/",
        [
          "3 prompt files exist in .github/prompts/",
          "1 scoped instructions file exists in .github/instructions/",
          "Each prompt file has valid frontmatter with mode and description",
          "Instructions file has applyTo glob targeting test specs",
          "At least one prompt was tested by invoking in Copilot Chat",
        ],
      ),
    },
    promptTemplates: [
      {
        label: "Meta: Generate a Prompt File",
        context:
          "Ask Copilot to draft a .prompt.md based on your scenario description.",
        prompt: `Generate a .prompt.md file for the following scenario:

Scenario: [DESCRIBE THE TEST GENERATION SCENARIO]
Target page: [PAGE URL]
Key elements: [LIST INTERACTIVE ELEMENTS]
Test cases: [LIST WHAT TO TEST]

The file should have:
- Frontmatter with mode: agent and a clear description
- Context section explaining what files to read
- Requirements section with numbered rules
- Locator priority section

Follow the format of existing prompt files in .github/prompts/`,
      },
    ],
    practiceLink: createPracticeLink(
      routes.products,
      "Open the products page",
      "Use the products page to test your prompt playbook files.",
    ),
    narrationScript: {
      intro:
        "Individual skill with Copilot is valuable. Team-wide standards make it sustainable. This final lesson turns everything you have learned into shareable infrastructure that works for your whole team.",
      steps: [
        {
          text: "Create your first .prompt.md file in .github/prompts/. Include the frontmatter block with mode: agent and a description. Structure the body as Context, Requirements, and Locator Priority sections.",
          duration: 18,
        },
        {
          text: "Add file-scoped instructions that apply automatically to test specs. The applyTo glob targets files matching tests/**/*.spec.ts. These rules are injected whenever Copilot touches a test file \u2014 no prompt needed.",
          duration: 16,
        },
        {
          text: "Build the governance checklist. Six items: selectors, assertions, no waits, independence, no over-engineering, prompt provenance. Add it to your PR template or review guide.",
          duration: 16,
        },
        {
          text: "Test each prompt file by invoking it in Chat against the products page. Refine based on output quality. Your best prompts will come from iteration, not upfront design.",
          duration: 14,
        },
      ],
      outro:
        "You now have a complete toolkit: configured instructions that enforce standards automatically, prompt files that produce consistent output, a review checklist that catches what AI gets wrong, and the skills to direct Copilot effectively. Welcome to Copilot-first test automation.",
    },
  },
});
