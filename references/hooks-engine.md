# Hooks Engine — Auto-trigger con Claude Code Hooks Nativos

## Propósito
Hacer que NEXUS se active automáticamente sin que el usuario escriba
/nexus. Usa el sistema de hooks nativo de Claude Code para interceptar
acciones y disparar comportamientos inteligentes.

## Qué son los Claude Code Hooks

Claude Code soporta hooks que se ejecutan automáticamente cuando ocurren
ciertos eventos. Se configuran en .claude/settings.json bajo la clave
"hooks". Cada hook tiene un matcher (cuándo disparar) y un command
(qué ejecutar).

## Hooks que NEXUS instala

### Hook 1: Auto-context en proyectos conocidos (PreToolUse)

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "command": "cat PROJECT-knowledge.md 2>/dev/null | head -50"
      }
    ]
  }
}
```

Cuando Claude va a escribir o editar un archivo, este hook inyecta
automáticamente las primeras 50 líneas del PROJECT-knowledge.md como
contexto. Así codex-worker y cualquier skill de código siempre saben
el stack, las convenciones y los archivos protegidos sin que nadie
lo pida explícitamente.

### Hook 2: Auto-save al wiki (PostToolUse — sesiones largas)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "echo 'NEXUS_HOOK: file_modified' >> /tmp/nexus-session-tracker.log"
      }
    ]
  }
}
```

Registra cada modificación de archivo en un log temporal. Al final de
la sesión, NEXUS puede leer este log para generar el hot.md actualizado
sin que el usuario tenga que ejecutar /nexus save manualmente.

Nota: el auto-save real lo hace wiki-memory-worker en Fase 5. Este hook
solo registra qué archivos se tocaron durante la sesión.

### Hook 3: Auto-ingest de skills nuevas (Notification)

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "skill|plugin|install",
        "command": "echo 'NEXUS_HOOK: new_skill_detected' >> /tmp/nexus-session-tracker.log"
      }
    ]
  }
}
```

Cuando Claude Code notifica que se instaló algo nuevo, marca para que
en el próximo boot NEXUS ejecute auto-ingesta sin esperar a /nexus scan.

## Instalación de hooks

### `/nexus hooks install`

```bash
# Leer settings.json actual
SETTINGS="$HOME/.claude/settings.json"

# Verificar que existe
if [ ! -f "$SETTINGS" ]; then
  echo '{}' > "$SETTINGS"
fi

# Añadir hooks de NEXUS sin borrar hooks existentes
# (usar jq o python para merge seguro)
python3 -c "
import json

with open('$SETTINGS') as f:
    settings = json.load(f)

nexus_hooks = {
    'PreToolUse': [
        {
            'matcher': 'Write|Edit|MultiEdit',
            'command': 'cat PROJECT-knowledge.md 2>/dev/null | head -50'
        }
    ],
    'PostToolUse': [
        {
            'matcher': 'Write|Edit',
            'command': 'echo NEXUS_HOOK:file_modified >> /tmp/nexus-session-tracker.log'
        }
    ]
}

existing_hooks = settings.get('hooks', {})
for event, hook_list in nexus_hooks.items():
    if event not in existing_hooks:
        existing_hooks[event] = []
    # No duplicar si ya existe
    for hook in hook_list:
        if hook not in existing_hooks[event]:
            existing_hooks[event].append(hook)

settings['hooks'] = existing_hooks

with open('$SETTINGS', 'w') as f:
    json.dump(settings, f, indent=2)

print('✅ Hooks de NEXUS instalados en settings.json')
"
```

### `/nexus hooks remove`

Remueve solo los hooks de NEXUS, preservando cualquier hook que el
usuario haya configurado independientemente.

### `/nexus hooks status`

```
🔗 NEXUS HOOKS STATUS
━━━━━━━━━━━━━━━━━━━━━
PreToolUse:   ✅ Auto-context PROJECT-knowledge
PostToolUse:  ✅ Session tracker
Notification: ✅ New skill detector
━━━━━━━━━━━━━━━━━━━━━
```

## Integración con el pipeline

Los hooks NO ejecutan pipelines directamente — solo registran señales.
NEXUS las lee durante el boot (Fase 0) o al final de sesión (Fase 5):

```
Boot (Fase 0.8):
  SI existe /tmp/nexus-session-tracker.log:
    → Leer señales de la sesión anterior
    → SI hay "new_skill_detected" → ejecutar auto-ingesta
    → SI hay "file_modified" → verificar si hot.md necesita update
    → Limpiar el log temporal

Fase 5 (post-pipeline):
  → Leer session-tracker.log para conteo de archivos modificados
  → Incluir en learning-worker capture como metadata
```

## Seguridad

Los hooks solo ejecutan comandos de lectura (cat, echo, head).
Nunca ejecutan scripts arbitrarios, no instalan paquetes,
no modifican archivos del proyecto, no hacen llamadas de red.

Un hook malintencionado en settings.json podría ejecutar código
arbitrario — por eso /nexus hooks install usa merge seguro
(no sobreescribe hooks existentes del usuario).

## Comandos

| Comando | Acción |
|---|---|
| /nexus hooks install | Instalar hooks en settings.json |
| /nexus hooks remove | Remover hooks de NEXUS |
| /nexus hooks status | Ver estado de hooks |
