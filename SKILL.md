---
name: nexus
version: "9.3"
description: >
  Activa NEXUS v9.3 "Self-Refining Engine" — orquestador maestro con
  bodega física de skills, wiki memory persistente, self-learning loop,
  skill reputation, goal decomposition, hooks nativos, routing adaptativo,
  Sequential Thinking condicional, context switching, skill health audit,
  pipeline template promotion, Ruflo MCP bridge, y desde v9.3 user
  satisfaction feedback (👍/👎) + winning patterns por dominio.
  Las 1,446 skills se guardan en ~/.claude/warehouse/ organizado por
  módulos. Claude Code solo ve ~/.claude/skills/nexus/ al boot (~400 tokens).
  v9.3 añade: feedback explícito del usuario que modula reputation_score
  (👍 ×1.2, 👎 ×0.5), y winning patterns — combos exitosos guardados por
  dominio con su contexto y aplicados como hint en pipelines similares
  futuros. Sin Ruflo: matching por dominio+keywords. Con Ruflo: vectorial.
  NEXUS es el cerebro (routing, wiki, bodega, MarketOS, feedback loop).
  Ruflo es el motor (vector search HNSW, swarm paralelo real, SONA).
  Si Ruflo no está instalado, NEXUS funciona normalmente — graceful fallback.
  Incluye auto-ingesta, distinción skill/agente, memoria wiki persistente,
  Meta MCP, MarketOS, y soporte multi-plataforma.
  Activa con: /nexus, "coordina", "orquesta", "plan completo",
  "recuerda", "qué skills tengo", "escanea", "warehouse", "wiki",
  "save", "ingest", "recall", "qué aprendimos", "qué decidimos",
  "goal", "lanzar", "proyecto completo", "aprende", "reputación",
  "switch", "cambiar proyecto", "esto es complejo", "piensa bien",
  "audita", "audit", "contexto", "--deep", "ruflo", "swarm", "sync",
  "me gustó", "me encantó", "perfecto", "excelente", "liked", "disliked",
  "no me gustó", "no sirvió", "mal", "patrón", "pattern".
---

# NEXUS v9.3 "Self-Refining Engine" — Orquestador + Feedback Loop

## Cómo funciona

```
SIN NEXUS (antes):
  Boot → Claude Code lee 1700 skills → ~80,000 tokens → lento

CON NEXUS v8.0:
  Boot → Claude Code lee SOLO nexus/ → ~400 tokens → instantáneo
  Boot → lee wiki/hot.md → ~500 tokens → contexto restaurado
  /nexus objetivo → catálogo + wiki context → symlinks → ejecuta → limpia → wiki save
```

## Dónde vive cada cosa

```
~/.claude/
├── skills/                    ← SOLO nexus + symlinks temporales
│   ├── nexus/                 ← PERMANENTE — siempre aquí
│   │   ├── SKILL.md           ← este archivo
│   │   ├── nexus.config.json
│   │   ├── references/
│   │   └── agents/
│   ├── nestjs-expert → ../warehouse/js-ts/nestjs-expert  ← SYMLINK temporal
│   └── seo-audit → ../warehouse/seo-marketing/seo-audit  ← SYMLINK temporal
│
├── warehouse/                 ← BODEGA — 1700 skills dormidas por módulo
│   ├── ai-agents/             ← ~90 skills y agentes
│   ├── js-ts/                 ← ~40 skills
│   ├── python/                ← ~20 skills
│   ├── languages/             ← ~30 skills
│   ├── cloud-devops/          ← ~180 skills
│   ├── security/              ← ~50 skills
│   ├── data-ml/               ← ~40 skills
│   ├── databases/             ← ~25 skills
│   ├── seo-marketing/         ← ~50 skills
│   ├── design-frontend/       ← ~50 skills
│   ├── automation-saas/       ← ~80 skills
│   ├── business/              ← ~30 skills
│   ├── verticals/             ← ~40 skills
│   ├── testing-qa/            ← ~25 skills
│   ├── custom/                ← ~20 skills (marketos, andruia...)
│   └── plugins/               ← ~250 plugins
│
├── catalog/                   ← ÍNDICE — sabe dónde está todo
│   ├── catalog-root.json      ← 16 módulos (~200 tokens)
│   └── {módulo}.json × 16     ← entries con paths a warehouse/
│
├── nexus-wiki/                ← WIKI MEMORY (v8.0) — conocimiento acumulativo
│   ├── wiki/
│   │   ├── hot.md             ← contexto reciente (~500 tokens, boot auto)
│   │   ├── index.md           ← catálogo maestro de dominios
│   │   ├── log.md             ← historial append-only
│   │   ├── verticals.md       ← verticales de negocio (editable)
│   │   ├── arhinfo/           ← conocimiento ARHinfo POS
│   │   ├── abogado-ai/        ← conocimiento Abogado AI
│   │   ├── nexus-core/        ← conocimiento NEXUS
│   │   ├── nova/              ← conocimiento Nova Suplementos
│   │   ├── super-tiernos/     ← conocimiento Súper Tiernos
│   │   ├── macro/             ← análisis macroeconómico
│   │   ├── bienestar-scandi/  ← bienestar escandinavo
│   │   ├── med-funcional/     ← medicina funcional
│   │   ├── auto-ia-noruega/   ← automatización IA Noruega
│   │   └── general/           ← notas sin dominio específico
│   ├── .raw/                  ← fuentes originales (inmutables)
│   └── _templates/            ← plantillas Obsidian
│
├── plugins/                   ← plugins de Claude Code (no se tocan)
├── skills-backup-{fecha}/     ← backup antes del primer init
└── nexus-memory.json          ← memoria v7.2 legacy (migrada al wiki)
```

