# First Playwright Tests

## Purpose

This course is a standalone beginner onramp for existing QA professionals who need to learn how to create and execute Playwright tests with VS Code and GitHub Copilot. It is intentionally narrower than the existing live beginner course. The goal is practical fluency with the first working automation loop:

1. Run a test
2. Read what it proves
3. Record a flow
4. Refine the draft
5. Execute a small passing pack

## Delivery Model

The course is designed for two lanes of use:

- `Browse mode`: open the training app and practice app as standalone HTML artifacts with no setup required.
- `Build mode`: open `practice-app/` in VS Code, run Playwright locally, and complete the lesson labs in real files.

The training app teaches the workflow. The practice app and `e2e/` lab files provide the implementation surface.

## Repo Placement

- Course source: `training-app/src/data/courses/first-playwright-tests/`
- Standalone export: `training-app/src/data/courses/first-playwright-tests/course.ts`
- Lab workspace: `practice-app/e2e/first-playwright-tests/`
- Runnable reference answers: `practice-app/e2e/first-playwright-tests-solutions/`
- Mirrored course assets: `test-cases/first-playwright-tests/`

This course is additive only. It is exported for use, but it is not inserted into the live `courses` array.

## Course Shape

| Lesson | Focus | Lab Output |
| --- | --- | --- |
| 01 | See a passing test do real work | No hands-on lab |
| 02 | Set up the workbench | Run a starter smoke check |
| 03 | Run tests from VS Code and terminal | Run one spec in multiple modes |
| 04 | Read a test like evidence | Add missing proof to a login test |
| 05 | Find the right element | Replace fragile locators |
| 06 | Ask Copilot for a useful draft | Turn product-search criteria into a passing test |
| 07 | Record a login flow in VS Code | Save recorded code into the lesson file |
| 08 | Tighten and rerun the recording | Refine the recorded login spec |
| 09 | Build your first test pack | Finish two independent passing tests |

## Shared Interfaces

The course reuses the current curriculum model and adds one optional payload:

- `ExerciseLab`
  - `workspaceRoot`
  - `targetFile`
  - `runCommand`
  - `successCriteria`

The lesson UI renders this as a `Try It In VS Code` card only when the exercise includes lab metadata. Existing lessons are unchanged.

## Standalone Packaging

The standalone bundle keeps both apps client-side and portable:

- Vite builds use `base: "./"`
- `vite-plugin-singlefile` inlines the app output into a portable HTML artifact
- the training app resolves practice links through `practiceUrl(route)` so local dev and packaged links use the same authored lesson content
- the root packager script writes the final distribution to `standalone-dist/`

## Lab Design Notes

- Starter specs live in `practice-app/e2e/first-playwright-tests/`
- The starter files are safe to keep in the repo because unfinished labs are marked with `test.skip`
- Solution specs live beside them in `practice-app/e2e/first-playwright-tests-solutions/`
- `test-cases/first-playwright-tests/` mirrors the same lesson sequence for instructional review and reference

## Non-Goals

- No changes to the existing live beginner course lineup
- No new curriculum section types
- No new routing model in the training app
- No in-browser code editor or execution sandbox
- No page objects, API testing, CI, or team workflow material in this course
