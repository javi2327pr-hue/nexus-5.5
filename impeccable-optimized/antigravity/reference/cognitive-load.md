<!-- v3 | agente: antigravity | 2026-05-21 -->
# Cognitive load (Antigravity special ref)

## Applicability
Consulted by: critique, audit, product register (always), ad-hoc by other commands.

## Constraints — 8 cognitive load levers
1. Choice architecture: ONE primary action per surface; progressive disclosure; sensible defaults
2. Recognition over recall (show, don't require memory)
3. Chunking 5-9 items, grouped visually
4. Visual hierarchy matches semantic hierarchy
5. Cognitive consistency (same in same place across surfaces)
6. Feedback latency tiers (<100ms instant, <1s responsive, 1-3s skeleton, 3s+ progress+cancel)
7. Error prevention (constrain inputs, prefer undo over confirmation)
8. Memory aids (breadcrumbs, persistent state, recently used)

## Three load types
- **Intrinsic** (task difficulty) → minimize via UX
- **Extraneous** (noise) → eliminate aggressively
- **Germane** (mental model) → support, don't waste

## Acceptance criteria for output reviewed for cognitive load
1. Primary action identifiable in <3s glance
2. Choice architecture justified (default chosen, progressive disclosure where needed)
3. Critical info recognizable (not recall-dependent)
4. Visual chunks ≤9 items, grouped meaningfully
5. Hierarchy: visual = semantic
6. Consistency check passes vs other surfaces in product
7. Feedback latency matches duration tiers
8. Error prevention via constraints (not via warnings)
9. Memory aids present for multi-step or long-running flows

## Register
- **Product**: aggressive reduction; every decision has cost
- **Brand**: engagement is goal but noise still hurts (reduce extraneous)

## Measurement
- Time-on-task, error rate, recovery time, first-action delay, drop-off
- Use real metrics, not critic opinions

## Failure modes
- User insists on showing all options upfront → suggest progressive disclosure, ask explicit override
- Pattern inconsistency across surfaces → flag, suggest extract command to consolidate
- Cannot reduce intrinsic load (task is inherently complex) → focus on extraneous, document remaining as expected
- Stakeholder insists on confirmation modals everywhere → suggest undo pattern as alternative
