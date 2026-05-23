#!/usr/bin/env bash
# setup-n8n.sh
# NEXUS · Asistente de conexión con n8n
#
# Qué hace:
#   1. Pide N8N_API_URL + N8N_API_KEY + N8N_WEBHOOK_SECRET (opcional)
#   2. Los guarda en ~/.claude/secrets/nexus.env (chmod 600)
#   3. Registra el servidor n8n-mcp en ~/.claude/mcp.json
#   4. Valida la conexión con curl al endpoint /api/v1/workflows
#   5. Reporta diagnóstico
#
# Uso:
#   bash .claude/skills/nexus/scripts/setup-n8n.sh
#
# Idempotente: puede ejecutarse varias veces sin romper nada.

set -u  # no -e porque queremos manejar errores nosotros

SECRETS_FILE="$HOME/.claude/secrets/nexus.env"
SECRETS_DIR="$HOME/.claude/secrets"
MCP_FILE="$HOME/.claude/mcp.json"
MCP_DIR="$HOME/.claude"

# ─── Colores (si terminal soporta) ─────────────────────────
if [ -t 1 ]; then
  G='\033[0;32m'; Y='\033[1;33m'; R='\033[0;31m'; B='\033[1;34m'; N='\033[0m'
else
  G=''; Y=''; R=''; B=''; N=''
fi

ok()    { printf "${G}✅${N} %s\n" "$1"; }
warn()  { printf "${Y}⚠️ ${N} %s\n" "$1"; }
err()   { printf "${R}❌${N} %s\n" "$1"; }
info()  { printf "${B}ℹ️ ${N} %s\n" "$1"; }
title() { printf "\n${B}=== %s ===${N}\n" "$1"; }

# ─── 0. Pre-flight ──────────────────────────────────────────
title "Pre-flight"
mkdir -p "$SECRETS_DIR" "$MCP_DIR"
chmod 700 "$SECRETS_DIR"

if ! command -v curl >/dev/null 2>&1; then
  err "curl no encontrado. Instálalo antes de continuar."
  exit 1
fi
ok "curl disponible"

# Detectar parser JSON
if command -v jq >/dev/null 2>&1; then
  JSON_PARSER="jq"
  ok "jq disponible — usaré jq para manipular mcp.json"
elif command -v python3 >/dev/null 2>&1; then
  JSON_PARSER="python3"
  ok "python3 disponible — usaré python para manipular mcp.json"
else
  err "Ni jq ni python3 encontrados. Instala uno y reintenta."
  exit 1
fi

# ─── 1. Pedir datos al usuario ─────────────────────────────
title "Configuración n8n"

# Detectar si ya hay valores en el secrets file y mostrarlos enmascarados
existing_url=""
existing_key=""
existing_secret=""

if [ -f "$SECRETS_FILE" ]; then
  existing_url=$(grep -oP "^export N8N_API_URL=\"\K[^\"]+" "$SECRETS_FILE" 2>/dev/null || true)
  existing_key=$(grep -oP "^export N8N_API_KEY=\"\K[^\"]+" "$SECRETS_FILE" 2>/dev/null || true)
  existing_secret=$(grep -oP "^export N8N_WEBHOOK_SECRET=\"\K[^\"]+" "$SECRETS_FILE" 2>/dev/null || true)

  if [ -n "$existing_url" ]; then
    info "Detecté valores anteriores en $SECRETS_FILE:"
    echo "  N8N_API_URL    = $existing_url"
    echo "  N8N_API_KEY    = (${#existing_key} chars)"
    if [ -n "$existing_secret" ]; then
      echo "  N8N_WEBHOOK_SECRET = (${#existing_secret} chars)"
    fi
    echo ""
    read -rp "¿Sobrescribir? [s/N]: " overwrite
    if [[ ! "$overwrite" =~ ^[sSyY]$ ]]; then
      info "Mantengo los valores actuales. Salto a la verificación."
      N8N_API_URL="$existing_url"
      N8N_API_KEY="$existing_key"
      N8N_WEBHOOK_SECRET="$existing_secret"
      goto_verify=true
    fi
  fi
fi

