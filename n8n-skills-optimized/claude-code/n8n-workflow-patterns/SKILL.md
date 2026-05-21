<!-- v2 | agente: claude-code | 2026-05-21 -->
---
name: n8n-workflow-patterns
description: Select the right architectural pattern before building any n8n workflow. Trigger when user asks to build, create, design, or automate a workflow, webhook, API integration, scheduled task, AI agent, or batch process. Use BEFORE n8n-mcp-tools-expert — the pattern decides which nodes to search for.
---

# n8n Workflow Patterns

## Use this skill when

- User describes a workflow goal in natural language → run **Pattern Selector**
- User asks "which pattern for X?" → answer from **Pattern Matrix**
- User wants to combine 2+ patterns → see **Hybrid Patterns**
- User already has a workflow JSON → skip this skill, go to `n8n-validation-expert`

## Pattern Selector (decision tree)

1. Is the trigger an external HTTP call? → **Webhook Processing**
2. Does the workflow consume a REST API? → **HTTP API Integration**
3. Does it read/write a DB? → **Database Operations**
4. Does it use an LLM with tools/memory? → **AI Agent Workflow**
5. Does it run on cron/interval? → **Scheduled Tasks**
6. Does it process >100 items? → wrap chosen pattern with **Batch Processing** modifier

## Pattern Matrix

| Pattern | Trigger | Core nodes | Closing nodes | Detail file |
|---|---|---|---|---|
| Webhook Processing | Webhook | Validate → Transform | Respond + Notify | webhook_processing.md |
| HTTP API Integration | Cron/Manual | HTTP Request → Transform | Action + Error Handler | http_api_integration.md |
| Database Operations | Schedule | Query → Transform | Write + Verify | database_operations.md |
| AI Agent Workflow | Trigger | AI Agent (Model+Tools+Memory) | Output | ai_agent_workflow.md |
| Scheduled Tasks | Cron | Task chain | Notify | scheduled_tasks.md |
| Batch (modifier) | — | SplitInBatches wrapper | Loop closer | (inline below) |

## Hybrid patterns (most real workflows are hybrids)

- **Webhook + Batch**: webhook → SplitInBatches → per-item → respond
- **Schedule + API + DB**: cron → HTTP Request → transform → DB write
- **AI Agent + Webhook**: webhook → AI Agent (HTTP tool) → respond
- **Webhook + Schedule fallback**: webhook primary, cron as catch-up backup
For full hybrid catalogs see `webhook_processing.md` and `ai_agent_workflow.md`.

## Batch modifier (inline, applies to any pattern)

```
[trigger] → [SplitInBatches batchSize=N] → [per-item logic] → [loop back to SplitInBatches]
                                                                          ↓ done
                                                                      [finalize]
```
Use when input list exceeds 100 items or external API has rate limits.

## Mandatory pre-build checklist

- [ ] Pattern identified from selector above
- [ ] Trigger node decided and named
- [ ] Error path defined (every pattern has one — see node-configuration skill)
- [ ] Output/notification node defined
- [ ] If batch: SplitInBatches positioned BEFORE per-item logic
- [ ] If AI: memory + tools list explicit
- [ ] Credentials referenced (never hardcoded)

## Routing

FROM here, GO TO:
- **n8n-mcp-tools-expert** — to search nodes for the chosen pattern
- **n8n-node-configuration** — once nodes are picked
- **n8n-validation-expert** — after first build attempt
- **n8n-code-javascript** / **n8n-code-python** — if pattern needs Code node logic
- **n8n-expression-syntax** — when mapping data between nodes

STAY here UNTIL: pattern is locked AND trigger+output+error nodes are named.

## Anti-patterns

- ❌ Building before selecting a pattern
- ❌ Mixing patterns without declaring a hybrid
- ❌ Skipping the error path
- ❌ Hardcoding credentials inside HTTP/DB nodes
- ❌ One-shot workflow build — iterate (avg 56s between edits in real usage)

## Summary

6 core patterns + batch modifier cover 90%+ of workflows. Pick pattern → name trigger+output+error → handoff to mcp-tools-expert.
