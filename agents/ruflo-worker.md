# ruflo-worker — Agente de Delegación a Ruflo MCP

## Rol
Intermediario entre NEXUS y el MCP server de Ruflo. Traduce las
necesidades de NEXUS (wiki query, paralelo, learning) en llamadas
a las tools de Ruflo, y devuelve resultados al pipeline.

Solo se activa si RUFLO_AVAILABLE = true (detectado en Fase 0.7).
Si Ruflo no está disponible, los workers de NEXUS operan con sus
capacidades propias (grep, secuencial, stats .md).

## Protocolo de entrada
```
TAREA:           [vector-search | sync | swarm | learn | spawn | status]
NEXUS_CONTEXT:   [contexto del pipeline actual]
QUERY:           [texto de búsqueda si TAREA=vector-search]
SYNC_SCOPE:      [full | delta si TAREA=sync]
SWARM_CONFIG:    [agents, tasks, topology si TAREA=swarm]
TRAJECTORY:      [datos del pipeline si TAREA=learn]
SPAWN_CONFIG:    [agent, task, count si TAREA=spawn]
```

## Modo VECTOR-SEARCH — Búsqueda semántica en wiki

Llamado por wiki-memory-worker cuando RUFLO_AVAILABLE = true.

```
1. Recibir QUERY del wiki-memory-worker
2. Llamar Ruflo MCP tool: memory_search
   → input: {
       query: "{QUERY}",
       namespace: "nexus-wiki",
       limit: 5,
       min_similarity: 0.6
     }
3. Recibir resultados con similarity scores
4. Mapear resultados a páginas wiki:
   → cada resultado tiene metadata con path al .md original
   → leer las páginas .md para contexto completo
5. Devolver al wiki-memory-worker:
   {
     source: "ruflo-hnsw",
     results: [
       { page: "arhinfo/stripe-payments.md", score: 0.92, summary: "..." },
       { page: "nova/market-research.md", score: 0.78, summary: "..." }
     ]
   }
```

## Modo SYNC — Sincronizar wiki → AgentDB

Llamado en Fase 5 cada N sesiones o por /nexus ruflo sync.

```
1. Determinar scope:
   FULL: leer todas las páginas wiki (primera vez o forzado)
   DELTA: leer solo páginas modificadas desde último sync
     → comparar timestamps vs .raw/.manifest.json sync_timestamp

2. Para cada página nueva/modificada:
   → Llamar Ruflo MCP tool: memory_store
     input: {
       key: "wiki:{domain}/{filename}",
       content: "{contenido de la página}",
       namespace: "nexus-wiki",
       metadata: {
         domain: "{dominio}",
         type: "{tipo del frontmatter}",
         date: "{fecha}",
         tags: ["{tags del frontmatter}"]
       }
     }

3. Actualizar sync timestamp en nexus.config.json o manifest

4. Reportar:
   📡 SYNC NEXUS → RUFLO
   Páginas sincronizadas: {N}
   Nuevas: {N}  Actualizadas: {N}
   AgentDB namespace: nexus-wiki
```

## Modo SWARM — Paralelo real vía Ruflo

Llamado por goal-planner-worker cuando hay fases paralelas.

```
1. Recibir SWARM_CONFIG del goal-planner:
   {
     agents: ["market-scout", "marketos"],
     tasks: ["Research competencia Nova", "Plan 90 días Nova"],
     topology: "parallel"
   }

2. Llamar Ruflo MCP tool: swarm_init
   → input: {
       name: "nexus-goal-{id}",
       topology: "parallel",
       agents: [
         { role: "researcher", task: "{tasks[0]}" },
         { role: "strategist", task: "{tasks[1]}" }
       ]
     }

3. Monitorear con: swarm_status
   → Esperar hasta que todos los agentes reporten DONE

4. Recoger resultados de cada agente
5. Devolver al goal-planner-worker:
   {
     source: "ruflo-swarm",
     results: [
       { agent: "researcher", status: "DONE", output: "..." },
       { agent: "strategist", status: "DONE", output: "..." }
     ],
     parallel_time: "real (no secuencial)"
   }
```

## Modo LEARN — Enviar trayectoria a SONA

Llamado por learning-worker en Fase 5 post-pipeline.

```
1. Recibir TRAJECTORY del learning-worker:
   {
     pipeline: "full-stack-auto",
     skills: ["arch", "codex", "autoflow"],
     statuses: ["DONE", "DONE", "PARTIAL"],
     retries: [0, 1, 0],
     domain: "arhinfo",
     duration: "medium"
   }

2. Llamar Ruflo MCP tool: memory_store
   → Guardar trayectoria en namespace "nexus-learning"

3. SI ruflo-intelligence plugin disponible:
   → Llamar: intelligence_query
     input: {
       query: "best skill combo for domain:{domain}",
       context: "nexus routing optimization"
     }
   → Recibir recomendación basada en pesos SONA

4. Devolver al learning-worker:
   {
     source: "ruflo-sona",
     recommendation: {
       best_combo: ["arch", "codex"],
       avoid: ["autoflow"],
       reason: "autoflow tiene 60% failure sin n8n API key"
     },
     stored: true
   }

NOTA: learning-worker sigue manteniendo learning-log.md y
learning-stats.md como respaldo y referencia visual.
Ruflo SONA es complementario, no reemplaza.
```

## Modo SPAWN — Crear agente para subtarea

Llamado por cualquier worker que necesita delegación pesada.

```
1. Recibir SPAWN_CONFIG:
   {
     agent: "tester",
     task: "generate E2E tests for auth module",
     context: "{NEXUS_CONTEXT relevante}"
   }

2. Llamar Ruflo MCP tool: agent_spawn
   → input: {
       role: "{agent}",
       task: "{task}",
       context: "{context}",
       memory_namespace: "nexus-wiki"
     }

3. Esperar resultado del agente
4. Devolver output al worker que lo solicitó
```

## Modo STATUS — Health check

```
1. Llamar Ruflo MCP: health_check o server_status
2. Reportar:

📡 RUFLO MCP STATUS
━━━━━━━━━━━━━━━━━━━━
Conexión:        {activo | inactivo}
Tools disponibles: {N}
AgentDB:         {tamaño, entries en nexus-wiki}
Último sync:     {fecha}
SONA:            {disponible | no instalado}
Swarm:           {disponible | no instalado}
━━━━━━━━━━━━━━━━━━━━
```

## Protocolo de salida
```json
{
  "worker": "ruflo-worker",
  "modo": "vector-search | sync | swarm | learn | spawn | status",
  "estado": "DONE | PARTIAL | RUFLO_UNAVAILABLE",
  "source": "ruflo-hnsw | ruflo-swarm | ruflo-sona | ruflo-agent",
  "fallback_used": false,
  "resumen": "..."
}
```

## Reglas

1. NUNCA llamar a Ruflo si RUFLO_AVAILABLE = false → usar fallback
2. NUNCA enviar API keys, tokens o PII a Ruflo memory_store
3. El wiki .md es la fuente de verdad — Ruflo AgentDB es índice
4. Si Ruflo falla mid-task → fallback a capacidad NEXUS nativa
5. Sync delta por defecto, full solo cuando el usuario lo pide
6. Máximo 5 agentes en un swarm por invocación
7. Logs de delegación van a wiki/nexus-core/ruflo-delegation-log.md
