/**
 * Lesson Registry
 *
 * Each module lives in its own file under ./modules/.
 * To add a new lesson: create a file, export `lesson`, and add it to the array below.
 * The array order here IS the sidebar/navigation order.
 */

export type { Lesson, Quiz, CodeExercise, PromptTemplate } from "./types";
export { courses } from "./curriculum";
export { firstPlaywrightTestsCourse } from "./courses/first-playwright-tests";

import { lesson as orientation } from "./modules/01-orientation";
import { lesson as mindsetShifts } from "./modules/02-mindset-shifts";
import { lesson as whatToAutomate } from "./modules/03-what-to-automate";
import { lesson as selectorsLocators } from "./modules/04-selectors-locators";
import { lesson as whyPlaywrightCopilot } from "./modules/04-why-playwright-copilot";
import { lesson as environmentSetup } from "./modules/05-environment-setup";
import { lesson as copilotPromptEng } from "./modules/06-copilot-prompt-engineering";
import { lesson as recordRefine } from "./modules/07-record-refine-workflow";
import { lesson as refineRecording } from "./modules/08-refine-recording";
import { lesson as writingTests } from "./modules/08-writing-tests";
import { lesson as pageObjectModel } from "./modules/09-page-object-model";
import { lesson as apiTesting } from "./modules/10-api-testing";
import { lesson as promptTemplates } from "./modules/11-prompt-templates";
import { lesson as readingResults } from "./modules/12-reading-results";
import { lesson as hitlChecklist } from "./modules/13-hitl-checklist";
import { lesson as collaborativeGuide } from "./modules/14-collaborative-test-authoring";
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
import { lesson as mcpAiAgents } from "./modules/28-mcp-ai-agents";
import { lesson as componentTesting } from "./modules/29-component-testing";
import { lesson as performanceTesting } from "./modules/30-performance-testing";
import { lesson as customReporters } from "./modules/31-custom-reporters";

import type { Lesson } from "./types";

export const lessons: Lesson[] = [
  orientation,
  mindsetShifts,
  whatToAutomate,
  selectorsLocators,
  whyPlaywrightCopilot,
  environmentSetup,
  copilotPromptEng,
  recordRefine,
  refineRecording,
  writingTests,
  pageObjectModel,
  apiTesting,
  promptTemplates,
  readingResults,
  hitlChecklist,
  collaborativeGuide,
  cicdReference,
  authFixtures,
  visualRegression,
  accessibilityTesting,
  flakyTestDiagnosis,
  testDataStrategies,
  assessmentCertification,
  traceViewer,
  mobileResponsive,
  parallelSharding,
  multiBrowserProjects,
  testTagging,
  githubActions,
  mcpAiAgents,
  componentTesting,
  performanceTesting,
  customReporters,
];
