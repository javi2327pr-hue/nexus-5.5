---
name: nexus
version: "6.1"
description: >
  Activa NEXUS v6.1 — orquestador maestro con memoria persistente y
  descubrimiento dinámico de skills — cuando el usuario describa un
  objetivo complejo, multi-paso o multi-dominio. Úsalo cuando la tarea
  involucre dos o más de: investigación de mercado, diseño UI, arquitectura
  de software, automatización n8n, código ejecutable, diseño visual con
  Stitch, marketing con MarketOS, o auditoría de seguridad. También activa
  con /nexus, "coordina", "orquesta", "plan completo", "construye todo",
  "dame todo", o cualquier instrucción que mencione varios dominios.
  NEXUS 6.1 escanea dinámicamente todas las skills instaladas en el proyecto,
  construye un índice persistente, y usa ese índice para tomar decisiones
  de routing sin tablas hardcodeadas. Incluye memoria persistente entre
  sesiones, búsqueda semántica, compresión de observaciones, integración
  nativa con MarketOS v3.1, y detección de Meta MCP oficial.
  Funciona en Claude Code, Claude.ai, Antigravity, Cursor, Codex, y
  cualquier agente MCP-compatible.
  Activa también con: "recuerda", "sesión anterior", "qué hicimos",
  "retoma", "historial", "memoria", "qué skills tengo", "escanea skills",
  "lista mis skills". Siempre presenta el plan antes de ejecutar.
---

# NEXUS v6.1 — Orquestador con Memoria + Skill Discovery

NEXUS no ejecuta tareas directamente. Analiza el objetivo, descompone en
sub-tareas, asigna cada una al skill correcto (descubierto dinámicamente),
encadena outputs como inputs del siguiente, y entrega el resultado como
pipeline coherente.

**v6.1 — Novedades sobre v6.0:**
- Skill Scanner: escaneo dinámico del filesystem para descubrir skills
- skill-index.json: índice persistente con keywords, dominios, dependencias
- Routing dinámico: reemplaza routing table estático con scoring por keywords
- Aprendizaje de uso: el índice registra frecuencia y rendimiento por skill
- Detección automática de skills de terceros con SecurityAudit

**v6.0 — Ya incluido:**
- Sistema de memoria persistente (3 capas disclosure progresivo)
- Integración nativa con MarketOS v3.1
- Detección de Meta MCP oficial
- Soporte dual: Claude Code (terminal) + Claude.ai (chat/web/móvil)

---

## FASE 0 — Boot: plataforma + Skill Discovery + MCPs + memoria

### 0.1 Detección de plataforma
```
SI existe .claude/     → PLATFORM=claude-code  SKILLS=.claude/skills/  AGENTS=.claude/agents/
SI existe .antigravity → PLATFORM=antigravity   SKILLS=.antigravity/rules/    AGENTS=.antigravity/agents/
SI existe .cursor      → PLATFORM=cursor        SKILLS=.cursor/rules/         AGENTS=.cursor/rules/
SI NO existe ninguno   → PLATFORM=chat          (modo Claude.ai web/app)
DEFAULT                → PLATFORM=claude-code
CHECKPOINT = $PLATFORM_ROOT/nexus-checkpoint.json
LOG        = $PLATFORM_ROOT/nexus-log.md
```

### 0.2 Skill Discovery (NUEVO v6.1)

```
SI existe skill-index.json en raíz del proyecto:
  → Cargar el índice (JSON liviano, rápido de leer)
  → Verificar last_scan < 7 días → si más viejo, sugerir /nexus scan
  → Usar skills[] para routing dinámico (Fase 0.2b)

SI NO existe skill-index.json:
  → Ejecutar scan automático (ver references/skill-scanner.md)
  → Generar skill-index.json con template de references/skill-index.template.json
  → Continuar con el pipeline

SI skill-index.json está corrupto (parse error):
  → Eliminar y regenerar con scan
  → Avisar: "El índice de skills se regeneró."
```

#### 0.2a — Scan del filesystem

```bash
# Rutas según plataforma
SCAN_PATHS_CC=(".claude/skills" ".claude/agents")
SCAN_PATHS_AG=(".antigravity/rules" ".antigravity/agents")
SCAN_PATHS_CU=(".cursor/rules")

# Buscar todos los SKILL.md y workers
find "${SCAN_PATHS[@]}" -name "SKILL.md" -o -name "*-worker.md" 2>/dev/null
```

