# catalog-ingest-worker — Análisis y Catalogación Automática

## Rol
Detectar skills y agentes nuevos, analizar su funcionalidad, clasificarlos
en el módulo correcto del catálogo, y registrarlos automáticamente. Es el
"bibliotecario" de NEXUS — mantiene la bodega organizada sin intervención manual.

## Cuándo se invoca

1. **Auto-detección**: NEXUS detecta archivo nuevo en watch_paths
2. **Manual**: `/nexus ingest [ruta]` o `/nexus scan --force`
3. **Batch**: `/nexus scan` (escanea todo y reconcilia)
4. **Eliminación**: archivo desaparece de watch_paths → remover del catálogo

## Protocolo de análisis de funcionalidad

Al detectar un archivo nuevo (.md), ejecutar este análisis:

### Paso 1 — Leer y clasificar tipo

```
SI el archivo tiene frontmatter YAML con name/description:
  → ES UN SKILL.md (entry principal)

SI el nombre termina en *-worker.md:
  → ES UN AGENTE (worker autónomo)

SI el nombre termina en *-patterns.md o *-pro.md o *-expert.md:
  → ES UN SKILL (instrucciones especializadas)

SI tiene secciones como "## Protocolo de entrada" + "## Protocolo de salida":
  → ES UN AGENTE (tiene flujo autónomo)

SI tiene secciones como "## Best practices" o "## Patterns":
  → ES UN SKILL (referencia de conocimiento)

AMBIGUO:
  → Verificar si tiene: bucles de decisión, manejo de estado,
    sub-llamadas a otros skills → AGENTE
  → Si solo tiene: instrucciones, templates, reglas → SKILL
```

### Paso 2 — Extraer metadata

```python
def extract_metadata(file_content, file_path):
    metadata = {
        "name": extract_from_frontmatter("name") or derive_from_filename(),
        "type": "skill" | "agent",  # del Paso 1
        "version": extract_from_frontmatter("version") or "1.0",
        "source": determine_source(file_path),
        # source: "nexus-official" | "marketplace" | "third-party" | "user-created"

        "keywords": [],      # extraer del Paso 3
        "capability": "",    # extraer del Paso 3
        "module_id": "",     # determinar en Paso 4

        "mcp_required": detect_mcp_dependency(file_content),
        "depends_on": detect_dependencies(file_content),
        "feeds_into": detect_outputs(file_content),
        "inputs": extract_inputs(file_content),
        "outputs": extract_outputs(file_content),

        "path": file_path,
        "worker_path": find_associated_worker(file_path),
        "reference_path": find_associated_reference(file_path),
    }
    return metadata
```

### Paso 3 — Análisis de funcionalidad (el corazón)

```
LEER el archivo completo y extraer:

1. KEYWORDS (5-15):
   - Del frontmatter: description, activa con, señales
   - De headers ## y ###: términos técnicos específicos
   - De contenido: tecnologías mencionadas (React, NestJS, AWS...)
   - Normalizar: minúsculas, sin duplicados, sin stopwords

2. CAPABILITY (1 línea, máx 80 chars):
   - Resumir QUÉ HACE en una línea
   - Formato: "[Verbo] [qué] [con qué herramienta/patrón]"
   - Ejemplo: "Arquitectura de APIs REST con NestJS y Prisma"

3. DOMINIOS:
   - Clasificar en 1-2 de los 16 módulos existentes
   - Si no encaja en ninguno → módulo "custom"

4. INPUTS/OUTPUTS:
   - Buscar secciones de "protocolo de entrada/salida"
   - O inferir de los parámetros mencionados
   - Esto permite el context chaining dinámico

5. DEPENDENCIAS:
   - ¿Menciona MCP? → mcp_required
   - ¿Necesita otro skill primero? → depends_on
   - ¿Produce datos para otro? → feeds_into
```

### Paso 4 — Clasificación en módulo

