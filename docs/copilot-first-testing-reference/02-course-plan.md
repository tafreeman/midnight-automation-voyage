# Course Plan: Copilot-First Test Automation

> **Status:** PLAN — awaiting approval before implementation
>
> **Course ID:** `course-copilot-first-testing`
>
> **Directory:** `training-app/src/data/courses/copilot-first-testing/`
>
> **Format:** Follows `first-playwright-tests` course pattern exactly (shared.ts helpers, createSingleLessonModule, buildStandaloneCourse)

---

## Requirements Restatement

Build a 10-module training course that teaches manual testers to use **GitHub Copilot as the primary test author** with the human as reviewer/director. This inverts the framing of Course 1 ("First Playwright Tests") where the human writes tests with Copilot as helper.

**Audience:** Manual testers who have completed Course 1 or have basic Playwright familiarity. They have a GitHub Copilot subscription and VS Code installed.

**Key reframe:** You don't need to memorize Playwright APIs. You need to learn how to **direct Copilot** to write correct, maintainable tests — and how to **review and fix** what it produces.

**Grounded in:**
- Knowledge base research: `docs/copilot-playwright-knowledge-base.md` (1,073 lines, 50+ sources)
- Existing Course 1 modules 06-10 (selectors, PAGE/CARD, recording, refining, test packs)
- Legacy modules 04, 06, 07, 08, 11, 28 (Copilot prompt engineering, templates, MCP)
- Onboarding deck (AI-assisted dev workflow, Playwright, prompt engineering)
- GenAI advocacy deck (prompt standardization, context engineering, governance)

---

## What's New vs. What's Reused

### Content from Course 1 that this course BUILDS ON (not duplicates)

| Course 1 Module | What it taught | How this course advances it |
| --- | --- | --- |
| 06: Find the Right Element | Locator hierarchy (getByRole > getByLabel > getByTestId) | Teaching Copilot the hierarchy via `copilot-instructions.md` so YOU don't have to fix selectors |
| 07: Ask Copilot for a Useful Draft | PAGE/CARD prompt frameworks, Chat commands | Upgraded PAGE prompts, comment-driven autocomplete, seed test pattern, prompt files |
| 08: Record a Login Flow | `playwright codegen` recording | MCP-first workflow as alternative to codegen |
| 09: Tighten the Recording | Refine selectors, add assertions, remove waits | Iterative fix loop with Copilot (CHATREPAIR pattern, 3-iteration rule) |
| 10: Build Your First Test Pack | Two independent tests, clean report | Multi-file generation with Copilot Edits, POM + test together |

### Content from Legacy Modules that this course INCORPORATES

| Legacy Module | What it taught | How it maps here |
| --- | --- | --- |
| 11: Prompt Template Library | 7 scenario templates with [BRACKETED] placeholders | Evolved into `.prompt.md` reusable files (Module 10) |
| 28: MCP/AI Agents | Planner/Generator/Healer concepts, governance | Hands-on MCP setup + agent mode (Modules 6-7) |
| Onboarding deck | Three roles (Playwright=execution, Copilot=authoring, You=judgment) | Reinforced throughout — the course's core mental model |

### Genuinely NEW content (from knowledge base research)

| Topic | Source | Module |
| --- | --- | --- |
| `.github/copilot-instructions.md` | GitHub docs, awesome-copilot | Module 2 |
| `testGeneration.instructions` VS Code setting | VS Code docs | Module 2 |
| File-scoped `.instructions.md` | VS Code docs | Module 10 |
| Reusable `.prompt.md` files | VS Code prompt files docs | Module 10 |
| Copilot Agent Mode (autonomous loop) | VS Code agent mode blog | Module 6 |
| Copilot Edits (multi-file) | Copilot Edits docs | Module 8 |
| Copilot Vision (screenshot → test) | Copilot Chat vision | Module 8 |
| Playwright MCP server setup | microsoft/playwright-mcp | Module 7 |
| Accessibility snapshots for selectors | Playwright MCP docs | Module 7 |
| CHATREPAIR iterative fix pattern | arXiv research | Module 5 |
| 8 common LLM anti-patterns | Checkly, TestDino, research | Module 9 |
| Assertion trap at scale (mutation testing) | arXiv:2511.21382 | Module 9 |
| Seed test pattern | Playwright test agents docs | Module 4 |
| Two-step MCP pattern (explore → generate) | Checkly blog, Debbie O'Brien | Module 7 |
| Team prompt playbook as `.prompt.md` | GitHub 5-tips blog | Module 10 |

