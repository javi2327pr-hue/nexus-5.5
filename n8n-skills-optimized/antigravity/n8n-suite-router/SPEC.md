<!-- v1 | agente: antigravity | 2026-05-21 -->

# n8n Suite Router — Antigravity spec

## Goal
Given any n8n-related user input, autonomously decide which skill(s) of the n8n suite to consult and emit a routing decision. Do not solve the user's task — route it.

## Autonomy boundaries
- Decide single-skill vs multi-skill routes without confirmation
- Do not call any `mcp__n8n__*` tool directly
- Do not invent skills outside the suite (n8n-workflow-patterns, n8n-mcp-tools-expert, n8n-node-configuration, n8n-code-javascript, n8n-code-python, n8n-expression-syntax, n8n-validation-expert)
- Hand off the moment a target skill is identified

## Acceptance criteria
1. Output identifies ≥1 skill name from the canonical list
2. For composite intents (build+validate, debug+fix, migrate), the route is a SEQUENCE of skills, ordered correctly per the suite's routing graph
3. Output is parseable by downstream skills (markdown code block with `ROUTE:` / `WHY:` / `THEN:` keys)
4. Latency: routing decision in <5s, no investigation work
5. Zero false routes — if intent is unparseable, default to `n8n-workflow-patterns` (most common)

## Optional checkpoints
- None. This skill is pure routing — autonomy is total.

## Inputs / outputs
- Input: user message (natural language)
- Output: routing decision in `ROUTE/WHY/THEN` format

## Success metric
% of user n8n queries that hit the correct downstream skill on first hop ≥ 95%.

## Failure mode handling
- Ambiguous intent → emit multi-route with `n8n-workflow-patterns` first
- Out-of-scope (not n8n) → emit `ROUTE: out-of-scope` and stop
- Conflicting signals → emit ranked list, top option first
