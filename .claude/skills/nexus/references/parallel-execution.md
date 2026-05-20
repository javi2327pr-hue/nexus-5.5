# Parallel Execution — Mecanismos P1, P2, P3

Carga esta referencia cuando el plan tenga pasos de CÓDIGO independientes
que puedan ejecutarse simultáneamente en Codex o Antigravity.

---

## P1 — Subagentes Codex paralelos (Claude Code)

Lanza múltiples instancias Codex en background para tareas independientes.

```bash
# Lanzar tareas en paralelo
codex --approval-mode full-auto "Tarea A: [especificación]" &
PID_A=$!

codex --approval-mode full-auto "Tarea B: [especificación]" &
PID_B=$!

codex --approval-mode full-auto "Tarea C: [especificación]" &
PID_C=$!

# Esperar todos
wait $PID_A $PID_B $PID_C
echo "Todas las tareas completadas"
```

**Cuándo usar P1**: tareas de código totalmente independientes que no
comparten archivos ni estado. Ej: generar 3 módulos NestJS distintos.

**Precaución**: si las tareas tocan el mismo archivo → usar P2 en su lugar.

---

## P2 — Git worktrees (Claude Code)

Crea branches separados por tarea para evitar conflictos de merge.

```bash
# Crear worktrees para cada tarea
git worktree add ../task-a feature/nexus-task-a
git worktree add ../task-b feature/nexus-task-b

# Ejecutar Codex en cada worktree
(cd ../task-a && codex --approval-mode full-auto "Tarea A") &
PID_A=$!

(cd ../task-b && codex --approval-mode full-auto "Tarea B") &
PID_B=$!

wait $PID_A $PID_B

# Merge al completar
git checkout main
git merge feature/nexus-task-a
git merge feature/nexus-task-b

# Limpiar worktrees
git worktree remove ../task-a
git worktree remove ../task-b
```

**Cuándo usar P2**: tareas que modifican archivos distintos del mismo repo.
Ej: Codex genera el controller en un branch mientras genera el schema en otro.

**Si hay conflictos de merge**:
```bash
git merge --no-ff feature/nexus-task-b || git mergetool
```

---

## P3 — Orchestrator paralelo (Antigravity)

En Antigravity, usa el MCP de Codex para lanzar tareas como herramientas
nativas dentro del mismo contexto de conversación.

### Setup P3 — una sola vez

**Paso 1**: Arranca el servidor Codex MCP en una terminal separada:
```bash
codex app-server \
  --listen ws://localhost:9000 \
  --sandbox workspace-write

# Verificar que está activo:
curl -s http://localhost:9001/health && echo "✅ Codex MCP activo" || echo "❌ No activo"
```

**Paso 2**: Registra en Antigravity (crear si no existe):
```json
// .antigravity/mcp.json
{
  "mcpServers": {
    "codex": {
      "type": "url",
      "url": "ws://localhost:9000",
      "name": "codex-mcp",
      "description": "Codex CLI como herramienta nativa de Antigravity"
    }
  }
}
```

**Paso 3**: Reinicia Antigravity. El servidor `codex-mcp` aparece en el
panel de herramientas disponibles. Setup completado.

### Uso de P3 (cuando MCP está activo)

Instrucción a Antigravity:
```
[NEXUS → Antigravity Orchestrator]
Ejecuta estas tareas en paralelo vía codex-mcp:
  - Tarea A: [especificación completa]
  - Tarea B: [especificación completa]
Espera a que ambas terminen antes de continuar al Paso N+1.
```

**Cuándo usar P3**: cuando Antigravity está como plataforma y Codex MCP
está configurado. Más integrado que P1 — no requiere terminal separada.

---

## Manejo de errores en paralelo

Si una tarea falla mientras otras siguen corriendo:

```
⚠️  TAREA A falló (PID $PID_A)
Las Tareas B y C siguen ejecutándose.

¿Qué hacemos con Tarea A?
  🔄 Reintentar en paralelo con B y C
  ⏩ Marcar como omitida y continuar
  ⏸️ Pausar todo — abortar workers activos y guardar checkpoint
  ❌ Cancelar todo el pipeline
```

Para abortar workers activos:
```bash
kill $PID_B $PID_C 2>/dev/null
wait
echo "Workers abortados — checkpoint guardado"
```

---

## Selección rápida

```
¿Tareas totalmente independientes?     → P1
¿Tocan archivos del mismo repo?        → P2 (worktrees)
¿Estás en Antigravity con Codex MCP?   → P3
¿Son skills nativas (no código)?       → P4 (ver parallel-skills.md)
```
