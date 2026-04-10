# Midnight Automation Voyage — Repo Analysis, 6-Month Roadmap, and Ticket Backlog

**Prepared:** 2026-04-10  
**Basis:** Repository inspection, ADR review, roadmap review, docs audit, content audit, and source-code verification

> This document converts the latest repo analysis into a project-ready markdown backlog.  
> It is intended to be the working draft for GitHub issues/project tickets.

## Note on ticket creation

This repository workspace supports code and documentation changes, but the currently available GitHub tools in this session do **not** include issue creation or project-item creation APIs.  
Because of that, the tickets below are written in a **ready-to-create** format with title, description, scope, and acceptance criteria so they can be added to the GitHub project with minimal editing.

---

## 1. Current State Summary

### Verified platform inventory

- **Legacy module files:** 34 files in `training-app/src/data/modules/`
- **Standalone courses:** 2
  - `first-playwright-tests`
  - `copilot-first-testing`
- **Practice app:** 12 routes, 10 page components, 3 context providers
- **Reference tests:** 10 Playwright spec files, 59 tests
- **Docs site:** VitePress in `docs-site/`
- **Standalone build:** `vite-plugin-singlefile` is already configured in both apps
- **Progress persistence:** `localStorage` via `ProgressContext`

### Key strengths

1. Strong curriculum breadth across beginner to advanced topics
2. Realistic practice app with intentional defects for testing
3. Good type safety and content-model discipline
4. Portable client-side architecture with single-file builds already wired in
5. High-quality reference Playwright specs and practical labs

### Key weaknesses

1. `curriculum.ts` still drops extra exercises from `exercises[]`
2. Platform self-testing is very limited
3. Certification exists in content, not as a platform feature
4. The content audit backlog remains large
5. Several docs are stale or contradictory
6. UI density issues reduce learning usability
7. A few duplicate/stale course files still exist

### Known outdated docs to fix

| File | Outdated Claim | Verified Reality |
|---|---|---|
| `ROADMAP.md` | Single-file build still pending | Already configured in both Vite apps |
| `ROADMAP.md` | 4 themes | Theme system currently has 6 options |
| `docs/courses/copilot-first-testing-course-plan.md` | Still marked as plan/awaiting approval | Course is implemented |
| `docs-site/guide/getting-started.md` | Old module/page counts | Counts have changed |
| `docs-site/courses/index.md` | Copilot-First module list does not match implementation | Needs update to actual course modules |

---

## 2. Roadmap Themes

### Month 0 — Immediate cleanup
- Fix broken content references
- Remove stale duplicates
- Correct stale docs
- Fill the remaining legacy quiz gap

### Month 1 — Quality and usability
- Fix hidden exercise loss
- Improve lesson page density
- Resolve content audit items
- Add authored metadata support

### Month 2 — Platform structure
- Implement multi-lesson module support
- Split pilot modules
- Build certification dashboard
- Add adapter tests

### Month 3 — Distribution and practice parity
- Finish true local-file Playwright workflow
- Validate standalone distribution
- Add interactions/file-upload practice targets

### Month 4 — Content expansion
- Fill remaining Playwright topic gaps
- Add richer section block types

### Month 5 — Assessment maturity
- Tier gating
- Capstone submission flow
- Badge/certificate generation
- Richer quiz model

### Month 6 — Platform hardening
- Training-app integration and E2E coverage
- Practice-app route coverage
- Second wave of module splits
- Docs and accessibility refresh

---

## 3. Ticket Backlog

Each ticket below is formatted for direct issue creation.

---

## Month 0 — Immediate Cleanup Tickets

### MAV-001 — Fix broken references in First Playwright Tests modules

- **Priority:** P0
- **Effort:** Small
- **Type:** Content

**Description**  
The current course audit identified multiple broken or misleading references in the standalone `first-playwright-tests` course. These include incorrect credentials, route references, selector assumptions, and command guidance. These issues directly affect learner trust because users following the lesson content can hit incorrect behavior or dead ends.

**Scope**
- Fix the 8 P0 items from `docs/content-audit-report.md`
- Re-verify each corrected reference against the practice app and current lesson content
- Update any affected hints, examples, or instructions in the relevant modules

**Acceptance criteria**
- All P0 audit findings are resolved or explicitly closed as false positives
- Lesson instructions match current routes, selectors, and credentials
- No course example references a command or target that is incorrect in the repo

**Dependencies**
- None

---

### MAV-002 — Delete stale duplicate module files in `first-playwright-tests`

- **Priority:** P1
- **Effort:** Extra small
- **Type:** Cleanup

