# AGENTS.md — AI Agent Configuration Guide

This repository is configured for AI-assisted development using [Claude Code](https://docs.anthropic.com/en/docs/claude-code). This document provides a human-readable overview of all agent configurations.

## Quick Reference

| File/Directory | Purpose |
|----------------|---------|
| `CLAUDE.md` | Auto-loaded project context (structure, commands, gotchas) |
| `.claude/agents/` | Specialised agent definitions (code review, E2E, security) |
| `.claude/commands/` | Custom slash commands (`/plan`, `/tdd`, `/build-fix`, etc.) |
| `.claude/plans/` | Long-running plan definitions |
| `.claude/settings.local.json` | Permissions and environment config |
| `.mcp.json` | MCP server config (Playwright integration) |

## Agents

### Code Reviewer (`.claude/agents/code-reviewer.md`)

Performs structured code reviews with detailed feedback on quality, patterns, and potential issues. Includes checklists for TypeScript, React, accessibility, and security concerns.

### E2E Runner (`.claude/agents/e2e-runner.md`)

Executes Playwright E2E tests against the practice app, reports results, and helps debug failures.

### Security Reviewer (`.claude/agents/security-reviewer.md`)

Analyses code changes for security vulnerabilities, focusing on XSS, injection, auth bypasses, and dependency risks.

## Commands

| Command | Description |
|---------|-------------|
| `/plan` | Restate requirements, assess risks, create step-by-step implementation plan |
| `/tdd` | Test-driven development workflow — scaffold interfaces, write tests first, then implement |
| `/build-fix` | Diagnose and fix build/TypeScript errors incrementally |
| `/checkpoint` | Save or verify workspace state |
| `/code-review` | Trigger a code review of uncommitted changes |
| `/test-coverage` | Analyse coverage gaps and generate missing tests |
| `/update-docs` | Sync documentation with codebase changes |

## How It Works

1. **On session start:** Claude Code loads `CLAUDE.md` automatically for project context.
2. **Permissions:** `.claude/settings.local.json` controls which bash commands, file patterns, and environment variables the agent can access.
3. **MCP integration:** `.mcp.json` connects a Playwright MCP server for browser automation.
4. **Agents are invoked** by referencing them during a session (e.g., asking for a code review).
5. **Commands are invoked** via `/command-name` in a Claude Code session.

## For Contributors

- To add a new agent: create a `.md` file in `.claude/agents/` with a role description, workflow steps, and quality criteria.
- To add a new command: create a `.md` file in `.claude/commands/` — the filename becomes the command name.
- See [`.claude/README.md`](.claude/README.md) for detailed layout documentation.
