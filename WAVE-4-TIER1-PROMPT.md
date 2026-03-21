# Wave 4: Tier 1 — Enterprise Credibility Modules & Practice App Features

## Persona

You are a **senior QE platform engineer and curriculum architect** at an enterprise consulting firm. You build both training content (TypeScript module data files) and React practice app features (pages with intentional testable patterns and defects). You are expert in Playwright's full API surface, accessibility testing with axe-core, visual regression with `toHaveScreenshot()`, auth fixtures with `storageState`, and flaky test diagnosis. You follow the existing codebase conventions exactly and produce content that would pass a Deloitte/ISTQB quality review.

## Context

The **Midnight Automation Voyage** platform currently has:

### Training App (`training-app/`)
- **15 modules** in `src/data/modules/` following the `Lesson` TypeScript interface in `src/data/types.ts`
- Module registry in `src/data/index.ts` that imports and exports all modules
- Each module has: `id, title, subtitle, icon, audience?, sections[], quiz?, exercise?, promptTemplates?, practiceLink?`
- **100% quiz coverage**, **~80% exercise coverage** (after Wave 3), **~60% prompt template coverage**
- Components: `App.tsx` (state management, routing, keyboard nav), `Sidebar.tsx` (collapsed rail, role filter, progress), `LessonView.tsx` (content renderer with CodeBlock, QuizSection, ExerciseSection, PromptTemplateSection, DiffCodeBlock, TableBlock)
- Uses: React + TypeScript + Vite + Tailwind + shadcn/ui

### Practice App (`practice-app/`)
- React + TypeScript + Vite + React Router
- **5 existing features:** Login (`/login`), Products (`/products`), Contact (`/contact`), Orders (`/orders`), Checkout (`/checkout/*` — 4 steps)
- Runs on port 5173, training-app on 5174
- Uses `data-testid` attributes on all testable elements
- Has `CheckoutContext.tsx` for multi-step state management
- Nav component hides on login page

### Reference Tests (`test-cases/`)
- 33 Playwright specs in `test-cases/examples/`
- Naming convention: `{feature}.spec.ts` (e.g., `login.spec.ts`, `search-filter.spec.ts`)
- Follow: one-test-per-behavior, `data-testid` selectors, comment prefixes (L1, S2, etc.), no `waitForTimeout`

## Problem

The platform has 6 critical curriculum gaps (P1) that block enterprise credibility and TMMi Level 3:

1. **CG-1: No auth fixtures / storageState** — No reusable auth pattern. Tests either bypass auth or log in via UI every run. No multi-role testing. No protected-route realism. (Source: Playwright Auth docs; BrowserStack 2026)

2. **CG-2: No accessibility testing** — No WCAG-aware automation. No `@axe-core/playwright` integration. Enterprise clients face legal/compliance requirements. 57% of a11y issues are auto-detectable. (Source: Playwright a11y docs; Deque Systems; WebAIM 2025)

3. **CG-3: No visual regression testing** — No `toHaveScreenshot()`. CSS bugs, layout shifts, responsive breakage go undetected. First-party Playwright capability completely absent. (Source: Playwright snapshot docs)

4. **CG-8: No flaky test governance** — No quarantine protocol, retry policy, root cause taxonomy, or evidence-first triage workflow. Module 12 mentions trace viewer briefly but no hands-on practice. (Source: TMMi Level 3; Playwright debug docs)

5. **CG-11: No test data management** — Hardcoded credentials (`user@test.com / Password123!`), no factories, no data isolation, no seed/reset patterns. (Source: Playwright fixtures; ISTQB CTAL-TAE)

6. **CG-4: No formal assessment / certification** — Cannot demonstrate learning outcomes. No capstone, no competency matrix, no certification tiers. (Source: ISTQB CTAL-TAE; UiPath Academy; Microsoft Learn)

Additionally, new practice app features must ship BEFORE their dependent modules (critical dependency chain).

## Solution

### Part A: Practice App Features (Ship First)

Build 3 new practice app pages. Each must include `data-testid` attributes on every interactive element, follow existing React Router patterns, and include intentional issues for learner discovery.

#### Feature D3: Settings Page (`/settings`)
**Supports:** Module 18 (A11y Testing)

**Components:**
- Profile form (name, email, bio textarea)
- Password change section (current, new, confirm)
- Notification toggle switches (email, push, SMS)
- Keyboard-navigable tab panels (Profile / Security / Notifications)
- Confirm dialog on destructive actions
- Toast notification on save

