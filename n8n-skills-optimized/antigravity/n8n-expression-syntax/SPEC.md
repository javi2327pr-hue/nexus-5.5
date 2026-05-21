<!-- v1 | agente: antigravity | 2026-05-21 -->

# n8n Expression Syntax — Antigravity spec

## Goal
Write a valid n8n `{{ }}` expression for any field, or diagnose+fix a broken one. Apply the 5 rules and the webhook `.body` invariant.

## Autonomy boundaries
- Choose between expression and Code-node approach autonomously based on complexity
- Add `?? default` fallbacks when path may be undefined
- Quote node names with spaces automatically
- Do NOT modify the surrounding node configuration (that's `n8n-node-configuration`)
- Do NOT write Code node bodies (that's `n8n-code-javascript` or `n8n-code-python`)

## Acceptance criteria
1. Expression is wrapped in `{{ }}` (exactly two braces both sides)
2. If data source is a webhook → access includes `.body` segment
3. If node name contains a space → name is quoted with double quotes inside `[]`
4. If path may be undefined → fallback with `??` or `?.` is present
5. Expression evaluates to the expected value type in the test panel
6. Expression is NOT used inside a Code node (those use `$input` directly)

## Optional checkpoints
- Ask user if intended path is ambiguous (e.g., webhook with deeply nested body)
- Otherwise: autonomous

## Inputs / outputs
- Input: data source description + target field
- Output: ONE valid expression OR a ranked list when multiple interpretations exist

## Success metric
% of expressions that pass node-level test on first try ≥ 95%.

## Failure mode handling
- Field shows literal text → confirm braces; if present, escalate (likely Code node context)
- `undefined` from webhook → add `.body`
- `cannot read property X of undefined` → add `?? default`
- Object stringified as `[object Object]` → wrap with `JSON.stringify(...)`

## Reference

### The 5 rules
1. Wrap with `{{ }}` (two braces)
2. Webhook data under `.body`
3. No `{{ }}` inside Code nodes
4. Quote node names with spaces: `$node["HTTP Request"]`
5. Case-sensitive names

### Core variables

| Variable | Use |
|---|---|
| `$json` | Current item |
| `$json.body` | Webhook payload |
| `$node["Name"]` | Specific node |
| `$now` | Luxon DateTime |
| `$env` | Env vars |
| `$workflow` | Workflow meta |
| `$execution` | Execution meta |