**Description**  
The standalone `first-playwright-tests` module directory contains stale duplicate files from earlier iterations. These increase maintenance confusion and make audit/review work harder than it needs to be.

**Scope**
- Remove the stale duplicate lesson files identified in the audit
- Verify imports/exports do not reference the deleted files
- Confirm the live course still builds from the intended files only

**Acceptance criteria**
- Duplicate stale files are removed from the course directory
- Course entrypoints still resolve correctly
- No dead imports remain

**Dependencies**
- None

---

### MAV-003 — Fix duplicate legacy module ID in curriculum mapping

- **Priority:** P1
- **Effort:** Extra small
- **Type:** Data integrity

**Description**  
The legacy curriculum mapping contains a duplicate module ID, which creates avoidable ambiguity in lookups and future migrations. This should be corrected before broader curriculum architecture work continues.

**Scope**
- Fix the duplicate ID in the legacy mapping
- Verify downstream lookups still resolve correctly
- Confirm there are no remaining duplicated IDs in the legacy set

**Acceptance criteria**
- Every legacy module ID is unique
- Curriculum lookup logic remains stable
- Any audit reference to the duplicate ID is updated

**Dependencies**
- None

---

### MAV-004 — Update `ROADMAP.md` to reflect verified current state

- **Priority:** P1
- **Effort:** Extra small
- **Type:** Documentation

**Description**  
`ROADMAP.md` is the repo backlog/status source of truth, but it currently contains several stale claims. Those stale statements make planning less reliable and should be corrected before using the roadmap as an execution guide.

**Scope**
- Mark standalone single-file build as implemented
- Correct theme count
- Correct any module/page counts that no longer reflect the codebase
- Preserve roadmap structure while updating stale facts

**Acceptance criteria**
- `ROADMAP.md` matches the verified current implementation
- Implemented items are no longer listed as pending
- Counts align with the codebase

**Dependencies**
- None

---

### MAV-005 — Update Copilot-First course plan doc from planned to implemented

- **Priority:** P1
- **Effort:** Extra small
- **Type:** Documentation

**Description**  
The Copilot-First course plan document still says the course is awaiting approval even though the course is present in the repository. This creates confusion for maintainers and reviewers.

**Scope**
- Update status language in `docs/courses/copilot-first-testing-course-plan.md`
- Add a brief note clarifying whether the document is now historical design context or active reference

**Acceptance criteria**
- The document no longer claims the course is unimplemented
- Readers can clearly understand the document’s purpose

**Dependencies**
- None

---

### MAV-006 — Sync docs-site course catalog with actual Copilot-First modules

- **Priority:** P1
- **Effort:** Extra small
- **Type:** Documentation

**Description**  
The docs-site course catalog lists Copilot-First Testing using outdated module titles/order. That makes the public docs disagree with the shipped course.

**Scope**
- Replace the stale module list in `docs-site/courses/index.md`
- Ensure course metadata matches the actual authored course
- Review related docs-site course pages for consistency

**Acceptance criteria**
- Docs-site catalog matches the real implemented module titles
- Copilot-First Testing no longer looks like a legacy/placeholder course

**Dependencies**
- None

---

### MAV-007 — Update getting-started docs with current repo counts and structure

- **Priority:** P2
- **Effort:** Extra small
- **Type:** Documentation

**Description**  
`docs-site/guide/getting-started.md` still reflects older inventory counts. It should match the current module count, route count, and repo structure.

**Scope**
- Update module counts, course counts, and page/route counts
- Verify repo structure summary against current folders
- Keep onboarding instructions accurate

**Acceptance criteria**
- Inventory counts are accurate
- Getting-started guidance reflects current repo layout

**Dependencies**
- None

---

### MAV-008 — Add the missing legacy Module 08 quiz

- **Priority:** P2
- **Effort:** Small
- **Type:** Content

**Description**  
Legacy Module 08 remains the only module without a quiz. This leaves the assessment coverage incomplete and keeps ADR-04 partially blocked at the content layer.

**Scope**
- Author a quiz for Module 08
- Align the quiz with the module’s learning goals
- Ensure quiz gating works as expected for the lesson

**Acceptance criteria**
- Module 08 has a complete quiz
- Quiz data is valid and renders correctly
- Assessment coverage gap is closed

**Dependencies**
- None

---

## Month 1 — Quality and Usability Tickets

### MAV-010 — Fix `curriculum.ts` so all authored exercises are preserved

- **Priority:** P0
- **Effort:** Medium
- **Type:** Architecture / Content delivery

