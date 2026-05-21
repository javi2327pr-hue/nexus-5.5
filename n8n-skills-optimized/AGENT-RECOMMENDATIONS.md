# Agentes adicionales recomendados para hacer la suite más eficiente y precisa

Análisis: la suite actual (7+1 skills) cubre el ciclo `intent → pattern → discover → configure → code → expression → validate → ship`. Cinco gaps quedan abiertos donde agentes especializados subirían precisión y throughput sin inflar el contexto principal.

## Gap-análisis

| Gap actual | Síntoma observable | Costo si no se cubre |
|---|---|---|
| 1. No hay test-runner autónomo | Validación es estática; nada ejecuta el workflow contra fixtures | Workflows que validan pero rompen en runtime |
| 2. Credenciales se referencian pero no se gestionan | `n8n_manage_credentials` se menciona pero sin guía operativa de rotación/scoping | Leaks, OAuth re-auth manual |
| 3. Observability ciega | Tras `activateWorkflow`, no hay loop para detectar fallos en producción | Workflows muertos sin avisar |
| 4. Migration / versioning | No hay agente para migrar workflows entre instancias n8n o versiones | Re-build manual costoso |
| 5. Cost / rate-limit awareness | Workflows con HTTP loops sin presupuesto de calls | Quotas agotadas en prod |

## Agentes propuestos (5 nuevos)

### 1. `n8n-workflow-tester` — Runtime test harness ⭐⭐⭐ (mayor ROI)

**Rol**: ejecuta el workflow recién creado contra inputs sintéticos y compara outputs esperados. Cierra el gap entre "validation passes" y "runtime works".

**Trigger**: tras `n8n-validation-expert` retorna clean.

**Capacidades**:
- Generar fixtures de input por pattern (webhook payload mock, API response mock, DB row mock)
- Ejecutar el workflow vía `n8n_trigger_test_execution` (si existe en n8n-mcp) o llamada HTTP directa al webhook test URL
- Diff de output real vs expected
- Auto-rollback si test falla

**Precedente**: este es el equivalente n8n del agente `verify` que existe en la lista de skills disponibles (`verify`: "Verify that a code change actually does what it's supposed to by running the app").

**Impacto esperado**: +15% precisión end-to-end (atrapa el 80% de los runtime errors que validation no ve).

### 2. `n8n-credentials-architect` — Credential lifecycle ⭐⭐

**Rol**: gestiona credenciales con principio de menor privilegio, rotación, y scoping por workflow.

**Trigger**: cuando cualquier skill necesita referenciar una credential O cuando audit detecta hardcoded secrets.

**Capacidades**:
- Descubrir credential schemas vía `n8n_manage_credentials`
- Mapear scope mínimo por operation (e.g., Slack: `chat:write` no `*`)
- Detectar credentials huérfanas (no referenciadas por workflow)
- Rotación scheduled
- OAuth re-auth flows

**Impacto esperado**: Elimina el #1 hallazgo de `n8n_audit_instance` (hardcoded secrets + over-scoped creds) sin escalación al usuario.

### 3. `n8n-observability-monitor` — Post-ship watcher ⭐⭐⭐

**Rol**: tras activar un workflow, lo monitorea, detecta fallos en runs, intenta auto-fix, y solo escala al humano lo no resoluble.

**Trigger**: post-`activateWorkflow` automático.

**Capacidades**:
- Suscribirse a executions del workflow vía API
- Catálogo de auto-fixes por error type (re-auth, retry con backoff, swap a backup credential)
- Alert routing (Slack, email, webhook)
- KPI tracking: success rate, p99 latency, cost

**Precedente directo**: el agente `watchdog-autonomous` ya en este ecosistema NEXUS hace exactamente esto para workflows n8n. **Recomendación: invocarlo como sub-agente de la suite**, no recrear.

**Impacto esperado**: cierra el ciclo dev → ship → monitor → fix sin intervención.

### 4. `n8n-workflow-migrator` — Cross-instance / version mover ⭐

**Rol**: exporta workflow de instancia A, transforma para instancia B (diferentes credentials, diferentes node versions, diferentes webhooks URLs), valida, importa.

**Trigger**: usuario menciona "mover", "exportar", "importar", "duplicar workflow entre instancias".

