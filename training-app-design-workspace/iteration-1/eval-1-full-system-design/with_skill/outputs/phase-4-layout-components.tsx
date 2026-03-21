/**
 * Layout Components
 * Target: training-app/src/components/layout/
 *
 * Components: ModuleHero, LessonHero, LearningObjectives,
 *             RecapCard, SupportRail
 */

import { useState } from 'react';
import { Clock, BookOpen, Search, StickyNote, ExternalLink, BookMarked, ChevronDown, ChevronUp } from 'lucide-react';
import type { Module, Lesson } from '../../types/curriculum';
import { useProgress } from '../../contexts/ProgressContext';

// ─── ModuleHero ───────────────────────────────────────────────────

interface ModuleHeroProps {
  module: Module;
}

export function ModuleHero({ module }: ModuleHeroProps) {
  const { getModuleCompletion } = useProgress();
  const completion = getModuleCompletion(module.id, module.lessons.length);

  const difficultyLabel = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  }[module.difficulty];

  return (
    <div
      className="rounded-xl p-8 mb-8"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-elevation)',
      }}
    >
      {/* Module number + badge row */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-xs uppercase tracking-widest font-medium"
          style={{ color: 'var(--accent-info)', fontFamily: 'var(--font-mono)' }}
        >
          Module {String(module.number).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {module.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={12} /> {module.lessons.length} lessons
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xs"
            style={{
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-secondary)',
            }}
          >
            {difficultyLabel}
          </span>
        </div>
      </div>

      {/* Title */}
      <h1
        className="text-2xl font-bold tracking-tight mb-2"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
      >
        {module.title}
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        {module.subtitle}
      </p>

      {/* Learning Objectives */}
      <LearningObjectives objectives={module.learningObjectives} />

      {/* Progress */}
      {completion > 0 && (
        <div className="mt-6">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
            <span>Module Progress</span>
            <span>{completion}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--border-subtle)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${completion}%`, backgroundColor: 'var(--accent-action)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LessonHero ───────────────────────────────────────────────────

interface LessonHeroProps {
  lesson: Lesson;
  moduleNumber: number;
  lessonIndex: number;
  totalLessons: number;
  isCompleted: boolean;
}

export function LessonHero({ lesson, moduleNumber, lessonIndex, totalLessons, isCompleted }: LessonHeroProps) {
  return (
    <div className="mb-8">
      {/* Position and status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            Module {String(moduleNumber).padStart(2, '0')} &middot; Lesson {lessonIndex + 1} of {totalLessons}
          </span>
          {lesson.audience && lesson.audience !== 'all' && (
            <span
              className="px-2 py-0.5 rounded text-xs"
              style={{
                color: lesson.audience === 'non-coder' ? 'var(--accent-highlight)' : 'var(--accent-info)',
                border: `1px solid ${lesson.audience === 'non-coder' ? 'var(--accent-highlight)' : 'var(--accent-info)'}`,
                opacity: 0.7,
              }}
            >
              {lesson.audience === 'non-coder' ? 'Non-Coder Friendly' : 'Developer'}
            </span>
          )}
        </div>
        {isCompleted && (
          <span
            className="px-2.5 py-1 rounded text-xs"
            style={{
              color: 'var(--accent-action)',
              backgroundColor: 'var(--diff-added-bg)',
              border: '1px solid var(--accent-action)',
              opacity: 0.8,
            }}
          >
            Completed
          </span>
        )}
      </div>

      {/* Lesson progress within module */}
      <div className="h-0.5 rounded-full mb-4" style={{ backgroundColor: 'var(--border-subtle)' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${((lessonIndex + 1) / totalLessons) * 100}%`,
            backgroundColor: 'var(--accent-info)',
          }}
        />
      </div>

      {/* Title */}
      <h2
        className="text-xl font-bold tracking-tight mb-1"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
      >
        {lesson.title}
      </h2>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {lesson.subtitle}
      </p>

      {/* Duration */}
      <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <Clock size={12} />
        <span>{lesson.estimatedMinutes} min</span>
      </div>
    </div>
  );
}

// ─── LearningObjectives ──────────────────────────────────────────