**Description**  
The current adapter only exposes the first item from `exercises[]`, which hides additional authored exercises from learners. This is the most important structural content bug because it silently reduces lesson depth.

**Scope**
- Add `exercises?: CodeExercise[]` support to the V2 lesson model
- Preserve all authored exercises in the adapter
- Update lesson rendering to support multiple exercises
- Migrate progress state if needed

**Acceptance criteria**
- Lessons with multiple exercises show all authored exercises
- Existing single-exercise lessons still work
- No exercise content is silently dropped by the adapter

**Dependencies**
- None

---

### MAV-011 — Recover viewport space on lesson pages with top 5 density fixes

- **Priority:** P1
- **Effort:** Small
- **Type:** UX

**Description**  
The lesson page currently uses too much vertical chrome before content becomes visible. The audit estimates roughly 400px can be recovered with a focused set of layout changes.

**Scope**
- Collapse narration by default
- Flatten the lesson hero
- Hide tab bar for single-tab lessons
- Reduce excessive spacing
- Widen the content area where appropriate

**Acceptance criteria**
- More lesson content is visible above the fold on a 1080p viewport
- Lesson navigation remains clear
- No regression in readability or keyboard navigation

**Dependencies**
- None

---

### MAV-012 — Reduce density issues on module overview pages

- **Priority:** P2
- **Effort:** Small
- **Type:** UX

**Description**  
Module overview pages also spend too much vertical space on hero and stats blocks before learners can reach lesson lists.

**Scope**
- Flatten overview hero content
- Remove redundant stats
- Move or collapse lower-priority overview content

**Acceptance criteria**
- Lesson lists appear sooner on standard viewport sizes
- Redundant overview UI is removed

**Dependencies**
- None

---

### MAV-013 — Remove repetitive teaching across modules

- **Priority:** P2
- **Effort:** Medium
- **Type:** Content quality

**Description**  
Several concepts are repeated too many times with near-identical wording, including AAA, locator hierarchy, CARD, and auto-wait. The primary home for each topic should stay strong while secondary mentions should reference, not duplicate.

**Scope**
- Identify primary “home” module for each repeated concept
- Trim repeated explanations from later modules
- Replace duplication with shorter references where appropriate

**Acceptance criteria**
- Duplicate explanations are reduced
- Course progression feels tighter and less repetitive
- Core concepts still remain discoverable

**Dependencies**
- None

---

### MAV-014 — Complete medium-severity exercise quality fixes from content audit

- **Priority:** P1
- **Effort:** Medium
- **Type:** Content quality

**Description**  
The audit identified multiple exercise problems such as starter/solution mismatches, misleading hardcoded expectations, and inconsistent locator strategies between lessons.

**Scope**
- Implement the exercise-level fixes documented in `docs/content-audit-fix-plan.md`
- Standardize solution quality where intended
- Clarify exercise expectations and assumptions

**Acceptance criteria**
- Starter code and solution code relationships are intentional and consistent
- Exercises no longer imply wrong or confusing expectations
- Audit items for this batch are closed

**Dependencies**
- MAV-001 may resolve part of this work

---

### MAV-015 — Complete low-severity narration and tone polish items

- **Priority:** P3
- **Effort:** Small
- **Type:** Content polish

**Description**  
Some narration scripts contain filler, mismatched step counts, or language that is less clear than it should be. This is not blocking, but it noticeably improves course quality.

**Scope**
- Apply the approved wording fixes from the content audit fix plan
- Keep narration aligned with lesson content
- Preserve the current narrative style while tightening clarity

**Acceptance criteria**
- Narration feels more concise and accurate
- Step counts and references are internally consistent

**Dependencies**
- None

---

### MAV-016 — Support authored metadata in legacy lesson model

- **Priority:** P2
- **Effort:** Small
- **Type:** Content architecture

**Description**  
The adapter currently synthesizes difficulty, time estimates, and learning objectives from heuristics. Authored metadata should be preferred when present so lessons can be more accurate.

**Scope**
- Add optional authored metadata fields to the legacy lesson type
- Update adapter logic to prefer authored values over generated values

**Acceptance criteria**
- Authored metadata is supported without breaking legacy lessons
- Generated metadata remains as fallback

**Dependencies**
- None

---

### MAV-017 — Author pilot metadata for selected high-value modules

- **Priority:** P2
- **Effort:** Small
- **Type:** Content

**Description**  
Once authored metadata is supported, a pilot set of modules should be updated first to establish the pattern and improve the highest-value learning paths.

