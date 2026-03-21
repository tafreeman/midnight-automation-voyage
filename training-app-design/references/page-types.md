# Page Type Specifications

## Table of Contents
- [Module Overview](#module-overview)
- [Lesson Detail](#lesson-detail)
- [Practice / Exercise](#practice--exercise)
- [Interactive Checkpoint / Quiz](#interactive-checkpoint--quiz)
- [Recap / Summary](#recap--summary)
- [Resource / Reference View](#resource--reference-view)
- [Engineering Architecture](#engineering-architecture)
- [Progress Dashboard](#progress-dashboard)
- [Style and Layout Mapping](#style-and-layout-mapping)

---

## Module Overview

**Purpose:** Orient the learner before they begin a module. Set the visual tone (theme for this module) and show what's ahead.

**Layout candidates:** `nav-hub`, `stat-cards`, `two-col`

**Contents:**
- ModuleHero (number, title, time, difficulty, objectives, theme)
- Lesson list with completion state and estimated time per lesson
- Progress snapshot (visual bar or ring)
- Optional prerequisite info ("Complete Module 5 first")
- Optional "What you'll build" preview (screenshot of finished exercise)

**Visual family:** Family A (dark workspace) or B (editorial), driven by theme cycling. Clean, organized, motivating.

---

## Lesson Detail

**Purpose:** The default teaching screen. ~80% of learning happens here. Uses the notebook-style scrolling pattern.

**Layout candidates:** `two-col`, `hb-practices`, editorial lesson shell

**Contents (in scroll order):**
- Lesson header (title, duration, section within module)
- Objective statement ("By the end, you'll be able to...")
- Notebook-style content blocks alternating between:
  - Text blocks (3-5 sentences)
  - CodeBlocks (syntax-highlighted with language labels)
  - CalloutBoxes (tips, warnings, key facts)
  - Infographics (visual explanations for complex concepts)
  - InteractiveChecks (quick knowledge checks)
- Summary/recap
- Navigation: back / mark complete / next lesson

**Visual family:** Family A shell + Family B reading lane. Calm center, minimal bold color.

**Training triangle:** Each lesson should connect to a practice-app surface and reference answer where applicable.

---

## Practice / Exercise

**Purpose:** Hands-on application where the learner builds something step-by-step with validation.

**Layout candidates:** `workflow`, `process-lanes`, `two-col`

**Contents:**
- Exercise title and overview ("Build a login page test")
- GuidedPractice component (step-by-step with validation)
- Each step: instruction → code editor → validation → next
- Hints always available, solution available after first attempt
- Connection to practice-app: which page/component to test against
- Connection to reference answer: runnable spec to compare against

**Visual family:** Family A workspace. Code editor is centerpiece.

---

## Interactive Checkpoint / Quiz

**Purpose:** Low-stakes knowledge check for retrieval practice and confidence building.

**For multiple-choice questions:**
- Clear answer options with high-contrast selection state
- Immediate feedback explaining why the answer is correct/incorrect

**For code-answer questions:**
- Editable CodeBlock for learner's response
- DiffView comparing answer to expected (gentle, educational tone)
- Summary line: "Almost! 1 line differs" or "Perfect match!"

**Visual family:** Family A with strong state clarity. Feedback is immediate and explanatory.

**Design rules:**
- Color + icons + text for correct/incorrect (not color alone)
- "Try again" always available
- Frame as learning: "Here's why..." not "Wrong!"
- Every lesson should end with at least one of these

---

## Recap / Summary

**Purpose:** Cement learning, create a memorable visual bookmark, and point forward.

**Layout candidates:** `stat-cards`, Verge Pop layouts, `hb-chapter`

**Contents:**
- Key takeaways (3 maximum)
- Visual summary or mini-infographic
- Reflection prompt ("What would you do differently?")
- "What to do next" action
- Module completion stats if at end of module

**Visual family:** Family D (expressive infographic) — this is the 5-10% moment. Bold shapes, color blocks, high-energy accents.

---

## Resource / Reference View

**Purpose:** On-demand support material. Cheat sheets, API references, glossary.

**Layout candidates:** `hb-index`, `nav-hub`

**Contents:**
- Searchable glossary
- Playwright API quick reference
- VS Code shortcut cheat sheets
- Exercise templates and starter files
- Links to official documentation

**Visual family:** Family A/C (workspace / enterprise report). Utilitarian, clear hierarchy, searchable.

---

## Engineering Architecture

**Purpose:** Explain system architecture, technical workflows, or engineering concepts visually.

**Layout candidates:** `eng-architecture`, `eng-code-flow`, `eng-tech-stack`, `eng-roadmap`

**Contents:**
- System diagram or architecture visualization
- Component/layer descriptions
- Data flow or pipeline stages
- Technology labels and annotations

**Visual family:** Family A (dark technical workspace). Use Signal Cobalt or Gamma Dark themes. Engineering layouts have specific visual structures — see `references/layout-system.md`.

---

## Progress Dashboard

**Purpose:** Show learner's overall progress, achievements, and recommended next steps.

**Layout candidates:** `stat-cards`, `process-lanes`

**Contents:**
- Course completion percentage with visual progress bar
- Module-by-module completion state
- Recent activity timeline
- Recommended next lesson
- Time spent and streak data (optional)
- Skill assessment summary (if applicable)

**Visual family:** Family A (workspace). Product-style metrics — not sales-dashboard energy.

---

## Style and Layout Mapping

| Page Type | Visual Family | Layout IDs | Theme | Bold Color |
|-----------|--------------|------------|-------|------------|
| Module overview | A or B | `nav-hub`, `stat-cards`, `two-col` | Cycling | ModuleHero accent |
| Lesson detail | A shell + B lane | `two-col`, `hb-practices` | Inherits module | Very limited |
| Practice/exercise | A | `workflow`, `process-lanes`, `two-col` | Inherits module | Minimal |
| Quiz/checkpoint | A | Card grid / custom | Inherits module | For state feedback |
| Recap/summary | D | `stat-cards`, Verge Pop, `hb-chapter` | Inherits module | Bold — this is the moment |
| Resource/reference | A or C | `hb-index`, `nav-hub` | User preference | Functional only |
| Engineering | A | `eng-*` family | Signal Cobalt / Gamma Dark | Technical accents |
| Dashboard | A | `stat-cards`, `process-lanes` | User preference | Progress accents |
