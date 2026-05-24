<!-- v3 | agente: claude-code | 2026-05-21 -->
# Adapt (Claude Code)

Adapt designs across screen sizes, devices, contexts, platforms. Breakpoints, fluid layouts, touch targets.

## Use this command when

User says: "responsive", "mobile", "tablet", "breakpoints", "different devices", "viewport", "cross-platform".

## Breakpoint strategy

Use **content-driven breakpoints**, not device-driven. When the layout breaks, add a breakpoint.

Common useful breakpoints (in mobile-first order):
- Base (mobile, ~375px)
- 640px (large mobile)
- 768px (tablet portrait)
- 1024px (tablet landscape / small laptop)
- 1280px (desktop)
- 1536px (large desktop)

But: don't add a breakpoint just because it's in the list. Add when the design needs it.

## 6 adapt moves

### 1. Fluid type
`clamp(min, ideal, max)` for headlines. Body text generally a fixed size per breakpoint.

```css
font-size: clamp(2rem, 5vw + 1rem, 4rem);
```

### 2. Fluid spacing
Section padding, hero height, grid gaps — use clamp or container queries.

### 3. Reflow, don't shrink
- 3-column → 2-column → 1-column
- Hero with side image → stacked
- Nav: horizontal → drawer/hamburger
- Tables → cards on small screens (or horizontal scroll for data-dense)

### 4. Touch targets at coarse pointer
```css
@media (pointer: coarse) {
  button, a, [role="button"] { min-height: 44px; min-width: 44px; }
}
```

### 5. Container queries (where supported)
Component-level responsive logic. Card layout that adapts to its parent's width, not the viewport.

### 6. Context adaptation (not just size)
- Print: hide nav, expand content, single column
- Dark/light: see `colorize` and `audit`
- Low-power: reduce motion, defer images
- Slow connection: lazy load, optimistic UI

## Test matrix (minimum)

| Breakpoint | Why |
|---|---|
| 375px | iPhone SE / small mobile |
| 768px | iPad portrait |
| 1024px | iPad landscape / small laptop |
| 1440px | desktop default |
| 2560px | large desktop |

Plus: print stylesheet, dark mode if claimed, reduced motion.

## Routing

FROM `adapt`, suggest GO TO:

| When... | Suggest |
|---|---|
| Adapt reveals broken layout fundamentals | `layout` |
| Verify across all dimensions | `audit` |
| Performance impact from images/lazy | `optimize` |
| Final pass | `polish` |

STAY in `adapt` UNTIL: layout works at all test-matrix breakpoints AND touch targets pass AND context adaptations applied.

## Anti-patterns

- ❌ Shrinking desktop layout for mobile (always reflow)
- ❌ Hardcoded breakpoints from a 2018 article (use content-driven)
- ❌ Touch targets <44×44 at coarse pointer
- ❌ Mobile-first ignoring desktop affordances (large hover states still matter)
- ❌ Container queries everywhere (use where component-level responsiveness genuinely matters)
