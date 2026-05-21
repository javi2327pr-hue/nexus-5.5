<!-- v3 | agente: codex | 2026-05-21 -->
# Codex visual direction flow (Codex special ref)

```
LOADED BY: craft Step 3 on Codex (native image_gen)
NOT LOADED: other harnesses (they get fallback message)

────────────────────────────────────────────────
Step A — Direction questions (if brief ambiguous)
────────────────────────────────────────────────
Ask 2-4 questions ONLY on ambiguous topics:
  - Anchor reference (visual lane, 1-2 brand/aesthetic refs)
  - Imagery style (photo / illustration / both)
  - Atmosphere (warm/cool, dense/spacious, loud/quiet)
  - Type personality (display serif / committed sans / type-as-identity)

STOP. Wait for answers.
node scripts/checkpoint.mjs --gate=2 --status=confirmed

────────────────────────────────────────────────
Step B — Palette generation
────────────────────────────────────────────────
Generate 3 palette options from PRODUCT.md + Step A answers:
  Palette 1: <name> — <2-line desc + OKLCH for primary, accent, neutrals>
  Palette 2: ...
  Palette 3: ...

Each must:
  - Pass category reflex check
  - Use OKLCH
  - Tint neutrals toward primary
  - Reflex-reject-aware

User picks one. STOP.
node scripts/checkpoint.mjs --gate=3 --status=confirmed

────────────────────────────────────────────────
Step C — Mock generation
────────────────────────────────────────────────
Generate 2-3 mocks via image_gen. Prompts include:
  - Composition (hero + sections)
  - Type pairing
  - Imagery placement and content
  - Atmosphere (2-3 adjectives)
  - PRODUCT.md voice, anti-references
  - Confirmed palette
  - Confirmed direction answers
  - Required imagery (per brief)

────────────────────────────────────────────────
Step D — Approval loop
────────────────────────────────────────────────
Present mocks. User picks ONE direction.
If iteration requested, regenerate that ONE direction.
DO NOT accept "I like elements of all" — ask user to commit.
node scripts/checkpoint.mjs --gate=4 --status=confirmed

DO NOT PROCEED TO CODE WITHOUT EXPLICIT GATE-4 CONFIRMATION.

────────────────────────────────────────────────
Step E — Mock-fidelity inventory
────────────────────────────────────────────────
Catalog from approved mock:
  - Composition (hero shape, sections, signature motifs)
  - Type system (display + body + micro labels)
  - Color tokens (OKLCH values for every used color)
  - Spacing rhythm
  - Imagery slots (size, placement, content type)
  - Motion implications (entrance, scroll behavior)

This inventory IS the contract for the build.

────────────────────────────────────────────────
Step F — Asset slicing
────────────────────────────────────────────────
Invoke impeccable_asset_producer subagent with:
  - Approved mock path
  - Crop paths or contact sheet
  - Output directory
  - Dimensions + formats + transparency
  - Avoid list (card chrome, baked shadows, layout bg)
  - What stays HTML/CSS/SVG vs raster

────────────────────────────────────────────────
Return
────────────────────────────────────────────────
Steps A-F complete + all 4 gates confirmed
→ Return to craft.md Step 4 (Build to Production Quality)

PITFALLS:
  ❌ Skip Step A, jump to palette
  ❌ Compress gates 2-4
  ❌ Generate mocks without palette confirmed
  ❌ Multiple-direction acceptance ("I like all elements")
  ❌ Invoke impeccable_asset_producer outside Codex
  ❌ Treat mock as suggestion, not contract
```