if [ "${goto_verify:-false}" != "true" ]; then
  echo ""
  echo "Voy a pedirte 3 valores. Los 2 primeros son obligatorios."
  echo ""

  # URL
  while true; do
    read -rp "N8N_API_URL (ej: https://miempresa.n8n.cloud): " N8N_API_URL
    if [[ "$N8N_API_URL" =~ ^https?:// ]]; then
      # quita slash final si lo tiene
      N8N_API_URL="${N8N_API_URL%/}"
      break
    else
      err "Debe empezar con http:// o https://"
    fi
  done

  # API Key (sin echo)
  while true; do
    read -rsp "N8N_API_KEY (no se mostrará al escribir): " N8N_API_KEY
    echo ""
    if [ ${#N8N_API_KEY} -ge 20 ]; then
      break
    else
      err "La key parece muy corta (${#N8N_API_KEY} chars). ¿Estás seguro? Reintenta."
    fi
  done

  # Webhook secret (opcional)
  read -rsp "N8N_WEBHOOK_SECRET (opcional, Enter para saltar): " N8N_WEBHOOK_SECRET
  echo ""
fi

# ─── 2. Validar conectividad ANTES de escribir ────────────
title "Validación con n8n"

info "Llamando a $N8N_API_URL/api/v1/workflows..."
HTTP_CODE=$(curl -sS --max-time 15 -o /tmp/n8n_test_response.json -w "%{http_code}" \
  "$N8N_API_URL/api/v1/workflows" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "accept: application/json" 2>/dev/null || echo "000")

case "$HTTP_CODE" in
  200)
    WORKFLOW_COUNT=$(grep -oP '"id":' /tmp/n8n_test_response.json | wc -l || echo "?")
    ok "Conexión OK · HTTP 200 · ~${WORKFLOW_COUNT} workflows visibles"
    ;;
  401)
    err "HTTP 401 — API key inválida o expirada. Genera una nueva en Settings → API."
    rm -f /tmp/n8n_test_response.json
    exit 1
    ;;
  403)
    err "HTTP 403 — el usuario de esta API key no tiene permisos suficientes."
    info "Asegúrate de que el usuario de la key tenga rol 'Owner' o 'Admin'."
    rm -f /tmp/n8n_test_response.json
    exit 1
    ;;
  404)
    err "HTTP 404 — la URL $N8N_API_URL/api/v1/workflows no existe."
    info "Verifica que la URL sea la BASE (ej: https://miempresa.n8n.cloud) sin /api/v1 al final."
    rm -f /tmp/n8n_test_response.json
    exit 1
    ;;
  000)
    err "Sin respuesta. Posibles causas:"
    info "  - Red bloqueada o sin internet"
    info "  - URL incorrecta (typo)"
    info "  - Firewall corporativo"
    exit 1
    ;;
  *)
    err "HTTP $HTTP_CODE — respuesta inesperada"
    echo "Cuerpo (primeros 300 chars):"
    head -c 300 /tmp/n8n_test_response.json
    echo ""
    rm -f /tmp/n8n_test_response.json
    exit 1
    ;;
esac
rm -f /tmp/n8n_test_response.json

# ─── 3. Persistir secrets ─────────────────────────────────
title "Guardando credenciales en $SECRETS_FILE"

# Eliminar líneas previas de N8N_*
if [ -f "$SECRETS_FILE" ]; then
  cp "$SECRETS_FILE" "${SECRETS_FILE}.bak.$(date +%s)"
  grep -v '^export N8N_' "$SECRETS_FILE" > "${SECRETS_FILE}.tmp" || true
  mv "${SECRETS_FILE}.tmp" "$SECRETS_FILE"
else
  touch "$SECRETS_FILE"
fi

cat >> "$SECRETS_FILE" <<EOF
export N8N_API_URL="$N8N_API_URL"
export N8N_API_KEY="$N8N_API_KEY"
EOF

if [ -n "$N8N_WEBHOOK_SECRET" ]; then
  echo "export N8N_WEBHOOK_SECRET=\"$N8N_WEBHOOK_SECRET\"" >> "$SECRETS_FILE"
fi

chmod 600 "$SECRETS_FILE"
ok "Credenciales guardadas (chmod 600)"

# ─── 4. Registrar MCP server ──────────────────────────────
title "Registrando n8n-mcp en $MCP_FILE"

if [ ! -f "$MCP_FILE" ]; then
  cat > "$MCP_FILE" <<EOF
{
  "mcpServers": {}
}
EOF
  ok "Creado $MCP_FILE"
fi

# Backup
cp "$MCP_FILE" "${MCP_FILE}.bak.$(date +%s)"

# Merge usando jq o python
if [ "$JSON_PARSER" = "jq" ]; then
  jq --arg url "$N8N_API_URL" --arg key "$N8N_API_KEY" '
    .mcpServers.n8n = {
      "command": "npx",
      "args": ["-y", "n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "N8N_API_URL": $url,
        "N8N_API_KEY": $key
      }
    }
  ' "$MCP_FILE" > "${MCP_FILE}.tmp" && mv "${MCP_FILE}.tmp" "$MCP_FILE"
else
  python3 <<PYEOF
import json, sys
mcp_file = "$MCP_FILE"
url = "$N8N_API_URL"
key = "$N8N_API_KEY"

with open(mcp_file) as f:
    cfg = json.load(f)

cfg.setdefault("mcpServers", {})
cfg["mcpServers"]["n8n"] = {
    "command": "npx",
    "args": ["-y", "n8n-mcp"],
    "env": {
        "MCP_MODE": "stdio",
        "N8N_API_URL": url,
        "N8N_API_KEY": key
    }
}

with open(mcp_file, "w") as f:
    json.dump(cfg, f, indent=2)
PYEOF
fi

chmod 600 "$MCP_FILE"
ok "n8n-mcp registrado (chmod 600)"

# ─── 5. Resumen ────────────────────────────────────────────
title "Configuración completa"

echo ""
echo "Archivos modificados:"
echo "  • $SECRETS_FILE"
echo "  • $MCP_FILE"
echo ""
echo "Próximos pasos:"
echo "  1. Cierra y vuelve a abrir Claude Code (para que cargue el MCP nuevo)"
echo "  2. En Claude Code, ejecuta:  /mcp"
echo "     Debes ver:  n8n: healthy"
echo "  3. Para usar n8n directo en bash de tu máquina (sin Claude):"
echo "        source $SECRETS_FILE"
echo "        curl \"\$N8N_API_URL/api/v1/workflows\" -H \"X-N8N-API-KEY: \$N8N_API_KEY\""
echo ""
ok "Todo listo."
