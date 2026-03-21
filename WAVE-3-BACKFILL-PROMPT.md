# Wave 3: Assessment & Content Backfill — Completion Prompt

## Persona

You are a **senior QE curriculum engineer** building a Playwright + GitHub Copilot training platform for enterprise teams. You specialize in instructional design for technical audiences, following Bloom's taxonomy (apply > understand), the Kirkpatrick evaluation model (Level 2: learning verification), and the CARD prompting formula (Context / Actions / Rules / Data) that this platform invented. You write production-quality TypeScript module files that match existing conventions exactly.

## Context

The **Midnight Automation Voyage** training platform teaches manual testers and developers to write Playwright tests using GitHub Copilot. It has 15 training modules in `training-app/src/data/modules/`, a practice app with 5 features (Login, Products, Contact, Orders, Checkout), and 33 reference Playwright test specs.

### What's Already Done (Waves 1 & 2 — Complete)

All platform UX and infrastructure work is finished:
- localStorage progress persistence (`mav-progress-v1` key)
- Hash-based URL routing (`#lesson/{n}`)
- Keyboard navigation (ArrowLeft/ArrowRight)
- Collapsed sidebar rail (40px with hamburger icon, was `return null`)
- `goNext()` decoupled from `markComplete()`
- Quiz-gated completion (`canComplete = !lesson.quiz || quizAttempted`)
- Quiz retry on incorrect answer ("Try Again" button resets state)
- Role selector with filtered learning paths (all/developer/non-coder)
- Responsive sidebar (auto-close on mobile, resize listener)
- `aria-live="polite"` on progress region
- Reading progress bar in LessonView header
- "Try It Now" practice link callouts (used in 5 modules)
- Font sizes floored at 12px minimum
- Monospace removed from body text (only on headings)

### What's Partially Done (Wave 3 — This Prompt)

| Field | Current | Target | Gap |
|-------|---------|--------|-----|
| Quiz coverage | 15/15 (100%) | 100% | DONE |
| Exercise coverage | 6/15 (40%) | 80%+ (12/15) | Need 6 more exercises |
| Prompt template coverage | 7/15 (47%) | 55%+ (9/15) | Need 2 more prompt template sets |
| Practice links | 5/15 (33%) | 60%+ (9/15) | Need 4 more practice links |

**Modules WITH exercises:** 05, 06, 07, 08, 09, 10
**Modules WITHOUT exercises:** 01, 02, 03, 04, 11, 12, 13, 14, 15

**Modules WITH prompt templates:** 06, 08, 09, 10, 11, 12, 14
**Modules WITHOUT prompt templates:** 01, 02, 03, 04, 05, 07, 13, 15

**Modules WITH practice links:** 07, 08, 09, 10, 14
**Modules WITHOUT practice links:** 01, 02, 03, 04, 05, 06, 11, 12, 13, 15

## Problem

The platform's assessment layer is structurally incomplete. While quiz coverage reached 100%, exercises exist in only 40% of modules. For a platform that teaches test *writing*, having 60% of modules without a writing exercise is a critical gap. Prompt templates — the platform's differentiator as an AI-assisted training tool — are missing from 8 modules. This blocks the platform from reaching TMMi Level 3 (Defined) and undermines enterprise credibility.

Specifically:
1. **9 modules lack exercises** — Modules 01-04 (Foundation) and 11-15 (AI Skills, Governance, Practical, Intermediate) have no hands-on practice component
2. **8 modules lack prompt templates** — The CARD formula is taught in Module 06 but not operationalized across the curriculum
3. **10 modules lack practice links** — Learners have no guided path from training content to the practice app
4. Enterprise stakeholders cannot verify training effectiveness without applied assessments (Kirkpatrick Level 2)

## Solution

### Task 1: Add exercises to 6 priority modules (target: 12/15 = 80%)

Add exercises to these modules, prioritized by learning impact. Skip Modules 01-03 (pure orientation/foundational — exercises would be forced busywork). Add to:

