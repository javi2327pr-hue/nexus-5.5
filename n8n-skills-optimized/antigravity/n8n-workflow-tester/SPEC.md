<!-- v1 | agente: antigravity | 2026-05-21 -->

# n8n Workflow Tester — Antigravity spec

## Goal
Verify that any validated n8n workflow actually does what it should before activation, by generating fixtures, executing them against the workflow, diffing outputs, and rolling back on failure. Closes the static-validation vs runtime-correctness gap.

## Autonomy boundaries
- Generate fixtures per pattern (happy + edge + error) without confirmation
- Execute fixtures and collect results without confirmation
- Diff outputs ignoring volatile fields (timestamps, execution IDs)
- Auto-rollback to last validated snapshot if tests fail during a modification
- Do NOT activate workflows yourself — emit READY_TO_ACTIVATE verdict and hand off

## Acceptance criteria
1. Pre-condition: workflow passed n8n-validation-expert (else BLOCKED)
2. Minimum fixture coverage per workflow: 1 happy + 2 edge + 1 error
3. Each fixture has expected_output defined before execution
4. Diff ignores configurable volatile fields (default: timestamp, executionId)
5. Verdict is one of: PASS, FAIL, BLOCKED, ROLLED_BACK
6. On PASS → handoff to user/orchestrator for activation
7. On FAIL → handoff to n8n-validation-expert with diff
8. On ROLLED_BACK → escalate to user with rollback notice
9. Zero workflow activation by this skill itself

## Optional checkpoints
- Confirm fixture set with user when workflow is high-stakes (financial, customer-facing)
- Confirm rollback with user when modifications were significant
- Otherwise: autonomous

## Inputs / outputs
- Input: workflow_id (must be validated) + optional fixture set + optional ignore_fields
- Output: TEST REPORT with verdict, fixture-by-fixture pass/fail, diffs, and handoff target

## Success metric
- Catches ≥80% of runtime errors that static validation cannot detect
- 0 false-negative PASS verdicts (workflow that fails in prod after PASS)
- Average test plan completes in ≤2 minutes per workflow

## Failure mode handling
- Workflow won't execute (instance unreachable) → BLOCKED, handoff to n8n-validation-expert
- Test execution times out (>30s) → mark fixture BLOCKED, continue with others
- Auto-rollback fails → escalate immediately (workflow may be in mixed state)
- Cannot find n8n_trigger_test_execution tool → fall back to direct webhook POST for webhook workflows; escalate for non-webhook

## Reference

### Fixture coverage per pattern
| Pattern | Minimum fixtures |
|---|---|
| Webhook Processing | happy body + empty + extra fields + malformed |
| HTTP API Integration | 200 + 429 + 5xx + timeout |
| Database Operations | valid row + duplicate + missing FK + bad type |
| AI Agent Workflow | clear intent + empty + prompt injection + non-existent tool |
| Scheduled Tasks | simulated tick at expected time |

### Volatile fields (ignored in diff by default)
`timestamp`, `executionId`, `execution_id`, `created_at`, `updated_at`, `id` (when auto-generated)
