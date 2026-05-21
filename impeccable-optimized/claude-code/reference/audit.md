<!-- v3 | agente: claude-code | 2026-05-21 -->
# Audit (Claude Code)

Technical quality checks: a11y, performance, theming, responsive, anti-patterns. Generates P0-P3 scored report.

## Use this command when

User says: "audit", "accessibility check", "performance audit", "technical review", "pre-ship checklist".

## Scope by argument

| Argument | Scope |
|---|---|
| (none) | Whole project (heavy — consider scoping) |
| `<feature>` | Files matching the feature (e.g., `audit checkout`) |
| `<page>` | Specific route or page |
| `<component>` | A single component file |

## Audit dimensions (5)

### 1. Accessibility (WCAG 2.1 AA baseline)
- Color contrast ratios — actual contrast checks, not eyeballing
- Keyboard navigability + visible focus states (every interactive element)
- `prefers-reduced-motion` respected (every animation)
- Semantic HTML first, ARIA as supplement
- Form labels, error association, fieldset/legend usage
- Reading level 8th-grade (jargon only where it's the actual vocabulary)

### 2. Performance
- Bundle size (per-route + total)
- LCP / CLS / INP (Core Web Vitals)
- Image: format (WebP/AVIF), responsive `srcset`, lazy loading
- Font loading strategy (`font-display`, subsetting, preload)
- JS payload — does it ship more than the feature needs

### 3. Theming
- Dark mode support if claimed; visual integrity in both
- `prefers-color-scheme` matches; user override stored
- No hardcoded colors that break theme switch

### 4. Responsive
- Breakpoint behavior at 320, 768, 1024, 1440, 2560
- Touch targets ≥44×44px on coarse pointer
- Container queries used where layout needs them
- Text overflow handled (no horizontal scroll on mobile)

### 5. Anti-patterns (run deterministic engine)

```bash
npx impeccable detect <target>
```

Returns the 27 deterministic rule flags. Cross-reference each with `cli/engine/detect-antipatterns.mjs` rule metadata to explain *why*.

## Severity scoring

| P | Meaning | Examples |
|---|---|---|
| P0 | Ships broken | Contrast <3:1 on body text; keyboard trap; horizontal scroll on mobile |
| P1 | Real defect | Missing focus state; img without alt; reduced-motion ignored |
| P2 | Quality gap | Slight contrast gap; weak focus ring; placeholder-as-label |
| P3 | Polish opportunity | Could be tighter; minor inconsistency |

## Report format

```
AUDIT REPORT — <target>
═══════════════════════════════════════════
A11y:       <P0 count> P0 · <P1> P1 · <P2> P2 · <P3> P3
Perf:       LCP <ms> · CLS <num> · INP <ms> · bundle <KB>
Theming:    <pass|partial|fail>
Responsive: <pass|partial|fail at breakpoint>
Anti-patterns: <count> deterministic flags

FINDINGS (sorted P0 → P3):
  [P0] <issue> @ <file:line>
       Why: <reason>
       Fix: <concrete action>
       Routing: <suggest command>
  ...
```

## Routing

FROM `audit`, suggest GO TO:

| When you find... | Suggest |
|---|---|
| Bad UX flow surfaced (not just technical) | `critique` |
| Perf issues dominate | `optimize` |
| Responsive misses | `adapt` |
| Edge cases / overflow / i18n gaps | `harden` |
| Copy issues | `clarify` |
| Anti-pattern from `detect` | (apply specific fix; rule maps to `skillSection`) |

STAY in `audit` UNTIL: full target scanned, report emitted, P0s acknowledged.

## Anti-patterns

- ❌ Eyeballing contrast instead of measuring
- ❌ Skipping `npx impeccable detect` (lose 27 deterministic checks)
- ❌ Bundling P0-P3 into a single "issues" list (severity matters for triage)
- ❌ Auditing the whole project when user said "the checkout page"
