<!-- v3 | agente: codex | 2026-05-21 -->
# Teach (Codex)

```
Creates:
  PRODUCT.md (required): register, users, voice, anti-refs, principles, a11y
  DESIGN.md (if code exists): OKLCH colors, type, spacing, components

Multi-round interview (max 6 rounds):

Round 1: Register (most consequential)
  Ask: "Brand (design IS product) or product (design SERVES product)?"
  Cache the answer.

Round 2: Users
  Ask: "Who specifically? In what context?"
  Push for specifics. "Designers" too broad. "Designers + engineers using AI coding tools" good.

Round 3: Brand voice (3 concrete words)
  Ask: "Three physical-object voice words. Not 'modern'/'elegant'."
  Examples: "warm + mechanical + opinionated"
  Push back once if user gives generic.

Round 4: Anti-references
  Ask: "What should this NOT look like? Specific patterns, examples, competitors."
  This is the single highest-leverage answer.

Round 5: Design principles (3-5)
  Ask: "3-5 design principles as commitments, not values."
  Examples: "Practice what you preach"

Round 6 (optional): Existing assets
  If code exists → run /impeccable document for DESIGN.md

Output: PRODUCT.md with 6 sections:
  1. Register (brand | product)
  2. Users
  3. Product Purpose
  4. Brand Personality (paragraph + 3-word voice)
  5. Anti-references (bulleted)
  6. Design Principles (numbered)
  7. Accessibility & Inclusion

After teach:
  - If auto-invoked: resume original command with fresh context
  - If standalone: suggest /impeccable document (if code) or /impeccable shape (else)
```

## Anti-patterns
```
❌ Accept generic answers ("modern", "elegant") — push back
❌ Skip anti-references
❌ >6 rounds (interview fatigue)
❌ Write PRODUCT.md missing sections
❌ Forget to refresh context after writing
```
