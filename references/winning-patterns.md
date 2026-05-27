# Winning Patterns — Memoria de Patrones Ganadores por Dominio

## Propósito (v9.3)

Capturar y reutilizar las combinaciones de skills + contexto que el
usuario marcó como 👍 explícitamente, para que cuando llegue un
objetivo similar en el mismo dominio, NEXUS aplique automáticamente
el patrón ganador en vez de partir del cero estadístico.

Es complementario a `learning-engine` (que captura señal objetiva)
y a `skill-reputation` (que es agregado por skill). **Winning patterns
es agregado por objetivo + dominio**, lo que captura un nivel diferente
de aprendizaje: no solo *qué skills funcionan bien*, sino *qué combos
funcionan para qué tipo de problemas*.

## Dónde se almacena

```
wiki/{domain}/winning-patterns.md
```

Una página por dominio. NEXUS NO crea una página global — el matching
siempre es por dominio activo, lo que evita aplicar patrones de
`arhinfo` a problemas de `nova` (decisión D5).

## Formato de página

```markdown
---
title: Winning Patterns — {domain}
domain: {domain}
type: winning-patterns
last_updated: 2026-05-25
---

# Winning Patterns — {domain}

## Pattern P-2026-05-25-001

**Objetivo original:** "API REST para módulo de pagos ARHinfo con Stripe Connect"

**Combo ganador:** `arch → codex → autoflow`

**Contexto del pipeline:**
- Template usado: full-stack-auto
- Duración: media
- Retries totales: 1 (codex pidió contratos a arch)
- Skips: 0

**Decisiones clave tomadas:**
- Stripe Connect Standard (no Direct, no MercadoPago)
- Webhook endpoint antes de auth guard
- Redis cache de sesiones (TTL 30min)

**Parámetros del pipeline:**
- COMPLEXITY_MODE: false
- ST usado: no
- Ruflo usado: no

**Keywords del objetivo:** api, rest, pagos, stripe, connect, módulo, arhinfo

**Stats:**
- Veces matcheado: 1
- 👍 acumulados: 1
- 👎 acumulados: 0
- Última aplicación exitosa: 2026-05-25
- Confidence: low (necesita ≥3 aplicaciones para subir)

---

## Pattern P-2026-05-20-007

[siguiente patrón...]
```

## Captura — cuándo se crea un pattern

Solo en Fase 5.7 (post-pipeline), bajo TODAS estas condiciones:

```
1. El user dio 👍 explícito o por lenguaje natural en Fase 5.6
2. El pipeline terminó con STATUS=DONE (al menos PARTIAL)
3. Existe un dominio detectado (no se capturan en "general/")

SI existe ya un pattern con ≥40% keywords compartidos en el mismo dominio:
  → NO crear nuevo
  → Incrementar contador 👍 del existente
  → Actualizar last_updated
  → Subir confidence si corresponde

SI NO existe pattern similar:
  → Crear nuevo P-{fecha}-{nnn} en wiki/{domain}/winning-patterns.md
```

## Qué se captura y qué NO

```
CAPTURA:
  - Objetivo original del user (texto literal del prompt)
  - Combo de skills (combo_hash)
  - Template del pipeline
  - Decisiones tomadas (extraídas del NEXUS_CONTEXT, tipo [D] del wiki-memory)
  - Parámetros booleanos (COMPLEXITY_MODE, ST_USED, RUFLO_USED)
  - Keywords tokenizados del objetivo
  - Métricas: retries, skips, duración

NO CAPTURA:
  - Outputs literales (código generado, copy, etc.)
    → eso ya vive en wiki/log.md y en archivos del proyecto
  - PII, tokens, API keys, passwords
  - Conversación literal más allá del prompt original
  - Razones subjetivas del 👍 (no se le pregunta al user)
```

Decisión D4 — "Mínimo + contexto, sin outputs literales (privacidad)".

## Matching — cuándo aplica un pattern (Fase 0.5)

