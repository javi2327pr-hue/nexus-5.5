<!-- v1 | agente: antigravity | 2026-05-21 -->

# n8n MCP Tools Expert — Antigravity spec

## Goal
Be the single dispatcher for every `mcp__n8n__*` tool call. Pick the right tool, format parameters correctly (especially nodeType), invoke, and route the result.

## Autonomy boundaries
- Pick tool, format params, and invoke without confirmation
- Decide validation profile (`runtime` is default; pick others only with clear reason)
- Use `patchNodeField` for one-field edits without asking
- Do NOT make destructive changes (delete workflow, drop credentials) without explicit user request
- Do NOT skip the `intent` parameter on partial updates

## Acceptance criteria
1. EVERY `mcp__n8n__*` call routed through this skill (zero direct calls from elsewhere)
2. `nodeType` format is correct for the context:
   - Discovery/inspection/validation: `nodes-base.<name>`
   - Workflow JSON payload: `n8n-nodes-base.<name>`
3. Default `detail: "standard"` is used unless deeper inspection has justification
4. Default `profile: "runtime"` is used unless other profile has justification
5. `intent: "<reason>"` is present on every `n8n_update_partial_workflow` call
6. Smart parameters used correctly: `branch="true"/"false"` for IF, `case=N` for Switch
7. After tool returns, result is routed:
   - Validation errors → `n8n-validation-expert`
   - Node schema → `n8n-node-configuration`
   - Template JSON → `n8n-workflow-patterns`

## Optional checkpoints
- Confirm with user before any destructive operation (delete, drop, replace)
- Confirm before activating a workflow in production
- Otherwise: autonomous

## Inputs / outputs
- Input: handoff from upstream skill (e.g., pattern + node intent) OR direct user request
- Output: tool call(s) + interpretation + handoff to next skill

## Success metric
- 0 `nodeType not found` errors caused by format mismatch
- 0 `intent required` errors
- ≥95% of tool calls succeed on first attempt

## Failure mode handling
- Tool returns "nodeType not found" → swap prefix between `nodes-base.*` and `n8n-nodes-base.*`, retry once
- Tool timeout → switch from full update to `n8n_update_partial_workflow`
- Auto-sanitization modified an IF/Switch → do not fight it; verify business logic is intact and continue
- Profile too noisy in dev → drop to `runtime` or `ai-friendly`

## Reference tables

| Intent | Tool |
|---|---|
| Discover | `search_nodes` |
| Inspect | `get_node` |
| Validate node | `validate_node` |
| Validate workflow | `n8n_validate_workflow` |
| Build | `n8n_create_workflow` |
| Edit | `n8n_update_partial_workflow` |
| Template | `n8n_search_templates` / `n8n_get_template` |
| Credentials | `n8n_manage_credentials` |
| Audit | `n8n_audit_instance` |
| AI guidance | `ai_agents_guide()` |