---

## FASE 0 — Boot (~400 tokens total)

### 0.1 Plataforma
```
.claude/ → claude-code    CATALOG=~/.claude/catalog/    WAREHOUSE=~/.claude/warehouse/
```

### 0.2 ¿Warehouse inicializado?

```
SI existe ~/.claude/warehouse/ con módulos:
  → Warehouse activo ✅
  → Continuar a 0.3

SI NO existe ~/.claude/warehouse/:
  → Primera vez. Preguntar:
    "📦 NEXUS detectó 1700+ skills en ~/.claude/skills/.
     Esto consume ~80,000 tokens en cada sesión.
     ¿Quieres inicializar la bodega? Esto:
       1. Crea backup en ~/.claude/skills-backup-{fecha}/
       2. Mueve skills a ~/.claude/warehouse/ por módulo
       3. Deja solo nexus/ en skills/
       4. Próximo boot: ~400 tokens en vez de ~80,000
     
     /nexus warehouse init para proceder."
```

### 0.3 Cargar catálogo raíz
```
→ Leer ~/.claude/catalog/catalog-root.json (~200 tokens)
→ 16 módulos con skills#, agents#, top_keywords
→ NO cargar módulos todavía
```

### 0.4 Auto-ingesta (¿skills nuevas?)

```
Comparar filesystem vs catálogo:
  NUEVOS en ~/.claude/skills/ (no symlinks):
    → Analizar funcionalidad
    → Mover a warehouse/{módulo}/
    → Registrar en catálogo
    → Reportar: "📦 {name} → warehouse/{módulo}/"

  NUEVOS en ~/.claude/warehouse/:
    → Analizar y registrar en catálogo

  BORRADOS:
    → Remover del catálogo
```

**Cuando instalas una skill nueva** (ej: `claude install seo-local`),
Claude Code la pone en `~/.claude/skills/seo-local/`. En el siguiente
boot, NEXUS la detecta, la analiza, la mueve a `warehouse/seo-marketing/`,
y la registra en el catálogo. Ya no consume tokens al boot.

### 0.5 Limpieza de symlinks huérfanos

```
Para cada entrada en ~/.claude/skills/:
  SI es symlink y NO es parte de un pipeline activo:
    → rm (remover symlink huérfano)
    → Pudo quedar de un crash anterior
```

