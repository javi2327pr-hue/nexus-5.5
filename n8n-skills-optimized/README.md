# n8n-skills-optimized v2 — full suite

Optimización completa de la suite [n8n-skills](https://github.com/czlonkowski/n8n-skills) (Czlonkowski) + 5 agentes adicionales para cerrar gaps (testing, observability, credentials, migration, cost), generada por `/coding-agent-skill-engineer`.

## Suite completa: 13 skills × 3 variantes = 39 archivos

```
n8n-skills-optimized/
├── README.md                       ← este archivo
├── ROUTING.md                      ← grafo Mermaid + tabla from→to entre las 13 skills
├── PATCH-NOTES.md                  ← v1 → v2 diff, scoring, breaking changes
├── AGENT-RECOMMENDATIONS.md        ← propuesta original + status de construcción
├── WATCHDOG-INTEGRATION.md         ← contrato n8n-observability-monitor ↔ watchdog-autonomous
├── claude-code/                    ← versión canónica (13 SKILL.md)
│   ├── n8n-suite-router/           ← META — orquestador
│   │
│   ├── n8n-workflow-patterns/      ← Original v2
│   ├── n8n-mcp-tools-expert/       ← Original v2 (gate skill)
│   ├── n8n-expression-syntax/      ← Original v2
│   ├── n8n-validation-expert/      ← Original v2
│   ├── n8n-node-configuration/     ← Original v2
│   ├── n8n-code-javascript/        ← Original v2
│   ├── n8n-code-python/            ← Original v2
│   │
│   ├── n8n-workflow-tester/        ← NEW — runtime test harness
│   ├── n8n-observability-monitor/  ← NEW — policy layer for watchdog-autonomous
│   ├── n8n-credentials-architect/  ← NEW — least-privilege creds + rotation
│   ├── n8n-workflow-migrator/      ← NEW — cross-instance / cross-version
│   └── n8n-cost-guardrails/        ← NEW — pre-build cost + rate-limit
├── codex/                          ← 13 variantes Codex (atómico-secuencial)
└── antigravity/                    ← 13 variantes Antigravity (goal+criteria)
```

## Las 13 skills en una línea

| # | Skill | Rol |
|---|---|---|
| 0 | `n8n-suite-router` | Dispatcher meta (entry point) |
| 1 | `n8n-workflow-patterns` | Seleccionar arquitectura antes de construir |
| 2 | `n8n-mcp-tools-expert` | Gate para todo `mcp__n8n__*` |
| 3 | `n8n-node-configuration` | Configurar nodos operation-aware |
| 4 | `n8n-expression-syntax` | Escribir `{{ }}` correctas |
| 5 | `n8n-code-javascript` | JS en Code nodes |
| 6 | `n8n-code-python` | Python (beta) — JS-first por default |
| 7 | `n8n-validation-expert` | Loop validate→fix→validate |
| 8 | `n8n-workflow-tester` ★ | Ejecutar fixtures, diff outputs, rollback |
| 9 | `n8n-observability-monitor` ★ | Triage + auto-fix post-ship (delega polling a watchdog) |
| 10 | `n8n-credentials-architect` ★ | Least-privilege + rotation + cleanup |
| 11 | `n8n-workflow-migrator` ★ | dev→prod en 6 fases (export → audit → re-map → version-diff → import → test) |
| 12 | `n8n-cost-guardrails` ★ | Estimar costo + detectar loop-over-API + proponer mitigaciones |

★ = nuevas en v2.

## Cambios clave vs v1 original

- **Reducción de tamaño**: -82% promedio en las 7 skills originales
- **Routing determinista**: bloque `## Routing` idéntico en las 13 skills
- **Meta-router**: `n8n-suite-router` resuelve competencia por auto-activación
- **Gate único declarado**: `n8n-mcp-tools-expert` (las otras 12 dicen "use AFTER")
- **5 nuevos agentes** que cierran los gaps de testing, observability, credentials, migration, cost
- **Variantes multi-agente**: Claude Code (canónica) + Codex (atómico) + Antigravity (goal-based)
- **Inconsistencias resueltas**: 5 vs 6 patrones, dedup checklist↔summary, descriptions bloat
- **Integración con infra existente**: `n8n-observability-monitor` delega polling a `watchdog-autonomous`

Score esperado: original **83%** → v2 **94%** (+11pp).

## Instalación

### Como Claude Code skills (versión canónica)

```bash
cp -r n8n-skills-optimized/claude-code/* ~/.claude/skills/
```

Las skills se auto-activan por sus `description` triggers. Para forzar el router:
```
/n8n-suite-router "build a webhook to slack workflow"
```

### Como Codex prompts

Cada `codex/<skill>/PROMPT.md` es self-contained — pegar en Codex como system instruction.

### Como Antigravity goals

Cada `antigravity/<skill>/SPEC.md` define goal + acceptance criteria — pegar como objetivo de sesión.

## Compatibilidad con archivos satélite originales

Los `.md` complementarios del repo original (`DATA_ACCESS.md`, `COMMON_PATTERNS.md`, `ERROR_PATTERNS.md`, `SEARCH_GUIDE.md`, etc.) **siguen siendo válidos y referenciados** desde los SKILL.md v2. No es necesario reescribirlos.

Para una instalación completa: copia el `claude-code/<skill>/SKILL.md` v2 + los `.md` satélite originales (solo aplica a las 7 skills originales — las 5 nuevas son self-contained).

## Composite flows (qué hace la suite end-to-end)

Ver `ROUTING.md` para los 6 composite flows documentados:

- **A** — Build + ship new webhook workflow
- **B** — Debug a failing production workflow
- **C** — Build AI Agent workflow with cost controls
- **D** — Migrate Python Code → JavaScript
- **E** — Promote workflow dev → prod (6-phase migration)
- **F** — Quarterly credential audit

## Próximos pasos sugeridos

1. **Validar v2** con 2-3 workflows reales antes de reemplazar v1
2. **Configurar watchdog-autonomous** para los workflows que quieras monitorear (ver `WATCHDOG-INTEGRATION.md`)
3. **Ejecutar audit inicial** con la nueva suite: `n8n_audit_instance` → `n8n-credentials-architect` (MIGRATE + RIGHT_SIZE + CLEANUP)
4. **Setear budgets** por workflow con `n8n-cost-guardrails` antes del próximo build

## Licencia

MIT (heredada del repo original `n8n-skills`).
