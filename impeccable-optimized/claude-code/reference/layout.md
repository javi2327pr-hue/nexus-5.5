<!-- v3 | agente: claude-code | 2026-05-21 -->
# Layout (Claude Code)

Fix layout, spacing, visual rhythm. Address monotonous grids, inconsistent spacing, weak hierarchy.

## Use this command when

User says: "layout feels off", "spacing", "visual hierarchy", "crowded", "alignment problems", "composition".

## 6 layout moves

### 1. Spacing rhythm (vary across sections)
Same padding everywhere = monotony. Vary by section purpose:
- Hero: generous
- Content blocks: moderate
- Lists/grids: tight but breathable

Use a spacing scale (e.g., 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96) — no orphan values like 17px.

### 2. Hierarchy through scale + density
Big things READ bigger. Small dense lists READ smaller. Hierarchy is not just type size — it's information density per area.

### 3. Cards (avoid nested, avoid identical grids)
- Nested cards: always wrong. Collapse.
- Identical card grid (same size + icon + heading + text repeated 6×): absolute ban. Vary card sizes, use editorial layout, or rethink.

### 4. Container restraint
Don't wrap everything in containers. Most things don't need one. Containers crystallize as a reflex; remove ones that don't earn their place.

### 5. Grid + asymmetry balance
Pure symmetry = safe. Pure asymmetry = chaos. One deliberate asymmetric moment per section (offset hero, larger first item, full-bleed image escaping grid) carries the rhythm.

### 6. Breakpoint behavior
Layout for desktop AND mobile. Don't just shrink. Reflow:
- Two-column → stacked, possibly with reordered priority
- Wide hero → centered narrower
- Touch targets ≥44×44px at coarse pointer breakpoint

## Register-specific layout

| Register | Direction |
|---|---|
| **Brand** | Editorial composition. Asymmetry allowed. Vary rhythm aggressively. |
| **Product** | Predictable grids. Asymmetry only where it signals priority. Touch-friendly. |

## Routing

FROM `layout`, suggest GO TO:

| When... | Suggest |
|---|---|
| Fixing spacing reveals type hierarchy gap | `typeset` |
| Breakpoint behavior broken | `adapt` |
| Final pass | `polish` |
| Layout fix surfaces broken composition | `critique` (foundation issue) |

STAY in `layout` UNTIL: rhythm varied, no nested cards, no identical grids, breakpoints work.

## Anti-patterns

- ❌ Same padding everywhere ("consistent" = monotonous)
- ❌ Nested cards
- ❌ Identical card grid (6 features in identical cards)
- ❌ Wrap-everything-in-a-container reflex
- ❌ Mobile breakpoint = scaled-down desktop (reflow, don't shrink)
