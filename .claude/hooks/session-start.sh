#!/usr/bin/env bash
# 세션 시작 시 자기 이름, STATE, 규칙 파일을 알려 준다.
root="$(cd "$(dirname "$0")/../.." && pwd)"
id="session_${CLAUDE_CODE_REMOTE_SESSION_ID#cse_}"
name=$(grep -F "$id" "$root/docs/team/rules.md" 2>/dev/null | head -1 | awk -F'|' '{gsub(/ /,"",$2); print $2}')
[ -n "$name" ] || exit 0
echo "너는 studyquest 팀의 '$name'이다 ($id)."
echo "먼저 읽을 것: CLAUDE.md, docs/team/rules.md, docs/plan/DECISIONS.md${name:+, board/state/$name.md}"
[ "$name" = HQ ] && echo "HQ는 docs/team/hq-ops.md도 읽는다."
f="$root/board/state/$name.md"
if [ -f "$f" ]; then echo "--- 내 STATE ($f) ---"; head -c 2048 "$f"; fi
