<!-- v3 | agente: claude-code | 2026-05-21 -->
# Responsive design (domain reference)

Loaded by: `craft`, `adapt`, `audit`, `live`, `harden` (when responsive in scope).

## Mobile-first by default

Write base styles for the smallest target, then progressively enhance via min-width media queries.

```css
.hero {
  /* mobile base */
  padding: 1rem;
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  .hero {
    padding: 2rem;
    font-size: 2.5rem;
  }
}
```

## Content-driven breakpoints

Don't add a breakpoint because it's "the tablet size". Add when the layout breaks.

Starting points:
- 640px (large mobile)
- 768px (tablet portrait)
- 1024px (tablet landscape / small laptop)
- 1280px (desktop)
- 1536px (large desktop)

## Fluid type with clamp

```css
font-size: clamp(<min>, <ideal>, <max>);

/* Examples */
h1 { font-size: clamp(2rem, 5vw + 1rem, 4rem); }
.body { font-size: clamp(1rem, 0.5vw + 0.875rem, 1.125rem); }
```

Body text often stays fixed; headlines fluid.

## Reflow patterns

| Desktop | Mobile reflow |
|---|---|
| 3-column grid | 1-column stack |
| Side-by-side hero + image | Stacked, image first or second |
| Horizontal nav | Drawer / hamburger |
| Multi-step wizard tabs | Vertical accordion or single-page scroll |
| Wide data table | Card list OR horizontal scroll with sticky first column |
| Sidebar + content | Stacked, sidebar collapsed |
| Modal | Bottom sheet (or full-screen) |

## Touch targets (coarse pointer)

```css
@media (pointer: coarse) {
  button, a, [role="button"], input[type="checkbox"], input[type="radio"] {
    min-height: 44px;
    min-width: 44px;
  }
}
```

Apply hit area expansion via padding when visual size must stay smaller.

## Container queries (where supported)

For component-level responsiveness:

```css
@container card (min-width: 400px) {
  .card { flex-direction: row; }
}
```

Falls back to viewport queries on older browsers; design fallback first.

## Image responsiveness

```html
<img
  src="image-800.webp"
  srcset="image-400.webp 400w, image-800.webp 800w, image-1600.webp 1600w"
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
  width="800"
  height="600"
  alt="..."
/>
```

For art direction (different crops at different sizes):

```html
<picture>
  <source media="(max-width: 768px)" srcset="square-800.webp">
  <source media="(min-width: 769px)" srcset="wide-1600.webp">
  <img src="wide-1600.webp" alt="...">
</picture>
```

## Print stylesheet

For sites with long-form content (articles, docs):

```css
@media print {
  nav, footer, .ads { display: none; }
  body { font-size: 12pt; line-height: 1.5; }
  a::after { content: " (" attr(href) ")"; }
  h1, h2 { page-break-after: avoid; }
  img { max-width: 100%; }
}
```

## Test matrix

| Breakpoint | Reason |
|---|---|
| 375px | iPhone SE / small mobile |
| 768px | iPad portrait |
| 1024px | iPad landscape / small laptop |
| 1440px | desktop default |
| 2560px | large desktop |
| Print | If applicable |

Plus: dark mode if claimed, reduced motion, RTL if i18n.

## Common pitfalls

- ❌ Shrinking desktop layout for mobile (always reflow)
- ❌ Hardcoded breakpoints from a 2018 article (use content-driven)
- ❌ Touch targets <44×44 at coarse pointer
- ❌ Lazy-loading above-fold images (kills LCP)
- ❌ Same horizontal nav broken into hamburger on tablet (consider what breaks first)
- ❌ Modal as a bottom sheet without adjusting interaction (drag-to-dismiss, etc.)
