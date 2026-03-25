import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 29,
  title: "Component Testing for React",
  subtitle: "Fast feedback for isolated UI behavior with Playwright component tests",
  icon: "🧩",
  sections: [
    {
      heading: "Where Component Testing Fits",
      content:
        "Component testing sits between unit testing and end-to-end testing. It renders a real component in a real browser, but without booting the full app shell, navigation stack, or backend flow. That makes it useful for behaviors driven by props, events, and local state where you want fast feedback and clear failure boundaries.",
      table: {
        headers: ["Test Type", "Best For", "Tradeoff"],
        rows: [
          ["Unit", "Pure logic and small state transitions", "Little confidence in browser rendering"],
          ["Component", "Interactive UI behavior in isolation", "Limited coverage of routing and integrations"],
          ["E2E", "Full user journeys across systems", "Slower setup and broader failure surface"],
        ],
      },
    },
    {
      heading: "Mounting a React Component",
      content:
        "Playwright component testing uses a `mount()` fixture to render a component in a browser context. The key idea is simple: pass props in, interact with the UI, and assert on visible behavior. This is ideal for tabs, accordions, drawers, and other patterns where the contract is mostly contained within the component itself.",
      code: `import { test, expect } from '@playwright/experimental-ct-react';
import { Tabs } from './Tabs';

test('switches panels when a tab is clicked', async ({ mount }) => {
  const component = await mount(<Tabs defaultTab="overview" />);
  await component.getByRole('tab', { name: 'Details' }).click();
  await expect(component.getByRole('tabpanel')).toContainText('Details content');
});`,
      codeLanguage: "tsx",
      tip:
        "A good component test asserts what a user can perceive, not the component's implementation details.",
    },
    {
      heading: "What Belongs in CT vs E2E",
      content:
        "Choose a component test when the behavior depends only on props, events, and local state. Choose an end-to-end test when the behavior depends on routing, auth, server responses, or multi-page workflows. The split is about system boundaries, not team ownership.",
      callout:
        "If a behavior needs a real API, global state, or a page transition to be meaningful, it probably belongs in E2E.",
    },
    {
      heading: "Shared Utilities and Limits",
      content:
        "Component tests work best when they reuse the same naming and assertion conventions as your broader suite. They are not a replacement for E2E coverage. Treat them as a targeted speed layer for UI contracts such as keyboard support, event handling, and visible state transitions.",
      warning:
        "Do not force component tests to cover routing, auth, or backend logic just because the UI is React. Once the test depends on app infrastructure, it has crossed into E2E territory.",
    },
  ],
  quiz: {
    question: "When should you choose a component test over an E2E test?",
    options: [
      "Whenever the app is built with React",
      "When the behavior depends only on props, events, and local component state",
      "Whenever the feature includes an API call",
      "Only when a test must run in CI",
    ],
    correctIndex: 1,
    explanation:
      "Component tests are strongest when the behavior is self-contained. Once the behavior depends on routing, backend data, or shared app state, E2E usually gives truer coverage.",
  },
  exercise: {
    title: "Write a Tabs Component Test",
    description:
      "Mount the UI Lab Tabs component, switch tabs with both click and keyboard input, and assert the correct panel is visible.",
    starterCode: `import { test, expect } from '@playwright/experimental-ct-react';
import { Tabs } from '../src/components/Tabs';

test('tabs support click and keyboard navigation', async ({ mount }) => {
  const component = await mount(<Tabs defaultTab="overview" />);

  // TODO:
  // 1. Assert the overview panel is visible by default
  // 2. Click the Details tab and verify the panel changes
  // 3. Use ArrowRight to move to the next tab
});`,
    solutionCode: `import { test, expect } from '@playwright/experimental-ct-react';
import { Tabs } from '../src/components/Tabs';

test('tabs support click and keyboard navigation', async ({ mount }) => {
  const component = await mount(<Tabs defaultTab="overview" />);

  await expect(component.getByRole('tabpanel')).toContainText('Overview');

  await component.getByRole('tab', { name: 'Details' }).click();
  await expect(component.getByRole('tabpanel')).toContainText('Details');

  await component.getByRole('tab', { name: 'Details' }).press('ArrowRight');
  await expect(component.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');
});`,
    hints: [
      "Assert on the visible tab panel content, not internal component state.",
      "Use role-based locators for tabs and tab panels.",
      "Keyboard behavior is one of the best reasons to use component tests for UI patterns.",
    ],
  },
  promptTemplates: [
    {
      label: "Generate a Component Test",
      context: "Draft a Playwright CT spec for a React component.",
      prompt:
        "Generate a Playwright component test for this React component. Cover default render, prop variations, click interaction, keyboard behavior, and visible assertions. Prefer role-based locators.",
    },
    {
      label: "Choose CT or E2E",
      context: "Decide which test level best fits a behavior.",
      prompt:
        "Given this behavior description, decide whether it should be covered with a Playwright component test or an end-to-end test. Explain the boundary in terms of props, events, local state, routing, backend dependencies, and confidence needs.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/products",
    label: "Explore the Products Page",
    description:
      "Use the products page to practice testing interactive UI components like filters, cards, and list behaviors that fit well in component tests.",
  },
};
