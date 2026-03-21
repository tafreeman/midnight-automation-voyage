import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { LessonView } from "./components/LessonView";
import { lessons } from "./data";

export default function App() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const markComplete = (id: number) => {
    setCompletedLessons((prev) => new Set([...prev, id]));
  };

  const goNext = () => {
    if (currentLesson < lessons.length - 1) {
      markComplete(currentLesson);
      setCurrentLesson((p) => p + 1);
    }
  };

  const goPrev = () => {
    if (currentLesson > 0) {
      setCurrentLesson((p) => p - 1);
    }
  };

  const progress = Math.round((completedLessons.size / lessons.length) * 100);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      <Sidebar
        lessons={lessons}
        currentLesson={currentLesson}
        completedLessons={completedLessons}
        onSelect={setCurrentLesson}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        progress={progress}
      />
      <main className="flex-1 overflow-y-auto">
        <LessonView
          lesson={lessons[currentLesson]}
          lessonIndex={currentLesson}
          totalLessons={lessons.length}
          onNext={goNext}
          onPrev={goPrev}
          onComplete={() => markComplete(currentLesson)}
          isCompleted={completedLessons.has(currentLesson)}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      </main>
    </div>
  );
}
