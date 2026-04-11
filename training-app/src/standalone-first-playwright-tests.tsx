/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { firstPlaywrightTestsCourse } from "./data/courses/first-playwright-tests";
import { ProgressProvider, useProgress } from "./contexts/ProgressContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppShell } from "./layouts/AppShell";
import { BottomBar, ModuleNav, TopBar } from "./components/navigation";
import { NotesDrawer } from "./components/NotesDrawer";
import { LessonDetailPage } from "./pages/LessonDetailPage";
import { ProgressDashboardPage } from "./pages/ProgressDashboardPage";
import type { Module } from "./types/curriculum";

type ViewState =
  | { kind: "dashboard" }
  | { kind: "module"; moduleId: string }
  | { kind: "lesson"; moduleId: string; lessonId: string };

function parseHash(hash: string): ViewState | null {
  const value = hash.replace(/^#/, "");
  if (!value || value === "dashboard") return { kind: "dashboard" };

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

function flattenLessons(modules: Module[]) {
  return modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      module,
      lesson,
    })),
  );
}

function findModule(modules: Module[], moduleId: string) {
  return modules.find((module) => module.id === moduleId) ?? modules[0];
}

function findLesson(modules: Module[], moduleId: string, lessonId: string) {
  const module = findModule(modules, moduleId);
  return module.lessons.find((lesson) => lesson.id === lessonId) ?? module.lessons[0];
}

function StandaloneDashboardPage({
  course,
  modules,
  onSelectModule,
  onSelectLesson,
}: {
  course: typeof firstPlaywrightTestsCourse;
  modules: Module[];
  onSelectModule: (moduleId: string) => void;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
}) {
  const lessonCount = modules.reduce((sum, module) => sum + module.lessons.length, 0);

  return (
    <div className="space-y-8">
      <section
        className="overflow-hidden rounded-2xl border"
        style={{
          borderColor: "var(--border-subtle)",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--surface-elevated) 94%, transparent), color-mix(in srgb, var(--surface-hover) 90%, transparent))",
          boxShadow: "var(--shadow-elevation)",
        }}
      >
        <div className="space-y-5 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.28em]" style={{ color: "var(--text-muted)" }}>
            <span>Standalone Course</span>
            <span>•</span>
            <span>{modules.length} modules</span>
            <span>•</span>
            <span>{lessonCount} lessons</span>
            <span>•</span>
            <span>{course.estimatedHours}h</span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
              {course.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
              {course.subtitle}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
              <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
                Browse Mode
              </div>
              <div className="mt-2 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                Open the training and practice apps as standalone HTML and follow the lesson flow without local setup pressure.
              </div>
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
              <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
                Build Mode
              </div>
              <div className="mt-2 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                Open <code>practice-app</code> in VS Code, complete the lab files, and run Playwright against the real practice routes.
              </div>
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
              <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
                Outcome
              </div>
              <div className="mt-2 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                Finish with two passing tests, a clean report, and a reusable workflow for first-pass automation work.
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProgressDashboardPage modules={modules} onSelectModule={onSelectModule} onSelectLesson={onSelectLesson} />
    </div>
  );
}

function StandaloneCourseContent() {
  const modules = firstPlaywrightTestsCourse.modules;
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
    () => typeof window !== "undefined" && window.innerWidth < 1024,
  );
  const [leftOpen, setLeftOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  );
  const [notesOpen, setNotesOpen] = useState(false);
  const [view, setView] = useState<ViewState>(() => {
    const fromHash = typeof window !== "undefined" ? parseHash(window.location.hash) : null;
    return fromHash ?? { kind: "dashboard" };
  });

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

  const activeModuleId = view.kind === "dashboard" ? currentModuleId : view.moduleId;
  const activeModule = findModule(modules, activeModuleId);
  const activeLesson =
    view.kind === "lesson"
      ? findLesson(modules, view.moduleId, view.lessonId)
      : findLesson(modules, currentModuleId, currentLessonId);

  const currentLessonEntryIndex = flatLessons.findIndex(
    (entry) => entry.module.id === activeModule.id && entry.lesson.id === activeLesson.id,
  );
  const prevEntry = currentLessonEntryIndex > 0 ? flatLessons[currentLessonEntryIndex - 1] : null;
  const nextEntry =
    currentLessonEntryIndex >= 0 && currentLessonEntryIndex < flatLessons.length - 1
      ? flatLessons[currentLessonEntryIndex + 1]
      : null;
  const coursePercent = getCourseCompletion(flatLessons.length);
  const completed = Boolean(
    progress.modules[activeModule.id]?.completedLessons.includes(activeLesson.id),
  );

  const openDashboard = () => setView({ kind: "dashboard" });
  const openLesson = (moduleId: string, lessonId: string) => {
    navigateTo(moduleId, lessonId);
    setView({ kind: "lesson", moduleId, lessonId });
    if (isMobile) setLeftOpen(false);
  };
  const openModuleOverview = (moduleId: string) => {
    const mod = findModule(modules, moduleId);
    openLesson(moduleId, mod.lessons[0].id);
  };

  return (
    <AppShell
      titleBar={
        <TopBar
          module={activeModule}
          lesson={view.kind === "lesson" || view.kind === "module" ? activeLesson : undefined}
          leftOpen={leftOpen}
          onToggleLeft={() => setLeftOpen((current) => !current)}
          onOpenDashboard={openDashboard}
          onOpenModuleOverview={openModuleOverview}
          onOpenNotes={view.kind === "lesson" || view.kind === "module" ? () => setNotesOpen(true) : undefined}
        />
      }
      footerBar={
        view.kind === "lesson" || view.kind === "module" ? (
          <BottomBar
            onPrev={prevEntry ? () => openLesson(prevEntry.module.id, prevEntry.lesson.id) : undefined}
            onNext={nextEntry ? () => openLesson(nextEntry.module.id, nextEntry.lesson.id) : undefined}
            onComplete={() => markLessonComplete(activeModule.id, activeLesson.id)}
            canGoPrev={Boolean(prevEntry)}
            canGoNext={Boolean(nextEntry)}
            isCompleted={completed}
          />
        ) : (
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {coursePercent}% of the standalone course is complete.
          </div>
        )
      }
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
      {view.kind === "dashboard" ? (
        <StandaloneDashboardPage
          course={firstPlaywrightTestsCourse}
          modules={modules}
          onSelectModule={openModuleOverview}
          onSelectLesson={openLesson}
        />
      ) : (
        <LessonDetailPage
          module={activeModule}
          lesson={activeLesson}
          onQuizAttempt={() => saveQuizScore(activeModule.id, activeLesson.id, 1)}
        />
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

const firstModule = firstPlaywrightTestsCourse.modules[0];
const firstLesson = firstModule.lessons[0];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ProgressProvider
        initialModuleId={firstModule.id}
        initialLessonId={firstLesson.id}
        storageKey="mav-progress-first-playwright-tests-v1"
      >
        <StandaloneCourseContent />
      </ProgressProvider>
    </ThemeProvider>
  </StrictMode>,
);
