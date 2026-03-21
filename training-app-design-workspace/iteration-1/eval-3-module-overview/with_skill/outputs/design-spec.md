# Module 14 Overview Page -- Design Specification

## Screen Purpose
Orient the learner before they begin Module 14: Page Object Model. Show what the module contains, set expectations for time and difficulty, display prerequisite status, and provide a preview of the final exercise output. This is a **Module Overview** page type -- the gateway that gives learners confidence before committing to a module.

## Audience
Manual testers transitioning to automation. Mix of developers and non-coders. This module is labeled "Developers -- Non-coders: awareness only" so the overview should make that audience split visible without being exclusionary.

## Visual Family
**Family B (Editorial handbook)** as primary, with Family A (dark workspace) reserved for the left nav rail only. Module 14 is even-numbered, so it receives a **light theme**.

**Ratio:** B: 80% (main content area), A: 20% (left navigation rail)

## Theme Selection
Module 14 is even-numbered. Per the theme cycling function:
```
lightThemes[Math.floor(14 / 4) % lightThemes.length]
= lightThemes[3 % 2]
= lightThemes[1]
= "linear"
```
**Theme: Linear** -- clean blue-tinted modernism with `--surface-primary: #fafbfe`.

## Layout Selection
**Primary layout: `nav-hub`** -- navigation index with multiple lesson targets. This is the recommended layout for module overviews per the layout-system reference.

**Supporting layout: `stat-cards`** -- for the progress snapshot and module stats at the top.

## Components Used
| Component | Role |
|-----------|------|
| **ModuleHero** | Module number (14), title, estimated time, difficulty, 4 learning objectives |
| **ProgressIndicator** | Course-level: "Module 14 of 30" with visual bar; shows 13/30 completed |
| **TopicCard** (x6) | One per lesson, showing title, estimated time, completion state, brief description |
| **BadgePill** | Lesson completion state (Completed / In Progress / Locked / Available) |
| **CalloutBox** (info) | Prerequisite notice: "Complete Module 13: HITL Review Checklist first" |
| **Eyebrow** | "MODULE 14" label above the title |
| **LearningObjectives** | 4 actionable outcomes block |

## Content Structure

### ModuleHero Section
- Eyebrow: "MODULE 14"
- Title: "Page Object Model"
- Subtitle: "Organizing tests for long-term maintainability"
- Time estimate: ~45 minutes total
- Difficulty: Intermediate
- Audience badge: "Developers -- Non-coders: awareness only"

### Learning Objectives
After this module, you will be able to:
1. Explain why Page Object Model improves test maintainability
2. Create a Page Object class that encapsulates locators and actions
3. Use Copilot to generate Page Object skeletons from page descriptions
4. Refactor inline tests into the POM pattern

### Prerequisite Notice
CalloutBox (info variant): "This module builds on concepts from Module 13: HITL Review Checklist. Complete it first to get the most from this content."
Status indicator showing Module 13 is complete (green check).

### Lesson List (6 Lessons)
| # | Lesson Title | Est. Time | State | Description |
|---|-------------|-----------|-------|-------------|
| 1 | Why POM? | 5 min | Completed | Understand the maintenance problem POM solves |
| 2 | POM Structure | 10 min | Completed | Learn the class-based pattern for page encapsulation |
| 3 | Copilot POM Generation | 8 min | In Progress | Use Copilot Chat to generate Page Object classes |
| 4 | Multi-Page POM | 10 min | Available | Organize POMs across a multi-page application |
| 5 | POM Best Practices | 7 min | Locked | Naming conventions, inheritance, and composition |
| 6 | POM Exercise | 10 min | Locked | Refactor an inline test into the POM pattern |

### What You Will Build (Preview)
A preview card showing a side-by-side comparison:
- Left: "Before" -- inline test with repeated selectors
- Right: "After" -- clean test using a ContactPage class
This uses a simplified BeforeAfterPair pattern, read-only, to motivate the learner.

### Progress Snapshot
- Course progress: 13 of 30 modules completed (43%)
- This module: 2 of 6 lessons completed
- Estimated remaining: ~35 minutes

## Left Navigation Rail
Shows full course structure with 30 modules. Current module (14) highlighted. Modules 1-13 show completed state (green checkmarks). Module 14 shows "in progress" (blue indicator). Modules 15-30 show upcoming state (muted).

The rail groups modules into logical sections:
- Foundations (1-4)
- Core Skills (5-10)
- Advanced Practices (11-15)
- Specialized Topics (16-22)
- Infrastructure (23-27)
- Extended (28-30+)

## Content Cadence
The overview page follows a top-to-bottom flow:
1. ModuleHero (orient) -- space-2xl below
2. Prerequisite notice (gate-check) -- space-xl below
3. Learning objectives (motivate) -- space-xl below
4. Lesson list with progress (plan) -- space-xl below
5. What you will build preview (inspire) -- space-xl below
6. Progress snapshot (contextualize) -- space-2xl below
7. Start / Continue button (act)

## Theme / Token Guidance
All colors via Linear theme tokens:
- `--surface-primary: #fafbfe` (page background)
- `--surface-elevated: #ffffff` (cards, hero)
- `--surface-code: #f4f6fb` (code preview blocks)
- `--text-primary: #1e2330` (headings, body)
- `--text-secondary: #6b7489` (meta text, labels)
- `--accent-action: #10b981` (completed states, progress, CTA)
- `--accent-info: #3b82f6` (current/in-progress states, links)
- `--accent-highlight: #f59e0b` (prerequisite warnings)
- `--accent-special: #ec4899` (module hero accent)

Left rail stays dark (zinc-950 background) for contrast separation.

## Accessibility Requirements
- Single H1: "Page Object Model"
- Lesson cards are keyboard-navigable with visible focus rings
- Progress bars have aria-valuenow/aria-valuemax
- BadgePills include text labels, not just color
- Prerequisite CalloutBox uses role="status" for screen readers
- Locked lessons announced as "Locked -- complete previous lessons first"
- All interactive elements have min 44px touch targets
- Color contrast meets WCAG AA in Linear light theme

## Implementation Guidance
- Use Tailwind CSS classes consistent with existing codebase
- Light theme uses bg-slate-50/white backgrounds instead of zinc-950/900 dark
- Component can be a standalone React component: ModuleOverview.tsx
- Props: module data, completion state, course progress, lesson list
- Left nav reuses existing Sidebar component with minor theme adaptation
- Responsive: at <768px, left nav collapses; lesson cards stack to single column

## Anti-Patterns to Avoid
- Do not make this look like a marketing landing page with large hero imagery
- Do not use decorative gradients without instructional purpose
- Do not hide the lesson list below the fold
- Do not use color-only indicators for completion state
- Do not make locked lessons visually invisible -- show them muted but present
- Do not add confetti or heavy celebration for partial progress
