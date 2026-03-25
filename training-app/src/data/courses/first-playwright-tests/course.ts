import { buildStandaloneCourse } from "./shared";
import { seeATestDoRealWorkModule } from "./modules/01-see-a-test-do-real-work";
import { justEnoughTypescriptAndToolingModule } from "./modules/02-just-enough-typescript-and-tooling";
import { setUpTheWorkbenchModule } from "./modules/03-set-up-the-workbench";
import { runTestsFromVsCodeAndTerminalModule } from "./modules/04-run-tests-from-vs-code-and-terminal";
import { readATestLikeEvidenceModule } from "./modules/05-read-a-test-like-evidence";
import { findTheRightElementModule } from "./modules/06-find-the-right-element";
import { askCopilotForAUsefulDraftModule } from "./modules/07-ask-copilot-for-a-useful-draft";
import { recordALoginFlowInVsCodeModule } from "./modules/08-record-a-login-flow-in-vs-code";
import { tightenAndRerunTheRecordingModule } from "./modules/09-tighten-and-rerun-the-recording";
import { buildYourFirstTestPackModule } from "./modules/10-build-your-first-test-pack";

export const firstPlaywrightTestsCourse = buildStandaloneCourse([
  seeATestDoRealWorkModule,
  justEnoughTypescriptAndToolingModule,
  setUpTheWorkbenchModule,
  runTestsFromVsCodeAndTerminalModule,
  readATestLikeEvidenceModule,
  findTheRightElementModule,
  askCopilotForAUsefulDraftModule,
  recordALoginFlowInVsCodeModule,
  tightenAndRerunTheRecordingModule,
  buildYourFirstTestPackModule,
]);
