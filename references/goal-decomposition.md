# Goal Decomposition — Planificación de Objetivos Complejos

## Propósito
Descomponer objetivos grandes y ambiguos en sub-pipelines manejables
con dependencias explícitas, checkpoints, y la posibilidad de ejecutar
en paralelo cuando las dependencias lo permiten.

Inspirado en GOAP (Goal-Oriented Action Planning) pero sin A* real.
Usa las dependencias del contract-validator y el historial del
learning-engine para planificar.

## Cuándo se activa

```
Señales de objetivo complejo (goal-planner-worker toma control):
  - Objetivo con >3 verbos o dominios distintos
  - Objetivo que menciona "lanzar", "proyecto completo", "de principio a fin"
  - Objetivo que combina research + design + build + marketing
  - Objetivo que requeriría >6 skills del catálogo

Señales de objetivo simple (routing normal):
  - Un solo verbo: "diseña", "implementa", "analiza"
  - Un solo dominio: "ARHinfo", "SEO"
  - ≤3 skills necesarios
```

## Proceso de descomposición

### Paso 1 — Extraer sub-objetivos

```
Objetivo: "Quiero lanzar Nova con landing, pagos Stripe, 
           email marketing, SEO y monitoreo"

Extracción:
  SO1: Investigar mercado de suplementos
  SO2: Diseñar landing page
  SO3: Implementar backend con pagos Stripe
  SO4: Configurar email marketing
  SO5: Optimizar SEO
  SO6: Configurar monitoreo con n8n
```

### Paso 2 — Mapear sub-objetivos a sub-pipelines

```
SP1: Research    → market-scout → wiki ingest
SP2: Design      → stitch → webdev
SP3: Backend     → arch → codex → autoflow
SP4: Marketing   → marketos (fases 1-5)
SP5: SEO         → seo-audit → content
SP6: Monitoreo   → autoflow → watchdog
```

### Paso 3 — Resolver dependencias

Fuentes de dependencias:
  1. contract-validator (dependencias hardcodeadas entre workers)
  2. learning-engine (dependencias descubiertas por uso)
  3. Lógica implícita (design antes de build, research antes de design)

```
Grafo de dependencias:
  SP1 (Research)    → ninguna dependencia (puede ir primero)
  SP2 (Design)      → depende de SP1 (research alimenta diseño)
  SP3 (Backend)     → depende de SP2 (blueprint necesario)
  SP4 (Marketing)   → depende de SP1 (research de mercado)
  SP5 (SEO)         → depende de SP2 + SP3 (sitio construido)
  SP6 (Monitoreo)   → depende de SP3 (endpoints del backend)

Paralelo posible:
  SP2 y SP4 pueden correr en paralelo (ambos dependen solo de SP1)
```

### Paso 4 — Generar plan multi-sesión

```
🎯 NEXUS GOAL PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Meta-objetivo: Lanzar Nova
Sub-pipelines: 6
Sesiones estimadas: 3-4

📋 FASE 1 (sesión 1):
  SP1: Research → market-scout + wiki ingest
  Checkpoint: ✅ Mercado mapeado, competidores archivados

📋 FASE 2 (sesión 2, paralelo):
  SP2: Design → stitch + webdev     ← en paralelo
  SP4: Marketing → marketos         ← en paralelo
  Checkpoint: ✅ Blueprint listo, plan 90 días generado

📋 FASE 3 (sesión 3):
  SP3: Backend → arch + codex + autoflow
  Checkpoint: ✅ Backend funcional con Stripe

📋 FASE 4 (sesión 4, paralelo):
  SP5: SEO → seo-audit + content   ← en paralelo
  SP6: Monitoreo → autoflow + watchdog  ← en paralelo
  Checkpoint: ✅ Lanzamiento listo

📦 Skills del warehouse necesarias (total): 8
⏱️ Duración estimada: 3-4 sesiones de trabajo
🧠 Wiki memory: archivará progreso entre sesiones
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿Apruebas el plan? Puedo ajustar orden o remover fases.
```

### Paso 5 — Tracking de progreso entre sesiones

El progreso se guarda en:

```
wiki/{domain}/goal-{id}.md

---
title: Goal — Lanzar Nova
type: goal
status: in-progress
created: 2026-05-25
domain: nova
phases_total: 4
phases_completed: 2
---

# Lanzar Nova

## Progreso
- [x] Fase 1: Research (completada 2026-05-25)
- [x] Fase 2: Design + Marketing (completada 2026-05-26)
- [ ] Fase 3: Backend
- [ ] Fase 4: SEO + Monitoreo

## Decisiones tomadas
- [[nova/market-research-results]]
- [[nova/stripe-connect-decision]]

## Bloqueantes
- Stitch API key pendiente (SP2 se hizo sin Stitch, solo webdev)
```

Al inicio de la siguiente sesión, wiki/hot.md referencia el goal activo:
```
### Goal activo
[[nova/goal-launch-nova]] — Fase 3 pendiente (Backend)
```

## Integración con el pipeline estándar

El goal-planner NO reemplaza el pipeline normal de NEXUS.
Lo que hace es **generar** múltiples pipelines estándar en secuencia:

```
goal-planner-worker genera el plan
  → el usuario aprueba
  → NEXUS ejecuta SP1 como pipeline normal (Fases 0-5)
  → al terminar SP1, goal-planner actualiza goal-{id}.md
  → si hay paralelo, NEXUS ejecuta SP2 y SP4 como subagents
  → al terminar, actualiza progress
  → siguiente sesión: hot.md dice "Fase 3 pendiente"
  → /nexus continua → retoma desde SP3
```

## Comandos

| Comando | Acción |
|---|---|
| /nexus goal [objetivo] | Descomponer objetivo en sub-pipelines |
| /nexus goal status | Ver progreso del goal activo |
| /nexus goal continue | Ejecutar siguiente fase pendiente |
| /nexus goal skip [fase] | Saltar una fase |
| /nexus goal abort | Cancelar goal (preservar lo completado) |
| /nexus goals | Listar todos los goals (activos + completados) |
