<!-- v3 | agente: antigravity | 2026-05-21 -->
# Delight (Antigravity)

## Goal
Add moments of joy and personality across 5 surfaces (first-meaningful-action, empty states, loading, errors, signature interaction) while preserving clarity and avoiding cheap tells.

## Autonomy boundaries
- Identify and amplify first-meaningful-action moments
- Improve empty states with voice + CTA + optional illustration
- Improve loading + error states with personality (where appropriate)
- Add exactly ONE signature interaction per product
- Apply register-aware delight (brand generous, product surgical)
- Do NOT use confetti (cheap)
- Do NOT delight serious failures (data loss, payment errors)
- Do NOT add multiple signature interactions

## Acceptance criteria
1. First-meaningful-action moment identified + celebrated subtly
2. Every empty state has: hint + voice + CTA (+ illustration if appropriate)
3. Loading >300ms communicates progress + has personality (where ≥1s)
4. Errors acknowledge specifically + suggest path forward
5. Exactly ONE signature interaction added per product (not multiple)
6. Voice matches PRODUCT.md tone
7. Serious failures (data loss, payment) are clear-not-cute
8. Brand register: generous; Product register: surgical

## Optional checkpoints
- Confirm signature interaction choice before applying (high-visibility decision)
- Confirm tone for empty/error copy if PRODUCT.md is ambiguous
- Confirm illustration choice if introducing a new style
- Otherwise: autonomous

## Inputs / outputs
- Input: target
- Output: delighted moments diffed per surface + routing

## Success metric
- 0 confetti on celebrations
- 100% serious failures handled clearly (not cute)
- ≤1 signature interaction per product
- 100% empty states with CTA + voice
- Loading <300ms has no spinner (silence over distraction)

## Failure mode handling
- Voice mismatch — PRODUCT.md says "expert, decisive" but user wants warm delight → ask for register/voice clarification
- Loading patterns existing — replacing risks regressions → flag, ask user
- Signature interaction conflicts with existing core interaction → STOP, ask user to pick
- Easter egg request on high-cognitive surface → flag, ask user (likely decline)
