# ADR-03: Expand Curriculum to Enterprise-Scale Testing Patterns

## Status
**Implemented** (March 2026) — Tier 1 and Tier 2 modules complete; Tier 3 content exists but practice app targets are partial.

## Context
The original 15-module curriculum covered functional UI testing well but lacked the non-functional testing patterns, scalability strategies, and CI/CD workflows required by enterprise teams. External audits placed the platform at TMMi Level 2 (Managed) — structured automation exists, but measurement, governance, and scalability patterns are absent.

This ADR consolidates the following original granular ADR candidates:
- ADR-004 (auth fixtures), ADR-005 (accessibility testing), ADR-006 (visual regression),
  ADR-009 (CI/CD beyond GitLab)

## Decision
Expand from 15 to 31 modules across three tiers, with corresponding practice-app test targets:

### Tier 1: Enterprise Credibility (Modules 16-21)
| Module | Topic | Practice App Target |
|--------|-------|---------------------|
| 16 | Auth Fixtures & StorageState | AdminPage (role-gated access) |
| 17 | Visual Regression Testing | DashboardPage (charts, dynamic content masking) |
| 18 | Accessibility Testing (axe-core) | SettingsPage (3 intentional WCAG violations) |
| 19 | Flaky Test Diagnosis | ToastContext (timing-dependent behavior, race conditions) |
| 20 | Test Data Strategies | Cross-page data seeding patterns |
| 21 | Assessment & Certification | Capstone rubric and competency matrix |

### Tier 2: Scale (Modules 22-27)
| Module | Topic |
|--------|-------|
| 22 | Trace Viewer Deep-Dive |
| 23 | Mobile & Responsive Testing |
| 24 | Parallel Execution & Sharding |
| 25 | Multi-Browser Configuration |
| 26 | Test Tagging Strategies |
| 27 | GitHub Actions CI/CD |

### Tier 3: Advanced/AI (Modules 28-31)
| Module | Topic |
|--------|-------|
| 28 | Playwright MCP & AI Agents |
| 29 | Component Testing |
| 30 | Performance Testing Baselines |
| 31 | Custom Reporters |

### Practice App Expansion
Five new pages/features added to support the new modules:
- **SettingsPage** — 3 intentional a11y violations (missing label, low contrast, incorrect focus order)
- **AdminPage** — Role-gated access, bulk operations, stale state bugs
- **ActivityPage** — Mock modes for error/timeout/stale-cache scenarios
- **PaymentPage** — Part of multi-step checkout flow
- **ReviewPage** — Order review with checkout context integration

Three new context providers:
- **AuthContext** — Role-based auth (admin/editor/viewer), sessionStorage persistence
- **CheckoutContext** — Multi-step checkout state management
- **ToastContext** — Global notifications with 3 documented race conditions

## Consequences

### Positive
- Platform now covers the full enterprise testing spectrum (auth, visual, a11y, CI, mobile)
- Practice app contains 11+ intentional bugs across 4 pages for realistic test target scenarios
- CI/CD coverage expanded beyond GitLab to include GitHub Actions with matrix strategies
- TMMi alignment elevated from Level 2 to Level 3+ with measurement and scalability patterns

### Negative
- Module count tripled (15 to 31), increasing maintenance surface
- Tier 3 modules (28-31) have content but no dedicated practice app targets — these teach concepts applicable to external projects
- Intentional bugs in practice app require documentation to avoid confusion during maintenance

## Verification
- 31 module files exist in `training-app/src/data/modules/`
- Practice app: 12 routes, 10 page components, 3 context providers
- `SettingsPage.tsx` contains 3 documented a11y violations
- `ToastContext.tsx` contains 3 documented race condition patterns
- `AdminPage.tsx` contains role-gated access with bulk operation bugs
