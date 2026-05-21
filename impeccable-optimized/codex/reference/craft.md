<!-- v3 | agente: codex | 2026-05-21 -->
# Craft Flow (Codex)

Build a feature end-to-end with 4 mechanical gates pre-code.

## Step 0 — Project foundation
```
1. ls cwd
2. Detect framework (astro/next/nuxt/vite/svelte/cargo+leptos/gemfile+rails)
3. If detected → use it (no parallel builds, no second framework)
4. If empty → AskUserQuestion: Astro | SvelteKit | Next | single HTML
5. Detect component library, icon set → use what's there
```

## Step 1 — Gate 1: shape
```
1. Run /impeccable shape <feature>
2. Present output
3. STOP, wait for user confirmation/override
4. On confirm: node scripts/checkpoint.mjs --gate=1 --status=confirmed
5. Closing line: "Confirm; once locked, I'll run palette and reference questions before mocks."
```

## Step 2 — Load references
```
Always: reference/spatial-design.md, reference/typography.md
Conditional:
  forms/interactions → reference/interaction-design.md
  animation         → reference/motion-design.md
  color-heavy       → reference/color-and-contrast.md
  responsive needs  → reference/responsive-design.md
  copy-heavy        → reference/ux-writing.md
```

## Step 3 — Gates 2-4: visual direction (CODEX FLOW)

You have native image_gen. Execute Codex flow.

```
A. Load reference/codex.md
B. Step A in codex.md: direction questions → STOP, await answers
   → checkpoint.mjs --gate=2 --status=confirmed
C. Step B in codex.md: palette confirmation → STOP, await
   → checkpoint.mjs --gate=3 --status=confirmed
D. Step C-D in codex.md: mock generation, exploration loop → user picks ONE direction
   → checkpoint.mjs --gate=4 --status=confirmed
E. Step E in codex.md: mock-fidelity inventory (everything in the mock catalogued)
F. Step F in codex.md: invoke impeccable_asset_producer subagent for raster assets
```

⚠️ COMPRESSING GATES 2-4 AFTER GATE 1 IS THE DOMINANT FAILURE MODE.
The checkpoint script enforces this mechanically. Do NOT advance on "shape felt complete".

## Step 4 — Build (PRECONDITION: gate 4 confirmed)
```
1. node scripts/checkpoint.mjs --check --gate=4
2. If exit non-zero → STOP, complete prior gates
3. If exit 0 → write code:
   - Respect framework + design system + icon set discovered in Step 0
   - Use approved mock as contract: composition, hierarchy, density, signature motifs
   - Use sliced assets from impeccable_asset_producer
   - Do NOT replace imagery with CSS scenery / fake metrics / decorative panels / filler
```

## Step 5 — Visual iteration
```
1. Run dev server (project's existing command)
2. Open in browser (e.g., headless puppeteer for screenshot)
3. Compare live result against approved mock
4. Iterate until major ingredients of approved direction present
```

## Step 6 — Emit and route
```
Output: code committed + screenshots + brief diff of mock vs. live
Suggest next:
  - /impeccable polish — final quality pass
  - /impeccable harden — production gaps (errors, i18n, overflow)
  - /impeccable live — in-browser iteration
STOP. Do not chain.
```

## Anti-patterns
```
❌ Skip Step 0 (project foundation inspection)
❌ Compress gates 2-4 after Gate 1
❌ Run impeccable_asset_producer outside Codex
❌ Replace required imagery with CSS scenery
❌ Default silently on greenfield framework
❌ Skip checkpoint script ("I'll be careful")
```
