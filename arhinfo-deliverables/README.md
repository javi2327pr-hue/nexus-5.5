# ARHINFO — Deliverables MarketOS

## Acción ofensiva #1 — Landing `/pos-no-responsable-iva`

**Archivo**: [`landing-pos-no-responsable-iva.html`](./landing-pos-no-responsable-iva.html)

### Qué es

Landing page production-ready diseñada para capturar la keyword huérfana **"POS no responsable IVA Colombia"** y 5 long-tail derivadas:

- POS no responsable IVA Colombia (primaria)
- Software inventario sin factura electrónica
- POS ferretería pequeña Colombia
- Punto de venta pueblo Colombia
- POS sin internet Colombia

### Por qué funciona

| Elemento | Razón estratégica |
|---|---|
| **Hero con framing legal** | "Si sos No Responsable de IVA, ¿por qué pagás $180.000/mes por software que no necesitás?" → ataca a Vendty directamente por nombre y precio |
| **Comparativa lateral** | Tabla `ARHINFO vs Vendty vs Alegra POS vs Loyverse` con datos verificables. Resaltada visualmente la columna ARHINFO |
| **Trust block "20 años"** | Tu activo más infravalorado. Vendty 13, Alegra 14, Loyverse 12. Sos el más antiguo del mercado |
| **8 FAQ con schema** | FAQPage JSON-LD → captura featured snippets de Google + citations en ChatGPT/Perplexity/Claude (AEO) |
| **Voz colombiana** | "vos", "fiado", "WhatsApp", "mostrador" — no español neutro LATAM |
| **CTA único repetido** | "Agendar demo por WhatsApp" (link directo wa.me con texto pre-llenado) |

### Anti-patterns evitados (de la lista MarketOS)

- ❌ Hero "El mejor y más económico" (superlativo vacío) → ✅ "El POS para quienes no deben emitir factura electrónica" (específico)
- ❌ Gradiente de texto → ✅ Color sólido con weight contrast
- ❌ Cards idénticos repetidos → ✅ Steps con `grid-template-columns: 4rem 1fr` + verticals con tamaños asimétricos
- ❌ Em dashes (`—`) en copy → ✅ Reemplazados por puntos y comas
- ❌ Stock photos sonriendo → ✅ Sin imágenes decorativas (todo texto + estructura)
- ❌ Modal/popup intrusivo → ✅ CTAs inline en flujo natural
- ❌ Hero metric template ("100% satisfacción / 1000 clientes / 24/7 soporte") → ✅ Stats reales (20 años, 100% humano, 0 contratos, $0 inversión)

### Schema markup incluido

1. **Organization** — ARHINFO S.A.S. con dirección Mariquita
2. **SoftwareApplication** — Producto "The Best" con audiencia NR-IVA
3. **FAQPage** — 8 preguntas con respuestas (captura AEO)
4. **BreadcrumbList** — Navegación

### Verificación pre-deploy

Antes de subir a producción:

```bash
# 1. Validar HTML
npx html-validate landing-pos-no-responsable-iva.html

# 2. Validar schema markup
# Copiar contenido a https://validator.schema.org/

# 3. Verificar mobile-friendly
# Test en https://search.google.com/test/mobile-friendly

# 4. Verificar accesibilidad
npx pa11y landing-pos-no-responsable-iva.html

# 5. Test crawler (post-fix del 403)
curl -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
     -I https://arhinfo.com/pos-no-responsable-iva
# Esperado: HTTP/2 200
```

### Implementación

**Si tu CMS es estático (HTML directo)**:
- Subí el archivo a `arhinfo.com/pos-no-responsable-iva.html`
- Configurá redirect 301: `/pos-no-responsable-iva` → `/pos-no-responsable-iva.html`

**Si tu CMS es WordPress**:
- Crear página nueva con slug `pos-no-responsable-iva`
- Pegar contenido entre `<body>` y `</body>` en el editor HTML
- Pegar los `<script type="application/ld+json">` en el `<head>` vía plugin "Insert Headers and Footers" o equivalente
- Pegar el `<style>` igual

**Si tenés framework moderno (Next/Astro/etc.)**:
- Convertir a JSX/Astro component
- Mantener exactamente el schema JSON-LD en `<Head>` o equivalente
- Los meta tags van en el frontmatter del page

### Configuración adicional

**Sitemap.xml**: agregar entrada
```xml
<url>
  <loc>https://arhinfo.com/pos-no-responsable-iva</loc>
  <lastmod>2026-05-21</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

**robots.txt**: confirmar que NO está bloqueado
```
User-agent: *
Allow: /pos-no-responsable-iva
```

**Google Search Console**: una vez subida, hacer `URL Inspection` + `Request Indexing`

**Bing Webmaster Tools**: igual

### KPIs a medir (primeros 60 días)

| Métrica | Target Mes 1 | Target Mes 2 |
|---|---|---|
| Página indexada (Google Search Console) | Sí | — |
| Posición SERP para "POS no responsable IVA" | Top 20 | Top 5 |
| Tráfico orgánico a la landing | 50 sesiones | 200 sesiones |
| Click-through al WhatsApp CTA | 5% | 8% |
| Conversión a demo | 2 demos | 8 demos |

### Customización pendiente del cliente

Antes de subir, ARHINFO debe editar:

1. **Pricing real**: la tabla de comparativa dice "Consultá precio" — reemplazar con cifra COP si están listos a mostrarla públicamente
2. **Casos de uso**: los párrafos por vertical (ferretería/farmacia/mini-market) son genéricos. Si tienen clientes reales que dejan citar, agregar 1-2 testimonios cortos en cada bloque
3. **Imagen de OG**: `og-pos-nriva.jpg` — diseñar (puede ser texto sobre fondo de color, no necesita foto)
4. **Logo**: confirmar URL `/logo.png` existe en el dominio
5. **Sede**: confirmar dirección exacta Carrera 2A #6-20 — la sacamos de directorios públicos, validar que es la actual

### Próximos deliverables (cuando confirmes esta landing)

- [ ] Nuevo hero del home (Acción ofensiva #3)
- [ ] 3 landings vertical-specific (`/ferreteria`, `/farmacia`, `/mini-market`)
- [ ] Página About con narrativa 20 años + timeline 2005-2026
- [ ] 3 pitches email para Tiendana / Aliaddo / ProgramasContabilidad
- [ ] Diagnóstico técnico del HTTP 403

---

## Skills MarketOS aplicados en este deliverable

| Skill | Aplicación concreta |
|---|---|
| `headline-psychologist` | Hero claim con framing legal específico (no genérico) |
| `copywriting-psychologist` | Voice colombiano + frases cortas + ritmo específico |
| `social-proof-architect` | Stats reales (20 años / 0 contratos / $0 inversión) sin métricas inventadas |
| `objection-preemptor` | 8 FAQ que cubren las objeciones top del nicho |
| `ux-persuasion-engineer` | CTA único repetido, microcopy específico ("Agendar demo por WhatsApp", no "Submit") |
| `seo-schema` | 4 schemas JSON-LD: Organization + Product + FAQPage + Breadcrumb |
| `seo-aeo-landing-page-writer` | Estructura long-form + FAQ + comparativa = captura citations AEO |
| `seo-aeo-keyword-research` | 5 long-tail mapeados, todos sin dominador SEO |
| `price-psychology-strategist` | Comparativa lateral muestra $180k Vendty vs "consultá" ARHINFO (anchoring inverso) |
| `loss-aversion-designer` | "¿Por qué pagás $180.000/mes por software que no necesitás?" (framing de pérdida) |

Total: 10 skills del arsenal aplicados en una sola pieza.
