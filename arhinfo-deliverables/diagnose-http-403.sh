#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
# ARHINFO — HTTP 403 Diagnostic Tool
# ═══════════════════════════════════════════════════════════════════════
# Diagnostica por qué arhinfo.com bloquea fetchers de SEO/AEO.
# Identifica si el bloqueo afecta a:
#   - Googlebot (CRÍTICO si sí, ranking imposible)
#   - Bingbot / AI search engines
#   - Solo fetchers genéricos
#
# Uso:
#   bash diagnose-http-403.sh
#   bash diagnose-http-403.sh --verbose    # ver respuestas completas
#   bash diagnose-http-403.sh --domain otro-sitio.com
# ═══════════════════════════════════════════════════════════════════════

set -uo pipefail

DOMAIN="${DOMAIN:-arhinfo.com}"
VERBOSE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --verbose) VERBOSE=true; shift ;;
    --domain)  DOMAIN="$2"; shift 2 ;;
    *) shift ;;
  esac
done

URL="https://$DOMAIN/"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo " ARHINFO — Diagnóstico HTTP 403"
echo " Target: $URL"
echo " Fecha:  $(date '+%Y-%m-%d %H:%M')"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Función auxiliar
test_ua() {
  local name="$1"
  local ua="$2"
  local impact="$3"  # CRITICAL | HIGH | MEDIUM

  local result
  result=$(curl -sS -o /tmp/arhinfo_resp.html -w "%{http_code}" \
    --max-time 10 \
    -A "$ua" \
    -H "Accept: text/html,application/xhtml+xml" \
    "$URL" 2>/dev/null || echo "TIMEOUT")

  local status_emoji
  case "$result" in
    200|301|302) status_emoji="✅"; ;;
    403)         status_emoji="❌"; ;;
    429)         status_emoji="⚠️ "; ;;
    *)           status_emoji="❓"; ;;
  esac

  local impact_label
  case "$impact" in
    CRITICAL) impact_label="🔴 CRÍTICO";;
    HIGH)     impact_label="🟠 ALTO   ";;
    MEDIUM)   impact_label="🟡 MEDIO  ";;
    *)        impact_label="⚪ INFO   ";;
  esac

  printf "  %s  %s  HTTP %s  %s\n" "$status_emoji" "$impact_label" "$result" "$name"

  if [[ "$VERBOSE" == "true" && "$result" == "403" ]]; then
    echo "      ↳ Response headers:"
    curl -sS -I --max-time 5 -A "$ua" "$URL" 2>/dev/null | sed 's/^/        /'
    echo ""
  fi
}

echo "TEST 1 — Fetchers genéricos (línea base)"
echo "─────────────────────────────────────────"
test_ua "curl default"                   "curl/8.0.0"                                                                                                                                "MEDIUM"
test_ua "Python requests"                "python-requests/2.31.0"                                                                                                                    "MEDIUM"
test_ua "Wget"                           "Wget/1.21.4"                                                                                                                                "MEDIUM"
echo ""

echo "TEST 2 — Search engine crawlers (los críticos)"
echo "──────────────────────────────────────────────"
test_ua "Googlebot"                      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"                                                                  "CRITICAL"
test_ua "Googlebot Mobile"               "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" "CRITICAL"
test_ua "Googlebot-Image"                "Googlebot-Image/1.0"                                                                                                                       "HIGH"
test_ua "Bingbot"                        "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"                                                                  "HIGH"
test_ua "DuckDuckBot"                    "DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)"                                                                                "MEDIUM"
test_ua "YandexBot"                      "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)"                                                                          "MEDIUM"
echo ""

echo "TEST 3 — AI search engines (2026 traffic source)"
echo "────────────────────────────────────────────────"
test_ua "ChatGPT-User (browsing)"        "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot"                                "HIGH"
test_ua "GPTBot (training)"              "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.0; +https://openai.com/gptbot"                                   "HIGH"
test_ua "PerplexityBot"                  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot"                  "HIGH"
test_ua "ClaudeBot (Anthropic)"          "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ClaudeBot/1.0; +claudebot@anthropic.com"                                  "HIGH"
test_ua "anthropic-ai"                   "anthropic-ai"                                                                                                                              "HIGH"
test_ua "Google-Extended"                "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; Google-Extended/1.0; +https://developers.google.com/search/docs/crawling-indexing/google-special-case-crawlers" "HIGH"
echo ""

echo "TEST 4 — Browsers reales (control)"
echo "──────────────────────────────────"
test_ua "Chrome Desktop"                 "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"                    "MEDIUM"
test_ua "Safari iOS"                     "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" "MEDIUM"
echo ""

