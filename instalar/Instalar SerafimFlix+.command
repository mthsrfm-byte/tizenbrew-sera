#!/bin/bash
# Instalador do SerafimFlix+ para TVs Samsung (Tizen), para macOS.
# Baixa a versão mais nova do GitHub, acha a TV na rede e instala. Basta ir respondendo.

REPO="mthsrfm-byte/tizenbrew-sera"
PKG_ID="xvvl3S1bvH"
SDB_URL="https://download.tizen.org/sdk/tizenstudio/official/binary/sdb_4.2.36_macos-64.zip"
WORK="$HOME/Library/Application Support/SerafimFlix"
SDB="$WORK/sdb/data/tools/sdb"
TV_TMP="/home/owner/share/tmp/sdk_tools/package.wgt"

AZUL=$'\033[38;2;51;71;255m'; LAV=$'\033[38;2;169;180;245m'; CINZA=$'\033[38;2;163;161;154m'
VERDE=$'\033[32m'; VERM=$'\033[31m'; NEG=$'\033[1m'; FIM=$'\033[0m'

passo() { printf "\n${AZUL}${NEG}▸ %s${FIM}\n" "$1"; }
ok()    { printf "  ${VERDE}✓${FIM} %s\n" "$1"; }
info()  { printf "  ${CINZA}%s${FIM}\n" "$1"; }
erro()  { printf "\n  ${VERM}✗ %s${FIM}\n" "$1"; }
pergunta() { local r; printf "  ${LAV}%s${FIM} " "$1" >&2; read -r r </dev/tty; echo "$r"; }
enter() { printf "  ${LAV}%s${FIM}" "${1:-Aperte Enter para continuar…}"; read -r _ </dev/tty; }
sair()  { printf "\n"; enter "Aperte Enter para fechar."; exit "${1:-1}"; }

clear
printf "${NEG}\n   SERAFIM${LAV}flix${AZUL}+${FIM}${NEG}  ·  instalador para TV Samsung${FIM}\n"
info "Leva uns 2 minutos. É só ir respondendo."

# ---------- 1. Ferramentas ----------
passo "Preparando as ferramentas"
mkdir -p "$WORK"
if [ "$(uname -m)" = "arm64" ] && ! arch -x86_64 /usr/bin/true 2>/dev/null; then
  info "Seu Mac precisa do Rosetta para a ferramenta da Samsung. Instalando (pode pedir a senha do Mac)…"
  softwareupdate --install-rosetta --agree-to-license >/dev/null 2>&1 || sudo softwareupdate --install-rosetta --agree-to-license
fi
if [ ! -x "$SDB" ]; then
  curl -fsSL "$SDB_URL" -o "$WORK/sdb.zip" || { erro "Não consegui baixar a ferramenta da Samsung. Confere a internet."; sair; }
  rm -rf "$WORK/sdb" && unzip -q -o "$WORK/sdb.zip" -d "$WORK/sdb" && rm -f "$WORK/sdb.zip"
  chmod +x "$SDB"; xattr -dr com.apple.quarantine "$WORK/sdb" 2>/dev/null
fi
"$SDB" version >/dev/null 2>&1 || { erro "A ferramenta da Samsung não abriu neste Mac."; sair; }
ok "Ferramentas prontas"

# ---------- 2. Versão mais nova ----------
passo "Baixando a versão mais nova do SerafimFlix+"
REL="$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest")" || { erro "Não consegui falar com o GitHub."; sair; }
VERSAO="$(printf '%s' "$REL" | grep -m1 '"tag_name"' | sed 's/.*: *"\(.*\)".*/\1/')"
WGT_URL="$(printf '%s' "$REL" | grep -o 'https://[^"]*\.wgt' | head -1)"
[ -n "$WGT_URL" ] || { erro "Não achei o instalador no GitHub."; sair; }
curl -fsSL "$WGT_URL" -o "$WORK/SerafimFlixPlus.wgt" || { erro "Falhou o download."; sair; }
ok "Versão $VERSAO baixada"

# ---------- 3. Modo Desenvolvedor ----------
MAC_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)"
passo "Modo Desenvolvedor na TV"
cat <<TXT
  1. Na TV: Home → Apps, e digite ${NEG}1 2 3 4 5${FIM} no controle.
  2. Ligue o ${NEG}Developer mode${FIM} e em ${NEG}Host PC IP${FIM} coloque: ${LAV}${NEG}${MAC_IP:-o IP deste Mac}${FIM}
  3. Desligue a TV segurando o botão de ligar até aparecer o logo da Samsung.
TXT
enter "Quando a TV voltar ligada, aperte Enter…"

