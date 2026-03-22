# Training App Maturity Assessment

**Date:** 2026-03-21
**Scope:** training-app, practice-app, test-cases (full codebase exploration)

---

## Verdict: Production-Ready Platform with Strong Content

This is a mature, well-architected training platform. The previous assessment was inaccurate — most "critical gaps" it identified are already implemented.

---

## Scorecard

| Dimension | Rating | Evidence |
|-----------|--------|----------|
| **Content Completeness** | 9/10 | 27/27 modules, 27/27 quizzes, 24/27 exercises, prompt templates throughout |
| **State & Persistence** | 9/10 | localStorage (key: `mav-progress-v3`), tracks completion, quiz scores, exercise status, notes, scroll positions |
| **Routing & Navigation** | 8/10 | Hash-based routing (`#dashboard`, `#module/{id}`, `#lesson/{id}/{id}`), browser back/forward works |
| **UI/UX Quality** | 9/10 | Radix UI (43 components via shadcn), 4 themes, responsive 3-column layout, mobile overlay sidebars |
| **Type Safety** | 9/10 | Full TypeScript 5.9, discriminated unions for section types (`TextSection | CodeSection | CalloutSection | TableSection`), Zod 4.3 validation |
| **Accessibility** | 8/10 | Radix foundation, semantic HTML, ARIA labels, keyboard nav — practice app has 3 intentional a11y violations for teaching |
| **Practice App** | 9/10 | 12 routes, 10 page components, 3 context providers, 11+ intentional bugs across 4 pages |
| **Test Examples** | 9/10 | 10 spec files, 59 tests, 859 LOC, CARD prompts, HITL checkpoints |
| **Automated Testing** | 2/10 | No unit/integration/E2E tests for the platform itself |
| **Overall** | **8.5/10** | |

---

## What's Already Built (Correcting Previous Assessment)

### Progress Persistence — DONE
- `ProgressContext.tsx` with localStorage key `mav-progress-v3`
- Tracks per-module: started, completed lessons, quiz scores, exercise completion
- Tracks per-lesson: notes, scroll position
- Course-level: current module/lesson pointers, last accessed timestamp, completion %
- Graceful fallback if localStorage unavailable

### Hash-Based Routing — DONE
- `#dashboard`, `#module/{moduleId}`, `#lesson/{moduleId}/{lessonId}`
- Custom `parseHash()` / `hashForView()` functions in `App.tsx`
- Browser history fully functional (back/forward navigation)
- Deep-linkable and bookmarkable

### Exercise Coverage — 89% DONE (24/27 modules)
- Modules 01-03 intentionally have no exercises (conceptual intro content)
- 15 modules have single exercises, 9 have multiple exercises
- Exercises include starter code, solution code, hints, difficulty ratings

### Quiz Coverage — 100% DONE (27/27 modules)
- Every module has at least one quiz
- Each quiz has question, options, correct answer, and explanation
- Explanations teach *why*, not just right/wrong

### Practice App Integration — DONE
- All 27 modules have `practiceLink` fields pointing to practice-app pages
- Practice app has 13 routes covering login, dashboard, products, checkout (4-step), settings, admin, activity, contact, orders

### Theme System — DONE
- 4 themes: `signal-cobalt`, `arctic-steel`, `linear`, `gamma-dark`
- Stored in localStorage (`mav-theme-preference`)
- Auto-rotation by module (dark/light alternation every 3 modules)
- CSS variable architecture with Tailwind integration

### Audience Badges — DONE
- Modules tagged with audience (All Roles, Developers, Non-Coder Essential)
- Difficulty levels assigned (beginner, intermediate)
- Estimated minutes per lesson (12-36 min range)

---

## Practice App Depth

The practice app is a fully-featured test target, not a stub:

