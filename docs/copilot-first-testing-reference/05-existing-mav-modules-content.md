# Existing MAV Modules — Content Relevant to Copilot-First Testing

> Extracted from training-app/src/data/modules/ and training-app/src/data/courses/first-playwright-tests/modules/

---

## Course 1, Module 06: Find the Right Element

**Key Content: Locator Hierarchy**

| Priority | Locator | When to Use |
|----------|---------|-------------|
| 1 | getByRole | Strong accessible semantics (buttons, links, headings) |
| 2 | getByLabel | Form controls with visible labels |
| 3 | getByTestId | App exposes dedicated test handles |
| 4 | CSS locator | Last resort — document cleanup target |

**Maintenance Cost by Selector Type:**
- CSS class: High
- CSS structure: Very high
- getByTestId: Low
- getByRole: Very low

**Quiz:** "Which locator is strongest for login email?" → `page.getByLabel("Email")`

---

## Course 1, Module 07: Ask Copilot for a Useful Draft

**Key Content: PAGE Prompt Framework**

| Letter | Meaning | Example |
|--------|---------|---------|
| P | Page — where flow starts | Products page with search input, button, cards |
| A | Actions — what user does | Search for Widget, submit query |
| G | Guardrails — rules test must obey | Playwright Test, stable selectors, no waitForTimeout |
| E | Evidence — what must be proven | Result count updates, cards contain Widget |

**CARD Alternative** (for complex scenarios):
- C: Context (page/component)
- A: Actions (user flow steps)
- R: Rules (business requirements)
- D: Data (test data, edge cases)

**Chat Commands:**
- `/tests` — Generate tests for open file
- `/fix` — Diagnose failing test
- `/explain` — Understand unfamiliar code
- `@workspace` — Project-wide test generation
- `#file:path` — Reference specific file

**The Assertion Trap:** Copilot generates syntactically valid assertions that may test the wrong thing. Always verify against acceptance criteria.

**Prompt Templates (5):** PAGE: Products Search, Tighten a Draft, CARD: Login Form, CARD: Form Validation, CARD: Navigation Test

---

## Course 1, Module 08: Record a Login Flow

**Key Content: Playwright Codegen**

- Terminal: `pnpm exec playwright codegen http://localhost:5173`
- VS Code: Testing view → "Record New"
- Both produce same output

**What recording gives:** clicks/fills/navigation, working first draft, saveable file
**Still your job:** naming test, replacing weak selectors, adding assertions

---

## Course 1, Module 09: Tighten and Re-Run

**Key Content: 5-Point Refinement**

1. Replace selectors (CSS → Playwright locators)
2. Add assertions (from acceptance criteria)
3. Name the test (describe the scenario)
4. Remove waits (delete waitForTimeout)
5. Use baseURL (relative paths)

**Quiz:** "Which change has highest payoff after recording?" → Adding proof that the outcome happened

---

## Course 1, Module 10: Build Your First Test Pack

**Key Content:** Two independent tests (login + products search), clean report. One outcome per test. Each test arranges its own route.

---

## Legacy Module 04: Why Playwright + Copilot

**Three Roles:**
- Playwright — Execution (drives browser, handles timing)
- Copilot — Authoring (generates code from descriptions)
- You — Judgment (decide what to test, review, approve)

**Copilot Time Savings:**
- Scaffolding: 30-60 min → 5-10 min
- Selectors: trial-error → first-attempt
- Debugging: manual search → inline explanations

---

## Legacy Module 06: Copilot Prompt Engineering

**CARD Formula** — maps directly to acceptance criteria on tickets:
- Context (page/component)
- Actions (step-by-step user flow)
- Rules (business requirements and validation logic)
- Data (test data, edge cases, boundary conditions)

**Inline Comment Triggers:** Copilot auto-completes from descriptive comments above test blocks.

**The Assertion Trap:** Copilot doesn't know business rules. Verify assertions match acceptance criteria.

---

## Legacy Module 07: Record Your First Test

**Why Record First:** Eliminates blank-file intimidation. Generates working draft in minutes. Recording captures what you did, not what you're testing.

**What Recording Gets Wrong:**
1. Fragile selectors (CSS classes, nth-child)
2. Zero assertions (proves no errors, not that login worked)

---

## Legacy Module 08: Refine the Recording

**Locator Priority Order:** getByRole → getByLabel → getByText → getByTestId → CSS

**Assertions Come From:** Domain knowledge and acceptance criteria. A test without assertions always passes — even when broken.

---

## Legacy Module 11: Prompt Template Library

**7 Templates:**
1. Login / Authentication Flow
2. Form Submission + Validation
3. Search + Filter + Results
4. Multi-Step Workflow (Checkout, Wizard)
5. Table / Data Grid
6. Accessibility Quick Check
7. Refine a Recorded Test

**Also:** Debug a Failing Test template

**Key Pattern:** Replace [BRACKETED] placeholders with project-specific details.

---

## Legacy Module 28: Playwright MCP and AI Agents

**Planner / Generator / Healer:**
- Planner: Feature request → test plan (review: are scenarios right?)
- Generator: Plan → first code draft (review: are locators maintainable?)
- Healer: Suggest narrow repairs (review: did it fix cause, not mask bug?)

**Reusable Copilot Context:** `.github/copilot-instructions.md` — defines selector strategy, assertion expectations, naming, review boundaries.

**Governance Principles:**
- Bounded work with visible checkpoints
- Ask for plan before spec
- Record prompt provenance in comments/commit notes
- Run same HITL checklist on generated code as handwritten
- "Generated test can pass while still being wrong"
