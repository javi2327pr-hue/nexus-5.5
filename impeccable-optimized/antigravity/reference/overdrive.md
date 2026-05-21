<!-- v3 | agente: antigravity | 2026-05-21 -->
# Overdrive (Antigravity)

## Goal
Push interface past conventional limits via ONE technically ambitious moment (shader/spring/scroll/3D) on one of 5 surfaces (hero, interaction signature, data viz, loading, empty state) while meeting non-negotiable technical constraints.

## Autonomy boundaries
- Pick exactly ONE surface and ONE technical approach per product
- Implement within technical constraints (60fps, reduced-motion fallback, <100KB additional, cross-browser)
- Apply register-aware: brand allows hero swings; product limits to one interaction signature
- Do NOT exceed ONE overdrive moment per product
- Do NOT ship below 60fps
- Do NOT skip reduced-motion fallback
- Do NOT put overdrive in critical task paths (cognitive cost)
- Do NOT use generic shader effects (oilspill gradients, default Three.js scenes)

## Acceptance criteria
1. Exactly one surface chosen, one technical approach
2. 60fps verified across desktop browsers (Safari, Firefox, Chrome, Edge)
3. Bundle delta <100KB
4. No main-thread blocking >16ms
5. prefers-reduced-motion falls back to static
6. Progressive enhancement: degrades gracefully on low-spec
7. Brand: hero/scroll/3D allowed; Product: interaction signature only, never in critical path
8. Effect is brand-specific (not generic Three.js demo)

## Optional checkpoints
- Confirm surface choice (hero/interaction/data/loading/empty)
- Confirm technical approach (WebGL/spring physics/View Transitions/canvas/SVG)
- Confirm performance budget if effect is heavy
- Otherwise: autonomous

## Inputs / outputs
- Input: target
- Output: one implemented overdrive moment + performance test results + fallback verification

## Success metric
- 60fps achieved on M1 baseline (degradation tier verified)
- 100% reduced-motion fallback works
- 0 cases of overdrive in critical task paths
- 0 generic shader / 3D template effects shipped
- Bundle delta within budget

## Failure mode handling
- Cannot achieve 60fps within budget → STOP, downgrade complexity OR move to delight
- Reduced-motion fallback degrades too much → redesign so static state is still impressive
- Effect breaks on Safari → fix or abandon (no Safari-broken shipping)
- Performance budget exceeded → reduce particles/poly count/shader complexity
- Critical-path overdrive request → REJECT, suggest delight instead
