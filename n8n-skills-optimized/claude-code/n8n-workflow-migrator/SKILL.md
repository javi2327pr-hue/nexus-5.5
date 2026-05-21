<!-- v1 | agente: claude-code | 2026-05-21 -->
---
name: n8n-workflow-migrator
description: Move workflows between n8n instances (dev→staging→prod) or upgrade across n8n versions. Handles credential re-mapping, webhook URL re-mapping, node-version diffing, and validates+tests on the target before activation.
---

# n8n Workflow Migrator

## Use this skill when

- User says "move", "migrate", "export", "import", "duplicate", "promote" workflow
- Promoting dev → staging → prod
- Upgrading n8n itself (workflows may need adjustment for new node versions)
- Cloning a workflow with different credentials/URLs

## Migration is 6 phases — never skip phases

```
Phase 1 — Export (source instance)
Phase 2 — Audit (find environment-coupled values)
Phase 3 — Re-map (credentials, URLs, env vars)
Phase 4 — Version diff (source vs target n8n versions)
Phase 5 — Import (target instance) + validate
Phase 6 — Test (n8n-workflow-tester) before activation
```

## Phase 1 — Export

```
1. Connect to source instance MCP
2. n8n_get_workflow → full JSON
3. Snapshot: store JSON locally with timestamp + source instance ID
4. Include: nodes, connections, settings, staticData (NOT credentials — they live per-instance)
```

## Phase 2 — Audit (find what must change)

Scan exported JSON for environment-coupled values:

| Type | Examples | Action |
|---|---|---|
| Credential references | `credentials: { slackApi: "<id>" }` | Mark for re-map (Phase 3) |
| Webhook paths/URLs | absolute test webhook URLs | Mark for re-map |
| Env-specific URLs | `https://api.staging.example.com` | Mark for re-map |
| Hardcoded env vars | `https://api.{{ $env.REGION }}.example.com` | Verify target has same env vars |
| Instance-specific IDs | data table IDs, vector store IDs | Mark for re-map |
| Webhook paths | `webhook/abc123-prod` | Mark for re-map (often change per env) |

## Phase 3 — Re-map

User provides mapping tables (or skill derives from naming convention):

```yaml
credentials:
  slackApi: "src-cred-id"  →  "dst-cred-id"
  pgMain:   "src-cred-id"  →  "dst-cred-id"

urls:
  "https://api.staging.example.com": "https://api.prod.example.com"

env_vars:
  REGION: "us-east-1"  →  "us-east-1"  # verify same
  LOG_LEVEL: "debug"   →  "warn"

webhook_paths:
  "webhook/abc-staging"  →  "webhook/abc-prod"
```

Apply mappings to exported JSON. Refuse to proceed if any mapping is missing for a flagged value.

## Phase 4 — Version diff (CRITICAL)

If source and target run different n8n versions, node schemas may differ:

```
1. For each node in workflow:
   a. Read source node's typeVersion (e.g., "typeVersion": 4)
   b. Query target instance: get_node with same nodeType
   c. Compare typeVersion + properties
2. Classify changes:
   - Identical → no action
   - Backwards-compatible (new optional field) → no action
   - Breaking (renamed/removed field, type change) → emit FIX-REQUIRED report
3. If any FIX-REQUIRED:
   - Apply known migration recipes (below)
   - For unknown breaking changes → escalate to user
```

### Known migration recipes

| From → To | Change | Recipe |
|---|---|---|
| HTTP Request v3 → v4 | `body` field renamed to `jsonBody` (for JSON) | Auto-rename if `contentType=json` |
| Code v1 → v2 | New `pythonCode` field added (was JS only) | If JS → no action; if migrating to Python → reconfigure |
| IF v1 → v2 | Operator structure changed | Auto-sanitization handles on save |
| Slack v2 → v3 | `channel` accepts both ID and name | No action |

(Maintain this table in your migration runbook as you encounter more cases.)

## Phase 5 — Import + validate

```
1. Connect to target instance MCP
2. n8n_create_workflow with the re-mapped JSON
3. n8n_validate_workflow with profile=runtime
4. If errors → STOP, route to n8n-validation-expert
5. If clean → handoff to Phase 6
```

## Phase 6 — Test before activation

**MANDATORY** — never activate a migrated workflow without tests.

```
1. Hand off to n8n-workflow-tester with the imported workflow ID
2. Run full test plan (happy + edge + error paths)
3. If all pass → activate
4. If any fail → keep workflow inactive, report to user with diff
```

## Output format

```
MIGRATION REPORT — <workflow name>
────────────────────────────────────
SOURCE:  <instance URL> (n8n v<X>)
TARGET:  <instance URL> (n8n v<Y>)
PHASES:
  1. Export        ✅
  2. Audit         ✅ (12 flagged values)
  3. Re-map        ✅ (12/12 mapped)
  4. Version diff  ⚠️ (1 breaking change: HTTP v3→v4)
  5. Import        ✅ (validation clean)
  6. Test          ✅ (4/4 fixtures passed)

VERDICT: ready to activate
```

## Routing

FROM here, GO TO:
- **n8n-mcp-tools-expert** — all import/export calls
- **n8n-validation-expert** — on import errors
- **n8n-workflow-tester** — MANDATORY before activation
- **n8n-credentials-architect** — if target instance is missing credentials
- **user** — for unknown breaking changes OR missing mappings

STAY here UNTIL: workflow is imported AND validated AND tested AND ready (or user explicitly aborts).

## Anti-patterns

- ❌ Skipping Phase 4 (version diff) — silent breakage
- ❌ Skipping Phase 6 (testing) — even "trivial" migrations
- ❌ Activating immediately on import (run tester first)
- ❌ In-place edits to exported JSON without snapshot
- ❌ Assuming target has same credentials (they don't — instance-specific)

## Summary

6 phases, mandatory order. Export → audit → re-map → version-diff → import+validate → test. Never activate without test phase. Re-mapping requires user input for credentials/URLs. Snapshot before edit. Test after every migration.
