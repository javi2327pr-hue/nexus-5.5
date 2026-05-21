<!-- v3 | agente: antigravity | 2026-05-21 -->
# Extract (Antigravity)

## Goal
Consolidate drift by extracting repeated values to tokens, repeated component shapes to shared components, and flagging inline styles for tokenization. Output: report (--report-only) OR applied changes (default).

## Autonomy boundaries
- Walk codebase autonomously
- Identify ≥3-use values as token candidates
- Identify ≥3-use shapes as component candidates
- Cluster near-duplicates to canonical scale
- Use --report-only on first pass for large codebases
- Apply changes only after user review (medium+ codebases)
- Do NOT extract one-off (used once) values
- Do NOT over-design variant APIs
- Do NOT skip --report-only on large codebases

## Acceptance criteria
1. All ≥3-use values identified and proposed as tokens
2. All ≥3-use component shapes identified and proposed
3. Near-duplicates clustered to canonical
4. Inline styles flagged for tokenization
5. tokens.css updated (or proposed) with new vars
6. DESIGN.md updated to reflect new tokens
7. Components placed in shared library with minimal variant API + docs
8. User reviewed report before changes applied (for medium+ codebases)

## Optional checkpoints
- Confirm before applying tokens that change widely-used existing values (might break visual regression)
- Confirm component naming + placement
- Confirm clustering decisions on ambiguous values
- Otherwise: autonomous

## Inputs / outputs
- Input: codebase root or scoped target
- Output: extract report OR applied changes + DESIGN.md update + tokens.css update

## Success metric
- ≥80% of ≥3-use repetitions consolidated
- 0 one-off extractions
- 0 over-engineered variant APIs (start minimal)
- Visual regression tests pass post-extract (if exist)

## Failure mode handling
- No existing tokens.css → bootstrap one
- Existing tokens conflict with new proposals → ask user (rename vs replace)
- Cluster decision ambiguous (e.g., 12 vs 14 as canonical) → ask user
- Visual regression test fails → STOP, roll back specific change, investigate
- Component proposal conflicts with existing component → ask user (merge vs separate)
