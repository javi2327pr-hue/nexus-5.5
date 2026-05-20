# MIGRATION.md — Guía de Migración a NEXUS v5.0

---

## Desde NEXUS v4.0 → v5.0

### Lo que cambia
| Elemento | v4.0 | v5.0 |
|---|---|---|
| Versión | 4.0 | 5.0 |
| Contract Validator | Manual (tú lo activas) | **Automático** |
| Paralelismo | Tabla manual | **Auto-seleccionado** |
| Estimación de tokens | Bajo/Medio/Alto genérico | **Fórmula real** |
| Worker files | No existían | **5 workers en agents/** |
| Workflow templates | No había | **3 JSON en workflow-examples.md** |
| Alertas Watchdog | Solo diagnóstico | **Proactivas + auto-deploy** |
| `/nexus status` | No existía | **Dashboard directo** |
| Rollback | No había | **Por versión de artefacto** |

### Pasos de migración

**1. Reemplaza SKILL.md**
```bash
# Backup del anterior
cp .claude/skills/nexus/SKILL.md .claude/skills/nexus/SKILL.md.bak

# Instala el nuevo
cp nexus-v5/SKILL.md .claude/skills/nexus/SKILL.md
```

**2. Añade los nuevos archivos de referencias**
```bash
cp nexus-v5/references/workflow-examples.md .claude/skills/nexus/references/
```

**3. Crea la carpeta agents/ y copia los workers**
```bash
mkdir -p .claude/agents
cp nexus-v5/agents/*.md .claude/agents/
# (o .antigravity/agents/ si usas Antigravity)
```

**4. Actualiza nexus.config.json** — añadir bloque `workers`:
```json
"workers": {
  "enabled": true,
  "available": ["market-scout", "arch", "webdev", "autoflow", "codex"]
}
```

**5. Sin cambios requeridos** en: arch.md, webdev.md, market-scout.md,
codex-bridge.md, contract-validator.md, parallel-skills.md.

---

## Desde NEXUS v3.0 → v5.0

### Lo que tenías en v3.0 y se conserva en v5.0
- ✅ Detección de plataforma (bash)
- ✅ Escaneo de skills instalados
- ✅ 4 mecanismos de paralelismo P1/P2/P3/P4
- ✅ Checkpoint en disco
- ✅ Context chaining, error recovery, dry-run
- ✅ Conflict resolution, execution log

### Lo nuevo que ganas al migrar a v5.0
- ✅ AutoFlow (n8n-MCP completo)
- ✅ Contract Validator automático
- ✅ Watchdog con alertas proactivas
- ✅ 5 worker files completos
- ✅ 3 workflow JSON templates
- ✅ Auto-selección de paralelismo
- ✅ Estimación real de tokens
- ✅ /nexus status dashboard
- ✅ Rollback por versión

### Pasos de migración desde v3.0

**1. Instalar todos los archivos nuevos**
```bash
# Reemplazar SKILL.md
cp nexus-v5/SKILL.md .claude/skills/nexus/SKILL.md

# Añadir references nuevas (conservar las existentes)
cp nexus-v5/references/autoflow.md      .claude/skills/nexus/references/
cp nexus-v5/references/watchdog.md      .claude/skills/nexus/references/
cp nexus-v5/references/contract-validator.md .claude/skills/nexus/references/
cp nexus-v5/references/workflow-examples.md  .claude/skills/nexus/references/

# Actualizar references existentes (P3 ahora tiene setup guide)
cp nexus-v5/references/parallel-execution.md .claude/skills/nexus/references/

# Crear workers
mkdir -p .claude/agents
cp nexus-v5/agents/*.md .claude/agents/
```

**2. Actualizar nexus.config.json** con los bloques `n8n` y `workers`.

**3. Verificar** escribiendo `/nexus status` — si responde con el dashboard,
la migración fue exitosa.

---

## Verificación post-migración

Escribe cualquiera de estos comandos para confirmar que v5.0 está activo:

```
/nexus status          → debe mostrar el dashboard
"crea un workflow de onboarding en n8n"
                       → debe detectar AutoFlow + mostrar plan con modo n8n
"construye el sistema completo de pagos"
                       → debe activar ARCH + Codex + AutoFlow con contrato automático
```
