# Playwright + Copilot: Test Case Mapping Reference

> **Purpose:** Complete mapping of manual test procedures → discrete automated tests for the companion practice app  
> **Audience:** Manual testers learning automation, developers onboarding to Playwright  
> **Format:** Each feature area shows the manual test, how it decomposes, the automated tests, and the Copilot prompt that creates each one  

---

## How to Read This Document

Each feature area follows the same structure:

1. **The Manual Test** — How a manual tester would test this today, written as a single walkthrough
2. **Why This Manual Test Doesn't Work as One Automated Test** — The specific problems with automating the manual test verbatim
3. **The Decomposition** — How we break the manual test into focused, independent automated tests
4. **Each Automated Test** — For every discrete test:
   - What it validates (mapped to specific acceptance criteria)
   - The Copilot CARD prompt that generates it
   - The expected Playwright code (the reference answer)
   - What the learner should check in review (HITL checkpoint)
5. **Learner Exercise** — What we ask the learner to create, and what we compare against

---

## Feature 1: Login Page

### App Specification

| Element | data-testid | Behavior |
|---------|-------------|----------|
| Email input | `email-input` | Required, must be valid email format |
| Password input | `password-input` | Required, minimum 8 characters |
| Login button | `login-button` | Disabled until both fields have values |
| Error message | `error-message` | Shows on invalid credentials, specific text per error type |
| Dashboard heading | `dashboard-heading` | Shows "Welcome, [name]" after successful login |
| Lockout message | `lockout-message` | Shows after 5 failed attempts |

### The Manual Test (How You Test This Today)

```
MANUAL TEST: Login Feature — Full Walkthrough
Estimated time: 8–12 minutes

1. Open the app in Chrome
2. Navigate to the login page
3. Verify the login form is visible with email and password fields
4. Verify the login button is disabled (both fields empty)
5. Click the login button — confirm nothing happens
6. Enter only an email address: "user@test.com"
7. Verify the login button is still disabled (password empty)
8. Enter a password: "short" (less than 8 chars)
9. Click login — verify you see "Password must be at least 8 characters"
10. Clear the email field, leave only the password
11. Click login — verify you see "Email is required"
12. Enter an invalid email: "not-an-email"
13. Enter a valid password: "Password123"
14. Click login — verify you see "Please enter a valid email address"
15. Enter valid email: "user@test.com"
16. Enter wrong password: "WrongPassword1"
17. Click login — verify you see "Invalid email or password"
18. Repeat step 16-17 four more times (total 5 failed attempts)
19. Verify you see "Account locked. Please try again in 15 minutes."
20. Verify the login button is now disabled
21. [Restart session / clear lockout]
22. Enter valid credentials: "user@test.com" / "Password123!"
23. Click login
24. Verify redirect to /dashboard
25. Verify dashboard heading shows "Welcome, Test User"
26. Check the URL bar shows /dashboard
```

### Why This Manual Test Doesn't Work as One Automated Test

Let's be direct about the problems — because these are the exact mistakes the Mindset Shifts lesson warns about:

| Manual Test Habit | What Goes Wrong in Automation |
|---|---|
| Steps 1–26 in one flow | If step 9 fails (validation message wrong), you learn nothing about steps 10–26. The lockout test, the happy path, the dashboard check — all skipped. |
| Steps 16–19 depend on a counter | The lockout test requires exactly 5 prior failures. If any earlier step changes the count, the lockout test becomes flaky. |
| Step 22 depends on step 21 | The happy path test requires a clean session. Coupling it to the lockout test means you can't run it independently. |
| One test covers 7 different behaviors | When this test fails, the error message tells you "test failed" — but which behavior broke? Validation? Lockout? Redirect? You have to re-run and debug. |

**The rule:** Each automated test checks ONE behavior. If that behavior breaks, you know exactly what's wrong from the test name alone.

### The Decomposition: 7 Tests from 1 Manual Walkthrough

Here's how the 26-step manual test becomes 7 focused automated tests:

| # | Automated Test | Manual Steps Covered | What It Proves |
|---|---|---|---|
| L1 | Login page loads with all elements | Steps 1–4 | Page renders correctly, form structure is intact |
| L2 | Empty form shows required field errors | Steps 5–6, 10–11 | Client-side required field validation works |
| L3 | Invalid email format shows format error | Steps 12–14 | Email format validation works |
| L4 | Short password shows length error | Steps 8–9 | Password minimum length validation works |
| L5 | Wrong credentials show auth error | Steps 15–17 | Server-side authentication validation works |
| L6 | Account locks after 5 failed attempts | Steps 16–20 | Lockout security mechanism works |
| L7 | Valid credentials redirect to dashboard | Steps 22–26 | Happy path login flow works end-to-end |

**Notice:** Each test is independent. L7 doesn't depend on L6 running first. L6 creates its own 5 failures. L2 doesn't need L1 to pass. This is the core automation mindset shift.

---

### Test L1: Login Page Loads with All Elements

**What it validates:** The login page renders with all required form elements visible and the submit button in the correct initial state.

**Acceptance criteria mapped:** "Login page displays email field, password field, and login button. Button is disabled when fields are empty."

**Copilot CARD Prompt:**
```
CONTEXT: Login page at /login with email and password form fields
ACTIONS: Navigate to /login, verify all form elements are present
RULES: Login button should be disabled when both fields are empty
DATA: No data needed — this is a page load verification

Generate a Playwright test using data-testid selectors:
- email-input, password-input, login-button
Assert each element is visible and the button is disabled.
Test name: "login page renders with all form elements"
```

**Expected Playwright Code:**
```typescript
import { test, expect } from '@playwright/test';

test('login page renders with all form elements', async ({ page }) => {
  await page.goto('/login');

  // All form elements are visible
  await expect(page.getByTestId('email-input')).toBeVisible();
  await expect(page.getByTestId('password-input')).toBeVisible();
  await expect(page.getByTestId('login-button')).toBeVisible();

  // Button starts disabled when fields are empty
  await expect(page.getByTestId('login-button')).toBeDisabled();
});
```

