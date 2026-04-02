#!/usr/bin/env python3
"""
Prompt Runner — Outsource tasks to local Ollama or LM Studio models.

Backends:
    - Ollama (default): http://localhost:11434
    - LM Studio: http://localhost:1234 (OpenAI-compatible API)

Usage:
    # Basic prompt
    python scripts/prompt-runner.py "Summarize the key points of this text"

    # Pipe content in
    cat some_file.py | python scripts/prompt-runner.py "Review this code for bugs"

    # With a specific model
    python scripts/prompt-runner.py -m deepseek-r1:8b "Explain this error"

    # With a system prompt
    python scripts/prompt-runner.py -s "You are a code reviewer" "Review: def foo(): pass"

    # Read prompt from file
    python scripts/prompt-runner.py -f prompt.md

    # JSON output mode (for programmatic use by Claude Code)
    python scripts/prompt-runner.py --json "What is 2+2"

    # Use LM Studio backend
    python scripts/prompt-runner.py --backend lmstudio "Hello"

    # List available models
    python scripts/prompt-runner.py --list

    # Pull a model
    python scripts/prompt-runner.py --pull qwen3:8b
"""
from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.request
from typing import Any

OLLAMA_BASE = "http://localhost:11434"
LMSTUDIO_BASE = "http://localhost:1234"
FOUNDRY_BASE = None  # discovered dynamically

# Model aliases for convenience
MODEL_ALIASES = {
    "fast": "gemma3:1b",
    "small": "qwen3:4b",
    "balanced": "qwen3:8b",
    "smart": "deepseek-r1:8b",
    "code": "qwen2.5-coder:14b",
    "coder": "qwen3-coder:30b",
    "reason": "phi4-reasoning",
    "uncensored": "llama2-uncensored",
    "phi4": "phi-4",  # foundry local alias
    "default": "qwen3:4b",  # currently loaded
}


def http_request(url: str, payload: dict | None = None, stream: bool = False, timeout: int = 300) -> Any:
    """Make an HTTP request, return parsed JSON or raw response for streaming."""
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    else:
        req = urllib.request.Request(url)

    resp = urllib.request.urlopen(req, timeout=timeout)
    if stream:
        return resp
    return json.loads(resp.read().decode("utf-8"))


def discover_foundry_base() -> str | None:
    """Discover Foundry Local's dynamic port from its CLI.

    Foundry Local runs on a dynamic port with an /openai/ path prefix.
    Returns base URL like 'http://127.0.0.1:59647/openai'.
    """
    global FOUNDRY_BASE
    if FOUNDRY_BASE:
        return FOUNDRY_BASE
    try:
        import re
        import subprocess
        result = subprocess.run(
            ["foundry", "service", "status"],
            capture_output=True, text=True, timeout=5,
        )
        match = re.search(r"(http://127\.0\.0\.1:\d+)", result.stdout)
        if match:
            FOUNDRY_BASE = match.group(1)
            return FOUNDRY_BASE
    except Exception:
        pass
    return None


def detect_backend() -> str:
    """Auto-detect which backend is available."""
    # Check Ollama first (most common)
    try:
        http_request(f"{OLLAMA_BASE}/api/tags", timeout=3)
        return "ollama"
    except Exception:
        pass

    # Check LM Studio
    try:
        http_request(f"{LMSTUDIO_BASE}/v1/models", timeout=3)
        return "lmstudio"
    except Exception:
        pass

    # Check Foundry Local
    base = discover_foundry_base()
    if base:
        try:
            http_request(f"{base}/v1/models", timeout=3)
            return "foundry"
        except Exception:
            pass

    print("Error: No local model server found.", file=sys.stderr)
    print("  Start Ollama:       ollama serve", file=sys.stderr)
    print("  Or LM Studio:       start LM Studio and enable server", file=sys.stderr)
    print("  Or Foundry Local:   foundry service start", file=sys.stderr)
    sys.exit(1)


def list_models_ollama() -> list[dict]:
    """List Ollama models."""
    data = http_request(f"{OLLAMA_BASE}/api/tags")
    return data.get("models", [])


def list_models_lmstudio() -> list[dict]:
    """List LM Studio models."""
    data = http_request(f"{LMSTUDIO_BASE}/v1/models")
    return [{"name": m["id"], "size": 0} for m in data.get("data", [])]


def list_models_foundry() -> list[dict]:
    """List Foundry Local models using the CLI (API only shows loaded models)."""
    try:
        import re
        import subprocess
        result = subprocess.run(
            ["foundry", "model", "list"],
            capture_output=True, text=True, timeout=10,
        )
        models = []
        # Parse lines like: "phi-4                          GPU        chat-completion    8.37 GB"
        for line in result.stdout.splitlines():
            match = re.match(r"^(\S+)\s+\S+\s+\S+\s+([\d.]+\s+\w+)", line)
            if match and not line.startswith("Alias") and not line.startswith("-"):
                name = match.group(1)
                size_str = match.group(2)
                # Avoid duplicates (same alias, different devices)
                if not any(m["name"] == name for m in models):
                    try:
                        size_val, unit = size_str.split()
                        size_bytes = float(size_val) * (1024**3) if "GB" in unit else float(size_val) * (1024**2)
                    except (ValueError, IndexError):
                        size_bytes = 0
                    models.append({"name": name, "size": size_bytes})
        return models
    except Exception:
        return []


