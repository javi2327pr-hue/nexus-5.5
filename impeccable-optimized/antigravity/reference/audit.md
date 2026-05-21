<!-- v3 | agente: antigravity | 2026-05-21 -->
# Audit (Antigravity)

## Goal
Generate a P0-P3 scored technical quality report across 5 dimensions (a11y, performance, theming, responsive, anti-patterns) for a scoped target. Findings include concrete fixes and routing suggestions.

## Autonomy boundaries
- Determine scope from argument (none = whole project, else glob/route/component)
- Run all 5 dimensions automatically
- Run deterministic anti-pattern engine (`npx impeccable detect`) — never substitute LLM inference
- Measure contrast/perf via actual tools, never eyeball
- Score every finding P0-P3 explicitly
- Do NOT propose fixes outside the audit's scope (those are routing suggestions, not fixes)
- Do NOT auto-fix P0 issues (audit is read-only; fixes go to specific commands)

## Acceptance criteria
1. Scope determined from argument
2. All 5 dimensions executed
3. Anti-pattern engine ran (`npx impeccable detect`) AND flags cross-referenced with rule metadata
4. Every finding has: severity (P0-P3), file:line, why, fix, routing suggestion
5. Findings sorted P0 → P3
6. Report includes summary counts + headline metrics (LCP, CLS, INP, bundle size)
7. Routing suggestion emitted (or "ready to ship" if all clean)

## Optional checkpoints
- Confirm scope if argument is ambiguous (e.g., "audit checkout" with multiple checkout files)
- Confirm before re-running on large project (>500 files) to avoid runtime cost
- Otherwise: autonomous

## Inputs / outputs
- Input: scope argument
- Output: structured report (5 dimensions × P0-P3 findings) + routing matrix

## Success metric
- 0 false-negative P0 (everything that ships broken is flagged)
- ≥95% of P0/P1 findings have actionable fix text
- 100% of anti-pattern flags cross-referenced with rule metadata
- 0 contrast/perf claims based on eyeballing

## Failure mode handling
- `npx impeccable detect` fails or unavailable → fall back to LLM-based slop test only, mark report incomplete, suggest CLI install
- Headless browser unavailable for perf metrics → mark Perf dimension as "skipped — browser unavailable", proceed with other 4
- Target scope returns zero files → ask user to clarify scope
- All dimensions return 0 findings → emit "ready to ship" + suggest `polish` as final pass
