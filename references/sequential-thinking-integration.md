# Sequential Thinking Integration — Razonamiento Estructurado Condicional

## Qué es Sequential Thinking

Sequential Thinking MCP es un servidor que da a Claude una "libreta
externa" para razonar paso a paso con revisiones y ramificaciones.
En vez de pensar en una sola pasada, Claude puede:
- Crear pasos numerados de razonamiento
- Revisar y corregir pasos anteriores
- Ramificar cuando hay múltiples caminos

## Por qué NO se activa globalmente

Multiplicador de tokens: ~3.8x-5.3x por invocación.
En una sesión de 50K tokens, activar ST en todo convertiría el
costo de ~$0.93/mes a ~$3.50-5.00/mes. La mayoría de tareas de
NEXUS (routing simple, queries, comandos admin) no necesitan
razonamiento paso a paso — Claude ya las resuelve bien nativamente.

## Cuándo SÍ se activa (triggers condicionales)

### Trigger 1: Goal decomposition compleja
```
Cuándo: goal-planner-worker modo DECOMPOSE con >4 sub-objetivos
Por qué: descomponer "Lanzar Nova con landing, pagos, marketing,
  SEO, monitoreo y email" requiere razonar sobre dependencias
  cruzadas, paralelos posibles, y estimaciones de sesiones.
Cómo: goal-planner-worker invoca sequential_thinking antes de
  generar el plan, pidiéndole que razone sobre el grafo de
  dependencias paso a paso.
```

### Trigger 2: Error recovery nivel 4+
```
Cuándo: un pipeline llega a error recovery nivel 4 (skill alternativa)
  o nivel 5 (MCP fallback) sin resolver
Por qué: las decisiones de recovery simples (reintentar, usar cache)
  no necesitan ST. Pero cuando hay múltiples alternativas con tradeoffs
  complejos, el razonamiento paso a paso evita decisiones apresuradas.
Cómo: el error recovery invoca ST pidiéndole evaluar cada alternativa
  con pros/contras antes de elegir.
```

### Trigger 3: Learning post-mortem
```
Cuándo: learning-worker analiza un patrón de fallos recurrente
  (mismo combo falló ≥3 veces en los últimos 30 días)
Por qué: identificar la causa raíz de un fallo recurrente requiere
  correlacionar múltiples variables (skills, dominios, condiciones,
  estados de MCPs). ST estructura ese análisis.
Cómo: learning-worker invoca ST con el historial de fallos y le pide
  que identifique la causa raíz paso a paso.
```

### Trigger 4: Routing ambiguo (>5 candidatos con scores similares)
```
Cuándo: Fase 0.5 produce >5 skills candidatos con scores entre
  ±0.15 del máximo (ej: todos entre 0.55-0.70)
Por qué: cuando el routing no tiene un ganador claro, una decisión
  rápida puede elegir mal. ST puede razonar sobre el contexto
  específico (wiki, learning, dominio) para desempatar.
Cómo: NEXUS invoca ST con la lista de candidatos + contexto wiki
  + learning stats y le pide que desempate paso a paso.
```

### Trigger 5: Proyecto marcado como complejo por el usuario
```
Cuándo: el usuario dice explícitamente que algo es complejo,
  o usa triggers como:
  - "esto es complejo"
  - "necesito pensar bien esto"
  - "analiza a fondo"
  - "proyecto grande"
  - /nexus [objetivo] --deep
Por qué: el usuario sabe mejor que el sistema cuándo necesita
  razonamiento profundo. Respetar esa señal.
Cómo: NEXUS activa ST para todo el pipeline de esa invocación.
  El routing, la planificación, y el error recovery usan ST.
```

## Requisito de instalación

Sequential Thinking MCP debe estar instalado en Claude Code:
```
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
```

Si NO está instalado, NEXUS usa razonamiento nativo de Claude
(fallback transparente, sin degradación funcional perceptible).

## Protocolo de invocación

Cuando un trigger se activa, NEXUS invoca ST así:

```
→ Llamar MCP tool: sequential_thinking
  thought: "{descripción del problema específico}"
  thoughtNumber: 1
  totalThoughts: {estimado: 5-10 pasos}
  nextThoughtNeeded: true

→ Iterar hasta nextThoughtNeeded: false o maxThoughts alcanzado

→ Extraer conclusión del último paso
→ Inyectar conclusión en NEXUS_CONTEXT
→ Continuar con el pipeline normal
```

## Límites de protección

```
max_thoughts_per_call: 10       ← nunca más de 10 pasos
max_st_calls_per_session: 3     ← máximo 3 invocaciones de ST por sesión
fallback_if_unavailable: true   ← si ST no está instalado, usar Claude nativo
warn_on_token_estimate: true    ← avisar al usuario el costo estimado
```

## Estimación de costo con ST condicional

```
Sin ST:           ~$0.93/mes (NEXUS v9.0 normal)
Con ST global:    ~$3.50-5.00/mes (3.8x-5.3x multiplicador en todo)
Con ST condicional: ~$1.10-1.25/mes (ST en ~10-15% de invocaciones)

El costo adicional de ST condicional es ~$0.15-0.30/mes.
```

## Detección automática

```
En Fase 0.5 (routing):
  ¿MCP sequential-thinking está disponible?
  SÍ → ST_AVAILABLE = true → activar en triggers configurados
  NO  → ST_AVAILABLE = false → razonamiento nativo siempre

No preguntar al usuario cada vez. Detectar silenciosamente.
```

## Comandos

| Comando | Acción |
|---|---|
| /nexus think [objetivo] | Forzar ST para este pipeline |
| /nexus [obj] --deep | Activar ST para pipeline complejo |
