#!/usr/bin/env python3
"""대화 기록이 25만 토큰을 넘으면 STATE 저장·비우기 순서를 알린다 (5만 토큰마다 한 번)."""
import json, os, sys

LIMIT, STEP = 250_000, 50_000
try:
    ev = json.load(sys.stdin)
    used = 0
    with open(ev["transcript_path"], "rb") as fh:
        fh.seek(0, 2)
        fh.seek(max(0, fh.tell() - 2_000_000))
        for line in fh.read().splitlines():
            try:
                u = json.loads(line).get("message", {}).get("usage")
            except Exception:
                continue
            if isinstance(u, dict):
                used = u.get("input_tokens", 0) + u.get("cache_read_input_tokens", 0) + u.get("cache_creation_input_tokens", 0)
    if used < LIMIT:
        sys.exit(0)
    mark = f"/tmp/ctx-warn-{ev.get('session_id', 'x')}"
    last = int(open(mark).read()) if os.path.exists(mark) else 0
    if used - last < STEP:
        sys.exit(0)
    open(mark, "w").write(str(used))
    msg = (f"대화 기록 약 {used // 1000}k 토큰 (기준 250k). 다음 안전한 지점에서 docs/team/rules.md "
           "'팀이 작업 하나를 하는 순서' 4~5를 하고 HQ에 [보고] 비우기 준비됨을 보낸다. HQ면 hq-ops.md를 따른다.")
    print(json.dumps({"hookSpecificOutput": {"hookEventName": ev.get("hook_event_name", "UserPromptSubmit"), "additionalContext": msg}}, ensure_ascii=False))
except Exception:
    sys.exit(0)
