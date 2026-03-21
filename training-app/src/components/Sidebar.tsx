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
}

export function Sidebar({ lessons, currentLesson, completedLessons, onSelect, open, onToggle, progress }: SidebarProps) {
  if (!open) return null;

  return (
    <aside className="w-72 flex-shrink-0 border-r border-zinc-800 bg-zinc-950 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-sm font-bold tracking-wide text-emerald-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              PLAYWRIGHT
            </h1>
            <p className="text-[10px] text-zinc-500 tracking-widest uppercase mt-0.5">+ GitHub Copilot</p>
          </div>
          <button onClick={onToggle} className="text-zinc-600 hover:text-zinc-400 transition-colors p-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M12 12L4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-zinc-800 [&>[role=progressbar]]:bg-emerald-500" />
          <p className="text-[10px] text-zinc-600">{completedLessons.size} of {lessons.length} lessons</p>
        </div>
      </div>

      {/* Lesson List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {lessons.map((lesson, idx) => {
          const isActive = idx === currentLesson;
          const isComplete = completedLessons.has(idx);
          return (
            <button
              key={lesson.id}
              onClick={() => onSelect(idx)}
              className={`w-full text-left px-3 py-2.5 rounded-md transition-all duration-150 group flex items-start gap-2.5 ${
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
                  lesson.icon
                )}
              </span>
              <div className="min-w-0">
                <p className={`text-xs font-medium truncate ${
                  isActive ? "text-emerald-300" : isComplete ? "text-zinc-400" : "text-zinc-300 group-hover:text-zinc-100"
                }`}>
                  {lesson.title}
                </p>
                {lesson.audience && (
                  <p className={`text-[9px] mt-0.5 truncate ${
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
        <div className="flex items-center gap-2 text-[10px] text-zinc-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
          <span>Interactive Learning Guide</span>
        </div>
      </div>
    </aside>
  );
}