---

## Course Outline: 10 Modules

### Module 1: The Copilot-First Mindset

**Subtitle:** Stop typing tests — start directing them

**Estimated time:** 10 minutes

**Learning Objectives:**
- Distinguish "Copilot helps me code" from "Copilot writes, I review"
- Name the three roles in AI-assisted testing (Playwright = execution, Copilot = authoring, You = judgment)
- Describe the Generate → Review → Run → Fix loop as the core workflow

**Sections:**

| # | Type | Heading | Content Summary |
| --- | --- | --- | --- |
| 1 | text | Two Ways to Use an AI | "Helper mode" (you write, Copilot completes) vs "Director mode" (Copilot writes, you review). This course teaches director mode. |
| 2 | table | Three Roles, Clear Boundaries | Reuses onboarding deck's Playwright/Copilot/You model. Playwright = execution engine. Copilot = draft author. You = judgment, acceptance criteria, review. |
| 3 | text | The Generate → Review → Run → Fix Loop | The core workflow diagram from knowledge base Section 1. Not one-shot — iterative. Quality of context determines quality of output. |
| 4 | callout (info) | What This Course Assumes | Completed Course 1 or equivalent. Copilot subscription active. VS Code with Playwright extension. Practice app running locally. |
| 5 | table | What Changes From Course 1 | Side-by-side: Course 1 (you write test, Copilot suggests lines) vs This Course (you describe intent, Copilot writes test, you review and fix). |

**Quiz:**
1. "In 'director mode', who writes the first draft of the test?" → Copilot, based on your structured prompt
2. "After Copilot generates a test that runs but has wrong assertions, what's the next step?" → Feed the specific failure back to Copilot with context (not rewrite manually)

**Exercise:**
- **Title:** "Generate Your First Directed Test"
- **Difficulty:** Beginner
- **Description:** Open Copilot Chat and paste a structured prompt describing the login page. Don't write any code yourself — let Copilot generate the entire test. Run it. Note what passed and what failed.
- **Starter code:** Empty spec file with only the import line
- **Solution code:** Complete login test generated from prompt
- **Practice link:** Login page

**Prompt Templates:**
1. "Director Mode: Login Test" — Full prompt that produces a complete login test from zero code

**Narration:**
- Intro: "This course flips the script. Instead of learning Playwright syntax and using Copilot to fill in blanks, you'll learn to direct Copilot to write entire tests — then review what it produces like a code reviewer."
- Steps: (3 steps covering the three roles, the loop, and the mindset shift)
- Outro: "With the mindset in place, the next lesson sets up the configuration that makes Copilot consistently produce good output."

---

### Module 2: Configure Your AI Testing Toolkit

**Subtitle:** Set up the files that make Copilot follow your rules automatically

**Estimated time:** 14 minutes

**Learning Objectives:**
- Create a `.github/copilot-instructions.md` that enforces your team's Playwright conventions
- Configure `testGeneration.instructions` in VS Code settings for test-specific rules
- Structure a project so Copilot finds exemplar tests and follows their patterns

**Sections:**

| # | Type | Heading | Content Summary |
| --- | --- | --- | --- |
| 1 | text | Why Configuration Beats Repetition | Without instructions, you repeat "use getByRole" in every prompt. With `copilot-instructions.md`, it's automatic. From knowledge base: "2-3 well-written example tests is more effective than lengthy instructions alone." |
| 2 | code | Your First copilot-instructions.md | Complete example from knowledge base Section 3.1, adapted for practice app conventions. Includes locator hierarchy, test structure, naming, and DO NOT rules. |
| 3 | code | VS Code Settings for Test Generation | `testGeneration.instructions` and `codeGeneration.instructions` settings from knowledge base Section 3.2. |
| 4 | text | Project Structure That Helps Copilot | The directory layout from knowledge base Section 3.4. Exemplar tests, POM directory, fixtures, mocks. |
| 5 | callout (tip) | The Exemplar Test Trick | Keep your best test open in a split pane. Copilot reads open files and mimics their patterns. |
| 6 | table | Before and After: Copilot Output Quality | Side-by-side showing Copilot output WITHOUT instructions (CSS selectors, waitForTimeout) vs WITH instructions (getByRole, proper assertions). |

**Quiz:**
1. "Where does `.github/copilot-instructions.md` get its power?" → It's automatically appended to every Copilot Chat request in the repo
2. "What's more effective than a long instructions file?" → Having 2-3 well-written exemplar test files that Copilot can learn from

