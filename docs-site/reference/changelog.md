# Changelog

Significant changes and milestones for the Midnight Automation Voyage platform.

## Current State

**Last Updated:** 2026-03-22
**Platform Status:** Production-ready with 33 legacy modules, 2 standalone courses (22 modules), and 12 practice-app pages.

## Milestones

### Platform UX — Complete ✅

All 13 design audit items implemented per [ADR-02](architecture#adr-02-platform-architecture-and-navigation):

- Replaced monospace body text with Inter
- Added keyboard arrow navigation
- Fixed disappearing sidebar (collapsed rail)
- Decoupled "Next Lesson" from auto-completion
- Added localStorage progress persistence
- Added hash-based URL routing (deep linking)
- Quiz attempt required before lesson completion
- Responsive 3-column layout
- Mobile overlay sidebar
- 6 theme options (was 4, expanded)
- ARIA labels and semantic HTML
- Radix UI component library (43 shadcn components)
- Scroll position persistence

### Assessment Backfill — 95% Complete ✅

Per [ADR-04](architecture#adr-04-assessment-and-certification-layer):

- Quizzes: 30/31 modules (Module 08 missing)
- Exercises: 28/31 modules (Modules 01–03 intentionally conceptual)
- Prompt templates: 29/31 modules
- Quiz gating on lesson completion

### Content Expansion — Complete ✅

Per [ADR-03](architecture#adr-03-enterprise-testing-curriculum-expansion):

| Tier | Modules | Status |
|------|---------|--------|
| Foundation (01–05) | Orientation, Mindset, What to Automate, Why Playwright, Setup | Done |
| Core Skills (06–10) | Prompt Engineering, Record & Refine, Writing Tests, POM, API | Done |
| Review & Process (11–15) | Templates, Results, HITL, Collaboration, CI/CD | Done |
| Enterprise (16–21) | Auth, Visual, A11y, Flaky, Data, Certification | Done |
| Scale (22–27) | Trace, Mobile, Parallel, Multi-Browser, Tagging, Actions | Done |
| Advanced (28–31) | MCP/AI, Components, Performance, Reporters | Done |

### Practice App Expansion — Complete ✅

12 routes, 10 page components, 3 context providers:

- Login, Dashboard, Products, Contact, Orders
- Checkout (4-step wizard: Shipping → Payment → Review → Confirmation)
- Settings (with 3 intentional a11y violations)
- Admin (role-gated, bulk ops, stale state bugs)
- Activity (mock modes: error/timeout/stale)

### Standalone Courses — Complete ✅

- **First Playwright Tests** — 10 modules, full narration, quizzes, exercises
- **Copilot-First Testing** — 10 modules, complete content

## Backlog

### High Priority

| Item | Effort | Description |
|------|--------|-------------|
| Certification progress dashboard | Medium | UI showing Bronze/Silver/Gold status |
| Module 08 quiz | Small | Only module missing a quiz |

### Medium Priority

| Item | Effort | Description |
|------|--------|-------------|
| Standalone single-file build | Medium | Zero-install distribution via `vite-plugin-singlefile` |
| Tier-gated progression | Medium | Optional: Bronze required before Silver |
| File Upload practice page | Small | Drag-and-drop/file input testing target |
| Platform automated tests | Large | Unit/integration/E2E tests for training app |

### Low Priority

| Item | Effort | Description |
|------|--------|-------------|
| Capstone submission workflow | Large | Mechanism for learner submissions |
| Certificate/badge generation | Medium | Exportable PDF or digital badge |
| Tier 3 practice app targets | Large | Dedicated pages for MCP, components, perf |
