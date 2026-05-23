# Skill Scanner — Descubrimiento Dinámico de Skills

## Propósito
Escanear todas las skills instaladas en el proyecto, evaluar su utilidad,
construir un índice persistente en disco, y usar ese índice para tomar
decisiones de routing — sin routing table hardcodeado.

---

## Cuándo se ejecuta

| Trigger | Acción |
|---|---|
| `/nexus scan` | Escaneo completo + reconstruir índice |
| `/nexus [objetivo]` y NO existe `skill-index.json` | Escaneo automático antes de ejecutar |
| `/nexus [objetivo]` y `skill-index.json` existe | Leer índice sin re-escanear (rápido) |
| Instalar un skill nuevo | Sugerir: "Skill nuevo detectado. ¿Ejecuto /nexus scan?" |
| `/nexus scan --force` | Re-escanear todo ignorando el índice existente |

---

## FASE 1 — Descubrimiento (scan del filesystem)

```bash
# Claude Code
SCAN_PATHS=(
  ".claude/skills"
  ".claude/agents"
)

# Antigravity
SCAN_PATHS=(
  ".antigravity/rules"
  ".antigravity/agents"
)

# Cursor
SCAN_PATHS=(
  ".cursor/rules"
)

# Buscar todos los SKILL.md y workers
find "${SCAN_PATHS[@]}" -name "SKILL.md" -o -name "*-worker.md" 2>/dev/null
```

Para cada archivo encontrado, leer:
1. **Frontmatter YAML** → `name`, `description`, `version`
2. **Keywords de activación** → extraer de la descripción o de secciones "Señales de activación"
3. **Dominios** → clasificar en: INVESTIGACIÓN, ARQUITECTURA, FRONTEND, CÓDIGO, AUTOMATIZACIÓN, DISEÑO, MONITORING, CONOCIMIENTO, SEGURIDAD, OTRO
4. **Dependencias** → ¿necesita MCP? ¿necesita otro skill primero?
5. **Inputs esperados** → qué recibe del orquestador
6. **Outputs producidos** → qué devuelve al orquestador

---

## FASE 2 — Evaluación de utilidad

Para cada skill descubierto, evaluar:

### 2.1 — Completitud (¿tiene todo lo necesario para funcionar?)
```
[ ] Tiene frontmatter con name y description
[ ] Tiene instrucciones claras (no solo título)
[ ] Tiene formato de output definido
[ ] Tiene worker asociado (en agents/) — opcional pero preferido
[ ] Si necesita MCP, el MCP está disponible
```
Score: campos_completos / campos_totales → COMPLETO (>80%) | PARCIAL (50-80%) | INCOMPLETO (<50%)

### 2.2 — Seguridad (para skills de terceros)
```
SI el skill NO es parte del paquete NEXUS oficial (arch, webdev, market-scout,
   codex-bridge, autoflow, stitch, knowledge-base, watchdog, security-audit,
   contract-validator, parallel-execution, parallel-skills, workflow-examples,
   PROJECT-knowledge.template):
   → Ejecutar SecurityAudit antes de indexar
   → Si PELIGROSO → no indexar, registrar en blocked_skills
   → Si REVISAR → indexar con flag needs_review=true
   → Si SEGURO → indexar normalmente
```

### 2.3 — Relevancia (¿es útil para el tipo de trabajo del usuario?)
```
Cruzar con PROJECT-knowledge.md si existe:
  - ¿El skill es compatible con el stack del proyecto?
  - ¿El dominio del skill coincide con el tipo de trabajo habitual?
  - ¿El skill complementa skills existentes o los duplica?

Score: ALTA (complementa) | MEDIA (útil pero no crítico) | BAJA (irrelevante o duplicado)
```

---

## FASE 3 — Construcción del índice

Generar `skill-index.json` en la raíz del proyecto:

```json
{
  "nexus_version": "5.7",
  "last_scan": "2026-05-22T15:30:00",
  "platform": "claude-code",
  "total_skills": 10,
  "total_workers": 8,

  "skills": [
    {
      "name": "arch",
      "path": ".claude/skills/nexus/references/arch.md",
      "version": "5.6",
      "source": "nexus-official",
      "domains": ["ARQUITECTURA"],
      "keywords": ["arquitectura", "backend", "base de datos", "API", "NestJS", "Prisma", "stack"],
      "mcp_required": null,
      "depends_on": [],
      "worker": ".claude/agents/arch-worker.md",
      "completitud": "COMPLETO",
      "seguridad": "SEGURO",
      "relevancia": "ALTA",
      "inputs": ["TAREA", "NEXUS_CONTEXT", "STACK_ACTUAL"],
      "outputs": ["esquema_db", "contratos_api", "stack", "archivos_protegidos"],
      "last_used": "2026-05-20T10:00:00",
      "times_used": 12,
      "notes": "No tiene stack por defecto. Entrevista dinámica."
    },
    {
      "name": "stitch",
      "path": ".claude/skills/nexus/references/stitch.md",
      "version": "5.6",
      "source": "nexus-official",
      "domains": ["DISEÑO", "FRONTEND"],
      "keywords": ["diseño", "UI", "interfaz", "pantallas", "mockup", "wireframe", "Stitch"],
      "mcp_required": "stitch",
      "depends_on": [],
      "worker": ".claude/agents/stitch-worker.md",
      "completitud": "COMPLETO",
      "seguridad": "SEGURO",
      "relevancia": "ALTA",
      "inputs": ["TAREA", "PROYECTO_STITCH", "FRAMEWORK", "ESTILOS"],
      "outputs": ["design_tokens", "component_list", "route_structure", "STATUS"],
      "last_used": null,
      "times_used": 0,
      "notes": "Requiere stitch MCP. Checkpoint humano si proyecto nuevo."
    }
  ],

  "blocked_skills": [],

  "context_chains": {
    "market-scout → stitch": ["design_patterns_report", "prompt_stitch", "nicho"],
    "stitch → webdev": ["design_tokens", "component_list", "route_structure"],
    "stitch → arch": ["framework_detected", "api_surface_needed"],
    "webdev → stitch": ["design_patterns_report", "url_analizada"],
    "arch → codex": ["esquema_db", "contratos_api", "archivos_protegidos"],
    "arch → autoflow": ["endpoints_disponibles", "esquema_db"]
  },

  "domain_coverage": {
    "INVESTIGACIÓN": ["market-scout"],
    "ARQUITECTURA": ["arch"],
    "FRONTEND": ["webdev"],
    "CÓDIGO": ["codex"],
    "AUTOMATIZACIÓN": ["autoflow"],
    "DISEÑO": ["stitch"],
    "MONITORING": ["watchdog"],
    "CONOCIMIENTO": ["knowledge"],
    "SEGURIDAD": ["security"]
  }
}
```

