# warehouse-worker — Gestión de Bodega Física de Skills

## Rol
Gestionar la bodega física en `~/.claude/warehouse/`. Mueve skills fuera
de `~/.claude/skills/` para que Claude Code NO las cargue al contexto,
y las trae de vuelta temporalmente cuando NEXUS las necesita en un pipeline.

## Principio
```
~/.claude/skills/     → SOLO nexus/ + skills activas del pipeline actual
~/.claude/warehouse/  → 1700+ skills dormidas, organizadas por módulo
~/.claude/catalog/    → índice que sabe dónde está cada skill (skills/ o warehouse/)
```

Claude Code solo carga lo que está en `~/.claude/skills/`.
Si una skill está en `warehouse/`, Claude Code no la ve = 0 tokens.

---

## Operaciones

### INIT — Primera vez (/nexus warehouse init)

Reorganiza TODO el ecosistema. IRREVERSIBLE sin backup.

```bash
#!/bin/bash
# 1. Crear estructura de warehouse por módulo
mkdir -p ~/.claude/warehouse/{ai-agents,python,js-ts,languages,cloud-devops,security,data-ml,databases,seo-marketing,design-frontend,automation-saas,business,verticals,testing-qa,custom,plugins}

# 2. Backup de seguridad
cp -r ~/.claude/skills/ ~/.claude/skills-backup-$(date +%Y%m%d)/

# 3. Para cada skill (excepto nexus):
for skill_dir in ~/.claude/skills/*/; do
  skill_name=$(basename "$skill_dir")

  # NUNCA mover nexus
  if [ "$skill_name" = "nexus" ]; then
    continue
  fi

  # Determinar módulo desde catalog
  module=$(python3 -c "
import json, sys
for f in glob.glob('~/.claude/catalog/*.json'):
    cat = json.load(open(f))
    for entry in cat.get('entries', []):
        if entry['name'] == '$skill_name':
            print(cat['module_id'])
            sys.exit(0)
print('custom')  # fallback
  ")

  # Mover a warehouse
  mv "$skill_dir" "~/.claude/warehouse/$module/$skill_name/"

  # Actualizar catálogo: path ahora apunta a warehouse
  # catalog-ingest-worker actualiza el JSON

done

# 4. Verificar que solo queda nexus en skills/
ls ~/.claude/skills/
# Debería mostrar SOLO: nexus/

# 5. Actualizar catalog-root.json con location=warehouse
```

**Tiempo estimado**: 1-3 minutos para 1700 skills.
**Resultado**: `~/.claude/skills/` pasa de ~80,000 tokens a ~400 tokens al boot.

### ACTIVATE — Traer skill del warehouse al pipeline

```bash
# Llamado por NEXUS cuando el routing selecciona un skill
activate_skill() {
  local skill_name="$1"
  local module="$2"
  local source="~/.claude/warehouse/$module/$skill_name"
  local target="~/.claude/skills/$skill_name"

  # Verificar que existe en warehouse
  if [ ! -d "$source" ]; then
    echo "ERROR: $skill_name no encontrado en warehouse/$module/"
    return 1
  fi

  # Verificar que NO está ya activo
  if [ -d "$target" ]; then
    echo "INFO: $skill_name ya está activo"
    return 0
  fi

  # Crear symlink (no copiar — más rápido y no duplica)
  ln -s "$source" "$target"

  echo "ACTIVATED: $skill_name (symlink desde warehouse/$module/)"
}
```

**Usa symlinks, no copia.** Instantáneo y sin duplicar archivos.

### DEACTIVATE — Devolver skill al warehouse

```bash
deactivate_skill() {
  local skill_name="$1"
  local target="~/.claude/skills/$skill_name"

  # NUNCA desactivar nexus
  if [ "$skill_name" = "nexus" ]; then
    echo "BLOCKED: nexus nunca se desactiva"
    return 1
  fi

  # Verificar que es un symlink (no mover skills reales)
  if [ -L "$target" ]; then
    rm "$target"  # solo remueve el symlink
    echo "DEACTIVATED: $skill_name (symlink removido)"
  elif [ -d "$target" ]; then
    echo "WARNING: $skill_name no es symlink — es real. No se toca."
    return 1
  fi
}
```

### DEACTIVATE_ALL — Limpieza post-pipeline

```bash
deactivate_all() {
  for link in ~/.claude/skills/*/; do
    name=$(basename "$link")
    if [ "$name" = "nexus" ]; then continue; fi
    if [ -L "$link" ]; then
      rm "$link"
    fi
  done
  echo "CLEANUP: todos los symlinks removidos. Solo queda nexus/"
}
```

### STATUS — Ver qué está activo

```bash
warehouse_status() {
  echo "=== ACTIVOS (en ~/.claude/skills/) ==="
  for d in ~/.claude/skills/*/; do
    name=$(basename "$d")
    if [ -L "$d" ]; then
      echo "  🔗 $name (symlink → warehouse)"
    else
      echo "  📌 $name (permanente)"
    fi
  done

  echo ""
  echo "=== WAREHOUSE (dormidos) ==="
  for module in ~/.claude/warehouse/*/; do
    mod=$(basename "$module")
    count=$(ls -d "$module"*/ 2>/dev/null | wc -l)
    echo "  📦 $mod: $count skills"
  done
}
```

---

## Integración con NEXUS pipeline

### Al inicio del pipeline (Fase 2):
```
Para cada skill/agente seleccionado por el routing:
  1. Buscar en catálogo → obtener module_id y path
  2. ¿path apunta a warehouse/?
     SÍ → activate_skill(name, module)
     NO → ya está en skills/, no hacer nada
  3. Cargar el .md bajo demanda (ya existente en v7.1)
```

### Al final del pipeline (Fase 5):
```
  1. deactivate_all()  → limpiar symlinks
  2. Solo nexus/ queda en skills/
  3. Próximo boot = ~400 tokens
```

### Error: skill no encontrado
```
SI activate_skill falla:
  1. ¿Está en warehouse/ pero en otro módulo? → buscar en todos
  2. ¿No está en warehouse/ ni en skills/? → fue eliminada
     → Remover del catálogo
     → Reportar: "⚠️ {name} no encontrada. Removida del catálogo."
```

---

## Seguridad

1. **NUNCA mover nexus/** — siempre permanente en skills/
2. **NUNCA mover skills con `mv`** durante un pipeline activo — solo symlinks
3. **Backup antes de init** — `skills-backup-{fecha}/` automático
4. **Verificar symlinks** — solo remover symlinks, nunca directorios reales
5. **Restore**: si algo falla → `cp -r ~/.claude/skills-backup-{fecha}/ ~/.claude/skills/`

---

## Comandos del warehouse

| Comando | Acción |
|---|---|
| /nexus warehouse init | Mover 1700 skills a warehouse/ (primera vez) |
| /nexus warehouse status | Ver activos vs dormidos |
| /nexus warehouse activate [name] | Traer skill manualmente |
| /nexus warehouse deactivate [name] | Devolver skill |
| /nexus warehouse cleanup | Remover todos los symlinks |
| /nexus warehouse restore | Restaurar backup completo |
| /nexus warehouse verify | Verificar integridad (symlinks rotos) |
