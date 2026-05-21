<!-- v3 | agente: claude-code | 2026-05-21 -->
# Harden (Claude Code)

Make interfaces production-ready: error handling, i18n, text overflow, edge cases, resilience under real-world data.

## Use this command when

User says: "harden", "production-ready", "edge cases", "error states", "i18n", "overflow", "real data".

## The 8 dimensions of hardening

### 1. Error states (every async op)
- Network failures: retry UX, offline UX, fallback content
- Auth failures: re-auth flow, session expiry, scope changes
- Validation failures: inline, accessible, recoverable
- Server errors (5xx): user-facing message ≠ stack trace; report channel
- Permission errors: explain why, not just "denied"

### 2. Loading states (every async op)
- Skeleton vs spinner vs progress bar — pick based on duration
- <300ms: nothing
- 300ms-1s: subtle indicator
- 1s-3s: skeleton matching final layout
- 3s+: progress + cancel
- Optimistic UI where safe; rollback on failure

### 3. Empty states
- First-run empty (user has no data yet)
- Filtered-to-empty (user filtered everything out)
- Search-no-results
- Permission-denied (looks like empty)
- Each with appropriate CTA: create / clear filter / refine search / request access

### 4. Text overflow
- `text-overflow: ellipsis` with `min-width: 0` on flex children
- Multi-line clamp with `-webkit-line-clamp` + fallback
- Number formatting at scale (1,234 / 1.2K / 1.2M)
- Test with worst-case strings: long names, emoji clusters, RTL, Asian wide chars

### 5. i18n
- All copy externalized to translation keys (no hardcoded English)
- Pluralization via ICU MessageFormat (not `count + " items"`)
- Date/number/currency via `Intl.*`
- RTL support: `dir="rtl"` tested visually, logical properties (`margin-inline-start`) not directional
- Text expansion: German +30%, Russian +20%, Japanese -50% — layout flexible

### 6. Edge cases (real-world data)
- Names: 1 char to 100+ chars, special chars, multi-script
- Emails: long local parts, IDN domains
- Phone numbers: international formats
- URLs: very long, with query strings, with anchors
- Dates: timezone-aware, locale-formatted, future/past
- Currency: large amounts (1B+), negative, multi-currency
- Lists: 0, 1, 2, 10, 100, 10000 items
- Tables: very long content per cell, very many rows

### 7. Permissions & access
- Disabled UI for restricted actions (with tooltip explaining why)
- Read-only mode (whole surface or per-section)
- Trial/free/paid tier gating
- Beta feature flags

### 8. Resilience
- Stale data indicators
- Concurrent edit conflict UX
- Offline-first patterns (if applicable)
- Save state: explicit ("Saved") vs implicit (autosave with status)

## Routing

FROM `harden`, suggest GO TO:

| When harden reveals... | Suggest |
|---|---|
| Want to verify all hardening | `audit` (technical gates run all dimensions) |
| Copy in error states is unclear | `clarify` |
| Loading states need motion | `animate` (subtle, functional) |

STAY in `harden` UNTIL: 8 dimensions covered AND tested with worst-case data.

## Anti-patterns

- ❌ Hardening only the happy path (every dimension matters)
- ❌ Hardcoded English strings during hardening (defeats i18n)
- ❌ `text-overflow: ellipsis` without `min-width: 0` (fails in flex)
- ❌ Trying to make error states "delightful" (be clear, not cute)
- ❌ Skipping permission/access dimension because "we don't have that yet" (you will)