**Scope**
- Add metadata to Modules 01, 07, 16, 21, and 28
- Verify these values render correctly in the app

**Acceptance criteria**
- Pilot modules use authored metadata in the UI
- Values are sensible and more accurate than current generated estimates

**Dependencies**
- MAV-016

---

### MAV-018 — Remove debug-oriented theme indicator from production layout

- **Priority:** P3
- **Effort:** Extra small
- **Type:** UX polish

**Description**  
The “Active Theme” header badge appears to be development/debug chrome rather than learner-facing UI.

**Scope**
- Remove the badge from production layout
- Confirm theme switching remains fully usable

**Acceptance criteria**
- Theme state is not redundantly exposed in the header
- Theme selection behavior is unchanged

**Dependencies**
- None

---

### MAV-019 — Refresh changelog and analysis docs after Month 0/1 work

- **Priority:** P3
- **Effort:** Small
- **Type:** Documentation

**Description**  
After the initial cleanup and quality work lands, the analysis and changelog docs should be refreshed so they remain useful for future planning.

**Scope**
- Update the repo analysis summary
- Update changelog/current-state references
- Mark resolved audit items where appropriate

**Acceptance criteria**
- Analysis docs match the codebase after M0/M1 execution
- Completed work is reflected in documentation

**Dependencies**
- Month 0 and Month 1 tickets

---

## Month 2 — Platform Structure Tickets

### MAV-020 — Implement multi-lesson module support and progress migration

- **Priority:** P1
- **Effort:** Medium
- **Type:** Architecture

**Description**  
Many modules are still one long lesson. The current app types support multiple lessons, but the legacy adapter path does not yet use that flexibility. This work enables more granular course structure and progress tracking.

**Scope**
- Add support for V2/multi-lesson module definitions
- Update progress handling for split modules
- Provide migration strategy for existing local progress data

**Acceptance criteria**
- Multi-lesson modules can be authored and rendered
- Existing legacy modules still function
- Existing learner progress is not lost without a defined migration path

**Dependencies**
- MAV-010 recommended first

---

### MAV-021 — Split the 5 pilot modules into multi-lesson format

- **Priority:** P2
- **Effort:** Medium
- **Type:** Content architecture

**Description**  
The pilot module splitting plan defines natural lesson boundaries for Modules 07, 14, 21, 25, and 30. These should be implemented first before broader rollout.

**Scope**
- Convert the 5 planned pilot modules to multi-lesson format
- Preserve quiz/exercise attribution appropriately
- Verify lesson navigation within split modules

**Acceptance criteria**
- All 5 pilot modules are split as designed
- Learners can navigate lesson-to-lesson within a module
- Progress tracking works per lesson

**Dependencies**
- MAV-020

---

### MAV-022 — Build certification progress dashboard

- **Priority:** P1
- **Effort:** Large
- **Type:** Platform feature

**Description**  
Certification currently exists only in content and ADR documentation. Learners need a visible dashboard showing Bronze/Silver/Gold progress, remaining modules, and overall readiness.

**Scope**
- Design and build certification status UI
- Show requirements per tier
- Show remaining work per tier
- Integrate with progress and quiz results

**Acceptance criteria**
- Learners can see certification progress from the app
- Dashboard accurately reflects completed and remaining requirements
- Bronze/Silver/Gold definitions are understandable in the UI

**Dependencies**
- Progress data must be reliable

---

### MAV-023 — Add tier computation logic for Bronze/Silver/Gold

- **Priority:** P1
- **Effort:** Medium
- **Type:** Platform logic

**Description**  
The certification dashboard needs a backing rules engine to determine tier readiness using module completion, quiz thresholds, and capstone requirements.

**Scope**
- Implement certification rule computation
- Align logic with ADR-04 and Module 21 definitions
- Expose tier status for UI consumption

**Acceptance criteria**
- Tier readiness is computed consistently
- Rules match documented certification definitions
- Logic is testable and not embedded only in UI rendering

**Dependencies**
- MAV-022 UI can proceed in parallel, but both should converge together

---

### MAV-024 — Add unit tests for curriculum adapter and migrations

- **Priority:** P1
- **Effort:** Medium
- **Type:** Testing

**Description**  
The curriculum adapter is central to content delivery, but it currently lacks test coverage. This becomes more risky as exercise preservation, authored metadata, and multi-lesson support are added.

**Scope**
- Add tests for exercise preservation
- Add tests for metadata override behavior
- Add tests for multi-lesson fallback/compatibility behavior
- Add tests for progress migration logic

**Acceptance criteria**
- Adapter behavior is covered by automated tests
- Regressions in exercise handling or migration logic are caught automatically

