# Phase 1: Codebase Audit Summary

## Current Architecture

### App Shell
- **Entry**: `main.tsx` renders `<App />` inside React StrictMode
- **Layout**: Two-panel layout (sidebar + main content) using flexbox
- **State Management**: All state lives in `App.tsx` via useState hooks
  - `currentLesson` (index-based navigation)
  - `completedLessons` (Set<number>)
  - `sidebarOpen` (boolean)
  - `roleFilter` ("all" | "developer" | "non-coder")
- **Persistence**: localStorage under key `mav-progress-v1`
- **Routing**: Hash-based (`#lesson/0`, `#lesson/1`, ...) - no React Router

### Components
- `Sidebar.tsx` - Left navigation panel (flat list, no hierarchy/expandable modules)
- `LessonView.tsx` - Main content renderer (monolithic, contains sub-components)
  - `CodeBlock` - Code display with copy button
  - `QuizSection` - Multiple choice quiz
  - `ExerciseSection` - Starter + solution diff view
  - `PromptTemplateSection` - Copilot prompt accordion
  - `TableBlock` - Data tables
  - `DiffCodeBlock` - Side-by-side code comparison

### Data Model
- `types.ts` defines `Lesson`, `Quiz`, `CodeExercise`, `PromptTemplate`
- Flat lesson array (33 modules, numbered 01-33, but array is 0-indexed)
- Each lesson is a standalone file in `data/modules/`
- Lessons have: id, title, subtitle, icon, audience, sections[], quiz?, exercise?, promptTemplates?, practiceLink?
- Sections have: heading, content, code?, codeLanguage?, tip?, warning?, callout?, table?

### Styling
- Tailwind CSS 3.4.1 with shadcn/ui CSS variable theming
- Dark theme only (zinc-950 background)
- Emerald as primary accent color
- JetBrains Mono for headings/code, Inter for body text
- 40+ shadcn/ui components installed (many unused)

### Dependencies
- React 19, Vite 8, TypeScript 5.9
- Full shadcn/ui Radix primitive set
- lucide-react for icons
- react-resizable-panels (installed but unused)
- No React Router

## Key Gaps vs. Requirements
1. **No module/lesson hierarchy** - Flat list, no expandable sub-lessons
2. **No right panel** - No supplementary materials area
3. **No per-module theming** - Single emerald dark theme everywhere
4. **No scroll position preservation** - Hash nav scrolls to top
5. **No module progress tracking** - Only overall completion percentage
6. **No continuous scroll** - Paginated slide-by-slide navigation
7. **No React Router** - Just hash-based index switching
8. **Monolithic LessonView** - All content types in one file
9. **Content is plain strings** - No markdown, no rich formatting within sections
