import {
  createSingleLessonModule,
  createPracticeLink,
  createExerciseLab,
  routes,
  credentials,
} from "../shared";

export const playwrightMcpModule = createSingleLessonModule({
  index: 7,
  title: "Playwright MCP \u2014 See What Copilot Sees",
  subtitle:
    "Give Copilot eyes on the real app through accessibility snapshots",
  icon: "\uD83D\uDC41\uFE0F",
  estimatedMinutes: 16,
  learningObjectives: [
    "Set up the Playwright MCP server in VS Code",
    "Use the two-step pattern: explore the page first, then generate tests from what MCP found",
    "Understand why accessibility snapshots produce better selectors than code-only generation",
  ],
  lesson: {
    title: "Playwright MCP \u2014 See What Copilot Sees",
    subtitle:
      "Give Copilot eyes on the real app through accessibility snapshots",
    estimatedMinutes: 16,
    sections: [
      {
        type: "text",
        heading: "The Hallucinated Selector Problem",
        content:
          "Without seeing the real page, Copilot guesses selectors from training data. It might generate getByRole('button', { name: 'Submit' }) when the actual button says \"Continue to Payment.\" With MCP, Copilot connects to a real browser, takes an accessibility snapshot, and sees the actual roles, labels, and text. Hallucinated selectors become a thing of the past.",
      },
      {
        type: "code",
        heading: "Set Up Playwright MCP",
        language: "jsonc",
        code: `// .vscode/mcp.json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "type": "stdio"
    }
  }
}

// One-line install alternative:
// code --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp@latest"]}'

// After adding the config, open Copilot Chat in Agent mode
// and click the tools icon to verify Playwright tools appear:
// browser_navigate, browser_snapshot, browser_click, etc.`,
      },
      {
        type: "text",
        heading: "Accessibility Snapshots vs Screenshots",
        content:
          "MCP provides the accessibility tree, not pixels. The AI receives semantic data: ARIA roles, states, labels, text content. This means: (1) No vision model needed \u2014 works with any LLM. (2) Selectors from a11y data are inherently getByRole-based. (3) More reliable than trying to parse a screenshot. (4) Faster and cheaper \u2014 text data is smaller than images. The accessibility tree is what screen readers see \u2014 if your test can find an element in the tree, a user with assistive technology can find it too.",
      },
      {
        type: "code",
        heading: "The Two-Step Pattern",
        language: "text",
        code: `Step 1 \u2014 Explore:
"Use the Playwright MCP tools to navigate to http://localhost:5173/admin
and take an accessibility snapshot. I need to understand the page
structure before writing a test."

Step 2 \u2014 Generate:
"Based on the accessibility snapshot you just captured, generate a
Playwright TypeScript test for the admin user management page.
Use the exact roles and names you found in the snapshot.
Test: verify that non-admin users see an access denied message.
Test: admin users see the user table with role column."`,
      },
      {
        type: "table",
        heading: "Accuracy by Generation Approach",
        headers: ["Approach", "Selector Accuracy", "Speed", "Best For"],
        rows: [
          [
            "Playwright Codegen",
            "Highest \u2014 records real interactions",
            "Fastest",
            "Initial flow capture \u2014 you perform the actions",
          ],
          [
            "MCP Snapshot",
            "High \u2014 sees real DOM",
            "Fast",
            "AI-driven generation \u2014 you describe the flow in words",
          ],
          [
            "Copilot Without Context",
            "Low \u2014 guesses from training data",
            "Fastest",
            "Only when instructions file + exemplar tests provide strong patterns",
          ],
        ],
      },
      {
        type: "callout",
        variant: "tip",
        heading: "When MCP Beats Codegen",
        content:
          "Codegen requires you to manually perform the flow. MCP lets you describe the flow in natural language and Copilot performs it through the browser. MCP is better for: complex flows you'd need to set up manually, error states you can't easily trigger by clicking, pages that require specific API setup or auth roles (like admin-only pages), testing what happens after 5 failed login attempts (lockout).",
      },
    ],
    quiz: {
      questions: [
        {
          question:
            "Why do accessibility snapshots produce better selectors than asking Copilot to guess?",
          options: [
            "Snapshots are faster to process",
            "Snapshots show the actual ARIA roles, labels, and states \u2014 Copilot generates getByRole selectors that match the real page",
            "Snapshots include CSS class names",
            "Snapshots work offline",
          ],
          correctIndex: 1,
          explanation:
            "Accessibility snapshots provide the semantic structure of the page: roles, names, states, and text content. Selectors generated from this data are inherently role-based and match the actual page.",
        },
        {
          question:
            "In the two-step MCP pattern, why explore before generating?",
          options: [
            "MCP requires a warmup step",
            "Exploring gives Copilot the real page structure so it does not hallucinate selectors",
            "The explore step installs browser dependencies",
            "Exploring is optional but makes tests run faster",
          ],
          correctIndex: 1,
          explanation:
            "Without the explore step, Copilot guesses selectors from code context alone. The accessibility snapshot from the explore step gives it the actual page structure, eliminating hallucinated selectors.",
        },
      ],
    },
    exercise: {
      title: "MCP: Generate From a Live Page",
      description:
        "Configure Playwright MCP in your VS Code workspace. Use the two-step pattern to generate a test for the /admin page. First, have MCP navigate and take a snapshot. Then generate a test that checks: non-admin users see access denied, admin users see the user management table.",
      starterCode: `// .vscode/mcp.json
{
  "servers": {
    // TODO: Add the Playwright MCP server configuration here.
    // Command: "npx"
    // Args: ["@playwright/mcp@latest"]
    // Type: "stdio"
  }
}

// e2e/copilot-first-testing/lesson-07-admin-mcp.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Admin Page \u2014 MCP Generated", () => {
  // TODO: Use the two-step MCP pattern in Copilot Agent mode:
  // Step 1: Have MCP navigate to /admin and take an accessibility snapshot.
  // Step 2: Generate tests from the snapshot.
  //
  // Test 1: Non-admin users see access denied
  // Test 2: Admin users see the user management table
});`,
      solutionCode: `// .vscode/mcp.json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "type": "stdio"
    }
  }
}

// e2e/copilot-first-testing/lesson-07-admin-mcp.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Admin Page \u2014 MCP Generated", () => {
  test("non-admin user sees access denied", async ({ page }) => {
    // Use editor credentials (non-admin role)
    await page.goto("/login");
    await page.getByLabel("Email").fill("${credentials.editor.email}");
    await page.getByLabel("Password").fill("${credentials.editor.password}");
    await page.getByRole("button", { name: "Log In" }).click();
    await expect(page).toHaveURL(/dashboard/);

    await page.goto("/admin");
    await expect(page.getByRole("alert")).toContainText("Access Denied");
  });

  test("admin user sees user management table", async ({ browser }) => {
    // Use storageState for admin auth
    const context = await browser.newContext({
      storageState: ".auth/admin.json",
    });
    const page = await context.newPage();

    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: "User Management" })
    ).toBeVisible();

    const table = page.getByRole("table");
    await expect(table).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Role" })
    ).toBeVisible();

    await context.close();
  });
});`,
      hints: [
        "After adding mcp.json, restart VS Code or reload the window for MCP to activate",
        "Use Agent mode in Copilot Chat \u2014 MCP tools only work in agent mode",
        "The admin page requires admin credentials \u2014 use storageState from .auth/admin.json",
      ],
      lab: createExerciseLab(
        "e2e/copilot-first-testing/lesson-07-admin-mcp.spec.ts",
        "pnpm exec playwright test e2e/copilot-first-testing/lesson-07-admin-mcp.spec.ts --project=chromium",
        [
          "MCP server configured in .vscode/mcp.json",
          "Test generated using the two-step pattern (explore then generate)",
          "Non-admin access test checks for access denied message",
          "Admin test verifies user table is visible with correct structure",
        ],
      ),
    },
    promptTemplates: [
      {
        label: "MCP: Explore and Generate",
        context:
          "Two-step template for generating tests from any page using MCP.",
        prompt: `Step 1 \u2014 Explore:
Use the Playwright MCP tools to navigate to [URL] and take an accessibility snapshot. Describe what you find: interactive elements, headings, form fields, buttons.

Step 2 \u2014 Generate:
Based on the snapshot, generate a Playwright TypeScript test.
Use the exact roles and names from the snapshot.
Tests:
1. [TEST SCENARIO 1]
2. [TEST SCENARIO 2]

Use getByRole selectors matching the snapshot.
No waitForTimeout. No CSS selectors.`,
      },
      {
        label: "MCP: Error State Testing",
        context:
          "Use MCP to test error conditions that are hard to trigger manually.",
        prompt: `Use Playwright MCP to navigate to [URL].
Do NOT log in \u2014 access the page without authentication.
Take a snapshot of what appears.

Generate a test that verifies:
1. Unauthenticated access shows [EXPECTED ERROR/REDIRECT]
2. The error message content is [EXPECTED TEXT]

Then log in as admin and take a new snapshot.
Generate a test verifying admin access shows [EXPECTED CONTENT].`,
      },
    ],
    practiceLink: createPracticeLink(
      routes.admin,
      "Open the admin page",
      `You will need admin credentials (${credentials.admin.email} / ${credentials.admin.password}) to see the full page.`,
    ),
    narrationScript: {
      intro:
        "Until now, Copilot generated selectors from code context \u2014 your instructions file, open tabs, and pattern matching. MCP changes the game: it connects Copilot to a real browser so it can see the actual page.",
      steps: [
        {
          text: "Add the Playwright MCP configuration to your .vscode/mcp.json file. This tells VS Code to start the MCP server when you use Copilot Chat in Agent mode.",
          duration: 16,
        },
        {
          text: "Switch to Agent mode in Copilot Chat. Use the explore step first: have MCP navigate to the admin page and take an accessibility snapshot. Read what it finds \u2014 the roles, labels, and states it reports are exactly what your selectors will target.",
          duration: 20,
        },
        {
          text: "Now generate. Ask Copilot to write a test based on the snapshot it just captured. The selectors will use the exact roles and names from the real page, not guesses.",
          duration: 16,
        },
        {
          text: "Compare MCP-generated selectors to what Copilot produced in earlier modules without MCP. The difference in accuracy is the reason this tool exists.",
          duration: 12,
        },
      ],
      outro:
        "MCP eliminates the hallucinated selector problem. Combined with agent mode, you can direct Copilot to explore your app, understand its structure, and generate tests \u2014 all from natural language. Next: generating Page Objects and multi-file test structures.",
    },
  },
});
