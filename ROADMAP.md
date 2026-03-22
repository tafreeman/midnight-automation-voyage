# Midnight Automation Voyage — Roadmap & Backlog

**Last Updated:** 2026-03-22
**Current State:** Production-ready training platform with 31 modules, 12 practice-app pages, and full UX polish.

This document is the single source of truth for what has been implemented and what remains.

---

## Architecture Decision Records

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-01](ADR-01-Standalone.md) | Standalone Zero-Installation Architecture | Accepted (partially implemented) |
| [ADR-02](ADR-02-Platform-Architecture.md) | Platform Architecture & Navigation | Implemented |
| [ADR-03](ADR-03-Enterprise-Curriculum.md) | Enterprise Testing Curriculum Expansion | Implemented |
| [ADR-04](ADR-04-Assessment-Certification.md) | Assessment & Certification Layer | Partially implemented |

---

## Workstream A: Platform UX — COMPLETE

All 13 design audit items implemented. See [ADR-02](ADR-02-Platform-Architecture.md).

| Item | Status |
|------|--------|
| Replace monospace body text with Inter | Done |
| Add keyboard arrow navigation | Done |
| Fix disappearing sidebar (collapsed rail) | Done |
| Decouple "Next Lesson" from auto-completion | Done |
| Add localStorage progress persistence | Done |
| Add hash-based URL routing (deep linking) | Done |
| Quiz attempt required before lesson completion | Done |
| Responsive 3-column layout | Done |
| Mobile overlay sidebar | Done |
| 4 theme options | Done |
| ARIA labels and semantic HTML | Done |
| Radix UI component library (43 shadcn components) | Done |
| Scroll position persistence | Done |

---

## Workstream B: Assessment Backfill — 95% COMPLETE

See [ADR-04](ADR-04-Assessment-Certification.md).

| Item | Status | Notes |
|------|--------|-------|
| Quizzes: 30/31 modules | Done | Module 08 (Writing Tests) missing quiz |
| Exercises: 28/31 modules | Done | Modules 01-03 intentionally conceptual |
| Prompt templates: 29/31 modules | Done | Modules 01, 08 missing |
| Module 21: Certification content | Done | Competency matrix, tier defs, capstone rubric |
| Quiz gating on completion | Done | `canComplete = !lesson.quiz \|\| quizAttempted` |

### Remaining Backfill Work

| Item | Priority | Effort |
|------|----------|--------|
| Add Module 08 quiz | Low | Small — content authoring only |
| Add Module 01 prompt templates | Low | Small — content authoring only |

---

## Workstream C: Content Expansion — COMPLETE

See [ADR-03](ADR-03-Enterprise-Curriculum.md). All 31 modules authored.

| Tier | Modules | Status |
|------|---------|--------|
| Foundation (01-05) | Orientation, Mindset, What to Automate, Why Playwright, Env Setup | Done |
| Core Skills (06-10) | Prompt Engineering, Record & Refine, Writing Tests, POM, API Testing | Done |
| Review & Process (11-15) | Prompt Templates, Reading Results, HITL Checklist, Collab Authoring, CI/CD | Done |
| Tier 1: Enterprise (16-21) | Auth Fixtures, Visual Regression, A11y, Flaky Tests, Test Data, Certification | Done |
| Tier 2: Scale (22-27) | Trace Viewer, Mobile, Parallel, Multi-Browser, Tagging, GitHub Actions | Done |
| Tier 3: Advanced (28-31) | MCP/AI Agents, Component Testing, Performance, Custom Reporters | Done |

---

## Workstream D: Practice App Expansion — COMPLETE

12 routes, 10 page components, 3 context providers.

| Page/Feature | Route | Status | Purpose |
|-------------|-------|--------|---------|
| Login | `/login` | Done | Auth testing, lockout after 5 failures |
| Dashboard | `/dashboard` | Done | Visual regression target |
| Products | `/products` | Done | Search, filtering |
| Contact | `/contact` | Done | Form validation |
| Orders | `/orders` | Done | Table testing |
| Checkout: Shipping | `/checkout/shipping` | Done | Multi-step wizard |
| Checkout: Payment | `/checkout/payment` | Done | Multi-step wizard |
| Checkout: Review | `/checkout/review` | Done | Context integration |
| Checkout: Confirmation | `/checkout/confirmation` | Done | Final state |
| Settings | `/settings` | Done | 3 intentional a11y violations |
| Admin | `/admin` | Done | Role-gated, bulk ops, stale state bugs |
| Activity | `/activity` | Done | Mock modes (error/timeout/stale) |

| Context Provider | Status | Purpose |
|------------------|--------|---------|
| AuthContext | Done | Role-based auth (admin/editor/viewer) |
| CheckoutContext | Done | Multi-step checkout state |
| ToastContext | Done | Notifications with 3 race conditions |

---

## Remaining Work (Backlog)

### High Priority

| Item | ADR | Effort | Description |
|------|-----|--------|-------------|
| Certification progress dashboard | ADR-04 | Medium | UI showing Bronze/Silver/Gold status, modules remaining per tier |
| Module 08 quiz | ADR-04 | Small | Only module missing a quiz |

### Medium Priority

| Item | ADR | Effort | Description |
|------|-----|--------|-------------|
| Standalone single-file build | ADR-01 | Medium | Implement `vite-plugin-singlefile` for zero-install distribution |
| Tier-gated progression | ADR-04 | Medium | Optional enforcement: Bronze required before Silver content |
| File Upload practice page | ADR-03 | Small | Drag-and-drop/file input testing target (referenced in expansion plans) |
| Platform automated tests | — | Large | Unit/integration/E2E tests for the training app itself (currently 2/10) |

### Low Priority

| Item | ADR | Effort | Description |
|------|-----|--------|-------------|
| Capstone submission workflow | ADR-04 | Large | Mechanism for learners to submit capstone work |
| Certificate/badge generation | ADR-04 | Medium | Exportable PDF or digital badge on tier completion |
| Tier 3 practice app targets | ADR-03 | Large | Dedicated pages for MCP, component testing, performance, reporters |
| Playwright local file execution | ADR-01 | Small | Configure playwright.config.ts for `file://` protocol testing |

---

## Superseded Documents

The following documents were used during the audit/planning phase and are now superseded by this roadmap:

| Document | Type | Superseded By |
|----------|------|---------------|
| `CONSOLIDATED-AUDIT-REPORT.md` | Audit synthesis | This roadmap + REPO-ANALYSIS.md |
| `CONSOLIDATED-AUDIT-REPORT.html` | HTML version of above | This roadmap + REPO-ANALYSIS.md |
| `DESIGN-AUDIT.md` | UI/UX audit | ADR-02 (all items implemented) |
| `deisng audi.txt` | Draft of above | ADR-02 |
| `TRAINING-MATURITY-ASSESSMENT.md` | Maturity assessment | REPO-ANALYSIS.md |
| `QE-STRATEGIC-REPORT.html` | Strategic analysis | This roadmap |
| `qe-platform-expansion-plan.html` | Expansion plan | ADR-03 + this roadmap |
| `qe-training-platform-expansion-plan.html` | Expansion plan | ADR-03 + this roadmap |
| `training-analysis-and-expansion.html` | Detailed analysis | ADR-03 + REPO-ANALYSIS.md |
| `roadmap.html` | Original roadmap | This roadmap |