### 0.6 Wiki Memory (v8.0)
```
WIKI_PATH = nexus.config.json → wiki_memory.path
  SI path="auto":
    Windows → wiki_memory.path_windows (C:\Users\javi2\.claude\nexus-wiki)
    Unix    → wiki_memory.path_unix (~/.claude/nexus-wiki)

SI NO existe WIKI_PATH:
  → Primera vez. Preguntar:
    "📚 NEXUS v8.0 incluye Wiki Memory — conocimiento acumulativo
     entre sesiones guardado en un vault Obsidian/markdown.
     /nexus wiki init para inicializar."

  → Al inicializar, detectar y ofrecer migrar conocimiento existente:
    ¿nexus-memory.json existe? → migrar bloques a páginas wiki
    ¿MarketOS tiene client-knowledge? → migrar a wiki/arhinfo/
    ¿PROJECT-knowledge.md existe? → indexar en wiki como referencia

SI existe WIKI_PATH/wiki/hot.md:
  → Leer hot.md silenciosamente (~500 tokens)
  → Inyectar en NEXUS_CONTEXT como contexto_previo
  → NO cargar index.md ni páginas (bajo demanda)

SI existe nexus-memory.json (v7.2 legacy) Y wiki ya inicializado:
  → Sugerir migración: "/nexus wiki migrate"

MEM_ENGINE prioridad:
  1. wiki-memory (v8.0, default)
  2. claude-mem (si instalado, complementario)
  3. nexus-native (fallback JSON para Claude.ai)
```

### 0.6.1 Memoria legacy (compatibilidad v7.2)
```
claude-mem → sincroniza con wiki automáticamente
sin claude-mem → wiki-memory-worker opera directo
Claude.ai → MEM_ENGINE=context-window (sin filesystem)
```

### 0.7 MCP + Knowledge (+ Ruflo v9.2)
```
MCPs: stitch, n8n, meta, ruflo → health check
  ruflo: ¿MCP "ruflo" registrado Y responde health_check?
    SÍ → RUFLO_AVAILABLE = true → activar delegación
    NO  → RUFLO_AVAILABLE = false → modo NEXUS-only
    Ver references/ruflo-bridge.md

PROJECT-knowledge.md → cargar si existe
```

### 0.8 Hooks + Session Tracker (v9.0)
```
SI hooks de NEXUS están instalados en settings.json:
  → Verificar session-tracker.log de la sesión anterior
  → SI hay "new_skill_detected" → marcar para auto-ingesta
  → SI hay "file_modified" → verificar hot.md freshness
  → Limpiar /tmp/nexus-session-tracker.log

SI hooks NO están instalados:
  → Sugerir (solo una vez): "/nexus hooks install para auto-trigger"

Ver references/hooks-engine.md para detalle de hooks disponibles.
```

### 0.9 Sequential Thinking + Context Detection (v9.1)
```
SEQUENTIAL THINKING:
  ¿MCP sequential-thinking está disponible?
  SÍ → ST_AVAILABLE = true (activar en triggers condicionales)
  NO  → ST_AVAILABLE = false (razonamiento nativo, sin degradación)
  Ver references/sequential-thinking-integration.md

CONTEXT DETECTION:
  Leer hot.md → detectar dominio activo
  SI el objetivo del usuario menciona un dominio DIFERENTE al activo:
    → Auto-switch: guardar snapshot actual → restaurar snapshot target
    → Reportar: "📍 Contexto cambiado a {dominio}"
  Ver references/context-switching.md

COMPLEXITY DETECTION:
  SI el usuario usa triggers de complejidad:
    ("esto es complejo", "analiza a fondo", "proyecto grande", --deep)
    → COMPLEXITY_MODE = true → ST activo para todo el pipeline
  SI NO:
    → COMPLEXITY_MODE = false → ST solo en triggers automáticos
```

---

## FASE 0.5 — Routing Adaptativo (v9.0)

### Paso 1: Tokenizar objetivo
```
"Hazme un API en NestJS con auth y analiza mi competencia"
→ [API, NestJS, auth, competencia]
```

### Paso 2: Match módulos (catalog-root.json, ~200 tok)
```
js-ts: 0.8 ← CARGAR    security: 0.4 ← CARGAR
seo-marketing: 0.3 ← CARGAR
(los otros 13 módulos → BODEGA, 0 tokens)
```

### Paso 3: Cargar módulos seleccionados (~200-500 tok c/u)
```
→ ~/.claude/catalog/js-ts.json
→ ~/.claude/catalog/security.json
→ ~/.claude/catalog/seo-marketing.json
```

