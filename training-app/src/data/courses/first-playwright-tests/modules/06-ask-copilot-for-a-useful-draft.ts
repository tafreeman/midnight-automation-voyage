import {
  createExerciseLab,
  createPracticeLink,
  createSingleLessonModule,
  firstPlaywrightTestRoutes,
} from "../shared";

export const askCopilotForAUsefulDraftModule = createSingleLessonModule({
  index: 6,
  title: "Ask Copilot for a Useful Draft",
  subtitle: "Use PAGE prompts so the generated test starts close to reviewable",
  icon: "📝",
  estimatedMinutes: 10,
  learningObjectives: [
    "Use a prompt frame that gives Copilot the page, actions, guardrails, and evidence to target",
    "Keep the generated output grounded in selectors and acceptance criteria from the practice app",
    "Review AI output as a first draft instead of a finished answer",
  ],
  lesson: {
    title: "Ask Copilot for a Useful Draft",
    subtitle: "Use PAGE prompts so the generated test starts close to reviewable",
    estimatedMinutes: 10,
    sections: [
      {
        type: "text",
        heading: "Use PAGE, Not Vibes",
        content:
          "This course uses a prompt shape called PAGE: Page, Actions, Guardrails, Evidence. The point is not to sound clever. The point is to hand Copilot the same factual inputs a reviewer will use later, so the draft starts from the real test target and the real acceptance criteria.",
      },
      {
        type: "table",
        heading: "The PAGE Prompt Shape",
        headers: ["Part", "What belongs there", "Products-page example"],
        rows: [
          ["Page", "Where the flow starts and what UI is on screen", "Products page with search input, search button, and result cards"],
          ["Actions", "What the user does", "Search for Widget and submit the query"],
          ["Guardrails", "Rules the test must obey", "Use Playwright Test, use stable selectors, avoid waitForTimeout"],
          ["Evidence", "What must be proven after the action", "Result count updates and visible cards contain Widget"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        heading: "Guardrails Are Not Optional",
        content:
          "If you leave out the rules, Copilot will happily invent brittle selectors, weak assertions, or unnecessary waits. Be explicit before the draft is written instead of cleaning up preventable mistakes later.",
      },
    ],
    quiz: {
      questions: [
        {
          question: "In the PAGE prompt model, what belongs in Evidence?",
          options: [
            "The steps the user clicks through",
            "The selectors available on the page",
            "The proof the finished test must check",
            "The extension names installed in VS Code",
          ],
          correctIndex: 2,
          explanation:
            "Evidence is where you define what the test has to prove after the action. It is the assertion target, not the setup or the clicks.",
        },
      ],
    },
    exercise: {
      title: "Draft a Search Test With PAGE",
      description:
        "Use the PAGE structure to turn product-search acceptance criteria into a Playwright draft. Then tighten the resulting spec so it proves the search worked.",
      starterCode: `import { test } from "@playwright/test";
import { gotoRoute } from "../support/practice";

test.skip("search returns matching widget products", async ({ page }) => {
  await gotoRoute(page, "/products");

  // TODO: ask Copilot for a draft using a PAGE prompt
  // TODO: fill the search input with "Widget"
  // TODO: submit the search
  // TODO: prove the result count and visible cards match the query
});`,
      solutionCode: `import { test, expect } from "@playwright/test";
import { gotoRoute } from "../support/practice";

test("search returns matching widget products", async ({ page }) => {
  await gotoRoute(page, "/products");
  await page.getByTestId("search-input").fill("Widget");
  await page.getByTestId("search-button").click();

  await expect(page.getByTestId("result-count")).toContainText("6 results found");
  const cards = page.getByTestId("result-card");
  await expect(cards).toHaveCount(6);
  await expect(cards.first()).toContainText("Widget");
});`,
      hints: [
        "Name the exact test IDs in the prompt so Copilot does not guess.",
        "Ask for both the action and the proof in the same prompt.",
        "Review the draft and replace any vague assertion with the actual result-count check.",
      ],
      lab: createExerciseLab(
        "e2e/first-playwright-tests/lesson-06-products-search-draft.spec.ts",
        "npx playwright test e2e/first-playwright-tests/lesson-06-products-search-draft.spec.ts --project=chromium",
        [
          "The draft is rewritten into a passing Playwright test without test.skip.",
          "The spec checks both the count text and at least one visible matching card.",
          "The finished version uses stable selectors and no arbitrary waits.",
        ],
      ),
    },
    promptTemplates: [
      {
        label: "PAGE: Products Search",
        context: "Use this as the first pass for a generated product-search test.",
        prompt: `Page:
Products page in the practice app. Search field: search-input. Submit button: search-button. Results text: result-count. Product cards: result-card.

Actions:
Open the page, search for "Widget", and submit the search.

Guardrails:
Use Playwright Test with TypeScript.
Use getByTestId selectors.
Do not use waitForTimeout.

Evidence:
Assert the result count updates to 6 results found and the visible cards include the word "Widget".`,
      },
      {
        label: "Tighten a Draft",
        context: "Use this after Copilot gives you a first draft that still feels loose.",
        prompt: `Please tighten this Playwright draft.

Requirements:
- keep the same user flow
- replace weak selectors with the exact test IDs I provide
- add assertions that directly prove the acceptance criteria
- remove any unnecessary waits or comments

Draft:
[PASTE TEST HERE]`,
      },
    ],
    practiceLink: createPracticeLink(
      firstPlaywrightTestRoutes.products,
      "Open the products page before you write the PAGE prompt",
      "Use the page itself to confirm the selectors and the visible evidence you want the generated test to prove.",
    ),
    narrationScript: {
      intro:
        "Copilot is most useful when you treat it like a fast first-draft partner. This lesson gives it a clear brief instead of a vague wish.",
      steps: [
        {
          text: "Start on the products page. You can see the search input, button, result count, and product cards that the test needs to reference.",
          navigateTo: "/products",
          highlight: "search-input",
          duration: 18,
        },
        {
          text: "The PAGE structure keeps the prompt anchored. Page and Actions describe the flow. Guardrails and Evidence tell Copilot what a reviewer will insist on later.",
          duration: 18,
        },
        {
          text: "When the draft comes back, read it like evidence. Are the selectors real? Does the proof match the product-search behavior? If not, tighten it before you run it.",
          highlight: "result-count",
          duration: 20,
        },
      ],
      outro:
        "The next lesson shifts from text prompts to recorded browser actions. You will let VS Code capture the flow and then save that output in the right place.",
    },
  },
});