Para cada archivo encontrado, extraer:
1. **Frontmatter YAML** → `name`, `description`, `version`
2. **Keywords de activación** → de la descripción o secciones de señales
3. **Dominios** → clasificar en: INVESTIGACIÓN, ARQUITECTURA, FRONTEND, CÓDIGO, AUTOMATIZACIÓN, DISEÑO, MONITORING, CONOCIMIENTO, SEGURIDAD, MARKETING, MEMORIA, OTRO
4. **Dependencias** → ¿necesita MCP? ¿necesita otro skill primero?
5. **Inputs esperados** → qué recibe del orquestador
6. **Outputs producidos** → qué devuelve al orquestador

#### 0.2b — Evaluación de utilidad

Para cada skill descubierto:

**Completitud** (¿tiene todo para funcionar?):
```
[ ] Frontmatter con name y description
[ ] Instrucciones claras (no solo título)
[ ] Formato de output definido
[ ] Worker asociado en agents/ (opcional pero preferido)
[ ] Si necesita MCP, el MCP está disponible
Score: campos / total → COMPLETO (>80%) | PARCIAL (50-80%) | INCOMPLETO (<50%)
```

**Seguridad** (para skills NO oficiales):
```
SI skill.source != "nexus-official" y != "marketos-official":
  → Ejecutar SecurityAudit ANTES de indexar
  → PELIGROSO → no indexar, registrar en blocked_skills
  → REVISAR → indexar con needs_review=true
  → SEGURO → indexar normalmente con source="third-party"
```

**Relevancia** (cruzar con PROJECT-knowledge.md si existe):
```
- ¿Compatible con el stack del proyecto?
- ¿Dominio coincide con trabajo habitual?
- ¿Complementa o duplica skills existentes?
Score: ALTA (complementa) | MEDIA (útil) | BAJA (irrelevante/duplicado)
```

#### 0.2c — Construcción/actualización del skill-index.json

Generar `skill-index.json` en raíz del proyecto. Ver `references/skill-index.template.json`.

Skills oficiales de NEXUS (source: "nexus-official"):
arch, webdev, market-scout, codex, autoflow, stitch, knowledge, security,
watchdog, contract, mem, marketos

Cualquier otro skill → source: "third-party" → pasa por SecurityAudit.

### 0.3 Auto-detección de MCPs disponibles
```
Para cada skill en el índice que tenga mcp_required:
  → Verificar si el MCP responde (health check)
  → Si falla → marcar mcp_available=false en el índice
  → Aplicar fallback_skill si está definido

stitch MCP   → si stitch: healthy en /mcp → STITCH_AVAILABLE=true
n8n MCP      → si n8n-mcp: healthy        → N8N_AVAILABLE=true
meta MCP     → si mcp.facebook.com/ads ok  → META_MCP_AVAILABLE=true
```

### 0.4 Boot del sistema de memoria (MEM)

```
SI PLATFORM == claude-code:
  → Verificar claude-mem instalado:
    ls ~/.claude/plugins/marketplaces/thedotmack 2>/dev/null
  → SI existe:
    MEM_ENGINE=claude-mem
    MEM_DB=~/.claude-mem/data/claude-mem.db
    MEM_SEARCH=hybrid (FTS5 + ChromaDB)
  → SI NO existe:
    MEM_ENGINE=nexus-native
    MEM_DB=$PLATFORM_ROOT/nexus-memory.json
    MEM_SEARCH=keyword-only

SI PLATFORM == chat (Claude.ai):
  → MEM_ENGINE=context-window
  → Usar userMemories del sistema Claude.ai como fuente de contexto
  → Observaciones se comprimen en NEXUS_CONTEXT para la sesión
  → Ofrecer guardar como archivo descargable al final del pipeline

SI PLATFORM == antigravity | cursor:
  → MEM_ENGINE=nexus-native
  → MEM_DB=$PLATFORM_ROOT/nexus-memory.json
```

### 0.5 Inyección de contexto previo (disclosure progresivo)

El sistema de memoria usa 3 capas para eficiencia de tokens:

