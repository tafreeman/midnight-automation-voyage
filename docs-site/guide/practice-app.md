# Practice App

The practice app is a purpose-built test target with 9 pages, 12 routes, and intentional bugs. Every exercise in the training platform targets this application.

## Pages Overview

| Page | URL | What You'll Test |
|------|-----|-----------------|
| **Login** | `/login` | Form validation, auth errors, account lockout after 5 failures |
| **Dashboard** | `/dashboard` | Post-login landing, heading verification, visual regression |
| **Products** | `/products` | Search, category filtering, result counts, empty states |
| **Contact** | `/contact` | Required/optional fields, format validation, success messages |
| **Orders** | `/orders` | Data tables, sorting, filtering, pagination |
| **Checkout** | `/checkout/*` | Multi-step wizard (4 steps), back navigation, data preservation |
| **Settings** | `/settings` | Tabbed interface, profile updates, notification preferences |
| **Admin** | `/admin` | User management, search, bulk actions (requires admin role) |
| **Activity** | `/activity` | Filterable feed, detail views, async content loading |

## Intentional Bugs

The practice app contains deliberate bugs for learners to discover through testing:

::: danger Not Real Bugs
These are **curriculum features**, not defects. Do not fix them — they are the test targets.
:::

### Known Issues by Page

- **Settings** — 3 intentional accessibility violations (WCAG contrast, missing labels, keyboard traps)
- **Admin** — Stale state after bulk operations; search doesn't clear on navigation
- **Activity** — Mock modes that simulate error states, timeouts, and stale data
- **Toast notifications** — 3 race conditions in the ToastContext provider

### Testing Patterns

Each page exercises specific Playwright patterns:

| Pattern | Pages | Skills Practiced |
|---------|-------|-----------------|
| Form interactions | Login, Contact, Settings | `fill()`, `click()`, `toHaveValue()` |
| Navigation & routing | Checkout (4 steps) | `goto()`, `waitForURL()`, `toHaveURL()` |
| Table operations | Orders, Admin | `locator().nth()`, sorting assertions |
| Search & filter | Products, Activity | Input events, result count assertions |
| Authentication | Login → Dashboard | Auth state, role-based access |
| Multi-step workflows | Checkout wizard | Context preservation, back/forward nav |

## Architecture

```text
practice-app/
├── src/
│   ├── pages/           ← 9 page components (intentionally buggy)
│   ├── contexts/        ← 3 context providers
│   │   ├── AuthContext   → Role-based auth (admin/editor/viewer)
│   │   ├── CheckoutContext → Multi-step checkout state
│   │   └── ToastContext  → Notifications with race conditions
│   ├── components/      ← Shared UI components
│   └── App.tsx          ← Router with 12 routes
├── e2e/                 ← Placeholder for learner tests
├── playwright.config.ts ← Pre-configured for the practice app
└── public/              ← Static assets
```

## data-testid Attributes

Every interactive element has a `data-testid` attribute for stable selectors:

```typescript
// Example: targeting the login form
await page.getByTestId('email-input').fill('user@test.com');
await page.getByTestId('password-input').fill('Password123!');
await page.getByTestId('login-button').click();
```

This convention teaches learners to use stable selectors from the start, rather than relying on CSS classes or text content that may change.

## Running Locally

```bash
cd practice-app
pnpm install
pnpm dev
# → http://localhost:5173
```

The app runs on port 5173 by default. The training app's practice links point to this URL.
