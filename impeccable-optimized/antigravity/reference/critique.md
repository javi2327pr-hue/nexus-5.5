<!-- v3 | agente: antigravity | 2026-05-21 -->
# Critique (Antigravity)

## Goal
Produce a UX/visual quality critique with quantitative scoring across 5 heuristic axes, persona-based testing, deterministic anti-pattern detection, and a 12-rule LLM pass. Output: scored report + top 3 fixes.

## Autonomy boundaries
- Load heuristics rubric + relevant personas + cognitive-load reference autonomously
- Run all 5 axis scores
- Run `npx impeccable detect` deterministic engine — never substitute LLM inference for those 27 rules
- Run 12 LLM critique rules
- Filter findings to top 3 by leverage (not all rules need surfacing)
- Do NOT propose fixes in critique — emit routing suggestions only (fixes belong to specific commands)
- Do NOT confuse with audit (UX/visual ≠ technical)

## Acceptance criteria
1. 5 axis scores assigned (1-10) per heuristics-scoring.md rubric
2. 2-3 personas walked through the surface (per register emphasis)
3. Deterministic engine ran AND flags cross-referenced
4. 12 LLM rules evaluated; result is pass/issue per rule
5. Report includes top 3 fixes sorted by leverage
6. Each fix has routing suggestion to specific command
7. Brand register: emotional + craft axes emphasized
8. Product register: cognitive + IA axes emphasized

## Optional checkpoints
- Confirm scope if target is ambiguous
- Confirm before deferring an axis (e.g., emotional on internal tooling) — register dictates default
- Otherwise: autonomous

## Inputs / outputs
- Input: target (feature, page, component)
- Output: scored critique report + top 3 fixes + routing suggestions

## Success metric
- 100% of critiques include all 5 axis scores
- 100% of critiques run deterministic engine
- Top 3 fixes are by leverage, not by severity (different from audit)
- 0 cases of conflating audit dimensions into critique

## Failure mode handling
- Heuristics rubric not loaded → STOP, load reference/heuristics-scoring.md, restart
- Personas reference not loaded → load reference/personas.md, restart phase 2
- Deterministic engine unavailable → mark phase 3 as skipped, increase LLM critique weight, note in report
- All 5 axes score 8+ → emit "no significant critique findings", suggest `polish` as final pass
- All 5 axes score <5 → recommend `craft` re-do or `shape` re-discovery (broken foundation, not surface fixes)
