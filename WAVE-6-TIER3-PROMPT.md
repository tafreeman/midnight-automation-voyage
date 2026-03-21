# Wave 6: Tier 3 — Future-Proofing & AI-Enabled QE

## Persona

You are a **principal QE strategist and AI-augmented testing specialist** at the intersection of test automation and generative AI. You have hands-on experience with Playwright MCP (Model Context Protocol), Playwright's Test Agents (Planner, Generator, Healer from v1.56+), GitHub Copilot prompt files and coding agents, React component testing with `@playwright/experimental-ct-react`, and Web Vitals performance measurement. You understand the frontier of AI-assisted testing while maintaining a rigorous HITL (Human-in-the-Loop) governance posture. You write curriculum that prepares enterprise teams for where QE is heading, not just where it is today.

## Context

The **Midnight Automation Voyage** platform has completed Waves 1-5:

### Current State (Post-Wave 5)
- **27 training modules** (01-27) covering foundations through enterprise CI/CD scaling
- **8-9 practice app features:** Login, Dashboard, Products, Contact, Orders, Checkout, Settings (3 a11y violations), Admin Panel (role-gated), optionally Activity Feed
- **~55-60 reference Playwright tests**
- **Full platform UX:** localStorage persistence, hash routing, keyboard nav, collapsed sidebar rail, role selector, quiz-gated completion, quiz retry, progress bar, aria-live, responsive sidebar, "Try It Now" callouts
- **100% quiz coverage, 80%+ exercise coverage, 60%+ prompt template coverage**
- **TMMi Level 3-4** — approaching Measured level with CI scale patterns
- Auth context with sessionStorage, toast system with timing issues, intentional a11y violations

### What Wave 6 Delivers
4 new modules (28-31) plus 2 practice app features that complete the platform's forward-looking curriculum. These modules cover the most advanced topics: AI agents for test generation/healing, React component testing, performance measurement, and custom reporting. After Wave 6, the platform reaches its target end state: 31 modules, TMMi Level 4 with Level 5 trajectory, and a 3-tier certification system that is fully defined.

## Problem

The platform teaches comprehensive Playwright testing but has four forward-looking gaps that will become enterprise expectations within 12-18 months:

1. **CG-14: No Playwright MCP / AI agents coverage** — Playwright v1.56 introduced Test Agents (Planner, Generator, Healer) with 75%+ success on selector-related failures. MCP bridges AI assistants and live browsers. Copilot prompt files (`.github/copilot-instructions.md`) enable repository-level AI guidance. TTC Global reports Copilot + Playwright MCP boosted test automation efficiency by 37%. The platform — built specifically for Copilot + Playwright — doesn't cover this frontier.

2. **CG-15: No component testing** — The practice app and training app are both React-based, yet the curriculum teaches only end-to-end abstractions. `@playwright/experimental-ct-react` enables testing React components in isolation with `mount()`. This bridges the gap between unit tests and E2E in the test pyramid, enabling faster feedback on component behavior without full app startup.

3. **CG-16: No performance baselines** — No Web Vitals measurement (LCP, CLS, INP), no performance budgets, no throttling, no Lighthouse CI integration. Performance regression is invisible to the current test suite. Enterprise clients increasingly expect performance quality gates.

4. **CG-17: No custom reporters** — Playwright's HTML reporter is taught, but not `merge-reports`, Allure integration, custom reporter API, Slack/Teams webhooks, or trend dashboards. Enterprise teams need reporting that integrates with existing observability and communication tooling.

These gaps prevent TMMi Level 5 (Optimizing) and leave the platform without a response to the #1 QE trend identified by the World Quality Report 2025-26: AI-augmented quality engineering.

## Solution

### Part A: Practice App Features (2 New Pages)

#### Feature: UI Pattern Lab (`/ui-lab`)
**Supports:** Module 29 (Component Testing)

A showcase page demonstrating isolated UI patterns, each suitable for component-level testing:

**Components:**
- **Tabs component** — 3 tabs with panel content, keyboard accessible (Arrow keys switch tabs)
- **Accordion** — 3 collapsible sections, single-open mode
- **Combobox** — Searchable dropdown with filtered options (country list)
- **Date picker** — Calendar popup with min/max date constraints
- **Tooltip** — Hover/focus triggered, positioned dynamically
- **Drawer** — Slide-in panel from right, with close button and overlay
- **Sortable cards** — 4 cards that can be reordered via drag-and-drop

**Intentional Issues:**
1. One component missing an accessible name (combobox lacks `aria-label`)
2. ESC key doesn't close the drawer (regression for component test to catch)

