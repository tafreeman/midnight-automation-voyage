# .claude/ — Agent Configuration

Configuration directory for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) AI assistant integration.

## Directory Layout

```
.claude/
├── agents/              # Specialised agent definitions
│   ├── code-reviewer.md    # Code review workflow
│   ├── e2e-runner.md       # E2E test execution
│   └── security-reviewer.md # Security review
├── commands/            # Custom slash commands
│   ├── build-fix.md        # /build-fix — troubleshoot build errors
│   ├── checkpoint.md       # /checkpoint — save/restore workspace state
│   ├── code-review.md      # /code-review — trigger review
│   ├── plan.md             # /plan — project planning
│   ├── tdd.md              # /tdd — test-driven development
│   ├── test-coverage.md    # /test-coverage — coverage analysis
│   └── update-docs.md      # /update-docs — documentation update
├── plans/               # Long-running plan definitions
│   └── model-probe-runner.md
├── launch.json          # Debug/launch config (Vite on port 5174)
└── settings.local.json  # Local permissions and environment
```

## How Rules Are Loaded

1. **`CLAUDE.md`** (repo root) — Loaded automatically as project context on every Claude Code session. Contains project structure, commands, and gotchas.
2. **`settings.local.json`** — Defines allowed bash commands, file access patterns, and environment variables.
3. **Agents** (`agents/*.md`) — Invoked by name when a specialised workflow is needed (e.g., `/agent code-reviewer`).
4. **Commands** (`commands/*.md`) — Available as `/command-name` in Claude Code sessions.

## Adding New Agents

Create a new `.md` file in `agents/` with:
- A clear role description at the top
- Step-by-step workflow instructions
- Constraints and quality criteria

## Adding New Commands

Create a new `.md` file in `commands/` with:
- Trigger description (the filename becomes the command name)
- Expected inputs and outputs
- Workflow steps

## Related Files

- [`CLAUDE.md`](../CLAUDE.md) — Root-level project context (auto-loaded)
- [`.mcp.json`](../.mcp.json) — MCP server configuration (Playwright)
- [`AGENTS.md`](../AGENTS.md) — Human-readable summary of all agent configurations
