# Phase 4: Component Plan - Built Components

## New File Structure (created)

### Contexts (State Management)
| File | Purpose |
|------|---------|
| `src/contexts/ProgressContext.tsx` | Course progress tracking, quiz results, notes, localStorage persistence with v1 migration |
| `src/contexts/ThemeContext.tsx` | Per-module accent color theming via CSS custom properties |
| `src/contexts/NavigationContext.tsx` | Module/lesson navigation, sidebar/panel toggle state, hash routing |

### Layout Components
| File | Purpose |
|------|---------|
| `src/components/layout/AppShell.tsx` | 3-panel layout wrapper with TopBar, LeftNav, ContentPane, RightPanel |
| `src/components/layout/TopBar.tsx` | Fixed top bar with logo, module indicator, progress, panel toggles |
| `src/components/layout/ContentPane.tsx` | Main scrollable content area rendering lesson sections as notebook flow |

### Content Block Components (notebook-style)
| File | Purpose |
|------|---------|
| `src/components/content/TextBlock.tsx` | Prose paragraphs with generous 1.8 line height |
| `src/components/content/CodeBlock.tsx` | Code display with language badge, copy button, accent-colored syntax |
| `src/components/content/CalloutBlock.tsx` | Tip/warning/info/success callouts with left border and icons |
| `src/components/content/TableBlock.tsx` | Responsive data tables with accent-tinted headers |

### Interactive Components
| File | Purpose |
|------|---------|
| `src/components/interactive/QuizBlock.tsx` | Multiple-choice quiz with submit, retry, explanation |
| `src/components/interactive/ExerciseBlock.tsx` | Code exercise with starter/solution reveal and hints |
| `src/components/interactive/PromptTemplateBlock.tsx` | Accordion of copyable Copilot prompt templates |
| `src/components/interactive/PracticeLinkBlock.tsx` | CTA card linking to practice app |

### Navigation Components
| File | Purpose |
|------|---------|
| `src/components/navigation/LeftNav.tsx` | 30-module accordion with expandable lessons, completion state |
| `src/components/navigation/ProgressRing.tsx` | SVG circular progress indicator |
| `src/components/navigation/BreadcrumbNav.tsx` | Course > Module > Lesson breadcrumb |

### Panel Components
| File | Purpose |
|------|---------|
| `src/components/panels/RightPanel.tsx` | Tabbed right panel (Glossary/Notes/Resources) |
| `src/components/panels/GlossaryPanel.tsx` | Searchable 20-term glossary |
| `src/components/panels/NotesPanel.tsx` | Per-module note editor with auto-save |
| `src/components/panels/ResourcesPanel.tsx` | External resource links (Playwright docs, VS Code, etc.) |

### Data Layer
| File | Purpose |
|------|---------|
| `src/data/theme-config.ts` | 6 color families rotating across 30 modules |
| `src/data/module-registry.ts` | Groups flat lessons into hierarchical modules |

### Hooks
| File | Purpose |
|------|---------|
| `src/hooks/useScrollSpy.ts` | Intersection Observer for active section tracking |
| `src/hooks/useScrollRestore.ts` | Saves/restores scroll position per route |

## Modified Files
| File | Change |
|------|--------|
| `src/App.tsx` | Replaced monolithic component with ProgressProvider + NavigationProvider + AppShell |
| `src/index.css` | Added --accent-h, --accent-s, --accent-l CSS custom properties |

## Preserved Files (not modified)
- All 33 module data files in `src/data/modules/`
- All shadcn/ui components in `src/components/ui/`
- `src/data/types.ts` and `src/data/index.ts`
- `src/components/Sidebar.tsx` and `src/components/LessonView.tsx` (legacy, kept for reference)
- All config files (vite, tailwind, tsconfig, etc.)
