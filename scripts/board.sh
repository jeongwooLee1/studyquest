#!/usr/bin/env bash
# 작업 카드 도구. 사용: board.sh new <owner> "<ko>" | state T-n <상태> [커밋] | log T-n "<글>" | check
set -euo pipefail
cd "$(dirname "$0")/../board/rows"
today=$(date +%F)
STATES='queued|sent|working|reported|fix-sent|blocked|merged|superseded|cancelled|done'
case "${1:-}" in
  new)
    n=$(ls T-*.md 2>/dev/null | sed 's/T-\([0-9]*\).md/\1/' | sort -n | tail -1 || true); n=$(( ${n:-0} + 1 ))
    cat > "T-$n.md" <<CARD
owner: $2
ko: $3
state: queued
task:
acceptance:
rules: docs/team/rules.md 금지 항목
updated: $today
note:
summary:
CARD
    echo "T-$n" ;;
  state)
    f="$2.md"; [ -f "$f" ] || { echo "없는 카드: $2" >&2; exit 1; }
    [[ "$3" =~ ^($STATES)$ ]] || { echo "잘못된 상태: $3" >&2; exit 1; }
    v="$3${4:+ ($4)}"
    sed -i "s/^state: .*/state: $v/; s/^updated: .*/updated: $today/" "$f"
    echo "$2 → $v" ;;
  log)
    f="$2.md"; [ -f "$f" ] || { echo "없는 카드: $2" >&2; exit 1; }
    sed -i "/^summary:/i note+ $today $3" "$f"
    sed -i "s/^updated: .*/updated: $today/" "$f" ;;
  check)
    bad=0
    for f in $(ls T-*.md 2>/dev/null | sort -t- -k2 -n); do
      [ -e "$f" ] || continue
      for k in owner ko state task acceptance rules updated note summary; do
        grep -q "^$k:" "$f" || { echo "$f: '$k:' 없음"; bad=1; }
      done
      s=$(sed -n 's/^state: \([a-z-]*\).*/\1/p' "$f")
      [[ "$s" =~ ^($STATES)$ ]] || { echo "$f: 상태 '$s' 틀림"; bad=1; }
      case "$s" in merged|superseded|cancelled|done) ;; *)
        printf '%-6s %-10s %-12s %s\n' "${f%.md}" "$s" "$(sed -n 's/^owner: //p' "$f")" "$(sed -n 's/^ko: //p' "$f")";;
      esac
    done
    exit $bad ;;
  *) sed -n '2p' "$0"; exit 1 ;;
esac
