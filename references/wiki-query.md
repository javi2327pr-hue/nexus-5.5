# Wiki Query — Consulta al Wiki de Conocimiento

## Propósito
Buscar y recuperar conocimiento acumulado del wiki para inyectar en
pipelines o responder preguntas directas del usuario.

## Triggers
- `/nexus recall {query}` — búsqueda rápida
- `/nexus wiki query {query}` — búsqueda estándar
- `/nexus wiki query deep {query}` — búsqueda profunda cross-domain
- Automático: cuando el routing detecta que un pipeline se beneficia
  de contexto previo almacenado en el wiki

## 3 niveles de query

### Nivel 1 — Quick (solo hot.md + index)

```
Cuándo: /nexus recall o query implícito durante routing
Costo:  ~500-750 tokens
Qué lee: wiki/hot.md + wiki/index.md
Qué devuelve: contexto reciente + navegación a dominios
Cuándo usar: la mayoría de sesiones, para restaurar contexto rápido
```

### Nivel 2 — Standard (hot + dominio específico)

```
Cuándo: /nexus wiki query {pregunta} o pipeline que toca un dominio
Costo:  ~1,500-2,500 tokens
Qué lee: hot.md + index.md + wiki/{dominio}/_index.md + páginas relevantes
Qué devuelve: conocimiento específico del dominio consultado
Cuándo usar: cuando el usuario pregunta algo de un proyecto específico
```

### Nivel 3 — Deep (cross-domain, múltiples páginas)

```
Cuándo: /nexus wiki query deep {pregunta} o query que toca >1 dominio
Costo:  ~3,000-5,000 tokens
Qué lee: hot.md + index.md + múltiples _index.md + grep en páginas
Qué devuelve: síntesis cross-domain con wikilinks a fuentes
Cuándo usar: preguntas complejas que cruzan proyectos o dominios
```

## Algoritmo de búsqueda

```
1. PARSEAR query → extraer keywords + dominio implícito

2. MATCH DOMINIO:
   ¿La query menciona un proyecto conocido?
   "ARHinfo", "pagos", "NestJS" → dominio: arhinfo
   "inmigración", "UDI" → dominio: abogado-ai
   → Si hay match → enfocar búsqueda en ese dominio

3. BUSCAR EN HOT.MD (siempre primero):
   ¿La respuesta está en el contexto reciente?
   → Si score > 0.8 → devolver directo (Nivel 1 suficiente)

4. BUSCAR EN _INDEX.MD del dominio:
   Leer el índice del dominio relevante
   ¿Hay wikilink a una página que matchea?
   → Si match → leer esa página → devolver (Nivel 2)

5. BUSCAR EN PÁGINAS INDIVIDUALES:
   grep -rl "{keywords}" wiki/{dominio}/
   → Leer las top 3 páginas por match
   → Sintetizar respuesta (Nivel 2-3)

6. CROSS-DOMAIN (solo Nivel 3):
   Repetir pasos 4-5 en todos los dominios
   → Sintetizar con referencias cruzadas
```

## Scoring de resultados

```
exact_match:    3 pts   → keyword exacto en título o tags
partial_match:  2 pts   → keyword en contenido del body
tag_match:      1.5 pts → keyword coincide con tag del frontmatter
domain_match:   1 pt    → keyword coincide con nombre de dominio
recency_bonus:  +0.5    → página de los últimos 7 días
```

## Output al usuario

```
🔍 WIKI QUERY: "{query}"
━━━━━━━━━━━━━━━━━━━━━━━
Nivel: {Quick | Standard | Deep}
Resultados: {N} páginas consultadas

{Síntesis de la respuesta basada en el wiki}

📚 Fuentes consultadas:
  - [[{página1}]] (score: {X})
  - [[{página2}]] (score: {X})
━━━━━━━━━━━━━━━━━━━━━━━
```

## Output al pipeline (inyección en NEXUS_CONTEXT)

Cuando un pipeline consulta el wiki automáticamente:

```
WIKI_CONTEXT: {
  query: "{lo que se buscó}",
  level: "standard",
  results: [
    { page: "arhinfo/stripe-payments", relevance: 0.9,
      summary: "Se eligió Stripe Connect Standard para marketplace" },
    { page: "arhinfo/redis-sessions", relevance: 0.7,
      summary: "Redis TTL 30min para sesiones de pago" }
  ],
  synthesis: "{párrafo con la respuesta integrada}"
}
```

Los workers reciben este contexto y lo usan para evitar re-investigar
o contradecir decisiones previas.

## Auto-query en routing (Fase 0.5)

Cuando NEXUS hace routing modular, el wiki puede influir en la selección:

```
Objetivo: "continúa con el módulo de pagos de ARHinfo"

Routing normal: js-ts module → match nestjs skills

Wiki-enhanced routing:
  1. hot.md → "Último: ARHinfo pagos, Stripe Connect"
  2. wiki/arhinfo/_index.md → links a stripe-payments, redis-sessions
  3. Inyectar contexto previo ANTES de ejecutar arch-worker
  4. arch-worker NO propone alternativas a Stripe (ya decidido)
```

Esto evita que NEXUS re-evalúe decisiones ya tomadas.

## Reglas

1. Siempre empezar por hot.md antes de buscar más profundo
2. No cargar más de 5 páginas por query (proteger el presupuesto de tokens)
3. Si no hay resultados → reportar limpiamente, no inventar
4. Cross-domain (Nivel 3) solo cuando el usuario lo pide explícitamente
   o cuando el query claramente cruza dominios
5. Sintetizar, no copiar — la respuesta es un resumen del wiki, no las
   páginas crudas