**Exercise:**
- **Title:** "Create Your Instructions File"
- **Difficulty:** Beginner
- **Description:** Create `.github/copilot-instructions.md` for the practice app workspace. Include the locator hierarchy, test structure rules, and DO NOT list. Then generate the same login test from Module 1 — compare the output quality.
- **Starter code:** Empty markdown file with section headers
- **Solution code:** Complete instructions file matching practice app conventions
- **Practice link:** Login page (for testing output quality comparison)

**Prompt Templates:**
1. "Generate copilot-instructions.md" — Meta-prompt: ask Copilot to draft its own instructions file based on your existing tests

**Narration:**
- Intro: "Every prompt you've written in Course 1 included rules like 'use getByRole' and 'no waitForTimeout'. This lesson makes those rules automatic."
- Steps: (4 steps: create file, configure VS Code, observe difference, understand exemplar pattern)
- Outro: "With the toolkit configured, every Copilot interaction in this project follows your standards. Next: putting it to work with Chat-driven generation."

---

### Module 3: Chat-Driven Test Generation

**Subtitle:** Use Copilot Chat to generate complete tests from structured descriptions

**Estimated time:** 16 minutes

**Learning Objectives:**
- Use Copilot Chat with `@workspace`, `#file`, and `#selection` to provide rich context
- Generate a complete test for a practice app page using a single Chat prompt
- Compare output from `/tests` command vs freeform Chat prompts

**Sections:**

| # | Type | Heading | Content Summary |
| --- | --- | --- | --- |
| 1 | table | Chat Context Variables | `@workspace` (project-wide), `#file:path` (specific file), `#selection` (highlighted code), `#terminalLastCommand` (terminal output). From knowledge base Section 2.2. |
| 2 | text | The /tests Command | Select code → type `/tests`. Quick but limited — works best for unit-adjacent tests. For E2E, freeform Chat with context is better. |
| 3 | code | A Complete Chat Prompt | Full prompt for generating a products search test, referencing practice app selectors and using `#file` for context. |
| 4 | text | Reading and Reviewing the Output | What to check: selector choices, assertion correctness, test isolation, no anti-patterns. Apply the same HITL checklist from legacy Module 28. |
| 5 | code | A Better Prompt With @workspace | Same scenario but using `@workspace` to let Copilot discover patterns from your codebase. Compare: more context = better output. |
| 6 | callout (warning) | The Assertion Trap | Direct reuse from Course 1 Module 07 and legacy Module 06: "Copilot generates syntactically valid assertions that may test the wrong thing." Always verify against acceptance criteria. |

**Quiz:**
1. "What does `#file:tests/e2e/auth.spec.ts` do in a Chat prompt?" → Includes that specific file as context so Copilot can follow its patterns
2. "Why is freeform Chat often better than `/tests` for E2E test generation?" → You can provide page context, acceptance criteria, and patterns — `/tests` only sees the selected code

**Exercise:**
- **Title:** "Generate a Contact Form Test via Chat"
- **Difficulty:** Beginner (generate), Intermediate (review and fix)
- **Description:** Write a Chat prompt that generates a complete test for the /contact page. Include: fields to fill, validation rules, success criteria. Don't write any test code yourself. Run the generated test. Fix any failures by re-prompting (not manual editing).
- **Starter code:** Empty spec file
- **Solution code:** Complete contact form test with happy path + validation tests
- **Practice link:** Contact page

**Prompt Templates:**
1. "Contact Form: Full Generation" — Chat prompt for contact page test
2. "Products Search: With @workspace" — Chat prompt using workspace context

**Narration:**
- Intro: "This is where the director workflow becomes real. You describe what to test, Copilot writes it, you run and review."
- Steps: (4 steps: write prompt, generate, run, review output against acceptance criteria)
- Outro: "Chat-driven generation works well for individual tests. Next: the PAGE framework makes your prompts consistently produce better output."

---

### Module 4: PAGE Prompts, Upgraded

**Subtitle:** Structured prompts that produce reviewable first drafts every time

**Estimated time:** 14 minutes

**Learning Objectives:**
- Write PAGE prompts that include practice app selectors, acceptance criteria, and anti-pattern rules
- Use comment-driven autocomplete to guide inline Copilot suggestions
- Apply the "seed test" pattern: one excellent test that teaches Copilot your style

**Sections:**

