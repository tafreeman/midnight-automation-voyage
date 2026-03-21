# Wave 5: Tier 2 — Scale, Debugging & CI Maturity Modules

## Persona

You are a **senior test automation architect** who designs enterprise-scale Playwright test infrastructure. You specialize in CI/CD pipeline design across GitHub Actions, Azure DevOps, and GitLab CI. You have deep expertise in Playwright's Trace Viewer, test sharding, cross-browser matrix execution, mobile device emulation, test tagging strategies, and network interception. You write training content that bridges theory and applied practice, always grounding concepts in the existing Midnight Automation Voyage codebase and practice app.

## Context

The **Midnight Automation Voyage** platform has completed Waves 1-4:

### Current State (Post-Wave 4)
- **21 training modules** (01-21) covering foundations through assessment/certification
- **8 practice app features:** Login, Dashboard, Products, Contact, Orders, Checkout, Settings (with 3 a11y violations), Admin Panel (role-gated with seed/reset)
- **~50 reference Playwright tests** in `test-cases/examples/`
- **Toast notification system** with intentional timing issues
- **Auth context** with sessionStorage-based role management
- **100% quiz coverage, 80%+ exercise coverage, 60%+ prompt template coverage**
- **TMMi Level 3 (Defined)** achieved

### Architecture Reference
- Training modules: `training-app/src/data/modules/{nn}-{slug}.ts` — Lesson interface with sections, quiz, exercise, promptTemplates, practiceLink
- Module registry: `training-app/src/data/index.ts`
- Practice app: React + TypeScript + Vite + React Router on port 5173
- Reference tests: `test-cases/examples/{feature}.spec.ts` — data-testid selectors, comment prefixes, one-test-per-behavior
- Both apps use pnpm

### What Wave 5 Delivers
6 new modules (22-27) focused on enterprise scaling. No new practice app features required — these modules use existing features as test targets plus CI configuration knowledge. One optional practice app enhancement (Activity Feed) for network mocking exercises.

## Problem

The platform has enterprise-credible *content* coverage (auth, visual, a11y, data management) but lacks the *infrastructure and scale* patterns that enterprise teams need to run Playwright at scale:

1. **CG-7: No Trace Viewer deep-dive** — Module 12 covers reading results but not trace diagnosis. Learners can't debug flaky tests, analyze network waterfalls, or use the Timeline tab (v1.58). No hands-on trace analysis exercises.

2. **CG-9: No mobile / responsive testing** — Zero device emulation coverage. No viewport assertions, touch events, orientation changes, or breakpoint testing. Over 50% of global web traffic is mobile. Playwright's device descriptors are a key differentiator.

3. **CG-6 (Part 1): No test sharding / parallel execution** — No `--shard` flag usage, no blob reports, no `merge-reports` CLI. Enterprise suites of 200+ tests need parallel execution. Serial-only is a scaling bottleneck.

4. **CG-12: No cross-browser configuration** — Tests run on single browser only. No `projects` array in `playwright.config.ts`. No coverage of Chromium/Firefox/WebKit differences. No risk-based browser selection.

5. **CG-6 (Part 2): No test tagging / pipeline gating** — No `@smoke`, `@regression`, `@critical` tagging strategy. No selective test execution in CI. No quality gate rules for merge blocking.

6. **CG-6 (Part 3): CI/CD is GitLab-only** — Module 15 covers GitLab CI only. GitHub Actions is the dominant CI platform. No workflow YAML, no artifact upload with `if: always()`, no matrix strategy, no branch protection integration.

These gaps prevent TMMi Level 4 (Measured) — the platform teaches what to test but not how to run tests at enterprise scale with observability.

## Solution

### Module 22: Trace Viewer Deep-Dive (`22-trace-viewer.ts`)
- **Audience:** All Roles (Non-Coder Essential)
- **Sections:**
  - What's inside a trace file (actions, snapshots, network, console, DOM)
  - Configuring tracing: `trace: 'on-first-retry'` vs `'on'` vs `'retain-on-failure'`
  - Opening traces: `npx playwright show-trace trace.zip` and `trace.playwright.dev`
  - The Timeline tab (v1.58) — correlating actions with network and rendering
  - Network panel — identifying slow requests, failed API calls, CORS issues
  - Action snapshots — comparing before/after DOM state per step
  - Debugging workflow: reproduce → capture trace → isolate step → identify root cause → fix → verify
  - Trace artifacts in CI (upload, download, share with team)
- **Quiz:** What does `trace: 'on-first-retry'` do? (Answer: captures a trace only when a test fails on first attempt and is retried — balances diagnostic value with storage/performance cost)
- **Exercise:** Given a failing test and its trace description, identify which step failed, what the DOM looked like at that moment, and what network request was pending. Starter: failing test code + trace analysis template. Solution: completed root cause analysis with the fix.
- **Prompt Templates:** "Analyze this Playwright error message and trace summary to identify the root cause" | "Generate a trace-based debugging checklist for this test failure category"
- **Practice Link:** Practice app root — "Run tests with `--trace on` and open the trace viewer"

