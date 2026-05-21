<!-- v1 | agente: antigravity | 2026-05-21 -->

# n8n Workflow Patterns — Antigravity spec

## Goal
Given a user's automation goal, autonomously select the right n8n architectural pattern, name the trigger/core/closing/error nodes, and hand off to node discovery. Do not build the workflow.

## Autonomy boundaries
- Decide pattern selection without confirmation
- Decide hybrid combinations when ≥2 patterns apply
- Apply batch modifier when goal implies >100 items, bulk processing, or rate-limited APIs
- Do not search nodes (that is `n8n-mcp-tools-expert`'s job)
- Do not configure nodes (that is `n8n-node-configuration`'s job)

## Acceptance criteria
1. Output names exactly ONE primary pattern from: Webhook Processing, HTTP API Integration, Database Operations, AI Agent Workflow, Scheduled Tasks
2. Batch modifier flag is set correctly (true/false)
3. If hybrid: secondary pattern is named explicitly
4. Trigger node, core nodes, closing nodes, AND error path are all named (4-of-4)
5. Pre-build checklist is satisfied before handoff:
   - PATTERN identified
   - TRIGGER_NODE named
   - ERROR_PATH defined
   - CLOSING_NODES named
   - BATCH placement decided (if applicable)
6. Handoff target: `n8n-mcp-tools-expert`

## Optional checkpoints
- Ask user ONE question if trigger type is genuinely ambiguous (e.g., "Is this scheduled or event-driven?")
- Otherwise: autonomous

## Inputs / outputs
- Input: user's automation goal in natural language
- Output: "pattern card" with all 6 acceptance fields filled, plus handoff instruction

## Success metric
% of patterns that result in zero re-architecture during validation phase ≥ 90%.

## Failure mode handling
- Trigger genuinely ambiguous → ask one disambiguating question (NOT a checklist)
- Goal doesn't match any pattern → emit `PATTERN: custom` with reasoning and escalate to user
- Goal implies infrastructure outside n8n (Kafka, etc.) → flag as out-of-scope for n8n native

## Reference patterns

| Pattern | Canonical shape |
|---|---|
| Webhook Processing | Webhook → Validate → Transform → Respond/Notify |
| HTTP API Integration | Trigger → HTTP Request → Transform → Action → Error Handler |
| Database Operations | Schedule → Query → Transform → Write → Verify |
| AI Agent Workflow | Trigger → AI Agent (Model+Tools+Memory) → Output |
| Scheduled Tasks | Cron → Task chain → Notify |
| Batch (modifier) | wraps any pattern with SplitInBatches |
