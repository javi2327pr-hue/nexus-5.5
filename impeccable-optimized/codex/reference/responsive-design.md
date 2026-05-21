<!-- v3 | agente: codex | 2026-05-21 -->
# Responsive design (Codex domain ref)

```
MOBILE-FIRST DEFAULT:
  Write base styles for smallest target.
  Progressively enhance via min-width media queries.

CONTENT-DRIVEN BREAKPOINTS (add when layout breaks, not by device):
  640px   large mobile
  768px   tablet portrait
  1024px  tablet landscape / small laptop
  1280px  desktop
  1536px  large desktop

FLUID TYPE WITH clamp():
  font-size: clamp(<min>, <ideal>, <max>);
  Headlines fluid; body often fixed.

REFLOW PATTERNS (not shrink):
  3-col grid          → 1-col stack
  Side-by-side hero   → stacked
  Horizontal nav      → drawer/hamburger
  Multi-step wizard   → vertical accordion or single-scroll
  Wide data table     → card list OR h-scroll with sticky first col
  Sidebar + content   → stacked, sidebar collapsed
  Modal               → bottom sheet (or full-screen)

TOUCH TARGETS (coarse pointer):
  @media (pointer: coarse) {
    button, a, [role=button], input[type=checkbox|radio] {
      min-height: 44px; min-width: 44px;
    }
  }
  Expand hit area via padding when visual size must stay smaller.

CONTAINER QUERIES:
  @container card (min-width: 400px) { ... }
  Fallback to viewport queries on older browsers.

IMAGES:
  <img src="800.webp"
       srcset="400.webp 400w, 800.webp 800w, 1600.webp 1600w"
       sizes="(max-width: 768px) 100vw, 50vw"
       loading="lazy" width="800" height="600" alt="..."/>

  Art direction:
  <picture>
    <source media="(max-width: 768px)" srcset="sq-800.webp">
    <source media="(min-width: 769px)" srcset="wide-1600.webp">
    <img src="wide-1600.webp" alt="..."/>
  </picture>

PRINT:
  @media print {
    nav, footer, .ads { display: none }
    body { font-size: 12pt; line-height: 1.5 }
    a::after { content: " (" attr(href) ")" }
    h1, h2 { page-break-after: avoid }
    img { max-width: 100% }
  }

TEST MATRIX:
  375 / 768 / 1024 / 1440 / 2560 + print + dark + reduced-motion + RTL (if i18n)

PITFALLS:
  ❌ Shrink desktop for mobile (always reflow)
  ❌ Hardcoded breakpoints from 2018 article
  ❌ Touch <44x44 at coarse
  ❌ Lazy-load above-fold (kills LCP)
  ❌ Hamburger nav on tablet
  ❌ Modal as bottom sheet without drag-to-dismiss
```