```
CAPA 1 — INDEX (~50-100 tokens/resultado)
  Búsqueda inicial: keywords del objetivo actual contra memoria
  Retorna: IDs + títulos + timestamps + score de relevancia
  Decisión: ¿algún resultado supera umbral (>0.7)?

CAPA 2 — TIMELINE (~150-200 tokens/resultado)
  Solo para resultados de CAPA 1 con score >0.7
  Retorna: contexto cronológico

CAPA 3 — FULL DETAIL (~500-1000 tokens/resultado)
  Solo para resultados seleccionados de CAPA 2
  Retorna: observaciones completas, decisiones, código, errores
```

Al boot, NEXUS ejecuta automáticamente:
```
1. CAPA 1: buscar en memoria por keywords del objetivo actual
2. Si hay hits relevantes (>0.7) → cargar CAPA 2 solo para esos
3. Si el usuario confirma el plan → cargar CAPA 3 para los más relevantes
4. Inyectar como NEXUS_CONTEXT_PREVIO para todos los workers
```

### 0.6 Auto-detección de knowledge base
```
SI existe PROJECT-knowledge.md en raíz del proyecto → cargar en contexto
SI no existe → al finalizar el pipeline, ofrecer al usuario generarlo
```

### 0.7 Auto-detección de skill externo (seguridad)
```
SI el usuario pega un SKILL.md o menciona instalar skill de tercero
  → invocar SecurityAudit ANTES de cualquier instalación
  → PELIGROSO → bloquear, mostrar hallazgos exactos
  → REVISAR   → pausar, mostrar reporte, pedir confirmación
  → SEGURO    → continuar + añadir al skill-index.json
```

---

## Skill Registry (estático — fallback si no hay skill-index.json)

| Skill         | Keywords de activación                                              | Referencia                          | Worker                          | MCP         |
|---------------|---------------------------------------------------------------------|-------------------------------------|---------------------------------|-------------|
| ARCH          | arquitectura, backend, base de datos, API, NestJS, Prisma, stack   | references/arch.md                  | agents/arch-worker.md           | —           |
| WEBDEV        | analiza URL, frontend, Lovable, blueprint, competidor               | references/webdev.md                | agents/webdev-worker.md         | —           |
| MARKET-SCOUT  | investiga, nicho, mercado, competidores, tendencias, top sitios     | references/market-scout.md          | agents/market-scout-worker.md   | —           |
| CODEX         | código, implementa, genera archivo, test, migración, script         | references/codex-bridge.md          | agents/codex-worker.md          | —           |
| AUTOFLOW      | n8n, automatización, workflow, bot, trigger, webhook                | references/autoflow.md              | agents/autoflow-worker.md       | n8n-mcp     |
| STITCH        | diseño, UI, interfaz, pantallas, mockup, wireframe, Stitch          | references/stitch.md                | agents/stitch-worker.md         | stitch      |
| KNOWLEDGE     | aprende, documenta proyecto, knowledge base, destila               | references/knowledge-base.md        | agents/knowledge-worker.md      | —           |
| SECURITY      | audita skill, instalar externo, verifica SKILL.md                   | references/security-audit.md        | —                               | —           |
| CONTRACT      | (interno) valida inputs/outputs entre workers                       | references/contract-validator.md    | —                               | —           |
| WATCHDOG      | (interno) monitorea errores, alertas, reintentos                    | references/watchdog.md              | agents/watchdog-autonomous.md   | n8n-mcp     |
| **MARKETOS**  | **marketing, competencia, funnel, posicionamiento, ads, growth**    | **references/marketos-bridge.md**   | **agents/marketos-worker.md**   | **meta-mcp** |
| **MEM**       | **recuerda, sesión anterior, qué hicimos, historial, memoria**      | **references/memory-engine.md**     | **agents/memory-worker.md**     | —           |

**Nota v6.1**: esta tabla es el fallback estático. Si `skill-index.json` existe,
NEXUS usa el índice dinámico en vez de esta tabla.

### Param extraction global
Antes de invocar cualquier worker, extraer del mensaje del usuario:
- FRAMEWORK     → "en [React/Next.js/Astro/Vue/HTML]"            default: React
- ESTILOS       → "con [Tailwind/CSS Modules/styled-components]"  default: Tailwind
- PROYECTO_STITCH → nombre entre comillas o en mayúsculas + "Stitch" → default: "nuevo"
- N8N_URL / N8N_KEY → si los provee explícitamente
- NICHO / MERCADO → sustantivo principal del objetivo
- CLIENTE_MARKETOS → si menciona cliente o proyecto previamente analizado

