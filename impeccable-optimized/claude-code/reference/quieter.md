<!-- v3 | agente: claude-code | 2026-05-21 -->
# Quieter (Claude Code)

Tone down visually aggressive or overstimulating designs. Reduce intensity while preserving quality.

## Use this command when

User says: "too bold", "too loud", "overwhelming", "aggressive", "garish", "calmer", "more refined".

## How to make quieter (5 levers, in order of impact)

### 1. Color de-escalation
Move down the color strategy axis:
- Drenched → Full palette
- Full palette → Committed
- Committed → Restrained (one accent ≤10%)

Or: keep strategy but reduce chroma — pull saturated colors toward muted variants (oklch chroma 0.2 → 0.12 → 0.08).

### 2. Spacing increase
Overstimulation often = density. Add whitespace. Section spacing scale: 2× current vertical rhythm. Let things breathe.

### 3. Weight + scale compression
Reduce weight contrast between hierarchy steps. Compress scale ratio. The eye stops getting yanked between sizes.

### 4. Motion reduction
Remove decorative animations. Keep functional ones (loading, focus, state changes). Remove staggers if 5+ items. Reduce duration on remaining motion.

### 5. Decoration removal
Side note: this overlaps with `distill` — they're different intents. Quieter reduces INTENSITY of present elements; distill REMOVES elements. Apply distill if there's chrome to cut.

## Register-specific quieter

| Register | Direction |
|---|---|
| **Brand** | Move toward editorial restraint. Type carries identity instead of color. |
| **Product** | Move toward earned-familiarity. Predictable, trustworthy. |

## The "went too quiet" check

After quieter:
- Did it lose distinctiveness entirely? (Brand) — Reading like generic SaaS = went too far
- Did hierarchy collapse? — Quieter shouldn't kill the eye's path through the page

→ If either fails, run `bolder` once to find the right point.

## Routing

FROM `quieter`, suggest GO TO:

| When... | Suggest |
|---|---|
| Undershot — now bland | `bolder` |
| Visual elements should also be REMOVED, not just toned | `distill` |
| Type now needs to carry more | `typeset` |
| Final pass | `polish` |

STAY in `quieter` UNTIL: intensity reduced AND distinctiveness/hierarchy preserved.

## Anti-patterns

- ❌ Quieter = strip color entirely (you want commitment, not absence)
- ❌ Quieter on a brand surface that should be loud (luxury isn't always quiet; "calm" isn't always right)
- ❌ Conflating with `distill` (different operation)
- ❌ Removing all motion (kill focus rings, kill loading states = bad UX)
