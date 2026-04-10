# Course Catalog

Midnight Automation Voyage offers structured learning paths from beginner to advanced. Each course builds on the previous, but standalone courses can be taken independently.

## Recommended Learning Path

```
First Playwright Tests → Copilot-First Testing → Build Skills → Go Pro
     (Beginner)            (Intermediate)        (Intermediate)  (Advanced)
```

## Standalone Courses <Badge type="tip" text="Recommended" />

These self-contained courses are the best starting point. Each lesson builds on the previous with narration, quizzes, and hands-on exercises.

<script setup>
import CourseCard from '../.vitepress/theme/components/CourseCard.vue'
</script>

<CourseCard
  title="First Playwright Tests"
  level="beginner"
  :modules="10"
  status="✅ Complete"
  description="The recommended starting point for manual testers. Learn the Record-Refine-Review workflow from scratch — no prior coding experience required."
  link="/midnight-automation-voyage/courses/first-playwright-tests"
  :moduleList="[
    'See a Test Do Real Work',
    'Just Enough TypeScript & Tooling',
    'Set Up the Workbench',
    'Run Tests from VS Code & Terminal',
    'Read a Test Like Evidence',
    'Find the Right Element',
    'Ask Copilot for a Useful Draft',
    'Record a Login Flow in VS Code',
    'Tighten & Re-Run the Recording',
    'Build Your First Test Pack'
  ]"
/>

<CourseCard
  title="Copilot-First Testing"
  level="intermediate"
  :modules="10"
  status="✅ Complete"
  description="Master the prompt-driven testing workflow. Research-aligned lesson order teaches concepts before tools."
  link="/midnight-automation-voyage/courses/copilot-first-testing"
  :moduleList="[
    'How Automation Works',
    'Environment Setup',
    'Test Structure',
    'Selectors & Locators',
    'What to Automate',
    'Your Testing Toolkit',
    'Record & Refine',
    'Writing Tests',
    'Page Object Model',
    'API Testing'
  ]"
/>

## Legacy Curriculum Courses

These courses draw from the 33-module legacy library. Content is complete but some modules may lack narration.

<CourseCard
  title="Build Skills"
  level="intermediate"
  :modules="11"
  status="⚡ Partial narration"
  description="Page objects, API testing, auth fixtures, test data strategies, flaky test diagnosis, CI/CD integration, and prompt engineering templates."
  link="/midnight-automation-voyage/courses/build-skills"
  :moduleList="[
    'Prompt Templates',
    'Reading Results',
    'HITL Checklist',
    'Collaborative Authoring',
    'CI/CD Reference',
    'Auth Fixtures',
    'Visual Regression',
    'Accessibility Testing',
    'Flaky Test Diagnosis',
    'Test Data Strategies',
    'Assessment & Certification'
  ]"
/>

<CourseCard
  title="Go Pro"
  level="advanced"
  :modules="11"
  status="⚡ Partial"
  description="Advanced topics — trace viewer, mobile testing, parallel execution, multi-browser, GitHub Actions CI/CD, component testing, and custom reporters."
  link="/midnight-automation-voyage/courses/go-pro"
  :moduleList="[
    'Trace Viewer',
    'Mobile & Responsive',
    'Parallel Execution & Sharding',
    'Multi-Browser Projects',
    'Test Tagging',
    'GitHub Actions',
    'MCP & AI Agents',
    'Component Testing',
    'Performance Testing',
    'Custom Reporters',
    'Complex DOM Interactions'
  ]"
/>

## Course Comparison

| Feature | First Playwright Tests | Copilot-First Testing | Build Skills | Go Pro |
|---------|----------------------|----------------------|-------------|--------|
| Level | Beginner | Intermediate | Intermediate | Advanced |
| Modules | 10 | 10 | 11 | 11 |
| Narration | ✅ Full | ✅ Full | ⚡ Partial | ⚡ Partial |
| Quizzes | ✅ All modules | ✅ All modules | ✅ Most | ✅ Most |
| Exercises | ✅ All modules | ✅ All modules | ✅ Most | ✅ Most |
| Prerequisites | None | Basic test concepts | Course 1 or 2 | Course 3 |
| Estimated time | ~3 hours | ~3 hours | ~2 hours | ~2 hours |

## For Team Leads

### One-Week Onboarding Plan

| Day | Lessons | Activity |
|-----|---------|----------|
| **Mon** | Course 1: Lessons 1–3 | Environment setup, run example tests |
| **Tue** | Course 1: Lessons 4–6 | Test structure, selectors, elements |
| **Wed** | Course 1: Lessons 7–8 | Copilot prompts, record first test |
| **Thu** | Course 1: Lesson 9 | Refine recordings, add assertions |
| **Fri** | Course 1: Lesson 10 | Build test pack, peer review |

### Evaluating Learner Tests

Compare against reference specs in `test-cases/examples/`. Check for:

- ✅ Independent tests (each navigates on its own)
- ✅ Real assertions (`expect()` mapped to acceptance criteria)
- ✅ Stable selectors (`data-testid`, no CSS selectors)
- ✅ No `waitForTimeout` calls
- ✅ Descriptive test names
