# Component Definitions

## Table of Contents
- [Micro Components](#micro-components)
- [Card Components](#card-components)
- [Navigation Components](#navigation-components)
- [Compound Components](#compound-components)
- [Animation Components](#animation-components)
- [Training-Specific Components](#training-specific-components)
- [Component Rules](#component-rules)

For code-specific components (CodeBlock, DiffView, GuidedPractice, Infographic, CalloutBox, ModuleHero), see `references/code-patterns.md`.

---

## Micro Components

Small, reusable atoms used throughout the system.

### Eyebrow
Small label text above a heading. Used for category, module number, or section label.
- Uppercase or small-caps styling
- Uses `--text-secondary` color
- Never competes with the heading below it

### StatValue
A large numeric value with a label. Used in dashboards and recap cards.
- Number in display typography
- Label in caption text below
- Optional trend indicator (up/down arrow)

### CalloutBox
Highlighted inline callout for tips, warnings, key facts. Variants: `tip` (green), `warning` (yellow), `info` (blue), `important` (accent).
- Left border accent (4px) with subtle background tint
- Icon at top-left, text beside it
- 1-3 sentences max — not paragraphs
- Uses `rgba` of accent color at 5-10% opacity for background

### QuoteBlock
Styled quotation with attribution.
- Left border or indent treatment
- Optional editorial serif for the quote text
- Attribution in `--text-secondary`

### BadgePill
Small status indicator (e.g., "Completed", "In Progress", "Locked").
- Rounded corners, compact
- Color-coded by status using accent tokens
- Include text label, not just color

### IconButton
Button containing only an icon (copy, expand, bookmark, etc.).
- Accessible name required (aria-label)
- Visible focus state
- Hover state with `--surface-hover`
- Min touch target 44px

---

## Card Components

### StatCard
Card displaying a metric with context.
- StatValue + trend + sparkline (optional)
- Used in dashboards, recap pages
- Works in `stat-cards` layout

### TopicCard
Card representing a module, lesson, or concept.
- Title, brief description, progress indicator
- Click target for navigation
- Completion badge overlay

### LandingTile
Larger card for feature or section highlights.
- Icon or illustration + title + description
- Used in module overviews and navigation hubs
- Works in `nav-hub` layout

### BeforeAfterPair
Side-by-side comparison card.
- Two panels with clear labels ("Before" / "After" or "Manual" / "Automated")
- Synced height
- Works in `before-after` layout

---

## Navigation Components

### ThemeSelector
Dropdown or toggle for switching between named themes.
- Shows current theme name
- Options: Signal Cobalt, Arctic Steel, Linear, Gamma Dark, Auto (cycling)
- Accessible keyboard navigation
- Lives in top bar

### DeckPicker
Navigation component for selecting between modules/sections.
- Used when multiple decks or paths are available
- Shows completion state per option

### ProgressIndicator
Shows current position within module and course.
- **Course level:** "Module 12 of 27" with visual bar
- **Module level:** "Lesson 3 of 8" with step dots or segments
- **Section level:** Completed/remaining sections within a lesson
- Color: `--accent-action` for completed, `--accent-info` for current, muted for upcoming
- Completion feels rewarding but not over-the-top (checkmark, not confetti)

---

## Compound Components

### ProcessLane
A horizontal swim lane showing parallel or sequential stages.
- Part of `process-lanes` layout
- Stage boxes with status indicators
- Connecting lines between stages

### ProcessNode
A single node within a ProcessLane.
- Label, description, status
- Icon or number
- Connected to adjacent nodes

### LessonHero
Compact lesson header within a module.
- Title (h2 level within module)
- Duration estimate, section position ("Lesson 3 of 8")
- Learning objective (one actionable sentence)
- Optional status badge ("In Progress", "Completed")
- Should not push content below the fold

### LearningObjectives
Actionable outcomes block.
- 2-4 concise outcomes
- Frame as: "After this lesson, you'll be able to..."
- Specific and actionable: "Write a Playwright test that clicks a button and verifies the result"
- Not generic: "Understand the basics of Playwright"

### ConceptSection
One-concept teaching block.
- Short text explanation (3-5 sentences)
- Paired with visual: code block, annotated screenshot, or diagram
- Clear heading naming the concept
- The visual must teach — if removing it doesn't lose information, replace it

### WorkedExample
Concrete, copy-pasteable example.
- Before/after or step-by-step format
- Show real Playwright/VS Code/Copilot code, not pseudocode
- Annotate key lines ("This line waits for the element to appear")

### RecapCard
Module/lesson conclusion card.
- 3 takeaways max (short, specific)
- One reflection prompt
- One forward-looking action
- Bold visual treatment allowed (Family D infographic moment)

### SupportRail
Right-side panel with secondary tools.
- Contents: Notes, resources/links, glossary, exercise templates
- Collapsible sections
- On narrow screens: collapses to bottom sheet or overlay
- Search within the rail for quick lookups
- Never competes visually with the lesson lane

---

## Animation Components

### Particles
Ambient particle animation for visual interest.
- Used in module heroes and special transitions
- Subtle — should not distract from content
- Respects `prefers-reduced-motion`

### CometTransition
Animated transition between major sections.
- Used sparingly for module transitions
- Brief (< 1 second)
- Respects `prefers-reduced-motion`

### ThematicIntro
Animated opening sequence for a module or major section.
- Theme-aware (uses current theme's accent colors)
- Brief, then settles into static content
- Respects `prefers-reduced-motion`

---

## Component Rules

All components must:
- Use semantic tokens (never hardcoded colors)
- Expose clear prop interfaces
- Avoid magic numbers
- Support variants and size scales consistently
- Allow composition over variant explosion
- Document states and expected behaviors
- Meet WCAG AA contrast in all themes
- Support keyboard navigation where interactive
- Include accessible names for icon-only elements
