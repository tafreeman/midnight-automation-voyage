import {
  ChevronRight,
  Home,
  Menu,
  MoonStar,
  NotebookPen,
  PanelLeftOpen,
  SunMedium,
} from "lucide-react";
import type { Module, Lesson, ThemeName } from "../../types/curriculum";
import { useTheme } from "../../contexts/ThemeContext";

interface TopBarProps {
  module?: Module;
  lesson?: Lesson;
  leftOpen: boolean;
  onToggleLeft: () => void;
  onOpenDashboard: () => void;
  onOpenModuleOverview?: (moduleId: string) => void;
  onOpenNotes?: () => void;
}

export function TopBar({
  module,
  lesson,
  leftOpen,
  onToggleLeft,
  onOpenDashboard,
  onOpenModuleOverview,
  onOpenNotes,
}: TopBarProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggleLeft}
          className="rounded-md p-2 transition-colors"
          style={{ color: "var(--text-secondary)" }}
          aria-label={leftOpen ? "Close navigation" : "Open navigation"}
        >
          {leftOpen ? <Menu size={16} /> : <PanelLeftOpen size={16} />}
        </button>

        <button
          type="button"
          onClick={onOpenDashboard}
          className="rounded-md p-2 transition-colors"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Home"
        >
          <Home size={16} />
        </button>

        {module && (
          <div className="hidden min-w-0 items-center gap-1 text-xs md:flex" style={{ color: "var(--text-secondary)" }}>
            <ChevronRight size={12} />
            <button
              type="button"
              onClick={() => onOpenModuleOverview?.(module.id)}
              className="truncate rounded px-1 py-0.5 transition-colors hover:opacity-90"
              style={{ color: "var(--text-primary)" }}
            >
              Module {String(module.number).padStart(2, "0")}
            </button>
            {lesson && (
              <>
                <ChevronRight size={12} />
                <span className="truncate">{lesson.title}</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onOpenNotes && (
          <button
            type="button"
            onClick={onOpenNotes}
            className="rounded-md p-2 transition-colors"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Open notes"
          >
            <NotebookPen size={16} />
          </button>
        )}
        <ThemeSelector />
      </div>
    </div>
  );
}

export function ThemeSelector() {
  const { currentTheme, preference, setPreference, themes } = useTheme();
  const isLightTheme =
    currentTheme === "arctic-steel" ||
    currentTheme === "linear" ||
    currentTheme === "zine-pop" ||
    currentTheme === "handbook-notes";

  return (
    <label
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs"
      style={{
        borderColor: "var(--border-subtle)",
        color: "var(--text-secondary)",
      }}
    >
      {isLightTheme ? (
        <SunMedium size={14} />
      ) : (
        <MoonStar size={14} />
      )}
      <select
        value={preference}
        onChange={(event) => setPreference(event.target.value as ThemeName | "auto")}
        className="bg-transparent outline-none"
        style={{ color: "var(--text-primary)" }}
      >
        <option value="auto">Auto</option>
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
    </label>
  );
}

interface ModuleNavProps {
  modules: Module[];
  currentModuleId: string;
  currentLessonId: string;
  onOpenDashboard: () => void;
  onOpenModuleOverview: (moduleId: string) => void;
  onOpenLesson: (moduleId: string, lessonId: string) => void;
}

export function ModuleNav({
  modules,
  currentModuleId,
  currentLessonId,
  onOpenDashboard,
  onOpenModuleOverview,
  onOpenLesson,
}: ModuleNavProps) {
  return (
    <nav className="module-nav h-full overflow-y-auto px-3 py-4">
      <button
        type="button"
        onClick={onOpenDashboard}
        className="mb-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
        style={{ color: "var(--text-primary)" }}
      >
        <Home size={14} style={{ color: "var(--accent-info)" }} />
        Progress
      </button>

      <div className="space-y-0.5">
        {modules.map((module) => {
          const isActive = module.id === currentModuleId;
          return (
            <div key={module.id}>
              <button
                type="button"
                onClick={() => onOpenModuleOverview(module.id)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] transition-colors"
                style={{
                  backgroundColor: isActive ? "var(--surface-hover)" : "transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                <span className="shrink-0 font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {String(module.number).padStart(2, "0")}
                </span>
                <span className="min-w-0 truncate">{module.title}</span>
              </button>

              {isActive && (
                <div className="ml-7 space-y-0.5 py-1">
                  {module.lessons.map((lesson) => {
                    const isActiveLesson = lesson.id === currentLessonId;
                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => onOpenLesson(module.id, lesson.id)}
                        className="flex w-full items-center rounded-md px-3 py-1.5 text-left text-[13px] transition-colors"
                        style={{
                          backgroundColor: isActiveLesson ? "color-mix(in srgb, var(--accent-action) 12%, transparent)" : "transparent",
                          color: isActiveLesson ? "var(--accent-action)" : "var(--text-secondary)",
                        }}
                      >
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

interface BottomBarProps {
  onPrev?: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  isCompleted?: boolean;
}

export function BottomBar({
  onPrev,
  onNext,
  onComplete,
  canGoPrev = true,
  canGoNext = true,
  isCompleted = false,
}: BottomBarProps) {
  return (
    <div className="flex items-center justify-end gap-2 text-xs">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev}
        className="rounded-full border px-3 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
      >
        Prev
      </button>
      <button
        type="button"
        onClick={onComplete}
        className="rounded-full border px-3 py-1.5 transition-colors"
        style={{
          borderColor: "var(--accent-action)",
          color: "var(--accent-action)",
        }}
      >
        {isCompleted ? "Completed" : "Mark Complete"}
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        className="rounded-full border px-3 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
      >
        Next
      </button>
    </div>
  );
}
