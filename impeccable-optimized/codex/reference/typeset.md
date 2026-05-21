<!-- v3 | agente: codex | 2026-05-21 -->
# Typeset (Codex)

```
Step 1: Audit current type system
  - font families + load weights
  - type scale (sizes + ratio)
  - weight palette per family
  - line-height map per size
  - letter-spacing per size
  - OpenType features used

Step 2: Apply 5 typeset moves

  2.1 Font selection (if changing)
      - Use procedure in reference/typography.md
      - Brand: avoid reflex-reject list (Inter/Plex/Fraunces/Cormorant/etc.)
      - Cross-check PRODUCT.md voice words

  2.2 Hierarchy via weight + scale
      - Weight contrast ≥1.25 between steps
      - Scale ratio: 1.25 / 1.333 / 1.5
      - Compress middle, expand extremes

  2.3 Line height tuning
      Display:   0.95-1.05
      Headline:  1.1-1.2
      Body:      1.5-1.65
      Caption:   1.4-1.5

  2.4 Line length
      Body:       65-75ch
      Display:    unconstrained
      Tabular:    minimum readable

  2.5 OpenType features
      Tables:        tnum
      Prose numbers: lnum or pnum
      Body prose:    liga always
      Display serif: dlig
      Book-like:     hanging punctuation

Step 3: Register-aware
  Brand:   one opinionated choice (serif OR committed sans, not both timid)
  Product: one sans family, weight contrast within, predictable, numbers tnum default

Step 4: Route
  hierarchy fix → layout gap → /impeccable layout
  type needs motion           → /impeccable animate
  final pass                  → /impeccable polish
  amplify weight contrast     → /impeccable bolder
```

## Anti-patterns
```
❌ Inter/Plex/Fraunces/Cormorant on brand without justification
❌ Flat weight scale
❌ Body line-length >75ch
❌ Skip tnum on data tables
❌ Same line-height all sizes
```
