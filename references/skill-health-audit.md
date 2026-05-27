# Skill Health Audit — Auditoría Profunda de la Bodega

## Problema que resuelve

1,446 skills en warehouse/ pero nunca se ha auditado:
- ¿Cuántas son duplicadas o casi-duplicadas?
- ¿Cuántas son obsoletas (frameworks muertos, versiones viejas)?
- ¿Cuántas son irrelevantes para el stack actual del usuario?
- ¿Hay gaps — áreas importantes sin skills?
- ¿Cuántas skills nunca se han usado?

Una bodega limpia = routing más preciso = pipelines más exitosos.

## Tipos de auditoría

### 1. Duplicados (similitud por nombre + keywords)

```
Escanear catalog/{módulo}.json buscando:
  - Nombres similares: "database" vs "database-admin" vs "database-architect"
  - Keywords solapados: >80% keywords en común = probable duplicado
  - Misma funcionalidad en distintos módulos

Output:
  🔍 DUPLICADOS DETECTADOS
  Grupo 1: database-* (3 skills en databases/)
    - database (generic)
    - database-admin (administración)
    - database-architect (diseño)
    → Recomendación: fusionar en 1 skill completa o mantener las 3
       con keywords diferenciados

  Grupo 2: skill-* (9 skills en custom/)
    - skill-audit, skill-check, skill-creator, skill-creator-ms,
      skill-developer, skill-improver, skill-installer, skill-optimizer,
      skill-scanner
    → Recomendación: auditar cuáles tienen funcionalidad única
       vs cuáles son versiones anteriores de lo mismo
```

### 2. Obsoletas (frameworks muertos, versiones viejas)

```
Flags de obsolescencia:
  - Menciona versiones específicas viejas (React 16, Angular 8, Python 2)
  - Framework abandonado (jQuery para SPAs, Backbone, etc.)
  - Último uso: never + creación: >6 meses
  - Keywords que ya no aplican al stack del usuario

Output:
  ⚠️ POSIBLEMENTE OBSOLETAS
  - angular-migration (Angular 8→9, usuario usa React/Next)
  - jquery-* (framework legacy)
  - python-2-* (EOL hace años)
  → Recomendación: mover a warehouse/_archived/ o eliminar
```

### 3. Irrelevantes para tu stack

```
Stack confirmado del usuario (de NEXUS System Map):
  ✅ Backend: NestJS 11, Prisma 7, PostgreSQL, Redis
  ✅ Frontend: React, Tailwind, vanilla JS
  ✅ Mobile: React Native / Expo
  ✅ Automatización: n8n, Make, Zapier
  ✅ IA: Claude, OpenAI

Skills irrelevantes para este stack:
  - azure-* (usa AWS o ninguna cloud explícita)
  - gcp-* (ídem)
  - ruby-* (no usa Ruby)
  - flutter-* (usa React Native)
  - django-* (usa NestJS)
  → Recomendación: NO eliminar pero bajar prioridad en routing
     (reputation_score = 0.3 por irrelevancia de stack)
```

### 4. Gap analysis (qué falta)

```
Basándose en los 9 dominios de negocio del usuario:

Gaps detectados:
  ARHinfo POS:
    ✅ NestJS, Prisma, PostgreSQL, Redis — cubiertos
    ❌ POS-specific patterns (no hay skill de sistemas POS)
    ❌ Payment gateway testing (Stripe test mode)

  Abogado AI:
    ✅ RAG patterns — cubiertos en ai-agents/
    ❌ Norwegian legal terminology (no hay skill)
    ❌ UDI API integration (no hay skill)

  Nova (suplementos):
    ✅ E-commerce patterns — cubiertos
    ❌ Supplement regulations (FDA/INVIMA) — parcial en verticals/
    ❌ Health claims compliance

→ Recomendación: crear skills custom para gaps críticos
```

### 5. Never-used (skills dormidas)

```
Skills con times_used = 0 Y reputation = null:
  → 67% de la bodega nunca se ha activado
  → No significa que sean malas, pero el routing debería
     priorizar skills con historial comprobado

Output:
  📊 USO DE BODEGA
  Usadas ≥5 veces:    ~50 skills (3.5%)
  Usadas 1-4 veces:   ~200 skills (13.8%)
  Nunca usadas:        ~1,196 skills (82.7%)
  → Recomendación: no eliminar, pero no dar bonus en routing
```

## Niveles de auditoría

```
/nexus audit quick
  → Solo duplicados + never-used (5 minutos, ~500 tokens)

/nexus audit standard
  → Duplicados + obsoletas + never-used (15 minutos, ~2,000 tokens)

/nexus audit deep
  → Todo: duplicados + obsoletas + irrelevantes + gaps + never-used
  → Activar Sequential Thinking si disponible
  → (30-45 minutos, ~5,000 tokens)
```

## Output de la auditoría

```
📋 SKILL HEALTH AUDIT — {nivel}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total skills:        1,446
Duplicados:          {N} grupos ({M} skills afectadas)
Posiblemente obsoletas: {N}
Irrelevantes al stack:  {N}
Gaps detectados:     {N} áreas sin cobertura
Nunca usadas:        {N} ({X}%)

Salud general: {score}/100
  Diversidad: ✅ 16 módulos cubiertos
  Duplicación: ⚠️ {X}% de solapamiento
  Relevancia: ⚠️ {X}% irrelevante al stack actual
  Cobertura: ❌ {N} gaps en dominios de negocio

Acciones sugeridas:
  1. Fusionar {N} grupos de duplicados
  2. Archivar {N} skills obsoletas
  3. Crear {N} skills para gaps detectados
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Acciones post-auditoría

```
/nexus audit fix duplicates
  → Presenta cada grupo de duplicados
  → El usuario elige cuáles fusionar/eliminar
  → NEXUS ejecuta las fusiones

/nexus audit archive obsoletes
  → Presenta skills obsoletas
  → El usuario confirma
  → Mover a warehouse/_archived/ (no eliminar)

/nexus audit deprioritize irrelevant
  → Bajar reputation_score de skills irrelevantes al stack
  → No eliminar (pueden ser útiles en proyectos futuros)
```

## Comandos

| Comando | Acción |
|---|---|
| /nexus audit quick | Auditoría rápida (duplicados + nunca usadas) |
| /nexus audit standard | Auditoría estándar (+ obsoletas) |
| /nexus audit deep | Auditoría profunda (todo + ST si disponible) |
| /nexus audit fix duplicates | Resolver duplicados interactivamente |
| /nexus audit archive obsoletes | Archivar obsoletas |
| /nexus audit deprioritize irrelevant | Bajar prioridad de irrelevantes |
| /nexus audit gaps | Solo mostrar gaps de cobertura |
