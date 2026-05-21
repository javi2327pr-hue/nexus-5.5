<!-- v2 | agente: claude-code | 2026-05-21 -->
---
name: n8n-code-javascript
description: Write JavaScript for n8n Code nodes — correct return format, $input/$json/$node access, $helpers.httpRequest, DateTime, SplitInBatches loops, and the 5 errors causing 62% of Code-node failures. Trigger when a workflow needs custom JS logic. Use AFTER n8n-workflow-patterns picks a pattern that requires Code.
---

# n8n Code (JavaScript)

## Use this skill when

- Pattern requires custom transformation, aggregation, filtering, or HTTP call → use **Quick Start**
- Building a SplitInBatches loop → see **Batch loop pattern**
- Need HTTP call inside Code → use `$helpers.httpRequest` (see **Built-ins**)
- Hit a Code node error → check **Top 5 errors** first
- Webhook-triggered Code node → **always access `$json.body.<field>`**

## Quick Start (executable template)

```javascript
const items = $input.all();          // Get all input items

const processed = items.map(item => ({
  json: {
    ...item.json,
    processed: true,
    timestamp: new Date().toISOString()
  }
}));

return processed;                    // MUST be [{json: {...}}, ...]
```

## The 6 essential rules

1. **Return format** — array of `{json: {...}}` objects. Anything else fails.
2. **Data access** — `$input.all()`, `$input.first()`, or `$input.item` (in Each Item mode)
3. **No `{{ }}`** — Code nodes don't use n8n expressions; use plain JS
4. **Webhook data is under `.body`** — `$input.first().json.body.<field>`
5. **Use template literals**, not string concat — `` `Hello ${name}` ``
6. **Guard nullable input** — `const x = item.json.field ?? defaultValue;`

## Modes

| Mode | Access | When |
|---|---|---|
| Run Once for All Items | `$input.all()` | Default — aggregation, batch transforms |
| Run Once for Each Item | `$input.item` | Per-item with isolation |

## Top 5 errors (62%+ of Code failures)

| Symptom | Cause | Fix |
|---|---|---|
| `Cannot read property 'X' of undefined` | Webhook access without `.body` | `$input.first().json.body.X` |
| `Return must be array of items` | Returned object or plain value | Wrap: `return [{json: result}]` |
| `Items must have json property` | Returned `[result]` | `return [{json: result}]` |
| `Unexpected token` | Used `{{ $json.x }}` syntax in Code | Use `$input.first().json.x` |
| `pairedItem is missing` | Manual map that lost pairing | Pass `pairedItem: i` on each output (see SplitInBatches) |

## Built-ins

```javascript
// HTTP request (no external libs needed)
const res = await $helpers.httpRequest({
  method: 'POST',
  url: 'https://api.example.com',
  body: { foo: 'bar' },
  json: true,
});

// Dates with Luxon
const dt = DateTime.now().setZone('America/Argentina/Buenos_Aires');
const iso = dt.toISO();

// JMESPath query
const names = $jmespath(items, "[].json.user.name");
```

## Batch loop pattern (SplitInBatches)

```javascript
// Each iteration inside the loop body Code node:
const batch = $input.all();          // current batch only

// Process the batch...
const out = batch.map(item => ({
  json: { ...item.json, ok: true },
  pairedItem: { item: items.indexOf(item) },
}));

return out;
```

SplitInBatches loops the input until exhausted. Track iteration via `$node["SplitInBatches"].context["currentRunIndex"]` if you need cross-iteration state.

## Cross-iteration state (`$getWorkflowStaticData`)

```javascript
const staticData = $getWorkflowStaticData('node');
staticData.runCount = (staticData.runCount ?? 0) + 1;
return [{ json: { runCount: staticData.runCount } }];
```

Use for counters, accumulators, dedup keys across loop iterations.

## Routing

FROM here, GO TO:
- **n8n-validation-expert** — after writing Code, validate the workflow
- **n8n-node-configuration** — to confirm mode and Code node parameters
- **n8n-mcp-tools-expert** — to validate the Code node specifically

STAY here UNTIL: return format is `[{json: ...}]` AND null guards are in AND test panel returns expected shape.

## Anti-patterns

- ❌ `return result;` (must wrap in array of `{json}`)
- ❌ `$json.x` direct inside Code (use `$input.first().json.x`)
- ❌ `{{ $json.x }}` inside Code (n8n expressions don't work here)
- ❌ Importing npm packages (not supported — use `$helpers.httpRequest`)
- ❌ Mutating `$input` items directly (return new objects)

## Summary

6 rules, 1 return format `[{json}]`, 5 errors covering 62% of failures, 1 critical gotcha (`.body` for webhooks), 0 npm packages. Built-ins: `$helpers.httpRequest`, `DateTime` (Luxon), `$jmespath`. For full data-access patterns see `DATA_ACCESS.md`; for 10 production patterns see `COMMON_PATTERNS.md`.