**Dependencies**
- MAV-010, MAV-016, MAV-020

---

### MAV-025 — Complete authored metadata wave 2 for remaining legacy modules

- **Priority:** P3
- **Effort:** Medium
- **Type:** Content

**Description**  
After the pilot metadata work, the rest of the legacy module set should receive authored metadata to reduce dependence on synthetic estimates.

**Scope**
- Add metadata to remaining legacy modules in planned waves
- Keep values consistent and realistic

**Acceptance criteria**
- Legacy modules no longer rely primarily on generated metadata
- Metadata quality is consistent across the curriculum

**Dependencies**
- MAV-016

---

## Month 3 — Distribution and Practice Parity Tickets

### MAV-030 — Configure Playwright for `file://` execution of standalone artifacts

- **Priority:** P2
- **Effort:** Small
- **Type:** Tooling

**Description**  
Single-file builds already exist, but the platform still needs a reliable Playwright workflow for testing local-file artifacts directly, matching ADR-01’s intended distribution model.

**Scope**
- Update or add Playwright config for local-file execution
- Document any route or asset constraints
- Verify against built standalone output

**Acceptance criteria**
- Playwright can run against built standalone artifacts without a local web server
- Config is documented and repeatable

**Dependencies**
- Standalone build must already be working

---

### MAV-031 — Validate standalone distribution end-to-end

- **Priority:** P2
- **Effort:** Small
- **Type:** Validation

**Description**  
Even though single-file builds are configured, the full learner journey should be validated in packaged form: open the files, navigate, persist progress, and link between training/practice surfaces.

**Scope**
- Build both apps
- Open them from the local filesystem
- Verify navigation, state persistence, and cross-link behavior
- Document any issues found

**Acceptance criteria**
- Standalone learner flow is validated
- Known limitations are documented

**Dependencies**
- MAV-030 recommended

---

### MAV-032 — Document the standalone learner workflow

- **Priority:** P3
- **Effort:** Small
- **Type:** Documentation

**Description**  
If the standalone distribution path is a core product strength, the repo and docs-site should clearly explain how to build, distribute, and use it.

**Scope**
- Update docs for standalone mode
- Cover both maintainer build flow and learner usage flow

**Acceptance criteria**
- Standalone workflow is clearly documented
- Maintainers and learners can follow the documented path without guesswork

**Dependencies**
- MAV-031

---

### MAV-033 — Add `/interactions` practice target for file upload, iframe, and download testing

- **Priority:** P1
- **Effort:** Medium
- **Type:** Practice app

**Description**  
Module 32 covers complex DOM interactions, but the practice app does not yet provide a dedicated target for those behaviors. This leaves the content ahead of the product surface.

**Scope**
- Add a page or route covering file upload
- Add iframe-based interaction target
- Add file download target
- Keep the page aligned with curriculum needs

**Acceptance criteria**
- Learners have a concrete app surface for Module 32 techniques
- The new route is navigable and documented

**Dependencies**
- None

---

### MAV-034 — Add intentional test targets/bugs to the interactions page

- **Priority:** P2
- **Effort:** Small
- **Type:** Practice app design

**Description**  
The practice app is intentionally imperfect by design. The new interactions page should also provide stable targets and a few meaningful defects for learners to find or assert against.

**Scope**
- Add at least a small set of intentional issues or awkward states
- Keep them realistic and useful for learning

**Acceptance criteria**
- The page provides useful test scenarios, not just happy-path UI
- Defects are intentional and documented for maintainers

**Dependencies**
- MAV-033

---

### MAV-035 — Add reference Playwright specs for the interactions page

- **Priority:** P2
- **Effort:** Medium
- **Type:** Test cases

**Description**  
Once the interactions practice target exists, the reference test suite should include examples for upload, download, and iframe interactions.

**Scope**
- Add specs or extend existing examples
- Keep conventions aligned with the rest of `test-cases/examples/`

**Acceptance criteria**
- Reference examples exist for the new interaction types
- The examples follow repo testing conventions

**Dependencies**
- MAV-033

---

### MAV-036 — Document the interactions page in learner-facing docs

- **Priority:** P3
- **Effort:** Extra small
- **Type:** Documentation

**Description**  
The practice app guide should reflect the new interactions page once it exists.

**Scope**
- Update docs-site practice app guide
- Describe the page’s purpose and testable behaviors

**Acceptance criteria**
- Learners can discover and understand the new page from docs

**Dependencies**
- MAV-033

---

## Month 4 — Content Expansion Tickets