**Intentional A11y Violations (3 required — documented, not bugs):**
1. Missing `<label>` binding on the bio textarea (use placeholder only)
2. Low-contrast helper text below password field (fails WCAG AA 4.5:1 — use `text-zinc-600` on `bg-zinc-900`)
3. Incorrect initial focus in confirm dialog (focuses cancel instead of the dialog container)

**data-testid attributes:** `settings-profile-tab`, `settings-security-tab`, `settings-notifications-tab`, `settings-name-input`, `settings-email-input`, `settings-bio-textarea`, `settings-current-password`, `settings-new-password`, `settings-confirm-password`, `settings-save-button`, `settings-notification-email`, `settings-notification-push`, `settings-notification-sms`, `settings-confirm-dialog`, `settings-toast`

#### Feature D5: Admin Panel (`/admin`)
**Supports:** Module 16 (Auth Fixtures), Module 20 (Test Data)

**Components:**
- Role-gated page (redirect to `/login` if not authenticated, redirect to `/dashboard` if role !== 'admin')
- User table with columns: Name, Email, Role, Status, Actions
- Invite user form (name, email, role dropdown)
- Search/filter by name or role
- Bulk action checkboxes (activate/deactivate)
- Seed/Reset data controls (button to reset to default dataset)

**Roles:** admin, editor, viewer
**Intentional Issues:**
1. Viewer role sees the page but all action buttons are disabled (edge case for auth testing)
2. Duplicate email in seed data triggers validation error on invite
3. Bulk deactivate doesn't update row status until page refresh (stale state bug for debugging exercises)

**data-testid attributes:** `admin-user-table`, `admin-invite-form`, `admin-invite-name`, `admin-invite-email`, `admin-invite-role`, `admin-invite-submit`, `admin-search-input`, `admin-role-filter`, `admin-bulk-checkbox-{id}`, `admin-bulk-action`, `admin-seed-reset`, `admin-user-row-{id}`, `admin-user-role-{id}`, `admin-user-status-{id}`

**Auth state management:** Add a simple auth context (`AuthContext.tsx`) with `{ user, role, isAuthenticated }`. Store in `sessionStorage`. Login page sets auth state. Admin panel checks role. This gives Module 16 something real to wrap with `storageState`.

#### Feature D4: Toast / Notification System (global)
**Supports:** Module 19 (Flaky Tests)

**Components:**
- Global toast container (bottom-right, stacks up to 3)
- Auto-dismiss after configurable timeout (default 5 seconds)
- Manual dismiss button
- Toast types: success (green), error (red), warning (amber), info (blue)
- Trigger toasts from Settings save, Admin actions, Contact form submit

**Intentional Timing Issues:**
1. Auto-dismiss timeout creates race condition — toast disappears before assertion can check content (flaky test surface)
2. Rapid consecutive toasts can stack and overlap (animation timing issue)
3. Toast content updates after a 200ms delay (simulates async notification)

**data-testid attributes:** `toast-container`, `toast-{index}`, `toast-message-{index}`, `toast-dismiss-{index}`, `toast-icon-{index}`

#### Practice App Integration

- Add Settings, Admin to the Nav component (after Checkout)
- Add `/settings` and `/admin` routes to App.tsx
- Admin link should only appear if auth role is 'admin'
- Update practice-app `package.json` if any new dependencies needed

### Part B: Training Modules (6 New Modules)

Create 6 new module files following the exact `Lesson` interface. Each must have: all sections with content, a quiz (question + 4 options + correctIndex + explanation), an exercise (starter + solution + hints), prompt templates (2-3 CARD-formatted), and a practice link to the relevant new feature.

#### Module 16: Auth Fixtures & Storage State (`16-auth-fixtures.ts`)
- **Audience:** All Roles
- **Sections:** Why UI login doesn't scale (math: 200 tests x 3s = 10 min wasted) | What is `storageState` | Global setup with `globalSetup` | Per-role fixtures with `test.extend()` | Project dependencies for auth ordering | Review pitfalls (token expiry, cookie scope, role confusion)
- **Quiz:** When should you NOT reuse storageState? (Answer: when testing the login flow itself)
- **Exercise:** Convert a direct-navigation test to use an authenticated fixture — starter has `page.goto('/admin')` with inline login, solution uses `storageState` from global setup
- **Prompt Templates:** "Generate a global setup that authenticates as {role} and saves storageState" | "Convert these tests to use a shared auth fixture with role switching"
- **Practice Link:** Admin Panel (`http://localhost:5173/admin`) — "Test role-based access with the Admin Panel"

