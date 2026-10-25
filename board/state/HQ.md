# HQ STATE (2026-10-25)

NOW
- 팀 운영 매뉴얼 적용 (D10): CLAUDE.md, docs/team/*, board/, .claude/agents·hooks.
- 팀장 4명에게 STATE 작성 카드(T-9~12) → 합친 뒤 세션 새로 열기 (대화 기록 22만~44만).
- 열린 카드 T-1~8은 모두 아이들 응시 대기(blocked).

배포
- lt-api 엔트리 = GitHub raw import(main 커밋 sha), verify_jwt false. 확인: net.http_post로 catalog → net._http_response.
- 마지막 배포 v35, sha 7d461e0, 문제지 56종.
- 컨테이너는 Supabase·학교 사이트에 직접 못 감 → Supabase MCP 사용.

아이 기록 (10/24)
- 다희 h-word 8/10 → 다시풀기 4/4, h-dec 10/10. 다혜 u-addf 8/10 → 4/4. 찍기 없음.
- 10/24 06:30 UTC 이후 새 기록 없음.

다음에 먼저 읽을 곳
- docs/team/hq-ops.md
- supabase/functions/lt-api/coach.ts (PLAN, LECTURES)
- leveltest/hub.html (STUDENTS, *_EXTRA)
- supabase/functions/lt-api/index.ts (TESTS, VARIANTS, twinOf)
