import type { SectionId } from "./model";
import { sections } from "./model";
import { ComponentsSection } from "./sections/ComponentsSection";
import { LayoutsSection } from "./sections/LayoutsSection";
import { ListsSection } from "./sections/ListsSection";
import { RecipesSection } from "./sections/RecipesSection";
import { ShapesSection } from "./sections/ShapesSection";

export function DiagramsDeckPage({ activeSection }: { activeSection: SectionId }) {
  const currentSection = sections.find((section) => section.id === activeSection) ?? sections[0];
  const Icon = currentSection.icon;

  return (
    <div className="space-y-8">
      <section
        className="overflow-hidden rounded-2xl border"
        style={{
          borderColor: "var(--border-subtle)",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--surface-elevated) 94%, transparent), color-mix(in srgb, var(--surface-hover) 90%, transparent))",
          boxShadow: "var(--shadow-elevation)",
        }}
      >
        <div className="space-y-5 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.28em]" style={{ color: "var(--text-muted)" }}>
            <span>Deck Viewer</span>
            <span>•</span>
            <span>Single-file output</span>
            <span>•</span>
            <span>{sections.length} diagram sets</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
              <Icon size={24} style={{ color: "var(--accent-info)" }} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                {currentSection.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                {currentSection.subtitle}. Every item shown here comes from the repo’s current design references and app vocabulary, so this can be packaged as a real standalone deck without inventing a second design language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {activeSection === "layouts" ? <LayoutsSection /> : null}
      {activeSection === "components" ? <ComponentsSection /> : null}
      {activeSection === "lists" ? <ListsSection /> : null}
      {activeSection === "shapes" ? <ShapesSection /> : null}
      {activeSection === "recipes" ? <RecipesSection /> : null}
    </div>
  );
}
