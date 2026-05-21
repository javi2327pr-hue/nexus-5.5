<!-- v3 | agente: codex | 2026-05-21 -->
# Polish (Codex)

```
Precondition: underlying design is sound (not broken composition).
If composition feels broken → STOP, suggest /impeccable critique.

Step 1: Pass 1 — pixel alignment
  - baselines, x-heights, optical vs geometric center
  - grid adherence (no orphan 1px offsets)
  - icon size ratios to type

Step 2: Pass 2 — spacing rhythm
  - vertical rhythm consistent within section
  - varied between sections
  - no 14/15px mixed where one should be canonical
  - white space serves function

Step 3: Pass 3 — color consistency
  - same semantic role = same token
  - OKLCH chroma not creeping at extremes
  - neutrals tinted uniformly toward brand hue

Step 4: Pass 4 — type detail
  - tracking: -1 to -2% on display, +0.5 to +2% on micro
  - line-height by size: tighter display, looser body
  - font-feature-settings: tnum, lnum, liga, dlig where appropriate
  - hanging punctuation if applicable

Step 5: Pass 5 — interactive states
  - hover ≠ focus ≠ active (visually distinct)
  - disabled truly looks disabled
  - loading states match surface

Step 6: Pass 6 — edge details
  - border weights consistent (1px vs 0.5px chosen)
  - radius scale (no random borderRadius: 7px)
  - shadows from same elevation system

Step 7: Pass 7 — motion polish
  - ease-out exponential, durations match grouping
  - stagger for multi-element enter/exit
  - NO CSS-layout animation (transform/opacity only)

Step 8: Emit diff + route
  Route:
    production gap (errors, overflow)  → /impeccable harden
    type hierarchy at small sizes      → /impeccable typeset
    spacing fundamentally off          → /impeccable layout
    copy issue                          → /impeccable clarify
    composition wrong                   → /impeccable critique
```

## Anti-patterns
```
❌ Polish broken composition (run critique first)
❌ Skip passes
❌ Add features during polish
❌ Mixed radius / shadow scales surviving
❌ CSS-layout animation as "polish effect"
```
