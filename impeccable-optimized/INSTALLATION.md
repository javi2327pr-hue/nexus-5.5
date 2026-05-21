# Installation Guide — Impeccable v3 Overlay

This overlay does **not** replace the Impeccable repo. It provides:
- 3 variants of every skill file (Claude Code, Codex, Antigravity)
- 6 systemic patches for the upstream repo
- Routing documentation

## Installation paths

### A) Use the v3 SKILL.md variants directly (no upstream modification)

Replace the upstream `skill/SKILL.md` with the canonical v3 (Claude Code), keep all upstream references and scripts.

```bash
# In your local Impeccable clone
cp /path/to/impeccable-optimized/claude-code/root/SKILL.md skill/SKILL.md

# Pick + apply Codex variant if you're on Codex CLI exclusively
cp /path/to/impeccable-optimized/codex/root/PROMPT.md skill/SKILL.md

# Pick + apply Antigravity spec if needed
# (Antigravity uses spec format, not skill format directly — used as session goal)
```

### B) Replace every reference with v3 (canonical Claude Code)

```bash
for ref in adapt animate audit bolder clarify colorize craft critique delight \
           distill document extract harden layout live onboard optimize \
           overdrive polish quieter shape teach typeset \
           brand product cognitive-load codex heuristics-scoring personas \
           color-and-contrast interaction-design motion-design \
           responsive-design spatial-design typography ux-writing; do
  cp /path/to/impeccable-optimized/claude-code/reference/$ref.md \
     skill/reference/$ref.md
done
```

Same for Codex / Antigravity targeting their respective subdirectories.

### C) Apply the 6 systemic patches (recommended for full v3)

Each patch is independent. Apply selectively.

#### Patch 1 — Gate enforcement (`scripts/checkpoint.mjs`)

```bash
cp /path/to/impeccable-optimized/patches/01-checkpoint.mjs skill/scripts/checkpoint.mjs
chmod +x skill/scripts/checkpoint.mjs

# Add to .gitignore:
echo ".impeccable/gates/" >> .gitignore

# Test:
node skill/scripts/checkpoint.mjs --gate=1 --status=confirmed
node skill/scripts/checkpoint.mjs --check --gate=2  # should fail with non-zero
```

#### Patch 2 — Single-source command catalog

Follow steps in `patches/02-single-source-catalog.md`:
1. Add `<!-- BEGIN:commands-table -->` / `<!-- END:commands-table -->` in README.md and skill/SKILL.md
2. Add `scripts/generate-commands-table.mjs` (script in the patch file)
3. Wire `build` and `build:check` in package.json
4. CI gate via `bun run build:check`

#### Patch 3 — Asset producer cross-harness

Follow steps in `patches/03-asset-producer-cross-harness.md`:
1. Update `skill/agents/impeccable-asset-producer.md` frontmatter
2. Add `skill/scripts/asset-producer-fallback.mjs`
3. Update `skill/reference/craft.md` Step 3 to use fallback script
4. Add tests in `tests/asset-fallback.test.mjs`

#### Patch 4 — `live.md` split

Follow steps in `patches/04-live-md-split.md`:
1. Extract sections per mapping table
2. Create `skill/reference/live-protocol.md`
3. Truncate `skill/reference/live.md` to ≤300L
4. Verify references; run `bun run test:live-e2e`

#### Patch 5 — Inter-command routing graph

Follow steps in `patches/05-routing-graph.md`:
1. Append routing block template to every `skill/reference/<command>.md`
2. Create `docs/ROUTING.md` (or copy `impeccable-optimized/ROUTING.md`)
3. Add lint to `build:check` that every reference ends with `## Routing` section

#### Patch 6 — `defineCheck()` pattern

Follow steps in `patches/06-define-check-pattern.md`:
1. Add `cli/engine/define-check.mjs`
2. Convert one rule (`side-tab`) as proof
3. Run `bun run test` to confirm parity
4. Mechanical conversion of remaining 26 rules
5. Update `AGENTS.md` TDD section (remove step 5)

## Per-harness installation

### Claude Code

The Impeccable build pipeline already generates `.claude/skills/impeccable/` from `skill/`. After applying v3 changes:

```bash
bun run build
# Verify .claude/skills/impeccable/SKILL.md reflects v3
```

### Codex CLI

```bash
bun run build
# Verify .codex/agents/impeccable_asset_producer.toml + .agents/skills/impeccable/SKILL.md
```

### Other harnesses (Cursor, Gemini, Copilot, OpenCode, Pi, Qoder, Trae, Kiro, Rovo)

The build pipeline writes to harness-specific directories. Verify after `bun run build`:

```
.cursor/skills/impeccable/SKILL.md
.gemini/skills/impeccable/SKILL.md
.github/skills/impeccable/SKILL.md   (Copilot)
.opencode/skills/impeccable/SKILL.md
.pi/skills/impeccable/SKILL.md
.qoder/skills/impeccable/SKILL.md
.trae/skills/impeccable/SKILL.md
.trae-cn/skills/impeccable/SKILL.md
.kiro/skills/impeccable/SKILL.md
.rovodev/skills/impeccable/SKILL.md
```

## Validation

After installation, verify:

```bash
# 1. SKILL.md description length
wc -c skill/SKILL.md.description   # extract via parser — should be ≤400 chars

# 2. All references end with ## Routing
for f in skill/reference/*.md; do
  if ! grep -q "^## Routing" "$f"; then
    echo "MISSING routing block: $f"
  fi
done

# 3. Checkpoint script works
node skill/scripts/checkpoint.mjs --reset
node skill/scripts/checkpoint.mjs --gate=2 --status=confirmed  # should fail (gate 1 not done)
node skill/scripts/checkpoint.mjs --gate=1 --status=confirmed  # should succeed
node skill/scripts/checkpoint.mjs --gate=2 --status=confirmed  # should now succeed

# 4. Single-source catalog
bun run build:check   # should pass

# 5. Test suite
bun run test
```

## Rollback

The overlay is purely additive. To roll back:

```bash
# Drop the v3 skill files
git checkout HEAD -- skill/SKILL.md skill/reference/ skill/agents/

# Drop the patches (if applied)
rm -f skill/scripts/checkpoint.mjs
rm -f skill/scripts/asset-producer-fallback.mjs
rm -f skill/scripts/generate-commands-table.mjs

# Revert split of live.md
git checkout HEAD -- skill/reference/live.md
rm -f skill/reference/live-protocol.md
```

## Going further

After overlay is installed and validated:
- Add product-specific personas in `PRODUCT.md`
- Add product-specific reflex-reject aesthetic lanes in `brand.md`
- Customize anti-pattern rules in `cli/engine/rules/*.mjs` per `defineCheck()`
- Add new commands by: edit `command-metadata.json` + create `reference/<command>.md` + `bun run build`
