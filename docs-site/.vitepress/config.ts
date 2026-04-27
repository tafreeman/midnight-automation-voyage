import { defineConfig } from "vitepress";

/**
 * VitePress config for Midnight Automation Voyage docs site.
 * base must match the GitHub repo name for GitHub Pages deployment.
 */
export default defineConfig({
  title: "Midnight Automation Voyage",
  description:
    "Playwright + GitHub Copilot training platform — interactive courses teaching manual testers to write automated tests.",

  /* GitHub Pages requires base to match /<repo-name>/ */
  base: "/midnight-automation-voyage/",

  /* Build output directory — VitePress defaults to .vitepress/dist */
  outDir: "dist",

  /* Clean URLs remove the trailing .html from routes */
  cleanUrls: true,

  /* Ignore localhost links — these are for the local dev environment */
  ignoreDeadLinks: [/localhost/],

  /* Enable Mermaid diagrams */
  markdown: {
    config: (md) => {
      // Mermaid support is built into VitePress 1.0+
    },
  },

  head: [
    /* Outfit — display/body font (DEV_REFERENCE design system) */
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap",
      },
    ],
    /* Cascadia Code — monospace font for code blocks */
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cascadia+Code:wght@400;600&display=swap",
      },
    ],
    /* Favicon */
    ["link", { rel: "icon", type: "image/svg+xml", href: "/midnight-automation-voyage/favicon.svg" }],
  ],

  themeConfig: {
    logo: "/favicon.svg",
    siteTitle: "MAV Docs",

    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/guide/getting-started" },
      {
        text: "Courses",
        items: [
          { text: "Course Catalog", link: "/courses/" },
          { text: "First Playwright Tests", link: "/courses/first-playwright-tests" },
          { text: "Copilot-First Testing", link: "/courses/copilot-first-testing" },
          { text: "Build Skills", link: "/courses/build-skills" },
          { text: "Go Pro", link: "/courses/go-pro" },
        ],
      },
      { text: "Reference", link: "/reference/architecture" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Getting Started", link: "/guide/getting-started" },
            { text: "Prerequisites", link: "/guide/prerequisites" },
            { text: "Practice App", link: "/guide/practice-app" },
          ],
        },
      ],
      "/courses/": [
        {
          text: "Courses",
          items: [
            { text: "Course Catalog", link: "/courses/" },
            { text: "First Playwright Tests", link: "/courses/first-playwright-tests" },
            { text: "Copilot-First Testing", link: "/courses/copilot-first-testing" },
            { text: "Build Skills", link: "/courses/build-skills" },
            { text: "Go Pro", link: "/courses/go-pro" },
          ],
        },
      ],
      "/reference/": [
        {
          text: "Reference",
          items: [
            { text: "Architecture", link: "/reference/architecture" },
            { text: "Test Cases", link: "/reference/test-cases" },
            { text: "Changelog", link: "/reference/changelog" },
          ],
        },
        {
          text: "Contributing",
          items: [
            { text: "Contributing Guide", link: "/reference/contributing" },
            { text: "Security Policy", link: "/reference/security" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/tafreeman/midnight-automation-voyage" },
    ],

    /* VitePress built-in local search */
    search: {
      provider: "local",
    },

    footer: {
      message: "Built with VitePress · Midnight Automation Voyage",
      copyright: "Training platform for Playwright + GitHub Copilot",
    },

    editLink: {
      pattern:
        "https://github.com/tafreeman/midnight-automation-voyage/edit/main/docs-site/:path",
      text: "Edit this page on GitHub",
    },
  },
});
