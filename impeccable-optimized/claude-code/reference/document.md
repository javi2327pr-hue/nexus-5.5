<!-- v3 | agente: claude-code | 2026-05-21 -->
# Document (Claude Code)

Generate DESIGN.md from existing project code. Captures the current visual design system.

## Use this command when

- User says "document my design system", "generate DESIGN.md", "extract design tokens"
- After major design work to refresh DESIGN.md
- Auto-invoked from `teach` when code exists

## Output format

DESIGN.md follows Google Stitch format for cross-tool compatibility:

```yaml
---
name: <Project name>
description: <One-line: aesthetic identity sentence>

colors:
  <semantic-name>: "oklch(L% C H)"
  # OR rgb / hex if legacy

typography:
  <role>:
    fontFamily: "<family + fallback>"
    fontSize: "<size or clamp>"
    fontWeight: <num>
    lineHeight: <num>
    letterSpacing: "<value>"  # optional

spacing:
  <scale-step>: "<value>"

elevation:
  <level>: "<box-shadow value>"

radii:
  <name>: "<value>"

components:
  <component>:
    <variant>:
      <token>: <value>

motion:
  <category>:
    duration: "<ms>"
    easing: "<curve>"
---
```

## Extraction sources

### 1. CSS variables (highest signal)
```bash
# Walk src/**/*.{css,scss,less}
# Extract :root { --token: value }
# Group by prefix (e.g., --color-*, --space-*, --font-*)
```

### 2. Theme files (if framework)
- `tailwind.config.{js,ts}` → theme.extend
- `tokens.css` / `theme.ts` / `tokens.json`
- Material UI / Chakra / etc. theme exports
- Astro globals, Next.js theme providers

### 3. Computed styles from a representative page
If no explicit tokens, walk a representative page DOM and extract used colors/sizes/spacing. Cluster near-duplicates (e.g., 13/14/15px → canonical 14px).

### 4. Component sketches
For frequently-used components (Button, Card, Input), document their variants + tokens.

## Auto-extraction + user confirmation

The script extracts machine-readable values automatically. Then ask user to confirm descriptive language:

> "I see your palette uses warm magenta + paper-cream. Aesthetic description: 'Warm-paper editorial sanctuary'. Confirm or override?"

User confirms the **vibe sentence** + **atmosphere descriptors**. Machine handles the rest.

## Routing

FROM `document`, suggest GO TO:

| When... | Suggest |
|---|---|
| Tokens reveal coverage gaps | `extract` (consolidate repeated patterns) |
| Inconsistent tokens (off-tones, orphan spacing) | `polish` |
| First feature build after teach | `shape` then `craft` |

STAY in `document` UNTIL: DESIGN.md written with auto-extracted values + user-confirmed atmosphere.

## Anti-patterns

- ❌ Hand-writing tokens instead of auto-extracting (drift guaranteed)
- ❌ Skipping atmosphere/voice sentence (DESIGN.md without that is just CSS rename)
- ❌ Including every used value (cluster near-duplicates to canonical)
- ❌ Writing DESIGN.md without code (use `teach` to ask brand-only questions)
