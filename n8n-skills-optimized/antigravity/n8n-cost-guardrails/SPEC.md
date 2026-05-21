<!-- v1 | agente: antigravity | 2026-05-21 -->

# n8n Cost Guardrails — Antigravity spec

## Goal
Estimate workflow cost (LLM tokens, HTTP calls, DB writes) BEFORE build, detect loop-over-API patterns, propose batching/cache/circuit-breaker/budget-cap mitigations. Prevent the "runaway $3K bill in 1 day" failure mode.

## Autonomy boundaries
- Estimate cost from 4 inputs autonomously (ask only when input missing)
- Detect risk patterns from workflow JSON or planned pattern shape
- Propose mitigation patterns (A: batching, B: cache, C: circuit breaker, D: budget cap)
- REJECT sub-minute cron triggers (Critical risk) without confirmation
- WARN on LLM workflows without budget cap
- Do NOT build the workflow yourself (handoff to other skills)
- Do NOT approve estimates above user-defined budget without explicit confirmation

## Acceptance criteria
1. Pre-build mode: estimate emitted with cost breakdown by category + total monthly
2. All risk patterns scanned: HTTP in loop, AI in batches, cron resolution, fan-out, no cache, no budget cap
3. Risk classification: LOW / MEDIUM / HIGH / CRITICAL
4. Every HIGH/CRITICAL risk has a mitigation pattern proposed
5. Estimate report includes: breakdown, risks, recommended design changes
6. Diagnose mode: actual cost computed from execution history, compared to estimate
7. Mitigations route to appropriate downstream skill (patterns, node-config, code-js)
8. Estimate above user budget → escalate before build proceeds

## Optional checkpoints
- Confirm budget threshold with user if estimate >$100/mo (configurable)
- Confirm with user before approving HIGH risk without full mitigation
- Otherwise: autonomous

## Inputs / outputs
- Input: trigger_frequency, items_per_execution, external_calls, cost_per_call (ask if missing)
- Output: COST ESTIMATE report with breakdown, risks, recommended changes, handoff target

## Success metric
- 0 production cost surprises >2× estimate
- 100% of HIGH/CRITICAL risks have proposed mitigation
- 0 sub-minute cron triggers approved
- 100% of LLM workflows include budget cap pattern

## Failure mode handling
- Cannot estimate (no rate data for vendor) → ask user OR mark as UNKNOWN_COST with warning
- Sub-minute cron requested → REJECT and explain why
- User insists on no mitigation for HIGH risk → escalate with explicit warning, log decision
- Diagnose mode but no execution history → fall back to estimate mode

## Reference

### 2026 rate table (LLM)
| Provider/model | Input | Output |
|---|---|---|
| Claude Sonnet | $3/M | $15/M |
| Claude Opus | $15/M | $75/M |
| GPT-4o | $5/M | $15/M |
| Embeddings | $0.13/M | — |

### Risk patterns
| Pattern | Risk | Mitigation |
|---|---|---|
| HTTP in loop, no rate limit | HIGH | Pattern A (batching + wait) |
| AI Agent inside SplitInBatches | HIGH | Pattern B (cache) + consolidation |
| Postgres write per item | MEDIUM | Bulk insert |
| Sub-minute cron | CRITICAL | REJECT |
| Webhook → unconstrained fan-out | HIGH | Rate-limit at edge |
| LLM without daily cap | MEDIUM | Pattern D (budget cap) |
| Idempotent calls without cache | LOW-MEDIUM | Pattern B (cache) |

### Mitigation patterns
- **A — Batching**: SplitInBatches + Wait
- **B — Cache**: hash input + data-table lookup
- **C — Circuit breaker**: error_count threshold in static data
- **D — Budget cap**: token counter with daily reset
