import { CheckSquare, Component, LayoutGrid, Library, Shapes } from "lucide-react";

import type { Lesson, Module } from "../types/curriculum";

export const sections = [
  { id: "layouts", title: "Layouts", subtitle: "Registered page patterns and deck structures", icon: LayoutGrid },
  { id: "components", title: "Components", subtitle: "Reusable content and navigation building blocks", icon: Component },
  { id: "lists", title: "Lists & Flows", subtitle: "Checklist, workflow, lane, and pillar structures", icon: CheckSquare },
  { id: "shapes", title: "Shapes & Connectors", subtitle: "Cards, nodes, tiers, pills, arrows, and bands", icon: Shapes },
  { id: "recipes", title: "Deck Recipes", subtitle: "How existing layouts assemble into a presentable deck", icon: Library },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const deckModule: Module = {
  id: "deck-diagrams-library",
  number: 1,
  title: "Deck Diagrams Library",
  subtitle: "A deck-ready catalog of existing layouts, components, lists, and shapes.",
  icon: "🧭",
  theme: "signal-cobalt",
  difficulty: "beginner",
  estimatedMinutes: 20,
  learningObjectives: [
    "Recognize the registry-safe layouts already defined in the repo.",
    "Reuse existing component families instead of inventing new deck primitives.",
    "Combine current layouts into deck recipes that can be packaged as standalone HTML.",
  ],
  lessons: sections.map<Lesson>((section, index) => ({
    id: section.id,
    title: section.title,
    subtitle: section.subtitle,
    estimatedMinutes: index === sections.length - 1 ? 3 : 4,
    sections: [],
  })),
};