### Module 23: Mobile & Responsive Testing (`23-mobile-responsive.ts`)
- **Audience:** All Roles
- **Sections:**
  - Why mobile testing matters (>50% traffic, responsive breakpoints, touch interactions)
  - Device descriptors: `devices['iPhone 14']`, `devices['Pixel 7']`, `devices['iPad Pro 11']`
  - Configuring device projects in `playwright.config.ts`
  - Viewport assertions: `expect(page).toHaveScreenshot()` at mobile breakpoints
  - Touch interactions: `tap()`, swipe patterns, long-press
  - Orientation changes: `page.setViewportSize()` for portrait/landscape
  - Mobile-specific gotchas: hover states, fixed positioning, virtual keyboard
  - When to split vs parameterize: separate mobile tests vs shared tests with device matrix
  - Mobile a11y: touch target sizes, zoom support
- **Quiz:** What's the difference between setting `viewport` in config vs using `page.setViewportSize()`? (Answer: config viewport applies to the entire test from the start, while setViewportSize changes mid-test — useful for testing responsive behavior on resize)
- **Exercise:** Adapt the Products page search test for iPhone 14 — starter has desktop-only test, solution adds device project config and mobile-specific assertions (hamburger menu, touch interactions, viewport-appropriate layout checks)
- **Prompt Templates:** "Generate a Playwright device project configuration for {device} with mobile assertions" | "Convert this desktop test to work on mobile with touch interactions and responsive assertions"
- **Practice Link:** Products page (`http://localhost:5173/products`) — "Test the search and filter features at mobile breakpoints"

### Module 24: Parallel Execution & Sharding (`24-parallel-sharding.ts`)
- **Audience:** Developers
- **Sections:**
  - Why serial execution doesn't scale (200 tests x 3s = 10 min serial, ~2.5 min with 4 shards)
  - Playwright's built-in parallelism: `workers` config, `fullyParallel` mode
  - Test isolation requirements for parallelism (no shared state, independent data)
  - Sharding: `--shard=1/4` flag, how Playwright distributes tests
  - Blob reports: `reporter: 'blob'` for per-shard output
  - Merging reports: `npx playwright merge-reports --reporter html ./blob-*`
  - CI matrix strategy: shard across multiple CI jobs
  - Debugging shard failures: which shard, which worker, trace correlation
  - Cost/benefit: when sharding helps vs when test isolation is the real problem
- **Quiz:** What must be true about your tests before enabling `fullyParallel: true`? (Answer: every test must be fully independent — no shared state, no sequential dependencies, no shared database records without isolation)
- **Exercise:** Configure a 4-shard setup with blob reporters and write the merge command — starter has single-runner config, solution has sharded config with blob reporter and merge script
- **Prompt Templates:** "Generate a playwright.config.ts with {n} shards and blob reporting" | "Diagnose why this test fails in parallel but passes in serial"
- **Practice Link:** Practice app root — "Run your full test suite with `--shard=1/2` and `--shard=2/2`, then merge reports"

### Module 25: Multi-Browser & Projects Config (`25-multi-browser-projects.ts`)
- **Audience:** Developers
- **Sections:**
  - Playwright's browser engines: Chromium, Firefox (Gecko), WebKit (Safari)
  - The `projects` array in playwright.config.ts
  - Browser-specific gotchas: WebKit date inputs, Firefox scrollbar rendering, Chromium DevTools protocol features
  - Project dependencies: auth setup project → browser test projects
  - Risk-based browser selection: which browsers matter for your users
  - Running specific projects: `--project=chromium` CLI flag
  - Cross-browser visual differences: why screenshots differ across engines
  - Browser version pinning and updates
- **Quiz:** Why might a visual regression test pass on Chromium but fail on WebKit? (Answer: font rendering, subpixel antialiasing, and scrollbar styles differ between browser engines — use per-browser baselines or increase diff thresholds)
- **Exercise:** Configure a playwright.config.ts with 3 browser projects plus a setup project for auth — starter has single-browser config, solution has full projects array with dependencies
- **Prompt Templates:** "Generate a multi-browser playwright.config.ts with {browsers} and an auth setup project" | "Investigate why this test behaves differently on Firefox vs Chromium"
- **Practice Link:** Practice app root — "Run your tests across all three browsers and compare results"

### Module 26: Test Tagging & Pipeline Gating (`26-test-tagging.ts`)
- **Audience:** All Roles
- **Sections:**
  - Why tagging matters (smoke vs regression vs full, deploy gates, risk tiers)
  - Playwright's `test.describe` and `@tag` annotation syntax
  - Tag taxonomy: `@smoke` (critical path, fast), `@regression` (comprehensive), `@visual` (screenshot tests), `@a11y` (accessibility), `@slow` (long-running)
  - Running by tag: `--grep @smoke`, `--grep-invert @slow`
  - Pipeline integration: smoke on every PR, regression on merge to main, full on nightly
  - Quality gates: block merge if smoke fails, alert on regression failure, track nightly trends
  - Tag governance: who assigns tags, review process, coverage requirements