| # | Type | Heading | Content Summary |
| --- | --- | --- | --- |
| 1 | text | PAGE Review | Quick recap from Course 1 Module 07: Page, Actions, Guardrails, Evidence. But now used in Chat, not just as mental model. |
| 2 | code | An Upgraded PAGE Prompt | Enhanced version with explicit selectors from practice app, assertion types specified, anti-patterns listed in Guardrails. From knowledge base Section 4.1. |
| 3 | text | Comment-Driven Autocomplete | Write a `test.describe` block with descriptive comments before each `test()`. Copilot autocompletes from the comments + open files. From knowledge base Section 4.3. |
| 4 | code | The Seed Test Pattern | Write one excellent test manually (or generate + perfect it). Open it in a split pane. All subsequent generated tests follow its patterns. From knowledge base Section 7.2 (Playwright test agents). |
| 5 | table | Prompt Quality vs Output Quality | Shows 3 prompts (vague, structured, PAGE with seed test) and resulting output quality (broken selectors → OK but missing edge cases → production-ready). |
| 6 | callout (tip) | The CARD Alternative for Complex Flows | Brief mention: for multi-step wizards (checkout), CARD adds Data dimension. Reference Course 1 Module 07 for details. |

**Quiz:**
1. "In the seed test pattern, why do you keep an excellent test open in a split pane?" → Copilot reads open files and mimics their patterns for all subsequent generations
2. "What goes in the Guardrails section of a PAGE prompt?" → Rules the test must obey: selector strategy, no waits, patterns to follow, anti-patterns to avoid

**Exercise:**
- **Title:** "Seed Test + PAGE Generation"
- **Difficulty:** Intermediate
- **Description:** First, perfect the login test from Module 1 as your "seed test" (fix selectors, add assertions, use test.step). Then use a PAGE prompt in Chat to generate an orders table test — with the seed test open. Compare output quality with and without the seed test visible.
- **Starter code:** Rough login test (seed candidate) + empty orders spec
- **Solution code:** Perfected seed test + generated orders test that follows the same patterns
- **Practice link:** Orders page

**Prompt Templates:**
1. "PAGE: Orders Table" — Sorting, filtering, pagination
2. "PAGE: Settings Page" — Tab navigation, form updates, notifications

---

### Module 5: The Review-Run-Fix Loop

**Subtitle:** Turn failing AI-generated tests into passing ones without rewriting them

**Estimated time:** 16 minutes

**Learning Objectives:**
- Feed test failures back to Copilot using `#terminalLastCommand` and structured error descriptions
- Apply the 3-iteration rule: if it's not fixed in 3 rounds, the prompt needs restructuring
- Distinguish between fixable failures (wrong selector, timing issue) and prompt failures (wrong approach)

**Sections:**

| # | Type | Heading | Content Summary |
| --- | --- | --- | --- |
| 1 | text | The Loop in Practice | Generate → Review → Run → see failure → feed error back → Copilot fixes → run again. From knowledge base Section 1. |
| 2 | table | Failure Types and Fix Strategies | TimeoutError (wrong selector → provide accessibility snapshot), Strict mode (ambiguous locator → ask which element), Assertion mismatch (wrong expectation → clarify acceptance criteria). From knowledge base Section 6.2. |
| 3 | code | Feeding Errors Back | Three example prompts using `#terminalLastCommand` for each failure type. From knowledge base CHATREPAIR pattern. |
| 4 | text | The 3-Iteration Rule | Research finding: beyond 3 fix attempts, the LLM makes lateral changes rather than converging. If stuck after 3: restructure the prompt, add more context, or break the test into smaller pieces. |
| 5 | callout (warning) | When to Stop and Rethink | Signs the prompt is wrong (not just the test): Copilot keeps changing unrelated code, fixes break other assertions, the test gets longer each iteration. |
| 6 | text | Fix via Re-Prompt, Not Manual Edit | The discipline: resist editing the code yourself. Instead, improve your prompt. This builds the skill that scales. Exception: obvious typos or one-character fixes. |

**Quiz:**
1. "A generated test fails with TimeoutError on `getByRole('button', { name: 'Submit' })`. What's the best next step?" → Ask Copilot what button elements exist on the page, providing the error output as context
2. "You've tried 3 iterations of fixing a generated test and it's still failing differently each time. What should you do?" → Restructure the prompt — add more context, break the test into smaller pieces, or try a different approach

