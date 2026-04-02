# Onboarding Deck — Relevant Content for Copilot-First Testing Course

> Extracted from `presentation/src/content/onboarding/content.json`

## Deck Metadata
- Brand Line: "GenAI Delivery"
- Title: "Onboarding"
- Subtitle: "Guidebook — Seven modules. From expectations to execution."
- Intro: "AI-Assisted Development — Team guidebook for AI-assisted delivery workflows"

---

## Slide: Expectations & Standards

**Headline:** Team Expectations — AI accelerates us, humans govern the outcome.

**Banner:** Every team member is responsible for the quality, security, and correctness of the work they produce — regardless of whether AI assisted in creating it. AI is a tool, not a teammate. You own the output.

**Cards:**
1. **You Own Every Line** (100% Human Owned) — AI-generated code ships under your name. You are accountable for understanding, reviewing, and validating every artifact.
2. **No Sensitive Data in AI** (Zero Tolerance) — Never paste CUI, PII, credentials, API keys, or any data classified above public into any AI tool.
3. **AI-Modified Sprints** (1 wk cadence) — Higher velocity expectations but more frequent checkpoints. Every MR goes through human review.
4. **Complete Tickets Required** (~95% Predictability) — AI tools produce better output from better input. Tickets must have fully fleshed out acceptance criteria.

**Callout:** "Speed without governance is recklessness. Governance without speed is irrelevance. We do both."

---

## Slide: Tools & Guardrails

**Approved:**
- GitHub Copilot — Primary dev tool. Autocomplete, inline chat, planning mode, agent mode, sub-agents.
- Sidekick — General-purpose AI assistant. Custom Skills development.
- M365 Copilot — Full Office suite.
- VS Code — Primary IDE. Planning mode, agent mode, sub-agent orchestration, MCP server integration.
- Visual Studio — .NET / Razor Pages development.

**Forbidden:**
- Loading CUI/FOUO Data
- PII in Prompts
- Production Credentials
- Unapproved Tools
- Blind Copy-Paste

---

## Slide: Developer Workflow (The AI-Assisted Loop)

**7 Steps:**
1. **Ticket Requirements** (human) — Start with fully fleshed out ticket. AC must be specific and testable.
2. **Planning Mode** (AI) — Use VS Code Copilot planning mode for implementation plan.
3. **Sub-Agent Execution** (AI) — Break plan into tasks. Multiple models and personas.
4. **Unit Test Generation** (AI) — Cover happy paths, edge cases, error handling.
5. **Integration & E2E Tests** (AI) — Generate Playwright tests for critical user flows. Validate selectors against actual UI.
6. **Multi-Angle Code Review** (human) — Correctness, security, performance, adversarial review.
7. **MR Creation & Review** (human) — Human reviewer validates against AC.

**Callout:** "The loop is tight by design. Every AI output passes through a human gate."

---

## Slide: Engineering Disciplines

**Three Pillars:**
1. **Context Engineering** — Curate what the model sees. Use system prompts and project instructions. Manage context window budget. Build reusable context packs.
2. **Prompt Engineering** — Standardized templates. Version-control prompts alongside code. Use structured output formats. Iterate like code: test, measure, refine.
3. **Tool & Skill Dev** — Build MCP servers. Create custom Sidekick Skills. Develop reusable tool chains.

---

## Slide: QA & Testing

**Headline:** QA Testers & AI — From manual testing to AI-assisted test automation.

**Banner:** Front-end QA testers can use AI to learn and write Playwright tests, augment manual testing, and contribute directly to CI/CD pipeline.

**Cards:**
1. **Learning Playwright with AI** — Use AI as a tutor: paste a component and ask it to explain how to write a test.
2. **Tests in the Pipeline** — AI-generated tests go into CI/CD. Every automated test is one less manual regression cycle.
3. **Augmenting Manual Testing** — AI generates test case matrices from AC, identifies edge cases, drafts defect reports.
4. **Test Coverage Mapping** — AI maps test cases back to requirements for traceability.

**Callout:** "QA doesn't need to become engineering. But QA that speaks the language of automation multiplies the whole team's velocity."

---

## Slide: Data & Compliance

**Three tiers:**
- **Never Input to AI:** CUI/FOUO, PII, Credentials & Secrets, Production Data
- **Use with Caution:** Internal Architecture Docs (sanitized), Ticket Descriptions (scrubbed), Code Patterns (strip comments)
- **Safe for AI Use:** Open Source Code, General Technical Questions, Sanitized Examples, Learning & Exploration
