import { useState, type CSSProperties } from "react";

import type {
  CalloutSection,
  CodeSection,
  Section,
  TableSection,
  TextSection,
} from "../../types/curriculum";

function CodeBlock({ section }: { section: CodeSection }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(section.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="rounded-xl border" style={panelStyle}>
      {section.heading && (
        <h4 className="mb-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {section.heading}
        </h4>
      )}
      <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>
        <span>{section.language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded px-2 py-1 transition-colors"
          style={buttonGhostStyle}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className="overflow-x-auto rounded-lg px-4 py-3 text-[12px] leading-relaxed"
        style={codeStyle}
      >
        <code>{section.code}</code>
      </pre>
    </section>
  );
}

function TextBlock({ section }: { section: TextSection }) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {section.heading}
      </h3>
      <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {section.content}
      </p>
    </section>
  );
}

function CalloutBox({ section }: { section: CalloutSection }) {
  const palette =
    section.variant === "warning"
      ? {
          border: "var(--accent-highlight)",
          background: "color-mix(in srgb, var(--accent-highlight) 10%, transparent)",
          text: "var(--text-primary)",
        }
      : section.variant === "tip"
      ? {
          border: "var(--accent-info)",
          background: "color-mix(in srgb, var(--accent-info) 10%, transparent)",
          text: "var(--text-primary)",
        }
      : {
          border: "var(--accent-special)",
          background: "color-mix(in srgb, var(--accent-special) 10%, transparent)",
          text: "var(--text-primary)",
        };

  return (
    <section
      className="rounded-xl border px-4 py-3"
      style={{
        borderColor: palette.border,
        backgroundColor: palette.background,
        color: palette.text,
      }}
    >
      {section.heading && (
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>
          {section.heading}
        </h4>
      )}
      <p className="text-[13px] leading-relaxed">{section.content}</p>
    </section>
  );
}

function TableBlock({ section }: { section: TableSection }) {
  return (
    <section className="overflow-hidden rounded-xl border" style={panelStyle}>
      {section.heading && (
        <div className="border-b px-4 py-3" style={headerStyle}>
          <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {section.heading}
          </h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[12px]">
          <thead>
            <tr>
              {section.headers.map((header) => (
                <th
                  key={header}
                  className="border-b px-4 py-3 font-semibold uppercase tracking-[0.16em]"
                  style={{ color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="align-top">
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    className="border-b px-4 py-3 leading-relaxed"
                    style={{ color: "var(--text-secondary)", borderColor: "var(--border-subtle)" }}
                  >
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

function SectionRenderer({ section }: { section: Section }) {
  if (section.type === "text") return <TextBlock section={section} />;
  if (section.type === "code") return <CodeBlock section={section} />;
  if (section.type === "callout") return <CalloutBox section={section} />;
  return <TableBlock section={section as TableSection} />;
}

export function NotebookFlow({ sections }: { sections: Section[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div key={`${section.type}-${index}`}>
          <SectionRenderer section={section} />
        </div>
      ))}
    </div>
  );
}

const panelStyle: CSSProperties = {
  borderColor: "var(--border-subtle)",
  backgroundColor: "var(--surface-elevated)",
  boxShadow: "var(--shadow-elevation)",
};

const codeStyle: CSSProperties = {
  backgroundColor: "var(--surface-code)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-subtle)",
};

const headerStyle: CSSProperties = {
  backgroundColor: "var(--surface-hover)",
  borderColor: "var(--border-subtle)",
};

const buttonGhostStyle: CSSProperties = {
  color: "var(--text-secondary)",
  backgroundColor: "transparent",
  border: "1px solid var(--border-subtle)",
};
