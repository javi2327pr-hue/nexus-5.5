# Guía de fixes — HTTP 403 en arhinfo.com

## Diagnóstico previo

Antes de aplicar ningún fix, ejecutá:

```bash
chmod +x diagnose-http-403.sh
bash diagnose-http-403.sh --verbose
```

El script identifica:
1. Si Googlebot está bloqueado (severidad CRÍTICA)
2. Tu stack (Cloudflare / Sucuri / Nginx / Apache / WordPress / etc.)
3. Qué UAs específicos pasan y cuáles no

Una vez identificado el stack, aplicá el fix correspondiente abajo.

---

## Las 7 causas más probables del HTTP 403

### 🥇 CAUSA #1 — Cloudflare "Super Bot Fight Mode" / Bot Fight Mode agresivo

**Síntomas**:
- Header `cf-ray` o `cf-cache-status` en respuesta
- Googlebot bloqueado mientras Chrome desktop pasa
- 403 viene casi instantáneo (no es timeout)

**Probabilidad**: 60% de los casos. Es la causa MÁS común.

**Fix**:

1. Iniciá sesión en Cloudflare → seleccioná el dominio `arhinfo.com`
2. **Security → Bots**
3. Si tenés "Super Bot Fight Mode":
   - **Verified Bots**: → cambiar a **Allow** (esto incluye Googlebot, Bingbot)
   - **Definitely Automated**: → cambiar de "Block" a **Challenge** (CAPTCHA) o **Allow**
   - **Likely Automated**: → dejar en **Allow** (sino bloqueás herramientas legítimas)
4. **Security → WAF → Custom Rules**:
   - Revisar si hay regla custom bloqueando UAs con "bot" o "crawler" en el nombre
   - Si la hay, **excepciones** para los UAs verificados:
     ```
     (cf.client.bot eq true) → Skip
     ```
5. **Security → WAF → Tools**:
   - Buscar reglas de "User Agent Blocking"
   - Quitar bloqueos de: `Googlebot`, `bingbot`, `GPTBot`, `ClaudeBot`, `PerplexityBot`
6. **Security → Settings → Security Level**:
   - Si está en "I'm Under Attack", bajar a "High" o "Medium"

**Verificación**:
```bash
# Esperar 30 segundos después del cambio (cache CF) y re-ejecutar
bash diagnose-http-403.sh
```

---

### 🥈 CAUSA #2 — Regla en `.htaccess` de Apache bloqueando UAs

**Síntomas**:
- Header `Server: Apache`
- No hay Cloudflare detectado
- 403 a curl + Googlebot, pero Chrome pasa

**Probabilidad**: 20% de los casos.

**Fix**:

1. Conectarte por SSH/FTP a tu hosting
2. Encontrar `.htaccess` en la raíz del sitio (puede estar oculto)
3. Buscar bloques como:

```apache
# Bloque problemático típico
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} (curl|wget|python|bot|crawler|spider) [NC]
RewriteRule .* - [F,L]

# O este patrón:
SetEnvIfNoCase User-Agent ".*bot.*" bad_bot
Order Allow,Deny
Allow from all
Deny from env=bad_bot
```

4. **Reemplazar con** (whitelist de bots legítimos):

```apache
# .htaccess — permitir bots verificados, bloquear scrapers maliciosos
RewriteEngine On

# Permitir explícitamente search engines + AI bots verificados
RewriteCond %{HTTP_USER_AGENT} (Googlebot|Bingbot|DuckDuckBot|YandexBot|Slurp|Baiduspider|GPTBot|ChatGPT-User|PerplexityBot|ClaudeBot|anthropic-ai|Google-Extended) [NC]
RewriteRule .* - [L]

# Bloquear scrapers maliciosos específicos (NO bloquear "bot" genérico)
RewriteCond %{HTTP_USER_AGENT} (AhrefsBot|SemrushBot|MJ12bot|DotBot|petalbot) [NC,OR]
RewriteCond %{HTTP_USER_AGENT} ^$ [OR]
RewriteCond %{HTTP_USER_AGENT} ^Mozilla/4\.0\s\(compatible;\sMSIE\s6\.0;\sWindows\sNT\s5\.1\) [NC]
RewriteRule .* - [F,L]

# Resto de tus reglas normales aquí...
```

5. Guardar y testear:

```bash
curl -A "Mozilla/5.0 (compatible; Googlebot/2.1)" -I https://arhinfo.com/
# Esperado: HTTP/2 200
```

---

### 🥉 CAUSA #3 — Configuración Nginx con `if ($http_user_agent ~* ...) return 403`

