import { useState } from "react";
import {
  Copy,
  ExternalLink,
  Lightbulb,
  ShieldAlert,
} from "lucide-react";
import type { Section } from "../../types/curriculum";

export function SectionBlock({ section }: { section: Section }) {
  if (section.type === "text") {
    return (
      <article className="space-y-3">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          {section.heading}
        </h2>
        <p className="max-w-3xl text-sm leading-8" style={{ color: "var(--text-secondary)" }}>
          {section.content}
        </p>
      </article>
    );
  }

  if (section.type === "callout") {
    const tone =
      section.variant === "warning"
        ? "var(--diff-removed-bg)"
        : section.variant === "tip"
        ? "var(--diff-added-bg)"
        : "color-mix(in srgb, var(--accent-info) 10%, transparent)";
    const accent =
      section.variant === "warning"
        ? "var(--diff-removed-text)"
        : section.variant === "tip"
        ? "var(--accent-action)"
        : "var(--accent-info)";
    return (
      <aside
        className="rounded-xl border p-5"
        style={{ backgroundColor: tone, borderColor: "var(--border-subtle)" }}
      >
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: accent }}>
          {section.variant === "warning" ? <ShieldAlert size={14} /> : <Lightbulb size={14} />}
          {section.variant}
        </div>
        {section.heading ? (
          <div className="mb-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {section.heading}
          </div>
        ) : null}
        <p className="text-sm leading-8" style={{ color: "var(--text-secondary)" }}>
          {section.content}
        </p>
      </aside>
    );
  }

  if (section.type === "table") {
    return (
      <section className="space-y-3">
        {section.heading ? (
          <h2 className="text-sm font-semibold tracking-wide" style={{ color: "var(--text-primary)" }}>
            {section.heading}
          </h2>
        ) : null}
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-subtle)" }}>
          <table className="w-full text-left text-[13px]">
            <thead style={{ backgroundColor: "var(--surface-elevated)" }}>
              <tr>
                {section.headers.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "var(--surface-code)" }}>
              {section.rows.map((row, rowIndex) => (
                <tr key={`${rowIndex}-${row.join("-")}`} className="border-t" style={{ borderColor: "var(--border-subtle)" }}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 leading-6" style={{ color: "var(--text-secondary)" }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return <CodeBlock section={section} />;
}

function CodeBlock({ section }: { section: Extract<Section, { type: "code" }> }) {
  const [copied, setCopied] = useState(false);

  return (
    <section className="space-y-3">
      {section.heading ? (
        <h2 className="text-sm font-semibold tracking-wide" style={{ color: "var(--text-primary)" }}>
          {section.heading}
        </h2>
      ) : null}
      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
        <div className="flex items-center justify-between border-b px-4 py-2 text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
          <span>{section.language}</span>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(section.code);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            }}
            className="inline-flex items-center gap-1"
            style={{ color: "var(--accent-info)" }}
          >
            <Copy size={12} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-[13px] leading-8" style={{ color: "var(--text-primary)" }}>
          <code>{section.code}</code>
        </pre>
      </div>
    </section>
  );
}

export function InlinePracticeCTA({
  url,
  label,
  description,
}: {
  url: string;
  label: string;
  description: string;
}) {
  return (
    <section
      className="rounded-xl border-l-4 p-5"
      style={{
        borderColor: "var(--accent-action)",
        backgroundColor: "color-mix(in srgb, var(--accent-action) 6%, var(--surface-primary))",
      }}
    >
      <div className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent-action)" }}>
        Practice in the app
      </div>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {description}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
        style={{
          backgroundColor: "var(--accent-action)",
          color: "var(--surface-primary)",
        }}
      >
        {label}
        <ExternalLink size={14} />
      </a>
    </section>
  );
}
