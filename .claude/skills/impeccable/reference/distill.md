<!-- v3 | agente: claude-code | 2026-05-21 -->
# Distill (Claude Code)

Strip designs to essence by removing unnecessary complexity. Simple, powerful, clean.

## Use this command when

User says: "simplify", "declutter", "reduce noise", "remove", "cleaner", "more focused", "less is more".

## What distill removes

| Category | Examples |
|---|---|
| **Decorative chrome** | Unnecessary borders, gratuitous shadows, ornamental icons-as-decoration |
| **Visual filler** | "Hero illustrations" with no semantic purpose, divider lines doing the work of whitespace |
| **Cognitive overhead** | Multiple CTAs competing, more than one primary action per surface |
| **Information bloat** | Stats nobody reads, captions repeating headlines, redundant labels |
| **Copy duplication** | "Welcome to X" + "Here at X we believe..." + "X is built for..." (pick one) |
| **Component layering** | Nested cards, cards inside containers inside cards (collapse) |
| **Color noise** | Too many semantic colors when 2-3 do the work of 7 |
| **Type hierarchy bloat** | 7 type sizes when 3 carry the load |

## What distill does NOT remove

- **Function**: never remove something that does a job (use `harden` to verify edge cases are still covered)
- **Identity**: brand signature motifs stay (Stripe's gradient, Linear's typography — those ARE the brand)
- **Affordance signaling**: a button must still look like a button
- **Accessibility**: focus rings, error states, semantic structure stay

## Flow

### Step 1 — Audit what's present

Inventory: every visual element + its job.

```
For each element:
  job = <semantic purpose>  // navigation, content, action, feedback, decorative
  if job == "decorative": candidate for removal
  if job is duplicate of another element: candidate for collapse
```

### Step 2 — Test the "if I removed this..." question

For each candidate: would removing this break a user task? If no → remove.

### Step 3 — Apply removal in tiers

| Tier | Risk | Apply |
|---|---|---|
| Tier 1 (safe) | Pure decoration, duplicate copy, redundant icons | Remove freely |
| Tier 2 (medium) | Filler illustrations, divider lines, secondary CTAs | Remove but verify |
| Tier 3 (risky) | Whole sections, columns, hierarchy steps | AskUserQuestion |

### Step 4 — Reassess

After removal, the design may need:
- **Bolder typography** to carry hierarchy that decorative elements were doing
- **More whitespace** (not less — distill is removing chrome, not collapsing)
- **One commit on primary action** (now that competing CTAs are gone)

## The "distill went too far" check

If after distill the surface:
- Feels skeletal / placeholder-y / "AI generated"
- Lost personality entirely
- Reads like a wireframe

→ STOP, suggest `bolder` to amplify the remaining structure.

## Routing

FROM `distill`, suggest GO TO:

| When... | Suggest |
|---|---|
| Result feels skeletal | `bolder` |
| Type now carries hierarchy that chrome was doing | `typeset` |
| Whitespace needs proportional adjustment | `layout` |
| Removed something user actually used | revert + ask user |

STAY in `distill` UNTIL: removal converges (nothing more is safely removable).

## Anti-patterns

- ❌ Removing function alongside decoration
- ❌ Removing brand signature motifs ("they looked decorative")
- ❌ Collapsing whitespace as part of distill (different operation)
- ❌ Aggressive distill on brand register (distinctiveness can read as "complexity")
- ❌ Skipping the "if I removed this..." check (assumption-based removal)
