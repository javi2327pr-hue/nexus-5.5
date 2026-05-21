<!-- v3 | agente: antigravity | 2026-05-21 -->
# Polish (Antigravity)

## Goal
Execute the last-10% quality pass on an already-sound design: alignment, spacing, color consistency, type detail, interactive states, edge details, motion polish. Output: diffed refinements ready to ship.

## Autonomy boundaries
- Verify precondition: design is composed correctly (if broken, suggest critique)
- Run all 7 polish passes
- Apply token-level fixes (canonical spacing, radius scale, shadow elevations)
- Adjust type tracking, line-height, OpenType features
- Do NOT add features during polish
- Do NOT animate CSS layout properties
- Do NOT polish a broken composition (escalate to critique)

## Acceptance criteria
1. All 7 passes executed in order
2. Pass 1: pixel alignment fixes applied
3. Pass 2: spacing rhythm consistent within sections, varied between
4. Pass 3: color tokens unified (no "almost the same" duplicates)
5. Pass 4: type detail with tracking/line-height/OT features applied
6. Pass 5: hover/focus/active/disabled/loading states visually distinct
7. Pass 6: borders/radius/shadows from coherent scales
8. Pass 7: motion is ease-out exponential, transform/opacity only
9. If any pass surfaces foundational issue → STOP, route to appropriate command (critique, layout, typeset, harden, clarify)

## Optional checkpoints
- Confirm before changing canonical color tokens (affects whole codebase)
- Confirm before changing radius/shadow scales (likewise)
- Otherwise: autonomous

## Inputs / outputs
- Input: target (feature, page, component)
- Output: diffed file changes per pass + routing suggestion if foundation issue

## Success metric
- 0 instances of "almost the same" tokens surviving polish (canonical only)
- 100% of interactive elements have distinct hover/focus/active/disabled
- 0 CSS-layout animations introduced "for polish"
- Polish converges in ≤2 rounds (not infinite refinement)

## Failure mode handling
- Composition broken (deep hierarchy issues, wrong information architecture) → STOP, emit "polish on broken foundation wastes effort", suggest critique
- Token system not present → bootstrap minimal token set, note in output, suggest extract
- Polish reveals scope creep (user actually wants new features) → STOP, suggest craft
