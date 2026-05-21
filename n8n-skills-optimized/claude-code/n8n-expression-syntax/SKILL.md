<!-- v2 | agente: claude-code | 2026-05-21 -->
---
name: n8n-expression-syntax
description: Write valid n8n expressions and fix the 5 most common errors. Trigger when configuring node fields that reference previous-node data, mapping webhook fields, using $json/$node/$now, or seeing expression errors. Use AFTER n8n-mcp-tools-expert dispatches here.
---

# n8n Expression Syntax

## Use this skill when

- Configuring any node field with data from a previous node → use `{{ }}` rules below
- Mapping webhook data → **always** `$json.body.<field>` (most common gotcha)
- Referencing another node → `$node["Node Name"].json.<field>`
- Inside a Code node → **do NOT use `{{ }}`** — use plain JS/Python syntax
- Seeing `[ERROR]` in a field → consult **Error→Fix** table

## The 5 essential rules

1. **Wrap with `{{ }}`** — single braces or no braces = literal text
2. **Webhook data is under `.body`** — `$json.body.name`, not `$json.name`
3. **No `{{ }}` inside Code nodes** — use `$input.first().json.<field>` (JS) / `_input.first().json["<field>"]` (Py)
4. **Quote node names with spaces** — `$node["HTTP Request"]`, not `$node.HTTP Request`
5. **Node names are case-sensitive** — `$node["Slack"]` ≠ `$node["slack"]`

## Core variables

| Variable | Purpose | Example |
|---|---|---|
| `$json` | Current item data | `{{ $json.email }}` |
| `$json.body` | Webhook payload | `{{ $json.body.name }}` |
| `$node["Name"]` | Specific node output | `{{ $node["HTTP Request"].json.id }}` |
| `$now` | Current DateTime | `{{ $now.toISO() }}` |
| `$env` | Env vars | `{{ $env.SLACK_TOKEN }}` |
| `$workflow` | Workflow metadata | `{{ $workflow.id }}` |
| `$execution` | Execution metadata | `{{ $execution.id }}` |
| `$input` | Input items (limited contexts) | `{{ $input.first().json.x }}` |

## Error → Fix table

| Symptom | Cause | Fix |
|---|---|---|
| Field shows literal `{{$json.x}}` text | Missing braces or single braces | Use exactly two: `{{ $json.x }}` |
| `undefined` from webhook | Forgot `.body` | `$json.body.x` |
| `Error: cannot read property of undefined` | Path doesn't exist on this item | Add fallback: `{{ $json.body?.x ?? "default" }}` |
| `[ERROR] Node 'X' not found` | Typo or wrong case | Check exact node name in canvas |
| `{{$node.HTTP Request}}` invalid | Unquoted name with space | `{{ $node["HTTP Request"] }}` |
| `{{ }}` showing literally in Code node | Code nodes don't use expressions | Use `$input.first().json.x` direct |
| Object becomes `[object Object]` | Stringified an object in template | Use `JSON.stringify($json.x)` |

## Common patterns

```
✅ Pass body field:           {{ $json.body.email }}
✅ Reference earlier node:    {{ $node["Validate"].json.userId }}
✅ Conditional fallback:      {{ $json.name ?? "Guest" }}
✅ Date format:               {{ $now.toFormat("yyyy-MM-dd") }}
✅ JSON stringify object:     {{ JSON.stringify($json.user) }}
✅ Env-based URL:             https://api.{{ $env.REGION }}.example.com
❌ $json.email (no braces)
❌ {{$json.body}} inside Code node body
❌ {{$node.My Node}} (unquoted)
```

## Expression vs Code: when to use which

| Need | Use expression | Use Code node |
|---|---|---|
| Pick a field | ✅ | — |
| Format a string | ✅ | — |
| Simple conditional (`??`, ternary) | ✅ | — |
| Loop / iterate | ❌ | ✅ |
| Multiple steps | ❌ | ✅ |
| API call | ❌ | ✅ (`$helpers.httpRequest`) |
| Date math | ✅ for trivial, Code for chains | depends |

## Routing

FROM here, GO TO:
- **n8n-code-javascript** — when transformation needs loops/branching
- **n8n-validation-expert** — if expression appears valid but workflow still errors
- **n8n-node-configuration** — to confirm which fields accept expressions

STAY here UNTIL: the expression evaluates to the expected value in the node test panel.

## Summary

5 rules, 8 error patterns, 1 critical gotcha (`$json.body` for webhooks), 1 environment exception (no `{{ }}` in Code nodes). For full mistake catalog see `COMMON_MISTAKES.md`; for real-world examples see `EXAMPLES.md`.
