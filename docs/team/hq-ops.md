# HQ 운영

## 깨어났을 때 (새 대화·요약 직후 포함)
`board/state/HQ.md` 읽기 → `scripts/board.sh check`로 열린 카드 보기 → `board/decisions-inbox.md` 확인 → `sent`인데 보고 없는 팀만 다시 지시.

## 보고를 받았을 때
1. 보고에 적힌 PR·커밋을 확인한다. 기다리는 보고를 한 묶음으로 처리한다.
2. 묶음을 main에 squash merge → 배포(엔트리를 main 커밋 sha로) → catalog 확인. 문서만 바뀐 묶음은 배포 안 함.
3. 검사 실패 시 원인 커밋을 찾아 빼고, 그 팀에 수정 카드(fix-sent).
4. decisions-inbox → DECISIONS.md로 옮기고 카드에 `summary:`를 단다.
5. 그 팀이 25만 토큰을 넘었으면 STATE가 합쳐진 것을 확인하고 세션을 새로 연다: 옛 세션 보관(archive) → 같은 이름·태그·권한으로 새 세션 → 첫 메시지 "CLAUDE.md, docs/team/rules.md, board/state/<이름>.md 읽고 HQ를 기다려" → rules.md 세션 표 id 갱신.
6. 다음 카드를 보낸다 (카드 경로 + `[지시]` 메시지 하나).

## 사용자
- 사용자 말은 `board/decisions-inbox.md`에 그대로 적는다. 넓히지도 좁히지도 않는다.
- 묻기 전에 DECISIONS·inbox·git log를 본다. 상시 지시는 "알아서 해, 묻지 마" (D3). 세부는 HQ가 정하고 다음 보고에 한 줄씩 목록으로 보인다.

## 클라우드에서 안 쓰는 것
Waker, 우편함, clear_session, worktree: 세션마다 컨테이너가 따로라 공유는 git(main)과 send_message로만 한다.
