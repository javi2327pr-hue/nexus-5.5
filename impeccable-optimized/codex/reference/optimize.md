<!-- v3 | agente: codex | 2026-05-21 -->
# Optimize (Codex)

```
Step 1: Measure first
  npm run build && npx lighthouse <url> --view
  Bundle analysis: npx vite-bundle-visualizer (or rollup-plugin-visualizer)

Step 2: Target Core Web Vitals
  LCP ≤ 2.5s
  CLS ≤ 0.1
  INP ≤ 200ms

Step 3: Loading
  - TTFB (server response)
  - Render-blocking CSS/fonts/scripts → inline critical, defer non-critical
  - font-display: swap + subset + preload primary weight
  - Above-fold images: fetchpriority="high"

Step 4: Bundle
  Target <100KB initial JS per route
  Tree-shaking enabled
  Code splitting on route boundaries
  Dependency audit:
    moment → date-fns
    lodash → individual imports
    polyfills not needed in target browsers
  Dynamic imports for non-critical features

Step 5: Images
  WebP/AVIF over PNG/JPG
  srcset + sizes for responsive
  loading="lazy" BELOW FOLD (not above)
  Width/height attributes (prevent CLS)
  picture for art direction

Step 6: Rendering
  Reserve space (skeleton, aspect-ratio) → prevent CLS
  Debounce expensive handlers
  Virtualize long lists (react-window, TanStack Virtual)
  content-visibility: auto for offscreen

Step 7: Animations (60fps)
  Use transform/opacity/filter (compositor properties)
  Avoid top/left/width/height (reflow)
  will-change sparingly
  Reduce simultaneous animations

Step 8: Route
  verify all dimensions  → /impeccable audit
  remove decoration      → /impeccable distill (different command)
  loading UX             → /impeccable harden
  final pass             → /impeccable polish
```

## Anti-patterns
```
❌ Premature optimization (measure first)
❌ Optimize for Lighthouse score over real-user metrics
❌ Strip features as "optimization" (that's distill)
❌ Lazy-load above-fold (defeats LCP)
❌ Image formats by "what we have"
❌ will-change on every element
```
