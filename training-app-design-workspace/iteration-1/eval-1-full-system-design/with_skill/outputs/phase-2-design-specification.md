# Phase 2: Design Specification

## 1. Screen Architecture

### Three-Panel Shell

```
┌──────────────────────────────────────────────────────────────────────┐
│  Top Bar: Course title │ Module title │ Progress │ Theme │ Search   │
├────────┬───────────────────────────────────────────────┬────────────┤
│        │                                               │            │
│  Left  │              Center Content                   │   Right    │
│  Rail  │            (notebook scroll)                  │   Rail     │
│ 260px  │           max-w 720px prose                   │  280px     │
│        │           full-width code                     │ collapsible│
│        │                                               │            │
│ Module │   text → code → callout → text → code →       │ Glossary   │
│  list  │   exercise → quiz → recap → next              │ Notes      │
│        │                                               │ Resources  │
│        │                                               │ Reference  │
├────────┴───────────────────────────────────────────────┴────────────┤
│  Bottom Sticky: ← Previous │ Save Note │ Mark Complete │ Next →     │
└──────────────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints
- **Desktop (>= 1280px):** Three panels visible. Right rail open by default.
- **Tablet (768-1279px):** Left rail collapsible (overlay). Right rail collapsed to icon strip. Center gets more space.
- **Mobile (< 768px):** Left rail hidden (hamburger). Right rail becomes bottom sheet. Center is full-width. Bottom sticky nav remains.

### Top Bar
- Left: App logo + course title
- Center: Current module > current lesson breadcrumb
- Right: Theme toggle (dropdown), search trigger, user/settings icon
- Height: 48px fixed
- Background: `--surface-elevated`

### Left Rail (260px)
- Module list with expand/collapse per module
- Each module shows: number, title, completion badge, lesson count
- Expanded module shows its lessons with completion state
- Current lesson highlighted with accent border
- Locked/unlocked states for sequential progression (optional — can be toggled)
- Overall course progress bar at top of rail
- Smooth scroll to current position on mount
- Keyboard navigable (arrow keys within list, Enter to select)

### Center Content (flex, max 720px prose)
- Notebook-style scrolling: text and code blocks interleaved
- Content sections render in order: text, code, callout, table, exercise, quiz
- Code blocks expand to full content column width (not restricted to 720px prose limit)
- Generous spacing between sections (2rem between, 1rem within)
- Scroll position saved per lesson and restored on return

### Right Rail (280px, collapsible)
- Tabs: Glossary | Notes | Resources | Reference
- Glossary: searchable term definitions relevant to current module
- Notes: user's personal notes (persisted to localStorage)
- Resources: links to external docs (Playwright docs, VS Code docs, etc.)
- Reference: code snippets, cheat sheets, quick lookups
- Collapse/expand toggle at rail edge
- On narrow screens: collapses to icon strip, expands as overlay

### Bottom Sticky Bar
- Left: "Previous" button (disabled on first lesson)
- Center: "Mark Complete" button (requires quiz attempt if quiz exists)
- Right: "Next Lesson" button (disabled on last lesson)
- Height: 56px
- Background: `--surface-elevated` with top border
- Keyboard shortcuts: Ctrl+Left (previous), Ctrl+Right (next)

---

## 2. Data Model Redesign

### Current → New

**Current:** Flat `Lesson[]` with sections as `{ heading, content, code?, tip?, warning? }[]`

**New:** Hierarchical `Module > Lesson > Section` with typed section blocks:

```typescript
// Module: top-level grouping (30 modules)
interface Module {
  id: string;                    // "module-01"
  number: number;                // 1
  title: string;                 // "Orientation"
  subtitle: string;              // "Getting started with the training platform"
  icon: string;                  // emoji or lucide icon name
  theme: ThemeName;              // assigned theme for this module
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;      // total time for all lessons
  prerequisites?: string[];      // module IDs that should be completed first
  learningObjectives: string[];  // 2-4 outcomes
  lessons: Lesson[];
}