**Capacidades**:
- Export vía `n8n_export_workflow`
- Diff de node versions entre instancias (catch breaking changes)
- Re-map credentials (mapping table input)
- Re-map webhook URLs (test → prod)
- Import vía `n8n_create_workflow` con validation

**Impacto esperado**: convierte una tarea de 30+ min manual en <2 min auto.

### 5. `n8n-cost-guardrails` — Budget & rate-limit advisor ⭐

**Rol**: pre-build analiza el workflow propuesto contra presupuestos (LLM tokens, HTTP calls/min, DB writes) y propone batching/caching/circuit breakers.

**Trigger**: `n8n-workflow-patterns` selecciona un pattern con loops o LLM o external API.

**Capacidades**:
- Estimar coste mensual del workflow (calls × frecuencia × precio)
- Detectar loops sin rate-limit awareness
- Proponer SplitInBatches con `batchSize` derivado del rate limit del API target
- Sugerir cache layer (Redis, n8n data table) cuando aplica

**Impacto esperado**: previene el "$3K AWS bill in 1 day" para workflows con HTTP en loop sin guardrails.

## Mapping a agentes ya disponibles en este entorno

De la lista de subagent_types disponibles, varios encajan parcialmente:

| Necesidad | Agente disponible | Reutilizable? |
|---|---|---|
| Runtime testing | `autoflow-worker` | ⚠️ Parcial — orientado a deploy n8n, pero podría extenderse |
| Observability post-deploy | `watchdog-autonomous` | ✅ **Sí, directo** — ya monitorea workflows n8n |
| Validation interpretation | `audit-runner` | ⚠️ Parcial — audita skills, no workflows |
| Multi-agent orchestration | `nexus` (skill) o `arch-worker` | ✅ Para orquestar la suite completa |

### Recomendación de integración

1. **Inmediato (sin nuevos agentes)**:
   - Conectar `n8n-observability-monitor` → `watchdog-autonomous` (ya existe)
   - Usar `nexus` para orquestar suite cuando la pregunta es ambigua

2. **Corto plazo (alto ROI)**:
   - Construir `n8n-workflow-tester` (gap más grande, cierra el loop de validation)
   - Construir `n8n-cost-guardrails` (previene incidentes caros)

3. **Mediano plazo**:
   - `n8n-credentials-architect` (depende de uso de `n8n_audit_instance`)
   - `n8n-workflow-migrator` (depende de cuántas instancias se gestionan)

## Arquitectura propuesta — suite completa

```
                    ┌─────────────────────────┐
                    │   n8n-suite-router      │  ← entry point
                    └────────────┬────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐      ┌─────────────────┐      ┌───────────────┐
│  workflow-    │      │   mcp-tools-    │      │  validation-  │
│   patterns    │─────▶│     expert      │─────▶│    expert     │
└───────┬───────┘      └────────┬────────┘      └───────┬───────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐      ┌─────────────────┐      ┌───────────────┐
│ cost-         │      │     node-       │      │  workflow-    │
│ guardrails ★  │      │  configuration  │      │   tester ★    │
└───────────────┘      └────────┬────────┘      └───────┬───────┘
                                │                       │
                       ┌────────┴────────┐              │
                       ▼                 ▼              ▼
                ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                │  code-       │  │  expression- │  │ observability│
                │  javascript  │  │    syntax    │  │  -monitor ★  │
                └──────────────┘  └──────────────┘  │ (=watchdog)  │
                                                    └──────────────┘
                                                            │
                                                            ▼
                                              ┌──────────────────────┐
                                              │ credentials-architect│ ★
                                              └──────────────────────┘
                                                            │
                                                            ▼
                                              ┌──────────────────────┐
                                              │  workflow-migrator   │ ★
                                              └──────────────────────┘

  ★ = nuevo, propuesto
```

## Métricas de éxito (cómo medir si los agentes nuevos valen la pena)

| Agente | KPI | Target |
|---|---|---|
| workflow-tester | runtime-error catch rate post-validation | >80% |
| credentials-architect | hardcoded secrets eliminados | 100% |
| observability-monitor | MTTR fallos en prod | <5 min |
| workflow-migrator | tiempo dev↔prod migration | <2 min |
| cost-guardrails | incidentes de quota burst | 0 |
