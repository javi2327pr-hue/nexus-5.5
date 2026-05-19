---
project: arhinfo
version_knowledge: "1.0"
generado: "[timestamp]"
fuente: "path | repo_url | archivos_subidos"
---

# Knowledge Base — ARHinfo
> Generado por KnowledgeBase de NEXUS v5.2
> Este archivo es consumido automáticamente por ARCH, Codex Bridge,
> AutoFlow y WEBDEV cuando trabajan en este proyecto.

---

## Stack técnico

| Componente | Tecnología | Versión |
|---|---|---|
| Runtime | Node.js | 20.x |
| Framework | NestJS | 11.x |
| ORM | Prisma | 7.x |
| Base de datos | PostgreSQL | 16.x |
| Cache | Redis | 7.x |
| Frontend | Vanilla JS | — |
| Automatización | n8n | self-hosted |

---

## Estructura de módulos

```
src/
  app.module.ts              → módulo raíz
  main.ts                    → bootstrap, puerto, CORS
  modules/
    auth/                    → JWT, refresh tokens, guards
    pos/                     → punto de venta, transacciones
    billing/                 → facturación, pagos
    users/                   → gestión de usuarios
    reports/                 → generación de reportes
  common/
    guards/                  → AuthGuard, RolesGuard
    filters/                 → GlobalExceptionFilter
    interceptors/            → LoggingInterceptor
    dto/                     → DTOs compartidos
prisma/
  schema.prisma              → esquema completo de DB
  migrations/                → historial de migraciones
```

---

## Patrones de código establecidos

### Patrón de respuesta estándar
```typescript
// Toda respuesta sigue esta estructura
return {
  success: true,
  data: result,
  meta: { timestamp: new Date(), version: '1.0' }
};

// Errores
throw new HttpException(
  { success: false, error: 'MENSAJE', code: 'ERROR_CODE' },
  HttpStatus.BAD_REQUEST
);
```

### Autenticación — JWT Guard
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Get('/endpoint')
async protectedEndpoint() { ... }
```
Todo endpoint protegido usa AMBOS guards. Nunca solo uno.

### Patrón de endpoint webhook para n8n
```typescript
@Post('/webhook/n8n/[nombre]')
@HttpCode(200)
async handleWebhook(
  @Body() payload: WebhookDto,
  @Headers('x-n8n-secret') secret: string,
): Promise<{ success: boolean; data: unknown }> {
  if (secret !== process.env.N8N_WEBHOOK_SECRET) {
    throw new UnauthorizedException();
  }
  return { success: true, data: await this.service.process(payload) };
}
```

### Transacciones Prisma
```typescript
// Para operaciones multi-tabla SIEMPRE usar transaction
const result = await this.prisma.$transaction(async (tx) => {
  const a = await tx.modelA.create({ data: ... });
  const b = await tx.modelB.update({ where: ..., data: ... });
  return { a, b };
});
```

### Caché Redis — patrón estándar
```typescript
const cacheKey = `module:entity:${id}`;
const cached = await this.redis.get(cacheKey);
if (cached) return JSON.parse(cached);
const result = await this.service.find(id);
await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
return result;
```

---

## Convenciones

| Tipo | Convención | Ejemplo |
|---|---|---|
| Archivos TS | kebab-case | `user-profile.service.ts` |
| Clases | PascalCase | `UserProfileService` |
| Variables/métodos | camelCase | `getUserById()` |
| DB columnas | snake_case | `created_at`, `user_id` |
| Env vars | SCREAMING_SNAKE | `DATABASE_URL` |
| Endpoints | kebab-case | `/user-profile/:id` |
| DTOs | `[Acción][Entidad]Dto` | `CreateUserDto` |

---

## Variables de entorno

| Variable | Tipo | Uso |
|---|---|---|
| `DATABASE_URL` | string | Conexión PostgreSQL |
| `REDIS_URL` | string | Conexión Redis |
| `JWT_SECRET` | string | Firma de tokens |
| `JWT_EXPIRES_IN` | string | TTL del token (ej: "7d") |
| `N8N_WEBHOOK_SECRET` | string | Validación webhooks n8n |
| `PORT` | number | Puerto del servidor (default: 3000) |

---

## Módulos y responsabilidades

| Módulo | Responsabilidad | Depende de |
|---|---|---|
| `auth` | JWT, refresh, roles | `users` |
| `pos` | Transacciones de venta | `auth`, `billing` |
| `billing` | Facturación, pagos | `auth` |
| `users` | CRUD de usuarios | — |
| `reports` | Generación de reportes | `pos`, `billing` |

⚠️ `billing` tiene dependencia circular con `auth` — usar `forwardRef()`.

---

## Integraciones externas detectadas

- **n8n** (self-hosted): webhooks en `/webhook/n8n/*`, secret via header
- **Redis**: caché y sesiones, TTL estándar 3600s
- **PostgreSQL**: ORM Prisma, migraciones con rollback documentado

---

## Trampas conocidas

- `billing` ↔ `auth`: dependencia circular, usar `forwardRef(() => AuthModule)`
- Migración `0012`: tiene rollback manual en `prisma/migrations/0012_rollback.sql`
- Redis en dev: si no está corriendo, el módulo de caché falla silenciosamente
- Los guards deben registrarse en orden: `JwtAuthGuard` primero, `RolesGuard` segundo

---

## Deuda técnica detectada

- `src/modules/reports/reports.service.ts:L234` — TODO: paginación pendiente
- `src/modules/pos/pos.service.ts:L89` — FIXME: race condition en stock update
- Variables de entorno sin validación con `@nestjs/config` Joi schema

---

## Notas para agentes NEXUS

### → ARCH
Stack fijo: NestJS 11 + Prisma 7 + PostgreSQL + Redis. No proponer
cambio de ORM ni de framework. Nuevos módulos deben seguir la estructura
`modules/[nombre]/[nombre].{controller,service,module}.ts`.
Dependencia circular billing↔auth resuelta con forwardRef — no duplicar.

### → Codex Bridge
Habilidades inyectadas automáticamente. Restricciones absolutas:
- NO modificar `prisma/migrations/` directamente — usar `prisma migrate dev`
- NO omitir guards en endpoints protegidos
- TODO endpoint webhook DEBE validar `x-n8n-secret`
- SIEMPRE usar `$transaction` para operaciones multi-tabla

### → AutoFlow
Webhook base: `POST /webhook/n8n/[nombre]`
Secret env var: `N8N_WEBHOOK_SECRET`
Formato respuesta del backend: `{ success: boolean, data: unknown }`
Credencial Redis disponible para workflows que necesiten caché directa.

### → WEBDEV
Frontend actual: Vanilla JS (sin framework).
Nuevas features: usar Lovable para blueprints, integrar via API REST.
Endpoints disponibles documentados en `src/modules/*/[nombre].controller.ts`.