def resolve_model(name: str) -> str:
    """Resolve model aliases to actual model names."""
    return MODEL_ALIASES.get(name, name)


def chat_ollama(
    prompt: str,
    model: str,
    system: str | None = None,
    stream_to_stdout: bool = True,
    temperature: float = 0.7,
    max_tokens: int = 4096,
    no_think: bool = False,
    show_thinking: bool = False,
) -> str:
    """Chat with an Ollama model using the /api/chat endpoint.

    Always uses streaming internally (avoids timeout issues with thinking models).
    stream_to_stdout controls whether tokens are printed as they arrive.
    Handles thinking models (qwen3, deepseek-r1) that put reasoning in a separate field.
    """
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    payload: dict[str, Any] = {
        "model": model,
        "messages": messages,
        "stream": True,  # always stream internally
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
        },
    }

    # Disable thinking for supported models (qwen3, etc.)
    # Uses Ollama's native think parameter
    if no_think:
        payload["think"] = False

    resp = http_request(f"{OLLAMA_BASE}/api/chat", payload, stream=True)
    full_response = []
    thinking_parts = []
    in_thinking = False

    for line in resp:
        chunk = json.loads(line.decode("utf-8"))
        msg = chunk.get("message", {})

        # Handle thinking content (qwen3, deepseek-r1, etc.)
        thinking_token = msg.get("thinking", "")
        if thinking_token:
            if not in_thinking and stream_to_stdout and show_thinking:
                print("[thinking] ", end="", flush=True)
                in_thinking = True
            thinking_parts.append(thinking_token)
            if stream_to_stdout and show_thinking:
                print(thinking_token, end="", flush=True)

        # Handle actual response content
        token = msg.get("content", "")
        if token:
            if in_thinking and stream_to_stdout and show_thinking:
                print("\n[response] ", end="", flush=True)
                in_thinking = False
            if stream_to_stdout:
                print(token, end="", flush=True)
            full_response.append(token)

        if chunk.get("done"):
            break

    if stream_to_stdout:
        print()
    return "".join(full_response)


def chat_lmstudio(
    prompt: str,
    model: str,
    system: str | None = None,
    stream_to_stdout: bool = True,
    temperature: float = 0.7,
    max_tokens: int = 4096,
) -> str:
    """Chat with an LM Studio model using the OpenAI-compatible API."""
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    payload: dict[str, Any] = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "stream": True,  # always stream internally
    }

    resp = http_request(f"{LMSTUDIO_BASE}/v1/chat/completions", payload, stream=True)
    full_response = []
    for line in resp:
        text = line.decode("utf-8").strip()
        if not text or text == "data: [DONE]":
            continue
        if text.startswith("data: "):
            text = text[6:]
        try:
            chunk = json.loads(text)
            delta = chunk.get("choices", [{}])[0].get("delta", {})
            token = delta.get("content", "")
            if token:
                if stream_to_stdout:
                    print(token, end="", flush=True)
                full_response.append(token)
        except json.JSONDecodeError:
            continue
    if stream_to_stdout:
        print()
    return "".join(full_response)


def chat_foundry(
    prompt: str,
    model: str,
    system: str | None = None,
    stream_to_stdout: bool = True,
    temperature: float = 0.7,
    max_tokens: int = 4096,
) -> str:
    """Chat with a Foundry Local model using the CLI.

    Uses `foundry model run --prompt` which handles model download/loading automatically.
    """
    import subprocess

    # Build the full prompt with system context if provided
    full_input = prompt
    if system:
        full_input = f"System: {system}\n\nUser: {prompt}"

    try:
        result = subprocess.run(
            ["foundry", "model", "run", model, "--prompt", full_input],
            capture_output=True, text=True, timeout=300,
        )
        response = result.stdout.strip()

        # Filter out download progress lines
        lines = response.splitlines()
        content_lines = [
            line for line in lines
            if not any(x in line for x in ["Downloading", "[", "Loading", "Unloading"])
        ]
        response = "\n".join(content_lines).strip()

        if stream_to_stdout:
            print(response)
        return response
    except subprocess.TimeoutExpired:
        print("Error: Foundry model timed out", file=sys.stderr)
        return ""
    except FileNotFoundError:
        print("Error: 'foundry' CLI not found", file=sys.stderr)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Run prompts through local Ollama or LM Studio models",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Model aliases:
  fast        gemma3:1b         (tiny, instant)
  small       qwen3:4b          (small, quick)
  balanced    qwen3:8b          (good all-rounder)
  smart       deepseek-r1:8b    (reasoning)
  code        qwen2.5-coder:14b (code tasks)
  coder       qwen3-coder:30b   (heavy code)
  reason      phi4-reasoning    (step-by-step)
  uncensored  llama2-uncensored