```
INPUT: objetivo del user + dominio activo

PROCESO:
  1. Cargar wiki/{dominio_activo}/winning-patterns.md
     SI no existe → skip (no hay patrones para este dominio)

  2. Tokenizar el objetivo nuevo en keywords
     (mismo tokenizer que catalog matching)

  3. Para cada pattern del dominio:
     keyword_overlap = (keywords_pattern ∩ keywords_objetivo) / keywords_objetivo

     SI keyword_overlap ≥ 0.4:
       → es candidato a match

  4. SI RUFLO_AVAILABLE:
     → enviar objetivo + candidatos a ruflo-worker vector_search
     → ruflo devuelve top-1 con similarity score (HNSW)
     → si similarity > 0.65 → ese es el match definitivo
     SI NO:
     → usar el candidato con mayor keyword_overlap

  5. Aplicar winning_pattern_boost ×1.25 a las skills del combo ganador
     en el scoring de Fase 0.5

  6. Reportar en Fase 1 (Plan):
     "🎯 Pattern match: usaste {combo} exitosamente para
      '{objetivo previo}' hace {N} días (👍 ×{liked_count})"

OUTPUT:
  - Skills boosted en el routing
  - User ve transparencia del match (D6 — "Aplicar + reportar en Plan")
```

## Confidence — cuándo confiar en un pattern

```
liked_count = 1  → confidence: low      (puede ser casualidad)
liked_count = 2-3 → confidence: medium  (señal débil pero consistente)
liked_count ≥ 4  → confidence: high     (validado por uso real)

Si disliked_count > liked_count:
  → confidence: degraded
  → El pattern deja de aplicarse en routing
  → Se mantiene en el archivo (auditable), pero ignorado

Si confidence = degraded por ≥30 días:
  → Sugerir al user borrarlo con /nexus patterns clear {id}
```

## Comandos relacionados

| Comando | Acción |
|---|---|
| /nexus patterns | Listar winning patterns del dominio activo |
| /nexus patterns all | Listar de todos los dominios |
| /nexus patterns show [id] | Ver detalle de un pattern específico |
| /nexus patterns clear [id] | Borrar un pattern (si quedó mal capturado) |

## Ejemplo de ciclo completo

```
SESIÓN 1 (lunes):
  User: "API REST para pagos ARHinfo con Stripe"
  NEXUS: ejecuta combo arch → codex → autoflow
  Pipeline: STATUS=DONE
  User: "perfecto, me gustó cómo quedó"
  NEXUS: detecta 👍 por lenguaje natural (Fase 5.6)
         crea pattern P-001 en wiki/arhinfo/winning-patterns.md (Fase 5.7)
         confidence: low

SESIÓN 5 (jueves):
  User: "necesito un módulo de checkout para ARHinfo con MercadoPago"
  NEXUS Fase 0.5: dominio=arhinfo
                  keywords overlap con P-001 = 50% (api, módulo, pagos)
                  → MATCH
                  → boost ×1.25 a arch, codex, autoflow
  NEXUS Fase 1: muestra "🎯 Pattern match: usaste arch→codex→autoflow
                  exitosamente para 'API REST pagos ARHinfo Stripe' hace
                  3 días (👍 ×1)"
  User: aprueba
  Pipeline ejecuta combo similar adaptado a MercadoPago
  STATUS=DONE
  User: "/nexus liked"
  NEXUS: incrementa P-001.liked_count a 2 (mismo pattern, no crea nuevo)
         confidence: low → medium

SESIÓN 12:
  P-001.liked_count = 4
  confidence: medium → high
  → routing ahora aplica el pattern con muy alta prioridad
```

## Integración con learned-templates (v9.1)

Los winning patterns y los learned-templates son distintos pero
complementarios:

| Aspecto | learned-templates (v9.1) | winning-patterns (v9.3) |
|---|---|---|
| Disparador | combo exitoso ≥5 veces | 👍 explícito del user |
| Granularidad | solo combo | combo + objetivo + decisiones |
| Scope | global o por dominio | siempre por dominio |
| Aplicación | skip routing manual | boost en routing |
| Captura outputs | no | no |

Si un winning pattern alcanza `liked_count ≥ 5` Y coincide con un
learned-template, NEXUS sugiere consolidarlos:
```
💡 El pattern P-001 (arch→codex→autoflow para arhinfo) coincide con el
   template aprendido 'arhinfo-api'. ¿Promover el pattern a template
   con boost permanente? (/nexus learn promote arhinfo-api)
```

## Anti-drift

Tres salvaguardas contra que el sistema se degrade por feedback ruidoso:

```
1. Threshold de matching (40% keyword overlap):
   → patrones muy distintos al objetivo nuevo no se aplican

2. Confidence levels (low/medium/high):
   → un solo 👍 no domina el routing — necesita repetición

3. Degraded state:
   → si disliked > liked → pattern se desactiva automáticamente
   → no se borra (auditable), pero deja de influir
```
