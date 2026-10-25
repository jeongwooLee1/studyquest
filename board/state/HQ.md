# HQ STATE (2026-10-25)

NOW
- 팀 운영 매뉴얼 적용 (D10): CLAUDE.md, docs/team/*, board/, .claude/agents·hooks.
- T-9~12 합침(#63~66). 팀장 4명 세션 새로 엶 (10/25), 옛 세션 보관. 새 id는 docs/team/rules.md.
- 열린 카드 T-1~8은 모두 아이들 응시 대기(blocked).
- T-13 연습장 사진 피드백 배포(#68, lt-api v36, 버킷 lt-work, 표 lt_work). 실사진 시험 통과. 아이 이름 부르기 수정(#69).

배포
- lt-api 엔트리 = GitHub raw import(main 커밋 sha), verify_jwt false. 확인: net.http_post로 catalog → net._http_response.
- 마지막 배포는 아래 NOW 참고. 문제지 56종.
- 컨테이너는 Supabase·학교 사이트에 직접 못 감 → Supabase MCP 사용.

아이 기록 (10/24)
- 다희 h-word 8/10 → 다시풀기 4/4, h-dec 10/10. 다혜 u-addf 8/10 → 4/4. 찍기 없음.
- 10/24 06:30 UTC 이후 새 기록 없음.

다음에 먼저 읽을 곳
- docs/team/hq-ops.md
- supabase/functions/lt-api/coach.ts (PLAN, LECTURES)
- leveltest/hub.html (STUDENTS, *_EXTRA)
- supabase/functions/lt-api/index.ts (TESTS, VARIANTS, twinOf)
