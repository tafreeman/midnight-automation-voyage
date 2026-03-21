# Module 14 Overview Page - Design Specification

## Context

Module 14 is "Page Object Model" in the Playwright + GitHub Copilot training platform.
The existing app uses a flat lesson-based navigation (Sidebar + LessonView) with a dark
zinc-950 theme and emerald accents. This design introduces a **module overview** view
that sits between the sidebar navigation and the individual lesson view -- a landing page
for a module that shows all 6 lessons, their completion state, and what the learner will build.

## Theme Decision

Even-numbered module = **light theme**. The existing app is dark (zinc-950 bg, zinc-100 text).
This page inverts that: white/slate-50 background, slate-900 text, with emerald-600 as the
primary accent. The sidebar retains its dark chrome to anchor navigation.

## Layout Structure

```
+------------------+----------------------------------------------------+
|                  |                                                    |
|   LEFT NAV       |   MAIN CONTENT AREA                               |
|   (dark, 280px)  |   (light theme, flex-1)                           |
|                  |                                                    |
|   - Course title |   HEADER BAR                                      |
|   - Progress     |   [Breadcrumb: Course > Module 14]                |
|   - 30 modules   |   [Prerequisites badge]  [Est. time: 2h 15m]     |
|     with state   |                                                    |
|   - #14 = active |   MODULE HERO                                     |
|                  |   Icon + Title + Subtitle                         |
|                  |   Progress ring (0/6 lessons)                     |
|                  |                                                    |
|                  |   PREVIEW CARD                                     |
|                  |   "What You'll Build" - code screenshot preview    |
|                  |                                                    |
|                  |   LESSON LIST (6 items)                            |
|                  |   Each: number, title, est. time, status icon      |
|                  |                                                    |
|                  |   PREREQUISITE NOTICE                              |
|                  |   If Module 13 incomplete: locked overlay           |
|                  |                                                    |
+------------------+----------------------------------------------------+
```

## Left Nav Specification

- Width: 280px, fixed, dark background (zinc-950)
- Shows all 30 modules grouped by section
- Each module: number, icon, title, completion checkmark or lock icon
- Module 14 highlighted with emerald left border accent
- Progress bar at top: "13 of 30 modules completed" with 43% fill
- Scrollable with current module scrolled into view

## Module Sections (Grouping)

The 30 modules are organized into logical groups in the nav:
- Foundations (01-05)
- Core Skills (06-10)
- Advanced Prompting (11-15)
- Professional Patterns (16-20)
- Assessment & Tools (21-25)
- CI/CD & Scaling (26-30)

Module 14 ("Page Object Model") falls in "Advanced Prompting" group.

Note: The actual codebase has Module 09 as "Page Object Model." For this design,
we treat Module 14 as the module overview page for "Page Object Model" as specified
in the task requirements, independent of the existing lesson ID mapping.

## Main Content Specification

### Breadcrumb
- "Playwright + Copilot" > "Module 14" -- small text, slate-500

### Header Section
- Large icon (construction/blueprint theme)
- Title: "Page Object Model" in 28px bold, slate-900
- Subtitle: "Organizing tests for long-term maintainability"
- Tags: "Intermediate" badge, "Developer Focus" badge
- Prerequisite badge: "Requires Module 13: HITL Checklist" with link

### Progress Ring
- Circular progress indicator showing 0/6 lessons complete
- "Not started" label below
- Total estimated time: 2h 15m

### What You'll Build (Preview Card)
- Light bordered card with code preview thumbnail
- Description: "A complete Page Object Model for the practice app's login,
  dashboard, and contact pages with reusable action methods"
- Skills listed: Class-based page objects, Locator encapsulation,
  Copilot-generated POM, Refactoring tests to use POM

### Lesson List
Six lessons displayed as cards:

| # | Title | Time | Status |
|---|-------|------|--------|
| 1 | Why Page Object Model? | 15 min | Not started |
| 2 | POM Structure & Anatomy | 25 min | Not started |
| 3 | Building Your First Page Object | 30 min | Not started |
| 4 | Copilot-Generated Page Objects | 20 min | Not started |
| 5 | Refactoring Tests to Use POM | 25 min | Not started |
| 6 | POM Best Practices & Patterns | 20 min | Not started |

Each lesson card shows:
- Lesson number in a circle
- Title and brief description
- Estimated time with clock icon
- Status indicator (circle outline = not started, check = done, play = in progress)
- Hover state lifts card slightly with shadow

### Prerequisite Notice
- If Module 13 not completed: amber warning banner
- "Complete Module 13: Human-in-the-Loop Checklist before starting this module"
- Link to navigate to Module 13
- Lessons are visually dimmed but visible (not hidden)

## Color Tokens (Light Theme)

| Token | Value | Usage |
|-------|-------|-------|
| bg-primary | white (#ffffff) | Page background |
| bg-secondary | slate-50 (#f8fafc) | Card backgrounds |
| text-primary | slate-900 (#0f172a) | Headings |
| text-secondary | slate-600 (#475569) | Body text |
| text-muted | slate-400 (#94a3b8) | Captions |
| accent | emerald-600 (#059669) | Active states, progress |
| accent-light | emerald-50 (#ecfdf5) | Accent backgrounds |
| border | slate-200 (#e2e8f0) | Card borders |
| warning | amber-500 (#f59e0b) | Prerequisite alerts |

## Typography

- Title: 28px, font-weight 700, JetBrains Mono
- Subtitle: 14px, font-weight 400, system sans-serif
- Lesson title: 15px, font-weight 600
- Lesson description: 13px, font-weight 400
- Badge text: 11px, font-weight 500, uppercase tracking-wide
- Nav items: 13px, font-weight 500

## Responsive Behavior

- Desktop (>1024px): Sidebar + full content
- Tablet (768-1024): Collapsible sidebar, content fills width
- Mobile (<768): Sidebar hidden, hamburger toggle, stacked lesson cards

## Accessibility

- All interactive elements keyboard-focusable
- Focus rings: 2px emerald-500 outline with 2px offset
- ARIA landmarks: nav, main, list roles
- Color contrast: all text meets WCAG AA (4.5:1 minimum)
- Progress indicators have text alternatives
- Prerequisite state announced via aria-live region
