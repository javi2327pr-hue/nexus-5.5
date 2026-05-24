<!-- v3 | agente: claude-code | 2026-05-21 -->
# Typeset (Claude Code)

Fix typography: font choices, hierarchy, sizing, weight, readability. Make text feel intentional.

## Use this command when

User says: "fonts", "type", "readability", "text hierarchy", "sizing", "polished typography".

## Audit current type system

Before changing anything, inventory:
- Font families present (and load weights)
- Type scale (sizes in use, ratio between steps)
- Weight palette (per family)
- Line-height map (per size)
- Letter-spacing (per size)
- OpenType features used (`tnum`, `lnum`, `liga`, `dlig`)

## 5 typeset moves

### 1. Font selection (if changing family)
Use the procedure in `reference/typography.md` + register reference. Brand register has reflex-reject list (Inter, IBM Plex, Fraunces, Cormorant, etc.).

Cross-check against PRODUCT.md voice words.

### 2. Hierarchy via weight + scale
- Weight contrast ≥1.25 ratio between hierarchy steps
- Scale modular (typically 1.25, 1.333, or 1.5 ratio)
- Compress middle, expand extremes (small smaller, big bigger)

### 3. Line height tuning
- Display sizes: 0.95-1.05 (tight)
- Headlines: 1.1-1.2
- Body: 1.5-1.65
- Caption/micro: 1.4-1.5

### 4. Line length
- Body: 65-75ch
- Headlines/display: unconstrained
- Tabular/data: minimum readable column width

### 5. OpenType features
- Numbers in tables: `tnum` (tabular)
- Numbers in prose: `lnum` or `pnum`
- Body prose: `liga` always; `dlig` only for serif display
- Hanging punctuation in book-like contexts

## Register-specific typeset

| Register | Direction |
|---|---|
| **Brand** | One opinionated choice. Display serif or committed sans, not both timid. Reflex-reject list applies. |
| **Product** | One sans-serif family, weight contrast within it. Predictable. Numbers tabular by default. |

## Routing

FROM `typeset`, suggest GO TO:

| When... | Suggest |
|---|---|
| Hierarchy fix reveals layout gap | `layout` |
| Type now needs animation accent | `animate` |
| Final pass | `polish` |
| Want to amplify weight contrast further | `bolder` |

STAY in `typeset` UNTIL: hierarchy clear, line length within range, OT features applied.

## Anti-patterns

- ❌ Picking Inter / Plex / Fraunces / Cormorant on brand without justification
- ❌ Flat weight scale (no contrast between steps)
- ❌ Body line-length >75ch
- ❌ Skipping `tnum` on data tables
- ❌ Same line-height across all sizes
