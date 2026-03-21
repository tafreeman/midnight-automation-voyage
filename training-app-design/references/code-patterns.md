# Code-Specific Component Patterns

## Table of Contents
- [CodeBlock](#codeblock)
- [DiffView](#diffview)
- [GuidedPractice](#guidedpractice)
- [Infographic](#infographic)
- [CalloutBox](#calloutbox)
- [ModuleHero](#modulehero)

---

## CodeBlock

The primary code display component. Appears constantly throughout the notebook-style flow.

**Required elements:**
- Language label (top-left corner, e.g., "TypeScript", "Playwright")
- Copy button (top-right, subtle until hover)
- Syntax highlighting that works in both dark and light themes
- Optional line numbers (on by default for exercises, off for short snippets)
- Optional line highlighting (to draw attention to specific lines)

**Sizing:**
- Full width of the content column
- Internal padding: `1.5rem` horizontal, `1rem` vertical
- Rounded corners (`0.5rem`)
- Subtle border in light theme, subtle glow in dark theme
- Code font size should match body text readability — `0.9rem` minimum

**Behavior:**
- Scrollable horizontally if lines exceed container width
- Expandable vertically for long blocks (show first ~15 lines, "Show more" for the rest)
- Copy feedback: brief "Copied!" toast or checkmark animation

**Theme handling:**
- Dark theme: VS Code Dark+ inspired syntax colors on near-black background
- Light theme: VS Code Light+ inspired syntax colors on soft gray background
- Both must maintain clear contrast for all token types

---

## DiffView

Shows the difference between the learner's code and the expected answer. The most important design challenge: this must feel **helpful and educational**, not like a failure report.

**Two display modes:**

### Inline Diff (default for short answers)
- Single column
- Removed lines: soft red background with `-` prefix
- Added lines: soft green background with `+` prefix
- Unchanged lines: neutral background
- Line numbers on both sides

### Side-by-Side Diff (for longer answers or when requested)
- Two columns: "Your Answer" | "Expected"
- Synced scrolling
- Highlighted differences within lines (character-level diff)
- Clear column headers

**Design rules:**
- Header says "Here's what's different" or "Compare your answer" — never "Errors"
- Use soft, muted red/green — not alarming saturated colors
- Include a summary line: "2 lines differ" or "Almost! Just one small change needed"
- Unchanged lines should be visually quiet (reduced opacity or smaller text)
- Provide a "Show expected answer" toggle if the diff is complex
- In dark theme: use `rgba` overlays on the code background for diff highlighting
- In light theme: use tinted backgrounds that are clearly distinct but gentle

**Accessibility:**
- Don't rely on red/green alone — use `-`/`+` prefixes and line icons
- Include text labels ("Your answer", "Expected")
- Screen reader should announce additions and removals clearly

---

## GuidedPractice

A step-by-step exercise component where the learner follows instructions and writes code incrementally.

**Structure:**
```
┌────────────────────────────────────────┐
│  Step 1 of 5: Create the test file     │  ← step header with progress
├────────────────────────────────────────┤
│  instruction text explaining what to   │  ← clear, short instruction
│  do and why                            │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │  code editor area                │  │  ← editable code block
│  │  with starter code / scaffold    │  │
│  └──────────────────────────────────┘  │
├────────────────────────────────────────┤
│  [Check] [Show Hint] [Show Answer]     │  ← action buttons
├────────────────────────────────────────┤
│  ● ● ● ○ ○                            │  ← step progress dots
│  [← Previous Step]  [Next Step →]      │
└────────────────────────────────────────┘
```

**Design rules:**
- Step progress is always visible (dots, numbers, or progress bar)
- "Show Hint" is always available — never punish the learner for using it
- "Show Answer" is available after one attempt, not hidden
- Validation should be immediate and explain what's wrong, not just flag it
- Each step should be completeable in 1-3 minutes
- Steps auto-save progress

---

## Infographic

Visual explanation components for concepts that benefit from diagrams over text.

**Common patterns for this training product:**

- **Test Lifecycle Flow:** arrange → act → assert (horizontal flow diagram)
- **Locator Strategy Decision Tree:** how to choose between locators
- **Page Object Pattern:** visual showing class structure and relationships
- **Test Pyramid:** visual hierarchy of test types
- **CI/CD Pipeline:** stages from commit to deploy
- **Playwright Architecture:** browser → context → page relationship

**Design rules:**
- Maximum 7 visual elements per infographic (cognitive load)
- Use the bold infographic accent colors (magenta/rose, high-energy)
- Text on infographics should be large and scannable
- Provide alt text that fully describes the visual for accessibility
- Infographics should work at both mobile and desktop widths
- Include a brief text summary below for screen readers and quick scanners

---

## CalloutBox

Highlighted inline callouts for tips, warnings, and key facts.

**Variants:**

| Variant | Icon | Border Color | Use For |
|---------|------|-------------|---------|
| `tip` | lightbulb | green accent | Helpful shortcuts, best practices |
| `warning` | triangle | yellow accent | Common mistakes, gotchas |
| `info` | circle-i | blue accent | Additional context, "good to know" |
| `important` | star | magenta accent | Key concepts to remember |

**Design rules:**
- Maximum 1-3 sentences — callouts are not paragraphs
- Left border accent (4px) with subtle background tint
- Icon at top-left, text flows beside it
- Should feel like a gentle aside, not a flashing alert
- In dark theme: tinted background with `rgba` of accent color at ~10% opacity
- In light theme: tinted background with `rgba` of accent color at ~5% opacity

---

## ModuleHero

The opening card that sets the visual tone for each module.

**Elements:**
- Module number (large, prominent)
- Module title (display typography)
- Estimated time
- Difficulty level (beginner / intermediate / advanced)
- 2-4 learning objectives
- Optional decorative visual element (abstract shape, icon cluster, or themed illustration)

**Design rules:**
- This is where theme cycling is most visible — the hero card establishes the module's theme
- Dark-themed heroes: deep background with accent glow edges
- Light-themed heroes: clean white/warm background with accent color blocks
- The visual element should relate to the module topic (e.g., a browser icon for "Understanding Locators", a gear for "Configuration")
- Keep it tall enough to feel like a fresh start, but not so tall that content is pushed below the fold
- Difficulty level uses a simple visual indicator (dots, bars, or text label) — not color-coded difficulty
