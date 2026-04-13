import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const trainingAppSrc = path.join(repoRoot, "training-app", "src");
const dataRoot = path.join(trainingAppSrc, "data");
const tempRoot = path.join(repoRoot, ".generated", "class-material-export");
const outputPath = path.join(repoRoot, "docs", "all-class-material.md");

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function relativeToRepo(filePath) {
  return toPosix(path.relative(repoRoot, filePath));
}

async function ensureCleanDirectory(directoryPath) {
  await fs.rm(directoryPath, { recursive: true, force: true });
  await fs.mkdir(directoryPath, { recursive: true });
}

async function collectTypeScriptFiles(directoryPath) {
  const directoryEntries = await fs.readdir(directoryPath, { withFileTypes: true });
  const nestedPaths = await Promise.all(
    directoryEntries.map(async (entry) => {
      const fullPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        return collectTypeScriptFiles(fullPath);
      }
      if (
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        !entry.name.endsWith(".d.ts") &&
        !fullPath.includes(`${path.sep}__tests__${path.sep}`)
      ) {
        return [fullPath];
      }
      return [];
    }),
  );

  return nestedPaths.flat();
}

async function loadTypeScript() {
  const typeScriptPath = path.join(
    repoRoot,
    "training-app",
    "node_modules",
    "typescript",
    "lib",
    "typescript.js",
  );

  const typeScriptModule = await import(pathToFileURL(typeScriptPath).href);
  return typeScriptModule.default ?? typeScriptModule;
}

async function compileCurriculumSources() {
  const ts = await loadTypeScript();
  const rootNames = [
    ...(await collectTypeScriptFiles(dataRoot)),
    path.join(trainingAppSrc, "types", "curriculum.ts"),
  ];

  const compilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    rootDir: trainingAppSrc,
    outDir: tempRoot,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    skipLibCheck: true,
    strict: false,
    noEmitOnError: false,
    sourceMap: false,
    declaration: false,
    resolveJsonModule: true,
  };

  const program = ts.createProgram({ rootNames, options: compilerOptions });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  const emitResult = program.emit();
  const allDiagnostics = [...diagnostics, ...emitResult.diagnostics];

  const errorDiagnostics = allDiagnostics.filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );

  if (errorDiagnostics.length > 0) {
    const message = errorDiagnostics
      .slice(0, 20)
      .map((diagnostic) => {
        const text = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        if (!diagnostic.file || diagnostic.start == null) {
          return text;
        }
        const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        return `${relativeToRepo(diagnostic.file.fileName)}:${position.line + 1}:${position.character + 1} ${text}`;
      })
      .join("\n");

    throw new Error(`TypeScript compilation failed while exporting class material.\n${message}`);
  }
}

