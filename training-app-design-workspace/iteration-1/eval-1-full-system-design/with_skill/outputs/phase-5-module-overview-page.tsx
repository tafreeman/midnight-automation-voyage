/**
 * ModuleOverviewPage.tsx
 * Target: training-app/src/pages/ModuleOverviewPage.tsx
 *
 * Module landing page: orients the learner, shows what's ahead.
 * Displays ModuleHero, lesson list with completion state, and progress.
 *
 * Visual Family: A (dark workspace) or B (editorial), driven by theme cycling
 * Layout: nav-hub
 */

import { useEffect } from 'react';
import { Clock, Check, ChevronRight, Lock } from 'lucide-react';
import type { Module } from '../types/curriculum';
import { useProgress } from '../contexts/ProgressContext';
import { useTheme } from '../contexts/ThemeContext';
import { ModuleHero } from '../components/layout/ModuleHero';

interface ModuleOverviewPageProps {
  module: Module;
  onSelectLesson: (lessonId: string) => void;
}

export function ModuleOverviewPage({ module, onSelectLesson }: ModuleOverviewPageProps) {
  const { isLessonCompleted } = useProgress();
  const { applyModuleTheme } = useTheme();

  useEffect(() => {
    applyModuleTheme(module.number);
  }, [module.number, applyModuleTheme]);

  return (
    <div>
      {/* Module Hero Card */}
      <ModuleHero module={module} />

      {/* Prerequisites (if any) */}
      {module.prerequisites && module.prerequisites.length > 0 && (
        <div
          className="rounded-md p-3 mb-6 flex items-center gap-2 text-xs"
          style={{
            backgroundColor: 'var(--diff-removed-bg)',
            border: '1px solid var(--accent-highlight)',
            color: 'var(--accent-highlight)',
          }}
        >
          <Lock size={14} />
          <span>Prerequisite: Complete {module.prerequisites.join(', ')} first</span>
        </div>
      )}

      {/* Lesson List */}
      <div className="space-y-2">
        <h2
          className="text-sm font-semibold uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          Lessons ({module.lessons.length})
        </h2>

        {module.lessons.map((lesson, i) => {
          const completed = isLessonCompleted(module.id, lesson.id);

          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className="w-full text-left p-4 rounded-lg transition-all group flex items-center gap-4"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--border-subtle)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-info)';
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
              }}
            >
              {/* Status */}
              <span className="flex-shrink-0">
                {completed ? (
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--diff-added-bg)' }}
                  >
                    <Check size={14} style={{ color: 'var(--accent-action)' }} />
                  </span>
                ) : (
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono"
                    style={{
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {i + 1}
                  </span>
                )}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {lesson.title}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                  {lesson.subtitle}
                </p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Clock size={12} /> {lesson.estimatedMinutes}m
                </span>
                {lesson.audience && lesson.audience !== 'all' && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      color: lesson.audience === 'non-coder' ? 'var(--accent-highlight)' : 'var(--accent-info)',
                      opacity: 0.6,
                      fontSize: '10px',
                    }}
                  >
                    {lesson.audience === 'non-coder' ? 'Non-Coder' : 'Dev'}
                  </span>
                )}
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom spacing */}
      <div style={{ height: 'var(--space-2xl)' }} />
    </div>
  );
}
