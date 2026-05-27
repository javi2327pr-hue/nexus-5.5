# Context Switching — Cambio Rápido entre Proyectos

## Problema que resuelve

Javier trabaja en 9+ proyectos semanalmente. Hoy el ciclo es:
1. Sesión lunes: ARHinfo → hot.md queda con contexto ARHinfo
2. Sesión martes: Nova → hot.md se sobreescribe con contexto Nova
3. Sesión miércoles: vuelve a ARHinfo → hot.md dice "Nova",
   tiene que esperar wiki query para restaurar contexto ARHinfo

El switch entre proyectos es lento porque hot.md solo tiene
el último contexto y NEXUS necesita hacer queries para restaurar.

## Solución: hot cache por dominio

En vez de un solo hot.md global, mantener hot snapshots por dominio:

```
wiki/
├── hot.md                      ← último contexto (cualquier dominio)
├── .hot-snapshots/             ← cache por dominio (auto-generados)
│   ├── arhinfo.hot.md          ← último contexto de ARHinfo
│   ├── nova.hot.md             ← último contexto de Nova
│   ├── abogado-ai.hot.md       ← último contexto de Abogado AI
│   └── ...
```

## Flujo de /nexus switch

```
/nexus switch arhinfo

1. GUARDAR contexto actual:
   → Copiar hot.md → .hot-snapshots/{dominio_actual}.hot.md
   → Preservar el estado de la sesión actual

2. RESTAURAR contexto del dominio target:
   SI existe .hot-snapshots/arhinfo.hot.md:
     → Copiar .hot-snapshots/arhinfo.hot.md → hot.md
     → Leer wiki/arhinfo/_index.md para contexto adicional
     → Tokens: ~500 (hot) + ~300 (_index) = ~800

   SI NO existe snapshot:
     → Crear hot.md desde wiki/arhinfo/_index.md
     → "Primera vez en este dominio esta sesión"

3. INYECTAR en NEXUS_CONTEXT:
   → contexto_previo = hot.md restaurado
   → dominio_activo = "arhinfo"
   → El routing ahora favorece skills relevantes para ARHinfo

4. REPORTAR:
   📍 Contexto cambiado: Nova → ARHinfo
   Última sesión ARHinfo: {fecha}
   Decisiones activas: {N}
   Pendientes: {N}
```

## Cuándo se guarda el snapshot

```
AUTOMÁTICO (Fase 5 post-pipeline):
  → Detectar dominio del pipeline ejecutado
  → Guardar .hot-snapshots/{dominio}.hot.md
  → Actualizar hot.md global (como siempre)

AUTOMÁTICO (al hacer /nexus switch):
  → Guardar snapshot del dominio actual antes de cambiar

MANUAL (/nexus save):
  → Guardar snapshot del dominio activo
```

## Formato del snapshot

Igual que hot.md pero con header de dominio:

```markdown
## Snapshot: ARHinfo
## Guardado: 2026-05-25T14:30:00Z

### Estado actual
Módulo de pagos — Stripe Connect integrado

### Decisiones activas
- Stripe Connect Standard para marketplace
- Redis TTL 30min para sesiones de pago
- Webhook endpoint: POST /api/webhooks/stripe

### Pendientes
- Implementar split de pagos automático
- Tests E2E del flujo de checkout

### Skills frecuentes
arch, codex, nestjs-expert
```

## Auto-switch por detección de proyecto

Si el usuario no hace /nexus switch explícitamente pero su objetivo
menciona claramente un dominio diferente al activo:

```
Dominio activo: nova (según hot.md)
Usuario: "continúa con el middleware de auth de ARHinfo"

NEXUS detecta: "ARHinfo" ≠ dominio activo "nova"
→ Auto-switch silencioso:
  1. Guardar snapshot nova
  2. Restaurar snapshot arhinfo
  3. Reportar: "📍 Detecté cambio a ARHinfo. Contexto restaurado."
  4. Continuar con el pipeline
```

## Listado de contextos

```
/nexus contexts

📍 CONTEXTOS DISPONIBLES
━━━━━━━━━━━━━━━━━━━━━━━
Activo: ★ ARHinfo (última: 2026-05-25)

Snapshots guardados:
  Nova             — última: 2026-05-24 — 3 decisiones, 2 pendientes
  Abogado AI       — última: 2026-05-20 — 1 decisión, 0 pendientes
  NEXUS Core       — última: 2026-05-25 — 5 decisiones, 1 pendiente
  Macro            — última: 2026-05-15 — 0 decisiones, 1 pendiente

Sin snapshot (nunca trabajados en v9.1):
  Súper Tiernos, Bienestar Scandi, Med Funcional, Auto IA Noruega
━━━━━━━━━━━━━━━━━━━━━━━
/nexus switch {dominio} para cambiar
```

## Comandos

| Comando | Acción |
|---|---|
| /nexus switch [dominio] | Cambiar contexto a otro proyecto |
| /nexus contexts | Listar contextos disponibles |
| /nexus context | Ver contexto activo |
