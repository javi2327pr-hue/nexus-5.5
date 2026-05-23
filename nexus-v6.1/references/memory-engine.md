# Memory Engine — Memoria Persistente Inter-sesión

> Módulo compartido entre NEXUS y MarketOS.
> Inspirado en claude-mem: captura → compresión → reinyección.

## Arquitectura de 3 capas

CAPA 1 — CAPTURA: Observa outputs, extrae decisiones/patrones/artefactos
CAPA 2 — COMPRESIÓN: Reduce a bloques ≤200 tokens, clasifica, fusiona
CAPA 3 — REINYECCIÓN: Carga relevante al inicio, progressive disclosure

## Formato comprimido

Prefijos: [D] decisión · [P] patrón · [E] error · [A] artefacto · [L] aprendizaje · [→] próximo

Ejemplo:
[D] Stack: NestJS 11 + Prisma 7 (confirmado 3 sesiones) — razón: equipo conoce TS
[P] Usuarios PYME prefieren onboarding sin registro obligatorio
[E] Prisma migrate falla con enums en PG 14 → solución: raw SQL
[→] Próximo: implementar landing pages por industria

## Protocolo de Captura

Qué capturar: decisiones (alta), patrones (alta), errores (alta), artefactos (media), aprendizajes (media), próximos pasos (alta)
Qué NO capturar: tokens/keys/passwords, PII, copy literal de competidores, conversación sin valor

## Protocolo de Compresión

1. Cada bloque ≤ 200 tokens
2. Eliminar redundancias entre sesiones
3. Fusionar decisiones confirmadas
4. Marcar [OBSOLETO] decisiones revertidas
5. Máximo 50 bloques activos (rotar antiguos)

## Protocolo de Reinyección

Al inicio de sesión:
1. Detectar archivo de memoria
2. Cargar resumen comprimido (máx 500 tokens)
3. Progressive disclosure: Nivel 1 auto ([D]+[→]), Nivel 2 bajo demanda (+[P]+[E]), Nivel 3 explícito (todo)
4. Presentar al usuario con opción de retomar o empezar nuevo

## Búsqueda en memoria

/memory search {query} → scoring: exacto(3pts) > parcial(2pts) > contexto(1pt) → top 5

## Almacenamiento

Claude Code: .claude/memory/{proyecto}-memory.md
Claude.ai: sección "## Memoria" en PROJECT-knowledge.md
MarketOS: sección "## Memoria" en {cliente}-client-knowledge.md

## Comandos

/memory — ver resumen | /memory search {q} — buscar | /memory flush — comprimir
/memory export — exportar .md | /memory clear — limpiar (con confirmación)