**HITL Review Checkpoint:**
- ✅ Three assertions — one per element
- ✅ Disabled state check matches the AC ("disabled when empty")
- ✅ Uses data-testid selectors
- ✅ No waitForTimeout
- ✅ Test is independent — no login needed, no prior state

**Learning context:** This is the simplest possible test. It teaches page load verification and the `toBeVisible()` / `toBeDisabled()` assertion patterns. Manual testers often skip this test because "of course the page loads" — but in CI/CD, a broken import or routing change can prevent the page from rendering at all.

---

### Test L2: Empty Form Shows Required Field Errors

**What it validates:** Submitting an empty form triggers validation messages for both required fields.

**Acceptance criteria mapped:** "Both email and password are required fields. Submitting without them shows field-specific error messages."

**Copilot CARD Prompt:**
```
CONTEXT: Login page at /login, email and password are both required
ACTIONS: Navigate to /login, click login button without entering anything
RULES: 
  - Error message should show "Email is required" 
  - Error message should show "Password is required"
  - Errors appear near their respective fields
DATA: No input — intentionally empty form

Generate a Playwright test using data-testid selectors:
- login-button, email-error, password-error
Test name: "empty form submission shows required field errors"
```

**Expected Playwright Code:**
```typescript
test('empty form submission shows required field errors', async ({ page }) => {
  await page.goto('/login');

  // Force-enable and click the submit button (or trigger form submission)
  await page.getByTestId('login-button').click({ force: true });

  // Both field-level errors are visible
  await expect(page.getByTestId('email-error')).toContainText('Email is required');
  await expect(page.getByTestId('password-error')).toContainText('Password is required');
});
```

