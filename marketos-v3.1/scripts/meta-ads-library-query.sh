#!/usr/bin/env bash
# meta-ads-library-query.sh
# MarketOS · Helper de consulta a Meta Ads Library (READ-ONLY)
#
# Uso:
#   1. Carga el token primero:
#        source ~/.claude/secrets/nexus.env
#   2. Ejecuta:
#        ./meta-ads-library-query.sh "<search_term>" "<country_code>" [limit]
#
# Ejemplos:
#   ./meta-ads-library-query.sh "software pos" "CO" 50
#   ./meta-ads-library-query.sh "tpv autonomos" "ES" 30
#   ./meta-ads-library-query.sh "alegra punto venta" "CO,MX,PE" 25
#
# NUNCA pasar el token como argumento ni hardcodearlo. Siempre via env.

set -euo pipefail

# ─── Validaciones ──────────────────────────────────────────

if [ -z "${META_ACCESS_TOKEN:-}" ]; then
  echo "❌ META_ACCESS_TOKEN no está cargada en el entorno."
  echo ""
  echo "Carga el archivo de secrets primero:"
  echo "   source ~/.claude/secrets/nexus.env"
  echo ""
  echo "Si no existe, créalo con:"
  echo "   mkdir -p ~/.claude/secrets"
  echo "   chmod 700 ~/.claude/secrets"
  echo "   nano ~/.claude/secrets/nexus.env"
  echo "       → añade: export META_ACCESS_TOKEN=\"tu_token_nuevo\""
  echo "   chmod 600 ~/.claude/secrets/nexus.env"
  exit 1
fi

SEARCH_TERM="${1:-}"
COUNTRIES="${2:-CO}"
LIMIT="${3:-50}"

if [ -z "$SEARCH_TERM" ]; then
  echo "Uso: $0 \"<search_term>\" \"<country_code|CO,ES,MX>\" [limit]"
  echo "Ej:  $0 \"software pos\" \"CO\" 50"
  exit 1
fi

if ! [[ "$LIMIT" =~ ^[0-9]+$ ]] || [ "$LIMIT" -gt 100 ]; then
  echo "❌ Limit debe ser entero ≤ 100. Recibido: $LIMIT"
  exit 1
fi

# ─── Construcción de query ─────────────────────────────────

API_VERSION="v21.0"
BASE_URL="https://graph.facebook.com/${API_VERSION}/ads_archive"

# Formato esperado: ['CO','ES','MX']
IFS=',' read -ra COUNTRY_ARR <<< "$COUNTRIES"
COUNTRY_JSON="["
for c in "${COUNTRY_ARR[@]}"; do
  COUNTRY_JSON+="\"${c}\","
done
COUNTRY_JSON="${COUNTRY_JSON%,}]"

FIELDS="page_name,page_id,ad_creative_bodies,ad_creative_link_titles,ad_creative_link_descriptions,ad_snapshot_url,ad_delivery_start_time,ad_delivery_stop_time,publisher_platforms,languages"

# ─── Ejecución ─────────────────────────────────────────────

echo "🔎 Consultando Meta Ads Library..."
echo "   Término:    ${SEARCH_TERM}"
echo "   Países:     ${COUNTRIES}"
echo "   Limit:      ${LIMIT}"
echo "   API:        ${API_VERSION}"
echo ""

OUTPUT_DIR="$(dirname "$0")/../references/meta-ads-snapshots"
mkdir -p "$OUTPUT_DIR"

TIMESTAMP=$(date -u +"%Y%m%d-%H%M%S")
SAFE_TERM=$(echo "$SEARCH_TERM" | tr ' ' '_' | tr -cd '[:alnum:]_-')
OUTPUT_FILE="${OUTPUT_DIR}/${SAFE_TERM}_${COUNTRIES//,/_}_${TIMESTAMP}.json"

RESPONSE=$(curl -sS -G "${BASE_URL}" \
  --data-urlencode "search_terms=${SEARCH_TERM}" \
  --data-urlencode "ad_reached_countries=${COUNTRY_JSON}" \
  --data-urlencode "ad_active_status=ALL" \
  --data-urlencode "ad_type=ALL" \
  --data-urlencode "fields=${FIELDS}" \
  --data-urlencode "limit=${LIMIT}" \
  --data-urlencode "access_token=${META_ACCESS_TOKEN}")

# Detectar errores comunes de la API
if echo "$RESPONSE" | grep -q '"error"'; then
  ERROR_CODE=$(echo "$RESPONSE" | grep -oP '"code":\s*\K[0-9]+' | head -1)
  ERROR_MSG=$(echo "$RESPONSE" | grep -oP '"message":\s*"\K[^"]*' | head -1)
  echo "❌ Error de Meta API (code=${ERROR_CODE}): ${ERROR_MSG}"
  echo ""
  case "$ERROR_CODE" in
    190) echo "→ Token inválido o expirado. Rota uno nuevo en Business Manager." ;;
    4)   echo "→ Rate limit hit. Espera 60 segundos." ;;
    10)  echo "→ Tu token no tiene permiso de Ads Library para este país. Verifica permisos en https://developers.facebook.com/tools/explorer/" ;;
    100) echo "→ Parámetro inválido. Revisa search_term y country code." ;;
  esac
  exit 1
fi

# Guardar respuesta cruda
echo "$RESPONSE" > "$OUTPUT_FILE"

# Resumen rápido
TOTAL=$(echo "$RESPONSE" | grep -o '"page_name"' | wc -l)
echo "✅ ${TOTAL} anuncios encontrados"
echo "📁 Snapshot guardado en: ${OUTPUT_FILE}"
echo ""
echo "Top 5 page_names en la respuesta:"
echo "$RESPONSE" | grep -oP '"page_name":\s*"\K[^"]*' | sort | uniq -c | sort -rn | head -5

echo ""
echo "Para análisis: feed este JSON a MarketOS → meta-ads-intel-worker."
