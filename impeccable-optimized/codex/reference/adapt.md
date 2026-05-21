<!-- v3 | agente: codex | 2026-05-21 -->
# Adapt (Codex)

```
Breakpoint strategy: CONTENT-DRIVEN, not device-driven.
Add a breakpoint when layout breaks.

Useful starting points (mobile-first):
  base (~375px), 640px, 768px, 1024px, 1280px, 1536px

Step 1: Fluid type
  Headlines: font-size: clamp(min, vw+offset, max);
  Body: fixed per breakpoint

Step 2: Fluid spacing
  Section padding, hero height, grid gaps via clamp() or container queries

Step 3: Reflow, don't shrink
  3-col → 2-col → 1-col
  Hero with side image → stacked
  Nav: horizontal → drawer/hamburger
  Tables → cards on small screens (or h-scroll for data-dense)

Step 4: Touch targets at coarse pointer
  @media (pointer: coarse) {
    button, a, [role=button] { min-height: 44px; min-width: 44px }
  }

Step 5: Container queries (where supported)
  Component responsive logic — card adapts to parent width

Step 6: Context adaptation (not just size)
  Print:        hide nav, expand content, single column
  Dark/light:   /impeccable colorize + /impeccable audit
  Low-power:    reduce motion, defer images
  Slow conn:    lazy load, optimistic UI

Step 7: Test matrix
  375 / 768 / 1024 / 1440 / 2560
  + print, dark mode (if claimed), reduced motion

Step 8: Route
  broken layout fundamentals  → /impeccable layout
  verify across dimensions    → /impeccable audit
  perf from images/lazy       → /impeccable optimize
  final pass                  → /impeccable polish
```

## Anti-patterns
```
❌ Shrink desktop for mobile (always reflow)
❌ Hardcoded breakpoints from a 2018 article
❌ Touch targets <44x44 at coarse pointer
❌ Mobile-first ignoring desktop affordances
❌ Container queries everywhere (use where it matters)
```
