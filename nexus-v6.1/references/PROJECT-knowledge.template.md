# PROJECT-knowledge — [NOMBRE DEL PROYECTO]

> Generado por NEXUS KnowledgeBase · Actualizar después de cada pipeline importante

---

## Stack confirmado

| Capa       | Tecnología              | Versión | Notas                          |
|------------|-------------------------|---------|--------------------------------|
| Backend    | [NestJS / Express / …]  | X.X     |                                |
| ORM        | [Prisma / TypeORM / …]  | X.X     |                                |
| DB         | [PostgreSQL / MySQL / …]| X.X     |                                |
| Cache      | [Redis / Memcached / —] | X.X     |                                |
| Frontend   | [React / Vue / Vanilla] | X.X     |                                |
| Deploy     | [Vercel / Railway / VPS]| —       |                                |

## Dependencias clave instaladas (no proponer alternativas)

```json
{
  "dependencies": {},
  "devDependencies": {}
}
```

## Módulos existentes

```
src/
├── modules/
│   ├── [módulo-1]/    → descripción en 1 línea
│   ├── [módulo-2]/    → descripción en 1 línea
│   └── [módulo-3]/    → descripción en 1 línea
└── common/
    ├── guards/
    ├── decorators/
    └── pipes/
```

## Esquema de base de datos (resumen)

```prisma
// Modelos principales — actualizar si cambia schema.prisma
model [Modelo] {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  // ...
}
```

## Endpoints existentes

| Método | Path              | Módulo     | Auth |
|--------|-------------------|------------|------|
| GET    | /api/[recurso]    | [módulo]   | JWT  |
| POST   | /api/[recurso]    | [módulo]   | JWT  |

## Convenciones de naming

- Archivos: kebab-case (`user-service.ts`)
- Clases: PascalCase (`UserService`)
- Variables: camelCase
- DB columns: snake_case
- [añadir más si aplica]

## Archivos protegidos (Codex no debe modificar)

```
prisma/schema.prisma    ← solo ARCH puede proponer cambios
.env                    ← nunca tocar
package.json            ← listar dependencias antes de instalar
src/main.ts             ← solo para configuración global
```

## Variables de entorno disponibles (sin valores)

```
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
[añadir más]
```

## Decisiones técnicas tomadas (no reabrir)

| Decisión              | Elección      | Fecha      | Razón                  |
|-----------------------|---------------|------------|------------------------|
| ORM                   | Prisma        | [fecha]    | Type-safe + migrations |
| Cache                 | Redis         | [fecha]    | Session + queues       |
| [añadir más]          |               |            |                        |

## Notas para skills

### → AutoFlow
Endpoints disponibles para webhooks n8n:
- POST /api/webhooks/n8n → handler principal
- Validar header: x-n8n-secret = $WEBHOOK_SECRET

### → ARCH
Stack definitivo confirmado. No proponer migraciones de framework.

### → WEBDEV
Framework frontend: [React/Vanilla]. Lovable compatible ✅

### → STITCH
Framework de salida preferido: [React / Next.js]
Estilos: [Tailwind / CSS Modules]

### → Codex
Siempre usar Prisma para DB. No raw SQL.
Tests con [Jest / Vitest].
