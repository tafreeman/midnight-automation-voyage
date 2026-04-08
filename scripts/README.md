# Scripts

Utility scripts for the Midnight Automation Voyage project.

| Script | Language | Purpose |
|--------|----------|---------|
| `package-standalone.mjs` | Node.js | Packages a course as a standalone single HTML file |
| `prompt-runner.py` | Python | Runs prompts against AI models for evaluation |
| `audit-course-content.md` | Markdown | Prompt template for auditing course content completeness |

## Usage

### Package Standalone Build

```bash
node scripts/package-standalone.mjs
```

Produces a single-file HTML distribution of a course (used with `vite-plugin-singlefile`).

### Prompt Runner

```bash
python scripts/prompt-runner.py
```

Requires Python 3.x. Used for model evaluation and content generation workflows.
