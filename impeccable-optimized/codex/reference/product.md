<!-- v3 | agente: codex | 2026-05-21 -->
# Product register (Codex)

```
WHEN LOADED: SKILL.md Setup, when register = product
APPLIES TO: app UI, admin panels, dashboards, internal tools, settings, config UI

STANCE: earn user's fluency
BAR: trust through familiarity — fluent Linear/Figma/Notion/Raycast/Stripe user lands and trusts

PRODUCT SLOP TEST:
  Failure = visual noise masquerading as quality
  "Bolder" on product = clearer hierarchy, not louder
  "Polish" on product = tighter detail, not more decoration
  If screen looks like SaaS marketing page → drifted into brand by accident

ANCHORS (fluent-user references, match stance not pixels):
  Linear   density without clutter; motion as feedback; keyboard-first
  Figma    surface mode shifts; direct manipulation; property panels
  Notion   progressive disclosure; slash menu; editorial in a tool
  Stripe   form discipline; error states that teach; predictable patterns
  Raycast  speed signal; density; keyboard-first
  Vercel   status surfaces; logs at scale; subdued visual identity
  Mercury  bank UX with restraint; numbers tabular; trust through quiet
  Discord  info-dense without overwhelming; channel hierarchy
  Things 3 refusal of decoration; type and space carry design

TYPOGRAPHY:
  - One sans-serif family (Inter, IBM Plex, system-ui — reflex-reject relaxes here)
  - Weight contrast within family (300/400/500/600/700)
  - Numbers TABULAR by default (tnum)
  - Reading sizes: 13-15px body, 11-12px micro labels
  - Line length: 65-75ch prose, narrower for data tables

COLOR:
  Restrained by default (tinted neutrals + 1 accent ≤10%)
  Committed acceptable for identity moments (brand mark, primary CTA)
  Full palette for data viz only
  NEVER Drenched (brand only)

LAYOUT:
  Predictable grids
  Asymmetry only where signals priority (wide main + narrow sidebar)
  Vertical rhythm consistent within sections
  Touch-friendly at coarse pointer (44x44)

MOTION:
  Functional only (loading, focus, state changes)
  ≤150ms for state changes (feedback feels instant)
  Invisible motion, not impressive
  Reduced-motion fallback always

COPY:
  Clarity over voice
  Action verbs on buttons
  Specific error messages
  No marketing copy in functional UX
  Settings descriptions: clinical and precise

DATA DENSITY:
  Higher than brand. Patterns:
    Tabular layout
    Inline editing
    Hover-revealed actions (with keyboard equiv)
    Filtering / sorting / search as primary affordances
    Virtual scrolling for >100 items

PRODUCT-SPECIFIC FAILURES:
  ❌ Drifting into marketing aesthetic (gradients, hero metrics, identical cards)
  ❌ Over-animating ("delightful" loading on data-dense)
  ❌ Brand voice in error messages
  ❌ Inadequate hierarchy ("everything equal weight")
  ❌ Touch targets too small at coarse pointer
  ❌ Settings that read as marketing
```
