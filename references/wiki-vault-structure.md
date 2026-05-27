# Wiki Vault Structure — Estructura y Gestión del Vault

## Inicialización del vault

### `/nexus wiki init`

Crea la estructura completa del vault. Detecta plataforma automáticamente:

```bash
# Auto-detección de plataforma (desde nexus.config.json wiki_memory.path)
# Windows: C:\Users\javi2\.claude\nexus-wiki
# Unix:    ~/.claude/nexus-wiki

# En Windows (PowerShell):
# $WIKI_PATH = "C:\Users\javi2\.claude\nexus-wiki"
# New-Item -ItemType Directory -Force -Path "$WIKI_PATH\wiki\{domain}" para cada dominio

# En Unix (bash):
WIKI_PATH="${NEXUS_WIKI:-$HOME/.claude/nexus-wiki}"

mkdir -p "$WIKI_PATH"/{wiki,_templates,.raw}

# Dominios basados en las verticales de negocio reales del usuario
DOMAINS=(arhinfo abogado-ai nexus-core nova super-tiernos macro bienestar-scandi med-funcional auto-ia-noruega general)

for domain in "${DOMAINS[@]}"; do
  mkdir -p "$WIKI_PATH/wiki/$domain"
done
```

### Archivos iniciales generados

**wiki/verticals.md** — lista editable de dominios:
```markdown
---
title: Verticales de negocio
type: config
---

# Verticales activas

| ID | Nombre | Descripción |
|---|---|---|
| arhinfo | ARHinfo POS | Sistema POS: NestJS 11, Prisma 7, PostgreSQL, Redis |
| abogado-ai | Abogado AI | RAG inmigración noruega, UDI |
| nexus-core | NEXUS Core | Prompt engineering, skills, orquestación |
| nova | Nova Suplementos | Plataforma de suplementos |
| super-tiernos | Súper Tiernos | Herramientas para mascotas, Colombia |
| macro | Análisis Macro | Ciclos Kondratiev, modelos Dalio, macroeconomía |
| bienestar-scandi | Bienestar Escandinavo | Comunidad de bienestar nórdico |
| med-funcional | Medicina Funcional | Intermediario europeo, péptidos |
| auto-ia-noruega | Automatización IA Noruega | Servicios de automatización IA |
| general | General | Notas sin dominio específico |

## Agregar un dominio nuevo

Añadir una fila a la tabla anterior y ejecutar:
`/nexus wiki domain add {id} {nombre}`

NEXUS creará la carpeta wiki/{id}/ con su _index.md.
```

**wiki/index.md** — catálogo maestro:
```markdown
---
title: NEXUS Wiki — Índice
type: index
updated: {fecha}
---

# NEXUS Wiki

Base de conocimiento acumulativa del ecosistema NEXUS.

## Dominios

- [[arhinfo/_index|ARHinfo POS]]
- [[abogado-ai/_index|Abogado AI]]
- [[nexus-core/_index|NEXUS Core]]
- [[nova/_index|Nova Suplementos]]
- [[super-tiernos/_index|Súper Tiernos]]
- [[macro/_index|Análisis Macro]]
- [[bienestar-scandi/_index|Bienestar Escandinavo]]
- [[med-funcional/_index|Medicina Funcional]]
- [[auto-ia-noruega/_index|Automatización IA Noruega]]
- [[general/_index|General]]

## Estadísticas
- Páginas totales: 0
- Última actualización: {fecha}
- Sesiones archivadas: 0
```

**wiki/{domain}/_index.md** — template por dominio:
```markdown
---
title: {Nombre del dominio}
type: domain-index
domain: {id}
---

# {Nombre del dominio}

{Descripción del dominio}

## Páginas

_Sin páginas aún. Usa `/nexus wiki ingest` o `/nexus save` para empezar._

## Decisiones activas

_Sin decisiones registradas aún._

## Pendientes

_Sin pendientes registrados._
```

**wiki/hot.md** — inicializado vacío:
```markdown
## Última sesión: nunca

### Proyecto activo
_Primera sesión pendiente_

### Decisiones tomadas
_Ninguna aún_

### Pendientes
_Ninguno aún_
```

**wiki/log.md** — inicializado:
```markdown
---
title: NEXUS Wiki Log
type: log
---

# Log de sesiones

_Append-only. Cada sesión añade una entrada al final. Nunca editar pasado._
```

**.raw/.manifest.json** — tracking vacío:
```json
{ "sources": [], "last_scan": null }
```

## Gestión de dominios

### Agregar dominio nuevo
```
/nexus wiki domain add {id} {nombre} {descripción}
  1. Crear wiki/{id}/
  2. Crear wiki/{id}/_index.md con template
  3. Añadir fila a wiki/verticals.md
  4. Añadir wikilink a wiki/index.md
  5. Reportar: "✅ Dominio {nombre} creado"
```

### Renombrar dominio
```
/nexus wiki domain rename {id_viejo} {id_nuevo}
  1. Renombrar carpeta wiki/{id_viejo} → wiki/{id_nuevo}
  2. Actualizar frontmatter de todas las páginas del dominio
  3. Actualizar wikilinks en index.md y cross-references
  4. Actualizar verticals.md
```

### Archivar dominio
```
/nexus wiki domain archive {id}
  1. Mover wiki/{id}/ → wiki/_archived/{id}/
  2. Remover de verticals.md (no borrar, marcar archived)
  3. Remover de index.md
  4. Las páginas siguen siendo buscables vía Nivel 3
```

## Wiki Lint — Health check

### `/nexus wiki lint`

```
Verificar:
  1. HUÉRFANAS: páginas sin wikilink desde ningún _index.md
  2. LINKS ROTOS: wikilinks que apuntan a páginas que no existen
  3. SIN DOMINIO: páginas en wiki/ raíz (deberían estar en un dominio)
  4. ÍNDICES VACÍOS: dominios con _index.md pero 0 páginas
  5. HOT STALE: hot.md no actualizado en >7 días
  6. LOG ENORME: log.md > 500 líneas → sugerir rotación
  7. MANIFEST DRIFT: fuentes en .raw/ no registradas en .manifest.json

Reporte:
  📋 WIKI HEALTH CHECK
  ━━━━━━━━━━━━━━━━━━━━
  Páginas totales:    {N}
  Dominios activos:   {N}
  Huérfanas:          {N} → {lista}
  Links rotos:        {N} → {lista}
  Sin dominio:        {N} → {lista}
  Hot.md edad:        {N} días
  ━━━━━━━━━━━━━━━━━━━━
  Recomendación: {acciones sugeridas}
```

Ejecutar lint cada ~15 ingests o cuando el usuario lo pida.

## Notas sobre Obsidian (opcional)

El vault funciona como carpeta de markdown puro SIN Obsidian.
Si el usuario tiene Obsidian instalado:

- Abrir `~/.claude/nexus-wiki/` como vault en Obsidian
- Graph view muestra conexiones entre dominios y páginas
- Las propiedades YAML se muestran en la vista de propiedades
- Los wikilinks `[[page]]` navegan entre notas
- Los tags son buscables en la barra lateral

Plugins de Obsidian recomendados (opcionales):
- Dataview — queries dinámicas sobre propiedades
- Calendar — vista por fecha de las sesiones
- Graph Analysis — métricas de conexiones entre notas

Nada de esto es obligatorio — el wiki funciona 100% desde Claude Code
leyendo y escribiendo archivos `.md` sin Obsidian.
