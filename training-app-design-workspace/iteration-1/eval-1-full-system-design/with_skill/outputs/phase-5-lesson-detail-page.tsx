/**
 * LessonDetailPage.tsx
 * Target: training-app/src/pages/LessonDetailPage.tsx
 *
 * The primary learning screen (~80% of user time).
 * Notebook-style scrolling with text + code blocks interleaved.
 *
 * Visual Family: A shell + B reading lane
 * Layout: two-col (left nav + center content)
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Module, Lesson } from '../types/curriculum';
import { useProgress } from '../contexts/ProgressContext';
import { useTheme } from '../contexts/ThemeContext';
import { LessonHero } from '../components/layout/LessonHero';
import { NotebookFlow } from '../components/content/NotebookFlow';
import { QuizSection } from '../components/interactive/QuizSection';
import { ExerciseSection } from '../components/interactive/ExerciseSection';
import { RecapCard } from '../components/layout/RecapCard';

interface LessonDetailPageProps {
  module: Module;
  lesson: Lesson;
  lessonIndex: number;
  onQuizAttempt: () => void;
}

export function LessonDetailPage({ module, lesson, lessonIndex, onQuizAttempt }: LessonDetailPageProps) {
  const { isLessonCompleted, saveScrollPosition, getScrollPosition } = useProgress();
  const { applyModuleTheme } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const completed = isLessonCompleted(module.id, lesson.id);

  // Apply module theme on mount
  useEffect(() => {
    applyModuleTheme(module.number);
  }, [module.number, applyModuleTheme]);

  // Restore scroll position
  useEffect(() => {
    const savedPosition = getScrollPosition(lesson.id);
    if (savedPosition && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = savedPosition;
    }
  }, [lesson.id, getScrollPosition]);

  // Save scroll position on scroll (debounced)
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollY = scrollContainerRef.current.scrollTop;
      // Debounce: only save every 500ms worth of scrolling
      saveScrollPosition(lesson.id, scrollY);
    }
  }, [lesson.id, saveScrollPosition]);

  return (
    <div ref={scrollContainerRef} onScroll={handleScroll}>
      {/* Lesson Header */}
      <LessonHero
        lesson={lesson}
        moduleNumber={module.number}
        lessonIndex={lessonIndex}
        totalLessons={module.lessons.length}
        isCompleted={completed}
      />

      {/* Notebook-Style Content Flow */}
      <NotebookFlow sections={lesson.sections} />

      {/* Quiz (if present) */}
      {lesson.quiz && (
        <div style={{ marginTop: 'var(--space-2xl)' }}>
          <QuizSection quiz={lesson.quiz} onAttempt={onQuizAttempt} />
        </div>
      )}

      {/* Exercise (if present) */}
      {lesson.exercise && (
        <div style={{ marginTop: 'var(--space-2xl)' }}>
          <ExerciseSection exercise={lesson.exercise} />
        </div>
      )}

      {/* Practice Link */}
      {lesson.practiceLink && (
        <a
          href={lesson.practiceLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-8 p-4 rounded-lg transition-colors"
          style={{
            border: '1px solid var(--accent-action)',
            backgroundColor: 'var(--diff-added-bg)',
          }}
        >
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--accent-action)' }}>
            Try It Now
          </div>
          <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
            {lesson.practiceLink.label}
          </div>
          {lesson.practiceLink.description && (
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {lesson.practiceLink.description}
            </div>
          )}
        </a>
      )}

      {/* Bottom spacing before sticky nav */}
      <div style={{ height: 'calc(var(--bottombar-height) + var(--space-xl))' }} />
    </div>
  );
}
