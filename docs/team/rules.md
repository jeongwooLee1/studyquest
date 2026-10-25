# 팀 규칙 (모든 세션)

## 세션 표
| 이름 | id | 하는 일 | 쓰는 경로 |
|---|---|---|---|
| HQ | session_01V4mFvCHvv11eQHudQ4JKm4 | 계획, 작업 카드, 사용자 결정, main 합치기, 배포, 사용자 보고 | 전체 (보통 board/, docs/plan, docs/team, index.ts, coach.ts, hub.html) |
| 국어팀장 | session_01RKHWsd53Q9rWpGtVTXAHYV | 국어 문제지·학습법 | tests/kor_*, docs/kor/, board/state/국어팀장.md |
| 영어팀장 | session_01G1gwuLpSusuJNgSTEeFScb | 영어 문제지·학습법 | tests/eng_*, docs/eng/, board/state/영어팀장.md |
| 수학팀장 | session_018QmzWZGjSAYUuTZuVT3VZo | 수학 문제지·유사문제 생성기 | tests/math_*·rec_*·geo_*·e4_*, twins.ts, docs/math/, hub.html·coach.ts의 다희 수학 줄, board/state/수학팀장.md |
| 과학팀장 | session_01BnVYtqHotEt6sTSAzMDyxk | 과학 문제지·학습법 | tests/sci_*, docs/science/, board/state/과학팀장.md |

tests/ = supabase/functions/lt-api/tests/. 세션을 새로 열면 HQ가 이 표의 id를 고친다.
표에 없는 경로는 쓰지 않는다. 필요하면 HQ에 `[협의]`로 요청한다.

## 금지
- 팀: main 합치기, 배포, DB 쓰기 금지 (DB는 읽기만).
- 모두: 테스트 끄기·건너뛰기, 남의 브랜치 기록 고쳐 쓰기, 권한·훅 우회 금지.

## 작업 카드
- `board/rows/T-<n>.md`. HQ가 만들고 담당 팀이 `state`를 바꾼다.
- 고칠 때는 `scripts/board.sh`만 쓴다: `new <owner> "<ko>"`, `state T-n <상태> [커밋]`, `log T-n "<덧붙임>"`, `check`.
- state: queued | sent | working | reported (<커밋>) | fix-sent | blocked | merged (<커밋>) | superseded | cancelled | done
- 계획이 바뀌면 새 카드에 "supersedes T-<n>"을 쓰고 옛 카드는 superseded.

## 메시지 (send_message)
- 첫 줄 = 말머리 + 한 줄 요약: `[지시] [보고] [질문] [협의] [리뷰요청] [결정요청]`
- 본문에는 내용 대신 경로를 적는다 (카드, 파일, 커밋).
- 보고·지시 하나에 메시지 하나. 상태를 묻는 메시지 금지. 쉬는 팀에는 보내지 않는다.
- 보고는 10줄 이하: 결과, 파일, PR·커밋, 결정할 것, 다음 할 일.
- 사용자 입력 한 번에 HQ가 보내는 메시지는 10개까지.

## 팀이 작업 하나를 하는 순서 (예외 없음)
1. HQ `[지시]`가 오면 → 적힌 카드를 읽는다 (`git fetch origin main` 후 origin/main 기준).
2. 최신 main에서 브랜치 `claude/<과목>-<작업>`을 만든다. 문제 작성·검산은 에이전트에게 맡긴다 (`.claude/agents/`).
3. 범위 검사를 돌린다 (바꾼 문제지의 정답·보기·유사문제 검사, `deno check` 등). 통과하면 커밋.
4. `board/state/<내 이름>.md`를 갱신해 같은 PR에 넣는다: 커밋, 다음 단계, 남은 일, 이유, 버린 시도, 다음에 먼저 읽을 곳 3~5개.
5. 카드 state를 `reported (<커밋>)`로 바꾸고 push → 초안 PR → HQ에 `[보고]` 하나.
6. 결정과 이유는 STATE만이 아니라 docs/<과목>/에도 적는다.

대화 기록이 25만 토큰을 넘으면 훅이 알려 준다. 다음 안전한 지점에서 위 4~5를 하고 HQ에 `[보고] 비우기 준비됨`을 보낸다. HQ가 세션을 새로 연다 (클라우드에는 스스로 비우기가 없다).

## 에이전트
- 정의는 `.claude/agents/*.md`. 모델·effort는 정의에 고정, 부를 때 바꾸지 않는다.
- 부를 때마다 적는다: 읽을 파일, 도구 호출 상한(기본 30), 보고 10줄 이하, 완료 기준. 에이전트 하나에 일 하나.
- 검산은 `checker`에게 맡기고 기대하는 결론은 알려 주지 않는다.
- 모든 지시에 "막히면 우회하지 말고 멈춰서 보고"를 넣는다.