### Paso 4: Match entries — scoring adaptativo (v9.0/v9.3)
```
entry_score = keyword_match
            × type_weight
            × base_bonus
            × reputation_modifier      ← v9.0: de skill-reputation
            × combo_boost              ← v9.0: afinidad entre skills
            × wiki_context_boost       ← v9.0: de wiki memory
            × learning_adjustment      ← v9.0: de learning-engine
            × satisfaction_modifier    ← v9.3: 👍/👎 explícito del user
            × winning_pattern_boost    ← v9.3: combo ganador del dominio

  type_weight: agent=1.2, skill=1.0
  base_bonus: +0.5 core, +0.3 memoria, +0.1×log(uses+1)

  reputation_modifier (references/skill-reputation.md):
    rep > 0.8 → ×1.2    rep 0.5-0.8 → ×1.0
    rep 0.3-0.5 → ×0.7  rep < 0.3 → ×0.4 + warning
    sin datos → ×1.0

  combo_boost:
    SI pipeline incluye skill X Y skill Y tiene affinity[X] > 0.7:
    → ×1.15 para Y

  wiki_context_boost:
    SI hot.md o wiki/{domain} menciona contexto relevante:
    → ×1.1 (decisiones previas aplican)

  learning_adjustment (via learning-worker query):
    SI learning-stats dice skill falla sin dependencia:
    → auto-insertar dependencia + warning
    SI combo actual es exitoso históricamente:
    → ×1.15

  satisfaction_modifier (v9.3, references/skill-reputation.md):
    Mantiene reputation_score combinado con feedback explícito:
    👍 promedio > 0.7 → ×1.2 (premium)
    👍 promedio 0.4-0.7 → ×1.0 (neutro)
    👍 promedio < 0.4 → ×0.5 (señal fuerte de descontento)
    sin feedback → ×1.0 (no penalizar skills nuevas)

  winning_pattern_boost (v9.3, references/winning-patterns.md):
    SI el objetivo del user matchea un winning pattern del dominio activo:
      matching = mismo dominio Y ≥40% keywords compartidos
                 (o vectorial vía Ruflo si RUFLO_AVAILABLE)
    → ×1.25 para las skills del combo ganador
    → reportar en Fase 1 Plan: "🎯 Pattern match: {objetivo previo}"
```

### Paso 5: Seleccionar + reglas especiales + ST desempate + goal check
```
Filtrar score > 0.3, ordenar DESC
Override: marketing→marketos-full, URL+analiza→analyze-replicate

TEMPLATE CHECK (v9.1):
  SI el combo de skills candidatos coincide con un template aprendido:
    → Usar el template aprendido directamente (skip routing manual)
    → Ver learning-engine.md → promoted templates

ST DESEMPATE (v9.1):
  SI >5 candidatos con scores ±0.15 del máximo Y ST_AVAILABLE:
    → Invocar sequential-thinking para desempatar
    → Pasar: candidatos + wiki context + learning stats
    → ST razona paso a paso y elige el subset óptimo

COMPLEXITY CHECK (v9.1):
  SI COMPLEXITY_MODE = true (usuario dijo "complejo" o usó --deep):
    → Activar ST para todo: routing + plan + ejecución + recovery

GOAL CHECK (v9.0):
  SI el objetivo es complejo (>3 skills, múltiples dominios):
    → Delegar a goal-planner-worker (usa ST si disponible)
    → No ejecutar pipeline directo
  SI hay goal activo en hot.md:
    → Verificar si el objetivo es parte del goal → /nexus goal continue
```

### Paso 6: Resolver dependencias → pipeline
```
Dependencias del contract-validator + dependencias descubiertas por learning-engine
→ pipeline ordenado con dependencias satisfechas
```

---

## FASE 1 — Plan (Adaptativo v9.0)

### 1.1 Pipeline simple (≤3 skills, 1 dominio)
```
📋 NEXUS PLAN v9.3
━━━━━━━━━━━━━━━━━━━━━━━
Objetivo: [resumen]
Módulos: [N de 16 consultados]
Skills/Agentes seleccionados:
  [lista con scores + reputation + ubicación en warehouse]
Pipeline: [template | dinámico | learned-template | winning-pattern]

📦 WAREHOUSE:
  Activar: [lista de skills a traer temporalmente]
  Tokens ahorrados: ~[N] (vs cargar todo)

🧠 Wiki Memory: [contexto previo relevante]
📊 Learning: [combos exitosos aplicados, deps auto-insertadas]
⭐ Reputation: [warnings si hay skills con rep < 0.5]
🎯 Pattern: [v9.3 — winning pattern aplicado si hay match]
   ej: "Combo arch→codex usado exitosamente para 'API ARHinfo' hace 3 días (👍)"
👍 Satisfaction: [v9.3 — boosts/penalties por feedback previo]
━━━━━━━━━━━━━━━━━━━━━━━
¿Procedo?
```

