<!-- v3 | agente: claude-code | 2026-05-21 -->
# Motion design (domain reference)

Loaded by: `craft`, `animate`, `delight`, `overdrive`, `polish`, `critique`, `live` (motion action).

## The 5 motion laws

1. **Don't animate CSS layout properties** — `width`, `height`, `top`, `left`, `margin`, `padding` trigger reflow. Use `transform`, `opacity`, `filter`, `clip-path`.
2. **Ease-out exponential** — `cubic-bezier(0.32, 0.94, 0.41, 1.13)` for quart, similar for quint/expo. No bounce, no elastic on serious surfaces.
3. **Duration matches grouping**:
   - 150ms — state changes (toggle, focus)
   - 300ms — content changes (modal in, drawer open)
   - 500ms+ — entrance animations only
4. **Stagger when multiple** — 30-60ms between siblings, not all at once.
5. **Respect prefers-reduced-motion** — opacity-only fallback (or none).

## 3 motion categories (use deliberately)

### Functional motion (always required)
- Loading indicators matching duration
- Focus state transitions (200ms ease-out)
- State changes (toggle on/off, modal in/out)
- Scroll-driven reveals (only when content is meaningful)

### Affordance motion (frequent)
- Hover affordance — subtle `scale(1.02)` or background shift
- Drag affordance — cursor change + visual lift
- Pressable affordance — 1px translate-y on click

### Delight motion (sparing)
- Entrance stagger for a group of items
- Signature interaction moment (ONE per surface)
- Always respects reduced-motion

## Easing curves

| Curve | Use |
|---|---|
| ease-out-quart `cubic-bezier(0.25, 1, 0.5, 1)` | Default — settles naturally |
| ease-out-quint `cubic-bezier(0.22, 1, 0.36, 1)` | Slightly more emphasis |
| ease-out-expo `cubic-bezier(0.16, 1, 0.3, 1)` | Strong, fast settle |
| linear | Loading bars, continuous |
| ease-in-out | Looping animations |

**Never** use bounce (`cubic-bezier(0.68, -0.55, 0.265, 1.55)`) or elastic on production surfaces. Toy aesthetic.

## Stagger patterns

```css
/* Sibling stagger */
li:nth-child(1) { animation-delay: 0ms; }
li:nth-child(2) { animation-delay: 30ms; }
li:nth-child(3) { animation-delay: 60ms; }
li:nth-child(4) { animation-delay: 90ms; }

/* Or via JS: */
items.forEach((el, i) => {
  el.style.animationDelay = `${i * 30}ms`;
});
```

For 5+ items, increase to 30-60ms; for 10+ items, reduce stagger and use entrance grouping.

## Reduced-motion fallback

```css
.fancy-animation {
  transform: translateY(20px);
  opacity: 0;
  animation: enter 600ms ease-out-quart forwards;
}

@media (prefers-reduced-motion: reduce) {
  .fancy-animation {
    transform: none;
    opacity: 1;
    animation: none;
  }
}
```

Some flows need a reduced-motion variant that still moves (e.g., critical focus changes); choose carefully.

## Register-specific motion

| Register | Direction |
|---|---|
| **Brand** | Signature moments allowed; hero entrance; scroll-driven reveals |
| **Product** | Restraint; invisible motion (focus, state, loading); never "impressive" |

## Common pitfalls

- ❌ Animating `width`/`height` for "smooth resize" — use `transform: scale`
- ❌ Bounce on serious surfaces
- ❌ All-at-once entrance instead of stagger
- ❌ Motion without reduced-motion fallback
- ❌ Duration matched to "feels right" instead of grouping tier
- ❌ `will-change` on every animatable element (creates compositor layer each time)