function LearningObjectives({ objectives }: { objectives: string[] }) {
  return (
    <div
      className="rounded-md p-4"
      style={{
        backgroundColor: 'var(--surface-hover)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent-action)' }}>
        After this module, you will be able to:
      </p>
      <ul className="space-y-1.5">
        {objectives.map((obj, i) => (
          <li key={i} className="text-xs leading-relaxed flex items-start gap-2" style={{ color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--accent-action)', flexShrink: 0 }}>&#10003;</span>
            {obj}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── RecapCard ────────────────────────────────────────────────────

interface RecapCardProps {
  takeaways: string[];
  reflectionPrompt?: string;
  nextAction?: string;
}

export function RecapCard({ takeaways, reflectionPrompt, nextAction }: RecapCardProps) {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: `linear-gradient(135deg, var(--surface-elevated), var(--surface-hover))`,
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-elevation)',
      }}
    >
      <h3
        className="text-sm font-bold uppercase tracking-wider mb-4"
        style={{ color: 'var(--accent-special)' }}
      >
        Key Takeaways
      </h3>

      <ul className="space-y-3 mb-6">
        {takeaways.map((t, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: 'var(--accent-special)',
                color: 'var(--surface-primary)',
              }}
            >
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {t}
            </span>
          </li>
        ))}
      </ul>

      {reflectionPrompt && (
        <div
          className="p-3 rounded-md mb-4"
          style={{
            backgroundColor: 'var(--surface-code)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--accent-highlight)' }}>
            Reflection
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {reflectionPrompt}
          </p>
        </div>
      )}

      {nextAction && (
        <div className="text-xs" style={{ color: 'var(--accent-info)' }}>
          <span className="font-medium">Next:</span> {nextAction}
        </div>
      )}
    </div>
  );
}

// ─── SupportRail (Right Panel) ────────────────────────────────────

interface SupportRailProps {
  glossaryTerms?: { term: string; definition: string }[];
  resources?: { label: string; url: string }[];
  moduleId: string;
  lessonId: string;
}

export function SupportRail({ glossaryTerms = [], resources = [], moduleId, lessonId }: SupportRailProps) {
  const [activeTab, setActiveTab] = useState<'glossary' | 'notes' | 'resources'>('glossary');
  const [searchQuery, setSearchQuery] = useState('');
  const { saveNote, getNote } = useProgress();
  const [noteText, setNoteText] = useState(getNote(moduleId, lessonId));

  const tabs = [
    { id: 'glossary' as const, label: 'Glossary', icon: BookMarked },
    { id: 'notes' as const, label: 'Notes', icon: StickyNote },
    { id: 'resources' as const, label: 'Resources', icon: ExternalLink },
  ];

  const filteredTerms = glossaryTerms.filter(
    (t) =>
      t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex px-2 pt-2 gap-1" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-t-md transition-colors"
              style={{
                color: isActive ? 'var(--accent-info)' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--surface-primary)' : 'transparent',
                borderBottom: isActive ? '2px solid var(--accent-info)' : '2px solid transparent',
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Glossary Tab */}
        {activeTab === 'glossary' && (
          <div>
            <div className="relative mb-3">
              <Search size={14} className="absolute left-2.5 top-2.5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-md text-xs"
                style={{
                  backgroundColor: 'var(--surface-code)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div className="space-y-2">
              {filteredTerms.map((term, i) => (
                <GlossaryItem key={i} term={term.term} definition={term.definition} />
              ))}
              {filteredTerms.length === 0 && (
                <p className="text-xs italic py-4 text-center" style={{ color: 'var(--text-muted)' }}>
                  {searchQuery ? 'No matching terms' : 'No glossary terms for this lesson'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onBlur={() => saveNote(moduleId, lessonId, noteText)}
              placeholder="Add your notes for this lesson..."
              className="w-full h-48 p-3 rounded-md text-xs leading-relaxed resize-none"
              style={{
                backgroundColor: 'var(--surface-code)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
              }}
            />
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Notes are saved automatically.
            </p>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-2">
            {resources.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors"
                style={{
                  color: 'var(--accent-info)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <ExternalLink size={12} />
                {r.label}
              </a>
            ))}
            {resources.length === 0 && (
              <p className="text-xs italic py-4 text-center" style={{ color: 'var(--text-muted)' }}>
                No additional resources for this lesson
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GlossaryItem ─────────────────────────────────────────────────

function GlossaryItem({ term, definition }: { term: string; definition: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-md overflow-hidden"
      style={{ border: '1px solid var(--border-subtle)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors"
        style={{ color: 'var(--text-primary)' }}
      >
        <span className="font-medium" style={{ fontFamily: 'var(--font-mono)' }}>{term}</span>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {open && (
        <div className="px-3 pb-2">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {definition}
          </p>
        </div>
      )}
    </div>
  );
}
