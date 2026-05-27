# Learning Engine — Auto-aprendizaje por Observación de Pipelines

## Propósito
Capturar el resultado real de cada pipeline ejecutado — qué skills
funcionaron, cuáles fallaron, en qué combinaciones, y con qué frecuencia
el usuario necesitó retry o skip — para que el routing mejore
automáticamente con el uso.

No es machine learning ni pesos neuronales. Es estadística simple
sobre datos reales de tu uso de NEXUS, almacenada en el wiki y
consultada en el routing para tomar mejores decisiones.

## Qué se captura (post-pipeline)

```
Por cada pipeline completado, learning-worker registra:

{
  "pipeline_id": "2026-05-25-001",
  "timestamp": "2026-05-25T14:30:00Z",
  "objective": "módulo de pagos ARHinfo",
  "template": "full-stack-auto",
  "domain": "arhinfo",
  "skills_used": [
    {
      "name": "arch",
      "module": "custom",
      "status": "DONE",
      "retries": 0,
      "skipped": false,
      "position_in_pipeline": 1
    },
    {
      "name": "codex",
      "module": "custom",
      "status": "DONE",
      "retries": 1,
      "skipped": false,
      "position_in_pipeline": 2,
      "retry_reason": "faltaba contratos_api de arch"
    }
  ],
  "pipeline_status": "DONE",
  "user_satisfaction": "liked",
  "user_satisfaction_source": "natural_language",
  "duration_estimate": "medium",
  "combo_hash": "arch+codex"
}
```

### user_satisfaction (v9.3)

Desde v9.3 este campo se popula activamente desde Fase 5.6:

```
Valores posibles:
  "liked"     → user dio 👍 explícito o por lenguaje natural
  "disliked"  → user dio 👎 explícito o por lenguaje natural
  null        → sin feedback (comportamiento neutral, no penaliza)

Fuente del feedback (user_satisfaction_source):
  "command"          → /nexus liked  o  /nexus disliked
  "natural_language" → detectado en respuesta del user
                       (positivo: "me gustó", "perfecto", "excelente"...
                        negativo: "no me gustó", "no sirvió", "mal"...)
  "auto_inferred"    → reservado para futuras versiones (no usar en v9.3)
```

## Qué NO se captura

- Contenido de los outputs (eso va al wiki memory)
- API keys, tokens, PII
- Conversación literal del usuario
- ~~Opiniones subjetivas~~ → v9.3 sí captura feedback binario explícito
  (👍/👎), pero NO razones ni textos libres. Solo el flag.

## Dónde se almacena

```
wiki/nexus-core/learning-log.md (append-only, formato tabla)

| Fecha | Pipeline | Skills | Status | Retries | Skips | Combo |
|---|---|---|---|---|---|---|
| 2026-05-25 | full-stack-auto | arch→codex | DONE | 1 | 0 | arch+codex |
| 2026-05-24 | marketos-full | marketos | DONE | 0 | 0 | marketos |
| 2026-05-23 | dynamic | market-scout→webdev | PARTIAL | 0 | 1 | ms+wd |
```

Además, estadísticas agregadas en:
```
wiki/nexus-core/learning-stats.md

## Combos más exitosos (últimos 30 días)
| Combo | Veces usado | Success rate | Avg retries |
|---|---|---|---|
| arch+codex | 12 | 83% | 0.4 |
| market-scout+webdev | 8 | 75% | 0.1 |
| marketos | 6 | 100% | 0 |

## Skills problemáticas
| Skill | Failure rate | Causa común |
|---|---|---|
| stitch | 40% | MCP no disponible |
| autoflow | 25% | n8n sin API key |

## Dependencias descubiertas
| Si usas... | Necesitas antes... | Razón |
|---|---|---|
| codex | arch | contratos_api requeridos |
| webdev | stitch (opcional) | design_tokens mejoran output |
```

## Cómo el routing usa el learning

En Fase 0.5 (routing modular), después de calcular entry_score:

```
learning_adjustment(skill_name):
  1. Leer wiki/nexus-core/learning-stats.md
  2. Buscar skill_name en estadísticas

  SI success_rate > 0.8 → bonus +0.2
  SI success_rate < 0.4 → penalty -0.3 + warning al usuario
  SI failure_rate > 0.5 → flag: "⚠️ {skill} falla frecuentemente"

  SI el combo actual coincide con un combo exitoso → bonus +0.15
  SI el combo actual coincide con un combo fallido → warning

  SI hay dependencia descubierta no satisfecha:
    → auto-insertar la dependencia en el pipeline
    → ej: codex seleccionado sin arch → insertar arch antes
```

## Ciclo de aprendizaje

```
Sesión 1: NEXUS ejecuta pipeline → learning-worker captura resultado
Sesión 2: NEXUS ejecuta otro → captura → learning-stats se actualiza
Sesión 5: learning-stats tiene suficientes datos para ajustar routing
Sesión 10: el routing ya selecciona mejor sin intervención manual
Sesión 30: dependencias descubiertas estabilizan los pipelines
```

## Compresión periódica

Cada 50 entries en learning-log.md:
  → learning-worker comprime las más antiguas
  → preserva solo las estadísticas agregadas
  → mantiene las últimas 30 entries en detalle
  → el log no crece indefinidamente

## Template Promotion (v9.1)

Cuando un combo de skills se usa exitosamente ≥5 veces con el mismo
dominio, el learning-worker sugiere promoverlo a pipeline template:

```
Detección automática (Fase 5.4.5):
  SI combo "market-scout+marketos+webdev" tiene:
    - ≥5 usos exitosos
    - success_rate > 0.75
    - siempre en el mismo dominio (nova)
  → Sugerir: "💡 El combo market-scout→marketos→webdev tiene 85% de
     éxito para Nova. ¿Promoverlo a template 'nova-launch'?"

Promoción manual:
  /nexus learn promote nova-launch
  → Crea entrada en wiki/nexus-core/learned-templates.md
  → El routing reconoce el template en futuras sesiones

Formato de template aprendido:
  | Template | Skills | Dominio | Success | Usos |
  |---|---|---|---|---|
  | nova-launch | market-scout→marketos→webdev | nova | 85% | 7 |
  | arhinfo-api | arch→codex→autoflow | arhinfo | 90% | 12 |

Uso en routing (Fase 0.5 Paso 5):
  SI el combo candidato coincide con un learned template:
    → Usar el template directamente (skip scoring manual)
    → El orden de skills ya está validado por uso real
```

## Comandos

| Comando | Acción |
|---|---|
| /nexus learn | Ver estadísticas de aprendizaje |
| /nexus learn combos | Combos más exitosos |
| /nexus learn problems | Skills problemáticas |
| /nexus learn deps | Dependencias descubiertas |
| /nexus learn reset | Resetear estadísticas (con confirmación) |
| /nexus learn promote [nombre] | Promover combo exitoso a template |
| /nexus learn templates | Ver templates aprendidos |
