<!-- v2 | agente: claude-code | 2026-05-21 -->
---
name: n8n-node-configuration
description: Configure n8n nodes operation-aware — which fields are required depends on the chosen operation. Trigger when setting node parameters, choosing between get_node detail levels, or deciding between patchNodeField and full update. Use AFTER n8n-mcp-tools-expert returns a node schema.
---

# n8n Node Configuration

## Use this skill when

- A node was just discovered via `get_node` and needs parameter setup → see **Per-op rules**
- Field disappears/reappears as you toggle a checkbox → see **displayOptions**
- Choosing between full update and surgical edit → see **patchNodeField vs full update**
- Configuring an AI Agent node → see **AI connection types**

## Configuration philosophy

**Progressive disclosure**: start minimal, add complexity as the operation demands.

- `get_node` with `detail: "standard"` (default) covers 95% of cases
- Reach for `detail: "full"` only when a specific property isn't visible in standard

## Per-op rules (operation-aware required fields)

Required fields depend on the **operation** chosen, not the node type. Always:

1. Set `operation` (or `resource` + `operation`) FIRST
2. Re-read which fields became required after that choice
3. Configure only those — leave others at defaults

Examples:
- **HTTP Request → POST**: `url`, `method=POST`, `sendBody=true`, `contentType=json`, `jsonBody`
- **HTTP Request → GET**: `url`, `method=GET` (no body fields)
- **Postgres → execute**: `query`, `credentials`
- **Postgres → insert**: `table`, `columns`, `credentials`
- **Slack → postMessage**: `channel`, `text`, `credentials`

When in doubt, the schema returned by `get_node` shows required fields conditionally.

## displayOptions (the "why is this field gone?" answer)

Fields use `displayOptions.show` / `displayOptions.hide` rules. A field is **invisible** if its visibility rule doesn't match the current operation/resource.

**Common chains**:
- `sendBody=true` → reveals `contentType` → reveals `jsonBody` or `bodyParameters`
- `authentication=predefinedCredentialType` → reveals `nodeCredentialType`
- `resource=user` → reveals user-specific operations on multi-resource nodes

If a parameter you set "disappears" from the saved payload — its displayOption rule wasn't satisfied. Fix the prerequisite field first.

## patchNodeField vs full update

| Situation | Use |
|---|---|
| Change ONE field in ONE node | `patchNodeField` (surgical) |
| Change multiple fields in one node | `n8n_update_partial_workflow` with single node op |
| Restructure connections or many nodes | `n8n_update_partial_workflow` with multiple ops |
| Rewrite entire node | full node replace in `n8n_update_partial_workflow` |

Always include `intent: "<short reason>"` on partial updates.

## AI Agent node — 8 connection types

When configuring an AI Agent, these connection slots exist:

| Slot | Purpose | Required? |
|---|---|---|
| Chat Model | LLM provider | ✅ |
| Memory | Conversation persistence | optional |
| Tool (any) | External capabilities | optional, repeatable |
| Output Parser | Structured output | optional |
| Vector Store | RAG retrieval | optional |
| Embeddings | For vector store | required if vector store used |
| Document Loader | RAG ingestion | optional |
| Text Splitter | RAG chunking | optional, with loader |

Always run `ai_agents_guide()` (MCP tool) before AI Agent configuration.

## Common configuration patterns

```
Webhook:   path + httpMethod + responseMode
HTTP POST: url + method + sendBody + contentType + jsonBody
HTTP GET:  url + method (+ optional queryParameters)
Schedule:  rule (interval or cron expression)
Code:      mode + jsCode/pythonCode (see code-* skills)
IF:        leftValue + rightValue + operator + branch (use smart param)
Set:       fields[] (one per output key)
DB query:  query + credentials + (optional) substitutions
```

## Routing

FROM here, GO TO:
- **n8n-validation-expert** — after configuration, validate
- **n8n-expression-syntax** — when a field accepts `{{ }}` and you need data from prior node
- **n8n-code-javascript** / **n8n-code-python** — for Code node bodies
- **n8n-mcp-tools-expert** — to issue the `patchNodeField` or `n8n_update_partial_workflow`

STAY here UNTIL: required fields for the chosen operation are set AND validation passes.

## Anti-patterns

- ❌ Configuring fields before picking an operation
- ❌ Fighting auto-sanitization on IF/Switch operator structure
- ❌ Hardcoded credentials in parameters (always reference credential ID)
- ❌ Full update for a one-field tweak (use `patchNodeField`)

## Summary

Operation decides required fields. Standard detail covers 95%. Use `patchNodeField` for surgical edits, `n8n_update_partial_workflow` (with `intent`) for everything else. AI Agent has 8 connection slots — consult `ai_agents_guide()` first.
