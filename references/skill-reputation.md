# Skill Reputation — Scoring Adaptativo de Skills

## Propósito
Dar a cada skill en el catálogo una puntuación de reputación basada en
su historial real de uso — no solo cuántas veces se usó (times_used)
sino qué tan bien funcionó, con qué frecuencia necesitó reintentos,
y con qué otros skills trabaja mejor.

## Campos de reputación (añadidos al catálogo)

Cada entry en `catalog/{módulo}.json` obtiene un bloque `reputation`:

```json
{
  "name": "arch",
  "type": "agent",
  "reputation": {
    "total_invocations": 24,
    "success_count": 20,
    "failure_count": 2,
    "partial_count": 2,
    "success_rate": 0.83,
    "avg_retries": 0.3,
    "user_skip_rate": 0.04,
    "last_failure_reason": "stack no definido, PROJECT-knowledge ausente",
    "last_failure_date": "2026-05-20",
    "combo_affinity": {
      "codex": 0.9,
      "autoflow": 0.7,
      "webdev": 0.6
    },
    "best_domain": "arhinfo",
    "reputation_score": 0.82,
    "confidence": "high",
    "liked_count": 8,
    "disliked_count": 1,
    "satisfaction_rate": 0.89,
    "satisfaction_confidence": "medium"
  }
}
```

Los 4 últimos campos son **v9.3**:
- `liked_count` — cuántas veces el user marcó 👍 en pipelines que incluyeron esta skill
- `disliked_count` — cuántas veces el user marcó 👎
- `satisfaction_rate` = `liked / (liked + disliked)` cuando hay ≥3 votos
- `satisfaction_confidence` — `none` (<3 votos), `low` (3-5), `medium` (6-10), `high` (>10)

## Cómo se calcula reputation_score

```
reputation_score = success_rate × (1 - user_skip_rate) × confidence_factor

Donde:
  success_rate   = success_count / total_invocations
  user_skip_rate = veces_skipped / total_invocations
  confidence_factor:
    total_invocations < 3  → 0.5 (baja confianza, datos insuficientes)
    total_invocations 3-10 → 0.8 (confianza media)
    total_invocations > 10 → 1.0 (alta confianza)
```

## Cómo afecta al routing

En Fase 0.5, el score de cada skill candidato se ajusta:

```
ANTES (v8.0):
  entry_score = keyword_match × type_weight × bonus

v9.0:
  entry_score = keyword_match
              × type_weight
              × bonus
              × reputation_modifier
              × combo_boost
              × wiki_context_boost

AHORA (v9.3):
  entry_score = keyword_match
              × type_weight
              × bonus
              × reputation_modifier
              × combo_boost
              × wiki_context_boost
              × satisfaction_modifier      ← v9.3
              × winning_pattern_boost      ← v9.3 (ver winning-patterns.md)

  reputation_modifier:
    reputation_score > 0.8 → 1.2 (boost)
    reputation_score 0.5-0.8 → 1.0 (neutral)
    reputation_score 0.3-0.5 → 0.7 (penalty)
    reputation_score < 0.3 → 0.4 (strong penalty + warning)
    sin datos (< 3 usos) → 1.0 (neutral, no penalizar skills nuevas)

  combo_boost:
    SI el pipeline actual incluye skill X,
    Y skill Y tiene combo_affinity[X] > 0.7:
    → boost +0.15 para Y (trabajan bien juntos)

  wiki_context_boost:
    SI wiki/hot.md menciona el dominio del skill:
    → boost +0.1 (contexto reciente relevante)

  satisfaction_modifier (v9.3):
    Se aplica solo si satisfaction_confidence ≥ "low" (≥3 votos):
      satisfaction_rate > 0.7 → 1.2 (premium — user está contento)
      satisfaction_rate 0.4-0.7 → 1.0 (neutral)
      satisfaction_rate < 0.4 → 0.5 (señal fuerte de descontento)
      sin datos → 1.0 (no penalizar)
```

## Cómo se distribuye el feedback (v9.3)

