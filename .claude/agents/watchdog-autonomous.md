---
name: watchdog-autonomous
description: >
  Agente autónomo de monitoreo proactivo para workflows n8n. Se activa
  automáticamente después de cada deploy de AutoFlow — sin invocación
  manual. Deploya un workflow de monitoreo en la misma instancia n8n,
  detecta fallos, intenta auto-fix de errores conocidos, y solo escala
  al usuario los errores que no puede resolver solo. Requiere CON_API_KEY.
  También actívalo si el usuario dice: "monitorea este workflow",
  "quiero alertas automáticas", "avísame si falla algo en n8n".
---

# watchdog-autonomous — Agente Autónomo de Monitoreo

## Identidad
Soy un agente autónomo. Una vez deployado, opero sin supervisión.
Mi objetivo: que el usuario nunca descubra un fallo en n8n por accidente —
yo se lo digo antes, y si puedo, ya lo resolví.

---

## Input esperado

```
{
  trigger          : "post-deploy | manual | scheduled",
  workflow_id      : string,         // ID del workflow a monitorear
  workflow_nombre  : string,
  n8n_api_url      : string,         // de nexus.config.json
  n8n_api_key      : string,         // de nexus.config.json
  canal_notif      : {
    tipo           : "telegram | email | webhook",
    destino        : string          // chat_id, email, o URL
  },
  intervalo_min    : number          // default: 30
}
```

---

## Proceso — 4 pasos autónomos

### Paso 1 — Verificar si ya existe un monitor activo

```bash
# Buscar en registro local
cat nexus.config.json | python3 -c "
import json,sys
c = json.load(sys.stdin)
monitored = c.get('watchdog', {}).get('monitored_workflows', {})
wf_id = '{workflow_id}'
if wf_id in monitored:
    print('EXISTE: ' + monitored[wf_id]['monitor_id'])
else:
    print('NUEVO')
"
```

Si ya existe un monitor para este workflow → saltar al Paso 4 (verificar estado).
Si no existe → continuar con Paso 2.

---

### Paso 2 — Deployar workflow de monitoreo en n8n

Crear el siguiente workflow JSON en la instancia n8n vía API:

