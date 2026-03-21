---
name: training-app-design
description: "Design systems and instructional UX guide for the Midnight Automation Voyage training platform — a React/Vite/TypeScript learning tool that teaches manual testers to become automated testers using Playwright, VS Code, and GitHub Copilot. Use this skill whenever designing, building, reviewing, or modifying React components, screens, layouts, or themes for the training app or its companion presentation/deck system. Trigger on any mention of training app UI, lesson pages, module screens, quiz components, progress tracking, navigation, code editors, diff views, exercise sections, layout selection, theme selection, engineering deck design, or visual improvements. Also trigger when creating new page types, selecting layouts from the registry, choosing themes, applying instructional cadence, refactoring components, or ensuring design-system consistency. This skill complements /design-framework (for auditing existing screens) and /frontend-design (for building new components from scratch) — use them together."
---

# Training App Design Guide

## What This Product Is

A React/Vite/TypeScript training platform that guides manual testers through becoming automated testers. The toolset is Playwright, VS Code, GitHub Copilot, and Git/GitHub. Content spans ~30 modules in a clear progression.

This is a **training product**, not a marketing site. Every screen helps a learner understand, act, recall, and progress.

### The Training Triangle

The strongest structural asset is a three-part loop that must remain central in every design decision:

1. **training-app** — interactive lessons with typed lesson objects, sections, quizzes, and exercises
2. **practice-app** — a realistic React/Vite app with predictable, test-friendly surfaces
3. **test-cases / reference answers** — long-form mapping plus runnable example specs

Every substantial module should preserve this **lesson → practice target → reference answer** structure. Mismatches between app behavior, lesson content, and reference answers damage trust quickly.

## Design Priorities (in order)

1. **Correctness and trust** — no examples that contradict actual UI behavior
2. **Comprehension and pacing** — micro-cadence, small chunks, clear progression
3. **Accessibility and readability** — WCAG AA, keyboard nav, semantic structure
4. **Modularity and reuse** — token-driven, registry-safe, composable components
5. **Implementation realism** — maps cleanly onto actual React/TypeScript code
6. **Visual polish** — last priority, but still matters

When forced to choose between visual novelty and easier comprehension, always choose comprehension.

## How This Skill Works With Others

- **`/design-framework`** — audit and improve existing screens against this guide
- **`/frontend-design`** — create new components and pages from scratch
- **This skill** — the design system rulebook both should follow

## Execution Strategy: Phased Work With Subagents

Large tasks must be broken into **explicit phases** with clear deliverables at each step. Do not attempt a full system design or multi-screen implementation in a single pass. Think in phases, execute with subagents, and verify before moving forward.

### Plan Mode First

For redesigns, new page types, or system-level changes, **enter plan mode before writing any code.** This means:
1. Explore the codebase (Phase 1: Discovery)
2. Write a design plan referencing this skill's design system (visual families, named themes, layout registry IDs, component specs)
3. Present the plan for user approval
4. Only after approval: exit plan mode and begin implementation in phases

This prevents the kind of unsupervised codebase changes that break builds. The user should always see and approve the design spec before any files are created or modified.

### Phase Model for Large Tasks

#### Phase 1: Discovery
**Goal:** Understand what exists before designing anything new.
- Explore the existing codebase (file structure, components, tokens, routing, state management)
- Identify what to preserve, what to replace, and what's missing
- Read existing styles, themes, and layout patterns
- Produce a brief inventory: "Here's what exists, here's what needs to change"
**Tools:** Explore agents, Grep, Glob, Read

#### Phase 2: Architecture & Design
**Goal:** Define the system structure, shell layout, and design decisions.
- Define the three-panel shell (left nav, center content, right support)
- Select layouts from the registry for each page type
- Define the theme cycling strategy across modules
- Map components to page types
- Define the navigation model and progress tracking approach
- Produce a design spec document the user can review before any code is written
**Tools:** This skill's reference files, planning agents

