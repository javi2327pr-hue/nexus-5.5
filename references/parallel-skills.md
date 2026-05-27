# Parallel Skills — Workers P4

## Cuándo usar P4

P4 es para skills que son verdaderamente independientes entre sí
y pueden ejecutarse en paralelo sin necesidad de los outputs del otro.

Ejemplo válido para P4:
- market-scout (investigar nicho) + arch (revisar stack existente)
  → son independientes, pueden correr al mismo tiempo

Ejemplo NO válido para P4:
- stitch (leer diseño) + codex (implementar)
  → Codex NECESITA los design_tokens de Stitch → deben ser secuenciales

---

## Estructura de instrucción a worker P4

```
Execute this task:
- Skill path: <path-to-skill-reference>
- Task: <eval prompt con toda la información necesaria>
- NEXUS_CONTEXT: <key_data de pasos anteriores relevantes>
- Save outputs to: .nexus/workers/<skill>-output.json
- Report back: STATUS + key_data cuando termines
```

---

## Skills disponibles para P4

| Skill         | Independiente de           | Depende de              |
|---------------|----------------------------|-------------------------|
| market-scout  | todos                      | —                       |
| arch          | market-scout, stitch       | PROJECT-knowledge       |
| webdev        | arch, autoflow             | stitch (si hay diseño)  |
| stitch        | arch, autoflow             | market-scout (opcional) |
| autoflow      | webdev, stitch             | arch (contratos_api)    |
| knowledge     | todos                      | outputs de todos        |

---

## Limitaciones P4

| Limitación                                | Solución                              |
|-------------------------------------------|---------------------------------------|
| Subagents no lanzan otros subagents       | NEXUS orquesta desde nivel principal  |
| Contexto no compartido en tiempo real     | Pasar key_data explícito en instrucción |
| Consumo ~7x mayor de tokens              | Usar solo cuando el ahorro lo justifica |
| HUMAN_ACTION_REQUIRED no funciona en P4  | Ese step debe ser secuencial (P1)     |

---

## Fallback si worker no está instalado

```
SI .claude/agents/[skill]-worker.md no existe:
  Opciones:
  A) Instalar: cp nexus-v56/agents/[skill]-worker.md .claude/agents/
  B) Ejecutar [skill] secuencialmente en su lugar (P1)
  C) Omitir esta sub-tarea del plan
```
