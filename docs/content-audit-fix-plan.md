# Content Audit Fix Plan

**Created:** 2026-03-24
**Source:** `docs/content-audit-report.md`

This plan covers fixes for all 30 new-course findings plus 3 legacy critical items.
Items marked [DONE] are being handled by parallel subagents.

---

## Batch 1: Immediate Fixes (subagents running)

### [DONE] S1: Replace `npx` with `pnpm exec` across all new course modules
- **Scope:** 20 occurrences across 8 files in `training-app/src/data/courses/first-playwright-tests/modules/`
- **Fix:** Global find-replace `npx playwright` → `pnpm exec playwright`
- **Verification:** Grep for `npx` should return 0 hits

### [VERIFYING] Regex escaping `/#\\/dashboard$/`
- **Status:** Subagent investigating whether this is a real bug or false positive
- The `\\` inside a JS template literal produces `\` in the output string, meaning the rendered code shows `/#\/dashboard$/` which IS a valid regex
- If confirmed as false positive, close the finding; if real bug, fix

### [DONE] S5: Fix duplicate `id: 11` in legacy modules
- **Scope:** `14-collaborative-test-authoring.ts` — change its `id` to a unique value
- **Fix:** Assign next available ID based on gap analysis of existing modules

---

## Batch 2: Exercise Quality Fixes (medium severity)

### Fix 1: Module 02 — identical starter/solution code
**File:** `02-set-up-the-workbench.ts`
**Current:** `starterCode` and `solutionCode` are byte-for-byte identical
**Fix:** This is a run-only exercise (success = "run this and see green"). Remove `solutionCode` field entirely and add a comment explaining the exercise is execution-only.
```diff
- solutionCode: `import { test, expect } from "@playwright/test";
- ...identical code...
- });`,
```
**Why not strip starter to skeleton?** The exercise's purpose is verifying setup, not teaching test authoring. Giving them a complete spec to run is intentional.

### Fix 2: Module 03 — identical starter/solution + reused spec from module 02
**File:** `03-run-tests-from-vs-code-and-terminal.ts`
**Current:** Same spec from module 02, starter = solution
**Fix:** Same as Fix 1 — remove `solutionCode`. The exercise title is "Run the Same Test Three Ways" which is clearly an execution exercise.

### Fix 3: Module 03 — subjective success criterion
**File:** `03-run-tests-from-vs-code-and-terminal.ts` (lab success criteria)
**Current:** Criterion 2: `"You can describe what headed mode showed that the terminal alone did not."`
**Fix:** Replace with: `"Headed mode opened a visible browser window and you observed the form fields being filled before the assertion ran."`

### Fix 4: Module 04 — hardcoded "Welcome, Test User"
**File:** `04-read-a-test-like-evidence.ts` (exercise hints and code block)
**Status:** VERIFIED CORRECT — `data.ts` has `name: "Test User"` for `user@test.com`
**Fix:** Add a hint to the exercise: `"The editor account's display name is 'Test User', which appears in the dashboard heading after login."`
This documents the expected value without changing the assertion itself.

### Fix 5: Module 06 — hardcoded "6 results found"
**File:** `06-ask-copilot-for-a-useful-draft.ts` (exercise solution)
**Status:** VERIFIED CORRECT — `data.ts` has exactly 6 products containing "Widget"
**Fix:** Add to exercise description: `"The practice app's seed data contains six products matching 'Widget'. Your assertions should reflect that count."` Also add a hint: `"Verify the expected count by searching for 'Widget' in the browser before you write the assertion."`

### Fix 6: Module 07 — `.click()` noise not flagged in solution
**File:** `07-record-a-login-flow-in-vs-code.ts` (exercise solution, lines 97-100)
**Current:** Solution has `.click()` before each `.fill()` (recorder noise) without comment
**Fix:** Add inline comments to the solution:
```typescript
  await page.getByLabel("Email").click(); // recorder noise — cleaned in lesson 08
  await page.getByLabel("Email").fill(credentials.editor.email);
  await page.getByLabel("Password").click(); // recorder noise — cleaned in lesson 08
  await page.getByLabel("Password").fill(credentials.editor.password);
```

### Fix 7: Module 07→08 handoff — starter code mismatch
**File:** `08-tighten-and-rerun-the-recording.ts` (exercise starter, lines 86-90)
**Current:** Starter code already drops `.click()` calls that were in module 07's solution
**Fix:** Add the `.click()` calls back into module 08's starter so the files chain properly:
```typescript
test.skip("recorded login draft for editor account", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByLabel("Email").click();
  await page.getByLabel("Email").fill(credentials.editor.email);
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill(credentials.editor.password);
  await page.getByRole("button", { name: "Log In" }).click();

  // TODO: add route proof
  // TODO: add visible dashboard proof
});
```
This way module 07 solution → module 08 starter are consistent.

### Fix 8: Module 08 — hardcoded "Welcome, Test User" (same as Fix 4)
**Fix:** Same approach as module 04 — add clarifying hint. Already covers module 08 implicitly since it's the same login flow.

### Fix 9: Module 08 — duplicate prompt (section code block + promptTemplate)
**File:** `08-tighten-and-rerun-the-recording.ts`
**Current:** Section "A Practical Refinement Prompt" (code block) and `promptTemplates[0]` are near-duplicate paraphrases
**Fix:** Remove the code block section. Replace with a short text section that says: "Use the Refine a Recorder Draft template from the sidebar to ask Copilot for a cleanup pass." This keeps the concept in the lesson flow while relying on the promptTemplate for the actual prompt.

