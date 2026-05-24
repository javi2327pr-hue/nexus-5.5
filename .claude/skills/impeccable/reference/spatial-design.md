<!-- v3 | agente: claude-code | 2026-05-21 -->
# Spatial design (domain reference)

Loaded by: `craft`, `layout`, `polish`, `critique`, every command (alongside typography as baseline).

## Spacing scale

Use a modular scale, not arbitrary values.

Recommended scale (rem):
```
0.25  0.5  0.75  1  1.5  2  3  4  6  8  12
(4px  8px  12px  16px 24px 32px 48px 64px 96px 128px 192px)
```

No orphan values (e.g., 17px) — every spacing is a scale step.

## Vary spacing for rhythm

Same padding everywhere = monotony. Vary by section purpose:

| Section purpose | Vertical rhythm |
|---|---|
| Hero (brand) | generous (3-4 scale steps) |
| Hero (product) | moderate (2-3 scale steps) |
| Content block | moderate (1-2 scale steps) |
| List / grid | tight but breathable (0.5-1 scale step) |
| Adjacent related items | tight (0.25-0.5 scale step) |
| Section dividers | generous (3-4 scale steps) |

## Cards (use with extreme prejudice)

**Cards are the lazy answer.** Use them only when:
- Group of related actions that need clear boundaries
- Repeated entity with distinct properties (think Kanban, board games)
- Surface mode shift (e.g., focused detail in a list view)

**Never:**
- Wrap individual items in cards "for visual structure"
- Nest cards inside cards (always wrong — collapse)
- Identical card grid (6+ same-shape cards repeated)

When you reach for a card, ask: would a horizontal rule, indentation, or whitespace do the job?

## Container restraint

Don't wrap everything in a `<Container>` component. Most things don't need one.

Containers crystallize as a reflex; remove ones that don't earn their place. A `max-width` on a single section is often enough.

## Grid + asymmetry balance

Pure symmetry = safe. Pure asymmetry = chaos. **One** deliberate asymmetric moment per section carries rhythm:

- Off-center hero
- Oversized first item in a list
- Full-bleed photo escaping the grid
- Asymmetric column ratios (2-to-1 vs 1-to-1)

Stop at one.

## Negative space as content

Whitespace is not "empty" — it's a design element. It:
- Separates ideas without dividers
- Creates focus on what's present
- Communicates respect (luxury, editorial)
- Reduces cognitive load

Increase whitespace before reducing color/type, when overstimulation is the problem.

## Vertical rhythm vs horizontal rhythm

- **Vertical**: section spacing varies (above)
- **Horizontal**: grid columns + gaps should align across sections (no jumping)

If you find yourself fighting alignment between sections, the grid is wrong.

## Common pitfalls

- ❌ Same padding everywhere (monotony reads as boring or sterile)
- ❌ Nested cards
- ❌ Identical card grid
- ❌ Wrap-everything-in-`<Container>` reflex
- ❌ Five asymmetric moments per section (chaos)
- ❌ Treating whitespace as wasted space
