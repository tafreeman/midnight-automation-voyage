# llm-maestro — Implementation Plan

## Overview

A standalone, pip-installable Python package for model discovery, probing, and unified prompt execution across 12+ LLM providers. Pluggable into any app.

**Repo:** `C:\Users\tandf\source\repos\llm-maestro`
**Package:** `pip install llm-maestro` / `import llm_maestro`
**CLI:** `llm-maestro run|probe|discover|list|rank|bakeoff|pull`

Adapted standalone from `D:\source\prompts\tools\llm\` — no cross-repo dependency.
Stdlib-only core; optional deps for cloud providers and local ONNX.

---

## Multi-Folder Model Scanning

A core feature: users store models in multiple locations (Ollama, LM Studio, Microsoft/.aitk, custom dirs). llm-maestro provides a **unified view** across all of them.

### Config file: `<config_dir>/config.yml`

(Windows: `%APPDATA%\llm-maestro\config.yml`, Linux: `~/.config/llm-maestro/config.yml`)

```yaml
# Where to scan for models (in addition to auto-detected provider defaults)
model_dirs:
  # Auto-detected defaults (always scanned):
  # - ~/.ollama/models                    (Ollama)
  # - ~/.cache/lm-studio/models           (LM Studio)
  # - ~/.aitk/models                      (AI Toolkit / Foundry)
  # - ~/.cache/aigallery                   (AI Gallery ONNX)

  # User-added custom directories:
  - path: "D:/models/llama"
    label: "Custom LLaMA models"
    provider: ollama        # treat as Ollama-format models

  - path: "E:/ai-models/gguf"
    label: "GGUF collection"
    provider: lmstudio      # treat as LM Studio-format

  - path: "C:/Users/tandf/.aitk/models/Microsoft"
    label: "Microsoft Foundry models"
    provider: aitk

# Provider-specific overrides
providers:
  ollama:
    host: "http://localhost:11434"
    extra_model_dirs: []
  lmstudio:
    host: "http://127.0.0.1:1234"
    ports_to_scan: [12340, 1234, 5000, 5001]
  foundry:
    # auto-detected via `foundry service status`
  openai:
    api_key_env: "OPENAI_API_KEY"
  github:
    token_env: "GITHUB_TOKEN"

# Model aliases (user-customizable on top of defaults)
aliases:
  my-coder: "ollama:qwen2.5-coder:14b"
  work-model: "gh:gpt-4o-mini"
```

### Unified model view

```python
from llm_maestro import discover, list_models

# Get everything across all providers and all configured dirs
inventory = discover()

# Pretty-print unified view
for model in inventory.all_models():
    print(f"{model.id:40s}  {model.provider:15s}  {model.location}")

# Example output:
# ollama:qwen3:4b                          ollama           http://localhost:11434
# ollama:deepseek-r1:8b                    ollama           http://localhost:11434
# foundry:phi-4-mini                       foundry          C:/Users/tandf/.aitk/models/Microsoft/...
# aitk:Phi-4-mini-instruct-generic-cpu     aitk             ~/.aitk/models/Microsoft/...
# local:phi4-cpu                           local_onnx       ~/.cache/aigallery/...
# gh:gpt-4o-mini                           github           api.github.com
# custom:llama-3.2-8b                      ollama           D:/models/llama/...
```

### Secrets Management

API keys need to be secure but easily discoverable. Layered approach (checked in this order):

```
Priority 1: Environment variables       (highest priority, never stored on disk by us)
Priority 2: OS credential store          (Windows Credential Manager / macOS Keychain)
Priority 3: Encrypted config file        (~/.config/llm-maestro/secrets.enc)
Priority 4: .env file                    (project-local or ~/.config/llm-maestro/.env)
```

**Config file (`config.yml`) NEVER stores raw keys.** It only stores key *references*:

```yaml
providers:
  openai:
    api_key: env:OPENAI_API_KEY           # read from env var (default)
  github:
    token: env:GITHUB_TOKEN               # read from env var
  gemini:
    api_key: keyring:llm-maestro/gemini   # read from OS credential store
  anthropic:
    api_key: env:ANTHROPIC_API_KEY
