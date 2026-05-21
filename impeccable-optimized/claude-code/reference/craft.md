<!-- v3 | agente: claude-code | 2026-05-21 -->
# Craft Flow (Claude Code)

Build a feature with impeccable UX and UI quality end-to-end: shape → visual direction → production code → in-browser iteration. **4 gates pre-code, mechanically enforced.**

## Use this command when

User says: "build", "make", "create", "implement" a feature, page, screen, or component end-to-end.

## Preconditions

- PRODUCT.md loaded (Setup completed via SKILL.md root)
- Register identified, register reference loaded
- Working directory inspected (Step 0)

## Step 0 — Project Foundation

```bash
ls
# Inspect for: framework configs (astro.config, next.config, vite.config, package.json),
#             component library (src/components/, tokens.css, theme.ts),
#             icon set (lucide, phosphor, iconify, hand-rolled SVG)
```

If found → use it. Never start a parallel build.
If empty (greenfield) → AskUserQuestion: Astro (default for brand) / SvelteKit / Next / single HTML. **Do not default silently.**

## Step 1 — Shape (Gate 1)

Run `{{command_prefix}}impeccable shape <feature description>`. Required.

Present output, **STOP**, wait for user confirmation.

```bash
node {{scripts_path}}/checkpoint.mjs --gate=1 --status=confirmed
```

Closing line: "Confirm or override; once we lock direction, I'll run a couple of palette and reference questions before generating any mocks."

For trivial briefs (clear scope, content, visual direction from PRODUCT.md): compact shape OK (3-5 bullets + "confirm or override"). For ambiguous/multi-screen/stakeholder-heavy: full 10-section structured brief.

## Step 2 — Load References

Always load:
- `reference/spatial-design.md`
- `reference/typography.md`

Conditional based on brief:
- Forms/interactions → `reference/interaction-design.md`
- Animation → `reference/motion-design.md`
- Color-heavy → `reference/color-and-contrast.md`
- Responsive needs → `reference/responsive-design.md`
- Copy-heavy → `reference/ux-writing.md`

## Step 3 — Visual Direction (Gates 2-4, harness-gated)

```bash
node {{scripts_path}}/asset-producer-fallback.mjs <brief_path> <output_dir>
```

**On Codex (exit 0)**: load `reference/codex.md`, execute Steps A-F (direction questions → palette → mock generation → approval → mock-fidelity inventory → asset slicing via `impeccable_asset_producer` subagent).

After A → `--gate=2 --status=confirmed`
After B → `--gate=3 --status=confirmed`
After D → `--gate=4 --status=confirmed`

**On non-Codex (exit 2)**: emit fallback message verbatim, STOP for user. User opts: provide imagery / `--no-assets` / abort.

**⚠️ Compressing gates 2-4 after Gate 1 confirmation is the dominant failure mode.** The checkpoint script makes this mechanically impossible.

## Step 4 — Build to Production Quality

**Precondition**: `--check --gate=4` must return 0.

Build:
- Respect project framework + design system + icon set
- Use approved visual direction as contract for composition, hierarchy, density, atmosphere, signature motifs
- Don't replace required imagery with CSS scenery, fake metrics, decorative panels, filler copy
- Image-led briefs (restaurants, hotels, magazines, food, travel, fashion, product) need real/sourced imagery

## Step 5 — Visual Iteration

If running on a harness with browser inspection (Claude Code, Codex via puppeteer): screenshot the live result, compare against approved direction, iterate. Major ingredients of approved direction must be present.

## Routing

FROM `craft`, suggest GO TO:

| When you find... | Suggest | Trigger |
|---|---|---|
| Build is live, time for final pass | `polish` | implementation complete, before ship |
| Production gaps surfaced | `harden` | edge cases, i18n, overflow, error states |
| Visual tuning needed in-browser | `live` | dev server running, want variants |
| Direction confirmed but framework choice ambiguous | AskUserQuestion | greenfield directory |

STAY in `craft` UNTIL: all 4 gates confirmed AND production code committed AND visual iteration converged.

## Anti-patterns

- ❌ Compressing gates 2-4 after Gate 1 ("shape felt complete")
- ❌ Starting a parallel build in a directory that already has a framework
- ❌ Defaulting silently on greenfield framework choice
- ❌ Replacing required imagery with CSS scenery
- ❌ Treating shape confirmation as code-green when harness has image_gen