function escapeTableCell(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

function codeFence(code, language = "text") {
  const longestBacktickRun = Math.max(
    3,
    ...Array.from(code.matchAll(/`+/g), (match) => match[0].length + 1),
  );
  const fence = "`".repeat(longestBacktickRun);
  return `${fence}${language}\n${code}\n${fence}`;
}

function renderSection(section) {
  const headingLine = section.heading ? `#### ${section.heading}` : "#### Section";

  if (section.type === "text") {
    return [headingLine, "", section.content.trim()].join("\n");
  }

  if (section.type === "callout") {
    const label = section.variant.toUpperCase();
    return [headingLine, "", `> **${label}:** ${section.content.trim()}`].join("\n");
  }

  if (section.type === "code") {
    return [headingLine, "", codeFence(section.code, section.language)].join("\n");
  }

  const headerRow = `| ${section.headers.map(escapeTableCell).join(" | ")} |`;
  const separatorRow = `| ${section.headers.map(() => "---").join(" | ")} |`;
  const rows = section.rows.map(
    (row) => `| ${row.map(escapeTableCell).join(" | ")} |`,
  );

  return [headingLine, "", headerRow, separatorRow, ...rows].join("\n");
}

function renderQuiz(quiz) {
  if (!quiz?.questions?.length) {
    return "### Quiz\n\n_None provided._";
  }

  const content = quiz.questions.flatMap((question, questionIndex) => {
    const optionLines = question.options.map(
      (option, optionIndex) => `${optionIndex + 1}. ${option}`,
    );

    return [
      `#### Question ${questionIndex + 1}`,
      "",
      question.question,
      "",
      ...optionLines,
      "",
      `**Correct answer:** ${question.options[question.correctIndex] ?? "Unknown"}`,
      "",
      `**Explanation:** ${question.explanation}`,
      "",
    ];
  });

  return ["### Quiz", "", ...content].join("\n").trimEnd();
}

function renderPromptTemplates(promptTemplates) {
  if (!promptTemplates?.length) {
    return "### Prompt Templates\n\n_None provided._";
  }

  const content = promptTemplates.flatMap((template, templateIndex) => [
    `#### Template ${templateIndex + 1}: ${template.label}`,
    "",
    `**Context:** ${template.context}`,
    "",
    codeFence(template.prompt, "text"),
    "",
  ]);

  return ["### Prompt Templates", "", ...content].join("\n").trimEnd();
}

function renderNarrationScript(narrationScript) {
  if (!narrationScript) {
    return "### Narration\n\n_None provided._";
  }

  const steps = narrationScript.steps.flatMap((step, stepIndex) => {
    const metadata = [
      step.highlight ? `highlight: ${step.highlight}` : null,
      step.navigateTo ? `navigateTo: ${step.navigateTo}` : null,
      step.duration ? `duration: ${step.duration}` : null,
    ].filter(Boolean);

    const metadataLine = metadata.length > 0 ? ` (${metadata.join(", ")})` : "";
    return [`${stepIndex + 1}. ${step.text}${metadataLine}`];
  });

  return [
    "### Narration",
    "",
    `**Intro:** ${narrationScript.intro}`,
    "",
    "**Steps:**",
    ...steps,
    "",
    `**Outro:** ${narrationScript.outro}`,
  ].join("\n");
}

function renderPracticeLink(practiceLink) {
  if (!practiceLink) {
    return "### Practice Link\n\n_None provided._";
  }

  return [
    "### Practice Link",
    "",
    `- **Label:** ${practiceLink.label}`,
    `- **URL:** ${practiceLink.url}`,
    `- **Description:** ${practiceLink.description}`,
  ].join("\n");
}

function renderExercise(exercise, index) {
  const lines = [
    `#### Exercise ${index + 1}: ${exercise.title}`,
    "",
    `- **Difficulty:** ${exercise.difficulty ?? "not specified"}`,
    `- **Description:** ${exercise.description}`,
  ];

  if (exercise.narration) {
    lines.push(`- **Narration:** ${exercise.narration}`);
  }

  if (exercise.lab) {
    lines.push(
      "- **Lab:**",
      `  - Workspace root: ${exercise.lab.workspaceRoot}`,
      `  - Target file: ${exercise.lab.targetFile}`,
      `  - Run command: ${exercise.lab.runCommand}`,
      "  - Success criteria:",
      ...exercise.lab.successCriteria.map((criterion) => `    - ${criterion}`),
    );
  }

  if (exercise.hints?.length) {
    lines.push("- **Hints:**", ...exercise.hints.map((hint) => `  - ${hint}`));
  }

  lines.push("", "**Starter code**", "", codeFence(exercise.starterCode, "ts"));

  if (exercise.solutionCode) {
    lines.push("", "**Solution code**", "", codeFence(exercise.solutionCode, "ts"));
  }

  if (exercise.narrationSteps?.length) {
    lines.push(
      "",
      "**Narration steps**",
      ...exercise.narrationSteps.map((step, stepIndex) => {
        const metadata = [
          step.highlight ? `highlight: ${step.highlight}` : null,
          step.navigateTo ? `navigateTo: ${step.navigateTo}` : null,
          step.duration ? `duration: ${step.duration}` : null,
        ].filter(Boolean);
        const suffix = metadata.length ? ` (${metadata.join(", ")})` : "";
        return `${stepIndex + 1}. ${step.text}${suffix}`;
      }),
    );
  }

  return lines.join("\n");
}

function renderExercises(lesson) {
  const exercises = lesson.exercises?.length
    ? lesson.exercises
    : lesson.exercise
      ? [lesson.exercise]
      : [];

  if (exercises.length === 0) {
    return "### Problems / Exercises\n\n_None provided._";
  }

  return [
    "### Problems / Exercises",
    "",
    ...exercises.flatMap((exercise, index) => [renderExercise(exercise, index), ""]),
  ]
    .join("\n")
    .trimEnd();
}

function renderLesson(lesson, metadata = {}) {
  const sectionCount = lesson.sections?.length ?? 0;
  const quizCount = lesson.quiz?.questions?.length ?? 0;
  const exerciseCount = lesson.exercises?.length ?? (lesson.exercise ? 1 : 0);
  const promptTemplateCount = lesson.promptTemplates?.length ?? 0;

  const headerLines = [
    `### ${lesson.title}`,
    "",
    `- **Lesson ID:** ${lesson.id}`,
    `- **Subtitle:** ${lesson.subtitle}`,
    `- **Estimated minutes:** ${lesson.estimatedMinutes}`,
    `- **Sections:** ${sectionCount}`,
    `- **Quiz questions:** ${quizCount}`,
    `- **Problems / exercises:** ${exerciseCount}`,
    `- **Prompt templates:** ${promptTemplateCount}`,
  ];

  if (metadata.sourcePath) {
    headerLines.push(`- **Source file:** ${metadata.sourcePath}`);
  }

  if (metadata.audience) {
    headerLines.push(`- **Audience:** ${metadata.audience}`);
  }

  if (metadata.icon) {
    headerLines.push(`- **Icon:** ${metadata.icon}`);
  }

  if (metadata.learningObjectives?.length) {
    headerLines.push(
      "- **Learning objectives:**",
      ...metadata.learningObjectives.map((objective) => `  - ${objective}`),
    );
  }

  const sectionContent = lesson.sections?.length
    ? ["### Lesson Text", "", ...lesson.sections.flatMap((section) => [renderSection(section), ""])]
        .join("\n")
        .trimEnd()
    : "### Lesson Text\n\n_None provided._";

  return [
    ...headerLines,
    "",
    sectionContent,
    "",
    renderNarrationScript(lesson.narrationScript),
    "",
    renderQuiz(lesson.quiz),
    "",
    renderExercises(lesson),
    "",
    renderPromptTemplates(lesson.promptTemplates),
    "",
    renderPracticeLink(lesson.practiceLink),
  ].join("\n");
}

function renderModule(module, options = {}) {
  const moduleHeader = [
    `## Module ${module.number}: ${module.title}`,
    "",
    `- **Module ID:** ${module.id}`,
    `- **Subtitle:** ${module.subtitle}`,
    `- **Difficulty:** ${module.difficulty}`,
    `- **Theme:** ${module.theme}`,
    `- **Estimated minutes:** ${module.estimatedMinutes}`,
    `- **Icon:** ${module.icon}`,
  ];

  if (options.sourcePath) {
    moduleHeader.push(`- **Source file:** ${options.sourcePath}`);
  }

  if (module.learningObjectives?.length) {
    moduleHeader.push(
      "- **Learning objectives:**",
      ...module.learningObjectives.map((objective) => `  - ${objective}`),
    );
  }

  const lessonBlocks = module.lessons.flatMap((lesson) => [
    "",
    renderLesson(lesson, {
      learningObjectives: module.learningObjectives,
      sourcePath: options.sourcePath,
      icon: module.icon,
    }),
  ]);

  return [...moduleHeader, ...lessonBlocks].join("\n");
}

async function importCompiledModule(filePath) {
  return import(pathToFileURL(filePath).href);
}

async function buildLegacyModuleEntries() {
  const sourceDirectory = path.join(dataRoot, "modules");
  const sourceFiles = await fs.readdir(sourceDirectory);
  const entries = [];

  for (const fileName of sourceFiles.filter((name) => name.endsWith(".ts")).sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))) {
    const sourcePath = path.join(sourceDirectory, fileName);
    const compiledPath = path.join(tempRoot, "data", "modules", fileName.replace(/\.ts$/, ".js"));
    const imported = await importCompiledModule(compiledPath);
    if (!imported.lesson) {
      continue;
    }

    entries.push({
      fileName,
      sourcePath: relativeToRepo(sourcePath),
      lesson: imported.lesson,
    });
  }

  return entries;
}

function buildCourseOverviewTable(courses) {
  const lines = [
    "| Course | Difficulty | Est. Hours | Modules |",
    "| --- | --- | ---: | ---: |",
    ...courses.map(
      (course) => `| ${escapeTableCell(course.title)} | ${course.difficulty} | ${course.estimatedHours} | ${course.modules.length} |`,
    ),
  ];

  return lines.join("\n");
}

function renderCourseSummaries(courses) {
  const summaryBlocks = courses.map((course) => {
    const tableLines = [
      `### ${course.title}`,
      "",
      `- **Course ID:** ${course.id}`,
      `- **Subtitle:** ${course.subtitle}`,
      `- **Difficulty:** ${course.difficulty}`,
      `- **Icon:** ${course.icon}`,
      `- **Estimated hours:** ${course.estimatedHours}`,
      `- **Module count:** ${course.modules.length}`,
      "",
      "| # | Module | Lesson Count |",
      "| ---: | --- | ---: |",
      ...course.modules.map(
        (module) => `| ${module.number} | ${escapeTableCell(module.title)} | ${module.lessons.length} |`,
      ),
    ];

    return tableLines.join("\n");
  });

  return ["## Course Overview", "", buildCourseOverviewTable(courses), "", ...summaryBlocks].join("\n\n");
}

async function main() {
  await ensureCleanDirectory(tempRoot);
  await compileCurriculumSources();

  const [{ courses }, { firstPlaywrightTestsCourse }, { copilotFirstTestingCourse }] = await Promise.all([
    importCompiledModule(path.join(tempRoot, "data", "curriculum.js")),
    importCompiledModule(path.join(tempRoot, "data", "courses", "first-playwright-tests", "course.js")),
    importCompiledModule(path.join(tempRoot, "data", "courses", "copilot-first-testing", "course.js")),
  ]);

  const legacyEntries = await buildLegacyModuleEntries();

  const standaloneCourseBlocks = [firstPlaywrightTestsCourse, copilotFirstTestingCourse].map(
    (course) => [
      `# ${course.title}`,
      "",
      `- **Course ID:** ${course.id}`,
      `- **Subtitle:** ${course.subtitle}`,
      `- **Difficulty:** ${course.difficulty}`,
      `- **Estimated hours:** ${course.estimatedHours}`,
      `- **Modules:** ${course.modules.length}`,
      "",
      ...course.modules.flatMap((module) => [renderModule(module), ""]),
    ].join("\n").trimEnd(),
  );

  const legacyBlocks = legacyEntries.map((entry, index) => {
    const lesson = entry.lesson;
    const syntheticModule = {
      id: `legacy-source-${String(index + 1).padStart(2, "0")}`,
      number: index + 1,
      title: lesson.title,
      subtitle: lesson.subtitle,
      icon: lesson.icon,
      theme: "handbook-notes",
      difficulty: lesson.exercise || lesson.exercises?.length ? "intermediate" : "beginner",
      estimatedMinutes:
        Math.max(
          12,
          Math.min(
            36,
            lesson.sections.length * 3 + (lesson.quiz ? 3 : 0) + (lesson.exercise || lesson.exercises?.length ? 6 : 0),
          ),
        ),
      learningObjectives: lesson.sections.slice(0, 4).map((section) => `Explain ${section.heading.toLowerCase()}`),
      lessons: [
        {
          id: `legacy-${entry.fileName.replace(/\.ts$/, "")}`,
          title: lesson.title,
          subtitle: lesson.subtitle,
          estimatedMinutes: Math.max(
            12,
            Math.min(
              36,
              lesson.sections.length * 3 + (lesson.quiz ? 3 : 0) + (lesson.exercise || lesson.exercises?.length ? 6 : 0),
            ),
          ),
          sections: lesson.sections.flatMap((section) => {
            const normalizedSections = [
              {
                type: "text",
                heading: section.heading,
                content: section.content,
              },
            ];

            if (section.callout) {
              normalizedSections.push({
                type: "callout",
                heading: section.heading,
                variant: "info",
                content: section.callout,
              });
            }

            if (section.tip) {
              normalizedSections.push({
                type: "callout",
                heading: section.heading,
                variant: "tip",
                content: section.tip,
              });
            }

            if (section.warning) {
              normalizedSections.push({
                type: "callout",
                heading: section.heading,
                variant: "warning",
                content: section.warning,
              });
            }

            if (section.table) {
              normalizedSections.push({
                type: "table",
                heading: section.heading,
                headers: section.table.headers,
                rows: section.table.rows,
              });
            }

            if (section.code) {
              normalizedSections.push({
                type: "code",
                heading: section.heading,
                language: section.codeLanguage ?? "text",
                code: section.code,
              });
            }

            return normalizedSections;
          }),
          quiz: lesson.quiz
            ? {
                questions: [
                  {
                    question: lesson.quiz.question,
                    options: lesson.quiz.options,
                    correctIndex: lesson.quiz.correctIndex,
                    explanation: lesson.quiz.explanation,
                  },
                  ...(lesson.quiz.additionalQuestions ?? []),
                ],
              }
            : undefined,
          exercise: lesson.exercise,
          exercises: lesson.exercises ?? (lesson.exercise ? [lesson.exercise] : undefined),
          promptTemplates: lesson.promptTemplates,
          practiceLink: lesson.practiceLink,
          narrationScript: lesson.narrationScript,
        },
      ],
    };

    return renderModule(syntheticModule, { sourcePath: entry.sourcePath });
  });

  const markdown = [
    "# Midnight Automation Voyage — Consolidated Class Material",
    "",
    `Generated on ${new Date().toISOString()} from the canonical lesson sources in \`training-app/src/data\`.`,
    "",
    "This export includes the runtime class material payloads used by the training application: lesson text, narration, quizzes, problems/exercises, prompt templates, and practice links.",
    "",
    "It also includes a course overview for the shipped course catalog. Bundled course entries are summarized in the overview and not duplicated in full when they reuse legacy lesson content.",
    "",
    "## Coverage Notes",
    "",
    "- Legacy source modules: every `.ts` file under `training-app/src/data/modules/`, including unlisted/orphaned content such as `32-complex-dom-interactions.ts`.",
    "- Standalone courses: `first-playwright-tests` and `copilot-first-testing` from their course exports.",
    "- Excluded: build artifacts, generated HTML, app code unrelated to lesson payloads, and planning/reference docs that are not part of the runtime lesson content model.",
    "",
    renderCourseSummaries(courses),
    "",
    "# Legacy Source Module Library",
    "",
    ...legacyBlocks.flatMap((block) => [block, ""]),
    "# Standalone Courses — Full Content",
    "",
    ...standaloneCourseBlocks.flatMap((block) => [block, ""]),
  ]
    .join("\n")
    .trimEnd() + "\n";

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, markdown, "utf8");

  console.log(`Wrote ${relativeToRepo(outputPath)}`);
  console.log(`Legacy source modules exported: ${legacyEntries.length}`);
  console.log("Standalone courses exported: 2");
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