Examples:
  python scripts/prompt-runner.py "Explain Python decorators"
  python scripts/prompt-runner.py -m code "Write a binary search"
  cat file.py | python scripts/prompt-runner.py "Review this code"
  python scripts/prompt-runner.py --json -m small "What is 2+2"
        """,
    )
    parser.add_argument("prompt", nargs="?", help="The prompt to send")
    parser.add_argument("-m", "--model", default="default", help="Model name or alias (default: qwen3:4b)")
    parser.add_argument("-s", "--system", help="System prompt")
    parser.add_argument("-f", "--file", help="Read prompt from file")
    parser.add_argument("-t", "--temperature", type=float, default=0.7)
    parser.add_argument("--max-tokens", type=int, default=8192,
                        help="Max tokens including thinking (default: 8192)")
    parser.add_argument("--no-stream", action="store_true", help="Collect full response before printing")
    parser.add_argument("--no-think", action="store_true", help="Disable thinking for reasoning models (faster)")
    parser.add_argument("--show-thinking", action="store_true", help="Show thinking process in output")
    parser.add_argument("--json", action="store_true", help="Output as JSON (implies --no-stream)")
    parser.add_argument("--backend", choices=["ollama", "lmstudio", "foundry", "auto"], default="auto",
                        help="Backend to use (default: auto-detect)")
    parser.add_argument("--list", action="store_true", help="List available models")
    parser.add_argument("--pull", metavar="MODEL", help="Pull/download an Ollama model")

    args = parser.parse_args()

    # Detect backend
    if args.backend == "auto":
        backend = detect_backend()
    else:
        backend = args.backend

    # List models
    if args.list:
        list_fns = {"ollama": list_models_ollama, "lmstudio": list_models_lmstudio, "foundry": list_models_foundry}
        models = list_fns[backend]()
        if not models:
            print("No models found.")
            sys.exit(0)
        print(f"Backend: {backend}")
        print(f"{'Model':<40} {'Size':>10}")
        print("-" * 55)
        for m in models:
            size_gb = m.get("size", 0) / (1024**3)
            size_str = f"{size_gb:.1f} GB" if size_gb > 0 else "cloud"
            print(f"{m['name']:<40} {size_str:>10}")
        print(f"\nAliases: {json.dumps(MODEL_ALIASES, indent=2)}")
        sys.exit(0)

    # Pull model (Ollama only)
    if args.pull:
        print(f"Pulling {args.pull}...")
        payload = {"name": args.pull, "stream": True}
        resp = http_request(f"{OLLAMA_BASE}/api/pull", payload, stream=True)
        for line in resp:
            chunk = json.loads(line.decode("utf-8"))
            status = chunk.get("status", "")
            if "pulling" in status:
                total = max(chunk.get("total", 1), 1)
                pct = chunk.get("completed", 0) / total * 100
                print(f"\r  {status} {pct:.0f}%", end="", flush=True)
            else:
                print(f"\r  {status}", flush=True)
        print("\nDone!")
        sys.exit(0)

    # Build the prompt
    prompt_parts = []

    # Read from stdin if piped
    if not sys.stdin.isatty():
        stdin_content = sys.stdin.read().strip()
        if stdin_content:
            prompt_parts.append(f"<context>\n{stdin_content}\n</context>\n")

    # Read from file
    if args.file:
        try:
            with open(args.file, "r", encoding="utf-8") as f:
                prompt_parts.append(f.read().strip())
        except FileNotFoundError:
            print(f"Error: File not found: {args.file}", file=sys.stderr)
            sys.exit(1)

    # Command line prompt
    if args.prompt:
        prompt_parts.append(args.prompt)

    if not prompt_parts:
        parser.print_help()
        sys.exit(1)

    full_prompt = "\n\n".join(prompt_parts)
    model = resolve_model(args.model)
    stream_to_stdout = not args.no_stream and not args.json

    # Run the prompt
    start = time.time()

    if backend == "ollama":
        result = chat_ollama(
            prompt=full_prompt,
            model=model,
            system=args.system,
            stream_to_stdout=stream_to_stdout,
            temperature=args.temperature,
            max_tokens=args.max_tokens,
            no_think=args.no_think,
            show_thinking=args.show_thinking,
        )
    elif backend == "foundry":
        result = chat_foundry(
            prompt=full_prompt,
            model=model,
            system=args.system,
            stream_to_stdout=stream_to_stdout,
            temperature=args.temperature,
            max_tokens=args.max_tokens,
        )
    else:
        result = chat_lmstudio(
            prompt=full_prompt,
            model=model,
            system=args.system,
            stream_to_stdout=stream_to_stdout,
            temperature=args.temperature,
            max_tokens=args.max_tokens,
        )

    elapsed = time.time() - start

    if args.json:
        output = {
            "backend": backend,
            "model": model,
            "response": result,
            "elapsed_seconds": round(elapsed, 2),
        }
        print(json.dumps(output, indent=2))
    elif not stream_to_stdout:
        print(result)

    if stream_to_stdout and not args.json:
        print(f"\n[{backend}:{model} | {elapsed:.1f}s]", file=sys.stderr)


if __name__ == "__main__":
    main()
