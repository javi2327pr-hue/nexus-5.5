<!-- v3 | agente: antigravity | 2026-05-21 -->
# Harden (Antigravity)

## Goal
Make a feature production-ready across 8 dimensions: error states, loading states, empty states, text overflow, i18n, edge cases (real-world data), permissions/access, resilience. Output: diffed file changes per dimension + verification.

## Autonomy boundaries
- Run all 8 dimensions on the scoped target
- Apply patterns from each dimension's catalog
- Externalize hardcoded strings during i18n pass
- Test with worst-case data autonomously
- Do NOT add new features during hardening
- Do NOT make error states "delightful" (clarity over personality)
- Do NOT skip permissions dimension because "not implemented yet" (forward-compat)

## Acceptance criteria
1. Every async op has: error state + loading state per duration table
2. Every list view has empty states for first-run / filtered / search / permission
3. All flex children with truncation have `min-width: 0`
4. All copy externalized to translation keys (no hardcoded literals)
5. Pluralization via ICU MessageFormat
6. Logical CSS properties used (margin-inline-start, not margin-left) for RTL readiness
7. Worst-case data tested: long names, IDN emails, 10000-item lists, 1B+ currency
8. Disabled/read-only states for restricted actions (tooltip explains)
9. Save state communicated (explicit "Saved" or implicit autosave indicator)
10. Routing suggestion if dimension reveals deeper issue

## Optional checkpoints
- Confirm before externalizing copy if no i18n infrastructure exists
- Confirm before adding permission gates if no permissions system yet
- Confirm worst-case data scope (cost of testing 10000-item list)
- Otherwise: autonomous

## Inputs / outputs
- Input: target (feature, page, component)
- Output: file diffs per dimension + worst-case data test results

## Success metric
- 0 hardcoded English strings remaining (i18n complete)
- 0 truncation bugs in flex layout (min-width: 0 applied)
- 100% of async ops have both error + loading states
- 0 stack traces visible to end users
- 0 "delightful" error states (clarity over cute)

## Failure mode handling
- No i18n infrastructure → bootstrap minimal (keys file), externalize, suggest user wire formal i18n
- Permissions system absent → add forward-compat patterns (CSS classes + ARIA), suggest user implement gating later
- Worst-case test reveals fundamental layout break → STOP, suggest layout command
- Empty states require copy decisions → AskUserQuestion (tone, CTA)
