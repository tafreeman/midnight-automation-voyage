/**
 * Content Components
 * Target: training-app/src/components/content/
 *
 * Components: NotebookFlow, TextBlock, CodeBlock, DiffView,
 *             CalloutBox, TableBlock, ImageBlock
 *
 * These render typed Section[] blocks in the notebook-style
 * scrolling flow. All use semantic tokens, never raw colors.
 */

import { useState, type ReactNode } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Lightbulb, AlertTriangle, Info, Star } from 'lucide-react';
import type { Section, TextSection, CodeSection, CalloutSection, TableSection, DiffSection, ImageSection } from '../../types/curriculum';

// ─── NotebookFlow ─────────────────────────────────────────────────

/**
 * Renders an array of typed Section blocks in the notebook-style
 * interleaved flow. This is the core rendering engine for lesson content.
 */
export function NotebookFlow({ sections }: { sections: Section[] }) {
  return (
    <div className="space-y-0">
      {sections.map((section, i) => {
        // Determine spacing: larger gaps before interactive elements
        const gap = section.type === 'interactive-check' || section.type === 'guided-practice'
          ? 'var(--space-2xl)'
          : i === 0
          ? '0'
          : section.type === 'code' || section.type === 'diff'
          ? 'var(--space-md)'
          : 'var(--space-xl)';

        return (
          <div key={i} style={{ marginTop: gap }}>
            {section.type === 'text' && <TextBlock section={section} />}
            {section.type === 'code' && <CodeBlock section={section} />}
            {section.type === 'callout' && <CalloutBox section={section} />}
            {section.type === 'table' && <TableBlock section={section} />}
            {section.type === 'diff' && <DiffView section={section} />}
            {section.type === 'image' && <ImageBlock section={section} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── TextBlock ────────────────────────────────────────────────────

export function TextBlock({ section }: { section: TextSection }) {
  return (
    <section>
      <h3
        className="text-sm font-semibold mb-2 flex items-center gap-2"
        style={{ color: 'var(--text-primary)' }}
      >
        <span
          className="w-1 h-4 rounded-full inline-block flex-shrink-0"
          style={{ backgroundColor: 'var(--accent-action)' }}
        />
        {section.heading}
      </h3>
      <p
        className="text-[13px] leading-relaxed"
        style={{ color: 'var(--text-secondary)', maxWidth: 'var(--prose-max-width)' }}
      >
        {section.content}
      </p>
    </section>
  );
}

// ─── CodeBlock ────────────────────────────────────────────────────

export function CodeBlock({ section }: { section: CodeSection }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const lines = section.code.split('\n');
  const isLong = lines.length > 15;
  const displayedCode = isLong && !expanded ? lines.slice(0, 15).join('\n') : section.code;

  const copy = () => {
    navigator.clipboard.writeText(section.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--surface-code)',
        boxShadow: 'var(--code-glow)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {section.language}
          </span>
          {section.filename && (
            <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {section.filename}
            </span>
          )}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors"
          style={{ color: copied ? 'var(--accent-action)' : 'var(--text-muted)' }}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Code */}
      <pre
        className="p-4 overflow-x-auto"
        style={{ fontSize: '0.85rem', lineHeight: '1.7', fontFamily: 'var(--font-mono)' }}
      >
        <code style={{ color: 'var(--text-primary)' }}>
          {displayedCode.split('\n').map((line, i) => {
            const isHighlighted = section.highlightLines?.includes(i + 1);
            return (
              <div
                key={i}
                className={isHighlighted ? '-mx-4 px-4' : ''}
                style={{
                  backgroundColor: isHighlighted ? 'var(--diff-added-bg)' : 'transparent',
                  borderLeft: isHighlighted ? '3px solid var(--accent-action)' : '3px solid transparent',
                }}
              >
                {line || '\u00A0'}
              </div>
            );
          })}
        </code>
      </pre>

      {/* Expand/collapse for long blocks */}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-2 text-xs flex items-center justify-center gap-1 transition-colors"
          style={{
            color: 'var(--accent-info)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {expanded ? (
            <>
              <ChevronUp size={14} /> Show less
            </>
          ) : (
            <>
              <ChevronDown size={14} /> Show {lines.length - 15} more lines
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ─── DiffView ─────────────────────────────────────────────────────

export function DiffView({ section }: { section: DiffSection }) {
  const [revealed, setRevealed] = useState(false);
  const [copiedSide, setCopiedSide] = useState<'before' | 'after' | null>(null);

  const copy = (text: string, side: 'before' | 'after') => {
    navigator.clipboard.writeText(text);
    setCopiedSide(side);
    setTimeout(() => setCopiedSide(null), 2000);
  };

  const beforeLines = section.before.split('\n');
  const afterLines = section.after.split('\n');
  const beforeSet = new Set(beforeLines.map((l) => l.trim()));

  return (
    <div>
      {section.description && (
        <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
          {section.description}
        </p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Before (Your Starting Point) */}
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-code)' }}>
          <div className="flex items-center justify-between px-3 py-1.5" style={{ backgroundColor: 'var(--surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
            <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Your Starting Point</span>
            <button onClick={() => copy(section.before, 'before')} className="text-xs transition-colors" style={{ color: copiedSide === 'before' ? 'var(--accent-action)' : 'var(--text-muted)' }}>
              {copiedSide === 'before' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-3 overflow-x-auto text-xs leading-relaxed" style={{ fontFamily: 'var(--font-mono)' }}>
            <code>
              {beforeLines.map((line, i) => (
                <div key={i} style={{ color: 'var(--text-secondary)' }}>{line || '\u00A0'}</div>
              ))}
            </code>
          </pre>
        </div>

        {/* After (Solution) */}
        <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${revealed ? 'var(--accent-action)' : 'var(--border-subtle)'}`, backgroundColor: 'var(--surface-code)', transition: 'border-color 0.3s ease' }}>
          <div className="flex items-center justify-between px-3 py-1.5" style={{ backgroundColor: 'var(--surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Solution</span>
              {revealed && (
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent-action)' }}>
                  <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'var(--accent-action)' }} />
                  changed / added
                </span>
              )}
            </div>
            {revealed && (
              <button onClick={() => copy(section.after, 'after')} className="text-xs transition-colors" style={{ color: copiedSide === 'after' ? 'var(--accent-action)' : 'var(--text-muted)' }}>
                {copiedSide === 'after' ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          {revealed ? (
            <pre className="p-3 overflow-x-auto text-xs leading-relaxed" style={{ fontFamily: 'var(--font-mono)' }}>
              <code>
                {afterLines.map((line, i) => {
                  const trimmed = line.trim();
                  const isChanged = trimmed !== '' && !beforeSet.has(trimmed);
                  return (
                    <div
                      key={i}
                      className={isChanged ? '-mx-3 px-3' : ''}
                      style={{
                        color: isChanged ? 'var(--diff-added-text)' : 'var(--text-secondary)',
                        backgroundColor: isChanged ? 'var(--diff-added-bg)' : 'transparent',
                        borderLeft: isChanged ? '2px solid var(--accent-action)' : '2px solid transparent',
                      }}
                    >
                      {line || '\u00A0'}
                    </div>
                  );
                })}
              </code>
            </pre>
          ) : (
            <div className="p-8 flex items-center justify-center">
              <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
                Click "Reveal Solution" below to see the answer with changes highlighted
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3">
        <button
          onClick={() => setRevealed(!revealed)}
          className="px-4 py-2 text-xs font-medium rounded-md transition-colors"
          style={{
            backgroundColor: revealed ? 'transparent' : 'var(--accent-action)',
            color: revealed ? 'var(--text-secondary)' : 'var(--surface-primary)',
            border: revealed ? '1px solid var(--border-subtle)' : 'none',
          }}
        >
          {revealed ? 'Hide Solution' : 'Reveal Solution'}
        </button>
      </div>
    </div>
  );
}

// ─── CalloutBox ───────────────────────────────────────────────────

const CALLOUT_CONFIG = {
  tip: { icon: Lightbulb, accent: 'var(--accent-action)', label: 'Tip' },
  warning: { icon: AlertTriangle, accent: 'var(--accent-highlight)', label: 'Warning' },
  info: { icon: Info, accent: 'var(--accent-info)', label: 'Info' },
  important: { icon: Star, accent: 'var(--accent-special)', label: 'Important' },
};

export function CalloutBox({ section }: { section: CalloutSection }) {
  const config = CALLOUT_CONFIG[section.variant];
  const IconComponent = config.icon;

  return (
    <div
      className="px-4 py-3 rounded-md flex gap-3"
      style={{
        borderLeft: `4px solid ${config.accent}`,
        backgroundColor: `color-mix(in srgb, ${config.accent} 8%, var(--surface-primary))`,
      }}
    >
      <IconComponent size={16} style={{ color: config.accent, flexShrink: 0, marginTop: 2 }} />
      <div>
        <span className="text-xs font-semibold" style={{ color: config.accent }}>
          {config.label}:
        </span>{' '}
        <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {section.content}
        </span>
      </div>
    </div>
  );
}

// ─── TableBlock ───────────────────────────────────────────────────

export function TableBlock({ section }: { section: TableSection }) {
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid var(--border-subtle)' }}>
      {section.heading && (
        <div className="px-3 py-2 text-xs font-medium" style={{ backgroundColor: 'var(--surface-elevated)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
          {section.heading}
        </div>
      )}
      <table className="w-full text-xs">
        <thead>
          <tr style={{ backgroundColor: 'var(--surface-elevated)' }}>
            {section.headers.map((h, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left font-medium whitespace-nowrap"
                style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {section.rows.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: ri < section.rows.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── ImageBlock ───────────────────────────────────────────────────

export function ImageBlock({ section }: { section: ImageSection }) {
  return (
    <figure>
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
        <img src={section.src} alt={section.alt} className="w-full" loading="lazy" />
      </div>
      {section.caption && (
        <figcaption className="mt-2 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          {section.caption}
        </figcaption>
      )}
    </figure>
  );
}
