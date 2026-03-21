# Phase 2: Architecture Design Specification

## 1. Shell Layout

```
+--------------------------------------------------------------+
| [Logo] Playwright + Copilot Training     [Theme] [Progress]  |  <- TopBar (48px)
+--------+--------------------------------+--------------------+
|        |                                |                    |
| LEFT   |       CENTER                   |   RIGHT            |
| NAV    |       CONTENT                  |   PANEL            |
| PANEL  |       PANE                     |   (collapsible)    |
| 280px  |       flex-1                   |   320px             |
|        |       (scrollable)             |                    |
|        |                                |                    |
+--------+--------------------------------+--------------------+
```

### TopBar (fixed, 48px height)
- Logo / course title on left
- Module-level progress bar (thin, spans full width below the bar)
- Overall course progress indicator (compact, top right)
- Theme toggle button
- Right panel toggle button

### Left Navigation Panel (280px, fixed, full height below TopBar)
- Course progress ring at top (overall %)
- 30 modules listed as expandable accordion items
- Each module shows: number, title, completion state (icon), lesson count
- Expanding a module reveals its lessons as indented sub-items
- Active lesson is highlighted with accent color + left border
- Completed lessons show a checkmark
- Current module auto-expands on navigation
- Scrollable with custom scrollbar
- Collapsible on mobile (overlay drawer)

### Center Content Pane (flex-1, scrollable)
- Continuous scroll within each module
- Content blocks flow top-to-bottom like a notebook
- Max-width 720px, centered with generous padding
- Smooth scroll between sections
- Intersection Observer tracks which section is visible (for nav highlighting)

### Right Panel (320px, collapsible)
- Default: collapsed to icon strip (48px)
- Expanded: glossary, notes, resources tabs
- Tabs: Glossary | Notes | Resources
- Glossary: searchable term list for current module
- Notes: per-module user notes (textarea, persisted to localStorage)
- Resources: external links, related docs for current module
- Toggle button in TopBar and in the panel itself

## 2. Navigation Model

### URL Structure
Switch from hash to React Router with nested routes:
```
/                         -> redirect to /module/1/lesson/1
/module/:moduleId         -> redirect to first lesson
/module/:moduleId/lesson/:lessonId  -> specific lesson
```

### Module/Lesson Hierarchy
Restructure the data model to group lessons into modules:
```typescript
interface Module {
  id: number;
  title: string;
  description: string;
  icon: string;
  themeAccent: string;       // per-module accent color
  lessons: ModuleLesson[];
  glossary: GlossaryEntry[];
  resources: Resource[];
}

interface ModuleLesson {
  id: string;                 // "1.1", "1.2", etc.
  title: string;
  sections: ContentSection[];
  quiz?: Quiz;
  exercise?: CodeExercise;
  promptTemplates?: PromptTemplate[];
  practiceLink?: PracticeLink;
}
```

### Back/Forward Navigation
- Browser back/forward uses React Router history
- Within a module: scroll-based (continuous flow)
- Between modules: route-based navigation
- Scroll position restored via sessionStorage per route

## 3. Theme Strategy

### Per-Module Accent Colors (30 modules, 6 color families)
Rotate through 6 hue families, each module gets a unique accent:

| Modules | Color Family | HSL Base     | Name      |
|---------|-------------|--------------|-----------|
| 1-5     | Emerald     | 160 84% 39%  | Foundation|
| 6-10    | Cyan        | 192 91% 36%  | Skills    |
| 11-15   | Violet      | 263 70% 50%  | Advanced  |
| 16-20   | Amber       | 38 92% 50%   | Specialty |
| 21-25   | Rose        | 347 77% 50%  | Mastery   |
| 26-30   | Sky         | 199 89% 48%  | Expert    |

### Theme Token System
CSS custom properties that change per-module:
```css
:root {
  /* Base (always the same) */
  --bg-primary: 0 0% 4%;
  --bg-secondary: 0 0% 7%;
  --bg-tertiary: 0 0% 10%;
  --text-primary: 0 0% 96%;
  --text-secondary: 0 0% 64%;
  --text-muted: 0 0% 45%;

  /* Module accent (changes per module) */
  --accent-h: 160;
  --accent-s: 84%;
  --accent-l: 39%;
  --accent: var(--accent-h) var(--accent-s) var(--accent-l);
  --accent-subtle: var(--accent-h) var(--accent-s) 15%;
  --accent-muted: var(--accent-h) var(--accent-s) 25%;

  /* Code */
  --code-bg: 0 0% 8%;
  --code-border: 0 0% 15%;
  --code-text-h: var(--accent-h);
}
```

