# Workflow Examples — Templates JSON para n8n

Carga esta referencia cuando AutoFlow necesite un punto de partida.
Contiene 3 workflows completos y validados, listos para importar.

---

## Cómo usar estos templates

1. Copiar el JSON del template más cercano a tu caso
2. Importar en n8n: Settings → Import Workflow → Pegar JSON
3. Configurar credenciales (marcadas con `[CONFIGURAR]`)
4. Activar el workflow

---

## Template 1 — Webhook → Procesar → Email

**Caso de uso**: recibir datos via webhook, procesarlos y enviar email de confirmación.
Compatible con: onboarding de usuarios, formularios, notificaciones.

```json
{
  "name": "NEXUS — Webhook → Process → Email",
  "nodes": [
    {
      "id": "webhook-trigger",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [240, 300],
      "parameters": {
        "httpMethod": "POST",
        "path": "nexus-webhook",
        "responseMode": "responseNode",
        "options": {}
      }
    },
    {
      "id": "process-data",
      "name": "Process Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3,
      "position": [460, 300],
      "parameters": {
        "mode": "manual",
        "fields": {
          "values": [
            { "name": "nombre", "type": "string",
              "value": "={{ $json.nombre }}" },
            { "name": "email", "type": "string",
              "value": "={{ $json.email }}" },
            { "name": "timestamp", "type": "string",
              "value": "={{ $now }}" }
          ]
        }
      }
    },
    {
      "id": "send-email",
      "name": "Send Email",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2,
      "position": [680, 300],
      "parameters": {
        "operation": "send",
        "sendTo": "={{ $json.email }}",
        "subject": "Confirmación recibida",
        "emailType": "html",
        "message": "<h2>Hola {{ $json.nombre }}</h2><p>Recibimos tu solicitud.</p>",
        "options": {}
      },
      "credentials": { "gmailOAuth2": "[CONFIGURAR]" }
    },
    {
      "id": "respond-webhook",
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [900, 300],
      "parameters": {
        "respondWith": "json",
        "responseBody": "={ \"success\": true, \"message\": \"Procesado\" }"
      }
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [[{ "node": "Process Data", "type": "main", "index": 0 }]]
    },
    "Process Data": {
      "main": [[{ "node": "Send Email", "type": "main", "index": 0 }]]
    },
    "Send Email": {
      "main": [[{ "node": "Respond to Webhook", "type": "main", "index": 0 }]]
    }
  },
  "active": false,
  "settings": { "executionOrder": "v1" }
}
```

---

## Template 2 — Schedule → Google Sheets → Telegram

**Caso de uso**: reporte automático diario desde una hoja de cálculo a Telegram.
Compatible con: reportes de ventas, dashboards, alertas periódicas.

```json
{
  "name": "NEXUS — Daily Report Sheets → Telegram",
  "nodes": [
    {
      "id": "schedule-trigger",
      "name": "Every Day 8am",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [240, 300],
      "parameters": {
        "rule": {
          "interval": [{ "field": "hours", "hoursInterval": 24 }]
        }
      }
    },
    {
      "id": "read-sheet",
      "name": "Read Google Sheet",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [460, 300],
      "parameters": {
        "operation": "read",
        "documentId": "[CONFIGURAR: ID de tu Google Sheet]",
        "sheetName": "Sheet1",
        "options": { "headerRow": 1 }
      },
      "credentials": { "googleSheetsOAuth2Api": "[CONFIGURAR]" }
    },
    {
      "id": "build-message",
      "name": "Build Message",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 300],
      "parameters": {
        "language": "javaScript",
        "jsCode": "const rows = $input.all();\nconst total = rows.length;\nconst mensaje = `📊 Reporte diario\\nRegistros: ${total}\\nÚltimo: ${rows[total-1]?.json?.nombre || 'N/A'}\\nFecha: ${new Date().toLocaleDateString('es-CO')}`;\nreturn [{ json: { mensaje } }];"
      }
    },
    {
      "id": "send-telegram",
      "name": "Send Telegram",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1,
      "position": [900, 300],
      "parameters": {
        "operation": "sendMessage",
        "chatId": "[CONFIGURAR: tu chat ID]",
        "text": "={{ $json.mensaje }}",
        "additionalFields": {}
      },
      "credentials": { "telegramApi": "[CONFIGURAR]" }
    }
  ],
  "connections": {
    "Every Day 8am": {
      "main": [[{ "node": "Read Google Sheet", "type": "main", "index": 0 }]]
    },
    "Read Google Sheet": {
      "main": [[{ "node": "Build Message", "type": "main", "index": 0 }]]
    },
    "Build Message": {
      "main": [[{ "node": "Send Telegram", "type": "main", "index": 0 }]]
    }
  },
  "active": false,
  "settings": { "executionOrder": "v1" }
}
```

---

## Template 3 — Webhook → AI Agent → Backend NestJS

**Caso de uso**: recibir un mensaje, procesarlo con un AI Agent y enviarlo
al backend NestJS. El caso central del stack ARHinfo + n8n.

```json
{
  "name": "NEXUS — Webhook → AI Agent → NestJS Backend",
  "nodes": [
    {
      "id": "webhook-in",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [240, 300],
      "parameters": {
        "httpMethod": "POST",
        "path": "ai-process",
        "responseMode": "responseNode",
        "options": {}
      }
    },
    {
      "id": "ai-agent",
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1,
      "position": [460, 300],
      "parameters": {
        "text": "={{ $json.mensaje }}",
        "options": {
          "systemMessage": "Eres un asistente que analiza solicitudes y devuelve JSON estructurado con campos: accion, datos, prioridad."
        }
      }
    },
    {
      "id": "openai-model",
      "name": "OpenAI Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1,
      "position": [460, 480],
      "parameters": {
        "model": "gpt-4o-mini",
        "options": {}
      },
      "credentials": { "openAiApi": "[CONFIGURAR]" }
    },
    {
      "id": "call-backend",
      "name": "Call NestJS Backend",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [680, 300],
      "parameters": {
        "method": "POST",
        "url": "[CONFIGURAR: https://tu-backend.com/webhook/n8n/ai-process]",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "Content-Type", "value": "application/json" },
            { "name": "x-n8n-secret",
              "value": "[CONFIGURAR: tu webhook secret]" }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            { "name": "output", "value": "={{ $json.output }}" },
            { "name": "originalInput",
              "value": "={{ $('Webhook').item.json.mensaje }}" }
          ]
        },
        "options": { "timeout": 10000 }
      }
    },
    {
      "id": "respond",
      "name": "Respond",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [900, 300],
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}"
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "AI Agent", "type": "main", "index": 0 }]]
    },
    "AI Agent": {
      "main": [[{ "node": "Call NestJS Backend", "type": "main", "index": 0 }]]
    },
    "OpenAI Model": {
      "ai_languageModel": [[{ "node": "AI Agent",
        "type": "ai_languageModel", "index": 0 }]]
    },
    "Call NestJS Backend": {
      "main": [[{ "node": "Respond", "type": "main", "index": 0 }]]
    }
  },
  "active": false,
  "settings": { "executionOrder": "v1" }
}
```

**Nota**: Este template implementa el patrón del Contract Validator.
El campo `x-n8n-secret` y el path `/webhook/n8n/ai-process` deben
coincidir exactamente con lo que genera Codex Bridge en el backend NestJS.