**data-testid attributes:** `ui-lab-tabs`, `ui-lab-tab-{n}`, `ui-lab-tab-panel-{n}`, `ui-lab-accordion`, `ui-lab-accordion-item-{n}`, `ui-lab-combobox`, `ui-lab-combobox-input`, `ui-lab-combobox-option-{n}`, `ui-lab-datepicker`, `ui-lab-datepicker-calendar`, `ui-lab-tooltip-trigger`, `ui-lab-tooltip-content`, `ui-lab-drawer`, `ui-lab-drawer-trigger`, `ui-lab-drawer-close`, `ui-lab-drawer-overlay`, `ui-lab-sortable-card-{n}`

#### Feature: Support Assistant Sandbox (`/assistant`)
**Supports:** Module 28 (MCP & AI Agents) — provides an AI-like interaction surface for testing non-deterministic outputs

**Components:**
- Prompt input box with submit button
- Generated answer card (displays after 500ms simulated delay)
- Citations panel (appears 200ms after answer — intentional async delay)
- Regenerate button (produces slightly different wording each time — simulated non-determinism)
- Feedback controls (thumbs up/down with optional comment)
- Disclaimer badge ("AI-generated response — verify before acting")

**Behavior:**
- Uses a set of 10 pre-written Q&A pairs (not actual AI — simulated)
- Each "regeneration" shuffles sentence order and swaps synonyms to simulate non-deterministic output
- Unrecognized prompts return a generic "I don't have information about that" response
- Citations load asynchronously after the main answer

**Intentional Issues:**
1. Variable wording on regenerate (tests must use bounded/rubric assertions, not exact string match)
2. Citations panel sometimes doesn't appear (race condition surface — 10% chance of >2s delay)
3. Missing disclaimer badge on one specific Q&A pair (guardrail regression)

**data-testid attributes:** `assistant-prompt-input`, `assistant-submit`, `assistant-answer-card`, `assistant-answer-text`, `assistant-citations-panel`, `assistant-citation-{n}`, `assistant-regenerate`, `assistant-feedback-up`, `assistant-feedback-down`, `assistant-feedback-comment`, `assistant-disclaimer`

### Part B: Training Modules (4 New Modules)

#### Module 28: Playwright MCP, AI Agents & Reusable Copilot Context (`28-mcp-ai-agents.ts`)
- **Audience:** All Roles (Developers primary, all-awareness)
- **Sections:**
  - What is MCP (Model Context Protocol) — the bridge between AI assistants and live browsers
  - Playwright MCP Server setup: `npx @anthropic-ai/mcp-server-playwright` / `npx @playwright/mcp`
  - How MCP works: accessibility snapshots → AI reasoning → Playwright actions
  - Test Agents (v1.56+): **Planner** (natural language → test plan), **Generator** (plan → test code), **Healer** (broken selector → repaired selector, 75%+ success rate)
  - Agent boundaries: what agents can and cannot do reliably
  - GitHub Copilot prompt files: `.github/copilot-instructions.md` for repository-level AI context
  - Copilot custom instructions: project conventions, selector strategy, assertion patterns
  - Prompt provenance: tracking which tests were AI-generated vs hand-written
  - HITL review for agent output: applying Module 13's checklist to AI-generated tests
  - The governance line: transparent reviewable repair vs opaque silent self-healing
  - When to use an agent vs manual authoring (complexity, novelty, maintenance burden)
- **Quiz:** Why should AI-generated tests still go through the HITL review checklist? (Answer: AI agents can produce tests that pass but have poor assertion quality, brittle selectors, or hardcoded waits — the same problems Module 13 was designed to catch in human-written tests)
- **Exercise:** Write a Copilot prompt file (`.github/copilot-instructions.md`) for the practice app that defines selector strategy, assertion patterns, and test structure conventions. Then write a bounded agent task: "Generate a test for the Contact form submission flow" with review checkpoints. Starter: empty prompt file template + raw agent request. Solution: complete prompt file with project conventions + agent task with HITL review gates.
- **Prompt Templates:** "Generate a reusable Copilot prompt file for a Playwright test project with these conventions: {conventions}" | "Create a bounded agent task for generating tests for {feature} with review checkpoints at each stage"
- **Practice Link:** Assistant Sandbox (`http://localhost:5173/assistant`) — "Use the AI sandbox to practice bounded assertion patterns and prompt provenance tracking"

