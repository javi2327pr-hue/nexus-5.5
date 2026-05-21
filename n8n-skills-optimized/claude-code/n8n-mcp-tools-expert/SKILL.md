<!-- v2 | agente: claude-code | 2026-05-21 -->
---
name: n8n-mcp-tools-expert
description: Single entry point for every n8n-mcp tool call. Trigger when user mentions n8n nodes, workflows, templates, credentials, audits, or any n8n-mcp tool. Use BEFORE calling any mcp__n8n__ tool — wrong nodeType format or wrong tool causes 80% of failures.
---

# n8n MCP Tools Expert (gate skill)

This is the **dispatcher** for n8n-mcp. Every other n8n skill is downstream of this one.

## Use this skill when

- About to call any `mcp__n8n__*` tool → consult **Tool Selector**
- User asks "find/search/validate node" → see **Discovery**
- User asks to create/update workflow → see **Workflow Management**
- User asks for templates/credentials/audit → see **Specialized Tools**

## Tool Selector (which tool, when)

| Intent | Tool | Detail level |
|---|---|---|
| Find a node by name/feature | `search_nodes` (NOT `list_nodes`) | — |
| Inspect a node's config | `get_node` | `detail: "standard"` (default, 95% of cases) |
| Inspect rarely | `get_node` | `detail: "full"` (only for AI workflow type bug) |
| Validate single node config | `validate_node` | profile: `runtime` |
| Validate full workflow | `n8n_validate_workflow` | profile: `runtime` |
| Build new workflow | `n8n_create_workflow` | always validate after |
| Edit workflow | `n8n_update_partial_workflow` | with `intent` param |
| Find pre-built workflow | `n8n_get_template` / `n8n_search_templates` | 2700+ available |
| Manage data tables | `n8n_manage_datatable` | CRUD + filter |
| Manage credentials | `n8n_manage_credentials` | schema-aware |
| Security audit | `n8n_audit_instance` | built-in + deep scan |
| AI workflow guidance | `ai_agents_guide()` | always before AI build |

## nodeType format (the #1 cause of failures)

| Context | Format | Example |
|---|---|---|
| `search_nodes`, `validate_node`, `get_node` | `nodes-base.<name>` | `nodes-base.httpRequest` |
| Inside workflow JSON (create/update) | `n8n-nodes-base.<name>` | `n8n-nodes-base.httpRequest` |

**Rule**: discovery uses dot-shortened form, workflow payload uses fully-qualified form. Wrong format = silent mismatch.

## Validation profiles

- `minimal` — only critical errors, fastest
- `runtime` — recommended default, catches actual breakage
- `ai-friendly` — relaxed for in-progress AI generation
- `strict` — pre-production gate only (noisy during dev)

## Smart parameters (auto-converted by MCP)

- IF node: pass `branch="true"` or `branch="false"` (not raw connection index)
- Switch node: pass `case=0`, `case=1`, etc.
- Always include `intent: "<reason>"` in `n8n_update_partial_workflow` calls

## Auto-sanitization (runs on every update)

The server auto-fixes:
- Operator structure in IF/Filter/Switch nodes
- Missing `parameters: {}` shells
- Whitespace and trailing commas

**Do NOT manually patch operator structure** — let auto-sanitization handle it. Patch only business logic.

## Common workflow (build → ship)

```
1. search_nodes      → find nodes
2. get_node          → understand config (standard detail)
3. validate_node     → check each config
4. n8n_create_workflow → assemble
5. n8n_validate_workflow → verify full graph
6. n8n_update_partial_workflow (with intent) → iterate
7. activateWorkflow  → ship
```

Iteration is normal — avg 2-3 validate→fix cycles, 56s between edits.

## Troubleshooting MCP-level errors

| Symptom | Cause | Fix |
|---|---|---|
| `nodeType not found` | Wrong format prefix | Switch `nodes-base.*` ↔ `n8n-nodes-base.*` |
| `validation passes but workflow fails at runtime` | Used `minimal` profile | Re-run with `runtime` |
| `update_partial_workflow rejected` | Missing `intent` | Add `intent: "<short reason>"` |
| `auto-sanitization changed my IF` | You patched operator structure | Don't — see above |
| Tool timeout | Large workflow | Use `n8n_update_partial_workflow` not full update |

## Routing

FROM here, GO TO (after MCP call returns):
- **n8n-validation-expert** — if validation errors/warnings returned
- **n8n-node-configuration** — if you need to configure a discovered node
- **n8n-expression-syntax** — if mapping data via `{{}}` expressions
- **n8n-code-javascript** / **n8n-code-python** — if a Code node is needed
- **n8n-workflow-patterns** — if pattern was not pre-selected (loop back)

STAY here UNTIL: tool call returns and result is interpreted.

## Summary

- Always consult before any `mcp__n8n__*` call (gate skill)
- `get_node` + `detail: "standard"` covers 95% of discovery
- nodeType format differs between discovery and payload
- Profile `runtime` is the right default
- `intent` is mandatory for partial updates
- Auto-sanitization fixes operator structure — leave it alone
