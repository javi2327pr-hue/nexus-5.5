#!/usr/bin/env bash
# install-skills-global.sh
# Instala Nexus v6.1 + MarketOS v3.1 (y cualquier skill futura del repo)
# como skills GLOBALES de Claude Code en ~/.claude/skills/
#
# Uso:
#   bash scripts/install-skills-global.sh         # interactivo
#   bash scripts/install-skills-global.sh --yes   # sin prompts
#
# Idempotente. Crea backups con timestamp en ~/.claude/_backups/.

set -u

YES=false
[[ "${1:-}" == "--yes" || "${1:-}" == "-y" ]] && YES=true

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

# ─── Localizar repo source ────────────────────────────
# El script puede estar en scripts/ del repo, o ser ejecutado desde fuera.
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
SRC_SKILLS="$REPO_ROOT/.claude/skills"

if [ ! -d "$SRC_SKILLS" ]; then
  err "No encuentro $SRC_SKILLS"
  info "Asegúrate de ejecutar este script desde dentro del repo nexus-5.5"
  info "O clona el repo primero:"
  info "    git clone https://github.com/javi2327pr-hue/nexus-5.5"
  info "    cd nexus-5.5"
  info "    bash scripts/install-skills-global.sh"
  exit 1
fi

# ─── Pre-flight ───────────────────────────────────────
title "Pre-flight"
info "Repo source: $REPO_ROOT"
info "Skills source: $SRC_SKILLS"

DEST_BASE="$HOME/.claude/skills"
BACKUP_DIR="$HOME/.claude/_backups"

mkdir -p "$HOME/.claude"
mkdir -p "$DEST_BASE"
mkdir -p "$BACKUP_DIR"

# WHITELIST de skills oficiales a instalar (las que hemos creado/modificado aquí).
# Edita esta lista para añadir más. NO usar wildcard porque el repo puede tener
# 1000+ skills de otros marketplaces y NO queremos pisarlos al global.
OFFICIAL_SKILLS=(
  "nexus"
  "marketos"
)

SKILLS=()
for s in "${OFFICIAL_SKILLS[@]}"; do
  if [ -d "$SRC_SKILLS/$s" ]; then
    SKILLS+=( "$s" )
  else
    warn "Skill '$s' declarado en whitelist pero no existe en $SRC_SKILLS"
  fi
done

if [ ${#SKILLS[@]} -eq 0 ]; then
  err "Ninguna skill de la whitelist está disponible en $SRC_SKILLS"
  exit 1
fi

info "Skills detectadas en el repo (${#SKILLS[@]}):"
for s in "${SKILLS[@]}"; do
  VER=$(grep -oP '^version: "\K[^"]+' "$SRC_SKILLS/$s/SKILL.md" 2>/dev/null || echo "?")
  FILES=$(find "$SRC_SKILLS/$s" -type f 2>/dev/null | wc -l)
  echo "  • $s (v$VER · $FILES archivos)"
done

# ─── Confirmar ────────────────────────────────────────
echo ""
if [ "$YES" = false ]; then
  read -rp "¿Instalar/actualizar estas skills en $DEST_BASE? [S/n]: " confirm
  if [[ "$confirm" =~ ^[nN]$ ]]; then
    info "Cancelado"
    exit 0
  fi
fi

# ─── Instalación ──────────────────────────────────────
title "Instalando"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
INSTALLED=0
SKIPPED=0

for s in "${SKILLS[@]}"; do
  SRC="$SRC_SKILLS/$s"
  DEST="$DEST_BASE/$s"

  # Backup si ya existe
  if [ -d "$DEST" ]; then
    OLD_VER=$(grep -oP '^version: "\K[^"]+' "$DEST/SKILL.md" 2>/dev/null || echo "?")
    NEW_VER=$(grep -oP '^version: "\K[^"]+' "$SRC/SKILL.md" 2>/dev/null || echo "?")

    if [ "$OLD_VER" = "$NEW_VER" ]; then
      # Solo verifica si hay diff binario
      if diff -rq "$SRC" "$DEST" > /dev/null 2>&1; then
        info "  $s: ya en v$NEW_VER · sin cambios · skip"
        SKIPPED=$((SKIPPED+1))
        continue
      fi
    fi

    BACKUP="$BACKUP_DIR/${s}.v${OLD_VER}.bak-${TIMESTAMP}"
    mv "$DEST" "$BACKUP"
    info "  $s: backup v$OLD_VER → ${BACKUP##*/}"
  fi

  cp -r "$SRC" "$DEST"
  # Permisos en scripts si los hay
  if [ -d "$DEST/scripts" ]; then
    chmod +x "$DEST/scripts/"*.sh 2>/dev/null || true
  fi

  NEW_VER=$(grep -oP '^version: "\K[^"]+' "$DEST/SKILL.md" 2>/dev/null || echo "?")
  ok "  $s instalado/actualizado a v$NEW_VER"
  INSTALLED=$((INSTALLED+1))
done

# ─── Verificación final ───────────────────────────────
title "Resumen"
echo "  • Instaladas/actualizadas: $INSTALLED"
echo "  • Sin cambios (skip): $SKIPPED"
echo "  • Total skills globales ahora:"
for s in "${SKILLS[@]}"; do
  if [ -d "$DEST_BASE/$s" ]; then
    VER=$(grep -oP '^version: "\K[^"]+' "$DEST_BASE/$s/SKILL.md" 2>/dev/null || echo "?")
    echo "      $s v$VER"
  fi
done

# ─── Validaciones de seguridad ────────────────────────
title "Validación de seguridad"

# 1. ¿Quedaron tokens hardcoded?
LEAKS=$(grep -rE "EAAS[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16}|ghp_[A-Za-z0-9]{36}|sk-[A-Za-z0-9]{40,}|AIza[0-9A-Za-z_-]{35}" \
  "$DEST_BASE"/ 2>/dev/null | wc -l)
if [ "$LEAKS" -eq 0 ]; then
  ok "  Sin tokens reales hardcoded en skills instaladas"
else
  err "  ⚠️ Detecté $LEAKS posibles tokens. Revisa: grep -rE 'EAAS|AKIA|ghp_|sk-|AIza' $DEST_BASE/"
fi

# 2. ¿Quedaron placeholders TU_*?
PLACEHOLDERS=$(grep -rE '"TU_[A-Z_]+"' "$DEST_BASE"/ --include="*.json" 2>/dev/null | wc -l)
if [ "$PLACEHOLDERS" -eq 0 ]; then
  ok "  Sin placeholders TU_* en configs"
else
  warn "  Hay $PLACEHOLDERS placeholders TU_* en configs (deberían ser \${ENV_VAR})"
fi

# 3. ¿Backups limpios?
if [ -n "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
  COUNT=$(ls "$BACKUP_DIR" | wc -l)
  ok "  $COUNT backup(s) en $BACKUP_DIR (fuera del indexador de skills)"
fi

echo ""
ok "Listo. Las skills ahora son globales y se cargan automáticamente."
info "Si Claude Code está abierto, reinícialo para que indexe las skills nuevas."
echo ""
info "Para activar las integraciones (Stitch / Meta / n8n) carga el secrets file:"
info "    source ~/.claude/secrets/nexus.env    # si lo tienes"
info ""
info "Para instalar n8n MCP server: bash ~/.claude/skills/nexus/scripts/setup-n8n.sh"