```

**Key storage options:**

1. **Environment variables** (default) — standard, works everywhere, `.env` file for convenience
2. **OS Credential Store** via `keyring` library (optional dep):
   - Windows: Credential Manager (`keyring` uses `WinVaultKeyring`)
   - macOS: Keychain
   - Linux: Secret Service (GNOME Keyring / KDE Wallet)
3. **Encrypted file** — AES-256 encrypted `secrets.enc`, unlocked by master password or OS keyring
4. **`.env` file** — `~/.config/llm-maestro/.env` auto-loaded, `.gitignore`d

**CLI for key management:**

```bash
# Store a key securely (uses OS credential store if available, else .env)
llm-maestro config set-key openai sk-abc123...
llm-maestro config set-key github ghp_xyz...

# Check which keys are configured (shows source, never prints values)
llm-maestro config keys
# Output:
# openai     ✓ env:OPENAI_API_KEY
# github     ✓ keyring:llm-maestro/github
# gemini     ✗ not configured
# anthropic  ✓ .env:ANTHROPIC_API_KEY

# Remove a stored key
llm-maestro config remove-key gemini
```

**Implementation in `user_config.py`:**

```python
def resolve_secret(ref: str) -> str | None:
    """Resolve a secret reference to its value."""
    if ref.startswith("env:"):
        return os.getenv(ref[4:])
    if ref.startswith("keyring:"):
        try:
            import keyring
            service, key = ref[8:].rsplit("/", 1)
            return keyring.get_password(service, key)
        except ImportError:
            return None
    if ref.startswith("file:"):
        return _read_encrypted_secret(ref[5:])
    # Bare value (legacy compat, warn user)
    return ref
```

### CLI

```bash
# Show unified view of all models everywhere
llm-maestro list --all

# Show models grouped by location
llm-maestro list --by-location

# Show models from specific provider
llm-maestro list --provider ollama

# Add a custom model directory
llm-maestro config add-dir "D:/models/my-gguf" --provider lmstudio --label "My GGUFs"

# Show current config
llm-maestro config show
```

---

## Project Structure

```
llm-maestro/
├── pyproject.toml           # PEP 621 metadata, entry points, optional deps
├── README.md
├── LICENSE                   # MIT
├── .gitignore
├── CLAUDE.md                 # Project instructions for Claude Code
│
├── src/llm_maestro/          # src-layout package
│   ├── __init__.py           # Public API: probe(), run(), discover()
│   ├── __main__.py           # CLI entry: python -m llm_maestro
│   ├── cli.py                # Argparse subcommands
│   │
│   ├── errors.py             # ErrorCode enum, classify_error(), retry sets
│   ├── config.py             # Constants, ProbeResult, cache I/O, .env loader
│   ├── user_config.py        # Load/save ~/.config/llm-maestro/config.yml
│   ├── model_catalog.py      # LOCAL_MODELS + MODEL_ALIASES + resolve()
│   ├── model_scanner.py      # Multi-folder scanning + unified model view
│   │
│   ├── providers/            # One module per provider (probe + chat)
│   │   ├── __init__.py       # Registry: get_provider(), probe_model(), PROVIDERS dict
│   │   ├── base.py           # Abstract BaseProvider with probe()/chat() contract
│   │   ├── ollama.py         # Ollama (localhost:11434)
│   │   ├── lmstudio.py       # LM Studio (localhost:1234, port scan)
│   │   ├── foundry.py        # Foundry Local (dynamic port + CLI fallback)
│   │   ├── local_onnx.py     # ONNX via onnxruntime-genai
│   │   ├── aitk.py           # AI Toolkit (~/.aitk/models/)
│   │   ├── windows_ai.py     # Phi Silica via C# bridge
│   │   ├── openai.py         # OpenAI API (+ Azure OpenAI, Azure Foundry)
│   │   ├── github.py         # GitHub Models (gh CLI)
│   │   ├── gemini.py         # Google Gemini
│   │   ├── anthropic.py      # Anthropic Claude
│   │   └── local_server.py   # Generic OpenAI-compatible local servers
│   │
│   ├── probe.py              # ModelProbe class — cached multi-provider probing
│   ├── discovery.py           # discover_all() — scan all providers
│   ├── runner.py              # run_prompt() — resolve → probe → dispatch → stream
│   │
│   ├── ranking.py             # Score + rank providers, recommend best models
│   ├── bakeoff.py             # Comparative capability testing
│   ├── bakeoff_tasks.py       # TaskSpec definitions
│   ├── bakeoff_reporting.py   # JSON + Markdown reports
│   │
│   ├── locks.py               # Lock file management for concurrent access
│   └── concurrency.py         # ThreadPoolExecutor parallel runner
│
└── tests/
    ├── test_errors.py
    ├── test_config.py
    ├── test_catalog.py
    ├── test_providers/
    │   ├── test_ollama.py
    │   └── ...
    ├── test_probe.py
    ├── test_discovery.py
    ├── test_runner.py
    └── test_cli.py