#### Module 29: Component Testing for React (`29-component-testing.ts`)
- **Audience:** Developers
- **Sections:**
  - Where component testing fits in the test pyramid (between unit and E2E)
  - When to use CT vs E2E: component isolation for fast feedback, E2E for integration confidence
  - Setting up `@playwright/experimental-ct-react`: `playwright/index.html`, `playwright/index.tsx`
  - The `mount()` fixture: rendering a React component in a real browser
  - Prop-driven testing: passing props and asserting rendered output
  - Event testing: clicking, typing, keyboard interaction on isolated components
  - State testing: verifying internal state changes through UI assertions
  - Component contracts: what the component promises to its consumers
  - Shared test utilities: extracting reusable patterns across CT and E2E
  - CT limitations: no routing, no global state, no API calls (use E2E for these)
  - Decision framework: "If the behavior depends only on props/events → CT. If it depends on routing/API/auth → E2E."
- **Quiz:** When should you choose a component test over an E2E test? (Answer: when the behavior you're testing depends only on the component's props and events, not on routing, API responses, or global state — CT gives faster feedback with less infrastructure)
- **Exercise:** Write a component test for the Tabs component from UI Pattern Lab — mount the Tabs component, click each tab, assert the correct panel is visible, test keyboard navigation with Arrow keys. Starter: empty CT file with mount import. Solution: complete component test with prop passing, click assertions, and keyboard navigation.
- **Prompt Templates:** "Generate a Playwright component test for this React component with prop variations and event assertions" | "Decide whether this behavior should be tested with CT or E2E and explain why"
- **Practice Link:** UI Pattern Lab (`http://localhost:5173/ui-lab`) — "Test isolated UI components — Tabs, Accordion, Combobox, Drawer"

#### Module 30: Performance Baseline Testing (`30-performance-testing.ts`)
- **Audience:** Developers
- **Sections:**
  - Core Web Vitals: LCP (Largest Contentful Paint), CLS (Cumulative Layout Shift), INP (Interaction to Next Paint)
  - Measuring with `page.evaluate()` and the Performance API
  - Navigation timing: `performance.getEntriesByType('navigation')`
  - Resource timing: identifying slow assets
  - Network throttling: `page.route()` with delayed responses to simulate slow connections
  - Performance budgets: setting thresholds and asserting against them
  - Lighthouse CI integration: running Lighthouse as part of the test suite
  - Trace Viewer Timeline for bottleneck identification (connecting to Module 22)
  - Performance vs functional tests: separate projects, separate CI jobs
  - Baselining: establishing initial metrics and tracking drift
  - When performance testing in Playwright is appropriate vs dedicated tools (k6, WebPageTest)
- **Quiz:** Why should performance tests run in a separate Playwright project from functional tests? (Answer: performance tests need consistent, controlled conditions — no parallel tests competing for resources, no mock data interfering with real timing, and often need specific network throttling that would break functional tests)
- **Exercise:** Measure LCP and CLS for the Dashboard page — starter has a test that navigates to `/dashboard`, solution adds `page.evaluate()` calls to extract Web Vitals, asserts LCP < 2500ms and CLS < 0.1, and uses network throttling to simulate 3G.
- **Prompt Templates:** "Generate a Playwright performance test that measures Core Web Vitals for {page} with a {budget} budget" | "Create a performance baseline report comparing current metrics against target thresholds"
- **Practice Link:** Dashboard (`http://localhost:5173/dashboard`) — "Measure page load performance and set baseline thresholds"

#### Module 31: Custom Reporters & Notifications (`31-custom-reporters.ts`)
- **Audience:** Developers
- **Sections:**
  - Built-in reporters recap: HTML, JSON, JUnit, line, dot, list
  - Using multiple reporters simultaneously: `reporter: [['html'], ['json', { outputFile: 'results.json' }]]`
  - HTML Reporter deep dive: filtering, searching, trace attachment, Speedboard (v1.58)
  - `merge-reports` CLI for sharded pipelines (connecting to Module 24)
  - Third-party: Allure Playwright integration setup and configuration
  - Custom reporter API: `onBegin`, `onTestEnd`, `onEnd` hooks
  - Building a Slack/Teams webhook reporter: post summary on test completion
  - Trend tracking: storing JSON results over time, detecting regressions
  - Dashboard patterns: what metrics to visualize (pass rate, duration, flake rate, coverage by tag)
  - Report retention: how long to keep artifacts, storage cost management