**Exercise:**
- **Title:** "Fix a Failing Generated Test"
- **Difficulty:** Intermediate
- **Description:** A pre-generated test for the checkout flow has 3 intentional failures (wrong selector, missing wait for navigation, assertion checking wrong text). Use the Review-Run-Fix loop with Copilot Chat to fix all 3 without editing code manually. Track how many iterations each fix takes.
- **Starter code:** Checkout test with 3 intentional failures
- **Solution code:** Fixed test with all 3 issues resolved
- **Practice link:** Checkout shipping page

**Prompt Templates:**
1. "Fix: TimeoutError" — Template for selector-not-found errors
2. "Fix: Assertion Mismatch" — Template for wrong-value assertions

---

### Module 6: Copilot Agent Mode

**Subtitle:** Let Copilot generate, run, and fix tests autonomously

**Estimated time:** 14 minutes

**Learning Objectives:**
- Use Copilot Agent Mode to generate a test, run it, and auto-fix failures in a single autonomous loop
- Set boundaries for agent mode: what it should and shouldn't do autonomously
- Review agent mode output using the same HITL checklist as manually-prompted tests

**Sections:**

| # | Type | Heading | Content Summary |
| --- | --- | --- | --- |
| 1 | text | What Agent Mode Does Differently | Chat = you prompt, it responds. Agent = you describe the goal, it works autonomously (reads files, runs terminal, fixes errors, re-runs). From knowledge base Section 2.4. |
| 2 | text | When to Use Agent Mode | Good: "Write a test for /products, run it, fix any failures." Bad: "Rewrite all our tests to use POM." Agent mode is best for bounded, single-page tasks. From legacy Module 28 governance. |
| 3 | code | An Agent Mode Prompt | Full prompt for generating + running a settings page test. Includes boundaries: "Only modify files in tests/e2e/. Do not change application source." |
| 4 | table | Agent Mode vs Chat: Trade-offs | Agent: autonomous, runs terminal, iterates automatically. Chat: interactive, you control each step, better for learning. |
| 5 | text | Reviewing Agent Output | Same HITL checklist from legacy Module 28: selectors stable? Assertions meaningful? No hidden waits? No over-engineering? |
| 6 | callout (warning) | The Over-Engineering Trap | From knowledge base Section 9: "Copilot tends to create unnecessarily complex abstractions when simpler structure suffices." Watch for unnecessary POM classes, helper functions, and config that a simple test doesn't need. |

**Quiz:**
1. "What's the key difference between Chat mode and Agent mode?" → Agent mode can autonomously run terminal commands, read output, and iterate — Chat requires you to copy/paste each step
2. "Why should you set boundaries in an agent mode prompt?" → Without boundaries, agent mode may modify application source code, create unnecessary files, or over-engineer the solution

**Exercise:**
- **Title:** "Agent Mode: Settings Page Test"
- **Difficulty:** Intermediate
- **Description:** Switch to Agent Mode. Give it a bounded prompt to generate a test for the /settings page (tab navigation, profile update). Let it run and self-fix. Review the output. Count how many iterations it needed. Compare the output to what you'd get from Chat.
- **Starter code:** None (agent generates from scratch)
- **Solution code:** Complete settings test covering tabs + profile update
- **Practice link:** Settings page

**Prompt Templates:**
1. "Agent Mode: Bounded Test Generation" — Template with explicit boundaries and success criteria

---

### Module 7: Playwright MCP — See What Copilot Sees

**Subtitle:** Give Copilot eyes on the real app through accessibility snapshots

**Estimated time:** 16 minutes

**Learning Objectives:**
- Set up the Playwright MCP server in VS Code
- Use the two-step pattern: explore the page first, then generate tests from what MCP found
- Understand why accessibility snapshots produce better selectors than code-only generation

**Sections:**