**Síntomas**:
- Header `Server: nginx`
- 403 a curl, Googlebot bloqueado

**Probabilidad**: 10% de los casos.

**Fix**:

1. SSH al servidor
2. Encontrar config: típicamente `/etc/nginx/sites-available/arhinfo.com.conf` o `/etc/nginx/nginx.conf`
3. Buscar bloques como:

```nginx
# Bloque problemático típico
if ($http_user_agent ~* (curl|wget|python|bot|crawler|spider)) {
    return 403;
}
```

4. **Reemplazar con** (whitelist):

```nginx
# Whitelist de bots legítimos
map $http_user_agent $allowed_bot {
    default 0;
    "~*Googlebot"        1;
    "~*Bingbot"          1;
    "~*DuckDuckBot"      1;
    "~*YandexBot"        1;
    "~*Slurp"            1;
    "~*Baiduspider"      1;
    "~*GPTBot"           1;
    "~*ChatGPT-User"     1;
    "~*PerplexityBot"    1;
    "~*ClaudeBot"        1;
    "~*anthropic-ai"     1;
    "~*Google-Extended"  1;
}

# En el server block:
server {
    listen 443 ssl http2;
    server_name arhinfo.com;

    # Solo bloquear scrapers maliciosos específicos
    if ($http_user_agent ~* (AhrefsBot|SemrushBot|MJ12bot|DotBot|petalbot)) {
        return 403;
    }

    # Si querés permitir solo browsers + whitelisted bots:
    # if ($allowed_bot = 0) {
    #     # Lógica adicional de validación
    # }

    # ... resto de la config
}
```

5. Recargar Nginx:

```bash
sudo nginx -t          # validar config
sudo nginx -s reload   # aplicar
```

---

### 🏅 CAUSA #4 — Plugin de seguridad de WordPress (Wordfence, iThemes Security, etc.)

**Síntomas**:
- Sitio en WordPress
- Header indica WP (`wp-`)
- 403 con redirect a página específica de "Security Wall"

**Probabilidad**: 7% de los casos.

**Fix**:

#### Si tenés **Wordfence**:
1. WP Admin → Wordfence → Firewall → Blocking
2. Revisar "Blocked IPs" y "Blocked Patterns"
3. Wordfence → Tools → Live Traffic → buscar entries de Googlebot bloqueados
4. Settings → Brute Force Protection → revisar "User Agents to Block"
5. **Allow** explícitamente los UAs de búsqueda:
   ```
   Firewall → Allowlist → Add User Agent:
   - Googlebot
   - bingbot
   - GPTBot
   - PerplexityBot
   - ClaudeBot
   ```

#### Si tenés **iThemes Security / Solid Security**:
1. WP Admin → Security → Settings
2. Banned Users → revisar lista
3. WordPress Tweaks → Disable XML-RPC: si está marcado, dejarlo si no usás XML-RPC (no afecta SEO)
4. Buscar regla "Banned User Agents" → desmarcar `bot` genérico

#### Si tenés **All In One WP Security**:
1. WP Admin → WP Security → Firewall → Internet Bots
2. Revisar "Block Fake Googlebots" — puede tener false positives
3. Si está activo → DESHABILITAR temporalmente y re-testear

---

### 🏅 CAUSA #5 — ModSecurity (WAF a nivel servidor, cPanel)

**Síntomas**:
- Hosting cPanel o Plesk
- 403 con mensaje "Forbidden by ModSecurity"
- Logs muestran reglas OWASP CRS bloqueando

**Probabilidad**: 5% de los casos.

**Fix**:

1. cPanel → Security → ModSecurity
2. Para el dominio arhinfo.com → **Disable temporalmente** (testing)
3. Re-ejecutar diagnostic
4. Si pasa → el problema es ModSecurity con reglas demasiado agresivas
5. **NO dejes ModSecurity off permanentemente** — en su lugar:
   - cPanel → Security → ModSecurity → Tools → Disable specific rules
   - Identificar la regla que dispara el 403 (logs en `/var/log/apache2/modsec_audit.log`)
   - Excluir esa regla para tu dominio:
     ```
     <LocationMatch "/">
         SecRuleRemoveById 920000
         SecRuleRemoveById 920100
         # ... rules específicas que disparan
     </LocationMatch>
     ```

Si no podés acceder al hosting → pedir al proveedor de hosting que excluya las reglas que bloquean a Googlebot.

---

### 🏅 CAUSA #6 — Firewall a nivel CDN (Sucuri, Akamai, Imperva)

**Síntomas**:
- Headers `x-sucuri-id` o `x-akamai-*`
- 403 con branding del WAF en la respuesta

