# Watchdog — Monitor de Workflows y Alertas

## Dos modos de operación

### Watchdog reactivo (manual)
Invocado por el usuario con `/nexus status` o `/nexus watchdog`.
Lee el estado de workflows via n8n-mcp y reporta.

### Watchdog autónomo (ver agents/watchdog-autonomous.md)
Workflow de n8n que monitorea de forma independiente cada 30 minutos,
sin necesidad de que el usuario esté presente.

---

## Watchdog reactivo — Comandos

### Check de estado
```
/nexus status → reporte de todos los workflows activos
/nexus watchdog [workflow-id] → estado detallado de uno
```

Reporte:
```
WORKFLOW: [nombre]
STATUS:   [active | error | stopped]
ÚLTIMA EJECUCIÓN: [timestamp] → [success | failed]
ERRORES CONSECUTIVOS: [N]
LATENCIA PROMEDIO: [ms]
ALERTAS ACTIVAS: [lista]
```

### Reglas de alerta

| Condición                         | Nivel  | Acción                          |
|-----------------------------------|--------|---------------------------------|
| Error 3 veces consecutivas        | 🔴 HIGH | Notificar inmediatamente        |
| Latencia > 5000ms                 | 🟡 MED  | Notificar + registrar           |
| Tasa de error > 20%               | 🔴 HIGH | Notificar + pausar workflow     |
| Workflow inactivo > 24h           | 🔵 LOW  | Notificar                       |
| Ejecución exitosa tras error      | ✅ INFO | Notificar recuperación          |

---

## Configuración de canales

En nexus.config.json → sección watchdog:
```json
"canal_default": {
  "tipo": "telegram | slack | email | webhook",
  "destino": "chat_id | channel | email | url"
}
```

---

## Auto-deploy de watchdog autónomo

Cuando AutoFlow genera un workflow y el MCP está disponible:
```
SI nexus.config.json.watchdog.auto_deploy_on_workflow_deploy = true
  → Deployar watchdog-autonomous.md automáticamente para ese workflow
  → Configurar con el ID del workflow recién creado
```

---

## Integración con NEXUS_CONTEXT

Al finalizar el pipeline, Watchdog registra:
```
workflows_monitoreados: [lista de IDs]
alertas_configuradas: [lista de reglas activas]
canal_notificacion: [tipo + destino]
```
