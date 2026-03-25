import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 0,
  title: 'How Automation Works',
  subtitle: 'The workflow, the inputs, and the app you\'ll test against',
  icon: '🧭',
  sections: [
    {
      heading: 'The Record-Refine-Review Workflow',
      content: `Every automated test follows a three-step loop.\n\n**Record** — Playwright's codegen tool watches you use the app and captures each action as code. Click a button, fill a field, navigate a page — codegen writes the corresponding lines.\n\n**Refine** — Recorded code works, but it's rough. Add assertions that verify the app did the right thing. Replace fragile selectors with stable ones. Remove unnecessary steps that crept in during recording.\n\n**Review** — Run the test and read the results. Does it fail when the feature breaks? Does it pass when the feature works? Does it actually test what the ticket requires?\n\nThis loop gets faster with practice. Your first test might take 30 minutes. After a dozen, you'll finish in five.`,
      tip: 'Think of Record as getting a rough draft, Refine as editing, and Review as proofreading. The draft is never the final version.',
    },
    {
      heading: 'Three Inputs to Every Test',
      content: `Before writing a single line of code, answer three questions:\n\n**1. What to verify** — This comes from the acceptance criteria on the ticket. "User sees a success message after submitting the contact form" tells you exactly what to check.\n\n**2. How to find elements** — Locators are instructions Playwright uses to find buttons, inputs, headings, and other elements on the page. You'll learn several strategies for writing locators that survive CSS refactors.\n\n**3. What "correct" looks like** — An assertion defines the expected outcome. "The heading says Dashboard" or "The error message contains Invalid password" — these checkpoints make a test meaningful.\n\nDomain knowledge drives inputs #1 and #3. You understand the product, the users, and the edge cases. That knowledge determines what gets tested and what "correct" means.`,
      callout: 'Automation without domain knowledge produces tests that check if the app loads. Automation with domain knowledge produces tests that check if the app works correctly.',
    },
    {
      heading: 'The Practice App',
      content: `Throughout this course, every exercise targets a practice application built for learning. It has the pages and features you'd find in a real product — login, search, forms, tables, checkout — without the complexity that makes learning harder.\n\nHere's what you'll test against:`,
      table: {
        headers: ['Page', 'URL', 'What You\'ll Test'],
        rows: [
          ['Login', '/login', 'Form validation, authentication, error messages, account lockout'],
          ['Dashboard', '/dashboard', 'Post-login landing page, heading verification'],
          ['Products', '/products', 'Search, category filtering, result counts, product cards'],
          ['Contact', '/contact', 'Form submission with multiple field types, success confirmation'],
          ['Orders', '/orders', 'Data tables, sorting, filtering, pagination'],
          ['Checkout', '/checkout/shipping', 'Multi-step workflow: shipping → payment → review → confirmation'],
          ['Settings', '/settings', 'Tabbed interface, profile updates, save actions'],
          ['Admin', '/admin', 'User management, search, bulk actions (requires admin login)'],
          ['Activity', '/activity', 'Filterable activity feed, detail views'],
        ],
      },
      tip: 'Two test accounts are available: user@test.com / Password123! (editor role) and admin@test.com / AdminPass1! (admin role).',
    },
    {
      heading: 'What You\'ll Build',
      content: `This course takes you from acceptance criteria to a running test. Here's the skill progression:`,
      table: {
        headers: ['Skill', 'Lesson', 'What You\'ll Do'],
        rows: [
          ['Write assertions', 'L3: How Tests Are Structured', 'Verify outcomes with expect() — the backbone of useful tests'],
          ['Find elements', 'L4: Selectors and Locators', 'Target buttons, inputs, and tables with stable locators'],
          ['Record interactions', 'L7: Record-Refine Workflow', 'Use codegen to capture browser actions as test code'],
          ['Structure tests', 'L8: Writing Tests from Scratch', 'Organize code, improve selectors, handle edge cases'],
          ['Read results', 'L9: Page Object Model', 'Interpret test output, traces, and HTML reports'],
        ],
      },
    },
  ],
  quiz: {
    question: 'What are the three inputs every automated test needs?',
    options: [
      'What to verify, how to find elements, what "correct" looks like',
      'A URL, a username, and a password',
      'A test file, a config file, and a report file',
      'Record, refine, review',
    ],
    correctIndex: 0,
    explanation: 'Every test needs (1) what to verify — from acceptance criteria, (2) how to find elements — using locators, and (3) what "correct" looks like — defined by assertions. Record-refine-review is the workflow for building tests, not the inputs to them.',
  },
  practiceLink: {
    url: 'http://localhost:5173/login',
    label: 'Open Practice App',
    description: 'Explore the practice app you\'ll write tests against throughout this course. Log in with user@test.com / Password123! and visit each page.',
  },
  narrationScript: {
    intro: 'This course teaches you to turn acceptance criteria into automated Playwright tests. Let\'s start by looking at the app you\'ll test and the workflow you\'ll follow.',
    steps: [
      {
        text: 'This is the login page of the practice app. Every exercise in this course targets this application.',
        navigateTo: '/login',
        duration: 20,
      },
      {
        text: 'See the email input field? This is an element you\'ll write locators for — instructions that tell Playwright where to find things on the page.',
        highlight: 'email-input',
        duration: 20,
      },
      {
        text: 'The login page lets you practice form interactions: filling fields, clicking buttons, and verifying error messages or successful navigation.',
        duration: 15,
      },
      {
        text: 'Now let\'s look at the products page. This is where you\'ll practice search, filtering, and verifying result counts.',
        navigateTo: '/products',
        duration: 20,
      },
      {
        text: 'The search input is one of many elements you\'ll target. Type a query, click search, verify the results — that\'s the core pattern: act, then assert.',
        highlight: 'search-input',
        duration: 20,
      },
      {
        text: 'The orders page has a data table with sorting, filtering, and pagination. These patterns show up in almost every business application.',
        navigateTo: '/orders',
        duration: 20,
      },
      {
        text: 'Tables like this one are where domain knowledge matters most. You know which columns need sorting, which filters users rely on, and which edge cases cause bugs.',
        highlight: 'data-table',
        duration: 25,
      },
      {
        text: 'The workflow for every test is the same: Record the interaction with codegen, Refine the code by adding assertions and fixing selectors, then Review the results.',
        duration: 25,
      },
      {
        text: 'Three inputs drive every test: what to verify from the ticket, how to find elements with locators, and what "correct" looks like through assertions. Keep these in mind as you move through the course.',
        duration: 25,
      },
    ],
    outro: 'That\'s the big picture. Next, let\'s get your environment set up so you can start writing tests.',
  },
};
