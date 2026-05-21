<!-- v3 | agente: codex | 2026-05-21 -->
# Extract (Codex)

```
Step 1: Walk codebase for patterns
  - Repeated CSS values used ≥3 times
  - JSX/HTML shapes appearing ≥3 times
  - Near-duplicates (13/14/15px → canonical 14px)
  - Inline styles that should be tokens

Step 2: Token consolidation
  - Propose --token-* CSS vars in tokens.css
  - Update DESIGN.md with new tokens

Step 3: Component extraction
  - Find ≥3-use shapes → propose shared component
  - Keep variant API minimal (don't over-design)
  - Add component doc (placement, semantics, examples)

Step 4: --report-only mode (large codebases)
  Don't modify. Produce report:
    EXTRACT REPORT
    Tokens proposed: N
      --color-warm-cream-tint: oklch(96% 0.005 350)  (used 7 times)
      --space-card-padding: clamp(1rem, 2vw, 1.5rem) (used 4 times)
    Components proposed: N
      <Stat>: used 6 times (label + value pattern)
      <Chip>: used 4 times (tag with optional icon)
    Inline-style flags: N

Step 5: User approves → write changes

Step 6: Route
  coverage gaps revealed   → /impeccable document (refresh DESIGN.md)
  components need motion   → /impeccable animate
  drift cleanup as part    → /impeccable polish
```

## Anti-patterns
```
❌ Extract one-off (used once) into "reusable"
❌ Over-design variant API (start with what's needed)
❌ Keep inline styles as "performance" (perf is bundle, not style attr)
❌ Skip --report-only on large codebase
```
