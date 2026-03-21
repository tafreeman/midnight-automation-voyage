# Training Platform Expansion — Analysis & Planning Prompt

> Use this prompt in a new session with the project folder mounted. It will produce an independent analysis, core guidelines, and expansion plan — not execute any code changes.

---

## Role

You are a senior QE (Quality Engineering) strategist consulting for an enterprise software firm. Your task is to analyze an existing Playwright + GitHub Copilot training platform, research current industry best practices, and produce a comprehensive expansion plan. You are NOT building anything — you are producing the strategic analysis and recommendations document.

---

## Project Context

### What This Platform Is

An interactive training platform that teaches manual testers and developers how to write automated tests using Playwright with GitHub Copilot (AI-assisted test authoring). It has three components:

1. **training-app/** — A React + TypeScript learning app with a sidebar, lesson viewer, quizzes, code exercises, and prompt template library. Runs on port 5174.
2. **practice-app/** — A React + TypeScript test target application with real pages (login, products, contact, orders, checkout wizard) that learners write Playwright tests against. Runs on port 5173.
3. **test-cases/** — 33 reference Playwright spec files and a detailed manual-to-automated test decomposition document.

### Tech Stack

- pnpm, React 19, TypeScript 5.9, Vite 8, Tailwind CSS 3.4, shadcn/ui (Radix)
- practice-app uses react-router-dom for routing
- Training content is defined as TypeScript data objects (not markdown), one file per module in `training-app/src/data/modules/`

### Current Training Modules (15 total)

| # | Title | Category | Audience |
|---|-------|----------|----------|
| 01 | Who This Is For (Orientation) | Foundation | All |
| 02 | Mindset Shifts: Manual → Automated | Foundation | All |
| 03 | What to Automate (and What Not To) | Foundation | All |
| 04 | Why Playwright + Copilot | Foundation | All |
| 05 | Environment Setup | Practical | All |
| 06 | Copilot Prompt Engineering (CARD formula) | AI Skills | All |
| 07 | Record → Refine Workflow | Practical | All (Non-coder primary) |
| 08 | Writing Tests from Scratch | Practical | Developers |
| 09 | Page Object Model | Intermediate | Developers |
| 10 | API & Network Testing | Intermediate | Developers |
| 11 | Prompt Template Library | AI Skills | All |
| 12 | Reading Test Results | Practical | All |
| 13 | HITL Review Checklist | Governance | All |
| 14 | Non-Coder Survival Guide | Practical | Non-coders |
| 15 | CI/CD & Quick Reference (GitLab CI only) | Intermediate | All |

### Current Practice App Features (5 total, 33 reference tests)

| Feature | Route(s) | Tests | Patterns Covered |
|---------|----------|-------|-----------------|
| Login | /login | 7 | Form validation, auth errors, lockout, redirect |
| Products/Search | /products | 7 | Search, filter, empty state, keyboard events |
| Contact Form | /contact | 7 | Required/optional fields, format validation |
| Orders Table | /orders | 6 | Sort, pagination, status filter, data extraction |
| Checkout Wizard | /checkout/* (4 steps) | 6 | Multi-step flow, back nav, data preservation |

### Training Content Model

Each module is a TypeScript object conforming to this interface:

```typescript
interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  audience?: string;
  sections: {
    heading: string;
    content: string;
    code?: string;
    codeLanguage?: string;
    tip?: string;
    warning?: string;
    callout?: string;
    table?: { headers: string[]; rows: string[][] };
  }[];
  quiz?: { question: string; options: string[]; correctIndex: number; explanation: string };
  exercise?: { title: string; description: string; starterCode: string; solutionCode: string; hints: string[] };
  promptTemplates?: { label: string; prompt: string; context: string }[];
}
```

Not all modules currently use the quiz, exercise, or promptTemplates fields.

### Key Design Decisions Already Made

- **Dual-track learning:** Separate "Developer" and "Non-Coder" audience paths. Modules are tagged by audience. Non-coders follow a Record → Copilot Refine → Review workflow.
- **CARD prompting formula:** Context / Actions / Rules / Data — the structured approach to Copilot test generation prompts (Module 06).
- **HITL governance:** 10-point human review checklist before any test merges (Module 13). Covers assertion presence, selector strategy, data independence, no hardcoded waits.
- **Test conventions:** data-testid selectors, one test per behavior, descriptive names, comment prefixes for traceability, no waitForTimeout.
- **5-day onboarding plan:** Structured Mon–Fri schedule mapping modules to daily outcomes.

### Known Context

- Target users are manual testers and developers at an enterprise consulting firm (Deloitte-scale).
- All 33 reference tests log in via UI on every run (no auth fixtures).
- Only GitLab CI is covered (no GitHub Actions, Azure DevOps).
- Only single-browser execution is demonstrated.
- No visual regression, accessibility, mobile, or performance testing is covered.
- No formal assessment or certification system exists.

---

## Your Deliverable

Produce a single comprehensive document (HTML artifact preferred for interactivity, markdown acceptable) containing all of the following sections:

### 1. Current State Assessment
- Map all 15 modules by category, audience, and depth level
- Map all 5 practice features by test count and patterns taught
- Identify which Lesson interface fields (quiz, exercise, promptTemplates) are underutilized

### 2. Strengths Analysis
- What the platform does well relative to industry benchmarks
- Which design decisions are aligned with current best practices
- Reference specific modules/features with evidence

### 3. Gap Analysis (Research-Backed)
Conduct web research across these domains and compare the platform against findings:

- **Playwright's full capability set** (visual testing, a11y, component testing, mobile emulation, trace viewer, fixtures, sharding, MCP)
- **Test automation training best practices 2025–2026** (TMM maturity model, TAU curricula, TestMu/UiPath certification patterns, World Quality Report findings)
- **AI-assisted testing evolution** (Copilot test generation advances, Playwright MCP, self-healing locators, nondeterministic output validation)
- **Enterprise QE maturity frameworks** (Deloitte QE model, Tricentis Continuous Testing Assessment, TMMi)
- **Assessment and certification patterns** in comparable training platforms

Categorize gaps into three tiers:
- **Critical (P1):** Gaps that undermine the platform's enterprise credibility or leave major Playwright capabilities untaught
- **Significant (P2):** Gaps that limit scalability, debugging capability, or CI maturity
- **Enhancement (P3):** Nice-to-haves that future-proof the platform

For each gap: name it, explain why it matters (with data/citations), note the industry reference, and map it to specific Playwright features or training patterns.

### 4. Core Guidelines
Synthesize 8–12 research-backed guidelines that should govern all training content. For each guideline:
- State the principle
- Assess the platform's current compliance (Covered / Partial / Missing)
- Cite the research basis (framework, report, or documentation source)

### 5. Expansion Plan
For each gap identified, propose a specific new module and/or practice app feature:
- Module title, filename, audience, section outline
- Which practice app feature it depends on (if any)
- Assessment components (quiz topic, exercise description)
- Copilot prompt template opportunities

Organize into three implementation tiers with clear dependencies between them.

### 6. Practice App Expansion
Propose new practice app features needed to support the expanded modules:
- Page name, route, key interactive elements
- Which modules they support
- Testing patterns they enable
- Any intentional issues (e.g., a11y violations for learners to discover)

### 7. Maturity Model Mapping
Place the platform on a 5-level maturity scale (adapt TMM/TMMi for training context):
- Current level with evidence
- Target level after each expansion tier
- Specific criteria for level progression

### 8. Success Metrics
Define measurable outcomes:
- Quantitative targets (module count, test count, feature count, quiz coverage %)
- Learner outcome metrics (time-to-first-test, assessment pass rate, sprint contribution)
- Platform maturity indicators

### 9. Implementation Roadmap
Propose a phased timeline (month-by-month) with:
- Which modules/features ship in each phase
- Dependencies between phases
- Milestone deliverables

---

## Research Instructions

- Search for current (2025–2026) sources on test automation training, Playwright capabilities, AI-assisted testing, and QE maturity frameworks
- Prioritize official documentation (Playwright docs, GitHub Copilot docs, Microsoft Learn), industry reports (World Quality Report, Capgemini/Sogeti), and recognized certification bodies (ISTQB, TAU, TestMu)
- Cite all sources with URLs
- Do not fabricate statistics — if a specific number isn't available, note the qualitative finding instead

---

## Output Format

- Produce a self-contained HTML file with navigation, tables, and visual hierarchy (dark theme preferred to match the platform's aesthetic)
- Or produce a well-structured markdown file if HTML is not feasible
- Save the output to the project's workspace folder
- Include a Sources section at the end with all referenced URLs

---

## What NOT To Do

- Do NOT write any code, create any modules, or modify any project files
- Do NOT execute the expansion plan — only produce the plan
- Do NOT make assumptions about gaps without researching current Playwright capabilities and industry benchmarks first
- Do NOT pad content — every recommendation should be traceable to a specific research finding or platform gap
