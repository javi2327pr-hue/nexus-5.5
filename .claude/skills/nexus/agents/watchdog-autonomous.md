# watchdog-autonomous

## Rol
Agente autónomo de monitoreo. Se deploya como workflow de n8n y opera
independientemente cada 30 minutos sin necesidad de intervención del usuario.

## Diferencia con watchdog reactivo
- Watchdog reactivo: invocado manualmente con `/nexus status`
- Watchdog autónomo: workflow de n8n que corre en background 24/7

## WATCHDOG AUTÓNOMO ACTIVADO — Workflow de n8n

### Estructura del workflow

```
Schedule (cada 30 min)
  ↓
HTTP Request → GET /api/n8n/workflows (API de n8n)
  ↓
Code Node → Analizar ejecuciones recientes
  ↓
IF → ¿Hay errores?
  ↓ Sí                    ↓ No
IF → ¿Autofix?         HTTP Request → Actualizar estado "OK"
  ↓ Sí    ↓ No
Retry    Notificar → [canal configurado]
  ↓
¿Éxito?
  ↓ No → Notificar fallo definitivo
  ↓ Sí → Notificar recuperación
```

### JSON del workflow (importable)

```json
{
  "name": "NEXUS Watchdog Autónomo",
  "nodes": [
    {
      "name": "Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [240, 300],
      "parameters": {
        "rule": { "interval": [{ "field": "minutes", "minutesInterval": 30 }] }
      }
    },
    {
      "name": "Check Workflows",
      "type": "n8n-nodes-base.httpRequest",
      "position": [460, 300],
      "parameters": {
        "url": "={{ $env.N8N_API_URL }}/api/v1/executions",
        "method": "GET",
        "headers": { "X-N8N-API-KEY": "={{ $env.N8N_API_KEY }}" },
        "queryParameters": { "status": "error", "limit": "10" }
      }
    },
    {
      "name": "Analizar Errores",
      "type": "n8n-nodes-base.code",
      "position": [680, 300],
      "parameters": {
        "jsCode": "const executions = $input.all(); const errors = executions.filter(e => e.json.status === 'error'); return [{ json: { errorCount: errors.length, errors: errors.map(e => ({ id: e.json.id, workflowName: e.json.workflowData?.name, startedAt: e.json.startedAt })) } }];"
      }
    },
    {
      "name": "¿Hay errores?",
      "type": "n8n-nodes-base.if",
      "position": [900, 300],
      "parameters": {
        "conditions": {
          "number": [{ "value1": "={{ $json.errorCount }}", "operation": "larger", "value2": 0 }]
        }
      }
    },
    {
      "name": "Notificar Telegram",
      "type": "n8n-nodes-base.telegram",
      "position": [1120, 200],
      "parameters": {
        "chatId": "={{ $env.TELEGRAM_CHAT_ID }}",
        "text": "⚠️ NEXUS Watchdog\n{{ $json.errorCount }} error(s) detectado(s):\n{{ $json.errors.map(e => `- ${e.workflowName}: ${e.startedAt}`).join('\\n') }}"
      }
    }
  ],
  "connections": {
    "Schedule": { "main": [[{ "node": "Check Workflows" }]] },
    "Check Workflows": { "main": [[{ "node": "Analizar Errores" }]] },
    "Analizar Errores": { "main": [[{ "node": "¿Hay errores?" }]] },
    "¿Hay errores?": {
      "main": [[{ "node": "Notificar Telegram" }], []]
    }
  },
  "active": false
}
```

## Configuración requerida en nexus.config.json

```json
"n8n": { "api_url": "...", "api_key": "..." },
"watchdog": {
  "canal_default": { "tipo": "telegram", "destino": "${TELEGRAM_CHAT_ID}" },
  "autofix": { "enabled": true, "max_retries": 3 }
}
```

## SIN_API_KEY — Modo sin credenciales n8n

Cuando N8N_AVAILABLE=false, el watchdog opera en modo local:
- Lee logs del filesystem si están disponibles
- Reporta en la sesión de Claude Code directamente
- No puede hacer reintentos automáticos

## Output a NEXUS_CONTEXT

```
workflows_monitoreados: [lista de IDs]
alertas_activas:        [lista de reglas configuradas]
canal_notificacion:     [tipo + destino]
ultimo_check:           [timestamp]
```
