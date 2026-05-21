# Patch 3 — Asset Producer cross-harness compatibility

## Problem

`skill/agents/impeccable-asset-producer.md` declares `providers: codex`. The agent is invoked from `craft.md` Step 3 / codex.md flow to produce clean reusable raster assets from approved mocks.

On all 10 non-Codex harnesses (Claude Code, Cursor, Gemini, Copilot, Kiro, OpenCode, Pi, Qoder, Trae, Rovo), this capability silently degrades. The craft flow either:
- Skips visual direction entirely ("one-line announcement" per craft.md Step 3), OR
- Tries to invoke a non-existent subagent and fails opaquely

Either way, output quality on those harnesses is asymmetric vs Codex without explicit user notification.

## Fix (three-tier strategy)

### Tier 1 — Explicit fallback message (all harnesses)

When a non-Codex harness reaches the asset production step, emit a structured fallback message instead of silently degrading:

```
ASSET PRODUCTION SKIPPED — harness does not support image_gen subagents.

To get production assets:
  1. Generate or source imagery externally (Midjourney, Figma, Unsplash, etc.)
  2. Place files in: <output_dir>/ (see brief for crop specs)
  3. Resume with: /impeccable craft --resume-with-assets
  4. The implementation will use those rasters instead of CSS scenery

Or, to proceed without imagery:
  5. /impeccable craft --no-assets    (CSS-only build, image-led briefs degrade)
```

### Tier 2 — Native image_gen integration where available

| Harness | Image-gen tool | Status |
|---|---|---|
| Codex | `image_gen` builtin | ✅ uses asset producer subagent |
| Claude Code | None native, but MCP image servers exist (Replicate, OpenAI DALL-E via MCP) | implementable via MCP tool |
| Cursor | None | Tier 1 fallback |
| Gemini CLI | Imagen native | implementable |
| Copilot | None | Tier 1 fallback |
| OpenCode | Plugin-dependent | Tier 1 fallback |
| Pi | None | Tier 1 fallback |
| Qoder | Plugin-dependent | Tier 1 fallback |
| Trae | None documented | Tier 1 fallback |
| Kiro | None | Tier 1 fallback |
| Rovo Dev | None | Tier 1 fallback |

### Tier 3 — Canonical agent prompt with provider gates

Replace the current single agent file with a frontmatter that explicitly lists supported providers and provides a fallback path:

```yaml
---
name: impeccable-asset-producer
codex-name: impeccable_asset_producer
description: Produces clean reusable raster assets from approved Impeccable mock references without redesigning the direction.
tools: Read, Write, Edit, Bash, Glob, Grep
model: inherit
effort: medium
max-turns: 12
providers:
  - codex
  - claude-code:requires-mcp-image-tool
  - gemini:imagen
fallback:
  - tier: 1
    behavior: emit-structured-fallback-message
    targets: cursor, copilot, kiro, opencode, pi, qoder, trae, rovo
nickname-candidates:
  - Asset Plate
  - Clean Plate
  - Crop Cutter
---
```

## Implementation steps

### Step 1 — Update agent file

Edit `skill/agents/impeccable-asset-producer.md` frontmatter to add `fallback` and explicit `providers` list (above).

### Step 2 — Add fallback emitter

`skill/scripts/asset-producer-fallback.mjs`:

```javascript
#!/usr/bin/env node
import process from "node:process";

const harness = detectHarness();
const codexCapable = ["codex"];
const imageGenCapable = ["codex", "gemini", "claude-code-with-mcp-image"];

if (codexCapable.includes(harness)) {
  // The Codex flow handles this — exit cleanly, let parent invoke subagent
  process.exit(0);
}

const briefPath = process.argv[2] ?? "(see brief)";
const outputDir = process.argv[3] ?? "<output_dir>";

console.log(`
ASSET PRODUCTION SKIPPED — harness '${harness}' does not support image_gen subagents.

To get production assets:
  1. Generate or source imagery externally (Midjourney, Figma, Unsplash, etc.)
  2. Place files in: ${outputDir}/
  3. Resume with: /impeccable craft --resume-with-assets
  4. The implementation will use those rasters instead of CSS scenery

Or, to proceed without imagery (image-led briefs degrade):
  5. /impeccable craft --no-assets
`.trim());

process.exit(2); // non-zero so the parent flow stops and shows this message

function detectHarness() {
  if (process.env.CLAUDE_SESSION_ID) return "claude-code";
  if (process.env.CODEX_SESSION_ID)  return "codex";
  if (process.env.GEMINI_SESSION_ID) return "gemini";
  // ... add other harness env vars
  return "unknown";
}
```

### Step 3 — Update craft.md Step 3

Replace current "If the harness lacks native image generation, state in one line that the visual-direction-by-generation step is being skipped..." with:

```
## Step 3: Visual Direction & Assets

Run: `node {{scripts_path}}/asset-producer-fallback.mjs <brief_path> <output_dir>`

- Exit code 0 (Codex) → load codex.md and proceed through Steps A-F
- Exit code 2 (other harness) → stdout contains user-facing fallback message; emit it as-is, then STOP for user input
```

This converts an implicit silent degradation into an explicit user-facing decision point.

## Expected behavior after patch

- Codex: unchanged, full flow works
- Claude Code: clear message, user provides assets or opts out, then resume
- Gemini CLI: opportunity to wire native Imagen later
- All others: clear message, no silent quality drop

## Tests to add

- `tests/asset-fallback.test.mjs`: assert fallback emits non-zero exit + structured message on simulated non-Codex env
- `tests/asset-fallback-codex.test.mjs`: assert exit 0 on Codex env
- E2E: run `/impeccable craft <image-led-brief>` on Claude Code fixture, assert fallback message appears before any code-gen
