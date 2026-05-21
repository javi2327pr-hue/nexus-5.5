<!-- v3 | agente: antigravity | 2026-05-21 -->
# Spatial design (Antigravity domain ref)

## Applicability
Consulted by: craft (always), layout, polish, critique, and as default with typography. Baseline ref.

## Constraints
1. Spacing values from canonical modular scale (no orphan 17px values)
2. Vary spacing by section purpose (hero generous, list tight breathable, dividers generous)
3. Cards used only when justified (related action groups, repeated entities, surface mode shifts)
4. Never nested cards
5. Never identical card grids (≥6 same-shape repeats)
6. Don't wrap everything in `<Container>`
7. Max ONE asymmetric moment per section
8. Whitespace treated as content, not as empty
9. Horizontal grid aligns across sections; vertical rhythm varies

## Acceptance criteria for spatial output
1. All spacing from canonical scale
2. Rhythm varies appropriately by section purpose
3. Cards used only with justification (≤1 of 3 acceptable reasons)
4. 0 nested cards
5. 0 identical card grids (≥6 items same shape)
6. ≤1 asymmetric moment per section
7. Horizontal grid aligns; vertical rhythm intentionally varied
8. Whitespace decisions documented in design system (DESIGN.md) when canonical

## Failure modes
- Existing identical card grid is intentional (catalogue, gallery) → flag, ask user
- Cannot fit content without nesting cards → restructure information architecture
- Container reflex deeply embedded → suggest extract command
- Vertical rhythm broken by external content (CMS, etc.) → constrain externally OR add wrapper rhythm
