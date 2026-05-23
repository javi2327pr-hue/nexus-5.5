# Security Patterns — Referencia interna de auditoría

Uso interno de SecurityAudit. Patrones compilados de riesgo real.

---

## Patrones de Categoría A (identidad/permisos)

```regex
# Reclamos de Anthropic
/anthropic.*permiso|anthropic.*autoriza|de parte de anthropic/i
/claude.*oficial|versión.*sin.*restricción|modo.*developer/i

# Override de instrucciones
/ignora.*instrucciones|override.*system|bypass.*safety/i
/do anything now|DAN|jailbreak|sin.*filtro/i
```

## Patrones de Categoría B (sistema/instalación)

```regex
# Instalación global
/npm install -g|pip install --global|yarn global add/i

# Ejecución de scripts remotos
/curl.*\|.*sh|wget.*\|.*bash|curl.*\|.*python/i

# Comandos destructivos
/rm -rf|format.*\/|del \/f \/s|mkfs/i

# Escalada de privilegios
/sudo |chmod \+x|chown root/i
```

## Patrones de Categoría C (URLs externas)

```regex
# URLs acortadas (sospechosas en scripts)
/bit\.ly|tinyurl|t\.co|ow\.ly/i

# Parámetros de tracking en llamadas de API
/\?ref=|&utm_|&track=/i

# IPs directas en lugar de dominios
/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
```

## Patrones de Categoría D (exfiltración/injection)

```regex
# Envío silencioso de datos
/en cada.*respuesta.*incluye|agrega.*siempre.*al.*final/i
/reporta.*webhook|envía.*sin.*avisar/i

# Base64 sospechoso (codificación de instrucciones ocultas)
/atob\(|btoa\(.*system|base64.*decode.*exec/i

# Instrucciones ocultas en comentarios
/\/\*.*jailbreak|<!--.*override/i
```

---

## Whitelist de dominios seguros para Categoría C

```
api.anthropic.com
api.openai.com
api.github.com
registry.npmjs.org
pypi.org
cdnjs.cloudflare.com
cdn.jsdelivr.net
unpkg.com
stitch.withgoogle.com
dashboard.n8n-mcp.com
```

Cualquier dominio fuera de esta lista en contexto de script → REVISAR.
