import { GitBranch } from "lucide-react";

import {
  FlowRow,
  HeroObject,
  HubTile,
  LargePanel,
  LargePillar,
  LayoutShowcase,
  MetricPanel,
  NodeCard,
  TierBand,
  WideLane,
} from "../shared";

export function LayoutsSection() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border p-6 md:p-8" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
        <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
          Scrolling specimen page
        </div>
        <h2 className="mt-2 text-2xl font-medium" style={{ color: "var(--text-primary)" }}>
          Full-size layout studies
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
          This page now behaves like a vertical catalog. Each layout is shown at an appropriate reading size so cover slides, hero moments, lanes, and architectural objects feel like real deck surfaces instead of tiny cards pretending to be one.
        </p>
      </section>

      <LayoutShowcase layoutId="cover" purpose="Full-bleed opening or title card" bestFor="Module openers and deck covers" nativeTheme="zine-pop">
        <div
          className="min-h-[24rem] rounded-[1.75rem] border p-8 md:min-h-[30rem] md:p-12"
          style={{
            borderColor: "color-mix(in srgb, var(--accent-info) 24%, var(--border-subtle))",
            background:
              "radial-gradient(circle at top left, color-mix(in srgb, var(--accent-info) 32%, transparent), transparent 36%), linear-gradient(145deg, color-mix(in srgb, var(--surface-code) 82%, transparent), color-mix(in srgb, var(--surface-elevated) 92%, transparent))",
          }}
        >
          <div className="grid min-h-full gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="text-[11px] uppercase tracking-[0.28em]" style={{ color: "var(--text-muted)" }}>
                Cover specimen
              </div>
              <h3 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                Title page / hero image scale
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-8 md:text-base" style={{ color: "var(--text-secondary)" }}>
                This is intentionally large. A cover should read like a destination surface, with enough room for title, thesis, and visual mass.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <HeroObject label="Primary focal object" />
              <HeroObject label="Supporting image mass" muted />
            </div>
          </div>
        </div>
      </LayoutShowcase>

      <LayoutShowcase layoutId="nav-hub" purpose="Navigation index with multiple targets" bestFor="Module overview and resource index" nativeTheme="linear">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <HubTile title="Layouts" copy="Deck structure catalog and page archetypes." />
          <HubTile title="Components" copy="Reusable UI building blocks and support pieces." />
          <HubTile title="Shapes" copy="Bands, nodes, connectors, and visual objects." />
        </div>
      </LayoutShowcase>

      <LayoutShowcase layoutId="two-col" purpose="Two-column split" bestFor="Content + support or comparison views" nativeTheme="signal-cobalt">
        <div className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
          <LargePanel title="Primary lane" description="Narrative content, diagrams, code explanation, worked examples, and the main teaching surface." minHeight="20rem" />
          <LargePanel title="Support lane" description="Glossary, notes, references, checkpoints, and side context that should remain secondary." minHeight="20rem" />
        </div>
      </LayoutShowcase>

      <LayoutShowcase layoutId="stat-cards" purpose="Metric grid" bestFor="Progress dashboards and recap stats" nativeTheme="gamma-dark">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricPanel label="Modules" value="27" />
          <MetricPanel label="Layouts" value="10" />
          <MetricPanel label="Shape families" value="6" />
        </div>
      </LayoutShowcase>

      <LayoutShowcase layoutId="process-lanes" purpose="Parallel swim lanes" bestFor="Multi-team workflows" nativeTheme="linear">
        <div className="space-y-4">
          <WideLane title="Design" items={["Frame", "Select", "Assemble"]} />
          <WideLane title="Build" items={["Implement", "Review", "Package"]} />
          <WideLane title="Teach" items={["Present", "Practice", "Recap"]} />
        </div>
      </LayoutShowcase>

      <LayoutShowcase layoutId="workflow" purpose="Sequential stages" bestFor="Learning path and delivery flow" nativeTheme="handbook-notes">
        <FlowRow items={["Concept", "Example", "Exercise", "Quiz", "Recap"]} />
      </LayoutShowcase>

      <LayoutShowcase layoutId="pillars" purpose="Vertical principle columns" bestFor="Strategy and concept framing" nativeTheme="handbook-notes">
        <div className="grid gap-4 md:grid-cols-3">
          <LargePillar title="Trust" copy="Real examples, accurate surfaces, stable language." />
          <LargePillar title="Clarity" copy="The reader sees the structure before the details." />
          <LargePillar title="Reuse" copy="Deck pages are composed from existing parts, not one-off art." />
        </div>
      </LayoutShowcase>

      <LayoutShowcase layoutId="eng-architecture" purpose="Layered system tiers" bestFor="Architecture topology" nativeTheme="arctic-steel">
        <div className="space-y-4">
          <TierBand title="Experience layer" />
          <TierBand title="Application layer" />
          <TierBand title="Content and automation layer" />
          <TierBand title="Delivery and packaging layer" />
        </div>
      </LayoutShowcase>

      <LayoutShowcase layoutId="eng-code-flow" purpose="Horizontal pipeline" bestFor="Execution chain or CI stages" nativeTheme="signal-cobalt">
        <div className="flex flex-wrap items-center gap-3">
          {["Prompt", "Generate", "Review", "Run", "Fix"].map((item, index, items) => (
            <div key={item} className="flex items-center gap-3">
              <NodeCard title={item} />
              {index < items.length - 1 ? <GitBranch size={16} style={{ color: "var(--text-muted)" }} /> : null}
            </div>
          ))}
        </div>
      </LayoutShowcase>

      <LayoutShowcase layoutId="shape-object-scale" purpose="Shape and object specimen" bestFor="Large hero objects, image mass, and visual anchors" nativeTheme="zine-pop">
        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <HeroObject label="Hero image mass" />
          <div className="grid gap-4">
            <HeroObject label="Supporting object" muted />
            <LargePanel title="Object note" description="Shapes and objects should occupy enough space to establish hierarchy. They are not tiny cards standing in for a full visual moment." minHeight="10rem" />
          </div>
        </div>
      </LayoutShowcase>
    </div>
  );
}