### MAV-040 — Expand Module 23 with non-viewport emulation topics

- **Priority:** P2
- **Effort:** Medium
- **Type:** Content expansion

**Description**  
Module 23 currently focuses on viewport/device behavior, but still lacks coverage for geolocation, timezone, locale, and permissions emulation.

**Scope**
- Add sections for geolocation, timezone, locale, and permissions
- Ensure examples are practical and enterprise-relevant

**Acceptance criteria**
- Module 23 covers the broader emulation surface
- New content is technically accurate and coherent with the existing module

**Dependencies**
- None

---

### MAV-041 — Add a dedicated Playwright UI Mode section to debugging content

- **Priority:** P2
- **Effort:** Small
- **Type:** Content expansion

**Description**  
UI Mode is currently only mentioned in a shallow way. It deserves a dedicated explanation because it is one of the most useful debugging workflows for learners.

**Scope**
- Add a proper UI Mode section to the most appropriate module
- Compare `--ui`, `--headed`, and `--debug`
- Explain when each workflow is useful

**Acceptance criteria**
- UI Mode is taught as a real workflow, not a single command mention
- Learners can understand when to choose it

**Dependencies**
- None

---

### MAV-042 — Add `globalTeardown` guidance to advanced setup content

- **Priority:** P3
- **Effort:** Small
- **Type:** Content expansion

**Description**  
The curriculum covers `globalSetup` more thoroughly than `globalTeardown`. The latter should also be explained for cleanup and reliable environment reset patterns.

**Scope**
- Add `globalTeardown` examples and guidance
- Position it alongside related setup/fixture content

**Acceptance criteria**
- The topic is covered with actionable examples
- Learners can understand when and why to use teardown

**Dependencies**
- None

---

### MAV-043 — Ensure Module 32 is fully surfaced in app navigation/course structure

- **Priority:** P2
- **Effort:** Small
- **Type:** Product wiring

**Description**  
Module 32 exists in the legacy module set and should be verified as visible and intentionally placed in the learner experience.

**Scope**
- Confirm how Module 32 appears in the course structure
- Adjust navigation or grouping if needed

**Acceptance criteria**
- Module 32 is discoverable in the intended course path
- There is no mismatch between authored content and navigation

**Dependencies**
- None

---

### MAV-044 — Add richer curriculum block types

- **Priority:** P3
- **Effort:** Medium
- **Type:** Content architecture

**Description**  
The current curriculum rendering model is limited to a small set of block types. Adding checklist, steps, stat-group, and summary blocks will support clearer instructional layouts without awkward workarounds.

**Scope**
- Extend curriculum types with new block variants
- Keep backward compatibility for current content

**Acceptance criteria**
- New block types are supported in the type system
- Existing content still renders correctly

**Dependencies**
- None

---

### MAV-045 — Render the new block types in lesson pages

- **Priority:** P3
- **Effort:** Medium
- **Type:** UI/content rendering

**Description**  
Once the model supports richer section types, the lesson renderer should display them natively.

**Scope**
- Add rendering cases for each new block type
- Keep rendering simple and consistent with the existing design system

**Acceptance criteria**
- Each new block type renders clearly in lesson detail pages
- The UI remains readable across themes

**Dependencies**
- MAV-044

---

### MAV-046 — Retrofit selected content to use checklist/steps blocks

- **Priority:** P3
- **Effort:** Small
- **Type:** Content

**Description**  
After new block types are available, selected modules should adopt them where they improve clarity, especially HITL and process-oriented modules.

**Scope**
- Identify the highest-value modules to convert first
- Update content definitions with better block types

**Acceptance criteria**
- Converted lessons are clearer than before
- No content fidelity is lost during conversion

**Dependencies**
- MAV-044, MAV-045

---

### MAV-047 — Add authored metadata to standalone course modules

- **Priority:** P3
- **Effort:** Medium
- **Type:** Content

**Description**  
Standalone course modules should also use authored time estimates, objectives, and difficulty where useful for consistency with the broader curriculum.

**Scope**
- Add metadata to both standalone course sets
- Verify those values render where surfaced

**Acceptance criteria**
- Standalone courses benefit from authored metadata
- Metadata is consistent and useful

**Dependencies**
- MAV-016 pattern can inform this work

---

## Month 5 — Assessment Maturity Tickets

### MAV-050 — Implement optional tier-gated progression

- **Priority:** P2
- **Effort:** Medium
- **Type:** Platform feature

**Description**  
Some organizations will want Bronze requirements enforced before learners move deeper into the curriculum. This should be supported as an optional product mode, not a hardcoded default for everyone.

