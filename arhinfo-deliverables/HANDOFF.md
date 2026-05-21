# ARHINFO — Handoff de ejecución

**Estado del proyecto MarketOS**: pausado en ejecución (Mes 1 y Mes 2 producidos completos).

**Fecha**: 2026-05-21
**Cliente**: ARHINFO S.A.S. (arhinfo.com)
**Estrategia**: captura del whitespace NR-IVA + reposicionamiento + visibilidad técnica

---

## 📊 Resumen ejecutivo

```
PLAN 30/60/90    Status      Entregables producidos
───────────────  ──────────  ────────────────────────────────────────
DESBLOQUEADOR    ✅ Listo    Script diagnóstico + guía 7 fixes
MES 1            ✅ Listo    4 landings + Home + About + 3 pitches
MES 2            ✅ Listo    5 blog posts SEO long-tail
MES 3            ⏳ Pausado  WhatsApp + referidos + Google Ads
```

**Total producido**: 18 archivos, ~5.900 líneas, ~12.000 palabras.

---

## 🎯 Orden de ejecución (priorizado)

### Paso 1 — DESBLOQUEADOR (esta semana) 🔴 CRÍTICO

**Sin esto, nada de lo demás importa.** Si el HTTP 403 sigue activo, ni Google, ni AI search engines, ni los editores de medios podrán ver tu sitio.

```bash
# Ejecutar en tu máquina con acceso a internet (o desde el servidor)
bash arhinfo-deliverables/diagnose-http-403.sh --verbose
```

Resultados:
- Si Googlebot da **403** → leé `fix-http-403-guide.md` y aplicá el fix que corresponda a tu stack (60% probabilidad: Cloudflare Bot Fight Mode)
- Si Googlebot da **200** ya → no hay 403 crítico, podés saltar al Paso 2

Tiempo estimado: 30-90 minutos con tu técnico.

### Paso 2 — Customizar placeholders (esta semana)

Antes de deployar, ajustar:

#### En `about-page.html`:
- [ ] Reemplazar `[NOMBRE FUNDADOR]` (5 ocurrencias)
- [ ] Subir foto del fundador a `/team/founder.jpg`
- [ ] Validar hitos del timeline (2008/2012/2016 son aproximados, ajustar si tenés fechas reales)
- [ ] Confirmar dirección Carrera 2A #6-20 sigue actual

#### En las 4 landings (`landing-*.html`):
- [ ] Reemplazar "Consultá precio" en tabla comparativa con tu pricing real (opcional, sino dejá "consultá")
- [ ] Agregar 1-2 testimonios reales por vertical (placeholder ahora es genérico)
- [ ] Subir imagen OG (`og-pos-nriva.jpg`, `og-ferreteria.jpg`, etc.) — pueden ser texto sobre fondo, no necesitan foto

#### En los 3 pitches email:
- [ ] Reemplazar `[TU NOMBRE]` con tu nombre real
- [ ] Agregar NIT real en pitch de ProgramasContabilidad

#### En los 5 blog posts:
- [ ] (Ninguna customización requerida — todo se basa en datos verificables)

Tiempo estimado: 1-2 horas.

### Paso 3 — Conseguir caso de estudio real (esta semana)

Necesario para los testimonios en landings + pitches.

```
1. Elegí 5 clientes activos hace +5 años (variando verticales)
2. Mandales el WhatsApp del template en pitch-emails/assets/caso-estudio-template.md
3. Hacé entrevistas de 15 min
4. Redactá 3-5 casos cortos (200-300 palabras cada uno)
5. Confirmá con el cliente antes de publicar
```

Tiempo estimado: 2-3 horas distribuidas en 1 semana.

### Paso 4 — Deployar Mes 1 (semana 2)

Orden de deploy:

**Día 1**:
- Subir landing hub `/pos-no-responsable-iva`
- Submit a Google Search Console + Bing Webmaster

**Día 2**:
- Subir las 3 landings vertical (`/ferreteria`, `/farmacia`, `/mini-market`)
- Actualizar sitemap.xml con las 4 URLs nuevas
- Agregar internal linking entre el header/nav y las landings

