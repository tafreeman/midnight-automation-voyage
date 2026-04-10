---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Midnight Automation Voyage
  text: Playwright + Copilot Training Platform
  tagline: Interactive courses teaching manual testers to write automated tests — from first click to CI/CD pipeline.
  actions:
    - theme: brand
      text: Get Started →
      link: /guide/getting-started
    - theme: alt
      text: Browse Courses
      link: /courses/
    - theme: alt
      text: View on GitHub
      link: https://github.com/tafreeman/midnight-automation-voyage

features:
  - icon: 🎭
    title: Real Playwright Tests
    details: Every exercise targets a live practice app with 9 pages, 12 routes, and intentional bugs. Write real tests against real UI.
  - icon: 🤖
    title: Copilot-First Workflow
    details: Learn to prompt GitHub Copilot for useful test drafts, then refine them into production-quality specs.
  - icon: 📚
    title: 55+ Interactive Modules
    details: Two standalone courses plus legacy curriculum — beginner to advanced, ~9 hours of structured content.
  - icon: 🧪
    title: Practice App Included
    details: Purpose-built test target with login, search, checkout, admin panels, and data-testid attributes throughout.
  - icon: 🎯
    title: Quizzes & Exercises
    details: Each module includes knowledge checks, hands-on coding exercises, and prompt templates you can copy into Copilot.
  - icon: 🚀
    title: Zero to CI/CD
    details: Progress from writing your first locator to running tests in GitHub Actions with parallel sharding.
---

<script setup>
import CourseCard from './.vitepress/theme/components/CourseCard.vue'
</script>

## Featured Courses

<CourseCard
  title="First Playwright Tests"
  level="beginner"
  :modules="10"
  status="Complete"
  description="The recommended starting point. Each lesson builds on the previous — from watching a test run to building your own test pack."
  link="/midnight-automation-voyage/courses/first-playwright-tests"
  :moduleList="[
    'See a Test Do Real Work',
    'Just Enough TypeScript',
    'Set Up the Workbench',
    'Run Tests from VS Code',
    'Read a Test Like Evidence',
    'Find the Right Element',
    'Ask Copilot for a Draft',
    'Record a Login Flow',
    'Tighten the Recording',
    'Build Your First Test Pack'
  ]"
/>

<CourseCard
  title="Copilot-First Testing"
  level="intermediate"
  :modules="10"
  status="Complete"
  description="Master the prompt-driven workflow — learn to get useful test code from Copilot and refine it into reliable automation."
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

## Why This Platform?

Most Playwright tutorials assume you already know JavaScript and testing concepts. **Midnight Automation Voyage** is built for manual testers who are excellent at finding bugs but new to writing code.

Every lesson starts with *what you already know* (acceptance criteria, test plans, domain knowledge) and shows how to translate that into automation — with GitHub Copilot doing the heavy lifting on syntax.

### What Makes It Different

| Feature | MAV | Typical Tutorial |
|---------|-----|-----------------|
| Target audience | Manual QA testers | Developers |
| Starting point | Acceptance criteria | Code editor |
| AI integration | Copilot-first workflow | Afterthought |
| Practice environment | Dedicated app with intentional bugs | External sites |
| Assessment | Quizzes + exercises + prompt templates | None |
| Progression | Structured curriculum (4 tiers) | Random topics |
