<!-- v3 | agente: codex | 2026-05-21 -->
# Harden (Codex)

```
Step 1: Error states (every async op)
  - network: retry, offline, fallback content
  - auth: re-auth flow, session expiry, scope changes
  - validation: inline, accessible, recoverable
  - 5xx: user-facing message ≠ stack trace; report channel
  - permission: explain why

Step 2: Loading states (every async op)
  - <300ms       → nothing
  - 300ms-1s     → subtle indicator
  - 1s-3s        → skeleton matching final layout
  - 3s+          → progress + cancel
  - Optimistic UI where safe; rollback on failure

Step 3: Empty states
  - first-run, filtered-to-empty, no-search-results, permission-denied
  - each with appropriate CTA: create/clear/refine/request

Step 4: Text overflow
  - ellipsis + min-width: 0 on flex children
  - multi-line clamp + fallback
  - number formatting at scale (1,234 / 1.2K / 1.2M)
  - test worst-case: long names, emoji, RTL, Asian wide chars

Step 5: i18n
  - all copy → translation keys (no hardcoded English)
  - ICU MessageFormat for pluralization
  - Intl.* for date/number/currency
  - dir="rtl" + logical properties (margin-inline-start)
  - text expansion: German +30%, Russian +20%, Japanese -50%

Step 6: Edge cases (real data)
  - names: 1 to 100+ chars, special chars, multi-script
  - emails: long local parts, IDN domains
  - phone: international formats
  - URLs: long, query strings, anchors
  - dates: timezone-aware, locale-formatted, past/future
  - currency: 1B+, negative, multi-currency
  - lists: 0, 1, 2, 10, 100, 10000
  - tables: very long content, very many rows

Step 7: Permissions & access
  - disabled UI for restricted (tooltip explains)
  - read-only mode (whole or per-section)
  - tier gating
  - beta flags

Step 8: Resilience
  - stale data indicators
  - concurrent edit conflict UX
  - offline-first (if applicable)
  - save state: explicit vs implicit

Step 9: Route
  verify all                       → /impeccable audit
  copy unclear in error states     → /impeccable clarify
  loading needs motion             → /impeccable animate
```

## Anti-patterns
```
❌ Harden only happy path
❌ Hardcoded English strings
❌ ellipsis without min-width: 0 (fails in flex)
❌ "Delightful" error states (be clear)
❌ Skip permissions ("we don't have that yet")
```
