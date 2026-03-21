import {
  ChevronRight,
  Grid2X2,
  Home,
  Menu,
  MoonStar,
  PanelLeftOpen,
  PanelRightOpen,
  SunMedium,
} from "lucide-react";
import type { Module, Lesson, ThemeName } from "../../types/curriculum";
import { useTheme } from "../../contexts/ThemeContext";

interface TopBarProps {
  module?: Module;
  lesson?: Lesson;
  leftOpen: boolean;
  rightOpen: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  onOpenDashboard: () => void;
  onOpenModuleOverview?: (moduleId: string) => void;
}

export function TopBar({
  module,
  lesson,
  leftOpen,
  rightOpen,
  onToggleLeft,
  onToggleRight,
  onOpenDashboard,
  onOpenModuleOverview,
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
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
          style={{
            borderColor: "var(--border-subtle)",
            color: "var(--text-secondary)",
          }}
        >
          <Home size={14} />
          Training App
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
        <ThemeSelector />
        <button
          type="button"
          onClick={onToggleRight}
          className="rounded-md p-2 transition-colors"
          style={{ color: "var(--text-secondary)" }}
          aria-label={rightOpen ? "Close support rail" : "Open support rail"}
        >
          {rightOpen ? <PanelRightOpen size={16} /> : <Grid2X2 size={16} />}
        </button>
      </div>
    </div>
  );
}

export function ThemeSelector() {
  const { currentTheme, preference, setPreference, themes } = useTheme();

  return (
    <label
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs"
      style={{
        borderColor: "var(--border-subtle)",
        color: "var(--text-secondary)",
      }}
    >
      {currentTheme === "arctic-steel" || currentTheme === "linear" ? (
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
    <nav className="h-full overflow-y-auto p-4 md:p-5">
      <div className="space-y-3">
        <button
          type="button"
          onClick={onOpenDashboard}
          className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors"
          style={{
            backgroundColor: "var(--surface-primary)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-primary)",
          }}
        >
          <Home size={16} style={{ color: "var(--accent-info)" }} />
          <span className="text-sm font-medium">Progress Dashboard</span>
        </button>

        {modules.map((module) => {
          const activeModule = module.id === currentModuleId;
          return (
            <div
              key={module.id}
              className="rounded-2xl border p-3"
              style={{
                backgroundColor: activeModule ? "var(--surface-primary)" : "var(--surface-elevated)",
                borderColor: activeModule ? "var(--accent-info)" : "var(--border-subtle)",
              }}
            >
              <button
                type="button"
                onClick={() => onOpenModuleOverview(module.id)}
                className="flex w-full items-center justify-between gap-3 text-left"
              >
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Module {String(module.number).padStart(2, "0")}
                  </p>
                  <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {module.title}
                  </p>
                </div>
                <span className="rounded-full border px-2 py-1 text-[10px] uppercase tracking-wider" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>
                  {module.lessons.length} lessons
                </span>
              </button>

              <div className="mt-3 space-y-1">
                {module.lessons.map((lesson) => {
                  const activeLesson = activeModule && lesson.id === currentLessonId;
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => onOpenLesson(module.id, lesson.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors"
                      style={{
                        backgroundColor: activeLesson ? "var(--surface-hover)" : "transparent",
                        color: activeLesson ? "var(--text-primary)" : "var(--text-secondary)",
                      }}
                    >
                      <span className="truncate">{lesson.title}</span>
                      <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

interface BottomBarProps {
  currentModule?: Module;
  currentLesson?: Lesson;
  lessonIndex?: number;
  totalLessons?: number;
  progressPercent?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  isCompleted?: boolean;
}

export function BottomBar({
  currentModule,
  currentLesson,
  lessonIndex,
  totalLessons,
  progressPercent,
  onPrev,
  onNext,
  onComplete,
  canGoPrev = true,
  canGoNext = true,
  isCompleted = false,
}: BottomBarProps) {
  const progressLabel =
    typeof progressPercent === "number"
      ? `${progressPercent}%`
      : currentModule && typeof lessonIndex === "number" && typeof totalLessons === "number"
      ? `${Math.round(((lessonIndex + 1) / totalLessons) * 100)}%`
      : "0%";

  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <div className="min-w-0">
        <p className="font-medium" style={{ color: "var(--text-primary)" }}>
          {currentModule?.title ?? "Training App"}
        </p>
        <p className="truncate" style={{ color: "var(--text-secondary)" }}>
          {currentLesson?.title ?? "Open a lesson to continue"} {currentModule ? `• ${progressLabel}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-2">
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
    </div>
  );
}
