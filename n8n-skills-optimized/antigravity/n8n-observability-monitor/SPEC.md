<!-- v1 | agente: antigravity | 2026-05-21 -->

# n8n Observability Monitor — Antigravity spec

## Goal
Be the n8n-specific policy layer for post-ship monitoring: register workflows for monitoring at activation, triage failure events from watchdog-autonomous, apply auto-fix recipes from a catalog, escalate only the unfixable. Polling is delegated to watchdog-autonomous.

## Autonomy boundaries
- Register/unregister workflows with watchdog-autonomous autonomously
- Apply auto-fix recipes from catalog without confirmation
- Track consecutive_fix_attempts per workflow and escalate at threshold
- Do NOT poll workflows directly (delegate to watchdog-autonomous)
- Do NOT auto-fix schema-mismatch errors (4xx) — always escalate
- Do NOT auto-fix Code node runtime errors — always escalate

## Acceptance criteria
1. Registration block emitted at activation, includes: SLOs, alert channel, snapshot for rollback
2. Every failure event triaged via classification table → severity + recipe
3. Auto-fix recipes attempted up to `escalation_after` consecutive attempts
4. Escalation includes: error type, attempts, root cause hypothesis, recommended action
5. SLO report on demand: success rate, p50/p99 latency, failures/hour, auto-fix count, top errors
6. Snapshot at activation enables rollback recipe
7. Zero direct polling — always delegated

## Optional checkpoints
- Confirm with user when validation drift triggers rollback (it changes prod state)
- Confirm before any "destructive" auto-fix (rollback, reactivate)
- Otherwise: autonomous

## Inputs / outputs
- Input: workflow_id + activation event OR failure event from watchdog OR user query
- Output: registration block / triage decision / SLO report / escalation card

## Success metric
- MTTR for transient failures ≤ 5 minutes
- ≥80% of failures resolved by auto-fix recipes without escalation
- 0 silent failures (every failure surfaces as fix-attempt or escalation)
- 0 false-positive escalations (don't escalate things the catalog handles)

## Failure mode handling
- Auto-fix recipe fails 3× consecutive → escalate to user
- Rollback recipe itself fails → escalate IMMEDIATELY with mixed-state warning
- Watchdog reports event for unregistered workflow → register first, then triage
- SLO breached but no individual failure → emit health degradation alert

## Reference

### Severity → fix policy
| Severity | Auto-fix attempts | Escalate after |
|---|---|---|
| Critical (webhook 404, instance down) | 1 (reactivate) | Immediate if fails |
| High (OAuth, schema, validation drift) | 1-3 | 1 failed attempt for schema |
| Medium (rate limit, timeout, 5xx) | 3 with backoff | After 3 |
| Low (cron skipped) | 1 (verify) | If config error |

### Recipe catalog
RECIPE_OAUTH, RECIPE_RATELIMIT, RECIPE_TIMEOUT, RECIPE_RETRY, RECIPE_ROLLBACK, RECIPE_CRONCHECK, RECIPE_REACTIVATE

### Integration contract with watchdog-autonomous
- Subscribe: emit YAML registration block
- Unsubscribe: emit `unsubscribe workflow_id=<id>`
- Failure event format: `{ workflow_id, execution_id, node, error_message, status_code, timestamp }`
- Wake event: any of the above
