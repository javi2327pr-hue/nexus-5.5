# Wiki Memory Engine — Memoria Persistente con Obsidian Wiki

> Evolución del Memory Engine v7.2. Mismo protocolo de 3 capas
> (captura → compresión → reinyección), nuevo backend: Obsidian Wiki.
> Compatible con claude-mem como capa superior si está instalado.

## Por qué wiki en vez de JSON plano

```
v7.2 nexus-memory.json:
  - Máx 50 bloques de 200 tokens c/u = 10,000 tokens techo
  - No navegable, no visual, no buscable más allá de keyword
  - No soporta ingest de fuentes externas
  - Se pierde si el archivo se corrompe

v8.0 wiki/:
  - Sin límite de páginas (escalable indefinidamente)
  - Navegable en Obsidian con graph view + carpetas
  - Buscable por dominio, wikilinks, tags, contenido
  - Soporta ingest de URLs, PDFs, imágenes
  - Cada página es un .md independiente (fallo aislado)
  - hot.md restaura contexto en ~500 tokens (igual que antes)
```

## Arquitectura de 3 capas (MISMA interfaz, NUEVO backend)

CAPA 1 — CAPTURA: observa outputs del pipeline, extrae decisiones/patrones/artefactos
CAPA 2 — COMPRESIÓN: genera páginas wiki curadas (no bloques JSON)
CAPA 3 — REINYECCIÓN: hot.md al boot + query bajo demanda al wiki

## Estructura del vault

```
~/.claude/nexus-wiki/            ← vault de Obsidian (o carpeta plain md)
├── wiki/
│   ├── hot.md                   ← contexto reciente (~500 tokens, se sobreescribe)
│   ├── index.md                 ← catálogo maestro con wikilinks a dominios
│   ├── log.md                   ← historial append-only (nunca editar pasado)
│   ├── verticals.md             ← lista de verticales de negocio (editable)
│   ├── arhinfo/
│   │   ├── _index.md            ← punto de entrada del dominio
│   │   ├── winning-patterns.md  ← v9.3 — combos ganadores del dominio
│   │   └── [páginas].md         ← conocimiento acumulado
│   ├── abogado-ai/
│   │   └── _index.md
│   ├── nexus-core/
│   │   └── _index.md
│   ├── nova/
│   │   └── _index.md
│   ├── super-tiernos/
│   │   └── _index.md
│   ├── macro/
│   │   └── _index.md
│   ├── bienestar-scandi/
│   │   └── _index.md
│   ├── med-funcional/
│   │   └── _index.md
│   ├── auto-ia-noruega/
│   │   └── _index.md
│   └── general/                 ← notas sin dominio específico
│       └── _index.md
├── .raw/                        ← fuentes originales (NEXUS NO las modifica)
│   ├── .manifest.json           ← tracking de fuentes ingeridas (delta)
│   └── [archivos originales]
└── _templates/                  ← plantillas para Obsidian Templater
    ├── wiki-page.md
    └── domain-index.md
```

## Protocolo de captura (post-pipeline)

Al finalizar un pipeline exitoso, wiki-memory-worker extrae del NEXUS_CONTEXT:

```
QUÉ CAPTURAR:
  [D] decisiones técnicas (alta prioridad)
  [P] patrones descubiertos (alta)
  [E] errores y soluciones (alta)
  [A] artefactos generados (media)
  [L] aprendizajes generales (media)
  [→] próximos pasos (alta)

QUÉ NO CAPTURAR:
  - Tokens, API keys, passwords, PII
  - Copy literal de competidores
  - Conversación sin valor destilable
  - Datos que ya están en PROJECT-knowledge.md
```

### Formato de página wiki

```markdown
---
title: Stripe Connect para pagos marketplace
domain: arhinfo
type: decision
date: 2026-05-25
pipeline: full-stack-auto
tags:
  - payments
  - stripe
  - architecture
---

# Stripe Connect para pagos marketplace

## Decisión
Se eligió Stripe Connect (Standard) para el modelo de marketplace de ARHinfo.

## Contexto
El módulo de pagos necesita soportar múltiples vendedores con splits automáticos.

## Alternativas evaluadas
| Opción | Ventaja | Descartada por |
|---|---|---|
| Stripe Direct | Simple | No soporta splits |
| PayPal Commerce | Cobertura LATAM | API inconsistente |
| MercadoPago | Popular en CO | Solo local |

## Consecuencias
- Redis como cache de sesiones de pago (TTL 30min)
- Webhook endpoint: POST /api/webhooks/stripe
- El middleware de validación va ANTES del guard de auth

## Links
- [[arhinfo/_index|ARHinfo]]
- [[arhinfo/redis-sessions|Sesiones Redis]]
```

## Protocolo de compresión (hot.md)