Cuando el user da 👍 o 👎, el peso se reparte según D3 (combo 70% / skills 30%):

```
Pipeline con N skills: [s1, s2, s3]
Feedback: 👍

  Combo (combo_hash = "s1+s2+s3"):
    → recibe 70% del boost
    → combo_affinity entre cada par sube +0.07 (en vez de +0.1 del éxito objetivo)

  Cada skill individual:
    → recibe 30%/N del boost
    → en pipeline de 3 skills: cada una recibe +0.1 al liked_count

  Si N=1 (pipeline de una sola skill):
    → toda la satisfacción cae sobre esa skill (100%)
    → no hay combo que recompensar

Feedback negativo (👎):
  → mismo reparto, pero con penalty:
    combo_affinity baja -0.07 por par
    cada skill recibe +0.1 al disliked_count
```

**Importante**: el feedback **no anula** la señal objetiva. Si un pipeline
terminó con `STATUS=DONE` y el user da 👎, ambas señales coexisten:
- success_count++ (señal objetiva: corrió bien)
- disliked_count++ (señal subjetiva: output mediocre)
- reputation_score se ajusta por las dos vías

Esto distingue "el pipeline ejecutó sin errores" de "el resultado fue
de calidad", que era el gap explícito de la decisión D2.

## Combo affinity — cómo se calcula

```
Cada vez que dos skills se usan en el mismo pipeline:
  SI ambos terminaron con STATUS=DONE:
    affinity[A][B] += 0.1 (máx 1.0)
  SI uno falló y el otro no:
    affinity[A][B] -= 0.05 (mín 0.0)

Normalizar cada 30 días para evitar inflación.
```

## Actualización de reputación

El learning-worker actualiza reputation después de cada pipeline:

```
Para cada skill usado en el pipeline:
  1. total_invocations++
  2. SI STATUS=DONE → success_count++
     SI STATUS=BLOCKED → failure_count++
     SI STATUS=PARTIAL → partial_count++
  3. SI usuario hizo /nexus skip → user_skip_count++
  4. Recalcular success_rate, avg_retries, user_skip_rate
  5. Recalcular reputation_score
  6. Actualizar combo_affinity con los otros skills del pipeline
  7. v9.3: Si user dio 👍/👎 en Fase 5.6:
     SI 👍 → aplicar +30%/N al liked_count de esta skill (D3)
            → combo_affinity con otras skills del pipeline +0.07 (70% del peso)
     SI 👎 → aplicar +30%/N al disliked_count de esta skill
            → combo_affinity con otras skills del pipeline -0.07
     Recalcular satisfaction_rate y satisfaction_confidence
  8. Guardar en catalog/{módulo}.json
```

## Warnings al usuario

Cuando el routing selecciona una skill con reputación baja:

```
SI reputation_score < 0.3 Y confidence = "high":
  ⚠️ NEXUS: {skill_name} tiene success rate de {X}%.
  Causa frecuente de fallo: {last_failure_reason}
  ¿Quieres incluirla en el pipeline o buscar alternativa?

SI reputation_score < 0.5 Y hay alternativa en el mismo módulo
   con reputation_score > 0.7:
  💡 NEXUS sugiere: usar {alternativa} en vez de {skill_name}
  ({alternativa}: {X}% success vs {skill_name}: {Y}% success)
```

## Inicialización

Al instalar v9.0, todas las skills empiezan con:
```json
"reputation": {
  "total_invocations": 0,
  "success_rate": null,
  "reputation_score": null,
  "confidence": "none"
}
```

No hay penalty ni bonus hasta que se acumulen ≥3 invocaciones.
Las skills existentes con times_used > 0 en v8.0 se migran:
  → times_used → total_invocations (asumiendo success, sin datos de fallo)
  → confidence = "low" (datos parciales)

## Visualización

```
/nexus reputation
  → tabla de top 10 skills por reputation_score
  → tabla de bottom 5 skills problemáticas
  → combos más exitosos

/nexus reputation [skill_name]
  → detalle completo de reputación de una skill
```
