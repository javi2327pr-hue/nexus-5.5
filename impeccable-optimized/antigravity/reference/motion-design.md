<!-- v3 | agente: antigravity | 2026-05-21 -->
# Motion design (Antigravity domain ref)

## Applicability
Consulted by: craft, animate, delight, overdrive, polish, critique, live (motion action).

## Constraints
1. Never animate CSS layout properties (width/height/top/left/margin/padding) — use transform/opacity/filter/clip-path
2. Ease-out exponential family only (quart/quint/expo); no bounce, no elastic on serious surfaces
3. Duration tiers: 150ms state, 300ms content, 500ms+ entrance only
4. Stagger 30-60ms between siblings when multi-element
5. prefers-reduced-motion respected (opacity-only fallback OR none)
6. ONE signature delight motion per surface (not multiple)

## Acceptance criteria for motion output
1. 0 CSS-layout animation properties used
2. All easing in ease-out exponential family
3. All durations from tier table (no "feels right")
4. Stagger applied for multi-element entrances
5. prefers-reduced-motion fallback present for every animated element
6. ≤1 signature delight motion per surface
7. Brand register: signature moments allowed; Product register: invisible-not-impressive

## 3 motion categories (use deliberately)
- **Functional** (always): loading, focus, state changes, scroll reveals
- **Affordance** (often): hover scale 1.02, drag lift, press translate-y
- **Delight** (sparing): entrance stagger, signature interaction

## Failure modes
- Bounce/elastic requested on serious surface → flag, ask explicit override
- Library default animations don't meet criteria → override or replace
- Reduced-motion fallback degrades critical UX (focus change invisible) → use motion that still works under reduced
- Performance impact from compositor layers → reduce `will-change` usage, isolate animated elements
