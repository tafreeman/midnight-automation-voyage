# ADR-04: Establish a Verifiable Assessment & Certification Layer

## Status
**Partially Implemented** — Content authored (Module 21, quizzes, exercises); platform-level certification tracking NOT yet built.

## Context
The original platform had only 67% quiz coverage and 13% exercise coverage (per the initial audit reports). Enterprise clients and certification bodies require measurable evidence of applied skill, not just content consumption. Kirkpatrick's framework distinguishes between Level 2 (Learning — quizzes) and Level 3 (Behavior — applied exercises). Without assessment gating, a team can complete 100% of training modules and still write zero automated tests.

This ADR consolidates the original ADR-007 (Three-Tier Certification System).

## Decision
Implement a three-tier certification system with progressive gating:

### Tier Definitions (from Module 21 content)

| Tier | Requirements | Proves |
|------|-------------|--------|
| **Bronze** | Complete Modules 01-15, pass all quizzes with 80%+ | Foundational knowledge of test automation and Playwright basics |
| **Silver** | Bronze + Modules 16-21, pass capstone exercise | Applied competency — auth fixtures, a11y scans, flaky test handling |
| **Gold** | Silver + Tier 2/3 modules, contribute a real test to a project repo | Production-ready — can independently automate and maintain tests |

### Assessment Coverage Targets
- Every module requires at least one quiz attempt before marking as complete
- Exercises provide starter code, solution code, hints, and difficulty ratings
- Silver capstone: write a mini test suite combining auth, functional, a11y, and HITL review

### What Exists Today (Content Layer)
- **Quizzes:** 30/31 modules (Module 08 is the only gap)
- **Exercises:** 28/31 modules (Modules 01-03 intentionally conceptual — no exercises)
- **Prompt Templates:** 29/31 modules
- **Module 21 content:** Full competency matrix, tier definitions, capstone structure, grading rubric
- **Quiz gating:** `canComplete = !lesson.quiz || quizAttempted` enforced in LessonView.tsx

### What Does NOT Exist Yet (Platform Layer)
- **Certification dashboard** — No UI showing Bronze/Silver/Gold progress or badge earned
- **Tier-gated progression** — No enforcement that Bronze modules must be passed before Silver content unlocks
- **Capstone submission workflow** — No mechanism for learners to submit capstone work for evaluation
- **Certificate generation** — No exportable certificate/badge upon tier completion
- **Module 08 quiz** — Only module missing a quiz

## Consequences

### Positive (when fully implemented)
- Enterprise credibility: measurable ROI for training investment
- Prevents "checkbox completion" where learners advance without demonstrating skill
- Three-tier structure allows teams to set realistic targets (most aim for Silver)

### Negative
- Platform-level certification features represent significant UI/UX work (dashboard, badges, gating logic)
- Capstone evaluation requires either automated grading or manual review workflow
- Tier gating could frustrate advanced learners who want to skip foundational modules

## Implementation Path
1. **Phase 1:** Add Module 08 quiz (content gap — minimal effort)
2. **Phase 2:** Build certification progress dashboard (UI showing tier status, modules remaining)
3. **Phase 3:** Implement tier-gated progression (optional — configurable by team leads)
4. **Phase 4:** Capstone submission and evaluation workflow
5. **Phase 5:** Certificate/badge generation (PDF or digital badge)
