# Pilot Module Splitting Plan

## Summary

5 pilot modules split into multi-lesson format. Each split is designed so lessons are self-contained learning units of 10-18 minutes each.

---

## Module 07: Record Your First Test

**Source file:** `src/data/modules/07-record-refine-workflow.ts`
**Current:** 4 sections, 1 quiz (3 questions), 3 exercises, 1 narration script
**Estimated minutes:** ~30

### Lesson 1: Launch the Recorder (lesson-07-01)
- **Sections:** 0-1 (Why Record First?, Launch the Recorder)
- **Exercises:** None (conceptual intro)
- **Quiz:** None
- **Narration:** Full narration script (steps 1-5)
- **Estimated:** 12 min

### Lesson 2: Record, Review, and Identify Gaps (lesson-07-02)
- **Sections:** 2-3 (Record a Login Flow, What the Recording Gets Wrong)
- **Exercises:** All 3 (Spot Fragile Selectors, Replace with getByTestId, Transform to Production Quality)
- **Quiz:** Full quiz (3 questions)
- **Narration:** Narration steps 6-9
- **Estimated:** 18 min

**Rationale:** Lesson 1 is the "understand and launch" lesson. Lesson 2 is the "do and critique" lesson. The exercises belong with the "what goes wrong" section because they practice identifying and fixing recording problems.

---

## Module 14: Test Authoring Guide

**Source file:** `src/data/modules/14-collaborative-test-authoring.ts`
**Current:** 7 sections, 1 quiz, 1 exercise, 1 narration script
**Estimated minutes:** ~27

### Lesson 1: The Daily Workflow (lesson-14-01)
- **Sections:** 0-3 (Your Superpower: Domain Knowledge, The 5-Minute Workflow, When to Pause and Re-Evaluate, Common Early-Stage Gotchas)
- **Exercises:** None
- **Quiz:** None
- **Narration:** Narration steps 1-4
- **Estimated:** 15 min

### Lesson 2: Your First Week and Beyond (lesson-14-02)
- **Sections:** 4-6 (Your First Week Plan, Vocabulary Cheat Sheet, The Automation Paradox)
- **Exercises:** 1 (Refine a Codegen Recording with CARD)
- **Quiz:** Full quiz
- **Narration:** Narration steps 5-8
- **Estimated:** 12 min

**Rationale:** Lesson 1 covers the immediate daily practices. Lesson 2 covers the longer-term orientation (first week, vocabulary, philosophy). Natural temporal boundary.

---

## Module 21: Assessment & Certification

**Source file:** `src/data/modules/21-assessment-certification.ts`
**Current:** 7 sections, 1 quiz (3 questions), 3 exercises
**Estimated minutes:** ~36

### Lesson 1: Why Assessment + Competency Matrix (lesson-21-01)
- **Sections:** 0-1 (Why Assessment Matters, Competency Matrix)
- **Exercises:** None
- **Quiz:** None
- **Estimated:** 10 min

### Lesson 2: Certification Tiers + Capstone (lesson-21-02)
- **Sections:** 2-4 (Three Certification Tiers, Capstone Structure, Rubric Criteria)
- **Exercises:** 2 (Write a Capstone Test Plan [beginner], E2E Checkout Happy Path [intermediate])
- **Quiz:** None
- **Estimated:** 18 min

### Lesson 3: Peer Review + Continuous Improvement (lesson-21-03)
- **Sections:** 5-6 (Peer Review Calibration, Continuous Improvement)
- **Exercises:** 1 (Checkout Validation and Edge Cases [advanced])
- **Quiz:** Full quiz (3 questions)
- **Estimated:** 12 min

**Rationale:** Three natural tiers — (1) understanding the "why" and framework, (2) the practical capstone work, (3) the organizational process. The advanced exercise belongs with the review/improvement lesson.

---

## Module 25: Multi-Browser & Projects Config

**Source file:** `src/data/modules/25-multi-browser-projects.ts`
**Current:** 7 sections, 1 quiz, 1 exercise
**Estimated minutes:** ~27

### Lesson 1: Browser Engines and Project Configuration (lesson-25-01)
- **Sections:** 0-3 (Playwright's Browser Engines, The Projects Array, Browser-Specific Gotchas, Project Dependencies)
- **Exercises:** None
- **Quiz:** None
- **Estimated:** 15 min

### Lesson 2: Cross-Browser Strategy (lesson-25-02)
- **Sections:** 4-6 (Risk-Based Browser Selection, Cross-Browser Visual Differences, Browser Version Pinning)
- **Exercises:** 1 (Multi-Browser Config with Auth Setup)
- **Quiz:** Full quiz
- **Estimated:** 12 min

**Rationale:** Lesson 1 is "how browsers work in Playwright" (reference/conceptual). Lesson 2 is "how to use them effectively" (strategic/practical).

---

## Module 30: Performance Baseline Testing

**Source file:** `src/data/modules/30-performance-testing.ts`
**Current:** 4 sections, 1 quiz, 1 exercise
**Estimated minutes:** ~18

### Lesson 1: Web Vitals and Measurement (lesson-30-01)
- **Sections:** 0-1 (Start with Web Vitals, Measure in Playwright)
- **Exercises:** None
- **Quiz:** None
- **Estimated:** 10 min

### Lesson 2: Budgets, Conditions, and Escalation (lesson-30-02)
- **Sections:** 2-3 (Budgets and Controlled Conditions, Know When to Escalate)
- **Exercises:** 1 (Measure a Dashboard Baseline)
- **Quiz:** Full quiz
- **Estimated:** 10 min

**Rationale:** Module 30 is the lightest of the 5 pilots. Even so, the split makes sense: Lesson 1 is "what to measure and how", Lesson 2 is "how to operationalize it". Each lesson is ~10 minutes, which is the minimum viable lesson length.

---

## Implementation Checklist

For each pilot module:
1. [ ] Add `lessons` metadata array to the legacy export
2. [ ] Create or update `multiLessonModule()` call in `curriculum.ts` course arrays
3. [ ] Verify lesson IDs don't collide with existing progress data
4. [ ] Test navigation between lessons within the module
5. [ ] Test progress tracking for individual lesson completion
6. [ ] Verify quiz and exercise attribution to correct lessons
