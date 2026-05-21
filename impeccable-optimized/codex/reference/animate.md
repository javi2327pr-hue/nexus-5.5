<!-- v3 | agente: codex | 2026-05-21 -->
# Animate (Codex)

```
Step 1: Categorize motion needs (3 categories)
  1. Functional (always): loading, focus, state changes, meaningful scroll reveals
  2. Affordance (often): hover scale 1.02, drag lift, pressable translate-y
  3. Delight (sparingly): entrance stagger, ONE signature moment per surface

Step 2: Apply 5 motion laws
  1. Don't animate CSS layout (width/height/top/left/margin) — use transform/opacity/filter/clip-path
  2. Ease-out exponential (quart/quint/expo). No bounce, no elastic.
  3. Duration tiers:
       150ms = state
       300ms = content
       500ms+ = entrance only
  4. Stagger 30-60ms between siblings when multiple
  5. @media (prefers-reduced-motion) → opacity-only fallback

Step 3: Register-aware
  Brand:   signature moments, hero entrance, scroll reveals OK
  Product: invisible, not impressive

Step 4: Apply motion + verify
  - Run reduced-motion check
  - Verify no CSS-layout animation
  - Verify duration tier matches grouping

Step 5: Route
  performance concern    → /impeccable optimize
  final pass             → /impeccable polish
  push to spectacle      → /impeccable overdrive
  adding joy specifically → /impeccable delight (different — surprise + personality)
```

## Anti-patterns
```
❌ Animate width/height for smooth resize (use transform: scale)
❌ Bounce on serious surface (toy aesthetic)
❌ All-at-once entrance
❌ Motion without reduced-motion fallback
❌ Duration "what feels right" instead of tier
```
