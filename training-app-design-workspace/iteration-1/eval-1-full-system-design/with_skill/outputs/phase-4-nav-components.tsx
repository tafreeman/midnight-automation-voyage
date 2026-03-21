/**
 * Navigation Components
 * Target: training-app/src/components/navigation/
 *
 * Components: TopBar, ModuleNav, BottomBar, ThemeSelector, ProgressBar
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight, Check, Lock, Menu, X, PanelRightOpen, PanelRightClose, Search, Palette } from 'lucide-react';
import type { Module, ThemeName } from '../../types/curriculum';
import { useTheme } from '../../contexts/ThemeContext';
import { useProgress } from '../../contexts/ProgressContext';

// ─── TopBar ───────────────────────────────────────────────────────

interface TopBarProps {
  onToggleLeft: () => void;
  onToggleRight: () => void;
  leftOpen: boolean;
  rightOpen: boolean;
  currentModule?: Module;
  currentLessonTitle?: string;
}

export function TopBar({
  onToggleLeft,
  onToggleRight,
  leftOpen,
  rightOpen,
  currentModule,
  currentLessonTitle,
}: TopBarProps) {
  return (
    <div className="flex items-center justify-between w-full gap-4">
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleLeft}
          className="p-1.5 rounded-md transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          aria-label={leftOpen ? 'Close navigation' : 'Open navigation'}
        >
          {leftOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div>
          <span
            className="text-sm font-bold tracking-wide"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-action)' }}
          >
            PLAYWRIGHT
          </span>
          <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
            + Copilot Training
          </span>
        </div>
      </div>

      {/* Center: breadcrumb */}
      <div className="hidden md:flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
        {currentModule && (
          <>
            <span>Module {currentModule.number}</span>
            {currentLessonTitle && (
              <>
                <ChevronRight size={12} />
                <span style={{ color: 'var(--text-primary)' }}>{currentLessonTitle}</span>
              </>
            )}
          </>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <ThemeSelector />
        <button
          className="p-1.5 rounded-md transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Search"
        >
          <Search size={18} />
        </button>
        <button
          onClick={onToggleRight}
          className="p-1.5 rounded-md transition-colors hidden md:flex"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={rightOpen ? 'Close support panel' : 'Open support panel'}
        >
          {rightOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
        </button>
      </div>
    </div>
  );
}

// ─── ThemeSelector ────────────────────────────────────────────────

const THEME_OPTIONS: { value: ThemeName | 'auto'; label: string; description: string }[] = [
  { value: 'auto', label: 'Auto', description: 'Cycles with modules' },
  { value: 'signal-cobalt', label: 'Signal Cobalt', description: 'Dark engineering' },
  { value: 'arctic-steel', label: 'Arctic Steel', description: 'Light minimal' },
  { value: 'linear', label: 'Linear', description: 'Light modern' },
  { value: 'gamma-dark', label: 'Gamma Dark', description: 'Dark warm' },
];

export function ThemeSelector() {
  const { preference, setPreference } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors"
        style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
        aria-label="Select theme"
      >
        <Palette size={14} />
        <span className="hidden sm:inline">
          {THEME_OPTIONS.find((t) => t.value === preference)?.label || 'Auto'}
        </span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1 z-50 rounded-lg py-1 min-w-[180px]"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-elevation)',
            }}
          >
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setPreference(opt.value);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between"
                style={{
                  color: preference === opt.value ? 'var(--accent-action)' : 'var(--text-primary)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div>
                  <div className="font-medium">{opt.label}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{opt.description}</div>
                </div>
                {preference === opt.value && <Check size={14} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── ModuleNav (Left Rail) ────────────────────────────────────────

interface ModuleNavProps {
  modules: Module[];
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  onSelectModule: (moduleId: string) => void;
}

export function ModuleNav({ modules, onSelectLesson, onSelectModule }: ModuleNavProps) {
  const { currentModuleId, currentLessonId, isLessonCompleted, getModuleCompletion } = useProgress();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([currentModuleId]));

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  // Calculate total lessons for course progress
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const { getCourseCompletion } = useProgress();
  const courseProgress = getCourseCompletion(totalLessons);

  return (
    <div className="flex flex-col h-full">
      {/* Course Progress Header */}
      <div className="p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          <span>Course Progress</span>
          <span>{courseProgress}%</span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--border-subtle)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${courseProgress}%`, backgroundColor: 'var(--accent-action)' }}
          />
        </div>
      </div>

      {/* Module List */}
      <nav className="flex-1 overflow-y-auto p-2" role="navigation" aria-label="Module navigation">
        {modules.map((mod) => {
          const isCurrentModule = mod.id === currentModuleId;
          const isExpanded = expandedModules.has(mod.id);
          const completion = getModuleCompletion(mod.id, mod.lessons.length);
          const isComplete = completion === 100;

          return (
            <div key={mod.id} className="mb-0.5">
              {/* Module Header */}
              <button
                onClick={() => {
                  toggleModule(mod.id);
                  onSelectModule(mod.id);
                }}
                className="w-full text-left px-3 py-2.5 rounded-md transition-all flex items-center gap-2.5 group"
                style={{
                  backgroundColor: isCurrentModule ? 'rgba(var(--accent-action-rgb, 163, 230, 53), 0.08)' : 'transparent',
                  border: isCurrentModule ? '1px solid rgba(var(--accent-action-rgb, 163, 230, 53), 0.15)' : '1px solid transparent',
                }}
                aria-expanded={isExpanded}
              >
                {/* Status icon */}
                <span className="flex-shrink-0 w-5 text-center">
                  {isComplete ? (
                    <Check size={14} style={{ color: 'var(--accent-action)' }} />
                  ) : (
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {String(mod.number).padStart(2, '0')}
                    </span>
                  )}
                </span>

                {/* Title */}
                <span
                  className="flex-1 text-xs font-medium truncate"
                  style={{
                    color: isCurrentModule ? 'var(--accent-action)' : 'var(--text-primary)',
                  }}
                >
                  {mod.title}
                </span>

                {/* Expand chevron */}
                <span style={{ color: 'var(--text-muted)' }}>
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              </button>

              {/* Lesson List (expanded) */}
              {isExpanded && (
                <div className="ml-7 mt-0.5 space-y-0.5 pb-1">
                  {mod.lessons.map((lesson) => {
                    const isCurrent = lesson.id === currentLessonId;
                    const completed = isLessonCompleted(mod.id, lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(mod.id, lesson.id)}
                        className="w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center gap-2"
                        style={{
                          backgroundColor: isCurrent ? 'var(--surface-hover)' : 'transparent',
                          color: isCurrent
                            ? 'var(--accent-info)'
                            : completed
                            ? 'var(--text-secondary)'
                            : 'var(--text-primary)',
                        }}
                      >
                        <span className="flex-shrink-0 w-4">
                          {completed ? (
                            <Check size={12} style={{ color: 'var(--accent-action)' }} />
                          ) : isCurrent ? (
                            <span
                              className="w-1.5 h-1.5 rounded-full block"
                              style={{ backgroundColor: 'var(--accent-info)' }}
                            />
                          ) : (
                            <span
                              className="w-1.5 h-1.5 rounded-full block"
                              style={{ backgroundColor: 'var(--border-subtle)' }}
                            />
                          )}
                        </span>
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--accent-action)', opacity: 0.5 }}
          />
          <span>Playwright + Copilot Training</span>
        </div>
      </div>
    </div>
  );
}

// ─── BottomBar ────────────────────────────────────────────────────

interface BottomBarProps {
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  isCompleted: boolean;
  canComplete: boolean;
  lessonPosition: string; // e.g., "Lesson 3 of 8"
}

export function BottomBar({
  onPrev,
  onNext,
  onComplete,
  canGoPrev,
  canGoNext,
  isCompleted,
  canComplete,
  lessonPosition,
}: BottomBarProps) {
  return (
    <>
      {/* Left: Previous */}
      <button
        onClick={onPrev}
        disabled={!canGoPrev}
        className="px-4 py-2 text-xs rounded-md transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        style={{ color: 'var(--text-secondary)' }}
      >
        Previous
      </button>

      {/* Center: Position + Complete */}
      <div className="flex items-center gap-3">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {lessonPosition}
        </span>
        {!isCompleted && (
          <button
            onClick={onComplete}
            disabled={!canComplete}
            className="px-4 py-2 text-xs rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              color: canComplete ? 'var(--accent-action)' : 'var(--text-muted)',
              border: `1px solid ${canComplete ? 'var(--accent-action)' : 'var(--border-subtle)'}`,
              opacity: canComplete ? 1 : 0.5,
            }}
          >
            {canComplete ? 'Mark Complete' : 'Complete Quiz First'}
          </button>
        )}
        {isCompleted && (
          <span
            className="px-3 py-1.5 text-xs rounded-md"
            style={{
              color: 'var(--accent-action)',
              backgroundColor: 'rgba(var(--accent-action-rgb, 163, 230, 53), 0.08)',
              border: '1px solid rgba(var(--accent-action-rgb, 163, 230, 53), 0.15)',
            }}
          >
            Completed
          </span>
        )}
      </div>

      {/* Right: Next */}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="px-5 py-2 text-xs font-medium rounded-md transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--accent-action)',
          color: 'var(--surface-primary)',
        }}
      >
        Next Lesson
      </button>
    </>
  );
}

// ─── Course Progress Bar ──────────────────────────────────────────

interface CourseProgressBarProps {
  coursePercent: number;
  modulePercent: number;
  moduleLabel: string;
}

export function CourseProgressBar({ coursePercent, modulePercent, moduleLabel }: CourseProgressBarProps) {
  return (
    <div className="space-y-1.5">
      {/* Course level */}
      <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span>Overall Progress</span>
        <span>{coursePercent}%</span>
      </div>
      <div className="h-1 rounded-full" style={{ backgroundColor: 'var(--border-subtle)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${coursePercent}%`, backgroundColor: 'var(--accent-action)' }}
        />
      </div>

      {/* Module level */}
      <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
        <span>{moduleLabel}</span>
        <span>{modulePercent}%</span>
      </div>
      <div className="h-1 rounded-full" style={{ backgroundColor: 'var(--border-subtle)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${modulePercent}%`, backgroundColor: 'var(--accent-info)' }}
        />
      </div>
    </div>
  );
}
