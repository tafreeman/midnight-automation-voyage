import { useEffect, useMemo, useState } from "react";

import {
  curriculum,
  findLesson,
  findModule,
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
import { SupportRail } from "./components/layout";
import { LessonDetailPage } from "./pages/LessonDetailPage";
import { ModuleOverviewPage } from "./pages/ModuleOverviewPage";
import { ProgressDashboardPage } from "./pages/ProgressDashboardPage";

type ViewState =
  | { kind: "dashboard" }
  | { kind: "module"; moduleId: string }
  | { kind: "lesson"; moduleId: string; lessonId: string };

function parseHash(hash: string): ViewState | null {
  const value = hash.replace(/^#/, "");
  if (!value) return null;
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
  if (view.kind === "dashboard") return "#dashboard";
  if (view.kind === "module") return `#module/${view.moduleId}`;
  return `#lesson/${view.moduleId}/${view.lessonId}`;
}

function AppContent() {
  const modules = curriculum;
  const flatLessons = useMemo(() => flattenLessons(modules), [modules]);
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
  const [rightOpen, setRightOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1280
  );
  const [view, setView] = useState<ViewState>(() => {
    const fromHash =
      typeof window !== "undefined" ? parseHash(window.location.hash) : null;
    return (
      fromHash ?? {
        kind: "lesson",
        moduleId: currentModuleId,
        lessonId: currentLessonId,
      }
    );
  });

  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      setLeftOpen(width >= 1024);
      setRightOpen(width >= 1280);
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
    view.kind === "dashboard" ? currentModuleId : view.moduleId;
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
  const openModuleOverview = (moduleId: string) =>
    setView({ kind: "module", moduleId });
  const openLesson = (moduleId: string, lessonId: string) => {
    navigateTo(moduleId, lessonId);
    setView({ kind: "lesson", moduleId, lessonId });
    if (isMobile) setLeftOpen(false);
  };

  const titleBar = (
    <TopBar
      module={activeModule}
      lesson={view.kind === "lesson" ? activeLesson : undefined}
      leftOpen={leftOpen}
      rightOpen={rightOpen}
      onToggleLeft={() => setLeftOpen((current) => !current)}
      onToggleRight={() => setRightOpen((current) => !current)}
      onOpenDashboard={openDashboard}
      onOpenModuleOverview={openModuleOverview}
    />
  );

  const footerBar =
    view.kind === "lesson" ? (
      <BottomBar
        currentModule={activeModule}
        currentLesson={activeLesson}
        lessonIndex={activeModule.lessons.findIndex(
          (lesson) => lesson.id === activeLesson.id
        )}
        totalLessons={activeModule.lessons.length}
        progressPercent={coursePercent}
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
      rightRail={<SupportRail module={activeModule} lesson={activeLesson} />}
      isMobile={isMobile}
      leftOpen={leftOpen}
      rightOpen={rightOpen}
      onToggleLeft={() => setLeftOpen((current) => !current)}
      onToggleRight={() => setRightOpen((current) => !current)}
    >
      {view.kind === "dashboard" ? (
        <ProgressDashboardPage
          modules={modules}
          onSelectModule={openModuleOverview}
          onSelectLesson={openLesson}
        />
      ) : view.kind === "module" ? (
        <ModuleOverviewPage
          module={activeModule}
          onSelectLesson={(lessonId) => openLesson(activeModule.id, lessonId)}
        />
      ) : (
        <LessonDetailPage
          module={activeModule}
          lesson={activeLesson}
          lessonIndex={activeModule.lessons.findIndex(
            (lesson) => lesson.id === activeLesson.id
          )}
          onQuizAttempt={() => saveQuizScore(activeModule.id, activeLesson.id, 1)}
        />
      )}
    </AppShell>
  );
}

export default function App() {
  const firstModule = curriculum[0];
  const firstLesson = firstModule.lessons[0];

  return (
    <ThemeProvider>
      <ProgressProvider
        initialModuleId={firstModule.id}
        initialLessonId={firstLesson.id}
      >
        <AppContent />
      </ProgressProvider>
    </ThemeProvider>
  );
}
