import { buildCopilotFirstCourse } from "./shared";
import { theCopilotFirstMindsetModule } from "./modules/01-the-copilot-first-mindset";
import { configureYourAiTestingToolkitModule } from "./modules/02-configure-your-ai-testing-toolkit";
import { chatDrivenTestGenerationModule } from "./modules/03-chat-driven-test-generation";
import { pagePromptsUpgradedModule } from "./modules/04-page-prompts-upgraded";
import { theReviewRunFixLoopModule } from "./modules/05-the-review-run-fix-loop";
import { copilotAgentModeModule } from "./modules/06-copilot-agent-mode";
import { playwrightMcpModule } from "./modules/07-playwright-mcp";
import { pageObjectsAndMultiFileGenerationModule } from "./modules/08-page-objects-and-multi-file-generation";
import { spottingAiAntiPatternsModule } from "./modules/09-spotting-ai-anti-patterns";
import { yourTeamsPromptPlaybookModule } from "./modules/10-your-teams-prompt-playbook";

export const copilotFirstTestingCourse = buildCopilotFirstCourse([
  theCopilotFirstMindsetModule,
  configureYourAiTestingToolkitModule,
  chatDrivenTestGenerationModule,
  pagePromptsUpgradedModule,
  theReviewRunFixLoopModule,
  copilotAgentModeModule,
  playwrightMcpModule,
  pageObjectsAndMultiFileGenerationModule,
  spottingAiAntiPatternsModule,
  yourTeamsPromptPlaybookModule,
]);