#### Phase 3: Foundation Implementation
**Goal:** Build the structural foundation — shell, routing, theme system, tokens.
- Implement the app shell (three-panel layout with responsive breakpoints)
- Implement the theme token system with all named themes
- Implement the navigation/routing structure
- Implement the progress tracking data model
- Spawn parallel subagents: one for shell layout, one for theme tokens, one for routing/nav
**Tools:** `/frontend-design`, subagents in parallel

#### Phase 4: Component Library
**Goal:** Build the reusable component library that populates the shell.
- Implement components by family — spawn subagents in parallel:
  - **Navigation components** — ModuleNav, LessonList, ProgressBar, ThemeSelector
  - **Content components** — CodeBlock, DiffView, CalloutBox, ConceptSection, WorkedExample
  - **Interactive components** — InteractiveCheck, GuidedPractice, PracticeExercise
  - **Layout components** — ModuleHero, LessonHero, RecapCard, SupportRail
- Each subagent gets only the relevant reference file (components.md or code-patterns.md)
**Tools:** `/frontend-design`, subagents (one per component family)

#### Phase 5: Page Assembly
**Goal:** Compose components into complete page types.
- Build each page type using the components from Phase 4:
  - Module Overview, Lesson Detail, Practice/Exercise, Quiz/Checkpoint, Recap, Resource/Reference
- One subagent per page type, each getting the page-types.md reference
- Verify each page renders correctly with the theme system
**Tools:** `/frontend-design`, subagents (one per page type), preview tools

#### Phase 6: Audit & Polish
**Goal:** Verify everything against the design guide and fix issues.
- Run `/design-framework` audit on each page type
- Check accessibility (contrast, focus states, keyboard nav, semantic headings)
- Verify theme cycling works across module boundaries
- Check responsive behavior at mobile/tablet/desktop breakpoints
- Verify progress tracking updates correctly
**Tools:** `/design-framework`, preview tools, accessibility checks

### When to Spawn Subagents

Subagents are the primary mechanism for managing context load. Use them whenever:
- A task has **3+ independent pieces** that can run in parallel
- The full context exceeds what a single agent can hold effectively
- Different pieces need **different reference files** from this skill
- You need to **build and audit simultaneously**

### How to Structure Subagent Tasks

Each subagent should receive:
1. The specific task and which phase it belongs to
2. Only the relevant reference files (1-2 per subagent, not all 5)
3. Design constraints from SKILL.md (visual family, theme, spacing rules)
4. Target file paths and project structure
5. Clear acceptance criteria and what "done" looks like

### Tools to Use Proactively

- **`/frontend-design`** — for generating new React components and pages
- **`/design-framework`** — for auditing components against this design guide
- **Explore agents** — to understand existing codebase before redesigning
- **Build/preview tools** — to verify components render correctly
- **Grep/Glob** — to find existing components, tokens, and patterns

### Context Load Management

The full design system across 5 reference files is ~1200 lines. Do not load everything into one context:
- Load only `SKILL.md` for design decisions and priorities
- Load specific reference files only when the task needs them
- For subagents: pass 1-2 relevant reference files, not all 5
- For implementation: read existing code first to understand what exists

## Instructional Cadence

Every lesson follows a consistent micro-cadence:

**concept → example → exercise → quiz → recap → next step**

This maps to the three-part teaching loop:
1. **Explain** — concept + context
2. **Show** — worked example or demo
3. **Apply** — guided practice, exercise, or short quiz with retrieval check

Every lesson must end with: a knowledge check, a small apply-now task, and a clear success condition. Retrieval and assessment are not optional.

### Problem-Centered Learning

Start with an achievable problem, not abstract exposition:
- Orient the learner
- Let them run or inspect something concrete
- Explain why it works
- Deepen understanding
- Test recall
- Ask for application

## Content Format: Notebook-Style Scrolling

