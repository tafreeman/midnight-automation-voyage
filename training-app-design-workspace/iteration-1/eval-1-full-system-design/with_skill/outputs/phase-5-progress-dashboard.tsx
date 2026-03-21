/**
 * ProgressDashboardPage.tsx
 * Target: training-app/src/pages/ProgressDashboardPage.tsx
 *
 * Course-wide progress view with module completion states,
 * recent activity, and recommended next steps.
 *
 * Visual Family: A (workspace)
 * Layout: stat-cards
 */

import { Clock, BookOpen, Check, ChevronRight, Award } from 'lucide-react';
import type { Module } from '../types/curriculum';
import { useProgress } from '../contexts/ProgressContext';

interface ProgressDashboardProps {
  modules: Module[];
  onSelectModule: (moduleId: string) => void;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
}

export function ProgressDashboardPage({ modules, onSelectModule, onSelectLesson }: ProgressDashboardProps) {
  const { getCourseCompletion, getModuleCompletion, completedLessonCount, isLessonCompleted } = useProgress();

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const courseCompletion = getCourseCompletion(totalLessons);

  // Find next recommended lesson
  let nextModule: Module | null = null;
  let nextLessonId: string | null = null;
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (!isLessonCompleted(mod.id, lesson.id)) {
        nextModule = mod;
        nextLessonId = lesson.id;
        break;
      }
    }
    if (nextLessonId) break;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-tight mb-1"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
        >
          Progress Dashboard
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Track your learning journey across all {modules.length} modules.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Course Completion"
          value={`${courseCompletion}%`}
          icon={<Award size={20} />}
          accent="var(--accent-action)"
        />
        <StatCard
          label="Lessons Completed"
          value={`${completedLessonCount} / ${totalLessons}`}
          icon={<Check size={20} />}
          accent="var(--accent-info)"
        />
        <StatCard
          label="Modules"
          value={`${modules.filter(m => getModuleCompletion(m.id, m.lessons.length) === 100).length} / ${modules.length}`}
          icon={<BookOpen size={20} />}
          accent="var(--accent-special)"
        />
      </div>

      {/* Overall Progress Bar */}
      <div
        className="rounded-lg p-4 mb-8"
        style={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
          <span>Overall Progress</span>
          <span>{courseCompletion}%</span>
        </div>
        <div className="h-3 rounded-full" style={{ backgroundColor: 'var(--border-subtle)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${courseCompletion}%`, backgroundColor: 'var(--accent-action)' }}
          />
        </div>
      </div>

      {/* Next Recommended */}
      {nextModule && nextLessonId && (
        <div className="mb-8">
          <h2
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            Continue Learning
          </h2>
          <button
            onClick={() => onSelectLesson(nextModule!.id, nextLessonId!)}
            className="w-full text-left p-4 rounded-lg flex items-center gap-4 transition-colors"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--accent-info)',
            }}
          >
            <span
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--diff-added-bg)' }}
            >
              <ChevronRight size={20} style={{ color: 'var(--accent-action)' }} />
            </span>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {nextModule.lessons.find(l => l.id === nextLessonId)?.title}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Module {nextModule.number}: {nextModule.title}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Module Grid */}
      <h2
        className="text-sm font-semibold uppercase tracking-wider mb-3"
        style={{ color: 'var(--text-secondary)' }}
      >
        All Modules
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {modules.map((mod) => {
          const completion = getModuleCompletion(mod.id, mod.lessons.length);
          const isComplete = completion === 100;

          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className="text-left p-4 rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: `1px solid ${isComplete ? 'var(--accent-action)' : 'var(--border-subtle)'}`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  {String(mod.number).padStart(2, '0')}
                </span>
                {isComplete && <Check size={14} style={{ color: 'var(--accent-action)' }} />}
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                {mod.title}
              </p>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>{mod.lessons.length} lessons</span>
                <span>&middot;</span>
                <span>{mod.estimatedMinutes}m</span>
              </div>
              <div className="h-1 rounded-full mt-3" style={{ backgroundColor: 'var(--border-subtle)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${completion}%`,
                    backgroundColor: isComplete ? 'var(--accent-action)' : 'var(--accent-info)',
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ height: 'var(--space-2xl)' }} />
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────

function StatCard({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent: string }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
        {value}
      </p>
    </div>
  );
}
