# MarketOS Bridge — Invocación desde NEXUS

## Cuándo activar

NEXUS invoca MarketOS cuando detecta:
- Análisis de competencia o mercado con intención de estrategia (no solo investigación)
- Plan de marketing, growth, captación, funnels, ads
- Posicionamiento de marca o buyer personas
- Sesión de seguimiento de cliente previamente analizado

Diferencia con MARKET-SCOUT:
- MARKET-SCOUT = solo investigación (datos, URLs, tendencias)
- MARKETOS = análisis + estrategia + plan ejecutable + funnels + ads

Si la tarea es solo "investiga competidores" → MARKET-SCOUT.
Si la tarea es "analiza competencia Y hazme un plan de marketing" → MARKETOS.

## Invocación

```
[NEXUS → MARKETOS]
TAREA: [objetivo de marketing del usuario]
NEXUS_CONTEXT: {
  cliente: [nombre si existe en memoria],
  outputs_previos: [de market-scout o webdev si se ejecutaron antes],
  memoria_relevante: [observaciones previas del cliente/mercado]
}
NEXUS_MEMORY: [contexto de sesiones anteriores vía MEM]
```

## Output esperado de MarketOS al pipeline

```json
{
  "posicionamiento": { "uvp": "...", "tono": "...", "hooks": [] },
  "buyer_personas": [{ "nombre": "...", "dolor": "...", "canal": "..." }],
  "plan_90dias": { "mes1": {}, "mes2": {}, "mes3": {} },
  "funnels": { "tofu": {}, "mofu": {}, "bofu": {} },
  "competidores_analizados": [{ "nombre": "...", "hallazgos": "..." }],
  "brief_visual": { "tipo": "landing", "canal": "web", "tono": "..." },
  "client_knowledge_file": "references/{cliente}-client-knowledge.md"
}
```

## Encadenamiento post-MarketOS

Si el pipeline es `marketing-to-build`:
```
marketos.posicionamiento → stitch (brief visual con UVP + tono)
marketos.buyer_personas  → webdev (copy de landing adaptado)
marketos.funnels         → autoflow (secuencias de email en n8n)
marketos.plan_90dias     → knowledge (guardar roadmap del cliente)
```
