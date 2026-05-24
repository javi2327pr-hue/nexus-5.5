#!/usr/bin/env bash
# install-ruflo-global.sh
# Instala claude-flow (ruflo) v3.7.0-alpha.81 globalmente:
#   1. CLI via npm install -g (binario en PATH)
#   2. Sus 39 skills oficiales en ~/.claude/skills/ con prefijo 'ruflo-'
#      (prefijo para evitar colisiones con skills propias)
#
# Versión auditada en este repo: 3.7.0-alpha.81 (audits/ruflo-3.7.0-alpha.81.md)
# Cambiar RUFLO_VERSION abajo si quieres otra.
#
# Uso:
#   bash scripts/install-ruflo-global.sh         # interactivo
#   bash scripts/install-ruflo-global.sh --yes   # sin prompts

set -u

YES=false
[[ "${1:-}" == "--yes" || "${1:-}" == "-y" ]] && YES=true

RUFLO_VERSION="3.7.0-alpha.81"

# ─── Colores ──────────────────────────────────────────
if [ -t 1 ]; then
  G='\033[0;32m'; Y='\033[1;33m'; R='\033[0;31m'; B='\033[1;34m'; N='\033[0m'
else
  G=''; Y=''; R=''; B=''; N=''
fi
ok()   { printf "${G}✅${N} %s\n" "$1"; }
warn() { printf "${Y}⚠️ ${N} %s\n" "$1"; }
err()  { printf "${R}❌${N} %s\n" "$1"; }
info() { printf "${B}ℹ️ ${N} %s\n" "$1"; }
title(){ printf "\n${B}=== %s ===${N}\n" "$1"; }

# ─── Pre-flight ───────────────────────────────────────
title "Pre-flight"

if ! command -v node >/dev/null 2>&1; then
  err "Node.js no instalado. Necesitas Node 20+. Instala desde https://nodejs.org/"
  exit 1
fi
NODE_VER=$(node --version | sed 's/v//;s/\..*//')
if [ "$NODE_VER" -lt 20 ]; then
  err "Node $NODE_VER detectado. Necesitas Node 20+."
  exit 1
fi
ok "Node $(node --version)"
ok "npm $(npm --version)"

if ! command -v npm >/dev/null 2>&1; then
  err "npm no disponible"
  exit 1
fi

# Test red a npm
if ! curl -sS --max-time 8 -o /dev/null -w "%{http_code}" "https://registry.npmjs.org/" | grep -q "200"; then
  err "Sin acceso a registry.npmjs.org"
  exit 1
fi
ok "npm registry alcanzable"

# Verificar que la versión existe
if ! npm view "claude-flow@${RUFLO_VERSION}" version >/dev/null 2>&1; then
  err "Versión claude-flow@${RUFLO_VERSION} no existe en npm"
  info "Versiones disponibles: npm view claude-flow versions --json | tail -20"
  exit 1
fi
ok "Versión claude-flow@${RUFLO_VERSION} disponible"

# ─── Confirmar ────────────────────────────────────────
echo ""
info "Lo que voy a hacer:"
info "  1. npm install -g claude-flow@${RUFLO_VERSION}     (~1 min · 600+ deps)"
info "  2. Copiar 39 skills a ~/.claude/skills/ruflo-*     (~1 segundo)"
echo ""
info "Lo que NO hago:"
info "  - NO instalo ningún hook global de Claude Code (los hooks vienen"
info "    con 'ruflo init' POR PROYECTO, no global)"
info "  - NO copio agentes (.md) — solo skills (SKILL.md)"
info "  - NO sobrescribo skills propias (nexus, marketos)"
echo ""

if [ "$YES" = false ]; then
  read -rp "¿Procedo? [S/n]: " confirm
  if [[ "$confirm" =~ ^[nN]$ ]]; then
    info "Cancelado"
    exit 0
  fi
fi

# ─── 1. Instalar CLI ──────────────────────────────────
title "Instalando CLI via npm"
NPM_GLOBAL=$(npm config get prefix)
info "npm global prefix: $NPM_GLOBAL"