### 1.2 Goal complejo (>3 skills, múltiples dominios)
```
→ goal-planner-worker descompone el objetivo
→ Presenta plan multi-sesión con fases y dependencias
→ Ver references/goal-decomposition.md para formato completo
→ El usuario aprueba, modifica o rechaza
→ Si aprueba → ejecutar primera fase como pipeline normal
```

---

## FASE 2 — Activar + Ejecutar + Desactivar

```
ANTES de ejecutar el pipeline:
  → Para cada skill/agente seleccionado:
    warehouse-worker.activate_skill(name, module)
    = crea symlink: ~/.claude/skills/{name} → ~/.claude/warehouse/{module}/{name}

DURANTE el pipeline:
  Para cada entry, EN ORDEN:
    SI es SKILL:
      1. Leer SKILL.md desde el symlink
      2. Inyectar NEXUS_CONTEXT
      3. Ejecutar instrucciones
      4. Capturar outputs → NEXUS_CONTEXT

    SI es AGENTE:
      1. Leer SKILL.md + worker desde el symlink
      2. Delegar con NEXUS_CONTEXT + TAREA
      3. Agente ejecuta su flujo autónomo
      4. Capturar outputs → NEXUS_CONTEXT

    ⛔ HUMAN_ACTION_REQUIRED si necesario

DESPUÉS del pipeline:
  → warehouse-worker.deactivate_all()
  = remueve TODOS los symlinks
  = ~/.claude/skills/ vuelve a tener SOLO nexus/
  = próximo boot = ~400 tokens
```

---

## FASE 3 — Error recovery (+ ST condicional v9.1)

```
1. ¿Solución en wiki memory? → wiki-memory-worker query → inyectar
2. ¿Solución en memoria legacy? → nexus-memory.json → inyectar
3. ¿Skill alternativo del mismo módulo en warehouse?
   → activate_skill(alternativo) → reintentar
4. ¿Agent del mismo dominio? → escalar
   → SI ST_AVAILABLE Y nivel 4 alcanzado:
     → Invocar sequential-thinking para evaluar alternativas
     → ST razona: contexto + wiki + learning → mejor alternativa
5. ¿MCP fallback? → usar
6. BLOCKED → opciones al usuario
   → SI ST_AVAILABLE: incluir análisis de ST en las opciones
```

---

## FASE 4 — Paralelo

```
Skills independientes → Claude Code: paralelo, Claude.ai: serie
```

---

## FASE 5 — Post-pipeline + Cleanup + Learning (v9.3)

