<!-- v3 | agente: antigravity | 2026-05-21 -->
# Teach (Antigravity)

## Goal
Run a multi-round discovery interview to write PRODUCT.md (required) + DESIGN.md (if code exists). Establish register, users, voice, anti-references, principles, a11y commitments. Cache results for downstream commands.

## Autonomy boundaries
- Run interview up to 6 rounds (no more)
- Push back once on generic answers ("modern", "elegant")
- Cache register decision (most consequential)
- Run `document` flow if code exists for DESIGN.md
- After completion, refresh context cache so downstream commands see new files
- Do NOT accept generic voice words without pushback
- Do NOT skip anti-references round (highest leverage)
- Do NOT proceed beyond 6 rounds

## Acceptance criteria
1. Register established (brand | product)
2. Users described with specifics (not "designers")
3. Brand voice: exactly 3 concrete physical-object words
4. Anti-references: ≥3 specific patterns/competitors
5. 3-5 design principles as commitments
6. PRODUCT.md written with all 6 sections
7. DESIGN.md written if code exists (via `document` flow)
8. Context refreshed; downstream command can read fresh state
9. Routing emitted on completion

## Optional checkpoints
- Confirm before overwriting existing PRODUCT.md (might have curated content)
- Confirm before running `document` if codebase is large (cost)
- Otherwise: autonomous

## Inputs / outputs
- Input: (no argument) — interview-driven
- Output: PRODUCT.md (+ DESIGN.md if applicable) + context cache refreshed

## Success metric
- 100% of teaches complete in ≤6 rounds
- 0 generic-only voice words accepted
- 0 PRODUCT.md missing critical sections
- 100% downstream commands have access to fresh context after teach

## Failure mode handling
- User abandons mid-interview → save partial PRODUCT.md with [TODO] markers, can resume later
- User insists on generic answers after pushback → accept with note in PRODUCT.md
- Codebase exists but document fails → write PRODUCT.md only, suggest document re-try
- Register ambiguous after Round 1 → continue interview with both lenses, decide in PRODUCT.md
