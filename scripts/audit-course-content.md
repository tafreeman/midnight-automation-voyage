# Course Content Audit Prompt

Use this prompt with Claude Code to audit the entire training app curriculum for quality issues.

---

## Prompt

You are auditing the Midnight Automation Voyage training app — a React/Vite app in `training-app/`. The app has multiple courses, each with modules containing lessons. Lesson content is defined in TypeScript data files.

### Your mission

Spin off one subagent per course module to audit lesson content. Each subagent reads the module's data file and the rendered page components, then reports issues. After all subagents complete, compile a single prioritized report.

### What each subagent checks

For every module data file in `training-app/src/data/modules/` AND `training-app/src/data/courses/*/modules/`:

**1. Duplicative content**
- Same concept explained in multiple sections within the same lesson
- Identical or near-identical sentences, bullet points, or paragraphs
- Section headings that cover the same ground (e.g. "Why Assertions Matter" and "The Importance of Assertions")
- Quiz questions that test the same knowledge point twice
- Exercises that ask the learner to do essentially the same thing

**2. Redundant UI elements**
- Practice links that appear in multiple locations on the same page (e.g. both inline and in a card)
- "Active Theme" badge shown in the hero AND elsewhere — does it add value?
- Narration bar + section content saying the same thing
- Multiple navigation affordances to the same destination

**3. Content fragmentation**
- Sections that are 1-2 sentences long and could be merged with an adjacent section
- Lessons with 5+ sections where 2-3 would be clearer
- Information split across sections that only makes sense read together
- Tables with only 1-2 rows that would read better as prose
- Code blocks showing trivial one-liners that could be inline

**4. Dead or broken references**
- Practice links pointing to routes that don't exist in the practice app (check against `practice-app/src/`)
- References to files, commands, or URLs that are incorrect
- Instructions referencing UI elements that don't exist in the practice app
- Cross-references to other lessons/modules by wrong name or number

**5. Low-value content**
- Filler sentences that state the obvious: "In this section, we'll learn about X" followed by explaining X
- Empty praise or motivation that doesn't teach: "Great job!" / "You're doing amazing!"
- Hedge language that undermines confidence: "basically," "sort of," "I think"
- Sections titled "Summary" or "Recap" that just repeat prior section headings
- Callouts (tips/warnings) that don't add information beyond the surrounding text

**6. Tone violations**
Check against the tone guide in the course design plan:
- Labels learners by what they're not: "non-coder," "not a developer"
- Opens with reassurances: "Don't worry," "This isn't hard"
- Uses "superpower," "irreplaceable," "you already know," "force multiplier"
- Projects anxiety: "You might be thinking..." / "This might seem intimidating..."
- Uses empty praise after routine completions

**7. Exercise quality**
- Exercises with no clear success criteria
- Exercises that don't reference the practice app
- Missing hints or hints that give away the answer entirely
- Lab configurations pointing to wrong files or commands

### Subagent instructions

```
Read the module data file at [path].
For each lesson in the module:
  1. List every section title, type, and approximate word count
  2. List every quiz question stem (first 10 words)
  3. List every exercise title and its success criteria
  4. List every practice link URL
  5. Flag any issues from the checklist above

Output format per issue:
- FILE: [relative path]
- LESSON: [lesson title]
- SECTION: [section title or "quiz"/"exercise N"]
- ISSUE TYPE: [one of: duplicate, redundant-ui, fragmentation, broken-ref, low-value, tone, exercise-quality]
- SEVERITY: [high/medium/low]
- DESCRIPTION: [specific finding with quoted text]
- SUGGESTION: [concrete fix]
```

### Main agent: after all subagents complete

1. Deduplicate findings (same issue reported by multiple subagents)
2. Group by issue type
3. Sort by severity (high first)
4. Write the report to `docs/content-audit-report.md`
5. Print a summary: total issues by type and severity

### Files to audit

**New course structure (priority):**
- `training-app/src/data/courses/first-playwright-tests/modules/01-see-a-test-do-real-work.ts`
- `training-app/src/data/courses/first-playwright-tests/modules/02-set-up-the-workbench.ts`
- `training-app/src/data/courses/first-playwright-tests/modules/03-run-tests-from-vs-code-and-terminal.ts`
- `training-app/src/data/courses/first-playwright-tests/modules/04-read-a-test-like-evidence.ts`
- `training-app/src/data/courses/first-playwright-tests/modules/05-find-the-right-element.ts`
- `training-app/src/data/courses/first-playwright-tests/modules/06-ask-copilot-for-a-useful-draft.ts`
- `training-app/src/data/courses/first-playwright-tests/modules/07-record-a-login-flow-in-vs-code.ts`
- `training-app/src/data/courses/first-playwright-tests/modules/08-tighten-and-rerun-the-recording.ts`
- `training-app/src/data/courses/first-playwright-tests/modules/09-build-your-first-test-pack.ts`

**Legacy modules (secondary):**
- All files in `training-app/src/data/modules/*.ts`

### Also check these rendering components for redundant UI:
- `training-app/src/pages/LessonDetailPage.tsx` — are there duplicate UI elements?
- `training-app/src/pages/ModuleOverviewPage.tsx` — does the hero show info that's already in the sidebar?
- `training-app/src/components/LessonView.tsx` — any overlap with LessonDetailPage?