- **Quiz:** What information should a Slack notification include when tests fail? (Answer: total pass/fail counts, names of failed tests, link to the HTML report artifact, and the branch/PR that triggered the run — enough to triage without opening CI)
- **Exercise:** Write a custom Playwright reporter that logs a summary to console and sends a JSON payload to a webhook URL on completion. Starter: empty reporter class with interface stubs. Solution: complete reporter with `onBegin` (test count), `onTestEnd` (result tracking), `onEnd` (summary + webhook fetch).
- **Prompt Templates:** "Generate a custom Playwright reporter that sends results to {webhook_url} with pass/fail summary" | "Configure a multi-reporter setup with HTML for local, JUnit for CI, and JSON for trend tracking"
- **Practice Link:** Practice app root — "Run your full test suite with multiple reporters and review the HTML report"

### Part C: Reference Test Specs

Write reference specs for the new practice app features:

**`ui-lab.spec.ts`** (5-6 tests):
- Tab switching and keyboard navigation
- Accordion single-open behavior
- Combobox search and selection
- Drawer open/close (including ESC key regression)
- Tooltip hover visibility
- Sortable card reorder

**`assistant.spec.ts`** (4-5 tests):
- Submit prompt and verify answer appears
- Verify citations load (with retry for async delay)
- Regenerate produces different wording (bounded assertion — check key phrases, not exact text)
- Feedback controls (thumbs up/down state)
- Disclaimer badge presence on all responses

**`component/tabs.ct.tsx`** (if CT is configured — 3-4 tests):
- Mount with default props, verify first tab active
- Click tab, verify panel switches
- Keyboard Arrow navigation
- Disabled tab handling

### Part D: Module Registry & Final Updates

1. Update `training-app/src/data/index.ts` to import and include Modules 28-31
2. Add UI Lab and Assistant routes to practice app `App.tsx`
3. Add nav links for UI Lab and Assistant
4. Update practice app navigation to show all 10+ features

### Implementation Constraints

1. **Read every file before editing** — understand existing patterns completely
2. **The Assistant Sandbox is NOT real AI** — it uses hardcoded Q&A pairs with simulated non-determinism (sentence shuffling, synonym swapping). No API calls to any AI service.
3. **Component testing setup is optional** — if `@playwright/experimental-ct-react` adds complexity, the Module 29 exercise can demonstrate CT concepts with code examples rather than requiring a full CT setup in the repo
4. **UI Pattern Lab components should use existing shadcn/ui primitives** where possible (Tabs, Accordion, Tooltip, Drawer are all installed in the practice app)
5. **Performance measurements in Module 30 exercises must work against the practice app** — no external services
6. **Custom reporter in Module 31 exercise should use `console.log` for the webhook** (no real external endpoint) — show the fetch call structure but mock the endpoint
7. **All modules need all interactive fields:** quiz + exercise + promptTemplates + practiceLink
8. **Module IDs continue from 28** — maintain sequential numbering
9. Use pnpm, not npm/yarn
10. Both apps must pass `pnpm build` with zero errors

### Verification

After completing all changes:
1. `cd practice-app && pnpm build` — zero errors
2. `cd training-app && pnpm build` — zero errors
3. Training app sidebar shows 31 modules
4. Practice app has 10+ features in navigation
5. `/ui-lab` renders all 7 UI patterns with working interactions
6. `/assistant` shows prompt input, generates answers from hardcoded set, regenerate produces varied text
7. All 4 new modules have: sections (4+ each), quiz, exercise, promptTemplates, practiceLink
8. Reference tests in `test-cases/examples/` follow all existing conventions
9. No real AI API calls anywhere — all simulation is local

### Success Criteria

After Wave 6, the platform reaches its **target end state**:

| Metric | Start (Pre-Wave 1) | End (Post-Wave 6) |
|--------|--------------------|--------------------|
| Training modules | 15 | **31** |
| Practice app features | 5 | **10+** |
| Reference tests | 33 | **~70** |
| Quiz coverage | 67% | **100%** |
| Exercise coverage | 13% | **80%+** |
| Prompt template coverage | 7% | **55%+** |
| CI providers taught | 1 (GitLab) | **2+ (+ GitHub Actions)** |
| Testing types | Functional only | **Functional + Visual + A11y + Mobile + Perf + Component** |
| Playwright API coverage | ~30% | **~90%** |
| TMMi level | 2 | **4 (with Level 5 trajectory)** |

The platform is now enterprise-credible, covering the full modern Playwright capability set with applied assessments, AI-augmented workflows with HITL governance, and a clear certification path. It is positioned as the definitive Playwright + Copilot training program for enterprise QE teams.
