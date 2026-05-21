<!-- v1 | agente: claude-code | 2026-05-21 -->
---
name: n8n-cost-guardrails
description: Pre-build budget + rate-limit advisor. Estimates cost (LLM tokens, HTTP calls, DB writes) before workflow builds, detects loops without rate-limit awareness, proposes SplitInBatches sizing, cache layers, and circuit breakers.
---

# n8n Cost Guardrails

## Use this skill when

- `n8n-workflow-patterns` selected a pattern with loops, LLM, or external API
- A new workflow is about to be built → run **Pre-build estimate**
- An existing workflow is hitting quota/timeout → run **Diagnose**
- User asks "how much will this cost"

## Pre-build estimate (4 inputs needed)

```
1. Trigger frequency  (executions per day)
2. Items per execution (e.g., webhook=1, batch=1000)
3. External calls per item (HTTP, LLM, DB writes)
4. Cost per call (LLM token price, API quota, DB write IOPS)
```

If user can't provide → ask 1 question per missing input (max 4 questions).

## Cost model

```
Monthly cost ≈ (executions/day) × 30 × (items/execution) × Σ(calls × cost-per-call)
```

Plus n8n self-hosting cost (or cloud quota) — usually fixed.

## Cost categories with typical rates (2026)

| Category | Typical unit cost | Hit when |
|---|---|---|
| LLM (Claude Sonnet) | $3/M input + $15/M output | AI Agent calls |
| LLM (Claude Opus) | $15/M input + $75/M output | AI Agent with reasoning |
| LLM (GPT-4o) | $5/M input + $15/M output | OpenAI nodes |
| LLM (embedding) | $0.13/M tokens | RAG ingestion |
| External API | varies — see vendor | HTTP Request in loop |
| DB writes (Postgres on RDS) | ~$0.0001 per write | Postgres insert/update |
| n8n cloud | seat + execution-based | n8n.cloud plan |
| Compute (self-hosted) | host VM cost | Always |

## Loop detection (the #1 cost trap)

Scan workflow for these patterns:

| Pattern | Risk | Mitigation |
|---|---|---|
| `HTTP Request` inside a loop without rate-limit awareness | High — quota burst | SplitInBatches + per-batch sleep |
| `AI Agent` inside SplitInBatches | High — token burst | Cache by input hash, batch consolidation |
| `Postgres` write per item without `batch insert` | Medium — IOPS spike | Switch to bulk insert |
| `Schedule` trigger with second-level cron | Critical — runaway | Validate cron expression — refuse `* * * * * *` |
| Webhook → unconstrained fan-out | High — amplification attack | Rate-limit at webhook OR queue |

## Mitigation patterns

### Pattern A — Batching with rate limit awareness

```
[trigger] → SplitInBatches(batchSize=<target_rate_per_sec × 1s>) → [per-item call]
            ↓ done
         [finalize]

Add Wait node inside loop = 1000ms / batchSize → caps to target_rate
```

Example: API allows 10 req/sec → `batchSize=10`, `Wait=1000ms` inside loop.

### Pattern B — Cache layer (idempotent calls)

```
[trigger] → [Code: hash input] → [Postgres lookup by hash]
                                  ├─ HIT  → use cached
                                  └─ MISS → [call API] → [store in cache] → use
```

Use n8n's data tables for cache (free, fast). TTL via `created_at + interval`.

### Pattern C — Circuit breaker

```
[Code: check error_count in static data]
  ├─ count >= threshold → skip API call + return cached/null
  └─ count < threshold → call API → on error: increment counter
```

Reset counter on success OR after time window.

### Pattern D — Token budget cap (LLM workflows)

For AI Agent workflows:
```
Pre-call:
  daily_budget = 1_000_000 tokens
  used_today = $getWorkflowStaticData('node').used_today ?? 0
  if used_today >= daily_budget → return { error: "budget_exceeded" }

Post-call:
  $getWorkflowStaticData('node').used_today += (input_tokens + output_tokens)
```

Reset daily via Schedule trigger.

## Pre-build report format

```
COST ESTIMATE — <workflow name>
────────────────────────────────────────
Triggers/day:          100
Items/execution:       50
Total ops/day:         5,000

Cost breakdown:
  • OpenAI GPT-4o:     5000 × $0.02     = $100/day = $3,000/mo
  • HTTP API X:        5000 × $0.001    = $5/day   = $150/mo
  • Postgres writes:   5000 × $0.0001   = $0.50/day = $15/mo

  TOTAL: ~$3,165/mo

⚠️  RISKS:
  1. HTTP API X has 10 req/sec limit — current design = 50 req/sec burst
     → Add SplitInBatches(batchSize=10) + Wait 1000ms

  2. OpenAI costs dominate — input often repeats
     → Add cache layer (Pattern B), save est. 60% = $1,800/mo

  3. No daily budget cap on LLM
     → Add Pattern D ($1k/day cap = circuit break)

RECOMMENDED design changes BEFORE build:
  [a] SplitInBatches sizing → batchSize=10
  [b] Cache layer for OpenAI inputs
  [c] Daily token budget cap
```

## Diagnose (existing workflow)

```
1. Read execution history (last 7 days) via n8n_get_executions
2. Compute actual cost from execution metadata + call counts
3. Compare to estimate (if one was made)
4. Identify hottest cost driver
5. Recommend retroactive mitigation (same patterns as pre-build)
```

## Routing

FROM here, GO TO:
- **n8n-workflow-patterns** — if mitigation requires re-architecture (e.g., switch from per-item to batch)
- **n8n-node-configuration** — to add SplitInBatches/Wait/cache nodes
- **n8n-code-javascript** — for circuit breaker / budget cap logic
- **n8n-observability-monitor** — to register cost SLOs
- **user** — for budget approval if estimate > threshold

STAY here UNTIL: estimate fits user's budget AND mitigations are designed for all High/Critical risks.

## Anti-patterns

- ❌ Building without estimating (especially with LLM nodes)
- ❌ Loops over external APIs without rate-limit math
- ❌ Trusting "free tier" without quota validation
- ❌ No daily/monthly cap on token spend
- ❌ Caching only when "it gets expensive" (too late)
- ❌ Schedule triggers with sub-minute cron

## Summary

Estimate before build (4 inputs). Detect loop-over-API patterns. Apply batching, cache, circuit breaker, budget cap. Report risks + recommended design changes. Re-estimate after mitigation. Never approve High/Critical risk without mitigation.
