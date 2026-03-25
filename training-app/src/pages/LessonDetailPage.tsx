import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Lightbulb,
  Play,
  ShieldAlert,
  Sparkles,
  Volume2,
  VolumeX,
  BookOpen,
  TerminalSquare,
} from "lucide-react";

import { useProgress } from "../contexts/ProgressContext";
import { useTheme } from "../contexts/ThemeContext";
import type {
  CodeExercise,
  ExerciseLab,
  Lesson,
  Module,
  NarrationScript,
  PromptTemplate,
  QuizQuestion,
  Section,
  Quiz,
} from "../types/curriculum";

/* ─────────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────────── */

interface LessonDetailPageProps {
  module: Module;
  lesson: Lesson;
  onQuizAttempt: () => void;
}

export function LessonDetailPage({
  module,
  lesson,
  onQuizAttempt,
}: LessonDetailPageProps) {
  const { isLessonCompleted } = useProgress();
  const { applyModuleTheme } = useTheme();
  const completed = isLessonCompleted(module.id, lesson.id);
  const exercises = lesson.exercises ?? (lesson.exercise ? [lesson.exercise] : []);

  useEffect(() => {
    applyModuleTheme(module.number);
  }, [applyModuleTheme, module.number]);

  return (
    <div className="lesson-detail-page space-y-12">
      <LessonHero
        lesson={lesson}
        completed={completed}
      />

      {lesson.narrationScript && (
        <LessonNarrationBar script={lesson.narrationScript} />
      )}

      <div className="space-y-10">
        {lesson.sections.map((section, i) => (
          <SectionBlock key={i} section={section} />
        ))}
      </div>

      {lesson.practiceLink && (
        <InlinePracticeCTA
          url={lesson.practiceLink.url}
          label={lesson.practiceLink.label}
          description={lesson.practiceLink.description}
        />
      )}

      {lesson.quiz && (
        <QuizPanel quiz={lesson.quiz} onAttempt={onQuizAttempt} />
      )}

      {exercises.length > 0 && (
        <ExercisesOrSingle lesson={lesson} />
      )}

      {lesson.promptTemplates?.length ? (
        <PromptTemplatesPanel templates={lesson.promptTemplates} />
      ) : null}

      <div style={{ height: "2rem" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Hero
   ───────────────────────────────────────────────── */

function LessonHero({
  lesson,
  completed,
}: {
  lesson: Lesson;
  completed: boolean;
}) {
  const stats: string[] = [
    `${lesson.estimatedMinutes} min`,
    `${lesson.sections.length} sections`,
  ];
  if (lesson.quiz) stats.push("quiz included");
  if (lesson.practiceLink) stats.push("practice included");

  return (
    <section className="page-hero lesson-hero">
      <h1
        className="text-2xl font-semibold tracking-tight md:text-3xl"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
      >
        {lesson.title}
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
        {lesson.subtitle}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
        {stats.map((stat, i) => (
          <span key={stat}>
            {i > 0 && <span className="mr-2">·</span>}
            {stat}
          </span>
        ))}
        {completed && (
          <span style={{ color: "var(--accent-action)" }}>
            <span className="mr-2">·</span>
            Completed
          </span>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────
   Inline Practice CTA
   ───────────────────────────────────────────────── */

function InlinePracticeCTA({
  url,
  label,
  description,
}: {
  url: string;
  label: string;
  description: string;
}) {
  return (
    <section
      className="rounded-xl border-l-4 p-5"
      style={{
        borderColor: "var(--accent-action)",
        backgroundColor: "color-mix(in srgb, var(--accent-action) 6%, var(--surface-primary))",
      }}
    >
      <div className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent-action)" }}>
        Practice in the app
      </div>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {description}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
        style={{
          backgroundColor: "var(--accent-action)",
          color: "var(--surface-primary)",
        }}
      >
        {label}
        <ExternalLink size={14} />
      </a>
    </section>
  );
}

/* ─────────────────────────────────────────────────
   Section block renderers
   ───────────────────────────────────────────────── */

function SectionBlock({ section }: { section: Section }) {
  if (section.type === "text") {
    return (
      <article className="space-y-3">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          {section.heading}
        </h2>
        <p className="max-w-3xl text-sm leading-8" style={{ color: "var(--text-secondary)" }}>
          {section.content}
        </p>
      </article>
    );
  }

  if (section.type === "callout") {
    const tone =
      section.variant === "warning"
        ? "var(--diff-removed-bg)"
        : section.variant === "tip"
        ? "var(--diff-added-bg)"
        : "color-mix(in srgb, var(--accent-info) 10%, transparent)";
    const accent =
      section.variant === "warning"
        ? "var(--diff-removed-text)"
        : section.variant === "tip"
        ? "var(--accent-action)"
        : "var(--accent-info)";
    return (
      <aside
        className="rounded-xl border p-5"
        style={{ backgroundColor: tone, borderColor: "var(--border-subtle)" }}
      >
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: accent }}>
          {section.variant === "warning" ? <ShieldAlert size={14} /> : <Lightbulb size={14} />}
          {section.variant}
        </div>
        {section.heading ? (
          <div className="mb-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {section.heading}
          </div>
        ) : null}
        <p className="text-sm leading-8" style={{ color: "var(--text-secondary)" }}>
          {section.content}
        </p>
      </aside>
    );
  }

  if (section.type === "table") {
    return (
      <section className="space-y-3">
        {section.heading ? (
          <h2 className="text-sm font-semibold tracking-wide" style={{ color: "var(--text-primary)" }}>
            {section.heading}
          </h2>
        ) : null}
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-subtle)" }}>
          <table className="w-full text-left text-[13px]">
            <thead style={{ backgroundColor: "var(--surface-elevated)" }}>
              <tr>
                {section.headers.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "var(--surface-code)" }}>
              {section.rows.map((row, rowIndex) => (
                <tr key={`${rowIndex}-${row.join("-")}`} className="border-t" style={{ borderColor: "var(--border-subtle)" }}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 leading-6" style={{ color: "var(--text-secondary)" }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return <CodeBlock section={section} />;
}

function CodeBlock({ section }: { section: Extract<Section, { type: "code" }> }) {
  const [copied, setCopied] = useState(false);

  return (
    <section className="space-y-3">
      {section.heading ? (
        <h2 className="text-sm font-semibold tracking-wide" style={{ color: "var(--text-primary)" }}>
          {section.heading}
        </h2>
      ) : null}
      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
        <div className="flex items-center justify-between border-b px-4 py-2 text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
          <span>{section.language}</span>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(section.code);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            }}
            className="inline-flex items-center gap-1"
            style={{ color: "var(--accent-info)" }}
          >
            <Copy size={12} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-[13px] leading-8" style={{ color: "var(--text-primary)" }}>
          <code>{section.code}</code>
        </pre>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────
   Multi-question Quiz
   ───────────────────────────────────────────────── */

function QuizPanel({ quiz, onAttempt }: { quiz: Quiz; onAttempt: () => void }) {
  const { questions } = quiz;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [attemptFired, setAttemptFired] = useState(false);

  const total = questions.length;
  const q = questions[currentQ];
  const selected = answers[currentQ] ?? null;
  const isSubmitted = submitted[currentQ] ?? false;
  const isCorrect = selected === q.correctIndex;

  const answeredCount = Object.keys(submitted).length;
  const correctCount = Object.entries(submitted).filter(
    ([idx]) => answers[Number(idx)] === questions[Number(idx)].correctIndex,
  ).length;

  const handleSubmit = useCallback(() => {
    if (selected === null) return;
    setSubmitted((prev) => ({ ...prev, [currentQ]: true }));
    if (!attemptFired) {
      setAttemptFired(true);
      onAttempt();
    }
  }, [selected, currentQ, attemptFired, onAttempt]);

  return (
    <section
      className="lesson-panel lesson-panel-quiz rounded-2xl border p-6 md:p-8"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
          <CheckCircle2 size={14} />
          Knowledge Check
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          Question {currentQ + 1} of {total}
          {answeredCount > 0 && (
            <span style={{ color: "var(--accent-action)" }}> — {correctCount}/{answeredCount} correct</span>
          )}
        </div>
      </div>

      {/* Question dots */}
      {total > 1 && (
        <div className="mb-4 flex gap-1.5">
          {questions.map((_, i) => {
            const answered = submitted[i];
            const correct = answered && answers[i] === questions[i].correctIndex;
            const wrong = answered && answers[i] !== questions[i].correctIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentQ(i)}
                aria-label={`Question ${i + 1}`}
                className="h-2 rounded-full transition-all"
                style={{
                  width: i === currentQ ? "1.5rem" : "0.5rem",
                  backgroundColor: correct
                    ? "var(--accent-action)"
                    : wrong
                    ? "var(--diff-removed-text)"
                    : i === currentQ
                    ? "var(--accent-info)"
                    : "var(--border-subtle)",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Question content */}
      <QuestionCard
        question={q}
        selected={selected}
        isSubmitted={isSubmitted}
        isCorrect={isCorrect}
        onSelect={(i) => !isSubmitted && setAnswers((prev) => ({ ...prev, [currentQ]: i }))}
        onSubmit={handleSubmit}
      />

      {/* Prev/Next question */}
      {total > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            disabled={currentQ === 0}
            onClick={() => setCurrentQ((i) => i - 1)}
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-30"
            style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
          >
            <ChevronLeft size={14} />
            Previous
          </button>
          <button
            type="button"
            disabled={currentQ === total - 1}
            onClick={() => setCurrentQ((i) => i + 1)}
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-30"
            style={{ borderColor: "var(--accent-action)", color: "var(--accent-action)" }}
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </section>
  );
}

function QuestionCard({
  question,
  selected,
  isSubmitted,
  isCorrect,
  onSelect,
  onSubmit,
}: {
  question: QuizQuestion;
  selected: number | null;
  isSubmitted: boolean;
  isCorrect: boolean;
  onSelect: (index: number) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <p className="text-sm leading-7" style={{ color: "var(--text-primary)" }}>
        {question.question}
      </p>
      <div className="mt-4 space-y-2">
        {question.options.map((option, index) => {
          const active = selected === index;
          const correct = isSubmitted && index === question.correctIndex;
          const wrong = isSubmitted && active && !isCorrect;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(index)}
              className="w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors"
              style={{
                borderColor: correct
                  ? "var(--accent-action)"
                  : wrong
                  ? "var(--diff-removed-text)"
                  : active
                  ? "var(--accent-info)"
                  : "var(--border-subtle)",
                backgroundColor: correct
                  ? "var(--diff-added-bg)"
                  : wrong
                  ? "var(--diff-removed-bg)"
                  : active
                  ? "color-mix(in srgb, var(--accent-info) 8%, transparent)"
                  : "transparent",
                color: correct || active ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              <span className="mr-2 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {!isSubmitted ? (
        <button
          type="button"
          disabled={selected === null}
          onClick={onSubmit}
          className="mt-4 rounded-lg px-4 py-2 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "var(--accent-action)", color: "var(--surface-primary)" }}
        >
          Check Answer
        </button>
      ) : (
        <div
          className="mt-4 rounded-xl border p-4"
          style={{
            borderColor: isCorrect ? "var(--accent-action)" : "var(--diff-removed-text)",
            backgroundColor: isCorrect ? "var(--diff-added-bg)" : "var(--diff-removed-bg)",
          }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {isCorrect ? "Correct" : "Not quite"}
          </p>
          <p className="mt-1 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Lesson Narration Bar
   ───────────────────────────────────────────────── */

function LessonNarrationBar({ script }: { script: NarrationScript }) {
  const fullText = [
    script.intro,
    ...script.steps.map((s) => s.text),
    script.outro,
  ].filter(Boolean).join("\n\n");

  const [expanded, setExpanded] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const { playing, toggle, speed, setSpeed } = useNarration(fullText);

  return (
    <div>
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <Volume2 size={14} style={{ color: "var(--accent-info)" }} />
          Listen to this lesson
        </button>
      ) : (
        <div
          className="flex flex-wrap items-center gap-3 rounded-lg px-4 py-3"
          style={{ backgroundColor: "var(--surface-elevated)" }}
        >
          <button
            type="button"
            onClick={toggle}
            className="rounded-full p-2 transition-colors"
            style={{
              backgroundColor: playing ? "color-mix(in srgb, var(--accent-action) 15%, transparent)" : "color-mix(in srgb, var(--accent-info) 10%, transparent)",
              color: playing ? "var(--accent-action)" : "var(--accent-info)",
            }}
          >
            {playing ? <VolumeX size={16} /> : <Play size={16} />}
          </button>

          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded-md bg-transparent px-1 py-0.5 text-xs outline-none"
            style={{ color: "var(--text-secondary)" }}
          >
            {([0.75, 1, 1.25, 1.5, 2] as const).map((s) => (
              <option key={s} value={s}>{s}x</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="rounded-md p-1.5 text-xs transition-colors"
            style={{
              color: showTranscript ? "var(--accent-info)" : "var(--text-muted)",
            }}
            title={showTranscript ? "Hide transcript" : "Show transcript"}
          >
            <BookOpen size={14} />
          </button>

          <button
            type="button"
            onClick={() => { setExpanded(false); if (playing) toggle(); }}
            className="ml-auto text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Collapse
          </button>
        </div>
      )}

      {expanded && showTranscript && (
        <div
          className="mt-2 rounded-lg px-4 py-3"
          style={{ backgroundColor: "color-mix(in srgb, var(--accent-info) 3%, var(--surface-primary))" }}
        >
          <p className="text-sm leading-7 whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>
            {fullText}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Narration Speech Hook
   ───────────────────────────────────────────────── */

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

function useNarration(text: string, audioFile?: string) {
  const [playing, setPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [speed, setSpeedRaw] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);
  const textRef = useRef(text);
  textRef.current = text;

  // Try to load pre-generated MP3
  useEffect(() => {
    if (!audioFile) return;
    const audio = new Audio(audioFile);
    audio.addEventListener("canplaythrough", () => { audioRef.current = audio; setHasAudio(true); });
    audio.addEventListener("error", () => setHasAudio(false));
    audio.addEventListener("ended", () => { setPlaying(false); playingRef.current = false; });
    audio.load();
    return () => { audio.pause(); audio.src = ""; };
  }, [audioFile]);

  // Sync playback rate when speed changes — works for both Audio and Speech
  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedRaw(newSpeed);
    // Audio element: just update playbackRate live
    if (audioRef.current && hasAudio) {
      audioRef.current.playbackRate = newSpeed;
    }
    // Speech synthesis: must cancel and restart at new rate
    if (playingRef.current && typeof speechSynthesis !== "undefined" && !hasAudio) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textRef.current);
      utterance.rate = newSpeed;
      utterance.lang = "en-US";
      const voices = speechSynthesis.getVoices();
      const english = voices.filter(v => v.lang.startsWith("en"));
      const voice = english.find(v => v.name.includes("Neural") || v.name.includes("Online"))
        || english.find(v => ["Jenny", "Aria", "Google US"].some(q => v.name.includes(q)))
        || english[0];
      if (voice) utterance.voice = voice;
      utterance.onend = () => { setPlaying(false); playingRef.current = false; };
      utterance.onerror = () => { setPlaying(false); playingRef.current = false; };
      speechSynthesis.speak(utterance);
    }
  }, [hasAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
      if (audioRef.current) { audioRef.current.pause(); }
      playingRef.current = false;
    };
  }, []);

  const toggle = useCallback(() => {
    if (playing) {
      if (audioRef.current && hasAudio) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else if (typeof speechSynthesis !== "undefined") {
        speechSynthesis.cancel();
      }
      setPlaying(false);
      playingRef.current = false;
      return;
    }

    // Prefer MP3, fall back to speech synthesis
    if (hasAudio && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = speed;
      audioRef.current.play();
      setPlaying(true);
      playingRef.current = true;
    } else if (typeof speechSynthesis !== "undefined" && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speed;
      utterance.lang = "en-US";
      const voices = speechSynthesis.getVoices();
      const english = voices.filter(v => v.lang.startsWith("en"));
      const voice = english.find(v => v.name.includes("Neural") || v.name.includes("Online"))
        || english.find(v => ["Jenny", "Aria", "Google US"].some(q => v.name.includes(q)))
        || english[0];
      if (voice) utterance.voice = voice;
      utterance.onend = () => { setPlaying(false); playingRef.current = false; };
      utterance.onerror = () => { setPlaying(false); playingRef.current = false; };
      setPlaying(true);
      playingRef.current = true;
      speechSynthesis.speak(utterance);
    }
  }, [text, playing, hasAudio, speed]);

  return { playing, toggle, hasAudio, speed, setSpeed };
}

/* ─────────────────────────────────────────────────
   Exercises
   ───────────────────────────────────────────────── */

function ExercisesOrSingle({ lesson }: { lesson: Lesson }) {
  if (lesson.exercises && lesson.exercises.length > 1) {
    return <ExercisesPanel exercises={lesson.exercises} />;
  }
  if (lesson.exercise) {
    return <ExercisePanel exercise={lesson.exercise} />;
  }
  return null;
}

type DifficultyFilter = "all" | "beginner" | "intermediate" | "advanced";

const DIFFICULTY_ACCENT: Record<Exclude<DifficultyFilter, "all">, string> = {
  beginner: "var(--accent-action)",
  intermediate: "var(--accent-info)",
  advanced: "var(--diff-removed-text)",
};

function ExercisesPanel({ exercises }: { exercises: CodeExercise[] }) {
  const [filter, setFilter] = useState<DifficultyFilter>("all");
  const filters: DifficultyFilter[] = ["all", "beginner", "intermediate", "advanced"];

  const filtered = useMemo(
    () => filter === "all" ? exercises : exercises.filter((e) => e.difficulty === filter),
    [exercises, filter],
  );

  return (
    <section
      className="lesson-panel rounded-2xl border p-5 md:p-6"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}
    >
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
        <Play size={14} />
        Hands-On Exercises ({exercises.length})
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = filter === f;
          const accent = f === "all" ? "var(--text-secondary)" : DIFFICULTY_ACCENT[f];
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                borderColor: active ? accent : "var(--border-subtle)",
                backgroundColor: active ? `color-mix(in srgb, ${accent} 12%, transparent)` : "transparent",
                color: active ? accent : "var(--text-muted)",
              }}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="py-4 text-sm italic" style={{ color: "var(--text-muted)" }}>
          No exercises match this difficulty level.
        </p>
      ) : (
        <div className="space-y-6">
          {filtered.map((exercise) => (
            <ExerciseCard key={exercise.title} exercise={exercise} />
          ))}
        </div>
      )}
    </section>
  );
}

function ExercisePanel({ exercise }: { exercise: CodeExercise }) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <section className="lesson-panel lesson-panel-exercise rounded-2xl border p-5 md:p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
        <Play size={14} />
        Hands-On Exercise
      </div>
      <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        {exercise.title}
      </h2>
      <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
        {exercise.description}
      </p>

      {exercise.narration && <NarrationControls narration={exercise.narration} />}

      <div className="lesson-code-surface mt-4 rounded-xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
        <div className="flex items-center justify-between border-b px-4 py-2 text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
          <span>{showSolution ? "Solution" : "Starter"}</span>
          <button
            type="button"
            onClick={() => setShowSolution((current) => !current)}
            className="text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--accent-info)" }}
          >
            {showSolution ? "Hide solution" : "Reveal solution"}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-[13px] leading-8" style={{ color: "var(--text-primary)" }}>
          <code>{showSolution ? exercise.solutionCode : exercise.starterCode}</code>
        </pre>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {exercise.hints.map((hint) => (
          <div key={hint} className="lesson-hint-surface rounded-lg border px-3 py-2 text-sm leading-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)", color: "var(--text-secondary)" }}>
            {hint}
          </div>
        ))}
      </div>

      {exercise.lab ? <ExerciseLabCard lab={exercise.lab} /> : null}
    </section>
  );
}

function NarrationControls({ narration, audioFile }: { narration: string; audioFile?: string }) {
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const { playing, toggle, hasAudio, speed, setSpeed } = useNarration(narration, audioFile);

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setShowWalkthrough(!showWalkthrough)}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: "var(--accent-info)" }}
        >
          <BookOpen size={13} />
          <span>{showWalkthrough ? "Hide Walkthrough" : "Walkthrough Guide"}</span>
        </button>
        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-all"
          style={{
            borderColor: playing ? "var(--accent-action)" : "var(--border-subtle)",
            backgroundColor: playing ? "color-mix(in srgb, var(--accent-action) 12%, transparent)" : "transparent",
            color: playing ? "var(--accent-action)" : "var(--text-muted)",
          }}
          title={playing ? "Stop narration" : "Listen to walkthrough"}
        >
          {playing ? <VolumeX size={13} /> : <Volume2 size={13} />}
          <span>{playing ? "Stop" : "Listen"}</span>
          {hasAudio && <span className="text-[9px] opacity-50">HD</span>}
        </button>
        {/* Speed selector */}
        <div className="flex items-center gap-0.5 rounded-md border px-1 py-0.5" style={{ borderColor: "var(--border-subtle)" }}>
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className="rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors"
              style={{
                backgroundColor: speed === s ? "color-mix(in srgb, var(--accent-info) 15%, transparent)" : "transparent",
                color: speed === s ? "var(--accent-info)" : "var(--text-muted)",
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
      {showWalkthrough && (
        <div
          className="rounded-lg border p-3 text-[12.5px] leading-7 whitespace-pre-line"
          style={{
            borderColor: "color-mix(in srgb, var(--accent-info) 20%, transparent)",
            backgroundColor: "color-mix(in srgb, var(--accent-info) 5%, transparent)",
            color: "var(--text-secondary)",
          }}
        >
          {narration}
        </div>
      )}
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: CodeExercise }) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {exercise.title}
        </h3>
        {exercise.difficulty && (
          <span
            className="rounded-md border px-2 py-0.5 text-[11px] font-medium"
            style={{
              color: DIFFICULTY_ACCENT[exercise.difficulty],
              borderColor: `color-mix(in srgb, ${DIFFICULTY_ACCENT[exercise.difficulty]} 30%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${DIFFICULTY_ACCENT[exercise.difficulty]} 8%, transparent)`,
            }}
          >
            {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm leading-8" style={{ color: "var(--text-secondary)" }}>
        {exercise.description}
      </p>

      {exercise.narration && <NarrationControls narration={exercise.narration} />}

      <div className="mt-3 overflow-hidden rounded-lg border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-primary)" }}>
        <div className="flex items-center justify-between border-b px-4 py-2 text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
          <span>{showSolution ? "Solution" : "Starter"}</span>
          <button
            type="button"
            onClick={() => setShowSolution((c) => !c)}
            className="text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--accent-info)" }}
          >
            {showSolution ? "Hide solution" : "Reveal solution"}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-[13px] leading-8" style={{ color: "var(--text-primary)" }}>
          <code>{showSolution ? exercise.solutionCode : exercise.starterCode}</code>
        </pre>
      </div>

      {exercise.hints.length > 0 && (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {exercise.hints.map((hint) => (
            <div
              key={hint}
              className="rounded-lg border px-3 py-2 text-[12px] leading-6"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)", color: "var(--text-secondary)" }}
            >
              {hint}
            </div>
          ))}
        </div>
      )}

      {exercise.lab ? <ExerciseLabCard lab={exercise.lab} /> : null}
    </div>
  );
}

function ExerciseLabCard({ lab }: { lab: ExerciseLab }) {
  const [copiedField, setCopiedField] = useState<"file" | "command" | null>(null);

  async function copy(value: string, field: "file" | "command") {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    window.setTimeout(() => setCopiedField(null), 1500);
  }

  return (
    <section
      className="mt-4 rounded-xl border p-4"
      style={{
        borderColor: "color-mix(in srgb, var(--accent-info) 24%, transparent)",
        backgroundColor: "color-mix(in srgb, var(--accent-info) 5%, var(--surface-elevated))",
      }}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--accent-info)" }}>
        <TerminalSquare size={14} />
        Try It In VS Code
      </div>

      <div className="mt-4 space-y-3">
        <LabField
          label="Workspace"
          value={lab.workspaceRoot}
        />
        <LabField
          label="Target File"
          value={lab.targetFile}
          actionLabel={copiedField === "file" ? "Copied" : "Copy"}
          onAction={() => copy(lab.targetFile, "file")}
        />
        <LabField
          label="Run Command"
          value={lab.runCommand}
          actionLabel={copiedField === "command" ? "Copied" : "Copy"}
          onAction={() => copy(lab.runCommand, "command")}
        />
      </div>

      <div className="mt-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
          Success Looks Like
        </div>
        <div className="mt-2 space-y-2">
          {lab.successCriteria.map((criterion) => (
            <div
              key={criterion}
              className="rounded-lg border px-3 py-2 text-[12px] leading-6"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--surface-primary)",
                color: "var(--text-secondary)",
              }}
            >
              {criterion}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LabField({
  label,
  value,
  actionLabel,
  onAction,
}: {
  label: string;
  value: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-lg border px-3 py-3" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-primary)" }}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
          {label}
        </div>
        {onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--accent-info)" }}
          >
            <Copy size={12} />
            {actionLabel}
          </button>
        ) : null}
      </div>
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[12px] leading-6" style={{ color: "var(--text-primary)" }}>
        <code>{value}</code>
      </pre>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Prompts
   ───────────────────────────────────────────────── */

function PromptTemplatesPanel({ templates }: { templates: PromptTemplate[] }) {
  return (
    <section className="lesson-panel lesson-panel-prompts rounded-2xl border p-5 md:p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-elevated)" }}>
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
        <Sparkles size={14} />
        Copilot Prompts
      </div>
      <div className="space-y-3">
        {templates.map((template) => (
          <details key={template.label} className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-code)" }}>
            <summary className="cursor-pointer list-none text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {template.label}
            </summary>
            <p className="mt-2 text-xs italic leading-6" style={{ color: "var(--text-muted)" }}>
              {template.context}
            </p>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-[13px] leading-8" style={{ color: "var(--text-secondary)" }}>
              {template.prompt}
            </pre>
          </details>
        ))}
      </div>
    </section>
  );
}

