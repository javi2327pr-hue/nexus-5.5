<!-- v3 | agente: claude-code | 2026-05-21 -->
# Polish (Claude Code)

Final quality pass before shipping. Alignment, spacing, consistency, micro-detail.

## Use this command when

User says: "polish", "finishing touches", "pre-launch", "something looks off", "good to great", "final pass", "before ship".

## Polish is NOT

- Adding features → that's `craft`
- Hardening for production → that's `harden`
- Bigger redesign → that's `bolder` or `craft` re-do

Polish is the **last 10%**. If the underlying design is bad, polish won't fix it. Run `critique` first.

## 7-pass polish checklist

### Pass 1 — Pixel alignment
- Baselines, x-heights, optical centering vs geometric
- Grid adherence (no orphan 1px offsets)
- Icon size ratios to type

### Pass 2 — Spacing rhythm
- Vertical rhythm consistent within section, varied between sections
- No 14px / 15px mixed where one should be canonical
- White space serving function, not filler

### Pass 3 — Color consistency
- Same semantic role uses same token (no "almost the same" off-tones)
- OKLCH chroma not creeping high at extremes
- Neutrals tinted toward brand hue uniformly

### Pass 4 — Type detail
- Tracking on display sizes (-1 to -2% on large, +0.5 to +2% on micro)
- Line-height adjusted by size (tighter on display, looser on body)
- Font-feature-settings: numbers (`tnum`, `lnum`), ligatures (`liga`, `dlig`)
- Hanging punctuation where applicable

### Pass 5 — Interactive states
- Hover ≠ focus ≠ active (visually distinguishable)
- Disabled states truly look disabled (not just lighter)
- Loading states match the surface

### Pass 6 — Edge details
- Border weights consistent (1px vs hairline `0.5px` chosen deliberately)
- Radius scale used (no random `borderRadius: 7px`)
- Shadows from same elevation system

### Pass 7 — Motion polish
- Transitions: ease-out exponential, durations match grouping
- Stagger where multiple elements enter/exit together
- No CSS-layout animation (transform/opacity only)

## Polish vs critique

If during polish you discover the underlying composition is wrong → STOP polish, suggest `critique` instead. Polish on broken foundations wastes effort.

## Routing

FROM `polish`, suggest GO TO:

| When polish reveals... | Suggest |
|---|---|
| Production gap (no error state, no overflow handling) | `harden` |
| Type hierarchy broken at small sizes | `typeset` |
| Spacing fundamentally off (not just minor) | `layout` |
| Copy issue | `clarify` |
| Underlying composition wrong | `critique` (re-evaluate before continuing) |

STAY in `polish` UNTIL: all 7 passes complete OR pass reveals foundational issue.

## Anti-patterns

- ❌ Polishing a broken composition (run `critique` first)
- ❌ Skipping passes ("looks fine")
- ❌ Adding features during polish
- ❌ Inconsistent radius/shadow scales surviving polish
- ❌ Animating layout properties for "polish" effect