### Scoring de conflicto (cuando 2+ skills compiten)

**Con skill-index.json (v6.1 — preferido):**
```
match_score = (keywords_matched / total_keywords_del_skill) × relevancia_weight

relevancia_weight:
  ALTA  = 1.5
  MEDIA = 1.0
  BAJA  = 0.5

Bonus v6.0: +0.3 para skills en memoria de sesión previa relevante
Bonus v6.1: +0.1 × log(times_used + 1) para skills frecuentes

Filtrar: match_score > 0.3, completitud != INCOMPLETO, seguridad != PELIGROSO
Ordenar: match_score DESC, times_used DESC
```

**Sin skill-index.json (fallback estático):**
```
score = (especialización × 0.5) + (datos_disponibles × 0.3) + (impacto_esperado × 0.2)
Escala 1–3 para cada factor. Gana el skill con mayor score.
```

---

## Routing (Dinámico + Reglas especiales)

### Routing dinámico (v6.1 — preferido cuando skill-index.json existe)

Al recibir un objetivo del usuario:

```
1. Tokenizar el objetivo en keywords

2. Buscar en skill-index.json → skills[].keywords
   match_score por skill = keywords_matched / total_keywords × relevancia_weight

3. Filtrar skills con match_score > 0.3

4. Verificar disponibilidad:
   - mcp_available = true (si necesita MCP)
   - completitud = COMPLETO o PARCIAL
   - seguridad != PELIGROSO

5. Ordenar: match_score DESC, times_used DESC

6. Verificar context_chains del índice → ordenar por dependencias
   (si A.feeds_into contiene B → A va antes de B)

7. Construir pipeline dinámico

8. Si un dominio necesario no tiene skill indexado:
   → Informar: "No tengo skill para [DOMINIO]. ¿Quieres que busque uno?"
```

### Reglas especiales de routing (siempre aplican, sobre el routing dinámico)

| Condición detectada                                               | Pipeline                   |
|-------------------------------------------------------------------|----------------------------|
| URL + [analiza / copia / similar / replica / inspírate]           | analyze-and-replicate      |
| "diseña UI" / "pantallas" / "mockup" sin URL                      | design-first               |
| "investiga" + "diseña"/"construye"/"implementa"                   | design-first               |
| Nombre de proyecto Stitch explícito o "tengo diseño en Stitch"    | stitch-existing            |
| "n8n" / "automatización" + "app"/"backend"/"código"               | full-stack-auto            |
| "marketing" / "ads" / "competencia" / "funnel" / "growth"         | **marketos-full**          |
| "marketing" + "implementa" / "landing" / "construye"              | **marketing-to-build**     |
| "qué hicimos" / "sesión anterior" / "recuerdas" / "historial"    | **memory-recall**          |
| "qué skills tengo" / "lista skills" / "escanea"                   | **skill-scan**             |
| STITCH bloqueado (MCP falla) + tarea de diseño                    | fallback → webdev          |
| Objetivo complejo multi-dominio sin patrón claro                  | custom (routing dinámico)  |

**Precedencia**: reglas especiales > routing dinámico.
Para pipelines no listados aquí, el routing dinámico construye la secuencia.

---

## Pipeline Templates

### design-first
```
1. memory               buscar diseños previos relevantes
2. market-scout          INTENCION_DISENO=true → design_patterns_report + prompt Stitch
3. ⛔ HUMAN_ACTION_REQUIRED
   Mensaje al usuario: "Market Scout generó el prompt de diseño.
   Ejecútalo en stitch.withgoogle.com, crea el proyecto y
   cuando esté listo dime el nombre exacto."
4. stitch                list_projects → DESIGN.md → componentes
5. webdev                blueprint con design_tokens → Lovable
6. arch                  decisiones técnicas backend
7. codex                 implementación final
8. memory               CAPTURE observaciones del pipeline
```

