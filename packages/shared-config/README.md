# @mav/shared-config

Centralised build configuration shared across the Midnight Automation Voyage workspace.

## Exports

| Export Path | File | Used By |
|-------------|------|---------|
| `@mav/shared-config/tsconfig.base` | `tsconfig.base.json` | training-app, practice-app |
| `@mav/shared-config/postcss` | `postcss.config.js` | training-app, practice-app |
| `@mav/shared-config/tailwind` | `tailwind.config.js` | training-app, practice-app |

## Usage

In a workspace package's `package.json`:

```json
{
  "dependencies": {
    "@mav/shared-config": "workspace:*"
  }
}
```

Then reference in the consuming config:

```js
// postcss.config.js
export { default } from '@mav/shared-config/postcss';
```

## Development

This is a config-only package with no build step. Changes take effect immediately in consuming packages on next dev server restart or build.
