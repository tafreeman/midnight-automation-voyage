import { useEffect, useMemo, useState } from "react";

import {
  courses,
  findLesson,
  findModule,
  findCourseForModule,
  flattenLessons,
} from "./data/curriculum";
import { ProgressProvider, useProgress } from "./contexts/ProgressContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppShell } from "./layouts/AppShell";
import {
  BottomBar,
  ModuleNav,
  TopBar,
} from "./components/navigation";
import { NotesDrawer } from "./components/NotesDrawer";
import { LessonDetailPage } from "./pages/LessonDetailPage";
import { ProgressDashboardPage } from "./pages/ProgressDashboardPage";
import { CourseSelectPage } from "./pages/CourseSelectPage";
import { ErrorBoundary } from "./components/ErrorBoundary";

type ViewState =
  | { kind: "courses" }
  | { kind: "dashboard" }
  | { kind: "module"; moduleId: string }
  | { kind: "lesson"; moduleId: string; lessonId: string };

function parseHash(hash: string): ViewState | null {
  const value = hash.replace(/^#/, "");
  if (!value) return null;
  if (value === "courses") return { kind: "courses" };
  if (value === "dashboard") return { kind: "dashboard" };

  const lessonMatch = value.match(/^lesson\/([^/]+)\/([^/]+)$/);
  if (lessonMatch) {
    return {
      kind: "lesson",
      moduleId: lessonMatch[1],
      lessonId: lessonMatch[2],
    };
  }

  const moduleMatch = value.match(/^module\/([^/]+)$/);
  if (moduleMatch) {
    return { kind: "module", moduleId: moduleMatch[1] };
  }

  return null;
}

function hashForView(view: ViewState) {
  if (view.kind === "courses") return "#courses";
  if (view.kind === "dashboard") return "#dashboard";
  if (view.kind === "module") return `#module/${view.moduleId}`;
  return `#lesson/${view.moduleId}/${view.lessonId}`;
}

function AppContent() {
  const {
    progress,
    currentModuleId,
    currentLessonId,
    navigateTo,
    markLessonComplete,
    saveQuizScore,
    getCourseCompletion,
  } = useProgress();
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 1024
  );
  const [leftOpen, setLeftOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );
  const [notesOpen, setNotesOpen] = useState(false);
  const [view, setView] = useState<ViewState>(() => {
    const fromHash =
      typeof window !== "undefined" ? parseHash(window.location.hash) : null;
    return (
      fromHash ?? { kind: "courses" }
    );
  });

  const activeCourse = useMemo(
    () =>
      findCourseForModule(
        view.kind === "lesson" || view.kind === "module" ? view.moduleId : currentModuleId
      ) ?? courses[0],
    [view, currentModuleId]
  );
  const modules = activeCourse.modules;
  const flatLessons = useMemo(() => flattenLessons(modules), [modules]);

  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      setLeftOpen(width >= 1024);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const nextHash = hashForView(view);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  }, [view]);

  useEffect(() => {
    const onHashChange = () => {
      const next = parseHash(window.location.hash);
      if (next) {
        setView(next);
        if (next.kind === "lesson") {
          navigateTo(next.moduleId, next.lessonId);
        }
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [navigateTo]);

  const activeModuleId =
    view.kind === "dashboard" || view.kind === "courses" ? currentModuleId : view.moduleId;
  const activeModule = findModule(activeModuleId);
  const activeLesson =
    view.kind === "lesson"
      ? findLesson(view.moduleId, view.lessonId)
      : findLesson(currentModuleId, currentLessonId);

  const currentLessonEntryIndex = flatLessons.findIndex(
    (entry) =>
      entry.module.id === activeModule.id && entry.lesson.id === activeLesson.id
  );
  const prevEntry =
    currentLessonEntryIndex > 0 ? flatLessons[currentLessonEntryIndex - 1] : null;
  const nextEntry =
    currentLessonEntryIndex >= 0 &&
    currentLessonEntryIndex < flatLessons.length - 1
      ? flatLessons[currentLessonEntryIndex + 1]
      : null;
  const coursePercent = getCourseCompletion(flatLessons.length);
  const completed = Boolean(
    progress.modules[activeModule.id]?.completedLessons.includes(activeLesson.id)
  );

  const openDashboard = () => setView({ kind: "dashboard" });
  const openLesson = (moduleId: string, lessonId: string) => {
    navigateTo(moduleId, lessonId);
    setView({ kind: "lesson", moduleId, lessonId });
    if (isMobile) setLeftOpen(false);
  };
  const openModuleOverview = (moduleId: string) => {
    const mod = findModule(moduleId);
    openLesson(moduleId, mod.lessons[0].id);
  };

  const titleBar = (
    <TopBar
      module={activeModule}
      lesson={view.kind === "lesson" || view.kind === "module" ? activeLesson : undefined}
      leftOpen={leftOpen}
      onToggleLeft={() => setLeftOpen((current) => !current)}
      onOpenDashboard={openDashboard}
      onOpenModuleOverview={openModuleOverview}
      onOpenNotes={view.kind === "lesson" || view.kind === "module" ? () => setNotesOpen(true) : undefined}
    />
  );

  const isLessonView = view.kind === "lesson" || view.kind === "module";
  const footerBar =
    isLessonView ? (
      <BottomBar
        onPrev={
          prevEntry
            ? () => openLesson(prevEntry.module.id, prevEntry.lesson.id)
            : undefined
        }
        onNext={
          nextEntry
            ? () => openLesson(nextEntry.module.id, nextEntry.lesson.id)
            : undefined
        }
        onComplete={() => markLessonComplete(activeModule.id, activeLesson.id)}
        canGoPrev={Boolean(prevEntry)}
        canGoNext={Boolean(nextEntry)}
        isCompleted={completed}
      />
    ) : (
      <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {view.kind === "dashboard"
          ? `${coursePercent}% of the course is complete.`
          : `Module ${String(activeModule.number).padStart(2, "0")} overview`}
      </div>
    );

  return (
    <AppShell
      titleBar={titleBar}
      footerBar={footerBar}
      leftRail={
        <ModuleNav
          modules={modules}
          currentModuleId={activeModule.id}
          currentLessonId={activeLesson.id}
          onOpenDashboard={openDashboard}
          onOpenModuleOverview={openModuleOverview}
          onOpenLesson={openLesson}
        />
      }
      isMobile={isMobile}
      leftOpen={leftOpen}
      onToggleLeft={() => setLeftOpen((current) => !current)}
    >
      {view.kind === "courses" ? (
        <CourseSelectPage
          courses={courses}
          onSelectCourse={(courseId) => {
            const course = courses.find((c) => c.id === courseId);
            if (course && course.modules.length > 0) {
              const mod = course.modules[0];
              openLesson(mod.id, mod.lessons[0].id);
            }
          }}
          onResume={() => {
            openLesson(currentModuleId, currentLessonId);
          }}
        />
      ) : view.kind === "dashboard" ? (
        <ProgressDashboardPage
          modules={modules}
          onSelectModule={openModuleOverview}
          onSelectLesson={openLesson}
        />
      ) : (
        <ErrorBoundary>
          <LessonDetailPage
            module={activeModule}
            lesson={activeLesson}
            onQuizAttempt={() => saveQuizScore(activeModule.id, activeLesson.id, 1)}
          />
        </ErrorBoundary>
      )}
      {notesOpen && (
        <NotesDrawer
          moduleId={activeModule.id}
          lessonId={activeLesson.id}
          onClose={() => setNotesOpen(false)}
        />
      )}
    </AppShell>
  );
}

export default function App() {
  const firstModule = courses[0].modules[0];
  const firstLesson = firstModule.lessons[0];

  return (
    <ThemeProvider>
      <ProgressProvider
        initialModuleId={firstModule.id}
        initialLessonId={firstLesson.id}
      >
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </ProgressProvider>
    </ThemeProvider>
  );
}
