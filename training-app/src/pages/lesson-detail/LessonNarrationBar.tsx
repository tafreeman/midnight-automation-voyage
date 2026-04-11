import { useState } from "react";
import {
  BookOpen,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { NarrationScript } from "../../types/curriculum";
import { useNarration } from "./useNarration";

export function LessonNarrationBar({ script }: { script: NarrationScript }) {
  const fullText = [
    script.intro,
    ...script.steps.map((s) => s.text),
    script.outro,
  ].filter(Boolean).join("\n\n");

  const [expanded, setExpanded] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const { playing, toggle, speed, setSpeed } = useNarration(fullText);

  return (
    <div>
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <Volume2 size={14} style={{ color: "var(--accent-info)" }} />
          Listen to this lesson
        </button>
      ) : (
        <div
          className="flex flex-wrap items-center gap-3 rounded-lg px-4 py-3"
          style={{ backgroundColor: "var(--surface-elevated)" }}
        >
          <button
            type="button"
            onClick={toggle}
            className="rounded-full p-2 transition-colors"
            style={{
              backgroundColor: playing ? "color-mix(in srgb, var(--accent-action) 15%, transparent)" : "color-mix(in srgb, var(--accent-info) 10%, transparent)",
              color: playing ? "var(--accent-action)" : "var(--accent-info)",
            }}
          >
            {playing ? <VolumeX size={16} /> : <Play size={16} />}
          </button>

          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded-md bg-transparent px-1 py-0.5 text-xs outline-none"
            style={{ color: "var(--text-secondary)" }}
          >
            {([0.75, 1, 1.25, 1.5, 2] as const).map((s) => (
              <option key={s} value={s}>{s}x</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="rounded-md p-1.5 text-xs transition-colors"
            style={{
              color: showTranscript ? "var(--accent-info)" : "var(--text-muted)",
            }}
            title={showTranscript ? "Hide transcript" : "Show transcript"}
          >
            <BookOpen size={14} />
          </button>

          <button
            type="button"
            onClick={() => { setExpanded(false); if (playing) toggle(); }}
            className="ml-auto text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Collapse
          </button>
        </div>
      )}

      {expanded && showTranscript && (
        <div
          className="mt-2 rounded-lg px-4 py-3"
          style={{ backgroundColor: "color-mix(in srgb, var(--accent-info) 3%, var(--surface-primary))" }}
        >
          <p className="text-sm leading-7 whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>
            {fullText}
          </p>
        </div>
      )}
    </div>
  );
}
