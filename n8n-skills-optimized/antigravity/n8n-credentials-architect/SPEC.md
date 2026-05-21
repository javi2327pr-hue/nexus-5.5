<!-- v1 | agente: antigravity | 2026-05-21 -->

# n8n Credentials Architect — Antigravity spec

## Goal
Manage n8n credentials with least-privilege scoping. Provision new credentials with minimum scope, migrate hardcoded secrets to managed credentials, right-size over-scoped credentials, re-authenticate OAuth, clean up orphans, rotate on schedule. Eliminate the #1 audit finding (hardcoded + over-scoped secrets) without escalation.

## Autonomy boundaries
- Provision new credentials with scope from the Scope Matrix without confirmation
- Migrate hardcoded secrets (after audit flag) without confirmation
- Right-size over-scoped credentials autonomously (with migration pattern, not in-place)
- Re-authenticate OAuth via silent refresh without confirmation
- Delete orphan credentials ONLY with user confirmation
- Rotate per schedule autonomously, with workflow-tester verification
- WARN user before granting financial-scope (Stripe charge, payment APIs)
- ESCALATE when OAuth requires interactive consent

## Acceptance criteria
1. Every new credential has minimum scope from Scope Matrix
2. No workflow contains hardcoded secrets after MIGRATE
3. Every credential has tags: workflow_id, owner, created_at, scope_justification
4. Right-sizing uses migration pattern (new credential → switch → delete old), never in-place shrink
5. Every credential swap verified by n8n-workflow-tester before considered done
6. Orphan deletion requires user confirmation
7. Rotation includes source-side secret revocation after target-side success
8. After MIGRATE, user is warned that previously-leaked secrets must be rotated at source

## Optional checkpoints
- Confirm before granting any financial scope (charge:write, payment APIs)
- Confirm before granting wildcard or full-access scope (e.g., GitHub `repo` instead of `repo:status`)
- Confirm orphan deletions
- Otherwise: autonomous

## Inputs / outputs
- Input: mode (PROVISION/MIGRATE/RIGHT_SIZE/RE_AUTH/CLEANUP/ROTATE) + context
- Output: credential operation result + tests verdict + handoff target

## Success metric
- 0 hardcoded secrets in any workflow after audit pass
- 100% of credentials have least-privilege scope per Scope Matrix
- 0 broken workflows post credential swap (because workflow-tester runs)
- ≤90 days max age for API keys / DB passwords
- 0 orphan credentials older than 30 days

## Failure mode handling
- Refresh token expired or interactive consent needed → escalate with re-auth URL
- Scope reduction causes workflow failure → revert switch, investigate which operation needs broader scope
- Source-side revocation fails after target-side rotation → escalate (mixed state risk)
- Multiple workflows share over-scoped credential → migrate each separately, never in-place shrink

## Reference

### Scope Matrix (least-privilege presets — extract)
| Service | Operation | Scope |
|---|---|---|
| Slack | postMessage to one channel | chat:write + channel allow-list |
| GitHub | comment on PRs | repo:status + repo scope |
| Stripe | charge | charge:write (WARN — financial) |
| AWS S3 | read one bucket | s3:GetObject + bucket ARN |
| Postgres | one table CRUD | DB role grants on that table only |
| LLM | inference | API key + spend cap |

Full matrix lives in the SKILL.md.

### Rotation schedule defaults
- API keys: 90 days
- DB passwords: 90 days
- OAuth refresh tokens: per provider policy
- JWTs: per exp claim
