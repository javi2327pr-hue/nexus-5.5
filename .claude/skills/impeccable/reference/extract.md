<!-- v3 | agente: claude-code | 2026-05-21 -->
# Extract (Claude Code)

Pull reusable patterns, components, and design tokens into the design system. Consolidate drift.

## Use this command when

User says: "extract", "consolidate", "design system", "reusable", "drift", "patterns repeated".

## What extract does

Walk the codebase looking for:
- **Repeated CSS** patterns → extract as a token / utility class / component variant
- **Repeated JSX/component shapes** → propose as a shared component
- **Near-duplicate values** (e.g., 13/14/15px spacing) → propose canonical scale step
- **Inline styles** that should be tokens → flag

## 4 extract moves

### 1. Token consolidation
- Find values used ≥3 times across the codebase
- Propose them as `--token-*` CSS variables in `tokens.css`
- Update DESIGN.md with the new tokens

### 2. Component extraction
- Find JSX/HTML shapes that appear ≥3 times
- Propose as a shared component with variants
- Keep the variant API minimal (don't over-design)

### 3. Pattern documentation
- Capture how patterns should be used (placement, semantics, examples)
- Add to component file as JSDoc/component doc

### 4. Drift detection (read-only mode)
With `--report-only`: don't modify, just produce a report of:
- Repeated values not in tokens
- Repeated components not yet extracted
- Inline styles that should be tokenized

## Output

```
EXTRACT REPORT
══════════════════════════════════════
Tokens proposed: <N>
  --color-warm-cream-tint: oklch(96% 0.005 350)  (used 7 times)
  --space-card-padding: clamp(1rem, 2vw, 1.5rem) (used 4 times)
  ...

Components proposed: <N>
  <Stat>: used 6 times (label + value pattern)
  <Chip>: used 4 times (tag with optional icon)
  ...

Inline-style flags: <N>
  ...
```

User approves → script writes the changes.

## Routing

FROM `extract`, suggest GO TO:

| When... | Suggest |
|---|---|
| Extracted tokens reveal coverage gaps | `document` (refresh DESIGN.md) |
| Extracted components need motion | `animate` |
| Drift cleanup as part of extract | `polish` |

STAY in `extract` UNTIL: drift consolidated, tokens added to DESIGN.md, components in shared library.

## Anti-patterns

- ❌ Extracting one-off (used once) into a "reusable" component
- ❌ Over-designing variant API (start with what's needed)
- ❌ Keeping inline styles as "performance" (real perf is bundle, not style attribute)
- ❌ Skipping `--report-only` first pass on large codebases
