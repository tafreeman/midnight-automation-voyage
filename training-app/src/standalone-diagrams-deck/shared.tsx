import type { ReactNode } from "react";
import { CheckSquare, GitBranch, Spline } from "lucide-react";

import { localThemeStyles, type LocalThemeName } from "./theme";

export function LayoutShowcase({
  layoutId,
  purpose,
  bestFor,
  nativeTheme,
  children,
}: {
  layoutId: string;
  purpose: string;
  bestFor: string;
  nativeTheme: LocalThemeName;
  children: ReactNode;
}) {
  return (
    <section
      data-local-theme={nativeTheme}
      className="rounded-2xl border p-6 md:p-8"
      style={{
        ...localThemeStyles[nativeTheme],
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--surface-elevated)",
      }}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
            Layout ID
          </div>
          <h2 className="mt-2 text-2xl font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
            {layoutId}
          </h2>
          <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
            {purpose}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <span
            className="inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{
              borderColor: "var(--border-subtle)",
              color: "var(--accent-info)",
              backgroundColor: "color-mix(in srgb, var(--surface-code) 84%, transparent)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Native theme: {nativeTheme}
          </span>
          <div className="max-w-sm text-sm leading-7" style={{ color: "var(--text-muted)" }}>
            Best for: {bestFor}
          </div>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function HeroObject({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <div
      className="min-h-[10rem] rounded-[1.5rem] border"
      style={{
        borderColor: "var(--border-subtle)",
        background: muted
          ? "linear-gradient(145deg, color-mix(in srgb, var(--surface-code) 94%, transparent), color-mix(in srgb, var(--surface-hover) 86%, transparent))"
          : "radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--accent-special) 24%, transparent), transparent 34%), linear-gradient(145deg, color-mix(in srgb, var(--accent-info) 12%, var(--surface-code)), color-mix(in srgb, var(--surface-hover) 88%, transparent))",
      }}
    >
      <div className="flex h-full items-end p-4">
        <span className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)", backgroundColor: "color-mix(in srgb, var(--surface-elevated) 88%, transparent)" }}>
          {label}
        </span>
      </div>
    </div>
  );
}

export function HubTile({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>Hub target</div>
      <div className="mt-3 text-xl font-medium" style={{ color: "var(--text-primary)" }}>{title}</div>
      <p className="mt-3 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{copy}</p>
    </div>
  );
}

export function LargePanel({
  title,
  description,
  minHeight,
}: {
  title: string;
  description: string;
  minHeight: string;
}) {
  return (
    <div className="rounded-2xl border p-6" style={{ minHeight, borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>Panel</div>
      <div className="mt-3 text-xl font-medium" style={{ color: "var(--text-primary)" }}>{title}</div>
      <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{description}</p>
    </div>
  );
}

export function MetricPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>{label}</div>
      <div className="mt-3 text-4xl font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{value}</div>
    </div>
  );
}

