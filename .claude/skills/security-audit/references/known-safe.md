# Known Safe — Whitelist de Referencias Verificadas v2.1

Carga esta referencia para verificar rápidamente si una URL,
dominio o paquete está en la lista de referencias conocidas como seguras.
**Actualizada con hallazgos del análisis de antigravity-awesome-skills.**

---

## Dominios seguros verificados

### Control de versiones
- `github.com` / `raw.githubusercontent.com`
- `gitlab.com` / `bitbucket.org`

### Registros de paquetes oficiales
- `npmjs.com` / `registry.npmjs.org` / `yarnpkg.com`
- `pypi.org` / `files.pythonhosted.org`
- `crates.io` / `static.crates.io` / `docs.rs`
- `rubygems.org` / `nuget.org` / `central.sonatype.com`
- `pub.dev` (Dart) / `mvnrepository.com` (Java) / `packagist.org` (PHP)

### Documentación oficial
- `docs.anthropic.com` / `api.anthropic.com`
- `developer.mozilla.org` / `nodejs.org` / `docs.python.org`
- `docs.github.com` / `docs.gitlab.com`

### CDNs confiables
- `cdnjs.cloudflare.com` / `cdn.jsdelivr.net` / `unpkg.com`

### Microsoft / Azure (oficial)
- `microsoft.com` / `azure.microsoft.com` / `learn.microsoft.com`
- `dev.azure.com` / `www.nuget.org` / `aka.ms`
- `portal.azure.com` / `management.azure.com`

### Google / GCP (oficial)
- `cloud.google.com` / `developers.google.com`
- `aistudio.google.com` / `googleapis.com`
- `storage.googleapis.com` / `firebase.google.com`

### AWS / Amazon (oficial)
- `aws.amazon.com` / `docs.aws.amazon.com`
- `developer.amazon.com` / `s3.amazonaws.com`

### Hugging Face (plataforma ML — completamente legítima)
- `huggingface.co` — plataforma de modelos ML, datasets y Spaces
- `hf.co` — dominio corto oficial de Hugging Face
- `huggingface.co/models` — repositorio de modelos
- `datasets-server.huggingface.co` — API de datasets

### Kubernetes / CNCF (oficial)
- `kubernetes.io` / `k8s.io` / `helm.sh`
- `istio.io` / `linkerd.io` / `prometheus.io`
- `kubernetes.default.svc` — dirección interna del cluster (no externa)

### Docker (oficial)
- `docs.docker.com` / `hub.docker.com`
- `registry-1.docker.io`

### Frameworks y herramientas conocidas
- `nestjs.com` / `docs.nestjs.com`
- `prisma.io` / `www.prisma.io`
- `nextjs.org` / `react.dev` / `angular.dev`
- `vuejs.org` / `svelte.dev` / `astro.build`
- `fastapi.tiangolo.com` / `flask.palletsprojects.com`
- `django-rest-framework.org`
- `n8n.io` / `docs.n8n.io`
- `supabase.com` / `supabase.io`
- `vercel.com` / `render.com`
- `turborepo.org` / `turbo.build`

### APIs de redes sociales / comunicación (oficiales)
- `graph.facebook.com` — Meta Graph API (WhatsApp Business, Instagram)
- `graph.instagram.com` — Instagram API oficial
- `api.telegram.org` — Bot API de Telegram
- `hooks.slack.com` — Webhooks de Slack (oficiales)
- `discord.js.org` — Librería oficial de Discord

### Seguridad y referencias (educativas)
- `owasp.org` / `cheatsheetseries.owasp.org`
- `portswigger.net` — PortSwigger (fabricante de Burp Suite)
- `cve.mitre.org` / `nvd.nist.gov`

---

## Direcciones locales — nunca son exfiltración

```
localhost         → servicio corriendo en la máquina local
127.0.0.1         → loopback, siempre local
0.0.0.0           → bind a todas las interfaces, no envía datos
::1               → loopback IPv6
192.168.x.x       → red local privada
10.x.x.x          → red privada
172.16-31.x.x     → red privada
kubernetes.default.svc → DNS interno de Kubernetes
```

---

## Dominios placeholder — usados en documentación

Estos dominios en ejemplos de código son convenciones, NO amenazas:

```
example.com / api.example.com / app.example.com
target.com / attacker.com    ← placeholder OWASP en ejemplos de seguridad
yourapp.com / yourdomain.com / myapp.com
yourstore.com / myodoo.example.com
{your-domain} / {yourapp} / *.example.com
ca.domain.local              ← Active Directory demo
```

---

## Paquetes npm conocidos seguros

```
typescript, ts-node, @types/*
eslint, prettier, jest, vitest, mocha
axios, node-fetch, got
dotenv, cross-env
zod, yup, joi
lodash, ramda, date-fns
express, fastify, hono
@nestjs/*, prisma, drizzle-orm
react, next, vue, svelte, astro
tailwindcss, shadcn/ui
```

---

## Señales de que un dominio NO es seguro

```
🔴 Typosquatting:
   antrohpic.com (typo de anthropic.com)
   npm-registry.com (no es npmjs.com)
   huggingface-models.com (no es huggingface.co)

🔴 Dominios que imitan herramientas conocidas:
   n8n-updates.com / claude-skills.com
   anthropic-verified.com / claude-official.com

🔴 Palabras clave sospechosas en dominio:
   *-collector.xyz / *-analytics-hidden.com / *-exfil.net
   *-data-harvest.* / *-stealer.*

🟡 Dominio desconocido pero en contexto descriptivo:
   URL solo referenciada, no ejecutada → MEDIO (investigar, no bloquear)
```

---

## Regla de uso

Estar en esta lista NO garantiza que un skill sea seguro.
Un dominio legítimo puede ser usado maliciosamente.

```
✅ huggingface.co/microsoft/phi-3     ← legítimo
🔴 huggingface.co/attacker/evil-model ← malicioso aunque el dominio sea seguro
```

Siempre verificar el repositorio o recurso específico, no solo el dominio.
