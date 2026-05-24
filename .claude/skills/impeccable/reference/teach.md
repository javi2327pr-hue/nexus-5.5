<!-- v3 | agente: claude-code | 2026-05-21 -->
# Teach (Claude Code)

One-time setup: gather design context, write PRODUCT.md + DESIGN.md. Every other command reads these.

## Use this command when

- PRODUCT.md missing, empty, or placeholder
- User says "set up", "configure", "teach impeccable about my project"
- Another command auto-invokes `teach` as a blocker

## What gets created

| File | Contains | Required? |
|---|---|---|
| **PRODUCT.md** | Register, users, brand voice, anti-references, design principles, a11y commitments | YES |
| **DESIGN.md** | Colors (OKLCH), typography, spacing, components — if code exists | If code exists |

## Multi-round interview

### Round 1 — Register (the most consequential question)

> "Is this **brand** (marketing, landing, campaign — design IS the product) or **product** (app UI, dashboard, tool — design SERVES the product)?"

Cache the answer. Skip if user already set it.

### Round 2 — Users

> "Who specifically uses this? In what context? What's their relationship to the category?"

Push for specifics. "Designers" is too broad. "Designers and engineers using AI coding tools" is good. "SREs glancing at incident severity at 2am" is great.

### Round 3 — Brand voice (3 words)

> "Three concrete words for the brand's voice. Not 'modern' or 'elegant' — physical-object words like 'warm + mechanical + opinionated' or 'calm + clinical + careful'."

If the user gives generic words, push back once.

### Round 4 — Anti-references

> "What should this NOT look like? Specific patterns, specific examples, specific competitors."

This is the single highest-leverage answer. The reflex-reject list works from this.

### Round 5 — Design principles (3-5)

> "Three to five design principles. Phrased as commitments, not values."

Examples: "Practice what you preach", "Show, don't tell", "Editorial over marketing".

### Round 6 (optional) — Existing assets

If code exists: run `document` flow to extract DESIGN.md.

## PRODUCT.md template

```markdown
# Product

## Register
<brand | product>

## Users
<paragraph: who specifically, where, in what context>

## Product Purpose
<paragraph: what it does, what success looks like>

## Brand Personality
<paragraph + three-word voice>

## Anti-references
<bulleted list of specific patterns/competitors to avoid>

## Design Principles
1. <principle>
2. <principle>
3. <principle>

## Accessibility & Inclusion
<baseline + specific commitments>
```

## After teach completes

Resume the original command (if `teach` was invoked as a blocker). Refresh context cache.

## Routing

FROM `teach`, GO TO:

| Context | Resume |
|---|---|
| Auto-invoked from another command | resume that command with fresh context |
| Standalone | suggest `document` if code exists; else suggest `shape` for first feature |

STAY in `teach` UNTIL: PRODUCT.md written + register set + anti-references captured.

## Anti-patterns

- ❌ Generic answers accepted ("modern", "elegant") — push back
- ❌ Skipping anti-references ("we don't really have any")
- ❌ More than 6 rounds (interview fatigue)
- ❌ Writing PRODUCT.md without all 6 sections
- ❌ Forgetting to refresh context after writing files
