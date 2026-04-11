import { Grip, Library } from "lucide-react";

import {
  AccentBlock,
  BandCard,
  ComponentCatalogCard,
  DiagramPanel,
  FlowRow,
  StatusPill,
  ThemedSection,
} from "../shared";

export function ComponentsSection() {
  return (
    <ThemedSection
      nativeTheme="signal-cobalt"
      title="Components specimen"
      eyebrow="Native section theme"
      description="A polished component catalog needs both inventory and realistic composition. These examples are spaced like real deck surfaces rather than compressed reference chips."
    >
      <div className="grid gap-5 xl:grid-cols-2">
        <ComponentCatalogCard
          title="LessonHero"
          description="Compact lesson header with title, duration, objective, and completion state."
          preview={
            <div className="space-y-3 rounded-2xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
              <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>LessonHero</div>
              <div className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>Design the shell</div>
              <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                <span>12 min</span><span>•</span><span>Lesson 3 of 8</span>
              </div>
              <div className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ backgroundColor: "color-mix(in srgb, var(--accent-action) 14%, transparent)", color: "var(--accent-action)" }}>Completed</div>
            </div>
          }
        />
        <ComponentCatalogCard
          title="TopicCard"
          description="Navigable concept card with summary, progress, and a visible call to action."
          preview={
            <div className="space-y-4 rounded-2xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>Selectors that survive UI changes</div>
                  <div className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>Prefer roles and accessible names over brittle CSS selectors.</div>
                </div>
                <div className="text-xs font-semibold" style={{ color: "var(--accent-info)" }}>72%</div>
              </div>
              <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: "var(--surface-hover)" }}>
                <div className="h-full rounded-full" style={{ width: "72%", background: "linear-gradient(90deg, var(--accent-info), var(--accent-action))" }} />
              </div>
            </div>
          }
        />
        <ComponentCatalogCard
          title="LandingTile"
          description="Large navigation tile for deck targets and overview hubs with icon and CTA weight."
          preview={
            <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-hover)", color: "var(--accent-info)" }}>
                  <Library size={20} />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>Deck Patterns</div>
                  <div className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>Open the catalog of layouts, shape systems, and reusable visual structures.</div>
                </div>
              </div>
            </div>
          }
        />
        <ComponentCatalogCard
          title="CalloutBox"
          description="Strong inline emphasis block for warnings, tips, and key teaching moments."
          preview={
            <div className="space-y-3">
              <AccentBlock label="Info" title="Use registered layouts first" accent="var(--accent-info)" />
              <AccentBlock label="Important" title="A strong callout changes reading priority without shouting." accent="var(--accent-highlight)" />
            </div>
          }
        />
        <ComponentCatalogCard
          title="BadgePill"
          description="Compact status chips for state, difficulty, readiness, or completion."
          preview={
            <div className="flex flex-wrap gap-2">
              <StatusPill label="Completed" tone="action" />
              <StatusPill label="In Progress" tone="info" />
              <StatusPill label="Needs Review" tone="highlight" />
            </div>
          }
        />
        <ComponentCatalogCard
          title="ProgressIndicator"
          description="Course/module/section position shown as bars, dots, and readable status."
          preview={
            <div className="space-y-4 rounded-2xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
              <div className="text-sm" style={{ color: "var(--text-primary)" }}>Module 12 of 27</div>
              <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: "var(--surface-hover)" }}>
                <div className="h-full rounded-full" style={{ width: "44%", background: "linear-gradient(90deg, var(--accent-info), var(--accent-action))" }} />
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={`progress-dot-${i}`} className="h-2 flex-1 rounded-full" style={{ backgroundColor: i < 3 ? "var(--accent-action)" : i === 3 ? "var(--accent-info)" : "var(--surface-hover)" }} />
                ))}
              </div>
            </div>
          }
        />
        <ComponentCatalogCard title="ProcessNode" description="Single labeled step within a process lane or flow, designed to chain cleanly." preview={<FlowRow items={["Generate", "Review", "Run"]} />} />
        <ComponentCatalogCard
          title="RecapCard"
          description="Closing synthesis card with takeaways and a forward-looking next step."
          preview={
            <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
              <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>RecapCard</div>
              <div className="mt-3 text-lg font-medium" style={{ color: "var(--text-primary)" }}>Three takeaways max</div>
              <ul className="mt-4 space-y-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                <li>• One focal point per screen.</li>
                <li>• Use the registered layout before inventing a new one.</li>
                <li>• Keep supporting context secondary.</li>
              </ul>
            </div>
          }
        />
      </div>
      <div className="mt-8 grid gap-5 xl:grid-cols-3">
        <DiagramPanel title="Hero + status" eyebrow="Composition">
          <div className="min-h-[15rem] rounded-xl border p-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
            <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>LessonHero</div>
            <div className="mt-3 text-2xl font-medium" style={{ color: "var(--text-primary)" }}>Design the shell</div>
            <div className="mt-2 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>12 min • Lesson 3 of 8 • Learning objective visible at a glance with space for status and meta.</div>
            <div className="mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ backgroundColor: "color-mix(in srgb, var(--accent-action) 12%, transparent)", color: "var(--accent-action)" }}>
              Completed
            </div>
          </div>
        </DiagramPanel>
        <DiagramPanel title="Topic card" eyebrow="Composition">
          <div className="space-y-4">
            <BandCard title="TopicCard" description="Title, short summary, progress indicator, click target" />
            <div className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>
              <Grip size={12} />
              In progress
            </div>
          </div>
        </DiagramPanel>
        <DiagramPanel title="Callout + recap" eyebrow="Composition">
          <div className="space-y-3">
            <AccentBlock label="CalloutBox" title="Use registered layouts first" accent="var(--accent-info)" />
            <AccentBlock label="RecapCard" title="Three takeaways max" accent="var(--accent-action)" />
          </div>
        </DiagramPanel>
      </div>
    </ThemedSection>
  );
}
