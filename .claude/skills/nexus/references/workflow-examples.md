# Workflow Examples — JSON importables para n8n

Tres workflows listos para importar. Descargar → n8n → Settings → Import Workflow.

---

## WF-01 — YouTube a Gmail (resumen de video)

```json
{
  "name": "NEXUS: YouTube → Resumen → Gmail",
  "nodes": [
    {
      "name": "Trigger Manual",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [240, 300]
    },
    {
      "name": "YouTube Transcript",
      "type": "n8n-nodes-base.httpRequest",
      "position": [460, 300],
      "parameters": {
        "url": "https://www.googleapis.com/youtube/v3/captions",
        "method": "GET"
      }
    },
    {
      "name": "Claude Summarize",
      "type": "n8n-nodes-base.httpRequest",
      "position": [680, 300],
      "parameters": {
        "url": "https://api.anthropic.com/v1/messages",
        "method": "POST",
        "headers": { "x-api-key": "={{ $env.ANTHROPIC_API_KEY }}" }
      }
    },
    {
      "name": "Enviar por Gmail",
      "type": "n8n-nodes-base.gmail",
      "position": [900, 300]
    }
  ],
  "connections": {
    "Trigger Manual": { "main": [[{ "node": "YouTube Transcript" }]] },
    "YouTube Transcript": { "main": [[{ "node": "Claude Summarize" }]] },
    "Claude Summarize": { "main": [[{ "node": "Enviar por Gmail" }]] }
  }
}
```

---

## WF-02 — Webhook → Procesar → Notificar

```json
{
  "name": "NEXUS: Webhook → Procesar → Telegram",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300],
      "parameters": {
        "path": "nexus-webhook",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Validar Payload",
      "type": "n8n-nodes-base.if",
      "position": [460, 300],
      "parameters": {
        "conditions": {
          "string": [{ "value1": "={{ $json.secret }}", "value2": "={{ $env.WEBHOOK_SECRET }}" }]
        }
      }
    },
    {
      "name": "Procesar con Claude",
      "type": "n8n-nodes-base.httpRequest",
      "position": [680, 300]
    },
    {
      "name": "Telegram",
      "type": "n8n-nodes-base.telegram",
      "position": [900, 300]
    }
  ],
  "connections": {
    "Webhook": { "main": [[{ "node": "Validar Payload" }]] },
    "Validar Payload": { "main": [[{ "node": "Procesar con Claude" }], []] },
    "Procesar con Claude": { "main": [[{ "node": "Telegram" }]] }
  }
}
```

---

## WF-03 — Schedule + API + Google Sheets

```json
{
  "name": "NEXUS: Schedule → API → Google Sheets",
  "nodes": [
    {
      "name": "Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [240, 300],
      "parameters": { "rule": { "interval": [{ "field": "hours", "hoursInterval": 24 }] } }
    },
    {
      "name": "Fetch Data",
      "type": "n8n-nodes-base.httpRequest",
      "position": [460, 300]
    },
    {
      "name": "Transform",
      "type": "n8n-nodes-base.code",
      "position": [680, 300],
      "parameters": { "jsCode": "return items.map(i => ({ json: { ...i.json, processed_at: new Date().toISOString() } }));" }
    },
    {
      "name": "Google Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "position": [900, 300],
      "parameters": { "operation": "appendOrUpdate" }
    }
  ],
  "connections": {
    "Schedule": { "main": [[{ "node": "Fetch Data" }]] },
    "Fetch Data": { "main": [[{ "node": "Transform" }]] },
    "Transform": { "main": [[{ "node": "Google Sheets" }]] }
  }
}
```

---

## Variables de entorno requeridas

| Variable             | Descripción                        |
|----------------------|------------------------------------|
| ANTHROPIC_API_KEY    | API key de Anthropic               |
| WEBHOOK_SECRET       | Secret para validar webhooks       |
| N8N_API_KEY          | Key de la instancia n8n            |
| TELEGRAM_BOT_TOKEN   | Token del bot de Telegram          |
