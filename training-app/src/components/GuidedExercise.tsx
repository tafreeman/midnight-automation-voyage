import { useState, useRef, useCallback, useEffect, type CSSProperties } from "react";
import type { CodeExercise } from "../types/curriculum";

interface GuidedExerciseProps {
  exercise: CodeExercise;
  practiceAppUrl: string;
  onClose: () => void;
}

const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const;
const DEFAULT_STEP_DURATION = 5; // seconds

export default function GuidedExercise({
  exercise,
  practiceAppUrl,
  onClose,
}: GuidedExerciseProps) {
  const steps = exercise.narrationSteps ?? [];
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [iframeReady, setIframeReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.55); // left pane ratio
  const [showSolution, setShowSolution] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);

  // --- Messaging to iframe ---

  const sendMessage = useCallback(
    (message: Record<string, unknown>) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(message, practiceAppUrl);
      }
    },
    [practiceAppUrl],
  );

  const applyStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= steps.length) return;
      const step = steps[stepIndex];

      // Clear previous highlights
      sendMessage({ type: "clear" });

      // Navigate if needed
      if (step.navigateTo) {
        sendMessage({ type: "navigate", path: step.navigateTo });
      }

      // Highlight after a short delay to let navigation settle
      if (step.highlight) {
        setTimeout(() => {
          sendMessage({ type: "highlight", testId: step.highlight });
        }, step.navigateTo ? 300 : 50);
      }
    },
    [steps, sendMessage],
  );

  // --- Step navigation ---

  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= steps.length) return;
      setCurrentStep(index);
      applyStep(index);
    },
    [steps.length, applyStep],
  );

  const goNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentStep, steps.length, goToStep]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  // --- Auto-advance ---

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isPlaying && currentStep < steps.length) {
      const step = steps[currentStep];
      const baseDuration = (step.duration ?? DEFAULT_STEP_DURATION) * 1000;
      const adjustedDuration = baseDuration / speed;

      timerRef.current = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          goToStep(currentStep + 1);
        } else {
          setIsPlaying(false);
        }
      }, adjustedDuration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, speed, steps, goToStep]);

  // --- Listen for pong from iframe ---

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "pong") {
        setIframeReady(true);
        // Apply the first step once the iframe signals ready
        if (steps.length > 0) {
          applyStep(0);
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [steps.length, applyStep]);

  // Ping iframe periodically until ready
  useEffect(() => {
    if (iframeReady) return;
    const interval = setInterval(() => {
      sendMessage({ type: "ping" });
    }, 500);
    return () => clearInterval(interval);
  }, [iframeReady, sendMessage]);

  // --- Resizable split pane ---

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = moveEvent.clientX - rect.left;
      const ratio = Math.max(0.25, Math.min(0.75, x / rect.width));
      setSplitRatio(ratio);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  // --- Fullscreen toggle ---

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // --- Keyboard shortcuts ---

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen, onClose, goNext, goPrev]);

  const step = steps[currentStep];
  const hasSteps = steps.length > 0;

  return (
    <div style={overlayStyle}>
      <div
        ref={containerRef}
        style={{
          ...containerStyle,
          ...(isFullscreen ? fullscreenContainerStyle : {}),
        }}
      >
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={iconBadgeStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div>
              <h2 style={titleStyle}>{exercise.title}</h2>
              {exercise.difficulty && (
                <span style={difficultyBadgeStyle}>{exercise.difficulty}</span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {!iframeReady && (
              <span style={loadingBadgeStyle}>Connecting...</span>
            )}
            <button
              type="button"
              onClick={toggleFullscreen}
              style={headerButtonStyle}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="14" y1="10" x2="21" y2="3" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={headerButtonStyle}
              title="Close guided exercise"
              aria-label="Close guided exercise"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Split pane */}
        <div style={splitPaneStyle}>
          {/* Left: iframe */}
          <div
            style={{
              ...iframePaneStyle,
              width: `${splitRatio * 100}%`,
              ...(isFullscreen ? { width: "100%" } : {}),
            }}
          >
            <iframe
              ref={iframeRef}
              src={practiceAppUrl}
              title="Practice App"
              style={iframeStyle}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
            {!iframeReady && (
              <div style={iframeOverlayStyle}>
                <div style={spinnerContainerStyle}>
                  <div style={spinnerStyle} />
                  <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "1rem" }}>
                    Waiting for practice app...
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "0.25rem", opacity: 0.7 }}>
                    Make sure it is running at {practiceAppUrl}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Drag handle */}
          {!isFullscreen && (
            <div
              onMouseDown={handleMouseDown}
              style={dragHandleStyle}
              title="Drag to resize"
              role="separator"
              aria-orientation="vertical"
            >
              <div style={dragHandleDotStyle} />
              <div style={dragHandleDotStyle} />
              <div style={dragHandleDotStyle} />
            </div>
          )}

          {/* Right: exercise panel */}
          {!isFullscreen && (
            <div
              style={{
                ...exercisePaneStyle,
                width: `${(1 - splitRatio) * 100}%`,
              }}
            >
              <div style={exerciseContentStyle}>
                {/* Description */}
                <div style={sectionStyle}>
                  <p style={sectionLabelStyle}>Description</p>
                  <p style={descriptionStyle}>{exercise.description}</p>
                </div>

                {/* Starter Code */}
                <div style={sectionStyle}>
                  <p style={sectionLabelStyle}>Starter Code</p>
                  <pre style={codeBlockStyle}>
                    <code>{exercise.starterCode}</code>
                  </pre>
                </div>

                {/* Solution Code */}
                <div style={sectionStyle}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={sectionLabelStyle}>Solution</p>
                    <button
                      type="button"
                      onClick={() => setShowSolution((s) => !s)}
                      style={toggleSolutionButtonStyle}
                    >
                      {showSolution ? "Hide" : "Reveal"}
                    </button>
                  </div>
                  <pre
                    style={{
                      ...codeBlockStyle,
                      opacity: showSolution ? 1 : 0.3,
                      filter: showSolution ? "none" : "blur(4px)",
                      transition: "opacity 0.3s, filter 0.3s",
                    }}
                  >
                    <code>{exercise.solutionCode}</code>
                  </pre>
                </div>

                {/* Hints */}
                {exercise.hints.length > 0 && (
                  <div style={hintsSectionStyle}>
                    <p style={sectionLabelStyle}>Hints</p>
                    <ul style={hintsListStyle}>
                      {exercise.hints.map((hint) => (
                        <li key={hint} style={hintItemStyle}>
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step controls bar */}
        {hasSteps && (
          <div style={controlBarStyle}>
            <div style={controlBarInnerStyle}>
              {/* Step navigation */}
              <div style={stepNavStyle}>
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={currentStep === 0}
                  style={{
                    ...stepButtonStyle,
                    opacity: currentStep === 0 ? 0.35 : 1,
                  }}
                  aria-label="Previous step"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <span style={stepCounterStyle}>
                  Step {currentStep + 1} of {steps.length}
                </span>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={currentStep === steps.length - 1}
                  style={{
                    ...stepButtonStyle,
                    opacity: currentStep === steps.length - 1 ? 0.35 : 1,
                  }}
                  aria-label="Next step"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {/* Play/Pause */}
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                style={playButtonStyle}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                )}
                <span style={{ marginLeft: "0.375rem" }}>
                  {isPlaying ? "Pause" : "Play"}
                </span>
              </button>

              {/* Speed selector */}
              <div style={speedSelectorStyle}>
                {SPEED_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    style={{
                      ...speedButtonStyle,
                      ...(speed === s ? speedButtonActiveStyle : {}),
                    }}
                    aria-label={`Set speed to ${s}x`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Step narration text */}
            {step && (
              <div style={narrationTextStyle}>
                <span style={narrationQuoteStyle}>"</span>
                {step.text}
                <span style={narrationQuoteStyle}>"</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Styles ----------

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(4px)",
};

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "95vw",
  height: "90vh",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid var(--border-subtle)",
  backgroundColor: "var(--surface-primary)",
  boxShadow: "0 32px 80px rgba(0, 0, 0, 0.5)",
};

const fullscreenContainerStyle: CSSProperties = {
  width: "100vw",
  height: "100vh",
  borderRadius: 0,
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.75rem 1rem",
  borderBottom: "1px solid var(--border-subtle)",
  backgroundColor: "var(--surface-elevated)",
  flexShrink: 0,
};

const iconBadgeStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  backgroundColor: "color-mix(in srgb, var(--accent-action) 15%, transparent)",
  color: "var(--accent-action)",
};

const titleStyle: CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "var(--text-primary)",
  margin: 0,
};

const difficultyBadgeStyle: CSSProperties = {
  fontSize: "10px",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--text-muted)",
};

const loadingBadgeStyle: CSSProperties = {
  fontSize: "11px",
  padding: "0.25rem 0.625rem",
  borderRadius: "999px",
  backgroundColor: "color-mix(in srgb, var(--accent-highlight) 15%, transparent)",
  color: "var(--accent-highlight)",
  fontWeight: 500,
};

const headerButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: "6px",
  border: "1px solid var(--border-subtle)",
  backgroundColor: "transparent",
  color: "var(--text-secondary)",
  cursor: "pointer",
  transition: "background-color 0.15s, color 0.15s",
};

const splitPaneStyle: CSSProperties = {
  display: "flex",
  flex: 1,
  overflow: "hidden",
};

const iframePaneStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  backgroundColor: "#fff",
};

const iframeStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  border: "none",
};

const iframeOverlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "var(--surface-primary)",
};

const spinnerContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const spinnerStyle: CSSProperties = {
  width: "32px",
  height: "32px",
  border: "3px solid var(--border-subtle)",
  borderTopColor: "var(--accent-info)",
  borderRadius: "50%",
  animation: "guided-spin 0.8s linear infinite",
};

const dragHandleStyle: CSSProperties = {
  width: "8px",
  cursor: "col-resize",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "3px",
  backgroundColor: "var(--surface-elevated)",
  borderLeft: "1px solid var(--border-subtle)",
  borderRight: "1px solid var(--border-subtle)",
  flexShrink: 0,
  transition: "background-color 0.15s",
};

const dragHandleDotStyle: CSSProperties = {
  width: "3px",
  height: "3px",
  borderRadius: "50%",
  backgroundColor: "var(--text-muted)",
  opacity: 0.6,
};

const exercisePaneStyle: CSSProperties = {
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "var(--surface-primary)",
};

const exerciseContentStyle: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const sectionStyle: CSSProperties = {};

const sectionLabelStyle: CSSProperties = {
  fontSize: "10px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  color: "var(--text-muted)",
  marginBottom: "0.5rem",
};

const descriptionStyle: CSSProperties = {
  fontSize: "13px",
  lineHeight: 1.7,
  color: "var(--text-secondary)",
};

