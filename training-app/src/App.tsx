import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { LessonView } from "./components/LessonView";
import { lessons, moduleGroups } from "./data";

type RoleFilter = "all" | "developer" | "non-coder";
type Theme = "light" | "dark";

const STORAGE_KEY = "mav-progress-v1";
const THEME_KEY = "mav-theme";

interface PersistedState {
  currentLesson: number;
  completedLessons: number[];
}

function getLessonFromHash(): number | null {
  const match = window.location.hash.match(/^#lesson\/(\d+)$/);
  if (!match) return null;
  const idx = parseInt(match[1], 10);
  return idx >= 0 && idx < lessons.length ? idx : null;
}

function loadProgress(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveProgress(current: number, completed: Set<number>) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      currentLesson: current,
      completedLessons: [...completed],
    })
  );
}

function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore
  }
  return "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem(THEME_KEY, theme);
}

export default function App() {
  const saved = loadProgress();
  const initialLesson = getLessonFromHash() ?? saved?.currentLesson ?? 0;
  const [currentLesson, setCurrentLesson] = useState(initialLesson);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(
    new Set(saved?.completedLessons ?? [])
  );
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 768
  );
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [theme, setTheme] = useState<Theme>(loadTheme);

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    saveProgress(currentLesson, completedLessons);
  }, [currentLesson, completedLessons]);

  // Sync URL hash with current lesson
  useEffect(() => {
    window.location.hash = `lesson/${currentLesson}`;
  }, [currentLesson]);

  // Listen for browser back/forward
  useEffect(() => {
    const onHashChange = () => {
      const idx = getLessonFromHash();
      if (idx !== null) setCurrentLesson(idx);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const markComplete = (id: number) => {
    setCompletedLessons((prev) => new Set([...prev, id]));
  };

  const goNext = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson((p) => p + 1);
    }
  };

  const goPrev = () => {
    if (currentLesson > 0) {
      setCurrentLesson((p) => p - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentLesson]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLessonSelect = (idx: number) => {
    setCurrentLesson(idx);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const progress = Math.round((completedLessons.size / lessons.length) * 100);

  const currentLessonData = lessons[currentLesson];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar
        lessons={lessons}
        currentLesson={currentLesson}
        completedLessons={completedLessons}
        onSelect={handleLessonSelect}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        progress={progress}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        moduleGroups={moduleGroups}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main className="flex-1 overflow-y-auto">
        <LessonView
          lesson={currentLessonData}
          lessonIndex={currentLesson}
          totalLessons={lessons.length}
          onNext={goNext}
          onPrev={goPrev}
          onComplete={() => markComplete(currentLesson)}
          isCompleted={completedLessons.has(currentLesson)}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          category={currentLessonData.category}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </main>
    </div>
  );
}
