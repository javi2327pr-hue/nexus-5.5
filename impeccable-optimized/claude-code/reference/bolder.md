<!-- v3 | agente: claude-code | 2026-05-21 -->
# Bolder (Claude Code)

Amplify safe or bland designs. Increase visual impact while maintaining usability.

## Use this command when

User says: "bland", "generic", "too safe", "lacks personality", "more impact", "more character", "boring".

## How to make bolder (5 levers, in order of impact)

### 1. Color commitment
Move up the color strategy axis:
- Restrained → Committed (one saturated color carries 30-60% of surface)
- Committed → Full palette (3-4 named roles)
- Full palette → Drenched (the surface IS the color)

The reflex of "make it bolder" is usually to ADD color. The right move is often to COMMIT to one color harder.

### 2. Typography weight contrast
Increase ratio between display and body weights. A 400/700 body/display gets visibility from 300/900. Add italic for additional contrast plane.

For brand register: introduce a display serif if currently sans-only (or vice versa). Reflex-reject the obvious choices (Fraunces, Cormorant, Playfair — see brand.md list).

### 3. Scale jumps
Increase modular scale ratio. 1.25 → 1.333 → 1.5. Bigger headlines, smaller secondary type. Compression of the middle.

### 4. Asymmetry + signature motif
Symmetrical layouts read as safe. Introduce ONE deliberate asymmetry: off-center hero, oversized first letter, full-bleed photo escaping the grid. Stop at one.

### 5. Motion as accent
If currently static: add ONE motion moment (entrance stagger, scroll-driven reveal, hover affordance with personality). Don't blanket-animate.

## Register-specific bolder

| Register | Direction |
|---|---|
| **Brand** | Go for distinctiveness. Aesthetic-lane commitment. Anti-references guide what NOT to amplify. |
| **Product** | Carefully. Bolder in product = clearer hierarchy, not visual noise. Earned familiarity stays the bar. |

## The "went too far" check

After bolder:
- Does it pass the AI slop test 1st AND 2nd order? (If not, you amplified into a cliché)
- Is the primary user task still obvious? (If not, visual noise overwhelmed signal)

→ If either fails, run `quieter` once to find the right point.

## Routing

FROM `bolder`, suggest GO TO:

| When... | Suggest |
|---|---|
| Overshot — overstimulating | `quieter` |
| Underlying composition is the problem | `craft` (re-do) or `critique` |
| Final pass needed | `polish` |
| Want to add motion specifically | `animate` |
| Want to add color specifically | `colorize` |

STAY in `bolder` UNTIL: impact increased AND slop test passes AND primary task obvious.

## Anti-patterns

- ❌ Adding color when committing harder to one color would work
- ❌ Amplifying into a category cliché (observability → dark blue louder)
- ❌ Adding 5 signature motifs (pick one, commit)
- ❌ "Bolder" on a product surface = visual noise, not clearer hierarchy