const codeBlockStyle: CSSProperties = {
  fontSize: "12px",
  lineHeight: 1.6,
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid var(--border-subtle)",
  backgroundColor: "var(--surface-code)",
  color: "var(--text-primary)",
  overflowX: "auto",
  margin: 0,
  fontFamily: "var(--font-mono)",
};

const toggleSolutionButtonStyle: CSSProperties = {
  fontSize: "11px",
  fontWeight: 500,
  padding: "0.2rem 0.5rem",
  borderRadius: "4px",
  border: "1px solid var(--border-subtle)",
  backgroundColor: "transparent",
  color: "var(--text-muted)",
  cursor: "pointer",
};

const hintsSectionStyle: CSSProperties = {
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid var(--border-subtle)",
  backgroundColor: "color-mix(in srgb, var(--accent-info) 8%, transparent)",
};

const hintsListStyle: CSSProperties = {
  margin: 0,
  paddingLeft: "1.25rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
};

const hintItemStyle: CSSProperties = {
  fontSize: "13px",
  lineHeight: 1.6,
  color: "var(--text-secondary)",
};

const controlBarStyle: CSSProperties = {
  borderTop: "1px solid var(--border-subtle)",
  backgroundColor: "var(--surface-elevated)",
  padding: "0.625rem 1rem",
  flexShrink: 0,
};

const controlBarInnerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  flexWrap: "wrap",
};

const stepNavStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const stepButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
  borderRadius: "6px",
  border: "1px solid var(--border-subtle)",
  backgroundColor: "var(--surface-hover)",
  color: "var(--text-primary)",
  cursor: "pointer",
  transition: "opacity 0.15s",
};

const stepCounterStyle: CSSProperties = {
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--text-secondary)",
  minWidth: "90px",
  textAlign: "center",
};

const playButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "0.375rem 0.75rem",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "var(--accent-action)",
  color: "var(--surface-primary)",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "opacity 0.15s",
};

const speedSelectorStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "2px",
  padding: "2px",
  borderRadius: "6px",
  backgroundColor: "var(--surface-hover)",
  marginLeft: "auto",
};

const speedButtonStyle: CSSProperties = {
  padding: "0.25rem 0.5rem",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "transparent",
  color: "var(--text-muted)",
  fontSize: "11px",
  fontWeight: 500,
  cursor: "pointer",
  transition: "background-color 0.15s, color 0.15s",
};

const speedButtonActiveStyle: CSSProperties = {
  backgroundColor: "var(--surface-elevated)",
  color: "var(--accent-info)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
};

const narrationTextStyle: CSSProperties = {
  marginTop: "0.5rem",
  fontSize: "13px",
  lineHeight: 1.6,
  color: "var(--text-primary)",
  fontStyle: "italic",
};

const narrationQuoteStyle: CSSProperties = {
  color: "var(--accent-info)",
  fontWeight: 700,
  fontSize: "16px",
};
