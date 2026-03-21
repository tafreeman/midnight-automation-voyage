# Training App Maturity Assessment

Based on thorough exploration of all three components (training-app, practice-app, test-cases).

---

## Current State: Solid Content, Weak Platform

The **content is strong** — 15 well-written modules, dual-audience design (Developers vs Non-Coders), real Copilot prompts, and 33 example Playwright specs. But the **platform undercuts the learning experience** in several key ways.

---

## Critical Training Gaps

### 1. No Progress Persistence
**Impact: High** — Learners lose all completion state on page refresh. For a 15-module course, this is a dealbreaker. Someone halfway through will have no idea where they left off.

**Fix:** Save `completedLessons` and `currentLesson` to `localStorage`. ~10 lines of code in `App.tsx`.

### 2. Only 3 of 15 Modules Have Exercises
**Impact: High** — Modules 5, 7, and a couple others have hands-on exercises. The remaining ~12 modules are read-only. Training research consistently shows practice > passive reading.

**Modules that need exercises most:**
- **Module 08 (Writing Tests)** — should have learners write an AAA test
- **Module 09 (Page Object Model)** — should have learners extract a POM class
- **Module 10 (API Testing)** — should have learners mock a network request
- **Module 06 (Prompt Engineering)** — should have learners craft a CARD prompt

### 3. No Connection Between Training App and Practice App
**Impact: High** — The practice-app (login, products, checkout) exists at `:5173` and training at `:5174`, but there's zero guided integration. Learners aren't told "now open the practice app and try this." The two apps feel like separate projects.

**Fix:** Add "Try It Now" callouts in lesson content linking to specific practice-app pages, or embed an iframe preview.

### 4. No Deep Linking to Lessons
**Impact: Medium** — No URL routing means you can't share a link to Module 9 with a colleague, can't bookmark your spot, and can't link from external docs. For team training rollouts, this matters.

**Fix:** Add React Router or even hash-based routing (`#lesson/9`).

### 5. No Learning Path Differentiation
**Impact: Medium** — Modules have `audience` badges ("All Roles", "Developers", "Non-Coder Essential") but the sidebar shows all 15 linearly. A non-coder sees developer-focused modules they don't need; a developer sees the non-coder guide they can skip.

**Fix:** Add a role selector at start → filter/highlight the relevant path.

### 6. No Knowledge Validation Before Advancing
**Impact: Medium** — Quizzes exist in 14/15 modules but they're optional. A learner can click "Complete" without answering. There's no gate or even a nudge.

**Fix:** Show quiz completion status on the "Mark Complete" button, or require quiz attempt before marking complete.

---

## Moderate Gaps

| Gap | Impact | Notes |
|-----|--------|-------|
| No glossary/reference | Medium | Terms like "POM", "AAA", "CARD formula" used across modules with no central reference |
| No search | Low-Med | 15 modules is small, but finding "how to mock API" requires scanning |
| No estimated time per module | Low-Med | Learners can't plan study sessions |
| No difficulty indicators | Low | Modules progress naturally but there's no visual indicator |
| No print/export | Low | Some learners want offline reference sheets |
| `next-themes` installed but unused | Low | Dark mode is hardcoded; the toggle infrastructure is there but not exposed |

---

## What's Already Good (Keep These)

- **Dual-audience badges** — thoughtful content design
- **CARD formula for prompts** — unique, practical framework
- **Prompt template library (Module 11)** — copy-paste ready, high practical value
- **Quiz explanations** — not just right/wrong, explains *why*
- **Code diff view** — starter vs solution comparison is excellent for learning
- **HITL checklist (Module 13)** — bridges AI generation and human review
- **Test case mapping doc** — exceptional pedagogical resource showing decomposition thinking

---

## Recommended Priority Order

1. **Progress persistence** (localStorage) — 30 min fix, huge UX win
2. **Add exercises to 4-5 more modules** — biggest learning impact
3. **Practice app integration** ("Try It Now" links/callouts) — connects theory to practice
4. **URL routing** — enables team rollout and sharing
5. **Role-based learning paths** — reduces noise for each audience
6. **Quiz-gated completion** — ensures engagement with knowledge checks