**Día 3**:
- Reemplazar HERO actual del home con `home-hero-and-sections.html`
- Subir página About en `/sobre-nosotros`

**Día 4-5**:
- Listings en directorios (Guía TIC + ComparaSoftware Colombia + Capterra + GetApp + SoftwareSuggest)
- Pitch #1 (Tiendana) — vía email

**Día 6-7**:
- Pitch #2 (Aliaddo)
- Pitch #3 (ProgramasContabilidad)

Tiempo estimado: 8-12 horas distribuidas en 1 semana.

### Paso 5 — Deployar Mes 2 (semanas 5-8)

Calendario quincenal sugerido:

```
Lun semana 5:  Publicar Post #1 (NR-IVA guía)
Lun semana 7:  Publicar Post #2 (vencimientos droguería)
Lun semana 9:  Publicar Post #3 (sistema de fiado)
Lun semana 11: Publicar Post #4 (POS sin internet)
Lun semana 13: Publicar Post #5 (Vendty vs ARHINFO)  ← bottom-funnel
```

Por cada post:
- [ ] Importar al CMS
- [ ] Agregar schema markup BlogPosting
- [ ] Validar internal links a las landings (que existan en el sitio)
- [ ] Solicitar indexación en Google Search Console
- [ ] Compartir en Instagram + WhatsApp Status + LinkedIn personal

Tiempo estimado: 1 hora por post + promoción.

---

## 📈 Métricas a trackear

Setup recomendado en Google Search Console + Google Analytics 4:

### Semana 1 — Foundation metrics
- Páginas indexadas en GSC (objetivo: 4 landings + 4 blog posts = 12 mínimo)
- Errores de crawl (objetivo: 0)
- Mobile usability (objetivo: 100% mobile-friendly)

### Mes 1-2 — Visibility metrics
- Posición SERP para "POS no responsable IVA Colombia" (objetivo: Top 20 mes 1, Top 5 mes 3)
- Posición SERP para "Software POS ferretería Colombia" (Top 30, luego Top 15)
- Apariciones en directorios (objetivo: 3 listados confirmados mes 1, 6 mes 2)

### Mes 2-3 — Engagement metrics
- Tráfico orgánico total (objetivo: 100 sesiones/día mes 2, 200 sesiones/día mes 3)
- Bounce rate por landing (objetivo: <60%)
- Tiempo en página avg (objetivo: >2 min)
- Conversiones a WhatsApp (objetivo: 5% click-to-CTA mes 1, 10% mes 3)

### Mes 3 — Pipeline metrics
- Demos agendadas vía WhatsApp (objetivo: 20-30/mes)
- Conversion demo → cliente (objetivo: 25-40%)
- CAC (objetivo: <$20 USD)

---

## ❓ Qué traer cuando vuelvas (para retomar MarketOS)

### Después del Paso 1 (fix HTTP 403)

```
Output del comando:
   bash arhinfo-deliverables/diagnose-http-403.sh --verbose

Me decís cuál fix aplicaste (Cloudflare, .htaccess, etc.) y si Googlebot
ya devuelve 200.
```

### Después del Paso 4 (Mes 1 deployado)

```
1. URLs vivas de las 4 landings + Home + About
2. Páginas indexadas en GSC (screenshot)
3. Responses de los 3 pitches (positivos, negativos, sin respuesta)
4. Cualquier review/feedback que te dieron clientes/contactos
```

### Después del Paso 5 (Mes 2 deployado, ~3 meses)

```
1. Top 3 keywords donde rankeás (de las 17 mapeadas en MarketOS)
2. Demos agendadas vía WhatsApp (cuántas, de qué vertical, qué preguntan)
3. Conversiones reales (cuántos clientes nuevos en estos 90 días)
4. Qué blog post tuvo más tracción
5. Si Vendty/Alegra reaccionaron (mencionaron tu sitio, lanzaron features, etc.)
```

