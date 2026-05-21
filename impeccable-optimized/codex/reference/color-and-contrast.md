<!-- v3 | agente: codex | 2026-05-21 -->
# Color and contrast (Codex domain ref)

```
OKLCH-ONLY RULE:
  - Never #000 or #fff
  - Reduce chroma at lightness extremes (0.005-0.01 max)
  - Tint every neutral toward brand hue

STRATEGY AXIS (pick one):
  Restrained:    tinted neutrals + 1 accent ≤10%  (product default; brand minimalism)
  Committed:     1 saturated 30-60% of surface    (brand identity)
  Full palette:  3-4 named roles each deliberate  (campaigns, data viz)
  Drenched:      surface IS the color             (heroes, campaigns)
  "≤10% accent" rule = Restrained ONLY

DARK VS LIGHT (never default):
  Write one sentence physical scene:
    who, where, ambient light, mood
  If sentence doesn't force answer → add detail
  Bad:  "Observability dashboard"
  Good: "SRE glancing at incident severity on 27-inch monitor at 2am in dim room"
  Run the sentence, not the category.

CONTRAST (WCAG 2.1 AA):
  Body small:                     4.5:1
  Large (≥18pt OR 14pt bold):     3:1
  Non-text UI components:         3:1
  Decorative:                     none
  ALWAYS MEASURE. Never eyeball.

CATEGORY REFLEX CHECK (avoid):
  observability + dark blue/neon  → AVOID
  healthcare + white/teal         → AVOID
  finance + navy/gold             → AVOID
  crypto + neon on black          → AVOID
  AI tool + purple gradient       → AVOID
  sustainability + green          → AVOID

TINTED NEUTRALS:
  Pure black  → oklch(10% 0.005 <brand-hue>)
  Pure white  → oklch(98% 0.005 <brand-hue>)
  Mid gray    → oklch(55% 0.005 <brand-hue>)

THEME SWITCH:
  Respect prefers-color-scheme + user override
  Store override in localStorage
  Test both themes visually
  No hardcoded colors that break switch

PITFALLS:
  ❌ "Almost the same" off-tones
  ❌ High chroma at extremes
  ❌ #000/#fff
  ❌ Category-default palette
  ❌ Eyeball contrast
  ❌ Gradient text (background-clip: text) — absolute ban
```