**Module 04 (`04-why-playwright-copilot.ts`):**
- Exercise: Compare Playwright locator strategies — given a DOM snippet, write the `data-testid`, `getByRole`, and CSS selector versions. Identify which is most resilient.
- Starter: DOM HTML + empty locator variables
- Solution: Three locator approaches with comments explaining trade-offs

**Module 11 (`11-prompt-templates.ts`):**
- Exercise: Write a CARD-formatted prompt for generating a login validation test from a manual test case description
- Starter: Raw manual test case text + empty CARD template
- Solution: Completed CARD prompt with Context, Actions, Rules, Data sections filled

**Module 12 (`12-reading-results.ts`):**
- Exercise: Given a Playwright HTML report snippet (text description of failures), identify the root cause and write the fix
- Starter: Error message + failing test code
- Solution: Fixed test code with comment explaining the diagnosis

**Module 13 (`13-hitl-checklist.ts`):**
- Exercise: Review an AI-generated test against the 10-point HITL checklist — mark pass/fail for each item and fix the violations
- Starter: Intentionally flawed AI-generated test (hardcoded waits, missing assertions, brittle selectors)
- Solution: Corrected test with all HITL violations resolved

**Module 14 (`14-non-coder-guide.ts`):**
- Exercise: Use the Record & Refine workflow — given a codegen recording output, apply the CARD refinement prompt to clean it up
- Starter: Raw codegen output with auto-generated selectors
- Solution: Refined test with data-testid selectors, descriptive names, and proper assertions

**Module 15 (`15-cicd-reference.ts`):**
- Exercise: Write a basic CI pipeline configuration that runs Playwright tests with artifact upload on failure
- Starter: Empty YAML with commented structure hints
- Solution: Complete GitLab CI YAML with test stage, artifacts, and retry config

### Task 2: Add prompt templates to 2 priority modules (target: 9/15 = 60%)

**Module 07 (`07-record-refine-workflow.ts`):**
- Template 1: "Refine this codegen recording into a production-ready test" — Context: recorded test code. Actions: rename, add assertions, replace selectors. Rules: use data-testid, one behavior per test. Data: page routes and test IDs.
- Template 2: "Convert this manual test step into a Playwright assertion" — for non-coders translating manual steps.

**Module 13 (`13-hitl-checklist.ts`):**
- Template 1: "Review this AI-generated test against our HITL checklist" — Context: generated test code. Actions: check each of 10 items. Rules: HITL criteria. Data: checklist items.
- Template 2: "Fix the violations found in this review" — Context: test + violation list. Actions: rewrite failing items. Rules: preserve test intent, fix only violations.

### Task 3: Add practice links to 4 priority modules (target: 9/15 = 60%)

**Module 04:** Link to practice app login page — "Explore the practice app to see Playwright test targets in action"
**Module 06:** Link to practice app products page — "Try writing CARD prompts against the search and filter features"
**Module 12:** Link to practice app orders page — "Run the reference tests and read the HTML report output"
**Module 15:** Link to practice app root — "Use the full practice app as your CI pipeline test target"

### Implementation Constraints

1. **Match existing conventions exactly:**
   - Exercise interface: `{ title, description, starterCode, solutionCode, hints: string[] }`
   - PromptTemplate interface: `{ label, prompt, context }`
   - PracticeLink interface: `{ url, label, description }`
2. **Exercises should be 5-15 lines of meaningful code** — not boilerplate
3. **CARD prompt templates must follow the Context/Actions/Rules/Data structure** from Module 06
4. **Practice links point to `http://localhost:5173/{route}`** (practice app port)
5. **Read each module file before editing** to understand the existing sections, quiz, and content structure
6. **Do not modify existing content** — only add the new `exercise`, `promptTemplates`, and `practiceLink` fields
7. **Every exercise needs 2-3 progressive hints** that guide without revealing the answer
8. **Starter code should compile/parse** — it's incomplete, not broken

### Verification

After completing all changes:
- Run `cd training-app && pnpm build` to verify no TypeScript errors
- Count: exercises should appear in 12/15 modules (80%)
- Count: promptTemplates should appear in 9/15 modules (60%)
- Count: practiceLinks should appear in 9/15 modules (60%)
- Every new exercise should render correctly in the DiffCodeBlock component (starter vs solution diff)
