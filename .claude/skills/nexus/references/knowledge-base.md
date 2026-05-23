# KnowledgeBase — Destilación y Aprendizaje Continuo

## Propósito
Aprender del proyecto actual y de cada pipeline ejecutado.
Mantener un PROJECT-knowledge.md actualizado que todos los workers
consumen automáticamente al inicio de sus tareas.

---

## Auto-detección al boot de NEXUS

```
SI existe PROJECT-knowledge.md en raíz del proyecto:
  → Cargar en NEXUS_CONTEXT antes de invocar cualquier skill
  → Todos los workers reciben el knowledge como contexto base

SI no existe:
  → Al finalizar el primer pipeline exitoso, ofrecer al usuario:
    "¿Quieres que genere el PROJECT-knowledge.md del proyecto?
     Esto hará que NEXUS sea más preciso en futuras sesiones."
```

---

## 5 Pasos de destilación

### Paso 1 — Leer el proyecto
```bash
# Estructura de archivos
find . -type f -name "*.ts" -o -name "*.js" -o -name "*.prisma" | head -50

# Package.json para dependencias
cat package.json | python3 -m json.tool

# Variables de entorno disponibles (sin valores)
cat .env.example 2>/dev/null || cat .env | sed 's/=.*/=***/'
```

### Paso 2 — Identificar stack
- Framework principal + versión
- ORM / DB / Cache
- Testing framework
- Deploy target

### Paso 3 — Mapear módulos existentes
- Lista de módulos en src/
- Convenciones de naming detectadas
- Patrones de código recurrentes

### Paso 4 — Extraer decisiones técnicas previas
- Librerías ya elegidas (no proponer alternativas para estas)
- Endpoints ya existentes
- Esquema de DB actual

### Paso 5 — Registro
Escribir PROJECT-knowledge.md siguiendo el template en
`references/PROJECT-knowledge.template.md`

---

## Aprendizaje post-pipeline

Al finalizar cada pipeline, knowledge-worker extrae:
```
Decisiones tomadas: [qué se eligió y por qué]
Patrones detectados: [código o arquitectura nuevos]
Errores encontrados: [qué falló y cómo se resolvió]
Nuevos módulos: [archivos creados]
```

Si `nexus.config.json.learning.auto_distill_post_pipeline = true`
y hay ≥ N decisiones (config: min_decisions_to_distill):
→ Actualizar PROJECT-knowledge.md automáticamente

---

## Consumo automático en workers

Todos los workers (ARCH, CODEX, AUTOFLOW, WEBDEV, STITCH) deben:
```
Al recibir NEXUS_CONTEXT:
  SI contiene knowledge_base → leer antes de cualquier decisión
  No proponer tecnologías ya descartadas en el knowledge
  No redesignar módulos que el knowledge marca como estables
```