- **Quiz:** When should you run `@regression` tests vs `@smoke` tests in a CI pipeline? (Answer: smoke on every PR for fast feedback; regression on merge to main or nightly for comprehensive coverage — running regression on every PR wastes CI resources and slows developer feedback)
- **Exercise:** Add tags to a set of existing tests and write the grep commands — starter has untagged tests, solution has `@smoke`/`@regression`/`@a11y` annotations with matching CI commands
- **Prompt Templates:** "Tag these tests with appropriate categories based on their scope and criticality" | "Generate a CI pipeline strategy that runs smoke on PR, regression on merge, and full nightly"
- **Practice Link:** Practice app root — "Tag your reference tests and run selective suites"

### Module 27: GitHub Actions CI/CD (`27-github-actions.ts`)
- **Audience:** All Roles
- **Sections:**
  - GitHub Actions vs GitLab CI: concepts mapping (workflow/pipeline, job/stage, step/script)
  - Playwright Docker image: `mcr.microsoft.com/playwright:v1.xx-jammy`
  - Workflow YAML structure: triggers (`push`, `pull_request`), matrix strategy, environment
  - Installing Playwright browsers: `npx playwright install --with-deps`
  - Artifact upload: `actions/upload-artifact` with `if: always()` for test reports
  - Retries and trace collection: `--retries=1 --trace on-first-retry`
  - Sharding with matrix: `strategy.matrix.shard: [1/4, 2/4, 3/4, 4/4]` + report merging
  - Branch protection rules: require Playwright checks to pass before merge
  - Caching: `actions/cache` for node_modules and browser binaries
  - Comparing to GitLab CI (Module 15): what translates, what doesn't
- **Quiz:** Why should you use `if: always()` on the artifact upload step? (Answer: without it, the upload step is skipped when tests fail — which is exactly when you need the artifacts most for debugging)
- **Exercise:** Write a complete GitHub Actions workflow — starter has empty YAML with commented structure, solution has full workflow with install, test, artifact upload, and shard matrix
- **Prompt Templates:** "Generate a GitHub Actions workflow for Playwright with artifact upload and sharding" | "Convert this GitLab CI pipeline to GitHub Actions"
- **Practice Link:** Practice app root — "Configure GitHub Actions to run your full test suite with artifacts"

### Optional: Activity Feed Practice Feature (`/activity`)
**Only build if time permits. Supports Module 22 (Trace Viewer) and future Module 28 (MCP).**

- Loading skeleton while fetching
- Filter chips (All, Login, Purchase, Settings)
- Detail drawer on row click
- Simulate error/timeout/empty controls (buttons that toggle API mock responses)
- `data-testid` on all elements
- Route: `/activity`
- Intentional issues: explicit 500 mode, timeout mode (3s delay), empty state, stale-cache mode

### Module Registry Update

Update `training-app/src/data/index.ts` to import and include Modules 22-27.

### Reference Test Specs (if Activity Feed built)

- `activity.spec.ts` — 4-5 tests: loading state, filter behavior, error state handling, timeout recovery, empty state

### Implementation Constraints

1. **Read every existing module to understand conventions** before writing new ones
2. **No new practice app features required** for Modules 22-27 (except optional Activity Feed) — they teach configuration and infrastructure patterns, not app features
3. **All exercises must be realistic** — real `playwright.config.ts` snippets, real GitHub Actions YAML, real CLI commands
4. **CI YAML in exercises must be syntactically valid** — learners will copy-paste these
5. **Each module needs all interactive fields:** quiz + exercise + promptTemplates + practiceLink
6. **Module numbering continues from 22** — IDs and filenames must match
7. **Use pnpm**, not npm/yarn
8. `cd training-app && pnpm build` must pass with zero errors

### Verification

After completing all changes:
1. `cd training-app && pnpm build` — zero errors
2. Training app should show 27 modules in sidebar
3. All 6 new modules have: sections (4+ each), quiz, exercise, promptTemplates, practiceLink
4. GitHub Actions YAML in Module 27 exercise is valid YAML
5. Playwright config snippets in Modules 24-25 are valid TypeScript
6. If Activity Feed built: `cd practice-app && pnpm build` passes, `/activity` route works

### Success Criteria

After Wave 5, the platform progresses toward **TMMi Level 4 (Measured)**:
- 27 training modules covering foundations through enterprise CI/CD
- Trace Viewer, mobile testing, sharding, cross-browser, tagging, and GitHub Actions all taught
- Learners can configure multi-browser, multi-shard CI pipelines with artifact management
- 2+ CI platforms documented (GitLab CI from Module 15 + GitHub Actions from Module 27)
- Platform teaches not just *what* to test but *how to run tests at scale with observability*