export function WideLane({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border p-4 md:p-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>{title}</div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {items.map((item, index) => (
          <div key={item} className="flex items-center gap-3">
            <NodeCard title={item} />
            {index < items.length - 1 ? <GitBranch size={16} style={{ color: "var(--text-muted)" }} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LargePillar({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-2xl border p-6 text-center" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>Pillar</div>
      <div className="mt-3 text-2xl font-medium" style={{ color: "var(--text-primary)" }}>{title}</div>
      <p className="mt-4 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{copy}</p>
    </div>
  );
}

export function ThemedSection({
  nativeTheme,
  eyebrow,
  title,
  description,
  children,
}: {
  nativeTheme: LocalThemeName;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      data-local-theme={nativeTheme}
      className="rounded-2xl border p-6 md:p-8"
      style={{
        ...localThemeStyles[nativeTheme],
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--surface-elevated)",
      }}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>{eyebrow}</div>
          <h2 className="mt-2 text-2xl font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{title}</h2>
          {description ? (
            <p className="mt-3 max-w-3xl text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
              {description}
            </p>
          ) : null}
        </div>
        <span
          className="inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{
            borderColor: "var(--border-subtle)",
            color: "var(--accent-info)",
            backgroundColor: "color-mix(in srgb, var(--surface-code) 84%, transparent)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Native theme: {nativeTheme}
        </span>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function DiagramPanel({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border p-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>{eyebrow}</div>
      <h2 className="mt-2 text-xl font-medium" style={{ color: "var(--text-primary)" }}>{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function BandCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{title}</div>
      <div className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>{description}</div>
    </div>
  );
}

export function NodeCard({ title }: { title: string }) {
  return (
    <div className="rounded-xl border px-4 py-3 text-sm font-medium" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)", color: "var(--text-primary)" }}>
      {title}
    </div>
  );
}

export function AccentBlock({ label, title, accent }: { label: string; title: string; accent: string }) {
  return (
    <div className="rounded-xl border-l-4 p-4" style={{ borderLeftColor: accent, backgroundColor: "var(--surface-code)", color: "var(--text-primary)" }}>
      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>{label}</div>
      <div className="mt-1 text-sm font-medium">{title}</div>
    </div>
  );
}

export function ChecklistItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <CheckSquare size={16} style={{ color: "var(--accent-action)" }} />
      <span className="text-sm" style={{ color: "var(--text-primary)" }}>{label}</span>
    </div>
  );
}

export function FlowRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map((item, index) => (
        <div key={item} className="flex items-center gap-3">
          <NodeCard title={item} />
          {index < items.length - 1 ? <GitBranch size={16} style={{ color: "var(--text-muted)" }} /> : null}
        </div>
      ))}
    </div>
  );
}

export function Lane({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>{title}</div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {items.map((item, index) => (
          <div key={item} className="flex items-center gap-3">
            <NodeCard title={item} />
            {index < items.length - 1 ? <GitBranch size={16} style={{ color: "var(--text-muted)" }} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Pillar({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border p-5 text-center" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>Pillar</div>
      <div className="mt-3 text-base font-medium" style={{ color: "var(--text-primary)" }}>{title}</div>
    </div>
  );
}

export function ShapeToken({
  icon,
  label,
  description,
}: {
  icon: ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div
        className="flex h-24 items-center justify-center rounded-xl border"
        style={{
          borderColor: "var(--border-subtle)",
          background: "linear-gradient(135deg, color-mix(in srgb, var(--accent-info) 12%, transparent), color-mix(in srgb, var(--accent-action) 10%, transparent))",
          color: "var(--accent-info)",
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2"><span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</span></div>
      <div className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>{description}</div>
    </div>
  );
}

export function ShapeSystemShowcase() {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>Composed diagram</div>
      <div className="mt-4 space-y-4">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <HeroObject label="Primary visual object" />
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
              <NodeCard title="Source" />
              <Spline size={18} style={{ color: "var(--accent-info)" }} />
              <NodeCard title="Decision" />
              <Spline size={18} style={{ color: "var(--accent-info)" }} />
              <NodeCard title="Target" />
            </div>
            <div className="space-y-3">
              <TierBand title="Experience layer" />
              <TierBand title="System layer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MiniSpecimen({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>{title}</div>
      <p className="mt-3 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{body}</p>
    </div>
  );
}

export function TierBand({ title }: { title: string }) {
  return (
    <div className="rounded-xl border px-4 py-3" style={{ borderColor: "var(--border-subtle)", backgroundColor: "color-mix(in srgb, var(--accent-info) 8%, var(--surface-code))", color: "var(--text-primary)" }}>
      {title}
    </div>
  );
}

export function ComponentCatalogCard({
  title,
  description,
  preview,
}: {
  title: string;
  description: string;
  preview: ReactNode;
}) {
  return (
    <section className="rounded-2xl border p-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>Component specimen</div>
      <h3 className="mt-2 text-xl font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{title}</h3>
      <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{description}</p>
      <div className="mt-5">{preview}</div>
    </section>
  );
}

export function StatusPill({ label, tone }: { label: string; tone: "action" | "info" | "highlight" }) {
  const color = tone === "action" ? "var(--accent-action)" : tone === "info" ? "var(--accent-info)" : "var(--accent-highlight)";
  return (
    <span className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`, color }}>
      {label}
    </span>
  );
}

export function RecipeStoryCard({ title, layouts, outcome }: { title: string; layouts: string[]; outcome: string }) {
  return (
    <div className="grid gap-4 rounded-2xl border p-5 xl:grid-cols-[1.05fr_0.95fr]" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div>
        <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>Deck recipe</div>
        <div className="mt-2 text-xl font-medium" style={{ color: "var(--text-primary)" }}>{title}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {layouts.map((layout) => (
            <span key={layout} className="inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>
              {layout}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{outcome}</p>
      </div>
      <div className="space-y-3 rounded-2xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
        {layouts.slice(0, 4).map((layout, index) => (
          <RecipeLayoutPreview key={layout} layout={layout} index={index} />
        ))}
      </div>
    </div>
  );
}

export function RecipeLayoutPreview({ layout, index }: { layout: string; index: number }) {
  const isWarm = index % 2 === 0;

  return (
    <div className="rounded-xl border p-3" style={{ borderColor: "var(--border-subtle)", backgroundColor: isWarm ? "var(--surface-code)" : "var(--surface-hover)" }}>
      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>{layout}</div>
      <div className="mt-3 grid gap-2">
        <div className="h-5 rounded-lg" style={{ background: "linear-gradient(90deg, color-mix(in srgb, var(--accent-info) 22%, transparent), color-mix(in srgb, var(--accent-action) 18%, transparent))" }} />
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-2">
          <div className="h-8 rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--text-primary) 8%, transparent)" }} />
          <div className="h-8 rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--accent-highlight) 12%, transparent)" }} />
        </div>
      </div>
    </div>
  );
}

export function RecipeStage({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>{title}</div>
      <p className="mt-3 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{copy}</p>
    </div>
  );
}
