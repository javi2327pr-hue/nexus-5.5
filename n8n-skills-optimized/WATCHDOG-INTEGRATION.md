# Integration Spec — `n8n-observability-monitor` ↔ `watchdog-autonomous`

## Why this integration

`n8n-observability-monitor` is the **policy layer** for n8n workflow monitoring (what to watch, how to triage, what to auto-fix).
`watchdog-autonomous` is the **execution layer** (the polling loop, the alert dispatcher, the wake-on-event runtime).

Splitting concerns this way:
- Avoids re-implementing a polling loop inside the n8n skill
- Reuses watchdog-autonomous's alert dispatch (Slack, email, webhook)
- Keeps the n8n skill stateless (watchdog handles persistence)

## Contract

### From n8n-observability-monitor → watchdog-autonomous

#### `subscribe`

Emitted by n8n-observability-monitor at workflow activation.

```yaml
subscribe:
  source: n8n-observability-monitor
  target_id: <workflow_id>
  target_kind: n8n_workflow
  target_instance: <n8n_instance_url>

  poll_strategy: |
    Preferred: webhook subscription (if n8n MCP supports execution events)
    Fallback: poll n8n_get_executions every <interval>s

  poll_interval_seconds: 60   # used only in fallback mode

  slos:
    success_rate_min: 0.99
    p99_latency_ms_max: 5000
    failures_per_hour_max: 3

  alert:
    channel: <user-provided slack|email|webhook>
    severity_threshold: warning

  wake_handler:
    skill: n8n-observability-monitor
    mode: TRIAGE

  snapshot:
    type: n8n_workflow_json
    captured_at: <timestamp>
    data: <full workflow JSON for rollback recipe>

  escalation:
    after_consecutive_failures: 3
    escalation_handler: user
```

#### `unsubscribe`

```yaml
unsubscribe:
  source: n8n-observability-monitor
  target_id: <workflow_id>
```

### From watchdog-autonomous → n8n-observability-monitor

#### `wake` event (on failure detected)

```yaml
wake:
  target_id: <workflow_id>
  event_type: execution_failed
  payload:
    execution_id: <id>
    node: <failed_node_name>
    error_message: <text>
    status_code: <int|null>
    started_at: <timestamp>
    failed_at: <timestamp>
    duration_ms: <int>
```

#### `wake` event (on SLO breach)

```yaml
wake:
  target_id: <workflow_id>
  event_type: slo_breach
  payload:
    breached_slo: <success_rate|p99_latency|failures_per_hour>
    actual_value: <number>
    threshold: <number>
    window: <last 1h|24h>
```

#### `wake` event (on absence)

```yaml
wake:
  target_id: <workflow_id>
  event_type: silent_failure
  payload:
    expected_executions_since: <timestamp>
    actual_executions: 0
    likely_cause: cron_not_firing | webhook_unreachable | workflow_inactive
```

## Sequence diagrams

### Happy path — activation + first failure auto-fixed

```
USER             SUITE-ROUTER       OBS-MONITOR        WATCHDOG-AUTONOMOUS    n8n
 │                    │                  │                     │              │
 │─activate wf────────▶                  │                     │              │
 │                    │─OBS_REGISTER────▶│                     │              │
 │                    │                  │─subscribe payload──▶│              │
 │                    │                  │◀────ack─────────────│              │
 │                    │                  │                     │─poll every 60s─▶│
 │                    │                  │                     │◀──executions──│
 │                    │                  │                     │ (1 failed)    │
 │                    │                  │                     │               │
 │                    │                  │◀──wake (failure)────│               │
 │                    │                  │                     │               │
 │                    │                  │─[TRIAGE: RECIPE_OAUTH]              │
 │                    │                  │─handoff CRED────────────────────────│
 │                    │                  │ (re-auth + retry execution)         │
 │                    │                  │                     │               │
 │                    │                  │ counter reset                       │
 │                    │                  │ no escalation                       │
```

### Escalation path — after 3 consecutive auto-fix failures

```
WATCHDOG    OBS-MONITOR     USER
   │            │             │
   │─wake────▶ │             │
   │            │─attempt 1: RECIPE_RETRY      (fail)
   │            │─attempt 2: RECIPE_RETRY      (fail)
   │            │─attempt 3: RECIPE_RETRY      (fail)
   │            │             │
   │            │─ESCALATE ──▶│
   │            │   🚨 incident card with hypothesis + recommended action
```

## Implementation notes

### Where does watchdog-autonomous get the polling capability?

It uses the n8n MCP tool `n8n_get_executions` on the configured interval. If your n8n-mcp version exposes `n8n_subscribe_executions` (event-based), watchdog uses that instead and reduces polling.

### Where is the snapshot stored?

Inside watchdog-autonomous's per-subscription state. It is NOT stored in the n8n-observability-monitor skill itself (skills should remain stateless). When the rollback recipe fires, n8n-observability-monitor requests the snapshot from watchdog via:

```yaml
get_snapshot:
  target_id: <workflow_id>
```

### Idempotency

All operations are idempotent by `target_id`:
- Subscribing twice = no-op (logs warning)
- Unsubscribing nonexistent = no-op
- Wake events for unsubscribed targets = dropped silently

### Authentication

Watchdog-autonomous uses the same n8n MCP credentials as the n8n skills. No separate auth needed. If MCP credentials rotate (via n8n-credentials-architect ROTATE), watchdog re-establishes the connection automatically.

## Failure modes

| Failure | Behavior |
|---|---|
| Watchdog can't reach n8n instance | Pause subscription, retry every 5min, alert after 30min |
| n8n MCP returns malformed execution data | Log, skip event, do not crash subscription |
| Wake handler (n8n-observability-monitor) crashes | Retry once, then disable subscription + alert |
| Alert channel unreachable (Slack down) | Buffer alerts, flush when reachable, expire after 24h |
| Snapshot corrupted | Disable rollback recipe for this target, alert user |

## Migration path (if watchdog-autonomous doesn't exist in your setup)

The integration is optional. If `watchdog-autonomous` is not present:

1. Run n8n-observability-monitor in **standalone polling mode** — it does the polling itself with a built-in loop
2. Less efficient (no shared polling layer across multi-target subscriptions)
3. Configure by setting `poll_strategy: built_in` in the subscription block
4. Recommended only for ≤5 monitored workflows

For production at scale (>10 workflows), use watchdog-autonomous.

## Testing the integration

1. Activate a test workflow → confirm `subscribe` payload reaches watchdog logs
2. Trigger a known-failing execution → confirm `wake` event fires within `poll_interval + 10s`
3. Confirm n8n-observability-monitor applies correct recipe (check triage log)
4. Force 3 consecutive failures → confirm escalation card reaches user channel
5. Unsubscribe → confirm watchdog stops polling and drops subscription
