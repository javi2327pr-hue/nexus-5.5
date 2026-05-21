<!-- v3 | agente: antigravity | 2026-05-21 -->
# Clarify (Antigravity)

## Goal
Improve every UX copy string against 7 copy laws (earned place, no em dashes, voice not narration, specific not generic, action verbs, plain not technical, honest not salesy). Output: rewritten strings across the target.

## Autonomy boundaries
- Scan all visible strings (buttons, labels, errors, empty, tooltips, loading, confirmations, success)
- Apply rewrite patterns from catalog without confirmation
- Eliminate em dashes (`—` and `--`) on sight
- Eliminate "We"/"Let's" narration
- Brand register: distinctive phrasings allowed; Product: clarity over voice
- Do NOT add marketing copy to functional UX surfaces
- Do NOT over-help with tips
- Do NOT apologize for user's own actions

## Acceptance criteria
1. Every visible string scanned
2. 0 em dashes remain
3. 0 generic errors ("An error occurred", "Something went wrong")
4. 0 generic buttons ("Submit", "OK") — verb-specific
5. 0 restated headings in body intros
6. Labels concise (e.g., "Email", not "Email address")
7. Form help is specific constraint OR absent (not vague guidance)
8. Loading copy has progress OR is absent
9. Confirmation copy names consequence ("This can't be undone")

## Optional checkpoints
- Confirm voice when PRODUCT.md is ambiguous (warm vs neutral)
- Confirm tone for serious failures (data loss, payment) — never cute
- Otherwise: autonomous

## Inputs / outputs
- Input: target (file, feature, component)
- Output: diffed string changes + scan report (categories changed)

## Success metric
- 0 em dashes in shipped copy
- 100% buttons have verb-specific labels
- 0 generic errors
- 8th-grade reading level (or precise-when-audience-warrants)

## Failure mode handling
- i18n in place — copy changes require translation key updates → flag, suggest harden re-run for i18n
- Voice mismatch — user wants warm, PRODUCT.md says expert/decisive → ask user explicit override
- Cannot eliminate generic without losing information → keep generic but add specific detail
- String is from external API (not editable in target) → flag, suggest contacting API owner