**Scope**
- Add configurable progression gating
- Keep the feature optional
- Make restrictions understandable in the UI

**Acceptance criteria**
- Tier gating can be enabled or disabled
- Learners understand why content is locked when gating is on

**Dependencies**
- MAV-022, MAV-023

---

### MAV-051 — Add capstone submission workflow

- **Priority:** P2
- **Effort:** Large
- **Type:** Platform feature

**Description**  
ADR-04 defines capstone expectations, but the platform has no actual submission flow. This prevents the Silver/Gold path from becoming operational.

**Scope**
- Create a structured capstone submission flow
- Capture enough information for review
- Define local-only versus future external-review assumptions

**Acceptance criteria**
- Learners can submit capstone work inside the platform flow
- Submission requirements align with Module 21 and ADR-04

**Dependencies**
- MAV-022, MAV-023

---

### MAV-052 — Add badge/certificate generation

- **Priority:** P3
- **Effort:** Medium
- **Type:** Platform feature

**Description**  
Certification progress should culminate in a visible learner artifact. A downloadable badge or certificate adds closure and makes the platform more enterprise-usable.

**Scope**
- Define output format
- Generate learner-facing completion artifact
- Keep design consistent with the platform

**Acceptance criteria**
- A completed tier can produce a downloadable certificate or badge
- Completion artifact is tied to verified tier logic

**Dependencies**
- MAV-022, MAV-023

---

### MAV-053 — Design richer quiz model for future assessment work

- **Priority:** P3
- **Effort:** Medium
- **Type:** Architecture

**Description**  
The current one-question quiz model is functional but limited. A richer model will support deeper assessment and more realistic certification thresholds.

**Scope**
- Define a multi-question schema
- Support future question-type extension
- Plan migration/compatibility strategy

**Acceptance criteria**
- New quiz model is designed clearly enough for phased implementation
- Migration implications are understood before rollout

**Dependencies**
- None

---

### MAV-054 — Pilot richer quiz format on selected modules

- **Priority:** P3
- **Effort:** Medium
- **Type:** Content / assessment

**Description**  
After the richer quiz model is defined, pilot it on a small set of modules before broader migration.

**Scope**
- Select pilot modules
- Convert quizzes
- Validate learner experience and UI needs

**Acceptance criteria**
- Pilot quizzes prove the model is workable
- No regression for non-migrated modules

**Dependencies**
- MAV-053

---

### MAV-055 — Document capstone and certification review guidance

- **Priority:** P3
- **Effort:** Small
- **Type:** Documentation

**Description**  
If the platform introduces submission and certification workflows, reviewer guidance should be documented clearly for maintainers and team leads.

**Scope**
- Document capstone expectations and rubric usage
- Align docs with Module 21 and ADR-04

**Acceptance criteria**
- Review expectations are understandable and consistent

**Dependencies**
- MAV-051 recommended

---

## Month 6 — Platform Hardening Tickets

### MAV-060 — Add integration tests for the training app

- **Priority:** P1
- **Effort:** Large
- **Type:** Testing

**Description**  
The training app currently lacks meaningful automated confidence around routing, progress persistence, gating, and certification logic. This is a major long-term quality risk.

**Scope**
- Add integration coverage for progress flows
- Cover routing and lesson progression
- Cover certification calculations once implemented

**Acceptance criteria**
- Core training-app flows have repeatable automated coverage
- Key regressions can be caught before release

**Dependencies**
- MAV-024 and later platform logic work

---

### MAV-061 — Add E2E tests for the training app

- **Priority:** P2
- **Effort:** Large
- **Type:** Testing

**Description**  
End-to-end tests should verify the learner experience, not just underlying helpers. This is especially important after multi-lesson navigation and certification dashboard work.

**Scope**
- Add learner-journey E2E coverage
- Verify navigation, completion, and dashboard flows

**Acceptance criteria**
- Core learner journeys are covered by E2E tests
- The training app has a repeatable release confidence layer

**Dependencies**
- MAV-020 through MAV-023

---

### MAV-062 — Add route coverage tests for the practice app

- **Priority:** P2
- **Effort:** Medium
- **Type:** Testing

**Description**  
The practice app is central to the curriculum, but not every route has product-level coverage expectations. A minimal route-coverage baseline should exist.

**Scope**
- Add at least one meaningful test per route/page
- Keep intentional bugs intact
- Focus on route health and expected content/interaction surfaces

**Acceptance criteria**
- Every practice-app route has baseline automated coverage
- Tests respect the app’s intentional-defect design

