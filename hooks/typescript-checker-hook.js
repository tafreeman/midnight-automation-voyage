#!/usr/bin/env node
/**
 * P1: TypeScript Type Checker Hook (Post-Tool Use)
 *
 * Runs tsc --no-emit after TypeScript file edits to catch type errors immediately.
 * Per Anthropic guidance: post-tool hook that feeds errors back to Claude for self-correction.
 *
 * Installation:
 *   1. Copy this file to your project's hooks/ directory
 *   2. Add hook config to .claude/settings.local.json (see settings patches)
 *   3. Ensure tsconfig.json exists in project root
 *   4. Restart Claude Code
 *
 * Works with: write, edit tools (file creation/modification)
 * Exit codes: 0 = success (always, post-tool hooks cannot block)
 * Stderr output: type errors fed back to Claude as feedback
 */

const { execSync } = require('child_process');
const path = require('path');

const TS_EXTENSIONS = ['.ts', '.tsx', '.mts', '.cts'];

function isTypeScriptFile(filePath) {
  if (!filePath) return false;
  const ext = path.extname(filePath).toLowerCase();
  return TS_EXTENSIONS.includes(ext);
}

function findTsConfig(startDir) {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    const tsconfig = path.join(dir, 'tsconfig.json');
    try {
      require('fs').accessSync(tsconfig);
      return dir;
    } catch {
      dir = path.dirname(dir);
    }
  }
  return null;
}

async function main() {
  let input = '';

  for await (const chunk of process.stdin) {
    input += chunk;
  }

  try {
    const toolCall = JSON.parse(input);
    const toolName = toolCall.tool_name;
    const toolInput = toolCall.tool_input || toolCall.input || {};

    // Only check after write/edit operations
    if (!['write', 'edit'].includes(toolName)) {
      process.exit(0);
    }

    const filePath = toolInput.file_path || toolInput.path;

    if (!isTypeScriptFile(filePath)) {
      process.exit(0);
    }

    // Find nearest tsconfig.json
    const projectDir = findTsConfig(path.dirname(filePath));

    if (!projectDir) {
      // No tsconfig found, skip check
      process.exit(0);
    }

    try {
      execSync('npx tsc --noEmit --pretty 2>&1', {
        cwd: projectDir,
        timeout: 30000,  // 30 second timeout
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      // No errors - clean exit
      process.exit(0);

    } catch (tscError) {
      // tsc found errors - feed them back to Claude via stderr
      const output = tscError.stdout || tscError.stderr || '';

      if (output.trim()) {
        // Limit output to first 20 errors to avoid overwhelming context
        const lines = output.split('\n');
        const errorLines = lines.filter(l => l.includes('error TS'));
        const truncated = errorLines.length > 20
          ? errorLines.slice(0, 20).join('\n') + `\n... and ${errorLines.length - 20} more errors`
          : errorLines.join('\n');

        console.error(`TypeScript type check failed after editing ${path.basename(filePath)}:\n${truncated}\n\nPlease fix these type errors before continuing.`);
      }

      // Post-tool hooks always exit 0 (cannot block)
      process.exit(0);
    }

  } catch (err) {
    // On parse error, exit cleanly
    process.exit(0);
  }
}

main();
