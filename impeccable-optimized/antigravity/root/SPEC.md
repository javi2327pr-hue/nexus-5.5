<!-- v3 | agente: antigravity | 2026-05-21 -->

# Impeccable Skill — Antigravity spec

## Goal
Design, redesign, or improve frontend interfaces to a high-end studio bar by executing one of 23 specialized commands. Output is real production-grade code OR structured evaluation OR refined visual direction — never generic SaaS output that fails the AI slop test.

## Autonomy boundaries
- Load Setup autonomously (PRODUCT.md + DESIGN.md + register + command reference)
- Pick register from cue → surface → field cascade without confirmation
- Execute the command's documented flow per its reference file
- Suggest command switches when intent shifts, but never chain silently
- STOP at every documented gate in multi-gate flows (craft has 4 gates pre-code)
- Use `checkpoint.mjs` to mechanically enforce gates — do not advance on disciplinary trust
- Do NOT compress gates 2-4 of craft after shape confirmation (the documented dominant failure mode)
- Do NOT load `live.md` outside live mode (622-line file; wastes context)
- Do NOT hand-edit the commands table — update `scripts/command-metadata.json` and rebuild
- Do NOT invoke `impeccable_asset_producer` on non-Codex harnesses (capability is Codex-only)

## Acceptance criteria
1. Setup completed before any design work (PRODUCT loaded, register identified, command reference loaded)
2. Output passes the AI slop test — both 1st-order (category→theme reflex) AND 2nd-order (category+anti-ref→aesthetic family reflex)
3. Output respects absolute bans (no side-stripe borders >1px, no gradient text, no glass-as-default, no hero-metric template, no identical card grids, no modal-first, no em dashes — also no `--`)
4. Color uses OKLCH; neutrals tinted toward brand hue; never `#000` or `#fff`
5. Color strategy chosen explicitly: restrained / committed / full palette / drenched
6. Body line length 65-75ch; weight contrast ≥1.25 between hierarchy steps
7. Cards used only where they're the best affordance; never nested
8. Motion does not animate CSS layout properties; uses ease-out exponential
9. Brand register: passes aesthetic-lane reflex-reject check (editorial-typographic, brutalist-utility, acid-maximalism, etc. when category-default)
10. Product register: passes earned-familiarity check (fluent Linear/Figma/Notion/Raycast/Stripe users would trust it)
11. Multi-gate commands: every gate explicitly confirmed by user before advancing
12. Codex harness: asset production runs via `impeccable_asset_producer` subagent; other harnesses: asset gap stated explicitly and user provides imagery
13. Command suggestion emitted at end IF the work surfaced an intent better-suited to another command

## Optional checkpoints
- Confirm framework choice when project is greenfield (don't default silently to Astro)
- Confirm visual direction at gate 4 of craft (mock approval) — never compress
- Confirm register if cue / surface / field disagree
- Confirm before running `cleanup-deprecated.mjs` in a non-consumer context
- Otherwise: autonomous

## Inputs / outputs
- Input: `/impeccable <command> [target]` OR `/impeccable <freeform>` OR `/impeccable` (bare)
- Output: per category — code (build commands) / findings (evaluate) / diffed refinement (refine|enhance|fix) / variants (iterate)

## Success metric
- Output never matches "AI made that" tell (1st + 2nd-order slop tests both pass)
- 0 unannounced command switches (user always knows which command is active)
- 0 gate compressions in craft (or any multi-gate flow)
- Cross-harness consistency: output quality on Cursor/Gemini/Copilot/Kiro/OpenCode/Pi/Qoder/Trae/Rovo ≥90% of Claude Code/Codex quality (despite asymmetric asset production)
- 0 hand-edits to commands table (always via command-metadata.json + rebuild)

## Failure mode handling
- PRODUCT.md missing/placeholder → run `teach`, resume
- DESIGN.md missing → nudge once per session, proceed with brand defaults extracted from CSS variables + computed styles
- Greenfield directory with no framework → AskUserQuestion: Astro / SvelteKit / Next / single HTML (don't default silently)
- Asset producer unavailable (non-Codex) → state gap explicitly, ask user to provide imagery
- User confirmed shape but didn't confirm gates 2-4 → STOP, ask, do not interpret "shape confirmed" as code-green
- Live mode interrupted → run `live-status.mjs` / `live-resume.mjs` before guessing; durable journal replays unacknowledged work
- Checkpoint script returns non-zero → STOP, ask user for explicit confirmation of the gate
- Build detected drift in commands catalog (3 sources disagree) → fail build, surface diff

## Reference architecture (orientation)
- ONE skill (`impeccable`) with 23 commands — deliberately consolidated to avoid `/` menu pollution
- Flow: Setup → register → command-reference → flow execution → routing suggestion
- `scripts/command-metadata.json` is single source of truth for the catalog; README + SKILL.md tables compile from it
- Anti-pattern engine: 27 deterministic rules (`cli/engine/detect-antipatterns.mjs`, regenerated to browser + extension bundles)
- LLM critique pass: 12 rules layered on top of deterministic detection
- Register split: brand (design IS the product) vs product (design SERVES the product) — orthogonal abstraction, every command can apply to both
- Sub-agents: only `impeccable-asset-producer` (Codex-only); other harnesses degrade explicitly with user notification

## Routing rules
1. No argument → emit commands table grouped by category, ask
2. First word matches command → load `reference/<command>.md`, follow
3. First word doesn't match → general design invocation, full Setup + shared laws + register reference applied to argument

## Multi-harness compatibility notes
- Claude Code: full feature support (substitution, sub-agents via Codex variant only, hooks)
- Codex: full + asset producer subagent + image_gen integration
- Cursor / Gemini / Copilot / OpenCode / Pi / Qoder / Trae / Kiro / Rovo: degraded subset, asset production manual, no `{{ }}` substitution at runtime (compiled at build time)
- Trae: native docs TBD, behavior verified empirically
