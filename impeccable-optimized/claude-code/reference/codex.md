<!-- v3 | agente: claude-code | 2026-05-21 -->
# Codex visual direction flow (special reference)

Loaded by `craft` Step 3 ONLY on Codex harness (native `image_gen`). Other harnesses get fallback (see `patches/03-asset-producer-cross-harness.md`).

## When loaded

```
craft Step 3 → asset-producer-fallback.mjs exits 0 (Codex) → load this file
```

Other harnesses get a structured fallback message; this file is not loaded.

## Step A — Direction questions

Ask the user 2-4 direction questions ONLY if the brief is ambiguous on visual direction. Otherwise skip to Step B.

Question topics (pick the ambiguous ones):
- **Anchor reference** — "Which visual lane? Mention 1-2 reference brands or aesthetic families."
- **Imagery style** — "Photography (editorial / product / lifestyle), illustration (vector / hand / 3D), or both?"
- **Atmosphere** — "Warm / cool / neutral? Dense / spacious? Loud / quiet?"
- **Type personality** — "Display serif (editorial feel), committed sans (tech feel), or display-as-identity (cultural)?"

STOP at end of Step A. Wait for answers.

```bash
node scripts/checkpoint.mjs --gate=2 --status=confirmed
```

## Step B — Palette generation

Generate 3 palette options based on PRODUCT.md + Step A answers:

```
Palette 1: <name> — <2-line description, OKLCH values for primary, accent, neutrals>
Palette 2: <name> — ...
Palette 3: <name> — ...
```

Each palette must:
- Pass category reflex check (avoid dark-blue-observability, navy-gold-finance, etc.)
- Use OKLCH
- Tint neutrals toward primary hue
- Be reflex-reject-aware

User picks one. STOP. Wait.

```bash
node scripts/checkpoint.mjs --gate=3 --status=confirmed
```

## Step C — Mock generation

Generate 2-3 mocks using `image_gen` with prompt informed by:
- PRODUCT.md (users, voice, anti-references)
- Confirmed palette
- Confirmed direction answers
- Required imagery (per brief)

Prompts should specify:
- Composition (hero + sections)
- Type pairing
- Imagery placement and content
- Atmosphere descriptors (2-3 adjectives)

## Step D — Approval loop

Present mocks. User picks ONE direction (not "I like elements of all"). If user wants iteration, regenerate that single direction with refinements.

```bash
node scripts/checkpoint.mjs --gate=4 --status=confirmed
```

**Do NOT proceed to code without explicit gate-4 confirmation.**

## Step E — Mock-fidelity inventory

Catalog everything in the approved mock:
- Composition (hero shape, section layouts, signature motifs)
- Type system (display + body + micro labels)
- Color tokens (OKLCH values for every used color)
- Spacing rhythm (visual analysis)
- Imagery slots (size, placement, content type)
- Motion implications (entrance, scroll behavior)

This inventory IS the contract for the build.

## Step F — Asset slicing

Invoke the `impeccable_asset_producer` subagent with:
- Approved mock path
- Crop paths or contact sheet
- Output directory
- Required dimensions + formats + transparency needs
- Avoid list (what to remove: card chrome, baked shadows, layout background)
- What stays semantic HTML/CSS/SVG vs raster

Subagent returns clean rasters. Use them in the build (Step 4 of craft).

## Return to craft

After Steps A-F complete, return to `craft.md` Step 4 (Build to Production Quality). All 4 gates confirmed. Code may now be written.

## Anti-patterns

- ❌ Skipping Step A and jumping to palette
- ❌ Compressing gates 2-4 (the dominant failure mode of craft)
- ❌ Generating mocks without confirming palette first
- ❌ Multiple-direction acceptance ("I like elements of all" → ask user to pick ONE)
- ❌ Invoking impeccable_asset_producer outside Codex
- ❌ Treating the mock as a suggestion instead of the contract
