<!-- v1 | agente: antigravity | 2026-05-21 -->

# n8n Code (JavaScript) — Antigravity spec

## Goal
Write JavaScript for n8n Code nodes that returns the correct shape and handles webhook data, batches, dates, HTTP calls, and cross-iteration state using built-ins only.

## Autonomy boundaries
- Choose between "Run Once for All Items" vs "Run Once for Each Item" mode autonomously
- Add null-guard fallbacks without confirmation
- Use `$helpers.httpRequest`, `DateTime` (Luxon), `$jmespath`, `$getWorkflowStaticData` freely
- Do NOT import any npm package (none available)
- Do NOT use n8n `{{ }}` expression syntax inside Code

## Acceptance criteria
1. Return value is an array of `{json: {...}}` objects — non-negotiable
2. Data access uses `$input.all()`, `$input.first()`, or `$input.item` (no raw `$json` first-class)
3. Webhook payload accessed via `.body` segment
4. Template literals used for string composition (no `+` concat)
5. Null/undefined paths guarded with `?.` and `??`
6. No npm imports
7. If using SplitInBatches loop body → `pairedItem` is preserved
8. If using cross-iteration state → uses `$getWorkflowStaticData('node')`

## Optional checkpoints
- Confirm with user before using `$getWorkflowStaticData` (persistent state)
- Confirm before making HTTP calls to non-`https://` URLs
- Otherwise: autonomous

## Inputs / outputs
- Input: transformation/computation intent + data source description
- Output: ONE code block, paste-ready into n8n Code node

## Success metric
- 0 "Return must be array of items" errors
- 0 npm import attempts
- 0 webhook `.body` omissions
- Top 5 error patterns avoided (62%+ failure prevention)

## Failure mode handling
- Need a package not in built-ins → STOP, redesign with `$helpers.httpRequest` or stdlib JS
- Need to iterate without losing pairing → use `pairedItem: { item: i }` on each output
- Need cross-iteration counter → `$getWorkflowStaticData('node')` with default `??`

## Reference built-ins

```javascript
// HTTP (no external libs)
const res = await $helpers.httpRequest({ method, url, body, json: true });

// Date (Luxon)
const dt = DateTime.now().setZone("America/Argentina/Buenos_Aires");

// JMESPath
const names = $jmespath(items, "[].json.user.name");

// Persistent state
const sd = $getWorkflowStaticData("node");
```

## Top 5 errors (avoid all)

| Symptom | Fix |
|---|---|
| Cannot read property X of undefined | Add `.body` for webhook |
| Return must be array of items | Wrap `[{json: ...}]` |
| Items must have json property | `[{json: result}]` not `[result]` |
| Unexpected token | Remove `{{ }}` syntax |
| pairedItem missing | Add `pairedItem: { item: i }` |