```

---

## Public API (what consumers import)

```python
from llm_maestro import probe, run, discover, list_models

# Quick probe — is this model available?
result = probe("ollama:qwen3:4b")
if result.usable:
    print(f"Ready in {result.duration_ms}ms")

# Run a prompt (streaming generator)
for chunk in run("qwen3:4b", "Explain quicksort"):
    print(chunk, end="")

# Run with full options
response = run(
    model="gh:gpt-4o-mini",
    prompt="Review this code",
    system="You are a code reviewer",
    temperature=0.3,
    max_tokens=2000,
    stream=False,  # returns full string instead of generator
)

# Discover all available models
inventory = discover(verbose=True)
for provider, info in inventory["providers"].items():
    if info.get("available"):
        print(f"{provider}: {len(info['available'])} models")

# List models for a specific provider
models = list_models("ollama")
```

### Integration example (any app):

```python
# In any project's script:
from llm_maestro import run

# Use as a local AI helper
summary = run("fast", "Summarize: " + document_text, stream=False)

# Use with explicit provider
review = run("gh:gpt-4o-mini", code, system="Review for bugs", stream=False)
```

---

## CLI Entry Points

```
# Via python -m
python -m llm_maestro <command> [options]

# Via installed script (registered in pyproject.toml)
llm-maestro <command> [options]

Commands:
  run        Run a prompt (default if no command)
  probe      Check if a specific model is available
  discover   Discover all available models across all providers
  list       List models for a specific backend
  rank       Score and rank all providers/models
  bakeoff    Run comparative capability test
  pull       Pull/download a model (Ollama, Foundry)
```

### Backward compat

`scripts/prompt-runner.py` in midnight-automation-voyage becomes:

```python
#!/usr/bin/env python3
"""Thin wrapper — delegates to llm-maestro."""
import sys
from llm_maestro.cli import main
sys.exit(main())
```

---

## Installation & Environment

### Install methods (documented in README)

```bash
# Recommended: pipx (isolated, globally accessible CLI)
pipx install llm-maestro
pipx install llm-maestro[full]    # with all optional deps

# Alternative: uv (faster, Rust-based)
uv tool install llm-maestro

# Fallback: pip (if pipx/uv not available)
pip install --user llm-maestro