**Probabilidad**: 3% de los casos.

**Fix**:

#### Sucuri:
1. Login a Sucuri Dashboard
2. Site → Firewall → Settings → Whitelist
3. Agregar User Agents legítimos
4. Sucuri → Performance → Cache: clear cache después del cambio

#### Akamai:
- Generalmente requiere ticket de soporte
- Pedir explícitamente: "habilitar whitelist de Googlebot + Bingbot + AI search bots"

---

### 🏅 CAUSA #7 — Rate limiting / Throttling

**Síntomas**:
- 403 ocasional (no constante)
- 429 mezclado con 403
- Funciona después de un rato

**Probabilidad**: 2% de los casos.

**Fix**:

- En Cloudflare: Security → WAF → Rate Limiting Rules
  - Excluir Googlebot del rate limit:
    ```
    (cf.client.bot eq true) → Skip
    ```
- En Nginx con `limit_req_zone`:
  - Whitelist Googlebot:
    ```nginx
    geo $limit {
        default 1;
        # Whitelist Googlebot IP ranges (verificá con: gcloud or DNS reverse lookup)
        66.249.64.0/19 0;
    }
    map $limit $limit_key {
        0 "";
        1 $binary_remote_addr;
    }
    limit_req_zone $limit_key zone=req_zone:10m rate=10r/s;
    ```

---

## Verificación post-fix (orden obligatorio)

Después de aplicar UNO de los fixes:

```bash
# 1. Re-ejecutar diagnostic
bash diagnose-http-403.sh

# 2. Si Googlebot ahora pasa, validar con Google directamente
# Google Search Console → URL Inspection → arhinfo.com → "Test Live URL"

# 3. Submit sitemap a Google Search Console
# Google Search Console → Sitemaps → Submit "sitemap.xml"

# 4. Solicitar re-indexación de la home
# Google Search Console → URL Inspection → "Request Indexing"

# 5. Verificar en 24-48h
# Google Search Console → Coverage → ver páginas indexadas (esperá +1-2 días)
```

---

## Si nada de lo anterior funciona

1. **Logs del servidor son la verdad**. Pediéle a tu hosting/proveedor:
   ```
   Asunto: HTTP 403 a Googlebot en arhinfo.com
   
   Hola, mi sitio arhinfo.com devuelve HTTP 403 a Googlebot y otros search
   engine bots. Esto está impidiendo que Google indexe mi sitio.
   
   Necesito:
   1. Logs del web server (access.log y error.log) de los últimos 7 días
      filtrando por User-Agent "Googlebot"
   2. Identificar qué configuración (WAF / firewall / mod_security / plugin)
      está bloqueando
   3. Aplicar excepción para Googlebot, Bingbot y AI search bots
      (GPTBot, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended)
   
   Este es un problema crítico de SEO. Mi sitio tiene 20 años de operación
   pero solo 2-3 páginas indexadas por este bloqueo.
   ```

2. **Cambiar de hosting** si el proveedor no resuelve. Hosting decente para WP en LATAM:
   - SiteGround
   - Cloudways
   - WP Engine
   - DigitalOcean + plugin de auto-deploy

---

## Validación final antes de deployar las 4 landings

Las landings (`pos-no-responsable-iva`, `ferreteria`, `farmacia`, `mini-market`) NO se indexarán hasta que esto esté arreglado.

Checklist final:

- [ ] Googlebot devuelve 200 (verificado con script de diagnostic)
- [ ] Bingbot devuelve 200
- [ ] Al menos 2 de los AI search bots (GPTBot, PerplexityBot, ClaudeBot) devuelven 200
- [ ] `robots.txt` accesible y permite crawlers
- [ ] `sitemap.xml` existe y referencia las 4 landings nuevas
- [ ] Google Search Console muestra el sitio sin errores de "Crawl"
- [ ] Test live URL en GSC funciona para la home y al menos 1 landing

**Solo entonces deployar las landings.** Sino, todo el trabajo de SEO queda en saco roto.

---

## KPI de éxito del fix

| Antes | Después |
|---|---|
| 2-3 páginas indexadas en Google | 30+ páginas en 30 días |
| 0 menciones en ChatGPT/Perplexity/Claude | Apariciones esporádicas para "POS Colombia" |
| 0 tráfico orgánico | 50-100 sesiones/día en mes 1 |
| 0 reviews en directorios | Possible aparición en ComparaSoftware, GetApp (otros pasos) |

El fix del 403 es **el desbloqueador único** de toda la estrategia de visibilidad. Sin él, ninguna otra acción ofensiva produce resultados.
