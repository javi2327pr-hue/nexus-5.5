# Guía de Migración

## NEXUS v5.6 → v6.0

### Archivos nuevos (añadir)
```bash
cp memory-engine.md   .claude/skills/nexus/references/memory-engine.md
cp memory-worker.md   .claude/agents/memory-worker.md
```

### Archivos modificados (reemplazar)
```bash
cp SKILL.md           .claude/skills/nexus/SKILL.md
cp nexus.config.json  .claude/skills/nexus/nexus.config.json
```

### Cambios clave
1. **Skill Registry**: añadido MEMORY + MARKETOS
2. **Fase 0.4**: nueva — carga de memoria inter-sesión
3. **Routing Table**: nuevos pipelines `memory-resume` y `marketos-full`
4. **Pipeline Templates**: todos incluyen `memory → CAPTURE` al final
5. **Fase 5**: ampliada con captura y compresión de memoria
6. **Comandos**: añadidos /memory, /memory search, /memory flush, /memory export
7. **Config**: nueva sección `memory` + sección `meta` con MCP URL
8. **Scoring**: bonus +0.3 para skills referenciados en memoria previa

### No se modifican
- Todos los references existentes (arch, webdev, codex, etc.)
- Workers existentes (arch-worker, webdev-worker, etc.)
- Lógica de parallel execution, security, watchdog

---

## MarketOS v2.1 → v3.0

### Archivos nuevos (añadir)
```bash
cp memory-engine.md         references/memory-engine.md
cp memory-analyst-worker.md agents/memory-analyst-worker.md
```

### Archivos modificados (reemplazar)
```bash
cp SKILL.md                 SKILL.md
cp marketos.config.json     marketos.config.json
```

### Cambios clave
1. **Especialistas**: 7 → 8 (añadido Memory Analyst)
2. **Regla v3.0**: MEMORIA al inicio y al final
3. **Fase 0.2**: ampliada — carga knowledge + memoria de cliente
4. **Fase 0.6**: nueva — detección Meta MCP oficial
5. **Fase 3**: plan incluye línea de memoria
6. **Fase 6**: reporte incluye "Memoria actualizada"
7. **Fase 7**: ampliada — memory-analyst-worker CAPTURE + compresión
8. **Bloques insight**: añadido `[MEMORIA ACTUALIZADA 📂]`
9. **Config**: nueva sección `memory` + `meta.mcp_url`

### No se modifican
- Referencias de marketing (market-intelligence, buyer-patterns, etc.)
- Workers existentes (researcher, pattern-detector, funnel-builder, stitch-designer, meta-ads-intel)
- ARHInfo client knowledge
- Scripts (meta-ads-library-query.sh)

---

## Verificación post-migración

```bash
# NEXUS
cat .claude/skills/nexus/SKILL.md | head -3         # debe decir version: "6.0"
ls .claude/skills/nexus/references/memory-engine.md  # debe existir
ls .claude/agents/memory-worker.md                   # debe existir

# MarketOS
cat SKILL.md | head -3                               # debe decir version: "3.0"
ls references/memory-engine.md                       # debe existir
ls agents/memory-analyst-worker.md                   # debe existir
```
