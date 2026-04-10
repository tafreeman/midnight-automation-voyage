/**
 * Custom VitePress theme
 *
 * Extends the default theme with:
 * - Outfit + Cascadia Code font pairing (DEV_REFERENCE archetype)
 * - Midnight navy accent via CSS custom properties
 * - Custom Vue components for course cards and feature grids
 */
import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import "./custom.css";

/* Custom Vue components */
import CourseCard from "./components/CourseCard.vue";
import FeatureGrid from "./components/FeatureGrid.vue";
import CodeSwitcher from "./components/CodeSwitcher.vue";

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    /* Register global components for use in markdown via <CourseCard /> */
    app.component("CourseCard", CourseCard);
    app.component("FeatureGrid", FeatureGrid);
    app.component("CodeSwitcher", CodeSwitcher);
  },
};

export default theme;