```python
def classify_module(keywords, capability):
    MODULE_SIGNALS = {
        "ai-agents":       ["agente", "agent", "LLM", "RAG", "prompt", "MCP", "langchain"],
        "python":          ["python", "pip", "fastapi", "django", "pytest"],
        "js-ts":           ["typescript", "react", "next.js", "node", "nestjs", "prisma"],
        "languages":       ["golang", "rust", "java", "kotlin", "swift", "flutter", "ruby"],
        "cloud-devops":    ["AWS", "Azure", "GCP", "terraform", "kubernetes", "docker", "CI/CD"],
        "security":        ["pentest", "security", "vulnerability", "OWASP", "audit"],
        "data-ml":         ["data", "ML", "pipeline", "analytics", "embeddings", "vector"],
        "databases":       ["PostgreSQL", "SQL", "NoSQL", "migration", "database"],
        "seo-marketing":   ["SEO", "copywriting", "ads", "growth", "marketing", "content"],
        "design-frontend": ["UI", "UX", "tailwind", "CSS", "design", "animation", "3D"],
        "automation-saas": ["slack", "notion", "gmail", "shopify", "stripe", "n8n", "zapier"],
        "business":        ["product", "startup", "pricing", "sales", "analytics"],
        "verticals":       ["health", "legal", "logistics", "finance", "FDA", "ITIL"],
        "testing-qa":      ["TDD", "test", "playwright", "e2e", "code review"],
        "plugins":         ["plugin:", "namespaced"],
    }

    scores = {}
    for module_id, signals in MODULE_SIGNALS.items():
        score = sum(1 for kw in keywords if any(s.lower() in kw.lower() for s in signals))
        if score > 0:
            scores[module_id] = score

    if not scores:
        return "custom"  # fallback

    return max(scores, key=scores.get)
```

### Paso 5 — Security check (solo para third-party)

```
SI source == "third-party" o source == "marketplace":
  → Ejecutar SecurityAudit (references/security-audit.md)
  → PELIGROSO → registrar en blocked_entries, NO agregar al catálogo
  → REVISAR → agregar con flag needs_review=true, avisar al usuario
  → SEGURO → agregar normalmente
```

### Paso 6 — Registrar en catálogo

```
1. Abrir catalog/{module_id}.json
2. Verificar que no existe duplicado (por name)
   - Si existe → actualizar metadata (versión más nueva gana)
   - Si no existe → agregar como nueva entry
3. Actualizar conteos en catalog-root.json
4. Guardar ambos archivos
5. Reportar al usuario
```

## Output al usuario

```
📦 NUEVA SKILL/AGENTE DETECTADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre:     [name]
Tipo:       [SKILL | AGENTE]
Módulo:     [module_name] (catalog/{module_id}.json)
Keywords:   [lista de keywords]
Capability: [línea de resumen]
Seguridad:  [SEGURO | REVISAR | BLOQUEADO]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Registrado en catálogo. Disponible para pipelines futuros.
```

## Protocolo de eliminación

```
SI un archivo es eliminado de watch_paths:
  1. Buscar en todos los catalog/{module}.json
  2. Remover la entry correspondiente
  3. Actualizar conteos en catalog-root.json
  4. SI era un agente con worker → verificar que el worker también se fue
  5. Reportar: "⚠️ [name] removido del catálogo"
```

## Protocolo de actualización

```
SI un archivo existente es modificado:
  1. Re-analizar funcionalidad (Pasos 1-4)
  2. ¿Cambió de módulo? → mover a módulo nuevo
  3. ¿Cambió tipo? → actualizar skill↔agent
  4. Actualizar keywords y capability
  5. NO resetear times_used ni last_used (preservar historial)
```

## Reglas

1. NUNCA agregar al catálogo sin análisis de funcionalidad
2. NUNCA ejecutar skill de tercero sin SecurityAudit
3. Preservar historial de uso al actualizar
4. Si el catálogo se corrompe → `/nexus scan --force` lo reconstruye
5. Máximo 1 entry por name — duplicados se actualizan, no se duplican