# ---------- 4. Achar a TV ----------
passo "Procurando sua TV na rede"
achar_tvs() {
  local base="${MAC_IP%.*}" i
  for i in $(seq 1 254); do
    ( r="$(curl -s -m 2 "http://$base.$i:8001/api/v2/" 2>/dev/null)"
      case "$r" in *'"device"'*) n="$(printf '%s' "$r" | grep -o '"name": *"[^"]*"' | head -1 | cut -d'"' -f4)"
        echo "$base.$i|$n" ;; esac ) &
  done; wait
}
TV_IP=""
if [ -n "$MAC_IP" ]; then
  TVS=()
  while IFS= read -r l; do [ -n "$l" ] && TVS+=("$l"); done < <(achar_tvs | sort -u)
  if [ "${#TVS[@]}" -eq 1 ]; then
    TV_IP="${TVS[0]%%|*}"; ok "Achei: ${TVS[0]#*|} ($TV_IP)"
  elif [ "${#TVS[@]}" -gt 1 ]; then
    for i in "${!TVS[@]}"; do info "$((i+1))) ${TVS[$i]#*|} — ${TVS[$i]%%|*}"; done
    n="$(pergunta "Qual é a sua? (número):")"
    TV_IP="${TVS[$((n-1))]%%|*}"
  fi
fi
if [ -z "$TV_IP" ]; then
  info "Não achei sozinho. Na TV: Configurações → Geral → Rede → Status da rede → Configurações de IP."
  TV_IP="$(pergunta "Digite o IP da TV (ex.: 192.168.0.15):")"
fi

# A TV diz em :8001/api/v2/ se o Developer Mode está ligado e qual Host PC IP está nele.
campo_tv() { curl -s -m 3 "http://$TV_IP:8001/api/v2/" | grep -o "\"$1\": *\"[^\"]*\"" | head -1 | cut -d'"' -f4; }

# ---------- 5. Conectar ----------
passo "Conectando na TV"
MODO="$(campo_tv developerMode)"; DEV_IP="$(campo_tv developerIP)"
if [ "$MODO" = "0" ]; then
  erro "O Developer mode está desligado na TV. Liga ele (Apps → 1 2 3 4 5) e reinicia a TV segurando o botão."
  sair
fi
if [ -n "$DEV_IP" ] && [ -n "$MAC_IP" ] && [ "$DEV_IP" != "$MAC_IP" ]; then
  erro "O Host PC IP na TV está $DEV_IP, mas precisa ser $MAC_IP."
  info "Troca no Developer mode e reinicia a TV segurando o botão. Depois roda este instalador de novo."
  sair
fi
"$SDB" disconnect "$TV_IP" >/dev/null 2>&1
CON="$("$SDB" connect "$TV_IP" 2>&1)"
if ! "$SDB" devices 2>/dev/null | grep -q "$TV_IP"; then
  erro "A TV não aceitou a conexão. ($CON)"
  info "Confere: Developer mode ligado, Host PC IP = ${MAC_IP:-IP do Mac}, e a TV reiniciada segurando o botão."
  sair
fi
ok "Conectado"
S() { "$SDB" -s "$TV_IP:26101" "$@"; }

# ---------- 6. Instalar ----------
passo "Instalando o SerafimFlix+"
instalar() {
  S push "$WORK/SerafimFlixPlus.wgt" "$TV_TMP" >/dev/null 2>&1 || return 1
  OUT="$(S shell 0 vd_appinstall "$PKG_ID" "$TV_TMP" 2>&1)"
  ! printf '%s' "$OUT" | grep -qiE 'val\[fail|failed'
}
if ! instalar; then
  info "Já tinha uma versão com outra assinatura. Removendo a antiga (sua lista de apps fica salva)…"
  S shell 0 vd_appuninstall "$PKG_ID" >/dev/null 2>&1
  if ! instalar; then
    erro "A instalação falhou. Detalhes:"; printf '%s\n' "$OUT" | tail -15; sair
  fi
fi
ok "SerafimFlix+ $VERSAO instalado!"

# ---------- 7. Último passo ----------
passo "Último passo (só desta vez)"
cat <<TXT
  O SerafimFlix+ precisa que a TV aponte para ela mesma:
  1. Na TV, abra de novo o Developer mode (Apps → 1 2 3 4 5).
  2. Troque o ${NEG}Host PC IP${FIM} para ${LAV}${NEG}127.0.0.1${FIM}
  3. Reinicie segurando o botão de ligar até aparecer o logo da Samsung.
  Depois é só abrir o ${NEG}SerafimFlix+${FIM} na lista de apps. 🍿
TXT
"$SDB" disconnect "$TV_IP" >/dev/null 2>&1
info "Vou ficar de olho até você trocar o IP na TV…"
for _ in $(seq 1 120); do
  [ "$(campo_tv developerIP)" = "127.0.0.1" ] && { ok "Host PC IP = 127.0.0.1. Agora é só reiniciar a TV segurando o botão."; break; }
  sleep 5
done
printf "\n${VERDE}${NEG}  Pronto!${FIM}\n"
sair 0