// Lesson: a single learning unit within a module
interface Lesson {
  id: string;                    // "lesson-01-01"
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  audience?: 'all' | 'developer' | 'non-coder';
  sections: Section[];
  quiz?: Quiz;
  exercise?: CodeExercise;
  practiceLink?: PracticeLink;
}

// Section: typed content blocks for the notebook flow
type Section =
  | { type: 'text'; heading: string; content: string }
  | { type: 'code'; language: string; code: string; filename?: string; highlightLines?: number[] }
  | { type: 'callout'; variant: 'tip' | 'warning' | 'info' | 'important'; content: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'diff'; before: string; after: string; language: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'interactive-check'; question: string; answer: string; hint?: string }
  | { type: 'guided-practice'; steps: PracticeStep[] }

// Theme names
type ThemeName = 'signal-cobalt' | 'arctic-steel' | 'linear' | 'gamma-dark';
```

### Progress Model

```typescript
interface CourseProgress {
  currentModuleId: string;
  currentLessonId: string;
  modules: Record<string, ModuleProgress>;
  scrollPositions: Record<string, number>;  // lessonId → scrollY
  themePreference: ThemeName | 'auto';
  lastAccessedAt: string;                   // ISO timestamp
}

interface ModuleProgress {
  started: boolean;
  completedLessons: string[];               // lesson IDs
  quizScores: Record<string, number>;       // lessonId → score (0-100)
  exerciseCompleted: Record<string, boolean>;
  notes: Record<string, string>;            // lessonId → user notes
}
```

---

## 3. Theme Strategy

### Four Named Themes
Per the design system:
1. **Signal Cobalt** — dark, engineering-forward, cyan/cobalt accents
2. **Arctic Steel** — light, minimal, cool gray, technical manual feel
3. **Linear** — light, blue-tinted modernism, balanced
4. **Gamma Dark** — dark, warm orange/amber accents, developer-friendly

### Theme Cycling Across 30 Modules
Modules alternate between dark and light themes for visual variety. Pattern:

```
Modules 01-03: Signal Cobalt (dark, engineering)
Modules 04-06: Arctic Steel (light, minimal)
Modules 07-09: Gamma Dark (dark, warm)
Modules 10-12: Linear (light, balanced)
Modules 13-15: Signal Cobalt
Modules 16-18: Arctic Steel
Modules 19-21: Gamma Dark
Modules 22-24: Linear
Modules 25-27: Signal Cobalt
Modules 28-30: Gamma Dark
```

### Theme Implementation
- CSS custom properties on a `[data-theme="..."]` wrapper
- Theme changes at module boundaries via ModuleHero
- User can override via ThemeSelector in top bar
- "Auto" option re-enables cycling
- User preference persisted in CourseProgress
- Smooth 0.3s CSS transition for theme changes

### Token Categories (all themes)
```css
--surface-primary      /* main background */
--surface-elevated     /* cards, panels, rails */
--surface-code         /* code block backgrounds */
--surface-hover        /* interactive hover */
--text-primary         /* main body text */
--text-secondary       /* supporting text */
--text-muted           /* tertiary, placeholders */
--border-subtle        /* light structural */
--border-strong        /* emphasized */
--accent-action        /* success, progress, CTA */
--accent-info          /* links, navigation */
--accent-highlight     /* warnings, key facts */
--accent-special       /* chapter cards, milestones */
--diff-added-bg / --diff-added-text
--diff-removed-bg / --diff-removed-text
--shadow-elevation     /* card shadows */
--code-glow            /* code block border glow (dark themes) */
```

---

## 4. Navigation Model

### URL Structure
```
/                       → redirect to current module/lesson
/module/:moduleId       → Module Overview page
/module/:moduleId/:lessonId  → Lesson Detail page
/dashboard              → Progress Dashboard
/resources              → Resource/Reference View
```

Implementation: React Router v6 (needs to be added to dependencies) or continue with hash routing but enhanced:
```
#/module/01              → Module Overview
#/module/01/lesson/01    → Lesson Detail
#/dashboard              → Progress Dashboard
#/resources              → Resources
```

Recommendation: Use hash routing to avoid server configuration requirements, but with a proper router (e.g., a lightweight custom router or a small library). Keep it simple since this is a single-page learning app.

### Navigation Flow
1. User opens app → restores last position from CourseProgress
2. Left rail shows all 30 modules, current module expanded
3. Click module → Module Overview page
4. Click lesson → Lesson Detail page (notebook scroll)
5. Bottom bar: Previous / Mark Complete / Next navigates between lessons
6. At end of module → module recap, then next module's overview
7. Scroll position saved on leave, restored on return

### Keyboard Shortcuts
- `Ctrl+Left` / `Ctrl+Right` — previous/next lesson
- `Ctrl+M` — toggle left rail
- `Ctrl+R` — toggle right rail
- `Escape` — close any open overlay/modal
- Arrow keys within left rail — navigate module/lesson list

---

## 5. Component Plan

### Component Families and Source

#### Navigation Components (new)
| Component | Purpose | Based On |
|-----------|---------|----------|
| `AppShell` | Three-panel layout wrapper with responsive behavior | New (uses react-resizable-panels) |
| `TopBar` | Course header with breadcrumb, theme toggle, search | New |
| `ModuleNav` | Left rail module list with expand/collapse | Replaces current Sidebar |
| `ModuleNavItem` | Single module entry with lessons, completion | New |
| `LessonNavItem` | Single lesson entry within a module | New |
| `ProgressBar` | Multi-level progress indicator | Extends existing Progress |
| `ThemeSelector` | Theme dropdown with Auto option | New |
| `BottomBar` | Sticky navigation footer | New |
| `Breadcrumb` | Module > Lesson path indicator | Uses existing breadcrumb UI |

#### Content Components (new or refactored)
| Component | Purpose | Based On |
|-----------|---------|----------|
| `NotebookFlow` | Renders typed Section[] as interleaved blocks | New |
| `TextBlock` | Rendered prose section (max 65ch) | Extracted from LessonView |
| `CodeBlock` | Syntax-highlighted code with copy, line numbers | Refactored from LessonView |
| `DiffView` | Side-by-side or inline diff with educational tone | Refactored from DiffCodeBlock |
| `CalloutBox` | Tip/warning/info/important callout | Extracted + extended |
| `TableBlock` | Styled data table | Extracted from LessonView |
| `ImageBlock` | Annotated image with caption | New |

#### Interactive Components (new or refactored)
| Component | Purpose | Based On |
|-----------|---------|----------|
| `QuizSection` | Multiple-choice knowledge check | Refactored from LessonView |
| `ExerciseSection` | Hands-on code exercise with diff | Refactored from LessonView |
| `InteractiveCheck` | Quick inline knowledge check | New |
| `GuidedPractice` | Multi-step exercise with validation | New |
| `PromptTemplates` | Copyable prompt template library | Refactored from LessonView |

#### Layout/Page Components (new)
| Component | Purpose | Based On |
|-----------|---------|----------|
| `ModuleHero` | Module opening card with theme, objectives | New |
| `LessonHero` | Compact lesson header within module | New |
| `LearningObjectives` | Actionable outcomes block | New |
| `RecapCard` | Module/lesson conclusion card | New |
| `SupportRail` | Right rail with tabs (glossary, notes, resources) | New |
| `ConceptSection` | One-concept teaching block (text + visual) | New |
| `WorkedExample` | Before/after code example | New |

#### Page Types (new)
| Page | Purpose | Layout |
|------|---------|--------|
| `ModuleOverviewPage` | Module intro with hero, lessons, progress | `nav-hub` |
| `LessonDetailPage` | Notebook-style lesson content | `two-col` shell |
| `ProgressDashboardPage` | Course-wide progress and stats | `stat-cards` |
| `ResourcePage` | Glossary, cheat sheets, references | `hb-index` |

---

## 6. Visual Family Application

| Context | Family | Ratio |
|---------|--------|-------|
| App shell (top bar, left rail, bottom bar) | A: Dark technical workspace | 70-80% |
| Lesson content (prose, code, exercises) | B: Editorial handbook | 15-20% |
| Resource pages, glossary | C: Enterprise report | As needed |
| Module heroes, recaps, milestone moments | D: Expressive infographic | 5-10% |

---

## 7. Content Rhythm (Notebook Flow)

Each lesson follows this scroll pattern:
```
LessonHero (title, duration, objective)
  ↓ space-xl
