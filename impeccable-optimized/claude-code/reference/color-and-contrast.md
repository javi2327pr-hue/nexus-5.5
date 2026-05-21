<!-- v3 | agente: claude-code | 2026-05-21 -->
# Color and contrast (domain reference)

Loaded by: `craft`, `colorize`, `polish`, `critique`, `audit`, `live` (color action).

## OKLCH-only rule

- Use OKLCH for every color choice
- Never `#000` or `#fff`
- Reduce chroma as lightness approaches 0 or 100 (chroma 0.005-0.01 at extremes — anything more reads garish)
- Tint every neutral toward the brand hue

## Color strategy axis (pick one)

| Strategy | Allocation | Use |
|---|---|---|
| **Restrained** | tinted neutrals + 1 accent ≤10% | Product default; brand minimalism |
| **Committed** | 1 saturated 30-60% of surface | Brand default for identity-driven pages |
| **Full palette** | 3-4 named roles, each deliberate | Brand campaigns; product data viz |
| **Drenched** | surface IS the color | Brand heroes, campaign pages |

The "one accent ≤10%" rule is **Restrained only**. Committed / Full / Drenched exceed it intentionally.

## Dark vs light (never default)

Write one sentence of physical scene: who uses this, where, under what ambient light, in what mood.

If the sentence doesn't force the answer, add detail until it does.

- "Observability dashboard" → ambiguous, not enough
- "SRE glancing at incident severity on a 27-inch monitor at 2am in a dim room" → forces dark

Run the sentence, not the category.

## Contrast requirements (WCAG 2.1 AA baseline)

| Text | Min ratio |
|---|---|
| Body (small) | 4.5:1 |
| Large text (≥18pt or 14pt bold) | 3:1 |
| Non-text UI components | 3:1 |
| Decorative graphics | No requirement |

Always **measure** with actual contrast checks, not eyeballing.

## Category reflex check

If the resulting palette is the obvious default for the category, you're at the first reflex. Avoid:

| Category | First reflex | Avoid |
|---|---|---|
| Observability / monitoring | dark blue + neon | ✗ |
| Healthcare | white + teal | ✗ |
| Finance | navy + gold | ✗ |
| Crypto | neon on black | ✗ |
| AI tools | purple gradient | ✗ |
| Sustainability | green | ✗ |

Use the brief's anti-references to guide what NOT to pick.

## Tinted neutrals procedure

```
For each neutral in the palette:
  chroma 0.005-0.01 (subtle)
  hue = brand hue
  
Result: near-black still reads "near-black", but harmonizes with brand
```

Examples (OKLCH):
- Pure black: `oklch(0% 0 0)` → use `oklch(10% 0.005 350)` instead
- Pure white: `oklch(100% 0 0)` → use `oklch(98% 0.005 350)` instead
- Mid gray: `oklch(50% 0 0)` → use `oklch(55% 0.005 350)`

## Theme switching

If supporting both light and dark:
- Don't auto-default; respect `prefers-color-scheme` + user override
- Store user override in localStorage
- Test both themes visually for parity (not just contrast)
- No hardcoded colors that break theme switch

## Common pitfalls

- ❌ "Almost the same" off-tones surviving (use canonical tokens)
- ❌ High chroma at lightness extremes (looks garish)
- ❌ Pure `#000`/`#fff` (always tint)
- ❌ Category-default palette without justification
- ❌ Eyeballing contrast (always measure)
- ❌ Gradient text (`background-clip: text`) — absolute ban
