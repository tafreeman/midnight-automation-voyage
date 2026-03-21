import type { Lesson } from "../data";
import { Progress } from "@/components/ui/progress";

interface SidebarProps {
  lessons: Lesson[];
  currentLesson: number;
  completedLessons: Set<number>;
  onSelect: (id: number) => void;
  open: boolean;
  onToggle: () => void;
  progress: number;
  roleFilter: "all" | "developer" | "non-coder";
  onRoleChange: (role: "all" | "developer" | "non-coder") => void;
}

export function Sidebar({ lessons, currentLesson, completedLessons, onSelect, open, onToggle, progress, roleFilter, onRoleChange }: SidebarProps) {
  if (!open) {
    return (
      <aside className="w-10 h-full bg-zinc-900/90 border-r border-zinc-800 flex flex-col items-center pt-4">
        <button
          onClick={onToggle}
          className="p-1 hover:bg-zinc-800 rounded"
          aria-label="Open sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 3h12M2 8h12M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-72 flex-shrink-0 border-r border-zinc-800 bg-zinc-950 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-sm font-bold tracking-wide text-emerald-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              PLAYWRIGHT
            </h1>
            <p className="text-xs text-zinc-500 tracking-widest uppercase mt-0.5">+ GitHub Copilot</p>
          </div>
          <button onClick={onToggle} className="text-zinc-600 hover:text-zinc-400 transition-colors p-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M12 12L4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </div>
        <div className="space-y-1.5" aria-live="polite" role="status">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-zinc-800 [&>[role=progressbar]]:bg-emerald-500" />
          <p className="text-xs text-zinc-600">{completedLessons.size} of {lessons.length} lessons</p>
        </div>
        <div className="flex gap-1 mt-3">
          {(["all", "developer", "non-coder"] as const).map((role) => (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              className={`px-2 py-1 rounded text-xs capitalize transition-colors ${
                roleFilter === role
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-zinc-500 hover:text-zinc-300 border border-transparent"
              }`}
            >
              {role === "non-coder" ? "Non-Coder" : role === "all" ? "All" : "Developer"}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {lessons.map((lesson, idx) => {
          const isActive = idx === currentLesson;
          const isComplete = completedLessons.has(idx);
          const isRelevant = roleFilter === "all" || !lesson.audience ||
            lesson.audience.toLowerCase().includes(roleFilter);
          return (
            <button
              key={lesson.id}
              onClick={() => onSelect(idx)}
              className={`w-full text-left px-3 py-2.5 rounded-md transition-all duration-150 group flex items-start gap-2.5 ${!isRelevant ? "opacity-40" : ""} ${
                isActive
                  ? "bg-emerald-500/10 border border-emerald-500/20"
                  : "hover:bg-zinc-900 border border-transparent"
              }`}
            >
              <span className="text-base mt-0.5 flex-shrink-0 w-6 text-center">
                {isComplete ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline text-emerald-400">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span role="img" aria-label={lesson.title}>{lesson.icon}</span>
                )}
              </span>
              <div className="min-w-0">
                <p className={`text-xs font-medium truncate ${
                  isActive ? "text-emerald-300" : isComplete ? "text-zinc-400" : "text-zinc-300 group-hover:text-zinc-100"
                }`}>
                  {lesson.title}
                </p>
                {lesson.audience && (
                  <p className={`text-xs mt-0.5 truncate ${
                    lesson.audience.includes("Non-Coder") ? "text-amber-500/70" : "text-zinc-600"
                  }`}>
                    {lesson.audience}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
          <span>Interactive Learning Guide</span>
        </div>
      </div>
    </aside>
  );
}
