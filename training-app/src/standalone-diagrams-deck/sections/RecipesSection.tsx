import { ScanSearch } from "lucide-react";

import { DiagramPanel, RecipeStage, RecipeStoryCard, ThemedSection } from "../shared";

export function RecipesSection() {
  return (
    <ThemedSection
      nativeTheme="handbook-notes"
      title="Deck recipes specimen"
      eyebrow="Native section theme"
      description="Recipes should read like assembled presentation strategies, not just tag clouds. These examples keep enough spacing for the layout sequence and the takeaway to feel intentional."
    >
      <DiagramPanel title="Three deck recipes" eyebrow="Assembly guide">
        <div className="space-y-5">
          <RecipeStoryCard
            title="Architecture story"
            layouts={["cover", "eng-architecture", "eng-code-flow", "checklist"]}
            outcome="Opens with context, shows tiers, then execution path and governance close."
          />
          <RecipeStoryCard
            title="Training explainer"
            layouts={["two-col", "workflow", "pillars", "stat-cards"]}
            outcome="Balances explanation, steps, principles, and recap metrics."
          />
          <RecipeStoryCard
            title="Roadmap deck"
            layouts={["cover", "eng-tech-stack", "eng-roadmap", "checklist"]}
            outcome="Moves from vision to evolution, then milestones and readiness."
          />
        </div>
      </DiagramPanel>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <DiagramPanel title="Recipe anatomy" eyebrow="How to read it">
          <div className="grid gap-4 md:grid-cols-4">
            <RecipeStage title="Open" copy="Establish the audience, stakes, and viewpoint." />
            <RecipeStage title="Orient" copy="Show the system, process, or frame before details." />
            <RecipeStage title="Prove" copy="Present evidence, examples, or execution flow." />
            <RecipeStage title="Close" copy="End with action, checklist, or next decision." />
          </div>
        </DiagramPanel>
        <DiagramPanel title="Packaging path" eyebrow="Build note">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em]" style={{ color: "var(--text-muted)" }}>
              <ScanSearch size={14} />
              Standalone deck output
            </div>
            <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
              <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>Path</div>
              <div className="mt-2 text-sm leading-7 break-all" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                standalone-dist/training/diagrams-deck.html
              </div>
            </div>
            <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
              This page is wired into the standalone single-file build path, so it ships beside the existing training outputs as a real packaged reference deck.
            </p>
          </div>
        </DiagramPanel>
      </div>
    </ThemedSection>
  );
}
