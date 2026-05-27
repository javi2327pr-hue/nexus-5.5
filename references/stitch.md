# STITCH — Google Stitch MCP · Diseño UI a Código

## Propósito
Conectar con Google Stitch vía MCP para leer diseños directamente desde el
canvas y convertirlos en código frontend sin copiar/pegar.
Se activa cuando la tarea implica DISEÑO DE INTERFAZ desde cero.

---

## Señales de activación

| Señal                                | STITCH        |
|--------------------------------------|---------------|
| "diseña la UI de…"                   | ✅ primero    |
| "crea las pantallas para…"           | ✅ primero    |
| "mockup / wireframe / prototipo"     | ✅ primero    |
| "tengo un diseño en Stitch"          | ✅ FASE 1     |
| "implementa el diseño visual"        | ✅ FASE 1     |
| "analiza la UI de [URL]"             | ❌ → WEBDEV primero |
| Solo backend o lógica de datos       | ❌            |

> ⚠️ Si el usuario menciona una URL para analizar → WEBDEV primero,
> su output alimenta el prompt de STITCH (pipeline analyze-and-replicate).

---

## Herramientas MCP

```
list_projects     → lista proyectos en Stitch
list_screens      → pantallas de un proyecto
get_screen_code   → HTML/CSS de una pantalla (fuente de verdad)
get_screen_image  → screenshot en base64 para validar fidelidad
get_design_system → DESIGN.md con tokens color/tipografía/spacing
build_site        → ensambla pantallas en estructura de rutas
```

---

## Flujo estándar

### FASE 1 — Conectar (usuario YA tiene proyecto en Stitch)
1. `list_projects` → identificar proyecto
2. `list_screens` → mapear pantallas
3. `get_design_system` → descargar DESIGN.md
   → **CRÍTICO: fuente única de verdad para tokens en toda la sesión**

### FASE 2 — Diseño nuevo (proyecto NO existe aún)
Generar prompt para Stitch:
```
[Tipo de app] para [usuario objetivo]:
- Pantalla [A]: [descripción + estructura]
- Pantalla [B]: [descripción + estructura]
- Estilo: [paleta, tipografía, densidad]
- Framework: React + Tailwind
```
Si recibió design_patterns_report de Market Scout o webdev,
incorporarlo como referencia visual en el prompt.

⛔ CHECKPOINT OBLIGATORIO — HUMAN_ACTION_REQUIRED:
Después de generar el prompt → DETENER → STATUS=AWAITING_USER
Mensaje: "Ejecuta este prompt en stitch.withgoogle.com,
crea el proyecto y cuando esté listo dime el nombre exacto."
No continuar a FASE 3 sin confirmación del usuario.

### FASE 3 — Implementar (post-confirmación)
Para cada pantalla:
1. `get_screen_code` → HTML/CSS de referencia
2. Traducir a componentes respetando tokens del DESIGN.md
3. `get_screen_image` → validar fidelidad al final

### FASE 4 — Ensamblar (multi-pantalla)
```
build_site mapping:
  pantalla_hero    → /
  pantalla_pricing → /pricing
  pantalla_contact → /contact
```

---

## Reglas de implementación

- NUNCA aproximes colores o spacing → leer hex/rem exactos del DESIGN.md
- Si hay desvío código vs screenshot → corregir antes de continuar
- Stitch genera layouts estáticos → añadir interactividad, hover, validaciones
- Accesibilidad: aria-labels y semántica HTML correcta
- Un componente por pantalla + archivo design-system compartido

---

## Handoff a otros skills

| Condición                           | Delegar a     |
|-------------------------------------|---------------|
| Diseño listo, falta lógica de app   | WEBDEV → ARCH |
| Diseño listo, falta backend         | ARCH → Codex  |
| Investigar competidores antes       | Market Scout  |
| Replicar UI de URL existente        | WEBDEV primero |
| Generar workflows del app           | AutoFlow      |

---

## Configuración MCP

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "@_davideast/stitch-mcp", "proxy"],
      "env": { "STITCH_API_KEY": "TU_API_KEY" }
    }
  }
}
```
Verificar: `/mcp` → `stitch: healthy`

---

## Output para context chain

```
design_tokens:       [paleta hex, tipografía rem, spacing rem]
component_list:      [lista de componentes generados]
route_structure:     [mapa pantalla → ruta]
design_gap_analysis: [elementos faltantes detectados]
framework_detected:  [React / Next.js / Astro]
api_surface_needed:  [endpoints que la UI necesita]
file_list:           [archivos de componentes generados]
STATUS:              [DONE | BLOCKED | PARTIAL | AWAITING_USER]
```

## Output por tarea

| Tarea              | Output                              |
|--------------------|-------------------------------------|
| Proyecto nuevo     | Prompt Stitch + AWAITING_USER       |
| Proyecto existente | Componentes por pantalla            |
| Multi-pantalla     | App completa con rutas              |
| Solo design system | DESIGN.md + guía de tokens          |