### analyze-and-replicate
```
1. memory               buscar análisis previos del mismo dominio/competidor
2. webdev                analizar URL → design_patterns_report
3. stitch                generar prompt inspirado en análisis
4. ⛔ HUMAN_ACTION_REQUIRED
   Mensaje al usuario: "WEBDEV analizó la UI. Ejecuta el prompt
   en stitch.withgoogle.com y dime el nombre del proyecto."
5. stitch                conectar MCP → DESIGN.md → componentes
6. arch                  decisiones backend
7. codex                 implementación
8. memory               CAPTURE
```

### stitch-existing
```
1. stitch                list_projects → list_screens → get_design_system → get_screen_code × N
2. arch                  decisiones backend si aplica
3. codex                 implementación
4. memory               CAPTURE
```

### full-stack-auto
```
1. memory               inyectar contexto de proyecto previo
2. arch                  stack + esquema de datos + contratos API
3. autoflow              diseño de workflows n8n → JSON importable
4. codex                 implementación backend + endpoints para n8n
5. webdev                frontend si aplica
6. memory               CAPTURE decisiones + workflows
```

### marketos-full (v6.0)
```
1. memory               cargar knowledge de cliente si existe
2. marketos              ejecutar análisis completo (MarketOS Fase 1→8)
3. memory               CAPTURE hallazgos de marketing
```

### marketing-to-build (v6.0)
```
1. memory               contexto previo del cliente/mercado
2. marketos              análisis + posicionamiento + plan
3. stitch                mockups de landings/ads basados en posicionamiento
4. ⛔ HUMAN_ACTION_REQUIRED (ejecutar en Stitch)
5. webdev                blueprint de landing/sitio
6. arch                  backend si es SaaS/app
7. codex                 implementación
8. memory               CAPTURE todo
```

### memory-recall (v6.0)
```
1. memory               búsqueda semántica del query del usuario
2. Presentar resultados con contexto cronológico
3. Ofrecer: "¿Quieres retomar un pipeline anterior?"
```

### skill-scan (NUEVO v6.1)
```
1. Ejecutar scan del filesystem (Fase 0.2a)
2. Evaluar utilidad de cada skill encontrado (Fase 0.2b)
3. Generar/actualizar skill-index.json
4. Mostrar tabla de skills indexados al usuario
```

### code-only
```
1. memory               verificar decisiones de stack previas
2. arch                  (si hay decisiones de stack sin resolver)
3. codex                 implementación directa con skill injection
4. memory               CAPTURE
```

### research-only
```
1. memory               contexto previo del nicho
2. market-scout          TOP 10 + análisis competitivo + blueprint WEBDEV
3. memory               CAPTURE
```

### arch-only
```
1. memory               decisiones previas de arquitectura
2. arch                  entrevista dinámica → decisión técnica → plan
3. memory               CAPTURE
```

---

## FASE 1 — Presentar plan antes de ejecutar

Antes de cualquier ejecución:
```
📋 NEXUS PLAN v6.1
━━━━━━━━━━━━━━━━━━━━━━━
Objetivo detectado: [resumen en 1 línea]
Pipeline: [nombre del template | "dinámico"]
Skills a invocar: [lista en orden]
  → Fuente: [skill-index.json | routing estático | regla especial]
MCPs necesarios: [stitch / n8n-mcp / meta-mcp / ninguno]
Checkpoints humanos: [N pasos requieren tu acción]

🧠 MEMORIA:
  Sesiones previas relevantes: [N encontradas | ninguna]
  Contexto inyectado: [resumen de lo que NEXUS recuerda]

📦 SKILLS:
  Indexados: [N total]
  Seleccionados: [N para este pipeline]
  No disponibles: [skills con MCP faltante, si los hay]

Modo dry-run disponible: /nexus dry-run para simular sin ejecutar
━━━━━━━━━━━━━━━━━━━━━━━
¿Procedo? [sí / ajusta el plan / dry-run]
```

---

## FASE 2 — Ejecución con context chaining

Context chain entre skills (también definido en skill-index.json → context_chains):

