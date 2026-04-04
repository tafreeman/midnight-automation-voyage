#!/usr/bin/env node
/**
 * P0: .env File Protection Hook (Pre-Tool Use)
 *
 * Blocks Claude Code from reading .env files via read or grep tools.
 * Per Anthropic guidance: pre-tool hook with exit code 2 to block, stderr for feedback.
 *
 * Installation:
 *   1. Copy this file to your project's hooks/ directory (e.g., .claude/hooks/env-protection-hook.js)
 *   2. Add hook config to .claude/settings.local.json (see settings patches)
 *   3. Restart Claude Code
 *
 * Works with: read, grep tools
 * Exit codes: 0 = allow, 2 = block
 */

const BLOCKED_PATTERNS = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
  '.env.staging',
  '.env.test',
];

// Additional patterns you may want to protect
const BLOCKED_EXTENSIONS = [
  '.pem',
  '.key',
  '.pfx',
  '.p12',
];

function isSensitiveFile(filePath) {
  if (!filePath) return false;

  const normalized = filePath.replace(/\\/g, '/').toLowerCase();
  const filename = normalized.split('/').pop();

  // Check .env patterns (exact match on filename, not .env.example)
  for (const pattern of BLOCKED_PATTERNS) {
    if (filename === pattern.toLowerCase()) {
      return { blocked: true, reason: `Blocked: "${filename}" contains sensitive environment variables` };
    }
  }

  // Check sensitive file extensions
  for (const ext of BLOCKED_EXTENSIONS) {
    if (filename.endsWith(ext.toLowerCase())) {
      return { blocked: true, reason: `Blocked: "${filename}" is a sensitive credential file (${ext})` };
    }
  }

  return { blocked: false };
}

async function main() {
  let input = '';

  // Read JSON from stdin
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  try {
    const toolCall = JSON.parse(input);
    const toolName = toolCall.tool_name;
    const toolInput = toolCall.tool_input || toolCall.input || {};

    // Extract file path based on tool type
    let filePath = null;

    if (toolName === 'read') {
      filePath = toolInput.file_path || toolInput.path;
    } else if (toolName === 'grep') {
      filePath = toolInput.path || toolInput.file_path;

      // Also check the glob pattern for .env targeting
      const glob = toolInput.glob || '';
      if (glob.toLowerCase().includes('.env')) {
        console.error(`Hook blocked: grep glob pattern "${glob}" targets .env files. These contain sensitive credentials and should not be read.`);
        process.exit(2);
      }
    }

    if (filePath) {
      const result = isSensitiveFile(filePath);
      if (result.blocked) {
        console.error(`Hook blocked: ${result.reason}. Use .env.example for reference instead.`);
        process.exit(2);
      }
    }

    // Allow the operation
    process.exit(0);

  } catch (err) {
    // On parse error, allow the operation (fail open)
    console.error(`env-protection-hook: parse error: ${err.message}`);
    process.exit(0);
  }
}

main();
