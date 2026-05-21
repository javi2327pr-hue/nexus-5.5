<!-- v3 | agente: antigravity | 2026-05-21 -->
# Adapt (Antigravity)

## Goal
Adapt design across screen sizes (content-driven breakpoints), devices (touch targets), contexts (print/dark/low-power/slow-conn) using 6 moves (fluid type, fluid spacing, reflow, touch targets, container queries, context adaptation).

## Autonomy boundaries
- Add breakpoints when layout breaks (content-driven)
- Apply fluid type via clamp() on headlines; fixed body per breakpoint
- Reflow at each breakpoint (not just scale down)
- Apply 44×44 minimum touch targets at coarse pointer
- Use container queries where component-level responsiveness genuinely matters
- Apply context adaptations: print, dark, low-power, slow-conn
- Do NOT use device-driven breakpoints (375px = "iPhone") — content-driven only
- Do NOT shrink desktop layout for mobile
- Do NOT add breakpoints reflexively from a list

## Acceptance criteria
1. Breakpoints added only where layout demands
2. Headlines use clamp(min, vw+offset, max)
3. Section/hero/grid spacing fluid (clamp or container queries)
4. Each breakpoint reflows (not just scales)
5. Touch targets ≥44×44 at coarse pointer
6. Container queries used surgically (not blanket)
7. Print stylesheet present if site has long-form content
8. Reduced-motion + low-power context adaptations applied
9. Test matrix verified: 375, 768, 1024, 1440, 2560 (+ print, dark, reduced)

## Optional checkpoints
- Confirm before adding a breakpoint to a design system that has fewer
- Confirm before changing nav strategy (hamburger vs visible)
- Otherwise: autonomous

## Inputs / outputs
- Input: target + optional context (mobile, tablet, print, etc.)
- Output: responsive CSS diffs + test matrix verification

## Success metric
- 0 device-driven hardcoded breakpoints
- 100% touch targets meet 44×44 at coarse pointer
- 0 shrink-not-reflow instances
- All test-matrix breakpoints verified

## Failure mode handling
- Container queries unsupported on target browsers → fall back to viewport queries with explanation
- Print stylesheet conflicts with web → scope under @media print
- Touch + mouse hybrid devices → respect pointer media, not screen size
- Reflow requires content decisions (priority order on mobile) → ask user
