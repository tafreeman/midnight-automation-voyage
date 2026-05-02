# Subproject List

**Generated:** 2026-04-08
**Method:** Identified by independent build files, distinct language stacks, separate test suites, and coherent domain folders.

---

## Confirmed Subprojects

### 1. `training-app/`

- **Justification:** Independent `package.json` (name: `playwright-learning-app`), own TypeScript config (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`), own Vite config, ESLint config, Tailwind config. React + TypeScript + Vite stack. Registered as pnpm workspace member.
- **Build:** `pnpm build` (tsc + vite build)
- **Lint:** `pnpm lint` (eslint)
- **Dev server:** Port 5174
- **Purpose:** Interactive learning platform — 27+ modules across 4 courses teaching Playwright + Copilot.

### 2. `practice-app/`

- **Justification:** Independent `package.json` (name: `practice-app`), own TypeScript, Vite, ESLint, Tailwind, and Playwright configs. Registered as pnpm workspace member. Has its own E2E test suite (`e2e/`).
- **Build:** `pnpm build` (tsc + vite build)
- **Lint:** `pnpm lint` (eslint)
- **Test:** `npx playwright test` (17+ specs)
- **Dev server:** Port 5173
- **Purpose:** Test target app with 9 pages and intentional bugs for learners to write Playwright tests against.

### 3. `packages/shared-config/`

- **Justification:** Independent `package.json` (name: `@mav/shared-config`), exports shared TypeScript, PostCSS, and Tailwind configurations consumed by both apps. Registered as pnpm workspace member via `packages/*` glob.
- **Build:** None (config-only package)
- **Purpose:** Centralised build configuration shared across training-app and practice-app.

### 4. `test-cases/`

- **Justification:** Contains reference Playwright specs (`examples/`, `first-playwright-tests/`) with its own `README.md` and `test-case-mapping.md`. Not a buildable package but is a coherent domain folder with distinct purpose.
- **Build:** None (reference material, not independently runnable without practice-app)
- **Purpose:** Reference test specs and lesson starter/solution files that learners compare their work against.

---

## Excluded (with justification)

### `docs/`

- **Reason:** Documentation directory, not an independent subproject. Contains course plans, audit reports, and reference material. No build file, no independent purpose beyond supporting the other subprojects. Treated as repo-level documentation.

### `scripts/`

- **Reason:** Utility scripts (`package-standalone.mjs`, `prompt-runner.py`, `audit-course-content.md`). No `package.json` or build file. Ad-hoc tooling, not a cohesive subproject.

### `tools/`

- **Reason:** Single utility (`tts-server.py`). No build file or package definition. Too small for subproject status.

### `training-app-design/`

- **Reason:** Design system documentation and Copilot skill definition. Contains `.claude/` config and reference docs but no build system. It is an evaluation workspace, not a deployable or testable subproject.

### `training-app-design-workspace/`

- **Reason:** Evaluation artifacts from design iterations. Historical output, not active code.

### `audio/`, `output/`, `hooks/`

- **Reason:** Supporting directories (audio assets, build output, git hooks). No independent purpose as subprojects.

### `.claude/`

- **Reason:** Agent configuration, not a subproject. Documented separately in Agent-Config inventory.

### `.playwright-cli/`

- **Reason:** CLI utility directory. Not a standalone subproject.
