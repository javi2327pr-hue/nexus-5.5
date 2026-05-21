# Blog Posts SEO Long-Tail — ARHINFO (Mes 2 del plan)

5 blog posts production-ready, ~6.000 palabras totales, cada uno con:
- YAML frontmatter (title, slug, description, keywords, schema)
- Internal linking a las 4 landings
- Voice colombiano + tono educativo (no marketing)
- Long-tail keywords sin competencia
- CTA suave al final

## Listado

| # | Post | Keyword principal | Internal links | Categoría editorial |
|---|---|---|---|---|
| 1 | [Soy No Responsable de IVA — Guía 2026](01-soy-no-responsable-iva-guia.md) | "soy no responsable de iva colombia" | hub + about | Educativo tributario |
| 2 | [Manejar vencimientos en droguería](02-vencimientos-drogueria-sin-perder-dinero.md) | "manejo vencimientos farmacia" | /farmacia + hub | Práctico operacional |
| 3 | [Sistema de fiado profesional](03-sistema-fiado-sin-perder-dinero.md) | "como manejar fiado tienda" | /ferreteria + /mini-market + /farmacia + hub | Cultural operacional |
| 4 | [POS sin internet en municipios colombianos](04-software-pos-sin-internet-colombia.md) | "pos sin internet colombia" | hub + 3 verticales | Técnico-cultural |
| 5 | [Vendty vs ARHINFO comparativa](05-vendty-vs-arhinfo-comparativa.md) | "vendty vs arhinfo" + "alternativa a vendty" | hub + about + 3 verticales | Comparativa directa |

## Calendario editorial sugerido (Mes 2 = Junio 2026)

```
Día 1  (Lun 1 jun):    Post #1 "Soy No Responsable de IVA — Guía 2026"
Día 15 (Lun 15 jun):   Post #2 "Manejar vencimientos en droguería"
Día 29 (Lun 29 jun):   Post #3 "Sistema de fiado"
Día 13 (Lun 13 jul):   Post #4 "POS sin internet"
Día 27 (Lun 27 jul):   Post #5 "Vendty vs ARHINFO"
```

Publicación quincenal: ritmo sostenible, da tiempo a indexación.

**Lunes** porque es el día con más búsquedas B2B en LATAM. Después del lunes, el blog post tiene 6 días para acumular tráfico antes que llegue el siguiente.

## Estrategia SEO por post

### Post 1 — Soy No Responsable de IVA (educativo)
- **Intent**: informacional (gente buscando entender su régimen)
- **Conversion**: media (educativos convierten menos directamente, pero rankean)
- **Backlinks potenciales**: alto (contadores comparten guías tributarias)
- **AEO potencial**: muy alto (ChatGPT cita guías legales bien estructuradas)

### Post 2 — Vencimientos en droguería (operacional)
- **Intent**: comercial-informacional (droguero buscando cómo mejorar gestión)
- **Conversion**: alta (problema directo → solución directa)
- **Backlinks potenciales**: medio (blogs de farmacia, INVIMA-adjacent)
- **AEO potencial**: alto (responde "cómo manejar X")

### Post 3 — Sistema de fiado (cultural)
- **Intent**: informacional-comercial
- **Conversion**: media-alta
- **Backlinks potenciales**: muy alto (post culturalmente fuerte, viral en redes LATAM SMB)
- **AEO potencial**: alto

### Post 4 — POS sin internet (técnico-cultural)
- **Intent**: comercial (gente con problema específico buscando solución)
- **Conversion**: alta (intent fuerte de compra)
- **Backlinks potenciales**: medio
- **AEO potencial**: muy alto (responde "qué necesito si X")

### Post 5 — Vendty vs ARHINFO (comparativa)
- **Intent**: comercial PURO (gente evaluando comprar)
- **Conversion**: MUY ALTA (es el bottom-funnel ideal)
- **Backlinks potenciales**: bajo (otros no lincan comparativas competitivas)
- **AEO potencial**: alto (ChatGPT/Perplexity citan comparativas)
- **Riesgo**: Vendty puede contraatacar — preparate para responder reviews/comentarios

## Implementación recomendada

### Si tu CMS es WordPress

1. Crear post nuevo en cada uno
2. Pegar el contenido entre `<body>`
3. El YAML frontmatter → mapear a campos custom o usar plugin Yoast SEO
4. Schema markup BlogPosting → usar plugin Schema & Structured Data
5. Internal linking → asegurarse que los slugs de las landings coinciden

