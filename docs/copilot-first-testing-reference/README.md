# Copilot-First Testing — Reference Materials

All research, deck content, and existing module content gathered for creating the "Copilot-First Test Automation" training course.

## Contents

| # | File | Description | Lines |
|---|------|-------------|-------|
| 01 | [01-knowledge-base.md](01-knowledge-base.md) | Comprehensive research: Copilot features, Playwright best practices, MCP, prompt engineering, academic papers, 50+ references | ~1,100 |
| 02 | [02-course-plan.md](02-course-plan.md) | Detailed 10-module course plan with per-module specs, exercises, quizzes, content mapping | ~500 |
| 03 | [03-onboarding-deck-content.md](03-onboarding-deck-content.md) | Onboarding deck slides: expectations, tools, dev workflow, engineering disciplines, QA & testing, compliance | ~100 |
| 04 | [04-genai-advocacy-deck-content.md](04-genai-advocacy-deck-content.md) | GenAI advocacy deck: human-in-the-loop, hurdles, sprint cycle, prompt standardization | ~70 |
| 05 | [05-existing-mav-modules-content.md](05-existing-mav-modules-content.md) | Existing Course 1 modules 06-10 + legacy modules 04, 06, 07, 08, 11, 28 — all content relevant to Copilot/testing | ~200 |

## How These Were Used

1. **Knowledge base** (01) — Primary research source. 5 parallel agents searched official docs, academic papers, industry blogs, Microsoft Learn, and Playwright team content. Covers: Copilot modes, configuration, prompt engineering, Playwright best practices, failure patterns, MCP, POM with LLMs, tool comparison, and the full AI testing ecosystem.

2. **Course plan** (02) — Synthesized from knowledge base + existing content. Maps what's new vs. reused, defines per-module specs, identifies practice app pages, and includes implementation phases.

3. **Deck content** (03, 04) — Extracted from the presentation system. The onboarding deck's "three roles" model (Playwright/Copilot/You) and governance principles are threaded throughout the course. The GenAI deck's prompt standardization and hurdles content informs Modules 2, 9, and 10.

4. **Existing modules** (05) — Content from Course 1 and legacy modules that the new course builds on without duplicating. PAGE/CARD frameworks, locator hierarchy, recording workflow, refinement checklist, prompt templates, MCP/agents, and governance principles.

## Implemented Course

The course is implemented at:
```
training-app/src/data/courses/copilot-first-testing/
├── shared.ts         # Routes, credentials, helpers
├── course.ts         # Module assembly
├── index.ts          # Public export
└── modules/
    ├── 01-the-copilot-first-mindset.ts
    ├── 02-configure-your-ai-testing-toolkit.ts
    ├── 03-chat-driven-test-generation.ts
    ├── 04-page-prompts-upgraded.ts
    ├── 05-the-review-run-fix-loop.ts
    ├── 06-copilot-agent-mode.ts
    ├── 07-playwright-mcp.ts
    ├── 08-page-objects-and-multi-file-generation.ts
    ├── 09-spotting-ai-anti-patterns.ts
    └── 10-your-teams-prompt-playbook.ts
```

Registered in `curriculum.ts` and `data/index.ts`. Build verified clean (0 TypeScript errors, Vite production build success).