| Feature | Implementation |
|---------|---------------|
| **Auth** | AuthContext with roles (admin/editor/viewer), sessionStorage, login/logout |
| **Checkout** | 4-step flow (shipping/payment/review/confirmation) with CheckoutContext preserving form data |
| **Toast System** | ToastContext with 3 intentional bugs for flaky-test learning (race condition, stacking overflow, delayed content) |
| **Admin** | Role-gated, user table, invite form, search, role filter, seed reset |
| **Navigation** | Conditional nav (hides on login), role-based links, active route highlighting |

**Intentional Bugs for Learning (11+ total across 4 pages):**

*ToastContext (3 bugs — Module 19: Flaky Test Diagnosis):*
- Auto-dismiss race condition (5s timeout vs assertion timing)
- Rapid consecutive toasts exceed MAX_VISIBLE (3)
- Toast content updates after 200ms async delay

*SettingsPage (3 a11y violations — Module 23: Accessibility Testing):*
- Bio textarea missing `<label>` binding (WCAG 1.3.1/4.1.2)
- Helper text with low-contrast color (fails WCAG AA 4.5:1)
- Delete dialog focuses cancel button instead of dialog container

*AdminPage (2-3 bugs):*
- Duplicate email in seed data causes validation error on invite
- Bulk deactivate doesn't update row status (stale state until refresh)
- Viewers see page but all actions are disabled

*ActivityPage (5 mock modes for network testing):*
- normal, error (500), timeout (3000ms), empty, stale-cache (old timestamps + warning toast)

---

## Test Case Mapping Quality

The `test-case-mapping.md` is an exceptional pedagogical resource:
- 5-part format per feature: manual test → why it fails as automation → decomposition → per-test CARD prompt + code → learner exercise
- Includes "Manual → Automated Mapping Cheat Sheet" showing habit translation
- 34+ HITL checkpoints with ✅ validation criteria (e.g., "No `waitForTimeout`", "Uses data-testid selectors")
- 10 example specs cover: login (7), checkout (6), admin (7), contact (7), orders (6), search (7), settings (6), activity (5), toast (4), accessibility (4)
- All specs use `data-testid` selectors — no brittle XPath or CSS class queries
- Accessibility spec intentionally targets the 3 a11y violations planted in SettingsPage

---

## Practice App Test Surface Coverage

Every practice-app page has comprehensive `data-testid` attributes for Playwright targeting:

| Page | Key Test IDs |
|------|-------------|
| Login | `email-input`, `password-input`, `login-button`, `error-message`, `lockout-message` |
| Products | `search-input`, `category-filter`, `result-count`, `product-name`, `product-price` |
| Contact | `name-input`, `contact-email-input`, `phone-input`, `subject-select`, `message-input`, `success-message` |
| Orders | `status-filter`, `data-table`, `col-id`, `col-customer`, `col-amount`, `col-date`, `col-status` |
| Checkout | `address-input`, `city-input`, `state-select`, `zip-input`, `next-button`, `step-indicator` |
| Settings | `settings-profile-tab`, `settings-security-tab`, `settings-notifications-tab`, `settings-name-input` |
| Admin | `admin-invite-form`, `admin-user-table`, `admin-bulk-action`, `admin-seed-reset` |
| Activity | `activity-filters`, `activity-filter-all`, `activity-mode-normal`, `activity-list`, `activity-detail` |

---

## Actual Gaps (What's Missing)

### Critical
| Gap | Impact | Notes |
|-----|--------|-------|
| **No automated tests for the platform** | High | Zero unit/integration/E2E tests for training-app or practice-app themselves. Ironic for a testing training platform. |

### Moderate
| Gap | Impact | Notes |
|-----|--------|-------|
| **No quiz-gated completion** | Medium | Quizzes are optional — learners can mark complete without attempting them |
| **No role-based learning paths** | Medium | Audience badges exist but no filtering/path selection for non-coders vs developers |
| **No search** | Medium | 27 modules is enough that "find the API mocking lesson" requires scanning |
| **No glossary** | Low-Med | Terms like POM, AAA, CARD formula used across modules without central reference |
| **No print/export** | Low | Some learners want offline reference sheets |

