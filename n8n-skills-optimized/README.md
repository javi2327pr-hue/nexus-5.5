# n8n-skills-optimized v2

Optimización completa de la suite [n8n-skills](https://github.com/czlonkowski/n8n-skills) (Czlonkowski) generada por `/coding-agent-skill-engineer`.

## Qué contiene

```
n8n-skills-optimized/
├── README.md                       ← este archivo
├── ROUTING.md                      ← grafo Mermaid + tabla from→to entre skills
├── PATCH-NOTES.md                  ← v1 → v2 diff, scoring, breaking changes
├── AGENT-RECOMMENDATIONS.md        ← 5 agentes adicionales propuestos + mapping a infra existente
├── claude-code/                    ← versiones canónicas Claude Code (8 skills, ≤450 líneas c/u)
│   ├── n8n-suite-router/SKILL.md   ← NUEVA — meta-orquestador
│   ├── n8n-workflow-patterns/
│   ├── n8n-mcp-tools-expert/       ← gate skill
│   ├── n8n-expression-syntax/
│   ├── n8n-validation-expert/
│   ├── n8n-node-configuration/
│   ├── n8n-code-javascript/
│   └── n8n-code-python/
├── codex/                          ← variantes Codex (atómico-secuencial)
└── antigravity/                    ← variantes Antigravity (goals + acceptance criteria)
```

## Cambios clave vs v1

- **Reducción de tamaño**: -82% promedio (de 700+ a ~130 líneas por SKILL.md)
- **Routing determinista**: bloque `## Routing` idéntico en las 8 skills (FROM → GO TO → STAY UNTIL)
- **Meta-router nuevo**: `n8n-suite-router` resuelve la competencia por auto-activación
- **Gate único**: `n8n-mcp-tools-expert` es el único gate "always consult before"
- **Variantes multi-agente**: misma capacidad en formato Codex (atómico) y Antigravity (goal-based)
- **Inconsistencias resueltas**: 5 vs 6 patrones, duplicación checklist↔summary, descriptions bloat

Score esperado: **83% → 94%** (+11pp).

## Instalación

### Como Claude Code skills (versión canónica)

```bash
# Copiar las 8 skills al directorio de Claude Code
cp -r claude-code/* ~/.claude/skills/

# O por proyecto
cp -r claude-code/* /path/to/project/.claude/skills/
```

Las skills se auto-activan por sus `description` triggers. Para forzar el router:
```
/n8n-suite-router "build a webhook to slack workflow"
```

### Como Codex prompts

Cada `codex/<skill>/PROMPT.md` es self-contained — pegalo en Codex como system instruction o úsalo via API.

### Como Antigravity goals

Cada `antigravity/<skill>/SPEC.md` define un goal + acceptance criteria. Pegalo como objetivo de la sesión Antigravity.

## Compatibilidad con archivos satélite originales

Los archivos `.md` complementarios del repo original (`DATA_ACCESS.md`, `COMMON_PATTERNS.md`, `ERROR_PATTERNS.md`, `SEARCH_GUIDE.md`, `VALIDATION_GUIDE.md`, `WORKFLOW_GUIDE.md`, `COMMON_MISTAKES.md`, `EXAMPLES.md`, `DEPENDENCIES.md`, `OPERATION_PATTERNS.md`, `ERROR_CATALOG.md`, `FALSE_POSITIVES.md`, `BUILTIN_FUNCTIONS.md`, `STANDARD_LIBRARY.md`, `webhook_processing.md`, `http_api_integration.md`, `database_operations.md`, `ai_agent_workflow.md`, `scheduled_tasks.md`) **siguen siendo válidos y referenciados** desde los SKILL.md v2. No es necesario reescribirlos.

Para una instalación completa, copia el `claude-code/<skill>/SKILL.md` v2 + los `.md` satélite del repo original.

## Próximos pasos sugeridos

Ver `AGENT-RECOMMENDATIONS.md` — 5 agentes propuestos para cerrar gaps (testing, credentials, observability, migration, cost).

## Licencia

MIT (heredada del repo original `n8n-skills`).
