# PATCH NOTES — n8n-skills v1 → v2

## Diagnóstico inicial (v1, score suite)

| Skill | v1 líneas | v1 score |
|---|---|---|
| n8n-code-javascript | 784 | 43/50 |
| n8n-mcp-tools-expert | 966 | 42/50 |
| n8n-expression-syntax | 525 | 42/50 |
| n8n-code-python | 774 | 42/50 |
| n8n-validation-expert | 761 | 40/50 |
| n8n-workflow-patterns | 512 | 39/50 |
| n8n-node-configuration | 835 | 39/50 |

**Promedio v1: 83%**

## Cambios sistémicos aplicados (v2)

### CAMBIO 1 — Compresión a ≤450 líneas
Cada `SKILL.md` v2 está bajo el límite que el propio README declaraba (500).
Eliminado: "Quick Reference Checklist" cuando duplicaba "Summary"; listados >15 items movidos a archivos satélite; redundancia internal entre "Quick Reference" / "Summary" / "Best Practices".

### CAMBIO 2 — Descriptions condensadas
- v1: 600+ caracteres con frases motivacionales y `IMPORTANT —`
- v2: ≤350 caracteres con estructura `<qué hace>. Trigger: <keywords>. Use BEFORE/AFTER: <skill>`

### CAMBIO 3 — Decision tree obligatorio al inicio
Cada `SKILL.md` v2 abre con `## Use this skill when` con condiciones observables y target de routing. Claude resuelve si quedarse o saltar en <5s.

### CAMBIO 4 — Routing graph determinista (no prosa)
Reemplazado el bullet list "Related Skills" por bloque `## Routing` con `FROM → GO TO → STAY UNTIL`. Idéntica estructura en las 8 skills.

### CAMBIO 5 — Inconsistencia 5↔6 patrones resuelta
Resuelto a **6 patrones** (5 + batch modifier). El README original de la suite debe alinear su línea 67 ("5 proven patterns") a 6. `n8n-workflow-patterns` v2 enumera 6 explícitamente.

### CAMBIO 6 — Gate único declarado
`n8n-mcp-tools-expert` v2 se declara `(gate skill)` en el H1 y en su description. Las otras 6 cambian de "Always consult X" a "Use AFTER n8n-mcp-tools-expert dispatches here" — gate único, sin competencia.

### CAMBIO 7 — Meta-skill orchestrator
Nueva 8va skill `n8n-suite-router` que dispatches al resto. Resuelve la competencia por auto-activación cuando la pregunta es ambigua.

## Cambios por skill

### n8n-workflow-patterns (39 → ≥48 esperado)
- 512 → ~90 líneas (-82%)
- Pattern Selector como árbol numerado en lugar de prosa
- Pattern Matrix tabular reemplaza bullet list
- Sección "Hybrid patterns" nueva (era hueco crítico de v1)
- Batch promovido a modificador transversal, no patrón paralelo

### n8n-mcp-tools-expert (42 → ≥47 esperado)
- 966 → ~140 líneas (-86%)
- Tool Selector tabular ("intent → tool → detail")
- nodeType format gotcha promovido a sección H2 (era #1 causa de fallas, antes diluida)
- Sección "Troubleshooting MCP-level errors" NUEVA (era hueco)
- Gate role explícito

### n8n-expression-syntax (42 → ≥48 esperado)
- 525 → ~110 líneas (-79%)
- "Error → Fix" tabular (8 filas, antes en prosa dispersa)
- "Expression vs Code" tabular (decisión instantánea)
- 5 rules canónicas explícitas

### n8n-validation-expert (40 → ≥47 esperado)
- 761 → ~110 líneas (-86%)
- Error Triage como decision tree (antes prosa)
- "Warning Triage — false positives" tabular
- "Escape hatches" (cuando stuck >3 ciclos) — NUEVO

### n8n-node-configuration (39 → ≥47 esperado)
- 835 → ~130 líneas (-84%)
- "Per-op rules" con ejemplos concretos por nodo
- "patchNodeField vs full update" tabular explícito (antes mencionado solo en description)
- AI Agent 8 connection types tabulares
- displayOptions sección dedicada

### n8n-code-javascript (43 → ≥48 esperado)
- 784 → ~150 líneas (-81%)
- Top 5 errors tabulares (eran prosa)
- SplitInBatches y `$getWorkflowStaticData` inline (antes solo referenciados)
- Built-ins consolidados en un bloque ejecutable

### n8n-code-python (42 → ≥47 esperado)
- 774 → ~145 líneas (-81%)
- "Limitations" tabular con workarounds inline (antes repetido en prosa 4×)
- Ejemplo HTTP-via-urllib completo (antes solo mencionado)
- Warn "JS-first" en frontmatter y H2 (no enterrado)

### n8n-suite-router (NUEVA)
- 8va skill, ~80 líneas
- Pure dispatcher, formato de salida estructurado `ROUTE/WHY/THEN`
- Composite flows pre-documentados

## Score esperado v2 (estimado)

| Skill | v1 | v2 (est.) |
|---|---|---|
| n8n-suite-router | — | 47/50 |
| n8n-workflow-patterns | 39 | 48 |
| n8n-mcp-tools-expert | 42 | 47 |
| n8n-expression-syntax | 42 | 48 |
| n8n-validation-expert | 40 | 47 |
| n8n-node-configuration | 39 | 47 |
| n8n-code-javascript | 43 | 48 |
| n8n-code-python | 42 | 47 |

**Promedio v2 esperado: 94%** (+11pp vs v1)

## Breaking changes (qué actualizar fuera de las skills)

1. `README.md` línea 67: "5 proven patterns" → "6 proven patterns"
2. Cualquier docstring que mencione "Always consult n8n-mcp-tools-expert" en las otras 6 skills debe cambiar a "Use AFTER n8n-mcp-tools-expert dispatches"
3. Si la suite ya estaba instalada, los archivos satélite (`SEARCH_GUIDE.md`, `DATA_ACCESS.md`, etc.) **siguen siendo válidos** — solo cambiaron los `SKILL.md`
4. Los nombres y `name` en frontmatter son idénticos, así que la auto-activación por intent sigue funcionando