TextBlock (3-5 sentences introducing the concept)
  ↓ space-md
CodeBlock (worked example showing the concept)
  ↓ space-md
CalloutBox (key insight from the code)
  ↓ space-xl
TextBlock (deeper explanation)
  ↓ space-md
CodeBlock (second example or variation)
  ↓ space-xl
InteractiveCheck (quick retrieval question)
  ↓ space-2xl
ExerciseSection or GuidedPractice (apply what you learned)
  ↓ space-xl
QuizSection (formal knowledge check)
  ↓ space-xl
RecapCard (3 takeaways + next step)
  ↓ space-xl
BottomBar (Previous | Mark Complete | Next)
```

---

## 8. Accessibility Requirements

- Semantic headings: one H1 per page (module or lesson title), H2 for sections, H3 for sub-sections
- Visible focus states in all four themes (2px ring using `--accent-info`)
- Keyboard operability for all interactive elements
- WCAG AA contrast (4.5:1 for body text, 3:1 for large text) — validated per theme
- Non-color-only meaning: diffs use icons + labels, quiz uses icons + text
- Accessible names for icon-only buttons (aria-label)
- Line length max 65ch for prose
- Touch targets minimum 44px
- `prefers-reduced-motion` respected for all animations
- Screen reader announcements for progress changes (aria-live regions)

---

## 9. Implementation Order (Phases 3-5)

### Phase 3: Foundation (parallel subagents)
1. **Shell subagent:** AppShell, TopBar, BottomBar using react-resizable-panels
2. **Theme subagent:** CSS custom properties for all 4 themes, ThemeProvider context, theme cycling logic
3. **Routing subagent:** Hash router, URL structure, navigation context with scroll position preservation
4. **Data model subagent:** New Module/Lesson/Section types, progress model, migration from flat Lesson[]

### Phase 4: Component Library (parallel subagents)
1. **Nav components:** ModuleNav, ModuleNavItem, LessonNavItem, ProgressBar, ThemeSelector
2. **Content components:** NotebookFlow, TextBlock, CodeBlock, DiffView, CalloutBox, TableBlock, ImageBlock
3. **Interactive components:** QuizSection, ExerciseSection, InteractiveCheck, GuidedPractice, PromptTemplates
4. **Layout components:** ModuleHero, LessonHero, LearningObjectives, RecapCard, SupportRail, ConceptSection

### Phase 5: Page Assembly (parallel subagents)
1. **LessonDetailPage** — the 80% screen, notebook flow
2. **ModuleOverviewPage** — hero + lesson list + progress
3. **ProgressDashboardPage** — course-wide stats
4. **ResourcePage** — glossary + references

---

## 10. Anti-Patterns to Avoid

- No hardcoded colors — always use CSS custom property tokens
- No switch-based layout rendering — use component composition
- No marketing-page aesthetics — this is a training product
- No decorative hero images in lesson flow — visuals must teach
- No more than 2 accent colors per lesson screen
- No stacking two text blocks without a visual break
- No generic success messages — be specific about what the learner got right
- No hiding progress — always show where the learner stands
- No font-size below 13px for body content
- No code blocks without language labels
