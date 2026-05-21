<!-- v2 | agente: claude-code | 2026-05-21 -->
---
name: n8n-validation-expert
description: Interpret validate_node and n8n_validate_workflow results, separate real errors from false positives, and drive the iterative fix loop. Trigger when validation returns errors/warnings or when planning the validate→fix cycle. Use AFTER n8n-mcp-tools-expert returns a validation result.
---

# n8n Validation Expert

## Use this skill when

- Validation returned errors → run **Error Triage**
- Validation returned only warnings → run **Warning Triage** (some are false positives)
- About to validate a fresh workflow → pick **Profile**
- In a fix→validate→fix loop and stuck → see **Escape Hatches**

## Profile selection

| Profile | Use when |
|---|---|
| `minimal` | Quick sanity check during exploration |
| `runtime` | **Default** — catches actual breakage |
| `ai-friendly` | LLM-generated workflows being iteratively improved |
| `strict` | Pre-production gate only (too noisy for dev) |

## Severity levels

| Level | Meaning | Action |
|---|---|---|
| **Error** | Blocks execution | MUST fix before activation |
| **Warning** | May indicate issue | Check against `FALSE_POSITIVES.md` |
| **Info** | Suggestion | Optional |

## Error Triage (decision tree)

```
Error returned
│
├── Mentions "required field missing"
│   → Go to n8n-node-configuration (operation-aware required fields)
│
├── Mentions "expression invalid"
│   → Go to n8n-expression-syntax (5 rules + error table)
│
├── Mentions "nodeType not found" or wrong type prefix
│   → Go to n8n-mcp-tools-expert (nodeType format section)
│
├── Mentions Code node error
│   → Go to n8n-code-javascript (top 5 errors) or n8n-code-python
│
├── Mentions operator structure on IF/Filter/Switch
│   → Save and re-validate — auto-sanitization fixes this
│
└── Other
    → See ERROR_CATALOG.md
```

## Warning Triage — false positives to ignore

| Warning | Why false positive | Action |
|---|---|---|
| "Operator structure non-canonical" on IF | Auto-sanitization rewrites on save | Ignore, save once |
| "Expression may be undefined" on optional path | n8n can't prove the field always exists | Ignore if you added fallback `?? default` |
| "Credential not validated" during dev | No live test connection ran | Test the credential separately |
| "Deprecated method" with no replacement listed | Often false flag | Cross-check release notes |

All other warnings — **address them**. See `FALSE_POSITIVES.md` for full list.

## Iterative loop (the standard rhythm)

```
validate → read top error → fix ONE thing → validate again
```

- Avg: 2-3 cycles, 23s reading + 58s fixing per cycle
- Do **not** try to fix everything at once — order matters because errors mask each other
- Always re-validate after each fix, even if you "knew" the fix was right

## Escape hatches (when stuck >3 cycles)

1. **Drop a node** — minimal repro by removing nodes until validation passes
2. **Switch profile to `minimal`** — see if the deeper errors are downstream noise
3. **Re-discover with `get_node`** — your local memory of the schema may be stale
4. **Look up a template** — `n8n_search_templates` for a working version of the same pattern
5. **Audit-mode** — run `n8n_audit_instance` to catch instance-level issues that masquerade as workflow errors

## Routing

FROM here, GO TO:
- **n8n-node-configuration** — for required-field / operation errors
- **n8n-expression-syntax** — for `{{ }}` errors
- **n8n-mcp-tools-expert** — for nodeType / tool-shaped errors
- **n8n-code-javascript** / **n8n-code-python** — for Code node failures

STAY here UNTIL: validation returns no errors AND all warnings are triaged.

## Summary

- Profile: `runtime` is the default
- Errors block, warnings are advisory (some are false positives)
- Loop: validate → ONE fix → validate
- 2-3 cycles is normal; >3 = escape hatch
- Auto-sanitization handles operator structure — don't manually patch IF/Switch
