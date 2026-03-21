# Visual Style Reference

## Table of Contents
- [Named Themes](#named-themes)
- [Semantic Token System](#semantic-token-system)
- [Color System Rules](#color-system-rules)
- [Typography](#typography)
- [Spacing and Composition](#spacing-and-composition)
- [Information Density](#information-density)
- [Imagery and Visual Learning](#imagery-and-visual-learning)
- [Data Visualization](#data-visualization)
- [Theme Cycling Implementation](#theme-cycling-implementation)

---

## Named Themes

### Signal Cobalt
**Use for:** Engineering-forward content, code-heavy lessons, infrastructure topics, technical decks.
**Character:** Swiss/Nordic precision. Monospace-friendly. Deep blue-charcoal base with cyan/cobalt accents. Feels like a premium developer tool.

### Arctic Steel
**Use for:** Architecture pages, platform topics, governance, internal documentation.
**Character:** Minimal and technical. Cool gray steel tones. Restrained accent use. Report-quality readability. Feels like a serious technical manual.

### Linear
**Use for:** Product + engineering hybrids, mixed-audience content.
**Character:** Clean blue-tinted modernism. Balanced between editorial calm and technical precision. Feels like a polished product workspace.

### Gamma Dark
**Use for:** Developer narratives, dark case studies, dashboards, evening/extended-use sessions.
**Character:** Warm dark mode with orange/amber warning accents. Developer-friendly. Feels like a comfortable coding environment.

### Theme Selection Rules
- **Signal Cobalt** → code, infrastructure, engineering systems
- **Arctic Steel** → architecture, platform, governance, internal docs
- **Linear** → mixed product + engineering stories
- **Gamma Dark** → dark case studies, developer narratives, dashboards

---

## Semantic Token System

All colors are defined as CSS custom properties on a theme wrapper. Components never use raw color values — always reference tokens.

### Token Categories

Theme tokens drive: background, card surface, accent, glow, border, typography, chart palette, and interaction states.

```css
/* Surface tokens */
--surface-primary      /* Main background */
--surface-elevated     /* Card/panel backgrounds */
--surface-code         /* Code block backgrounds */
--surface-hover        /* Interactive hover state */

/* Text tokens */
--text-primary         /* Main body text */
--text-secondary       /* Supporting text, labels */
--text-muted           /* Tertiary text, placeholders */

/* Border tokens */
--border-subtle        /* Light structural borders */
--border-strong        /* Emphasized borders */

/* Accent tokens */
--accent-action        /* Progress, success, confirmation */
--accent-info          /* Links, information, navigation */
--accent-highlight     /* Warnings, key facts, reminders */
--accent-special       /* Chapter cards, milestones, summary moments */

/* Diff tokens */
--diff-added-bg        /* Addition background */
--diff-removed-bg      /* Removal background */
--diff-added-text      /* Addition text */
--diff-removed-text    /* Removal text */

/* Elevation */
--shadow-elevation     /* Card/panel shadow */
--code-glow            /* Code block border/glow */
```

### Signal Cobalt Token Values
```css
[data-theme="signal-cobalt"] {
  --surface-primary: #0f1729;
  --surface-elevated: #1a2744;
  --surface-code: #0d1117;
  --text-primary: #e8edf5;
  --text-secondary: #7b8da6;
  --accent-action: #a3e635;
  --accent-info: #38bdf8;
  --accent-highlight: #fbbf24;
  --accent-special: #c084fc;
}
```

### Arctic Steel Token Values
```css
[data-theme="arctic-steel"] {
  --surface-primary: #f8f9fb;
  --surface-elevated: #ffffff;
  --surface-code: #f0f2f5;
  --text-primary: #1a1f2e;
  --text-secondary: #5a6577;
  --accent-action: #059669;
  --accent-info: #2563eb;
  --accent-highlight: #d97706;
  --accent-special: #7c3aed;
}
```

### Linear Token Values
```css
[data-theme="linear"] {
  --surface-primary: #fafbfe;
  --surface-elevated: #ffffff;
  --surface-code: #f4f6fb;
  --text-primary: #1e2330;
  --text-secondary: #6b7489;
  --accent-action: #10b981;
  --accent-info: #3b82f6;
  --accent-highlight: #f59e0b;
  --accent-special: #ec4899;
}
```

### Gamma Dark Token Values
```css
[data-theme="gamma-dark"] {
  --surface-primary: #1a1a2e;
  --surface-elevated: #242442;
  --surface-code: #0d1117;
  --text-primary: #f0f0f0;
  --text-secondary: #8b8fa3;
  --accent-action: #a3e635;
  --accent-info: #60a5fa;
  --accent-highlight: #fb923c;
  --accent-special: #f472b6;
}
```

---

## Color System Rules

### Accent Semantic Roles
| Role | Color Family | Use |
|------|-------------|-----|
| System info / technical emphasis | Cyan / teal | Technical callouts, system status |
| Success / progress / confirmation | Lime / green | Completed steps, correct answers |
| Navigation / structure | Blue | Links, active states, navigation |
| Expressive / storytelling | Magenta / purple | Chapter cards, summary emphasis |
| Warnings / tradeoffs / risks | Orange / amber | Warning callouts, caution states |
| Editorial grounding | Cream / warm neutral | Light layout backgrounds |

### Contrast and Accessibility
Validate contrast for all theme combinations:
- Text on background — WCAG AA (4.5:1 for body, 3:1 for large text)
- Text on card surface
- Accent on background
- Muted text readability

Never rely on color alone for meaning.

---

## Typography

### Typography Stack
Two-mode system:

**Functional typography** — App shell, body, labels, code-adjacent content:
- Modern sans-serif (Inter, system fonts)
- Monospace for code (Fira Code, JetBrains Mono, Cascadia Code)
- Strong UI readability, compact but not cramped

**Editorial typography** — Selected title cards, handbook sections, narrative moments:
- Refined serif or high-quality display face
- Used sparingly, never at the expense of lesson clarity

### Hierarchy Roles
Every page must clearly distinguish:
- Page title (large, clean, immediate)
- Section title (strong but quieter)
- Subhead
- Body (short, readable line length)
- Caption/meta (subtle)
- Note/callout
- Code/technical label (monospace)

### Monospace Guidance
Use monospace for: engineering headings, architecture labels, step numbering, diagram titles, code content.
Do not use for: dense explanatory paragraphs.

---

## Spacing and Composition

### Spacing Scale
| Token | Value | Use |
|-------|-------|-----|
| `--space-xs` | `0.25rem` | Inline gaps, icon margins |
| `--space-sm` | `0.5rem` | Within-component gaps |
| `--space-md` | `1rem` | Between related items |
| `--space-lg` | `1.5rem` | Internal component padding |
| `--space-xl` | `2rem` | Between content sections |
| `--space-2xl` | `3rem` | Between major page regions |

### Composition Rules
- Left rail: narrow (`240px`), stable
- Main content: dominant (`max-width: 720px` for prose, full-width for code)
- Right rail: secondary (`280px`), collapsible
- Wide screens: protect readable central column
- Code blocks: full width of content column (not restricted to prose width)

### Content Rhythm
```
text (3-5 sentences)    → space-xl
code block              → space-md
annotation/callout      → space-xl
text (3-5 sentences)    → space-md
code block              → space-xl
interactive check       → space-2xl (stronger break before exercises)
```

---

## Information Density

Target density for an audience transitioning from manual testing:
- **Lower than** a typical developer tool
- **Higher than** a marketing page
- Short paragraphs (3-5 sentences)
- One concept per visual block
- Never stack two text blocks without a visual element between
- Generous spacing — the page should breathe

A new-to-code learner should feel capable, not buried.

---

## Imagery and Visual Learning

### When to Use Visuals
Every 2-3 text blocks should include at least one visual (code block, diagram, annotated screenshot, or infographic).

### Types (priority order)
1. **Annotated screenshots** — VS Code, Playwright, DevTools. Show exactly where to click.
2. **Process diagrams** — Test lifecycle, CI/CD, page object relationships.
3. **Comparison visuals** — Before/after, manual vs. automated, locator strategies.
4. **Infographics** — Conceptual overviews (test pyramid, selector hierarchy). Max 7 elements.
5. **Step diagrams** — Numbered process steps.

### Avoid
- Generic stock photos
- Unannotated screenshots
- Complex diagrams needing separate explanation
- Decorative hero art in lesson flow

---

## Data Visualization

Charts appear in dashboards and recaps, not in lesson content.

- Progress bars/rings for module completion
- Simple bar charts for quiz scores
- Step completion timelines
- Direct labels over legends
- Use accent colors purposefully: green=completed, blue=in-progress, muted=not-started

---

## Theme Cycling Implementation

```typescript
const THEME_CYCLE: Record<number, string> = {
  // Example cycling pattern across 30 modules
  // Alternates between dark and light-base themes
  // with variety in which specific theme is used
};

function getModuleTheme(moduleNumber: number): string {
  const darkThemes = ['signal-cobalt', 'gamma-dark'];
  const lightThemes = ['arctic-steel', 'linear'];

  if (moduleNumber % 2 === 1) {
    return darkThemes[Math.floor(moduleNumber / 4) % darkThemes.length];
  }
  return lightThemes[Math.floor(moduleNumber / 4) % lightThemes.length];
}
```

### Transition Behavior
- Apply theme change at ModuleHero level
- Brief CSS transition (`0.3s ease`) for background and text colors
- Left rail matches current module's theme
- User can always override via toggle
- "Auto" option re-enables cycling
- User preference persists across sessions
