# Phase 1: Discovery Report

## Existing Codebase Inventory

### Architecture Summary
- **Framework:** React 19 + TypeScript + Vite 8 + Tailwind CSS 3.4
- **Component Library:** shadcn/ui (Radix UI primitives) — 43 base UI components in `src/components/ui/`
- **State Management:** React useState + localStorage persistence (key: `mav-progress-v1`)
- **Routing:** Hash-based (`#lesson/N`) — no React Router
- **Data Model:** Flat `Lesson[]` array — no module grouping, no hierarchical navigation

### File Structure
```
training-app/
  src/
    App.tsx              — Root: two-panel layout (sidebar + main)
    main.tsx             — Entry point (StrictMode wrapper)
    index.css            — Global styles, CSS custom properties, fonts
    App.css              — Empty
    components/
      Sidebar.tsx        — Left nav panel (flat lesson list, progress bar, role filter)
      LessonView.tsx     — Main content (all inline: CodeBlock, Quiz, Exercise, DiffView, etc.)
      ui/                — 43 shadcn/ui components (accordion, badge, button, card, etc.)
    data/
      types.ts           — Lesson, Quiz, CodeExercise, PromptTemplate interfaces
      index.ts           — Lesson registry (imports all 33 module files)
      modules/           — 33 individual lesson data files (01-orientation.ts through 33-testing-ai-features.ts)
    hooks/
      use-toast.ts       — Toast notification hook
    lib/
      utils.ts           — cn() utility (clsx + tailwind-merge)
```

### Current Module Count
33 modules exist in the data files (01-33), but only 27 were previously documented. The index.ts exports all 33 as a flat `lessons` array. The user wants to reduce to 30 modules for the redesign.

### What Exists (Preserve)
1. **43 shadcn/ui base components** — high quality, token-ready, accessible. Keep all.
2. **Lesson data model and 33 module files** — content is solid. Data shape needs extension (module grouping, section types).
3. **Progress persistence** — localStorage pattern works but needs richer data model.
4. **Role filtering** — useful concept (all/developer/non-coder), keep but improve UX.
5. **JetBrains Mono + Inter font stack** — matches the design system's typography spec.
6. **Basic quiz and exercise patterns** — logic is sound, components need decomposition.

### What Must Change
1. **No module grouping** — data is a flat array. Need hierarchical Module > Lesson > Section model.
2. **No theme system** — single dark theme with hardcoded emerald/zinc. Need 4 named themes with CSS token cycling.
3. **No right panel** — two-panel layout only. Need three-panel shell (left nav, center content, right support).
4. **Monolithic LessonView** — CodeBlock, QuizSection, ExerciseSection, DiffCodeBlock, PromptTemplateSection, TableBlock are all defined inline in one 500-line file. These must become standalone components.
5. **No real routing** — hash-based lesson index. Need proper URL routing for module/lesson/section paths.
6. **No scroll position preservation** — navigating away loses position.
7. **No section-level progress** — only lesson-level completion tracking.
8. **No notebook-style flow** — content renders as a page with sections, not an interleaved text+code notebook.
9. **No module overview pages** — jumps straight to lesson content.
10. **No progress dashboard** — only a percentage bar in sidebar.
11. **CSS tokens are shadcn defaults** — need to replace with design system semantic tokens.

### What's Missing
1. **ThemeProvider and theme cycling logic**
2. **Three-panel responsive shell with collapsible rails**
3. **Module overview page type**
4. **Recap/summary page type**
5. **Progress dashboard page type**
6. **Resource/reference view**
7. **SupportRail component (right panel: glossary, notes, resources)**
8. **ModuleHero component**
9. **LessonHero component**
10. **CalloutBox component (as standalone, not inline)**
11. **GuidedPractice component**
12. **ProgressIndicator (course, module, section levels)**
13. **ThemeSelector component**
14. **Sticky bottom navigation bar**
15. **Scroll position restoration on navigation**
16. **Keyboard navigation for module/lesson traversal**
17. **Search functionality**

### Dependencies Available
Key packages already installed that we can leverage:
- `react-resizable-panels` — for the three-panel layout
- `@radix-ui/react-scroll-area` — for custom scroll containers
- `@radix-ui/react-accordion` — for expandable module/lesson lists
- `@radix-ui/react-collapsible` — for right rail sections
- `@radix-ui/react-tabs` — for right rail tab switching
- `@radix-ui/react-progress` — for progress bars
- `@radix-ui/react-tooltip` — for tooltips
- `lucide-react` — for icons
- `class-variance-authority` — for component variants
- `tailwind-merge` + `clsx` — for class composition
