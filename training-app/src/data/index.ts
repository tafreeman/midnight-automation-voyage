/**
 * Lesson Registry
 *
 * Each module lives in its own file under ./modules/.
 * To add a new lesson: create a file, export `lesson`, and add it to the array below.
 * The array order here IS the sidebar/navigation order.
 */

export type { Lesson, Quiz, CodeExercise, PromptTemplate, ModuleCategory } from "./types";

import { lesson as orientation } from "./modules/01-orientation";
import { lesson as mindsetShifts } from "./modules/02-mindset-shifts";
import { lesson as whatToAutomate } from "./modules/03-what-to-automate";
import { lesson as whyPlaywrightCopilot } from "./modules/04-why-playwright-copilot";
import { lesson as environmentSetup } from "./modules/05-environment-setup";
import { lesson as copilotPromptEng } from "./modules/06-copilot-prompt-engineering";
import { lesson as recordRefine } from "./modules/07-record-refine-workflow";
import { lesson as writingTests } from "./modules/08-writing-tests";
import { lesson as pageObjectModel } from "./modules/09-page-object-model";
import { lesson as apiTesting } from "./modules/10-api-testing";
import { lesson as promptTemplates } from "./modules/11-prompt-templates";
import { lesson as readingResults } from "./modules/12-reading-results";
import { lesson as hitlChecklist } from "./modules/13-hitl-checklist";
import { lesson as nonCoderGuide } from "./modules/14-non-coder-guide";
import { lesson as cicdReference } from "./modules/15-cicd-reference";
import { lesson as authFixtures } from "./modules/16-auth-fixtures";
import { lesson as visualRegression } from "./modules/17-visual-regression";
import { lesson as accessibilityTesting } from "./modules/18-accessibility-testing";
import { lesson as flakyTestDiagnosis } from "./modules/19-flaky-test-diagnosis";
import { lesson as testDataStrategies } from "./modules/20-test-data-strategies";
import { lesson as assessmentCertification } from "./modules/21-assessment-certification";
import { lesson as traceViewer } from "./modules/22-trace-viewer";
import { lesson as mobileResponsive } from "./modules/23-mobile-responsive";
import { lesson as parallelSharding } from "./modules/24-parallel-sharding";
import { lesson as multiBrowserProjects } from "./modules/25-multi-browser-projects";
import { lesson as testTagging } from "./modules/26-test-tagging";
import { lesson as githubActions } from "./modules/27-github-actions";

import type { Lesson, ModuleCategory } from "./types";

/** Module group metadata for sidebar section headers */
export interface ModuleGroup {
  label: string;
  category: ModuleCategory;
  range: [number, number]; // inclusive start/end indices into lessons[]
}

export const moduleGroups: ModuleGroup[] = [
  { label: "Foundations",   category: "foundations", range: [0, 4] },
  { label: "Core Skills",  category: "core",        range: [5, 9] },
  { label: "Workflows",    category: "workflows",   range: [10, 14] },
  { label: "Advanced",     category: "advanced",    range: [15, 21] },
  { label: "DevOps & CI",  category: "devops",      range: [22, 26] },
];

/** Assign categories to lessons based on their position */
function withCategory(lesson: Lesson, category: ModuleCategory): Lesson {
  return { ...lesson, category };
}

export const lessons: Lesson[] = [
  // Foundations (01-05)
  withCategory(orientation, "foundations"),
  withCategory(mindsetShifts, "foundations"),
  withCategory(whatToAutomate, "foundations"),
  withCategory(whyPlaywrightCopilot, "foundations"),
  withCategory(environmentSetup, "foundations"),
  // Core Skills (06-10)
  withCategory(copilotPromptEng, "core"),
  withCategory(recordRefine, "core"),
  withCategory(writingTests, "core"),
  withCategory(pageObjectModel, "core"),
  withCategory(apiTesting, "core"),
  // Workflows (11-15)
  withCategory(promptTemplates, "workflows"),
  withCategory(readingResults, "workflows"),
  withCategory(hitlChecklist, "workflows"),
  withCategory(nonCoderGuide, "workflows"),
  withCategory(cicdReference, "workflows"),
  // Advanced (16-22)
  withCategory(authFixtures, "advanced"),
  withCategory(visualRegression, "advanced"),
  withCategory(accessibilityTesting, "advanced"),
  withCategory(flakyTestDiagnosis, "advanced"),
  withCategory(testDataStrategies, "advanced"),
  withCategory(assessmentCertification, "advanced"),
  withCategory(traceViewer, "advanced"),
  // DevOps & CI (23-27)
  withCategory(mobileResponsive, "devops"),
  withCategory(parallelSharding, "devops"),
  withCategory(multiBrowserProjects, "devops"),
  withCategory(testTagging, "devops"),
  withCategory(githubActions, "devops"),
];
