import { useState } from "react";
import type { Lesson } from "../data";
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
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{language || "code"}</span>
        <button
          onClick={copy}
          className="text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors px-2 py-0.5 rounded"
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

function QuizSection({ quiz }: { quiz: NonNullable<Lesson["quiz"]> }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected !== null) setSubmitted(true);
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
                disabled={submitted}
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
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Your Starting Point</span>
          <button onClick={copyStarter} className="text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors px-2 py-0.5">
            {copiedLeft ? "✓ Copied" : "Copy"}
          </button>
        </div>
        <pre className="p-3 overflow-x-auto text-[11px] leading-relaxed">
          <code>{starter.split("\n").map((line, i) => (
            <div key={i} className="text-emerald-200/70">{line || "\u00A0"}</div>
          ))}</code>
        </pre>
      </div>
      {/* Solution - right */}
      <div className={`rounded-lg overflow-hidden border bg-zinc-900/80 transition-all duration-300 ${revealed ? "border-emerald-500/20" : "border-zinc-800"}`}>
        <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-800/60 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Solution</span>
            {revealed && (
              <span className="flex items-center gap-1.5 text-[9px]">
                <span className="inline-block w-2 h-2 rounded-sm bg-emerald-400/80" />
                <span className="text-emerald-400/70">= changed / added</span>
              </span>
            )}
          </div>
          {revealed && (
            <button onClick={copySolution} className="text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors px-2 py-0.5">
              {copiedRight ? "✓ Copied" : "Copy"}
            </button>
          )}
        </div>
        {revealed ? (
          <pre className="p-3 overflow-x-auto text-[11px] leading-relaxed">
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

function ExerciseSection({ exercise }: { exercise: NonNullable<Lesson["exercise"]> }) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="mt-8 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-5 py-3 bg-zinc-800/40 border-b border-zinc-800 flex items-center gap-2">
        <span className="text-blue-400">⚡</span>
        <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Hands-On Exercise</span>
      </div>
      <div className="p-5">
        <h4 className="text-sm font-semibold text-zinc-200 mb-1">{exercise.title}</h4>
        <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{exercise.description}</p>

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
              className="text-[11px] text-amber-500/80 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              {showHints ? "▾ Hide hints" : "▸ Need a hint?"}
            </button>
          )}
        </div>

        {showHints && exercise.hints.length > 0 && (
          <div className="mt-3 space-y-1.5 pl-3 border-l border-amber-500/20">
            {exercise.hints.map((h, i) => (
              <p key={i} className="text-[11px] text-zinc-400">
                <span className="text-amber-500/60 mr-1">→</span> {h}
              </p>
            ))}
          </div>
        )}
      </div>
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
        <Badge variant="outline" className="ml-auto text-[9px] border-violet-500/30 text-violet-400">{templates.length} templates</Badge>
      </div>
      <div className="p-3">
        <Accordion type="single" collapsible className="space-y-1">
          {templates.map((t, i) => (
            <AccordionItem key={i} value={`tpl-${i}`} className="border border-zinc-800 rounded-md overflow-hidden">
              <AccordionTrigger className="px-3 py-2.5 text-xs text-zinc-300 hover:text-zinc-100 hover:no-underline [&[data-state=open]]:bg-zinc-800/30">
                {t.label}
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <p className="text-[11px] text-zinc-500 mb-2 italic">{t.context}</p>
                <div className="relative bg-zinc-900/80 border border-zinc-800 rounded-md">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800/50">
                    <span className="text-[9px] text-zinc-600 uppercase tracking-wider">Copilot Chat Prompt</span>
                    <button
                      onClick={() => copyPrompt(t.prompt, i)}
                      className="text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors px-2 py-0.5"
                    >
                      {copiedIdx === i ? "✓ Copied!" : "Copy Prompt"}
                    </button>
                  </div>
                  <pre className="p-3 text-[11px] leading-relaxed text-zinc-300 whitespace-pre-wrap overflow-x-auto">{t.prompt}</pre>
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
          <span className="text-[10px] text-zinc-600 font-mono">
            {String(lessonIndex + 1).padStart(2, "0")} / {String(totalLessons).padStart(2, "0")}
          </span>
          {lesson.audience && (
            <Badge
              variant="outline"
              className={`text-[9px] ${
                lesson.audience.includes("Non-Coder")
                  ? "border-amber-500/30 text-amber-400"
                  : lesson.audience.includes("Developer")
                  ? "border-blue-500/30 text-blue-400"
                  : "border-zinc-700 text-zinc-500"
              }`}
            >
              {lesson.audience}
            </Badge>
          )}
        </div>
        {isCompleted && (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
            ✓ Completed
          </Badge>
        )}
      </div>

      {/* Title */}
      <div className="mb-8">
        <span className="text-3xl mb-2 block">{lesson.icon}</span>
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
                <p className="text-[11px] text-blue-300/80 leading-relaxed">
                  <span className="font-semibold text-blue-400">Tip:</span> {section.tip}
                </p>
              </div>
            )}
            {section.warning && (
              <div className="mt-3 px-4 py-2.5 bg-red-500/5 border border-red-500/10 rounded-md">
                <p className="text-[11px] text-red-300/80 leading-relaxed whitespace-pre-line">
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
      {lesson.quiz && <QuizSection quiz={lesson.quiz} />}

      {/* Exercise */}
      {lesson.exercise && <ExerciseSection exercise={lesson.exercise} />}

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
              className="px-4 py-2 text-xs text-zinc-400 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-500/30 rounded-md transition-all"
            >
              Mark Complete
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
