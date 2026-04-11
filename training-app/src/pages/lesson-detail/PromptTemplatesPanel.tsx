import { Sparkles } from "lucide-react";
import type { PromptTemplate } from "../../types/curriculum";

export function PromptTemplatesPanel({ templates }: { templates: PromptTemplate[] }) {
  return (
    <section className="lesson-panel lesson-panel-prompts rounded-2xl border p-5 md:p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
        <Sparkles size={14} />
        Copilot Prompts
      </div>
      <div className="space-y-3">
        {templates.map((template) => (
          <details key={template.label} className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
            <summary className="cursor-pointer list-none text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {template.label}
            </summary>
            <p className="mt-2 text-xs italic leading-6" style={{ color: "var(--text-muted)" }}>
              {template.context}
            </p>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-[13px] leading-8" style={{ color: "var(--text-secondary)" }}>
              {template.prompt}
            </pre>
          </details>
        ))}
      </div>
    </section>
  );
}
