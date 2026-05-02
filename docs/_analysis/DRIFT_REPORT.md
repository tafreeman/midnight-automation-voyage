# Drift Report

**Generated:** 2026-04-08
**Scope:** Contradictions between documentation files and actual codebase state.

---

## Critical Drift

### 1. ~~`training-app/README.md` — Entirely generic boilerplate~~ RESOLVED

- **Resolution:** Replaced with project-specific README covering architecture, data system, development commands, and standalone build.

### 2. ~~`practice-app/README.md` — Entirely generic boilerplate~~ RESOLVED

- **Resolution:** Replaced with project-specific README covering pages, test credentials, intentional defects, context providers, E2E tests, and deployment.

### 3. ~~`CLAUDE.md` says "27 modules" — `ROADMAP.md` says "31 modules"~~ RESOLVED

- **Verified counts:** 34 module files in `data/modules/`, 33 imported lessons (modules 04 and 08 each have 2 files). 2 standalone courses: First Playwright Tests (12 modules), Copilot-First Testing (10 modules).
- **Resolution:** Updated CLAUDE.md to say "33 legacy modules + 2 standalone courses". Updated README.md to list standalone courses separately from legacy curriculum.

### 4. ~~`README.md` says "33 tests" — `REPO-ANALYSIS.md` says "59 tests"~~ RESOLVED

- **Verified count:** 59 `test()` calls across 10 spec files in `test-cases/examples/`.
- **Resolution:** Updated README.md to say "10 files, 59 tests".

### 5. ~~`README.md` "9 pages" vs `ROADMAP.md` "12 routes, 10 page components"~~ RESOLVED

- **Resolution:** Updated README.md to say "9 pages, 12 routes" and clarified checkout is a multi-step wizard.

---

## Moderate Drift

### 6. ~~`CLAUDE.md` "Completed Roadmap Items" duplicates `ROADMAP.md`~~ RESOLVED

- **Resolution:** Removed "Completed Roadmap Items" from CLAUDE.md. Added link to AGENTS.md. CLAUDE.md now focuses on agent-context information.

### 7. ~~`packages/shared-config/` has no README~~ RESOLVED

- **Resolution:** Created `packages/shared-config/README.md` with exports table and usage examples.

### 8. ~~`docs/` directory has no index/README~~ RESOLVED

- **Resolution:** Created `docs/README.md` with categorised index of all documentation files.

### 9. `README.md` course table says "10 modules" per course but Course 3/4 lists differ

- **README.md lines 37-43:** Shows 10 modules × 4 courses = 40 total
- **ROADMAP.md:** Shows 31 modules in 6 tiers, not evenly divided into courses
- **Reality:** The course system groups modules differently from the module numbering. "40 modules" in README likely counts course lessons, while "31 modules" in ROADMAP counts unique modules.
- **Action:** Clarify the distinction in README.

---

## Minor Drift

### 10. `ROADMAP.md` "Last Updated: 2026-03-22" is stale

- **Action:** Update date on next edit.

### 11. `training-app-design/` references are not linked from root docs

- **Issue:** The design workspace and its reference docs are not mentioned in README or navigational docs.
- **Action:** Add to repo structure section in README.

### 12. ~~Agent-config not documented for contributors~~ RESOLVED

- **Resolution:** Created `.claude/README.md` and root `AGENTS.md`.