The learning experience operates like a scrolling webpage crossed with a notebook — explanatory text and code sections are intertwined in a single vertical flow:

```
┌─────────────────────────────────────┐
│  Explanatory text block             │  ← calm, readable prose (3-5 sentences)
├─────────────────────────────────────┤
│  Code block / editor                │  ← syntax-highlighted, editable
├─────────────────────────────────────┤
│  Annotation / callout               │  ← key insight from the code
├─────────────────────────────────────┤
│  Practice exercise                  │
│  ┌─ Their answer ─┬─ Expected ──┐  │
│  │  diff view      │  comparison │  │  ← gentle, helpful diff
│  └─────────────────┴─────────────┘  │
├─────────────────────────────────────┤
│  Next text block continues...       │
└─────────────────────────────────────┘
```

Text blocks stay short (3-5 sentences). Code blocks get generous padding. Never stack two long text blocks without a visual break. The scroll should feel rhythmic: read → see → do → read → see → do.

## Navigation and Progress Tracking

Learners must always know where they are and what they've completed.

**Progress visibility at three levels:**
- **Course level** — "Module 12 of 27" with visual progress bar
- **Module level** — "Lesson 3 of 8" with step dots or segments
- **Section level** — within a lesson, completed/remaining sections visible

**Navigation requirements:**
- Left rail shows all modules with completion state (locked/unlocked/complete)
- Current position always highlighted
- Easy return to prior lessons without losing place
- Sticky footer with back/complete/next actions
- Scroll position preserved when navigating away and returning
- Keyboard navigation and clear focus states throughout

## Visual Families

The product uses four visual families in a deliberate ratio:

| Family | Usage | When to Use |
|--------|-------|-------------|
| **A: Dark technical workspace** | 70-80% | App shell, navigation, engineering lessons, dashboards, architecture pages |
| **B: Editorial handbook** | 15-20% | Reading/comprehension, training plans, process explanations, best practices |
| **C: Research/enterprise report** | As needed | Dense info pages, metrics summaries, structured internal docs |
| **D: Expressive infographic** | 5-10% | Chapter openers, summaries, stats, memorable transitions only |

Do not blend all families equally. Combine intentionally: technical shell + editorial lesson body. Expressive cards only as accents. Never let Family D dominate everyday lesson screens.

## Theme Strategy

The app supports multiple named themes and cycles between modules for visual variety.

### Named Themes

| Theme | Use For | Character |
|-------|---------|-----------|
| **Signal Cobalt** | Engineering-forward content, code, infrastructure | Swiss/Nordic, monospace-friendly |
| **Arctic Steel** | Architecture, platform, governance, internal docs | Minimal and technical |
| **Linear** | Product + engineering hybrids | Clean blue-tinted modernism |
| **Gamma Dark** | Developer narratives, dark case studies, dashboards | Warm/orange warning accents |

### Theme Cycling

Modules cycle themes to keep the 30-module journey visually dynamic:
- Theme changes at module boundaries (not within a module)
- The ModuleHero sets the visual tone for each module
- Learners can always override via manual toggle in the top bar
- "Auto" option in theme toggle re-enables cycling

### Token-Driven Design

All colors and spacing are defined as CSS custom properties (semantic tokens). Components never use raw color values. Theme tokens drive: background, card surface, accent, glow, border, typography, chart palette, and interaction states.

Read `references/visual-style.md` for complete token definitions per theme.

## Screen Architecture

Default lesson screen layout:

**Top bar** — Course title, module title, progress indicator, theme toggle, search/help, user/profile

**Left rail** — Module list with completion state, lesson list, current position highlight, locked/unlocked indicators. This rail is for orientation, not content.

**Main column** — The notebook-style scrolling content lane. Full learning experience. Max `65ch` for prose, full-width for code blocks.

**Right rail** — Notes, resources, glossary, optional AI helper. Collapsible, secondary. On narrow screens collapses to bottom sheet.