```
5.1  DEACTIVATE ALL   → remover symlinks de ~/.claude/skills/
5.2  WIKI STORE       → wiki-memory-worker capture (páginas wiki por dominio)
     5.2.1            → actualizar wiki/hot.md con resumen de sesión
     5.2.2            → append entrada a wiki/log.md
     5.2.3            → (fallback) si wiki no init → MEM STORE legacy JSON
5.3  CONTEXT SNAPSHOT → guardar .hot-snapshots/{dominio}.hot.md (v9.1)
5.4  LEARNING         → learning-worker capture (v9.0)
     5.4.1            → registrar skills usados + status + retries + skips
     5.4.2            → detectar dependencias implícitas
     5.4.3            → actualizar learning-stats.md
     5.4.4            → comprimir log si > 50 entries
     5.4.5            → SI combo exitoso ≥5 veces → sugerir promote (v9.1)
     5.4.6            → SI RUFLO_AVAILABLE → ruflo-worker learn (v9.2)
5.5  REPUTATION       → actualizar reputation en catalog/*.json (v9.0)
     5.5.1            → success_rate, avg_retries, user_skip_rate por skill
     5.5.2            → combo_affinity entre skills del pipeline
     5.5.3            → reputation_score recalculado
5.6  USER FEEDBACK    → capturar 👍/👎 explícito o por lenguaje natural (v9.3)
     5.6.1            → detectar comando: /nexus liked | /nexus disliked
     5.6.2            → detectar lenguaje natural en respuesta del user:
                        positivo: "me gustó", "perfecto", "excelente",
                                  "me encantó", "buenísimo", "👍"
                        negativo: "no me gustó", "no sirvió", "mal",
                                  "horrible", "no funcionó", "👎"
     5.6.3            → si hay feedback → append a satisfaction-log.md
     5.6.4            → modular reputation_score:
                        - combo recibe 70% del peso del feedback
                        - cada skill individual recibe 30%/N del peso
                        - 👍 → multiplicador ×1.2 al reputation_score
                        - 👎 → multiplicador ×0.5 al reputation_score
     5.6.5            → SI hay 👍 → trigger 5.7 (winning pattern capture)
     5.6.6            → SI no hay feedback → continuar (comportamiento neutral)
5.7  WINNING PATTERN  → capturar pattern ganador si hubo 👍 (v9.3)
     5.7.1            → solo si user dio 👍 explícito o detectado
     5.7.2            → extraer: objetivo original + combo + dominio + decisiones
     5.7.3            → guardar en wiki/{domain}/winning-patterns.md
     5.7.4            → si patrón similar ya existe → incrementar contador 👍
     5.7.5            → reportar: "🎯 Pattern guardado para {dominio}"
5.8  GOAL UPDATE      → si hay goal activo → actualizar progreso (v9.0)
5.9  ST POST-MORTEM   → si pipeline falló Y ST_AVAILABLE → análisis (v9.1)
5.10 RUFLO SYNC       → SI RUFLO_AVAILABLE Y cada N sesiones (v9.2)
     5.10.1           → ruflo-worker sync delta (wiki → AgentDB)
     5.10.2           → log en wiki/nexus-core/ruflo-delegation-log.md
5.11 KNOWLEDGE        → ofrecer actualizar PROJECT-knowledge.md
5.12 CATALOG ++       → times_used++, last_used en catálogo
5.13 WATCHDOG         → monitoreo si n8n
5.14 LOG              → nexus-log.md + wiki/log.md (dual log)
5.15 EXPORT           → descarga en Claude.ai
```

**CRÍTICO**: Fase 5.1 (deactivate_all) SIEMPRE se ejecuta, incluso si
el pipeline falló. Fases 5.2-5.5 (wiki + context + learning + reputation)
también se ejecutan siempre — capturan el error para que el routing
aprenda. Fase 5.6 (feedback) solo se ejecuta si el user da señal
explícita o detectable — nunca pregunta automático para no cansar.
Fase 5.7 (winning pattern) solo se ejecuta si 5.6 detectó 👍. Fase 5.10
(Ruflo sync) solo si RUFLO_AVAILABLE y han pasado N sesiones desde el
último sync (configurable, default: 5).

---

## Pipeline Templates

| Pipeline | Skills del warehouse | Trigger |
|---|---|---|
| design-first | market-scout, stitch, webdev, arch, codex | "diseña UI + construye" |
| analyze-replicate | webdev, stitch, arch, codex | URL + "analiza/copia" |
| full-stack-auto | arch, autoflow, codex, webdev | "n8n + app/backend" |
| marketos-full | marketos | "marketing/ads/growth" |
| marketing-to-build | marketos, stitch, webdev, arch, codex | "marketing + implementa" |
| memory-recall | (ninguno del warehouse) | "qué hicimos/recuerdas" |
| wiki-research | (ninguno del warehouse) | "investiga y archiva" / ingest URL |
| skill-scan | (ninguno) | "qué skills tengo" |
| dynamic | (lo que el routing seleccione) | cualquier objetivo |

---

## Comandos