Con esa data, MarketOS puede:
- Refinar el Mes 3 (WhatsApp + referidos + Google Ads) con tus datos reales
- Producir más contenido en los temas que funcionaron
- Pivotar si algo no funcionó como esperábamos
- Detectar nuevos whitespaces que aparecieron con los datos

---

## 🔄 Memoria MarketOS actualizada

El estado de este análisis está guardado en:

```
/root/.claude/skills/marketos/
├── marketos.config.json                       (v1.2 con cliente arhinfo)
├── references/
│   ├── arhinfo-client-knowledge.md            (v3.0 — datos verificados completos)
│   └── marketos-skill-arsenal.md              (catálogo de skills disponibles)
└── agents/
    └── researcher-worker.md                   (usado 3 veces en esta sesión)
```

En tu próxima sesión, cuando invoques `ACTIVAR MARKETOS`, automáticamente:
1. Reconocerá el cliente "arhinfo"
2. Cargará todo el contexto (competidores, wedge, plan)
3. Preguntará "¿cómo fue la ejecución del Mes 1?"
4. Continuará desde donde quedamos

No tenés que repetir nada.

---

## 🧭 Si necesitás ayuda intermedia (antes de retomar formal)

Estos son escenarios y qué hacer en cada uno:

### Escenario: "El HTTP 403 no lo arregla mi hosting"

→ Usar el email template del `fix-http-403-guide.md` para escalar.
→ Si después de 1 semana sigue, considerar cambio de hosting (opciones en la guía).
→ MarketOS puede ayudarte a pedir presupuestos de hosting si lo necesitás.

### Escenario: "Un editor respondió pero pide algo que no tengo"

→ Mirá `pitch-emails/assets/` — probablemente está cubierto.
→ Si pide algo específico (foto del fundador, NIT, demos en video, etc.), generálo manualmente.
→ Si pide entrevista, prepará respuestas a partir de los `quotes-fundador.md`.

### Escenario: "Vendty / Alegra reaccionó con un artículo agresivo"

→ NO responder con contraataque directo.
→ Publicar un blog post adicional con tu data verificable (MarketOS puede producirlo).
→ Mantenerse en tu nicho (NR-IVA) — no salir a competir en su territorio.

### Escenario: "Los pitches no responden ninguno"

→ Es estadística: 5-15% response rate es normal.
→ MarketOS puede producir 3-5 pitches adicionales (LatamList, Portafolio, Semana Sostenible, GuíaTIC, etc.)
→ Considerar paid placements (no recomendado) o nueva ola de outreach con ángulo distinto.

### Escenario: "El SEO no rankea después de 60 días"

→ Re-ejecutar diagnostic HTTP 403 (puede haberse re-activado)
→ Verificar que el schema markup esté correcto (validator.schema.org)
→ MarketOS puede generar 3-5 backlinks adicionales (guest posts, directorios)

---

## ✅ Pre-flight checklist final

Antes de cerrar esta sesión y empezar ejecución:

- [ ] Cloné/descargué el branch `claude/install-nexus-skill-f8vKi` con todos los deliverables
- [ ] Tengo acceso a mi servidor/CMS para hacer cambios
- [ ] Tengo acceso a Google Search Console + Google Analytics 4 (o los configuré)
- [ ] Tengo WhatsApp Business activo (necesario para los CTAs y pitches)
- [ ] Tengo claros los 5 pasos de ejecución y el orden
- [ ] Sé que el HTTP 403 es desbloqueador crítico (Paso 1 = primero)
- [ ] Tengo timeline realista (~3 meses para ver resultados completos)

---

## 📞 Contacto MarketOS (para retomar)

Cuando vuelvas con data, simplemente abrí una nueva sesión y decí:

```
ACTIVAR MARKETOS — actualización cliente arhinfo
```

MarketOS reconocerá el cliente, cargará el estado v3.0, y te preguntará por la data específica.

Suerte con la ejecución. La estrategia es sólida — sólo falta ejecutarla.

— **MarketOS v1.0**, sesión 2026-05-21
