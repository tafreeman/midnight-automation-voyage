# Playwright + GitHub Copilot: Training Package

Everything your team needs to learn automated testing with Playwright and GitHub Copilot — from zero to contributing real test coverage.

## What's in this repo

```
midnight-automation-voyage/
├── README.md                          ← You are here
├── playwright-copilot-learning.html   ← Self-contained learning resource
│
├── training-app/              ← Interactive learning app (15 lessons)
│   ├── src/
│   │   ├── data/
│   │   │   ├── types.ts       ← Shared type definitions
│   │   │   ├── index.ts       ← Lesson registry (ordering)
│   │   │   └── modules/       ← One file per lesson
│   │   │       ├── 01-orientation.ts
│   │   │       ├── 02-mindset-shifts.ts
│   │   │       └── ... (15 modules)
│   │   └── components/        ← Sidebar, LessonView, etc.
│   └── package.json
│
├── practice-app/              ← Test target app (5 features to test against)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx       ← Login with validation + lockout
│   │   │   ├── ProductsPage.tsx    ← Search + filter + results
│   │   │   ├── ContactPage.tsx     ← Form with required/optional fields
│   │   │   ├── OrdersPage.tsx      ← Data table with sort/pagination
│   │   │   ├── ShippingPage.tsx    ← Checkout step 1
│   │   │   ├── PaymentPage.tsx     ← Checkout step 2
│   │   │   ├── ReviewPage.tsx      ← Checkout step 3
│   │   │   └── ConfirmationPage.tsx
│   │   └── data.ts            ← Mock data (users, products, orders)
│   └── package.json
│
└── test-cases/                ← Test mapping & reference answers
    ├── test-case-mapping.md   ← Complete manual→automated test mapping
    └── examples/              ← Reference Playwright tests (33 total)
        ├── login.spec.ts      ← 7 tests
        ├── search.spec.ts     ← 7 tests
        ├── contact.spec.ts    ← 7 tests
        ├── orders.spec.ts     ← 6 tests
        └── checkout.spec.ts   ← 6 tests
```

## Quick Start

### 1. Start the practice app (the thing you'll test against)

```bash
cd practice-app
pnpm install
pnpm dev
# App runs at http://localhost:5173
```

### 2. Open the training app (to learn from)

```bash
cd training-app
pnpm install
pnpm dev
# Opens at http://localhost:5174
```

### 3. Set up Playwright (in the practice-app folder)

```bash
cd practice-app
pnpm create playwright
# Select: TypeScript, e2e/ folder, Yes to GitHub Actions, Yes to browsers
```

### 4. Start writing tests

Follow the training app lessons in order. When you reach the exercises, write your tests against the practice app and compare them to the reference answers in `test-cases/examples/`.

## For Team Leads

### How to use this in onboarding

| Day | Activity | Materials |
|-----|----------|-----------|
| Mon | Environment setup + run example tests | Training lessons 1–4, practice-app setup |
| Tue | Record 3 flows with codegen | Training lesson 6, practice-app login/search/contact |
| Wed | Refine recordings with Copilot prompts | Training lessons 5–6 + 10, prompt templates |
| Thu | Write tests from scratch, submit MR | Training lessons 7–8, compare against examples/ |
| Fri | Peer review using HITL checklist | Training lesson 12, review a teammate's tests |

### How to evaluate learner tests

The reference answers in `test-cases/examples/` are the benchmark. When reviewing a learner's tests, check:

1. **Test count** — Do they have the right number of discrete tests per feature?
2. **Independence** — Does each test navigate to the page on its own?
3. **Assertions** — Does every test have `expect()` calls that map to acceptance criteria?
4. **Selectors** — 100% `data-testid`, no CSS selectors?
5. **No waits** — Zero `waitForTimeout` calls?
6. **Test names** — Do names describe the user scenario, not "test 1", "test 2"?

### Adding new lessons

1. Create a file in `training-app/src/data/modules/NN-your-lesson.ts`
2. Export `const lesson: Lesson = { ... }` matching the `Lesson` interface in `types.ts`
3. Import and add to the array in `training-app/src/data/index.ts`
4. The sidebar order follows the array order

## Practice App Features

All elements use `data-testid` attributes matching the test-case-mapping.md spec.

| Feature | URL | Tests | Key Patterns Taught |
|---------|-----|-------|---------------------|
| Login | `/login` | L1–L7 | Form validation, auth errors, lockout, redirect |
| Dashboard | `/dashboard` | — | Post-login landing (auth-gated) |
| Products | `/products` | S1–S7 | Search, filter, empty state, keyboard events |
| Contact | `/contact` | F1–F7 | Required/optional fields, format validation, success |
| Orders | `/orders` | T1–T6 | Sort, pagination, status filter, data extraction |
| Checkout | `/checkout/*` | W1–W6 | Multi-step wizard, back nav, data preservation, guards |

### Test credentials

| Email | Password | Purpose |
|-------|----------|---------|
| user@test.com | Password123! | Happy path login |
| locktest@test.com | LockPass123! | Lockout testing (use wrong password) |
| admin@test.com | AdminPass1! | Admin user (future use) |
