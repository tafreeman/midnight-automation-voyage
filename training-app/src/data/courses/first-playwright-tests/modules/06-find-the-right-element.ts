import {
  createExerciseLab,
  createPracticeLink,
  createSingleLessonModule,
  firstPlaywrightTestRoutes,
} from "../shared";

export const findTheRightElementModule = createSingleLessonModule({
  index: 6,
  title: "Find the Right Element",
  subtitle: "Choose locators that survive layout and styling changes",
  icon: "🎯",
  estimatedMinutes: 14,
  learningObjectives: [
    "Use a clear locator order instead of guessing with CSS",
    "Match selectors to the actual semantics of the practice app pages",
    "Refactor fragile locators into stable ones before they reach review",
  ],
  lesson: {
    title: "Find the Right Element",
    subtitle: "Choose locators that survive layout and styling changes",
    estimatedMinutes: 14,
    sections: [
      {
        type: "table",
        heading: "Locator Order for This Course",
        headers: ["Choice", "Use it when", "Example"],
        rows: [
          ["getByRole", "The element has strong accessible semantics", `page.getByRole("button", { name: "Log In" })`],
          ["getByLabel", "The form control has a visible label", `page.getByLabel("Email")`],
          ["getByTestId", "The app exposes a dedicated test handle", `page.getByTestId("search-input")`],
          ["CSS locator", "You are boxed in and documenting a cleanup target", `page.locator(".selector-you-plan-to-remove")`],
        ],
      },
      {
        type: "text",
        heading: "Use the Shape of the Page",
        content:
          "The login form gives you labeled inputs. The products page gives you data-testid handles for the search UI. The contact form gives you a mix of labels and dedicated test IDs. Stable locator work starts by noticing what the page already gives you instead of reaching for a brittle CSS path.",
      },
      {
        type: "text",
        heading: "Why Selectors Break",
        content:
          "Here is a scenario that plays out on real teams. You write 50 tests using CSS class selectors like `.btn-primary`, `.card-title`, and `.nav-link.active`. A developer redesigns the component library and renames every CSS class. All 50 tests fail. The application works perfectly — the bug is in your tests, not the product.\n\nYou spend three days updating selectors. The next sprint, the designer changes the color scheme and several class names shift again. More broken tests. More wasted time.\n\nNow imagine those same 50 tests used `getByRole('button', { name: 'Login' })` and `getByTestId('result-count')`. The redesign changes CSS classes, but the button is still a button labeled 'Login' and the result count still has its test ID. Zero tests break. Zero maintenance days lost.\n\nThis is why the locator priority exists: stable locators save future time.",
      },
      {
        type: "table",
        heading: "Maintenance Cost by Selector Type",
        headers: ["Selector Type", "Breaks When", "Maintenance Cost"],
        rows: [
          ["CSS class (`.btn-primary`)", "CSS classes are renamed or refactored", "High — every class change breaks tests"],
          ["CSS structure (`div > ul > li:nth-child(3)`)", "DOM structure changes at all", "Very high — any layout change breaks tests"],
          ["`getByTestId`", "Developer removes the `data-testid` attribute (rare)", "Low — test IDs are explicitly for testing"],
          ["`getByRole`", "Element's role or accessible name changes (very rare)", "Very low — semantic meaning rarely changes"],
        ],
      },
      {
        type: "code",
        heading: "Same Action, Better Locator",
        language: "typescript",
        code: `// Fragile
await page.locator("input").nth(0).fill("user@test.com");

// Stable
await page.getByLabel("Email").fill("user@test.com");
await page.getByTestId("search-input").fill("Widget");`,
      },
      {
        type: "callout",
        variant: "warning",
        heading: "Why CSS Falls Apart Fast",
        content:
          "A CSS locator can pass today and fail after a harmless spacing or layout change. That is extra review work the team does not need. Use it only when you are also calling out that it should be replaced.",
      },
    ],
    quiz: {
      questions: [
        {
          question: "Which locator is the strongest fit for the login email field in this practice app?",
          options: [
            `page.locator("form input").first()`,
            `page.getByRole("textbox").first()`,
            `page.getByLabel("Email")`,
            `page.locator("#email-field")`,
          ],
          correctIndex: 2,
          explanation:
            "The field has a real visible label, so getByLabel is readable and resilient. It keeps the selector tied to the user-facing meaning of the control.",
        },
        {
          question: "You wrote 50 tests using CSS class selectors. A developer renames all CSS classes during a redesign. What happens?",
          options: [
            "All 50 tests fail even though the app works correctly",
            "Only tests targeting renamed classes fail",
            "Playwright auto-heals the selectors",
            "The tests still pass because CSS is cosmetic",
          ],
          correctIndex: 0,
          explanation:
            "CSS class selectors are coupled to implementation details. When classes change, every test using them fails — even though the application behavior is unchanged. Role-based and test-ID selectors survive redesigns.",
        },
      ],
    },
    exercise: {
      title: "Replace Fragile Locators",
      description:
        "This spec uses positional selectors that will not age well. Replace them with the strongest stable locator available for each element.",
      starterCode: `import { test } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test.skip("login uses stable locators", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.locator("input").nth(0).fill(credentials.editor.email);
  await page.locator("input").nth(1).fill(credentials.editor.password);
  await page.locator("button").click();

  // TODO: replace the locators without changing the flow
});`,
      solutionCode: `import { test, expect } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test("login uses stable locators", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByLabel("Email").fill(credentials.editor.email);
  await page.getByLabel("Password").fill(credentials.editor.password);
  await page.getByRole("button", { name: "Log In" }).click();

  await expect(page.getByTestId("dashboard-heading")).toContainText("Welcome, Test User");
});`,
      hints: [
        "The login form fields both have visible labels.",
        "The submit control is a real button with visible button text.",
        "Do not change the user flow while you upgrade the selectors.",
      ],
      lab: createExerciseLab(
        "e2e/first-playwright-tests/lesson-06-fix-locators.spec.ts",
        "pnpm exec playwright test e2e/first-playwright-tests/lesson-06-fix-locators.spec.ts --project=chromium",
        [
          "The test no longer uses locator(\"input\").nth(...) or locator(\"button\").",
          "The updated spec passes after you remove test.skip.",
          "A reviewer can read the selectors and understand the page intent immediately.",
        ],
      ),
    },
    practiceLink: createPracticeLink(
      firstPlaywrightTestRoutes.products,
      "Inspect the search box and cards on the products page",
      "This page is a good contrast point because it mixes accessible structure with dedicated data-testid handles.",
    ),
    narrationScript: {
      intro:
        "Good locator choices make later lessons easier. This is where you stop treating selectors as a scavenger hunt and start treating them as part of the design of the test.",
      steps: [
        {
          text: "On the login page, start with what the user sees. Email and Password are visible labels, so those form controls already have a stable shape you can target.",
          navigateTo: "/login",
          highlight: "email-input",
          duration: 18,
        },
        {
          text: "On the products page, the search box and results also expose data-testid handles. That is a deliberate affordance for automation, and it is often the cleanest choice when the page offers it.",
          navigateTo: "/products",
          highlight: "search-input",
          duration: 20,
        },
        {
          text: "Imagine you wrote 50 tests using CSS class selectors. A developer renames the CSS classes during a redesign. All 50 tests fail, even though the app works perfectly. You spend three days fixing selectors. With getByRole and getByTestId, those same 50 tests survive the redesign untouched.",
          duration: 20,
        },
        {
          text: "What you are avoiding is positional guessing. Once a selector depends on where something happens to sit in the DOM, you have started a maintenance problem.",
          duration: 16,
        },
      ],
      outro:
        "Selectors are the coordinates. In the next lesson, you will hand those coordinates and your acceptance criteria to Copilot so it can draft something worth reviewing.",
    },
  },
});