echo "TEST 5 — Recursos críticos para SEO"
echo "───────────────────────────────────"
for path in "robots.txt" "sitemap.xml" "favicon.ico"; do
  result=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 5 \
    -A "Mozilla/5.0 (compatible; Googlebot/2.1)" \
    "https://$DOMAIN/$path" 2>/dev/null || echo "TIMEOUT")
  case "$result" in
    200) printf "  ✅  %s — accesible (HTTP %s)\n" "/$path" "$result";;
    404) printf "  ⚠️   %s — NO EXISTE (HTTP %s) — SEO necesita esto\n" "/$path" "$result";;
    403) printf "  ❌  %s — BLOQUEADO (HTTP %s)\n" "/$path" "$result";;
    *)   printf "  ❓  %s — HTTP %s\n" "/$path" "$result";;
  esac
done
echo ""

echo "TEST 6 — Identificación del stack"
echo "─────────────────────────────────"
echo "  Inspeccionando headers de respuesta:"
headers=$(curl -sS -I --max-time 5 -A "Mozilla/5.0 Chrome/120" "$URL" 2>/dev/null)

# Detectar WAF / CDN
if echo "$headers" | grep -qi "cloudflare\|cf-ray\|cf-cache"; then
  echo "  🔍 Cloudflare detectado (CDN/WAF)"
  CF_DETECTED=true
fi
if echo "$headers" | grep -qi "x-sucuri-id\|sucuri"; then
  echo "  🔍 Sucuri WAF detectado"
fi
if echo "$headers" | grep -qi "x-akamai\|akamai"; then
  echo "  🔍 Akamai CDN detectado"
fi
if echo "$headers" | grep -qi "x-aspnet-version\|asp.net"; then
  echo "  🔍 ASP.NET / IIS detectado"
fi
if echo "$headers" | grep -qi "x-powered-by.*php"; then
  echo "  🔍 PHP detectado (probable Apache + .htaccess o Nginx)"
fi
if echo "$headers" | grep -qi "server:.*nginx"; then
  echo "  🔍 Nginx detectado"
fi
if echo "$headers" | grep -qi "server:.*apache"; then
  echo "  🔍 Apache detectado"
fi
if echo "$headers" | grep -qi "wordpress\|wp-"; then
  echo "  🔍 WordPress detectado"
fi

echo ""
echo "  Server header completo (primeras 5 líneas):"
echo "$headers" | head -5 | sed 's/^/    /'
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo " RESUMEN Y DIAGNÓSTICO"
echo "═══════════════════════════════════════════════════════════════"

# Re-test Googlebot para el resumen
google_result=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 \
  -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  "$URL" 2>/dev/null || echo "TIMEOUT")
chrome_result=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 \
  -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
  "$URL" 2>/dev/null || echo "TIMEOUT")
curl_result=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 "$URL" 2>/dev/null || echo "TIMEOUT")

echo ""
if [[ "$google_result" == "403" ]]; then
  echo "🚨 SEVERIDAD: CRÍTICA — Googlebot está BLOQUEADO"
  echo ""
  echo "   Googlebot:  $google_result (BLOQUEADO)"
  echo "   Chrome:     $chrome_result"
  echo "   curl:       $curl_result"
  echo ""
  echo "   → Google literalmente NO PUEDE indexar tu sitio."
  echo "   → Esto explica por qué solo tenés 2-3 páginas indexadas en 20 años."
  echo "   → Ningún SEO funcionará hasta que esto se arregle."
  echo "   → ACCIÓN: aplicar fixes del archivo fix-http-403-guide.md"
elif [[ "$google_result" == "200" && "$curl_result" == "403" ]]; then
  echo "⚠️  SEVERIDAD: MEDIA — Googlebot OK, fetchers genéricos bloqueados"
  echo ""
  echo "   Googlebot:  $google_result ✅"
  echo "   Chrome:     $chrome_result ✅"
  echo "   curl:       $curl_result ❌"
  echo ""
  echo "   → Google + Bing pueden indexar (good)"
  echo "   → AI search engines (ChatGPT, Perplexity, Claude) bloqueados"
  echo "   → Tools de monitoring SEO (Ahrefs, SEMrush) bloqueados"
  echo "   → ACCIÓN: relajar bloqueo de UAs no-Googlebot pero legítimos"
elif [[ "$google_result" == "200" && "$chrome_result" == "200" ]]; then
  echo "✅ SEVERIDAD: NINGUNA — todo accesible"
  echo ""
  echo "   El 403 ya no existe o nunca fue persistente."
  echo "   Verificar si el problema es de indexación específica de páginas (otra causa)."
else
  echo "❓ SEVERIDAD: indeterminada"
  echo ""
  echo "   Googlebot:  $google_result"
  echo "   Chrome:     $chrome_result"
  echo "   curl:       $curl_result"
  echo ""
  echo "   → Resultado mixto. Revisar manualmente con --verbose."
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo " SIGUIENTE PASO"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  1. Leé fix-http-403-guide.md para los 7 fixes más probables"
echo "  2. Identificá tu stack arriba (TEST 6)"
echo "  3. Aplicá el fix correspondiente a tu stack"
echo "  4. Re-ejecutá este script: bash diagnose-http-403.sh"
echo "  5. Cuando Googlebot devuelva 200, deployá las landings"
echo ""
