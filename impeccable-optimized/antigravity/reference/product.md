<!-- v3 | agente: antigravity | 2026-05-21 -->
# Product register (Antigravity)

## Applicability
Loaded by SKILL.md Setup when register = product. Applies to: app UI, admin panels, dashboards, internal tools, settings, configuration UI.

## Stance
Earn the user's fluency. Bar: trust through familiarity — a fluent Linear/Figma/Notion/Raycast/Stripe user lands and trusts immediately.

## Constraints
1. Product slop test passes: visual noise masquerading as quality is the failure mode
2. "Bolder" on product means clearer hierarchy, not louder visuals
3. "Polish" on product means tighter detail, not more decoration
4. Drift into marketing aesthetic (gradients, hero metrics, identical card grids) is failure
5. One sans-serif family (Inter, Plex, system-ui — reflex-reject list relaxes for product)
6. Weight contrast within family (300-700 range)
7. Numbers tabular by default (tnum)
8. Color: Restrained default, Committed for identity, Full palette for data viz, never Drenched
9. Layout: predictable grids; asymmetry signals priority
10. Touch targets ≥44×44 at coarse pointer
11. Motion: functional only; ≤150ms state; invisible-not-impressive
12. Copy: clarity over voice; action verbs; clinical settings

## Acceptance criteria for product output
1. Slop test (1st + 2nd-order) passes
2. Fluent-user trust check: would a Linear/Figma/Notion user trust this?
3. Restraint with intent (not by reflex)
4. Hierarchy clear within 3-second glance
5. Touch targets verified at coarse pointer
6. Motion functional only (no decorative animations on dense surfaces)
7. No brand voice in error messages
8. Settings descriptions clinical-not-marketing

## Fluent-user anchors (stance, not pixels)
- Linear: density without clutter
- Figma: surface mode shifts, direct manipulation
- Notion: progressive disclosure, slash menu
- Stripe: form discipline, error states that teach
- Raycast: speed signal, keyboard-first
- Vercel: status surfaces, subdued visual identity
- Mercury: trust through quiet, numbers tabular
- Things 3: refusal of decoration

## Failure modes
- Brand-marketing aesthetic crept into product surface → flag, redirect to product anchors
- "Delight" requested on data-dense surface → push back (cognitive cost), suggest functional motion only
- User asks for higher visual contrast → check it's hierarchy clarity, not noise
- Settings descriptions read as marketing → rewrite clinical
- Mobile breakpoint compresses density too much → reflow, not just shrink