**Bottom sticky** — Back, save note, mark complete, next lesson

### Content Spacing

- Between sections: `2rem`+ gap
- Within sections: `1rem` between text and code blocks
- Code blocks: `1.5rem` internal padding, rounded corners, subtle border
- Line length: Max `65ch` for prose
- Paragraphs: 3-5 sentences max

## Layout System

The app uses a **registry-based layout architecture** with 26 layouts across 6 families. Read `references/layout-system.md` for the full registry, engineering presets, and screen-to-layout mapping.

Key layout families:
- **Base** — cover, nav-hub, two-col, stat-cards, before-after, process-cycle
- **Handbook** — hb-chapter, hb-practices, hb-process, hb-manifesto, hb-index
- **Engineering** — eng-architecture, eng-code-flow, eng-tech-stack, eng-roadmap
- **Sprint, Onboarding, Verge Pop** — specialized families

When recommending layouts, use registry-safe layout IDs, not ad-hoc descriptions.

## Components

Read `references/components.md` for standard component definitions.
Read `references/code-patterns.md` for code-specific components (CodeBlock, DiffView, GuidedPractice, Infographic, CalloutBox, ModuleHero).

### Component Rules
- All components use tokens, not hardcoded styles
- Clear prop interfaces
- No magic numbers
- Support variants and size scales consistently
- Composition over variant explosion

## Page Types

Read `references/page-types.md` for detailed specs. Core types:

1. **Module Overview** — title, outcomes, lesson list, progress, estimated time
2. **Lesson Detail** — notebook-style scrolling with text + code blocks
3. **Practice/Exercise** — guided step-by-step with validation
4. **Quiz/Checkpoint** — low-stakes, immediate feedback, diff view for code
5. **Recap/Summary** — bold visual treatment, key takeaways
6. **Resource/Reference** — glossary, cheat sheets, searchable
7. **Engineering Architecture** — system diagrams, workflow explainers
8. **Progress Dashboard** — metrics, completion state, next recommended

## Accessibility

Always enforce:
- Semantic headings (one clear H1 per page)
- Visible focus states in all themes
- Keyboard operability for all interactive elements
- Sufficient contrast (WCAG AA minimum)
- Non-color-only meaning (diffs use icons + labels alongside color)
- Accessible names for icon-only buttons
- Readable line length and touch-friendly targets (min 44px)
- Plain language where possible

## Voice of the UI

Clear, capable, calm, encouraging, technically specific. Never buzzword-heavy or patronizing.

This audience may feel uncertain about coding — the UI should make them feel capable:
- "Check your answer" not "Submit for evaluation"
- "Here's what's different" not "Errors found"
- "Almost — here's what to adjust" not "Wrong"
- Progress celebration is visible but not over-the-top

## Output Contract

When generating a screen, doc, or deck, provide:

1. Screen/deck purpose
2. Audience
3. Visual family (A/B/C/D and ratio)
4. Layout selection (registry-safe IDs)
5. Components used
6. Content cadence
7. Theme/token guidance
8. Accessibility requirements
9. Implementation guidance
10. Anti-patterns / what not to do

## Anti-Patterns

### Product/UX
- Designing like a marketing landing page
- Making every lesson look like poster art
- Treating support tools as equal to lesson content
- Hiding progress or burying actions
- Endless-scroll dense documents without structure

### Visual
- Too many accent colors on core lesson pages
- Decorative gradients with no instructional role
- Stock-photo-heavy learning screens
- Text on texture-heavy images without contrast

### System
- Hardcoded styles and colors (use tokens)
- Switch-based layout rendering (use registry)
- Inconsistent manifest shapes
- Visually beautiful but instructionally empty screens

### Training
- App behavior that contradicts reference solutions
- No retrieval checks or apply-now tasks
- No verification steps
- Too much front-end complexity when the learning objective is Playwright skill
