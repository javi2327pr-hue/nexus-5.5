# Pitch Emails — ARHINFO

Acción ofensiva #2 de MarketOS: 3 pitches personalizados para los 3 outlets colombianos donde Vendty/Alegra aparecen en comparativas POS y ARHINFO no.

## Estructura

```
pitch-emails/
├── README.md                         (este archivo)
├── 01-pitch-tiendana.md              Pitch para Tiendana (audience PyME emprendedor)
├── 02-pitch-aliaddo.md               Pitch para Aliaddo (audience contadores)
├── 03-pitch-programascontabilidad.md Pitch para ProgramasContabilidad (audience comparativas auditadas)
└── assets/
    ├── stats-arhinfo.md              Stats verificables ARHINFO + nicho NR-IVA
    ├── quotes-fundador.md            5 quotes pre-aprobados por uso
    └── caso-estudio-template.md      Template para conseguir caso de estudio con cliente real
```

## Estrategia por outlet

| Outlet | Ángulo | Tono | Audiencia |
|---|---|---|---|
| **Tiendana** | "POS más veterano del mercado colombiano" | Casual, periodístico, PyME-céntrico | Emprendedores y dueños de negocio pequeño |
| **Aliaddo** | "POS para NR-IVA — nicho complementario a su contabilidad" | Formal, técnico-tributario | Contadores y asesores tributarios |
| **ProgramasContabilidad** | "Ampliación legal de su comparativa con el nicho NR-IVA" | Profesional, audited, fact-driven | Dueños de negocio buscando software comparativo |

## Calendario de envío recomendado

```
Día 1 (Lunes):     Enviar Tiendana (más casual, menor barrera de respuesta)
Día 3 (Miércoles): Enviar Aliaddo
Día 5 (Viernes):   Enviar ProgramasContabilidad

Día 8-10:          Follow-up #1 a los que no respondieron
Día 15-18:         Follow-up #2 (último) si todavía sin respuesta
```

NO enviar los 3 el mismo día — si por alguna razón uno responde negativo y comenta con los otros (red de medios colombianos), tu pitch pierde fuerza.

## Pre-envío checklist

Antes de mandar CUALQUIER pitch:

### Del lado de ARHINFO (cliente)

- [ ] Reemplazar `[TU NOMBRE]` por el nombre real del fundador en los 3 pitches
- [ ] Agregar NIT real en pitch de ProgramasContabilidad (línea final)
- [ ] Verificar que `arhinfo.com` está accesible (sin HTTP 403 — sino el medio entra y queda mal)
- [ ] Si las landings ya están deployadas: incluir link específico en cada pitch
- [ ] Tener listo el asset pack (stats + quotes + caso estudio) por si responden con interés

### Del lado del asset pack

- [ ] Conseguir caso de estudio REAL con cliente activo (usar template)
- [ ] Subir logo ARHINFO en alta resolución
- [ ] Subir screenshot del producto en acción
- [ ] Validar stats (NIT, dirección, antigüedad — sacados de directorios públicos pero verificar)

### Del lado de los medios (research)

- [ ] Verificar email correcto en footer/about de cada outlet
- [ ] Si no aparece email, contactar vía form (mismo texto, pegado)
- [ ] Identificar nombre del editor si está público (mejor pitch a humano específico)

## Qué hacer si responden positivamente

### Si dicen "sí, mándanos más info":

1. Responder en menos de 24 horas
2. Enviar el `stats-arhinfo.md` + `quotes-fundador.md`
3. Si pidieron caso de estudio: el `caso-estudio-template.md` con cliente real
4. Ofrecer llamada de 15 minutos para resolver dudas

### Si dicen "sí, queremos llamada":

1. Agendar con Calendly o link directo
2. Preparar para la llamada:
   - Imprimí el pitch que les mandaste
   - Tené el asset pack abierto
   - Tené 3 quotes adicionales en caso de que pidan algo específico
   - Tené pricing claro por si preguntan
3. Tomar notas durante la llamada
4. Follow-up con email resumen post-llamada

### Si dicen "ya cerramos la edición / actualizamos en X meses":

1. Agradecer
2. Pedir agenda para futuro contacto: "¿Cuándo es mejor escribirles para la próxima actualización?"
3. Agregarlos a tu CRM con fecha de re-contacto
4. Antes de esa fecha, generar otro hook diferente (no el mismo pitch)

## Qué hacer si NO responden

### Después de 7 días → Follow-up #1

Mensaje corto (3-4 líneas) recordando el pitch. Sin tono de queja. Ofrecé valor diferente.

### Después de 14 días → Follow-up #2 (final)

Mensaje aún más corto. Acepta que quizás no es el momento. Dejá puerta abierta para futuro.

### Después de 21 días → STOP

No insistas más. Pasá a otra estrategia (otro outlet, otro ángulo, otra época del año).

## KPIs esperados (datos reales del sector PR/outreach)

| Métrica | Realista |
|---|---|
| Tasa de apertura | 30-50% |
| Tasa de respuesta | 5-15% |
| Conversión a publicación | 1-3 de los 3 outlets (en 3-6 meses) |
| Backlinks ganados | 1-3 (dofollow) |
| Tráfico estimado por menciones | 50-200 sesiones/mes durante 3-6 meses |

Si los 3 outlets te ignoran completamente, NO es failure — es probabilidad estadística. La estrategia de PR es de números: hay que pitchear a 10-15 medios para tener 1-3 publicaciones. Si querés escalar, MarketOS puede generar pitches para más outlets (LatamList, Portafolio Innovación, Semana Sostenible, GuíaTIC, El Tiempo Tecnología, etc.) — solo pedímelo.

## Anti-patrones que estos pitches EVITAN

- ❌ "Hola, ¿podrían mencionar nuestra empresa?" (pidiendo favor, no aportando valor)
- ❌ "Somos el mejor POS de Colombia" (superlativo no demostrable)
- ❌ "Tenemos un producto increíble" (claim genérico)
- ❌ Email genérico mandado a 10 medios a la vez (cero personalización)
- ❌ Adjuntar PDF de 20 páginas con "todo sobre nosotros" (nadie lo lee)
- ❌ Pedir reunión sin justificar valor del intercambio

## Anti-patrón crítico: NO mandar antes de arreglar el HTTP 403

Si un editor entra a arhinfo.com y le devuelve 403, **inmediatamente piensa "sitio roto" y descarta el pitch**. Esto es una de las razones por las que el fix del 403 es prerequisito de TODA la estrategia de visibilidad.

Antes de enviar los pitches, ejecutá:

```bash
bash ../diagnose-http-403.sh
```

Si Googlebot da 200, los humanos también. Recién entonces, enviar.