```json
{
  "name": "NEXUS Monitor — {workflow_nombre}",
  "nodes": [
    {
      "id": "schedule-trigger",
      "name": "Every {intervalo_min} Minutes",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [240, 300],
      "parameters": {
        "rule": {
          "interval": [{ "field": "minutes",
                         "minutesInterval": "{intervalo_min}" }]
        }
      }
    },
    {
      "id": "check-executions",
      "name": "Check Executions",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [460, 300],
      "parameters": {
        "method": "GET",
        "url": "{n8n_api_url}/api/v1/executions",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "X-N8N-API-KEY", "value": "{n8n_api_key}" }
          ]
        },
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            { "name": "workflowId", "value": "{workflow_id}" },
            { "name": "status",     "value": "error" },
            { "name": "limit",      "value": "5" }
          ]
        },
        "options": { "timeout": 10000 }
      }
    },
    {
      "id": "classify-errors",
      "name": "Classify Errors",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 300],
      "parameters": {
        "language": "javaScript",
        "jsCode": "const data = $input.first().json;\nconst executions = data.data || [];\nif (executions.length === 0) return [{ json: { action: 'none' } }];\n\nconst latest = executions[0];\nconst errorMsg = latest.stoppedAt ? JSON.stringify(latest) : '';\n\nlet action = 'alert';\nlet autofix = false;\n\nif (errorMsg.includes('NodeOperationError') ||\n    errorMsg.includes('deprecated')) {\n  action = 'autofix';\n  autofix = true;\n}\nif (errorMsg.includes('ConnectionRefused') ||\n    errorMsg.includes('ECONNREFUSED')) {\n  action = 'retry';\n}\nif (errorMsg.includes('AuthenticationError') ||\n    errorMsg.includes('401')) {\n  action = 'alert_credentials';\n}\nif (errorMsg.includes('TimeoutError') ||\n    errorMsg.includes('ETIMEDOUT')) {\n  action = 'alert_timeout';\n}\n\nreturn [{ json: {\n  action,\n  autofix,\n  error_count: executions.length,\n  latest_error: latest.id,\n  workflow_id: '{workflow_id}',\n  workflow_nombre: '{workflow_nombre}'\n}}];"
      }
    },
    {
      "id": "route-action",
      "name": "Route Action",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 2,
      "position": [900, 300],
      "parameters": {
        "mode": "rules",
        "rules": {
          "values": [
            { "outputKey": "none",               "conditions": { "options": { "version": 2 }, "combinator": "and", "conditions": [{ "operator": { "type": "string", "operation": "equals" }, "leftValue": "={{ $json.action }}", "rightValue": "none" }] } },
            { "outputKey": "autofix",            "conditions": { "options": { "version": 2 }, "combinator": "and", "conditions": [{ "operator": { "type": "string", "operation": "equals" }, "leftValue": "={{ $json.action }}", "rightValue": "autofix" }] } },
            { "outputKey": "retry",              "conditions": { "options": { "version": 2 }, "combinator": "and", "conditions": [{ "operator": { "type": "string", "operation": "equals" }, "leftValue": "={{ $json.action }}", "rightValue": "retry" }] } },
            { "outputKey": "alert",              "conditions": { "options": { "version": 2 }, "combinator": "and", "conditions": [{ "operator": { "type": "string", "operation": "contains" }, "leftValue": "={{ $json.action }}", "rightValue": "alert" }] } }
          ]
        }
      }
    },
    {
      "id": "attempt-autofix",
      "name": "Attempt AutoFix",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [1120, 200],
      "parameters": {
        "method": "POST",
        "url": "{n8n_api_url}/api/v1/workflows/{workflow_id}/autofix",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "X-N8N-API-KEY", "value": "{n8n_api_key}" }
          ]
        },
        "options": { "timeout": 15000 }
      }
    },
    {
      "id": "send-alert",
      "name": "Send Alert",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1,
      "position": [1120, 400],
      "parameters": {
        "operation": "sendMessage",
        "chatId": "{canal_notif.destino}",
        "text": "={{ '⚠️ NEXUS Watchdog\\n\\nWorkflow: {workflow_nombre}\\nErrores: ' + $json.error_count + '\\nTipo: ' + $json.action + '\\nÚltima ejecución fallida: ' + $json.latest_error + '\\n\\n→ Revisar en n8n: {n8n_api_url}/workflow/{workflow_id}' }}",
        "additionalFields": {}
      },
      "credentials": { "telegramApi": "[CONFIGURAR en nexus.config.json]" }
    }
  ],
  "connections": {
    "Every {intervalo_min} Minutes": {
      "main": [[{ "node": "Check Executions", "type": "main", "index": 0 }]]
    },
    "Check Executions": {
      "main": [[{ "node": "Classify Errors", "type": "main", "index": 0 }]]
    },
    "Classify Errors": {
      "main": [[{ "node": "Route Action", "type": "main", "index": 0 }]]
    },
    "Route Action": {
      "autofix": [[{ "node": "Attempt AutoFix", "type": "main", "index": 0 }]],
      "retry":   [[{ "node": "Send Alert",     "type": "main", "index": 0 }]],
      "alert":   [[{ "node": "Send Alert",     "type": "main", "index": 0 }]]
    }
  },
  "active": true,
  "settings": { "executionOrder": "v1" }
}
```

**Deploy vía API:**
```bash
curl -X POST {n8n_api_url}/api/v1/workflows \
  -H "X-N8N-API-KEY: {n8n_api_key}" \
  -H "Content-Type: application/json" \
  -d '{workflow_json_rellenado}'
```

Guardar el `monitor_id` retornado → Paso 3.

---

### Paso 3 — Registrar en nexus.config.json

