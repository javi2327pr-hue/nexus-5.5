<!-- v3 | agente: codex | 2026-05-21 -->
# Audit (Codex)

```
Step 1: Determine scope
  arg=(none)        → whole project (warn: heavy)
  arg=<feature>     → glob files matching feature
  arg=<page>        → route or page
  arg=<component>   → single component file

Step 2: Run 5 dimensions

  2.1 A11y (WCAG 2.1 AA)
      - actual contrast measurement (not eyeball)
      - keyboard nav + focus states (every interactive)
      - prefers-reduced-motion (every animation)
      - semantic HTML first, ARIA supplement
      - form labels + error association
      - 8th-grade reading level

  2.2 Performance
      - bundle size per route + total
      - LCP / CLS / INP measurements
      - image format + responsive srcset + lazy
      - font-display + subset + preload
      - JS payload vs feature scope

  2.3 Theming
      - dark mode integrity if claimed
      - prefers-color-scheme match + user override
      - no hardcoded colors breaking theme

  2.4 Responsive
      - 320 / 768 / 1024 / 1440 / 2560
      - touch targets ≥44x44 on coarse pointer
      - container queries where needed
      - no horizontal scroll on mobile

  2.5 Anti-patterns (deterministic engine)
      Run: npx impeccable detect <target>
      Cross-reference flags with rule metadata

Step 3: Score by severity
  P0 = ships broken
  P1 = real defect
  P2 = quality gap
  P3 = polish opportunity

Step 4: Emit report
  AUDIT REPORT — <target>
  A11y: P0 P1 P2 P3 counts
  Perf: LCP CLS INP bundle
  Theming: pass | partial | fail
  Responsive: pass | partial | fail at <breakpoint>
  Anti-patterns: <count> deterministic flags

  FINDINGS (sorted P0 → P3):
    [Px] <issue> @ file:line
         Why: <reason>
         Fix: <concrete action>
         Suggest: /impeccable <command>

Step 5: Route
  UX flow issue        → /impeccable critique
  perf dominant        → /impeccable optimize
  responsive misses    → /impeccable adapt
  edge cases / i18n    → /impeccable harden
  copy issues          → /impeccable clarify
  anti-pattern flag    → apply specific fix per rule metadata
```

## Anti-patterns
```
❌ Eyeball contrast instead of measure
❌ Skip npx impeccable detect
❌ Bundle P0-P3 into single list
❌ Audit whole project when user scoped it
```
