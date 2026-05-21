<!-- v3 | agente: codex | 2026-05-21 -->
# Spatial design (Codex domain ref)

```
SPACING SCALE (rem / px):
  0.25 / 4    0.5 / 8    0.75 / 12   1 / 16    1.5 / 24
  2 / 32      3 / 48     4 / 64      6 / 96    8 / 128   12 / 192
NO orphan values (no 17px)

VARY RHYTHM BY SECTION PURPOSE:
  Hero (brand):       generous (3-4 steps)
  Hero (product):     moderate (2-3 steps)
  Content block:      moderate (1-2 steps)
  List/grid:          tight breathable (0.5-1 step)
  Related adjacent:   tight (0.25-0.5 step)
  Section dividers:   generous (3-4 steps)

CARDS — use with extreme prejudice. Acceptable when:
  - Group of related actions needs clear boundaries
  - Repeated entity with distinct properties (Kanban, board games)
  - Surface mode shift (focused detail in list)

NEVER cards for:
  - Individual items "for visual structure"
  - Nested cards (always wrong, collapse)
  - Identical card grid (6+ same-shape repeated)

Before using a card: would HR / indent / whitespace do the job?

CONTAINER RESTRAINT:
  Don't wrap everything in <Container>
  Crystallizes as reflex
  max-width on single section often enough

GRID + ASYMMETRY:
  Pure symmetry  = safe
  Pure asymmetry = chaos
  ONE asymmetric moment per section:
    off-center hero, oversized first item, full-bleed photo, 2:1 columns
  STOP AT ONE.

NEGATIVE SPACE = CONTENT:
  Not "empty" — it's a design element
  Separates ideas without dividers
  Creates focus
  Communicates respect (luxury, editorial)
  Reduces cognitive load
  Increase whitespace BEFORE reducing color/type when overstimulated

VERTICAL VS HORIZONTAL RHYTHM:
  Vertical:   varies per section
  Horizontal: aligns across sections (no jumping)
  Fighting alignment? grid is wrong

PITFALLS:
  ❌ Same padding everywhere
  ❌ Nested cards
  ❌ Identical card grid
  ❌ Wrap-everything-in-Container reflex
  ❌ Five asymmetric moments per section
  ❌ Whitespace as wasted space
```
