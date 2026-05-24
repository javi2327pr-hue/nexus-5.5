---
name: awesome-lists-catalog
version: "1.0"
description: >
  Catálogo navegable de las 645 "awesome-lists" de sindresorhus/awesome —
  el meta-índice canónico de recursos curados para programación.
  Activa esta skill cuando el usuario pregunte "¿hay awesome-list de X?",
  "qué recursos curados existen para [tecnología]", "dame referencias top
  de [tema]", "donde encuentro lo mejor en [stack]", o cuando NEXUS
  necesite identificar una awesome-list para clonar como base de
  conocimiento de otra skill.
---

# awesome-lists-catalog — Índice de recursos curados

## Qué es esta skill

Convierte el README de `sindresorhus/awesome` (901 líneas, 645 awesome-lists
indexadas en 25+ categorías top) en una skill consultable. Cuando alguien
pregunte por recursos curados de cualquier tecnología, esta skill busca en
`references/catalog.md` y devuelve enlaces directos.

## Cuándo activarla

- "¿hay awesome-list de [X]?"
- "dame los mejores recursos sobre [tema]"
- "¿qué se usa más en [stack/lenguaje]?"
- "necesito una referencia para empezar con [tecnología]"
- NEXUS: necesita identificar una awesome-list de origen para una
  nueva skill (ej: skill `react-best-practices` ← se construye leyendo
  awesome-react)

## Cómo responder

1. **Buscar en `references/catalog.md`** por la keyword del usuario
2. **Identificar las awesome-lists relevantes** (puede haber 1-5)
3. **Devolver:** nombre + URL + descripción de 1 línea
4. **Si el usuario quiere clonar:** generar el comando `git clone` y, si
   pertinente, sugerir crear una skill nueva del repo

## Categorías top del catálogo

Platforms · Programming Languages · Front-End Development · Back-End
Development · Computer Science · Big Data · Theory · Books · Editors ·
Gaming · Development Environment · Entertainment · Databases · Media ·
Learn · Security · Content Management Systems · Hardware · Business ·
Work · Networking · Decentralized Systems · Health and Social Science ·
Events · Testing · Miscellaneous · Related (otros indexes)

## Ejemplos de uso

```
Usuario: "¿hay awesome-list de WhatsApp?"
→ Buscar "whatsapp" en catalog.md
→ Responder: "Sí: github.com/tirohia/awesome-whatsapp (bots y SDKs)"

Usuario: "recursos para empezar con SvelteKit"
→ Buscar "svelte" en catalog.md
→ Responder: "awesome-svelte: github.com/CodingDive/awesome-svelte
              (~200 recursos: components, tutoriales, templates)"

Usuario: "skills sobre Stripe payments"
→ Buscar "stripe" en catalog.md
→ Si existe: dar la awesome-list + ofrecer clonarla como base de skill
→ Si no existe: confirmarlo y sugerir alternativas relacionadas
```

## Reglas

- **NO clonar awesome-lists automáticamente.** Son 645 repos, sería absurdo
  bajar todos. Solo clonar las que el usuario solicite explícitamente.
- **NO inventar URLs.** Si una awesome-list no aparece en `catalog.md`,
  decirlo claramente — no fabricar enlaces.
- **Actualizar el catálogo** periódicamente (1 vez al año) ejecutando:
  `git clone --depth 1 https://github.com/sindresorhus/awesome /tmp/awesome
   && cp /tmp/awesome/readme.md references/catalog.md`

## Integración con NEXUS

NEXUS puede invocar esta skill cuando:
1. Un objetivo del usuario menciona un stack/tecnología poco común
2. Antes de generar una skill nueva, consulta si existe awesome-list base
3. En modo `research-only`, ofrece esta skill como complemento a market-scout

## Fuente

- Repo: https://github.com/sindresorhus/awesome
- Licencia: CC0-1.0 (dominio público)
- Catálogo capturado: ver `references/catalog.md`
