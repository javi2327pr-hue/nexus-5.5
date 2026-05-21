<!-- v1 | agente: antigravity | 2026-05-21 -->

# n8n Node Configuration — Antigravity spec

## Goal
Configure n8n nodes operation-aware. Set operation first, then required fields determined by displayOptions. Pick surgical edits (`patchNodeField`) over full updates when changing one field.

## Autonomy boundaries
- Set operation and configure required fields without confirmation
- Choose between `patchNodeField` and `n8n_update_partial_workflow` autonomously
- Reference credentials by ID (never hardcode)
- Do NOT fight auto-sanitization on IF/Switch operator structure
- Do NOT modify connections (that requires explicit graph-level operation)

## Acceptance criteria
1. Operation is set BEFORE any other field
2. All `required: true` fields under chosen operation are configured
3. displayOptions dependencies are satisfied (e.g., `sendBody=true` before `jsonBody`)
4. Credentials are referenced by ID, not by literal value
5. Edit strategy is correct:
   - One field, one node → `patchNodeField`
   - Multiple fields → `n8n_update_partial_workflow` with `intent`
6. For AI Agent nodes: 8 connection slots considered, `ai_agents_guide()` consulted

## Optional checkpoints
- Confirm when changing operation on an already-configured node (may reset other fields)
- Confirm when removing a required connection
- Otherwise: autonomous

## Inputs / outputs
- Input: node schema from `get_node` + user's configuration intent
- Output: node JSON or `patchNodeField` call, ready for execution by `n8n-mcp-tools-expert`

## Success metric
- 0 "required field missing" errors after configuration
- 0 displayOptions violations
- 100% credentials referenced by ID

## Failure mode handling
- Field "disappears" after setting → check displayOptions prerequisite, fix it first
- Required field unclear → re-run `get_node` with `detail: "full"` and ask user if still unclear
- Custom community node not in canonical table → trust the schema, do not assume nodes-base shape

## Reference per-op table

| Node | Operation | Required fields |
|---|---|---|
| HTTP Request | POST | url, method, sendBody=true, contentType=json, jsonBody |
| HTTP Request | GET | url, method |
| Webhook | — | path, httpMethod, responseMode |
| Schedule | — | rule |
| Postgres | execute | query, credentials |
| Postgres | insert | table, columns, credentials |
| Slack | postMessage | channel, text, credentials |
| Set | — | fields[] |
| IF | — | leftValue, rightValue, operator (branch="true"/"false") |
| Code | — | mode, jsCode OR pythonCode |

### AI Agent connection slots

| Slot | Required? |
|---|---|
| Chat Model | YES |
| Memory | optional |
| Tool | optional, repeatable |
| Output Parser | optional |
| Vector Store | optional |
| Embeddings | YES if Vector Store |
| Document Loader | optional |
| Text Splitter | optional, with loader |
