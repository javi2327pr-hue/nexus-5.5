<!-- v3 | agente: codex | 2026-05-21 -->
# Overdrive (Codex)

```
Overdrive vs delight vs bolder:
  overdrive = technical spectacle (shaders, spring physics, 60fps)
  delight   = surprise + personality (motion is ONE way)
  bolder    = visual amplification (color, type, scale)
Use sparingly. ONE overdrive moment per product max.

Step 1: Pick surface (one of 5)
  - Hero moment (brand)
  - Interaction signature (product OR brand)
  - Data visualization (product)
  - Loading-as-art
  - Empty state with substance

Step 2: Implement
  Hero        → WebGL physics, scroll-driven scenes, 3D type, particle sim, 3D model with PBR lighting
  Interaction → spring-physics drag, procedural audio, cursor-following tools, View Transitions morph
  Data viz    → realtime streaming smooth interpolation, interactive 3D, type-as-data
  Loading     → custom GLSL fragment shader, generative art completing as load completes
  Empty       → procedurally generated illustration (varies session), interactive preview

Step 3: Technical constraints (all non-negotiable)
  - 60fps verified (drop frames = failure)
  - prefers-reduced-motion fallback to static
  - Bundle <100KB additional
  - No main-thread blocking
  - Progressive enhancement (works uglier on low-spec)
  - Cross-browser tested: Safari, Firefox, Chrome, Edge

Step 4: Register-aware
  Brand:   bigger swings allowed, hero moments OK
  Product: ONE interaction signature only, NEVER in critical task path

Step 5: Route
  perf too high          → /impeccable optimize
  edge cases need work   → /impeccable harden
  final pass             → /impeccable polish
  want subtle instead    → /impeccable delight
```

## Anti-patterns
```
❌ Five overdrive moments (one max)
❌ <60fps shipped
❌ No reduced-motion fallback
❌ Overdrive in critical task paths
❌ Generic shader effects (oilspill gradient — should be brand-specific)
❌ Confuse with delight (different intent)
```
