# 레벨테스트 (study.blissme.ai/leveltest)

아이가 링크로 시험을 보고 → 서버가 채점·기록 → 텔레그램으로 결과 알림.

| 주소 | 용도 |
|---|---|
| `/leveltest/?n=이름` | 아이 응시 화면 (이름이 들어간 링크라 바로 시작) |
| `/leveltest/report.html?r=…` | 한 번의 응시 상세 리포트 (텔레그램 「상세 리포트 보기」 버튼) |
| `/leveltest/report.html` | 전체 기록 (학부모 키 필요: `app_secrets.LT_PARENT_KEY`) |

## 구성
- 페이지: `index.html`(응시), `report.html`(리포트·전체 기록), `lt-common.js`, `lt.css` — GitHub Pages
- 서버: Supabase Edge Function `lt-api` (`supabase/functions/lt-api`)
  - 문제·정답·오답 습관: `tests/*.ts` — **정답은 서버에만 있고** 페이지에는 응시 시작 후 정답을 뺀 문제만 내려감
  - 채점: `grade.ts` (분수·소수·대분수 값 비교, 영역별 통과/보완/집중, 학습 순서, 오답 습관)
- 기록: `public.lt_attempts` (RLS 켜고 정책 없음 — `lt-api` 만 접근)
- 알림: StudyQuest 텔레그램 봇 → `app_secrets.LT_TG_CHAT_ID` (없으면 `TELEGRAM_OWNER_CHAT_ID`)

## 시간 제한
- 시작 시각·마감은 서버가 정함. 새로고침·재접속해도 타이머는 계속 감.
- 0초가 되면 자동 제출. 창을 닫아 버려도 마감 2분 뒤 마지막 저장 답안으로 자동 채점·알림.

## 새 시험 추가 (영어·과학·국어 등)
1. `supabase/functions/lt-api/tests/` 에 `math_m1.ts` 형식으로 파일 추가
2. `index.ts` 의 `TESTS` 에 등록 후 `lt-api` 재배포
3. 링크: `/leveltest/?test=<id>&n=이름`
