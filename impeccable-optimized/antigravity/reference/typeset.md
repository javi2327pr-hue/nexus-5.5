<!-- v3 | agente: antigravity | 2026-05-21 -->
# Typeset (Antigravity)

## Goal
Fix typography: font choices, hierarchy via weight+scale, line-height tuning, line-length, OpenType features. Result: text feels intentional.

## Autonomy boundaries
- Audit current type system before changes
- Apply 5 moves in order (font, hierarchy, line-height, line-length, OT features)
- Brand register: reject reflex-list fonts unless justified
- Product register: stay within one sans family
- Do NOT pick Inter/Plex/Fraunces/Cormorant on brand without justification
- Do NOT flatten weight scale ("contrast feels heavy" — that's the point)
- Do NOT exceed 75ch body line length

## Acceptance criteria
1. Type system inventory captured before changes
2. Hierarchy weight contrast ≥1.25 ratio between steps
3. Scale modular (1.25 / 1.333 / 1.5)
4. Line-height tuned by size (display tight, body loose)
5. Body line length 65-75ch
6. OT features applied: tnum for tables, liga for body, lnum or pnum for prose numbers
7. Brand: one opinionated choice (display serif OR committed sans, not both timid)
8. Product: one sans family, predictable, tnum default

## Optional checkpoints
- Confirm font family change if affecting site-wide identity
- Confirm scale ratio change if extensive existing usage
- Otherwise: autonomous

## Inputs / outputs
- Input: target
- Output: diffed type system + audit report

## Success metric
- 100% body line length within 65-75ch
- 0 reflex-rejected fonts shipped on brand without justification
- 0 flat weight scales
- 100% data tables use tnum

## Failure mode handling
- Font load infrastructure missing → bootstrap (Google Fonts/local), document in DESIGN.md
- User-provided font fails on web (no @font-face support) → revert + ask user for alternative
- Existing usage too entrenched to refactor → flag, do partial typeset, suggest extract for design system consolidation