if npm list -g --depth=0 2>/dev/null | grep -q "^├── claude-flow@${RUFLO_VERSION}\|^└── claude-flow@${RUFLO_VERSION}"; then
  ok "  Ya instalado: claude-flow@${RUFLO_VERSION}"
else
  npm install -g "claude-flow@${RUFLO_VERSION}" --no-fund --no-audit 2>&1 | tail -5
  if [ $? -ne 0 ]; then
    err "  npm install falló"
    info "  Probablemente necesitas sudo. Reintenta con:"
    info "      sudo npm install -g claude-flow@${RUFLO_VERSION}"
    exit 1
  fi
  ok "  Instalado"
fi

# Localizar package
PKG_ROOT=$(npm root -g)/claude-flow
if [ ! -d "$PKG_ROOT" ]; then
  err "  No encuentro $PKG_ROOT después de install"
  exit 1
fi
ok "  Path package: $PKG_ROOT"

if ! command -v claude-flow >/dev/null 2>&1; then
  err "  Binario claude-flow no en PATH"
  info "  Añade a tu PATH: export PATH=\"\$(npm config get prefix)/bin:\$PATH\""
  exit 1
fi
ok "  Binario: $(which claude-flow)"
ok "  Versión: $(claude-flow --version 2>&1 | head -1)"

# ─── 2. Copiar skills al global ───────────────────────
title "Instalando skills con prefijo 'ruflo-'"

SKILLS_SRC="$PKG_ROOT/.claude/skills"
SKILLS_DEST="$HOME/.claude/skills"
BACKUP_DIR="$HOME/.claude/_backups"

if [ ! -d "$SKILLS_SRC" ]; then
  err "  No encuentro $SKILLS_SRC en el package instalado"
  exit 1
fi

mkdir -p "$SKILLS_DEST" "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
INSTALLED=0
UPDATED=0
for s in "$SKILLS_SRC"/*/; do
  NAME=$(basename "$s")
  DEST="$SKILLS_DEST/ruflo-$NAME"

  if [ -d "$DEST" ]; then
    # Re-instalación: backup
    mv "$DEST" "$BACKUP_DIR/ruflo-${NAME}.bak-${TIMESTAMP}"
    UPDATED=$((UPDATED+1))
  else
    INSTALLED=$((INSTALLED+1))
  fi

  cp -r "$s" "$DEST"
done

echo ""
info "  Skills nuevas:        $INSTALLED"
info "  Skills actualizadas:  $UPDATED"
info "  Backups en:           $BACKUP_DIR"

# ─── Validación ───────────────────────────────────────
title "Validación"

# 1. Skills no chocan con propias
for own in nexus marketos; do
  if [ -d "$SKILLS_DEST/$own" ]; then
    VER=$(grep -oP '^version: "\K[^"]+' "$SKILLS_DEST/$own/SKILL.md" 2>/dev/null)
    ok "  Skill propia preservada: $own v$VER"
  fi
done

# 2. Conteo
RUFLO_COUNT=$(ls "$SKILLS_DEST" 2>/dev/null | grep -c "^ruflo-")
ok "  Skills ruflo instaladas: $RUFLO_COUNT"

# 3. Sin tokens
LEAKS=$(grep -rE "EAAS[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16}|ghp_[A-Za-z0-9]{36}|sk-[A-Za-z0-9]{40,}|AIza[0-9A-Za-z_-]{35}" "$SKILLS_DEST"/ruflo-* 2>/dev/null | wc -l)
if [ "$LEAKS" -eq 0 ]; then
  ok "  Sin tokens reales hardcoded en ruflo-*"
else
  warn "  $LEAKS posibles tokens detectados (probablemente placeholders en tests)"
fi

echo ""
ok "Instalación global completa."
echo ""
info "Reinicia Claude Code para que indexe las skills nuevas."
echo ""
info "Próximos pasos típicos:"
info "  • claude-flow --help                          # ver comandos del CLI"
info "  • cd <tu-proyecto> && claude-flow init        # activar en un proyecto"
info "  • /mcp en Claude Code                         # ver MCPs disponibles"
info ""
info "Si NO quieres los hooks invasivos de ruflo en un proyecto, no ejecutes"
info "'claude-flow init' allí. El CLI sigue disponible sin hooks."
