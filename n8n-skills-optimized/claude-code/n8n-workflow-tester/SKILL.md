<!-- v1 | agente: claude-code | 2026-05-21 -->
---
name: n8n-workflow-tester
description: Execute newly-built n8n workflows against synthetic fixtures and verify output matches expected. Trigger AFTER n8n-validation-expert returns clean — closes the gap between "validates" and "actually works". Generates fixtures by pattern, runs test executions, diffs outputs, auto-rollback on failure.
---

# n8n Workflow Tester

This skill closes the gap between static validation and runtime correctness. Static validation says "the workflow is well-formed"; this skill says "the workflow does what it should".

## Use this skill when

- Validation just returned clean → run **Test Plan**
- Workflow modified after passing validation → re-run **Test Plan**
- Production incident → run **Replay** with the failing payload
- Pre-activation gate → mandatory pass before `activateWorkflow`

## Test Plan (4 phases)

### Phase 1 — Generate fixtures (by pattern)

| Pattern | Fixture template |
|---|---|
| Webhook Processing | POST body matching the documented schema (happy + 2 edge cases) |
| HTTP API Integration | Mock target API response (200/4xx/5xx + timeout) |
| Database Operations | Seed row + verify after mutation |
| AI Agent Workflow | User message + expected tool calls trace |
| Scheduled Tasks | Synthetic execution at simulated cron tick |

Generate **at minimum**: 1 happy path + 2 edge cases (empty input, malformed input) + 1 error path.

### Phase 2 — Execute against test instance

```
1. Get workflow ID from n8n-mcp
2. For each fixture:
   a. If Webhook → POST to test webhook URL
   b. If non-Webhook → call execution API (n8n_trigger_test_execution or equivalent)
   c. Capture execution ID
3. Wait for completion (timeout 30s default)
4. Fetch execution result via API
```

### Phase 3 — Diff actual vs expected

For each fixture, compare:
- **Final output JSON** — exact match (with optional `ignoreFields: [timestamp, executionId]`)
- **Execution path** — every node fired in expected order
- **Error path** — for negative fixtures, correct error node reached

### Phase 4 — Verdict + auto-rollback

```
All pass         → emit PASS report + handoff to activation
Any fail         → emit FAIL report with diff + STOP (do not activate)
Cannot execute   → emit BLOCKED report + handoff to n8n-validation-expert
```

If workflow was modified during testing and tests fail → **auto-rollback** to last validated version (via `n8n_update_partial_workflow` with the prior snapshot).

## Fixture library (per pattern)

### Webhook Processing

```json
// Happy path
{ "name": "Alice", "email": "alice@example.com" }

// Edge: empty
{}

// Edge: extra fields
{ "name": "Bob", "email": "bob@example.com", "internal_field": "should_be_ignored" }

// Error: malformed email
{ "name": "Carol", "email": "not-an-email" }
```

### HTTP API Integration

```
Mock target response:
- 200 with realistic body
- 429 (rate limit) — verify retry logic
- 500 — verify error path
- timeout (10s+) — verify circuit breaker
```

### AI Agent Workflow

```
User: "What's the weather in Buenos Aires?"
Expected tools called: get_weather(city="Buenos Aires")
Expected output: contains "Buenos Aires" and a temperature value
```

## Output format

```
TEST REPORT — <workflow name> @ <commit/version>
═══════════════════════════════════════════════════
Pattern:    <pattern name>
Fixtures:   <N>
Passed:     <N>
Failed:     <N>
Blocked:    <N>

FAILED:
  • Fixture "empty body":
    Expected: { error: "name required", status: 400 }
    Actual:   { error: undefined, status: 500 }
    Node:    "Validate" (node ID: abc123)
    Diff:    error path was not reached

VERDICT: FAIL — do not activate
NEXT:    handoff to n8n-validation-expert (Validate node misconfigured)
```

## Routing

FROM here, GO TO:
- **n8n-validation-expert** — if tests reveal a config error (re-enter the loop)
- **n8n-node-configuration** — if a specific node misconfigured per the diff
- **n8n-code-javascript** / **n8n-code-python** — if a Code node produced wrong output
- **(ship)** — if all tests pass

STAY here UNTIL: all fixtures pass OR a hard blocker is escalated.

## Anti-patterns

- ❌ Activating without running test plan
- ❌ Generating only happy-path fixtures (always include edge + error)
- ❌ Comparing without ignoring volatile fields (timestamps, IDs)
- ❌ Skipping rollback when tests fail mid-modification

## Integration with n8n-mcp tools

| Action | Tool |
|---|---|
| Get workflow JSON | `n8n_get_workflow` |
| Trigger test execution | `n8n_trigger_test_execution` (if available in your n8n-mcp version) |
| Read execution result | `n8n_get_execution` |
| Rollback | `n8n_update_partial_workflow` with prior snapshot |

If `n8n_trigger_test_execution` isn't available: POST to the test webhook URL directly (for webhook workflows) or use the n8n REST API.

## Summary

Phase 1 (fixtures) → Phase 2 (execute) → Phase 3 (diff) → Phase 4 (verdict). Always include happy + 2 edge + 1 error. Auto-rollback if tests fail mid-modification. Closes the +15% runtime-error gap that static validation cannot catch.
