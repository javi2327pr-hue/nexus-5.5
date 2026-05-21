<!-- v1 | agente: claude-code | 2026-05-21 -->
---
name: n8n-suite-router
description: Dispatcher that selects which n8n skill to consult first based on user intent. Trigger on any n8n-related question (workflow, node, expression, validation, Code, MCP tool). This skill returns a routing decision in <5s and hands off — it does not solve the user's task itself.
---

# n8n Suite Router (orchestrator)

This skill is a **pure dispatcher**. It reads user intent and returns the next skill to activate. It does NOT solve the task — it routes.

## When to activate

On any user message that:
- Mentions n8n, workflow, node, automation, webhook, n8n-mcp
- References an n8n tool, expression, Code node, validation result
- Asks "how do I X in n8n"

## Intent → Skill mapping

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

## Multi-skill plans

For composite intents, output the **sequence**, not a single skill:

| User intent | Routing sequence |
|---|---|
| "Build & validate a webhook → Slack workflow" | patterns → mcp-tools → node-config → code-js (if Code needed) → expressions → validation |
| "Migrate this JSON to use Python instead of JS" | code-js (read existing) → code-python (rewrite) → validation |
| "My workflow validates but fails at runtime" | validation (switch profile to `runtime`) → patterns (check error path) → node-config |
| "Audit my n8n instance" | mcp-tools (`n8n_audit_instance`) → validation (interpret findings) |
| "Create an AI Agent workflow" | patterns (AI Agent pattern) → mcp-tools (`ai_agents_guide()`) → node-config (8 connection types) → validation |

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