---

## FASE 4 — Routing dinámico (reemplaza routing table estático)

Cuando NEXUS recibe un objetivo:

```
1. Cargar skill-index.json (rápido — es un JSON pequeño)

2. Tokenizar el objetivo del usuario en keywords

3. Para cada keyword del objetivo:
   - Buscar en skills[].keywords de TODOS los skills indexados
   - Calcular match_score para cada skill:
     match_score = keywords_matched / total_keywords_del_skill

4. Ranking de skills por match_score descendente

5. Para cada skill en el ranking:
   - ¿mcp_required está disponible? Si no → skip o fallback
   - ¿completitud es COMPLETO o PARCIAL? Si INCOMPLETO → skip
   - ¿seguridad es SEGURO o needs_review? Si PELIGROSO → skip

6. Seleccionar los skills con match_score > 0.3

7. Verificar context_chains: ¿algún skill seleccionado depende de otro?
   → Si A depende de B, B va primero en el pipeline

8. Construir pipeline en orden de dependencias

9. Si un dominio no tiene skill indexado:
   → Informar al usuario: "No tengo skill para [DOMINIO]. ¿Quieres que busque uno?"
```

---

## FASE 5 — Aprendizaje del uso (memoria de routing)

Después de cada pipeline exitoso, actualizar el índice:

```json
{
  "last_used": "2026-05-22T16:00:00",
  "times_used": 13,
  "last_pipeline": "design-first",
  "performance_notes": "DONE en 8 min"
}
```

Esto permite que NEXUS:
- Priorice skills que se usan frecuentemente
- Detecte skills que nunca se han usado (ofrecer explicación)
- Recomiende skills basado en historial

---

## Comandos

| Comando | Acción |
|---|---|
| `/nexus scan` | Escaneo completo → reconstruir índice |
| `/nexus scan --force` | Ignorar índice existente y re-escanear |
| `/nexus skills` | Mostrar tabla del índice actual |
| `/nexus skill [nombre]` | Detalle de un skill específico |
| `/nexus skills --unused` | Listar skills que nunca se han usado |
| `/nexus skills --blocked` | Listar skills bloqueados por SecurityAudit |

---

## Output del /nexus skills

```
╔══════════════════════════════════════════════════════════╗
║              NEXUS v5.7 — Skills Indexados               ║
╠══════════════════════════════════════════════════════════╣
║ # │ Skill         │ Dominio      │ MCP     │ Usos │ Est ║
║───┼───────────────┼──────────────┼─────────┼──────┼─────║
║ 1 │ arch          │ ARQUITECTURA │ —       │  12  │ ✅  ║
║ 2 │ webdev        │ FRONTEND     │ —       │   8  │ ✅  ║
║ 3 │ market-scout  │ INVESTIGACIÓN│ —       │   5  │ ✅  ║
║ 4 │ codex         │ CÓDIGO       │ —       │  15  │ ✅  ║
║ 5 │ autoflow      │ AUTOMATI.    │ n8n-mcp │   3  │ ✅  ║
║ 6 │ stitch        │ DISEÑO       │ stitch  │   0  │ 🆕  ║
║ 7 │ knowledge     │ CONOCIMIENTO │ —       │   2  │ ✅  ║
║ 8 │ watchdog      │ MONITORING   │ n8n-mcp │   1  │ ✅  ║
║ 9 │ security      │ SEGURIDAD    │ —       │   1  │ ✅  ║
║10 │ seo-optimizer │ MARKETING    │ —       │   0  │ 🆕  ║
╠══════════════════════════════════════════════════════════╣
║ Último scan: 2026-05-22 15:30 │ 10 skills │ 0 bloqueados ║
╚══════════════════════════════════════════════════════════╝
```

---

## Integración con SecurityAudit

```
SI skill.source != "nexus-official":
  → Ejecutar SecurityAudit ANTES de añadir al índice
  → Mostrar reporte al usuario
  → Si PELIGROSO → mover a blocked_skills[]
  → Si REVISAR → indexar con needs_review=true
  → Si SEGURO → indexar normalmente con source="third-party"
```

---

## Fallback si skill-index.json no existe o está corrupto

```
SI skill-index.json no existe:
  → Ejecutar scan automático silencioso
  → Generar índice nuevo
  → Continuar con el pipeline normalmente

SI skill-index.json está corrupto (parse error):
  → Eliminar y regenerar con scan
  → Avisar al usuario: "El índice de skills se regeneró."
```
