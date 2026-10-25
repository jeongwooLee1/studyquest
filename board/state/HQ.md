# HQ STATE (2026-10-25)

NOW
- 팀 운영 매뉴얼 적용 완료(D10). 팀장 4명 새 세션(10/25).
- T-13 연습장 사진 피드백 배포(lt-work 버킷, lt_work 표). 실사진 시험 통과.
- 찍기 경고 문항별 기준 fastSec(T-14~18) 배포. 경고 알림에 처음 고른 답 정답 여부.
- 배포: lt-api는 main c2f0b80 기준(v40). 문제지 60종.
- 열린 카드 T-1~8 모두 응시 대기. 테스트 기록 '테스트HQ' 삭제는 사용자 승인 대기.

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
