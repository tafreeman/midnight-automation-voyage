import type { SectionId } from "./model";
import { sections } from "./model";

export function DiagramNav({
  activeSection,
  onOpenSection,
}: {
  activeSection: SectionId;
  onOpenSection: (sectionId: SectionId) => void;
}) {
  return (
    <nav className="module-nav h-full overflow-y-auto px-3 py-4" aria-label="Diagram deck sections">
      <div className="mb-4 rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
        <div className="text-[11px] uppercase tracking-[0.24em]" style={{ color: "var(--text-muted)" }}>
          Standalone Deck
        </div>
        <div className="mt-2 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Existing layouts only
        </div>
        <p className="mt-2 text-xs leading-6" style={{ color: "var(--text-secondary)" }}>
          This packaged deck uses the current shell, tokens, card language, and documented registry-safe layout IDs.
        </p>
      </div>

      <div className="space-y-1">
        {sections.map((section, index) => {
          const isActive = section.id === activeSection;
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onOpenSection(section.id)}
              aria-label={`View ${section.title} section`}
              aria-current={isActive ? "page" : undefined}
              className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors"
              style={{
                backgroundColor: isActive ? "var(--surface-hover)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              <span className="mt-0.5 shrink-0 font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <Icon size={16} className="mt-0.5 shrink-0" style={{ color: isActive ? "var(--accent-info)" : "var(--text-muted)" }} />
              <span className="min-w-0">
                <span className="block text-sm font-medium">{section.title}</span>
                <span className="mt-1 block text-xs leading-5" style={{ color: "var(--text-muted)" }}>
                  {section.subtitle}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
