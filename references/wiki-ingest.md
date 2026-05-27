# Wiki Ingest — Ingesta de Fuentes al Wiki

## Propósito
Convertir fuentes externas (URLs, PDFs, documentos, notas) en páginas wiki
curadas y clasificadas por dominio de negocio.

## Triggers
- `/nexus wiki ingest [URL]` — ingerir una URL
- `/nexus wiki ingest [ruta]` — ingerir un archivo local
- `/nexus wiki ingest --batch [directorio]` — ingerir múltiples archivos
- Automático post-pipeline: si research produjo datos archivables

## Pipeline de ingesta

```
FUENTE → Limpieza → Extracción → Clasificación → Generación → Archivo
```

### Paso 1 — Detección de tipo y limpieza

```
SI la fuente es URL (empieza con http):
  SI defuddle está instalado (npm list -g defuddle):
    → defuddle parse {URL} --md → markdown limpio (40-60% menos tokens)
  SI NO:
    → web_fetch {URL} → HTML crudo (fallback)
    → sugerir: "Instala defuddle para ingest más limpio: npm i -g defuddle"

SI la fuente es .pdf:
  → pdftotext o pypdf → extraer texto

SI la fuente es .md o .txt:
  → leer directamente

SI la fuente es imagen (.png, .jpg):
  → describir contenido (requiere modelo con visión)
  → generar página wiki con la descripción

SI la fuente es otro formato:
  → intentar extract-text
  → si falla → reportar formato no soportado
```

### Paso 2 — Extracción de conocimiento

Del contenido limpio, extraer:

```
1. TEMA PRINCIPAL: ¿de qué trata? (1 línea)
2. DATOS CLAVE: hechos, números, decisiones, patrones (lista)
3. DOMINIO: ¿a cuál vertical de negocio pertenece?
4. TAGS: 3-5 keywords para búsqueda futura
5. LINKS: ¿se relaciona con páginas wiki existentes?
```

### Paso 3 — Clasificación por dominio

```
Leer wiki/verticals.md para la lista de dominios activos.

Clasificar por coincidencia de contenido:
  NestJS, Prisma, POS, pagos → arhinfo
  Inmigración, UDI, noruega, legal → abogado-ai
  Suplementos, salud, nutrición → nova
  Mascotas, veterinaria, Colombia → super-tiernos
  Prompt, LLM, skills, agentes → nexus-core
  Kondratiev, ciclos, macro, Dalio → macro
  Bienestar, escandinavo, nórdico → bienestar-scandi
  Péptidos, funcional, medicina → med-funcional
  Automatización, Noruega, servicios → auto-ia-noruega
  Sin match claro → general

Si la fuente toca múltiples dominios:
  → crear página en el dominio principal
  → añadir wikilinks cruzados a los otros dominios
```

### Paso 4 — Generación de páginas wiki

Por cada fuente, generar entre 1-5 páginas wiki dependiendo de la densidad.

Formato de cada página:
```markdown
---
title: {título descriptivo}
domain: {dominio}
type: research | decision | pattern | reference
date: {fecha de ingesta}
source: {URL o ruta original}
tags:
  - {tag1}
  - {tag2}
---

# {título}

{contenido destilado — NO copia literal de la fuente}
{parafrasear, resumir, estructurar}

## Datos clave
- {punto 1}
- {punto 2}

## Relevancia para {dominio}
{por qué este conocimiento importa para el proyecto}

## Links
- [[{dominio}/_index]]
- [[{página relacionada si existe}]]
```

### Paso 5 — Archivo y registro

```
1. Guardar página(s) en wiki/{dominio}/{slug}.md
2. Guardar fuente original en .raw/ (si es archivo local)
3. Actualizar .raw/.manifest.json con hash + fecha + páginas generadas
4. Actualizar wiki/{dominio}/_index.md con wikilink a nueva página
5. Actualizar wiki/index.md si es un dominio nuevo
6. Añadir entrada a wiki/log.md
```

### Paso 6 — Reporte

```
📥 WIKI INGEST COMPLETADO
━━━━━━━━━━━━━━━━━━━━━━━━━━
Fuente:    {URL o archivo}
Dominio:   {dominio asignado}
Páginas:   {N} creadas
  - [[{página1}]]
  - [[{página2}]]
Tokens:    ~{N} tokens de conocimiento archivado
Defuddle:  {Sí/No — tokens ahorrados si Sí}
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Delta tracking (no re-ingerir)

`.raw/.manifest.json` registra cada fuente ingerida:

```json
{
  "sources": [
    {
      "url": "https://docs.nestjs.com/guards",
      "hash": "a1b2c3d4",
      "ingested_at": "2026-05-25T10:00:00Z",
      "pages_generated": ["arhinfo/nestjs-guards.md"],
      "tokens_source": 3200,
      "tokens_wiki": 800
    }
  ]
}
```

Si la misma URL se ingiere de nuevo:
  → comparar hash del contenido
  → si cambió → re-ingerir y actualizar páginas
  → si no cambió → reportar "ya ingerido" y saltar

## Batch ingest

```
/nexus wiki ingest --batch ./docs/
  → listar archivos en el directorio
  → filtrar por extensiones soportadas (.md, .txt, .pdf, .html)
  → ingerir cada uno secuencialmente
  → reporte consolidado al final
```

## Integración con pipeline post-pipeline

Cuando un pipeline produce research (market-scout, webdev analysis):
```
SI auto_capture_post_pipeline = true en nexus.config.json:
  → wiki-memory-worker pasa outputs relevantes a wiki-ingest
  → se genera automáticamente página wiki con hallazgos
  → el usuario ve: "📥 Research archivado en wiki/{dominio}/"
```

## Reglas

1. NUNCA copiar contenido literal de fuentes externas — siempre destilar
2. NUNCA ingerir sin clasificar por dominio
3. Guardar fuente original en .raw/ como respaldo inmutable
4. Si defuddle falla, usar fallback sin bloquear el ingest
5. Máximo 5 páginas por fuente (si el contenido es muy denso, resumir más)
6. Respetar copyright: parafrasear, no copiar textualmente
