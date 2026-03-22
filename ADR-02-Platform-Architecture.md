# ADR-02: Modernize Platform Architecture & Navigation Experience

## Status
**Implemented** (March 2026)

## Context
The original training app was a single-session React app with no URL routing, no progress persistence, and a sidebar that unmounted completely when closed. Users lost all progress on page refresh, couldn't bookmark or share individual lessons, and had to rely on monospace body text that reduced reading speed by 10-15%. These UX issues were cataloged across multiple design audits (DESIGN-AUDIT.md, CONSOLIDATED-AUDIT-REPORT.md) and prioritized as "Workstream A" quick wins.

This ADR consolidates the following original granular ADR candidates:
- ADR-001 (Inter font), ADR-002 (localStorage persistence), ADR-003 (decouple nav from completion),
  ADR-008 (URL routing), ADR-010 (collapsed sidebar rail)

## Decision
Implement a robust client-side navigation and state persistence architecture:

1. **Hash-Based Routing** — Custom `parseHash()`/`hashForView()` functions in App.tsx providing deep-linkable URLs: `#dashboard`, `#module/{moduleId}`, `#lesson/{moduleId}/{lessonId}`. Browser back/forward navigation works natively.

2. **localStorage Progress Persistence** — `ProgressContext.tsx` with key `mav-progress-v3` tracks per-module completion, quiz scores, exercise status, notes, scroll positions, and timestamps. Graceful fallback if storage unavailable.

3. **Persistent Sidebar Rail** — Desktop: sidebar collapses but remains in DOM (no `return null`). Mobile: overlay modal with backdrop. Navigation context always accessible.

4. **Typography Correction** — Inter as body/sans-serif font (`--font-sans`), JetBrains Mono reserved for headings (brand identity) and `<pre><code>` blocks only. Removed inline monospace override from root element.

5. **Decoupled Navigation and Completion** — "Next Lesson" button navigates only. "Mark Complete" requires explicit user action; quizzes must be attempted before marking a lesson complete (`canComplete = !lesson.quiz || quizAttempted`).

6. **Keyboard Navigation** — Arrow key handlers for lesson progression (WCAG 2.1 SC 2.1.1 compliance).

## Consequences

### Positive
- Users retain progress across sessions (zero data loss on refresh)
- Individual lessons are bookmarkable and shareable via URL
- Reading speed improved ~10-15% by switching from monospace to proportional body text
- Keyboard-only users can navigate the entire curriculum
- Sidebar maintains spatial context during module navigation

### Negative
- Progress tied to browser — clearing cache or switching browsers resets state
- Hash routing URLs are less clean than path-based routing (acceptable for a client-side-only app)

## Verification
All 13 items from the design audit (Workstream A) have been implemented and verified in the codebase:
- `training-app/src/App.tsx` — hash routing, keyboard handlers
- `training-app/src/contexts/ProgressContext.tsx` — localStorage persistence
- `training-app/src/components/LessonView.tsx` — decoupled completion
- `training-app/src/layouts/AppShell.tsx` — persistent sidebar
- `training-app/src/themes/tokens.css` — Inter font configuration
