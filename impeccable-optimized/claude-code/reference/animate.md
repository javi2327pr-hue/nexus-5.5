<!-- v3 | agente: claude-code | 2026-05-21 -->
# Animate (Claude Code)

Add purposeful animations and motion that improve usability and delight. Functional first, decorative second.

## Use this command when

User says: "add animation", "transitions", "micro-interactions", "motion", "hover effects", "feel more alive".

## 3 motion categories (use all three deliberately)

### 1. Functional motion (always)
- Loading indicators matching duration (see harden.md)
- Focus/active state transitions (200ms ease-out)
- State changes (toggle on/off, modal in/out)
- Scroll-driven reveals (only if content is meaningful, not decoration)

### 2. Affordance motion (often)
- Hover affordance (subtle scale 1.02 or background shift)
- Drag affordance (cursor + visual lift)
- Pressable affordance (1px translate-y on click)

### 3. Delight motion (sparingly)
- Entrance stagger (group of items appearing)
- Signature moment (one per surface — see delight.md if amplifying further)
- Reduced-motion respected (always)

## The 5 motion laws

1. **Don't animate CSS layout properties** — width, height, top, left, margin trigger reflow. Use `transform`, `opacity`, `filter`, `clip-path`.
2. **Ease-out exponential** — quart, quint, expo. No bounce, no elastic.
3. **Duration matches grouping** — 150ms for state, 300ms for content, 500ms+ only for entrance.
4. **Stagger when multiple** — 30-60ms between siblings, not all at once.
5. **Respect prefers-reduced-motion** — fall back to opacity-only transitions.

## Register-specific animate

| Register | Direction |
|---|---|
| **Brand** | Signature moments allowed. Scroll-driven reveals. Hero entrance. |
| **Product** | Restraint. Motion should feel invisible, not impressive. Earned-familiarity bar. |

## Anti-patterns

- ❌ Animating `width`/`height` for "smooth resize" (use transform: scale)
- ❌ Bounce on serious surfaces (toy aesthetic)
- ❌ All-at-once entrance (stagger or none)
- ❌ Motion without `@media (prefers-reduced-motion)` fallback
- ❌ Duration matches "what feels right" instead of matching grouping (150/300/500 tiers)

## Routing

FROM `animate`, suggest GO TO:

| When... | Suggest |
|---|---|
| Performance impact concerning | `optimize` |
| Final pass needed | `polish` |
| Want to push further into spectacle | `overdrive` |
| Adding moments of joy | `delight` (different intent — delight has surprise + personality; animate is functional) |