# Dev: editable install from source
cd llm-maestro
pip install -e ".[dev]"
```

### Windows-specific notes
- **pipx PATH:** After `pip install pipx`, run `pipx ensurepath` and restart terminal
- **Avoid Microsoft Store Python** — causes pipx issues. Use python.org installer
- **Console scripts work** — pip/pipx generates `.exe` shims in `Scripts/`, no PATH issues
- **Long paths:** Keep config paths short (260-char limit unless registry enabled)

### Linux notes
- Works identically — `pipx install llm-maestro`
- Honors `XDG_CONFIG_HOME` for config directory
- All `pathlib.Path` usage, no Windows-specific code paths

### Cross-platform config directories

Use `platformdirs` (lightweight, zero deps, the standard answer):

| Purpose | Windows | Linux |
|---------|---------|-------|
| Config | `%APPDATA%\llm-maestro` | `~/.config/llm-maestro` |
| Cache | `%LOCALAPPDATA%\llm-maestro\Cache` | `~/.cache/llm-maestro` |
| Data | `%LOCALAPPDATA%\llm-maestro` | `~/.local/share/llm-maestro` |

```python
from platformdirs import user_config_dir, user_cache_dir
config_dir = Path(user_config_dir("llm-maestro", ensure_exists=True))
cache_dir = Path(user_cache_dir("llm-maestro", ensure_exists=True))
```

### First-run setup

```bash
# Interactive init — creates config.yml, sets up key storage
llm-maestro init

# Non-interactive (use defaults)
llm-maestro init --defaults
```

`llm-maestro init` handles:
- Create config dir via `platformdirs`
- Scan for existing model dirs (Ollama, LM Studio, AITK, etc.)
- Prompt user for API keys (store in OS keyring or .env)
- Write default `config.yml`
- Run quick probe to show what's available

---

## pyproject.toml

```toml
[project]
name = "llm-maestro"
version = "0.1.0"
description = "Multi-provider LLM probe, discovery, and runner"
requires-python = ">=3.11"
license = "MIT"
dependencies = ["platformdirs>=4.0"]  # only hard dep: cross-platform config dirs

[project.optional-dependencies]
openai = ["openai>=1.0"]
google = ["google-generativeai>=0.4"]
anthropic = ["anthropic>=0.20"]
onnx = ["onnxruntime-genai>=0.4"]
keyring = ["keyring>=25.0"]
yaml = ["pyyaml>=6.0"]
full = [
    "openai>=1.0",
    "google-generativeai>=0.4",
    "anthropic>=0.20",
    "keyring>=25.0",
    "pyyaml>=6.0",
]
dev = ["pytest>=8.0", "pytest-cov", "pyyaml>=6.0"]

[project.scripts]
llm-maestro = "llm_maestro.cli:main"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/llm_maestro"]
```

---

## Provider Contract (base.py)

Each provider module implements:

```python
class OllamaProvider(BaseProvider):
    """Ollama local server."""

    PREFIX = "ollama:"
    NAME = "ollama"

    def probe(self, verbose=False) -> dict:
        """Discover available models, return {configured, available, error}."""
        ...

    def chat(self, model, messages, *, temperature=0.7, max_tokens=4096,
             stream=True) -> Iterator[str] | str:
        """Send chat completion, return streaming chunks or full response."""
        ...

    def list_models(self) -> list[dict]:
        """Return [{name, size, ...}]."""
        ...

    def pull_model(self, model_name) -> None:
        """Download/pull a model (if supported)."""
        ...
```

The registry auto-discovers providers:

```python
# providers/__init__.py
PROVIDERS: dict[str, BaseProvider] = {}

def register(cls):
    PROVIDERS[cls.PREFIX] = cls()
    return cls

def get_provider(model_id: str) -> BaseProvider:
    for prefix, provider in PROVIDERS.items():
        if model_id.startswith(prefix):
            return provider
    # Fallback: auto-detect from running servers
    return _auto_detect_provider(model_id)