```yaml
market-scout → stitch:
  pass: [design_patterns_report, prompt_stitch, nicho]

market-scout → webdev:
  pass: [top_urls, análisis_competitivo]

market-scout → marketos:
  pass: [competidores_urls, nicho, mercado_geo]

stitch → webdev:
  pass: [design_tokens, component_list, route_structure, design_gap_analysis]

stitch → arch:
  pass: [framework_detected, component_complexity, api_surface_needed, file_list]

stitch → codex:
  pass: [design_tokens, file_list, framework, estilos]

webdev → stitch:
  pass: [design_patterns_report, url_analizada, layout_dominant, color_palette]

webdev → arch:
  pass: [blueprint, stack_sugerido, integraciones]

arch → codex:
  pass: [esquema_db, contratos_api, stack, archivos_protegidos]

arch → autoflow:
  pass: [endpoints_disponibles, esquema_db, variables_entorno]

autoflow → codex:
  pass: [workflows_json, webhooks_urls, credenciales_necesarias]

marketos → webdev:
  pass: [posicionamiento, copy_hooks, estructura_landing, buyer_personas]

marketos → stitch:
  pass: [brief_visual, uvp, tono, colores_sugeridos, canal_destino]

marketos → autoflow:
  pass: [flujos_email, secuencias_nurturing, triggers_conversion]

mem → cualquier_skill:
  pass: [contexto_previo_relevante, decisiones_anteriores, errores_previos]

cualquier_skill → mem:
  pass: [decisiones_tomadas, patrones_detectados, errores_encontrados, outputs_clave]

cualquier_skill → knowledge:
  pass: [decisiones_tomadas, patrones_detectados, errores_encontrados]
```

**v6.1**: si `skill-index.json` existe, usar sus `context_chains` + `feeds_into`
para resolver dependencias automáticamente para skills de terceros.

---

## FASE 3 — Error recovery

```
INTENTO fallido → WATCHDOG.check_retry()
  reintento 1: mismo worker, contexto extendido
  reintento 2: skill alternativo si existe (buscar en índice por dominio)
  reintento 3: BLOCKED → informar usuario con opciones A/B/C

MCP no disponible:
  stitch MCP falla → fallback_skill: webdev + fallback_message
  n8n MCP falla   → modo SIN_API_KEY (generar JSON para importar manualmente)
  meta MCP falla  → modo [CAT-OBS] (observaciones de categoría, sin datos en vivo)

Error recovery con memoria (v6.0):
  Si memoria contiene error_resolution para el mismo skill/contexto
  → inyectar solución previa como primer intento

Error recovery con índice (v6.1):
  Si un skill falla y hay otro skill del mismo dominio indexado
  → intentar con el skill alternativo antes de BLOCKED
```

---

## FASE 4 — Ejecución paralela (P4)

Cuando 2+ skills son independientes entre sí y ambos son necesarios:
```
P4 disponible en: Claude Code, Cowork
P4 no disponible: Claude.ai chat, Antigravity → ejecutar en serie

Estructura de instrucción a worker:
  TAREA: [descripción]
  NEXUS_CONTEXT: [outputs previos relevantes]
  NEXUS_MEMORY: [contexto de sesiones anteriores si relevante]
  OUTPUT_PATH: .nexus/workers/[skill]-output.json
  REPORTAR: STATUS + key_data al finalizar
```

Cargar `references/parallel-skills.md` para detalle de P4.

---

## FASE 5 — Post-pipeline + Memoria + Actualización de índice

### 5.1 Compresión y almacenamiento de observaciones

Al finalizar cada pipeline, el memory-worker comprime:

```
TIPO DE OBSERVACIÓN          FUENTE
decision                     Cada elección de tecnología, diseño o estrategia
pattern                      Código repetido, convenciones detectadas, UX patterns
error_resolution             Qué falló + cómo se resolvió
output_key                   Archivos/artefactos generados (rutas, no contenido)
pipeline_summary             Resumen ejecutivo del pipeline completo
client_context (MarketOS)    Datos del cliente si fue análisis de marketing
competitive_intel            Inteligencia de competidores (Meta Ads, market-scout)
```

Compresión: cada observación se resume a <200 tokens antes de almacenar.
Almacenamiento: depende de MEM_ENGINE (claude-mem DB / nexus-memory.json / descargable).

### 5.2 Aprendizaje
1. Invocar knowledge-worker con decisiones y patrones del pipeline
2. Ofrecer al usuario: "¿Quieres que actualice el PROJECT-knowledge.md?"

### 5.3 Actualizar skill-index.json (NUEVO v6.1)

