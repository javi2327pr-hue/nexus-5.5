<!-- v1 | agente: antigravity | 2026-05-21 -->

# n8n Validation Expert — Antigravity spec

## Goal
Drive the validate → fix → validate loop until a workflow is clean. Triage errors and warnings, ignore false positives, route real issues to the right downstream skill, and recognize when to escape-hatch.

## Autonomy boundaries
- Pick validation profile autonomously (default `runtime`)
- Drop known false-positive warnings without confirmation
- Route errors to downstream skills without confirmation
- Apply escape hatches when stuck >3 cycles
- Do NOT ignore real errors to "ship faster"
- Do NOT use `strict` profile during development

## Acceptance criteria
1. Profile selection is justified (default: `runtime`)
2. False-positive warnings are filtered before triage
3. One error fixed per cycle, then re-validated
4. Loop terminates with EITHER: 0 errors AND all warnings triaged, OR escape hatch invoked at cycle 4+
5. Each error routed to correct skill:
   - required field missing → `n8n-node-configuration`
   - expression invalid → `n8n-expression-syntax`
   - nodeType not found → `n8n-mcp-tools-expert`
   - Code node error → `n8n-code-javascript` or `n8n-code-python`
   - operator structure on IF/Switch → ignore (auto-sanitization handles)

## Optional checkpoints
- After cycle 3, summarize progress to user before continuing
- Before invoking escape hatch (remove node, switch profile, audit instance), notify user
- Otherwise: autonomous

## Inputs / outputs
- Input: validation result JSON from `validate_node` or `n8n_validate_workflow`
- Output: cycle log + final status (VALIDATED or ESCALATED)

## Success metric
- Average cycles per workflow ≤ 3
- 0 false-positive fixes (don't fix things that don't need fixing)
- 100% of routed errors resolved by downstream skill

## Failure mode handling
- Stuck >3 cycles → escape hatch:
  1. Remove a node (minimal repro)
  2. Switch profile to `minimal`
  3. Re-discover nodes with `get_node`
  4. Search templates for working version
  5. Run `n8n_audit_instance` for instance-level issues
- All escape hatches exhausted → escalate to user with full diagnostic log

## Reference

### Profile selection

| Profile | Use when |
|---|---|
| `minimal` | Quick sanity check |
| `runtime` | **Default** |
| `ai-friendly` | LLM-generated workflows in iteration |
| `strict` | Pre-prod gate only |

### Known false-positive warnings (filter out)

- "Operator structure non-canonical" on IF/Filter/Switch (auto-sanitization)
- "Expression may be undefined" + fallback present
- "Credential not validated" during dev (no live test)
- "Deprecated method" with no replacement listed
