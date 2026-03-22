# ADR-01: Standalone Zero-Installation Architecture for Training Platform

## Status
Accepted

## Context
In traditional automation training, learners (especially manual testers or developers new to the stack) face a high "Time to First Test" (TTFT). They are typically required to install Node.js, configure environment variables, clone repositories, run `npm install`, and spin up local development servers just to view the training material and practice application.

This setup process creates an unnecessary barrier to entry, causing friction and taking focus away from the actual learning objective: writing Playwright tests.

## Decision
We will refactor both the `training-app` (curriculum) and `practice-app` (target under test) to operate as 100% client-side, zero-installation applications. These apps will not require a backend database or a running local web server (`localhost`), functioning entirely from the local filesystem (`file://` protocol).

To achieve this, we will implement the following technical shifts:

1. **Hash Routing:** Replace `BrowserRouter` with `HashRouter` (from `react-router-dom`) across all apps. This ensures the browser can handle client-side routing directly from a local file path without needing a server to resolve routes.
2. **Single-File Artifacts:** Utilize `vite-plugin-singlefile` in the Vite build pipeline to inline all JavaScript, CSS, and base64-encoded images into a single monolithic `index.html` file per application.
3. **Browser State Persistence:** Replace all backend database dependencies with browser-native storage. The `training-app` will persist user progress and quiz scores via `localStorage` (e.g., via Zustand persist middleware). The `practice-app` will simulate a mock database using `sessionStorage` or `localStorage` to maintain state across page navigations.
4. **Relative Asset Paths:** Configure Vite to build with a relative base path (`base: './'`) to prevent absolute path resolution issues on local hard drives.
5. **Playwright Local File Execution:** Configure `playwright.config.ts` to execute tests directly against the compiled local `.html` files rather than depending on a `webServer` block.

## Consequences

### Positive
* **Zero Onboarding Friction:** Learners can start their training by simply opening an HTML file in their browser.
* **High Portability:** The platform can be distributed effortlessly via a ZIP file, USB drive, or hosted for free on static sites (GitHub Pages, S3).
* **Zero Infrastructure Overhead:** DevOps and maintainers do not need to manage servers, databases, or API uptime for the training environments.
* **Instant Feedback Loop:** Executing Playwright against a local file is exceptionally fast and reliable.

### Negative
* **Mocking Complexity:** We must build and maintain robust mock layers to simulate real-world API latency, errors, and responses since there is no real backend.
* **State Volatility:** If a user clears their browser cache or switches browsers, their training progress will be lost.
* **File Size Limits:** Inlining all assets into a single HTML file can lead to large file sizes. We will need to monitor asset weight (especially images/fonts) to ensure the file remains performant and easy to distribute.