# Ruflo Bridge — Integración NEXUS ↔ Ruflo MCP

## Propósito
Ruflo es un MCP server con runtime real (TypeScript + Rust) que
proporciona capacidades que NEXUS no puede tener por ser markdown:
vector search con HNSW, swarm coordination, SONA neural learning,
agent spawning, y background workers reales.

NEXUS usa Ruflo como motor de ejecución para tareas específicas,
igual que usa n8n para automatización y Meta para ads. NEXUS sigue
siendo el cerebro (routing, wiki, bodega, MarketOS). Ruflo es el
motor para lo que necesita runtime.

## Requisitos de instalación

```powershell
# 1. Instalar Ruflo
npx ruflo@latest init wizard

# 2. Registrar como MCP en Claude Code
claude mcp add ruflo -- npx ruflo@latest mcp start

# 3. Verificar
claude mcp list
# Debe mostrar: ruflo (activo)
```

Si Ruflo NO está instalado, NEXUS funciona normalmente con sus
capacidades propias. El bridge es un fallback graceful — no bloquea
nada si Ruflo no está disponible.

## Detección automática (Fase 0.7)

```
Al boot, NEXUS verifica:
  ¿MCP "ruflo" está registrado y responde?
  SÍ → RUFLO_AVAILABLE = true → activar delegación
  NO  → RUFLO_AVAILABLE = false → modo NEXUS-only (como hoy)

Health check: ruflo MCP tool "health_check" o "server_status"
  → Si responde → activo
  → Si timeout → desactivado para esta sesión
```

## Mapa de delegación — cuándo usa NEXUS a Ruflo

### 1. Vector search (reemplaza grep en wiki)

```
TRIGGER: /nexus recall, /nexus wiki query, o routing que consulta wiki
ANTES (NEXUS solo): grep -rl "{keywords}" wiki/ → resultados por keyword
AHORA (con Ruflo):  ruflo memory_search "{query}" → resultados por embedding

Flujo:
  wiki-memory-worker recibe query
    → SI RUFLO_AVAILABLE:
        → ruflo-worker vector-search "{query}"
        → Ruflo busca en AgentDB con HNSW
        → Devuelve top 5 resultados con similarity score
        → wiki-memory-worker integra resultados en respuesta
    → SI NO:
        → grep en wiki/ (fallback actual, funciona igual que antes)

Beneficio: búsqueda semántica vs keyword match.
  "¿qué decidimos sobre pagos?" encuentra "Stripe Connect para marketplace"
  aunque la palabra "pagos" no aparezca en la página.
```

### 2. Memory sync (wiki → AgentDB)

```
TRIGGER: post-pipeline (Fase 5) o /nexus ruflo sync
FLUJO:
  Cada N sesiones (configurable, default: 5):
    → Leer todas las páginas wiki nuevas/modificadas desde último sync
    → Enviar contenido a ruflo memory_store con metadata:
        namespace: "nexus-wiki"
        tags: [dominio, tipo, fecha]
    → Ruflo genera embeddings y los indexa en AgentDB
    → Actualizar .raw/.manifest.json con sync timestamp

REGLA: el wiki .md sigue siendo la fuente de verdad.
  Si hay conflicto, el wiki gana. Ruflo es índice de búsqueda,
  no almacén primario.
```

### 3. Swarm para paralelo real

```
TRIGGER: goal-planner detecta fases paralelas en un goal
ANTES: Claude simula paralelo (en realidad es secuencial)
AHORA: ruflo-worker delega a swarm real

Flujo:
  goal-planner-worker identifica: SP2 y SP4 pueden correr en paralelo
    → SI RUFLO_AVAILABLE:
        → ruflo-worker swarm:
            agents: ["market-scout", "marketos"]
            tasks: [SP2_task, SP4_task]
            topology: "parallel"
        → Ruflo ejecuta ambos en workers reales
        → NEXUS recibe resultados de ambos
        → Continúa con la siguiente fase del goal
    → SI NO:
        → ejecutar SP2 → luego SP4 (secuencial, como hoy)
```

### 4. SONA learning (reemplaza stats en markdown)

```
TRIGGER: post-pipeline (Fase 5) cuando learning-worker captura datos
ANTES: stats en learning-log.md, Claude las lee y ajusta routing
AHORA: enviar trayectoria a SONA para learning real

Flujo:
  learning-worker captura pipeline result
    → SI RUFLO_AVAILABLE:
        → ruflo-worker learn:
            trajectory: {skills, statuses, retries, combo, duration}
            domain: "arhinfo"
        → SONA procesa y actualiza pesos neuronales
        → NEXUS consulta: ruflo intelligence_query "best combo for arhinfo?"
        → SONA responde con recomendación basada en pesos reales
        → routing aplica la recomendación
    → SI NO:
        → learning-log.md + learning-stats.md (como hoy)

NOTA: ambos sistemas pueden coexistir. NEXUS mantiene sus stats .md
como respaldo y referencia visual. SONA es el motor de optimización.
```

### 5. Agent spawn para subtareas

```
TRIGGER: un worker de NEXUS necesita ejecutar una subtarea compleja
ANTES: el worker lo hace inline (más tokens, más tiempo)
AHORA: spawna un agente de Ruflo para la subtarea

Flujo:
  codex-worker necesita generar tests para 5 módulos
    → SI RUFLO_AVAILABLE:
        → ruflo-worker spawn:
            agent: "tester"
            task: "generate tests for {module}"
            repeat: 5 (uno por módulo)
        → Ruflo spawna 5 agentes tester en paralelo
        → NEXUS recibe los tests generados
    → SI NO:
        → codex-worker genera los tests secuencialmente (como hoy)
```

## Tools de Ruflo que NEXUS usa

```
CORE (siempre disponibles si Ruflo activo):
  memory_store     → guardar en AgentDB
  memory_search    → buscar por embeddings (HNSW)
  health_check     → verificar estado

SWARM (si ruflo-swarm plugin instalado):
  swarm_init       → iniciar swarm con topología
  swarm_status     → estado del swarm

INTELLIGENCE (si ruflo-intelligence plugin instalado):
  agent_spawn      → crear agente para subtarea
  intelligence_query → consultar SONA

NEXUS NO USA (irrelevante para su caso):
  federation_*     → no necesita cross-machine
  security_*       → tiene su propio security-audit
  browser_*        → no necesita Playwright
```

## Coexistencia pacífica

```
NEXUS y Ruflo NO compiten por:
  - Archivo de config: NEXUS usa nexus.config.json, Ruflo usa .claude-flow/
  - Directorio de skills: NEXUS usa warehouse/, Ruflo usa .agents/
  - Memoria: NEXUS usa wiki/, Ruflo usa AgentDB
  - Logs: NEXUS usa nexus-log.md, Ruflo usa su propio log

NEXUS manda, Ruflo ejecuta:
  NEXUS decide QUÉ hacer (routing, goal planning, wiki query)
  Ruflo ejecuta CÓMO hacerlo (vector search, swarm, SONA)
  Si Ruflo no está → NEXUS hace todo solo (como v9.1)
  Si Ruflo está → NEXUS delega lo que tiene runtime
```

## Comandos

| Comando | Acción |
|---|---|
| /nexus ruflo status | Ver estado de conexión con Ruflo MCP |
| /nexus ruflo sync | Sincronizar wiki → AgentDB manualmente |
| /nexus ruflo tools | Listar tools de Ruflo disponibles |