| # | Type | Heading | Content Summary |
| --- | --- | --- | --- |
| 1 | text | The Hallucinated Selector Problem | Without MCP, Copilot guesses selectors from training data. With MCP, it sees the actual accessibility tree. From knowledge base Section 6.1 (anti-pattern #4). |
| 2 | code | Set Up Playwright MCP | `.vscode/mcp.json` config from knowledge base Section 7.1. One-line install command. Verify tools available in Chat. |
| 3 | text | Accessibility Snapshots vs Screenshots | MCP provides semantic data (ARIA roles, states, text) not pixels. No vision model needed. Selectors generated from a11y data are inherently role-based. |
| 4 | code | The Two-Step Pattern | Step 1: "Navigate to /products and take an accessibility snapshot." Step 2: "Based on that snapshot, generate a test for the search flow." From knowledge base Section 15 and Checkly research. |
| 5 | table | Accuracy by Approach | Codegen: highest (real interactions). MCP snapshot: high (real DOM). Copilot without context: low (hallucinated selectors). From knowledge base Section 15. |
| 6 | callout (tip) | When MCP Beats Codegen | Codegen requires you to manually perform the flow. MCP lets you describe the flow in natural language and Copilot performs it. Better for: complex flows, flows requiring API setup, testing error states you can't easily trigger manually. |

**Quiz:**
1. "Why do accessibility snapshots produce better selectors than asking Copilot to guess?" → Snapshots show the actual ARIA roles, labels, and states — Copilot generates getByRole selectors that match the real page
2. "In the two-step MCP pattern, why explore before generating?" → Exploring gives Copilot the real page structure so it doesn't hallucinate selectors

**Exercise:**
- **Title:** "MCP: Generate From a Live Page"
- **Difficulty:** Intermediate (setup + generation), Advanced (error path testing)
- **Description:** Configure Playwright MCP. Use the two-step pattern to generate a test for the /admin page (which requires admin login). First, have MCP navigate and snapshot. Then generate a test including the role-gated access check.
- **Starter code:** `.vscode/mcp.json` skeleton
- **Solution code:** Complete admin page test with auth check
- **Practice link:** Admin page

**Prompt Templates:**
1. "MCP: Explore and Generate" — Two-step template for any page
2. "MCP: Error State Testing" — Explore page in error state, generate test for error handling

---

### Module 8: Page Objects & Multi-File Generation

**Subtitle:** Generate POMs and tests together using Copilot Edits

**Estimated time:** 14 minutes

**Learning Objectives:**
- Use Copilot Edits mode to generate a Page Object and its test file simultaneously
- Create a `.prompt.md` template for POM generation that your team can reuse
- Use Copilot Vision (screenshot paste) to generate locators from the UI

**Sections:**

| # | Type | Heading | Content Summary |
| --- | --- | --- | --- |
| 1 | text | When You Need a Page Object | Rule of thumb: when 3+ tests hit the same page. Before that, inline selectors are fine. From knowledge base Section 8.2. |
| 2 | code | POM Pattern for Copilot | The recommended POM template from knowledge base Section 8.3. Readonly locators, typed methods, Locator type imports. |
| 3 | text | Copilot Edits: Multi-File Generation | Open Edits panel, add source files as context, prompt for POM + test file together. From knowledge base Section 2.3. |
| 4 | code | An Edits Prompt | "Create a LoginPage class in tests/pages/LoginPage.ts and update tests/e2e/login.spec.ts to use it. Follow the pattern in tests/pages/BasePage.ts." |
| 5 | text | Screenshot → Locators | Paste a screenshot of the practice app page into Chat. Ask Copilot to generate a POM with locators for all visible interactive elements. From knowledge base Section 2.6. |
| 6 | callout (info) | Research Finding: POM Accuracy | arXiv study: LLMs achieve 32-54% accuracy on POM generation, but >70% element recognition. Provide an existing POM as template and accuracy goes way up. |

**Quiz:**
1. "When should you introduce a Page Object instead of using inline selectors?" → When 3+ tests hit the same page — before that, inline is simpler and good enough
2. "What's the most reliable way to get Copilot to generate a good POM?" → Provide an existing POM as a template/example — Copilot extends known patterns better than inventing from scratch

**Exercise:**
- **Title:** "Generate POM + Test in One Shot"
- **Difficulty:** Intermediate
- **Description:** Use Copilot Edits to generate a ProductsPage POM class and a products-search.spec.ts that uses it. Provide the LoginPage POM as a pattern reference. Run the test.
- **Starter code:** Existing LoginPage.ts as pattern, empty ProductsPage.ts and products.spec.ts
- **Solution code:** Complete ProductsPage POM + test using it
- **Practice link:** Products page

**Prompt Templates:**
1. "Generate POM + Test" — Edits-mode prompt for simultaneous POM and test generation

---

### Module 9: Spotting AI Anti-Patterns

**Subtitle:** The 8 mistakes Copilot makes most — and how to catch them in review

**Estimated time:** 14 minutes

**Learning Objectives:**
- Identify the 8 most common LLM test anti-patterns in generated code
- Fix each anti-pattern using re-prompting (not manual editing)
- Explain why a test that passes can still be worthless (the assertion trap / mutation testing gap)

**Sections:**

| # | Type | Heading | Content Summary |
| --- | --- | --- | --- |
| 1 | table | The 8 Anti-Patterns | Full table from knowledge base Section 6.1: hardcoded waits, CSS selectors, deprecated APIs, hallucinated selectors, non-retrying assertions, test interdependence, strict mode band-aids, over-engineering. Each with "What LLMs Do" and "Correct Approach." |
| 2 | code | Spot the Anti-Patterns | A generated test with 4 hidden anti-patterns. Can you find them all? |
| 3 | text | The Assertion Trap at Scale | Most LLM-generated tests that pass prove unsuitable for mutation testing — they can pass without verifying meaningful behavior. From arXiv:2511.21382. A test with `expect(heading).toBeVisible()` always passes if the page loads. Better: `expect(heading).toHaveText('Order Confirmed')`. |
| 4 | text | The Over-Engineering Problem | From T.J. Maher: "Copilot Over-Engineered My Playwright Framework." Watch for: unnecessary abstractions, helper functions for one-off operations, config files for simple tests. |
| 5 | code | Before and After: Anti-Pattern Fixes | Side-by-side showing each anti-pattern and its fix. |
| 6 | callout (warning) | The Cost of Flakiness | Industrial study: $2,250/month per developer repairing flaky tests. Teaching Copilot to avoid them is high-ROI. |

**Quiz:**
1. "Which assertion is more valuable: `expect(heading).toBeVisible()` or `expect(heading).toHaveText('Order Confirmed')`?" → `toHaveText` — it actually verifies the content. `toBeVisible` passes for any heading on any page.
2. "A generated test uses `page.waitForTimeout(3000)` before clicking a button. What's the correct fix?" → Remove the waitForTimeout entirely — Playwright's click() auto-waits for the element to be actionable
3. "Copilot generated a test that creates a helper class, a constants file, and a custom fixture for a single test. What anti-pattern is this?" → Over-engineering — a simple inline test is better for a one-off scenario

**Exercise:**
- **Title:** "Anti-Pattern Code Review"
- **Difficulty:** Intermediate
- **Description:** Review a pre-generated test file with 6 hidden anti-patterns. Identify each one, then use Copilot Chat to fix them one at a time via re-prompting. The goal: a clean test with zero anti-patterns.
- **Starter code:** Generated test with 6 anti-patterns (waitForTimeout, CSS selectors, non-retrying assertions, test interdependence, hallucinated selector, over-engineered helper)
- **Solution code:** Clean test with all anti-patterns fixed
- **Practice link:** Orders page (the page the test targets)

**Prompt Templates:**
1. "Anti-Pattern Review" — Ask Copilot to review its own generated test for the 8 known anti-patterns

---

### Module 10: Your Team's Prompt Playbook

**Subtitle:** Build reusable prompt files and team standards that scale

**Estimated time:** 16 minutes

**Learning Objectives:**
- Create `.prompt.md` files that team members invoke from Copilot Chat
- Write file-scoped instructions (`.github/instructions/*.instructions.md`) for test files and POM files
- Define a governance checklist for AI-generated tests that fits into your team's PR review process

**Sections:**

| # | Type | Heading | Content Summary |
| --- | --- | --- | --- |
| 1 | text | From Single Prompts to a Playbook | Course 1 taught PAGE/CARD as mental models. This lesson makes them concrete files in your repo that anyone on the team can invoke. |
| 2 | code | Your First .prompt.md File | Complete `playwright-test.prompt.md` with frontmatter (mode: agent, description). From knowledge base Section 3.3. |
| 3 | code | File-Scoped Instructions | `.github/instructions/playwright-tests.instructions.md` with `applyTo: "tests/**/*.spec.ts"`. Separate file for POM: `applyTo: "tests/pages/**/*.ts"`. From knowledge base Section 3.4. |
| 4 | table | A Prompt Playbook for Your Team | 5 prompt files mapped to common scenarios: new-test.prompt.md, page-object.prompt.md, fix-failure.prompt.md, add-mocking.prompt.md, review-test.prompt.md |
| 5 | text | Governance: The PR Review Checklist | Combines legacy Module 28 HITL checklist + anti-patterns from Module 9. Checklist items: selectors stable? Assertions verify behavior? No waits? No over-engineering? Test independent? Prompt provenance recorded? |
| 6 | callout (tip) | Start Small, Iterate | From GitHub's "5 tips for custom instructions": start with 3-5 rules, test with real PRs, expand based on what works. Limit to ~1,000 lines per file. |

**Quiz:**
1. "What's the advantage of `.prompt.md` files over copy-pasting prompts from a wiki?" → They're invoked directly from Copilot Chat, version-controlled in the repo, and shared automatically with the team
2. "Why should you record prompt provenance in commit notes?" → So reviewers know which tests were AI-generated and can apply the appropriate review checklist

**Exercise:**
- **Title:** "Build a 3-File Prompt Playbook"
- **Difficulty:** Advanced
- **Description:** Create 3 prompt files for the practice app: (1) `new-e2e-test.prompt.md` for generating tests from scratch, (2) `page-object.prompt.md` for POM generation, (3) `fix-failure.prompt.md` for iterative repair. Test each one by invoking it in Copilot Chat against a practice app page.
- **Starter code:** Empty `.github/prompts/` directory
- **Solution code:** 3 complete prompt files
- **Practice link:** Products page (for testing the prompts)

**Prompt Templates:**
1. "Meta: Generate a Prompt File" — Ask Copilot to draft a `.prompt.md` based on your description of the scenario

**Narration:**
- Intro: "Individual skill with Copilot is valuable. Team-wide standards make it sustainable. This lesson turns everything you've learned into shareable infrastructure."
- Steps: (4 steps: create prompt files, file-scoped instructions, governance checklist, iterate)
- Outro: "You now have a complete toolkit: configured instructions that enforce standards, prompt files that produce consistent output, and a review process that catches what AI gets wrong. Welcome to Copilot-first testing."

---

## Per-Module Practice App Mapping

| Module | Practice App Page | What's Tested |
| --- | --- | --- |
| 1 | /login | Login form (first generated test) |
| 2 | /login | Same test, comparing output with/without instructions |
| 3 | /contact | Contact form (Chat-driven generation) |
| 4 | /orders | Orders table (PAGE prompt + seed test) |
| 5 | /checkout/shipping | Checkout flow (intentional failures to fix) |
| 6 | /settings | Settings page (agent mode autonomous generation) |
| 7 | /admin | Admin page (MCP + role-gated access) |
| 8 | /products | Products page (POM + test multi-file generation) |
| 9 | /orders | Orders table (anti-pattern review exercise) |
| 10 | /products | Products page (prompt playbook testing) |

---

## Dependencies & Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Copilot output varies between sessions | MEDIUM | Exercises include expected output patterns, not exact matches. Solution code shows one valid solution. |
| MCP setup complexity on Windows | MEDIUM | Module 7 includes troubleshooting callout. MCP config tested on Windows. |
| Agent mode availability changes | LOW | Agent mode is GA since Feb 2025. Fallback to Chat + manual run documented. |
| Practice app page changes | LOW | Course uses same practice app as Course 1 — already stable. |
| Learners skip Course 1 | MEDIUM | Module 1 includes prerequisite check callout. Key concepts (locators, assertions) re-introduced in context. |

---

## Implementation Phases

### Phase 1: Shared Infrastructure
- Create `training-app/src/data/courses/copilot-first-testing/` directory
- Write `shared.ts` (helpers, routes, credentials, themed module factory)
- Write `index.ts` and `course.ts` shell

### Phase 2: Foundation Modules (1-3)
- Module 1: Mindset + first directed test
- Module 2: Configuration files
- Module 3: Chat-driven generation
- These establish the core workflow before introducing advanced features

### Phase 3: Power Modules (4-7)
- Module 4: PAGE upgraded + seed test
- Module 5: Review-Run-Fix loop
- Module 6: Agent mode
- Module 7: Playwright MCP
- These teach the advanced Copilot features

### Phase 4: Architecture & Governance (8-10)
- Module 8: POM + multi-file generation
- Module 9: Anti-pattern detection
- Module 10: Team prompt playbook
- These prepare learners for team-scale adoption

### Phase 5: Integration Testing
- Run through all 10 modules against practice app
- Verify all exercise labs pass
- Test prompt templates produce reasonable output
- Validate narration scripts match content flow

---

## Estimated Effort

| Phase | Modules | Estimated Lines | Content Source |
| --- | --- | --- | --- |
| Phase 1 | Infrastructure | ~200 | Adapted from first-playwright-tests/shared.ts |
| Phase 2 | 1, 2, 3 | ~1,500 | 40% new, 60% adapted from knowledge base + existing modules |
| Phase 3 | 4, 5, 6, 7 | ~2,000 | 60% new (agent mode, MCP), 40% adapted |
| Phase 4 | 8, 9, 10 | ~1,800 | 50% new (prompt files, anti-patterns), 50% adapted |
| Phase 5 | Testing | — | Manual verification |
| **Total** | | **~5,500 lines** | |

---

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes / no / modify)
