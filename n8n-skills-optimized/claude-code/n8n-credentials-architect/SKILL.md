<!-- v1 | agente: claude-code | 2026-05-21 -->
---
name: n8n-credentials-architect
description: Manage n8n credentials with least-privilege scoping, rotation, and audit-driven cleanup. Trigger when any workflow needs a credential, when n8n_audit_instance flags hardcoded secrets or over-scoped creds, or when OAuth re-auth is needed.
---

# n8n Credentials Architect

## Use this skill when

- A workflow needs a credential → run **Provision** (least-privilege from start)
- `n8n_audit_instance` flagged hardcoded secrets → run **Migrate**
- `n8n_audit_instance` flagged over-scoped credentials → run **Right-size**
- OAuth token expired → run **Re-auth**
- Credential not used by any workflow → run **Cleanup**
- Scheduled rotation due → run **Rotate**

## Core principle: least privilege

Every credential must have the **smallest scope** required for its target operation. Default n8n provisioning often grants over-broad scopes (e.g., `slack:write` for everything). Right-size based on the specific operations the workflow performs.

## Provision (new credential)

```
1. Identify target service + operation(s) the workflow performs
2. Look up minimal scope from Scope Matrix (below)
3. Use n8n_manage_credentials action=create with that scope
4. Reference credential by ID in workflow (never inline)
5. Tag credential: { workflow_id, owner, created_at, scope_justification }
```

## Scope Matrix (least-privilege presets)

| Service | Operation | Minimum scope |
|---|---|---|
| Slack | postMessage to one channel | `chat:write` + channel allow-list |
| Slack | read channel history | `channels:history` (specific channel) |
| Google Sheets | read one sheet | `sheets.readonly` + file ID restriction |
| Google Sheets | write one sheet | `sheets` + file ID restriction |
| GitHub | comment on PRs in one repo | `repo:status` + repo scope (NOT `repo` full) |
| GitHub | full repo access | `repo` (justify why broader needed) |
| Stripe | read customers | `customer:read` |
| Stripe | charge | `charge:write` (warn user — financial scope) |
| Postgres | one table CRUD | DB role with grants on that table only |
| AWS S3 | read one bucket | IAM policy `s3:GetObject` on that bucket ARN |
| AWS S3 | write one bucket | + `s3:PutObject` on that bucket ARN |
| OpenAI / Anthropic | inference | API key (no granular scope — set spend cap instead) |

When a service supports it, **always** use:
- Resource-level allow-listing (specific channel, sheet, repo, bucket)
- Read-only when read is sufficient
- Time-limited tokens

## Migrate (hardcoded → credential)

When `n8n_audit_instance` flags hardcoded secrets in parameters:

```
1. Identify all nodes with hardcoded secrets (audit output lists them)
2. For each:
   a. Create proper credential with minimum scope
   b. Update node to reference credential ID
   c. Validate workflow still passes
3. After all migrated:
   a. Re-run n8n_audit_instance
   b. Confirm hardcoded secrets count = 0
   c. Rotate the previously-leaked secrets (they were in workflow JSON history)
```

## Right-size (over-scoped → minimum)

When audit flags over-scoped credentials:

```
1. Read credential current scopes
2. Read all workflows that use this credential
3. Map workflows → operations → minimum required scopes (Scope Matrix)
4. Union of minimum scopes = new scope set
5. Create NEW credential with reduced scope
6. Switch workflows to new credential one at a time
7. Run n8n-workflow-tester after each switch
8. When all switched: delete old credential
```

Do NOT shrink scope of a credential in-place if multiple workflows depend on it — create new + switch incrementally to avoid breaking unrelated workflows.

## Re-auth (OAuth expired)

```
1. Detect 401/expired from observability-monitor
2. Read credential type + auth flow
3. If refresh_token present + valid → silent refresh, retry execution
4. If refresh failed OR consent required → escalate to user with re-auth URL
5. After re-auth: re-run failed execution + clear incident
```

## Cleanup (orphan credentials)

```
1. List all credentials via n8n_manage_credentials action=list
2. List all workflows + extract credential references
3. orphans = credentials NOT in any workflow
4. For each orphan:
   a. Confirm with user (may be reserved for future use)
   b. Delete via n8n_manage_credentials action=delete
```

## Rotate (scheduled rotation)

Default rotation schedule:
- API keys: every 90 days
- OAuth refresh tokens: per provider policy (often 6mo - never)
- Database passwords: every 90 days
- Service account JWTs: per JWT exp claim

```
1. Generate new secret at the source (Slack admin, GitHub settings, etc.)
2. Update credential via n8n_manage_credentials action=update
3. Run n8n-workflow-tester on all dependent workflows
4. If all green → revoke old secret at source
5. If any failure → rollback credential + investigate
```

## Audit integration

When `n8n_audit_instance` returns:
- `hardcoded_secrets > 0` → run **Migrate**
- `over_scoped_credentials > 0` → run **Right-size**
- `orphan_credentials > 0` → run **Cleanup**
- `expired_credentials > 0` → run **Re-auth** for each

## Routing

FROM here, GO TO:
- **n8n-mcp-tools-expert** — to actually call `n8n_manage_credentials`
- **n8n-workflow-tester** — after any credential swap (verify workflows still work)
- **n8n-observability-monitor** — to register rotation schedule
- **user** — for re-auth consent OR scope changes that need approval

STAY here UNTIL: credentials are least-privilege AND no hardcoded secrets AND no orphans.

## Anti-patterns

- ❌ Granting wildcard scope ("just in case")
- ❌ Hardcoding secrets in parameters (use credential reference)
- ❌ In-place scope reduction on shared credentials (use migration pattern)
- ❌ Skipping workflow-tester after credential swap
- ❌ Deleting orphans without user confirmation

## Summary

Least privilege from creation, right-size existing, migrate hardcoded, cleanup orphans, rotate on schedule. Audit-driven workflow. Always test after swap. Always escalate financial-scope creations.
