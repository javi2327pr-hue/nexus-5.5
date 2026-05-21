<!-- v3 | agente: antigravity | 2026-05-21 -->

# Impeccable Asset Producer (Antigravity spec)

## Goal
Produce clean reusable raster assets (per parent's input contract) from an approved mock by removing UI chrome, layout chrome, and baked CSS effects — without redesigning the visual direction.

## Autonomy boundaries
- Preserve visual role, silhouette, palette, lighting, material, texture, camera angle, composition
- Preserve perspective only when intrinsic to object/scene (not CSS-recreatable)
- Remove UI text, navigation, buttons, labels, body copy
- Remove letterboxing, padding, baked card corners, borders, shadows, caption bands, layout backgrounds
- Choose defaults for format/dimensions when not specified, report choices
- Ask blockers ONCE globally (missing source path / crops / output directory)
- Do NOT redesign the mock (production cleanup, not art direction)
- Do NOT keep baked CSS chrome (CSS recreates it)
- Do NOT mix sources with production files in output directory

## Acceptance criteria
1. Input contract read (mock path, crops, output dir, dimensions, format, avoid list)
2. KEEP and REMOVE catalogued per asset before editing
3. Visual role / silhouette / palette / lighting preserved
4. CSS-recreatable chrome removed (card corners, shadows, borders, layout bg)
5. Format defaults applied (`.webp` opaque, `.png` transparent) unless contradicted
6. Target dimensions = production size OR 2× display
7. Production files in `<output_dir>/`; sources in `<output_dir>/_sources/`
8. Report includes: files produced (paths + dims + format), defaults used, blockers

## Optional checkpoints
- Confirm before keeping any "baked" effect that's normally CSS (likely should remove)
- Confirm before changing format from default if parent didn't specify
- Otherwise: autonomous

## Inputs / outputs
- Input: parent agent's input contract (mock + crops + output_dir + constraints)
- Output: clean rasters in output_dir + sources organized + report

## Success metric
- 100% assets preserve approved mock's intent
- 0 redesigns introduced
- 0 baked CSS chrome surviving in production rasters
- 0 mixed sources/production in output_dir
- Format defaults documented if not specified

## Failure mode handling
- Mock unavailable → ask for path
- Output directory missing → ask once
- Asset has CSS-or-image ambiguity (e.g., gradient overlay) → flag, ask parent
- Required dimensions exceed source resolution → flag, ask parent (downscale OR resource)
- Mock contains required imagery but specific crops not provided → ask parent

## Provider compatibility
- Codex (native): `image_gen` builtin, full capability
- Claude Code (with MCP image tool): uses MCP for raster edits
- Gemini CLI: uses Imagen
- Other harnesses: emit fallback message per patches/03-asset-producer-cross-harness.md
