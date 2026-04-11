import { useEffect, useMemo, useState } from "react";

import { BottomBar, TopBar } from "../components/navigation";
import { AppShell } from "../layouts/AppShell";
import { DiagramNav } from "./DiagramNav";
import { DiagramsDeckPage } from "./DiagramsDeckPage";
import { deckModule, sections, type SectionId } from "./model";
import { parseHash } from "./routing";

const MOBILE_BREAKPOINT = 1024;

export function DiagramsDeckApp() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT,
  );
  const [leftOpen, setLeftOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= MOBILE_BREAKPOINT,
  );
  const [activeSection, setActiveSection] = useState<SectionId>(
    () => (typeof window !== "undefined" ? parseHash(window.location.hash) : null) ?? "layouts",
  );

  const activeLesson = useMemo(
    () => deckModule.lessons.find((lesson) => lesson.id === activeSection) ?? deckModule.lessons[0],
    [activeSection],
  );

  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < MOBILE_BREAKPOINT);
      setLeftOpen(width >= MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const nextHash = `#${activeSection}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  }, [activeSection]);

  useEffect(() => {
    const onHashChange = () => {
      const next = parseHash(window.location.hash);
      if (next) {
        setActiveSection(next);
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const activeIndex = sections.findIndex((section) => section.id === activeSection);
  const prevSection = activeIndex > 0 ? sections[activeIndex - 1] : null;
  const nextSection = activeIndex < sections.length - 1 ? sections[activeIndex + 1] : null;

  const openSection = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    if (isMobile) {
      setLeftOpen(false);
    }
  };

  return (
    <AppShell
      titleBar={
        <TopBar
          module={deckModule}
          lesson={activeLesson}
          leftOpen={leftOpen}
          onToggleLeft={() => setLeftOpen((current) => !current)}
          onOpenDashboard={() => openSection("layouts")}
          onOpenModuleOverview={() => openSection("layouts")}
        />
      }
      footerBar={
        <BottomBar
          onPrev={prevSection ? () => openSection(prevSection.id) : undefined}
          onNext={nextSection ? () => openSection(nextSection.id) : undefined}
          canGoPrev={Boolean(prevSection)}
          canGoNext={Boolean(nextSection)}
          isCompleted={false}
        />
      }
      leftRail={<DiagramNav activeSection={activeSection} onOpenSection={openSection} />}
      isMobile={isMobile}
      leftOpen={leftOpen}
      onToggleLeft={() => setLeftOpen((current) => !current)}
    >
      <DiagramsDeckPage activeSection={activeSection} />
    </AppShell>
  );
}
