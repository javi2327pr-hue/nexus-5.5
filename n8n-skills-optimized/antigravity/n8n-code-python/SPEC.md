<!-- v1 | agente: antigravity | 2026-05-21 -->

# n8n Code (Python — Beta) — Antigravity spec

## Goal
Write Python for n8n Code nodes ONLY when JavaScript is not viable (user insists OR stdlib-only need). Use standard library, return correct shape, access webhook body via `["body"]`.

## Autonomy boundaries
- Verify Python is justified before writing (else hand off to `n8n-code-javascript`)
- Choose between "Run Once for All Items" vs "Each Item" mode autonomously
- Use stdlib freely: json, datetime, re, hashlib, base64, urllib, math, statistics, collections, etc.
- Do NOT import external libraries (requests, pandas, numpy, etc.) — not available
- Do NOT use `$input` (JS syntax); always use `_input` (Python prefix)

## Acceptance criteria
1. Python is justified — user explicitly chose Python OR task requires stdlib uniquely
2. Return value is a `list` of `{"json": {...}}` dicts
3. Data access uses `_input.all()`, `_input.first()`, or `_input.item`
4. Webhook payload accessed via `["body"]` (dict key, not attribute)
5. Dict access uses `.get("key", default)` to avoid `KeyError`
6. No external imports
7. Returned values are JSON-serializable (datetimes converted with `.isoformat()`)

## Optional checkpoints
- Notify user that JS would be simpler before writing (one-line note, not a block)
- Confirm before any non-trivial network call via urllib
- Otherwise: autonomous

## Inputs / outputs
- Input: transformation intent + data source description
- Output: ONE code block, paste-ready into Python Code node

## Success metric
- 0 `ModuleNotFoundError` (no external libs attempted)
- 0 `KeyError` (all dict access via `.get`)
- 0 "Return must be list of items" errors

## Failure mode handling
- Need requests/pandas/etc. → STOP, hand off to `n8n-code-javascript`
- Need OAuth dance → STOP, JS only
- Need datetime arithmetic chain → consider JS Luxon, otherwise use stdlib `datetime` + `timedelta`
- Got `TypeError ... not JSON serializable` → convert types (`.isoformat()`, `list(...)`)

## Reference

### Allowed stdlib
`json`, `datetime`, `re`, `hashlib`, `base64`, `urllib`, `math`, `statistics`, `collections`, `itertools`, `functools`, `csv`, `io`, `uuid`, `random`, `string`, `os`, `time`

### Top 5 errors (avoid all)

| Symptom | Fix |
|---|---|
| `KeyError: 'X'` | `.get("X", default)` |
| `ModuleNotFoundError: requests` | Use urllib OR switch to JS |
| "Return must be list of items" | `return [{"json": result}]` |
| AttributeError on `_input` | Use underscore prefix |
| TypeError not JSON serializable | Convert: `.isoformat()`, `list(set_)` |

### HTTP without requests

```python
from urllib import request
import json

req = request.Request(url, data=json.dumps(payload).encode(),
                      headers={"Content-Type": "application/json"}, method="POST")
with request.urlopen(req, timeout=30) as r:
    body = json.loads(r.read())
```
