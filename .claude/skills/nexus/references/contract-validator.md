# Contract Validator — Validación de inputs/outputs entre workers

## Propósito
Verifica que cada worker recibió los inputs que necesita y produjo los outputs
que el siguiente skill espera. Se ejecuta automáticamente entre pasos del pipeline.

---

## Contratos por skill

### STITCH necesita recibir
- TAREA (obligatorio)
- PROYECTO_STITCH (obligatorio — "nuevo" si no hay)
- FRAMEWORK (obligatorio — default React)
- ESTILOS (obligatorio — default Tailwind)
- CONTEXTO_DISENO (opcional — de market-scout o webdev)

### STITCH debe producir
- STATUS (obligatorio)
- DESIGN_TOKENS (obligatorio si STATUS=DONE)
- ARCHIVOS_GENERADOS (obligatorio si STATUS=DONE)
- BLOQUEANTES (obligatorio si STATUS=BLOCKED)

### WEBDEV necesita recibir
- URL o OBJETIVO (obligatorio)
- design_tokens (opcional — de STITCH)

### WEBDEV debe producir
- blueprint (obligatorio)
- design_patterns_report (si INTENCION_DISENO=true)

### ARCH necesita recibir
- OBJETIVO o MÓDULO (obligatorio)
- stack (opcional — del PROJECT-knowledge)

### ARCH debe producir
- esquema_db (si hay DB involucrada)
- contratos_api (si hay endpoints)
- archivos_protegidos (obligatorio)

### CODEX necesita recibir
- TAREA (obligatorio)
- stack (obligatorio)
- archivos_protegidos (obligatorio)

### CODEX debe producir
- archivos_generados (obligatorio)
- STATUS (obligatorio)

### AUTOFLOW necesita recibir
- OBJETIVO del workflow (obligatorio)
- endpoints_disponibles (de ARCH — si hay integración con backend)

### AUTOFLOW debe producir
- workflows_json (obligatorio)
- webhooks_urls (si el backend los necesita)

### MARKET-SCOUT necesita recibir
- NICHO (obligatorio)
- INTENCION_DISENO (obligatorio — true/false)

### MARKET-SCOUT debe producir
- top_urls (obligatorio)
- análisis_competitivo (obligatorio)
- design_patterns_report (si INTENCION_DISENO=true)
- prompt_stitch (si INTENCION_DISENO=true)

---

## Algoritmo de validación

```
ANTES de invocar worker:
  Para cada campo obligatorio del contrato:
    SI el campo no está en NEXUS_CONTEXT → ERROR: "Falta [campo] para [skill]"
    Aplicar default si está definido (FRAMEWORK=React, ESTILOS=Tailwind, etc.)

DESPUÉS de que worker reporta:
  Para cada campo obligatorio del output:
    SI el campo no está en el output → WARNING: "Worker [skill] no produjo [campo]"
    SI STATUS=DONE y campo crítico falta → BLOCKED

Acción ante ERROR: pausar pipeline, informar al usuario qué falta
Acción ante WARNING: continuar pero registrar en nexus-log.md
```

---

## Logging

Cada validación escribe en nexus-log.md:
```
[TIMESTAMP] CONTRACT [skill] → [PASS | FAIL | WARN]
  Inputs recibidos: [lista]
  Inputs faltantes: [lista o "ninguno"]
  Outputs producidos: [lista]
  Outputs faltantes: [lista o "ninguno"]
```