#### Module 17: Visual Regression Testing (`17-visual-regression.ts`)
- **Audience:** All Roles
- **Sections:** What functional tests miss (CSS bugs, layout shifts) | `toHaveScreenshot()` basics | Full-page vs element screenshots | Masking dynamic content (`mask` option) | Threshold tuning (`maxDiffPixels`, `maxDiffPixelRatio`) | Baseline management and update policy | CI considerations (Docker for cross-OS consistency)
- **Quiz:** What should you mask in visual regression tests? (Answer: timestamps, animated elements, user-specific data)
- **Exercise:** Write a visual regression test for the Orders table that masks the date column and sets a 1% threshold — starter has basic `toHaveScreenshot()`, solution adds mask locator and threshold config
- **Prompt Templates:** "Generate a visual regression test for {page} with masks for dynamic content" | "Create a baseline update policy for a CI pipeline"
- **Practice Link:** Orders page (`http://localhost:5173/orders`) — "Write visual regression tests against the sortable data table"

#### Module 18: Accessibility Testing with axe-core (`18-accessibility-testing.ts`)
- **Audience:** All Roles (Non-Coder Essential)
- **Sections:** Why accessibility matters (legal, user impact, brand) | What automation can and cannot prove (57% auto-detectable, manual review still needed) | Setting up `@axe-core/playwright` | AxeBuilder configuration and WCAG level targeting | Understanding violation output (id, impact, nodes, html) | Keyboard and focus testing beyond axe | CI quality gate pattern | Common violations and fixes
- **Quiz:** What can axe-core NOT detect? (Answer: whether alt text is actually meaningful/descriptive)
- **Exercise:** Write an axe scan for the Settings page, filter to WCAG 2.1 AA, and assert zero critical violations — starter has empty test, solution has AxeBuilder with `withTags(['wcag2a', 'wcag2aa'])` and violation logging
- **Prompt Templates:** "Generate an accessibility scan for {page} targeting WCAG 2.1 AA" | "Diagnose these axe-core violations and write regression tests for each fix"
- **Practice Link:** Settings page (`http://localhost:5173/settings`) — "Scan the Settings page to find the 3 intentional WCAG violations"

#### Module 19: Flaky Test Diagnosis & Recovery (`19-flaky-test-diagnosis.ts`)
- **Audience:** All Roles (Non-Coder Essential)
- **Sections:** What makes a test flaky (timing, state, environment, animation) | Root cause taxonomy (race condition, shared state, network dependency, animation timing, DOM not ready) | Retry vs fix (when retries mask real bugs) | Quarantine rules (tag, isolate, SLA to fix) | Evidence-first triage (trace, screenshot, video, logs) | Communicating failure severity to the team
- **Quiz:** When is adding `test.retries(2)` the RIGHT solution? (Answer: for genuinely environment-dependent tests like network timeouts, NOT for fixing selector or timing bugs)
- **Exercise:** Diagnose a flaky toast test — starter has a test that sometimes fails because it asserts toast content after auto-dismiss, solution uses `expect(locator).toBeVisible()` with proper waiting and avoids the race condition
- **Prompt Templates:** "Analyze this failing Playwright test and classify the root cause from the flaky test taxonomy" | "Generate a quarantine tag and tracking issue for this flaky test"
- **Practice Link:** Settings page (`http://localhost:5173/settings`) — "Trigger save actions and test the toast timing behavior"

#### Module 20: Test Data Strategies (`20-test-data-strategies.ts`)
- **Audience:** Developers
- **Sections:** The problem with hardcoded data (parallel conflicts, state leaks, brittle assertions) | Data factories (generate unique data per test) | API-based seeding (setup via fixtures, not UI) | Seed/Reset controls (idempotent setup) | Role-based data (admin sees all, viewer sees subset) | Parallel-safe patterns (unique IDs, namespaced data) | Cleanup strategies (teardown vs reset)
- **Quiz:** Why is `user@test.com` a problematic test credential? (Answer: parallel tests sharing the same user create state collisions — account lockout, session conflicts)
- **Exercise:** Refactor a hardcoded login test to use a data factory — starter has inline credentials, solution uses a `createTestUser()` fixture that generates unique email/password
- **Prompt Templates:** "Generate a test data factory for {entity} with unique identifiers" | "Convert these hardcoded test credentials to use fixture-based data seeding"
- **Practice Link:** Admin Panel (`http://localhost:5173/admin`) — "Use the Seed/Reset controls to practice data isolation patterns"

