<!-- v3 | agente: codex | 2026-05-21 -->
# Colorize (Codex)

```
Step 1: Pick color strategy (do not default to Restrained by reflex)
  Restrained:  tinted neutrals + 1 accent ≤10% (product default)
  Committed:   1 saturated 30-60% of surface (brand identity)
  Full palette: 3-4 named roles each deliberate (campaigns, data viz)
  Drenched:    surface IS the color (heroes, campaigns)

Step 2: OKLCH choice procedure
  - Never #000 or #fff
  - Reduce chroma at lightness extremes
  - Tint all neutrals toward hue (chroma 0.005-0.01)
  - Choose hue family from PRODUCT.md cues + register

Step 3: Verify contrast
  - 4.5:1 for body text
  - 3:1 for large text + UI components
  - Actual measurement, never eyeball

Step 4: Category reflex check
  observability + dark blue/neon  → AVOID, look further
  healthcare + white/teal         → AVOID
  finance + navy/gold             → AVOID
  crypto + neon on black          → AVOID
  AI tool + purple gradient       → AVOID
  Use PRODUCT.md anti-references to guide

Step 5: Test against absolute bans
  - No gradient text (background-clip: text)
  - No side-stripe border >1px as accent
  - No neutrals that aren't tinted

Step 6: Register-aware
  Brand:   distinctive, may go Committed/Drenched
  Product: Restrained/Committed, accent serves function

Step 7: Route
  too loud after colorize     → /impeccable quieter
  type needs strengthening    → /impeccable typeset
  want more palette           → /impeccable bolder
  verify contrast/a11y        → /impeccable audit
```

## Anti-patterns
```
❌ Reflex color pick (dark blue for observability, etc.)
❌ #000 / #fff instead of tinted near-black/white
❌ Gradient text "for color"
❌ Default to Restrained when Committed warranted
❌ Skip contrast verification
```