Al final de cada sesión, sobreescribir `wiki/hot.md` con resumen estructurado:

```markdown
## Última sesión: {fecha}

### Proyecto activo
{dominio} — {contexto breve}

### Decisiones tomadas
- {lista de [D] de esta sesión}

### Pendientes
- {lista de [→] de esta sesión}

### Patrones aprendidos
- {lista de [P] si hay}

### Páginas wiki creadas/actualizadas
- [[{página1}]]
- [[{página2}]]
```

Máximo ~500 tokens. Si la sesión fue larga, priorizar decisiones y pendientes.

## Protocolo de reinyección (boot)

```
FASE 0.6 del boot de NEXUS:

1. ¿Existe ~/.claude/nexus-wiki/wiki/hot.md?
   SÍ → leer silenciosamente (~500 tokens)
       → inyectar en NEXUS_CONTEXT como contexto_previo
   NO  → primera vez, sin contexto previo

2. NO cargar index.md ni páginas individuales en boot
   → solo se cargan bajo demanda en queries o pipelines

3. Si el objetivo del usuario hace referencia a un dominio conocido:
   → cargar wiki/{dominio}/_index.md bajo demanda
   → si necesita más detalle → cargar página específica
```

## Progressive disclosure (3 niveles, igual que v7.2)

```
Nivel 1 (auto al boot):
  → hot.md: decisiones recientes + pendientes (~500 tokens)

Nivel 2 (bajo demanda, /nexus recall o query implícito):
  → index.md + _index.md del dominio relevante (~750 tokens)

Nivel 3 (explícito, /nexus wiki query deep):
  → páginas individuales con todo el detalle
  → múltiples páginas si el query es cross-domain
```

## Búsqueda en wiki

```
/nexus recall {query}
  1. Buscar en hot.md (coincidencia reciente)
  2. Buscar en index.md (navegación por dominio)
  3. Buscar en _index.md de dominios relevantes
  4. Si score < 0.5 → buscar en páginas individuales por grep
  5. Devolver top 5 resultados con contexto

Scoring: exacto(3pts) > parcial(2pts) > tag_match(1.5pts) > contexto(1pt)
```

## Migración desde v7.2

```
SI existe ~/.claude/nexus-memory.json (formato v7.2):
  → Leer bloques existentes
  → Convertir cada bloque [D] a página wiki en dominio apropiado
  → Convertir [→] a sección de pendientes en hot.md
  → Convertir [P] y [E] a páginas de patrones/errores
  → Preservar nexus-memory.json como backup (.bak)
  → Reportar: "✅ Memoria v7.2 migrada al wiki. {N} páginas creadas."
```

## Compatibilidad con claude-mem

```
SI claude-mem está instalado:
  → claude-mem opera como capa de captura rápida
  → wiki-memory-worker sincroniza periódicamente claude-mem → wiki
  → hot.md se alimenta de ambas fuentes

SI claude-mem NO está instalado:
  → wiki-memory-worker opera directamente
  → mismo resultado, sin intermediario
```

## Compatibilidad con PROJECT-knowledge.md

```
wiki-memory NO reemplaza PROJECT-knowledge.md.
Son complementarios:
  - PROJECT-knowledge.md = estado actual del PROYECTO (stack, esquema, endpoints)
  - wiki/ = historial acumulativo de DECISIONES, PATRONES y RESEARCH

El knowledge-worker sigue actualizando PROJECT-knowledge.md.
El wiki-memory-worker actualiza wiki/.
Ambos se inyectan en NEXUS_CONTEXT con prioridades diferentes.
```

## Páginas especiales por dominio (v9.3)

Desde v9.3, cada dominio puede tener páginas especiales generadas
por workers, no por captura libre:

```
wiki/{domain}/
├── _index.md              ← curado (puede editarse manualmente)
├── winning-patterns.md    ← v9.3 — auto-gestionado por learning-worker
│                            (ver references/winning-patterns.md)
└── [otras páginas].md     ← capturadas por wiki-memory-worker
```

Y en `wiki/nexus-core/`:
```
wiki/nexus-core/
├── learning-log.md           ← v9.0
├── learning-stats.md         ← v9.0
├── learned-templates.md      ← v9.1
├── satisfaction-log.md       ← v9.3 — append por Fase 5.6
└── ruflo-delegation-log.md   ← v9.2
```

El `satisfaction-log.md` es append-only y guarda solo:
```markdown
| Fecha       | Pipeline ID    | Feedback  | Fuente            | Dominio |
|-------------|----------------|-----------|-------------------|---------|
| 2026-05-25  | 2026-05-25-001 | liked     | natural_language  | arhinfo |
| 2026-05-25  | 2026-05-25-003 | disliked  | command           | nova    |
```

Sin texto literal del user, sin outputs — solo metadatos del feedback.
