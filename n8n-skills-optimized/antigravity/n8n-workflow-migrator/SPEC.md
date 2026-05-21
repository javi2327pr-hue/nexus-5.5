<!-- v1 | agente: antigravity | 2026-05-21 -->

# n8n Workflow Migrator — Antigravity spec

## Goal
Move n8n workflows between instances (dev→staging→prod) or across n8n versions. Handle credential re-mapping, URL re-mapping, version diffing, and validate+test on the target before activation. Replace 30-minute manual migrations with <2-minute autonomous flow.

## Autonomy boundaries
- Execute the 6 phases in mandatory order without confirmation
- Apply known version-migration recipes autonomously
- Snapshot exported JSON before any mutation
- Do NOT skip Phase 4 (version diff) — even if instances are the same version
- Do NOT skip Phase 6 (testing) — even for "trivial" migrations
- Do NOT activate the target workflow yourself — hand off READY_TO_ACTIVATE to user
- ESCALATE when any required mapping is missing (credentials, URLs, env vars)
- ESCALATE on unknown breaking version changes

## Acceptance criteria
1. All 6 phases executed in order: Export → Audit → Re-map → Version diff → Import+validate → Test
2. Snapshot of exported JSON stored before any mutation
3. Every flagged environment-coupled value re-mapped or escalated
4. Version diff classifies every node as IDENTICAL / BACKWARDS_COMPAT / BREAKING
5. Known breaking changes auto-handled via migration recipes
6. Unknown breaking changes escalated with full diff
7. Import succeeds AND validation clean before Phase 6
8. n8n-workflow-tester ran with all fixtures passing before READY_TO_ACTIVATE verdict
9. Final report includes per-phase status and target workflow_id

## Optional checkpoints
- Confirm credential mapping when ambiguous (multiple credentials of same type on target)
- Confirm before activating after migration (user retains final activation control)
- Otherwise: autonomous

## Inputs / outputs
- Input: source_instance, target_instance, workflow_id, mappings (creds/URLs/env)
- Output: MIGRATION REPORT with phase-by-phase status + verdict + target workflow_id

## Success metric
- Average migration time ≤ 2 minutes (vs ~30 min manual)
- 0 silent breakage from version mismatches (caught in Phase 4)
- 0 broken workflows activated post-migration (Phase 6 gate)
- 100% of migrations include test verification

## Failure mode handling
- Required mapping missing → STOP, ask user (do not assume)
- Unknown breaking version change → escalate with full diff, ask user for recipe
- Import validation fails → handoff to n8n-validation-expert
- Test phase fails → leave workflow inactive on target, report diff
- Target missing credentials → handoff to n8n-credentials-architect for provisioning

## Reference

### Tagged value types (Phase 2)
CREDENTIAL_REF, URL, ENV_VAR, WEBHOOK_URL, INSTANCE_ID (data tables, vector stores)

### Known version-migration recipes
| From → To | Recipe |
|---|---|
| HTTP Request v3 → v4 | rename `body` → `jsonBody` if contentType=json |
| Code v1 → v2 | ensure pythonCode field for python mode |
| IF v1 → v2 | no manual action (auto-sanitization) |
| Slack v2 → v3 | no action (backwards compat) |

(Maintain this table as new cases are encountered.)

### Phase gates (non-negotiable)
- Phase 4 cannot be skipped (silent breakage)
- Phase 6 cannot be skipped (untested migration)
- Activation cannot be done by this skill (user responsibility)
