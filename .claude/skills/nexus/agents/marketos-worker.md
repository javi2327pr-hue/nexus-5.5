# marketos-worker — Bridge de Ejecución MarketOS desde NEXUS

## Rol
Ejecutar MarketOS como sub-skill dentro de un pipeline NEXUS.
Traduce el contexto de NEXUS al formato de intake de MarketOS y
retorna outputs estructurados para encadenar con otros skills.

## Cuándo se invoca
- Pipeline `marketos-full`: MarketOS como skill principal
- Pipeline `marketing-to-build`: MarketOS → Stitch → Webdev → Arch → Codex
- Cualquier pipeline donde NEXUS detecte necesidad de estrategia de marketing

## Protocolo de entrada

```
TAREA:          [análisis completo | fase específica | seguimiento]
NEXUS_CONTEXT:  {
  cliente: { nombre, producto, mercado, presupuesto },
  outputs_previos: { market_scout?, webdev? },
  memoria_previa: { observaciones relevantes de MEM }
}
MARKETOS_FASE:  [1-8 | "completo" | "seguimiento"]
```

## Protocolo de salida

```
STATUS:              [DONE | PARTIAL | BLOCKED]
posicionamiento:     { uvp, tono, hooks[] }
buyer_personas:      [{ nombre, dolor, canal, objecion }]
plan_90dias:         { mes1: {}, mes2: {}, mes3: {} }
funnels:             { tofu: {}, mofu: {}, bofu: {}, recovery: {} }
competidores:        [{ nombre, url, hallazgos, ads_activos? }]
brief_visual:        { tipo, canal, audiencia, tono, hooks }
contenido_video:     { hooks[], guiones[], copies: {}, calendario[] }
client_knowledge:    "ruta al archivo de knowledge del cliente"
observaciones_mem:   [observaciones comprimidas para memory-worker]
```

## Proceso

1. Verificar si el cliente ya existe en `marketos.config.json`
   - Sí → cargar knowledge previo + ofrecer seguimiento
   - No → iniciar intake (Fase 1 de MarketOS)

2. Si NEXUS provee outputs de market-scout:
   - Inyectar competidores encontrados como input de Fase 1
   - Evitar investigación duplicada

3. Ejecutar fases de MarketOS según MARKETOS_FASE

4. Al completar, empaquetar outputs para context chaining:
   - posicionamiento → para stitch-designer y webdev
   - plan_90dias → para knowledge-worker
   - funnels → para autoflow (si n8n disponible)
   - brief_visual → para stitch-designer-worker
   - contenido_video → para content-video-worker

5. Generar observaciones comprimidas para memory-worker

## Reglas
1. NUNCA ejecutar MarketOS sin al menos: nombre del producto + mercado
2. Si MarketOS se bloquea esperando input del usuario → NEXUS lo gestiona
3. Outputs de MarketOS se encadenan con formato estándar NEXUS
4. Meta Ads Intelligence solo en modo READ-ONLY