```

---

## Implementation Phases

### Phase 1: Repo scaffold + foundation (~350 LOC)

**Create:**
- Git repo at `C:\Users\tandf\source\repos\llm-maestro`
- `pyproject.toml` with entry points and optional deps
- `src/llm_maestro/__init__.py` — public API exports
- `src/llm_maestro/errors.py` — ErrorCode enum, classify_error() (adapt from `tools/core/errors.py`)
- `src/llm_maestro/config.py` — constants, ProbeResult, cache helpers (adapt from `probe_config.py`)
- `src/llm_maestro/model_catalog.py` — LOCAL_MODELS + MODEL_ALIASES (merge `local_models.py` + `prompt-runner.py`)
- `src/llm_maestro/providers/base.py` — abstract BaseProvider contract

5. **`src/llm_maestro/user_config.py`** — User configuration:
   - Load/save `~/.config/llm-maestro/config.yml` (YAML via stdlib or pyyaml)
   - `model_dirs` — list of custom scan directories with provider + label
   - `providers` — per-provider host/port/key overrides
   - `aliases` — user-defined model aliases (merged on top of defaults)
   - Auto-create default config on first run
   - `get_config() -> Config` singleton
   - Fallback: if no YAML parser, support `config.json` as alternative

6. **`src/llm_maestro/model_scanner.py`** — Multi-folder model scanning:
   - `scan_all_dirs(config) -> list[ModelInfo]` — scan default + custom dirs
   - Auto-detect provider defaults: `~/.ollama/models`, `~/.cache/lm-studio/models`, `~/.aitk/models`, `~/.cache/aigallery`
   - `ModelInfo` dataclass: id, name, provider, location, size_bytes, device, capabilities
   - Dedup across dirs (same model in multiple locations → keep all, flag primary)
   - `unified_view() -> list[ModelInfo]` — merge scanned + API-discovered models
   - Group by provider, location, or capability

**Adapt from:**
- `D:\source\prompts\tools\core\errors.py` → `errors.py`
- `D:\source\prompts\tools\llm\probe_config.py` → `config.py`
- `D:\source\prompts\tools\llm\local_models.py` + `scripts/prompt-runner.py` → `model_catalog.py`
- `C:\Users\tandf\.aitk\models\foundry.modelinfo.json` → scanning pattern for `model_scanner.py`

---

### Phase 2: Local providers (~400 LOC)

**Create:**
- `providers/__init__.py` — registry + dispatch
- `providers/ollama.py` — probe (HTTP /api/tags) + chat (streaming /api/chat, thinking-model support)
- `providers/lmstudio.py` — probe (port scan) + chat (OpenAI-compat /v1/chat/completions)
- `providers/foundry.py` — probe (CLI status + model list) + chat (API + CLI fallback)

**Adapt from:**
- `scripts/prompt-runner.py` chat_ollama/chat_lmstudio/chat_foundry
- `D:\source\prompts\tools\llm\probe_providers_local.py` probe functions

---

### Phase 3: Extended local providers (~300 LOC)

**Create:**
- `providers/local_onnx.py` — probe (scan ~/.cache/aigallery/) + chat (onnxruntime-genai)
- `providers/aitk.py` — probe (scan ~/.aitk/models/, read foundry.modelinfo.json)
- `providers/windows_ai.py` — probe (C# bridge check) + chat (subprocess to PhiSilicaBridge)
- `providers/local_server.py` — probe (scan common ports) + chat (generic OpenAI-compat)

**Adapt from:**
- `D:\source\prompts\tools\llm\probe_providers_local.py`
- `D:\source\prompts\tools\llm\windows_ai.py`
- `D:\source\prompts\tools\llm\local_model.py`

---

### Phase 4: Cloud providers (~450 LOC)

**Create:**
- `providers/openai.py` — probe (check key, /v1/models) + chat (/v1/chat/completions)
  - Also handles Azure OpenAI and Azure Foundry via endpoint config
- `providers/github.py` — probe (GITHUB_TOKEN, `gh models list`) + chat (REST or `gh models run`)
- `providers/gemini.py` — probe (API key, list models) + chat (REST generateContent)
- `providers/anthropic.py` — probe (API key) + chat (REST /v1/messages)

Each uses stdlib urllib with optional SDK import for richer functionality.

**Adapt from:**
- `D:\source\prompts\tools\llm\provider_adapters.py`
- `D:\source\prompts\tools\llm\probe_providers_cloud.py`

---

### Phase 5: Probe + Discovery (~250 LOC)

**Create:**
- `probe.py` — ModelProbe class:
  - 3-tier cache (session dict → persistent JSON → live HTTP probe)
  - TTL: 1hr success, 24hr permanent errors, 5min transient
  - `check_model(id) → ProbeResult`
  - `filter_runnable(list) → list`
  - `get_report() → dict`
- `discovery.py` — `discover_all(verbose=False) → dict`:
  - Iterate all registered providers, call probe()
  - Return `{timestamp, providers, summary}`

**Adapt from:**
- `D:\source\prompts\tools\llm\model_probe.py`
- `D:\source\prompts\tools\llm\probe_discovery.py`

---

### Phase 6: Runner (~200 LOC)

**Create:**
- `runner.py`:
  - `run_prompt(model, prompt, system, temperature, max_tokens, stream) → Iterator[str] | str`
  - Resolve aliases → detect provider → probe availability → dispatch
  - Thinking-model detection (qwen3, deepseek-r1) — separate thinking vs response
  - Stdin piping support
  - JSON output mode

**Adapt from:**
- `scripts/prompt-runner.py` main loop + streaming logic
- `D:\source\prompts\tools\llm\llm_client.py` dispatch pattern

---

### Phase 7: Ranking + Bakeoff (~400 LOC)

**Create:**
- `ranking.py` — score providers (local=100, AITK=95, Ollama=85, OpenAI=80, etc.)
- `bakeoff.py` — run 4 tasks per model, score, recommend small/heavy
- `bakeoff_tasks.py` — TaskSpec dataclass with workflow/architecture/implementation/coding tasks
- `bakeoff_reporting.py` — JSON + Markdown reports, .env output

**Adapt from:**
- `D:\source\prompts\tools\llm\rank_models.py`
- `D:\source\prompts\tools\llm\model_bakeoff.py` + `bakeoff_tasks.py` + `bakeoff_reporting.py`

---

### Phase 8: Concurrency + Locks (~200 LOC)

**Create:**
- `locks.py` — lock dir `~/.cache/llm-maestro/locks/`, PID-validated lock files
- `concurrency.py` — ThreadPoolExecutor, per-model locks, sequential vs parallel mode

**Adapt from:**
- `D:\source\prompts\tools\llm\model_locks.py`
- `D:\source\prompts\tools\llm\run_local_concurrency.py`

---

### Phase 9: CLI + integration (~250 LOC)

**Create:**
- `cli.py` — argparse with subcommands (run, probe, discover, list, rank, bakeoff, pull)
- `__main__.py` — `from llm_maestro.cli import main; main()`

**Update:**
- `scripts/prompt-runner.py` in midnight-automation-voyage → thin wrapper over llm-maestro

---

## Summary

| Phase | Focus | Est. LOC | Deps |
|-------|-------|----------|------|
| 1 | Foundation (errors, config, catalog) | ~350 | None |
| 2 | Local providers (Ollama, LM Studio, Foundry) | ~400 | Phase 1 |
| 3 | Extended local (ONNX, AITK, Windows AI) | ~300 | Phase 1 |
| 4 | Cloud providers (OpenAI, GitHub, Gemini, Claude) | ~450 | Phase 1 |
| 5 | Probe + Discovery | ~250 | Phase 1-4 |
| 6 | Runner | ~200 | Phase 1-5 |
| 7 | Ranking + Bakeoff | ~400 | Phase 5-6 |
| 8 | Concurrency + Locks | ~200 | Phase 6 |
| 9 | CLI + integration | ~250 | All |
| **Total** | | **~2,800** | |

## Key Design Decisions

1. **src-layout** — `src/llm_maestro/` for clean pip install + editable dev
2. **Zero required deps** — stdlib urllib for all HTTP, optional SDKs for richer features
3. **Provider as plugin pattern** — `BaseProvider` + registry, easy to add new providers
4. **Prefix-based routing** — `ollama:model`, `gh:model` etc., bare names auto-detect
5. **Streaming-first** — all chat functions return generators; `stream=False` collects into string
6. **Cache isolation** — `~/.cache/llm-maestro/` separate from prompts repo
7. **Installable** — `pip install -e .` for dev, `pip install llm-maestro` for consumers
