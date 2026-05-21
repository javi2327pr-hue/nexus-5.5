<!-- v3 | agente: antigravity | 2026-05-21 -->
# Document (Antigravity)

## Goal
Generate DESIGN.md in Stitch format from existing project code by auto-extracting tokens from CSS variables, theme files, and computed styles, then asking user only for atmosphere descriptors.

## Autonomy boundaries
- Auto-extract from CSS variables, theme files, computed styles
- Cluster near-duplicate values to canonical
- Output Stitch-compatible format (cross-tool)
- Ask user ONLY for atmosphere/vibe sentence (machine handles values)
- Do NOT hand-write tokens (drift guaranteed)
- Do NOT include every value (cluster to canonical scale)
- Do NOT skip atmosphere description

## Acceptance criteria
1. CSS variables extracted and grouped by prefix
2. Theme files parsed (Tailwind, tokens.css, theme.ts)
3. Fallback to computed styles if no explicit tokens
4. Near-duplicates clustered (e.g., 13/14/15px → 14px)
5. Major component variants documented
6. DESIGN.md uses Stitch format (Google compatibility)
7. User-confirmed atmosphere description (vibe sentence) present
8. Colors in OKLCH where possible (hex/rgb acceptable for legacy)

## Optional checkpoints
- Confirm atmosphere description (always — only user input needed)
- Confirm before overwriting existing DESIGN.md
- Confirm cluster decisions when scales are intentionally varied (e.g., specific 14.5px usage)
- Otherwise: autonomous

## Inputs / outputs
- Input: codebase root
- Output: DESIGN.md in Stitch format + extraction report

## Success metric
- 100% of explicit tokens captured
- ≥90% of computed styles clustered to canonical scale
- 100% of DESIGN.md outputs include atmosphere description
- Stitch-format compatible (passes Stitch parser)

## Failure mode handling
- Codebase has 0 design tokens → run minimal extract on computed styles, suggest extract command
- Multiple competing theme systems (legacy + new) → ask user which is canonical
- Atmosphere description unclear from extracted palette → ask user via AskUserQuestion
- Stitch parser would reject our output (e.g., OKLCH strings) → document trade-off in DESIGN.md header comment, proceed
