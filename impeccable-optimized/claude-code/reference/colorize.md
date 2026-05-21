<!-- v3 | agente: claude-code | 2026-05-21 -->
# Colorize (Claude Code)

Add strategic color to monochromatic or color-poor designs. Make engaging and expressive.

## Use this command when

User says: "too gray", "dull", "needs warmth", "more color", "vibrant", "expressive palette".

## Before adding color

Pick the **color strategy** explicitly:

| Strategy | When | Allocation |
|---|---|---|
| **Restrained** | Product default, brand minimalism | tinted neutrals + 1 accent ≤10% |
| **Committed** | Brand identity-driven, single-product story | 1 saturated carries 30-60% of surface |
| **Full palette** | Brand campaigns, product data viz | 3-4 named roles, each deliberate |
| **Drenched** | Brand hero, campaign pages | surface IS the color |

Do NOT collapse every "too gray" call to Restrained by reflex.

## Color choice procedure

1. **OKLCH only** — never `#000` or `#fff`. Reduce chroma at lightness extremes.
2. **Tint neutrals** toward chosen hue (chroma 0.005-0.01)
3. **Choose hue family** from PRODUCT.md cues (brand voice, anti-references) + register
4. **Verify contrast** at intended sizes (4.5:1 for body, 3:1 for large text/UI)
5. **Test against absolute bans** (gradient text, side-stripe borders >1px)

## Category reflex check

If the resulting palette is the obvious default for the category:

| Category | First reflex | Avoid |
|---|---|---|
| observability | dark blue + neon | dark blue + neon |
| healthcare | white + teal | white + teal |
| finance | navy + gold | navy + gold |
| crypto | neon on black | neon on black |
| AI tools | purple gradient | purple gradient |

Pick something the category doesn't already wear. The brief's anti-references should guide this.

## Register-specific colorize

| Register | Direction |
|---|---|
| **Brand** | Distinctive color choice. Anchor reference matters. May go Committed or Drenched. |
| **Product** | Restrained or Committed. Accent serves function (severity, state, brand mark). |

## Routing

FROM `colorize`, suggest GO TO:

| When... | Suggest |
|---|---|
| Result became too loud | `quieter` |
| Underlying typography needs strengthening to carry color | `typeset` |
| Want palette amplification (more colors, not different) | `bolder` |
| Verify contrast & a11y | `audit` |

STAY in `colorize` UNTIL: palette is chosen explicitly, contrast verified, category reflex avoided.

## Anti-patterns

- ❌ Picking color by reflex from category (dark blue for observability, etc.)
- ❌ Using `#000`/`#fff` instead of tinted near-black/near-white
- ❌ Gradient text "for color"
- ❌ Default to Restrained when the brief calls for Committed
- ❌ Skipping contrast verification
