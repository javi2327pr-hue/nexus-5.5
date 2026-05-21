<!-- v3 | agente: antigravity | 2026-05-21 -->
# Codex visual direction flow (Antigravity special ref)

## Applicability
Loaded by `craft` Step 3 ONLY on Codex harness (native `image_gen`). Other harnesses get fallback message per `patches/03-asset-producer-cross-harness.md`.

## Goal
Execute Steps A-F (direction questions → palette → mocks → approval → mock-fidelity inventory → asset slicing) so the approved mock becomes the contract for the Step 4 build in craft.

## Autonomy boundaries
- Skip Step A only when brief is fully unambiguous on visual direction
- Generate 3 palette options autonomously
- Generate 2-3 mocks via `image_gen` per direction
- Run `impeccable_asset_producer` subagent for asset slicing
- STOP at every gate (2, 3, 4) for explicit user confirmation
- Do NOT compress gates 2-4 (documented dominant failure mode)
- Do NOT accept "I like elements of all" — demand single direction
- Do NOT treat mock as suggestion (it IS the contract)
- Do NOT invoke asset producer on non-Codex harness

## Acceptance criteria
1. Step A questions asked only on ambiguous topics (skip if brief sufficient)
2. Gate 2 confirmed before palette generation
3. 3 palette options generated, each OKLCH, category-reflex-aware, tinted neutrals
4. Gate 3 confirmed before mock generation
5. 2-3 mocks generated via `image_gen` with prompt informed by PRODUCT.md + palette + direction answers
6. Gate 4 confirmed before code (single direction chosen by user)
7. Mock-fidelity inventory catalogued (Step E)
8. Assets sliced via `impeccable_asset_producer` (Step F)
9. Return to craft.md Step 4 only after all 4 gates + inventory + assets

## Optional checkpoints
- Confirm direction question count (2-4) based on brief ambiguity
- Confirm palette diversity (3 options should span the strategy axis)
- Confirm mock variant count (2-3, more might overwhelm decision)
- Otherwise: autonomous within gate boundaries

## Inputs / outputs
- Input: confirmed shape brief (from craft Gate 1) + PRODUCT.md + register reference
- Output: approved mock + mock-fidelity inventory + sliced assets ready for build

## Success metric
- 100% gate confirmations explicit (none compressed)
- 0 "I like elements of all" acceptances
- 100% of mocks pass category reflex check
- 100% of assets sliced from approved mock (not generic stock)
- Approved mock = contract for build (verifiable in Step 4 output)

## Failure mode handling
- All 3 palettes feel similar to user → diversify across strategy axis (restrained/committed/full/drenched)
- User can't pick a single direction → ask "what's missing from each?" and regenerate with synthesis
- Asset producer returns blocking question → relay to user, don't assume answer
- Image_gen produces off-brand result → re-prompt with explicit anti-references from PRODUCT.md
- Gate 4 approved but mock doesn't include required imagery → STOP, ask user (re-mock OR source imagery externally)
