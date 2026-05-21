#!/usr/bin/env bash
#
# n8n Connection Health Check
# Validates that an n8n instance is reachable and the API key works
# for every operation the n8n-skills-optimized suite depends on.
#
# Usage:
#   N8N_URL="https://maojaca7.app.n8n.cloud" N8N_API_KEY="<your-key>" ./n8n-health-check.sh
#
# Or interactive:
#   ./n8n-health-check.sh
#

set -uo pipefail

N8N_URL="${N8N_URL:-}"
N8N_API_KEY="${N8N_API_KEY:-}"

if [[ -z "$N8N_URL" ]]; then
  read -r -p "n8n base URL (e.g. https://xxx.app.n8n.cloud): " N8N_URL
fi
if [[ -z "$N8N_API_KEY" ]]; then
  read -r -s -p "n8n API key (input hidden): " N8N_API_KEY
  echo
fi

N8N_URL="${N8N_URL%/}"  # strip trailing slash

PASS=0
FAIL=0
WARN=0

pass() { echo "  ✅ PASS — $1"; PASS=$((PASS+1)); }
fail() { echo "  ❌ FAIL — $1"; FAIL=$((FAIL+1)); }
warn() { echo "  ⚠️  WARN — $1"; WARN=$((WARN+1)); }

call() {
  local method="$1" path="$2"
  curl -sS --max-time 15 \
    -X "$method" \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Accept: application/json" \
    -o /tmp/n8n_resp.json \
    -w "%{http_code}" \
    "${N8N_URL}${path}" 2>/dev/null
}

echo
echo "════════════════════════════════════════════════════"
echo " n8n Health Check — $N8N_URL"
echo "════════════════════════════════════════════════════"

# ────────────────────────────────────────────────────
echo
echo "[1/8] TLS / reachability"
http=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 "$N8N_URL/" 2>/dev/null || echo "000")
case "$http" in
  2*|3*) pass "host reachable (HTTP $http)" ;;
  401|403) pass "host reachable (HTTP $http — auth required, expected)" ;;
  000) fail "cannot connect (network unreachable or DNS fail)"; echo "  → check VPN, firewall, allowlist"; exit 1 ;;
  *) warn "unexpected HTTP $http" ;;
esac

# ────────────────────────────────────────────────────
echo
echo "[2/8] REST API authentication (/api/v1/workflows)"
code=$(call GET "/api/v1/workflows?limit=1")
case "$code" in
  200) pass "API key valid (HTTP 200)" ;;
  401) fail "API key rejected (HTTP 401)"; echo "  → key is wrong, revoked, or expired"; exit 1 ;;
  403) fail "API key lacks scope for workflows:read (HTTP 403)" ;;
  *) fail "unexpected HTTP $code"; cat /tmp/n8n_resp.json | head -c 300; echo ;;
esac

# ────────────────────────────────────────────────────
echo
echo "[3/8] Workflows list (verify data shape)"
if [[ "$(jq -r 'type' /tmp/n8n_resp.json 2>/dev/null)" == "object" ]] && \
   jq -e '.data' /tmp/n8n_resp.json >/dev/null 2>&1; then
  count=$(jq '.data | length' /tmp/n8n_resp.json)
  total=$(jq -r '.nextCursor // "n/a"' /tmp/n8n_resp.json)
  pass "workflows endpoint returns expected shape ($count returned, nextCursor=$total)"
else
  warn "response shape not as expected"
fi

# ────────────────────────────────────────────────────
echo
echo "[4/8] Credentials endpoint (/api/v1/credentials)"
code=$(call GET "/api/v1/credentials?limit=1")
case "$code" in
  200) pass "credentials:read works (HTTP 200)" ;;
  401|403) warn "credentials endpoint denied (HTTP $code) — credentials-architect skill will fail" ;;
  404) warn "endpoint not found (your n8n version may not expose it)" ;;
  *) warn "unexpected HTTP $code" ;;
esac

# ────────────────────────────────────────────────────
echo
echo "[5/8] Executions endpoint (/api/v1/executions) — needed by observability-monitor"
code=$(call GET "/api/v1/executions?limit=1")
case "$code" in
  200) pass "executions:read works (HTTP 200)" ;;
  401|403) warn "executions endpoint denied — observability-monitor will be limited" ;;
  *) warn "unexpected HTTP $code" ;;
esac

# ────────────────────────────────────────────────────
echo
echo "[6/8] Variables / audit endpoint"
code=$(call GET "/api/v1/variables?limit=1")
case "$code" in
  200) pass "variables:read works" ;;
  401|403) warn "variables endpoint denied" ;;
  404) warn "endpoint not found (n8n version variation)" ;;
  *) warn "unexpected HTTP $code" ;;
esac

# ────────────────────────────────────────────────────
echo
echo "[7/8] Write capability test (dry-run via create+delete)"
# Try to create a minimal inactive workflow then delete it
TEST_WF=$(cat <<'JSON'
{"name":"__healthcheck_n8n_skills__","nodes":[{"parameters":{},"type":"n8n-nodes-base.manualTrigger","typeVersion":1,"position":[0,0],"id":"a1","name":"When clicking 'Test workflow'"}],"connections":{},"settings":{}}
JSON
)
code=$(curl -sS --max-time 15 -X POST \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -o /tmp/n8n_resp.json \
  -w "%{http_code}" \
  -d "$TEST_WF" \
  "${N8N_URL}/api/v1/workflows" 2>/dev/null)
case "$code" in
  200|201)
    wfid=$(jq -r '.id' /tmp/n8n_resp.json)
    pass "workflows:write works (created test workflow id=$wfid)"
    # cleanup
    delcode=$(call DELETE "/api/v1/workflows/$wfid")
    if [[ "$delcode" == "200" || "$delcode" == "204" ]]; then
      pass "workflows:delete works (cleaned up id=$wfid)"
    else
      warn "could not delete test workflow id=$wfid (HTTP $delcode) — please delete manually"
    fi
    ;;
  401|403) fail "workflows:write denied (HTTP $code) — most skills will fail" ;;
  *) warn "unexpected HTTP $code on workflow create" ;;
esac

# ────────────────────────────────────────────────────
echo
echo "[8/8] MCP server endpoint (Streamable HTTP transport)"
code=$(curl -sS --max-time 10 -o /tmp/n8n_resp.json -w "%{http_code}" \
  -H "Authorization: Bearer $N8N_API_KEY" \
  -H "Accept: application/json, text/event-stream" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"healthcheck","version":"1.0"}}}' \
  "${N8N_URL}/mcp-server/http" 2>/dev/null || echo "000")
case "$code" in
  200) pass "MCP server endpoint responds to initialize (HTTP 200)" ;;
  401) fail "MCP endpoint rejected auth (HTTP 401) — check token has MCP scope" ;;
  404) warn "MCP endpoint not exposed (your plan or version may not include it)" ;;
  *) warn "MCP endpoint HTTP $code — manual check needed"; head -c 300 /tmp/n8n_resp.json; echo ;;
esac

# ────────────────────────────────────────────────────
echo
echo "════════════════════════════════════════════════════"
echo " SUMMARY — $PASS pass, $WARN warn, $FAIL fail"
echo "════════════════════════════════════════════════════"
echo
if [[ $FAIL -eq 0 ]]; then
  echo "✅ n8n connection is OPERATIONAL for the n8n-skills-optimized suite."
  exit 0
else
  echo "❌ n8n connection has CRITICAL ISSUES — fix the FAILs above before using the suite."
  exit 1
fi
