# Test Cases Reference

Reference Playwright specifications included in the repository. These specs demonstrate production-quality test patterns that learners should aim to replicate.

## Overview

The `test-cases/examples/` directory contains **10 spec files** with **59 total tests** covering all practice app pages.

## Spec Files

### accessibility.spec.ts (4 tests)
Tests the Settings page's intentional WCAG violations using `@axe-core/playwright`.

**Patterns demonstrated:**
- axe-core integration with Playwright
- Accessibility violation assertions
- WCAG 2.1 AA compliance checks
- Custom axe rule configuration

### activity.spec.ts (5 tests)
Tests the Activity page's filterable feed, detail views, and async content loading.

**Patterns demonstrated:**
- Async content loading assertions
- Filter interaction chains
- Detail view navigation
- Mock mode testing (error, timeout, stale)

### admin.spec.ts (7 tests)
Tests the Admin page with role-gated access, user management, and bulk operations.

**Patterns demonstrated:**
- Role-based authentication (`admin@test.com`)
- Bulk selection and action patterns
- Search within table data
- Stale state detection after bulk ops

### checkout.spec.ts (6 tests)
Tests the multi-step checkout wizard (Shipping → Payment → Review → Confirmation).

**Patterns demonstrated:**
- Multi-step form navigation
- Data preservation across steps
- Back navigation assertions
- Checkout context integration

### contact.spec.ts (7 tests)
Tests the Contact page's form validation with required and optional fields.

**Patterns demonstrated:**
- Required field validation
- Format validation (email, phone)
- Success message assertions
- Optional field handling

### login.spec.ts (7 tests)
Tests the Login page's authentication flow, error handling, and account lockout.

**Patterns demonstrated:**
- Form fill and submit
- Error message assertions
- Successful login → redirect
- Account lockout after 5 failures

### orders.spec.ts (6 tests)
Tests the Orders page's data table with sorting, filtering, and pagination.

**Patterns demonstrated:**
- Table column sorting
- Status filter application
- Pagination navigation
- Result count assertions

### search.spec.ts (7 tests)
Tests the Products page's search, category filtering, and empty states.

**Patterns demonstrated:**
- Search input interaction
- Category filter selection
- Result count verification
- Empty state detection

### settings.spec.ts (6 tests)
Tests the Settings page's tabbed interface and profile update functionality.

**Patterns demonstrated:**
- Tab navigation
- Profile form editing
- Notification preference toggles
- Save action confirmation

### toast.spec.ts (4 tests)
Tests the toast notification system and its intentional race conditions.

**Patterns demonstrated:**
- Toast appearance timing
- Multiple simultaneous toasts
- Auto-dismiss behavior
- Race condition detection

## Quality Criteria

All reference tests follow these standards:

| Criterion | Rule |
|-----------|------|
| Independence | Each test navigates from scratch — no test depends on another |
| Real assertions | Every `expect()` maps to an acceptance criterion |
| Stable selectors | `data-testid` preferred; no CSS class selectors |
| No timeouts | Zero `waitForTimeout` calls |
| Descriptive names | Test names describe the *behavior*, not the *implementation* |

## Using Reference Tests

### Compare Your Work

After writing tests in a course exercise, compare against reference specs:

```bash
# Run a specific reference spec
cd practice-app
npx playwright test test-cases/examples/login.spec.ts

# Run all reference specs
npx playwright test test-cases/examples/
```

### Learning From Diffs

A useful exercise: write your test first, then diff against the reference:

```bash
diff your-test.spec.ts test-cases/examples/login.spec.ts
```

Focus on differences in:
- Selector strategy (did you use `data-testid`?)
- Assertion specificity (did you check the right thing?)
- Test structure (did you organize logically?)