**Dependencies**
- None

---

### MAV-063 — Execute wave 2 of module splitting

- **Priority:** P3
- **Effort:** Medium
- **Type:** Content architecture

**Description**  
After the pilot multi-lesson rollout proves stable, additional oversized modules should be split using the same pattern.

**Scope**
- Identify the next best candidates
- Apply the proven split approach

**Acceptance criteria**
- Additional long modules are broken into better learning units
- Splits remain coherent and navigable

**Dependencies**
- MAV-020, MAV-021

---

### MAV-064 — Add learner analytics to the progress dashboard

- **Priority:** P3
- **Effort:** Large
- **Type:** Platform feature

**Description**  
Basic local analytics can help learners and team leads understand pace, repetition, and engagement without requiring backend infrastructure.

**Scope**
- Define useful local-only metrics
- Display them in a privacy-conscious way

**Acceptance criteria**
- Dashboard shows useful metrics without overcomplicating the product
- Metrics do not require backend infrastructure

**Dependencies**
- Progress dashboard maturity

---

### MAV-065 — Complete final metadata authoring waves

- **Priority:** P3
- **Effort:** Medium
- **Type:** Content

**Description**  
Final metadata waves should complete authored values across remaining modules and keep the curriculum coherent.

**Scope**
- Finish the remaining metadata backlog
- Check consistency across the full curriculum set

**Acceptance criteria**
- Metadata backlog is complete
- Generated metadata is only fallback where intentionally left absent

**Dependencies**
- MAV-016

---

### MAV-066 — Run a full docs-site refresh and stale-doc audit

- **Priority:** P2
- **Effort:** Medium
- **Type:** Documentation

**Description**  
The docs-site should be fully reconciled with the product once the roadmap’s first major phases are complete.

**Scope**
- Re-audit stale docs
- Update pages, counts, screenshots, and wording
- Remove contradictions between product and docs

**Acceptance criteria**
- Public docs align with the codebase
- Major stale-doc problems are closed

**Dependencies**
- Most M0–M5 tickets

---

### MAV-067 — Add contributor guidance for curriculum and docs maintenance

- **Priority:** P3
- **Effort:** Small
- **Type:** Documentation

**Description**  
As the curriculum and docs architecture grows, contributors need a lightweight source of truth for how to add modules, update docs, and avoid stale content.

**Scope**
- Add contributor-facing guidance
- Cover content authoring, testing expectations, and docs update expectations

**Acceptance criteria**
- New contributors can understand how to safely extend the repo

**Dependencies**
- None

---

### MAV-068 — Run accessibility audit on the training app itself

- **Priority:** P2
- **Effort:** Medium
- **Type:** Accessibility

**Description**  
The practice app intentionally contains some accessibility issues for testing, but the training app itself should continue improving its own accessibility baseline.

**Scope**
- Audit training-app accessibility
- Fix genuine app issues without changing intentional practice-app defects

**Acceptance criteria**
- Training-app accessibility issues are identified and prioritized
- Fixes do not interfere with intentional practice-app bug surfaces

**Dependencies**
- None

---

## 4. Suggested Issue Creation Order

### Immediate issue batch
1. MAV-001
2. MAV-002
3. MAV-003
4. MAV-004
5. MAV-005
6. MAV-006
7. MAV-007
8. MAV-008
9. MAV-010

### Next execution batch
10. MAV-011
11. MAV-014
12. MAV-016
13. MAV-017
14. MAV-020
15. MAV-021
16. MAV-022
17. MAV-023
18. MAV-024

### Follow-on batch
19. MAV-030
20. MAV-033
21. MAV-035
22. MAV-040
23. MAV-041
24. MAV-042
25. MAV-044
26. MAV-045
27. MAV-050
28. MAV-051
29. MAV-060
30. MAV-066

---

## 5. Labels to Consider When Creating Issues

- `roadmap`
- `docs`
- `content`
- `curriculum`
- `practice-app`
- `training-app`
- `ux`
- `testing`
- `assessment`
- `architecture`
- `accessibility`
- `priority:p0`
- `priority:p1`
- `priority:p2`
- `priority:p3`

---

## 6. Recommendation

Use this file as the source draft for issue creation and project population. If direct GitHub issue/project write access becomes available in a later session, the fastest next step is:

1. Create issues from the tickets in this file
2. Group them in the project by roadmap month/theme
3. Link documentation tickets to `ROADMAP.md` refresh work
4. Treat `MAV-001`, `MAV-010`, and `MAV-022` as the highest-value near-term items
