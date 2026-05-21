<!-- v2 | agente: claude-code | 2026-05-21 -->
---
name: n8n-code-python
description: Write Python for n8n Code nodes (beta) with awareness of standard-library-only limitation. Trigger when user explicitly requests Python. Use AFTER n8n-workflow-patterns picks a pattern. WARNING — use n8n-code-javascript for 95% of cases unless user explicitly chose Python.
---

# n8n Code (Python — Beta)

## ⚠️ Use JavaScript first

Python in n8n Code nodes is **beta** and has hard limitations. Pick Python ONLY when:
- User explicitly requested Python
- Task needs Python stdlib (regex, hashlib, statistics)
- User is significantly more comfortable in Python

Otherwise → switch to `n8n-code-javascript` (full `$helpers.httpRequest`, Luxon, no library limits).

## Use this skill when

- Python explicitly requested → use **Quick Start**
- About to import a third-party library → **STOP** — see **Limitations**
- Hit a Python Code node error → see **Top 5 errors**
- Webhook-triggered Python Code → **always access `_input.first().json["body"][...]`**

## Quick Start (executable template)

```python
items = _input.all()

processed = [
    {
        "json": {
            **item["json"],
            "processed": True,
            "timestamp": __import__("datetime").datetime.utcnow().isoformat(),
        }
    }
    for item in items
]

return processed   # MUST be list of {"json": {...}}
```

## The 6 essential rules

1. **Return format** — `list` of `{"json": {...}}` dicts
2. **Underscore prefix** — `_input`, `_json`, `_node` (not `$input`)
3. **Standard library only** — no `requests`, `pandas`, `numpy`, etc.
4. **Webhook data under `["body"]`** — `_input.first().json["body"]["field"]`
5. **Safe dict access** — `.get("key", default)` to avoid `KeyError`
6. **No `{{ }}`** — Python Code doesn't use n8n expressions

## Modes

| Mode | Access | When |
|---|---|---|
| Run Once for All Items | `_input.all()` | Default — aggregation |
| Run Once for Each Item | `_input.item` | Per-item with isolation |

## ⛔ Limitations (the hard wall)

| You want | Available? | Workaround |
|---|---|---|
| `requests` | ❌ | Use `urllib.request` (stdlib) OR switch to JS `$helpers.httpRequest` |
| `pandas` | ❌ | Use list/dict comprehensions OR pre-process upstream |
| `numpy` | ❌ | Use `statistics` module for basic stats |
| `httpx` / `aiohttp` | ❌ | Same as `requests` |
| `pydantic` | ❌ | Hand-rolled dict validation |
| `python-dateutil` | ❌ | Use stdlib `datetime` |
| External pip install | ❌ | Switch to JS |

If you need any of the above → **switch the node to JavaScript**.

## Stdlib you CAN use

`json`, `datetime`, `re`, `hashlib`, `base64`, `urllib`, `math`, `statistics`, `collections`, `itertools`, `functools`, `csv`, `io`, `uuid`, `random`, `string`, `os` (env vars), `time`

## Top 5 errors

| Symptom | Cause | Fix |
|---|---|---|
| `KeyError: 'X'` | Direct dict access on missing key | Use `.get("X", default)` |
| `ModuleNotFoundError: requests` | Tried to import external lib | Use `urllib.request` or switch to JS |
| `Return must be list of items` | Returned dict or value | `return [{"json": result}]` |
| `AttributeError on _input` | Wrong syntax `$input` | Use `_input` (underscore) |
| `TypeError: ... is not JSON serializable` | Returned datetime/set/etc. | Convert: `.isoformat()`, `list(set_)` |

## HTTP without requests (urllib stdlib)

```python
from urllib import request, parse
import json

data = json.dumps({"foo": "bar"}).encode()
req = request.Request(
    "https://api.example.com",
    data=data,
    headers={"Content-Type": "application/json"},
    method="POST",
)
with request.urlopen(req, timeout=30) as r:
    body = json.loads(r.read())

return [{"json": body}]
```

This works but `$helpers.httpRequest` (JS) is simpler. Consider switching.

## Routing

FROM here, GO TO:
- **n8n-code-javascript** — if hitting library limitations (most common reason)
- **n8n-validation-expert** — after writing Python, validate
- **n8n-node-configuration** — confirm Python mode is selected on the Code node

STAY here UNTIL: return format is `list[{"json": ...}]` AND no external imports AND test panel returns expected shape.

## Anti-patterns

- ❌ `import requests` — not available
- ❌ `_input.first().json.field` — use `_input.first().json["field"]` (dict, not attr)
- ❌ `return result` — must be `[{"json": result}]`
- ❌ `$input` — use `_input`
- ❌ `{{ _json.x }}` — Python Code doesn't use expressions

## Summary

JS-first (95%). Use Python only when user insists or stdlib-only task. No external libs. `_input` prefix. Return `list[{"json": ...}]`. Webhook → `_input.first().json["body"]`. For workarounds see `DATA_ACCESS.md`, `COMMON_PATTERNS.md`, `STANDARD_LIBRARY.md`.