### Nice-to-Have
| Gap | Impact | Notes |
|-----|--------|-------|
| Certificate/badge generation | Low | Module 21 covers certification but no actual PDF/badge output |
| Analytics/reporting | Low | No instructor dashboard showing cohort progress |
| Offline support (PWA) | Low | localStorage persists but no service worker for offline access |

---

## Recommended Next Steps (Priority Order)

1. **Add E2E tests for the platform** — Playwright tests for the training app and practice app. Use the same patterns taught in the course. This is both a quality gate and a meta-learning opportunity ("eat your own dog food").

2. **Quiz-gated completion** — Require quiz attempt before marking a lesson complete. Show quiz status on the "Mark Complete" button.

3. **Role-based path selector** — Add onboarding step: "I'm a developer" / "I'm a non-coder" → filter/highlight relevant modules.

4. **Search** — Full-text search across module titles, lesson content, and prompt templates.

5. **Glossary page** — Auto-generated from terms used across modules (POM, AAA, CARD, HITL, etc.).

---

## Architecture Summary

```
training-app/src/                          (React 19 + Vite 8)
  App.tsx              # Hash routing via parseHash()/hashForView(), state orchestration (260 LOC)
  contexts/
    ProgressContext.tsx # localStorage "mav-progress-v3", 8 API methods (308 LOC)
    ThemeContext.tsx    # localStorage "mav-theme-preference", auto-rotation (102 LOC)
  pages/               # 3 page components
    ProgressDashboardPage.tsx  # Course overview, module grid, completion %
    ModuleOverviewPage.tsx     # Lesson list for selected module
    LessonDetailPage.tsx       # Full lesson renderer with quiz/exercise embed
  layouts/
    AppShell.tsx        # 3-rail responsive (left 288px, center max-896px, right 304px)
  components/
    ui/                # 43 Radix/shadcn components
    content/           # Section renderers (text, code, callout, table)
    interactive/       # Quiz widget, exercise widget with starter/solution/hints
    navigation/        # TopBar, BottomBar, ModuleNav, SupportRail
    LessonView.tsx     # Central lesson rendering engine (699 LOC)
  data/
    modules/           # 27 module files (01-orientation.ts → 27-github-actions.ts)
    curriculum.ts      # Transforms legacy Lesson format → Module[] (168 LOC)
    types.ts           # Legacy types (50 LOC)
  types/curriculum.ts  # Final data model with discriminated unions (110 LOC)
  themes/tokens.css    # 4 theme definitions, 15+ CSS variable tokens (122 LOC)

practice-app/src/                          (React 19 + React Router 7)
  App.tsx              # BrowserRouter, 12 routes, provider nesting
  pages/               # 10 page components (Login, Dashboard, Products, Contact,
                       #   Orders, Shipping, Payment, Review, Confirmation,
                       #   Settings, Admin, Activity)
  AuthContext.tsx       # Role-based auth (admin/editor/viewer), sessionStorage
  CheckoutContext.tsx   # 4-step checkout state preservation
  ToastContext.tsx      # Toast with 3 intentional bugs (race, stacking, delay)
  data.ts              # Seed data (users, products, orders, admin users)

test-cases/
  test-case-mapping.md # Manual-to-automated decomposition guide (5-part format)
  examples/            # 10 Playwright specs (59 tests, 859 LOC)
```

**Responsive Breakpoints:** <1024px mobile (left rail hidden) · 1024-1279px tablet (right rail hidden) · ≥1280px desktop (both rails)

**Tech Stack:** React 19.2 · TypeScript 5.9 · Vite 8.0 · Tailwind 3.4 · Radix UI (43 components) · React Hook Form 7.71 · Zod 4.3 · React Router 7.13 (practice-app only)
