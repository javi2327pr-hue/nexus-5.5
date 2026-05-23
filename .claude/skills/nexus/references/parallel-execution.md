# Parallel Execution — Setup P1/P2/P3 por plataforma

## Modos de paralelismo

| Modo | Descripción                                | Plataforma            |
|------|--------------------------------------------|-----------------------|
| P1   | Secuencial — un skill a la vez             | todas                 |
| P2   | Paralelo nativo con subagents              | Claude Code / Cowork  |
| P3   | Paralelo via Codex MCP localhost:9000      | Antigravity + Codex   |
| P4   | Workers como agentes independientes        | Claude Code / Cowork  |

NEXUS selecciona automáticamente según la plataforma detectada.
Si la plataforma no soporta el modo deseado → fallback a P1.

---

## P2 — Paralelo nativo (Claude Code)

Disponible en Claude Code con subagents.
No requiere setup adicional.

```
NEXUS spawns subagents → todos en el mismo turn
Cada subagent recibe: skill path + task + input files + output path
Resultados regresan via notificación de tarea completada
```

Limitaciones P2:
- Subagents no pueden lanzar otros subagents
- Contexto no compartido en tiempo real → pasar key_data explícito
- Consumo ~7x mayor de tokens → usar solo cuando ahorra tiempo real

---

## P3 — Parallel via Codex MCP (Antigravity)

Setup requerido (una vez):
```bash
# 1. Instalar Codex MCP server
npm install -g @openai/codex-mcp

# 2. Arrancar el servidor (antes de usar Antigravity)
codex-mcp serve --port 9000 --sandbox workspace-write &

# 3. Verificar
curl http://localhost:9000/health → {"status":"ok"}
```

Configuración en nexus.config.json:
```json
"parallel": {
  "mode": "P3",
  "p3_port": 9000
}
```

Uso:
```
NEXUS construye la tarea → la envía a Codex MCP → espera resultado
Mientras Codex ejecuta, NEXUS puede preparar el siguiente paso
```

---

## P1 — Secuencial (fallback universal)

No requiere setup. NEXUS ejecuta un skill, espera output,
pasa al siguiente. Siempre disponible en todas las plataformas.

Cuándo usar P1 aunque P2/P3 estén disponibles:
- Skills con dependencia de datos estricta (B necesita output de A)
- Tasks con HUMAN_ACTION_REQUIRED entre pasos
- Debugging de un pipeline fallido

---

## Decisión automática de modo

```
SI plataforma = claude-code Y subagents disponibles → P2
SI plataforma = antigravity Y codex-mcp en :9000  → P3
SI plataforma = antigravity Y n8n disponible       → P1 con AutoFlow
DEFAULT                                             → P1
```
