import { ChecklistItem, DiagramPanel, FlowRow, Lane, Pillar, ThemedSection } from "../shared";

export function ListsSection() {
  return (
    <ThemedSection
      nativeTheme="linear"
      title="Lists & flows specimen"
      eyebrow="Native section theme"
      description="These patterns work best when they read as sequences, lanes, and grouped reasoning structures—not tiny utility rows. This section gives them proper pacing and room."
    >
      <div className="space-y-5">
        <DiagramPanel title="Checklist" eyebrow="List pattern">
          <div className="space-y-3">
            <ChecklistItem label="Governance close" />
            <ChecklistItem label="QA readiness" />
            <ChecklistItem label="Setup steps" />
          </div>
        </DiagramPanel>
        <DiagramPanel title="Workflow" eyebrow="List pattern">
          <FlowRow items={["Explain", "Show", "Apply", "Quiz", "Recap"]} />
        </DiagramPanel>
        <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
          <DiagramPanel title="Process lanes" eyebrow="List pattern">
            <div className="space-y-4">
              <Lane title="Authoring" items={["Prompt", "Draft", "Review"]} />
              <Lane title="Execution" items={["Run", "Inspect", "Fix"]} />
            </div>
          </DiagramPanel>
          <DiagramPanel title="Pillars" eyebrow="List pattern">
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
              <Pillar title="Trust" />
              <Pillar title="Comprehension" />
              <Pillar title="Reuse" />
            </div>
          </DiagramPanel>
        </div>
        <DiagramPanel title="Combined list system" eyebrow="Applied example">
          <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
            <div className="space-y-3 rounded-2xl border p-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
              <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>Review checklist</div>
              <ChecklistItem label="Correct target page" />
              <ChecklistItem label="Readable structure" />
              <ChecklistItem label="Executable next step" />
            </div>
            <div className="space-y-3 rounded-2xl border p-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
              <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>Flow with grouped reasoning</div>
              <FlowRow items={["Observe", "Interpret", "Refine", "Present"]} />
            </div>
          </div>
        </DiagramPanel>
      </div>
    </ThemedSection>
  );
}
