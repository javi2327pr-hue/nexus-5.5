# Contract Validator — Validador de Contratos AutoFlow ↔ Codex Bridge

Se activa cuando **AutoFlow** (workflow n8n) y **Codex Bridge** (código
backend) trabajan juntos en el mismo pipeline. Su función: asegurar que
el workflow y el backend hablan el mismo idioma antes de hacer deploy.

---

## Cuándo activar

```
AutoFlow produce:  webhook URL, payload enviado, headers esperados
Codex produce:     endpoint URL, payload aceptado, headers requeridos
→ Contract Validator compara y detecta inconsistencias
```

---

## Contrato a validar

### 1. URL del endpoint
```
AutoFlow dice que llama a:  https://api.example.com/v1/[path]
Codex genera endpoint en:   [path en el backend]
✅ Match | ❌ Mismatch → reportar diferencia
```

### 2. Método HTTP
```
AutoFlow usa:   POST | GET | PUT | PATCH | DELETE
Codex acepta:   [método en el controlador]
✅ Match | ❌ Mismatch
```

### 3. Payload / body
```
AutoFlow envía: { campo1: tipo, campo2: tipo, ... }
Codex espera:   { campo1: tipo, campo2: tipo, ... }

Verificar:
- Todos los campos requeridos por el backend están presentes en el envío
- Tipos compatibles (string vs number vs object)
- Campos opcionales documentados
```

### 4. Headers
```
AutoFlow incluye: Content-Type, Authorization, x-custom-header
Codex valida:     [middleware de validación de headers]
✅ Todos presentes | ❌ Falta: [lista]
```

### 5. Respuesta esperada
```
Codex retorna:        { success: bool, data: object, error?: string }
AutoFlow procesa:     [nodo Set o Code que parsea la respuesta]
✅ Compatible | ❌ AutoFlow espera campo que Codex no retorna
```

---

## Reporte de validación

```
╔══════════════════════════════════════════╗
║     CONTRACT VALIDATION REPORT           ║
╠══════════════════════════════════════════╣
║ AutoFlow  → workflow.json (Paso N)       ║
║ Codex     → api.ts (Paso M)              ║
╠══════════════════════════════════════════╣
║ URL        : ✅ Match                    ║
║ Método     : ✅ POST en ambos            ║
║ Payload    : ⚠️  Campo 'userId' faltante  ║
║ Headers    : ✅ Authorization presente   ║
║ Response   : ❌ AutoFlow espera 'result' ║
║              Codex retorna 'data'        ║
╠══════════════════════════════════════════╣
║ ACCIÓN REQUERIDA:                        ║
║  → Corregir campo en AutoFlow: Paso N    ║
║  → O renombrar en Codex: Paso M          ║
╚══════════════════════════════════════════╝
```

Si hay errores: NEXUS pausa el pipeline y muestra el reporte antes de
continuar. El usuario decide cuál lado corregir.

---

## Output a NEXUS_CONTEXT

```
{
  contrato_validado: true | false,
  errores: [ { campo, esperado, recibido, ubicacion } ],
  advertencias: [ ... ],
  accion_sugerida: string
}
```