### Si tu CMS es estático (Astro, Hugo, Jekyll)

1. Colocá cada `.md` en `content/blog/` (o equivalente)
2. El YAML frontmatter es nativo
3. Internal linking con sintaxis relativa de tu framework
4. Schema markup auto-generado por el framework

### Si tu sitio es HTML estático

1. Convertir cada post a HTML manualmente o con `pandoc`:
   ```bash
   for post in blog-posts/*.md; do
     pandoc "$post" -o "$(basename $post .md).html" --standalone --template=blog.html
   done
   ```
2. Schema markup BlogPosting → agregar manualmente en `<head>` de cada HTML

## Schema markup recomendado (agregar a cada post)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[título del post]",
  "description": "[meta description]",
  "datePublished": "[fecha]",
  "dateModified": "[fecha]",
  "author": {
    "@type": "Organization",
    "name": "ARHINFO S.A.S.",
    "url": "https://arhinfo.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ARHINFO S.A.S.",
    "logo": {
      "@type": "ImageObject",
      "url": "https://arhinfo.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://arhinfo.com/blog/[slug]"
  },
  "keywords": "[keywords del frontmatter, separadas por coma]"
}
</script>
```

## Internal linking entre los 5 posts

Después de publicar todos, agregar links entre ellos:

- Post 1 → Post 4 (NR-IVA gente le interesa POS sin internet)
- Post 1 → Post 5 (gente investigando régimen quiere comparar opciones)
- Post 2 → Post 3 (droguería con vencimientos también maneja fiado)
- Post 3 → Post 4 (fiado funciona mejor con sistema POS, y POS necesita funcionar offline)
- Post 4 → Post 1 (sin internet aplica más a NR-IVA en municipios)
- Post 5 → Post 1 (la comparativa apunta a quien aún duda su régimen)

Más una sección "Posts relacionados" al final de cada uno.

## KPIs esperados (60-90 días post-publicación)

| Métrica | Objetivo |
|---|---|
| Posts indexados en Google | 5/5 |
| Posición SERP avg primary keywords | Top 20 (mes 1), Top 10 (mes 3) |
| Tráfico orgánico combinado | 100-300 sesiones/mes después de 60 días |
| Tiempo en página avg | 3-5 minutos (señal de contenido bien hecho) |
| Bounce rate | <60% (entretenimiento + valor real reduce bounce) |
| Conversiones a demo (CTA WhatsApp) | 1-3% del tráfico (típicamente 3-10 demos/mes) |

## Anti-patterns evitados en estos posts

- ❌ Posts puramente promocionales ("ARHINFO es lo mejor")
- ❌ Keyword stuffing
- ❌ Em dashes (`—`)
- ❌ Listas sin contexto
- ❌ Conclusiones repetitivas
- ❌ Fact claims sin fuente
- ❌ Voice neutro LATAM (todos en español colombiano)
- ❌ Marketing speak ("revolucionar tu negocio", "transformación digital")

Y se aplican:
- ✅ Voice consistente
- ✅ Frases cortas
- ✅ Datos verificables (DANE, DIAN, Min TIC)
- ✅ Ejemplos concretos (Doña Marta en Mariquita, no "un cliente")
- ✅ Internal linking estratégico
- ✅ CTAs suaves al final

## Pre-publicación checklist

Antes de publicar CADA post:

- [ ] HTTP 403 arreglado (sino no se indexa, ver `../diagnose-http-403.sh`)
- [ ] Slug correcto (sin espacios, en kebab-case)
- [ ] Schema markup BlogPosting agregado al `<head>`
- [ ] Internal links verificados (los slugs de las landings existen)
- [ ] Meta description ≤160 caracteres
- [ ] Imagen destacada (puede ser placeholder al inicio, mejorar después)
- [ ] Date publicación correcta (no en futuro)
- [ ] Sitemap.xml actualizado con la nueva URL
- [ ] Google Search Console: "URL Inspection" y "Request Indexing"

## Próximos posts (Mes 3+)

Cuando estos 5 estén publicados, los siguientes podrían ser:

- "Excel vs software POS: cuándo cambiar"
- "Cómo cerrar caja al final del día (sin que te quede plata pendiente)"
- "Inventario por SKU con medidas: caso ferretería"
- "Régimen Simple de Tributación 2026: ¿me conviene?"
- "5 errores comunes del microempresario con su software contable"

Si querés que los genere, decímelo cuando estés con feedback de cuáles funcionaron del Mes 2.
