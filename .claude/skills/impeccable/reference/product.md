<!-- v3 | agente: claude-code | 2026-05-21 -->
# Product register

Design SERVES the product. Loaded by SKILL.md Setup when register = product. Applies to: app UI, admin panels, dashboards, internal tools, settings, configuration UI.

## The stance

Earn the user's fluency. The bar is **trust through familiarity**: a fluent user of Linear, Figma, Notion, Raycast, or Stripe should land on your product and trust it immediately because the patterns are predictable.

## The product slop test

The failure mode is **visual noise** masquerading as quality. "Bolder" doesn't mean louder on product surfaces; it means clearer hierarchy. "Polish" doesn't mean adding decoration; it means tightening detail.

If a screen looks more like a SaaS marketing page than like a tool, it's drifted into brand register by accident.

## Anchors (fluent-user references)

| Anchor | What it teaches |
|---|---|
| Linear | Density without clutter. Motion as feedback, not decoration. Keyboard-first. |
| Figma | Surface mode shifts. Direct manipulation. Property panels. |
| Notion | Progressive disclosure. Slash menu fluency. Editorial in a tool. |
| Stripe | Form discipline. Error states that teach. Predictable patterns. |
| Raycast | Speed signal. Density. Keyboard-first. |
| Vercel | Status surfaces. Logs at scale. Subdued visual identity. |
| Mercury | Bank UX with restraint. Numbers tabular. Trust through quiet. |
| Discord | Information-dense without overwhelming. Channel hierarchy. |
| Things 3 | Refusal of decoration. Type and space carry the design. |

Don't copy any of these — match their **stance**, not their pixels.

## Product typography

- One sans-serif family (Inter, IBM Plex, system-ui — reflex-reject list relaxes here)
- Weight contrast within family (300/400/500/600/700)
- Numbers tabular by default (`tnum`)
- Reading sizes: 13-15px body, 11-12px micro labels
- Line length: 65-75ch for prose, narrower for data tables

## Product color

- **Restrained** by default — tinted neutrals + 1 accent ≤10%
- Committed acceptable for identity-driven product moments (brand mark, primary CTA)
- Full palette for data viz only
- Never Drenched (that's brand)

## Product layout

- Predictable grids
- Asymmetry only where it signals priority (e.g., wider main panel + narrow sidebar)
- Vertical rhythm consistent within sections
- Touch-friendly at coarse pointer (44×44 targets)

## Product motion

- Functional motion only (loading, focus, state changes)
- ≤150ms for most state changes (feedback should feel instant)
- Invisible motion, not impressive motion
- Reduced-motion fallback always

## Product copy

- Clarity over voice
- Action verbs on buttons
- Specific error messages
- No marketing copy in functional UX
- Settings descriptions: clinical and precise

## Data density

Product surfaces often need higher density than brand. Patterns:
- Tabular layout
- Inline editing
- Hover-revealed actions (with keyboard equivalents)
- Filtering / sorting / search as primary affordances
- Virtual scrolling for >100 items

## Product-register-specific failures

- Drifting into marketing aesthetic (gradients, hero metrics, identical card grids)
- Over-animating ("delightful" loading on data-dense surfaces)
- Brand voice in error messages
- Inadequate hierarchy ("everything equal weight")
- Touch targets too small at coarse pointer
- Settings that read as marketing