| Comando | Acción |
|---|---|
| /nexus [objetivo] | Pipeline completo |
| /nexus dry-run | Simular sin ejecutar |
| /nexus status | Estado del pipeline |
| /nexus retry [entry] | Reintentar |
| /nexus skip [entry] | Omitir |
| /nexus log | Log |
| /nexus recall [query] | Buscar en wiki memory (Quick) |
| /nexus memory | Resumen memoria (hot.md) |
| /nexus memory flush | Exportar memoria |
| /nexus marketing [obj] | MarketOS directo |
| /nexus forget [id] | Eliminar observación |
| /nexus scan | Escanear → catálogo |
| /nexus scan --force | Re-escanear todo |
| /nexus scan --local | Solo proyecto local |
| /nexus modules | 16 módulos |
| /nexus module [id] | Entries de módulo |
| /nexus find [query] | Buscar en catálogo |
| /nexus skill [name] | Detalle skill |
| /nexus agent [name] | Detalle agente |
| /nexus ingest [ruta] | Ingestar skill al catálogo |
| /nexus ingest --batch | Ingestar directorio de skills |
| /nexus remove [name] | Remover |
| /nexus move [name] [mod] | Reclasificar |
| /nexus catalog stats | Estadísticas |
| /nexus catalog health | Integridad |
| **Bodega física:** | |
| /nexus warehouse init | **Inicializar bodega (mover 1700 skills)** |
| /nexus warehouse status | **Ver activos vs dormidos** |
| /nexus warehouse activate [n] | **Traer skill manualmente** |
| /nexus warehouse deactivate [n] | **Devolver skill** |
| /nexus warehouse cleanup | **Remover todos los symlinks** |
| /nexus warehouse restore | **Restaurar backup completo** |
| /nexus warehouse verify | **Verificar integridad** |
| **Wiki Memory (v8.0):** | |
| /nexus wiki init | **Inicializar vault wiki** |
| /nexus wiki ingest [URL] | **Ingerir URL al wiki (con defuddle)** |
| /nexus wiki ingest [ruta] | **Ingerir archivo local al wiki** |
| /nexus wiki ingest --batch [dir] | **Ingerir directorio completo** |
| /nexus wiki query [pregunta] | **Buscar en wiki (Standard)** |
| /nexus wiki query deep [pregunta] | **Buscar cross-domain (Deep)** |
| /nexus wiki lint | **Health check del vault** |
| /nexus wiki migrate | **Migrar nexus-memory.json → wiki** |
| /nexus wiki domains | **Listar dominios activos** |
| /nexus wiki domain add [id] [name] | **Crear dominio nuevo** |
| /nexus save | **Guardar sesión actual al wiki** |
| **Adaptive Intelligence (v9.0):** | |
| /nexus learn | **Ver estadísticas de aprendizaje** |
| /nexus learn combos | **Combos de skills más exitosos** |
| /nexus learn problems | **Skills problemáticas** |
| /nexus learn deps | **Dependencias descubiertas** |
| /nexus learn reset | **Resetear estadísticas** |
| /nexus reputation | **Top skills por reputación** |
| /nexus reputation [name] | **Reputación detallada de una skill** |
| /nexus goal [objetivo] | **Descomponer objetivo complejo en fases** |
| /nexus goal status | **Ver progreso del goal activo** |
| /nexus goal continue | **Ejecutar siguiente fase** |
| /nexus goal skip [fase] | **Saltar una fase** |
| /nexus goal abort | **Cancelar goal** |
| /nexus goals | **Listar todos los goals** |
| /nexus hooks install | **Instalar hooks en Claude Code** |
| /nexus hooks remove | **Remover hooks** |
| /nexus hooks status | **Ver estado de hooks** |
| **Sequential Thinking + Context (v9.1):** | |
| /nexus think [objetivo] | **Forzar ST para este pipeline** |
| /nexus [obj] --deep | **Pipeline con ST activo (modo complejo)** |
| /nexus switch [dominio] | **Cambiar contexto a otro proyecto** |
| /nexus contexts | **Listar contextos disponibles** |
| /nexus context | **Ver contexto activo** |
| /nexus learn promote [combo] | **Promover combo exitoso a template** |
| /nexus learn templates | **Ver templates aprendidos** |
| **Skill Health Audit (v9.1):** | |
| /nexus audit quick | **Auditoría rápida (duplicados + nunca usadas)** |
| /nexus audit standard | **Auditoría estándar (+ obsoletas)** |
| /nexus audit deep | **Auditoría profunda (todo + ST)** |
| /nexus audit fix duplicates | **Resolver duplicados** |
| /nexus audit archive obsoletes | **Archivar obsoletas** |
| /nexus audit gaps | **Mostrar gaps de cobertura** |
| **Ruflo Bridge (v9.2):** | |
| /nexus ruflo status | **Ver conexión con Ruflo MCP** |
| /nexus ruflo sync | **Sincronizar wiki → AgentDB** |
| /nexus ruflo tools | **Listar tools de Ruflo disponibles** |
| **Self-Refining (v9.3):** | |
| /nexus liked | **Marcar el último pipeline como 👍 (boost reputation)** |
| /nexus disliked | **Marcar el último pipeline como 👎 (penalty reputation)** |
| /nexus satisfaction | **Ver histórico de feedback (👍/👎 por skill y combo)** |
| /nexus patterns | **Ver winning patterns del dominio activo** |
| /nexus patterns all | **Ver winning patterns de todos los dominios** |
| /nexus patterns clear [id] | **Borrar un winning pattern (si quedó mal capturado)** |

