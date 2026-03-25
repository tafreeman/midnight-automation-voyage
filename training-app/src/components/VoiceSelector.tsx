import { useEffect, type CSSProperties } from "react";
import { useNarration } from "../hooks/useNarration";

interface VoiceSelectorProps {
  onVoiceChange?: (voice: string, speed: number) => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

const SAMPLE_TEXT =
  "This is a preview of the selected voice and speed setting.";

const containerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.35rem 0.5rem",
  borderRadius: "0.5rem",
  background: "var(--surface-elevated)",
  border: "1px solid var(--border-subtle)",
  fontSize: "0.8125rem",
  fontFamily: "var(--font-sans)",
  color: "var(--text-primary)",
  flexWrap: "wrap",
};

const selectStyle: CSSProperties = {
  background: "var(--surface-primary)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "0.375rem",
  padding: "0.25rem 0.4rem",
  fontSize: "0.8125rem",
  fontFamily: "inherit",
  maxWidth: "14rem",
  cursor: "pointer",
  outline: "none",
};

const speedBtnBase: CSSProperties = {
  background: "transparent",
  border: "1px solid var(--border-subtle)",
  borderRadius: "0.25rem",
  padding: "0.15rem 0.45rem",
  fontSize: "0.75rem",
  fontFamily: "var(--font-mono)",
  cursor: "pointer",
  transition: "background 0.15s, color 0.15s",
  lineHeight: 1.4,
};

const previewBtnStyle: CSSProperties = {
  background: "var(--accent-action)",
  color: "#000",
  border: "none",
  borderRadius: "0.375rem",
  padding: "0.25rem 0.6rem",
  fontSize: "0.75rem",
  fontWeight: 600,
  cursor: "pointer",
  whiteSpace: "nowrap",
  transition: "opacity 0.15s",
};

const badgeStyle: CSSProperties = {
  background: "var(--accent-info)",
  color: "#000",
  fontSize: "0.6rem",
  fontWeight: 700,
  padding: "0.1rem 0.3rem",
  borderRadius: "0.2rem",
  lineHeight: 1,
  letterSpacing: "0.04em",
  marginLeft: "0.25rem",
  verticalAlign: "middle",
};

const labelStyle: CSSProperties = {
  color: "var(--text-muted)",
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  userSelect: "none",
};

export function VoiceSelector({ onVoiceChange }: VoiceSelectorProps) {
  const {
    playing,
    toggle,
    speed,
    setSpeed,
    voice,
    setVoice,
    availableVoices,
    serverAvailable,
  } = useNarration();

  // Notify parent when voice or speed changes
  useEffect(() => {
    onVoiceChange?.(voice, speed);
  }, [voice, speed, onVoiceChange]);

  // Group voices: edge-tts first, then browser
  const edgeVoices = availableVoices.filter((v) => v.source === "edge-tts");
  const browserVoices = availableVoices.filter((v) => v.source === "browser");

  return (
    <div style={containerStyle} role="toolbar" aria-label="Voice settings">
      {/* Voice dropdown */}
      <label style={labelStyle} htmlFor="mav-voice-select">
        Voice
      </label>
      <select
        id="mav-voice-select"
        style={selectStyle}
        value={voice}
        onChange={(e) => setVoice(e.target.value)}
        aria-label="Select voice"
      >
        <option value="">Auto</option>
        {edgeVoices.length > 0 && (
          <optgroup label="HD Voices (edge-tts)">
            {edgeVoices.map((v) => (
              <option key={`edge-${v.name}`} value={v.name}>
                {v.name} ({v.locale})
              </option>
            ))}
          </optgroup>
        )}
        {browserVoices.length > 0 && (
          <optgroup label="Browser Voices">
            {browserVoices.map((v) => (
              <option key={`browser-${v.name}`} value={v.name}>
                {v.name}
              </option>
            ))}
          </optgroup>
        )}
      </select>

      {/* HD badge indicator */}
      {voice && availableVoices.find((v) => v.name === voice)?.source === "edge-tts" && (
        <span style={badgeStyle} title="High-definition voice via edge-tts server">
          HD
        </span>
      )}

      {/* Server status dot */}
      <span
        title={serverAvailable ? "TTS server connected" : "TTS server offline - using browser voices"}
        style={{
          width: "0.5rem",
          height: "0.5rem",
          borderRadius: "50%",
          background: serverAvailable ? "#22c55e" : "var(--text-muted)",
          flexShrink: 0,
        }}
        aria-label={serverAvailable ? "TTS server connected" : "TTS server offline"}
        role="status"
      />

      {/* Speed selector */}
      <span style={{ ...labelStyle, marginLeft: "0.25rem" }}>Speed</span>
      <span style={{ display: "flex", gap: "0.2rem" }}>
        {SPEED_OPTIONS.map((s) => {
          const active = speed === s;
          return (
            <button
              key={s}
              type="button"
              style={{
                ...speedBtnBase,
                background: active ? "var(--accent-action)" : "transparent",
                color: active ? "#000" : "var(--text-muted)",
                borderColor: active ? "var(--accent-action)" : "var(--border-subtle)",
              }}
              onClick={() => setSpeed(s)}
              aria-pressed={active}
              aria-label={`Speed ${s}x`}
            >
              {s}x
            </button>
          );
        })}
      </span>

      {/* Preview button */}
      <button
        type="button"
        style={{
          ...previewBtnStyle,
          opacity: playing ? 0.7 : 1,
        }}
        onClick={() => toggle(SAMPLE_TEXT)}
        aria-label={playing ? "Stop preview" : "Preview voice"}
      >
        {playing ? "Stop" : "Preview"}
      </button>
    </div>
  );
}
