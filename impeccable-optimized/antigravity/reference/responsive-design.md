<!-- v3 | agente: antigravity | 2026-05-21 -->
# Responsive design (Antigravity domain ref)

## Applicability
Consulted by: craft, adapt, audit, live, harden (when responsive in scope).

## Constraints
1. Mobile-first base + min-width progressive enhancement
2. Content-driven breakpoints (add when layout breaks, not by device)
3. Fluid type via clamp() on headlines; body fixed per breakpoint
4. Reflow at each breakpoint (3-col → 1-col stack), never just shrink
5. Touch targets ≥44×44 at coarse pointer (expand hit area, not visual size, if needed)
6. Container queries used surgically where component-level matters
7. Images: WebP/AVIF + srcset + sizes + lazy-below-fold + width/height (prevent CLS)
8. Print stylesheet for long-form content sites
9. Test matrix: 375/768/1024/1440/2560 + print + dark + reduced-motion + RTL (if i18n)

## Acceptance criteria for responsive output
1. Mobile-first written; progressive enhancement applied
2. Breakpoints justified per layout break, not device list
3. Headlines fluid; body either fixed-per-breakpoint or fluid with reason
4. Each breakpoint reflows (not just scales)
5. Touch targets 44×44 at coarse pointer
6. Images responsive with srcset/sizes; below-fold lazy
7. Print stylesheet if site has long-form content
8. Test matrix verified

## Failure modes
- Cannot reflow at smaller breakpoint without losing critical info → AskUserQuestion (priority order, hide vs collapse)
- Container queries unsupported on target → fall back to viewport with documented degradation
- Touch + mouse hybrid (iPad with Magic Keyboard) → respect pointer media, not screen size
- LCP image is in below-fold zone → confirm with user (might be intentional, e.g., scroll-driven)
- Long-form site without print stylesheet → add baseline print CSS, suggest harden for full print pass
