<!-- v1 | agente: claude-code | 2026-05-21 -->
---
name: n8n-observability-monitor
description: Watch activated n8n workflows for failures, attempt auto-fix from a catalog, escalate only the unfixable. Trigger automatically after activateWorkflow. Integrates with watchdog-autonomous (existing) — this skill is the n8n-specific policy layer; watchdog handles the polling loop.
---

# n8n Observability Monitor

This skill is the **n8n-specific policy layer** for post-ship monitoring. It does NOT poll — that's `watchdog-autonomous`'s job (existing infrastructure). This skill defines: what to watch, what to auto-fix, what to escalate.

## Use this skill when

- A workflow was just activated → register it for monitoring
- `watchdog-autonomous` reports a failed execution → triage + auto-fix
- User asks "is workflow X healthy?" → emit SLO report
- User asks to stop monitoring → unregister

## Phase 1 — Registration (on activation)

When a workflow is activated, register the following with `watchdog-autonomous`:

```yaml
workflow_id: <id>
poll_interval: 60s    # or webhook subscription if available
slos:
  success_rate: ">=99%"
  p99_latency_ms: "<=5000"
  failures_per_hour: "<=3"
alerts:
  channel: <slack/email/webhook>
  severity_threshold: warning
auto_fix_enabled: true
escalation_after: 3   # consecutive fix attempts
```

## Phase 2 — Failure triage (when watchdog reports a failure)

Read the execution error. Classify:

| Error pattern | Severity | Auto-fix | Escalate? |
|---|---|---|---|
| OAuth expired / 401 | High | Re-auth via `n8n_manage_credentials` | If re-auth fails |
| Rate limit 429 | Medium | Retry with exponential backoff (3 attempts) | After 3rd failure |
| Timeout (>30s) | Medium | Retry with 2× timeout once | If still times out |
| 5xx from external API | Medium | Retry 3× with backoff | If pattern persists 10min+ |
| Schema mismatch (4xx) | High | None | Always — needs human |
| Code node runtime error | High | None | Always — needs code fix |
| Validation drift | High | Re-validate, if fail then rollback to last-known-good | If rollback fails |
| Cron skipped | Low | Verify cron expression, re-test | If config error |
| Webhook 404 | Critical | Check workflow active state, re-activate | Immediate |

## Phase 3 — Auto-fix catalog

### Fix: OAuth re-auth

```
1. Read failed execution's credential ID
2. Use n8n_manage_credentials → trigger re-auth flow
3. If interactive consent required → escalate (cannot auto-fix)
4. If silent refresh succeeds → re-run failed execution
```

### Fix: Rate limit retry

```
1. Detect 429 in error message
2. Read Retry-After header if present (else use 60s default)
3. Schedule retry after Retry-After * 1.5
4. If 3 consecutive 429s → escalate (likely insufficient quota, not transient)
```

### Fix: Validation drift rollback

```
1. Fetch last-known-good workflow snapshot (stored at activation time)
2. Use n8n_update_partial_workflow with snapshot
3. Hand off to n8n-validation-expert to confirm clean
4. Re-test with n8n-workflow-tester before re-activation
```

## Phase 4 — Escalation format (to user)

When auto-fix fails OR error is non-auto-fixable:

```
🚨 WORKFLOW INCIDENT — <workflow name>
─────────────────────────────────────────
Execution ID: <id>
Started:      <ts>
Failed at:    <node name>
Error type:   <classification from table>
Auto-fix:     <attempted | not applicable>
Attempts:     <N>

Root cause hypothesis:
<one paragraph>

Recommended action:
<concrete next step>

Affected:
- Downstream workflows: <list>
- SLO impact: <success rate drop / latency spike>
```

## SLO report format

```
📊 WORKFLOW HEALTH — <workflow name>  (last 24h)
───────────────────────────────────────────────
Executions:        N
Success rate:      X% (SLO: ≥99%) → ✅/⚠️/❌
p50 latency:       Xms
p99 latency:       Xms (SLO: ≤5000ms) → ✅/⚠️/❌
Failures/hour:     X (SLO: ≤3) → ✅/⚠️/❌
Auto-fixes today:  N (success: M)
Escalations:       N

Top errors:
  1. <error> × <count>
  2. <error> × <count>
  3. <error> × <count>
```

## Routing

FROM here, GO TO:
- **`watchdog-autonomous`** (existing infra) — to actually poll/subscribe
- **n8n-credentials-architect** — for OAuth re-auth flows
- **n8n-workflow-tester** — after rollback, re-verify
- **n8n-validation-expert** — for validation-drift incidents
- **user** — for escalations (anything non-auto-fixable)

STAY here UNTIL: incident resolved OR escalated to user.

## Integration with watchdog-autonomous

`watchdog-autonomous` is the existing agent that does the polling. This skill provides:

1. **Subscription policy** — what to watch, at what interval
2. **Error classifier** — the triage table above
3. **Fix catalog** — the auto-fix recipes
4. **Escalation format** — the templates above

Handoff to watchdog with the registration block in Phase 1. Watchdog wakes this skill when a failure event fires.

## Anti-patterns

- ❌ Polling from this skill directly (use watchdog-autonomous)
- ❌ Auto-fixing schema-mismatch errors (always escalate)
- ❌ Silent escalation (always include hypothesis + recommended action)
- ❌ Storing snapshots locally (use n8n_export_workflow at activation time)

## Summary

Registration → Triage → Auto-fix from catalog → Escalate the unfixable. Polling delegated to `watchdog-autonomous`. Covers 7 common failure modes with auto-fix, 2 always-escalate categories.