### Fix 10: Module 09 — locator strategy silently switches
**File:** `09-build-your-first-test-pack.ts` (solution code, lines 89-91)
**Current:** Login test uses `getByTestId("email-input")` etc., while modules 07-08 used `getByLabel("Email")`
**Fix:** Change module 09's login test solution to use the same locators as 07-08:
```typescript
  await page.getByLabel("Email").fill(credentials.editor.email);
  await page.getByLabel("Password").fill(credentials.editor.password);
  await page.getByRole("button", { name: "Log In" }).click();
```
This maintains locator consistency. The capstone should reuse proven patterns, not silently introduce new ones.

### Fix 11: Module 09 — hardcoded "6 results found" (same as Fix 5)
**Fix:** Same documentation approach as module 06.

---

## Batch 3: Content & Tone Polish (low severity)

### Fix 12: Module 01 — filler sentence in "The Course Loop"
**File:** `01-see-a-test-do-real-work.ts` (callout, line 57)
**Current:** `"...then run it again. You are never writing code in a vacuum."`
**Fix:** Remove last sentence → `"...then run it again."`

### Fix 13: Module 02 — anxiety-projecting narration
**File:** `02-set-up-the-workbench.ts` (narration step 3, line 152)
**Current:** `"...You do not need to keep tinkering with configuration before you start learning the workflow."`
**Fix:** Replace with: `"Once the smoke check passes, setup is complete. Move straight to the next lesson."`

### Fix 14: Module 03 — filler narration opener
**File:** `03-run-tests-from-vs-code-and-terminal.ts` (narration intro, line 113-114)
**Current:** `"You do not need a separate testing philosophy for every Playwright command. This lesson is about seeing the same spec through three different windows."`
**Fix:** Replace with: `"This lesson shows the same spec through three different windows."`

### Fix 15: Module 04 — thin "Arrange, Act, Assert" section
**File:** `04-read-a-test-like-evidence.ts` (section at line 26-29)
**Current:** Two sentences as a standalone section before the code block
**Decision:** KEEP AS-IS. The section provides a conceptual frame that the code block illustrates. Merging would lose the distinct heading in the lesson navigation. Low-impact finding.

### Fix 16: Module 05 — narration echoes section prose
**Decision:** KEEP AS-IS. The narration and section serve different modalities (audio vs. text). Minor redundancy is acceptable for accessibility.

### Fix 17: Module 06 — prose + table duplication for PAGE
**File:** `06-ask-copilot-for-a-useful-draft.ts` (section at lines 26-28)
**Current:** Text explains PAGE in prose, then table re-lists the same 4 parts
**Fix:** Trim the text section to one sentence: `"This course uses a four-part prompt shape called PAGE. The table below shows what goes in each part."`

### Fix 18: Module 06 — vague narration callback
**File:** `06-ask-copilot-for-a-useful-draft.ts` (narration step 3, line 179)
**Current:** `"When the draft comes back, read it like evidence."`
**Fix:** Replace with: `"When the draft comes back, check three things: are the selectors real test IDs from the page, does the assertion match the criteria, and is there an unnecessary wait?"`

### Fix 19: Module 07 — mixed bash/prose code block
**File:** `07-record-a-login-flow-in-vs-code.ts` (section at lines 34-41)
**Current:** One code block mixes a bash command with prose VS Code instructions
**Fix:** Split into two sections:
1. Code block (bash): just the `pnpm exec playwright codegen` command
2. Ordered list (text): the three VS Code steps

### Fix 20: Module 09 — "all-day script" phrasing
**File:** `09-build-your-first-test-pack.ts` (section at line 28)
**Current:** `"...than a single all-day script."`
**Fix:** Replace with: `"...than a single monolithic script."`

### Fix 21: Module 09 — narration overstates readiness
**File:** `09-build-your-first-test-pack.ts` (narration intro, line 144)
**Current:** `"This is the handoff point from training to real contribution."`
**Fix:** Replace with: `"This is the closing lesson of the course. You are writing two small tests that read clearly and pass together."`

---

## Batch 4: Structural Cleanup (S2 — title/subtitle duplication)

### Fix 22: All 9 modules — redundant lesson-level fields
**Assessment:** `createSingleLessonModule()` in `shared.ts` does NOT copy module-level fields to the lesson. The lesson `title`, `subtitle`, and `estimatedMinutes` are consumed by lesson-level renderers that don't have access to the parent module's fields.
**Decision:** KEEP AS-IS. The duplication is structurally required by the current type system. If the factory were enhanced to propagate these fields, the lesson-level copies could be removed, but that's a schema refactor, not a content fix.

---

## Implementation Order

1. **Wait for subagent results** (Batch 1) — ~2 min
2. **Batch 2 exercises** (Fixes 1-11) — highest impact, 30 min
3. **Batch 3 polish** (Fixes 12-21) — lower risk, 20 min
4. **Batch 4 assessment** — no changes needed
5. **Update audit report** — mark completed items

---

## Out of Scope (legacy modules)

These are documented in the audit report but not actioned in this plan:
- 6 legacy modules needing full audit (overlap with new course)
- 7 legacy modules needing minor cleanup
- 2 broken practice app routes (`/assistant`, `/ui-lab`)
- 3 missing narrationScripts
