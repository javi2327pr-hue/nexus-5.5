<!-- v3 | agente: antigravity | 2026-05-21 -->
# Colorize (Antigravity)

## Goal
Add strategic color to a color-poor design by picking an explicit color strategy (restrained/committed/full/drenched), choosing OKLCH values, tinting all neutrals, verifying contrast, and avoiding category reflexes.

## Autonomy boundaries
- Pick color strategy explicitly from PRODUCT.md cues + register
- Choose OKLCH values within strategy
- Tint all neutrals toward chosen hue (chroma 0.005-0.01)
- Verify contrast actual-measurement (not eyeball)
- Reject category-reflex palettes (dark-blue observability, navy-gold finance, etc.)
- Do NOT use `#000`/`#fff`
- Do NOT use gradient text
- Do NOT default to Restrained when brief calls for Committed/Drenched

## Acceptance criteria
1. Color strategy named explicitly before applying
2. OKLCH only; no hex pure black/white
3. All neutrals tinted toward chosen hue (chroma 0.005-0.01)
4. Contrast verified: 4.5:1 body, 3:1 large text/UI
5. Category reflex check passed (palette is NOT category default)
6. Absolute bans respected (no gradient text, no >1px side-stripe accents)
7. Brand register: distinctive choice with anchor reference
8. Product register: accent serves function (severity, state, brand mark)

## Optional checkpoints
- Confirm strategy if PRODUCT.md is ambiguous between two strategies
- Confirm hue family if brand voice cues conflict
- Otherwise: autonomous

## Inputs / outputs
- Input: target perceived as color-poor
- Output: diffed palette + strategy declaration + contrast verification

## Success metric
- 0 hex `#000` / `#fff` survive
- 100% neutrals tinted
- 0 category-reflex palettes shipped
- 0 contrast misses below threshold

## Failure mode handling
- PRODUCT.md has no brand voice cues → ask user (single question: brand voice words?)
- Contrast cannot meet threshold within chosen palette → adjust lightness, re-verify
- Brand identity locks color, but `colorize` could improve — explain identity-preservation default, ask user
- Strategy choice unclear → ask register (brand/product) + intent (campaign/identity/data-viz)
