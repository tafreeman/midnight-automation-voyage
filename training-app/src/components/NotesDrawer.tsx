import { X } from "lucide-react";
import { useProgress } from "../contexts/ProgressContext";

interface NotesDrawerProps {
  moduleId: string;
  lessonId: string;
  onClose: () => void;
}

export function NotesDrawer({ moduleId, lessonId, onClose }: NotesDrawerProps) {
  const { getNote, saveNote } = useProgress();
  const note = getNote(moduleId, lessonId);

  return (
    <>
      <button
        type="button"
        aria-label="Close notes"
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />
      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-80 flex-col border-l"
        style={{
          backgroundColor: "var(--surface-elevated)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border-subtle)" }}>
          <h2 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Lesson Notes
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 transition-colors"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Close notes"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 p-4">
          <textarea
            value={note}
            onChange={(e) => saveNote(moduleId, lessonId, e.target.value)}
            placeholder="Capture observations, risks, or follow-up actions..."
            className="h-full w-full resize-none rounded-lg border p-3 text-sm leading-relaxed outline-none"
            style={{
              backgroundColor: "var(--surface-primary)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </aside>
    </>
  );
}
