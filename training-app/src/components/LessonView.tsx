import { useState } from "react";
import type { Lesson, ModuleCategory } from "../data";
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
  category?: ModuleCategory;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
}

const categoryLabels: Record<ModuleCategory, string> = {
  foundations: "Foundations",
  core: "Core Skills",
  workflows: "Workflows",
  advanced: "Advanced",
  devops: "DevOps & CI",
};

const categoryColorClass: Record<ModuleCategory, string> = {
  foundations: "text-cat-foundations",
  core: "text-cat-core",
  workflows: "text-cat-workflows",
  advanced: "text-cat-advanced",
  devops: "text-cat-devops",
};

const blueprintCategories: ModuleCategory[] = ["core", "advanced", "devops"];

/* ────────────────────────────────────────────────────
   CodeBlock
   ──────────────────────────────────────────────────── */
function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-border bg-card">
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-0.5 bg-background rounded">
          {language || "code"}
        </span>
        <button
          onClick={copy}
          className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-0.5 rounded"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed text-foreground/90 font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   QuizSection
   ──────────────────────────────────────────────────── */
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
    <div className="mt-10 bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 bg-muted border-b border-border flex items-center gap-2">
        <span className="text-amber-500">✦</span>
        <span className="text-sm font-semibold text-foreground">Knowledge Check</span>
      </div>
      <div className="p-6">
        <p className="text-base text-foreground mb-5 leading-relaxed">{quiz.question}</p>
        <div className="space-y-2.5">
          {quiz.options.map((opt, i) => {
            let classes = "border-border hover:border-primary/40 bg-background";
            let textClass = "text-foreground/80";
            let indicator = "";
            if (submitted && i === quiz.correctIndex) {
              classes = "border-green-500 bg-green-50 dark:bg-green-500/10";
              textClass = "text-green-700 dark:text-green-400";
              indicator = "✓";
            } else if (submitted && i === selected && !isCorrect) {
              classes = "border-red-500 bg-red-50 dark:bg-red-500/10";
              textClass = "text-red-700 dark:text-red-400";
              indicator = "✗";
            } else if (!submitted && i === selected) {
              classes = "border-primary bg-primary/5";
              textClass = "text-foreground";
            }
            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted && selected === quiz.correctIndex}
                className={`w-full text-left px-5 py-3.5 rounded-lg border transition-all text-sm leading-relaxed flex items-center gap-3 ${classes} ${textClass}`}
              >
                <span className="font-mono text-muted-foreground text-xs w-5 flex-shrink-0">
                  {indicator || String.fromCharCode(65 + i) + "."}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="mt-5 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Check Answer
          </button>
        )}
        {submitted && (
          <div className={`mt-5 p-4 rounded-lg text-sm leading-relaxed border ${
            isCorrect
              ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-800 dark:text-green-300"
              : "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300"
          }`}>
            <p className="font-semibold mb-1 flex items-center gap-1.5">
              {isCorrect ? "✓ Correct!" : "✗ Not quite."}
            </p>
            <p className="text-foreground/70">{quiz.explanation}</p>
          </div>
        )}
        {submitted && selected !== quiz.correctIndex && (
          <button
            onClick={() => {
              setSubmitted(false);
              setSelected(null);
            }}
            className="mt-3 text-sm text-primary hover:text-primary/80 border border-primary/30 rounded-lg px-4 py-2 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   Diff helpers
   ──────────────────────────────────────────────────── */
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

/* ────────────────────────────────────────────────────
   DiffCodeBlock
   ──────────────────────────────────────────────────── */
function DiffCodeBlock({ starter, solution, revealed }: { starter: string; solution: string; revealed: boolean }) {
  const [copiedLeft, setCopiedLeft] = useState(false);
  const [copiedRight, setCopiedRight] = useState(false);
  const diffResult = diffLines(starter, solution);

  const copyStarter = () => { navigator.clipboard.writeText(starter); setCopiedLeft(true); setTimeout(() => setCopiedLeft(false), 2000); };
  const copySolution = () => { navigator.clipboard.writeText(solution); setCopiedRight(true); setTimeout(() => setCopiedRight(false), 2000); };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 my-4">
      {/* Starter */}
      <div className="rounded-lg overflow-hidden border border-border bg-card">
        <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Starting Point</span>
          <button onClick={copyStarter} className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-0.5">
            {copiedLeft ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed font-mono">
          <code>{starter.split("\n").map((line, i) => (
            <div key={i} className="text-foreground/70">{line || "\u00A0"}</div>
          ))}</code>
        </pre>
      </div>
      {/* Solution */}
      <div className={`rounded-lg overflow-hidden border bg-card transition-all duration-300 ${revealed ? "border-green-400 dark:border-green-500/40" : "border-border"}`}>
        <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Solution</span>
            {revealed && (
              <span className="flex items-center gap-1.5 text-xs">
                <span className="inline-block w-2 h-2 rounded-sm bg-green-500" />
                <span className="text-green-600 dark:text-green-400">= changed / added</span>
              </span>
            )}
          </div>
          {revealed && (
            <button onClick={copySolution} className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-0.5">
              {copiedRight ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
        {revealed ? (
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed font-mono">
            <code>{diffResult.map((d, i) => (
              <div
                key={i}
                className={
                  d.status === "changed"
                    ? "text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-500/10 -mx-4 px-4 border-l-2 border-green-500"
                    : "text-foreground/70"
                }
              >
                {d.line || "\u00A0"}
              </div>
            ))}</code>
          </pre>
        ) : (
          <div className="p-8 flex items-center justify-center">
            <p className="text-sm text-muted-foreground italic">Click "Reveal Solution" below to see the answer with changes highlighted</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   ExerciseSection
   ──────────────────────────────────────────────────── */
function ExerciseSection({ exercise }: { exercise: NonNullable<Lesson["exercise"]> }) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="mt-10 bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 bg-muted border-b border-border flex items-center gap-2">
        <span className="text-blue-500">⚡</span>
        <span className="text-sm font-semibold text-foreground">Hands-On Exercise</span>
      </div>
      <div className="p-6">
        <h4 className="text-base font-semibold text-foreground mb-1">{exercise.title}</h4>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{exercise.description}</p>

        <DiffCodeBlock
          starter={exercise.starterCode}
          solution={exercise.solutionCode}
          revealed={showSolution}
        />

        <div className="flex items-center gap-3 mt-4">
          {!showSolution && (
            <button
              onClick={() => setShowSolution(true)}
              className="px-5 py-2.5 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
            >
              Reveal Solution
            </button>
          )}
          {showSolution && (
            <button
              onClick={() => setShowSolution(false)}
              className="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
            >
              Hide Solution
            </button>
          )}
          {exercise.hints.length > 0 && (
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors flex items-center gap-1"
            >
              {showHints ? "▾ Hide hints" : "▸ Need a hint?"}
            </button>
          )}
        </div>

        {showHints && exercise.hints.length > 0 && (
          <div className="mt-4 space-y-2 pl-4 border-l-2 border-amber-300 dark:border-amber-500/30">
            {exercise.hints.map((h, i) => (
              <p key={i} className="text-sm text-foreground/70">
                <span className="text-amber-500 font-semibold mr-1.5">{i + 1}.</span> {h}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   PromptTemplateSection
   ──────────────────────────────────────────────────── */
function PromptTemplateSection({ templates }: { templates: NonNullable<Lesson["promptTemplates"]> }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyPrompt = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="mt-10 bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 bg-muted border-b border-border flex items-center gap-2">
        <span className="text-violet-500">📋</span>
        <span className="text-sm font-semibold text-foreground">Prompt Template Library</span>
        <Badge variant="outline" className="ml-auto text-xs border-violet-300 dark:border-violet-500/30 text-violet-600 dark:text-violet-400">
          {templates.length} templates
        </Badge>
      </div>
      <div className="p-4">
        <Accordion type="single" collapsible className="space-y-1.5">
          {templates.map((t, i) => (
            <AccordionItem key={i} value={`tpl-${i}`} className="border border-border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 text-sm text-foreground hover:text-foreground hover:no-underline [&[data-state=open]]:bg-muted/50">
                {t.label}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <p className="text-sm text-muted-foreground mb-3 italic">{t.context}</p>
                <div className="relative bg-muted rounded-lg">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Copilot Chat Prompt</span>
                    <button
                      onClick={() => copyPrompt(t.prompt, i)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-0.5"
                    >
                      {copiedIdx === i ? "Copied!" : "Copy Prompt"}
                    </button>
                  </div>
                  <pre className="p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap overflow-x-auto font-mono">{t.prompt}</pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   TableBlock
   ──────────────────────────────────────────────────── */
function TableBlock({ table }: { table: { headers: string[]; rows: string[][] } }) {
  return (
    <div className="my-4 overflow-x-auto border border-border rounded-lg bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted">
            {table.headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left text-muted-foreground font-medium border-b border-border whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-b border-border last:border-0 even:bg-muted/30 hover:bg-muted/50 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-foreground/80 leading-relaxed">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   LessonView (main)
   ──────────────────────────────────────────────────── */
export function LessonView({
  lesson,
  lessonIndex,
  totalLessons,
  onNext,
  onPrev,
  onComplete,
  isCompleted,
  sidebarOpen,
  onToggleSidebar,
  category,
}: LessonViewProps) {
  // Reset quiz state when lesson changes by keying on lesson.id
  const [quizKey, setQuizKey] = useState(lesson.id);
  const [quizAttempted, setQuizAttempted] = useState(false);

  if (quizKey !== lesson.id) {
    setQuizKey(lesson.id);
    setQuizAttempted(false);
  }

  const canComplete = !lesson.quiz || quizAttempted;
  const catClass = category ? `cat-${category}` : "";
  const showBlueprint = category && blueprintCategories.includes(category);

  return (
    <div className={`max-w-3xl mx-auto px-6 py-10 animate-fade-up ${catClass}`}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <button onClick={onToggleSidebar} className="text-muted-foreground hover:text-foreground transition-colors mr-1">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          )}
          <span className="text-xs text-muted-foreground font-mono">
            {String(lessonIndex + 1).padStart(2, "0")} / {String(totalLessons).padStart(2, "0")}
          </span>
          {category && (
            <span className={`text-xs font-semibold uppercase tracking-wider ${categoryColorClass[category]}`}>
              {categoryLabels[category]}
            </span>
          )}
          {lesson.audience && (
            <Badge
              variant="outline"
              className="text-xs border-border text-muted-foreground"
            >
              {lesson.audience}
            </Badge>
          )}
        </div>
        {isCompleted && (
          <Badge className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20 text-xs">
            ✓ Completed
          </Badge>
        )}
      </div>

      {/* Progress indicator */}
      <div className="h-1 bg-muted rounded-full mb-8">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${((lessonIndex + 1) / totalLessons) * 100}%` }}
        />
      </div>

      {/* Title zone — with optional blueprint grid */}
      <div className={`mb-10 ${showBlueprint ? "blueprint-grid -mx-6 px-6 py-8 rounded-lg" : ""}`}>
        <span className="text-4xl mb-3 block" role="img" aria-label={lesson.title}>{lesson.icon}</span>
        <h2 className="text-3xl font-display font-bold text-foreground tracking-tight leading-tight">
          {lesson.title}
        </h2>
        <p className="text-lg text-muted-foreground mt-2">{lesson.subtitle}</p>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {lesson.sections.map((section, i) => (
          <section key={i}>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2.5">
              <span
                className="w-1.5 h-5 rounded-full inline-block flex-shrink-0"
                style={{ backgroundColor: "hsl(var(--cat-accent, var(--primary)))" }}
              />
              {section.heading}
            </h3>
            <p className="text-[15px] text-foreground/75 leading-relaxed">{section.content}</p>

            {section.callout && (
              <div className="mt-4 px-5 py-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                <p className="text-sm text-foreground/80 leading-relaxed">{section.callout}</p>
              </div>
            )}
            {section.tip && (
              <div className="mt-4 px-5 py-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
                <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-300">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Tip: </span>{section.tip}
                </p>
              </div>
            )}
            {section.warning && (
              <div className="mt-4 px-5 py-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg">
                <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300 whitespace-pre-line">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">⚠ Warning: </span>{section.warning}
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

      {/* Exercise */}
      {lesson.exercise && <ExerciseSection exercise={lesson.exercise} />}

      {/* Practice Link */}
      {lesson.practiceLink && (
        <a
          href={lesson.practiceLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-10 p-5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
        >
          <div className="text-primary font-semibold text-base mb-1">
            Try It Now →
          </div>
          <div className="text-sm text-foreground/70">{lesson.practiceLink.label}</div>
          {lesson.practiceLink.description && (
            <div className="text-sm text-muted-foreground mt-1">{lesson.practiceLink.description}</div>
          )}
        </a>
      )}

      {/* Navigation */}
      <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={lessonIndex === 0}
          className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>
        <div className="flex items-center gap-3">
          {!isCompleted && (
            <button
              onClick={onComplete}
              disabled={!canComplete}
              className={`px-5 py-2.5 text-sm border rounded-lg transition-all ${
                canComplete
                  ? "text-muted-foreground hover:text-primary border-border hover:border-primary"
                  : "text-muted-foreground/50 border-border/50 cursor-not-allowed opacity-50"
              }`}
            >
              {canComplete ? "Mark Complete" : "Complete Quiz First"}
            </button>
          )}
          <button
            onClick={onNext}
            disabled={lessonIndex === totalLessons - 1}
            className="px-6 py-2.5 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            Next Lesson →
          </button>
        </div>
      </div>

      <div className="h-12" />
    </div>
  );
}
