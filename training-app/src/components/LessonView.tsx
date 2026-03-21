import { useState, useEffect } from "react";
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
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const categoryLabels: Record<ModuleCategory, string> = {
  foundations: "Foundations",
  core: "Core",
  workflows: "Workflows",
  advanced: "Advanced",
  devops: "DevOps",
};

const categoryBadgeColors: Record<ModuleCategory, string> = {
  foundations: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  core: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
  workflows: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
  advanced: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  devops: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

const blueprintCategories: ModuleCategory[] = ["core", "advanced", "devops"];

/* ------------------------------------------------------------------ */
/*  Icons (inline SVGs)                                                */
/* ------------------------------------------------------------------ */

function IconCopy({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconStar({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconBolt({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconClipboard({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function IconInfo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function IconWarning({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconExternalLink({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconChevronLeft({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconMenu({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  CodeBlock                                                          */
/* ------------------------------------------------------------------ */

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group my-4 bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-muted border-b border-border px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider bg-background px-2.5 py-0.5 rounded-full border border-border">
          {language || "code"}
        </span>
        <button
          onClick={copy}
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-0.5 rounded"
        >
          {copied ? (
            <><IconCheck size={13} /> Copied</>
          ) : (
            <><IconCopy size={13} /> Copy</>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed text-foreground/90 font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  QuizSection                                                        */
/* ------------------------------------------------------------------ */

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
      <div className="px-6 py-4 bg-muted border-b border-border flex items-center gap-2.5">
        <span className="text-amber-500 dark:text-amber-400"><IconStar /></span>
        <span className="font-semibold text-foreground">Knowledge Check</span>
      </div>
      <div className="p-6">
        <p className="text-base text-foreground mb-5 leading-relaxed">{quiz.question}</p>
        <div className="space-y-3">
          {quiz.options.map((opt, i) => {
            let containerClass = "border-border hover:border-primary/40 bg-background";
            let radioClass = "border-border";
            let radioFilled = false;

            if (submitted && i === quiz.correctIndex) {
              containerClass = "border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400";
              radioClass = "border-green-500";
              radioFilled = true;
            } else if (submitted && i === selected && !isCorrect) {
              containerClass = "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400";
              radioClass = "border-red-500";
              radioFilled = true;
            } else if (!submitted && i === selected) {
              containerClass = "border-primary bg-primary/5";
              radioClass = "border-primary";
              radioFilled = true;
            }

            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted && selected === quiz.correctIndex}
                className={`w-full text-left px-4 py-3.5 rounded-lg border transition-all text-[15px] leading-relaxed flex items-start gap-3 ${containerClass}`}
              >
                <span className={`mt-0.5 flex-shrink-0 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${radioClass}`}>
                  {radioFilled && <span className="w-2.5 h-2.5 rounded-full bg-current" />}
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
          <div className={`mt-5 p-4 rounded-lg text-sm leading-relaxed border flex items-start gap-3 ${
            isCorrect
              ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400"
          }`}>
            <span className="flex-shrink-0 mt-0.5">
              {isCorrect ? <IconCheck size={20} /> : <IconX size={20} />}
            </span>
            <div>
              <p className="font-semibold mb-1">{isCorrect ? "Correct!" : "Not quite."}</p>
              <p className="text-muted-foreground">{quiz.explanation}</p>
            </div>
          </div>
        )}
        {submitted && selected !== quiz.correctIndex && (
          <button
            onClick={() => {
              setSubmitted(false);
              setSelected(null);
            }}
            className="mt-4 text-sm text-primary hover:text-primary/80 border border-border hover:border-primary rounded-lg px-4 py-2 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  diffLines helper                                                   */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  DiffCodeBlock                                                      */
/* ------------------------------------------------------------------ */

function DiffCodeBlock({ starter, solution, revealed }: { starter: string; solution: string; revealed: boolean }) {
  const [copiedLeft, setCopiedLeft] = useState(false);
  const [copiedRight, setCopiedRight] = useState(false);
  const diffResult = diffLines(starter, solution);

  const copyStarter = () => { navigator.clipboard.writeText(starter); setCopiedLeft(true); setTimeout(() => setCopiedLeft(false), 2000); };
  const copySolution = () => { navigator.clipboard.writeText(solution); setCopiedRight(true); setTimeout(() => setCopiedRight(false), 2000); };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 my-4">
      {/* Starter - left */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-muted border-b border-border px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Starting Point</span>
          <button onClick={copyStarter} className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-0.5">
            <IconCopy size={13} />
            {copiedLeft ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
          <code>{starter.split("\n").map((line, i) => (
            <div key={i} className="text-foreground/70">{line || "\u00A0"}</div>
          ))}</code>
        </pre>
      </div>
      {/* Solution - right */}
      <div className={`bg-card border rounded-lg overflow-hidden transition-all duration-300 ${revealed ? "border-green-500/30" : "border-border"}`}>
        <div className="flex items-center justify-between bg-muted border-b border-border px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Solution</span>
            {revealed && (
              <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                <span className="inline-block w-2 h-2 rounded-sm bg-green-500" />
                = changed / added
              </span>
            )}
          </div>
          {revealed && (
            <button onClick={copySolution} className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-0.5">
              <IconCopy size={13} />
              {copiedRight ? "Copied" : "Copy"}
            </button>
          )}
        </div>
        {revealed ? (
          <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
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
          <div className="p-10 flex items-center justify-center">
            <p className="text-sm text-muted-foreground italic">Click &quot;Reveal Solution&quot; below to see the answer with changes highlighted</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ExerciseSection                                                    */
/* ------------------------------------------------------------------ */

function ExerciseSection({ exercise }: { exercise: NonNullable<Lesson["exercise"]> }) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="mt-10 bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 bg-muted border-b border-border flex items-center gap-2.5">
        <span className="text-blue-500 dark:text-blue-400"><IconBolt /></span>
        <span className="font-semibold text-foreground">Hands-On Exercise</span>
      </div>
      <div className="p-6">
        <h4 className="text-base font-semibold text-foreground mb-1.5">{exercise.title}</h4>
        <p className="text-[15px] text-muted-foreground mb-5 leading-relaxed">{exercise.description}</p>

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
              className="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 rounded-lg transition-colors"
            >
              Hide Solution
            </button>
          )}
          {exercise.hints.length > 0 && (
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <IconInfo size={15} />
              {showHints ? "Hide hints" : "Need a hint?"}
            </button>
          )}
        </div>

        {showHints && exercise.hints.length > 0 && (
          <div className="mt-4 space-y-2 pl-4 border-l-2 border-amber-300 dark:border-amber-500/40">
            {exercise.hints.map((h, i) => (
              <p key={i} className="text-[15px] text-muted-foreground leading-relaxed flex items-start gap-2">
                <span className="text-amber-500 dark:text-amber-400 font-semibold flex-shrink-0">{i + 1}.</span>
                {h}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PromptTemplateSection                                              */
/* ------------------------------------------------------------------ */

function PromptTemplateSection({ templates }: { templates: NonNullable<Lesson["promptTemplates"]> }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyPrompt = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="mt-10 bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 bg-muted border-b border-border flex items-center gap-2.5">
        <span className="text-violet-500 dark:text-violet-400"><IconClipboard /></span>
        <span className="font-semibold text-foreground">Prompt Template Library</span>
        <Badge variant="outline" className="ml-auto text-xs border-violet-300 dark:border-violet-500/30 text-violet-600 dark:text-violet-400">
          {templates.length} templates
        </Badge>
      </div>
      <div className="p-4">
        <Accordion type="single" collapsible className="space-y-2">
          {templates.map((t, i) => (
            <AccordionItem key={i} value={`tpl-${i}`} className="border border-border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 text-sm text-foreground hover:text-primary hover:no-underline [&[data-state=open]]:bg-muted/50">
                {t.label}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <p className="text-sm text-muted-foreground mb-3 italic">{t.context}</p>
                <div className="relative bg-muted rounded-md border border-border">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Copilot Chat Prompt</span>
                    <button
                      onClick={() => copyPrompt(t.prompt, i)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-0.5"
                    >
                      <IconCopy size={13} />
                      {copiedIdx === i ? "Copied!" : "Copy Prompt"}
                    </button>
                  </div>
                  <pre className="p-4 text-sm font-mono leading-relaxed text-foreground/80 whitespace-pre-wrap overflow-x-auto">{t.prompt}</pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TableBlock                                                         */
/* ------------------------------------------------------------------ */

function TableBlock({ table }: { table: { headers: string[]; rows: string[][] } }) {
  return (
    <div className="my-4 overflow-x-auto bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted">
            {table.headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left text-muted-foreground font-medium border-b border-border whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-b border-border last:border-0 even:bg-muted/50 transition-colors">
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

/* ------------------------------------------------------------------ */
/*  LessonView (main export)                                           */
/* ------------------------------------------------------------------ */

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
  theme,
}: LessonViewProps) {
  const [quizAttempted, setQuizAttempted] = useState(false);

  useEffect(() => {
    setQuizAttempted(false);
  }, [lesson.id]);

  const canComplete = !lesson.quiz || quizAttempted;
  const resolvedCategory = category || lesson.category || "foundations";
  const showBlueprint = blueprintCategories.includes(resolvedCategory);

  return (
    <div className={`cat-${resolvedCategory} ${theme === "dark" ? "dark" : ""}`}>
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* ---- Page header zone ---- */}
        <div className={`relative mb-10 ${showBlueprint ? "-mx-6 px-6 pt-10 pb-8 blueprint-grid rounded-lg" : ""}`}>

          {/* Top meta row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={onToggleSidebar}
                  className="text-muted-foreground hover:text-foreground transition-colors mr-1"
                >
                  <IconMenu />
                </button>
              )}
              <span className="text-sm text-muted-foreground font-mono">
                {String(lessonIndex + 1).padStart(2, "0")} / {String(totalLessons).padStart(2, "0")}
              </span>
              <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${categoryBadgeColors[resolvedCategory]}`}>
                {categoryLabels[resolvedCategory]}
              </span>
              {lesson.audience && (
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                  {lesson.audience}
                </Badge>
              )}
            </div>
            {isCompleted && (
              <Badge className="bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 text-xs flex items-center gap-1">
                <IconCheck size={12} />
                Completed
              </Badge>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-muted rounded-full mb-6">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((lessonIndex + 1) / totalLessons) * 100}%` }}
            />
          </div>

          {/* Icon + Title */}
          <span className="text-3xl mb-3 block" role="img" aria-label={lesson.title}>{lesson.icon}</span>
          <h2 className="text-3xl font-display font-bold text-foreground tracking-tight">
            {lesson.title}
          </h2>
          <p className="text-lg text-muted-foreground mt-2">{lesson.subtitle}</p>
        </div>

        {/* ---- Sections ---- */}
        <div className="space-y-10">
          {lesson.sections.map((section, i) => (
            <section key={i}>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2.5">
                <span
                  className="w-1.5 h-5 rounded-full inline-block flex-shrink-0"
                  style={{ background: "hsl(var(--cat-accent))" }}
                />
                {section.heading}
              </h3>
              <p className="text-[15px] text-foreground/80 leading-relaxed">{section.content}</p>

              {section.callout && (
                <div className="mt-4 bg-primary/5 border-l-4 border-primary rounded-r-lg px-5 py-4">
                  <p className="text-[15px] text-foreground/80 leading-relaxed">{section.callout}</p>
                </div>
              )}

              {section.tip && (
                <div className="mt-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg px-5 py-4 flex items-start gap-3">
                  <span className="text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5"><IconInfo /></span>
                  <p className="text-[15px] text-foreground/80 leading-relaxed">
                    <span className="font-semibold text-blue-700 dark:text-blue-400">Tip: </span>{section.tip}
                  </p>
                </div>
              )}

              {section.warning && (
                <div className="mt-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg px-5 py-4 flex items-start gap-3">
                  <span className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5"><IconWarning /></span>
                  <p className="text-[15px] text-foreground/80 leading-relaxed whitespace-pre-line">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">Warning: </span>{section.warning}
                  </p>
                </div>
              )}

              {section.table && <TableBlock table={section.table} />}
              {section.code && <CodeBlock code={section.code} language={section.codeLanguage} />}
            </section>
          ))}
        </div>

        {/* ---- Prompt Templates ---- */}
        {lesson.promptTemplates && lesson.promptTemplates.length > 0 && (
          <PromptTemplateSection templates={lesson.promptTemplates} />
        )}

        {/* ---- Quiz ---- */}
        {lesson.quiz && <QuizSection quiz={lesson.quiz} onAttempt={() => setQuizAttempted(true)} />}

        {/* ---- Exercise ---- */}
        {lesson.exercise && <ExerciseSection exercise={lesson.exercise} />}

        {/* ---- Practice Link ---- */}
        {lesson.practiceLink && (
          <a
            href={lesson.practiceLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-10 p-5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors group"
          >
            <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-1.5">
              <span className="group-hover:translate-x-0.5 transition-transform"><IconExternalLink /></span>
              Try It Now
            </div>
            <div className="text-sm text-foreground">{lesson.practiceLink.label}</div>
            {lesson.practiceLink.description && (
              <div className="text-sm text-muted-foreground mt-1">{lesson.practiceLink.description}</div>
            )}
          </a>
        )}

        {/* ---- Navigation footer ---- */}
        <div className="border-t border-border mt-16 pt-8 flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={lessonIndex === 0}
            className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <IconChevronLeft />
            Previous
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
              className="px-5 py-2.5 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg disabled:opacity-20 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
              Next Lesson
              <IconChevronRight />
            </button>
          </div>
        </div>

        <div className="h-12" />
      </div>
    </div>
  );
}
