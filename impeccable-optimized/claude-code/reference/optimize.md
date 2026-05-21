<!-- v3 | agente: claude-code | 2026-05-21 -->
# Optimize (Claude Code)

Diagnose and fix UI performance: loading speed, rendering, animations, images, bundle size.

## Use this command when

User says: "slow", "laggy", "janky", "performance", "bundle size", "load time", "smoother".

## Performance dimensions (5)

### 1. Loading (LCP target ≤2.5s)
- Server response time (TTFB)
- Render-blocking resources (CSS, fonts, scripts)
- Critical CSS inlined; non-critical deferred
- Font: `font-display: swap`, subset, preload primary weight
- Above-fold images: `fetchpriority="high"`

### 2. Bundle size
- Per-route JS budget (target <100KB initial)
- Tree-shaking enabled
- Code splitting on route boundaries
- Dependencies audited (e.g., moment → date-fns, lodash → individual imports)
- Dynamic imports for non-critical features

### 3. Images
- WebP/AVIF instead of PNG/JPG
- `srcset` with `sizes` for responsive
- Lazy loading below fold (`loading="lazy"`)
- Width/height attributes to prevent CLS
- Cloudinary/Imgix/native picture for art direction

### 4. Rendering (CLS ≤0.1, INP ≤200ms)
- Reserve space for dynamic content (skeleton, aspect-ratio)
- Avoid layout shifts from late-loading content
- Debounce expensive handlers
- Virtualize long lists (react-window, TanStack Virtual)
- `content-visibility: auto` for offscreen sections

### 5. Animations (60fps)
- Use `transform`, `opacity`, `filter` (compositor properties)
- Avoid `top`, `left`, `width`, `height` (trigger reflow)
- `will-change` sparingly (creates new compositor layer)
- Reduce simultaneous animations
- Defer non-critical animations

## Diagnostic workflow

```bash
# Lighthouse / WebPageTest for headlines
npm run build && npx lighthouse <url> --view

# Bundle analysis
npx vite-bundle-visualizer  # or rollup-plugin-visualizer
```

Report Core Web Vitals + bundle size + identified bottlenecks.

## Optimize ≠ change features

Optimize improves performance of existing features. If user wants a new feature, that's `craft`. If they want simpler design, that's `distill`.

## Routing

FROM `optimize`, suggest GO TO:

| When... | Suggest |
|---|---|
| Optimize verifies all dimensions | `audit` |
| Want to remove decoration causing perf cost | `distill` |
| Add lazy/skeleton states (loading UX) | `harden` |
| Final pass | `polish` |

STAY in `optimize` UNTIL: targets met (LCP ≤2.5s, CLS ≤0.1, INP ≤200ms, bundle within budget).

## Anti-patterns

- ❌ Premature optimization (measure first, then act)
- ❌ Optimizing for Lighthouse score over real-user metrics
- ❌ Stripping features as "optimization" (that's distill, different command)
- ❌ Lazy-loading above-fold content (defeats LCP)
- ❌ Image formats decided by "what we have" instead of by best fit
- ❌ `will-change` on every element ("just in case")
