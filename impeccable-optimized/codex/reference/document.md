<!-- v3 | agente: codex | 2026-05-21 -->
# Document (Codex)

```
Output: DESIGN.md following Google Stitch format for cross-tool compatibility.

Step 1: Extract from CSS variables (highest signal)
  Walk src/**/*.{css,scss,less}
  Extract :root { --token: value }
  Group by prefix (--color-*, --space-*, --font-*)

Step 2: Extract from theme files
  tailwind.config.{js,ts} → theme.extend
  tokens.css / theme.ts / tokens.json
  Material/Chakra/etc. theme exports
  Astro globals, Next.js theme providers

Step 3: Fallback to computed styles
  If no explicit tokens, walk representative page DOM
  Extract used colors/sizes/spacing
  Cluster near-duplicates to canonical:
    13/14/15px → 14px
    #1a1a1a/#1c1c1c → canonical near-black

Step 4: Document components
  For Button, Card, Input, etc.: variants + tokens

Step 5: Ask user for descriptive language
  Auto-extracted values present. Now:
  "I see warm magenta + paper-cream. Description: 'Warm-paper editorial sanctuary'. Confirm or override?"
  User confirms vibe sentence + atmosphere descriptors.

Step 6: Write DESIGN.md (Stitch format)
  ---
  name: <project>
  description: <one-line aesthetic sentence>
  colors:
    <semantic-name>: "oklch(L% C H)"
  typography:
    <role>: { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing }
  spacing:
    <scale-step>: "<value>"
  elevation: ...
  radii: ...
  components: ...
  motion: ...
  ---

Step 7: Route
  coverage gaps in tokens   → /impeccable extract
  inconsistent tokens       → /impeccable polish
  first feature after teach → /impeccable shape → /impeccable craft
```

## Anti-patterns
```
❌ Hand-write tokens instead of auto-extract
❌ Skip atmosphere/voice sentence
❌ Include every value (cluster near-duplicates)
❌ Write DESIGN.md without code (use teach for brand-only)
```
