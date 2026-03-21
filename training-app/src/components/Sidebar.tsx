import type { Lesson, ModuleGroup, ModuleCategory } from "../data";
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
  moduleGroups: ModuleGroup[];
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

const categoryColorClass: Record<ModuleCategory, string> = {
  foundations: "text-cat-foundations",
  core: "text-cat-core",
  workflows: "text-cat-workflows",
  advanced: "text-cat-advanced",
  devops: "text-cat-devops",
};

export function Sidebar({
  lessons,
  currentLesson,
  completedLessons,
  onSelect,
  open,
  onToggle,
  progress,
  roleFilter,
  onRoleChange,
  moduleGroups,
  theme,
  onToggleTheme,
}: SidebarProps) {
  if (!open) {
    return (
      <aside className="w-12 h-full bg-card border-r border-border flex flex-col items-center pt-4">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 4h12M3 9h12M3 14h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-76 flex-shrink-0 border-r border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-lg font-semibold text-foreground leading-tight">
              Playwright + Copilot
            </h1>
            <p className="text-muted-foreground text-xs tracking-wide uppercase mt-0.5">
              Learning Platform
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1v1M8 14v1M3.05 3.05l.71.71M12.24 12.24l.71.71M1 8h1M14 8h1M3.05 12.95l.71-.71M12.24 3.76l.71-.71"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M13.5 9.5a5.5 5.5 0 01-7-7A5.5 5.5 0 108 14a5.48 5.48 0 005.5-4.5z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={onToggle}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M12 12L4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1.5" aria-live="polite" role="status">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress
            value={progress}
            className="h-1.5 bg-muted [&>[role=progressbar]]:bg-primary"
          />
          <p className="text-xs text-muted-foreground">
            {completedLessons.size} of {lessons.length} lessons completed
          </p>
        </div>

        {/* Role filter pills */}
        <div className="flex gap-1.5 mt-3">
          {(["all", "developer", "non-coder"] as const).map((role) => {
            const isActive = roleFilter === role;
            return (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                  isActive
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "text-muted-foreground hover:text-foreground border-transparent hover:border-border"
                }`}
              >
                {role === "non-coder"
                  ? "Non-Coder"
                  : role === "all"
                    ? "All"
                    : "Developer"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lesson List — grouped by module category */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {moduleGroups.map((group) => {
          const [start, end] = group.range;
          const groupLessons = lessons.slice(start, end + 1);
          const colorClass = categoryColorClass[group.category];

          return (
            <div key={group.category}>
              {/* Section header */}
              <h2
                className={`text-xs font-semibold uppercase tracking-wider mb-1.5 px-2 ${colorClass}`}
              >
                {group.label}
              </h2>

              {/* Lessons in this group */}
              <div className="space-y-0.5">
                {groupLessons.map((lesson, localIdx) => {
                  const globalIdx = start + localIdx;
                  const isActive = globalIdx === currentLesson;
                  const isComplete = completedLessons.has(globalIdx);
                  const isRelevant =
                    roleFilter === "all" ||
                    !lesson.audience ||
                    lesson.audience.toLowerCase().includes(roleFilter);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onSelect(globalIdx)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-all duration-150 group flex items-start gap-2.5 ${
                        !isRelevant ? "opacity-40" : ""
                      } ${
                        isActive
                          ? "bg-primary/8 border-l-2 border-primary"
                          : "hover:bg-muted border-l-2 border-transparent"
                      }`}
                    >
                      <span className="text-base mt-0.5 flex-shrink-0 w-5 text-center">
                        {isComplete ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="inline text-green-600 dark:text-green-400"
                          >
                            <path
                              d="M3 8.5L6.5 12L13 4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <span role="img" aria-label={lesson.title}>
                            {lesson.icon}
                          </span>
                        )}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isActive
                              ? "text-primary"
                              : "text-foreground group-hover:text-foreground"
                          }`}
                        >
                          {lesson.title}
                        </p>
                        {lesson.audience && (
                          <p className="text-xs mt-0.5 truncate text-muted-foreground">
                            {lesson.audience}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="block w-1.5 h-1.5 rounded-full bg-primary/50" />
          <span>Interactive Learning Guide</span>
        </div>
      </div>
    </aside>
  );
}