#### Module 21: Assessment & Certification (`21-assessment-certification.ts`)
- **Audience:** All Roles
- **Sections:** Why assessment matters (Kirkpatrick Level 2, enterprise ROI) | Competency matrix (what each tier proves) | Three certification tiers: Bronze (complete modules 01-15, pass all quizzes), Silver (+ complete Tier 1 modules 16-21, pass capstone exercise), Gold (+ Tier 2+3 modules, contribute a real test to a project) | Capstone structure (write a mini test suite covering auth + functional + a11y for one feature) | Rubric criteria (assertion quality, selector strategy, data independence, HITL compliance) | Peer review calibration | Continuous improvement
- **Quiz:** What distinguishes a Silver-tier certification from Bronze? (Answer: Silver requires completing applied Tier 1 modules AND passing a capstone exercise that demonstrates practical competency, not just content consumption)
- **Exercise:** Write a capstone plan — given a feature description, outline the test suite structure with auth setup, functional tests, a11y scan, and HITL review checklist — starter has feature description and empty plan template, solution has complete plan with 5 test descriptions
- **Prompt Templates:** "Generate a capstone test plan from these acceptance criteria" | "Create a grading rubric for a Playwright test suite submission"
- **Practice Link:** Practice app root (`http://localhost:5173/`) — "Use the full practice app as your capstone assessment target"

### Part C: Reference Test Specs

Write reference Playwright test specs for the new practice app features:

- `settings.spec.ts` — 5-6 tests: profile form validation, password change, notification toggles, tab navigation, save confirmation toast
- `admin.spec.ts` — 5-7 tests: role-gated access (redirect non-admin), user table rendering, invite form validation, search/filter, seed/reset, bulk actions
- `accessibility.spec.ts` — 3-4 tests: axe scan with zero violations (after fixes), keyboard navigation, focus management
- `toast.spec.ts` — 3-4 tests: toast appears on action, auto-dismiss timing, manual dismiss, stacking behavior

Follow existing conventions: `data-testid` selectors, comment prefixes, one-test-per-behavior, descriptive names.

### Part D: Module Registry Update

Update `training-app/src/data/index.ts` to import and include Modules 16-21 in the lessons array.

### Implementation Constraints

1. **Read every file before editing** — understand existing patterns first
2. **Practice app features must compile independently** — `cd practice-app && pnpm build`
3. **Training modules must match the Lesson interface exactly** — check `types.ts`
4. **New modules must have ALL interactive fields:** quiz + exercise + promptTemplates + practiceLink
5. **Settings page must have exactly 3 intentional a11y violations** — documented in code comments
6. **Admin panel auth gating must use sessionStorage** — no server dependency
7. **Toast system must create reproducible timing issues** — this is the learning surface for Module 19
8. **Reference tests go in `test-cases/examples/`** — follow existing naming conventions
9. Use `pnpm` not npm/yarn (project uses pnpm lockfiles)
10. Practice app on port 5173, training app on port 5174

### Verification

After completing all changes:
1. `cd practice-app && pnpm build` — zero errors
2. `cd training-app && pnpm build` — zero errors
3. Training app should show 21 modules in sidebar
4. Practice app should have 8 features in nav (Login, Dashboard, Products, Contact, Orders, Checkout, Settings, Admin)
5. Navigate to `http://localhost:5173/settings` — 3 a11y violations scannable
6. Navigate to `http://localhost:5173/admin` — redirects when not admin role
7. All 6 new modules have: sections, quiz, exercise, promptTemplates, practiceLink
8. Reference tests in `test-cases/examples/` follow naming conventions

### Success Criteria

After Wave 4, the platform reaches **TMMi Level 3 (Defined)**:
- 21 training modules covering auth, visual, a11y, flaky tests, data management, assessment
- 8 practice app features with intentional learning surfaces
- ~50 reference Playwright tests
- 100% quiz coverage, 80%+ exercise coverage, 60%+ prompt template coverage
- Formal assessment framework with 3 certification tiers
