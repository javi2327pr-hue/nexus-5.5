<!-- v3 | agente: antigravity | 2026-05-21 -->
# Layout (Antigravity)

## Goal
Fix layout, spacing, and visual rhythm through 6 moves (spacing rhythm, hierarchy density, card discipline, container restraint, grid asymmetry, breakpoint behavior). Output: composition that varies by section purpose, reflows properly, avoids nested/identical-card cliché.

## Autonomy boundaries
- Apply 6 moves in order
- Use spacing scale (4/8/12/16/24/32/48/64/96); no orphan values
- Collapse nested cards
- Break identical card grids (vary sizes OR editorial layout)
- Add exactly ONE asymmetric moment per section
- Reflow breakpoints; don't shrink
- Do NOT introduce nested cards
- Do NOT introduce identical card grids
- Do NOT use same padding everywhere

## Acceptance criteria
1. Spacing rhythm varies by section purpose (hero/content/list)
2. All spacing values from canonical scale (no orphan 17px etc.)
3. 0 nested cards in output
4. 0 identical card grids (≥6 items same shape)
5. Containers only where they earn it
6. ≤1 asymmetric moment per section
7. Breakpoints reflow (not just shrink); touch targets ≥44×44 at coarse
8. Brand: editorial composition; Product: predictable grids with priority asymmetry

## Optional checkpoints
- Confirm before collapsing significant container structure (might be load-bearing)
- Confirm asymmetric moment placement on high-stakes hero
- Otherwise: autonomous

## Inputs / outputs
- Input: target
- Output: diffed layout + spacing scale audit + breakpoint verification

## Success metric
- 100% spacing values from canonical scale
- 0 nested cards remaining
- 0 identical card grids ≥6 items remaining
- 100% breakpoints reflow (not shrink)

## Failure mode handling
- Composition fundamentally broken (not just spacing) → STOP, suggest critique
- Spacing scale not defined in DESIGN.md → bootstrap canonical scale, note for design system
- Card grid is intentional pattern (e.g., catalogue) → flag, ask user explicit override
- Mobile reflow requires content reordering decisions → ask user for priority order
