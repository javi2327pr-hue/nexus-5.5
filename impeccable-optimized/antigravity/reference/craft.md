<!-- v3 | agente: antigravity | 2026-05-21 -->
# Craft Flow (Antigravity)

## Goal
Build a feature with impeccable UX and UI quality: shape → visual direction → production code → in-browser iteration. Output is production-grade code that matches an approved visual direction, not generic scaffolding.

## Autonomy boundaries
- Inspect project foundation autonomously (framework, design system, icon set detection)
- Execute shape phase autonomously, but STOP at Gate 1 for user confirmation
- Codex harness: execute visual direction Steps A-F per codex.md, stopping at Gates 2, 3, 4 for confirmation
- Non-Codex harness: emit asset-producer-fallback message, await user decision (provide imagery / skip / abort)
- Build production code only AFTER Gate 4 confirmed via checkpoint.mjs
- Visual iteration autonomously until major ingredients of approved direction are present
- AskUserQuestion when framework choice on greenfield directory
- Do NOT compress gates 2-4 after Gate 1 confirmation (documented dominant failure mode)
- Do NOT start a parallel build in a directory with an existing framework
- Do NOT replace required imagery with CSS scenery / fake metrics / filler copy

## Acceptance criteria
1. Step 0 inspection completed before Step 1
2. Framework choice made explicitly (existing OR user-confirmed for greenfield)
3. Gate 1 (shape brief) confirmed via checkpoint.mjs
4. Required references loaded (spatial-design, typography always; others per brief)
5. On Codex: Gates 2-4 confirmed via checkpoint.mjs in sequence
6. On non-Codex: explicit user decision on imagery before any code
7. Build respects detected framework, design system, icon set, image-led intent
8. Live result contains major ingredients of approved direction (composition, hierarchy, density, atmosphere, signature motifs)
9. Routing suggestion emitted at end (polish/harden/live)

## Optional checkpoints
- Confirm framework choice on greenfield (always)
- Confirm before scaffolding a parallel framework if one already exists (always — but answer is usually "don't")
- Confirm if user-provided imagery vs CSS scenery is ambiguous
- Otherwise: autonomous within gate boundaries

## Inputs / outputs
- Input: feature description as argument
- Output: production code + visual artifacts + screenshots + routing suggestion

## Success metric
- Output passes the AI slop test (1st + 2nd-order)
- 0 gate compressions (4/4 gates explicitly confirmed before any code on Codex)
- Live result contains ≥80% of approved direction's major ingredients
- 0 parallel-framework introductions in existing-framework directories
- Image-led briefs: 0 instances of CSS-scenery replacement of required imagery

## Failure mode handling
- Greenfield + no framework hint in brief → AskUserQuestion (Astro default for brand, project existing for product)
- PRODUCT.md missing → fail to SKILL.md root, run teach, resume
- User confirmed Gate 1 but won't confirm Gate 2 (e.g., palette ambiguous) → continue iterating Step 3.A until resolved
- Codex asset producer returns blocking question → relay to user, do not assume answer
- Visual iteration not converging after 3+ rounds → STOP, suggest /impeccable shape to re-do brief
- Framework detected but version too old for chosen pattern → AskUserQuestion (upgrade vs adapt)

## Reference flow shape
- 4 mandatory user gates pre-code (Codex) or 1 mandatory + asset-provisioning decision (non-Codex)
- Visual direction is the contract for the build, not a suggestion
- Sliced raster assets via impeccable_asset_producer (Codex) or user-provided (other harnesses)
- After build: handoff to polish/harden/live per routing matrix