### Light Mode (Future)
The token system supports adding a light mode later by defining alternate values under `.light` class.

## 4. Component Plan

### Layout Components
- `AppShell` - The 3-panel layout wrapper
- `TopBar` - Fixed top navigation bar
- `LeftNav` - Module navigation panel
- `RightPanel` - Supplementary materials panel
- `ContentPane` - Scrollable center area

### Content Block Components (notebook-style building blocks)
- `TextBlock` - Prose paragraphs with markdown support
- `CodeBlock` - Syntax-highlighted code with copy, language badge
- `CalloutBlock` - Tip, warning, info, success variants
- `TableBlock` - Responsive data tables
- `ImageBlock` - Screenshots, diagrams (future)

### Interactive Components
- `QuizBlock` - Multiple choice quiz inline in scroll
- `ExerciseBlock` - Code exercise with starter/solution diff
- `PromptTemplateBlock` - Copilot prompt cards
- `PracticeLinkBlock` - CTA to practice app

### Navigation Components
- `ModuleAccordion` - Expandable module item in sidebar
- `LessonItem` - Individual lesson link in sidebar
- `ProgressRing` - Circular progress indicator
- `ProgressBar` - Linear progress indicator
- `BreadcrumbNav` - Module > Lesson breadcrumb

### Utility Components
- `GlossaryPanel` - Searchable term definitions
- `NotesPanel` - User notes editor
- `ResourcesPanel` - External links list
- `ScrollSpy` - Intersection observer for active section tracking

## 5. Progress Data Model

```typescript
interface CourseProgress {
  version: number;
  modules: Record<string, ModuleProgress>;
  lastVisited: {
    moduleId: number;
    lessonId: string;
    scrollPosition: number;
    timestamp: number;
  };
  notes: Record<string, string>;  // moduleId -> note text
}

interface ModuleProgress {
  completedLessons: string[];     // lesson IDs
  quizResults: Record<string, QuizResult>;
  exerciseCompleted: string[];
  startedAt?: number;
  completedAt?: number;
}

interface QuizResult {
  correct: boolean;
  attempts: number;
  lastAttempt: number;
}
```

Storage: localStorage key `mav-progress-v2`, migrating from v1 on first load.

## 6. File Structure Plan

```
src/
  components/
    layout/
      AppShell.tsx
      TopBar.tsx
      LeftNav.tsx
      RightPanel.tsx
      ContentPane.tsx
    content/
      TextBlock.tsx
      CodeBlock.tsx
      CalloutBlock.tsx
      TableBlock.tsx
    interactive/
      QuizBlock.tsx
      ExerciseBlock.tsx
      PromptTemplateBlock.tsx
      PracticeLinkBlock.tsx
    navigation/
      ModuleAccordion.tsx
      LessonItem.tsx
      ProgressRing.tsx
      ProgressBar.tsx
      BreadcrumbNav.tsx
    panels/
      GlossaryPanel.tsx
      NotesPanel.tsx
      ResourcesPanel.tsx
    ui/
      (existing shadcn components)
  contexts/
    ProgressContext.tsx
    ThemeContext.tsx
    NavigationContext.tsx
  hooks/
    useProgress.ts
    useTheme.ts
    useScrollSpy.ts
    useScrollRestore.ts
    useLocalStorage.ts
  data/
    types.ts
    index.ts
    modules/
      (existing module files, to be restructured)
    theme-config.ts
  lib/
    utils.ts
    progress-migration.ts
  App.tsx
  main.tsx
  index.css
```

## 7. Build Phases Breakdown

### Phase 3: Foundation (parallel work items)
- A: Shell layout (AppShell + TopBar + placeholders for panels)
- B: Theme token system (CSS variables + ThemeContext + per-module config)
- C: React Router setup (routes + NavigationContext)
- D: Progress data model (ProgressContext + localStorage + v1 migration)

### Phase 4: Component Library (parallel work items)
- A: Navigation components (ModuleAccordion, LessonItem, ProgressRing, BreadcrumbNav)
- B: Content block components (TextBlock, CodeBlock, CalloutBlock, TableBlock)
- C: Interactive components (QuizBlock, ExerciseBlock, PromptTemplateBlock)
- D: Panel components (LeftNav, RightPanel, GlossaryPanel, NotesPanel, ResourcesPanel)

### Phase 5: Assembly
- Wire LeftNav with real module data
- Build ContentPane renderer that maps lesson sections to content blocks
- Build module page with continuous scroll
- Wire RightPanel with glossary/notes/resources
- Connect everything to ProgressContext
