import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  visible: boolean;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (type: ToastType, message: string) => void;
  dismissToast: (id: number) => void;
}

const ToastCtx = createContext<ToastContextValue>({
  toasts: [],
  addToast: () => {},
  dismissToast: () => {},
});

const AUTO_DISMISS_MS = 5000;
const MAX_VISIBLE = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = nextId.current++;

      // Intentional Issue #3: Toast content updates after a 200ms delay (simulates async notification)
      const placeholder: Toast = { id, type, message: "", visible: true };
      setToasts((prev) => {
        const next = [...prev, placeholder];
        // Intentional Issue #2: Rapid consecutive toasts stack beyond MAX_VISIBLE (animation timing)
        if (next.length > MAX_VISIBLE) {
          return next.slice(-MAX_VISIBLE);
        }
        return next;
      });

      // Delayed content update — simulates async notification content
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, message } : t))
        );
      }, 200);

      // Intentional Issue #1: Auto-dismiss creates race condition — toast disappears
      // before assertion can check content (flaky test surface)
      setTimeout(() => {
        dismissToast(id);
      }, AUTO_DISMISS_MS);
    },
    [dismissToast]
  );

  return (
    <ToastCtx.Provider value={{ toasts, addToast, dismissToast }}>
      {children}
      {/* Global toast container — bottom-right, stacks up to 3 */}
      <div
        data-testid="toast-container"
        className="fixed bottom-6 right-6 flex flex-col-reverse gap-2 z-[9999]"
      >
        {toasts.map((toast, index) => {
          const typeStyles: Record<ToastType, string> = {
            success: "bg-green-50 text-green-800 border border-green-200",
            error: "bg-red-50 text-red-800 border border-red-200",
            warning: "bg-amber-50 text-amber-800 border border-amber-200",
            info: "bg-blue-50 text-blue-800 border border-blue-200",
          };
          return (
            <div
              key={toast.id}
              data-testid={`toast-${index}`}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-[10px] min-w-[280px] max-w-[380px] text-[13px] font-medium shadow-lg ${typeStyles[toast.type]}`}
              style={{ animation: "toast-slide-in 0.3s ease-out" }}
            >
              <span data-testid={`toast-icon-${index}`} className="text-base flex-shrink-0">
                {toast.type === "success" && "✓"}
                {toast.type === "error" && "✕"}
                {toast.type === "warning" && "⚠"}
                {toast.type === "info" && "ℹ"}
              </span>
              <span data-testid={`toast-message-${index}`} className="flex-1">
                {toast.message}
              </span>
              <button
                data-testid={`toast-dismiss-${index}`}
                className="bg-transparent border-none text-lg cursor-pointer text-current opacity-50 hover:opacity-100 px-0.5 leading-none"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