---

## Primer uso: paso a paso

```
1. Instalar NEXUS en ~/.claude/skills/nexus/
   → Copiar este ZIP a ~/.claude/skills/nexus/

2. Primera sesión de Claude Code:
   → Claude carga 1700 skills (última vez que pasa esto)
   → Decir: "/nexus warehouse init"
   → NEXUS:
     a) Crea backup: ~/.claude/skills-backup-{fecha}/
     b) Escanea 1700 skills → genera catálogo
     c) Mueve cada skill a ~/.claude/warehouse/{módulo}/
     d) Solo deja nexus/ en skills/
     e) Reporta: "✅ Bodega inicializada. 1700 skills → warehouse/"

3. Segunda sesión (y todas las futuras):
   → Claude Code boot: ~400 tokens (solo nexus/)
   → /nexus objetivo → activa skills temporalmente
   → Al terminar → limpia symlinks → ~400 tokens otra vez
```

---

## Archivos del sistema

| Archivo | Ubicación | Carga |
|---|---|---|
| SKILL.md | ~/.claude/skills/nexus/ | Boot (~400 tok) |
| nexus.config.json | ~/.claude/skills/nexus/ | Boot |
| catalog-root.json | ~/.claude/catalog/ | Boot (~200 tok) |
| catalog/*.json | ~/.claude/catalog/ | Bajo demanda |
| references/*.md | ~/.claude/skills/nexus/ | Bajo demanda |
| agents/*.md | ~/.claude/skills/nexus/ | Bajo demanda |
| warehouse/**/* | ~/.claude/warehouse/ | Symlink temporal |
| **Wiki Memory (v8.0):** | | |
| wiki/hot.md | ~/.claude/nexus-wiki/ | **Boot auto (~500 tok)** |
| wiki/index.md | ~/.claude/nexus-wiki/ | Bajo demanda (query) |
| wiki/verticals.md | ~/.claude/nexus-wiki/ | Bajo demanda (ingest) |
| wiki/log.md | ~/.claude/nexus-wiki/ | Append post-pipeline |
| wiki/{domain}/_index.md | ~/.claude/nexus-wiki/ | Bajo demanda (query) |
| wiki/{domain}/*.md | ~/.claude/nexus-wiki/ | Bajo demanda (query deep) |
| .raw/.manifest.json | ~/.claude/nexus-wiki/ | Bajo demanda (ingest) |
| **Adaptive Intelligence (v9.0):** | | |
| wiki/nexus-core/learning-log.md | ~/.claude/nexus-wiki/ | Append post-pipeline |
| wiki/nexus-core/learning-stats.md | ~/.claude/nexus-wiki/ | Bajo demanda (routing) |
| wiki/nexus-core/learned-templates.md | ~/.claude/nexus-wiki/ | Bajo demanda (routing v9.1) |
| wiki/{domain}/goal-{id}.md | ~/.claude/nexus-wiki/ | Bajo demanda (goal) |
| catalog/*.json → reputation{} | ~/.claude/catalog/ | Bajo demanda (routing) |
| settings.json → hooks{} | ~/.claude/ | Boot (si hooks instalados) |
| **Sequential Thinking + Context (v9.1):** | | |
| wiki/.hot-snapshots/{domain}.hot.md | ~/.claude/nexus-wiki/ | Bajo demanda (switch) |
| **Ruflo Bridge (v9.2):** | | |
| wiki/nexus-core/ruflo-delegation-log.md | ~/.claude/nexus-wiki/ | Append (si Ruflo activo) |
| .claude-flow/ | ~/.claude/ | Ruflo config (Ruflo gestiona) |
| **Self-Refining (v9.3):** | | |
| wiki/nexus-core/satisfaction-log.md | ~/.claude/nexus-wiki/ | Append post-feedback |
| wiki/{domain}/winning-patterns.md | ~/.claude/nexus-wiki/ | Bajo demanda (routing + post-pipeline) |
| nexus-memory.json | ~/.claude/ | Legacy (migrar a wiki) |
