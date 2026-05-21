<!-- v2 | agente: claude-code | 2026-05-21 -->
---
name: n8n-suite-router
description: Dispatcher that selects which n8n skill (of 13) to consult first based on user intent. Trigger on any n8n-related question — workflow, node, expression, validation, Code, MCP tool, testing, monitoring, credentials, migration, cost. Returns routing in <5s and hands off — does not solve the task itself.
---

# n8n Suite Router (orchestrator)

This skill is a **pure dispatcher**. It reads user intent and returns the next skill to activate. It does NOT solve the task — it routes.

## When to activate

On any user message that:
- Mentions n8n, workflow, node, automation, webhook, n8n-mcp
- References an n8n tool, expression, Code node, validation result
- Mentions testing, monitoring, credentials, migration, or cost of an n8n workflow
- Asks "how do I X in n8n"

## Intent → Skill mapping (13 skills)

| User says / Context | Next skill |
|---|---|
| "Build / create / design a workflow" | `n8n-workflow-patterns` |
| "Connect X to Y" (automation) | `n8n-workflow-patterns` |
| "Find a node / which node for X" | `n8n-mcp-tools-expert` |
| "About to call any `mcp__n8n__*` tool" | `n8n-mcp-tools-expert` |
| "Configure / set up the X node" | `n8n-node-configuration` |
| "Required fields for X" | `n8n-node-configuration` |
| "Write JS / JavaScript in Code node" | `n8n-code-javascript` |
| "Write Python in Code node" | `n8n-code-python` (warn JS-first) |
| "Expression / `{{ }}` / `$json` / `$node`" | `n8n-expression-syntax` |
| "Webhook data shows undefined" | `n8n-expression-syntax` (`.body` gotcha) |
| "Validation failed / error / warning" | `n8n-validation-expert` |
| "False positive in validation" | `n8n-validation-expert` |
| "How does auto-sanitization work" | `n8n-mcp-tools-expert` |
| "Test / verify / run fixtures against workflow" | `n8n-workflow-tester` |
| "Workflow validates but fails at runtime" | `n8n-workflow-tester` |
| "Monitor / health / SLO / incident" | `n8n-observability-monitor` |
| "Auto-fix / babysit / watch workflow X" | `n8n-observability-monitor` |
| "OAuth expired / token rotation / re-auth" | `n8n-credentials-architect` |
| "Hardcoded secret / over-scoped credential" | `n8n-credentials-architect` |
| "Migrate / promote / export / import workflow" | `n8n-workflow-migrator` |
| "Dev → prod" workflow move | `n8n-workflow-migrator` |
| "Cost / budget / rate limit / quota" | `n8n-cost-guardrails` |
| "How much will this workflow cost?" | `n8n-cost-guardrails` |

## Multi-skill plans

For composite intents, output the **sequence**, not a single skill:

| User intent | Routing sequence |
|---|---|
| "Build & ship a webhook → Slack workflow" | patterns → cost-guardrails → mcp-tools → node-config → credentials-architect → expressions → validation → tester → activate → observability-monitor |
| "Migrate this JSON to use Python instead of JS" | code-js (read existing) → code-python (rewrite) → validation → tester |
| "My workflow validates but fails at runtime" | tester (run fixtures) → validation if FAIL → fix → tester |
| "Audit my n8n instance" | mcp-tools (`n8n_audit_instance`) → credentials-architect (MIGRATE + RIGHT_SIZE + CLEANUP) → tester |
| "Create an AI Agent workflow" | patterns (AI Agent) → cost-guardrails (token budget) → mcp-tools (`ai_agents_guide()`) → node-config (8 conn types) → code-js (cache + budget) → credentials-architect (API key + cap) → validation → tester → activate → observability-monitor |
| "Promote workflow X from dev to prod" | workflow-migrator (6 phases: export → audit → re-map → version diff → import+validate → tester) → user activates |
| "Monitor workflow X" | observability-monitor (register with watchdog-autonomous) |
| "Why is workflow X failing in production" | observability-monitor (read incident) → triage recipe OR validation → tester |

## Output format (what this skill produces)

When activated, produce ONLY:

```
ROUTE: <skill-name>
WHY: <one sentence reason>
THEN: <next-skill-name or "stay until task done">
```

Or for multi-step:

```
ROUTE:
  1. <skill-1>  — <reason>
  2. <skill-2>  — <reason>
  3. <skill-3>  — <reason>
```

Do not solve, do not explain n8n concepts here. Hand off.

## Anti-patterns for the router

- ❌ Answering n8n questions directly (route instead)
- ❌ Re-routing in a loop (each downstream skill has its own routing block)
- ❌ Selecting a skill not in the suite
- ❌ Skipping `n8n-mcp-tools-expert` when any `mcp__n8n__*` tool will be called

## Gate rules

- **Always** route through `n8n-mcp-tools-expert` BEFORE any `mcp__n8n__*` tool call
- **Always** route through `n8n-workflow-patterns` BEFORE building a new workflow
- **Always** route through `n8n-validation-expert` AFTER any validation tool returns
- **Always** route through `n8n-cost-guardrails` BEFORE building any workflow with loops, LLM, or external API
- **Always** route through `n8n-workflow-tester` BEFORE any `n8n_activate_workflow` call
- **Always** route through `n8n-observability-monitor` AFTER any `n8n_activate_workflow` call
- **Always** route through `n8n-credentials-architect` for any credential CRUD or OAuth issue
- **Always** route through `n8n-workflow-migrator` for any cross-instance or cross-version workflow move
