# Parallel Skills — Mecanismo P4 (Skill Workers)

Carga esta referencia cuando el plan tenga múltiples skills nativas
(MarketScout, ARCH, WEBDEV, AutoFlow) que puedan ejecutarse en paralelo
porque sus outputs no dependen entre sí.

---

## P4 — Skill Workers nativos

En lugar de ejecutar skills en secuencia, P4 las lanza como "workers"
simultáneos usando agentes wrapper dedicados.

### Cuándo aplica P4

```
Paso 1 → MarketScout (investigación)
Paso 2 → ARCH        (arquitectura)     ← estos 2 no dependen del otro
Paso 3 → WEBDEV      (blueprint)        ← este tampoco

→ P4: ejecutar Paso 1, 2 y 3 en paralelo
```

Requisito: los skills deben tener archivos worker en `$AGENTS_PATH`:
```bash
find $AGENTS_PATH -name "*-worker.md" 2>/dev/null
# Ejemplo: market-scout-worker.md, arch-worker.md, webdev-worker.md
```

---

## Estructura de un skill worker

Cada worker es un agente wrapper que recibe la tarea y el contexto NEXUS:

```markdown
---
name: market-scout-worker
description: Worker paralelo para MarketScout. Recibe subtarea de NEXUS
             y ejecuta el skill de forma autónoma.
---

# MarketScout Worker

Eres un worker autónomo de MarketScout.

Recibe: { subtarea, nexus_context }
Ejecuta: el skill MarketScout completo para esa subtarea
Retorna: { output, artefactos, timestamp }

Lee el skill completo en: references/market-scout.md
```

---

## Invocación P4 desde NEXUS

```
[NEXUS v4.0 → Workers P4]
Lanzando 3 workers en paralelo:

  Worker 1 — @market-scout-worker
  Subtarea: "Top 10 plataformas de meditación en Noruega"
  Contexto: { objetivo_global, variables_globales }

  Worker 2 — @arch-worker
  Subtarea: "Definir stack para app de meditación multilingual"
  Contexto: { objetivo_global, variables_globales }

  Worker 3 — @autoflow-worker
  Subtarea: "Diseñar workflow de onboarding post-registro"
  Contexto: { objetivo_global, variables_globales }

Esperar outputs de los 3 antes de continuar al siguiente paso.
```

---

## Agregación de resultados

Cuando todos los workers terminan, NEXUS agrega sus outputs al
NEXUS_CONTEXT antes de continuar:

```
NEXUS_CONTEXT.outputs_anteriores.push(
  { paso: "P4-1", agente: "MarketScout", resumen: "...", artefactos: [...] },
  { paso: "P4-2", agente: "ARCH",        resumen: "...", artefactos: [...] },
  { paso: "P4-3", agente: "AutoFlow",    resumen: "...", artefactos: [...] }
)
```

---

## Si un worker falla

```
⚠️  Worker [ARCH] falló — Workers [MarketScout] y [AutoFlow] completados.

¿Qué hacemos?
  🔄 Relanzar ARCH-worker con más contexto
  ⏩ Continuar sin el output de ARCH (marcar como pendiente)
  ⏸️ Pausar — guardar checkpoint con outputs parciales
```

---

## Workers disponibles por defecto en NEXUS v4.0

| Worker | Skill que envuelve |
|---|---|
| `market-scout-worker.md` | MarketScout |
| `arch-worker.md` | ARCH |
| `webdev-worker.md` | WEBDEV |
| `autoflow-worker.md` | AutoFlow |
| `codex-worker.md` | Codex Bridge |

Si el archivo worker no existe en `$AGENTS_PATH`, el skill se ejecuta
en secuencia normal en lugar de en paralelo.
