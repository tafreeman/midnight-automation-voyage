import React, { useState, useEffect } from "react";
import type { Lesson, CodeExercise } from "../data";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface LessonViewProps {
  lesson: Lesson;
  lessonIndex: number;
  totalLessons: number;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  isCompleted: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group my-3 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/80">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-800/60 border-b border-zinc-800">
        <span className="text-xs text-zinc-500 uppercase tracking-wider">{language || "code"}</span>
        <button
          onClick={copy}
          className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors px-2 py-0.5 rounded"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-[12px] leading-relaxed text-emerald-200/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function QuizSection({ quiz, onAttempt }: { quiz: NonNullable<Lesson["quiz"]>; onAttempt?: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
      onAttempt?.();
    }
  };

  const isCorrect = selected === quiz.correctIndex;

  return (
    <div className="mt-8 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-5 py-3 bg-zinc-800/40 border-b border-zinc-800 flex items-center gap-2">
        <span className="text-amber-400">✦</span>
        <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Knowledge Check</span>
      </div>
      <div className="p-5">
        <p className="text-sm text-zinc-200 mb-4 leading-relaxed">{quiz.question}</p>
        <div className="space-y-2">
          {quiz.options.map((opt, i) => {
            let border = "border-zinc-800 hover:border-zinc-600";
            let bg = "bg-transparent hover:bg-zinc-900/50";
            let text = "text-zinc-400";
            if (submitted && i === quiz.correctIndex) {
              border = "border-emerald-500/50";
              bg = "bg-emerald-500/5";
              text = "text-emerald-300";
            } else if (submitted && i === selected && !isCorrect) {
              border = "border-red-500/50";
              bg = "bg-red-500/5";
              text = "text-red-300";
            } else if (!submitted && i === selected) {
              border = "border-emerald-500/30";
              bg = "bg-emerald-500/5";
              text = "text-zinc-200";
            }
            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted && selected === quiz.correctIndex}
                className={`w-full text-left px-4 py-3 rounded-md border transition-all text-xs leading-relaxed ${border} ${bg} ${text}`}
              >
                <span className="mr-2 font-mono text-zinc-600">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="mt-4 px-4 py-2 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Check Answer
          </button>
        )}
        {submitted && (
          <div className={`mt-4 p-3 rounded-md text-xs leading-relaxed border ${
            isCorrect
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-200"
              : "bg-amber-500/5 border-amber-500/20 text-amber-200"
          }`}>
            <p className="font-semibold mb-1">{isCorrect ? "✓ Correct!" : "✗ Not quite."}</p>
            <p className="text-zinc-400">{quiz.explanation}</p>
          </div>
        )}
        {submitted && selected !== quiz.correctIndex && (
          <button
            onClick={() => {
              setSubmitted(false);
              setSelected(null);
            }}
            className="mt-3 text-xs text-amber-400 hover:text-amber-300 border border-amber-500/30 rounded px-3 py-1.5 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

function diffLines(starter: string, solution: string) {
  const sLines = starter.split("\n");
  const solLines = solution.split("\n");
  const starterSet = new Set(sLines.map((l) => l.trim()));
  return solLines.map((line) => {
    const trimmed = line.trim();
    if (trimmed === "") return { line, status: "unchanged" as const };
    if (starterSet.has(trimmed)) return { line, status: "unchanged" as const };
    return { line, status: "changed" as const };
  });
}

function DiffCodeBlock({ starter, solution, revealed }: { starter: string; solution: string; revealed: boolean }) {
  const [copiedLeft, setCopiedLeft] = useState(false);
  const [copiedRight, setCopiedRight] = useState(false);
  const diffResult = diffLines(starter, solution);

  const copyStarter = () => { navigator.clipboard.writeText(starter); setCopiedLeft(true); setTimeout(() => setCopiedLeft(false), 2000); };
  const copySolution = () => { navigator.clipboard.writeText(solution); setCopiedRight(true); setTimeout(() => setCopiedRight(false), 2000); };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 my-3">
      {/* Starter - left */}
      <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/80">
        <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-800/60 border-b border-zinc-800">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">Your Starting Point</span>
          <button onClick={copyStarter} className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors px-2 py-0.5">
            {copiedLeft ? "✓ Copied" : "Copy"}
          </button>
        </div>
        <pre className="p-3 overflow-x-auto text-xs leading-relaxed">
          <code>{starter.split("\n").map((line, i) => (
            <div key={i} className="text-emerald-200/70">{line || "\u00A0"}</div>
          ))}</code>
        </pre>
      </div>
      {/* Solution - right */}
      <div className={`rounded-lg overflow-hidden border bg-zinc-900/80 transition-all duration-300 ${revealed ? "border-emerald-500/20" : "border-zinc-800"}`}>
        <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-800/60 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Solution</span>
            {revealed && (
              <span className="flex items-center gap-1.5 text-xs">
                <span className="inline-block w-2 h-2 rounded-sm bg-emerald-400/80" />
                <span className="text-emerald-400/70">= changed / added</span>
              </span>
            )}
          </div>
          {revealed && (
            <button onClick={copySolution} className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors px-2 py-0.5">
              {copiedRight ? "✓ Copied" : "Copy"}
            </button>
          )}
        </div>
        {revealed ? (
          <pre className="p-3 overflow-x-auto text-xs leading-relaxed">
            <code>{diffResult.map((d, i) => (
              <div
                key={i}
                className={
                  d.status === "changed"
                    ? "text-emerald-300 bg-emerald-500/10 -mx-3 px-3 border-l-2 border-emerald-400"
                    : "text-emerald-200/70"
                }
              >
                {d.line || "\u00A0"}
              </div>
            ))}</code>
          </pre>
        ) : (
          <div className="p-8 flex items-center justify-center">
            <p className="text-xs text-zinc-600 italic">Click "Reveal Solution" below to see the answer with changes highlighted</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Rank voices: neural/online > named quality voices > any English voice
function pickBestVoice(): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices();
  const english = voices.filter(v => v.lang.startsWith("en"));
  if (english.length === 0) return undefined;

  // Tier 1: Neural / Online voices (Edge, Chrome)
  const neural = english.find(v =>
    v.name.includes("Online") || v.name.includes("Neural") || v.name.includes("Natural")
  );
  if (neural) return neural;

  // Tier 2: Known high-quality voices by platform
  const quality = [
    "Microsoft Jenny", "Microsoft Aria", "Microsoft Guy",  // Windows 11
    "Google US English",                                     // Chrome
    "Samantha", "Karen", "Daniel",                          // macOS
  ];
  const known = english.find(v => quality.some(q => v.name.includes(q)));
  if (known) return known;

  // Tier 3: Any English voice, prefer non-compact
  return english.find(v => !v.name.includes("Compact")) || english[0];
}

function useNarrationAudio(exerciseKey: string) {
  const [available, setAvailable] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  React.useEffect(() => {
    const path = `/audio/narrations/${exerciseKey}.mp3`;
    const audio = new Audio(path);
    audio.addEventListener("canplaythrough", () => {
      audioRef.current = audio;
      setAvailable(true);
    });
    audio.addEventListener("error", () => setAvailable(false));
    audio.addEventListener("ended", () => setPlaying(false));
    audio.load();
    return () => { audio.pause(); audio.src = ""; };
  }, [exerciseKey]);

  const toggle = React.useCallback(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }, [playing]);

  return { available, playing, toggle };
}

function useNarrationSpeech(text: string) {
  const [speaking, setSpeaking] = useState(false);

  const toggle = React.useCallback(() => {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    const voice = pickBestVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    speechSynthesis.speak(utterance);
  }, [text, speaking]);

  React.useEffect(() => {
    return () => { speechSynthesis.cancel(); };
  }, []);

  return { speaking, toggle };
}

function ExerciseSection({ exercise, exerciseKey }: { exercise: NonNullable<Lesson["exercise"]>; exerciseKey?: string }) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const audioKey = exerciseKey || exercise.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const narrationAudio = useNarrationAudio(audioKey);
  const narrationSpeech = useNarrationSpeech(exercise.narration || "");
  const isPlaying = narrationAudio.playing || narrationSpeech.speaking;
  const handleListen = narrationAudio.available ? narrationAudio.toggle : narrationSpeech.toggle;

  return (
    <div className="mt-8 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-5 py-3 bg-zinc-800/40 border-b border-zinc-800 flex items-center gap-2">
        <span className="text-blue-400">⚡</span>
        <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Hands-On Exercise</span>
      </div>
      <div className="p-5">
        <h4 className="text-sm font-semibold text-zinc-200 mb-1">{exercise.title}</h4>
        <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{exercise.description}</p>

        {exercise.narration && (
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowWalkthrough(!showWalkthrough)}
                className="text-xs text-sky-400/80 hover:text-sky-300 transition-colors flex items-center gap-1.5"
              >
                <span>{showWalkthrough ? "▾" : "▸"}</span>
                <span className="font-medium">Walkthrough Guide</span>
              </button>
              <button
                onClick={handleListen}
                className={`text-xs flex items-center gap-1 transition-colors ${
                  isPlaying
                    ? "text-sky-300 animate-pulse"
                    : "text-zinc-500 hover:text-sky-400"
                }`}
                title={isPlaying ? "Stop narration" : "Listen to walkthrough"}
              >
                <span>{isPlaying ? "◼" : "▶"}</span>
                <span>{isPlaying ? "Stop" : "Listen"}</span>
                {narrationAudio.available && <span className="text-[9px] text-sky-500/60 ml-0.5">HD</span>}
              </button>
            </div>
            {showWalkthrough && (
              <div className="mt-2 p-3 rounded-md bg-sky-950/30 border border-sky-800/30">
                <p className="text-xs text-sky-200/80 leading-relaxed whitespace-pre-line">{exercise.narration}</p>
              </div>
            )}
          </div>
        )}

        <DiffCodeBlock
          starter={exercise.starterCode}
          solution={exercise.solutionCode}
          revealed={showSolution}
        />

        <div className="flex items-center gap-3 mt-3">
          {!showSolution && (
            <button
              onClick={() => setShowSolution(true)}
              className="px-4 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
            >
              Reveal Solution
            </button>
          )}
          {showSolution && (
            <button
              onClick={() => setShowSolution(false)}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-md transition-colors"
            >
              Hide Solution
            </button>
          )}
          {exercise.hints.length > 0 && (
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-xs text-amber-500/80 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              {showHints ? "▾ Hide hints" : "▸ Need a hint?"}
            </button>
          )}
        </div>

        {showHints && exercise.hints.length > 0 && (
          <div className="mt-3 space-y-1.5 pl-3 border-l border-amber-500/20">
            {exercise.hints.map((h, i) => (
              <p key={i} className="text-xs text-zinc-400">
                <span className="text-amber-500/60 mr-1">→</span> {h}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const DIFFICULTY_CONFIG = {
  beginner: { label: "Beginner", color: "text-green-400", border: "border-green-500/30", bg: "bg-green-500/10" },
  intermediate: { label: "Intermediate", color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
  advanced: { label: "Advanced", color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/10" },
} as const;

type DifficultyFilter = "all" | "beginner" | "intermediate" | "advanced";

function DifficultyBadge({ difficulty }: { difficulty?: CodeExercise["difficulty"] }) {
  if (!difficulty) return null;
  const cfg = DIFFICULTY_CONFIG[difficulty];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cfg.color} ${cfg.border} ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
}

function ExercisesSection({ exercises }: { exercises: CodeExercise[] }) {
  const [filter, setFilter] = useState<DifficultyFilter>("all");

  const filters: DifficultyFilter[] = ["all", "beginner", "intermediate", "advanced"];

  const filtered = filter === "all"
    ? exercises
    : exercises.filter((e) => e.difficulty === filter);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {filters.map((f) => {
          const isActive = filter === f;
          const base = "px-3 py-1.5 rounded-md text-xs font-medium border transition-colors";
          let style: string;
          if (f === "all") {
            style = isActive
              ? "border-zinc-600 bg-zinc-800 text-zinc-200"
              : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700";
          } else {
            const cfg = DIFFICULTY_CONFIG[f];
            style = isActive
              ? `${cfg.border} ${cfg.bg} ${cfg.color}`
              : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700";
          }
          return (
            <button key={f} onClick={() => setFilter(f)} className={`${base} ${style}`}>
              {f === "all" ? "All" : DIFFICULTY_CONFIG[f].label}
            </button>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <p className="text-xs text-zinc-600 italic py-4">No exercises match this difficulty level.</p>
      ) : (
        <div className="space-y-6">
          {filtered.map((exercise, i) => (
            <div key={i} className="relative">
              {exercise.difficulty && (
                <div className="mb-2">
                  <DifficultyBadge difficulty={exercise.difficulty} />
                </div>
              )}
              <ExerciseSection exercise={exercise} exerciseKey={`${exercise.difficulty || "ex"}-${i}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PromptTemplateSection({ templates }: { templates: NonNullable<Lesson["promptTemplates"]> }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyPrompt = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="mt-8 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-5 py-3 bg-zinc-800/40 border-b border-zinc-800 flex items-center gap-2">
        <span className="text-violet-400">📋</span>
        <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Prompt Template Library</span>
        <Badge variant="outline" className="ml-auto text-xs border-violet-500/30 text-violet-400">{templates.length} templates</Badge>
      </div>
      <div className="p-3">
        <Accordion type="single" collapsible className="space-y-1">
          {templates.map((t, i) => (
            <AccordionItem key={i} value={`tpl-${i}`} className="border border-zinc-800 rounded-md overflow-hidden">
              <AccordionTrigger className="px-3 py-2.5 text-xs text-zinc-300 hover:text-zinc-100 hover:no-underline [&[data-state=open]]:bg-zinc-800/30">
                {t.label}
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <p className="text-xs text-zinc-500 mb-2 italic">{t.context}</p>
                <div className="relative bg-zinc-900/80 border border-zinc-800 rounded-md">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800/50">
                    <span className="text-xs text-zinc-600 uppercase tracking-wider">Copilot Chat Prompt</span>
                    <button
                      onClick={() => copyPrompt(t.prompt, i)}
                      className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors px-2 py-0.5"
                    >
                      {copiedIdx === i ? "✓ Copied!" : "Copy Prompt"}
                    </button>
                  </div>
                  <pre className="p-3 text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap overflow-x-auto">{t.prompt}</pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

function TableBlock({ table }: { table: { headers: string[]; rows: string[][] } }) {
  return (
    <div className="my-3 overflow-x-auto border border-zinc-800 rounded-lg">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-zinc-800/50">
            {table.headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left text-zinc-400 font-medium border-b border-zinc-800 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-zinc-300 leading-relaxed">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LessonView({ lesson, lessonIndex, totalLessons, onNext, onPrev, onComplete, isCompleted, sidebarOpen, onToggleSidebar }: LessonViewProps) {
  const [quizAttempted, setQuizAttempted] = useState(false);

  useEffect(() => {
    setQuizAttempted(false);
  }, [lesson.id]);

  const canComplete = !lesson.quiz || quizAttempted;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <button onClick={onToggleSidebar} className="text-zinc-600 hover:text-zinc-400 transition-colors mr-1">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          )}
          <span className="text-xs text-zinc-600 font-mono">
            {String(lessonIndex + 1).padStart(2, "0")} / {String(totalLessons).padStart(2, "0")}
          </span>
        </div>
        {isCompleted && (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
            ✓ Completed
          </Badge>
        )}
      </div>

      {/* Progress indicator */}
      <div className="h-0.5 bg-zinc-800 rounded-full mb-6">
        <div
          className="h-full bg-emerald-500/60 rounded-full transition-all duration-300"
          style={{ width: `${((lessonIndex + 1) / totalLessons) * 100}%` }}
        />
      </div>

      {/* Title */}
      <div className="mb-8">
        <span className="text-3xl mb-2 block" role="img" aria-label={lesson.title}>{lesson.icon}</span>
        <h2 className="text-2xl font-bold text-zinc-100 tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {lesson.title}
        </h2>
        <p className="text-sm text-zinc-500 mt-1">{lesson.subtitle}</p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {lesson.sections.map((section, i) => (
          <section key={i}>
            <h3 className="text-sm font-semibold text-zinc-200 mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full inline-block flex-shrink-0" />
              {section.heading}
            </h3>
            <p className="text-[13px] text-zinc-400 leading-relaxed">{section.content}</p>
            {section.callout && (
              <div className="mt-3 px-4 py-3 border-l-2 border-emerald-500 bg-emerald-500/5 rounded-r-md">
                <p className="text-[12px] text-emerald-200/80 leading-relaxed">{section.callout}</p>
              </div>
            )}
            {section.tip && (
              <div className="mt-3 px-4 py-2.5 bg-blue-500/5 border border-blue-500/10 rounded-md">
                <p className="text-xs text-blue-300/80 leading-relaxed">
                  <span className="font-semibold text-blue-400">Tip:</span> {section.tip}
                </p>
              </div>
            )}
            {section.warning && (
              <div className="mt-3 px-4 py-2.5 bg-red-500/5 border border-red-500/10 rounded-md">
                <p className="text-xs text-red-300/80 leading-relaxed whitespace-pre-line">
                  <span className="font-semibold text-red-400">⚠ Warning:</span> {section.warning}
                </p>
              </div>
            )}
            {section.table && <TableBlock table={section.table} />}
            {section.code && <CodeBlock code={section.code} language={section.codeLanguage} />}
          </section>
        ))}
      </div>

      {/* Prompt Templates */}
      {lesson.promptTemplates && lesson.promptTemplates.length > 0 && (
        <PromptTemplateSection templates={lesson.promptTemplates} />
      )}

      {/* Quiz */}
      {lesson.quiz && <QuizSection quiz={lesson.quiz} onAttempt={() => setQuizAttempted(true)} />}

      {/* Exercises */}
      {lesson.exercises && lesson.exercises.length > 0 ? (
        <ExercisesSection exercises={lesson.exercises} />
      ) : (
        lesson.exercise && <ExerciseSection exercise={lesson.exercise} />
      )}

      {/* Practice Link */}
      {lesson.practiceLink && (
        <a
          href={lesson.practiceLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-8 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors"
        >
          <div className="text-emerald-400 font-semibold text-sm mb-1">
            Try It Now
          </div>
          <div className="text-xs text-zinc-300">{lesson.practiceLink.label}</div>
          {lesson.practiceLink.description && (
            <div className="text-xs text-zinc-500 mt-1">{lesson.practiceLink.description}</div>
          )}
        </a>
      )}

      {/* Navigation */}
      <div className="mt-12 pt-6 border-t border-zinc-800 flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={lessonIndex === 0}
          className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>
        <div className="flex items-center gap-3">
          {!isCompleted && (
            <button
              onClick={onComplete}
              disabled={!canComplete}
              className={`px-4 py-2 text-xs border rounded-md transition-all ${
                canComplete
                  ? "text-zinc-400 hover:text-emerald-400 border-zinc-800 hover:border-emerald-500/30"
                  : "text-zinc-600 border-zinc-800/50 cursor-not-allowed opacity-50"
              }`}
            >
              {canComplete ? "Mark Complete" : "Complete Quiz First"}
            </button>
          )}
          <button
            onClick={onNext}
            disabled={lessonIndex === totalLessons - 1}
            className="px-5 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-md disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            Next Lesson →
          </button>
        </div>
      </div>

      <div className="h-12" />
    </div>
  );
}
