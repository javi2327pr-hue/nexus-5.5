<!-- v3 | agente: codex | 2026-05-21 -->
# Motion design (Codex domain ref)

```
5 MOTION LAWS:
  1. Don't animate CSS layout (width/height/top/left/margin/padding)
     Use: transform, opacity, filter, clip-path
  2. Ease-out exponential (quart/quint/expo)
     NO bounce, NO elastic on serious surfaces
  3. Duration tiers:
     150ms  → state (toggle, focus)
     300ms  → content (modal in, drawer)
     500ms+ → entrance only
  4. Stagger 30-60ms between siblings (not all at once)
  5. prefers-reduced-motion → opacity-only fallback (or none)

3 CATEGORIES:
  Functional (always):  loading, focus, state, meaningful scroll reveals
  Affordance (often):   hover scale 1.02, drag lift, press translate-y
  Delight (sparingly):  stagger entrance, ONE signature per surface

EASING CURVES:
  ease-out-quart  cubic-bezier(0.25, 1, 0.5, 1)       — default
  ease-out-quint  cubic-bezier(0.22, 1, 0.36, 1)      — slight emphasis
  ease-out-expo   cubic-bezier(0.16, 1, 0.3, 1)       — strong fast settle
  linear                                                 — loading bars
  ease-in-out                                            — looping
  
  NEVER bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55) — toy aesthetic
  NEVER elastic on production

STAGGER:
  5+ items:  30-60ms between siblings
  10+ items: reduce stagger, use grouping
  CSS: li:nth-child(N) { animation-delay: (N-1)*30ms; }

REDUCED-MOTION FALLBACK:
  @media (prefers-reduced-motion: reduce) {
    transform: none;
    opacity: 1;
    animation: none;
  }
  Critical focus changes may need reduced-motion variant that still moves.

REGISTER:
  Brand:    signature moments, hero entrance, scroll reveals OK
  Product:  invisible motion (focus/state/loading), never impressive

PITFALLS:
  ❌ Animate width/height (use transform: scale)
  ❌ Bounce on serious surface
  ❌ All-at-once entrance
  ❌ No reduced-motion fallback
  ❌ Duration "feels right" vs tier
  ❌ will-change on every element
```