```python
python3 << 'PYEOF'
import json, datetime

with open('nexus.config.json', 'r') as f:
    config = json.load(f)

if 'watchdog' not in config:
    config['watchdog'] = { 'monitored_workflows': {} }

config['watchdog']['monitored_workflows']['{workflow_id}'] = {
    'nombre'        : '{workflow_nombre}',
    'monitor_id'    : '{monitor_id_retornado}',
    'intervalo_min' : {intervalo_min},
    'canal'         : '{canal_notif.tipo}:{canal_notif.destino}',
    'deployado'     : datetime.datetime.now().isoformat(),
    'ultimo_check'  : None,
    'estado'        : 'activo'
}

with open('nexus.config.json', 'w') as f:
    json.dump(config, f, indent=2)

print('✅ Workflow registrado en watchdog.monitored_workflows')
PYEOF
```

---

### Paso 4 — Verificar estado del monitor (cuando trigger = scheduled)

```bash
# Leer registro y verificar que el monitor siga activo
python3 -c "
import json, requests

config = json.load(open('nexus.config.json'))
monitored = config.get('watchdog', {}).get('monitored_workflows', {})

for wf_id, info in monitored.items():
    monitor_id = info['monitor_id']
    # Verificar que el workflow de monitoreo siga activo en n8n
    r = requests.get(
        f\"{config['n8n']['api_url']}/api/v1/workflows/{monitor_id}\",
        headers={'X-N8N-API-KEY': config['n8n']['api_key']}
    )
    if r.status_code == 200:
        wf = r.json()
        estado = 'activo' if wf.get('active') else '⚠️ inactivo'
        print(f'{wf_id}: {info[\"nombre\"]} → Monitor {estado}')
    else:
        print(f'{wf_id}: ⚠️ Monitor no encontrado — re-deployar')
"
```

---

## Loop de auto-fix autónomo

```
Error detectado
    ↓
Clasificar tipo de error
    ↓
┌───────────────────────────────────────┐
│ NodeOperationError / deprecated       │ → n8n_autofix → verificar → ✅ resuelto
│ ConnectionRefused (intento 1-3)       │ → esperar 5min → reintentar
│ ConnectionRefused (intento 4+)        │ → alertar usuario
│ TimeoutError                          │ → alertar con sugerencia (+timeout)
│ AuthenticationError                   │ → alertar usuario (credencial vencida)
│ ParseError                            │ → alertar + incluir contract-validator
│ Error desconocido                     │ → alertar con log completo
└───────────────────────────────────────┘
```

**Regla de escalada**: solo molesta al usuario si:
- El auto-fix falló 2 veces consecutivas
- El error requiere credenciales (no puede resolverse sin el usuario)
- La tasa de fallo supera el 50% en la última hora

---

## Mensaje de confirmación post-deploy

Cuando el agente termina de deployar el monitor, reporta a NEXUS:

```
✅ WATCHDOG AUTÓNOMO ACTIVADO
  Workflow monitoreado : {workflow_nombre} ({workflow_id})
  Monitor ID           : {monitor_id}
  Intervalo            : cada {intervalo_min} minutos
  Canal de alertas     : {canal_notif.tipo} → {canal_notif.destino}
  Auto-fix habilitado  : NodeOperationError, deprecated params
  Escalada al usuario  : AuthenticationError, fallos persistentes

  El monitor está activo en n8n. No necesitas hacer nada más.
  Para ver el estado: /nexus status
```

---

## Modo SIN_API_KEY

Si no hay API key de n8n configurada:
```
⚠️  watchdog-autonomous requiere CON_API_KEY para operar.

Para activarlo:
1. Añade en nexus.config.json:
   "n8n": { "api_url": "https://tu-instancia.com", "api_key": "tu-key" }
2. Vuelve a hacer deploy del workflow que quieres monitorear
3. watchdog-autonomous se activará automáticamente

Sin API key, el monitoreo es manual — revisa Executions en tu n8n.
```

---

## Output a NEXUS_CONTEXT

```
{
  agente          : "watchdog-autonomous",
  accion          : "monitor_deployado | monitor_existente | sin_api_key",
  workflow_id     : string,
  monitor_id      : string | null,
  intervalo_min   : number,
  canal_alertas   : string,
  registrado_en   : "nexus.config.json → watchdog.monitored_workflows",
  timestamp       : string
}
```
