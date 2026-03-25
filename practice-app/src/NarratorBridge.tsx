import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * NarratorBridge listens for postMessage commands from the training app
 * and manipulates the practice app DOM accordingly (highlight elements,
 * navigate routes, etc.). It renders nothing visible.
 *
 * Supported messages:
 *   { type: 'highlight', testId: string }  - highlight element by data-testid
 *   { type: 'navigate', path: string }     - navigate to a route path
 *   { type: 'clear' }                      - remove all highlights
 *   { type: 'ping' }                       - respond with { type: 'pong' }
 */

const HIGHLIGHT_CLASS = "narrator-highlight";
const OVERLAY_ID = "narrator-overlay";
const STYLE_ID = "narrator-bridge-styles";

const NARRATOR_STYLES = `
  .${HIGHLIGHT_CLASS} {
    position: relative;
    z-index: 10001;
    outline: 3px solid #38bdf8 !important;
    outline-offset: 3px;
    border-radius: 4px;
    animation: narrator-pulse 1.5s ease-in-out infinite;
    box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.15),
                0 0 20px rgba(56, 189, 248, 0.25);
  }

  @keyframes narrator-pulse {
    0%, 100% {
      outline-color: #38bdf8;
      box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.15),
                  0 0 20px rgba(56, 189, 248, 0.25);
    }
    50% {
      outline-color: #7dd3fc;
      box-shadow: 0 0 0 8px rgba(56, 189, 248, 0.25),
                  0 0 30px rgba(56, 189, 248, 0.35);
    }
  }

  #${OVERLAY_ID} {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background-color: rgba(0, 0, 0, 0.35);
    pointer-events: none;
    transition: opacity 0.25s ease;
  }
`;

// Allowed origins for security — accept messages from common dev ports
// and any localhost origin. In production this should be restricted.
function isAllowedOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    const hostname = url.hostname;
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname.endsWith(".localhost")
    );
  } catch {
    return false;
  }
}

export default function NarratorBridge() {
  const navigate = useNavigate();
  const activeElementRef = useRef<Element | null>(null);

  // Inject the highlight stylesheet once
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = NARRATOR_STYLES;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  const clearHighlights = useCallback(() => {
    // Remove highlight class from any previously highlighted element
    if (activeElementRef.current) {
      activeElementRef.current.classList.remove(HIGHLIGHT_CLASS);
      activeElementRef.current = null;
    }

    // Also clear any stray highlights (defensive)
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((el) => {
      el.classList.remove(HIGHLIGHT_CLASS);
    });

    // Remove overlay
    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
      overlay.remove();
    }
  }, []);

  const highlightElement = useCallback(
    (testId: string) => {
      // Clean up previous highlights first
      clearHighlights();

      const el = document.querySelector(`[data-testid="${testId}"]`);
      if (!el) return;

      // Add the dimming overlay
      const overlay = document.createElement("div");
      overlay.id = OVERLAY_ID;
      document.body.appendChild(overlay);

      // Highlight the target element
      el.classList.add(HIGHLIGHT_CLASS);
      activeElementRef.current = el;

      // Scroll into view
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [clearHighlights],
  );

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // Security: validate origin
      if (!isAllowedOrigin(event.origin)) return;

      const data = event.data;
      if (!data || typeof data !== "object" || typeof data.type !== "string") return;

      switch (data.type) {
        case "highlight": {
          if (typeof data.testId === "string") {
            highlightElement(data.testId);
          }
          break;
        }

        case "navigate": {
          if (typeof data.path === "string") {
            clearHighlights();
            navigate(data.path);
          }
          break;
        }

        case "clear": {
          clearHighlights();
          break;
        }

        case "ping": {
          // Respond with pong so the training app knows we are ready
          if (event.source && typeof (event.source as Window).postMessage === "function") {
            (event.source as Window).postMessage({ type: "pong" }, event.origin);
          }
          break;
        }

        default:
          break;
      }
    };

    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
      clearHighlights();
    };
  }, [navigate, highlightElement, clearHighlights]);

  // This component renders nothing — it is purely a side-effect listener
  return null;
}
