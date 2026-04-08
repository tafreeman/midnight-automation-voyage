# Agent Configuration Inventory

**Generated:** 2026-04-08

---

## Agent-Config Locations Found

| Path | Type | Purpose |
|------|------|---------|
| `.claude/` | Directory | Claude Code agent configuration root |
| `.claude/settings.local.json` | Config | Permissions for bash, grep, environment access |
| `.claude/launch.json` | Config | Vite debug server for training-app (port 5174) |
| `.claude/agents/code-reviewer.md` | Agent def | Code review workflow (227 lines) |
| `.claude/agents/e2e-runner.md` | Agent def | E2E test execution agent (110 lines) |
| `.claude/agents/security-reviewer.md` | Agent def | Security review agent (111 lines) |
| `.claude/commands/build-fix.md` | Command | Build troubleshooting (66 lines) |
| `.claude/commands/checkpoint.md` | Command | Workspace state save/restore (78 lines) |
| `.claude/commands/code-review.md` | Command | Code review trigger (21 lines) |
| `.claude/commands/plan.md` | Command | Project planning (93 lines) |
| `.claude/commands/tdd.md` | Command | Test-driven development (141 lines) |
| `.claude/commands/test-coverage.md` | Command | Coverage analysis (73 lines) |
| `.claude/commands/update-docs.md` | Command | Documentation update (88 lines) |
| `.claude/plans/model-probe-runner.md` | Plan | Model evaluation/probing plan (663 lines) |
| `CLAUDE.md` | Config | Top-level Claude instructions (project context, commands, gotchas) |
| `.mcp.json` | Config | MCP server configuration (Playwright) |
| `.github/copilot-instructions.md` | Not present | No GitHub Copilot instructions file found |
| `training-app-design/.claude/` | Directory | Nested Claude config for design workspace |
| `training-app-design/.claude/launch.json` | Config | Debug config for design workspace |
| `training-app-design/.claude/settings.local.json` | Config | Settings for design workspace |
| `training-app-design/SKILL.md` | Skill def | Copilot skill definition for training-app design |
| `training-app-design.skill` | Skill ref | Skill file reference |

## Not Found

| Path | Notes |
|------|-------|
| `.cursor/` | Not used |
| `.aider/` | Not used |
| `.continue/` | Not used |
| `AGENTS.md` | Not yet created — recommended |
| `GEMINI.md` | Not used |
| `.github/copilot-instructions.md` | Not present |

---

## Overlap Analysis

### CLAUDE.md ↔ README.md

Both files describe project structure, commands, and gotchas. Key overlaps:

| Topic | CLAUDE.md | README.md |
|-------|-----------|-----------|
| Project structure | 4-line summary | Detailed tree + explanation |
| Prerequisites/install | pnpm check snippet | Quick Start section |
| Build commands | `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm lint` | Same commands listed |
| Gotchas | 4 bullet points | Windows note in Quick Start |
| Port numbers | :5173, :5174 | :5173, :5174 |
| Completed roadmap | Workstreams A-D summary | Not mentioned |

**Resolution:** CLAUDE.md should remain the machine-loaded agent context file. README.md is the canonical human-facing doc. Remove roadmap items from CLAUDE.md (they belong in ROADMAP.md). Keep CLAUDE.md focused on what agents need: structure, commands, gotchas.

### .claude/commands/update-docs.md ↔ This Documentation Update

The `update-docs.md` command defines a documentation update workflow. This audit supersedes any prior runs of that command.

---

## Recommendations

1. **Create root `AGENTS.md`** — Human-readable summary of agent configuration for contributors unfamiliar with `.claude/`.
2. **Create `.claude/README.md`** — Explain directory layout, how rules are loaded, and how to add new agents/commands.
3. **Trim `CLAUDE.md`** — Remove duplicated content (roadmap items) that belongs in ROADMAP.md.
4. **Create `.github/copilot-instructions.md`** — For GitHub Copilot users (currently only Claude is configured).
