# PATCH NOTES — Impeccable v2 → v3 (overlay optimization)

## Source

[Impeccable](https://github.com/czlonkowski/impeccable) by Romuald Członkowski et al. — a single user-invocable skill (`impeccable`) with 23 commands, 37 references, 27 deterministic anti-pattern rules, multi-harness build pipeline (11 harnesses supported), browser extension, CLI, landing site.

## Optimization scope (this overlay)

| Component | Status |
|---|---|
| `skill/SKILL.md` (orchestrator, 168L) | ✅ 3 variants (Claude Code, Codex, Antigravity) |
| 23 `reference/<command>.md` | ✅ 3 variants each = 69 files |
| 7 domain refs (typography, color, etc.) | ✅ 3 variants each = 21 files |
| 2 register refs (brand, product) | ✅ 3 variants each = 6 files |
| 4 specials (cognitive-load, codex, heuristics-scoring, personas) | ✅ 3 variants each = 12 files |
| 1 agent (impeccable-asset-producer) | ✅ 3 variants = 3 files |
| 6 systemic patches | ✅ ready to apply |

**Total**: 114 skill files + 6 patches = 120 files in overlay.

## Diagnóstico inicial (v2 → v3 baseline)

| Dimensión | v2 score | Hallazgo principal |
|---|---|---|
| Claridad rol/contexto | 9/10 | Identidad nítida, register split como abstracción central |
| Especificidad tarea | 9/10 | 23 comandos atómicos con reference dedicado |
| Cobertura edge cases | 9/10 | Anti-patterns + AI slop test + reflex-reject lists + gate warnings |
| Alineación agente (multi-harness) | 8/10 | Asimetría Codex-only en asset producer + description bloat |
| Formato/parseabilidad | 7/10 | Description ~1100 chars, command catalog duplicado 3×, live.md 622L |
| **TOTAL v2** | **42/50 — 84%** | |

## Cambios sistémicos aplicados (v3)

### CAMBIO 1 — Description compactada
**Antes** (v2 SKILL.md line 3): ~1.100 caracteres mezclando "qué hace" + "cuándo activar" + "cobertura".
**Después** (v3 SKILL.md): ≤400 caracteres con estructura `<qué hace> + Trigger + Use BEFORE/AFTER`.

### CAMBIO 2 — Single-source command catalog
**Antes**: Tabla en `README.md` + `SKILL.md` + `scripts/command-metadata.json` = 3 fuentes, drift posible.
**Después**: `command-metadata.json` es single-source. `bun run build` genera las tablas en README + SKILL. CI gate detecta drift. Ver `patches/02-single-source-catalog.md`.

### CAMBIO 3 — Gate enforcement mecánico
**Antes**: `craft.md` advertía explícitamente: *"Compressing gates 2-4 because the shape brief felt complete is the dominant failure mode of this flow."* Disciplinario.
**Después**: `scripts/checkpoint.mjs` (Patch 1) hace el chequeo mecánico. `--check --gate=4` retorna no-cero si gates previas no confirmadas. Disciplina convertida en validación.

### CAMBIO 4 — Asset producer cross-harness fallback
**Antes**: `providers: codex` hardcoded. En las 10 harnesses no-Codex, degradación silenciosa.
**Después**: 3-tier strategy (Patch 3):
- Tier 1: structured fallback message en todas las harnesses no-image-gen
- Tier 2: integración nativa donde el harness tiene equivalente (Claude Code + MCP image tool, Gemini + Imagen)
- Tier 3: agent file declara providers + fallback explícito en frontmatter

### CAMBIO 5 — `live.md` split (622L → 300L + 300L protocol)
**Antes**: 622 líneas monolítico (playbook + state machine + journal + carbonize + setup + troubleshooting).
**Después** (Patch 4):
- `live.md` ≤300L (operational playbook)
- `live-protocol.md` ≤300L (state machine, journal mechanics, carbonize, troubleshooting)
- Token savings: ~3K tokens por invocación de live mode

### CAMBIO 6 — Routing graph inter-comando
**Antes**: Cada `reference/<command>.md` self-contained. Routing entre comandos a juicio del modelo. Resultado: chains silenciosos o stuck-in-wrong-command.
**Después**: Bloque `## Routing` idéntico al final de cada `reference/<command>.md` (template + matriz en Patch 5). `docs/ROUTING.md` con Mermaid + tabla completa.

### CAMBIO 7 — `defineCheck()` pattern para anti-patterns
**Antes**: 4-step manual wiring por regla en `cli/engine/detect-antipatterns.mjs`. `AGENTS.md` admite explícitamente: *"Forgetting one is the most common mistake"*.
**Después** (Patch 6): `defineCheck({pure, browserAdapter, jsdomAdapter})` factory. Una declaración por regla. Footgun estructuralmente eliminado.

## Cambios por archivo (resumen)

### SKILL.md root
- 168L → 99L Claude Code (-41%)
- Description 1100 → 350 chars
- "Routing between commands" nuevo
- Gate enforcement section nuevo
- Anti-patterns section nuevo

### Por comando reference (promedio)
- Líneas: variable (50-200) → variable (~80-160)
- Estructura uniforme: Use when → Flow → Routing → Anti-patterns
- Cross-references vía routing block (no prosa)

### Por domain reference (typography, color, etc.)
- Líneas: 100-300 → 100-180
- Tablas reemplazan listados de prosa
- Constraints explícitas

### Por register reference (brand, product)
- Líneas: 118-62 → similar (compacto pero opinionado)
- Anchors (fluent-user references) explícitos para product
- Reflex-reject aesthetic lanes para brand

### Asset producer
- frontmatter declara providers + fallback explícito
- Compatible con Codex (nativo), Claude Code (MCP image), Gemini (Imagen), otros (fallback message)

## Score esperado v3 (estimado)

| Dimensión | v2 | v3 (est.) |
|---|---|---|
| Claridad rol/contexto | 9/10 | 9/10 |
| Especificidad tarea | 9/10 | 10/10 (routing graph mejora dispatch) |
| Cobertura edge cases | 9/10 | 10/10 (gate enforcement mecánico) |
| Alineación agente (multi-harness) | 8/10 | 9/10 (fallback cross-harness) |
| Formato/parseabilidad | 7/10 | 9/10 (single-source catalog + live split + description compactada) |
| **TOTAL v3** | **42/50** | **47/50 — 94%** |

**Promedio v2 → v3: 84% → 94% (+10pp).**

## Breaking changes (qué actualizar fuera de las skills)

1. `skill/SKILL.md` description requires update (truncate to ≤400 chars)
2. `scripts/command-metadata.json` becomes single source — wire build to generate tables
3. Add `scripts/checkpoint.mjs` + `.impeccable/gates/` to gitignore
4. Add `scripts/asset-producer-fallback.mjs`
5. Split `skill/reference/live.md` per Patch 4 mapping
6. Refactor `cli/engine/detect-antipatterns.mjs` to use `defineCheck()` (Patch 6)
7. Add `## Routing` block to all 23 `reference/<command>.md` files (template in Patch 5)
8. `agents/impeccable-asset-producer.md` frontmatter updated with providers + fallback
9. CI: add `bun run build:check` to gate on drift / missing markers / routing block omissions

## Compatibilidad con archivos NO tocados por la optimización

Los archivos satélite que no son SKILL.md/reference/agents siguen siendo válidos:
- `scripts/pin.mjs`, `scripts/load-context.mjs`, `scripts/live-*.{mjs,js}` (excepto live.md split)
- `cli/engine/detect-antipatterns.mjs` (refactor opcional vía Patch 6)
- `cli/engine/detect-antipatterns-browser.js` (refactor opcional vía Patch 6)
- `extension/`, `site/`, `tests/`, `notes/`, `demos/` (no tocados)

Esta overlay es **aditiva** — no destruye nada del repo original.
