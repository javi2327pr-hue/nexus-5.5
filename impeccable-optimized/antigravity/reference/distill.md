<!-- v3 | agente: antigravity | 2026-05-21 -->
# Distill (Antigravity)

## Goal
Strip a design to its essence by removing decoration, duplication, cognitive overhead, and visual filler — while preserving function, identity, affordance, and accessibility. Output: diffed simplification + routing if reassessment needed.

## Autonomy boundaries
- Inventory all visual elements and tag job (navigation/content/action/feedback/decorative)
- Remove Tier 1 candidates (decoration, duplicate copy, redundant icons) without confirmation
- Remove Tier 2 candidates (filler illustrations, divider lines, secondary CTAs) with verification
- AskUserQuestion for Tier 3 candidates (whole sections, columns, hierarchy steps)
- Do NOT remove function (anything doing a user-task job)
- Do NOT remove brand signature motifs
- Do NOT collapse whitespace as part of distill (different operation, separate concern)
- Do NOT apply aggressive distill on brand register without checking distinctiveness intent

## Acceptance criteria
1. Every visible element tagged with job
2. Candidates for removal explicitly identified before removal
3. "If I removed this..." test applied to each candidate
4. Tier 1 removed freely; Tier 2 removed with verification; Tier 3 confirmed by user
5. Function, identity, affordance, accessibility preserved (verifiable post-distill)
6. Routing emitted if result needs bolder/typeset/layout follow-up

## Optional checkpoints
- Confirm Tier 2 removals when surface is high-stakes (marketing hero, primary user flow)
- Confirm before any Tier 3 removal (always)
- Confirm on brand register if distinctiveness reading as "complexity"
- Otherwise: autonomous

## Inputs / outputs
- Input: target (feature, page, component)
- Output: diffed file changes + reassessment routing suggestion

## Success metric
- 0 cases of removed function (verified via post-distill user-task walk-through)
- 0 cases of removed brand signature (verified vs PRODUCT.md)
- 100% of Tier 3 removals user-confirmed
- ≥50% reduction in decorative elements OR explicit "nothing more removable" verdict

## Failure mode handling
- Result feels skeletal/wireframe → STOP, suggest `bolder`
- Removed an element user actually used (post-distill regression) → revert that specific removal, log, continue
- Distill converges with nothing removed (already minimal) → emit "already distilled" + no-op, suggest critique for other angles
- Brand register and distinctiveness-as-feature conflict → ask user explicit override