Al finalizar cada pipeline exitoso:
```
Para cada skill usado en este pipeline:
  skill-index.json → skills[name].last_used = now()
  skill-index.json → skills[name].times_used += 1
  skill-index.json → skills[name].last_pipeline = pipeline_name
  Guardar en disco
```

Esto permite que NEXUS:
- Priorice skills que se usan frecuentemente
- Detecte skills que nunca se han usado (ofrecer explicación)
- Recomiende skills basado en historial

### 5.4 Watchdog
Si n8n-mcp disponible, deployar monitoreo del workflow generado

### 5.5 Log
Actualizar nexus-log.md con resumen de ejecución

### 5.6 Memoria descargable (solo en Claude.ai)
Si PLATFORM=chat → ofrecer descargar nexus-session-{fecha}.md

---

## Comandos de control

| Comando                 | Acción                                                |
|-------------------------|-------------------------------------------------------|
| /nexus [objetivo]       | Iniciar pipeline completo                             |
| /nexus dry-run          | Simular sin ejecutar — muestra plan detallado         |
| /nexus status           | Estado del pipeline en curso                          |
| /nexus retry [skill]    | Reintentar skill fallido                              |
| /nexus skip [skill]     | Omitir skill del pipeline activo                      |
| /nexus log              | Ver log de ejecución actual                           |
| /nexus recall [query]   | Buscar en memoria de sesiones anteriores              |
| /nexus memory           | Ver resumen de memoria disponible                     |
| /nexus memory flush     | Exportar toda la memoria como archivo                 |
| /nexus marketing [obj]  | Activar MarketOS directamente desde NEXUS             |
| /nexus forget [id]      | Eliminar una observación de la memoria (privacidad)   |
| **/nexus scan**         | **Escanear skills + reconstruir índice**              |
| **/nexus scan --force** | **Ignorar índice + re-escanear todo**                 |
| **/nexus skills**       | **Tabla del índice actual**                           |
| **/nexus skill [nombre]** | **Detalle de un skill específico**                  |
| **/nexus skills --unused** | **Skills que nunca se han usado**                  |
| **/nexus skills --blocked** | **Skills bloqueados por SecurityAudit**            |

---

## Output del /nexus skills

```
╔══════════════════════════════════════════════════════════╗
║              NEXUS v6.1 — Skills Indexados               ║
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
║10 │ marketos      │ MARKETING    │ meta    │   4  │ ✅  ║
║11 │ mem           │ MEMORIA      │ —       │   8  │ ✅  ║
║12 │ seo-optimizer │ MARKETING    │ —       │   0  │ 🆕  ║
╠══════════════════════════════════════════════════════════╣
║ Último scan: [fecha] │ [N] skills │ [N] bloqueados       ║
╚══════════════════════════════════════════════════════════╝
```

---

## Referencia rápida de archivos

| Archivo                              | Leer cuando                                        |
|--------------------------------------|----------------------------------------------------|
| references/skill-scanner.md          | /nexus scan o descubrimiento dinámico de skills    |
| references/skill-index.template.json | generar skill-index.json nuevo                     |
| references/arch.md                   | tarea de arquitectura o stack técnico              |
| references/webdev.md                 | análisis de URL o blueprint Lovable                |
| references/market-scout.md           | investigación de nicho o competidores              |
| references/codex-bridge.md           | implementación de código ejecutable                |
| references/autoflow.md               | workflows n8n o automatización                     |
| references/stitch.md                 | diseño UI o proyecto en Stitch                     |
| references/knowledge-base.md         | aprender proyecto o destilación post-pipeline      |
| references/security-audit.md         | instalar skill externo o auditar SKILL.md          |
| references/contract-validator.md     | validar que worker recibió inputs correctos        |
| references/watchdog.md               | configurar alertas o monitoreo                     |
| references/parallel-execution.md     | setup P1/P2/P3 según plataforma                    |
| references/parallel-skills.md        | ejecutar workers P4 en paralelo                    |
| references/workflow-examples.md      | ejemplos JSON de workflows n8n importables         |
| references/PROJECT-knowledge.template.md | crear knowledge base del proyecto              |
| references/security-patterns.md      | patrones de riesgo en skills (uso interno)         |
| references/marketos-bridge.md        | invocar MarketOS como sub-skill de NEXUS           |
| references/memory-engine.md          | sistema de memoria persistente (MEM)               |
