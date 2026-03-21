# Design Audit: Midnight Automation Voyage

**Date:** March 21, 2026
**Auditor:** Claude (Design Framework Skill)
**Scope:** training-app (React + TypeScript + Tailwind + shadcn/ui) and practice-app (test target)
**Files Reviewed:** App.tsx, Sidebar.tsx, LessonView.tsx, data/types.ts, data/index.ts, index.css, App.css, plus practice-app pages (LoginPage, DashboardPage, ProductsPage) and practice-app index.css

---

## Overall Assessment

This is a **well-structured training platform** with strong content architecture (15 modular lessons, typed data layer, shadcn/ui components). The training-app has a polished dark terminal aesthetic that fits the Playwright audience. The practice-app is intentionally simple (it's a test target), which is appropriate. The biggest design opportunities are in **typography readability, accessibility gaps, and training UX flow**.

**Current Score:** 7/10 — strong foundation, but readability and a11y issues hold it back from production-grade training UX.

---

## Critical Issues (fix these first)

### 1. Monospace body text kills reading speed

**What's wrong:** `JetBrains Mono` is set on the root `<div>` in App.tsx (line 31) via inline `style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}` as the font for *all* UI text. The `index.css` loads Inter and sets it on `<body>`, but the inline style overrides it.

**Principle:** Typography research (Arditi & Cho, 2005; Bernard et al., 2003) shows monospace fonts reduce reading speed 10–15% vs. proportional fonts for prose. For a training app where users read paragraphs of instructional content, this is a meaningful comprehension hit.

**Fix:** Remove the inline `fontFamily` from App.tsx line 31. Let `body` use Inter (already loaded via Google Fonts in index.css). Keep JetBrains Mono only on:
- Headings (`h2` in LessonView line 366) for brand identity
- `<pre><code>` blocks (already scoped in index.css lines 49–51)

**Impact: High | Effort: 5 min**

---

### 2. No keyboard navigation

**What's wrong:** No `keydown` listener for ArrowLeft/ArrowRight to navigate between lessons. Users must mouse to the bottom navigation bar to advance.

**Principle:** WCAG 2.1 SC 2.1.1 (Keyboard). For a training app, keyboard-driven lesson progression is essential — users reading dense content shouldn't need to scroll + click to advance.

**Fix:** Add a `useEffect` in App.tsx:
```tsx
useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };
  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, [currentLesson]);
```

**Impact: High | Effort: 15 min**

---

### 3. Sidebar disappears completely when closed

**What's wrong:** `if (!open) return null` (Sidebar.tsx line 16) removes the entire sidebar from the DOM. There's no persistent affordance to reopen it — the only way back is the hamburger icon in LessonView's top bar, which requires visual scanning.

**Principle:** Gestalt — Continuity. Spatial consistency helps users maintain orientation. Removing an entire panel creates a jarring layout shift and removes the user's mental anchor for navigation.

**Fix:** Render a collapsed rail (~40px wide) with a toggle icon instead of `return null`. Keeps spatial consistency and provides a persistent re-open target:
```tsx
if (!open) {
  return (
    <aside className="w-10 flex-shrink-0 border-r border-zinc-800 bg-zinc-950 flex flex-col items-center py-4">
      <button onClick={onToggle} className="text-zinc-600 hover:text-zinc-400 transition-colors">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </aside>
  );
}
```

**Impact: High | Effort: 30 min**

---

### 4. `goNext()` auto-marks lesson complete

**What's wrong:** App.tsx lines 16–19: clicking "Next Lesson" calls `markComplete(currentLesson)` before advancing. If a user skips ahead to preview content, it falsely registers completion.

**Principle:** Kirkpatrick Model Level 2 — learning verification should be intentional, not incidental. Auto-completing on navigation undermines training integrity and inflates progress metrics.

**Fix:** Remove `markComplete` from `goNext()`. The explicit "Mark Complete" button in LessonView (line 429) is the correct completion path. Optionally, gate completion behind quiz/exercise submission for modules that have them.

```tsx
const goNext = () => {
  if (currentLesson < lessons.length - 1) {
    setCurrentLesson((p) => p + 1);
  }
};
```

**Impact: High (UX integrity) | Effort: 10 min**

---

## Improvements (meaningful quality uplift)

### 5. Font sizes below readability threshold

**What's wrong:** Multiple instances of `text-[9px]`, `text-[10px]`, and `text-[11px]` across Sidebar and LessonView. Nine of these are content-bearing text (audience labels, progress counters, prompt contexts), not decorative.

**Locations:**
- Sidebar.tsx line 26: `text-[10px]` — "+ GitHub Copilot" subtitle
- Sidebar.tsx line 33: `text-[10px]` — "Progress" label
- Sidebar.tsx line 38: `text-[10px]` — "X of Y lessons"
- Sidebar.tsx line 73: `text-[9px]` — audience tag
- Sidebar.tsx line 87: `text-[10px]` — footer label
- LessonView.tsx line 158: `text-[9px]` — diff legend
- LessonView.tsx line 280: `text-[11px]` — prompt context
- LessonView.tsx line 283: `text-[9px]` — "Copilot Chat Prompt" label
- LessonView.tsx line 344: `text-[9px]` — audience badge

**Principle:** WCAG recommends minimum 12px for body-adjacent text; 9–10px fails on standard-density screens.

**Fix:** Floor all content-bearing text at `text-[11px]` minimum, ideally `text-xs` (12px). Keep `text-[10px]` only for truly auxiliary labels (e.g., language tag in code block headers).

**Impact: Medium | Effort: 20 min**

---

### 6. No responsive sidebar behavior

**What's wrong:** `sidebarOpen` defaults to `true` regardless of viewport width. On screens <768px, the 288px (`w-72`) sidebar consumes 40%+ of screen width, squeezing lesson content into an unreadable column.

**Principle:** Responsive design — content-first layout adaptation. Training content is the primary payload; navigation should yield on constrained viewports.

**Fix:** Initialize `sidebarOpen` based on viewport:
```tsx
const [sidebarOpen, setSidebarOpen] = useState(
  () => window.matchMedia('(min-width: 768px)').matches
);
```
For mobile, consider an overlay/drawer pattern (shadcn/ui `Sheet` component is already installed).

**Impact: Medium | Effort: 45 min**

---

### 7. No `aria-live` for progress updates

**What's wrong:** When `completedLessons` changes, screen readers don't announce the new progress percentage. The progress bar has a `role=progressbar` via shadcn/ui, but the surrounding context ("X of Y lessons") is not in a live region.

**Principle:** WCAG 2.1 SC 4.1.3 — Status Messages.

**Fix:** Wrap the progress section in Sidebar with `aria-live="polite"`:
```tsx
<div className="space-y-1.5" aria-live="polite">
  <div className="flex justify-between text-[10px] text-zinc-500">
    <span>Progress</span>
    <span>{progress}%</span>
  </div>
  <Progress value={progress} className="h-1 bg-zinc-800 [&>[role=progressbar]]:bg-emerald-500" />
  <p className="text-[10px] text-zinc-600">{completedLessons.size} of {lessons.length} lessons</p>
</div>
```

**Impact: Medium | Effort: 10 min**

---

### 8. Quiz has no retry mechanism

**What's wrong:** Once submitted, the quiz locks permanently (`disabled={submitted}` on line 82). Users who answer incorrectly cannot retry.

**Principle:** Retrieval practice effect (Roediger & Butler, 2011) — allowing retry on incorrect answers reinforces learning more effectively than showing the answer once. Training platforms should encourage repeated engagement with knowledge checks.

**Fix:** Add a "Try Again" button that resets `selected` and `submitted` state when the answer was incorrect:
```tsx
{submitted && !isCorrect && (
  <button
    onClick={() => { setSelected(null); setSubmitted(false); }}
    className="mt-2 px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-md transition-colors"
  >
    Try Again
  </button>
)}
```

**Impact: Medium | Effort: 15 min**

---

### 9. No visual lesson progress indicator in main content

**What's wrong:** The top bar shows "01 / 15" in monospace but there's no visual progress bar in the lesson view itself. When sidebar is closed, users lose context of overall journey position.

**Principle:** Presentation Patterns — progressive disclosure of position. Reading-focused apps (Medium, Substack, Coursera) use thin progress bars to maintain orientation without interrupting content flow.

**Fix:** Add a thin progress bar at the top of LessonView:
```tsx
<div className="h-0.5 bg-zinc-800 mb-6">
  <div
    className="h-full bg-emerald-500 transition-all duration-300"
    style={{ width: `${((lessonIndex + 1) / totalLessons) * 100}%` }}
  />
</div>
```

**Impact: Low-Medium | Effort: 20 min**

---

### 10. DiffCodeBlock font size too small for code

**What's wrong:** The side-by-side code comparison uses `text-[11px]` (lines 146, 171). At this size, monospace characters become hard to distinguish (`l` vs `1`, `O` vs `0`), especially in a training context where users are learning to read code.

**Principle:** Typography — code readability. Minimum 12px for monospace in educational contexts.

**Fix:** Bump both panes to `text-[12px]`:
```
Line 146: text-[11px] → text-[12px]
Line 171: text-[11px] → text-[12px]
```

**Impact: Medium | Effort: 5 min**

---

## Polish (nice-to-have refinements)

### 11. Practice-app DashboardPage uses inline styles

DashboardPage line 20 uses `style={{ display: "flex", gap: 16, flexWrap: "wrap" }}` while the rest of the practice-app uses CSS classes from index.css. Minor inconsistency — consider adding a `.dashboard-links` class.

### 12. Module-level mutable state in LoginPage

`failCounts` (LoginPage line 5) is a module-level mutable `Record<string, number>`. Won't survive HMR in dev. Fine for a test target but worth a `// NOTE: intentional for test target` comment so future contributors don't "fix" it.

### 13. Emoji icons missing aria-labels

Lesson icons are plain emoji strings (e.g., `"👋"`, `"⚡"`). Consider wrapping in `<span role="img" aria-label="wave">👋</span>` for screen reader clarity.

---

## What's Working Well

These patterns should be **preserved** in any refactor:

- **Content architecture** — 15 typed lesson modules (`Lesson`, `Quiz`, `CodeExercise`, `PromptTemplate` interfaces), clean registry pattern in `data/index.ts`, full separation of content from presentation
- **Dual-track audience design** — Audience badges with conditional styling (amber for Non-Coder, blue for Developer), enabling role-appropriate learning paths
- **shadcn/ui foundation** — Full component library installed (50+ components). Accordion, Badge, and Progress are properly integrated. Solid base for future UI expansion
- **Code exercise UX** — DiffCodeBlock with starter→solution inline diff, progressive hint disclosure, copy-to-clipboard on all code blocks. This is the strongest UX pattern in the app
- **Practice-app as test target** — Consistent `data-testid` attributes throughout, realistic form validation with error states, session auth with lockout, multi-step checkout flow. Purpose-built for the training content it supports
- **Color system** — Emerald accent (`emerald-400`/`emerald-500`/`emerald-600`) throughout training-app, blue accent (`#2563eb`) in practice-app, consistent zinc neutrals. Cohesive and intentional
- **CSS variable architecture** — index.css uses HSL CSS custom properties for shadcn/ui theming, enabling future theme switching without component changes

---

## Summary Table

| # | Change | Impact | Effort | Priority |
|---|--------|--------|--------|----------|
| 1 | Remove monospace override — use Inter for body | High | 5 min | P0 |
| 2 | Add keyboard arrow navigation | High | 15 min | P0 |
| 3 | Collapsed sidebar rail instead of `return null` | High | 30 min | P0 |
| 4 | Decouple "Next" from auto-complete | High | 10 min | P0 |
| 5 | Floor font sizes at 11–12px minimum | Medium | 20 min | P1 |
| 6 | Responsive sidebar default for mobile | Medium | 45 min | P1 |
| 7 | `aria-live` on progress region | Medium | 10 min | P1 |
| 8 | Quiz retry for incorrect answers | Medium | 15 min | P1 |
| 9 | Reading progress bar in LessonView | Low-Med | 20 min | P2 |
| 10 | Bump code block font to 12px | Medium | 5 min | P1 |
| 11 | Dashboard inline style cleanup | Low | 5 min | P2 |
| 12 | Comment on module-level failCounts | Low | 2 min | P2 |
| 13 | Aria-labels on emoji icons | Low | 10 min | P2 |

**Total estimated effort: ~3.5 hours**

---

*Generated by Design Framework audit on March 21, 2026*