**HITL Review Checkpoint:**
- ✅ Assertions check SPECIFIC error text, not just "an error exists"
- ✅ Tests both fields independently in one test (they're the same behavior: required field validation)
- ✅ `force: true` may be needed if button is disabled — this is intentional

**Learning context:** This teaches `toContainText()` — the most common assertion for validation messages. It also introduces the question: "Should I test both fields in one test or separate tests?" Answer: same behavior (required field check) = one test. Different behaviors (format validation vs. required) = separate tests.

---

### Test L3: Invalid Email Format Shows Format Error

**What it validates:** Entering a malformed email triggers format-specific validation before the form submits to the server.

**Acceptance criteria mapped:** "Email field validates format. 'not-an-email' shows 'Please enter a valid email address.'"

**Copilot CARD Prompt:**
```
CONTEXT: Login page at /login, email field has format validation
ACTIONS: 
  1. Navigate to /login
  2. Enter "not-an-email" in email field
  3. Enter "ValidPassword1" in password field (so only email fails)
  4. Click login button
RULES: Error message shows "Please enter a valid email address"
DATA: Email: "not-an-email", Password: "ValidPassword1"

Generate a Playwright test. Use data-testid selectors: email-input, password-input, login-button, email-error
Test name: "invalid email format shows validation error"
```

**Expected Playwright Code:**
```typescript
test('invalid email format shows validation error', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('email-input').fill('not-an-email');
  await page.getByTestId('password-input').fill('ValidPassword1');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('email-error'))
    .toContainText('Please enter a valid email address');
});
```

**HITL Review Checkpoint:**
- ✅ Password is filled with a VALID value so that ONLY the email validation fires
- ✅ Asserts the SPECIFIC error message text from the AC
- ✅ Does not also check required field errors (that's Test L2's job)

**Learning context:** This teaches test isolation through data strategy. A manual tester would leave other fields empty, but in automation you fill all OTHER fields correctly so you isolate the one validation rule you're testing. This is the "targeted check" mindset from Lesson 2.

---

### Test L4: Short Password Shows Length Error

**What it validates:** Entering a password shorter than the minimum length triggers a length-specific validation message.

**Acceptance criteria mapped:** "Password must be at least 8 characters. Shorter input shows 'Password must be at least 8 characters.'"

**Copilot CARD Prompt:**
```
CONTEXT: Login page at /login, password requires minimum 8 characters
ACTIONS:
  1. Navigate to /login
  2. Enter "user@test.com" in email (valid, so only password fails)
  3. Enter "short" in password (5 chars, below minimum)
  4. Click login
RULES: Error message shows "Password must be at least 8 characters"
DATA: Email: "user@test.com", Password: "short"

Generate a Playwright test. data-testid selectors: email-input, password-input, login-button, password-error
Test name: "short password shows minimum length error"
```

**Expected Playwright Code:**
```typescript
test('short password shows minimum length error', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('short');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('password-error'))
    .toContainText('Password must be at least 8 characters');
});
```

**HITL Review Checkpoint:**
- ✅ Email is valid so only password validation fires
- ✅ "short" is clearly below 8 characters — test data is obvious
- ✅ Does NOT also test the boundary case (exactly 8 chars) — that would be a separate test if the AC requires it

**Learning context:** Identical pattern to L3. The learner should start recognizing: "One validation rule = one test." This repetition is intentional — pattern recognition is how non-coders build automation fluency.

---

### Test L5: Wrong Credentials Show Authentication Error

**What it validates:** Server-side authentication rejects invalid credentials and returns a user-friendly error.

**Acceptance criteria mapped:** "Invalid credentials show 'Invalid email or password.' No information about which field is wrong (security requirement)."

**Copilot CARD Prompt:**
```
CONTEXT: Login page at /login, server validates credentials
ACTIONS:
  1. Navigate to /login
  2. Enter "user@test.com" (format-valid email)
  3. Enter "WrongPassword1" (format-valid but incorrect password)
  4. Click login
RULES: Error message shows "Invalid email or password" — generic, not field-specific (security)
DATA: Email: "user@test.com", Password: "WrongPassword1"

Generate a Playwright test. data-testid selectors: email-input, password-input, login-button, error-message
Test name: "wrong credentials show generic authentication error"
```

**Expected Playwright Code:**
```typescript
test('wrong credentials show generic authentication error', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('WrongPassword1');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('error-message'))
    .toContainText('Invalid email or password');
  
  // Should NOT redirect — still on login page
  await expect(page).toHaveURL(/.*\/login/);
});
```

**HITL Review Checkpoint:**
- ✅ Both fields pass CLIENT-SIDE validation (valid format, 8+ chars) — this specifically tests SERVER-SIDE rejection
- ✅ Error is GENERIC (security: don't reveal whether email or password is wrong)
- ✅ URL assertion confirms no redirect happened — user stays on login page
- ✅ The error-message testid is different from email-error/password-error (it's a page-level error, not field-level)

**Learning context:** This test teaches the difference between client-side validation (Tests L2–L4) and server-side validation (this test). Manual testers don't usually think about this distinction because they see both in the same flow. In automation, the distinction matters because client-side checks run instantly (no network) while server-side checks involve an API call (potential timing issues).

---

### Test L6: Account Locks After 5 Failed Attempts

**What it validates:** The security lockout mechanism activates after exactly 5 consecutive failed login attempts.

**Acceptance criteria mapped:** "After 5 failed login attempts, show 'Account locked. Please try again in 15 minutes.' Disable the login button."

**Copilot CARD Prompt:**
```
CONTEXT: Login page at /login, lockout after 5 failed attempts
ACTIONS:
  1. Navigate to /login
  2. Attempt login with wrong password 5 times in sequence
  3. After 5th attempt, verify lockout message and disabled button
RULES: 
  - Lockout triggers on the 5th failed attempt (not 4th, not 6th)
  - Message: "Account locked. Please try again in 15 minutes."
  - Login button becomes disabled after lockout
DATA: Email: "locktest@test.com", Password: "WrongPassword1" (repeated 5x)

Generate a Playwright test with a loop for the 5 attempts. 
data-testid selectors: email-input, password-input, login-button, lockout-message
Test name: "account locks after 5 failed login attempts"
```

**Expected Playwright Code:**
```typescript
test('account locks after 5 failed login attempts', async ({ page }) => {
  await page.goto('/login');

  // Attempt login 5 times with wrong credentials
  for (let i = 0; i < 5; i++) {
    await page.getByTestId('email-input').fill('locktest@test.com');
    await page.getByTestId('password-input').fill('WrongPassword1');
    await page.getByTestId('login-button').click();

    if (i < 4) {
      // First 4 attempts: regular error, clear fields for next attempt
      await expect(page.getByTestId('error-message')).toBeVisible();
      await page.getByTestId('email-input').clear();
      await page.getByTestId('password-input').clear();
    }
  }

  // After 5th attempt: lockout
  await expect(page.getByTestId('lockout-message'))
    .toContainText('Account locked. Please try again in 15 minutes.');
  await expect(page.getByTestId('login-button')).toBeDisabled();
});
```

**HITL Review Checkpoint:**
- ✅ Uses a fresh email (locktest@) that doesn't conflict with other tests' login state
- ✅ Loop runs exactly 5 times — matches the AC
- ✅ Asserts the lockout message text AND the disabled button state — both are in the AC
- ✅ Does NOT depend on any other test running first — creates its own failure count from zero

**Learning context:** This is the first test that introduces a loop and state accumulation. It's also where non-coders see why test independence matters: if L5 ran first and used the same email, the failure count would start at 1 instead of 0, making L6 lock on the 4th attempt instead of the 5th. Using a different email address (`locktest@`) prevents this. Manual testers don't think about this because they restart the browser between test runs.

---

### Test L7: Valid Credentials Redirect to Dashboard

**What it validates:** The complete happy path — valid login leads to the correct destination with personalized content.

**Acceptance criteria mapped:** "Valid credentials redirect to /dashboard. Dashboard shows 'Welcome, [user name]' heading."

**Copilot CARD Prompt:**
```
CONTEXT: Login page at /login → Dashboard page at /dashboard
ACTIONS:
  1. Navigate to /login
  2. Enter valid email and password
  3. Click login
  4. Verify redirect to /dashboard
  5. Verify welcome message includes user's name
RULES: 
  - URL changes to /dashboard after successful login
  - Dashboard heading shows "Welcome, Test User"
DATA: Email: "user@test.com", Password: "Password123!"

Generate a Playwright test. data-testid selectors: email-input, password-input, login-button, dashboard-heading
Test name: "valid login redirects to dashboard with welcome message"
```

**Expected Playwright Code:**
```typescript
test('valid login redirects to dashboard with welcome message', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  // Verify redirect
  await expect(page).toHaveURL(/.*\/dashboard/);

  // Verify personalized content
  await expect(page.getByTestId('dashboard-heading'))
    .toContainText('Welcome, Test User');
});
```

**HITL Review Checkpoint:**
- ✅ Two assertions: URL change AND content verification — both in the AC
- ✅ Does NOT test anything about the login form itself (that's L1–L6)
- ✅ URL assertion uses regex (`/.*\/dashboard/`) not exact match — resilient to base URL changes
- ✅ `toContainText` not `toHaveText` — the heading might include more content, we only care that the name is present

**Learning context:** This is the "golden path" test — the one that proves the core feature works. Notice it's the simplest test despite covering the "most important" flow. That's intentional: the happy path should be the shortest, most readable test. All the complexity lives in the error/edge cases (L2–L6). Manual testers tend to write the happy path as the longest test (because it's the full walkthrough). In automation, flip that instinct.

---

### Login Feature: Learner Exercise

**Assignment:** Using the prompt templates from Lesson 10, create Tests L1 through L7 against the companion app. Use the Record → Refine workflow for at least two of them.

**What to submit:** All 7 test files in `e2e/login/`. Each file should contain one test.

**What we compare against:**
| Check | What the Reviewer Looks For |
|---|---|
| Test count | Exactly 7 tests — not 1 long test, not 20 micro-tests |
| Test independence | Each test navigates to /login on its own — no shared state |
| Assertion coverage | Every test has at least one `expect()` that verifies an AC |
| Selector strategy | 100% data-testid — no CSS selectors, no nth-child |
| Error text accuracy | Asserted messages match the app's actual text exactly |
| Lockout isolation | L6 uses a unique email that won't conflict with other tests |
| No hardcoded waits | Zero instances of `waitForTimeout` |

---

## Feature 2: Product Search

### App Specification

| Element | data-testid | Behavior |
|---------|-------------|----------|
| Search input | `search-input` | Text input, searches on submit or Enter key |
| Search button | `search-button` | Triggers search |
| Results list | `results-list` | Container for result cards |
| Result card | `result-card` | Individual result — shows name, price, thumbnail |
| Result count | `result-count` | Shows "X results found" |
| No results message | `no-results` | Shows "No products found" when zero matches |
| Category filter | `category-filter` | Dropdown filter — "All", "Electronics", "Clothing", "Home" |

### The Manual Test

```
MANUAL TEST: Product Search — Full Walkthrough
Estimated time: 10–15 minutes

1. Navigate to /products
2. Verify the search input and search button are visible
3. Verify the page shows all products by default (no filter applied)
4. Type "Widget" in the search input
5. Click the search button
6. Verify results appear containing "Widget" in the product name
7. Verify each result card shows: product name, price, and thumbnail image
8. Verify the result count text shows the correct number (e.g., "3 results found")
9. Clear the search and type "widget" (lowercase)
10. Verify same results appear (case-insensitive search)
11. Clear the search and type "xyznonexistent"
12. Verify "No products found" message appears
13. Verify result count shows "0 results found"
14. Clear the search, type "Widget"
15. Select "Electronics" from the category filter
16. Verify results are filtered — only Electronics Widgets shown
17. Clear the search completely (empty field)
18. Click search with empty input
19. Verify all products are shown again (empty search = show all)
20. Press Enter key in the search input instead of clicking the button
21. Verify search triggers via Enter key as well
```

### The Decomposition: 7 Tests

| # | Automated Test | Manual Steps | What It Proves |
|---|---|---|---|
| S1 | Search page loads with default products | Steps 1–3 | Page renders, default state is correct |
| S2 | Valid search returns matching results | Steps 4–8 | Core search functionality works |
| S3 | Search is case-insensitive | Steps 9–10 | Case handling works correctly |
| S4 | No-match search shows empty state | Steps 11–13 | Empty state renders correctly |
| S5 | Category filter narrows results | Steps 14–16 | Filter + search combination works |
| S6 | Empty search shows all products | Steps 17–19 | Reset/clear behavior works |
| S7 | Enter key triggers search | Steps 20–21 | Keyboard accessibility works |

---

### Test S1: Search Page Loads with Default Products

**Copilot CARD Prompt:**
```
CONTEXT: Product search page at /products, shows all products by default
ACTIONS: Navigate to /products, verify page loads with products visible
RULES: 
  - Search input and button are visible
  - Products are displayed by default (no search needed)
  - At least 1 result card is visible
DATA: No search input — checking default state

Generate a Playwright test. data-testid: search-input, search-button, result-card
Test name: "search page loads with default products visible"
```

**Expected Playwright Code:**
```typescript
test('search page loads with default products visible', async ({ page }) => {
  await page.goto('/products');

  await expect(page.getByTestId('search-input')).toBeVisible();
  await expect(page.getByTestId('search-button')).toBeVisible();

  // Default state shows products
  const results = page.getByTestId('result-card');
  await expect(results.first()).toBeVisible();
  const count = await results.count();
  expect(count).toBeGreaterThan(0);
});
```

**Learning context:** Introduces `locator.first()` for collections and `count()` for verifying list length. Manual testers: you'd visually scan for "are there products on the page?" — automation needs an explicit count check.

---

### Test S2: Valid Search Returns Matching Results

**Copilot CARD Prompt:**
```
CONTEXT: Product search page at /products
ACTIONS:
  1. Navigate to /products
  2. Type "Widget" in search input
  3. Click search button
  4. Verify results contain "Widget" in the name
  5. Verify each result card has name, price, and thumbnail
  6. Verify result count text matches actual count
RULES: Every returned result must contain the search term in its name
DATA: Search term: "Widget"

Generate a Playwright test. data-testid: search-input, search-button, result-card, result-count
Test name: "search for Widget returns matching results with complete cards"
```

**Expected Playwright Code:**
```typescript
test('search for Widget returns matching results with complete cards', async ({ page }) => {
  await page.goto('/products');

  await page.getByTestId('search-input').fill('Widget');
  await page.getByTestId('search-button').click();

  // Results appear
  const results = page.getByTestId('result-card');
  await expect(results.first()).toBeVisible();
  const count = await results.count();
  expect(count).toBeGreaterThan(0);

  // Result count text matches actual count
  await expect(page.getByTestId('result-count'))
    .toContainText(`${count} result`);

  // First result card has required elements
  const firstCard = results.first();
  await expect(firstCard.locator('[data-testid="product-name"]')).toBeVisible();
  await expect(firstCard.locator('[data-testid="product-price"]')).toBeVisible();
  await expect(firstCard.locator('[data-testid="product-image"]')).toBeVisible();
});
```

**HITL Review Checkpoint:**
- ✅ Checks card CONTENT structure, not just "cards exist"
- ✅ Verifies result count text matches actual number of cards
- ✅ Uses nested locators (`firstCard.locator(...)`) — a new pattern for learners

**Learning context:** This is the first test where the learner encounters nested locators — finding an element INSIDE another element. Manual testers naturally scope their attention ("I'm looking at the first result card, and inside it I see the name"). Automation needs that scoping to be explicit.

---

### Test S3: Search Is Case-Insensitive

**Copilot CARD Prompt:**
```
CONTEXT: Product search page, search should be case-insensitive
ACTIONS:
  1. Search for "Widget" — note the result count
  2. Search for "widget" (lowercase) — verify same count
  3. Search for "WIDGET" (uppercase) — verify same count
RULES: All three searches must return the same number of results
DATA: Search terms: "Widget", "widget", "WIDGET"

Generate a Playwright test comparing result counts across case variations.
data-testid: search-input, search-button, result-card
Test name: "search is case-insensitive"
```

**Expected Playwright Code:**
```typescript
test('search is case-insensitive', async ({ page }) => {
  await page.goto('/products');

  const searchTerms = ['Widget', 'widget', 'WIDGET'];
  const counts: number[] = [];

  for (const term of searchTerms) {
    await page.getByTestId('search-input').clear();
    await page.getByTestId('search-input').fill(term);
    await page.getByTestId('search-button').click();
    await expect(page.getByTestId('result-card').first()).toBeVisible();
    counts.push(await page.getByTestId('result-card').count());
  }

  // All variations return the same count
  expect(counts[0]).toBeGreaterThan(0);
  expect(counts[1]).toBe(counts[0]);
  expect(counts[2]).toBe(counts[0]);
});
```

**Learning context:** Introduces data-driven testing with a loop. Instead of three separate tests that each check one case variation, we parameterize. This is a judgment call: three case variants of the SAME behavior = one test with a loop. Three DIFFERENT behaviors = separate tests.

---

### Test S4: No-Match Search Shows Empty State

**Copilot CARD Prompt:**
```
CONTEXT: Product search page, searching for nonexistent term
ACTIONS: Search for "xyznonexistent"
RULES: 
  - "No products found" message is visible
  - Result count shows "0 results found"
  - No result cards are rendered
DATA: Search term: "xyznonexistent"

Generate a Playwright test. data-testid: search-input, search-button, no-results, result-count, result-card
Test name: "nonexistent search term shows empty state"
```

**Expected Playwright Code:**
```typescript
test('nonexistent search term shows empty state', async ({ page }) => {
  await page.goto('/products');

  await page.getByTestId('search-input').fill('xyznonexistent');
  await page.getByTestId('search-button').click();

  await expect(page.getByTestId('no-results')).toBeVisible();
  await expect(page.getByTestId('no-results')).toContainText('No products found');
  await expect(page.getByTestId('result-count')).toContainText('0 results');
  await expect(page.getByTestId('result-card')).toHaveCount(0);
});
```

**HITL Review Checkpoint:**
- ✅ Uses `toHaveCount(0)` — not just "no-results is visible" but also "result-card does NOT exist"
- ✅ Both the friendly message AND the count are verified

**Learning context:** Introduces `toHaveCount(0)` — asserting that something does NOT exist. Manual testers naturally notice when results are missing. Automation needs you to explicitly say "I expect zero of these." Also teaches testing the empty/error state, which is where most production bugs hide.

---

### Test S5: Category Filter Narrows Results

**Copilot CARD Prompt:**
```
CONTEXT: Product search page with category filter dropdown
ACTIONS:
  1. Search for "Widget"
  2. Note the total result count
  3. Select "Electronics" from category filter
  4. Verify result count decreased (filtered)
  5. Verify remaining results are in the Electronics category
RULES: Filter + search work together — results match BOTH the search term and category
DATA: Search term: "Widget", Filter: "Electronics"

Generate a Playwright test. data-testid: search-input, search-button, category-filter, result-card, result-count
Test name: "category filter narrows search results"
```

**Expected Playwright Code:**
```typescript
test('category filter narrows search results', async ({ page }) => {
  await page.goto('/products');

  // Search first
  await page.getByTestId('search-input').fill('Widget');
  await page.getByTestId('search-button').click();
  await expect(page.getByTestId('result-card').first()).toBeVisible();
  const unfilteredCount = await page.getByTestId('result-card').count();

  // Apply category filter
  await page.getByTestId('category-filter').selectOption('Electronics');
  
  // Wait for filtered results
  const filteredResults = page.getByTestId('result-card');
  const filteredCount = await filteredResults.count();
  
  // Filtered count should be less than or equal to unfiltered
  expect(filteredCount).toBeLessThanOrEqual(unfilteredCount);
  expect(filteredCount).toBeGreaterThan(0);
});
```

**Learning context:** First test combining two UI controls (search + filter). Teaches that when testing combinations, you verify the COMBINED effect, not each control independently. Also introduces `selectOption()` for dropdowns.

---

### Test S6: Empty Search Shows All Products

**Copilot CARD Prompt:**
```
CONTEXT: Product search page, clearing search should reset to all products
ACTIONS: Search for "Widget", then clear search and submit empty
RULES: Empty search returns to the default state showing all products
DATA: First search: "Widget", then clear to empty

Generate a Playwright test. data-testid: search-input, search-button, result-card
Test name: "empty search resets to show all products"
```

**Expected Playwright Code:**
```typescript
test('empty search resets to show all products', async ({ page }) => {
  await page.goto('/products');

  // Get the default product count
  await expect(page.getByTestId('result-card').first()).toBeVisible();
  const defaultCount = await page.getByTestId('result-card').count();

  // Search to narrow results
  await page.getByTestId('search-input').fill('Widget');
  await page.getByTestId('search-button').click();

  // Clear and search empty
  await page.getByTestId('search-input').clear();
  await page.getByTestId('search-button').click();

  // Back to default count
  const resetCount = await page.getByTestId('result-card').count();
  expect(resetCount).toBe(defaultCount);
});
```

**Learning context:** Tests the "reset" behavior. Manual testers check this instinctively ("let me clear the search and make sure everything comes back"). In automation, you need a baseline (defaultCount) to compare against. This teaches the compare-before-and-after pattern.

---

### Test S7: Enter Key Triggers Search

**Copilot CARD Prompt:**
```
CONTEXT: Search input should support Enter key submission
ACTIONS: Type a search term, press Enter instead of clicking the button
RULES: Results should appear — keyboard submission works the same as button click
DATA: Search term: "Widget"

Generate a Playwright test. data-testid: search-input, result-card
Test name: "Enter key triggers search"
```

**Expected Playwright Code:**
```typescript
test('Enter key triggers search', async ({ page }) => {
  await page.goto('/products');

  await page.getByTestId('search-input').fill('Widget');
  await page.getByTestId('search-input').press('Enter');

  await expect(page.getByTestId('result-card').first()).toBeVisible();
  const count = await page.getByTestId('result-card').count();
  expect(count).toBeGreaterThan(0);
});
```

**Learning context:** Introduces `.press('Enter')` — keyboard interaction testing. This is an accessibility concern that manual testers often check but forget to include in automation. Short, focused test.

---

### Search Feature: Learner Exercise

**Assignment:** Create Tests S1 through S7. Record at least S2 and S4 using the VS Code recorder, then refine with the "Refine a Recorded Test" prompt template.

**Comparison checklist:**
| Check | What the Reviewer Looks For |
|---|---|
| Test count | 7 tests, each in its own test block |
| Empty state | S4 checks BOTH the message AND `toHaveCount(0)` |
| Case-insensitive | S3 tests at least 2 case variations |
| Keyboard support | S7 uses `press('Enter')`, not `click()` on button |
| No hardcoded counts | Result counts are captured dynamically, not hardcoded as "expect 3 results" |

---

## Feature 3: Contact Form

### App Specification

| Element | data-testid | Behavior |
|---------|-------------|----------|
| Name input | `name-input` | Required, min 2 characters |
| Email input | `contact-email-input` | Required, valid email format |
| Phone input | `phone-input` | Optional, must match xxx-xxx-xxxx if provided |
| Subject dropdown | `subject-select` | Required, options: "General", "Support", "Sales", "Bug Report" |
| Message textarea | `message-input` | Required, min 20 characters |
| Submit button | `submit-button` | Disabled until all required fields valid |
| Success message | `success-message` | Shows "Thank you! We'll respond within 24 hours." |
| Field errors | `[field]-error` | Pattern: `name-error`, `contact-email-error`, etc. |

### The Manual Test

```
MANUAL TEST: Contact Form — Full Walkthrough
Estimated time: 10–12 minutes

1. Navigate to /contact
2. Verify all form fields are visible
3. Try to submit empty form — verify all required field errors show
4. Fill in name: "A" (too short) — verify "Name must be at least 2 characters"
5. Fix name: "Test User"
6. Fill in email: "bad-format" — verify email format error
7. Fix email: "test@example.com"
8. Fill in phone: "123" — verify phone format error "Phone must be xxx-xxx-xxxx"
9. Fix phone: "555-123-4567"
10. Leave subject as default (unselected) — verify subject required error
11. Select "Support" from subject dropdown
12. Fill in message: "Short" (under 20 chars) — verify "Message must be at least 20 characters"
13. Fix message: "I need help with my account settings and preferences."
14. Submit the form
15. Verify success message: "Thank you! We'll respond within 24 hours."
16. Verify form fields are cleared after successful submission
17. Submit again with all required fields but WITHOUT optional phone
18. Verify submission still succeeds (optional field not blocking)
```

### The Decomposition: 7 Tests

| # | Automated Test | Manual Steps | What It Proves |
|---|---|---|---|
| F1 | Contact form loads with all fields | Steps 1–2 | Page renders correctly |
| F2 | Empty submit shows all required errors | Step 3 | Required field validation fires for all fields |
| F3 | Name minimum length validation | Steps 4–5 | Name length rule works |
| F4 | Email format validation | Steps 6–7 | Email format rule works |
| F5 | Phone format validation (optional field) | Steps 8–9 | Optional field validates format when provided |
| F6 | Message minimum length validation | Steps 12–13 | Message length rule works |
| F7 | Happy path — successful submission | Steps 14–16 | Complete form submits and clears correctly |

---

### Test F1: Contact Form Loads

**Copilot CARD Prompt:**
```
CONTEXT: Contact form page at /contact with name, email, phone, subject, message fields
ACTIONS: Navigate to /contact, verify all form elements visible
RULES: Submit button should be present, all required fields visible
DATA: None — page load check

Generate a Playwright test. data-testid: name-input, contact-email-input, phone-input, subject-select, message-input, submit-button
Test name: "contact form loads with all fields visible"
```

**Expected Playwright Code:**
```typescript
test('contact form loads with all fields visible', async ({ page }) => {
  await page.goto('/contact');

  await expect(page.getByTestId('name-input')).toBeVisible();
  await expect(page.getByTestId('contact-email-input')).toBeVisible();
  await expect(page.getByTestId('phone-input')).toBeVisible();
  await expect(page.getByTestId('subject-select')).toBeVisible();
  await expect(page.getByTestId('message-input')).toBeVisible();
  await expect(page.getByTestId('submit-button')).toBeVisible();
});
```

---

### Test F2: Empty Submit Shows All Required Errors

**Copilot CARD Prompt:**
```
CONTEXT: Contact form, all fields except phone are required
ACTIONS: Navigate to /contact, click submit without entering anything
RULES: Error messages appear for: name, email, subject, message. NOT phone (optional).
DATA: No input — empty form

Generate a Playwright test checking that each required field shows its error.
data-testid pattern: [field]-error (name-error, contact-email-error, subject-error, message-error)
Test name: "empty submission shows errors for all required fields"
```

**Expected Playwright Code:**
```typescript
test('empty submission shows errors for all required fields', async ({ page }) => {
  await page.goto('/contact');

  await page.getByTestId('submit-button').click({ force: true });

  // Required field errors appear
  await expect(page.getByTestId('name-error')).toBeVisible();
  await expect(page.getByTestId('contact-email-error')).toBeVisible();
  await expect(page.getByTestId('subject-error')).toBeVisible();
  await expect(page.getByTestId('message-error')).toBeVisible();

  // Phone is optional — no error
  await expect(page.getByTestId('phone-error')).not.toBeVisible();
});
```

**HITL Review Checkpoint:**
- ✅ Checks that phone-error is NOT visible — proving the optional field isn't incorrectly required
- ✅ Uses `.not.toBeVisible()` — the negative assertion pattern

**Learning context:** Introduces `.not.toBeVisible()` — the negative assertion. Manual testers naturally check "phone shouldn't have an error" but forget to automate that check. Testing that something DOESN'T happen is just as important as testing that something does.

---

### Test F7: Happy Path — Successful Submission

**Copilot CARD Prompt:**
```
CONTEXT: Contact form at /contact, complete valid submission
ACTIONS:
  1. Fill all required fields with valid data
  2. Leave phone empty (optional)
  3. Submit the form
  4. Verify success message
  5. Verify form fields are cleared
RULES: 
  - Success message: "Thank you! We'll respond within 24 hours."
  - All fields should be empty after successful submit
DATA: 
  Name: "Test User"
  Email: "test@example.com"  
  Subject: "Support"
  Message: "I need help with my account settings and preferences please."

Generate a Playwright test. data-testid: name-input, contact-email-input, subject-select, message-input, submit-button, success-message
Test name: "valid form submission shows success and clears fields"
```

**Expected Playwright Code:**
```typescript
test('valid form submission shows success and clears fields', async ({ page }) => {
  await page.goto('/contact');

  // Fill all required fields
  await page.getByTestId('name-input').fill('Test User');
  await page.getByTestId('contact-email-input').fill('test@example.com');
  await page.getByTestId('subject-select').selectOption('Support');
  await page.getByTestId('message-input').fill(
    'I need help with my account settings and preferences please.'
  );

  // Submit
  await page.getByTestId('submit-button').click();

  // Success message
  await expect(page.getByTestId('success-message'))
    .toContainText("Thank you! We'll respond within 24 hours.");

  // Fields cleared after success
  await expect(page.getByTestId('name-input')).toHaveValue('');
  await expect(page.getByTestId('contact-email-input')).toHaveValue('');
  await expect(page.getByTestId('message-input')).toHaveValue('');
});
```

**HITL Review Checkpoint:**
- ✅ Skips phone (optional) to test that optional fields don't block submission
- ✅ Checks success message AND field clearing — two behaviors from the same AC
- ✅ Uses `toHaveValue('')` for field clearing — not `toBeEmpty()` which checks the DOM attribute differently

**Learning context:** Introduces `toHaveValue()` — checking the VALUE of an input field, not just its visibility. Also shows that a "happy path" test can verify post-submission state (fields cleared), not just the success message.

---

## Feature 4: Data Table

### App Specification

| Element | data-testid | Behavior |
|---------|-------------|----------|
| Data table | `data-table` | Displays rows of order data |
| Table row | `table-row` | Individual data row |
| Column header | `col-[name]` | Clickable to sort: col-id, col-customer, col-amount, col-date, col-status |
| Sort indicator | `sort-indicator` | Shows ▲ or ▼ on active sort column |
| Pagination | `pagination` | Page controls below table |
| Page button | `page-[n]` | Individual page buttons: page-1, page-2, etc. |
| Page info | `page-info` | Shows "Page X of Y" |
| Row count | `row-count` | Shows "Showing X–Y of Z results" |
| Status filter | `status-filter` | Dropdown: "All", "Pending", "Shipped", "Delivered" |

### The Decomposition: 6 Tests

| # | Automated Test | What It Proves |
|---|---|---|
| T1 | Table loads with data | Page renders, has rows and headers |
| T2 | Column sort ascending/descending | Sort click changes order and indicator |
| T3 | Pagination navigates pages | Page 2 shows different data, page info updates |
| T4 | Status filter narrows rows | Selecting "Shipped" shows only shipped orders |
| T5 | Row count updates with filter | "Showing X–Y of Z" reflects filter |
| T6 | Empty filter state | Filtering to a status with no results shows empty message |

### Test T2: Column Sort (Selected Example)

**Copilot CARD Prompt:**
```
CONTEXT: Data table at /orders with sortable columns
ACTIONS:
  1. Navigate to /orders
  2. Note the first row's Amount value
  3. Click the Amount column header
  4. Verify sort indicator shows ▲ (ascending)
  5. Verify the first row's Amount is the lowest value
  6. Click Amount header again
  7. Verify sort indicator shows ▼ (descending)
  8. Verify the first row's Amount is the highest value
RULES: Clicking toggles between ascending → descending → ascending
DATA: No specific data — sorting existing rows

Generate a Playwright test. data-testid: col-amount, sort-indicator, table-row
Test name: "clicking column header toggles sort order"
```

**Expected Playwright Code:**
```typescript
test('clicking column header toggles sort order', async ({ page }) => {
  await page.goto('/orders');

  // Click Amount header — ascending
  await page.getByTestId('col-amount').click();
  await expect(page.getByTestId('sort-indicator')).toContainText('▲');

  // Get first and second row amounts
  const rows = page.getByTestId('table-row');
  const firstAmount = await rows.nth(0).locator('[data-testid="cell-amount"]').innerText();
  const secondAmount = await rows.nth(1).locator('[data-testid="cell-amount"]').innerText();

  // First should be <= second (ascending)
  expect(parseFloat(firstAmount.replace('$', '')))
    .toBeLessThanOrEqual(parseFloat(secondAmount.replace('$', '')));

  // Click again — descending
  await page.getByTestId('col-amount').click();
  await expect(page.getByTestId('sort-indicator')).toContainText('▼');

  const descFirst = await rows.nth(0).locator('[data-testid="cell-amount"]').innerText();
  const descSecond = await rows.nth(1).locator('[data-testid="cell-amount"]').innerText();

  expect(parseFloat(descFirst.replace('$', '')))
    .toBeGreaterThanOrEqual(parseFloat(descSecond.replace('$', '')));
});
```

**Learning context:** Introduces text extraction with `innerText()`, parsing (removing $), and comparison assertions. This is the first test where the learner reads data FROM the page and makes logical comparisons. Manual testers do this instantly by scanning the column — automation needs explicit extraction and parsing.

---

## Feature 5: Multi-Step Checkout Wizard

### App Specification

| Step | URL | Elements |
|------|-----|----------|
| Step 1: Shipping | /checkout/shipping | address-input, city-input, state-select, zip-input, next-button, step-indicator |
| Step 2: Payment | /checkout/payment | card-input, expiry-input, cvv-input, back-button, next-button, step-indicator |
| Step 3: Review | /checkout/review | order-summary, shipping-summary, payment-summary, place-order-button, back-button |
| Confirmation | /checkout/confirmation | confirmation-number, confirmation-message |

### The Decomposition: 6 Tests

| # | Automated Test | What It Proves |
|---|---|---|
| W1 | Step 1 loads and accepts shipping info | Shipping form works |
| W2 | Step 2 loads and accepts payment info | Payment form works |
| W3 | Back button preserves data | Navigation doesn't lose entered data |
| W4 | Direct URL to step 3 redirects to step 1 | Can't skip steps |
| W5 | Review page shows summary of all entered data | Data flows through all steps |
| W6 | Place order shows confirmation | Complete flow succeeds |

### Test W3: Back Button Preserves Data (Selected Example)

**Copilot CARD Prompt:**
```
CONTEXT: Multi-step checkout wizard, step 2 (payment) has a back button to step 1 (shipping)
ACTIONS:
  1. Navigate to /checkout/shipping
  2. Fill shipping fields (address, city, state, zip)
  3. Click next to go to step 2
  4. Click back button to return to step 1
  5. Verify all shipping fields still contain the data from step 2
RULES: Back navigation MUST preserve previously entered data
DATA: 
  Address: "123 Main St"
  City: "Springfield"
  State: "IL"
  Zip: "62701"

Generate a Playwright test. data-testid: address-input, city-input, state-select, zip-input, next-button, back-button
Test name: "back button preserves previously entered shipping data"
```

**Expected Playwright Code:**
```typescript
test('back button preserves previously entered shipping data', async ({ page }) => {
  await page.goto('/checkout/shipping');

  // Fill shipping info
  await page.getByTestId('address-input').fill('123 Main St');
  await page.getByTestId('city-input').fill('Springfield');
  await page.getByTestId('state-select').selectOption('IL');
  await page.getByTestId('zip-input').fill('62701');

  // Advance to step 2
  await page.getByTestId('next-button').click();
  await expect(page).toHaveURL(/.*\/checkout\/payment/);

  // Go back
  await page.getByTestId('back-button').click();
  await expect(page).toHaveURL(/.*\/checkout\/shipping/);

  // All fields preserved
  await expect(page.getByTestId('address-input')).toHaveValue('123 Main St');
  await expect(page.getByTestId('city-input')).toHaveValue('Springfield');
  await expect(page.getByTestId('state-select')).toHaveValue('IL');
  await expect(page.getByTestId('zip-input')).toHaveValue('62701');
});
```

**HITL Review Checkpoint:**
- ✅ Verifies URL at EACH step (routing works)
- ✅ Checks ALL four fields, not just one
- ✅ This is the kind of test that catches a real production bug — many SPAs lose form state on back navigation

**Learning context:** This test catches one of the most common SPA bugs: form state loss on navigation. Manual testers always check this ("let me go back and make sure my data is still there"). It's a great example of turning domain instinct into an explicit automated check.

---

### Test W4: Direct URL to Step 3 Redirects to Step 1

**Copilot CARD Prompt:**
```
CONTEXT: Checkout wizard should enforce step order — can't skip to review
ACTIONS: Navigate directly to /checkout/review without completing steps 1–2
RULES: App should redirect to /checkout/shipping (step 1)
DATA: No form data — testing navigation guard

Generate a Playwright test. 
Test name: "direct navigation to review step redirects to shipping"
```

**Expected Playwright Code:**
```typescript
test('direct navigation to review step redirects to shipping', async ({ page }) => {
  // Try to skip ahead
  await page.goto('/checkout/review');

  // Should be redirected to step 1
  await expect(page).toHaveURL(/.*\/checkout\/shipping/);
});
```

**Learning context:** The shortest test in the entire suite — two lines. It tests a SECURITY behavior (can't skip steps). Manual testers rarely think to test this because they always follow the flow. But a real user (or attacker) can type any URL. This is a great example of "what would a user do that I wouldn't think of?"

---

## Test Coverage Summary

### Complete Test Inventory

| Feature | Tests | Focus |
|---------|-------|-------|
| Login | L1–L7 (7 tests) | Form validation, auth, lockout, redirect |
| Search | S1–S7 (7 tests) | Search, filter, empty state, keyboard |
| Contact Form | F1–F7 (7 tests) | Required/optional fields, format validation, success |
| Data Table | T1–T6 (6 tests) | Sort, paginate, filter, empty state |
| Checkout Wizard | W1–W6 (6 tests) | Multi-step, back nav, data preservation, guards |
| **Total** | **33 tests** | |

### Assertion Pattern Summary (For Learner Reference)

| Pattern | When to Use | Example |
|---------|-------------|---------|
| `toBeVisible()` | Element exists and is shown | Page load checks, error messages appearing |
| `not.toBeVisible()` | Element should NOT be shown | Optional field has no error |
| `toContainText('...')` | Text includes a substring | Error messages, success messages |
| `toHaveValue('...')` | Input field has specific value | Data preservation after navigation |
| `toHaveURL(/regex/)` | Page URL matches pattern | Redirect verification |
| `toBeDisabled()` | Button/input is disabled | Login button before fields filled |
| `toHaveCount(n)` | Exactly N elements match | Result cards, table rows |
| `toBeLessThanOrEqual()` | Numeric comparison | Sort order verification |

### Manual → Automated Mapping Cheat Sheet

| Manual Testing Habit | Automated Testing Equivalent |
|---|---|
| "I click through the whole flow to check it works" | Break into independent tests per behavior |
| "I eyeball the page to see if it looks right" | `toBeVisible()` on specific data-testid elements |
| "I read the error message" | `toContainText('exact expected text')` |
| "I check the URL bar" | `toHaveURL(/regex/)` |
| "I notice the button is grayed out" | `toBeDisabled()` |
| "I count the search results" | `toHaveCount(n)` or `.count()` + comparison |
| "I go back and check my data is still there" | `toHaveValue('...')` on each field |
| "I try typing the URL directly" | `page.goto()` + `toHaveURL()` for redirect |
| "I press Enter instead of clicking the button" | `.press('Enter')` |
| "I try entering garbage to see what breaks" | Tests with intentionally invalid data |
